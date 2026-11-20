import { NextResponse, type NextRequest } from "next/server";

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

  // Standalone local-storage mode: confirm valid payload cleanly so client persists locally.
  return NextResponse.json(
    { ok: true, local: true },
    { status: 200, headers: NO_STORE_HEADERS }
  );
}
