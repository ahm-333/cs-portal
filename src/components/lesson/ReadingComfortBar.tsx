"use client";

import Link from "next/link";
import {
  AlignJustify,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lock,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
} from "lucide-react";
import {
  setThemeMode,
  updateReadingPrefs,
  useReadingPrefs,
  useThemeMode,
  type ThemeMode,
} from "@/components/layout/themeStore";

interface ReadingComfortBarProps {
  courseSlug: string;
  lessonNumber: number;
  tintVar: string;
  spineVar: string;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  nextLesson: {
    id: string;
    title: string;
    isLocked: boolean;
  } | null;
}

const THEME_OPTIONS: ReadonlyArray<{
  mode: ThemeMode;
  label: string;
  Icon: typeof Sun;
}> = [
  { mode: "reading", label: "قراءة", Icon: BookOpen },
  { mode: "light", label: "فاتح", Icon: Sun },
  { mode: "dark", label: "داكن", Icon: Moon },
];

export default function ReadingComfortBar({
  courseSlug,
  lessonNumber,
  tintVar,
  spineVar,
  focusMode,
  onToggleFocusMode,
  nextLesson,
}: ReadingComfortBarProps) {
  const themeMode = useThemeMode();
  const { fontScale, relaxedSpacing } = useReadingPrefs();

  const canDecrease = fontScale > 85;
  const canIncrease = fontScale < 125;
  const formattedLessonNum = String(lessonNumber).padStart(2, "0");

  return (
    <div
      aria-label="شريط راحة القراءة والتحكم بالدرس"
      className="studio-card sticky top-[76px] z-30 flex flex-wrap items-center justify-between gap-2.5 bg-[var(--paper)]/95 px-3 py-2.5 backdrop-blur-md shadow-[var(--shadow-pill)] sm:px-4"
    >
      {/* Right side (RTL start): Back to course + Architectural Lesson Index Pill */}
      <div className="flex items-center gap-2">
        <Link
          href={`/courses/${courseSlug}`}
          className="group inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--soft)] hover:text-[var(--accent)]"
        >
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          <span className="whitespace-nowrap">الرجوع للمقرر</span>
        </Link>

        <span
          dir="ltr"
          style={{ backgroundColor: tintVar }}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[var(--line)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--tint-ink)]"
          title={`الدرس رقم ${lessonNumber}`}
        >
          <span
            aria-hidden="true"
            style={{ backgroundColor: spineVar }}
            className="h-2 w-2 rounded-full"
          />
          <span>L{formattedLessonNum}</span>
        </span>
      </div>

      {/* Left side (RTL end): Font scaler, spacing toggle, 3-mode theme switcher, next lesson */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Font size scaler */}
        <div
          role="group"
          aria-label="حجم خط القراءة"
          className="inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--bg)] p-0.5"
        >
          <button
            type="button"
            disabled={!canDecrease}
            onClick={() => updateReadingPrefs({ fontScale: fontScale - 10 })}
            aria-label="تصغير الخط"
            title="تصغير الخط"
            dir="ltr"
            className="inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 font-mono text-xs font-bold text-[var(--ink)] transition-colors hover:bg-[var(--soft)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            A-
          </button>

          <button
            type="button"
            onClick={() => updateReadingPrefs({ fontScale: 100 })}
            title="إعادة حجم الخط للافتراضي (100%)"
            dir="ltr"
            className="inline-flex h-8 min-w-[44px] items-center justify-center rounded-lg px-1.5 font-mono text-[11px] font-bold text-[var(--muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
          >
            {fontScale}%
          </button>

          <button
            type="button"
            disabled={!canIncrease}
            onClick={() => updateReadingPrefs({ fontScale: fontScale + 10 })}
            aria-label="تكبير الخط"
            title="تكبير الخط"
            dir="ltr"
            className="inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 font-mono text-xs font-bold text-[var(--ink)] transition-colors hover:bg-[var(--soft)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            A+
          </button>
        </div>

        {/* Line spacing toggle */}
        <button
          type="button"
          onClick={() =>
            updateReadingPrefs({ relaxedSpacing: !relaxedSpacing })
          }
          aria-pressed={relaxedSpacing}
          className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
            relaxedSpacing
              ? "border-[var(--signal)]/50 bg-[var(--signal-soft)] text-[var(--signal)]"
              : "border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
        >
          <AlignJustify className="h-3.5 w-3.5" />
          <span className="whitespace-nowrap">
            {relaxedSpacing ? "تباعد: مريح جداً" : "تباعد: عادي"}
          </span>
        </button>

        {/* Inline 3-way theme pill switcher */}
        <div
          role="group"
          aria-label="وضع الألوان"
          className="inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--bg)] p-0.5"
        >
          {THEME_OPTIONS.map(({ mode, label, Icon }) => {
            const isActive = themeMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setThemeMode(mode)}
                aria-pressed={isActive}
                className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[var(--paper)] text-[var(--accent)] shadow-[var(--shadow-pill)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Focus Mode toggle (hides lesson sidebar for full-width distraction-free study) */}
        <button
          type="button"
          onClick={onToggleFocusMode}
          aria-pressed={focusMode}
          title="وضع التركيز — إخفاء القائمة الجانبية للمادة"
          className={`hidden min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors lg:inline-flex ${
            focusMode
              ? "border-[var(--accent)]/50 bg-[var(--signal-soft)] text-[var(--accent)]"
              : "border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
        >
          {focusMode ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
          <span className="whitespace-nowrap">
            {focusMode ? "إظهار الفهرس" : "وضع التركيز"}
          </span>
        </button>

        {/* Next lesson quick-jump */}
        {nextLesson ? (
          <Link
            href={`/courses/${courseSlug}/${nextLesson.id}`}
            title={nextLesson.title}
            className="group inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[var(--hero)] px-3 py-1.5 text-xs font-bold text-[var(--hero-ink)] transition-colors hover:bg-[var(--hero-deep)]"
          >
            <span className="whitespace-nowrap">الدرس التالي</span>
            {nextLesson.isLocked ? (
              <Lock className="h-3 w-3 opacity-90" />
            ) : (
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            )}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
