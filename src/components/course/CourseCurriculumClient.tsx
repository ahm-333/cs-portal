"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";
import type {
  Course,
  LessonSummaryItem,
  UserProgress,
} from "@/types/database";
import { useGuestProgress } from "./guestProgress";

interface CourseCurriculumClientProps {
  course: Course;
  lessons: LessonSummaryItem[];
  serverProgressMap: Record<string, UserProgress>;
  isEnrolled: boolean;
  isGuest: boolean;
}

interface LessonProgressView {
  is_completed: boolean;
  best_quiz_score: number | null;
}

interface LessonSectionGroup {
  sectionTitle: string;
  lessons: LessonSummaryItem[];
}

export function CourseCurriculumClient({
  course,
  lessons,
  serverProgressMap,
  isEnrolled,
  isGuest,
}: CourseCurriculumClientProps) {
  const guestProgress = useGuestProgress(isGuest);

  const progressMap = useMemo(() => {
    const merged: Record<string, LessonProgressView> = {};
    for (const [lessonId, item] of Object.entries(serverProgressMap)) {
      merged[lessonId] = {
        is_completed: item.is_completed,
        best_quiz_score: item.best_quiz_score,
      };
    }
    if (isGuest) {
      for (const [lessonId, item] of Object.entries(guestProgress)) {
        merged[lessonId] = item;
      }
    }
    return merged;
  }, [serverProgressMap, guestProgress, isGuest]);

  const sortedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.order_index - b.order_index),
    [lessons]
  );

  const sections = useMemo<LessonSectionGroup[]>(() => {
    const groupMap = new Map<string, LessonSummaryItem[]>();
    for (const lesson of sortedLessons) {
      const key = lesson.section_title?.trim() || "دروس المادة";
      const existing = groupMap.get(key);
      if (existing) {
        existing.push(lesson);
      } else {
        groupMap.set(key, [lesson]);
      }
    }
    return Array.from(groupMap.entries()).map(([sectionTitle, items]) => ({
      sectionTitle,
      lessons: items,
    }));
  }, [sortedLessons]);

  const totalLessons = sortedLessons.length;
  const completedLessons = sortedLessons.filter(
    (l) => progressMap[l.id]?.is_completed
  ).length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Determine the best target lesson for the main CTA button
  const nextLesson = useMemo(() => {
    if (sortedLessons.length === 0) return null;

    const accessibleLessons = sortedLessons.filter(
      (l) => !course.is_paid || isEnrolled || l.is_free_preview
    );
    const pool = accessibleLessons.length > 0 ? accessibleLessons : sortedLessons;
    const firstIncomplete = pool.find((l) => !progressMap[l.id]?.is_completed);
    return firstIncomplete ?? pool[0];
  }, [sortedLessons, course.is_paid, isEnrolled, progressMap]);

  const ctaLabel =
    completedLessons === 0
      ? "ابدأ المذاكرة"
      : completedLessons >= totalLessons
        ? "مراجعة المادة"
        : "أكمل المذاكرة";

  return (
    <div className="space-y-8">
      {/* Progress & Primary Action Card */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/75 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-200">
                تقدمك في المادة
              </span>
              <span className="font-mono text-sm font-extrabold text-emerald-400">
                {progressPercent}%{" "}
                <span className="font-sans text-xs font-medium text-slate-400">
                  ({completedLessons} من {totalLessons})
                </span>
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-l from-emerald-400 via-teal-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {isGuest && completedLessons > 0 && (
              <p className="text-xs text-slate-400">
                يتم حفظ تقدمك محلياً على هذا المتصفح.{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  سجّل الدخول
                </Link>{" "}
                لمزامنة تقدمك بين أجهزتك.
              </p>
            )}
          </div>

          {nextLesson && (
            <Link
              href={`/courses/${course.slug}/${nextLesson.id}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/60 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{ctaLabel}</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Curriculum Sections */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-white">
            <Layers className="h-5 w-5 text-indigo-400" />
            <span>محتوى المادة الدراسية</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {sections.length} {sections.length === 1 ? "وحدة" : "وحدات"} •{" "}
            {totalLessons} {totalLessons === 1 ? "درس" : "دروس"}
          </span>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
            <p className="text-sm font-semibold text-slate-300">
              لم يتم إضافة دروس لهذه المادة بعد.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              سيتم نشر الدروس والملخصات قريباً.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section, sectionIdx) => {
              const sectionCompletedCount = section.lessons.filter(
                (l) => progressMap[l.id]?.is_completed
              ).length;

              return (
                <section
                  key={section.sectionTitle}
                  className="overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/70"
                >
                  {/* Section Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/95 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 font-mono text-xs font-bold text-indigo-300">
                        {sectionIdx + 1}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-100">
                        {section.sectionTitle}
                      </h3>
                    </div>

                    <span className="rounded-full border border-slate-800 bg-slate-950/80 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-400">
                      {sectionCompletedCount}/{section.lessons.length} مكتمل
                    </span>
                  </div>

                  {/* Section Lessons */}
                  <ul className="divide-y divide-slate-800/70">
                    {section.lessons.map((lesson) => {
                      const progress = progressMap[lesson.id];
                      const isCompleted = Boolean(progress?.is_completed);
                      const bestScore = progress?.best_quiz_score ?? null;
                      const isLocked =
                        course.is_paid && !isEnrolled && !lesson.is_free_preview;
                      const isFreePreview =
                        course.is_paid && !isEnrolled && lesson.is_free_preview;

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/courses/${course.slug}/${lesson.id}`}
                            className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-800/45"
                          >
                            <div className="flex min-w-0 items-center gap-3.5">
                              {/* Order or Completed Icon */}
                              {isCompleted ? (
                                <span
                                  title="درس مكتمل"
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/15 text-emerald-400"
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                </span>
                              ) : isLocked ? (
                                <span
                                  title="درس مدفوع"
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/90 text-slate-500"
                                >
                                  <Lock className="h-4 w-4" />
                                </span>
                              ) : (
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/90 font-mono text-xs font-bold text-slate-300 transition-colors group-hover:border-indigo-500/40 group-hover:bg-indigo-500/15 group-hover:text-indigo-300">
                                  {String(lesson.order_index).padStart(2, "0")}
                                </span>
                              )}

                              {/* Title + Meta */}
                              <div className="min-w-0">
                                <p
                                  className={`truncate text-sm font-bold transition-colors sm:text-base ${
                                    isLocked
                                      ? "text-slate-400 group-hover:text-slate-200"
                                      : "text-slate-100 group-hover:text-indigo-300"
                                  }`}
                                >
                                  {lesson.title}
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                  {typeof lesson.duration_minutes === "number" &&
                                    lesson.duration_minutes > 0 && (
                                      <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{lesson.duration_minutes} دقيقة</span>
                                      </span>
                                    )}

                                  {bestScore !== null && (
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                                      <Award className="h-3.5 w-3.5" />
                                      <span>أعلى كويز: {bestScore}%</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Side Access Indicator */}
                            <div className="flex shrink-0 items-center gap-2">
                              {isFreePreview && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                                  <Sparkles className="h-3 w-3" />
                                  <span className="hidden sm:inline">
                                    معاينة مجانية
                                  </span>
                                  <span className="sm:hidden">معاينة</span>
                                </span>
                              )}

                              {isLocked && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                                  <Lock className="h-3 w-3" />
                                  <span className="hidden sm:inline">مغلق</span>
                                </span>
                              )}

                              {!isLocked && (
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/70 text-slate-400 transition-all group-hover:border-indigo-500/40 group-hover:bg-indigo-500/15 group-hover:text-indigo-300">
                                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
