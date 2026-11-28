import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  adminNotifications,
  getDb,
  isDatabaseConfigured,
  studentMessages,
} from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

const DEFAULT_TITLES: Record<"suggest" | "bug" | "support", string> = {
  suggest: "اقتراح مادة جديدة",
  bug: "تبليغ عن مشكلة في المنصة",
  support: "رسالة تواصل لم. أحمد",
};

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "تنسيق البيانات غير صالح." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "بيانات الرسالة غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const record = body as Record<string, unknown>;
  const rawType =
    typeof record.type === "string" ? record.type.trim().toLowerCase() : "support";
  const type: "suggest" | "bug" | "support" =
    rawType === "suggest" || rawType === "bug" || rawType === "support"
      ? rawType
      : "support";

  const messageBody =
    typeof record.body === "string"
      ? record.body.trim()
      : typeof record.message === "string"
        ? record.message.trim()
        : "";

  if (messageBody.length < 3 || messageBody.length > 3000) {
    return NextResponse.json(
      { ok: false, error: "يرجى كتابة تفاصيل رسالتك (3 أحرف على الأقل)." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const session = await getServerSession();

    const rawSenderName =
      typeof record.senderName === "string" ? record.senderName.trim() : "";
    const senderName = rawSenderName || session?.fullName || "زائر المنصة";

    const rawSenderPhone =
      typeof record.senderPhone === "string" ? record.senderPhone.trim() : "";
    const senderPhone = rawSenderPhone || session?.phone || null;

    const rawSenderEmail =
      typeof record.senderEmail === "string" ? record.senderEmail.trim() : "";
    const senderEmail = rawSenderEmail || session?.email || null;

    const rawTitle =
      typeof record.title === "string" ? record.title.trim() : "";
    const title = (rawTitle || DEFAULT_TITLES[type]).slice(0, 160);

    const db = getDb();
    const now = new Date();

    const [created] = await db
      .insert(studentMessages)
      .values({
        userId: session?.id ?? null,
        senderName: senderName.slice(0, 120),
        senderPhone: senderPhone ? senderPhone.slice(0, 32) : null,
        senderEmail: senderEmail ? senderEmail.slice(0, 180) : null,
        type,
        title,
        body: messageBody,
        status: "open",
        createdAt: now,
      })
      .returning({ id: studentMessages.id });

    await db
      .insert(adminNotifications)
      .values({
        type: "message",
        severity: type === "bug" ? "warning" : "info",
        title: `${DEFAULT_TITLES[type]} — ${senderName.slice(0, 60)}`,
        body: `${title}: ${messageBody.slice(0, 180)}`,
        userId: session?.id ?? null,
        metaJson: JSON.stringify({
          messageId: created.id,
          messageType: type,
          senderName: senderName.slice(0, 120),
          senderPhone,
        }),
        isRead: false,
        createdAt: now,
      })
      .catch(() => {});

    return NextResponse.json(
      { ok: true, id: created.id },
      { status: 201, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[POST /api/messages] Error:", error);
    return NextResponse.json(
      { ok: false, error: "تعذر إرسال الرسالة حالياً — حاول مرة أخرى." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
