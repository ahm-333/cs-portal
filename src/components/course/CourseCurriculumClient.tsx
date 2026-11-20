"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Circle,
  Clock,
  GraduationCap,
  Layers,
  Lock,
  Play,
  Share2,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import {
  getCourseVisualMeta,
  splitBilingualTitle,
} from "@/lib/courseTheme";
import type {
  Course,
  CourseWithStats,
  LessonSummaryItem,
  UserProgress,
} from "@/types/database";
import {
  toggleGuestLessonCompletion,
  useGuestProgress,
} from "./guestProgress";

interface CourseCurriculumClientProps {
  course: Course;
  lessons: LessonSummaryItem[];
  allCourses: CourseWithStats[];
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

function HeroProgressRing({ percent }: { percent: number }) {
  const size = 56;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative flex h-14 w-14 shrink-0 items-center justify-center"
      aria-label={`نسبة التقدم ${clamped}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--signal)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <span
        dir="ltr"
        className="absolute font-mono text-xs font-bold text-white"
      >
        {clamped}%
      </span>
    </div>
  );
}

export function CourseCurriculumClient({
  course,
  lessons,
  allCourses,
  serverProgressMap,
  isEnrolled,
  isGuest,
}: CourseCurriculumClientProps) {
  const router = useRouter();
  const guestProgress = useGuestProgress(isGuest);
  const [copiedLink, setCopiedLink] = useState(false);

  const visual = getCourseVisualMeta(
    course.slug,
    course.title,
    course.year_level
  );
  const yearLabel = getYearLabel(course.year_level);
  const termLabel = getTermLabel(course.term);

  useEffect(() => {
    if (!copiedLink) return;
    const timeoutId = window.setTimeout(() => setCopiedLink(false), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [copiedLink]);

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
      const key = lesson.section_title?.trim() || "دروس المقرر";
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

  const totalMinutes = sortedLessons.reduce(
    (sum, l) => sum + (l.duration_minutes ?? 0),
    0
  );
  const freePreviewCount = sortedLessons.filter((l) => l.is_free_preview).length;

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
        ? "مراجعة المقرر"
        : "أكمل المذاكرة";

  async function handleCopyShareLink() {
    try {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
      setCopiedLink(true);
    } catch {
      setCopiedLink(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Bar: Breadcrumb + Share Link Button */}
      <div className="atelier-enter flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="مسار التنقل"
          className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[var(--muted)] sm:text-sm"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>العودة للرئيسية</span>
          </Link>
          <ChevronLeft className="h-4 w-4 opacity-60" />
          <span dir="ltr" className="font-bold text-[var(--ink)]">
            {visual.englishTitle}
          </span>
        </nav>

        <button
          type="button"
          onClick={handleCopyShareLink}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
            copiedLink
              ? "border-[var(--pos)] bg-[var(--pos-soft)] text-[var(--pos)]"
              : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--signal)] hover:text-[var(--signal)]"
          }`}
        >
          {copiedLink ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>تم نسخ رابط المقرر</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>مشاركة الرابط</span>
            </>
          )}
        </button>
      </div>

