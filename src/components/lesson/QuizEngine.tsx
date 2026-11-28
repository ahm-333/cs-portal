"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Award,
  CheckCircle2,
  Code2,
  HelpCircle,
  Keyboard,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";
import { emitToast } from "@/lib/stores/events";
import {
  addMistake,
  saveQuizScore,
  usePortalState,
} from "@/lib/stores/portalStore";
import type { Question } from "@/types/database";

interface QuizEngineProps {
  lessonId: string;
  courseId?: string;
  courseCode?: string;
  questions: Question[];
  bestScore: number | null;
  onScoreUpdate: (score: number) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;
const MUTED_ROSE = "#d96c79";
const MUTED_ROSE_SOFT = "rgba(217, 108, 121, 0.14)";

function isEnglishText(text: string): boolean {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasLatin = /[A-Za-z]/.test(text);
  return hasLatin && !hasArabic;
}

function fireQuizFinishConfetti(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    void confetti({
      particleCount: 48,
      spread: 64,
      origin: { y: 0.72 },
      colors: ["#d8b07a", "#6ec4a3", "#c25e33"],
    });
  } catch {
    // ignore canvas-confetti environment errors
  }
}

export default function QuizEngine({
  lessonId,
  courseId = "",
  courseCode = "CS",
  questions,
  bestScore,
  onScoreUpdate,
}: QuizEngineProps) {
  const portal = usePortalState();

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.order_index - b.order_index),
    [questions]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [isFinished, setIsFinished] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const totalCount = sortedQuestions.length;
  const safeIndex = totalCount > 0 ? Math.min(currentIndex, totalCount - 1) : 0;
  const currentQuestion = sortedQuestions[safeIndex] ?? null;
  const selectedOption = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : undefined;
  const hasAnswered = selectedOption !== undefined;
  const isCorrectSelection =
    Boolean(currentQuestion) &&
    hasAnswered &&
    selectedOption === currentQuestion?.correct_index;

  const currentCorrectCount = useMemo(
    () =>
      sortedQuestions.reduce(
        (acc, q) => acc + (selectedAnswers[q.id] === q.correct_index ? 1 : 0),
        0
      ),
    [sortedQuestions, selectedAnswers]
  );

  const persistQuizScore = useCallback(
    async (scorePercent: number) => {
      setIsSyncing(true);
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lesson_id: lessonId,
            best_quiz_score: scorePercent,
          }),
        });
      } catch {
        // Best-effort server sync; local portalStore already persists the score
      } finally {
        setIsSyncing(false);
      }
    },
    [lessonId]
  );

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion || hasAnswered) return;
      if (optionIndex < 0 || optionIndex >= currentQuestion.options.length) {
        return;
      }

      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionIndex,
      }));

      const isRight = optionIndex === currentQuestion.correct_index;
      if (!isRight) {
        const added = addMistake({
          courseId,
          courseCode,
          lessonId,
          q: currentQuestion.question_text,
          ansText:
            currentQuestion.options[currentQuestion.correct_index] ?? "—",
        });
        if (added) {
          emitToast("تم حفظ السؤال في بنك الأخطاء للمراجعة");
        }
      }
    },
    [currentQuestion, hasAnswered, courseId, courseCode, lessonId]
  );

  const handleNext = useCallback(() => {
    if (!hasAnswered || totalCount === 0) return;

    if (safeIndex + 1 < totalCount) {
      setCurrentIndex(safeIndex + 1);
      return;
    }

    const scorePercent = Math.round((currentCorrectCount / totalCount) * 100);
    setLastScore(scorePercent);
    setIsFinished(true);
    saveQuizScore(lessonId, scorePercent);
    onScoreUpdate(scorePercent);
    if (scorePercent >= 80) {
      fireQuizFinishConfetti();
    }
    void persistQuizScore(scorePercent);
  }, [
    hasAnswered,
    totalCount,
    safeIndex,
    currentCorrectCount,
    lessonId,
    onScoreUpdate,
    persistQuizScore,
  ]);

  // Keyboard shortcuts: A/B/C/D or 1/2/3/4 to answer, Enter/Space for Next
  useEffect(() => {
    if (isFinished || !currentQuestion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!hasAnswered) {
        const key = e.key.toUpperCase();
        const letterIdx = OPTION_LETTERS.indexOf(
          key as (typeof OPTION_LETTERS)[number]
        );
        if (letterIdx >= 0 && letterIdx < currentQuestion.options.length) {
          e.preventDefault();
          handleSelectOption(letterIdx);
          return;
        }
        const digit = Number(e.key);
        if (
          Number.isInteger(digit) &&
          digit >= 1 &&
          digit <= currentQuestion.options.length
        ) {
          e.preventDefault();
          handleSelectOption(digit - 1);
          return;
        }
      } else if (e.key === "Enter" || e.key === " ") {
        // Avoid double-triggering if user focused a button and pressed Enter/Space
        if (target?.tagName === "BUTTON") return;
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFinished, currentQuestion, hasAnswered, handleSelectOption, handleNext]);

  if (!currentQuestion) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border px-6 py-14 text-center"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        <div
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border"
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--bg-subtle)",
            color: "var(--accent-warm)",
          }}
        >
          <HelpCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">
          لا توجد أسئلة كويز لهذا الفصل حالياً
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
          ستُضاف أسئلة اختيار من متعدد لتقييم فهمك للفصل قريباً.
        </p>
      </div>
    );
  }

  const isBookmarked = portal.mistakes.some(
    (m) =>
      m.q === currentQuestion.question_text.trim() &&
      (!courseId || m.courseId === courseId)
  );

  const useTwoColOptions = currentQuestion.options.every(
    (opt) => opt.length <= 42
  );
  const isEnglishQuestion = isEnglishText(currentQuestion.question_text);

  function handleBookmarkQuestion() {
    if (!currentQuestion) return;
    const added = addMistake({
      courseId,
      courseCode,
      lessonId,
      q: currentQuestion.question_text,
      ansText: currentQuestion.options[currentQuestion.correct_index] ?? "—",
    });
    if (added) {
      emitToast("تم حفظ السؤال في بنك المراجعة ★");
    } else {
      emitToast("السؤال محفوظ بالفعل في بنك المراجعة");
    }
  }

  function handleRetake() {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setLastScore(null);
  }

  /* ==================== RESULTS VIEW ==================== */
  if (isFinished && lastScore !== null) {
    const bestStored = Math.max(bestScore ?? 0, lastScore);
    const feedbackTier =
      lastScore >= 80
        ? {
            title: "ممتاز! إتقان رائع للفصل",
            subtitle:
              "إجاباتك دقيقة جداً — أنت جاهز تماماً للانتقال للفصل التالي.",
            fg: "var(--success-fg)",
            bg: "var(--success-soft)",
          }
        : lastScore >= 60
          ? {
              title: "أداء جيد جداً",
              subtitle:
                "فهمك ممتاز لمعظم المفاهيم، راجع الأسئلة المحفوظة في بنك الأخطاء لرفع درجتك.",
              fg: "var(--brand-soft-text)",
              bg: "var(--brand-soft)",
            }
          : {
              title: "بداية جيدة — حاول مرة أخرى",
              subtitle:
                "ننصحك بمراجعة الملخص السريع وقراءة الفصل ثم إعادة الكويز.",
              fg: "var(--accent-warm-text)",
              bg: "var(--accent-warm-soft)",
            };

    return (
      <div className="space-y-5">
        <div
          className="sapphire-rim mx-auto flex max-w-2xl flex-col items-center rounded-2xl border p-6 text-center sm:p-7"
          style={{
            background: "var(--bg-canvas)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border"
            style={{
              background: feedbackTier.bg,
              borderColor:
                "color-mix(in srgb, var(--border-strong) 70%, transparent)",
              color: feedbackTier.fg,
            }}
          >
            <Award className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[var(--text-primary)] sm:text-2xl">
            {feedbackTier.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
            {feedbackTier.subtitle}
          </p>

          {/* Segmented Final Summary Bar */}
          <div className="mt-4 flex w-full items-center gap-1.5">
            {sortedQuestions.map((q) => {
              const ok = selectedAnswers[q.id] === q.correct_index;
              return (
                <span
                  key={q.id}
                  className="h-2 flex-1 rounded-full transition-colors"
                  style={{
                    background: ok ? "var(--success-fg)" : MUTED_ROSE,
                  }}
                />
              );
            })}
          </div>

          {/* Score Metrics */}
          <div className="mt-5 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            <div
              className="rounded-xl border p-3.5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <p className="text-[11.5px] font-bold text-[var(--text-muted)]">
                نتيجتك الآن
              </p>
              <p
                className="font-mono-code mt-1 text-2xl font-black"
                style={{ color: feedbackTier.fg }}
              >
                {lastScore}%
              </p>
            </div>
            <div
              className="rounded-xl border p-3.5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <p className="text-[11.5px] font-bold text-[var(--text-muted)]">
                الإجابات الصحيحة
              </p>
              <p className="font-mono-code mt-1 text-2xl font-black text-[var(--text-primary)]">
                {currentCorrectCount} / {totalCount}
              </p>
            </div>
            <div
              className="col-span-2 rounded-xl border p-3.5 sm:col-span-1"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <p className="text-[11.5px] font-bold text-[var(--text-muted)]">
                أفضل نتيجة
              </p>
              <p
                className="font-mono-code mt-1 text-2xl font-black"
                style={{ color: "var(--success-fg)" }}
              >
                {bestStored}%
              </p>
            </div>
          </div>

          {/* Per-question review */}
          <div
            className="mt-5 w-full rounded-xl border p-4 text-right"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <p className="mb-3 text-xs font-extrabold text-[var(--text-primary)]">
              ملخص إجاباتك:
            </p>
            <ul className="space-y-2.5">
              {sortedQuestions.map((q, idx) => {
                const picked = selectedAnswers[q.id];
                const ok = picked === q.correct_index;
                return (
                  <li
                    key={q.id}
                    className="flex items-start gap-2.5 text-[12.5px] text-[var(--text-primary)]"
                  >
                    {ok ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: "var(--success-fg)" }}
                      />
                    ) : (
                      <XCircle
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: MUTED_ROSE }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-extrabold">س{idx + 1}:</span>{" "}
                      <span>{q.question_text}</span>
                      {!ok ? (
                        <p
                          className="mt-0.5 text-[11.5px] font-bold"
                          style={{ color: "var(--success-fg)" }}
                        >
                          الإجابة الصح: {q.options[q.correct_index] ?? "—"}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-extrabold transition-opacity hover:opacity-92 cursor-pointer"
              style={{
                background: "var(--atelier-cta-bg)",
                color: "var(--atelier-cta-fg)",
              }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>إعادة الكويز</span>
            </button>
          </div>

          {isSyncing ? (
            <p className="mt-2.5 text-[11.5px] text-[var(--text-muted)]">
              جاري حفظ النتيجة...
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  /* ==================== ACTIVE QUESTION VIEW ==================== */
  return (
    <div className="space-y-4">
      {/* Header + Segmented Question Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span
              className="text-[11px] font-extrabold"
              style={{ color: "var(--accent-warm)" }}
            >
              كويز تثبيت الفصل
            </span>
            <h3 className="mt-0.5 text-lg font-black text-[var(--text-primary)]">
              سؤال {safeIndex + 1} من {totalCount}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-mono-code rounded-full border px-3 py-1 text-[11.5px] font-bold"
              style={{
                background: "var(--success-soft)",
                borderColor:
                  "color-mix(in srgb, var(--success-fg) 26%, transparent)",
                color: "var(--success-fg)",
              }}
            >
              {currentCorrectCount}/{totalCount} صح
            </span>
            {bestScore !== null ? (
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] font-bold"
                style={{
                  background: "var(--accent-warm-soft)",
                  borderColor:
                    "color-mix(in srgb, var(--accent-warm) 26%, transparent)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span className="font-mono-code">{bestScore}%</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Visual Segmented Question Progress Bar */}
        <div
          className="flex w-full items-center gap-1.5"
          role="progressbar"
          aria-valuenow={safeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalCount}
          aria-label="تقدم أسئلة الكويز"
        >
          {sortedQuestions.map((q, idx) => {
            const ans = selectedAnswers[q.id];
            const answered = ans !== undefined;
            const right = answered && ans === q.correct_index;
            const isCurrent = idx === safeIndex;

            let bg = "var(--bg-subtle)";
            if (answered) {
              bg = right ? "var(--success-fg)" : MUTED_ROSE;
            } else if (isCurrent) {
              bg = "var(--accent-warm)";
            }

            return (
              <span
                key={q.id}
                className="h-2 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: bg,
                  opacity: isCurrent && !answered ? 1 : answered ? 0.92 : 0.65,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <div
        className="sapphire-rim space-y-4 rounded-2xl border p-4 sm:p-5"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        <p
          dir={isEnglishQuestion ? "ltr" : undefined}
          className={`text-[15px] sm:text-[15.5px] font-extrabold leading-relaxed text-[var(--text-primary)] ${
            isEnglishQuestion ? "font-en text-left" : ""
          }`}
        >
          {currentQuestion.question_text}
        </p>

        {/* Optional LTR Code Snippet */}
        {currentQuestion.code_snippet ? (
          <div
            dir="ltr"
            className="max-w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0e13] text-[#e4ebf5]"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#13161e] px-3.5 py-1.5 text-xs font-semibold text-slate-300">
              <Code2 className="h-3.5 w-3.5 text-[#6ec4a3]" />
              <span className="font-mono-code uppercase">
                {currentQuestion.code_lang || "cpp"}
              </span>
            </div>
            <div className="max-w-full overflow-x-auto">
              <SyntaxHighlighter
                language={(currentQuestion.code_lang || "cpp").toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "0.85rem 1.1rem",
                  background: "transparent",
                  fontSize: "0.82rem",
                  lineHeight: "1.6",
                  fontFamily:
                    "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {currentQuestion.code_snippet}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : null}

        {/* Calm Atelier Option Cards */}
        <div
          className={`grid grid-cols-1 gap-2.5 ${
            useTwoColOptions ? "sm:grid-cols-2" : ""
          }`}
        >
          {currentQuestion.options.map((optionText, optionIndex) => {
            const letter =
              OPTION_LETTERS[optionIndex] ?? String(optionIndex + 1);
            const isSelected = selectedOption === optionIndex;
            const isCorrectOption =
              optionIndex === currentQuestion.correct_index;

            let borderColor = "var(--border-soft)";
            let background = "var(--bg-surface)";
            let color = "var(--text-primary)";
            let badgeBg = "var(--bg-canvas)";
            let badgeBorder = "var(--border-strong)";
            let badgeColor = "var(--text-primary)";

            if (hasAnswered) {
              if (isCorrectOption) {
                borderColor = "var(--success-fg)";
                background = "var(--success-soft)";
                color = "var(--text-primary)";
                badgeBg = "var(--success-fg)";
                badgeBorder = "var(--success-fg)";
                badgeColor = "#ffffff";
              } else if (isSelected) {
                borderColor = MUTED_ROSE;
                background = MUTED_ROSE_SOFT;
                color = "var(--text-primary)";
                badgeBg = MUTED_ROSE;
                badgeBorder = MUTED_ROSE;
                badgeColor = "#ffffff";
              } else {
                color = "var(--text-muted)";
              }
            }

            const isEngOption = isEnglishText(optionText);

            return (
              <button
                key={`${currentQuestion.id}-opt-${optionIndex}`}
                type="button"
                disabled={hasAnswered}
                dir={isEngOption ? "ltr" : undefined}
                onClick={() => handleSelectOption(optionIndex)}
                className={`group flex min-h-[50px] w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-[13px] font-bold transition-all disabled:cursor-default sm:px-4 ${
                  !hasAnswered
                    ? "cursor-pointer hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]"
                    : ""
                } ${isEngOption ? "font-en text-left" : "text-right"}`}
                style={{
                  borderColor,
                  background,
                  color,
                  opacity:
                    hasAnswered && !isCorrectOption && !isSelected ? 0.58 : 1,
                }}
              >
                <span
                  dir="ltr"
                  className="font-mono-code flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[11px] font-extrabold transition-colors"
                  style={{
                    borderColor: badgeBorder,
                    background: badgeBg,
                    color: badgeColor,
                  }}
                >
                  {letter}
                </span>
                <span className="flex-1 break-words leading-relaxed">
                  {optionText}
                </span>

                {hasAnswered && isCorrectOption ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--success-fg)" }}
                  />
                ) : null}
                {hasAnswered && isSelected && !isCorrectOption ? (
                  <XCircle
                    className="h-4 w-4 shrink-0"
                    style={{ color: MUTED_ROSE }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Calm Editorial Explanation Card */}
        {hasAnswered ? (
          <div
            className="rounded-xl border p-4 text-[13px] leading-relaxed"
            style={{
              background: isCorrectSelection
                ? "color-mix(in srgb, var(--success-soft) 55%, var(--bg-surface))"
                : "color-mix(in srgb, rgba(217, 108, 121, 0.12) 70%, var(--bg-surface))",
              borderColor: isCorrectSelection
                ? "color-mix(in srgb, var(--success-fg) 42%, var(--border-soft))"
                : "rgba(217, 108, 121, 0.42)",
              borderRightWidth: "3px",
              borderRightColor: isCorrectSelection
                ? "var(--success-fg)"
                : MUTED_ROSE,
            }}
          >
            <div
              className="flex items-center gap-1.5 font-extrabold"
              style={{
                color: isCorrectSelection ? "var(--success-fg)" : MUTED_ROSE,
              }}
            >
              {isCorrectSelection ? (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>إجابة صحيحة — أحسنت</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>
                    إجابة غير صحيحة — تم حفظ السؤال تلقائياً في بنك الأخطاء
                  </span>
                </>
              )}
            </div>
            {currentQuestion.explanation ? (
              <p className="mt-1.5 font-medium text-[var(--text-primary)]">
                {currentQuestion.explanation}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Footer Actions: Bookmark Star + Keyboard Hint + Next */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleBookmarkQuestion}
            aria-pressed={isBookmarked}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-bold transition-colors hover:border-[var(--border-strong)] cursor-pointer"
            style={{
              background: isBookmarked
                ? "var(--accent-warm-soft)"
                : "var(--bg-canvas)",
              borderColor: isBookmarked
                ? "var(--accent-warm)"
                : "var(--border-soft)",
              color: isBookmarked
                ? "var(--accent-warm-text)"
                : "var(--text-primary)",
            }}
          >
            <Star
              className="h-3.5 w-3.5"
              style={{
                color: "var(--accent-warm)",
                fill: isBookmarked ? "var(--accent-warm)" : "none",
              }}
            />
            <span>
              {isBookmarked ? "محفوظ في بنك المراجعة" : "حفظ للمراجعة"}
            </span>
          </button>

          <span
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-muted)",
            }}
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span>A–D أو 1–4 للاختيار · Enter للتالي</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasAnswered}
          className="inline-flex min-h-[42px] items-center justify-center rounded-xl px-5 py-2 text-[12.5px] font-extrabold transition-opacity hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          style={{
            background: "var(--atelier-cta-bg)",
            color: "var(--atelier-cta-fg)",
          }}
        >
          {safeIndex + 1 < totalCount
            ? "السؤال التالي ←"
            : "عرض النتيجة النهائية ←"}
        </button>
      </div>
    </div>
  );
}
