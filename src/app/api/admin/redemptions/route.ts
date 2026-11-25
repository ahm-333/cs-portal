import { NextRequest, NextResponse } from "next/server";
import { desc, eq, ilike, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import {
  activationCodes,
  codeRedemptions,
  getDb,
  isDatabaseConfigured,
  users,
} from "@/lib/db";
import { resolveAdminTargetLabel } from "@/app/api/admin/_catalog";
import type { AdminRedemptionItem } from "@/components/admin/adminTypes";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بعرض سجل التفعيلات." },
      { status: 403 }
    );
  }

  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    const q = (searchParams.get("q") ?? "").trim();
    const rawLimit = Number.parseInt(searchParams.get("limit") ?? "150", 10);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(500, Math.max(1, rawLimit))
      : 150;

    const whereClause = q
      ? or(
          ilike(activationCodes.code, `%${q}%`),
          ilike(activationCodes.batchLabel, `%${q}%`),
          ilike(users.fullName, `%${q}%`),
          ilike(users.email, `%${q}%`)
        )
      : undefined;

    const rows = await db
      .select({
        id: codeRedemptions.id,
        codeId: codeRedemptions.codeId,
        code: activationCodes.code,
        scopeType: activationCodes.scopeType,
        targetId: activationCodes.targetId,
        batchLabel: activationCodes.batchLabel,
        userId: users.id,
        userName: users.fullName,
        userEmail: users.email,
        ipHash: codeRedemptions.ipHash,
        redeemedAt: codeRedemptions.redeemedAt,
      })
      .from(codeRedemptions)
      .innerJoin(activationCodes, eq(codeRedemptions.codeId, activationCodes.id))
      .innerJoin(users, eq(codeRedemptions.userId, users.id))
      .where(whereClause)
      .orderBy(desc(codeRedemptions.redeemedAt))
      .limit(limit);

    const redemptions: AdminRedemptionItem[] = rows.map((r) => ({
      id: r.id,
      codeId: r.codeId,
      code: r.code,
      scopeType: r.scopeType,
      targetId: r.targetId,
      targetLabel: resolveAdminTargetLabel(r.scopeType, r.targetId),
      batchLabel: r.batchLabel ?? null,
      userId: r.userId,
      userName: r.userName,
      userEmail: r.userEmail,
      ipHash: r.ipHash ? r.ipHash.slice(0, 12) : null,
      redeemedAt: r.redeemedAt.toISOString(),
    }));

    return NextResponse.json(
      { redemptions, total: redemptions.length },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[GET /api/admin/redemptions] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل سجل التفعيلات." },
      { status: 500 }
    );
  }
}
