import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import {
  getDb,
  isDatabaseConfigured,
  subscriptionRequests,
} from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { requests: [] },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json(
      { error: "يرجى تسجيل الدخول أولاً." },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    const rows = await db
      .select({
        id: subscriptionRequests.id,
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
      })
      .from(subscriptionRequests)
      .where(eq(subscriptionRequests.userId, user.id))
      .orderBy(desc(subscriptionRequests.createdAt))
      .limit(50);

    const requests = rows.map((row) => ({
      id: row.id,
      courseId: row.courseId,
      courseCode: row.courseCode,
      courseTitle: row.courseTitle,
      amount: row.amount,
      method: row.method,
      senderInfo: row.senderInfo,
      hasReceipt: Boolean(row.receiptData),
      status: row.status,
      adminNote: row.adminNote ?? null,
      createdAt: row.createdAt.toISOString(),
      reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
    }));

    return NextResponse.json(
      { requests },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[GET /api/subscriptions/my] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل طلبات الاشتراك." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
