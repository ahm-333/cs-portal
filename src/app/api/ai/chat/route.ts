import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { hasUserAccessToLesson } from "@/lib/activation/codes";
import { buildChapterAiContext } from "@/lib/ai/chapterContext";
import {
  buildChapterTutorSystemPrompt,
  checkAndIncrementAiUsage,
  isAiConfigured,
  streamChapterTutorReply,
  type AiChatTurn,
} from "@/lib/ai/provider";
import { getServerSession } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_MESSAGE_CHARS = 1500;
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_TURN_CHARS = 2000;

interface ChatRequestPayload {
  courseId?: unknown;
  lessonId?: unknown;
  message?: unknown;
  history?: unknown;
}

function sanitizeHistory(raw: unknown): AiChatTurn[] {
  if (!Array.isArray(raw)) return [];

  const cleaned: AiChatTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as { role?: unknown; text?: unknown };
    const role = record.role;
    const text = typeof record.text === "string" ? record.text.trim() : "";

    if ((role === "user" || role === "model") && text.length > 0) {
      cleaned.push({
        role,
        text: text.slice(0, MAX_HISTORY_TURN_CHARS),
      });
    }
  }

  // Enforce strict user/model alternation so retries after errors never send consecutive user turns
  const alternating: AiChatTurn[] = [];
  for (const turn of cleaned) {
    if (alternating.length === 0) {
      if (turn.role === "user") alternating.push(turn);
      continue;
    }
    const prev = alternating[alternating.length - 1];
    if (prev.role === turn.role) {
      alternating[alternating.length - 1] = turn;
    } else {
      alternating.push(turn);
    }
  }

  const sliced = alternating.slice(-MAX_HISTORY_TURNS);

  // Gemini expects history to start with "user" and end with "model" before appending the new "user" prompt
  while (sliced.length > 0 && sliced[0].role !== "user") {
    sliced.shift();
  }
  while (sliced.length > 0 && sliced[sliced.length - 1].role !== "model") {
    sliced.pop();
  }

  return sliced;
}

function resolveGuestActorKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const firstIp = forwarded?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip = firstIp || realIp || "local";

  const ipHash = createHash("sha256")
    .update(`cs-portal-ai::${ip}`)
    .digest("hex")
    .slice(0, 24);

  return `guest:${ipHash}`;
}

