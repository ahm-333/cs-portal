import crypto from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { NextRequest, NextResponse } from "next/server";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import {
  ensureAdminTables,
  getEffectiveSiteSettings,
} from "@/lib/db/ensure-tables";
import { adminNotifications, userDevices } from "@/lib/db/schema";

export const DEVICE_COOKIE_NAME = "cs_portal_device_id";
const DEVICE_COOKIE_TTL_SECONDS = 365 * 24 * 60 * 60; // 1 year
const VALID_DEVICE_ID_RE = /^[a-zA-Z0-9_-]{8,128}$/;

export interface ParsedDeviceInfo {
  deviceId: string;
  isNewCookie: boolean;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  userAgent: string;
}

export type DeviceGuardResult =
  | {
      allowed: true;
      enforceSingleSession: boolean;
      device: ParsedDeviceInfo;
    }
  | {
      allowed: false;
      code: "DEVICE_LIMIT_REACHED" | "DEVICE_BLOCKED";
      error: string;
      device: ParsedDeviceInfo;
    };

function stripHeaderQuotes(value: string | null | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']+|["']+$/g, "").trim();
}

export function extractClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);

  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp.slice(0, 64);

  return "unknown";
}

function detectBrowser(ua: string, secChUa: string): string {
  const combined = `${secChUa} ${ua}`;
  if (/EdgA?\/|Microsoft Edge/i.test(combined)) return "Edge";
  if (/OPR\/|Opera/i.test(combined)) return "Opera";
  if (/SamsungBrowser\//i.test(combined)) return "Samsung Internet";
  if (/Brave/i.test(secChUa)) return "Brave";
  if (/FxiOS\/|Firefox\//i.test(ua)) return "Firefox";
  if (/CriOS\/|Chrome\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && !/Chrome\/|CriOS\/|Chromium\//i.test(ua)) {
    return "Safari";
  }
  if (/MSIE|Trident\//i.test(ua)) return "IE";
  return "Browser";
}

function prettifyAndroidModel(rawModel: string): string {
  const cleaned = rawModel
    .replace(/\bBuild\/.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || /^K$/i.test(cleaned)) {
    return "";
  }

  // Friendly Samsung Galaxy mappings for common Egyptian student models
  if (/^SM-A54/i.test(cleaned)) return "Samsung Galaxy A54";
  if (/^SM-A55/i.test(cleaned)) return "Samsung Galaxy A55";
  if (/^SM-A53/i.test(cleaned)) return "Samsung Galaxy A53";
  if (/^SM-A52/i.test(cleaned)) return "Samsung Galaxy A52";
  if (/^SM-A34/i.test(cleaned)) return "Samsung Galaxy A34";
  if (/^SM-A35/i.test(cleaned)) return "Samsung Galaxy A35";
  if (/^SM-A24/i.test(cleaned)) return "Samsung Galaxy A24";
  if (/^SM-A15/i.test(cleaned)) return "Samsung Galaxy A15";
  if (/^SM-A14/i.test(cleaned)) return "Samsung Galaxy A14";
  if (/^SM-S92/i.test(cleaned)) return "Samsung Galaxy S24";
  if (/^SM-S91/i.test(cleaned)) return "Samsung Galaxy S23";
  if (/^SM-S90/i.test(cleaned)) return "Samsung Galaxy S22";
  if (/^SM-G99/i.test(cleaned)) return "Samsung Galaxy S21";
  if (/^SM-T|^SM-X/i.test(cleaned)) return `Samsung Galaxy Tab (${cleaned})`;
  if (/^SM-/i.test(cleaned)) return `Samsung Galaxy (${cleaned})`;

  if (/^Pixel\s/i.test(cleaned)) return `Google ${cleaned}`;
  if (/^(Redmi|POCO|Mi\s|Xiaomi)/i.test(cleaned)) return cleaned;
  if (/^(CPH|OPPO)/i.test(cleaned)) return `OPPO ${cleaned.replace(/^OPPO\s*/i, "")}`;
  if (/^(RMX|Realme)/i.test(cleaned)) return `Realme ${cleaned.replace(/^Realme\s*/i, "")}`;
  if (/^(Infinix|TECNO|Nokia|Huawei|HONOR|vivo|OnePlus|Nothing)/i.test(cleaned)) {
    return cleaned;
  }

  return cleaned.slice(0, 48);
}

function detectOsAndModel(
  ua: string,
  secPlatform: string,
  secPlatformVersion: string,
  secModel: string
): { os: string; label: string } {
  // iOS devices
  if (/iPhone/i.test(ua)) {
    return { os: "iOS", label: "iPhone" };
  }
  if (/iPad/i.test(ua)) {
    return { os: "iPadOS", label: "iPad" };
  }

  // Android devices
  if (/Android/i.test(ua) || /^Android$/i.test(secPlatform)) {
    let model = prettifyAndroidModel(secModel);
    if (!model) {
      const match = ua.match(/Android\s[\d.]+;\s*([^;)]+?)(?:\s+Build\/|\))/i);
      if (match?.[1]) {
        const candidate = match[1].trim();
        if (candidate && !/^(Mobile|wv|Linux|U)$/i.test(candidate)) {
          model = prettifyAndroidModel(candidate);
        }
      }
    }
    return {
      os: "Android",
      label: model || "Android",
    };
  }

  // Windows
  if (/Windows/i.test(secPlatform) || /Windows NT/i.test(ua)) {
    const majorVer = Number.parseInt(secPlatformVersion.split(".")[0] ?? "", 10);
    if (Number.isFinite(majorVer) && majorVer >= 13) {
      return { os: "Windows 11", label: "Windows 11" };
    }
    if (/Windows NT 10\.0/i.test(ua)) {
      return {
        os: Number.isFinite(majorVer) && majorVer > 0 && majorVer < 13 ? "Windows 10" : "Windows 11",
        label: Number.isFinite(majorVer) && majorVer > 0 && majorVer < 13 ? "Windows 10" : "Windows 11",
      };
    }
    if (/Windows NT 6\.3/i.test(ua)) return { os: "Windows 8.1", label: "Windows 8.1" };
    if (/Windows NT 6\.1/i.test(ua)) return { os: "Windows 7", label: "Windows 7" };
    return { os: "Windows", label: "Windows" };
  }

  // macOS
  if (/macOS/i.test(secPlatform) || /Macintosh|Mac OS X/i.test(ua)) {
    return { os: "macOS", label: "macOS" };
  }

  // ChromeOS
  if (/CrOS/i.test(ua) || /Chrome OS/i.test(secPlatform)) {
    return { os: "ChromeOS", label: "Chromebook" };
  }

  // Linux
  if (/Linux/i.test(secPlatform) || /Linux/i.test(ua)) {
    return { os: "Linux", label: "Linux" };
  }

  return { os: "Unknown OS", label: "جهاز غير معروف" };
}

/**
 * Extracts a stable device identifier (from cookie or newly generated)
 * and a clean human-readable device name from Request headers.
 */
export function extractDeviceInfo(request: NextRequest): ParsedDeviceInfo {
  const ua = (request.headers.get("user-agent") ?? "").slice(0, 512);
  const secModel = stripHeaderQuotes(request.headers.get("sec-ch-ua-model"));
  const secPlatform = stripHeaderQuotes(request.headers.get("sec-ch-ua-platform"));
  const secPlatformVersion = stripHeaderQuotes(
    request.headers.get("sec-ch-ua-platform-version")
  );
  const secChUa = request.headers.get("sec-ch-ua") ?? "";
  const ipAddress = extractClientIp(request);

  const browser = detectBrowser(ua, secChUa);
  const { os, label } = detectOsAndModel(
    ua,
    secPlatform,
    secPlatformVersion,
    secModel
  );

  const deviceName = `${label} · ${browser}`;

  const existingCookie = request.cookies.get(DEVICE_COOKIE_NAME)?.value?.trim();
  if (existingCookie && VALID_DEVICE_ID_RE.test(existingCookie)) {
    return {
      deviceId: existingCookie,
      isNewCookie: false,
      deviceName,
      browser,
      os,
      ipAddress,
      userAgent: ua,
    };
  }

  const generatedId = `dev_${crypto.randomBytes(16).toString("hex")}`;
  return {
    deviceId: generatedId,
    isNewCookie: true,
    deviceName,
    browser,
    os,
    ipAddress,
    userAgent: ua,
  };
}

/**
 * Persists the stable device cookie onto a NextResponse.
 */
export function setDeviceCookie(response: NextResponse, deviceId: string): void {
  response.cookies.set(DEVICE_COOKIE_NAME, deviceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEVICE_COOKIE_TTL_SECONDS,
  });
}

