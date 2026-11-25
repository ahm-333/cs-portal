import { GoogleGenAI } from "@google/genai";
import { sql } from "drizzle-orm";
import { aiChatUsage, getDbOrNull, isDatabaseConfigured } from "@/lib/db";

export interface AiChatTurn {
  role: "user" | "model";
  text: string;
}

export interface AiRateLimitResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  dateKey: string;
  resetAtIso: string;
}

export interface ChapterTutorPromptParams {
  courseCode: string;
  courseTitleAr: string;
  courseTitleEn: string;
  lessonTitle: string;
  chapterContext: string;
}

export interface StreamChapterTutorParams {
  systemPrompt: string;
  history: AiChatTurn[];
  question: string;
  signal?: AbortSignal;
}

type MemoryUsageStore = Map<string, number>;

type AiGlobalCache = {
  __csPortalAiUsageMap?: MemoryUsageStore;
};

const globalCache = globalThis as unknown as AiGlobalCache;

function getMemoryUsageMap(): MemoryUsageStore {
  if (!globalCache.__csPortalAiUsageMap) {
    globalCache.__csPortalAiUsageMap = new Map<string, number>();
  }
  return globalCache.__csPortalAiUsageMap;
}

/**
 * Returns true when `GEMINI_API_KEY` is configured with a non-empty value.
 */
export function isAiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/**
 * Resolves the Gemini model name (defaults to `gemini-2.5-flash`).
 */
export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
}

/**
 * Resolves the default daily per-user/per-guest AI request limit.
 */
export function getAiDailyLimit(): number {
  const parsed = Number(process.env.AI_DAILY_LIMIT);
  if (Number.isFinite(parsed) && parsed >= 1) {
    return Math.floor(parsed);
  }
  return 25;
}

/**
 * Computes UTC YYYY-MM-DD key + next UTC midnight ISO timestamp.
 */
