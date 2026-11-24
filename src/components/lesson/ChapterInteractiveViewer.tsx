"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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

interface ChapterInteractiveViewerProps {
  chapter: InteractiveChapterData;
  onGoToQuiz?: () => void;
}

type SlideDisplayMode = "single" | "all";

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
  // Default to focused single-slide reading mode so each slide breathes cleanly
  const [displayMode, setDisplayMode] = useState<SlideDisplayMode>("single");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>(() =>
    loadMasteredSlideIds(chapter.lessonId)
  );
  const [zoomedSlide, setZoomedSlide] = useState<ChapterSlide | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideTopRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = chapter.slides.length;

  // Keyboard shortcuts: Escape closes modals; Left/Right navigate in single-slide mode (RTL aware)
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

      if (displayMode !== "single" || zoomedSlide) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      // In RTL, ArrowLeft advances to next slide, ArrowRight goes to previous slide
      if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === "ArrowRight") {
        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomedSlide, isFullscreen, displayMode, totalSlides]);

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
          ? "chapter-viewer fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[var(--bg-canvas)] p-4 sm:p-6"
          : "chapter-viewer space-y-4"
      }
    >
      {/* ==================== CALM EDITORIAL HEADER BAR ==================== */}
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
                className="font-mono-code inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold"
                style={{
                  background:
                    "color-mix(in srgb, var(--brand-soft) 75%, transparent)",
                  color: "var(--brand-soft-text)",
                }}
              >
                Chapter {chapter.chapterNum} · {chapter.courseCode}
              </span>
              <span
                className="text-[11.5px] font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                {totalSlides} سلايد تفاعلية
              </span>
            </div>

            <h3 className="text-[16.5px] font-black leading-snug text-[var(--text-primary)] sm:text-[18.5px]">
              <span className="font-en">{chapter.titleEn}</span>
              <span
                className="mx-1.5 font-normal opacity-40"
                style={{ color: "var(--text-muted)" }}
              >
                ·
              </span>
              <span className="text-[14.5px] font-bold text-[var(--text-secondary)] sm:text-[15.5px]">
                {chapter.titleAr}
              </span>
            </h3>
          </div>

          {/* Quiet Mastery Progress + Fullscreen */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-2.5 rounded-xl border px-3 py-1.5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span
                className="text-[11px] font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                تمت مذاكرته
              </span>
              <span className="font-mono-code text-[12px] font-extrabold text-[var(--text-primary)]">
                {masteredCount}/{totalSlides}
              </span>
              <div
                className="h-1.5 w-14 overflow-hidden rounded-full sm:w-16"
                style={{ background: "var(--bg-subtle)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${masteryPct}%`,
                    background: "var(--success-fg)",
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:opacity-85 cursor-pointer sm:w-auto sm:gap-1.5 sm:px-3"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
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

        {/* Clean Toolbar Row: Display Mode + Quiz Jump */}
        <div
          className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 border-t pt-3.5"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div
            className="inline-flex items-center gap-0.5 rounded-xl border p-0.5"
            style={{
              background: "var(--bg-surface)",
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
                      background: "var(--bg-subtle)",
                      color: "var(--text-primary)",
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
                      background: "var(--bg-subtle)",
                      color: "var(--text-primary)",
                    }
                  : { color: "var(--text-muted)" }
              }
            >
              <LayoutList className="h-3.5 w-3.5" />
              <span>عرض الكل ({totalSlides})</span>
            </button>
          </div>

          {onGoToQuiz ? (
            <button
              type="button"
              onClick={onGoToQuiz}
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[12px] font-bold transition-colors hover:opacity-85 cursor-pointer"
              style={{
                background:
                  "color-mix(in srgb, var(--success-soft) 70%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--success-fg) 22%, transparent)",
                color: "var(--success-fg)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>اختبر نفسك في الكويز</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* ==================== REFINED SLIDE VIEWER ==================== */}
      <div ref={slideTopRef} className="space-y-4">
          {/* Calm Quick-Jump Navigator Strip */}
          <div
            className="rounded-2xl border px-3 py-2.5"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div className="mb-2 flex items-center justify-between gap-2 px-1">
              <span
                className="text-[11px] font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                فهرس السلايدات السريع
              </span>
              {displayMode === "single" ? (
                <span
                  className="font-mono-code text-[11px] font-bold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {activeSlideIndex + 1} / {totalSlides}
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
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-bold transition-all cursor-pointer"
                    style={
                      isActive
                        ? {
                            background: "var(--hero-bg)",
                            borderColor: "var(--hero-bg)",
                            color: "#ffffff",
                          }
                        : isDone
                          ? {
                              background:
                                "color-mix(in srgb, var(--success-soft) 65%, transparent)",
                              borderColor:
                                "color-mix(in srgb, var(--success-fg) 26%, transparent)",
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

          {/* Slide Card(s) */}
          <div className="space-y-6">
            {visibleSlides.map(({ slide, index }) => {
              const isMastered = masteredSet.has(slide.id);
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
                  {/* Understated Editorial Slide Header */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-6"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                      <span
                        className="font-mono-code shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold"
                        style={{
                          background: "var(--bg-subtle)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {slide.slideRef}
                      </span>
                      <h4 className="text-[15px] font-black leading-snug text-[var(--text-primary)] sm:text-[16px]">
                        {slide.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMastered(slide.id)}
                      aria-pressed={isMastered}
                      className="inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1 text-[11.5px] font-bold transition-all cursor-pointer"
                      style={
                        isMastered
                          ? {
                              background:
                                "color-mix(in srgb, var(--success-soft) 75%, transparent)",
                              borderColor:
                                "color-mix(in srgb, var(--success-fg) 35%, transparent)",
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
                        {isMastered ? "فهمت السلايد ✓" : "تحديد كمفهوم"}
                      </span>
                    </button>
                  </div>

                  {/* Calm Split-View Content */}
                  <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 xl:grid-cols-12 xl:gap-7">
                    {/* RIGHT PANE: Original Slide Reference + Diagram */}
                    <div className="space-y-4 xl:col-span-5">
                      <div
                        dir="ltr"
                        className="chapter-orig-slide rounded-xl border p-4 text-left"
                        style={{
                          background:
                            "color-mix(in srgb, var(--bg-canvas) 75%, var(--bg-surface))",
                          borderColor: "var(--border-soft)",
                          borderLeftWidth: "3px",
                          borderLeftColor:
                            "color-mix(in srgb, var(--brand-primary) 55%, transparent)",
                        }}
                      >
                        <div
                          className="font-mono-code mb-2.5 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-wider"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <span>Original Slide</span>
                          <span>
                            {index + 1}/{totalSlides} · {slide.slideRef}
                          </span>
                        </div>

                        {slide.enPoints && slide.enPoints.length > 0 ? (
                          <ul
                            className="space-y-2 pl-4 text-[13px] leading-[1.7] list-disc"
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
                            className="mt-3.5 overflow-x-auto rounded-lg border"
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

                      {/* Soft Matte Dark Slate SVG Diagram Stage */}
                      {slide.svg ? (
                        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#111a2b] p-3.5 text-white">
                          <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
                            <span className="font-mono-code text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                              Diagram · {slide.slideRef}
                            </span>
                            <button
                              type="button"
                              onClick={() => setZoomedSlide(slide)}
                              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition-colors hover:bg-white/[0.14] cursor-pointer"
                            >
                              <ZoomIn className="h-3.5 w-3.5 text-[#66c7a6]" />
                              <span>تكبير</span>
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
                            className="chapter-svg-stage cursor-zoom-in overflow-x-auto rounded-lg bg-[#0d1422] p-2"
                            dangerouslySetInnerHTML={{ __html: slide.svg }}
                          />

                          {slide.svgCaption ? (
                            <p className="mt-2.5 px-1 text-center text-[11.5px] leading-relaxed text-slate-300/90">
                              {slide.svgCaption}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    {/* LEFT PANE: Clean Airy Arabic + English Explanation */}
                    <div className="flex flex-col justify-between space-y-5 xl:col-span-7">
                      <div className="space-y-5">
                        {/* Calm "Core Idea" Whisper Highlight */}
                        <div
                          className="rounded-xl px-4 py-3.5"
                          style={{
                            background:
                              "color-mix(in srgb, var(--brand-soft) 45%, var(--bg-canvas))",
                            borderRight:
                              "3px solid color-mix(in srgb, var(--brand-primary) 55%, transparent)",
                          }}
                        >
                          <div
                            className="mb-1 flex items-center gap-1.5 text-[11.5px] font-extrabold"
                            style={{ color: "var(--brand-soft-text)" }}
                          >
                            <Lightbulb className="h-3.5 w-3.5 shrink-0 opacity-85" />
                            <span>الفكرة الأساسية</span>
                          </div>
                          <p
                            className="text-[13.5px] font-semibold leading-[1.8]"
                            style={{ color: "var(--text-primary)" }}
                            dangerouslySetInnerHTML={{ __html: slide.why }}
                          />
                        </div>

                        {/* Open, Breathable Explanation List (No heavy box per bullet!) */}
                        <div className="space-y-2">
                          <div
                            className="text-[11.5px] font-extrabold tracking-wide"
                            style={{ color: "var(--text-muted)" }}
                          >
                            الشرح المفصل
                          </div>
                          <ul
                            className="chapter-deep-list divide-y"
                            style={{
                              borderColor:
                                "color-mix(in srgb, var(--border-soft) 65%, transparent)",
                            }}
                          >
                            {slide.deepPoints.map((pt, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 py-2.5 text-[13.5px] leading-[1.85] first:pt-1 last:pb-1"
                                style={{
                                  color: "var(--text-secondary)",
                                  borderColor:
                                    "color-mix(in srgb, var(--border-soft) 65%, transparent)",
                                }}
                              >
                                <span
                                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full opacity-75"
                                  style={{ background: "var(--brand-primary)" }}
                                />
                                <span
                                  className="min-w-0 flex-1"
                                  dangerouslySetInnerHTML={{ __html: pt }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Soft Warm Exam Focus Callout */}
                        <div
                          className="rounded-xl border px-4 py-3.5"
                          style={{
                            background:
                              "color-mix(in srgb, var(--accent-warm-soft) 50%, var(--bg-canvas))",
                            borderColor:
                              "color-mix(in srgb, var(--accent-warm) 20%, transparent)",
                          }}
                        >
                          <div
                            className="mb-1 flex items-center gap-1.5 text-[11.5px] font-extrabold"
                            style={{ color: "var(--accent-warm-text)" }}
                          >
                            <Target className="h-3.5 w-3.5 shrink-0 opacity-85" />
                            <span>موضع سؤال الامتحان</span>
                          </div>
                          <p
                            className="text-[13px] font-medium leading-[1.8]"
                            style={{ color: "var(--text-primary)" }}
                            dangerouslySetInnerHTML={{ __html: slide.examSpot }}
                          />
                        </div>
                      </div>

                      {/* Calm Sage-Mint Quick Takeaway Card (Airy in both Light & Dark!) */}
                      <div
                        className="rounded-xl border px-4 py-3.5"
                        style={{
                          background:
                            "color-mix(in srgb, var(--success-soft) 45%, var(--bg-canvas))",
                          borderColor:
                            "color-mix(in srgb, var(--success-fg) 20%, transparent)",
                        }}
                      >
                        <div
                          className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-extrabold"
                          style={{ color: "var(--success-fg)" }}
                        >
                          <NotebookPen className="h-3.5 w-3.5 shrink-0 opacity-85" />
                          <span>الخلاصة السريعة للحفظ</span>
                        </div>
                        <p
                          dir="ltr"
                          className="font-en whitespace-pre-line text-left text-[12.5px] font-semibold leading-[1.7] text-[var(--text-primary)]"
                        >
                          {slide.notebookEn}
                        </p>
                        <p
                          className="mt-2 border-t pt-2 text-[12.5px] font-medium leading-relaxed"
                          style={{
                            borderColor:
                              "color-mix(in srgb, var(--success-fg) 16%, transparent)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {slide.notebookAr}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Single-Slide Stepper Navigation Bar */}
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
                <span className="font-mono-code text-[12px] font-bold text-[var(--text-secondary)]">
                  Slide {activeSlideIndex + 1} / {totalSlides}
                </span>
                <div
                  className="h-1 w-28 overflow-hidden rounded-full sm:w-40"
                  style={{ background: "var(--bg-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(((activeSlideIndex + 1) / totalSlides) * 100)}%`,
                      background: "var(--brand-primary)",
                    }}
                  />
                </div>
              </div>

              {activeSlideIndex < totalSlides - 1 ? (
                <button
                  type="button"
                  onClick={() => handleStepSlide(activeSlideIndex + 1)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-extrabold text-white transition-opacity hover:opacity-95 cursor-pointer"
                  style={{ background: "var(--hero-bg)" }}
                >
                  <span>السلايد التالية</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : onGoToQuiz ? (
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-extrabold text-white transition-opacity hover:opacity-95 cursor-pointer"
                  style={{ background: "var(--success-fg)" }}
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
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#111a2b] text-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <span className="font-mono-code text-[11px] font-semibold text-slate-400">
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
