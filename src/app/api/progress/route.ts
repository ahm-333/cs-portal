import { sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { resolveCourseIdForLesson } from "@/lib/auth/sync";
import { getDbOrNull } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

interface ParsedProgressPayload {
  lesson_id: string;
  is_completed?: boolean;
  best_quiz_score?: number;
}

function parsePayload(raw: unknown): ParsedProgressPayload | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const rawLessonId = record.lesson_id;

  if (typeof rawLessonId !== "string" || rawLessonId.trim().length === 0) {
    return null;
  }

  const parsed: ParsedProgressPayload = {
    lesson_id: rawLessonId.trim(),
  };

  if (record.is_completed !== undefined) {
    if (typeof record.is_completed !== "boolean") {
      return null;
    }
    parsed.is_completed = record.is_completed;
  }

  if (record.best_quiz_score !== undefined) {
    if (
      typeof record.best_quiz_score !== "number" ||
      !Number.isFinite(record.best_quiz_score) ||
      record.best_quiz_score < 0 ||
      record.best_quiz_score > 100
    ) {
      return null;
    }
    parsed.best_quiz_score = Math.round(record.best_quiz_score);
  }

  if (
    parsed.is_completed === undefined &&
    parsed.best_quiz_score === undefined
  ) {
    return null;
  }

  return parsed;
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const payload = parsePayload(rawBody);
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Invalid progress payload. Expected { lesson_id: string, is_completed?: boolean, best_quiz_score?: number (0-100) }.",
      },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  // Graceful guest / Zero-DB standalone fallback
  const db = getDbOrNull();
  const user = db ? await getServerSession() : null;

  if (!db || !user) {
    return NextResponse.json(
      { ok: true, local: true },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const courseId = resolveCourseIdForLesson(payload.lesson_id);
    const now = new Date();

    await db
      .insert(userProgress)
      .values({
        userId: user.id,
        courseId,
        lessonId: payload.lesson_id,
        isCompleted: payload.is_completed ?? false,
        bestQuizScore: payload.best_quiz_score ?? null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: {
          courseId,
          ...(payload.is_completed !== undefined
            ? { isCompleted: payload.is_completed }
            : {}),
          ...(payload.best_quiz_score !== undefined
            ? {
                bestQuizScore: sql`NULLIF(GREATEST(COALESCE(${userProgress.bestQuizScore}, -1), COALESCE(excluded.best_quiz_score, -1)), -1)`,
              }
            : {}),
          updatedAt: now,
        },
      });

    return NextResponse.json(
      { ok: true, local: false, synced: true },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[api/progress POST] Cloud progress upsert failed:", error);
    // Keep client progress flow resilient even if DB has a transient hiccup
    return NextResponse.json(
      { ok: true, local: true },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }
}
