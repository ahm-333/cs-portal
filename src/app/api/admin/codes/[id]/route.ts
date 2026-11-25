import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { activationCodes, getDb, isDatabaseConfigured } from "@/lib/db";
import { isValidUuid, serializeActivationCode } from "@/app/api/admin/_catalog";

export const dynamic = "force-dynamic";

interface PatchCodeBody {
  isRevoked?: unknown;
  maxUses?: unknown;
  batchLabel?: unknown;
  expiresAt?: unknown;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بتعديل أكواد التفعيل." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  if (!id || !isValidUuid(id)) {
    return NextResponse.json(
      { error: "معرّف الكود غير صالح." },
      { status: 400 }
    );
  }

  let body: PatchCodeBody;
  try {
    body = (await request.json()) as PatchCodeBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400 }
    );
  }

  const updates: Partial<typeof activationCodes.$inferInsert> = {};

  if (typeof body.isRevoked === "boolean") {
    updates.isRevoked = body.isRevoked;
  }

  if (body.maxUses !== undefined) {
    const num = Number(body.maxUses);
    if (!Number.isInteger(num) || num < 1 || num > 1000) {
      return NextResponse.json(
        { error: "الحد الأقصى للاستخدام يجب أن يكون بين 1 و 1000." },
        { status: 400 }
      );
    }
    updates.maxUses = num;
  }

  if (body.batchLabel !== undefined) {
    updates.batchLabel =
      typeof body.batchLabel === "string" && body.batchLabel.trim()
        ? body.batchLabel.trim().slice(0, 120)
        : null;
  }

  if (body.expiresAt !== undefined) {
    if (body.expiresAt === null || body.expiresAt === "") {
      updates.expiresAt = null;
    } else if (typeof body.expiresAt === "string") {
      const parsed = new Date(body.expiresAt.trim());
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json(
          { error: "تاريخ الانتهاء غير صالح." },
          { status: 400 }
        );
      }
      updates.expiresAt = parsed;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "لا توجد تعديلات صالحة في الطلب." },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const [updated] = await db
      .update(activationCodes)
      .set(updates)
      .where(eq(activationCodes.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "الكود غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        code: serializeActivationCode(updated),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/admin/codes/[id]] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحديث حالة الكود." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بحذف أكواد التفعيل." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  if (!id || !isValidUuid(id)) {
    return NextResponse.json(
      { error: "معرّف الكود غير صالح." },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const [existing] = await db
      .select({ id: activationCodes.id, usedCount: activationCodes.usedCount, code: activationCodes.code })
      .from(activationCodes)
      .where(eq(activationCodes.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "الكود غير موجود." },
        { status: 404 }
      );
    }

    if (existing.usedCount > 0) {
      return NextResponse.json(
        { error: "لا يمكن حذف كود تم استخدامه بالفعل — يمكنك إلغاؤه (Revoke) للحفاظ على سجل التفعيلات." },
        { status: 400 }
      );
    }

    await db.delete(activationCodes).where(eq(activationCodes.id, id));
    return NextResponse.json(
      { ok: true, deletedId: existing.id, code: existing.code },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/admin/codes/[id]] Error:", error);
    return NextResponse.json(
      { error: "تعذر حذف الكود." },
      { status: 500 }
    );
  }
}
