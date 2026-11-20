"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Lock,
  LogIn,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import type {
  DashboardCourseProgress,
  DashboardData,
  LessonSummaryItem,
} from "@/types/database";
import { useGuestProgress } from "./guestProgress";

interface DashboardClientProps {
  data: DashboardData;
  courseLessonsMap: Record<string, LessonSummaryItem[]>;
}

function getYearLabel(yearLevel: number): string {
  return (
    SITE_CONFIG.years.find((y) => y.value === yearLevel)?.label ??
    `الفرقة ${yearLevel}`
  );
}

function getTermLabel(term: number): string {
  return (
    SITE_CONFIG.terms.find((t) => t.value === term)?.label ?? `الترم ${term}`
  );
}

export function DashboardClient({
  data,
  courseLessonsMap,
}: DashboardClientProps) {
  const isGuestOrDemo = data.isDemoMode || !data.currentUser;
  const guestProgress = useGuestProgress(isGuestOrDemo);

  const computed = useMemo(() => {
    if (!isGuestOrDemo || Object.keys(guestProgress).length === 0) {
      return {
        courses: data.courses,
        totalCompletedLessons: data.totalCompletedLessons,
        totalLessonsAcrossEnrolled: data.totalLessonsAcrossEnrolled,
        overallAverageQuizScore: data.overallAverageQuizScore,
      };
    }

    let totalCompleted = 0;
    let totalLessons = 0;
    const allQuizScores: number[] = [];

    const enrichedCourses: DashboardCourseProgress[] = data.courses.map(
      (item) => {
        const lessons = courseLessonsMap[item.course.id] ?? [];
        const sortedLessons = [...lessons].sort(
          (a, b) => a.order_index - b.order_index
        );
        const lessonCount =
          sortedLessons.length > 0 ? sortedLessons.length : item.totalLessons;

        let completedCount = 0;
        const courseScores: number[] = [];

        for (const lesson of sortedLessons) {
          const entry = guestProgress[lesson.id];
          if (entry?.is_completed) {
            completedCount += 1;
          }
          if (
            entry?.best_quiz_score !== null &&
            entry?.best_quiz_score !== undefined
          ) {
            courseScores.push(entry.best_quiz_score);
            allQuizScores.push(entry.best_quiz_score);
          }
        }

        const accessibleLessons = sortedLessons.filter(
          (l) => !item.course.is_paid || l.is_free_preview
        );
        const pool =
          accessibleLessons.length > 0 ? accessibleLessons : sortedLessons;
        const nextLesson =
          pool.find((l) => !guestProgress[l.id]?.is_completed) ?? pool[0];

        totalCompleted += completedCount;
        totalLessons += lessonCount;

        const averageQuizScore =
          courseScores.length > 0
            ? Math.round(
                courseScores.reduce((sum, score) => sum + score, 0) /
                  courseScores.length
              )
            : null;

        return {
          ...item,
          totalLessons: lessonCount,
          completedLessons: completedCount,
          averageQuizScore,
          nextLessonId: nextLesson?.id ?? item.nextLessonId,
        };
      }
    );

    const overallAverageQuizScore =
      allQuizScores.length > 0
        ? Math.round(
            allQuizScores.reduce((sum, score) => sum + score, 0) /
              allQuizScores.length
          )
        : null;

    return {
      courses: enrichedCourses,
      totalCompletedLessons: totalCompleted,
      totalLessonsAcrossEnrolled: totalLessons,
      overallAverageQuizScore,
    };
  }, [data, courseLessonsMap, guestProgress, isGuestOrDemo]);

  const overallPercent =
    computed.totalLessonsAcrossEnrolled > 0
      ? Math.round(
          (computed.totalCompletedLessons /
            computed.totalLessonsAcrossEnrolled) *
            100
        )
      : 0;

  const activeCoursesCount = computed.courses.filter(
    (c) => c.completedLessons > 0
  ).length;

  const displayName =
    data.currentUser?.full_name?.trim() ||
    data.currentUser?.email?.split("@")[0] ||
    null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400">
            <TrendingUp className="h-4 w-4" />
            <span>متابعة التقدم الأكاديمي</span>
          </span>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {displayName ? `أهلاً بك، ${displayName}` : "لوحة مذاكرتي"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            تابع إنجازك في كل مادة، متوسط درجاتك في الكويزات، وأكمل مباشرة من
            حيث توقفت.
          </p>
        </div>

        <Link
          href="/#courses"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:border-indigo-500/40 hover:text-white sm:self-auto"
        >
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span>تصفح كل المواد</span>
        </Link>
      </header>

      {/* Demo / Guest Sync Banner */}
      {isGuestOrDemo && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
            <div className="space-y-0.5 text-xs leading-relaxed text-indigo-100/90 sm:text-sm">
              <p className="font-bold text-white">
                {data.isDemoMode
                  ? "وضع العرض التجريبي مفعّل"
                  : "أنت تتصفح كزائر حالياً"}
              </p>
              <p className="text-slate-300">
                {data.isDemoMode
                  ? "يتم عرض وحفظ تقدمك في الدروس والكويزات محلياً في متصفحك مباشرة لتجربة المنصة بالكامل."
                  : "تقدمك الحالي محفوظ على هذا المتصفح فقط. سجّل الدخول لمزامنة درجاتك وإنجازك بين أجهزتك."}
              </p>
            </div>
          </div>

          {!data.isDemoMode && (
            <Link
              href="/login"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-500"
            >
              <LogIn className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>
      )}

      {/* KPI Summary Cards */}
      <section
        aria-label="ملخص الإحصائيات"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {/* Completed Lessons */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/75 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              الدروس المكتملة
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-white">
              {computed.totalCompletedLessons}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              من أصل {computed.totalLessonsAcrossEnrolled} درس
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Average Quiz Score */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/75 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              متوسط درجات الكويزات
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
              <Award className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-white">
              {computed.overallAverageQuizScore !== null
                ? `${computed.overallAverageQuizScore}%`
                : "—"}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {computed.overallAverageQuizScore !== null
                ? "أداء ممتاز، استمر!"
                : "لم تحل أي كويز بعد"}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            يُحتسب المتوسط تلقائياً من أعلى درجة حققتها في كل كويز.
          </p>
        </div>

        {/* Courses Progress */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/75 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              المواد الدراسية
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
              <GraduationCap className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-white">
              {activeCoursesCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              قيد المذاكرة من أصل {computed.courses.length} مادة
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            نسبة الإنجاز الكلية:{" "}
            <strong className="font-mono text-emerald-400">
              {overallPercent}%
            </strong>
          </p>
        </div>
      </section>

      {/* Per-Course Progress List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">تقدمك في المواد</h2>
          <span className="text-xs font-semibold text-slate-400">
            {computed.courses.length}{" "}
            {computed.courses.length === 1 ? "مادة" : "مواد"}
          </span>
        </div>

        {computed.courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400">
              <BookOpen className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-200">
              لا توجد مواد في لوحة مذاكرتك بعد
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-slate-400">
              ابدأ بتصفح المواد الدراسية المتاحة واختر أول درس لتسجيل تقدمك هنا.
            </p>
            <Link
              href="/#courses"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
            >
              <span>تصفح المواد</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {computed.courses.map((item) => {
              const percent =
                item.totalLessons > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (item.completedLessons / item.totalLessons) * 100
                      )
                    )
                  : 0;

              const resumeHref = item.nextLessonId
                ? `/courses/${item.course.slug}/${item.nextLessonId}`
                : `/courses/${item.course.slug}`;

              const ctaText =
                item.completedLessons === 0
                  ? "ابدأ المذاكرة"
                  : percent >= 100
                    ? "مراجعة المادة"
                    : "أكمل من حيث توقفت";

              return (
                <article
                  key={item.course.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/75 p-5 transition-colors hover:border-indigo-500/40"
                >
                  <div>
                    {/* Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-300">
                          {getYearLabel(item.course.year_level)}
                        </span>
                        <span className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
                          {getTermLabel(item.course.term)}
                        </span>
                      </div>

                      {!item.course.is_paid ? (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                          مجاني
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                          <Lock className="h-3 w-3" />
                          <span>{item.course.price} ج.م</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-lg font-extrabold text-slate-100">
                      <Link
                        href={`/courses/${item.course.slug}`}
                        className="transition-colors hover:text-indigo-300"
                      >
                        {item.course.title}
                      </Link>
                    </h3>

                    {/* Progress bar */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-400">
                          {item.completedLessons} من {item.totalLessons} دروس
                          مكتملة
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          {percent}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-indigo-500 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/70 pt-4">
                    <div className="text-xs font-semibold text-slate-400">
                      {item.averageQuizScore !== null ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400">
                          <Award className="h-4 w-4" />
                          <span>متوسط الكويز: {item.averageQuizScore}%</span>
                        </span>
                      ) : (
                        <span>لم تُحل كويزات بعد</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${item.course.slug}`}
                        className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
                      >
                        المنهج
                      </Link>
                      <Link
                        href={resumeHref}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-500"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{ctaText}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