      {/* Swiss Academic Atelier Subject Hero */}
      <header className="studio-hero studio-hero-network atelier-enter p-6 sm:p-8">
        {/* Swiss Registration Corner Crosshairs */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-3 font-mono text-xs text-white/25"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-3 font-mono text-xs text-white/25"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3.5 font-mono text-xs text-white/25"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3.5 font-mono text-xs text-white/25"
        >
          +
        </span>

        {/* Ghosted Monograph Number Watermark */}
        <span
          aria-hidden="true"
          dir="ltr"
          className="pointer-events-none absolute left-8 top-6 hidden select-none font-mono text-7xl font-bold tracking-tighter text-white/[0.06] sm:block"
        >
          {visual.monographNumber}
        </span>

        <div className="relative z-10 space-y-6">
          {/* Top Row: Badges + Single-Chevron Non-Wrapping Course Switcher */}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <span
                dir="ltr"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white backdrop-blur-xs"
              >
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: visual.spineVar }}
                  className="h-2 w-2 rounded-full"
                />
                <span>{visual.code}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--hero-sub)]">
                <GraduationCap className="h-3.5 w-3.5 text-white" />
                <span>
                  {yearLabel} · {termLabel}
                </span>
              </span>

              {!course.is_paid ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--signal)]" />
                  <span>مجاني بالكامل</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/20 px-3 py-1 text-xs font-bold text-amber-100">
                  <Lock className="h-3.5 w-3.5" />
                  <span>مقرر مدفوع · {course.price} ج.م</span>
                </span>
              )}
            </div>

            {/* Live Course Switcher Dropdown (Strict appearance-none + whitespace-nowrap) */}
            {allCourses.length > 1 && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <label
                  htmlFor="course-switcher"
                  className="hidden whitespace-nowrap text-xs font-semibold text-[var(--hero-sub)] md:inline"
                >
                  تغيير المادة:
                </label>
                <div className="relative">
                  <select
                    id="course-switcher"
                    aria-label="تغيير المادة"
                    value={course.slug}
                    onChange={(e) => {
                      const targetSlug = e.target.value;
                      if (targetSlug && targetSlug !== course.slug) {
                        router.push(`/courses/${targetSlug}`);
                      }
                    }}
                    className="appearance-none whitespace-nowrap rounded-xl border border-white/25 bg-black/25 py-2 pl-9 pr-3.5 font-mono text-xs font-bold text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-black/35 focus:outline-none"
                  >
                    {allCourses.map((item) => {
                      const itemMeta = getCourseVisualMeta(
                        item.slug,
                        item.title,
                        item.year_level
                      );
                      return (
                        <option
                          key={item.id}
                          value={item.slug}
                          className="bg-[var(--paper)] text-[var(--ink)]"
                        >
                          {itemMeta.code} — {itemMeta.englishTitle}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/85"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Title + Description */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--hero-ink)] sm:text-4xl">
              <span dir="ltr" className="inline-block">
                {visual.englishTitle}
              </span>
            </h1>
            <p className="text-base font-semibold text-[var(--hero-sub)]">
              {visual.arabicSubtitle}
            </p>
            {course.description && (
              <p className="max-w-3xl text-sm leading-relaxed text-[var(--hero-sub)]/90">
                {course.description}
              </p>
            )}
          </div>

          {/* Bottom Row: Circular Progress Ring + Stat Chips + Signal-Copper CTA */}
          <div className="flex flex-col gap-5 border-t border-white/15 pt-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <HeroProgressRing percent={progressPercent} />

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-white">
                  التقدم في المقرر:{" "}
                  <span dir="ltr" className="font-mono text-[var(--hero-sub)]">
                    {completedLessons}/{totalLessons}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--hero-sub)]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5">
                    <BookOpen className="h-3 w-3 text-white" />
                    <span>
                      {totalLessons} {totalLessons === 1 ? "درس" : "دروس"}
                    </span>
                  </span>

                  {totalMinutes > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5">
                      <Clock className="h-3 w-3 text-white" />
                      <span>{totalMinutes} دقيقة</span>
                    </span>
                  )}

                  {course.is_paid && !isEnrolled && freePreviewCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 font-semibold text-white">
                      <Sparkles className="h-3 w-3 text-[var(--signal)]" />
                      <span>{freePreviewCount} معاينة مجانية</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {nextLesson && (
              <Link
                href={`/courses/${course.slug}/${nextLesson.id}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--signal)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-pill)] transition-all hover:brightness-110"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{ctaLabel}</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Curriculum Sections & Numbered Ledger Lesson Rows */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--ink)]">
            <Layers className="h-5 w-5 text-[var(--accent)]" />
            <span>خطة الدروس والملخصات</span>
          </h2>
          <span className="font-mono text-xs font-bold text-[var(--muted)]">
            {sections.length} {sections.length === 1 ? "وحدة" : "وحدات"} ·{" "}
            {completedLessons}/{totalLessons} مكتمل
          </span>
        </div>

        {sections.length === 0 ? (
          <div className="studio-card border-dashed p-10 text-center">
            <p className="text-sm font-bold text-[var(--ink)]">
              لم يتم إضافة دروس لهذا المقرر بعد.
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              سيتم نشر الدروس والملخصات قريباً.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section, sectionIdx) => {
              const sectionCompletedCount = section.lessons.filter(
                (l) => progressMap[l.id]?.is_completed
              ).length;

              return (
                <section key={section.sectionTitle} className="space-y-3">
                  {/* Section Title Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        dir="ltr"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--paper)] font-mono text-xs font-bold text-[var(--accent)]"
                      >
                        {String(sectionIdx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-bold text-[var(--ink)]">
                        {section.sectionTitle}
                      </h3>
                    </div>

                    <span className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-0.5 font-mono text-xs font-bold text-[var(--muted)]">
                      {sectionCompletedCount}/{section.lessons.length} مكتمل
                    </span>
                  </div>

                  {/* Numbered Ledger Lesson Rows */}
                  <div className="space-y-3">
                    {section.lessons.map((lesson) => {
                      const progress = progressMap[lesson.id];
                      const isCompleted = Boolean(progress?.is_completed);
                      const bestScore = progress?.best_quiz_score ?? null;
                      const isLocked =
                        course.is_paid && !isEnrolled && !lesson.is_free_preview;
                      const isFreePreview =
                        course.is_paid && !isEnrolled && lesson.is_free_preview;
                      const { primary, secondaryEn } = splitBilingualTitle(
                        lesson.title
                      );

                      return (
                        <article
                          key={lesson.id}
                          className="studio-card studio-card-hover monograph-card flex flex-col justify-between gap-4 p-4 pr-5 sm:flex-row sm:items-center sm:p-5 sm:pr-6"
                        >
                          {/* Subtle Spine Accent */}
                          <div
                            aria-hidden="true"
                            className="monograph-spine"
                            style={{
                              backgroundColor: isLocked
                                ? "var(--line-strong)"
                                : isCompleted
                                  ? "var(--pos)"
                                  : visual.spineVar,
                            }}
                          />

                          {/* Right Side: Index Badge + Clean Bilingual Title + Meta */}
                          <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
                            <span
                              dir="ltr"
                              style={{
                                backgroundColor: isLocked
                                  ? "var(--bg)"
                                  : visual.tintVar,
                                color: isLocked
                                  ? "var(--muted)"
                                  : "var(--tint-ink)",
                              }}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] font-mono text-sm font-bold"
                            >
                              {isLocked ? (
                                <Lock className="h-4 w-4" />
                              ) : (
                                String(lesson.order_index).padStart(2, "0")
                              )}
                            </span>

                            <div className="min-w-0 space-y-1.5">
                              <Link
                                href={`/courses/${course.slug}/${lesson.id}`}
                                className="group/title flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold text-[var(--ink)] transition-colors hover:text-[var(--accent)] sm:text-base"
                              >
                                <span>{primary}</span>
                                {secondaryEn && (
                                  <span
                                    dir="ltr"
                                    className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--muted)] transition-colors group-hover/title:border-[var(--accent)]/40 group-hover/title:text-[var(--accent)]"
                                  >
                                    {secondaryEn}
                                  </span>
                                )}
                              </Link>

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                {isLocked ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warn-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--warn)]">
                                    <Lock className="h-3 w-3" />
                                    <span>مغلق</span>
                                  </span>
                                ) : isCompleted ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--pos)]">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>مكتمل</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--muted)]">
                                    <Circle className="h-3 w-3" />
                                    <span>لم يبدأ</span>
                                  </span>
                                )}

                                {isFreePreview && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--pos)]">
                                    <Sparkles className="h-3 w-3" />
                                    <span>معاينة مجانية</span>
                                  </span>
                                )}

                                {typeof lesson.duration_minutes === "number" &&
                                  lesson.duration_minutes > 0 && (
                                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--muted)]">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{lesson.duration_minutes} دقيقة</span>
                                    </span>
                                  )}

                                {bestScore !== null && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--pos)]">
                                    <Award className="h-3 w-3" />
                                    <span>كويز: {bestScore}%</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Left Side: 1-Click Completion Toggle + Open Lesson CTA */}
                          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--line)] pt-3 sm:border-t-0 sm:pt-0">
                            {!isLocked && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleGuestLessonCompletion(lesson.id)
                                }
                                aria-pressed={isCompleted}
                                title={
                                  isCompleted
                                    ? "إلغاء تحديد كمكتمل"
                                    : "تحديد كمكتمل"
                                }
                                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
                                  isCompleted
                                    ? "border-[var(--pos)] bg-[var(--pos-soft)] text-[var(--pos)]"
                                    : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--pos)] hover:text-[var(--pos)]"
                                }`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="hidden md:inline">
                                  {isCompleted ? "تمت المذاكرة" : "تحديد كمكتمل"}
                                </span>
                              </button>
                            )}

                            <Link
                              href={`/courses/${course.slug}/${lesson.id}`}
                              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-colors ${
                                isLocked
                                  ? "border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                  : "bg-[var(--hero)] text-[var(--hero-ink)] hover:bg-[var(--hero-deep)]"
                              }`}
                            >
                              <span>{isLocked ? "عرض التفاصيل" : "فتح الشرح"}</span>
                              <ArrowLeft className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
