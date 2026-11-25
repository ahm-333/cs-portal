"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  AlertCircle,
  ArrowUpLeft,
  BookOpenCheck,
  Check,
  Clock,
  Copy,
  FileText,
  KeyRound,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  Square,
  Wrench,
} from "lucide-react";
import { getChapterQuickPrompts } from "@/lib/ai/quickPrompts";
import { emitToast } from "@/lib/stores/events";
import MarkdownViewer from "./MarkdownViewer";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

interface ChapterAiAssistantProps {
  courseId: string;
  courseCode: string;
  courseTitleEn: string;
  lessonId: string;
  lessonTitle: string;
  hasStructuredSummary?: boolean;
  onGoToSummary?: () => void;
  onTriggerUnlock?: () => void;
}

type BannerState =
  | null
  | {
      type: "not_configured";
      message: string;
    }
  | {
      type: "rate_limited";
      message: string;
      resetAt?: string;
    }
  | {
      type: "locked";
      message: string;
    }
  | {
      type: "error";
      message: string;
    };

const MAX_INPUT_CHARS = 1500;

function createMsgId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatResetTimeAr(iso?: string): string | null {
  if (!iso) return null;
  try {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return null;
    return new Intl.DateTimeFormat("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
    }).format(dt);
  } catch {
    return null;
  }
}

