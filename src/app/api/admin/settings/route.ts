import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, siteSettings } from "@/lib/db";
import {
  ensureAdminTables,
  getEffectiveSiteSettings,
  invalidateSiteSettingsCache,
} from "@/lib/db/ensure-tables";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
const VALID_AUDIENCES = new Set(["all", "1", "2", "3", "4"]);

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بالوصول إلى إعدادات النظام." },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const settings = await getEffectiveSiteSettings({ bypassCache: true });
    return NextResponse.json(settings, {
      status: 200,
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    console.error("[GET /api/admin/settings] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل إعدادات النظام." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بتحديث إعدادات النظام." },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const current = await getEffectiveSiteSettings({ bypassCache: true });
    const record = body as Record<string, unknown>;

    let maxDevicesPerUser = current.maxDevicesPerUser;
    if (record.maxDevicesPerUser !== undefined) {
      const parsed = Number(record.maxDevicesPerUser);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
        return NextResponse.json(
          { error: "الحد الأقصى للأجهزة يجب أن يكون رقماً بين 1 و 10." },
          { status: 400, headers: NO_STORE_HEADERS }
        );
      }
      maxDevicesPerUser = parsed;
    }

    const enforceSingleSession =
      typeof record.enforceSingleSession === "boolean"
        ? record.enforceSingleSession
        : current.enforceSingleSession;

    let aiDailyLimit = current.aiDailyLimit;
    if (record.aiDailyLimit !== undefined) {
      const parsed = Number(record.aiDailyLimit);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 500) {
        return NextResponse.json(
          { error: "الحد اليومي للمساعد الذكي يجب أن يكون بين 1 و 500." },
          { status: 400, headers: NO_STORE_HEADERS }
        );
      }
      aiDailyLimit = parsed;
    }

    const registrationOpen =
      typeof record.registrationOpen === "boolean"
        ? record.registrationOpen
        : current.registrationOpen;

    const announcementEnabled =
      typeof record.announcementEnabled === "boolean"
        ? record.announcementEnabled
        : current.announcementEnabled;

    const announcementText =
      typeof record.announcementText === "string"
        ? record.announcementText.trim().slice(0, 600)
        : current.announcementText;

    let announcementAudience = current.announcementAudience;
    if (typeof record.announcementAudience === "string") {
      const cleanAudience = record.announcementAudience.trim().toLowerCase();
      if (VALID_AUDIENCES.has(cleanAudience)) {
        announcementAudience = cleanAudience;
      }
    }

    const vodafoneCashNumber =
      typeof record.vodafoneCashNumber === "string"
        ? record.vodafoneCashNumber.trim().slice(0, 40) || current.vodafoneCashNumber
        : current.vodafoneCashNumber;

    const instaPayHandle =
      typeof record.instaPayHandle === "string"
        ? record.instaPayHandle.trim().slice(0, 100) || current.instaPayHandle
        : current.instaPayHandle;

    const db = getDb();
    const now = new Date();

    const [saved] = await db
      .insert(siteSettings)
      .values({
        id: "default",
        maxDevicesPerUser,
        enforceSingleSession,
        aiDailyLimit,
        registrationOpen,
        announcementEnabled,
        announcementText,
        announcementAudience,
        vodafoneCashNumber,
        instaPayHandle,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [siteSettings.id],
        set: {
          maxDevicesPerUser,
          enforceSingleSession,
          aiDailyLimit,
          registrationOpen,
          announcementEnabled,
          announcementText,
          announcementAudience,
          vodafoneCashNumber,
          instaPayHandle,
          updatedAt: now,
        },
      })
      .returning();

    invalidateSiteSettingsCache();

    return NextResponse.json(
      {
        ok: true,
        id: saved.id,
        maxDevicesPerUser: saved.maxDevicesPerUser,
        enforceSingleSession: saved.enforceSingleSession,
        aiDailyLimit: saved.aiDailyLimit,
        registrationOpen: saved.registrationOpen,
        announcementEnabled: saved.announcementEnabled,
        announcementText: saved.announcementText,
        announcementAudience: saved.announcementAudience,
        vodafoneCashNumber: saved.vodafoneCashNumber,
        instaPayHandle: saved.instaPayHandle,
        updatedAt: saved.updatedAt.toISOString(),
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[PUT /api/admin/settings] Error:", error);
    return NextResponse.json(
      { error: "تعذر حفظ إعدادات النظام." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
