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
      className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70"
    >
      {/* Course summary + progress */}
      <div className="border-b border-slate-800 p-4">
        <Link
          href={`/courses/${course.slug}`}
          onClick={onNavigate}
          className="group flex items-start gap-2.5 text-slate-100 transition-colors hover:text-indigo-300"
        >
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">فهرس المادة</p>
            <h2 className="truncate text-sm font-bold leading-snug">
              {course.title}
            </h2>
          </div>
        </Link>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              أنجزت {completedCount} من {sortedLessons.length} دروس
            </span>
            <span className="font-semibold text-emerald-400">
              {progressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections list */}
      <nav className="divide-y divide-slate-800/80">
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
                className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-start text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-slate-100"
              >
                <span className="line-clamp-2 leading-relaxed">
                  {section.sectionTitle}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-slate-400">
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
                              ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-100 shadow-sm"
                              : "border-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-800/60 hover:text-slate-100"
                          }`}
                        >
                          {isActive ? (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-2 start-0 w-1 rounded-e-full bg-indigo-500"
                            />
                          ) : null}

                          <span className="mt-0.5 shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : isItemLocked ? (
                              <Lock className="h-4 w-4 text-amber-400/90" />
                            ) : isActive ? (
                              <PlayCircle className="h-4 w-4 text-indigo-400" />
                            ) : (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-700 text-[10px] font-semibold text-slate-400 group-hover:border-slate-500">
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

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                              {item.duration_minutes ? (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{item.duration_minutes} د</span>
                                </span>
                              ) : null}

                              {course.is_paid && item.is_free_preview ? (
                                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                                  معاينة مجانية
                                </span>
                              ) : null}

                              {progress?.best_quiz_score !== null &&
                              progress?.best_quiz_score !== undefined ? (
                                <span className="inline-flex items-center gap-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
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
