import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gt, ilike, isNotNull, isNull, lt, or, sql, type SQL } from "drizzle-orm";
import {
  generateActivationCodeBatch,
  normalizeActivationCode,
} from "@/lib/activation/codes";
import { requireAdmin } from "@/lib/auth/session";
import { activationCodes, getDb, isDatabaseConfigured } from "@/lib/db";
import { serializeActivationCode } from "@/app/api/admin/_catalog";
import type { ActivationScope } from "@/components/admin/adminTypes";

export const dynamic = "force-dynamic";

const VALID_SCOPES = new Set<ActivationScope>(["course", "lesson", "bundle"]);

function parseScope(value: unknown): ActivationScope | null {
  if (typeof value === "string" && VALID_SCOPES.has(value as ActivationScope)) {
    return value as ActivationScope;
  }
  return null;
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
      { error: "غير مصرح لك بالوصول إلى أكواد التفعيل." },
      { status: 403 }
    );
  }

  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const status = (searchParams.get("status") ?? "all").trim().toLowerCase();
    const scopeParam = (searchParams.get("scopeType") ?? "all").trim();
    const targetId = (searchParams.get("targetId") ?? "").trim();
    const batchLabel = (searchParams.get("batchLabel") ?? "").trim();
    const q = (searchParams.get("q") ?? "").trim();
    const rawLimit = Number.parseInt(searchParams.get("limit") ?? "100", 10);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(500, Math.max(1, rawLimit))
      : 100;

    const now = new Date();
    const conditions: SQL[] = [];

    if (status === "revoked") {
      conditions.push(eq(activationCodes.isRevoked, true));
    } else if (status === "used") {
      conditions.push(eq(activationCodes.isRevoked, false));
      conditions.push(
        sql`${activationCodes.usedCount} >= ${activationCodes.maxUses}`
      );
    } else if (status === "available") {
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
    } else if (status === "expired") {
      conditions.push(eq(activationCodes.isRevoked, false));
      conditions.push(isNotNull(activationCodes.expiresAt));
      conditions.push(lt(activationCodes.expiresAt, now));
    }

    const parsedScope = parseScope(scopeParam);
    if (parsedScope) {
      conditions.push(eq(activationCodes.scopeType, parsedScope));
    }

    if (targetId) {
      conditions.push(eq(activationCodes.targetId, targetId));
    }

    if (batchLabel) {
      conditions.push(eq(activationCodes.batchLabel, batchLabel));
    }

    if (q) {
      const normalized = normalizeActivationCode(q);
      const patternRaw = `%${q}%`;
      const patternNormalized = normalized ? `%${normalized}%` : patternRaw;
      conditions.push(
        or(
          ilike(activationCodes.code, patternRaw),
          ilike(activationCodes.code, patternNormalized),
          ilike(activationCodes.batchLabel, patternRaw)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, distinctBatchRows] = await Promise.all([
      db
        .select()
        .from(activationCodes)
        .where(whereClause)
        .orderBy(desc(activationCodes.createdAt))
        .limit(limit),
      db
        .selectDistinct({ batchLabel: activationCodes.batchLabel })
        .from(activationCodes)
        .where(isNotNull(activationCodes.batchLabel)),
    ]);

    const batchLabels = distinctBatchRows
      .map((r) => r.batchLabel?.trim())
      .filter((label): label is string => Boolean(label))
      .sort((a, b) => a.localeCompare(b, "ar"));

    return NextResponse.json(
      {
        codes: rows.map((row) => serializeActivationCode(row, now)),
        batchLabels,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("[GET /api/admin/codes] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل قائمة أكواد التفعيل." },
      { status: 500 }
    );
  }
}

interface CreateCodesBody {
  scopeType?: unknown;
  targetId?: unknown;
  quantity?: unknown;
  prefix?: unknown;
  batchLabel?: unknown;
  maxUses?: unknown;
  expiresAt?: unknown;
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
      { error: "غير مصرح لك بتوليد أكواد تفعيل." },
      { status: 403 }
    );
  }

  let body: CreateCodesBody;
  try {
    body = (await request.json()) as CreateCodesBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة (JSON غير صحيح)." },
      { status: 400 }
    );
  }

  const scopeType = parseScope(body.scopeType);
  if (!scopeType) {
    return NextResponse.json(
      { error: "نوع النطاق غير صالح (course | lesson | bundle)." },
      { status: 400 }
    );
  }

  const rawTargetId =
    typeof body.targetId === "string" ? body.targetId.trim() : "";
  const targetId = scopeType === "bundle" ? rawTargetId || "all" : rawTargetId;

  if (!targetId) {
    return NextResponse.json(
      { error: "يرجى اختيار المقرر أو الفصل المستهدف." },
      { status: 400 }
    );
  }

  const quantity = Number(body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500) {
    return NextResponse.json(
      { error: "عدد الأكواد يجب أن يكون رقماً صحيحاً بين 1 و 500." },
      { status: 400 }
    );
  }

  const maxUses =
    body.maxUses === undefined || body.maxUses === null || body.maxUses === ""
      ? 1
      : Number(body.maxUses);
  if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 1000) {
    return NextResponse.json(
      { error: "الحد الأقصى للاستخدام يجب أن يكون بين 1 و 1000." },
      { status: 400 }
    );
  }

  const rawPrefix = typeof body.prefix === "string" ? body.prefix.trim() : "";
  const prefix = rawPrefix ? rawPrefix.slice(0, 12) : undefined;

  const rawBatchLabel =
    typeof body.batchLabel === "string" ? body.batchLabel.trim() : "";
  const batchLabel = rawBatchLabel ? rawBatchLabel.slice(0, 120) : null;

  let expiresAt: Date | null = null;
  if (typeof body.expiresAt === "string" && body.expiresAt.trim()) {
    const parsedDate = new Date(body.expiresAt.trim());
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "تاريخ الانتهاء غير صالح." },
        { status: 400 }
      );
    }
    expiresAt = parsedDate;
  }

  try {
    const db = getDb();
    const generatedRaw = generateActivationCodeBatch(quantity, prefix);
    const uniqueCodes = Array.from(
      new Set(generatedRaw.map((c) => normalizeActivationCode(c)).filter(Boolean))
    );

    if (uniqueCodes.length === 0) {
      return NextResponse.json(
        { error: "فشل توليد الأكواد، حاول مرة أخرى." },
        { status: 500 }
      );
    }

    const now = new Date();
    const valuesToInsert = uniqueCodes.map((code) => ({
      code,
      scopeType,
      targetId,
      batchLabel,
      maxUses,
      usedCount: 0,
      isRevoked: false,
      expiresAt,
      createdBy: admin.id,
      createdAt: now,
    }));

    const insertedRows = await db
      .insert(activationCodes)
      .values(valuesToInsert)
      .onConflictDoNothing({ target: activationCodes.code })
      .returning();

    return NextResponse.json(
      {
        ok: true,
        count: insertedRows.length,
        codes: insertedRows.map((row) => serializeActivationCode(row, now)),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/codes] Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ الأكواد في قاعدة البيانات." },
      { status: 500 }
    );
  }
}
