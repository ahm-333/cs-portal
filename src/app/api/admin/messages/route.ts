import { count, desc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { isValidUuid } from "@/app/api/admin/_catalog";
import { requireAdmin } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, studentMessages } from "@/lib/db";
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
      { error: "غير مصرح لك بالوصول إلى رسائل الطلاب." },
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
      statusParam === "open" || statusParam === "resolved" ? statusParam : null;

    const [rows, openRows] = await Promise.all([
      db
        .select()
        .from(studentMessages)
        .where(
          statusFilter ? eq(studentMessages.status, statusFilter) : undefined
        )
        .orderBy(desc(studentMessages.createdAt))
        .limit(150),
      db
        .select({ total: count() })
        .from(studentMessages)
        .where(eq(studentMessages.status, "open")),
    ]);

    const messages = rows.map((row) => ({
      id: row.id,
      userId: row.userId ?? null,
      senderName: row.senderName,
      senderPhone: row.senderPhone ?? null,
      senderEmail: row.senderEmail ?? null,
      type: row.type,
      title: row.title,
      body: row.body,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        messages,
        openCount: Number(openRows[0]?.total ?? 0),
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[GET /api/admin/messages] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل رسائل الطلاب." },
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
      { error: "غير مصرح لك بتعديل حالة الرسائل." },
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
  const status =
    record.status === "open" || record.status === "resolved"
      ? record.status
      : null;

  if (!isValidUuid(id)) {
    return NextResponse.json(
      { error: "معرّف الرسالة غير صالح." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (!status) {
    return NextResponse.json(
      { error: "الحالة يجب أن تكون open أو resolved." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    const [updated] = await db
      .update(studentMessages)
      .set({ status })
      .where(eq(studentMessages.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "الرسالة غير موجودة." },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    const [openRow] = await db
      .select({ total: count() })
      .from(studentMessages)
      .where(eq(studentMessages.status, "open"));

    return NextResponse.json(
      {
        ok: true,
        message: {
          id: updated.id,
          userId: updated.userId ?? null,
          senderName: updated.senderName,
          senderPhone: updated.senderPhone ?? null,
          senderEmail: updated.senderEmail ?? null,
          type: updated.type,
          title: updated.title,
          body: updated.body,
          status: updated.status,
          createdAt: updated.createdAt.toISOString(),
        },
        openCount: Number(openRow?.total ?? 0),
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[PATCH /api/admin/messages] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحديث حالة الرسالة." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
