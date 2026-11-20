"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Lock,
  PencilLine,
  Play,
  Sparkles,
  TrendingUp,
  UserCircle2,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseVisualMeta } from "@/lib/courseTheme";
import type {
  DashboardCourseProgress,
  DashboardData,
  LessonSummaryItem,
} from "@/types/database";
import { useLocalProfile } from "@/components/layout/localProfile";
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
  const localProfile = useLocalProfile();
  const localProgress = useGuestProgress(!data.currentUser);

  const computed = useMemo(() => {
    if (data.currentUser || Object.keys(localProgress).length === 0) {
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
          const entry = localProgress[lesson.id];
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
          pool.find((l) => !localProgress[l.id]?.is_completed) ?? pool[0];

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
  }, [data, courseLessonsMap, localProgress]);

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
    localProfile?.full_name ||
    data.currentUser?.full_name?.trim() ||
    data.currentUser?.email?.split("@")[0] ||
    null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
            <TrendingUp className="h-4 w-4" />
            <span>كمّل رحلتك الدراسية</span>
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
            {displayName ? `أهلاً بك، ${displayName}` : "لوحة مذاكرتي"}
          </h1>

          {localProfile ? (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1 text-xs font-bold text-[var(--ink)]">
                <GraduationCap className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>{getYearLabel(localProfile.year_level)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pos-soft)] px-2.5 py-1 text-xs font-bold text-[var(--pos)]">
                <Cpu className="h-3.5 w-3.5" />
                <span dir="ltr" className="font-mono">
                  {localProfile.department}
                </span>
              </span>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                <PencilLine className="h-3.5 w-3.5" />
                <span>تعديل الملف</span>
              </Link>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              تابع إنجازك في كل مادة، متوسط درجاتك في الكويزات، وأكمل مباشرة من
              حيث توقفت.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {!localProfile && (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--soft)] px-4 py-2.5 text-xs font-bold text-[var(--accent)] transition-colors hover:bg-[var(--soft-hover)]"
            >
              <UserCircle2 className="h-4 w-4" />
              <span>إعداد ملف الطالب</span>
            </Link>
          )}

          <Link
            href="/#courses"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <BookOpen className="h-4 w-4 text-[var(--accent)]" />
            <span>تصفح كل المواد</span>
          </Link>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <section
        aria-label="ملخص الإحصائيات"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {/* Completed Lessons */}
        <div className="studio-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)]">
              الدروس المكتملة
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pos-soft)] text-[var(--pos)]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              dir="ltr"
              className="font-mono text-3xl font-extrabold text-[var(--ink)]"
            >
              {computed.totalCompletedLessons}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)]">
              من أصل {computed.totalLessonsAcrossEnrolled} درس
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className="h-full rounded-full bg-[var(--pos)] transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Average Quiz Score */}
        <div className="studio-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)]">
              متوسط درجات الكويزات
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
              <Award className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              dir="ltr"
              className="font-mono text-3xl font-extrabold text-[var(--ink)]"
            >
              {computed.overallAverageQuizScore !== null
                ? `${computed.overallAverageQuizScore}%`
                : "—"}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {computed.overallAverageQuizScore !== null
                ? "أداء ممتاز، استمر!"
                : "لم تحل أي كويز بعد"}
            </span>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            يُحتسب المتوسط تلقائياً من أعلى درجة حققتها في كل كويز.
          </p>
        </div>

        {/* Active Courses */}
        <div className="studio-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)]">
              المواد الدراسية
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--tint-sky)] text-[var(--accent)]">
              <GraduationCap className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              dir="ltr"
              className="font-mono text-3xl font-extrabold text-[var(--ink)]"
            >
              {activeCoursesCount}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)]">
              قيد المذاكرة من أصل {computed.courses.length} مادة
            </span>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            نسبة الإنجاز الكلية:{" "}
            <strong dir="ltr" className="font-mono text-[var(--pos)]">
              {overallPercent}%
            </strong>
          </p>
        </div>
      </section>

      {/* Per-Course Progress List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[var(--ink)]">
            تقدمك في المواد
          </h2>
          <span className="text-xs font-bold text-[var(--muted)]">
            {computed.courses.length}{" "}
            {computed.courses.length === 1 ? "مادة" : "مواد"}
          </span>
        </div>

        {computed.courses.length === 0 ? (
          <div className="studio-card flex flex-col items-center justify-center border-dashed px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--soft)] text-[var(--accent)]">
              <BookOpen className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">
              لا توجد مواد في لوحة مذاكرتك بعد
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-[var(--muted)]">
              ابدأ بتصفح المواد الدراسية المتاحة واختر أول درس لتسجيل تقدمك هنا.
            </p>
            <Link
              href="/#courses"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--hero)] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--hero-deep)]"
            >
              <span>تصفح المواد</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {computed.courses.map((item) => {
              const visual = getCourseVisualMeta(
                item.course.slug,
                item.course.title,
                item.course.year_level
              );
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
                  className="studio-card studio-card-hover flex flex-col justify-between overflow-hidden"
                >
                  {/* Pastel Header Strip */}
                  <div
                    style={{
                      backgroundColor: visual.tintVar,
                      color: "var(--tint-ink)",
                    }}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-5 py-3.5"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        dir="ltr"
                        className="rounded-md bg-[var(--paper)]/85 px-2 py-0.5 font-mono text-[11px] font-extrabold text-[var(--ink)]"
                      >
                        {visual.code}
                      </span>
                      <span className="rounded-md bg-[var(--paper)]/65 px-2 py-0.5 text-[11px] font-bold text-[var(--ink)]">
                        {getYearLabel(item.course.year_level)} •{" "}
                        {getTermLabel(item.course.term)}
                      </span>
                    </div>

                    {!item.course.is_paid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--pos)]">
                        <Sparkles className="h-3 w-3" />
                        <span>مجاني</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warn-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--warn)]">
                        <Lock className="h-3 w-3" />
                        <span>{item.course.price} ج.م</span>
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-extrabold text-[var(--ink)]">
                      <Link
                        href={`/courses/${item.course.slug}`}
                        className="transition-colors hover:text-[var(--accent)]"
                      >
                        <span dir="ltr" className="inline-block">
                          {visual.englishTitle}
                        </span>
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">
                      {visual.arabicSubtitle}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--ink)]">
                          {item.completedLessons} من {item.totalLessons} دروس
                          مكتملة
                        </span>
                        <span
                          dir="ltr"
                          className={`font-mono font-extrabold ${
                            percent === 100
                              ? "text-[var(--pos)]"
                              : "text-[var(--accent)]"
                          }`}
                        >
                          {percent}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line)]">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percent === 100
                              ? "bg-[var(--pos)]"
                              : "bg-[var(--accent)]"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--bg)]/55 px-5 py-3.5">
                    <div className="text-xs font-bold text-[var(--muted)]">
                      {item.averageQuizScore !== null ? (
                        <span className="inline-flex items-center gap-1.5 text-[var(--pos)]">
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
                        className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        المنهج
                      </Link>
                      <Link
                        href={resumeHref}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--hero)] px-3.5 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[var(--hero-deep)]"
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
