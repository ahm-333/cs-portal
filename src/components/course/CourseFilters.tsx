"use client";

import { useMemo, useState } from "react";
import { BookX, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { CourseWithStats } from "@/types/database";
import { CourseCard } from "./CourseCard";

interface CourseFiltersProps {
  courses: CourseWithStats[];
  courseLessonIdsMap?: Record<string, string[]>;
}

const YEAR_OPTIONS = [
  { value: null, label: "الكل" },
  { value: 1, label: "الفرقة 1" },
  { value: 2, label: "الفرقة 2" },
  { value: 3, label: "الفرقة 3" },
  { value: 4, label: "الفرقة 4" },
] as const;

const TERM_OPTIONS = [
  { value: null, label: "الكل" },
  { value: 1, label: "ترم 1" },
  { value: 2, label: "ترم 2" },
] as const;

export function CourseFilters({
  courses,
  courseLessonIdsMap = {},
}: CourseFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedYear !== null ||
    selectedTerm !== null;

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return courses.filter((course) => {
      if (selectedYear !== null && course.year_level !== selectedYear) {
        return false;
      }
      if (selectedTerm !== null && course.term !== selectedTerm) {
        return false;
      }
      if (query.length > 0) {
        const haystack =
          `${course.title} ${course.description ?? ""} ${course.slug}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [courses, searchQuery, selectedYear, selectedTerm]);

  function resetFilters() {
    setSearchQuery("");
    setSelectedYear(null);
    setSelectedTerm(null);
  }

  return (
    <div className="space-y-6">
      {/* Paper Filter Bar */}
      <div className="studio-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 xl:max-w-md">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المادة (مثلاً: Data Structures، خوارزميات، OS...)"
              aria-label="ابحث عن مادة دراسية"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] py-2.5 pl-10 pr-10 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--paper)] focus:outline-none"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted)] transition-colors hover:bg-[var(--soft)] hover:text-[var(--ink)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Year Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="ml-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--muted)]">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>الفرقة:</span>
              </span>
              {YEAR_OPTIONS.map((option) => {
                const active = selectedYear === option.value;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedYear(option.value)}
                    aria-pressed={active}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                      active
                        ? "bg-[var(--hero)] text-white shadow-[var(--shadow-pill)]"
                        : "border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden h-5 w-px bg-[var(--line)] sm:block" />

            {/* Term Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="ml-1 text-xs font-bold text-[var(--muted)]">
                الترم:
              </span>
              {TERM_OPTIONS.map((option) => {
                const active = selectedTerm === option.value;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedTerm(option.value)}
                    aria-pressed={active}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                      active
                        ? "border border-[var(--pos)] bg-[var(--pos-soft)] text-[var(--pos)] shadow-[var(--shadow-pill)]"
                        : "border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--pos)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Meta */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3 text-xs text-[var(--muted)]">
          <span>
            عرض{" "}
            <strong className="font-mono text-[var(--ink)]">
              {filteredCourses.length}
            </strong>{" "}
            من أصل{" "}
            <strong className="font-mono text-[var(--ink)]">
              {courses.length}
            </strong>{" "}
            مادة
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 font-bold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              lessonIds={courseLessonIdsMap[course.id]}
            />
          ))}
        </div>
      ) : (
        <div className="studio-card flex flex-col items-center justify-center border-dashed px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--soft)] text-[var(--accent)]">
            <BookX className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">
            {courses.length === 0
              ? "لا توجد مواد منشورة حالياً"
              : "لا توجد مواد مطابقة للبحث"}
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-[var(--muted)]">
            {courses.length === 0
              ? "سيتم إضافة المواد الدراسية قريباً. تابعنا لمعرفة أحدث الشروحات والمعامل التفاعلية."
              : "جرّب تغيير كلمات البحث أو اختيار فرقة دراسية أخرى للوصول للمواد المتاحة."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--soft)] px-4 py-2 text-sm font-bold text-[var(--accent)] transition-colors hover:bg-[var(--soft-hover)]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>عرض جميع المواد</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
