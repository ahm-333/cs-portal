"use client";

import { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import type { Question } from "@/types/database";

interface QuizEngineProps {
  lessonId: string;
  questions: Question[];
  bestScore: number | null;
  onScoreUpdate: (score: number) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

export default function QuizEngine({
  lessonId,
  questions,
  bestScore,
  onScoreUpdate,
}: QuizEngineProps) {
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-500">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">
          لا توجد أسئلة كويز لهذا الدرس حالياً
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          ستُضاف أسئلة اختيار من متعدد لتقييم فهمك للدرس قريباً.
        </p>
      </div>
    );
  }

  const currentQuestion = sortedQuestions[currentIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];
  const hasAnswered = selectedOption !== undefined;
  const isCorrectSelection =
    hasAnswered && selectedOption === currentQuestion.correct_index;

  const progressPercent = Math.round(
    ((currentIndex + (hasAnswered ? 1 : 0)) / sortedQuestions.length) * 100
  );

  function handleSelectOption(optionIndex: number) {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
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
      // Best-effort server sync; parent/localStorage already holds the score
    } finally {
      setIsSyncing(false);
    }
  }

  function handleNext() {
    if (currentIndex + 1 < sortedQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const correctCount = sortedQuestions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correct_index ? 1 : 0);
    }, 0);

    const scorePercent = Math.round(
      (correctCount / sortedQuestions.length) * 100
    );

    setLastScore(scorePercent);
    setIsFinished(true);
    onScoreUpdate(scorePercent);
    void persistQuizScore(scorePercent);
  }

  function handleRetake() {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setLastScore(null);
  }

  if (isFinished && lastScore !== null) {
    const correctCount = sortedQuestions.filter(
      (q) => selectedAnswers[q.id] === q.correct_index
    ).length;

    const feedbackTier =
      lastScore >= 85
        ? {
            title: "ممتاز! إتقان رائع للدرس",
            subtitle:
              "إجاباتك دقيقة جداً — أنت جاهز تماماً للانتقال للدرس التالي.",
            accentClass: "text-emerald-400",
            ringClass: "border-emerald-500/40 bg-emerald-500/10",
          }
        : lastScore >= 60
          ? {
              title: "أداء جيد جداً!",
              subtitle:
                "فهمك ممتاز لمعظم المفاهيم، يمكنك مراجعة الأسئلة التي أخطأت فيها لرفع درجتك.",
              accentClass: "text-indigo-400",
              ringClass: "border-indigo-500/40 bg-indigo-500/10",
            }
          : {
              title: "بداية جيدة — حاول مرة أخرى",
              subtitle:
                "ننصحك بمراجعة الملخص وتجربة المعمل التفاعلي ثم إعادة الكويز.",
              accentClass: "text-amber-400",
              ringClass: "border-amber-500/40 bg-amber-500/10",
            };

    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div
            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${feedbackTier.ringClass}`}
          >
            <Award className={`h-8 w-8 ${feedbackTier.accentClass}`} />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-50">
            {feedbackTier.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {feedbackTier.subtitle}
          </p>

          {/* Score Pill */}
          <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-xs text-slate-400">نتيجتك الآن</p>
              <p className={`mt-1 text-2xl font-extrabold ${feedbackTier.accentClass}`}>
                {lastScore}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-xs text-slate-400">الإجابات الصحيحة</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-100">
                {correctCount} / {sortedQuestions.length}
              </p>
            </div>
            <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:col-span-1">
              <p className="text-xs text-slate-400">أفضل نتيجة محفوظة</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-400">
                {Math.max(bestScore ?? 0, lastScore)}%
              </p>
            </div>
          </div>

          {/* Per-question summary */}
          <div className="mt-6 w-full rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-start">
            <p className="mb-3 text-xs font-bold text-slate-300">
              ملخص إجاباتك:
            </p>
            <ul className="space-y-2">
              {sortedQuestions.map((q, idx) => {
                const picked = selectedAnswers[q.id];
                const ok = picked === q.correct_index;
                return (
                  <li
                    key={q.id}
                    className="flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    {ok ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-slate-200">
                        س{idx + 1}:
                      </span>{" "}
                      <span>{q.question_text}</span>
                      {!ok ? (
                        <p className="mt-0.5 text-[11px] text-emerald-300">
                          الإجابة الصحيحة:{" "}
                          {q.options[q.correct_index] ?? "—"}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
            >
              <RotateCcw className="h-4 w-4" />
              <span>إعادة الكويز</span>
            </button>
          </div>

          {isSyncing ? (
            <p className="mt-3 text-xs text-slate-500">جاري حفظ النتيجة...</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
      {/* Header + progress */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="inline-flex items-center gap-2 font-bold text-slate-200">
            <ClipboardCheck className="h-4 w-4 text-indigo-400" />
            <span>
              السؤال {currentIndex + 1} من {sortedQuestions.length}
            </span>
          </div>

          {bestScore !== null ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Trophy className="h-3.5 w-3.5" />
              <span>أفضل نتيجة: {bestScore}%</span>
            </span>
          ) : null}
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <h3 className="text-base font-bold leading-relaxed text-slate-50 sm:text-lg">
        {currentQuestion.question_text}
      </h3>

      {/* Optional code snippet */}
      {currentQuestion.code_snippet ? (
        <div
          dir="ltr"
          className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-[#14171f]"
        >
          <div className="flex items-center gap-2 border-b border-slate-800/90 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-300">
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-mono uppercase">
              {currentQuestion.code_lang || "cpp"}
            </span>
          </div>
          <div className="overflow-x-auto">
            <SyntaxHighlighter
              language={(currentQuestion.code_lang || "cpp").toLowerCase()}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "0.9rem 1.15rem",
                background: "transparent",
                fontSize: "0.85rem",
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

      {/* Options */}
      <div className="mt-5 grid grid-cols-1 gap-3">
        {currentQuestion.options.map((optionText, optionIndex) => {
          const letter =
            OPTION_LETTERS[optionIndex] ?? String(optionIndex + 1);
          const isSelected = selectedOption === optionIndex;
          const isCorrectOption = optionIndex === currentQuestion.correct_index;

          let stateClasses =
            "border-slate-800 bg-slate-950/70 text-slate-200 hover:border-indigo-500/50 hover:bg-indigo-500/10";
          let badgeClasses =
            "border-slate-700 bg-slate-900 text-slate-300 group-hover:border-indigo-500/50 group-hover:text-indigo-300";

          if (hasAnswered) {
            if (isCorrectOption) {
              stateClasses =
                "border-emerald-500/60 bg-emerald-500/15 text-emerald-100";
              badgeClasses =
                "border-emerald-500/60 bg-emerald-500/20 text-emerald-300";
            } else if (isSelected) {
              stateClasses =
                "border-rose-500/60 bg-rose-500/15 text-rose-100";
              badgeClasses = "border-rose-500/60 bg-rose-500/20 text-rose-300";
            } else {
              stateClasses =
                "border-slate-800/70 bg-slate-950/40 text-slate-500 opacity-60";
              badgeClasses = "border-slate-800 bg-slate-900/60 text-slate-500";
            }
          }

          return (
            <button
              key={`${currentQuestion.id}-opt-${optionIndex}`}
              type="button"
              disabled={hasAnswered}
              onClick={() => handleSelectOption(optionIndex)}
              className={`group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-start text-sm font-medium transition-all disabled:cursor-default sm:text-[15px] ${stateClasses}`}
            >
              <span
                dir="ltr"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-colors ${badgeClasses}`}
              >
                {letter}
              </span>
              <span className="flex-1 leading-relaxed">{optionText}</span>

              {hasAnswered && isCorrectOption ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              ) : null}
              {hasAnswered && isSelected && !isCorrectOption ? (
                <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Instant feedback + explanation */}
      {hasAnswered ? (
        <div
          className={`mt-5 rounded-xl border p-4 ${
            isCorrectSelection
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-rose-500/40 bg-rose-500/10"
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            {isCorrectSelection ? (
              <>
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300">إجابة صحيحة! أحسنت</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-400" />
                <span className="text-rose-300">إجابة غير صحيحة</span>
              </>
            )}
          </div>

          {currentQuestion.explanation ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              {currentQuestion.explanation}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Footer Action */}
      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasAnswered}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
        >
          <span>
            {currentIndex + 1 < sortedQuestions.length
              ? "السؤال التالي"
              : "عرض النتيجة النهائية"}
          </span>
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
