"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  CalendarClock,
  Download,
  Flame,
  Moon,
  Search,
  Star,
  Sun,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { Footer } from "@/components/layout/Footer";
import { PomodoroTimer } from "@/components/layout/PomodoroTimer";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import {
  emitToast,
  openCommandPalette,
  openFeedbackModal,
  openMistakeBankModal,
  openProfileModal,
} from "@/lib/stores/events";
import {
  exportPortalBackupJson,
  getDefaultExamDate,
  importPortalBackupJson,
  setExamDate,
  usePortalState,
} from "@/lib/stores/portalStore";
import type { CourseWithStats } from "@/types/database";

export interface CoursesHubClientProps {
  courses: CourseWithStats[];
  courseLessonIdsMap: Record<string, string[]>;
  totalLessons: number;
}

type PriceFilter = "all" | "free" | "paid";

interface ExamPlanMetrics {
  text: string;
  diffDays: number;
  perDay: number;
  remaining: number;
  isUrgent: boolean;
  isAllDone: boolean;
  readinessPct: number;
}

function computeExamPlan(
  examDateStr: string,
  totalLessons: number,
  doneLessons: number
): ExamPlanMetrics {
  const remaining = Math.max(0, totalLessons - doneLessons);
  const readinessPct =
    totalLessons > 0
      ? Math.min(100, Math.round((doneLessons / totalLessons) * 100))
      : 100;

  const targetMs = Date.parse(`${examDateStr}T23:59:59`);
  const diffDays = Number.isFinite(targetMs)
    ? Math.max(1, Math.ceil((targetMs - Date.now()) / 86400000))
    : 5;

  if (remaining === 0 && totalLessons > 0) {
    return {
      text: "أنجزت كل الدروس المتاحة قبل الامتحان — عاش!",
      diffDays,
      perDay: 0,
      remaining: 0,
      isUrgent: false,
      isAllDone: true,
      readinessPct: 100,
    };
  }

  const perDay = Math.max(1, Math.ceil(remaining / diffDays));
  const dayUnit = diffDays === 1 ? "يوم" : "أيام";
  const lessonUnit = perDay === 1 ? "درس" : "دروس";
  const isUrgent = diffDays <= 3 && remaining > 0;

  return {
    text: `باقي ${diffDays} ${dayUnit} · محتاج تذاكر ${perDay} ${lessonUnit} يومياً (${remaining} متبقي)`,
    diffDays,
    perDay,
    remaining,
    isUrgent,
    isAllDone: false,
    readinessPct,
  };
}

