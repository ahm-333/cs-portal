"use client";

import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Award,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Code2,
  HelpCircle,
  RotateCcw,
  Sparkles,
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

function fireQuizConfetti(particleCount = 45, spread = 60): void {
  if (typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    void confetti({
      particleCount,
      spread,
      origin: { y: 0.72 },
      colors: ["#c25e33", "#66c7a6", "#7ca7f0"],
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

  if (sortedQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] px-6 py-14 text-center">
        <div
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border"
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--bg-subtle)",
            color: "var(--brand-primary)",
          }}
        >
          <HelpCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">
          لا توجد أسئلة كويز لهذا الدرس حالياً
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
          ستُضاف أسئلة اختيار من متعدد لتقييم فهمك للدرس قريباً.
        </p>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, sortedQuestions.length - 1);
  const currentQuestion = sortedQuestions[safeIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];
  const hasAnswered = selectedOption !== undefined;
  const isCorrectSelection =
    hasAnswered && selectedOption === currentQuestion.correct_index;

  const currentCorrectCount = sortedQuestions.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correct_index ? 1 : 0);
  }, 0);

  const isBookmarked = portal.mistakes.some(
    (m) =>
      m.q === currentQuestion.question_text.trim() &&
      (!courseId || m.courseId === courseId)
  );

  const progressPercent = Math.round(
    ((safeIndex + (hasAnswered ? 1 : 0)) / sortedQuestions.length) * 100
  );

  const useTwoColOptions = currentQuestion.options.every(
    (opt) => opt.length <= 42
  );

  function handleSelectOption(optionIndex: number) {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));

    const isRight = optionIndex === currentQuestion.correct_index;
    if (isRight) {
      fireQuizConfetti(45, 60);
    } else {
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
  }

  function handleBookmarkQuestion() {
    const added = addMistake({
      courseId,
      courseCode,
      lessonId,
      q: currentQuestion.question_text,
      ansText: currentQuestion.options[currentQuestion.correct_index] ?? "—",
    });
    if (added) {
      emitToast("تم حفظ السؤال في بنك المراجعة ⭐");
    } else {
      emitToast("السؤال محفوظ بالفعل في بنك المراجعة");
    }
  }

  async function persistQuizScore(scorePercent: number) {
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
  }

  function handleNext() {
    if (safeIndex + 1 < sortedQuestions.length) {
      setCurrentIndex(safeIndex + 1);
      return;
    }

    const scorePercent = Math.round(
      (currentCorrectCount / sortedQuestions.length) * 100
    );

    setLastScore(scorePercent);
    setIsFinished(true);
    saveQuizScore(lessonId, scorePercent);
    onScoreUpdate(scorePercent);
    if (scorePercent >= 80) {
      fireQuizConfetti(60, 72);
    }
    void persistQuizScore(scorePercent);
  }

  function handleRetake() {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setLastScore(null);
  }

  if (isFinished && lastScore !== null) {
    const bestStored = Math.max(bestScore ?? 0, lastScore);
    const feedbackTier =
      lastScore >= 85
        ? {
            title: "ممتاز! إتقان رائع للدرس",
            subtitle:
              "إجاباتك دقيقة جداً — أنت جاهز تماماً للانتقال للدرس التالي.",
            fg: "var(--success-fg)",
            bg: "var(--success-soft)",
          }
        : lastScore >= 60
          ? {
              title: "أداء جيد جداً!",
              subtitle:
                "فهمك ممتاز لمعظم المفاهيم، يمكنك مراجعة الأسئلة المحفوظة في بنك الأخطاء لرفع درجتك.",
              fg: "var(--brand-primary)",
              bg: "var(--brand-soft)",
            }
          : {
              title: "بداية جيدة — حاول مرة أخرى",
              subtitle:
                "ننصحك بمراجعة الملخص وتجربة الشرح التفاعلي ثم إعادة الكويز.",
              fg: "var(--accent-warm-text)",
              bg: "var(--accent-warm-soft)",
            };

    return (
      <div className="space-y-5">
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] p-6 text-center sm:p-7">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border"
            style={{
              background: feedbackTier.bg,
              borderColor: feedbackTier.fg,
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

          {/* Score Metrics */}
          <div className="mt-5 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5">
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
            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5">
              <p className="text-[11.5px] font-bold text-[var(--text-muted)]">
                الإجابات الصحيحة
              </p>
              <p className="font-mono-code mt-1 text-2xl font-black text-[var(--text-primary)]">
                {currentCorrectCount} / {sortedQuestions.length}
              </p>
            </div>
            <div className="col-span-2 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5 sm:col-span-1">
              <p className="text-[11.5px] font-bold text-[var(--text-muted)]">
                أفضل نتيجة محفوظة
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
          <div className="mt-5 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-4 text-right">
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
                        style={{ color: "var(--accent-warm)" }}
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
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-extrabold text-white transition-opacity hover:opacity-95"
              style={{ background: "var(--hero-bg)" }}
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

  return (
    <div className="space-y-5">
      {/* Header matching #cwPane-quiz */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span
              className="text-[11px] font-extrabold"
              style={{ color: "var(--success-fg)" }}
            >
              كويز تثبيت المقرر
            </span>
            <h3 className="mt-0.5 text-lg font-black text-[var(--text-primary)]">
              سؤال {safeIndex + 1} من {sortedQuestions.length}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-mono-code rounded-full px-3 py-1 text-[12px] font-bold"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              Score: {currentCorrectCount}/{sortedQuestions.length}
            </span>
            {bestScore !== null ? (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span className="font-mono-code">{bestScore}%</span>
              </span>
            ) : null}
          </div>
        </div>

        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--bg-subtle)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              background: "var(--accent-warm)",
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        className="space-y-4 rounded-2xl border p-5"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        <p className="text-[15px] font-extrabold leading-relaxed text-[var(--text-primary)]">
          {currentQuestion.question_text}
        </p>

        {/* Optional LTR Code Snippet */}
        {currentQuestion.code_snippet ? (
          <div
            dir="ltr"
            className="overflow-hidden rounded-xl border border-white/10 bg-[#0d131d] text-[#e4ebf5]"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#141d2b] px-3.5 py-1.5 text-xs font-semibold text-slate-300">
              <Code2 className="h-3.5 w-3.5 text-[#66c7a6]" />
              <span className="font-mono-code uppercase">
                {currentQuestion.code_lang || "cpp"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <SyntaxHighlighter
                language={(currentQuestion.code_lang || "cpp").toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "0.85rem 1.1rem",
                  background: "transparent",
                  fontSize: "0.84rem",
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

        {/* Options Grid */}
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

            if (hasAnswered) {
              if (isCorrectOption) {
                borderColor = "var(--success-fg)";
                background = "var(--success-soft)";
                color = "var(--success-fg)";
              } else if (isSelected) {
                borderColor = "var(--accent-warm)";
                background = "var(--accent-warm-soft)";
                color = "var(--accent-warm-text)";
              } else {
                color = "var(--text-muted)";
              }
            }

            return (
              <button
                key={`${currentQuestion.id}-opt-${optionIndex}`}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectOption(optionIndex)}
                className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-right text-[13px] font-bold transition-all hover:opacity-95 disabled:cursor-default"
                style={{
                  borderColor,
                  background,
                  color,
                  opacity:
                    hasAnswered && !isCorrectOption && !isSelected ? 0.65 : 1,
                }}
              >
                <span
                  dir="ltr"
                  className="font-mono-code flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[11px] font-extrabold"
                  style={{
                    borderColor: hasAnswered ? borderColor : "var(--border-strong)",
                    background: "var(--bg-canvas)",
                    color: hasAnswered ? color : "var(--text-primary)",
                  }}
                >
                  {letter}
                </span>
                <span className="flex-1 leading-relaxed">{optionText}</span>

                {hasAnswered && isCorrectOption ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--success-fg)" }}
                  />
                ) : null}
                {hasAnswered && isSelected && !isCorrectOption ? (
                  <XCircle
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--accent-warm)" }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Instant Explanation Box */}
        {hasAnswered ? (
          <div
            className="rounded-xl border p-3.5 text-[13px] leading-relaxed"
            style={{
              background: isCorrectSelection
                ? "var(--success-soft)"
                : "var(--accent-warm-soft)",
              borderColor: isCorrectSelection
                ? "var(--success-fg)"
                : "var(--accent-warm)",
              color: isCorrectSelection
                ? "var(--success-fg)"
                : "var(--accent-warm-text)",
            }}
          >
            <div className="flex items-center gap-1.5 font-extrabold">
              {isCorrectSelection ? (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>إجابة صحيحة! أحسنت</span>
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
              <p className="mt-1.5 font-semibold text-[var(--text-primary)]">
                {currentQuestion.explanation}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Footer Actions: Bookmark to Mistake Bank + Next Question */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={handleBookmarkQuestion}
          className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-bold transition-colors hover:opacity-85"
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
          {isBookmarked ? (
            <BookmarkCheck
              className="h-3.5 w-3.5"
              style={{ color: "var(--accent-warm)" }}
            />
          ) : (
            <Bookmark
              className="h-3.5 w-3.5"
              style={{ color: "var(--accent-warm)" }}
            />
          )}
          <span>
            {isBookmarked ? "محفوظ في بنك المراجعة ✓" : "حفظ في بنك المراجعة"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasAnswered}
          className="rounded-xl px-5 py-2 text-[12.5px] font-extrabold text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
          style={{ background: "var(--hero-bg)" }}
        >
          {safeIndex + 1 < sortedQuestions.length
            ? "السؤال التالي ←"
            : "عرض النتيجة النهائية ←"}
        </button>
      </div>
    </div>
  );
}
