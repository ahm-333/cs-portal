import { and, eq, gt, isNull, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import {
  adminNotifications,
  courseOverrides,
  enrollments,
  getDb,
  isDatabaseConfigured,
  subscriptionRequests,
} from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";
import { MOCK_COURSES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };
const MAX_RECEIPT_BYTES = Math.floor(1.5 * 1024 * 1024); // 1.5 MB

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "يرجى تسجيل الدخول أولاً لإرسال طلب الاشتراك." },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "بيانات الطلب غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "بيانات الطلب غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const record = body as Record<string, unknown>;
  const rawCourseId =
    typeof record.courseId === "string" ? record.courseId.trim() : "";
  const rawMethod =
    typeof record.method === "string" ? record.method.trim().toLowerCase() : "";
  const senderInfo =
    typeof record.senderInfo === "string" ? record.senderInfo.trim() : "";
  const rawReceipt =
    typeof record.receiptData === "string" ? record.receiptData.trim() : null;

  if (!rawCourseId) {
    return NextResponse.json(
      { ok: false, error: "يرجى تحديد المادة المطلوب الاشتراك بها." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const course = MOCK_COURSES.find(
    (c) => c.id === rawCourseId || c.slug === rawCourseId
  );
  if (!course) {
    return NextResponse.json(
      { ok: false, error: "المادة المحددة غير موجودة." },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  if (rawMethod !== "vodafone_cash" && rawMethod !== "instapay") {
    return NextResponse.json(
      { ok: false, error: "طريقة الدفع يجب أن تكون فودافون كاش أو InstaPay." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }
  const method: "vodafone_cash" | "instapay" = rawMethod;

  if (senderInfo.length < 3 || senderInfo.length > 160) {
    return NextResponse.json(
      {
        ok: false,
        error:
          method === "vodafone_cash"
            ? "يرجى إدخال رقم المحفظة المحوّل منها بشكل صحيح."
            : "يرجى إدخال اسم حساب InstaPay أو رقم التحويل بشكل صحيح.",
      },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let receiptData: string | null = null;
  if (rawReceipt && rawReceipt.length > 0) {
    if (Buffer.byteLength(rawReceipt, "utf8") > MAX_RECEIPT_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "حجم صورة الإيصال كبير جداً — الحد الأقصى 1.5 ميجابايت.",
        },
        { status: 413, headers: NO_STORE_HEADERS }
      );
    }
    if (!rawReceipt.startsWith("data:image/")) {
      return NextResponse.json(
        { ok: false, error: "صيغة صورة الإيصال غير صالحة." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }
    receiptData = rawReceipt;
  }

  try {
    await ensureAdminTables();
    const db = getDb();
    const now = new Date();

    // Prevent duplicate subscription if student is already enrolled
    const [existingEnrollment, overrideRows] = await Promise.all([
      db
        .select({ id: enrollments.id })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, user.id),
            eq(enrollments.status, "active"),
            or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now)),
            or(
              and(
                eq(enrollments.scopeType, "bundle"),
                eq(enrollments.targetId, "all")
              ),
              and(
                eq(enrollments.scopeType, "course"),
                eq(enrollments.targetId, course.id)
              )
            )
          )
        )
        .limit(1),
      db
        .select({ price: courseOverrides.price })
        .from(courseOverrides)
        .where(eq(courseOverrides.courseId, course.id))
        .limit(1),
    ]);

    if (existingEnrollment.length > 0) {
      return NextResponse.json(
        { ok: false, error: "هذه المادة مفعّلة بالفعل على حسابك!" },
        { status: 409, headers: NO_STORE_HEADERS }
      );
    }

    const effectiveAmount =
      typeof overrideRows[0]?.price === "number"
        ? overrideRows[0].price
        : course.price;

    const [created] = await db
      .insert(subscriptionRequests)
      .values({
        userId: user.id,
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        amount: effectiveAmount,
        method,
        senderInfo,
        receiptData,
        status: "pending",
        createdAt: now,
      })
      .returning();

    const methodLabel = method === "instapay" ? "InstaPay" : "فودافون كاش";
    await db
      .insert(adminNotifications)
      .values({
        type: "payment",
        severity: "info",
        title: `طلب اشتراك جديد — ${user.fullName}`,
        body: `${course.code} (${course.title}) · ${effectiveAmount} ج.م · ${methodLabel} · المحوّل: ${senderInfo}`,
        userId: user.id,
        metaJson: JSON.stringify({
          requestId: created.id,
          courseId: course.id,
          courseCode: course.code,
          amount: effectiveAmount,
          method,
          senderInfo,
          hasReceipt: Boolean(receiptData),
        }),
        isRead: false,
        createdAt: now,
      })
      .catch(() => {});

    return NextResponse.json(
      {
        ok: true,
        request: {
          id: created.id,
          courseId: created.courseId,
          courseCode: created.courseCode,
          courseTitle: created.courseTitle,
          amount: created.amount,
          method: created.method,
          senderInfo: created.senderInfo,
          hasReceipt: Boolean(created.receiptData),
          status: created.status,
          adminNote: created.adminNote ?? null,
          createdAt: created.createdAt.toISOString(),
          reviewedAt: created.reviewedAt
            ? created.reviewedAt.toISOString()
            : null,
        },
      },
      { status: 201, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[POST /api/subscriptions/request] Error:", error);
    return NextResponse.json(
      { ok: false, error: "تعذر إرسال طلب الاشتراك حالياً — حاول مرة أخرى." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
