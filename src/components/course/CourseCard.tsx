"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
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

interface ProgressRingProps {
  percent: number;
  strokeColor: string;
}

function CircularProgressRing({ percent, strokeColor }: ProgressRingProps) {
  const size = 44;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative flex h-11 w-11 shrink-0 items-center justify-center"
      aria-label={`نسبة الإنجاز ${clamped}%`}
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
          stroke="var(--line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <span
        dir="ltr"
        className="absolute font-mono text-[10px] font-bold text-[var(--ink)]"
      >
        {clamped}%
      </span>
    </div>
  );
}

export function CourseCard({ course, lessonIds = [] }: CourseCardProps) {
  const guestProgress = useGuestProgress(true);
  const visual = getCourseVisualMeta(
    course.slug,
    course.title,
    course.year_level
  );
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
    <article className="studio-card studio-card-hover monograph-card group relative flex h-full flex-col">
      {/* Editorial Monograph Spine (RTL inset-inline-start: 0, widens on hover) */}
      <div
        aria-hidden="true"
        className="monograph-spine"
        style={{ backgroundColor: visual.spineVar }}
      />

      {/* Ghosted Watermark Monograph Number in Far Corner */}
      <span
        aria-hidden="true"
        dir="ltr"
        className="pointer-events-none absolute left-5 top-3.5 select-none font-mono text-4xl font-bold tracking-tighter text-[var(--ink)] opacity-[0.06]"
      >
        {visual.monographNumber}
      </span>

      {/* Card Body */}
      <div className="relative flex flex-1 flex-col p-5 pr-6">
        {/* Top Row: Code Pill + Year/Term + Free/Paid */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              dir="ltr"
              style={{
                backgroundColor: visual.tintVar,
                color: "var(--tint-ink)",
              }}
              className="rounded-lg border border-[var(--line)] px-2.5 py-0.5 font-mono text-xs font-bold"
            >
              {visual.code}
            </span>
            <span className="text-[11px] font-semibold text-[var(--muted)]">
              {yearLabel} · {termLabel}
            </span>
          </div>

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

        {/* Title & Arabic Subtitle */}
        <div className="mt-4 space-y-1">
          <h3 className="text-xl font-bold leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
            <Link
              href={`/courses/${course.slug}`}
              className="focus:outline-none after:absolute after:inset-0"
            >
              <span dir="ltr" className="inline-block">
                {visual.englishTitle}
              </span>
            </Link>
          </h3>
          <p className="text-sm font-semibold text-[var(--muted)]">
            {visual.arabicSubtitle}
          </p>
        </div>

        {/* Description */}
        <p className="mt-2.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
          {course.description || visual.shortTagline}
        </p>

        {/* Tactile SVG Circular Progress Ring + Lesson Counts */}
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)]/80 px-3.5 py-3">
          <div className="flex items-center gap-3">
            <CircularProgressRing
              percent={progressPercent}
              strokeColor={
                progressPercent === 100 ? "var(--pos)" : visual.spineVar
              }
            />
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-[var(--ink)]">
                إنجاز المحتوى المنشور
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--muted)]">
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--pos)]">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{completedCount} مكتمل</span>
                </span>
                <span>·</span>
                <span>{remainingCount} متبقي</span>
              </div>
            </div>
          </div>

          <span className="hidden items-center gap-1 text-[11px] font-semibold text-[var(--muted)] sm:inline-flex">
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {totalLessons} {totalLessons === 1 ? "درس" : "دروس"}
            </span>
          </span>
        </div>
      </div>

      {/* Footer Divider & Action */}
      <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--bg)]/45 px-5 py-3.5 pr-6">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[var(--muted)]">
          <span
            aria-hidden="true"
            style={{ backgroundColor: visual.spineVar }}
            className="h-2 w-2 rounded-full"
          />
          <span>
            {totalLessons} {totalLessons === 1 ? "درس" : "دروس"}
          </span>
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] transition-colors group-hover:text-[var(--signal)] sm:text-sm">
          <span>افتح المقرر</span>
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1.5" />
        </span>
      </div>
    </article>
  );
}
