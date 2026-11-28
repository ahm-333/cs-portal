import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import {
  enforceStudentDeviceGuard,
  extractDeviceInfo,
  setDeviceCookie,
} from "@/lib/auth/device";
import { verifyPassword } from "@/lib/auth/password";
import {
  looksLikePhoneIdentifier,
  normalizePhoneNumber,
} from "@/lib/auth/phone";
import {
  createSession,
  SESSION_COOKIE_NAME,
  type SessionDepartment,
  type SessionUser,
} from "@/lib/auth/session";
import {
  DB_NOT_CONFIGURED_MESSAGE,
  mergeLocalStateIntoCloud,
  parseDepartment,
} from "@/lib/auth/sync";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";
import { users } from "@/lib/db/schema";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        code: "DB_NOT_CONFIGURED",
        error: DB_NOT_CONFIGURED_MESSAGE,
      },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "تنسيق البيانات المرسلة غير صالح." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "يرجى إدخال البريد الإلكتروني أو رقم الموبايل وكلمة المرور." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const record = body as Record<string, unknown>;
  const rawIdentifier =
    typeof record.identifier === "string"
      ? record.identifier.trim()
      : typeof record.email === "string"
        ? record.email.trim()
        : "";
  const rawPassword = typeof record.password === "string" ? record.password : "";

  if (!rawIdentifier || !rawPassword) {
    return NextResponse.json(
      { ok: false, error: "يرجى إدخال البريد الإلكتروني أو رقم الموبايل وكلمة المرور." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const db = getDb();

  try {
    await ensureAdminTables();

    const isPhone = looksLikePhoneIdentifier(rawIdentifier);
    const normalizedPhone = isPhone ? normalizePhoneNumber(rawIdentifier) : null;
    const normalizedEmail = rawIdentifier.toLowerCase();

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        googleId: users.googleId,
        avatarUrl: users.avatarUrl,
        passwordHash: users.passwordHash,
        fullName: users.fullName,
        yearLevel: users.yearLevel,
        department: users.department,
        role: users.role,
        examDate: users.examDate,
        isSuspended: users.isSuspended,
        suspendReason: users.suspendReason,
      })
      .from(users)
      .where(
        normalizedPhone
          ? eq(users.phone, normalizedPhone)
          : eq(users.email, normalizedEmail)
      )
      .limit(1);

    const userRow = rows[0];
    if (!userRow || !verifyPassword(rawPassword, userRow.passwordHash)) {
      return NextResponse.json(
        {
          ok: false,
          code: "INVALID_CREDENTIALS",
          error: "البريد الإلكتروني / رقم الموبايل أو كلمة المرور غير صحيحة.",
        },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    if (userRow.isSuspended) {
      const reason = userRow.suspendReason?.trim() || null;
      return NextResponse.json(
        {
          ok: false,
          code: "ACCOUNT_SUSPENDED",
          suspendReason: reason,
          error: reason
            ? `تم تعليق هذا الحساب: ${reason}`
            : "تم تعليق هذا الحساب مؤقتاً. تواصل مع م. أحمد للمساعدة.",
        },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    const device = extractDeviceInfo(request);
    const role: "student" | "admin" =
      userRow.role === "admin" ? "admin" : "student";

    const guard = await enforceStudentDeviceGuard({
      userId: userRow.id,
      fullName: userRow.fullName,
      role,
      device,
    });

    if (!guard.allowed) {
      const blockedResponse = NextResponse.json(
        {
          ok: false,
          code: guard.code,
          error: guard.error,
        },
        { status: 403, headers: NO_STORE_HEADERS }
      );
      setDeviceCookie(blockedResponse, device.deviceId);
      return blockedResponse;
    }

    const now = new Date();
    await db
      .update(users)
      .set({ lastActiveAt: now })
      .where(eq(users.id, userRow.id));

    if (record.localState !== undefined) {
      await mergeLocalStateIntoCloud(userRow.id, record.localState, {
        mode: "merge",
        updateProfile: false,
        overwriteExamDate: false,
      });
    }

    const { token, expiresAt } = await createSession(
      userRow.id,
      request.headers.get("user-agent"),
      {
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        ipAddress: device.ipAddress,
        enforceSingleSession: guard.enforceSingleSession,
      }
    );

    let finalExamDate = userRow.examDate ?? null;
    if (!finalExamDate && record.localState !== undefined) {
      const refreshed = await db
        .select({ examDate: users.examDate })
        .from(users)
        .where(eq(users.id, userRow.id))
        .limit(1);
      finalExamDate = refreshed[0]?.examDate ?? null;
    }

    const sessionUser: SessionUser = {
      id: userRow.id,
      email: userRow.email,
      phone: userRow.phone ?? null,
      avatarUrl: userRow.avatarUrl ?? null,
      googleLinked: Boolean(userRow.googleId),
      fullName: userRow.fullName,
      yearLevel: userRow.yearLevel,
      department: (parseDepartment(userRow.department, "CS") ??
        "CS") as SessionDepartment,
      role,
      examDate: finalExamDate,
    };

    const response = NextResponse.json(
      { ok: true, user: sessionUser },
      { status: 200, headers: NO_STORE_HEADERS }
    );
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });
    setDeviceCookie(response, device.deviceId);
    return response;
  } catch (error) {
    console.error("[auth/login] Failed to sign in:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "تعذّر تسجيل الدخول الآن — حاول مرة أخرى بعد قليل.",
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
