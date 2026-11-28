import { count, desc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { isValidUuid } from "@/app/api/admin/_catalog";
import { requireAdmin } from "@/lib/auth/session";
import {
  adminNotifications,
  getDb,
  isDatabaseConfigured,
  users,
} from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

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
      { error: "غير مصرح لك بالوصول إلى التنبيهات." },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    const [rows, unreadRows] = await Promise.all([
      db
        .select({
          id: adminNotifications.id,
          type: adminNotifications.type,
          severity: adminNotifications.severity,
          title: adminNotifications.title,
          body: adminNotifications.body,
          userId: adminNotifications.userId,
          metaJson: adminNotifications.metaJson,
          isRead: adminNotifications.isRead,
          createdAt: adminNotifications.createdAt,
          userName: users.fullName,
          userEmail: users.email,
          userPhone: users.phone,
        })
        .from(adminNotifications)
        .leftJoin(users, eq(adminNotifications.userId, users.id))
        .orderBy(desc(adminNotifications.createdAt))
        .limit(50),
      db
        .select({ total: count() })
        .from(adminNotifications)
        .where(eq(adminNotifications.isRead, false)),
    ]);

    const notifications = rows.map((row) => ({
      id: row.id,
      type: row.type,
      severity: row.severity,
      title: row.title,
      body: row.body,
      userId: row.userId ?? null,
      userName: row.userName ?? null,
      userEmail: row.userEmail ?? null,
      userPhone: row.userPhone ?? null,
      metaJson: row.metaJson ?? null,
      isRead: row.isRead,
      createdAt: row.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        notifications,
        unreadCount: Number(unreadRows[0]?.total ?? 0),
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[GET /api/admin/notifications] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل التنبيهات." },
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
      { error: "غير مصرح لك بتعديل التنبيهات." },
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
  const markAllRead = record.markAllRead === true;
  const id = typeof record.id === "string" ? record.id.trim() : "";

  if (!markAllRead && !isValidUuid(id)) {
    return NextResponse.json(
      { error: "يرجى تحديد معرّف التنبيه أو اختيار تحديد الكل كمقروء." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    if (markAllRead) {
      await db
        .update(adminNotifications)
        .set({ isRead: true })
        .where(eq(adminNotifications.isRead, false));
    } else {
      await db
        .update(adminNotifications)
        .set({ isRead: true })
        .where(eq(adminNotifications.id, id));
    }

    const [unreadRow] = await db
      .select({ total: count() })
      .from(adminNotifications)
      .where(eq(adminNotifications.isRead, false));

    return NextResponse.json(
      { ok: true, unreadCount: Number(unreadRow?.total ?? 0) },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[PATCH /api/admin/notifications] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحديث حالة التنبيهات." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