export async function POST(request: NextRequest) {
  let payload: ChatRequestPayload;
  try {
    const raw = await request.json();
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error("invalid");
    }
    payload = raw as ChatRequestPayload;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_JSON",
        error: "صيغة الطلب غير صالحة.",
      },
      { status: 400 }
    );
  }

  const courseId =
    typeof payload.courseId === "string" ? payload.courseId.trim() : "";
  const lessonId =
    typeof payload.lessonId === "string" ? payload.lessonId.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!courseId || !lessonId) {
    return NextResponse.json(
      {
        ok: false,
        code: "MISSING_CHAPTER",
        error: "بيانات المقرر أو الفصل غير مكتملة.",
      },
      { status: 400 }
    );
  }

  if (!message) {
    return NextResponse.json(
      {
        ok: false,
        code: "EMPTY_MESSAGE",
        error: "اكتب سؤالك أولاً قبل الإرسال.",
      },
      { status: 400 }
    );
  }

  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json(
      {
        ok: false,
        code: "MESSAGE_TOO_LONG",
        error: `الحد الأقصى للسؤال هو ${MAX_MESSAGE_CHARS} حرف.`,
      },
      { status: 400 }
    );
  }

  const course = MOCK_COURSES.find((c) => c.id === courseId) ?? null;
  const lesson =
    MOCK_LESSONS.find((l) => l.id === lessonId && l.course_id === courseId) ??
    null;

  if (!course || !lesson) {
    return NextResponse.json(
      {
        ok: false,
        code: "LESSON_NOT_FOUND",
        error: "تعذّر العثور على الفصل المطلوب.",
      },
      { status: 404 }
    );
  }

  // Resolve current authenticated session (mandatory account)
  let session = null;
  if (isDatabaseConfigured()) {
    try {
      session = await getServerSession();
    } catch (err) {
      console.error("[AI Chat] Failed to read session:", err);
      session = null;
    }
  }

  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        code: "AUTH_REQUIRED",
        error: "يجب إنشاء حساب أو تسجيل الدخول أولاً لاستخدام المساعد الذكي.",
      },
      {
        status: 401,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }

  if (!course.is_published && session.role !== "admin") {
    return NextResponse.json(
      {
        ok: false,
        code: "LESSON_NOT_FOUND",
        error: "تعذّر العثور على الفصل المطلوب.",
      },
      { status: 404 }
    );
  }

  // Enforce strict server-side authorization for paid locked lessons (fail-closed)
  if (course.is_paid && !lesson.is_free_preview) {
    const isAdmin = session?.role === "admin";
    if (!isAdmin) {
      let hasAccess = false;
      try {
        hasAccess = await hasUserAccessToLesson(
          session?.id ?? null,
          course.id,
          lesson.id,
          course.is_paid,
          lesson.is_free_preview
        );
      } catch (err) {
        console.error("[AI Chat] Access check error:", err);
        hasAccess = false;
      }

      if (!hasAccess) {
        return NextResponse.json(
          {
            ok: false,
            code: "LESSON_LOCKED",
            error:
              "هذا الفصل مدفوع — فعّل المقرر بكود التفعيل أولاً لاستخدام المساعد الذكي داخل هذا الفصل.",
          },
          {
            status: 403,
            headers: { "Cache-Control": "private, no-store" },
          }
        );
      }
    }
  }

  // Check Gemini API configuration cleanly before touching rate limits
  if (!isAiConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        code: "AI_NOT_CONFIGURED",
        error:
          "المساعد الذكي جاهز للعمل فور إضافة مفتاح GEMINI_API_KEY في إعدادات السيرفر.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }

  // Enforce daily per-user / per-guest rate limit
  const actorKey = session?.id
    ? `user:${session.id}`
    : resolveGuestActorKey(request);

  const usage = await checkAndIncrementAiUsage(actorKey);
  if (!usage.allowed) {
    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMIT_EXCEEDED",
        error:
          "وصلت للحد اليومي لأسئلة المساعد الذكي اليوم. يتجدد رصيدك تلقائياً مع بداية اليوم الجديد.",
        limit: usage.limit,
        remaining: 0,
        resetAt: usage.resetAtIso,
      },
      {
        status: 429,
        headers: {
          "Cache-Control": "private, no-store",
          "X-AI-Remaining": "0",
          "X-AI-Limit": String(usage.limit),
          "X-AI-Reset-At": usage.resetAtIso,
        },
      }
    );
  }

  const chapterCtx = buildChapterAiContext(course.id, lesson.id);
  if (!chapterCtx) {
    return NextResponse.json(
      {
        ok: false,
        code: "CONTEXT_UNAVAILABLE",
        error: "تعذّر تحميل كشكول ملخص الفصل.",
      },
      { status: 404 }
    );
  }

  const systemPrompt = buildChapterTutorSystemPrompt({
    courseCode: chapterCtx.courseCode,
    courseTitleAr: chapterCtx.courseTitleAr,
    courseTitleEn: chapterCtx.courseTitleEn,
    lessonTitle: chapterCtx.lessonTitle,
    chapterContext: chapterCtx.contextText,
  });

  const history = sanitizeHistory(payload.history);

  // Prime the Gemini stream before creating the HTTP Response so immediate
  // upstream errors (e.g. invalid API key) return a proper JSON error status.
  const generator = streamChapterTutorReply({
    systemPrompt,
    history,
    question: message,
    signal: request.signal,
  });

  let firstChunk: IteratorResult<string>;
  try {
    firstChunk = await generator.next();
  } catch (err) {
    console.error("[AI Chat] Gemini stream startup failed:", err);
    return NextResponse.json(
      {
        ok: false,
        code: "AI_PROVIDER_ERROR",
        error:
          "تعذّر الاتصال بالمساعد الذكي حالياً. حاول مرة أخرى بعد لحظات.",
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "private, no-store",
          "X-AI-Remaining": String(usage.remaining),
          "X-AI-Limit": String(usage.limit),
        },
      }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!firstChunk.done && firstChunk.value) {
          controller.enqueue(encoder.encode(firstChunk.value));
        }
        if (!firstChunk.done) {
          for await (const textChunk of generator) {
            if (request.signal.aborted) break;
            if (textChunk) {
              controller.enqueue(encoder.encode(textChunk));
            }
          }
        }
        controller.close();
      } catch (err) {
        if (!request.signal.aborted) {
          console.error("[AI Chat] Mid-stream error:", err);
          controller.enqueue(
            encoder.encode(
              "\n\n> **ملاحظة:** انقطع الاتصال أثناء إكمال الإجابة — تقدر تبعت سؤالك تاني."
            )
          );
        }
        controller.close();
      }
    },
    async cancel() {
      try {
        await generator.return(undefined);
      } catch {
        // ignore cancel cleanup errors
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-AI-Remaining": String(usage.remaining),
      "X-AI-Limit": String(usage.limit),
      "X-AI-Reset-At": usage.resetAtIso,
    },
  });
}
