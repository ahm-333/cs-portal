"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Flame,
  Layers,
  LayoutList,
  Lightbulb,
  Maximize2,
  Minimize2,
  NotebookPen,
  Sparkles,
  SquareStack,
  X,
  ZoomIn,
} from "lucide-react";
import type { ChapterSlide, InteractiveChapterData } from "@/types/chapter";

interface ChapterInteractiveViewerProps {
  chapter: InteractiveChapterData;
  onGoToQuiz?: () => void;
}

type ViewerSubTab = "slides" | "lab";
type SlideDisplayMode = "all" | "single";

const MASTERY_STORAGE_KEY = "cs_portal_chapter_mastery_v1";

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
  const [subTab, setSubTab] = useState<ViewerSubTab>("slides");
  const [displayMode, setDisplayMode] = useState<SlideDisplayMode>("all");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeLabStep, setActiveLabStep] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>(() =>
    loadMasteredSlideIds(chapter.lessonId)
  );
  const [zoomedSlide, setZoomedSlide] = useState<ChapterSlide | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Escape handler for Zoom modal & fallback fullscreen
  useEffect(() => {
    if (!zoomedSlide && !isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedSlide) {
          setZoomedSlide(null);
        } else {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomedSlide, isFullscreen]);

  const masteredSet = useMemo(() => new Set(masteredIds), [masteredIds]);
  const totalSlides = chapter.slides.length;
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

  const handleJumpToSlide = useCallback(
    (idx: number) => {
      setSubTab("slides");
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

  const visibleSlides = useMemo(() => {
    if (displayMode === "single") {
      const safe = chapter.slides[activeSlideIndex] ?? chapter.slides[0];
      return safe ? [{ slide: safe, index: activeSlideIndex }] : [];
    }
    return chapter.slides.map((slide, index) => ({ slide, index }));
  }, [chapter.slides, displayMode, activeSlideIndex]);

  const currentLabStep =
    chapter.lab.steps[activeLabStep] ?? chapter.lab.steps[0];

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[var(--bg-canvas)] p-4 sm:p-6"
          : "space-y-5"
      }
    >
      {/* ==================== CHAPTER EDITORIAL BANNER ==================== */}
      <div
        className="rounded-2xl border p-4 sm:p-5"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-mono-code inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <Layers className="h-3 w-3" />
                Chapter {chapter.chapterNum} · {chapter.courseCode}
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <BookOpen className="h-3 w-3" />
                {totalSlides} سلايد تفاعلية
              </span>
            </div>

            <h3 className="text-[17px] font-black leading-snug text-[var(--text-primary)] sm:text-[19px]">
              <span className="font-en">{chapter.titleEn}</span>
              <span
                className="mx-1.5 text-[13px] font-bold opacity-50"
                style={{ color: "var(--text-muted)" }}
              >
                —
              </span>
              <span className="text-[15px] font-extrabold text-[var(--text-secondary)] sm:text-[16px]">
                {chapter.titleAr}
              </span>
            </h3>

            <p
              className="text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {chapter.subtitle}
            </p>
          </div>

          {/* Right Controls: Mastery Pill + Fullscreen */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="text-right">
                <div
                  className="text-[10.5px] font-bold"
                  style={{ color: "var(--text-muted)" }}
                >
                  إنجاز السلايدات
                </div>
                <div className="font-mono-code text-[12.5px] font-black text-[var(--text-primary)]">
                  {masteredCount} / {totalSlides}
                </div>
              </div>
              <div
                className="h-2 w-16 overflow-hidden rounded-full sm:w-20"
                style={{ background: "var(--bg-subtle)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${masteryPct}%`,
                    background:
                      masteryPct === 100
                        ? "var(--success-fg)"
                        : "var(--accent-warm)",
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-bold transition-colors hover:opacity-90 cursor-pointer"
              style={{
                background: "var(--brand-soft)",
                borderColor: "transparent",
                color: "var(--brand-soft-text)",
              }}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">إغلاق ملء الشاشة</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ملء الشاشة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ==================== SUB-TABS & VIEW MODE BAR ==================== */}
        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t pt-3.5"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {/* Sub-Tabs: Slides vs Interactive Lab (NO Quiz here!) */}
          <div
            role="tablist"
            aria-label="أقسام الشرح التفاعلي"
            className="inline-flex items-center gap-1 rounded-xl border p-1"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={subTab === "slides"}
              onClick={() => setSubTab("slides")}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12px] font-extrabold transition-all cursor-pointer"
              style={
                subTab === "slides"
                  ? {
                      background: "var(--brand-primary)",
                      color: "#ffffff",
                    }
                  : {
                      background: "transparent",
                      color: "var(--text-secondary)",
                    }
              }
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>الشرح سلايد بسلايد</span>
              <span className="font-mono-code text-[10.5px] opacity-80">
                ({totalSlides})
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={subTab === "lab"}
              onClick={() => setSubTab("lab")}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12px] font-extrabold transition-all cursor-pointer"
              style={
                subTab === "lab"
                  ? {
                      background: "var(--accent-warm)",
                      color: "#ffffff",
                    }
                  : {
                      background: "transparent",
                      color: "var(--text-secondary)",
                    }
              }
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>المعمل التفاعلي</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Display Mode Switcher (Slides only) */}
            {subTab === "slides" ? (
              <div
                className="inline-flex items-center gap-1 rounded-xl border p-0.5"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setDisplayMode("all")}
                  className="inline-flex min-h-[32px] items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-colors cursor-pointer"
                  style={
                    displayMode === "all"
                      ? {
                          background: "var(--bg-subtle)",
                          color: "var(--text-primary)",
                        }
                      : { color: "var(--text-muted)" }
                  }
                >
                  <LayoutList className="h-3.5 w-3.5" />
                  <span>عرض الكل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode("single")}
                  className="inline-flex min-h-[32px] items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-colors cursor-pointer"
                  style={
                    displayMode === "single"
                      ? {
                          background: "var(--bg-subtle)",
                          color: "var(--text-primary)",
                        }
                      : { color: "var(--text-muted)" }
                  }
                >
                  <SquareStack className="h-3.5 w-3.5" />
                  <span>سلايد بسلايد</span>
                </button>
              </div>
            ) : null}

            {/* Bridge button to the dedicated Quiz tab */}
            {onGoToQuiz ? (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11.5px] font-extrabold transition-colors hover:opacity-90 cursor-pointer"
                style={{
                  background: "var(--success-soft)",
                  borderColor:
                    "color-mix(in srgb, var(--success-fg) 30%, transparent)",
                  color: "var(--success-fg)",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>اختبر نفسك في الكويز</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ==================== TAB 1: SLIDE-BY-SLIDE EXPLANATION ==================== */}
      {subTab === "slides" ? (
        <div className="space-y-4">
          {/* Quick-Jump Slide Strip */}
          <div
            className="rounded-2xl border p-3"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div className="mb-2 flex items-center justify-between gap-2 px-1">
              <span
                className="text-[11px] font-extrabold"
                style={{ color: "var(--text-muted)" }}
              >
                تنقل سريع بين السلايدات ({totalSlides}):
              </span>
              {displayMode === "single" ? (
                <span
                  className="font-mono-code text-[11px] font-bold"
                  style={{ color: "var(--accent-warm-text)" }}
                >
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
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition-all cursor-pointer"
                    style={
                      isActive
                        ? {
                            background: "var(--accent-warm)",
                            borderColor: "var(--accent-warm)",
                            color: "#ffffff",
                          }
                        : isDone
                          ? {
                              background: "var(--success-soft)",
                              borderColor:
                                "color-mix(in srgb, var(--success-fg) 40%, transparent)",
                              color: "var(--success-fg)",
                            }
                          : {
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-secondary)",
                            }
                    }
                  >
                    {isDone ? <Check className="h-3 w-3 shrink-0" /> : null}
                    <span>{slide.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slide Cards */}
          <div className="space-y-5">
            {visibleSlides.map(({ slide, index }) => {
              const isMastered = masteredSet.has(slide.id);
              return (
                <article
                  key={slide.id}
                  id={`chapter-slide-${chapter.chapterNum}-${slide.id}`}
                  className="scroll-mt-24 overflow-hidden rounded-2xl border transition-colors"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: isMastered
                      ? "color-mix(in srgb, var(--success-fg) 45%, var(--border-soft))"
                      : "var(--border-soft)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Slide Header */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-2.5 border-b px-4 py-3 sm:px-5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span
                        className="font-mono-code shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-extrabold"
                        style={{
                          background: "var(--accent-warm-soft)",
                          color: "var(--accent-warm-text)",
                        }}
                      >
                        {slide.slideRef}
                      </span>
                      <h4 className="text-[14.5px] font-black leading-snug text-[var(--text-primary)] sm:text-[15.5px]">
                        {slide.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMastered(slide.id)}
                      aria-pressed={isMastered}
                      className="inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1 text-[11.5px] font-extrabold transition-all cursor-pointer"
                      style={
                        isMastered
                          ? {
                              background: "var(--success-soft)",
                              borderColor: "var(--success-fg)",
                              color: "var(--success-fg)",
                            }
                          : {
                              background: "var(--bg-surface)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>
                        {isMastered ? "تمت المذاكرة ✓" : "تحديد كمفهوم"}
                      </span>
                    </button>
                  </div>

                  {/* Split View Body */}
                  <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 xl:grid-cols-12 xl:gap-5">
                    {/* RIGHT PANE (RTL Start): Original Slide + Table + SVG Diagram */}
                    <div className="space-y-3.5 xl:col-span-5">
                      <div
                        dir="ltr"
                        className="chapter-orig-slide rounded-xl border p-4 text-left"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                          borderLeftWidth: "3.5px",
                          borderLeftColor: "var(--brand-primary)",
                        }}
                      >
                        <div
                          className="font-mono-code mb-2.5 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          <span>Original Slide</span>
                          <span>
                            #{index + 1} · {slide.slideRef}
                          </span>
                        </div>

                        {slide.enPoints && slide.enPoints.length > 0 ? (
                          <ul
                            className="space-y-1.5 pl-4 text-[13px] leading-relaxed list-disc"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {slide.enPoints.map((pt, i) => (
                              <li
                                key={i}
                                dangerouslySetInnerHTML={{ __html: pt }}
                              />
                            ))}
                          </ul>
                        ) : null}

                        {slide.tableHtml ? (
                          <div
                            className="mt-3 overflow-x-auto rounded-lg border"
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

                      {/* Dark Editorial Navy SVG Diagram Stage */}
                      {slide.svg ? (
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0e1726] p-3 text-white">
                          <div className="mb-2 flex items-center justify-between gap-2 px-1">
                            <span className="font-mono-code text-[10.5px] font-bold uppercase tracking-wider text-[#66c7a6]">
                              Diagram · {slide.slideRef}
                            </span>
                            <button
                              type="button"
                              onClick={() => setZoomedSlide(slide)}
                              className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-100 transition-colors hover:bg-white/20 cursor-pointer"
                            >
                              <ZoomIn className="h-3.5 w-3.5 text-[#e58a62]" />
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
                            className="chapter-svg-stage cursor-zoom-in overflow-x-auto rounded-lg bg-[#0c1017]/60 p-2"
                            dangerouslySetInnerHTML={{ __html: slide.svg }}
                          />

                          {slide.svgCaption ? (
                            <p className="mt-2 px-1 text-center text-[11.5px] leading-relaxed text-slate-300">
                              {slide.svgCaption}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    {/* LEFT PANE (RTL End): Deep Arabic Engineering Explanation */}
                    <div className="flex flex-col justify-between space-y-3.5 xl:col-span-7">
                      <div className="space-y-3.5">
                        {/* Why Box */}
                        <div
                          className="rounded-xl border p-3.5"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                            borderRightWidth: "3.5px",
                            borderRightColor: "var(--brand-primary)",
                          }}
                        >
                          <div
                            className="mb-1 flex items-center gap-1.5 text-[12px] font-extrabold"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                            <span>الفكرة الهندسية</span>
                          </div>
                          <p
                            className="text-[13.5px] font-semibold leading-relaxed"
                            style={{ color: "var(--text-primary)" }}
                            dangerouslySetInnerHTML={{ __html: slide.why }}
                          />
                        </div>

                        {/* Deep Explanation Points */}
                        <div className="space-y-2">
                          <div
                            className="text-[12px] font-extrabold"
                            style={{ color: "var(--text-muted)" }}
                          >
                            الشرح المفصل بالعربي والمصطلح الإنجليزي:
                          </div>
                          <ul className="chapter-deep-list space-y-2">
                            {slide.deepPoints.map((pt, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                                style={{
                                  background: "var(--bg-canvas)",
                                  borderColor: "var(--border-soft)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                <span
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: "var(--accent-warm)" }}
                                />
                                <span
                                  className="min-w-0 flex-1"
                                  dangerouslySetInnerHTML={{ __html: pt }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Exam Spot Callout */}
                        <div
                          className="rounded-xl border p-3.5"
                          style={{
                            background: "var(--accent-warm-soft)",
                            borderColor:
                              "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                          }}
                        >
                          <div
                            className="mb-1 flex items-center gap-1.5 text-[12px] font-extrabold"
                            style={{ color: "var(--accent-warm-text)" }}
                          >
                            <Flame className="h-3.5 w-3.5 shrink-0" />
                            <span>موضع سؤال الامتحان (Exam Spot)</span>
                          </div>
                          <p
                            className="text-[13px] font-semibold leading-relaxed text-[var(--text-primary)]"
                            dangerouslySetInnerHTML={{ __html: slide.examSpot }}
                          />
                        </div>
                      </div>

                      {/* Quick Notebook Strip (Editorial Navy Gradient) */}
                      <div
                        className="rounded-xl border border-white/10 p-3.5 text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--hero-bg) 0%, var(--hero-bg-end) 100%)",
                        }}
                      >
                        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold text-[#66c7a6]">
                          <NotebookPen className="h-3.5 w-3.5 shrink-0" />
                          <span>كشكولك — ملخص الحفظ السريع</span>
                        </div>
                        <pre
                          dir="ltr"
                          className="font-mono-code whitespace-pre-wrap text-[12px] leading-relaxed text-slate-100"
                        >
                          {slide.notebookEn}
                        </pre>
                        <p className="mt-2 border-t border-white/10 pt-2 text-[12.5px] font-semibold leading-relaxed text-slate-200">
                          {slide.notebookAr}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Single-Slide Stepper Footer */}
          {displayMode === "single" ? (
            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-3"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <button
                type="button"
                disabled={activeSlideIndex <= 0}
                onClick={() =>
                  setActiveSlideIndex((prev) => Math.max(0, prev - 1))
                }
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-[12.5px] font-extrabold transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <ChevronRight className="h-4 w-4" />
                <span>السلايد السابقة</span>
              </button>

              <span className="font-mono-code text-[12px] font-bold text-[var(--text-muted)]">
                {activeSlideIndex + 1} / {totalSlides}
              </span>

              <button
                type="button"
                disabled={activeSlideIndex >= totalSlides - 1}
                onClick={() =>
                  setActiveSlideIndex((prev) =>
                    Math.min(totalSlides - 1, prev + 1)
                  )
                }
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-extrabold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                style={{ background: "var(--hero-bg)" }}
              >
                <span>السلايد التالية</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        /* ==================== TAB 2: INTERACTIVE LAB ==================== */
        <div
          className="space-y-4 rounded-2xl border p-4 sm:p-5"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="space-y-1">
            <span
              className="text-[11px] font-extrabold"
              style={{ color: "var(--success-fg)" }}
            >
              المعمل التفاعلي العملي
            </span>
            <h4 className="text-[16.5px] font-black text-[var(--text-primary)] sm:text-[18px]">
              {chapter.lab.title}
            </h4>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {chapter.lab.subtitle}
            </p>
          </div>

          {/* Step Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {chapter.lab.steps.map((step, idx) => {
              const active = idx === activeLabStep;
              return (
                <button
                  key={`${step.btn}-${idx}`}
                  type="button"
                  onClick={() => setActiveLabStep(idx)}
                  className="inline-flex min-h-[40px] items-center rounded-xl border px-3.5 py-2 text-[12.5px] font-extrabold transition-all cursor-pointer"
                  style={
                    active
                      ? {
                          background: "var(--accent-warm)",
                          borderColor: "var(--accent-warm)",
                          color: "#ffffff",
                        }
                      : {
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  {step.btn}
                </button>
              );
            })}
          </div>

          {/* Dark Editorial Navy Lab Stage */}
          {currentLabStep ? (
            <div className="space-y-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e1726] p-4 text-white sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3">
                <h5
                  dir="ltr"
                  className="font-en text-left text-[15px] font-extrabold text-white sm:text-[16px]"
                >
                  {currentLabStep.heading}
                </h5>
                <span className="font-mono-code rounded-full border border-[#66c7a6]/40 bg-[#66c7a6]/15 px-3 py-1 text-[11.5px] font-extrabold text-[#66c7a6]">
                  {currentLabStep.badge}
                </span>
              </div>

              {currentLabStep.visualHtml ? (
                <div
                  dir="ltr"
                  className="chapter-lab-visual overflow-x-auto py-1"
                  dangerouslySetInnerHTML={{
                    __html: currentLabStep.visualHtml,
                  }}
                />
              ) : null}

              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3.5 text-[13.5px] leading-relaxed text-slate-100">
                {currentLabStep.detail}
              </div>

              <div
                dir="ltr"
                className="font-mono-code flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11.5px]"
              >
                <span className="text-slate-300">
                  {currentLabStep.telemetryLeft}
                </span>
                <span className="font-bold text-[#f0a786]">
                  {currentLabStep.telemetryRight}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ==================== DIAGRAM ZOOM MODAL ==================== */}
      {zoomedSlide && zoomedSlide.svg ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`تكبير رسمة ${zoomedSlide.slideRef}`}
          onClick={() => setZoomedSlide(null)}
          className="modal-backdrop fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0e1726] text-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <span className="font-mono-code text-[11px] font-bold text-[#e58a62]">
                  {zoomedSlide.slideRef}
                </span>
                <h5 className="truncate text-[14px] font-extrabold text-white">
                  {zoomedSlide.title}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setZoomedSlide(null)}
                aria-label="إغلاق نافذة التكبير"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="chapter-svg-zoom flex-1 overflow-auto p-4 sm:p-6">
              <div
                className="mx-auto w-full"
                dangerouslySetInnerHTML={{ __html: zoomedSlide.svg }}
              />
              {zoomedSlide.svgCaption ? (
                <p className="mt-4 text-center text-[13px] leading-relaxed text-slate-300">
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
