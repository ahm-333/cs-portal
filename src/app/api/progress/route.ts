import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { UserProgress } from "@/types/database";

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

  // Demo Mode: respond cleanly so client mirrors progress in localStorage
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: true, demo: true, progress: null },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Unauthenticated guest: respond cleanly with demo flag for localStorage mirroring
    if (authError || !user) {
      return NextResponse.json(
        { ok: true, demo: true, progress: null },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    // Read existing progress so we preserve Math.max(existing.best_quiz_score, incoming)
    // and avoid overwriting is_completed when only updating quiz score (or vice versa).
    const { data: existing, error: fetchError } = await supabase
      .from("user_progress")
      .select("id, user_id, lesson_id, is_completed, best_quiz_score, updated_at")
      .eq("user_id", user.id)
      .eq("lesson_id", payload.lesson_id)
      .maybeSingle<UserProgress>();

    if (fetchError) {
      return NextResponse.json(
        { ok: false, error: "Failed to read existing progress" },
        { status: 500, headers: NO_STORE_HEADERS }
      );
    }

    const nextIsCompleted =
      payload.is_completed !== undefined
        ? payload.is_completed
        : existing?.is_completed ?? false;

    let nextBestQuizScore: number | null = existing?.best_quiz_score ?? null;
    if (payload.best_quiz_score !== undefined) {
      nextBestQuizScore =
        typeof existing?.best_quiz_score === "number"
          ? Math.max(existing.best_quiz_score, payload.best_quiz_score)
          : payload.best_quiz_score;
    }

    const { data: upserted, error: upsertError } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: user.id,
          lesson_id: payload.lesson_id,
          is_completed: nextIsCompleted,
          best_quiz_score: nextBestQuizScore,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      )
      .select("id, user_id, lesson_id, is_completed, best_quiz_score, updated_at")
      .single<UserProgress>();

    if (upsertError || !upserted) {
      return NextResponse.json(
        { ok: false, error: "Failed to save progress" },
        { status: 500, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      { ok: true, demo: false, progress: upserted },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected error saving progress" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
