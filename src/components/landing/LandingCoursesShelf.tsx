"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { usePortalState } from "@/lib/stores/portalStore";
import type { CourseWithStats } from "@/types/database";

export interface LandingCoursesShelfProps {
  courses: CourseWithStats[];
  courseLessonIdsMap: Record<string, string[]>;
}

const YEAR_CARDS = [
  {
    year: 1,
    title: "الفرقة الأولى",
    sub: "التأسيس والبرمجة",
    badge: "Year 01",
  },
  {
    year: 2,
    title: "الفرقة الثانية",
    sub: "هياكل البيانات · تنظيم الحاسب · قواعد البيانات",
    badge: "Year 02",
  },
  {
    year: 3,
    title: "الفرقة الثالثة",
    sub: "نظم التشغيل · الرسوميات بالحاسب",
    badge: "Year 03",
  },
  {
    year: 4,
    title: "الفرقة الرابعة",
    sub: "المراجعة والتخرج",
    badge: "Year 04",
  },
] as const;

export function LandingCoursesShelf({
  courses,
  courseLessonIdsMap,
}: LandingCoursesShelfProps) {
  const portal = usePortalState();
  // Hidden by default until the student picks their year or clicks "show all"
  const [selection, setSelection] = useState<number | "all" | null>(null);

  const hasSavedProfile = portal.profile.saved && portal.profile.name.length > 0;

  const matchedCourses = useMemo(() => {
    if (selection === null) return [];
    if (selection === "all") return courses;
    const exact = courses.filter((c) => c.year_level === selection);
    return exact;
  }, [courses, selection]);

  const countForYear = (yr: number) =>
    courses.filter((c) => c.year_level === yr).length;

  return (
    <section
      id="courses-picker"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-7"
    >
      {/* Centered Clean Prompt Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
          style={{
            background: "var(--accent-warm-soft)",
            color: "var(--accent-warm-text)",
          }}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>مقرراتك حسب فرقتك</span>
        </div>

        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          اختار فرقتك عشان تظهرلك موادك
        </h2>
        <p
          className="text-[13.5px] sm:text-[14.5px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          من غير زحمة مواد مش بتاعتك — اضغط على فرقتك بس وهتظهرلك المقررات
          الجاهزة فوراً.
        </p>
      </div>

      {/* 4 Tactile Year Selector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {YEAR_CARDS.map((card) => {
          const isSelected = selection === card.year;
          const isMySavedYear =
            hasSavedProfile && portal.profile.year === card.year;
          const count = countForYear(card.year);

          return (
            <button
              key={card.year}
              type="button"
              onClick={() =>
                setSelection((prev) => (prev === card.year ? null : card.year))
              }
              aria-pressed={isSelected}
              className={`spotlight-card surface-card rounded-2xl p-3.5 sm:p-5 text-right flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer hover:-translate-y-1 ${
                isSelected ? "ring-2 ring-[var(--accent-warm)]/35" : ""
              }`}
              style={{
                background: isSelected ? "var(--hero-bg)" : "var(--bg-surface)",
                borderColor: isSelected
                  ? "var(--hero-bg)"
                  : isMySavedYear
                    ? "var(--accent-warm)"
                    : "var(--border-soft)",
                color: isSelected ? "#ffffff" : "var(--text-primary)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 w-full">
                <span
                  className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shrink-0"
                  style={{
                    background: isSelected
                      ? "rgba(255,255,255,0.14)"
                      : "var(--bg-subtle)",
                    color: isSelected ? "#fed7aa" : "var(--brand-primary)",
                  }}
                >
                  {card.badge}
                </span>

                {isMySavedYear ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                    style={{
                      background: isSelected
                        ? "rgba(102,199,166,0.22)"
                        : "var(--accent-warm-soft)",
                      color: isSelected
                        ? "#a7f3d0"
                        : "var(--accent-warm-text)",
                    }}
                  >
                    <Star className="w-2.5 h-2.5 shrink-0" />
                    <span>فرقتك</span>
                  </span>
                ) : (
                  <span
                    className="font-mono-code text-[10.5px] font-bold"
                    style={{
                      color: isSelected
                        ? "rgba(226,232,240,0.8)"
                        : "var(--text-muted)",
                    }}
                  >
                    {count > 0 ? `${count} مقررات` : "قريباً"}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <div className="text-[15px] sm:text-[16.5px] font-black">
                  {card.title}
                </div>
                <div
                  className="text-[11.5px] font-semibold"
                  style={{
                    color: isSelected
                      ? "rgba(226,232,240,0.8)"
                      : "var(--text-muted)",
                  }}
                >
                  {card.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Subtle Secondary Row: Show All or Full Library */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() =>
            setSelection((prev) => (prev === "all" ? null : "all"))
          }
          className="min-h-[40px] px-4 py-2 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{
            background:
              selection === "all" ? "var(--brand-soft)" : "var(--bg-surface)",
            borderColor:
              selection === "all"
                ? "var(--brand-primary)"
                : "var(--border-soft)",
            color:
              selection === "all"
                ? "var(--brand-soft-text)"
                : "var(--text-secondary)",
          }}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>
            {selection === "all"
              ? "إخفاء جميع المقررات"
              : `استعراض كل المقررات المتاحة (${courses.length})`}
          </span>
        </button>

        {selection !== null && (
          <button
            type="button"
            onClick={() => setSelection(null)}
            className="min-h-[40px] px-3 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1 cursor-pointer"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-muted)",
            }}
          >
            <X className="w-3.5 h-3.5" />
            <span>إخفاء</span>
          </button>
        )}
      </div>

      {/* ON-DEMAND COURSES REVEAL (Only renders once the student makes a choice!) */}
      {selection !== null && (
        <div
          key={String(selection)}
          className="pt-2 space-y-4 animate-[paneIn_0.34s_ease_both]"
        >
          {matchedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {matchedCourses.map((course, idx) => (
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
                مقررات الفرقة {selection} قيد التجهيز حالياً
              </div>
              <p
                className="text-[12.5px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                تقدر تبدأ دلوقتي بالتأسيس والمراجعة من المقررات المتاحة حالياً
                (هياكل البيانات، الخوارزميات، ونظم التشغيل).
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelection("all")}
                  className="min-h-[40px] px-4 py-2 rounded-xl text-[12px] font-extrabold text-white cursor-pointer"
                  style={{ background: "var(--hero-bg)" }}
                >
                  اعرض كل المقررات المتاحة
                </button>
                <Link
                  href="/courses"
                  className="min-h-[40px] px-4 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>فتح مكتبة المقررات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
