"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  LayoutList,
  Lightbulb,
  Maximize2,
  Minimize2,
  NotebookPen,
  Sparkles,
  SquareStack,
  Target,
  X,
  ZoomIn,
} from "lucide-react";
import type { ChapterSlide, InteractiveChapterData } from "@/types/chapter";
import CgProblemsBonusViewer from "./CgProblemsBonusViewer";

interface ChapterInteractiveViewerProps {
  chapter: InteractiveChapterData;
  onGoToQuiz?: () => void;
}

type SlideDisplayMode = "single" | "all";

const MASTERY_STORAGE_KEY = "cs_portal_chapter_mastery_v1";

// Distinct, lively color accents cycling across numbered explanation points so reading never feels flat
const POINT_ACCENTS = [
  {
    badgeBg: "rgba(59, 130, 246, 0.14)",
    badgeBorder: "rgba(59, 130, 246, 0.32)",
    badgeFg: "#2563eb",
    darkBadgeFg: "#60a5fa",
    rail: "#3b82f6",
  },
  {
    badgeBg: "rgba(16, 185, 129, 0.14)",
    badgeBorder: "rgba(16, 185, 129, 0.32)",
    badgeFg: "#059669",
    darkBadgeFg: "#34d399",
    rail: "#10b981",
  },
  {
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeBorder: "rgba(245, 158, 11, 0.35)",
    badgeFg: "#d97706",
    darkBadgeFg: "#fbbf24",
    rail: "#f59e0b",
  },
  {
    badgeBg: "rgba(139, 92, 246, 0.14)",
    badgeBorder: "rgba(139, 92, 246, 0.32)",
    badgeFg: "#7c3aed",
    darkBadgeFg: "#a78bfa",
    rail: "#8b5cf6",
  },
];