export function CoursesHubClient({
  courses,
  courseLessonIdsMap,
  totalLessons,
}: CoursesHubClientProps) {
  const portal = usePortalState();
  const theme = useTheme();
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [myYearOnly, setMyYearOnly] = useState(false);

  const hasSavedProfile = portal.profile.saved && portal.profile.name.length > 0;

  const allPublishedLessonIds = useMemo(() => {
    const ids = new Set<string>();
    for (const course of courses) {
      const list = courseLessonIdsMap[course.id] ?? [];
      for (const id of list) {
        ids.add(id);
      }
    }
    return ids;
  }, [courses, courseLessonIdsMap]);

  const doneLessonsCount = useMemo(() => {
    let count = 0;
    for (const id of portal.completedLessons) {
      if (allPublishedLessonIds.has(id)) {
        count++;
      }
    }
    return count;
  }, [portal.completedLessons, allPublishedLessonIds]);

  const overallPct =
    totalLessons > 0
      ? Math.min(100, Math.round((doneLessonsCount / totalLessons) * 100))
      : 0;

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

  const effectiveExamDate = portal.examDate || getDefaultExamDate();
  const examPlan = computeExamPlan(
    effectiveExamDate,
    totalLessons,
    doneLessonsCount
  );

  const mistakeCount = portal.mistakes.length;
  const lastVisited = portal.lastVisited;

  function handleExportBackup() {
    const json = exportPortalBackupJson();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        void navigator.clipboard.writeText(json);
      }
    } catch {
      // ignore clipboard restrictions
    }
    try {
      const blob = new Blob([json], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cs-portal-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore download errors
    }
    emitToast("تم نسخ وتحميل نسخة تقدمك الاحتياطية (JSON) ✓");
  }

  function handleImportClick() {
    importInputRef.current?.click();
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const result = importPortalBackupJson(text);
      if (result.ok) {
        emitToast("تمت استعادة تقدمك وبياناتك بنجاح ✓");
      } else {
        emitToast(result.error);
      }
    } catch {
      emitToast("تعذّر قراءة ملف النسخة الاحتياطية.");
    }
  }

  function handleExamDateChange(e: ChangeEvent<HTMLInputElement>) {
    const nextDate = e.target.value;
    if (!nextDate) return;
    setExamDate(nextDate);
    emitToast("تم تحديث خطة المذاكرة اليومية ✓");
  }

  function resetAllFilters() {
    setSearch("");
    setYearFilter("all");
    setPriceFilter("all");
    setMyYearOnly(false);
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen">
      {/* Sticky Courses Topbar */}
      <header className="topbar-shell sticky top-0 z-40">
        <div className="max-w-[1220px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Start: Back to Landing + Brand Chip */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="px-2.5 sm:px-3 min-h-[38px] h-9.5 rounded-xl border text-[11.5px] sm:text-[12px] font-bold inline-flex items-center gap-1 sm:gap-1.5 transition-colors hover:opacity-85 shrink-0"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              <span>الرئيسية</span>
            </Link>

            <div
              className="h-5 w-px hidden sm:block shrink-0"
              style={{ background: "var(--border-strong)" }}
            />

            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: "var(--hero-bg)" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="leading-tight truncate">
                <div
                  className="font-en font-extrabold text-[14px] truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  Ahmed Amir Ahmed
                </div>
                <div
                  className="text-[10.5px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  مكتبة المقررات
                </div>
              </div>
            </div>
          </div>

          {/* End: Ctrl+K Search, Pomodoro, Theme Toggle, Profile (all accessible on mobile & desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={openCommandPalette}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 min-h-[38px] h-9.5 rounded-xl border text-[12px] font-bold transition-colors hover:opacity-85 cursor-pointer shrink-0"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
              title="بحث سريع (Ctrl+K)"
              aria-label="بحث سريع في المقررات والدروس (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">بحث سريع</span>
              <span
                className="hidden lg:inline-block font-mono-code text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--bg-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                Ctrl+K
              </span>
            </button>

            <PomodoroTimer className="inline-flex" />

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 min-h-[38px] h-9.5 rounded-xl border text-[12px] font-semibold transition-colors cursor-pointer shrink-0"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
              title="تبديل المظهر"
              aria-label="تبديل المظهر"
            >
              {theme === "dark" ? (
                <Sun
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
              ) : (
                <Moon
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
              )}
              <span className="hidden md:inline">
                {theme === "dark" ? "فاتح" : "داكن"}
              </span>
            </button>

            <button
              type="button"
              onClick={openProfileModal}
              className="px-2.5 sm:px-3.5 min-h-[38px] h-9.5 rounded-xl text-[11.5px] sm:text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer shrink-0"
              style={{ background: "var(--hero-bg)" }}
            >
              <UserRound className="w-3.5 h-3.5 shrink-0" />
              <span className="max-w-[78px] sm:max-w-[130px] truncate">
                {hasSavedProfile
                  ? `${portal.profile.name} · ف${portal.profile.year}`
                  : "إعداد فرقتك"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1220px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
        {/* 1. Student Progress & Welcome Banner */}
        <section className="hero-shell rounded-[26px] p-5 sm:p-8 text-white border border-white/10 shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              {/* Hero Badge Row + Founder Mini-Signature */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-[11.5px] font-bold text-[#a7f3d0]">
                  <span className="w-2 h-2 rounded-full bg-[#66c7a6] shrink-0" />
                  <span>مساحة مذاكرتك الشخصية · حفظ محلي تلقائي</span>
                </div>

                <div className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[11px] sm:text-[11.5px] font-bold text-slate-200">
                  <Image
                    src="/images/founder.jpg"
                    alt="Ahmed Amir Ahmed"
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover object-[50%_15%] ring-2 ring-[#e58a62] shrink-0"
                  />
                  <span>
                    إعداد وشرح:{" "}
                    <strong className="font-en text-white">
                      Ahmed Amir Ahmed
                    </strong>
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                {hasSavedProfile
                  ? `أهلاً يا ${portal.profile.name} — جاهز تكمل مذاكرتك؟`
                  : "اختار مادتك وابدأ المذاكرة بنظام"}
              </h1>

              <p className="text-[13px] sm:text-[13.5px] text-slate-300 max-w-xl leading-relaxed">
                كل مقرر مجهّز بفيديوهات الشرح، الملخصات المنظمة، الشرح التفاعلي،
                موقع المادة، والكويزات — وتقدمك بيتحفظ تلقائياً على جهازك.
              </p>

              {/* NEW "أكمل من حيث توقفت" (Resume Last Lesson) Smart Pill/Card */}
              {lastVisited && (
                <div className="pt-1">
                  <Link
                    href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                    className="group inline-flex items-center gap-2 max-w-full px-3.5 sm:px-4 py-2.5 min-h-[42px] rounded-2xl bg-[#c25e33] hover:bg-[#ad5129] text-white text-[12px] sm:text-[12.5px] font-extrabold shadow-lg shadow-black/20 border border-white/15 transition-all hover:-translate-y-0.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#a7f3d0] animate-pulse shrink-0" />
                    <span className="truncate">
                      أكمل: {lastVisited.courseCode} · {lastVisited.lessonTitle}
                    </span>
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 rounded-2xl p-4 sm:p-5 bg-white/[0.07] border border-white/12 backdrop-blur-md space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-bold text-slate-200">
                  إنجازك الإجمالي
                </span>
                <span className="font-mono-code text-[15px] font-black text-[#66c7a6]">
                  {overallPct}%
                </span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-[#66c7a6] to-[#e58a62] transition-all duration-300"
                  style={{ width: `${overallPct}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 text-[11.5px] text-slate-300 pt-0.5">
                <span className="font-semibold">
                  {doneLessonsCount} من {totalLessons} دروس مكتملة
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[#f0a786] text-[11.5px] font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span>نسخة JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleImportClick}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[#a7f3d0] text-[11.5px] font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 shrink-0" />
                    <span>استعادة</span>
                  </button>

                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFile}
                    className="hidden"
                    aria-label="استعادة نسخة احتياطية JSON"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1.5 Student Productivity Strip: Exam Countdown Planner + Mistake Bank */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Exam Countdown & Daily Target Planner */}
          <div
            className="lg:col-span-7 surface-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{
              borderColor: examPlan.isUrgent
                ? "var(--accent-warm)"
                : "var(--border-soft)",
            }}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold"
                  style={{
                    color: examPlan.isUrgent
                      ? "var(--accent-warm)"
                      : "var(--brand-primary)",
                  }}
                >
                  {examPlan.isUrgent ? (
                    <Flame className="w-4 h-4 shrink-0" />
                  ) : (
                    <CalendarClock className="w-4 h-4 shrink-0" />
                  )}
                  <span>عدّاد الامتحان وخطة اليوم</span>
                </div>

                <span
                  className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                  style={{
                    background: examPlan.isAllDone
                      ? "var(--success-soft)"
                      : examPlan.isUrgent
                        ? "var(--accent-warm-soft)"
                        : "var(--brand-soft)",
                    color: examPlan.isAllDone
                      ? "var(--success-fg)"
                      : examPlan.isUrgent
                        ? "var(--accent-warm-text)"
                        : "var(--brand-soft-text)",
                  }}
                >
                  {examPlan.isAllDone
                    ? "جاهز للامتحان ✓"
                    : examPlan.isUrgent
                      ? `أولوية قصوى · ${examPlan.diffDays} ${
                          examPlan.diffDays === 1 ? "يوم" : "أيام"
                        }`
                      : "وتيرة مريحة"}
                </span>
              </div>

              <div
                className="text-[13.5px] font-extrabold leading-snug"
                style={{ color: "var(--text-primary)" }}
              >
                {examPlan.text}
              </div>

              {/* Visual Readiness Progress Track */}
              <div className="pt-0.5 space-y-1">
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ background: "var(--bg-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(6, examPlan.readinessPct)}%`,
                      background: examPlan.isAllDone
                        ? "var(--success-fg)"
                        : examPlan.isUrgent
                          ? "var(--accent-warm)"
                          : "var(--brand-primary)",
                    }}
                  />
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  غيّر تاريخ الامتحان عشان الخطة تتحدث تلقائياً حسب الدروس
                  المتبقية.
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center">
              <input
                type="date"
                value={effectiveExamDate}
                onChange={handleExamDateChange}
                aria-label="تاريخ الامتحان"
                className="w-full sm:w-auto min-h-[42px] px-3.5 py-2 rounded-xl border text-[12.5px] font-mono-code font-bold outline-none transition-colors focus:ring-2"
                style={{
                  background: "var(--bg-subtle)",
                  borderColor: examPlan.isUrgent
                    ? "var(--accent-warm)"
                    : "var(--border-strong)",
                  color: "var(--text-primary)",
                  colorScheme: theme === "dark" ? "dark" : "light",
                }}
              />
            </div>
          </div>

          {/* Mistake Bank Summary Card */}
          <div className="lg:col-span-5 surface-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="space-y-1 min-w-0">
              <div
                className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold"
                style={{ color: "var(--brand-primary)" }}
              >
                <BookmarkCheck className="w-4 h-4 shrink-0" />
                <span>بنك الأخطاء والمراجعة</span>
              </div>
              <div
                className="text-[13px] font-bold leading-snug"
                style={{ color: "var(--text-primary)" }}
              >
                {mistakeCount === 0
                  ? "لا توجد أخطاء مسجلة بعد — عاش!"
                  : `عندك ${mistakeCount} ${
                      mistakeCount === 1 ? "سؤال محفوظ" : "أسئلة محفوظة"
                    } جاهزة للمراجعة قبل الامتحان.`}
              </div>
            </div>

            <button
              type="button"
              onClick={openMistakeBankModal}
              className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl text-[12px] font-extrabold border shrink-0 inline-flex items-center justify-center gap-1 transition-colors hover:opacity-85 cursor-pointer"
              style={{
                background:
                  mistakeCount > 0
                    ? "var(--accent-warm-soft)"
                    : "var(--bg-canvas)",
                borderColor:
                  mistakeCount > 0
                    ? "var(--accent-warm)"
                    : "var(--border-strong)",
                color:
                  mistakeCount > 0
                    ? "var(--accent-warm-text)"
                    : "var(--text-primary)",
              }}
            >
              <span>مراجعة</span>
              <span>(</span>
              <span className="font-mono-code">{mistakeCount}</span>
              <span>)</span>
            </button>
          </div>
        </section>

        {/* 2. Smart RTL Search & Swipeable Mobile Filter Toolbar */}
        <section className="surface-card rounded-2xl p-4 sm:p-5 space-y-4">
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
                className="w-full min-h-[42px] pr-10 pl-9 py-2.5 rounded-xl border text-[13px] outline-none focus:ring-2"
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
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl border text-[12px] font-bold transition-colors hover:opacity-85 cursor-pointer shrink-0"
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

          {/* Horizontal Swipeable Snap Rail on Mobile, Wrapping on >= sm */}
          <div
            className="flex flex-nowrap overflow-x-auto hide-scrollbar pb-1 sm:pb-0 sm:flex-wrap sm:overflow-visible items-center gap-2 pt-2.5 border-t snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`filter-pill min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-bold inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap snap-start cursor-pointer ${
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
              className={`filter-pill min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
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
                className={`filter-pill min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
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
              className={`filter-pill min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                priceFilter === "all" ? "active" : ""
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter("free")}
              className={`filter-pill min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                priceFilter === "free" ? "active" : ""
              }`}
            >
              مجاني
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter("paid")}
              className={`filter-pill min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] shrink-0 whitespace-nowrap snap-start cursor-pointer ${
                priceFilter === "paid" ? "active-warm" : ""
              }`}
            >
              مدفوع
            </button>
          </div>
        </section>

        {/* 3. Style C Corner-Fold Editorial Blueprint Courses Grid */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
