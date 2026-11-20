"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Binary,
  BookOpen,
  CheckCircle2,
  Cpu,
  GitBranch,
  Lock,
  Sparkles,
  Terminal,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseVisualMeta } from "@/lib/courseTheme";
import type { CourseWithStats } from "@/types/database";
import { useGuestProgress } from "./guestProgress";

interface CourseCardProps {
  course: CourseWithStats;
  lessonIds?: string[];
}

function getYearLabel(yearLevel: number): string {
  return (
    SITE_CONFIG.years.find((y) => y.value === yearLevel)?.label ??
    `الفرقة ${yearLevel}`
  );
}

function getTermLabel(term: number): string {
  return (
    SITE_CONFIG.terms.find((t) => t.value === term)?.label ?? `ترم ${term}`
  );
}

function renderSubjectIcon(slug: string) {
  if (slug.includes("data-structures")) {
    return <GitBranch className="h-5 w-5" />;
  }
  if (slug.includes("algorithm")) {
    return <Binary className="h-5 w-5" />;
  }
  if (slug.includes("operating-systems")) {
    return <Cpu className="h-5 w-5" />;
  }
  return <Terminal className="h-5 w-5" />;
}

export function CourseCard({ course, lessonIds = [] }: CourseCardProps) {
  const guestProgress = useGuestProgress(true);
  const visual = getCourseVisualMeta(course.slug, course.title, course.year_level);
  const yearLabel = getYearLabel(course.year_level);
  const termLabel = getTermLabel(course.term);

  const totalLessons =
    lessonIds.length > 0 ? lessonIds.length : course.lesson_count;

  const localCompletedCount = lessonIds.reduce(
    (sum, id) => sum + (guestProgress[id]?.is_completed ? 1 : 0),
    0
  );

  const completedCount =
    lessonIds.length > 0
      ? localCompletedCount
      : (course.completed_count ?? 0);

  const remainingCount = Math.max(0, totalLessons - completedCount);
  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
      : 0;

  return (
    <article className="studio-card studio-card-hover group relative flex h-full flex-col overflow-hidden">
      {/* Pastel Top Accent Header */}
      <div
        style={{
          backgroundColor: visual.tintVar,
          color: "var(--tint-ink)",
        }}
        className="border-b border-[var(--line)] px-5 py-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--paper)]/85 text-[var(--accent)] shadow-[var(--shadow-pill)]">
              {renderSubjectIcon(course.slug)}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                dir="ltr"
                className="rounded-lg bg-[var(--paper)]/85 px-2.5 py-0.5 font-mono text-xs font-extrabold text-[var(--ink)]"
              >
                {visual.code}
              </span>
              <span className="rounded-lg bg-[var(--paper)]/65 px-2 py-0.5 text-[11px] font-bold text-[var(--ink)]">
                {yearLabel} • {termLabel}
              </span>
            </div>
          </div>

          {/* Free / Paid Badge */}
          {!course.is_paid ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--pos)]">
              <Sparkles className="h-3 w-3" />
              <span>مجاني</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warn-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--warn)]">
              <Lock className="h-3 w-3" />
              <span>{course.price} ج.م</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
            <Link
              href={`/courses/${course.slug}`}
              className="focus:outline-none after:absolute after:inset-0"
            >
              <span dir="ltr" className="inline-block font-sans">
                {visual.englishTitle}
              </span>
            </Link>
          </h3>
          <p className="text-sm font-bold text-[var(--muted)]">
            {visual.arabicSubtitle}
          </p>
        </div>

        <p className="mt-2.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
          {course.description || visual.shortTagline}
        </p>

        {/* Live Published Progress Box */}
        <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3.5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[var(--ink)]">
              إنجاز المحتوى المنشور
            </span>
            <span
              dir="ltr"
              className={`font-mono font-extrabold ${
                progressPercent === 100
                  ? "text-[var(--pos)]"
                  : "text-[var(--accent)]"
              }`}
            >
              {progressPercent}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercent === 100
                  ? "bg-[var(--pos)]"
                  : "bg-[var(--accent)]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[var(--muted)]">
            <span className="inline-flex items-center gap-1 text-[var(--pos)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{completedCount} مكتمل</span>
            </span>
            <span>{remainingCount} متبقي</span>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--bg)]/55 px-5 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)]">
          <BookOpen className="h-4 w-4" />
          <span>
            {totalLessons} {totalLessons === 1 ? "درس" : "دروس"}
          </span>
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--accent)] transition-transform duration-200 group-hover:-translate-x-0.5 sm:text-sm">
          <span>افتح المادة</span>
          <ArrowLeft className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}
