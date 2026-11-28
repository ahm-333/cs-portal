import { count, desc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { isValidUuid } from "@/app/api/admin/_catalog";
import { requireAdmin } from "@/lib/auth/session";
import {
  enrollments,
  getDb,
  isDatabaseConfigured,
  subscriptionRequests,
  users,
} from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بالوصول إلى طلبات الاشتراك." },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    const statusParam = (
      request.nextUrl.searchParams.get("status") ?? "all"
    )
      .trim()
      .toLowerCase();

    const statusFilter =
      statusParam === "pending" ||
      statusParam === "approved" ||
      statusParam === "rejected"
        ? statusParam
        : null;

    const [rows, pendingRows] = await Promise.all([
      db
        .select({
          id: subscriptionRequests.id,
          userId: subscriptionRequests.userId,
          courseId: subscriptionRequests.courseId,
          courseCode: subscriptionRequests.courseCode,
          courseTitle: subscriptionRequests.courseTitle,
          amount: subscriptionRequests.amount,
          method: subscriptionRequests.method,
          senderInfo: subscriptionRequests.senderInfo,
          receiptData: subscriptionRequests.receiptData,
          status: subscriptionRequests.status,
          adminNote: subscriptionRequests.adminNote,
          createdAt: subscriptionRequests.createdAt,
          reviewedAt: subscriptionRequests.reviewedAt,
          studentName: users.fullName,
          studentEmail: users.email,
          studentPhone: users.phone,
          studentYear: users.yearLevel,
          studentDept: users.department,
        })
        .from(subscriptionRequests)
        .innerJoin(users, eq(subscriptionRequests.userId, users.id))
        .where(
          statusFilter
            ? eq(subscriptionRequests.status, statusFilter)
            : undefined
        )
        .orderBy(desc(subscriptionRequests.createdAt))
        .limit(150),
      db
        .select({ total: count() })
        .from(subscriptionRequests)
        .where(eq(subscriptionRequests.status, "pending")),
    ]);

    const requests = rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      studentName: row.studentName,
      studentEmail: row.studentEmail,
      studentPhone: row.studentPhone ?? null,
      studentYear: row.studentYear,
      studentDept: row.studentDept,
      courseId: row.courseId,
      courseCode: row.courseCode,
      courseTitle: row.courseTitle,
      amount: row.amount,
      method: row.method,
      senderInfo: row.senderInfo,
      receiptData: row.receiptData ?? null,
      status: row.status,
      adminNote: row.adminNote ?? null,
      createdAt: row.createdAt.toISOString(),
      reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
    }));

    return NextResponse.json(
      {
        requests,
        pendingCount: Number(pendingRows[0]?.total ?? 0),
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[GET /api/admin/subscriptions] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل طلبات الاشتراك." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بمراجعة طلبات الاشتراك." },
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

  const record = body as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const action =
    record.action === "approve" || record.action === "reject"
      ? record.action
      : null;
  const adminNote =
    typeof record.adminNote === "string"
      ? record.adminNote.trim().slice(0, 500) || null
      : null;

  if (!isValidUuid(id)) {
    return NextResponse.json(
      { error: "معرّف طلب الاشتراك غير صالح." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (!action) {
    return NextResponse.json(
      { error: "الإجراء يجب أن يكون approve أو reject." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    const [existing] = await db
      .select()
      .from(subscriptionRequests)
      .where(eq(subscriptionRequests.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "طلب الاشتراك غير موجود." },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    const now = new Date();
    const nextStatus = action === "approve" ? "approved" : "rejected";

    const [updated] = await db
      .update(subscriptionRequests)
      .set({
        status: nextStatus,
        adminNote,
        reviewedAt: now,
      })
      .where(eq(subscriptionRequests.id, id))
      .returning();

    if (action === "approve") {
      await db
        .insert(enrollments)
        .values({
          userId: existing.userId,
          scopeType: "course",
          targetId: existing.courseId,
          status: "active",
          enrolledAt: now,
          expiresAt: null,
        })
        .onConflictDoUpdate({
          target: [
            enrollments.userId,
            enrollments.scopeType,
            enrollments.targetId,
          ],
          set: {
            status: "active",
            enrolledAt: now,
            expiresAt: null,
          },
        });
    }

    return NextResponse.json(
      {
        ok: true,
        request: {
          id: updated.id,
          userId: updated.userId,
          courseId: updated.courseId,
          courseCode: updated.courseCode,
          courseTitle: updated.courseTitle,
          amount: updated.amount,
          method: updated.method,
          senderInfo: updated.senderInfo,
          status: updated.status,
          adminNote: updated.adminNote ?? null,
          createdAt: updated.createdAt.toISOString(),
          reviewedAt: updated.reviewedAt
            ? updated.reviewedAt.toISOString()
            : null,
        },
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[PATCH /api/admin/subscriptions] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحديث حالة طلب الاشتراك." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
