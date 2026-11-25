import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import {
  looksLikePhoneIdentifier,
  normalizePhoneNumber,
} from "@/lib/auth/phone";
import {
  createSession,
  setSessionCookie,
  type SessionDepartment,
  type SessionUser,
} from "@/lib/auth/session";
import {
  DB_NOT_CONFIGURED_MESSAGE,
  mergeLocalStateIntoCloud,
  parseDepartment,
} from "@/lib/auth/sync";
import { getDb, isDatabaseConfigured } from "@/lib/db";
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
      request.headers.get("user-agent")
    );
    await setSessionCookie(token, expiresAt);

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
      role: userRow.role === "admin" ? "admin" : "student",
      examDate: finalExamDate,
    };

    return NextResponse.json(
      { ok: true, user: sessionUser },
      { status: 200, headers: NO_STORE_HEADERS }
    );
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