export function getUtcDayWindow(now = new Date()): {
  dateKey: string;
  resetAtIso: string;
} {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const dateKey = `${year}-${month}-${day}`;

  const nextMidnightUtc = new Date(
    Date.UTC(year, now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return { dateKey, resetAtIso: nextMidnightUtc.toISOString() };
}

function checkAndIncrementInMemory(
  actorKey: string,
  limit: number,
  dateKey: string,
  resetAtIso: string
): AiRateLimitResult {
  const store = getMemoryUsageMap();

  // Periodically prune stale day entries if map grows large
  if (store.size > 2000) {
    const suffix = `::${dateKey}`;
    for (const key of store.keys()) {
      if (!key.endsWith(suffix)) {
        store.delete(key);
      }
    }
  }

  const compositeKey = `${actorKey}::${dateKey}`;
  const current = store.get(compositeKey) ?? 0;

  if (current >= limit) {
    return {
      allowed: false,
      used: current,
      limit,
      remaining: 0,
      dateKey,
      resetAtIso,
    };
  }

  const next = current + 1;
  store.set(compositeKey, next);

  return {
    allowed: true,
    used: next,
    limit,
    remaining: Math.max(0, limit - next),
    dateKey,
    resetAtIso,
  };
}

/**
 * Atomically checks and increments the daily AI usage counter for `actorKey`.
 * Uses Neon Postgres (`ai_chat_usage`) when configured, with graceful in-memory fallback.
 */
export async function checkAndIncrementAiUsage(
  actorKey: string,
  limit?: number
): Promise<AiRateLimitResult> {
  const effectiveLimit = Math.max(1, Math.floor(limit ?? getAiDailyLimit()));
  const { dateKey, resetAtIso } = getUtcDayWindow();

  if (!isDatabaseConfigured()) {
    return checkAndIncrementInMemory(actorKey, effectiveLimit, dateKey, resetAtIso);
  }

  const db = getDbOrNull();
  if (!db) {
    return checkAndIncrementInMemory(actorKey, effectiveLimit, dateKey, resetAtIso);
  }

  try {
    const rows = await db
      .insert(aiChatUsage)
      .values({
        actorKey,
        dateKey,
        requestCount: 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [aiChatUsage.actorKey, aiChatUsage.dateKey],
        set: {
          requestCount: sql`${aiChatUsage.requestCount} + 1`,
          updatedAt: new Date(),
        },
        setWhere: sql`${aiChatUsage.requestCount} < ${effectiveLimit}`,
      })
      .returning({
        requestCount: aiChatUsage.requestCount,
      });

    if (rows.length > 0) {
      const used = rows[0].requestCount;
      return {
        allowed: true,
        used,
        limit: effectiveLimit,
        remaining: Math.max(0, effectiveLimit - used),
        dateKey,
        resetAtIso,
      };
    }

    return {
      allowed: false,
      used: effectiveLimit,
      limit: effectiveLimit,
      remaining: 0,
      dateKey,
      resetAtIso,
    };
  } catch (err) {
    // Graceful fallback so transient DB errors or unpushed local schemas never crash the tutor
    console.warn("[AI RateLimit] Falling back to in-memory counter:", err);
    return checkAndIncrementInMemory(actorKey, effectiveLimit, dateKey, resetAtIso);
  }
}

/**
 * Builds the grounded system instruction anchored strictly in the chapter's «كشكول الملخص».
 */
export function buildChapterTutorSystemPrompt({
  courseCode,
  courseTitleAr,
  courseTitleEn,
  lessonTitle,
  chapterContext,
}: ChapterTutorPromptParams): string {
  return [
    "أنت «المساعد الذكي لبوابة Eng. Ahmed Amir» — الركن الخامس للمذاكرة لطلاب كلية الحاسبات والذكاء الاصطناعي.",
    `الطالب يذاكر حالياً مقرر: ${courseCode} (${courseTitleAr} — ${courseTitleEn})، وتحديداً فصل: «${lessonTitle}».`,
    "",
    "قواعدك الصارمة في الشرح:",
    "1. اللغة والأسلوب: اشرح بلهجة مصرية ودودة وواضحة ومباشرة (أسلوب معيد شاطر بيساعد زميله قبل الامتحان)، مع الحفاظ التام على المصطلحات العلمية الإنجليزية الدقيقة كما هي (مثل Operating System, Context Switch, DMA, Big-O, Normalization...) بدون ترجمة حرفية مخلّة.",
    "2. الالتزام الصارم بكشكول الملخص: اعتمد في إجاباتك بشكل أساسي ومباشر على «كشكول الملخص للفصل» المرفق بالأسفل. لا تخترع أرقام سلايدات أو قوانين غير موجودة في الفصل.",
    "3. الأسئلة خارج الفصل: لو الطالب سأل سؤالاً خارج محتوى الفصل الحالي، وضّح له بلطف وبأدب إن النقطة دي مش موجودة في كشكول ملخص الفصل الحالي، واقترح عليه يرجع للفصل المناسب أو يسأل في موضوعات الفصل الحالية.",
    "4. مصيدة الامتحان (Exam Trap): كلما كان السؤال مرتبطاً بنقطة امتحان أو مصيدة شائعة مذكورة في الكشكول، أبرزها في صندوق اقتباس واضح بعنوان **مصيدة الامتحان:** عشان الطالب ميقعش فيها.",
    "5. التنسيق الهندسي الواضح:",
    "   - قسّم الإجابة لعناوين قصيرة ونقاط مرتّبة وجداول Markdown عند المقارنة.",
    "   - اكتب المعادلات والقوانين الرياضية بصيغة LaTeX (`$...$` للمعادلات داخل السطر و `$$...$$` للمعادلات المنفصلة).",
    "   - اكتب الأكواد البرمجية داخل كتل fenced code مع تحديد لغة البرمجة مثل ```cpp أو ```python.",
    "   - لو الطالب طلب اختبار سريع (MCQ)، اعرض السؤال بالاختيارات بوضوح واسأله يجاوب الأول أو اعرض الإجابة مع التعليل إذا طلبها فوراً.",
    "   - اجعل إجاباتك مركّزة، دقيقة، ومفيدة للمذاكرة السريعة بدون إطالة غير ضرورية.",
    "",
    chapterContext,
  ].join("\n");
}

/**
 * Streams a reply from Gemini (`@google/genai`) chunk-by-chunk as UTF-8 strings.
 */
export async function* streamChapterTutorReply({
  systemPrompt,
  history,
  question,
  signal,
}: StreamChapterTutorParams): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = getGeminiModel();

  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    {
      role: "user" as const,
      parts: [{ text: question }],
    },
  ];

  const stream = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.35,
      maxOutputTokens: 1600,
    },
  });

  for await (const chunk of stream) {
    if (signal?.aborted) {
      break;
    }
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}
