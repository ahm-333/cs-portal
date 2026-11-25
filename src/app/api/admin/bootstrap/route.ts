import { NextRequest, NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, users } from "@/lib/db";

export const dynamic = "force-dynamic";

interface BootstrapBody {
  fullName?: unknown;
  email?: unknown;
  password?: unknown;
}

/**
 * One-time first-admin bootstrap endpoint.
 * Strictly guarded: refuses with 403 immediately if ANY admin user already exists.
 */
export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  let body: BootstrapBody;
  try {
    body = (await request.json()) as BootstrapBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400 }
    );
  }

  const fullName =
    typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (fullName.length < 2 || fullName.length > 120) {
    return NextResponse.json(
      { error: "أدخل الاسم الكامل للمشرف (حرفين على الأقل)." },
      { status: 400 }
    );
  }

  if (!email || !email.includes("@") || email.length > 180) {
    return NextResponse.json(
      { error: "أدخل بريداً إلكترونياً صحيحاً." },
      { status: 400 }
    );
  }

  if (password.length < 8 || password.length > 128) {
    return NextResponse.json(
      { error: "كلمة مرور المشرف يجب أن تكون 8 أحرف على الأقل." },
      { status: 400 }
    );
  }

  try {
    const db = getDb();

    const [adminCheck] = await db
      .select({ total: count() })
      .from(users)
      .where(eq(users.role, "admin"));

    if (Number(adminCheck?.total ?? 0) > 0) {
      return NextResponse.json(
        {
          error:
            "يوجد حساب مشرف بالفعل على المنصة — يرجى تسجيل الدخول عبر صفحة الدخول.",
        },
        { status: 403 }
      );
    }

    const now = new Date();
    const passwordHash = hashPassword(password);

    const [createdAdmin] = await db
      .insert(users)
      .values({
        fullName,
        email,
        passwordHash,
        yearLevel: 4,
        department: "CS",
        role: "admin",
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now,
      })
      .onConflictDoNothing({ target: users.email })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        yearLevel: users.yearLevel,
        department: users.department,
      });

    if (!createdAdmin) {
      return NextResponse.json(
        {
          error:
            "هذا البريد مسجل بالفعل — استخدم بريداً جديداً لإنشاء حساب المشرف.",
        },
        { status: 409 }
      );
    }

    const userAgent = request.headers.get("user-agent");
    const { token, expiresAt } = await createSession(createdAdmin.id, userAgent);
    await setSessionCookie(token, expiresAt);

    return NextResponse.json(
      { ok: true, user: createdAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/bootstrap] Error:", error);
    return NextResponse.json(
      { error: "تعذر إنشاء حساب المشرف الأول." },
      { status: 500 }
    );
  }
}