function loadMasteredSlideIds(lessonId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MASTERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    const list = parsed?.[lessonId];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveMasteredSlideIds(lessonId: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(MASTERY_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
    parsed[lessonId] = ids;
    window.localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage quota errors
  }
}

export default function ChapterInteractiveViewer({
  chapter,
  onGoToQuiz,
}: ChapterInteractiveViewerProps) {
  const [activeSection, setActiveSection] = useState<"slides" | "bonus">(
    "slides"
  );
  const [displayMode, setDisplayMode] = useState<SlideDisplayMode>("single");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [recallBlur, setRecallBlur] = useState(false);
  const [copiedSlideId, setCopiedSlideId] = useState<string | null>(null);
  const [masteredIds, setMasteredIds] = useState<string[]>(() =>
    loadMasteredSlideIds(chapter.lessonId)
  );
  const [zoomedSlide, setZoomedSlide] = useState<ChapterSlide | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideTopRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = chapter.slides.length;
  const hasBonusProblems = chapter.bonusComponentId === "cg-ch3-ch4-problems";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedSlide) {
          setZoomedSlide(null);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
        return;
      }

      if (activeSection !== "slides" || displayMode !== "single" || zoomedSlide)
        return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === "ArrowRight") {
        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomedSlide, isFullscreen, displayMode, totalSlides, activeSection]);

  useEffect(() => {
    if (!zoomedSlide && !isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomedSlide, isFullscreen]);

  const masteredSet = useMemo(() => new Set(masteredIds), [masteredIds]);
  const masteredCount = chapter.slides.filter((s) =>
    masteredSet.has(s.id)
  ).length;
  const masteryPct =
    totalSlides > 0 ? Math.round((masteredCount / totalSlides) * 100) : 0;

  const toggleMastered = useCallback(
    (slideId: string) => {
      setMasteredIds((prev) => {
        const next = prev.includes(slideId)
          ? prev.filter((id) => id !== slideId)
          : [...prev, slideId];
        saveMasteredSlideIds(chapter.lessonId, next);
        return next;
      });
    },
    [chapter.lessonId]
  );

  const handleCopyNotebook = useCallback(async (slide: ChapterSlide) => {
    const text = `${slide.title} (${slide.slideRef})\n${slide.notebookEn}\n— ${slide.notebookAr}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSlideId(slide.id);
      window.setTimeout(() => setCopiedSlideId(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  }, []);

  const handleJumpToSlide = useCallback(
    (idx: number) => {
      setActiveSlideIndex(idx);
      if (displayMode === "all") {
        const slide = chapter.slides[idx];
        if (!slide) return;
        window.requestAnimationFrame(() => {
          const el = document.getElementById(
            `chapter-slide-${chapter.chapterNum}-${slide.id}`
          );
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
    [chapter.chapterNum, chapter.slides, displayMode]
  );

  const handleStepSlide = useCallback(
    (nextIdx: number) => {
      const clamped = Math.max(0, Math.min(totalSlides - 1, nextIdx));
      setActiveSlideIndex(clamped);
      slideTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    },
    [totalSlides]
  );

  const visibleSlides = useMemo(() => {
    if (displayMode === "single") {
      const safe = chapter.slides[activeSlideIndex] ?? chapter.slides[0];
      return safe ? [{ slide: safe, index: activeSlideIndex }] : [];
    }
    return chapter.slides.map((slide, index) => ({ slide, index }));
  }, [chapter.slides, displayMode, activeSlideIndex]);

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? `chapter-viewer ${recallBlur ? "recall-blur" : ""} fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[var(--bg-canvas)] p-4 sm:p-6`
          : `chapter-viewer ${recallBlur ? "recall-blur" : ""} space-y-4`
      }
    >
      {/* ==================== VIBRANT EDITORIAL HEADER BAR ==================== */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Top Multi-Tone Energy Strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, #2563eb 0%, #7c3aed 38%, #059669 72%, #d97706 100%)",
          }}
        />

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-code inline-flex items-center rounded-lg bg-gradient-to-l from-indigo-600 to-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  Chapter {chapter.chapterNum} · {chapter.courseCode}
                </span>
                <span className="inline-flex items-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  {totalSlides} سلايد تفاعلية
                </span>
              </div>

              <h3 className="text-[17px] font-black leading-snug text-[var(--text-primary)] sm:text-[19px]">
                <span className="font-en">{chapter.titleEn}</span>
                <span className="mx-2 font-normal text-[var(--text-muted)] opacity-50">
                  ·
                </span>
                <span className="text-[14.5px] font-bold text-[var(--text-secondary)] sm:text-[16px]">
                  {chapter.titleAr}
                </span>
              </h3>
            </div>

            {/* Mastery Progress + Fullscreen */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex items-center gap-2.5 rounded-xl border px-3 py-1.5"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <span className="text-[11px] font-bold text-[var(--text-muted)]">
                  إنجازك
                </span>
                <span className="font-mono-code text-[12px] font-black text-emerald-600 dark:text-emerald-400">
                  {masteredCount}/{totalSlides} ({masteryPct}%)
                </span>
                <div className="h-2 w-16 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${masteryPct}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:opacity-85 cursor-pointer sm:w-auto sm:gap-1.5 sm:px-3"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span className="hidden text-[11.5px] font-bold sm:inline">
                      إغلاق
                    </span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden text-[11.5px] font-bold sm:inline">
                      ملء الشاشة
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Toolbar Row */}
          <div
            className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t pt-3.5"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <div className="flex flex-wrap items-center gap-2">
              {hasBonusProblems ? (
                <div
                  className="inline-flex items-center gap-1 rounded-xl border p-1"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSection("slides")}
                    className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-3.5 py-1 text-[12px] font-extrabold transition-all cursor-pointer ${
                      activeSection === "slides"
                        ? "bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>شرح السلايدات</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("bonus")}
                    className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-3.5 py-1 text-[12px] font-extrabold transition-all cursor-pointer ${
                      activeSection === "bonus"
                        ? "bg-gradient-to-l from-amber-600 to-orange-600 text-white shadow-xs"
                        : "text-amber-700 dark:text-amber-400 hover:opacity-85"
                    }`}
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    <span>شرح مسائل شابتر 3 و 4 (بونص)</span>
                  </button>
                </div>
              ) : null}

              {activeSection === "slides" ? (
                <>
                  <div
                    className="inline-flex items-center gap-0.5 rounded-xl border p-0.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setDisplayMode("single")}
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg px-3 py-1 text-[12px] font-bold transition-colors cursor-pointer"
                      style={
                        displayMode === "single"
                          ? {
                              background: "var(--bg-surface)",
                              color: "var(--text-primary)",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                            }
                          : { color: "var(--text-muted)" }
                      }
                    >
                      <SquareStack className="h-3.5 w-3.5" />
                      <span>سلايد بسلايد</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisplayMode("all")}
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg px-3 py-1 text-[12px] font-bold transition-colors cursor-pointer"
                      style={
                        displayMode === "all"
                          ? {
                              background: "var(--bg-surface)",
                              color: "var(--text-primary)",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                            }
                          : { color: "var(--text-muted)" }
                      }
                    >
                      <LayoutList className="h-3.5 w-3.5" />
                      <span>عرض الكل ({totalSlides})</span>
                    </button>
                  </div>

                  {/* Active Recall Blur Highlights Toggle */}
                  <button
                    type="button"
                    onClick={() => setRecallBlur((prev) => !prev)}
                    className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1 text-[12px] font-bold transition-all cursor-pointer ${
                      recallBlur
                        ? "border-violet-500/40 bg-violet-500/15 text-violet-700 dark:text-violet-300"
                        : "border-[var(--border-soft)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                    title="غبّش الهايلايت ومرر الماوس للكشف عشان تختبر حفظك"
                  >
                    {recallBlur ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {recallBlur
                        ? "إلغاء تغبيش الهايلايت"
                        : "اختبر حفظك (تغبيش)"}
                    </span>
                  </button>
                </>
              ) : null}
            </div>

            {onGoToQuiz ? (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 px-4 py-1.5 text-[12px] font-extrabold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>اختبر نفسك في الكويز</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ==================== BONUS PROBLEMS VIEW ==================== */}
      {hasBonusProblems && activeSection === "bonus" ? (
        <CgProblemsBonusViewer defaultTab={chapter.bonusDefaultTab} />
      ) : null}

      {/* ==================== VIVID SLIDE VIEWER ==================== */}
      {activeSection === "slides" ? (
        <div ref={slideTopRef} className="space-y-4">
          {/* Quick-Jump Slide Navigator */}
          <div
            className="rounded-2xl border px-3.5 py-3"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div className="mb-2 flex items-center justify-between gap-2 px-1">
              <span className="text-[11.5px] font-extrabold text-[var(--text-secondary)]">
                فهرس السلايدات السريع
              </span>
              {displayMode === "single" ? (
                <span className="font-mono-code rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300">
                  Slide {activeSlideIndex + 1} / {totalSlides}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {chapter.slides.map((slide, idx) => {
                const isDone = masteredSet.has(slide.id);
                const isActive =
                  displayMode === "single" && idx === activeSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleJumpToSlide(idx)}
                    className={`inline-flex shrink-0 items-center gap-1 rounded-xl border px-3 py-1.5 text-[11.5px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "border-indigo-600 bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-xs"
                        : isDone
                          ? "border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                          : "border-[var(--border-soft)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:border-indigo-400/50"
                    }`}
                  >
                    {isDone ? <Check className="h-3 w-3 shrink-0" /> : null}
                    <span>{slide.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slide Card(s) */}
          <div className="space-y-6">
            {visibleSlides.map(({ slide, index }) => {
              const isMastered = masteredSet.has(slide.id);
              const isCopied = copiedSlideId === slide.id;
              return (
                <article
                  key={slide.id}
                  id={`chapter-slide-${chapter.chapterNum}-${slide.id}`}
                  className="scroll-mt-24 overflow-hidden rounded-2xl border"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Crisp Color-Accented Slide Header */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-6"
                    style={{
                      background:
                        "linear-gradient(90deg, color-mix(in srgb, var(--brand-soft) 50%, var(--bg-canvas)) 0%, var(--bg-canvas) 100%)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                      <span className="font-mono-code inline-flex h-7 min-w-[28px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 px-2 text-[11.5px] font-black text-white shadow-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono-code shrink-0 rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                        {slide.slideRef}
                      </span>
                      <h4 className="text-[15.5px] font-black leading-snug text-[var(--text-primary)] sm:text-[17px]">
                        {slide.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMastered(slide.id)}
                      aria-pressed={isMastered}
                      className={`inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-1 text-[11.5px] font-extrabold transition-all cursor-pointer ${
                        isMastered
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-emerald-500/40"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>
                        {isMastered ? "فهمت السلايد ✓" : "تحديد كمفهوم"}
                      </span>
                    </button>
                  </div>

                  {/* Rich Split-View Content */}
                  <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 xl:grid-cols-12 xl:gap-7">
                    {/* RIGHT PANE: Original Academic Slide + Visual Diagram */}
                    <div className="space-y-4 xl:col-span-5">
                      <div
                        dir="ltr"
                        className="chapter-orig-slide overflow-hidden rounded-2xl border border-indigo-500/20 text-left shadow-xs"
                        style={{
                          background: "var(--bg-canvas)",
                        }}
                      >
                        <div className="flex items-center justify-between border-b border-indigo-500/15 bg-gradient-to-r from-indigo-600/12 via-blue-600/8 to-transparent px-4 py-2.5">
                          <span className="font-mono-code inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                            Original Slide Deck
                          </span>
                          <span className="font-mono-code text-[11px] font-bold text-[var(--text-muted)]">
                            {index + 1}/{totalSlides} · {slide.slideRef}
                          </span>
                        </div>

                        <div className="p-4">
                          {slide.enPoints && slide.enPoints.length > 0 ? (
                            <ul className="space-y-2.5 text-[13.5px] leading-[1.75] text-[var(--text-primary)]">
                              {slide.enPoints.map((pt, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2.5"
                                >
                                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500/80" />
                                  <span
                                    className="min-w-0 flex-1"
                                    dangerouslySetInnerHTML={{ __html: pt }}
                                  />
                                </li>
                              ))}
                            </ul>
                          ) : null}

                          {slide.tableHtml ? (
                            <div
                              className="mt-3.5 overflow-x-auto rounded-xl border"
                              style={{
                                borderColor: "var(--border-soft)",
                                background: "var(--bg-surface)",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: slide.tableHtml,
                              }}
                            />
                          ) : null}
                        </div>
                      </div>

                      {/* Adaptive SVG Diagram Stage */}
                      {slide.svg ? (
                        <div
                          className={
                            slide.svgTheme === "light"
                              ? "overflow-hidden rounded-2xl border border-blue-500/20 p-3.5 shadow-xs"
                              : "overflow-hidden rounded-2xl border border-indigo-400/20 bg-[#0f172a] p-3.5 text-white shadow-xs"
                          }
                          style={
                            slide.svgTheme === "light"
                              ? { background: "var(--bg-canvas)" }
                              : undefined
                          }
                        >
                          <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
                            <span
                              className={
                                slide.svgTheme === "light"
                                  ? "font-mono-code text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300"
                                  : "font-mono-code text-[11px] font-extrabold uppercase tracking-wider text-cyan-300"
                              }
                            >
                              Visual Diagram · {slide.slideRef}
                            </span>
                            <button
                              type="button"
                              onClick={() => setZoomedSlide(slide)}
                              className={
                                slide.svgTheme === "light"
                                  ? "inline-flex items-center gap-1 rounded-lg border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-500/20 cursor-pointer"
                                  : "inline-flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-bold text-cyan-200 transition-colors hover:bg-cyan-400/20 cursor-pointer"
                              }
                            >
                              <ZoomIn className="h-3.5 w-3.5" />
                              <span>تكبير الرسمة</span>
                            </button>
                          </div>

                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setZoomedSlide(slide)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setZoomedSlide(slide);
                              }
                            }}
                            title="اضغط لتكبير الرسمة"
                            className={
                              slide.svgTheme === "light"
                                ? "chapter-svg-stage cursor-zoom-in overflow-x-auto rounded-xl border border-slate-200 bg-[#ffffff] p-2.5"
                                : "chapter-svg-stage cursor-zoom-in overflow-x-auto rounded-xl bg-[#090f1d] p-2.5"
                            }
                            dangerouslySetInnerHTML={{ __html: slide.svg }}
                          />

                          {slide.svgCaption ? (
                            <p
                              className={
                                slide.svgTheme === "light"
                                  ? "mt-2.5 px-1 text-center text-[11.5px] font-medium leading-relaxed text-[var(--text-secondary)]"
                                  : "mt-2.5 px-1 text-center text-[11.5px] font-medium leading-relaxed text-slate-300"
                              }
                            >
                              {slide.svgCaption}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      {/* Static Lecture Figure Image */}
                      {!slide.svg && slide.img ? (
                        <div
                          className="overflow-hidden rounded-2xl border border-blue-500/20 p-3.5 shadow-xs"
                          style={{ background: "var(--bg-canvas)" }}
                        >
                          <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
                            <span className="font-mono-code text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                              Slide Figure · {slide.slideRef}
                            </span>
                            <button
                              type="button"
                              onClick={() => setZoomedSlide(slide)}
                              className="inline-flex items-center gap-1 rounded-lg border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-500/20 cursor-pointer"
                            >
                              <ZoomIn className="h-3.5 w-3.5" />
                              <span>تكبير الشكل</span>
                            </button>
                          </div>

                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setZoomedSlide(slide)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setZoomedSlide(slide);
                              }
                            }}
                            title="اضغط لتكبير الشكل التوضيحي"
                            className="cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-white p-2"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.img}
                              alt={slide.title}
                              loading="lazy"
                              className="mx-auto max-h-[340px] w-auto max-w-full rounded object-contain"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* LEFT PANE: Engaging, Color-Coded Arabic Explanation */}
                    <div className="flex flex-col justify-between space-y-4 xl:col-span-7">
                      <div className="space-y-4">
                        {/* 1. Core Idea — Vibrant Cobalt Highlight Card */}
                        <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-l from-blue-500/[0.09] via-indigo-500/[0.05] to-transparent p-4 shadow-xs">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs">
                              <Lightbulb className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-[12.5px] font-black text-blue-700 dark:text-blue-300">
                              الفكرة الأساسية (الزتونة)
                            </span>
                          </div>
                          <p
                            className="text-[14px] font-semibold leading-[1.9] text-[var(--text-primary)]"
                            dangerouslySetInnerHTML={{ __html: slide.why }}
                          />
                        </div>

                        {/* 2. Detailed Breakdown — Color-Coded Numbered Study Cards */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[12px] font-black text-[var(--text-primary)]">
                              الشرح المفصّل خطوة بخطوة
                            </span>
                            <span className="font-mono-code text-[11px] font-bold text-[var(--text-muted)]">
                              {slide.deepPoints.length} نقاط
                            </span>
                          </div>

                          <div className="chapter-deep-list space-y-2.5">
                            {slide.deepPoints.map((pt, i) => {
                              const accent =
                                POINT_ACCENTS[i % POINT_ACCENTS.length];
                              return (
                                <div
                                  key={i}
                                  className="relative flex items-start gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-[13.5px] leading-[1.9] transition-colors"
                                  style={{
                                    background: "var(--bg-canvas)",
                                    borderColor: "var(--border-soft)",
                                    borderRightWidth: "3.5px",
                                    borderRightColor: accent.rail,
                                  }}
                                >
                                  <span
                                    className="font-mono-code mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[11px] font-black"
                                    style={{
                                      background: accent.badgeBg,
                                      borderColor: accent.badgeBorder,
                                      color: accent.rail,
                                    }}
                                  >
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  <span
                                    className="min-w-0 flex-1 text-[var(--text-primary)]"
                                    dangerouslySetInnerHTML={{ __html: pt }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Exam Focus Spotlight — Warm Amber/Orange Card */}
                        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-l from-amber-500/[0.11] via-orange-500/[0.05] to-transparent p-4 shadow-xs">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
                              <Target className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-[12.5px] font-black text-amber-800 dark:text-amber-300">
                              موضع سؤال الامتحان (ركز هنا!)
                            </span>
                          </div>
                          <div
                            className="text-[13.5px] font-medium leading-[1.85] text-[var(--text-primary)]"
                            dangerouslySetInnerHTML={{ __html: slide.examSpot }}
                          />
                        </div>
                      </div>

                      {/* 4. Quick Memory Card — Vibrant Emerald Notebook + Copy */}
                      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-l from-emerald-500/[0.10] via-teal-500/[0.04] to-transparent p-4 shadow-xs">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xs">
                              <NotebookPen className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-[12.5px] font-black text-emerald-800 dark:text-emerald-300">
                              الخلاصة السريعة للحفظ
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyNotebook(slide)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>تم النسخ ✓</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>نسخ</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p
                          dir="ltr"
                          className="font-en whitespace-pre-line rounded-xl border border-emerald-500/20 bg-[var(--bg-surface)] px-3.5 py-2.5 text-left text-[13px] font-bold leading-[1.75] text-[var(--text-primary)]"
                        >
                          {slide.notebookEn}
                        </p>
                        <p className="mt-2.5 text-[13px] font-semibold leading-relaxed text-[var(--text-secondary)]">
                          💡 {slide.notebookAr}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Single-Slide Stepper Bar */}
          {displayMode === "single" ? (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <button
                type="button"
                disabled={activeSlideIndex <= 0}
                onClick={() => handleStepSlide(activeSlideIndex - 1)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-[12.5px] font-bold transition-colors hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <ChevronRight className="h-4 w-4" />
                <span>السلايد السابقة</span>
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className="font-mono-code text-[12px] font-extrabold text-[var(--text-primary)]">
                  Slide {activeSlideIndex + 1} / {totalSlides}
                </span>
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--bg-subtle)] sm:w-44">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-blue-600 to-indigo-600 transition-all duration-300"
                    style={{
                      width: `${Math.round(((activeSlideIndex + 1) / totalSlides) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {activeSlideIndex < totalSlides - 1 ? (
                <button
                  type="button"
                  onClick={() => handleStepSlide(activeSlideIndex + 1)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 px-5 py-2 text-[12.5px] font-extrabold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
                >
                  <span>السلايد التالية</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : onGoToQuiz ? (
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 px-5 py-2 text-[12.5px] font-extrabold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>ابدأ كويز الشابتر</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-[12.5px] font-bold opacity-45"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>نهاية الشابتر ✓</span>
                </button>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ==================== DIAGRAM / IMAGE ZOOM MODAL ==================== */}
      {zoomedSlide && (zoomedSlide.svg || zoomedSlide.img) ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`تكبير رسمة ${zoomedSlide.slideRef}`}
          onClick={() => setZoomedSlide(null)}
          className="modal-backdrop fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={
              zoomedSlide.img || zoomedSlide.svgTheme === "light"
                ? "flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-[#ffffff] text-slate-900 shadow-2xl"
                : "flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0f172a] text-white shadow-2xl"
            }
          >
            <div
              className={
                zoomedSlide.img || zoomedSlide.svgTheme === "light"
                  ? "flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5"
                  : "flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5"
              }
            >
              <div className="min-w-0">
                <span
                  className={
                    zoomedSlide.img || zoomedSlide.svgTheme === "light"
                      ? "font-mono-code text-[11px] font-semibold text-slate-500"
                      : "font-mono-code text-[11px] font-semibold text-slate-400"
                  }
                >
                  {zoomedSlide.slideRef}
                </span>
                <h5
                  className={
                    zoomedSlide.img || zoomedSlide.svgTheme === "light"
                      ? "truncate text-[14px] font-extrabold text-slate-900"
                      : "truncate text-[14px] font-extrabold text-white"
                  }
                >
                  {zoomedSlide.title}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setZoomedSlide(null)}
                aria-label="إغلاق نافذة التكبير"
                className={
                  zoomedSlide.img || zoomedSlide.svgTheme === "light"
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
                }
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="chapter-svg-zoom flex-1 overflow-auto p-4 sm:p-6">
              {zoomedSlide.svg ? (
                <div
                  className="mx-auto w-full"
                  dangerouslySetInnerHTML={{ __html: zoomedSlide.svg }}
                />
              ) : zoomedSlide.img ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={zoomedSlide.img}
                  alt={zoomedSlide.title}
                  className="mx-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
                />
              ) : null}
              {zoomedSlide.svgCaption ? (
                <p
                  className={
                    zoomedSlide.svgTheme === "light"
                      ? "mt-4 text-center text-[13px] leading-relaxed text-slate-600"
                      : "mt-4 text-center text-[13px] leading-relaxed text-slate-300"
                  }
                >
                  {zoomedSlide.svgCaption}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
