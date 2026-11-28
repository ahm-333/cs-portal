import crypto from "node:crypto";
import { eq, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import {
  enforceStudentDeviceGuard,
  extractDeviceInfo,
  setDeviceCookie,
} from "@/lib/auth/device";
import {
  getGoogleClientId,
  getGoogleClientSecret,
  GOOGLE_OAUTH_COOKIE_NAME,
  isGoogleAuthConfigured,
  resolveGoogleRedirectUri,
  sanitizeNextPath,
} from "@/lib/auth/google";
import { hashPassword } from "@/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { parseDepartment, parseYearLevel } from "@/lib/auth/sync";
import { getDb, isDatabaseConfigured, users } from "@/lib/db";
import {
  ensureAdminTables,
  getEffectiveSiteSettings,
} from "@/lib/db/ensure-tables";

export const dynamic = "force-dynamic";

interface GoogleOAuthCookieState {
  state: string;
  next: string;
  year: number;
  dept: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  error?: string;
}

interface GoogleUserInfo {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function redirectToLoginError(
  request: NextRequest,
  errorCode: string,
  nextPath = "/courses",
  reason?: string | null
): NextResponse {
  const url = new URL("/login", request.nextUrl.origin);
  url.searchParams.set("error", errorCode);
  url.searchParams.set("next", nextPath);
  if (reason?.trim()) {
    url.searchParams.set("reason", reason.trim().slice(0, 200));
  }
  const res = NextResponse.redirect(url);
  res.cookies.delete(GOOGLE_OAUTH_COOKIE_NAME);
  return res;
}

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured() || !isGoogleAuthConfigured()) {
    return redirectToLoginError(request, "google_not_configured");
  }

  const rawCookie = request.cookies.get(GOOGLE_OAUTH_COOKIE_NAME)?.value;
  if (!rawCookie) {
    return redirectToLoginError(request, "google_state_expired");
  }

  let parsedCookie: GoogleOAuthCookieState;
  try {
    parsedCookie = JSON.parse(
      Buffer.from(rawCookie, "base64url").toString("utf8")
    ) as GoogleOAuthCookieState;
  } catch {
    return redirectToLoginError(request, "google_state_invalid");
  }

  const nextPath = sanitizeNextPath(parsedCookie.next);
  const oauthError = request.nextUrl.searchParams.get("error");
  if (oauthError) {
    return redirectToLoginError(request, "google_cancelled", nextPath);
  }

  const returnedState = request.nextUrl.searchParams.get("state") ?? "";
  const code = request.nextUrl.searchParams.get("code") ?? "";

  const stateBufA = Buffer.from(returnedState);
  const stateBufB = Buffer.from(parsedCookie.state || "");
  const stateMatches =
    stateBufA.length > 0 &&
    stateBufA.length === stateBufB.length &&
    crypto.timingSafeEqual(stateBufA, stateBufB);

  if (!stateMatches || !code) {
    return redirectToLoginError(request, "google_state_mismatch", nextPath);
  }

  try {
    await ensureAdminTables();

    const redirectUri = resolveGoogleRedirectUri(request);
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: getGoogleClientId(),
        client_secret: getGoogleClientSecret(),
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error(
        "[Google OAuth] Token exchange failed:",
        tokenRes.status,
        await tokenRes.text()
      );
      return redirectToLoginError(request, "google_token_failed", nextPath);
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenData.access_token) {
      return redirectToLoginError(request, "google_token_failed", nextPath);
    }

    const profileRes = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    if (!profileRes.ok) {
      return redirectToLoginError(request, "google_profile_failed", nextPath);
    }

    const profile = (await profileRes.json()) as GoogleUserInfo;
    const googleSub = profile.sub?.trim() || "";
    const email = profile.email?.trim().toLowerCase() || "";
    const fullName =
      profile.name?.trim() || email.split("@")[0] || "طالب حاسبات";
    const avatarUrl = profile.picture?.trim() || null;

    if (!googleSub || !email || profile.email_verified !== true) {
      return redirectToLoginError(request, "google_unverified_email", nextPath);
    }

    const db = getDb();
    const now = new Date();

    const existingRows = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        googleId: users.googleId,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        role: users.role,
        isSuspended: users.isSuspended,
        suspendReason: users.suspendReason,
      })
      .from(users)
      .where(or(eq(users.googleId, googleSub), eq(users.email, email)))
      .limit(1);

    let userId: string;
    let userFullName = fullName.slice(0, 120);
    let userRole: "student" | "admin" = "student";
    let hasPhone = false;

    if (existingRows.length > 0) {
      const existing = existingRows[0];
      if (existing.googleId && existing.googleId !== googleSub) {
        return redirectToLoginError(request, "google_account_conflict", nextPath);
      }

      if (existing.isSuspended) {
        if (request.headers.get("accept")?.includes("application/json")) {
          return NextResponse.json(
            {
              ok: false,
              code: "ACCOUNT_SUSPENDED",
              suspendReason: existing.suspendReason ?? null,
              error: existing.suspendReason
                ? `تم تعليق هذا الحساب: ${existing.suspendReason}`
                : "تم تعليق هذا الحساب مؤقتاً. تواصل مع م. أحمد للمساعدة.",
            },
            { status: 403 }
          );
        }
        return redirectToLoginError(
          request,
          "account_suspended",
          nextPath,
          existing.suspendReason
        );
      }

      userId = existing.id;
      userFullName = existing.fullName;
      userRole = existing.role === "admin" ? "admin" : "student";
      hasPhone = Boolean(existing.phone?.trim());

      await db
        .update(users)
        .set({
          googleId: existing.googleId ?? googleSub,
          avatarUrl: avatarUrl ?? existing.avatarUrl,
          lastActiveAt: now,
          updatedAt: now,
        })
        .where(eq(users.id, existing.id));
    } else {
      const settings = await getEffectiveSiteSettings();
      if (!settings.registrationOpen) {
        return redirectToLoginError(request, "registration_closed", nextPath);
      }

      const yearLevel = parseYearLevel(parsedCookie.year, 2) ?? 2;
      const department = parseDepartment(parsedCookie.dept, "CS") ?? "CS";
      // Generate unguessable random password hash for Google-created accounts
      const randomSecret = crypto.randomBytes(32).toString("hex");
      const passwordHash = hashPassword(randomSecret);

      const [created] = await db
        .insert(users)
        .values({
          email,
          googleId: googleSub,
          avatarUrl,
          passwordHash,
          fullName: userFullName,
          yearLevel,
          department,
          role: "student",
          createdAt: now,
          updatedAt: now,
          lastActiveAt: now,
        })
        .returning({ id: users.id });

      userId = created.id;
      hasPhone = false;
    }

    const device = extractDeviceInfo(request);
    const guard = await enforceStudentDeviceGuard({
      userId,
      fullName: userFullName,
      role: userRole,
      device,
    });

    if (!guard.allowed) {
      const errRes = redirectToLoginError(
        request,
        guard.code === "DEVICE_BLOCKED"
          ? "device_blocked"
          : "device_limit_reached",
        nextPath,
        guard.error
      );
      setDeviceCookie(errRes, device.deviceId);
      return errRes;
    }

    const { token, expiresAt } = await createSession(
      userId,
      request.headers.get("user-agent"),
      {
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        ipAddress: device.ipAddress,
        enforceSingleSession: guard.enforceSingleSession,
      }
    );

    // If first-time Google user hasn't provided a phone number yet, prompt to complete profile once
    const destination = hasPhone
      ? new URL(nextPath, request.nextUrl.origin)
      : (() => {
          const url = new URL("/login", request.nextUrl.origin);
          url.searchParams.set("complete", "1");
          url.searchParams.set("next", nextPath);
          return url;
        })();

    const response = NextResponse.redirect(destination);
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });
    setDeviceCookie(response, device.deviceId);
    response.cookies.set(GOOGLE_OAUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    console.error("[Google OAuth callback] Unexpected error:", error);
    return redirectToLoginError(request, "google_callback_error", nextPath);
  }
}
