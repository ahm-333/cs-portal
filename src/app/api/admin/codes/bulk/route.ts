import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { activationCodes, getDb, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

interface BulkCodeBody {
  action?: unknown;
  batchLabel?: unknown;
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بتنفيذ عمليات جماعية على الأكواد." },
      { status: 403 }
    );
  }

  let body: BulkCodeBody;
  try {
    body = (await request.json()) as BulkCodeBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400 }
    );
  }

  const action =
    body.action === "revoke_batch" ||
    body.action === "restore_batch" ||
    body.action === "delete_unused_batch"
      ? body.action
      : null;

  if (!action) {
    return NextResponse.json(
      { error: "الإجراء المطلوب غير صالح." },
      { status: 400 }
    );
  }

  const batchLabel =
    typeof body.batchLabel === "string" ? body.batchLabel.trim() : "";
  if (!batchLabel) {
    return NextResponse.json(
      { error: "يرجى اختيار الدفعة المستهدفة." },
      { status: 400 }
    );
  }

  try {
    const db = getDb();

    if (action === "revoke_batch") {
      const updated = await db
        .update(activationCodes)
        .set({ isRevoked: true })
        .where(eq(activationCodes.batchLabel, batchLabel))
        .returning({ id: activationCodes.id });

      return NextResponse.json(
        { ok: true, affected: updated.length, action },
        { status: 200 }
      );
    }

    if (action === "restore_batch") {
      const updated = await db
        .update(activationCodes)
        .set({ isRevoked: false })
        .where(eq(activationCodes.batchLabel, batchLabel))
        .returning({ id: activationCodes.id });

      return NextResponse.json(
        { ok: true, affected: updated.length, action },
        { status: 200 }
      );
    }

    const deleted = await db
      .delete(activationCodes)
      .where(
        and(
          eq(activationCodes.batchLabel, batchLabel),
          eq(activationCodes.usedCount, 0)
        )
      )
      .returning({ id: activationCodes.id });

    return NextResponse.json(
      { ok: true, affected: deleted.length, action },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/admin/codes/bulk] Error:", error);
    return NextResponse.json(
      { error: "تعذر تنفيذ العملية الجماعية على الدفعة." },
      { status: 500 }
    );
  }
}
