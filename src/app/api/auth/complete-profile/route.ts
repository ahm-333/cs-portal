import { and, eq, ne } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import {
  requireUser,
  type SessionDepartment,
  type SessionUser,
} from "@/lib/auth/session";
import {
  mergeLocalStateIntoCloud,
  parseDepartment,
  parseYearLevel,
} from "@/lib/auth/sync";
import { getDb, isDatabaseConfigured, users } from "@/lib/db";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const session = await requireUser();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "يرجى تسجيل الدخول أولاً." },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "تنسيق البيانات غير صالح." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const normalizedPhone = normalizePhoneNumber(body.phone);
  if (!normalizedPhone) {
    return NextResponse.json(
      { ok: false, error: "يرجى إدخال رقم موبايل صحيح (مثال: 01012345678)." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const rawFullName =
    typeof body.fullName === "string" && body.fullName.trim().length >= 2
      ? body.fullName.trim().slice(0, 120)
      : session.fullName;

  const yearLevel =
    parseYearLevel(body.yearLevel, session.yearLevel) ?? session.yearLevel;
  const department =
    parseDepartment(body.department, session.department) ?? session.department;

  try {
    const db = getDb();

    // Ensure phone is not already taken by another account
    const conflict = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.phone, normalizedPhone), ne(users.id, session.id)))
      .limit(1);

    if (conflict.length > 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الموبايل مسجل بالفعل لحساب آخر." },
        { status: 409, headers: NO_STORE_HEADERS }
      );
    }

    const now = new Date();
    const [updated] = await db
      .update(users)
      .set({
        phone: normalizedPhone,
        fullName: rawFullName,
        yearLevel,
        department,
        updatedAt: now,
        lastActiveAt: now,
      })
      .where(eq(users.id, session.id))
      .returning({
        id: users.id,
        email: users.email,
        phone: users.phone,
        googleId: users.googleId,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        yearLevel: users.yearLevel,
        department: users.department,
        role: users.role,
        examDate: users.examDate,
      });

    if (body.localState !== undefined) {
      await mergeLocalStateIntoCloud(session.id, body.localState, {
        mode: "merge",
        updateProfile: false,
        overwriteExamDate: false,
      });
    }

    const sessionUser: SessionUser = {
      id: updated.id,
      email: updated.email,
      phone: updated.phone ?? null,
      avatarUrl: updated.avatarUrl ?? null,
      googleLinked: Boolean(updated.googleId),
      fullName: updated.fullName,
      yearLevel: updated.yearLevel,
      department: updated.department as SessionDepartment,
      role: updated.role === "admin" ? "admin" : "student",
      examDate: updated.examDate ?? null,
    };

    return NextResponse.json(
      { ok: true, user: sessionUser },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[auth/complete-profile] Error:", error);
    return NextResponse.json(
      { ok: false, error: "تعذر حفظ بياناتك حالياً — حاول مرة أخرى." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
