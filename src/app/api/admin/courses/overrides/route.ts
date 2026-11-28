import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { parseFreeLessonIdsJson } from "@/lib/data";
import { courseOverrides, getDb, isDatabaseConfigured } from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";

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
      { error: "غير مصرح لك بالوصول إلى إعدادات المقررات." },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    const rows = await db.select().from(courseOverrides);
    const overrides = rows.map((row) => ({
      courseId: row.courseId,
      isPublished: row.isPublished,
      isPaid: row.isPaid,
      price: row.price,
      isLocked: row.isLocked,
      freeLessonIds: parseFreeLessonIdsJson(row.freeLessonIdsJson) ?? undefined,
      freeLessonIdsJson: row.freeLessonIdsJson ?? null,
      updatedAt: row.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      { overrides },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[GET /api/admin/courses/overrides] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل إعدادات المقررات." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بتعديل إعدادات المقررات." },
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
  const rawCourseId =
    typeof record.courseId === "string" ? record.courseId.trim() : "";

  const baseCourse = MOCK_COURSES.find(
    (c) => c.id === rawCourseId || c.slug === rawCourseId
  );
  if (!baseCourse) {
    return NextResponse.json(
      { error: "المقرر المحدد غير موجود." },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();

    const [existing] = await db
      .select()
      .from(courseOverrides)
      .where(eq(courseOverrides.courseId, baseCourse.id))
      .limit(1);

    const nextIsPublished =
      typeof record.isPublished === "boolean"
        ? record.isPublished
        : existing
          ? existing.isPublished
          : baseCourse.is_published;

    const nextIsPaid =
      typeof record.isPaid === "boolean"
        ? record.isPaid
        : existing
          ? existing.isPaid
          : baseCourse.is_paid;

    let nextPrice = existing ? existing.price : baseCourse.price;
    if (record.price !== undefined) {
      const parsedPrice = Number(record.price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0 || parsedPrice > 100000) {
        return NextResponse.json(
          { error: "السعر يجب أن يكون رقماً صحيحاً بين 0 و 100000." },
          { status: 400, headers: NO_STORE_HEADERS }
        );
      }
      nextPrice = Math.round(parsedPrice);
    }

    const nextIsLocked =
      typeof record.isLocked === "boolean"
        ? record.isLocked
        : existing
          ? existing.isLocked
          : false;

    let nextFreeLessonIdsJson: string | null = existing
      ? existing.freeLessonIdsJson
      : null;

    if (record.freeLessonIds !== undefined) {
      if (record.freeLessonIds === null) {
        nextFreeLessonIdsJson = null;
      } else if (Array.isArray(record.freeLessonIds)) {
        const validLessonIds = new Set(
          MOCK_LESSONS.filter((l) => l.course_id === baseCourse.id).map(
            (l) => l.id
          )
        );
        const filtered = Array.from(
          new Set(
            record.freeLessonIds
              .filter((item): item is string => typeof item === "string")
              .map((item) => item.trim())
              .filter((item) => validLessonIds.has(item))
          )
        );
        nextFreeLessonIdsJson = JSON.stringify(filtered);
      } else {
        return NextResponse.json(
          { error: "قائمة الفصول المجانية غير صالحة." },
          { status: 400, headers: NO_STORE_HEADERS }
        );
      }
    }

    const now = new Date();
    const [saved] = await db
      .insert(courseOverrides)
      .values({
        courseId: baseCourse.id,
        isPublished: nextIsPublished,
        isPaid: nextIsPaid,
        price: nextPrice,
        isLocked: nextIsLocked,
        freeLessonIdsJson: nextFreeLessonIdsJson,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [courseOverrides.courseId],
        set: {
          isPublished: nextIsPublished,
          isPaid: nextIsPaid,
          price: nextPrice,
          isLocked: nextIsLocked,
          freeLessonIdsJson: nextFreeLessonIdsJson,
          updatedAt: now,
        },
      })
      .returning();

    return NextResponse.json(
      {
        ok: true,
        override: {
          courseId: saved.courseId,
          isPublished: saved.isPublished,
          isPaid: saved.isPaid,
          price: saved.price,
          isLocked: saved.isLocked,
          freeLessonIds:
            parseFreeLessonIdsJson(saved.freeLessonIdsJson) ?? undefined,
          freeLessonIdsJson: saved.freeLessonIdsJson ?? null,
          updatedAt: saved.updatedAt.toISOString(),
        },
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[PUT /api/admin/courses/overrides] Error:", error);
    return NextResponse.json(
      { error: "تعذر حفظ إعدادات المقرر." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
