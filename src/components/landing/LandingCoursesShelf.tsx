"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  MessageSquarePlus,
  Sparkles,
  Star,
} from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { openFeedbackModal } from "@/lib/stores/events";
import { usePortalState } from "@/lib/stores/portalStore";
import type { CourseWithStats } from "@/types/database";

export interface LandingCoursesShelfProps {
  courses: CourseWithStats[];
  courseLessonIdsMap: Record<string, string[]>;
}

type ShelfTab = "all" | "ready" | "my-year" | `year-${number}`;

const YEAR_LABELS: Record<number, string> = {
  1: "الفرقة الأولى",
  2: "الفرقة الثانية",
  3: "الفرقة الثالثة",
  4: "الفرقة الرابعة",
};

function getYearLabel(year: number): string {
  return YEAR_LABELS[year] ?? `الفرقة ${year}`;
}

function formatCoursesCount(n: number): string {
  if (n === 0) return "لا توجد مقررات";
  if (n === 1) return "مقرر واحد";
  if (n === 2) return "مقرران";
  if (n >= 3 && n <= 10) return `${n} مقررات`;
  return `${n} مقرر`;
}

export function LandingCoursesShelf({
  courses,
  courseLessonIdsMap,
}: LandingCoursesShelfProps) {
  const portal = usePortalState();
  const [activeTab, setActiveTab] = useState<ShelfTab>("all");

  const hasSavedProfile =
    portal.profile.saved && portal.profile.name.length > 0;

  const readyCount = useMemo(
    () =>
      courses.filter(
        (c) =>
          (courseLessonIdsMap[c.id]?.length ?? 0) > 0 || c.lesson_count > 0
      ).length,
    [courses, courseLessonIdsMap]
  );

  const myYearCoursesCount = useMemo(() => {
    if (!hasSavedProfile) return 0;
    return courses.filter((c) => c.year_level === portal.profile.year).length;
  }, [courses, hasSavedProfile, portal.profile.year]);

  const showMyYearTab = hasSavedProfile && myYearCoursesCount > 0;

  const availableYears = useMemo(() => {
    const counts = new Map<number, number>();
    for (const course of courses) {
      counts.set(course.year_level, (counts.get(course.year_level) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, count]) => ({ year, count }));
  }, [courses]);

  const effectiveTab: ShelfTab =
    activeTab === "my-year" && !showMyYearTab ? "all" : activeTab;

  const filteredCourses = useMemo(() => {
    if (effectiveTab === "all") return courses;
    if (effectiveTab === "ready") {
      return courses.filter(
        (c) =>
          (courseLessonIdsMap[c.id]?.length ?? 0) > 0 || c.lesson_count > 0
      );
    }
    if (effectiveTab === "my-year") {
      return courses.filter((c) => c.year_level === portal.profile.year);
    }
    if (effectiveTab.startsWith("year-")) {
      const targetYear = Number(effectiveTab.slice(5));
      return courses.filter((c) => c.year_level === targetYear);
    }
    return courses;
  }, [courses, courseLessonIdsMap, effectiveTab, portal.profile.year]);

  const tabButtonBase =
    "min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl border text-[12px] sm:text-[12.5px] font-extrabold inline-flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer";

  const getTabStyle = (isActive: boolean, isWarmAccent = false) => ({
    background: isActive
      ? "var(--hero-bg)"
      : isWarmAccent
        ? "var(--accent-warm-soft)"
        : "var(--bg-surface)",
    borderColor: isActive
      ? "var(--hero-bg)"
      : isWarmAccent
        ? "var(--accent-warm)"
        : "var(--border-soft)",
    color: isActive
      ? "#ffffff"
      : isWarmAccent
        ? "var(--accent-warm-text)"
        : "var(--text-secondary)",
  });

  return (
    <section
      id="courses-picker"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-11 space-y-6"
    >
      {/* Centered Clean Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
          style={{
            background: "var(--accent-warm-soft)",
            color: "var(--accent-warm-text)",
          }}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>مقررات الكلية المنظّمة</span>
        </div>

        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          تصفّح المقررات وابدأ المذاكرة فوراً
        </h2>
        <p
          className="text-[13.5px] sm:text-[14.5px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          كل المقررات المتاحة قدامك مباشرة — صفّي حسب فرقتك أو المقررات الجاهزة
          وادخل على الفصل اللي عايزه في ثانية.
        </p>
      </div>

      {/* Filter Tabs + Secondary Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
        <div
          role="tablist"
          aria-label="تصفية المقررات"
          className="flex items-center justify-start sm:justify-center lg:justify-start gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0 sm:flex-wrap"
        >
          {showMyYearTab && (
            <button
              type="button"
              role="tab"
              aria-selected={effectiveTab === "my-year"}
              onClick={() => setActiveTab("my-year")}
              className={tabButtonBase}
              style={getTabStyle(effectiveTab === "my-year", true)}
            >
              <Star className="w-3.5 h-3.5 shrink-0" />
              <span>
                فرقتي (ف{portal.profile.year}) ({myYearCoursesCount})
              </span>
            </button>
          )}

          <button
            type="button"
            role="tab"
            aria-selected={effectiveTab === "all"}
            onClick={() => setActiveTab("all")}
            className={tabButtonBase}
            style={getTabStyle(effectiveTab === "all")}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>الكل ({courses.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={effectiveTab === "ready"}
            onClick={() => setActiveTab("ready")}
            className={tabButtonBase}
            style={getTabStyle(effectiveTab === "ready")}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>متاح الآن ({readyCount})</span>
          </button>

          {availableYears.map(({ year, count }) => {
            const tabKey: ShelfTab = `year-${year}`;
            const isActive = effectiveTab === tabKey;
            return (
              <button
                key={year}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tabKey)}
                className={tabButtonBase}
                style={getTabStyle(isActive)}
              >
                <span>
                  {getYearLabel(year)} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Sleek Secondary Link Row (Desktop/Tablet — zero clutter on mobile) */}
        <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-end gap-2">
          <span
            className="text-[11.5px] font-bold px-2.5 py-1 rounded-lg"
            style={{
              background: "var(--bg-subtle)",
              color: "var(--text-muted)",
            }}
          >
            {formatCoursesCount(filteredCourses.length)}
          </span>

          <button
            type="button"
            onClick={() => openFeedbackModal()}
            className="min-h-[38px] px-3 py-1.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors hover:border-[var(--accent-warm)] cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <MessageSquarePlus className="w-3.5 h-3.5 shrink-0" />
            <span>اقترح مادة لفرقتك</span>
          </button>

          <Link
            href="/courses"
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 transition-colors hover:border-[var(--brand-primary)]"
            style={{
              background: "var(--brand-soft)",
              borderColor: "transparent",
              color: "var(--brand-soft-text)",
            }}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>فتح مكتبة المقررات الكاملة</span>
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Always-Visible Courses Grid */}
      <div key={effectiveTab} className="animate-[paneIn_0.28s_ease_both]">
        {filteredCourses.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 ${
              filteredCourses.length === 3 || filteredCourses.length > 4
                ? "lg:grid-cols-3"
                : ""
            }`}
          >
            {filteredCourses.map((course, idx) => (
              <CourseCard
                key={course.id}
                course={course}
                lessonIds={courseLessonIdsMap[course.id] ?? []}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-3xl p-7 text-center space-y-3 max-w-xl mx-auto">
            <div
              className="w-11 h-11 rounded-2xl mx-auto flex items-center justify-center"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-primary)",
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div
              className="text-[15px] font-black"
              style={{ color: "var(--text-primary)" }}
            >
              لا توجد مقررات مطابقة لهذا الفلتر حالياً
            </div>
            <p
              className="text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              يمكنك عرض جميع المقررات المتاحة على المنصة أو اقتراح المادة التي
              تحتاجها لفرقتك.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="min-h-[40px] px-4 py-2 rounded-xl text-[12px] font-extrabold text-white cursor-pointer"
                style={{ background: "var(--hero-bg)" }}
              >
                اعرض كل المقررات ({courses.length})
              </button>
              <button
                type="button"
                onClick={() => openFeedbackModal()}
                className="min-h-[40px] px-4 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>اقترح مادة لفرقتك</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
