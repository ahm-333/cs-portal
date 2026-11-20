"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Lock,
  PlayCircle,
  Trophy,
} from "lucide-react";
import { getCourseVisualMeta } from "@/lib/courseTheme";
import type { Course, LessonSummaryItem, UserProgress } from "@/types/database";

interface LessonSidebarProps {
  course: Course;
  lessons: LessonSummaryItem[];
  activeLessonId: string;
  progressMap: Record<string, UserProgress>;
  isEnrolled?: boolean;
  onNavigate?: () => void;
}

interface LessonSectionGroup {
  sectionTitle: string;
  items: LessonSummaryItem[];
}

export default function LessonSidebar({
  course,
  lessons,
  activeLessonId,
  progressMap,
  isEnrolled = false,
  onNavigate,
}: LessonSidebarProps) {
  const visual = useMemo(
    () => getCourseVisualMeta(course.slug, course.title, course.year_level),
    [course.slug, course.title, course.year_level]
  );

  const sortedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.order_index - b.order_index),
    [lessons]
  );

  const sections = useMemo<LessonSectionGroup[]>(() => {
    const groups = new Map<string, LessonSummaryItem[]>();
    for (const item of sortedLessons) {
      const key = item.section_title?.trim() || "دروس المادة";
      const existing = groups.get(key);
      if (existing) {
        existing.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
    return Array.from(groups.entries()).map(([sectionTitle, items]) => ({
      sectionTitle,
      items,
    }));
  }, [sortedLessons]);

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const completedCount = useMemo(
    () =>
      sortedLessons.filter((item) => progressMap[item.id]?.is_completed).length,
    [sortedLessons, progressMap]
  );

  const progressPercent =
    sortedLessons.length > 0
      ? Math.round((completedCount / sortedLessons.length) * 100)
      : 0;

  function toggleSection(sectionTitle: string) {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  }

  return (
    <aside
      aria-label="فهرس دروس المادة"
      className="studio-card flex flex-col overflow-hidden"
    >
      {/* Course summary + progress */}
      <div className="border-b border-[var(--line)] p-4">
        <Link
          href={`/courses/${course.slug}`}
          onClick={onNavigate}
          className="group flex items-start gap-2.5 text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          <div
            style={{ backgroundColor: visual.tintVar }}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--tint-ink)]"
          >
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span
                dir="ltr"
                className="rounded-md bg-[var(--soft)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--accent)]"
              >
                {visual.code}
              </span>
              <span className="text-[11px] font-medium text-[var(--muted)]">
                فهرس المادة
              </span>
            </div>
            <h2 className="mt-0.5 truncate text-sm font-bold leading-snug">
              {course.title}
            </h2>
          </div>
        </Link>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-[var(--muted)]">
              أنجزت {completedCount} من {sortedLessons.length} دروس
            </span>
            <span className="font-bold text-[var(--pos)]">
              {progressPercent}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--soft)]">
            <div
              className="h-full rounded-full bg-[var(--pos)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections list */}
      <nav className="divide-y divide-[var(--line)]">
        {sections.map((section, sectionIdx) => {
          const isCollapsed = Boolean(collapsedSections[section.sectionTitle]);
          const sectionCompleted = section.items.filter(
            (item) => progressMap[item.id]?.is_completed
          ).length;

          return (
            <div key={`${section.sectionTitle}-${sectionIdx}`} className="p-2.5">
              <button
                type="button"
                onClick={() => toggleSection(section.sectionTitle)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-start text-xs font-bold text-[var(--ink)] transition-colors hover:bg-[var(--bg)]"
              >
                <span className="line-clamp-2 leading-relaxed">
                  {section.sectionTitle}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
                  <span>
                    {sectionCompleted}/{section.items.length}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      isCollapsed ? "rotate-90" : ""
                    }`}
                  />
                </span>
              </button>

              {!isCollapsed ? (
                <ul className="mt-1.5 space-y-1">
                  {section.items.map((item) => {
                    const isActive = item.id === activeLessonId;
                    const progress = progressMap[item.id];
                    const isCompleted = Boolean(progress?.is_completed);
                    const isItemLocked =
                      course.is_paid && !item.is_free_preview && !isEnrolled;

                    return (
                      <li key={item.id}>
                        <Link
                          href={`/courses/${course.slug}/${item.id}`}
                          onClick={onNavigate}
                          aria-current={isActive ? "page" : undefined}
                          className={`group relative flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                            isActive
                              ? "border-[var(--accent)]/40 bg-[var(--soft)] text-[var(--accent)]"
                              : "border-transparent text-[var(--ink)] hover:border-[var(--line)] hover:bg-[var(--bg)]"
                          }`}
                        >
                          {isActive ? (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-2 start-0 w-1 rounded-e-full bg-[var(--accent)]"
                            />
                          ) : null}

                          <span className="mt-0.5 shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-[var(--pos)]" />
                            ) : isItemLocked ? (
                              <Lock className="h-4 w-4 text-[var(--warn)]" />
                            ) : isActive ? (
                              <PlayCircle className="h-4 w-4 text-[var(--accent)]" />
                            ) : (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--line-strong)] font-mono text-[10px] font-bold text-[var(--muted)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                                {item.order_index}
                              </span>
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`leading-snug ${
                                isActive ? "font-bold" : "font-medium"
                              }`}
                            >
                              {item.title}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--muted)]">
                              {item.duration_minutes ? (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{item.duration_minutes} د</span>
                                </span>
                              ) : null}

                              {course.is_paid && item.is_free_preview ? (
                                <span className="rounded-md bg-[var(--pos-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--pos)]">
                                  معاينة مجانية
                                </span>
                              ) : null}

                              {progress?.best_quiz_score !== null &&
                              progress?.best_quiz_score !== undefined ? (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-[var(--soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                                  <Trophy className="h-2.5 w-2.5" />
                                  <span>{progress.best_quiz_score}%</span>
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