/**
 * Enforces anti-sharing device limits for student logins and records device telemetry.
 * - Admins are recorded for visibility but NEVER blocked or evicted.
 * - Students are checked against `site_settings.maxDevicesPerUser` (default 2).
 * - Blocked or excess device login attempts create a `security` / `critical` admin notification.
 */
export async function enforceStudentDeviceGuard(params: {
  userId: string;
  fullName: string;
  role: "student" | "admin";
  device: ParsedDeviceInfo;
}): Promise<DeviceGuardResult> {
  const { userId, fullName, role, device } = params;

  if (!isDatabaseConfigured()) {
    return {
      allowed: true,
      enforceSingleSession: false,
      device,
    };
  }

  await ensureAdminTables();
  const db = getDb();
  const now = new Date();
  const settings = await getEffectiveSiteSettings();

  // Admins bypass device-limit blocking & single-session eviction
  if (role === "admin") {
    await db
      .insert(userDevices)
      .values({
        userId,
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        browser: device.browser,
        os: device.os,
        ipAddress: device.ipAddress,
        firstSeenAt: now,
        lastSeenAt: now,
        isBlocked: false,
      })
      .onConflictDoUpdate({
        target: [userDevices.userId, userDevices.deviceId],
        set: {
          deviceName: device.deviceName,
          browser: device.browser,
          os: device.os,
          ipAddress: device.ipAddress,
          lastSeenAt: now,
        },
      })
      .catch(() => {});

    return {
      allowed: true,
      enforceSingleSession: false,
      device,
    };
  }

  const existingDevices = await db
    .select()
    .from(userDevices)
    .where(eq(userDevices.userId, userId));

  const matchedDevice = existingDevices.find(
    (d) => d.deviceId === device.deviceId
  );

  if (matchedDevice) {
    if (matchedDevice.isBlocked) {
      await db
        .insert(adminNotifications)
        .values({
          type: "security",
          severity: "critical",
          title: `محاولة دخول من جهاز محظور — ${fullName}`,
          body: `حاول الطالب الدخول من جهاز محظور (${device.deviceName} · IP: ${device.ipAddress}).`,
          userId,
          metaJson: JSON.stringify({
            attemptedDeviceId: device.deviceId,
            attemptedDeviceName: device.deviceName,
            ipAddress: device.ipAddress,
            reason: "blocked_device",
          }),
          isRead: false,
          createdAt: now,
        })
        .catch(() => {});

      return {
        allowed: false,
        code: "DEVICE_BLOCKED",
        error:
          "تم الوصول للحد الأقصى للأجهزة المسموحة لهذا الحساب أو تم حظر هذا الجهاز. تواصل مع م. أحمد لإعادة ضبط الأجهزة.",
        device,
      };
    }

    await db
      .update(userDevices)
      .set({
        deviceName: device.deviceName,
        browser: device.browser,
        os: device.os,
        ipAddress: device.ipAddress,
        lastSeenAt: now,
      })
      .where(
        and(
          eq(userDevices.userId, userId),
          eq(userDevices.deviceId, device.deviceId)
        )
      );

    return {
      allowed: true,
      enforceSingleSession: settings.enforceSingleSession,
      device,
    };
  }

  // New device for this student — check maxDevicesPerUser
  const activeDevices = existingDevices.filter((d) => !d.isBlocked);
  const maxDevices = Math.max(1, settings.maxDevicesPerUser);

  if (activeDevices.length >= maxDevices) {
    const existingNames = activeDevices.map((d) => d.deviceName).join("، ");
    await db
      .insert(adminNotifications)
      .values({
        type: "security",
        severity: "critical",
        title: `محاولة فتح جهاز إضافي — ${fullName}`,
        body: `حاول الطالب الدخول من جهاز جديد (${device.deviceName} · IP: ${device.ipAddress}) بينما لديه بالفعل ${activeDevices.length} أجهزة مسجلة: ${existingNames}.`,
        userId,
        metaJson: JSON.stringify({
          attemptedDeviceId: device.deviceId,
          attemptedDeviceName: device.deviceName,
          ipAddress: device.ipAddress,
          existingDevices: activeDevices.map((d) => d.deviceName),
          maxDevicesPerUser: maxDevices,
        }),
        isRead: false,
        createdAt: now,
      })
      .catch(() => {});

    return {
      allowed: false,
      code: "DEVICE_LIMIT_REACHED",
      error:
        "تم الوصول للحد الأقصى للأجهزة المسموحة لهذا الحساب. تواصل مع م. أحمد لإعادة ضبط الأجهزة.",
      device,
    };
  }

  // Register the new device
  await db
    .insert(userDevices)
    .values({
      userId,
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      browser: device.browser,
      os: device.os,
      ipAddress: device.ipAddress,
      firstSeenAt: now,
      lastSeenAt: now,
      isBlocked: false,
    })
    .onConflictDoUpdate({
      target: [userDevices.userId, userDevices.deviceId],
      set: {
        deviceName: device.deviceName,
        browser: device.browser,
        os: device.os,
        ipAddress: device.ipAddress,
        lastSeenAt: now,
      },
    });

  return {
    allowed: true,
    enforceSingleSession: settings.enforceSingleSession,
    device,
  };
}
