"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Moon,
  Play,
  Search,
  Star,
  Sun,
  X,
} from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { BrandName } from "@/components/layout/BrandName";
import { Footer } from "@/components/layout/Footer";
import { PomodoroTimer } from "@/components/layout/PomodoroTimer";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { openFeedbackModal } from "@/lib/stores/events";
import { usePortalState } from "@/lib/stores/portalStore";
import type { CourseWithStats } from "@/types/database";

export interface CoursesHubClientProps {
  courses: CourseWithStats[];
  courseLessonIdsMap: Record<string, string[]>;
  totalLessons: number;
}

type PriceFilter = "all" | "free" | "paid";

export function CoursesHubClient({
  courses,
  courseLessonIdsMap,
}: CoursesHubClientProps) {
  const portal = usePortalState();
  const theme = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [myYearOnly, setMyYearOnly] = useState(false);

  const hasSavedProfile = portal.profile.saved && portal.profile.name.length > 0;

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(courses.map((c) => c.year_level))).sort(
      (a, b) => a - b
    );
    return years.length > 0 ? years : [2, 3];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      if (myYearOnly && hasSavedProfile && c.year_level !== portal.profile.year) {
        return false;
      }
      if (!myYearOnly && yearFilter !== "all" && String(c.year_level) !== yearFilter) {
        return false;
      }
      if (priceFilter === "free" && c.is_paid) {
        return false;
      }
      if (priceFilter === "paid" && !c.is_paid) {
        return false;
      }
      if (q) {
        const haystack = `${c.title} ${c.title_en} ${c.code} ${c.description ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [
    courses,
    search,
    myYearOnly,
    hasSavedProfile,
    portal.profile.year,
    yearFilter,
    priceFilter,
  ]);

  const lastVisited = portal.lastVisited;

  function resetAllFilters() {
    setSearch("");
    setYearFilter("all");
    setPriceFilter("all");
    setMyYearOnly(false);
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen">
      {/* Elevated Pro Studio Topbar */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl shadow-[0_1px_16px_rgba(18,28,45,0.05)]"
        style={{
          background: isDark
            ? "rgba(20, 27, 37, 0.90)"
            : "rgba(255, 255, 255, 0.90)",
          borderColor: "var(--border-soft)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Right (RTL Start): Founder Avatar + ENG. AHMED AMIR */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 group"
            title="العودة للرئيسية"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-[1.5px] ring-[#c25e33] shrink-0 shadow-xs">
              <Image
                src="/images/founder.jpg"
                alt="ENG. AHMED AMIR"
                fill
                sizes="32px"
                className="object-cover object-[50%_15%]"
              />
            </div>
            <BrandName size="md" className="truncate" />
          </Link>

          {/* Center: Clean App Navigation Tabs */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-1 p-1 rounded-full border"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
            }}
          >
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-colors hover:text-[var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              الرئيسية
            </Link>
            <span
              className="px-3.5 py-1.5 rounded-full text-[12px] font-extrabold shadow-xs"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            >
              المقررات
            </span>
          </nav>

          {/* Left (RTL End): Pro Pomodoro + Theme Circle */}
          <div className="flex items-center gap-2 shrink-0">
            <PomodoroTimer className="hidden sm:inline-flex" />

            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border inline-flex items-center justify-center transition-all hover:border-[var(--border-strong)] cursor-pointer shrink-0 shadow-xs"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
              title="تبديل المظهر"
              aria-label="تبديل المظهر"
            >
              {isDark ? (
                <Sun
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--accent-warm)" }}
                />
              ) : (
                <Moon
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content — Pure, Distraction-Free Course Library */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-9 space-y-5 sm:space-y-6">
        {/* Mobile Quick Navigation Tabs (< md) */}
        <nav
          aria-label="التنقل السريع للموبايل"
          className="md:hidden grid grid-cols-2 gap-1 p-1 rounded-2xl border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
          }}
        >
          <Link
            href="/"
            className="min-h-[38px] rounded-xl flex items-center justify-center text-[12px] font-bold transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            الرئيسية
          </Link>
          <span
            className="min-h-[38px] rounded-xl flex items-center justify-center text-[12px] font-extrabold shadow-xs"
            style={{
              background: "var(--hero-bg)",
              color: "#ffffff",
            }}
          >
            المقررات
          </span>
        </nav>

        {/* Clean Minimal Page Title + Optional Resume Pill */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            {hasSavedProfile && (
              <div
                className="text-[12px] font-extrabold tracking-wide"
                style={{ color: "var(--accent-warm)" }}
              >
                أهلاً يا {portal.profile.name} · الفرقة {portal.profile.year}{" "}
                <span className="font-en">({portal.profile.dept})</span>
              </div>
            )}
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              مكتبة المقررات
            </h1>
          </div>

          {lastVisited && (
            <Link
              href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
              className="group self-start sm:self-auto inline-flex items-center gap-2.5 pl-3.5 pr-2 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 shadow-xs"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ background: "#c25e33" }}
              >
                <Play className="w-3 h-3 fill-white ml-0.5" />
              </span>
              <span className="text-[12px] font-extrabold truncate max-w-[200px]">
                أكمل:{" "}
                <span className="font-mono-code">{lastVisited.courseCode}</span>
              </span>
              <ArrowLeft
                className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5"
                style={{ color: "var(--accent-warm)" }}
              />
            </Link>
          )}
        </section>

        {/* Clean Single-Toolbar Search & Filters */}
        <section className="surface-card rounded-2xl p-4 space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search
                className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                dir="rtl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم المادة أو الكود، مثل: CS-213"
                className="w-full min-h-[40px] pr-10 pl-9 py-2 rounded-xl border text-[13px] outline-none focus:ring-2"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
              {search.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="مسح البحث"
                  className="w-6 h-6 rounded-lg absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center hover:opacity-80 cursor-pointer"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3">
              <span
                className="text-[12px] font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                عرض {filteredCourses.length} من أصل {courses.length} مقررات
              </span>
              <button
                type="button"
                onClick={openFeedbackModal}
                className="min-h-[36px] px-3 py-1.5 rounded-xl border text-[12px] font-bold transition-colors hover:border-[var(--accent-warm)] cursor-pointer shrink-0"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                + اقترح مادة
              </button>
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-2 pt-2.5 border-t"
            style={{ borderColor: "var(--border-soft)" }}
          >
            {hasSavedProfile && (
              <button
                type="button"
                onClick={() => {
                  setMyYearOnly((prev) => {
                    const next = !prev;
                    if (next) setYearFilter("all");
                    return next;
                  });
                }}
                className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] font-bold inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                  myYearOnly ? "active-warm" : ""
                }`}
              >
                <Star className="w-3.5 h-3.5 shrink-0" />
                <span>مقررات فرقتي (ف{portal.profile.year})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMyYearOnly(false);
                setYearFilter("all");
              }}
              className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                !myYearOnly && yearFilter === "all" ? "active" : ""
              }`}
            >
              كل الفرق
            </button>

            {availableYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => {
                  setMyYearOnly(false);
                  setYearFilter(String(yr));
                }}
                className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                  !myYearOnly && yearFilter === String(yr) ? "active" : ""
                }`}
              >
                الفرقة <span className="font-en">{yr}</span>
              </button>
            ))}

            <span
              className="h-4 w-px mx-0.5 shrink-0"
              style={{ background: "var(--border-strong)" }}
            />

            <button
              type="button"
              onClick={() => setPriceFilter("all")}
              className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                priceFilter === "all" ? "active" : ""
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter("free")}
              className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                priceFilter === "free" ? "active" : ""
              }`}
            >
              مجاني
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter("paid")}
              className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                priceFilter === "paid" ? "active-warm" : ""
              }`}
            >
              مدفوع
            </button>
          </div>
        </section>

        {/* Courses Grid */}
        <section>
          {filteredCourses.length === 0 ? (
            <div className="surface-card rounded-2xl p-10 text-center space-y-3">
              <div
                className="text-[15px] font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                لا توجد مقررات مطابقة للفلاتر الحالية
              </div>
              <div
                className="text-[12.5px]"
                style={{ color: "var(--text-secondary)" }}
              >
                جرّب مسح كلمة البحث أو اختيار &quot;كل الفرق&quot;.
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-1 min-h-[42px] px-4 py-2 rounded-xl text-[12px] font-extrabold text-white cursor-pointer"
                style={{ background: "var(--hero-bg)" }}
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
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
          )}
        </section>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
