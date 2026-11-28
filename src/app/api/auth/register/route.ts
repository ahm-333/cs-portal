import { eq, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import {
  enforceStudentDeviceGuard,
  extractDeviceInfo,
  setDeviceCookie,
} from "@/lib/auth/device";
import { hashPassword } from "@/lib/auth/password";
import { normalizePhoneNumber } from "@/lib/auth/phone";
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
  parseYearLevel,
  sanitizeExamDateOrNull,
} from "@/lib/auth/sync";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import {
  ensureAdminTables,
  getEffectiveSiteSettings,
} from "@/lib/db/ensure-tables";
import { users } from "@/lib/db/schema";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isUniqueConstraintError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const err = error as { code?: unknown; cause?: { code?: unknown } };
  return err.code === "23505" || err.cause?.code === "23505";
}

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
      { ok: false, error: "بيانات التسجيل غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const record = body as Record<string, unknown>;
  const rawEmail =
    typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const normalizedPhone = normalizePhoneNumber(record.phone);
  const rawPassword = typeof record.password === "string" ? record.password : "";
  const rawFullName =
    typeof record.fullName === "string" ? record.fullName.trim() : "";
  const parsedYear = parseYearLevel(record.yearLevel);
  const parsedDept = parseDepartment(record.department);

  if (!rawEmail || rawEmail.length > 254 || !EMAIL_RE.test(rawEmail)) {
    return NextResponse.json(
      { ok: false, error: "يرجى إدخال بريد إلكتروني صحيح." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (!normalizedPhone) {
    return NextResponse.json(
      {
        ok: false,
        error: "يرجى إدخال رقم موبايل صحيح (مثال: 01012345678).",
      },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (rawPassword.length < 6 || rawPassword.length > 128) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (rawFullName.length < 2 || rawFullName.length > 120) {
    return NextResponse.json(
      { ok: false, error: "يرجى إدخال اسمك الكامل (حرفين على الأقل)." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (parsedYear === undefined) {
    return NextResponse.json(
      { ok: false, error: "الفرقة الدراسية يجب أن تكون بين 1 و 4." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (parsedDept === undefined) {
    return NextResponse.json(
      { ok: false, error: "القسم يجب أن يكون أحد الأقسام: CS, AI, IS, IT." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const db = getDb();

  try {
    await ensureAdminTables();

    const settings = await getEffectiveSiteSettings();
    if (!settings.registrationOpen) {
      return NextResponse.json(
        {
          ok: false,
          code: "REGISTRATION_CLOSED",
          error: "إنشاء الحسابات الجديدة مغلق حالياً. تواصل مع م. أحمد للمساعدة.",
        },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    const existing = await db
      .select({ id: users.id, email: users.email, phone: users.phone })
      .from(users)
      .where(or(eq(users.email, rawEmail), eq(users.phone, normalizedPhone)))
      .limit(1);

    if (existing.length > 0) {
      const matchedPhone = existing[0].phone === normalizedPhone;
      return NextResponse.json(
        {
          ok: false,
          code: matchedPhone ? "PHONE_EXISTS" : "EMAIL_EXISTS",
          error: matchedPhone
            ? "رقم الموبايل مسجل بالفعل لحساب آخر — جرّب تسجيل الدخول."
            : "هذا البريد الإلكتروني مسجل بالفعل — جرّب تسجيل الدخول.",
        },
        { status: 409, headers: NO_STORE_HEADERS }
      );
    }

    const passwordHash = hashPassword(rawPassword);
    const localState = record.localState;
    const initialExamDate =
      typeof localState === "object" && localState !== null
        ? sanitizeExamDateOrNull((localState as Record<string, unknown>).examDate)
        : null;

    const now = new Date();
    const [created] = await db
      .insert(users)
      .values({
        email: rawEmail,
        phone: normalizedPhone,
        passwordHash,
        fullName: rawFullName,
        yearLevel: parsedYear,
        department: parsedDept,
        role: "student",
        examDate: initialExamDate,
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now,
      })
      .returning({
        id: users.id,
        email: users.email,
        phone: users.phone,
        fullName: users.fullName,
        yearLevel: users.yearLevel,
        department: users.department,
        role: users.role,
        examDate: users.examDate,
      });

    if (localState !== undefined) {
      await mergeLocalStateIntoCloud(created.id, localState, {
        mode: "merge",
        updateProfile: false,
        overwriteExamDate: false,
      });
    }

    const device = extractDeviceInfo(request);
    await enforceStudentDeviceGuard({
      userId: created.id,
      fullName: created.fullName,
      role: "student",
      device,
    });

    const { token, expiresAt } = await createSession(
      created.id,
      request.headers.get("user-agent"),
      {
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        ipAddress: device.ipAddress,
        enforceSingleSession: false,
      }
    );

    const sessionUser: SessionUser = {
      id: created.id,
      email: created.email,
      phone: created.phone ?? null,
      fullName: created.fullName,
      yearLevel: created.yearLevel,
      department: created.department as SessionDepartment,
      role: created.role === "admin" ? "admin" : "student",
      examDate: created.examDate ?? null,
    };

    const response = NextResponse.json(
      { ok: true, user: sessionUser },
      { status: 201, headers: NO_STORE_HEADERS }
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
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          ok: false,
          code: "DUPLICATE_ACCOUNT",
          error: "البريد الإلكتروني أو رقم الموبايل مسجل بالفعل — جرّب تسجيل الدخول.",
        },
        { status: 409, headers: NO_STORE_HEADERS }
      );
    }

    console.error("[auth/register] Failed to create account:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "حدث خطأ أثناء إنشاء الحساب — حاول مرة أخرى بعد قليل.",
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
