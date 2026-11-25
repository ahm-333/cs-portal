import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gt, isNotNull, isNull, lt, or, sql, type SQL } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { activationCodes, getDb, isDatabaseConfigured } from "@/lib/db";
import { serializeActivationCode } from "@/app/api/admin/_catalog";
import {
  SCOPE_LABELS_AR,
  STATUS_LABELS_AR,
  type ActivationScope,
} from "@/components/admin/adminTypes";

export const dynamic = "force-dynamic";

const VALID_SCOPES = new Set<ActivationScope>(["course", "lesson", "bundle"]);

function escapeCsvCell(value: string | number | null | undefined): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  if (/[",\r\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

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
      { error: "غير مصرح لك بتصدير أكواد التفعيل." },
      { status: 403 }
    );
  }

  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const batchLabel = (searchParams.get("batchLabel") ?? "").trim();
    const status = (searchParams.get("status") ?? "all").trim().toLowerCase();
    const scopeParam = (searchParams.get("scopeType") ?? "all").trim();

    const now = new Date();
    const conditions: SQL[] = [];

    if (batchLabel) {
      conditions.push(eq(activationCodes.batchLabel, batchLabel));
    }

    if (VALID_SCOPES.has(scopeParam as ActivationScope)) {
      conditions.push(
        eq(activationCodes.scopeType, scopeParam as ActivationScope)
      );
    }

    if (status === "available") {
      conditions.push(eq(activationCodes.isRevoked, false));
      conditions.push(
        sql`${activationCodes.usedCount} < ${activationCodes.maxUses}`
      );
      conditions.push(
        or(
          isNull(activationCodes.expiresAt),
          gt(activationCodes.expiresAt, now)
        )!
      );
    } else if (status === "used") {
      conditions.push(eq(activationCodes.isRevoked, false));
      conditions.push(
        sql`${activationCodes.usedCount} >= ${activationCodes.maxUses}`
      );
    } else if (status === "revoked") {
      conditions.push(eq(activationCodes.isRevoked, true));
    } else if (status === "expired") {
      conditions.push(eq(activationCodes.isRevoked, false));
      conditions.push(isNotNull(activationCodes.expiresAt));
      conditions.push(lt(activationCodes.expiresAt, now));
    }

    const rows = await db
      .select()
      .from(activationCodes)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(activationCodes.createdAt))
      .limit(5000);

    const header = [
      "Code",
      "Scope",
      "Target",
      "Batch",
      "Used",
      "MaxUses",
      "Status",
      "ExpiresAt",
      "CreatedAt",
    ].join(",");

    const lines = rows.map((row) => {
      const item = serializeActivationCode(row, now);
      return [
        escapeCsvCell(item.code),
        escapeCsvCell(SCOPE_LABELS_AR[item.scopeType]),
        escapeCsvCell(item.targetLabel),
        escapeCsvCell(item.batchLabel ?? ""),
        escapeCsvCell(item.usedCount),
        escapeCsvCell(item.maxUses),
        escapeCsvCell(STATUS_LABELS_AR[item.status]),
        escapeCsvCell(item.expiresAt ? item.expiresAt.slice(0, 10) : ""),
        escapeCsvCell(item.createdAt.slice(0, 19).replace("T", " ")),
      ].join(",");
    });

    const csvWithBom = `\uFEFF${[header, ...lines].join("\r\n")}\r\n`;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="activation-codes.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/codes/export] Error:", error);
    return NextResponse.json(
      { error: "تعذر تصدير ملف الأكواد." },
      { status: 500 }
    );
  }
}