export default function ChapterAiAssistant({
  courseId,
  courseCode,
  courseTitleEn,
  lessonId,
  lessonTitle,
  hasStructuredSummary = false,
  onGoToSummary,
  onTriggerUnlock,
}: ChapterAiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);
  const [quota, setQuota] = useState<{
    remaining: number;
    limit: number;
  } | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const quickPrompts = useMemo(
    () => getChapterQuickPrompts(lessonId, lessonTitle),
    [lessonId, lessonTitle]
  );

  // Abort any in-flight stream on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Auto-scroll smoothly as messages arrive
  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: isStreaming ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, isStreaming]);

  // Auto-resize textarea height cleanly
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input]);

  const handleStopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const handleResetChat = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setMessages([]);
    setBanner(null);
    setInput("");
    textareaRef.current?.focus();
  }, []);

  const handleCopyMessage = useCallback(async (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      await navigator.clipboard.writeText(trimmed);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = trimmed;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    emitToast("تم نسخ إجابة المساعد الذكي ✓");
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1800);
  }, []);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const question = rawText.trim();
      if (!question || isStreaming) return;

      if (question.length > MAX_INPUT_CHARS) {
        emitToast(`الحد الأقصى للسؤال هو ${MAX_INPUT_CHARS} حرف.`);
        return;
      }

      setBanner(null);
      setInput("");

      // Capture clean alternating user/model prior history (excluding failed or dangling user turns)
      const cleanPrior = messages.filter(
        (m) => !m.isError && m.text.trim().length > 0
      );
      const alternatingHistory: Array<{ role: "user" | "model"; text: string }> = [];
      for (const m of cleanPrior) {
        if (alternatingHistory.length === 0) {
          if (m.role === "user") alternatingHistory.push({ role: m.role, text: m.text });
          continue;
        }
        const prev = alternatingHistory[alternatingHistory.length - 1];
        if (prev.role === m.role) {
          alternatingHistory[alternatingHistory.length - 1] = { role: m.role, text: m.text };
        } else {
          alternatingHistory.push({ role: m.role, text: m.text });
        }
      }
      while (
        alternatingHistory.length > 0 &&
        alternatingHistory[alternatingHistory.length - 1].role !== "model"
      ) {
        alternatingHistory.pop();
      }
      const historyPayload = alternatingHistory.slice(-8);

      const userMsgId = createMsgId("u");
      const assistantMsgId = createMsgId("a");

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", text: question },
        { id: assistantMsgId, role: "model", text: "" },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            lessonId,
            message: question,
            history: historyPayload,
          }),
          signal: controller.signal,
        });

        const remHeader = response.headers.get("X-AI-Remaining");
        const limitHeader = response.headers.get("X-AI-Limit");
        if (remHeader !== null && limitHeader !== null) {
          const remaining = Number(remHeader);
          const limit = Number(limitHeader);
          if (Number.isFinite(remaining) && Number.isFinite(limit)) {
            setQuota({ remaining: Math.max(0, remaining), limit });
          }
        }

        if (!response.ok) {
          let errBody: {
            code?: string;
            error?: string;
            resetAt?: string;
            limit?: number;
          } = {};
          try {
            errBody = (await response.json()) as typeof errBody;
          } catch {
            // fallback to generic message
          }

          // Remove empty placeholder assistant bubble on non-stream error
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));

          if (errBody.code === "AI_NOT_CONFIGURED" || response.status === 503) {
            // Also revert the unsent user bubble if AI isn't configured yet so the welcome + setup card stays clean
            setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
            setBanner({
              type: "not_configured",
              message:
                errBody.error ||
                "المساعد الذكي جاهز للعمل فور إضافة مفتاح GEMINI_API_KEY في إعدادات السيرفر.",
            });
            return;
          }

          if (errBody.code === "RATE_LIMIT_EXCEEDED" || response.status === 429) {
            if (typeof errBody.limit === "number") {
              setQuota({ remaining: 0, limit: errBody.limit });
            }
            setBanner({
              type: "rate_limited",
              message:
                errBody.error ||
                "وصلت للحد اليومي لأسئلة المساعد الذكي اليوم. يتجدد رصيدك تلقائياً غداً.",
              resetAt: errBody.resetAt,
            });
            return;
          }

          if (errBody.code === "LESSON_LOCKED" || response.status === 403) {
            setBanner({
              type: "locked",
              message:
                errBody.error ||
                "هذا الفصل مدفوع — فعّل المقرر أولاً لاستخدام المساعد الذكي هنا.",
            });
            return;
          }

          setBanner({
            type: "error",
            message:
              errBody.error ||
              "حصلت مشكلة مؤقتة أثناء التواصل مع المساعد الذكي. جرّب تاني بعد ثواني.",
          });
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Empty response stream");
        }

        const decoder = new TextDecoder("utf-8");
        let accumulated = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            accumulated += decoder.decode(value, { stream: true });
            const snapshot = accumulated;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, text: snapshot } : m
              )
            );
          }
        }

        // Flush any remaining UTF-8 bytes
        const tail = decoder.decode();
        if (tail) {
          accumulated += tail;
          const snapshot = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, text: snapshot } : m
            )
          );
        }

        if (!accumulated.trim()) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    text: "لم أتمكن من توليد إجابة هذه المرة — جرّب تعيد صياغة سؤالك بشكل أوضح.",
                    isError: true,
                  }
                : m
            )
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setMessages((prev) =>
            prev
              .map((m) => {
                if (m.id !== assistantMsgId) return m;
                return m.text.trim()
                  ? m
                  : {
                      ...m,
                      text: "تم إيقاف الرد بناءً على طلبك.",
                      isError: true,
                    };
              })
          );
          return;
        }

        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMsgId || m.text.trim().length > 0)
        );
        setBanner({
          type: "error",
          message:
            "تعذّر الاتصال بالسيرفر حالياً. تأكد من اتصالك بالإنترنت وجرّب تاني.",
        });
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
        setIsStreaming(false);
      }
    },
    [courseId, lessonId, isStreaming, messages]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  const charsLeft = MAX_INPUT_CHARS - input.length;
  const resetTimeLabel =
    banner?.type === "rate_limited" ? formatResetTimeAr(banner.resetAt) : null;

  return (
    <div className="flex flex-col gap-3.5 sm:gap-4">
      {/* ==================== TOP ASSISTANT HEADER ==================== */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 sm:p-4"
        style={{
          background:
            "color-mix(in srgb, var(--brand-soft) 35%, var(--bg-canvas))",
          borderColor: "var(--border-soft)",
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--hero-bg) 0%, var(--accent-warm) 100%)",
            }}
          >
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="text-[14.5px] font-black sm:text-[16px]"
                style={{ color: "var(--text-primary)" }}
              >
                الركن الخامس · المساعد الذكي
              </h2>
              <span
                className="font-mono-code rounded-md px-1.5 py-0.5 text-[10px] font-extrabold"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                {courseCode}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <BookOpenCheck className="h-3.5 w-3.5 shrink-0" />
                <span>يقرأ مباشرة من كشكول ملخص الفصل</span>
              </span>
              {hasStructuredSummary ? (
                <span
                  className="hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                  style={{
                    background: "var(--brand-soft)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  قوانين + مقارنات + مصايد الامتحان
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Quota Pill + Reset Button */}
        <div className="flex shrink-0 items-center gap-2">
          {quota ? (
            <span
              className="font-mono-code inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold"
              style={{
                background:
                  quota.remaining === 0
                    ? "var(--accent-warm-soft)"
                    : "var(--bg-surface)",
                borderColor:
                  quota.remaining === 0
                    ? "var(--accent-warm)"
                    : "var(--border-soft)",
                color:
                  quota.remaining === 0
                    ? "var(--accent-warm-text)"
                    : "var(--text-secondary)",
              }}
              title="الرصيد المتبقي لك اليوم من أسئلة المساعد الذكي"
            >
              <span>متبقي اليوم:</span>
              <strong style={{ color: "var(--text-primary)" }}>
                {quota.remaining}/{quota.limit}
              </strong>
            </span>
          ) : (
            <span
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-muted)",
              }}
            >
              <Sparkles
                className="h-3 w-3 shrink-0"
                style={{ color: "var(--accent-warm)" }}
              />
              <span>شرح بالعامية + مصطلحات EN</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetChat}
            disabled={messages.length === 0 && !banner && !isStreaming}
            className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11.5px] font-extrabold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
            title="بدء محادثة جديدة لهذا الفصل"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            <span>محادثة جديدة</span>
          </button>
        </div>
      </div>

      {/* ==================== STATUS / SETUP BANNERS ==================== */}
      {banner?.type === "not_configured" ? (
        <div
          role="status"
          className="rounded-2xl border p-4 sm:p-5"
          style={{
            background: "var(--accent-warm-soft)",
            borderColor: "var(--accent-warm)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: "var(--accent-warm)" }}
            >
              <Wrench className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <h3
                className="text-[14px] font-black"
                style={{ color: "var(--accent-warm-text)" }}
              >
                المساعد الذكي في انتظار التفعيل على السيرفر
              </h3>
              <p
                className="text-[12.5px] leading-relaxed font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {banner.message}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  dir="ltr"
                  className="font-mono-code rounded-lg border px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-secondary)",
                  }}
                >
                  GEMINI_API_KEY
                </span>
                {onGoToSummary ? (
                  <button
                    type="button"
                    onClick={onGoToSummary}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11.5px] font-extrabold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--brand-primary)" }}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>افتح كشكول الملخص الآن</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {banner?.type === "rate_limited" ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border p-4"
          style={{
            background: "var(--accent-warm-soft)",
            borderColor: "var(--accent-warm)",
            color: "var(--accent-warm-text)",
          }}
        >
          <Clock className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1 text-[12.5px] font-bold leading-relaxed">
            <div>{banner.message}</div>
            {resetTimeLabel ? (
              <div
                className="text-[11.5px]"
                style={{ color: "var(--text-secondary)" }}
              >
                موعد تجديد الرصيد اليومي القادم: {resetTimeLabel} (بتوقيتك
                المحلي)
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {banner?.type === "locked" ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
          style={{
            background: "var(--accent-warm-soft)",
            borderColor: "var(--accent-warm)",
          }}
        >
          <div className="flex items-start gap-2.5 text-[12.5px] font-bold">
            <KeyRound
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "var(--accent-warm)" }}
            />
            <span style={{ color: "var(--accent-warm-text)" }}>
              {banner.message}
            </span>
          </div>
          {onTriggerUnlock ? (
            <button
              type="button"
              onClick={onTriggerUnlock}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12px] font-extrabold text-white"
              style={{ background: "#c25e33" }}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>إدخال كود التفعيل</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {banner?.type === "error" ? (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-[12.5px] font-bold"
          style={{
            background: "var(--danger-soft)",
            borderColor: "var(--danger-fg)",
            color: "var(--danger-fg)",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{banner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="cursor-pointer rounded-lg px-2 py-0.5 text-[11px] font-extrabold underline"
          >
            إخفاء
          </button>
        </div>
      ) : null}

      {/* ==================== CHAT BODY / WELCOME STAGE ==================== */}
      <div
        className="flex min-h-[340px] max-h-[62vh] flex-col gap-4 overflow-y-auto rounded-2xl border p-3.5 sm:min-h-[390px] sm:p-5"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center py-4 text-center sm:py-6">
            <div
              className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xs"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--accent-warm)",
              }}
            >
              <Sparkles className="h-6 w-6" />
            </div>

            <h3
              className="max-w-lg text-[16px] font-black leading-snug sm:text-[18px]"
              style={{ color: "var(--text-primary)" }}
            >
              اسألني في أي نقطة داخل «{lessonTitle}»
            </h3>

            <p
              className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed sm:text-[13px]"
              style={{ color: "var(--text-secondary)" }}
            >
              أجاوبك بالعامية المصرية المبسّطة مع الحفاظ على المصطلحات الإنجليزية
              الدقيقة في{" "}
              <span className="font-en font-bold">{courseTitleEn}</span>، وبنّبهك
              على مصايد الامتحان الموجودة في كشكول الملخص.
            </p>

            {/* 4 Chapter-Specific Quick-Prompt Chips */}
            <div className="mt-5 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isStreaming}
                  onClick={() => void sendMessage(prompt)}
                  className="surface-card group flex cursor-pointer items-start justify-between gap-2.5 rounded-2xl p-3.5 text-right transition-all hover:-translate-y-0.5 hover:border-[var(--accent-warm)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span
                      className="font-mono-code mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10.5px] font-extrabold transition-colors"
                      style={{
                        background:
                          idx === 2
                            ? "var(--accent-warm-soft)"
                            : "var(--brand-soft)",
                        color:
                          idx === 2
                            ? "var(--accent-warm-text)"
                            : "var(--brand-soft-text)",
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className="text-[12.5px] font-bold leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {prompt}
                    </span>
                  </div>
                  <ArrowUpLeft
                    className="mt-1 h-4 w-4 shrink-0 opacity-50 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    style={{ color: "var(--accent-warm)" }}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              const isCurrentlyStreamingMsg =
                isStreaming && isLast && msg.role === "model";

              if (msg.role === "user") {
                return (
                  <div
                    key={msg.id}
                    className="ms-auto flex max-w-[90%] flex-col items-end sm:max-w-[78%]"
                  >
                    <div
                      className="rounded-2xl rounded-ee-md px-4 py-3 text-[13.5px] font-semibold leading-relaxed text-white shadow-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--hero-bg) 0%, var(--hero-bg-end) 100%)",
                      }}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className="me-auto w-full max-w-[98%] sm:max-w-[94%]"
                >
                  <div
                    className="surface-card overflow-hidden rounded-2xl rounded-es-md border-s-[3px]"
                    style={{
                      borderInlineStartColor: msg.isError
                        ? "var(--danger-fg)"
                        : "var(--accent-warm)",
                    }}
                  >
                    {/* Tutor Bubble Top Bar */}
                    <div
                      className="flex items-center justify-between gap-2 border-b px-3.5 py-2"
                      style={{
                        background: "var(--bg-subtle)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white"
                          style={{ background: "var(--brand-primary)" }}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                        <span
                          className="truncate text-[11.5px] font-extrabold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          المساعد الذكي · كشكول الملخص
                        </span>
                        {isCurrentlyStreamingMsg ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              background: "var(--accent-warm-soft)",
                              color: "var(--accent-warm-text)",
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 animate-pulse rounded-full"
                              style={{ background: "var(--accent-warm)" }}
                            />
                            <span>يكتب الآن...</span>
                          </span>
                        ) : null}
                      </div>

                      {msg.text.trim() && !isCurrentlyStreamingMsg ? (
                        <button
                          type="button"
                          onClick={() => void handleCopyMessage(msg.id, msg.text)}
                          className="inline-flex min-h-[30px] shrink-0 cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-bold transition-colors hover:opacity-85"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                            color:
                              copiedId === msg.id
                                ? "var(--success-fg)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>تم النسخ ✓</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>

                    {/* Tutor Content (Markdown + KaTeX + LTR Code) */}
                    <div className="p-2.5 sm:p-3.5">
                      {!msg.text.trim() && isCurrentlyStreamingMsg ? (
                        <div
                          className="flex items-center gap-2.5 px-2 py-3 text-[12.5px] font-bold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="h-2 w-2 animate-bounce rounded-full"
                              style={{
                                background: "var(--accent-warm)",
                                animationDelay: "0ms",
                              }}
                            />
                            <span
                              className="h-2 w-2 animate-bounce rounded-full"
                              style={{
                                background: "var(--brand-primary)",
                                animationDelay: "150ms",
                              }}
                            />
                            <span
                              className="h-2 w-2 animate-bounce rounded-full"
                              style={{
                                background: "var(--success-fg)",
                                animationDelay: "300ms",
                              }}
                            />
                          </span>
                          <span>جاري القراءة من كشكول الملخص وصياغة الإجابة...</span>
                        </div>
                      ) : (
                        <MarkdownViewer content={msg.text} embedded />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ==================== STICKY BOTTOM COMPOSER ==================== */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="sticky bottom-0 z-10 rounded-2xl border p-2 shadow-sm transition-colors focus-within:border-[var(--brand-primary)]"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-strong)",
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder="اسأل في أي نقطة أو مصيدة امتحان في الفصل ده... (Enter للإرسال · Shift+Enter لسطر جديد)"
            aria-label="اكتب سؤالك للمساعد الذكي"
            className="max-h-[132px] min-h-[42px] flex-1 resize-none bg-transparent px-2.5 py-2 text-[13.5px] leading-relaxed outline-none placeholder:text-[var(--text-muted)] disabled:opacity-60"
            style={{ color: "var(--text-primary)" }}
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopStreaming}
              className="inline-flex h-[42px] shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3.5 text-[12px] font-extrabold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "var(--accent-warm)" }}
              title="إيقاف توليد الإجابة"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>إيقاف</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex h-[42px] shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-4 text-[12.5px] font-extrabold text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
              style={{
                background: "var(--hero-bg)",
              }}
              title="إرسال السؤال"
            >
              <SendHorizontal className="h-4 w-4 rotate-180" />
              <span className="hidden sm:inline">إرسال</span>
            </button>
          )}
        </div>

        <div
          className="mt-1.5 flex items-center justify-between gap-2 border-t px-2 pt-1.5 text-[10.5px] font-semibold"
          style={{
            borderColor: "var(--border-soft)",
            color: "var(--text-muted)",
          }}
        >
          <span>
            إجابات المساعد مبنية على كشكول ملخص الفصل — راجع دائماً مع الملخص
            الأساسي.
          </span>
          {input.length > MAX_INPUT_CHARS - 250 ? (
            <span
              className="font-mono-code shrink-0 font-bold"
              style={{
                color:
                  charsLeft < 80 ? "var(--accent-warm)" : "var(--text-muted)",
              }}
            >
              {charsLeft} حرف متبقي
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
