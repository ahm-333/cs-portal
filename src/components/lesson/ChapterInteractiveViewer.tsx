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
const FONT_SCALES = [0.92, 1, 1.12] as const;

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
  const [fontScaleIdx, setFontScaleIdx] = useState<number>(1);
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
  const fontScale = FONT_SCALES[fontScaleIdx] ?? 1;

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
          target.tagName === "SELECT" ||
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
      style={{ "--reading-scale": fontScale } as React.CSSProperties}
      className={
        isFullscreen
          ? `chapter-viewer ${recallBlur ? "recall-blur" : ""} fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[var(--bg-canvas)] p-4 sm:p-6`
          : `chapter-viewer ${recallBlur ? "recall-blur" : ""} space-y-4`
      }
    >
      {/* ==================== SLEEK ATELIER READING CONTROL BAR ==================== */}
      <div
        className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border px-3 py-2.5 sm:px-4"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        {/* Right side: Optional Bonus Switcher + Compact Slide Jump + Mastery Counter */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {hasBonusProblems ? (
            <div
              className="grid w-full grid-cols-2 sm:inline-flex sm:w-auto items-center gap-0.5 rounded-xl border p-0.5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveSection("slides")}
                className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-lg px-3 py-1 text-[11.5px] font-extrabold transition-all cursor-pointer"
                style={
                  activeSection === "slides"
                    ? {
                        background: "var(--brand-primary)",
                        color: "var(--atelier-cta-fg)",
                      }
                    : { color: "var(--text-secondary)" }
                }
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span>الشرائح</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("bonus")}
                className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[11.5px] font-extrabold transition-all cursor-pointer"
                style={
                  activeSection === "bonus"
                    ? {
                        background: "var(--accent-warm)",
                        color: "var(--atelier-cta-fg)",
                      }
                    : { color: "var(--accent-warm-text)" }
                }
              >
                <Calculator className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">مسائل 3 و 4 (بونص)</span>
              </button>
            </div>
          ) : null}

          {activeSection === "slides" ? (
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
              <select
                aria-label="الانتقال السريع لأي شريحة"
                value={activeSlideIndex}
                onChange={(e) => handleJumpToSlide(Number(e.target.value))}
                className="h-9 w-full sm:w-auto sm:max-w-[300px] truncate rounded-xl border px-3 text-[12px] font-bold outline-none cursor-pointer transition-colors focus:border-[var(--border-strong)]"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                {chapter.slides.map((slide, idx) => (
                  <option key={slide.id} value={idx}>
                    {`${String(idx + 1).padStart(2, "0")}/${String(totalSlides).padStart(2, "0")} · ${slide.title}${masteredSet.has(slide.id) ? " ✓" : ""}`}
                  </option>
                ))}
              </select>

              <span
                className="hidden md:inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono-code text-[11px] font-extrabold"
                style={{
                  background: "var(--success-soft)",
                  borderColor: "color-mix(in srgb, var(--success-fg) 28%, transparent)",
                  color: "var(--success-fg)",
                }}
                title="عدد الشرائح التي حددتها كمفهومة"
              >
                <Check className="h-3 w-3" />
                <span>
                  {masteredCount}/{totalSlides}
                </span>
                <span className="opacity-70">({masteryPct}%)</span>
              </span>
            </div>
          ) : null}
        </div>

        {/* Left side: Refined Reading Comfort Controls (Single/All, Recall Blur, A-/A+, Fullscreen) */}
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          {activeSection === "slides" ? (
            <>
              {/* Single vs All Segmented Toggle */}
              <div
                className="hidden md:inline-flex items-center gap-0.5 rounded-xl border p-0.5"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setDisplayMode("single")}
                  className="inline-flex min-h-[30px] items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-colors cursor-pointer"
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
                  <span>شريحة بشريحة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode("all")}
                  className="inline-flex min-h-[30px] items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-colors cursor-pointer"
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
                  <span>الكل</span>
                </button>
              </div>

              {/* Font Scale A- / A+ */}
              <div
                className="inline-flex h-9 items-center overflow-hidden rounded-xl border"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }}
                role="group"
                aria-label="حجم خط القراءة"
              >
                <button
                  type="button"
                  onClick={() => setFontScaleIdx((i) => Math.max(0, i - 1))}
                  disabled={fontScaleIdx <= 0}
                  title="تصغير الخط"
                  aria-label="تصغير الخط"
                  className="font-mono-code inline-flex h-full items-center justify-center px-2 text-[11px] font-extrabold transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  A-
                </button>
                <span
                  aria-hidden="true"
                  className="h-4 w-[1px]"
                  style={{ background: "var(--border-soft)" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFontScaleIdx((i) =>
                      Math.min(FONT_SCALES.length - 1, i + 1)
                    )
                  }
                  disabled={fontScaleIdx >= FONT_SCALES.length - 1}
                  title="تكبير الخط"
                  aria-label="تكبير الخط"
                  className="font-mono-code inline-flex h-full items-center justify-center px-2 text-[11px] font-extrabold transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  style={{ color: "var(--text-primary)" }}
                >
                  A+
                </button>
              </div>

              {/* Recall Blur ("اختبار ذاتي") */}
              <button
                type="button"
                onClick={() => setRecallBlur((prev) => !prev)}
                aria-pressed={recallBlur}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-[11.5px] font-bold transition-all cursor-pointer"
                style={
                  recallBlur
                    ? {
                        background: "var(--accent-warm-soft)",
                        borderColor: "var(--accent-warm)",
                        color: "var(--accent-warm-text)",
                      }
                    : {
                        background: "var(--bg-surface)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-secondary)",
                      }
                }
                title="غبّش المصطلحات المهمة ومرّر الماوس للكشف عشان تختبر حفظك"
              >
                {recallBlur ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                <span>{recallBlur ? "إظهار النص" : "اختبار ذاتي"}</span>
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:border-[var(--border-strong)] cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ==================== BONUS PROBLEMS VIEW ==================== */}
      {hasBonusProblems && activeSection === "bonus" ? (
        <CgProblemsBonusViewer defaultTab={chapter.bonusDefaultTab} />
      ) : null}

      {/* ==================== ATELIER EDITORIAL SLIDE READER ==================== */}
      {activeSection === "slides" ? (
        <div ref={slideTopRef} className="space-y-4">
          <div className="space-y-6">
            {visibleSlides.map(({ slide, index }) => {
              const isMastered = masteredSet.has(slide.id);
              const isCopied = copiedSlideId === slide.id;
              return (
                <article
                  key={slide.id}
                  id={`chapter-slide-${chapter.chapterNum}-${slide.id}`}
                  className="sapphire-rim scroll-mt-24 overflow-hidden rounded-2xl border"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Editorial Slide Header */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-6"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                      <span
                        className="font-mono-code inline-flex h-7 min-w-[30px] shrink-0 items-center justify-center rounded-lg border px-2 text-[11.5px] font-black"
                        style={{
                          background: "var(--accent-warm-soft)",
                          borderColor:
                            "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                          color: "var(--accent-warm-text)",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-mono-code shrink-0 rounded-lg border px-2.5 py-0.5 text-[11px] font-bold"
                        style={{
                          background: "var(--bg-subtle)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-secondary)",
                        }}
                      >
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
                      className="inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-1 text-[11.5px] font-extrabold transition-all cursor-pointer"
                      style={
                        isMastered
                          ? {
                              background: "var(--success-soft)",
                              borderColor:
                                "color-mix(in srgb, var(--success-fg) 42%, transparent)",
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
                        {isMastered ? "✓ فهمت الشريحة" : "تحديد كمفهومة"}
                      </span>
                    </button>
                  </div>

                  {/* Editorial Split-View Content */}
                  <div
                    className="grid grid-cols-1 gap-4 sm:gap-6 p-3.5 sm:p-6 xl:grid-cols-12 xl:gap-7"
                    style={{
                      fontSize: `calc(14px * var(--reading-scale, 1))`,
                    }}
                  >
                    {/* RIGHT PANE: Original Academic Slide + Crisp Diagram Stage */}
                    <div className="space-y-4 xl:col-span-5">
                      <div
                        dir="ltr"
                        className="chapter-orig-slide overflow-hidden rounded-2xl border text-left"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                        }}
                      >
                        <div
                          className="flex items-center justify-between border-b px-4 py-2.5"
                          style={{
                            background: "var(--bg-subtle)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <span
                            className="font-mono-code inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: "var(--accent-warm)" }}
                            />
                            Original Lecture Slide
                          </span>
                          <span className="font-mono-code text-[11px] font-bold text-[var(--text-muted)]">
                            {String(index + 1).padStart(2, "0")}/
                            {String(totalSlides).padStart(2, "0")} ·{" "}
                            {slide.slideRef}
                          </span>
                        </div>

                        <div className="p-4">
                          {slide.enPoints && slide.enPoints.length > 0 ? (
                            <ul className="space-y-2.5 text-[0.95em] leading-[1.78] text-[var(--text-primary)]">
                              {slide.enPoints.map((pt, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2.5"
                                >
                                  <span
                                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ background: "var(--accent-warm)" }}
                                  />
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
                          className="overflow-hidden rounded-2xl border p-3.5"
                          style={
                            slide.svgTheme === "light"
                              ? {
                                  background: "var(--bg-canvas)",
                                  borderColor: "var(--border-soft)",
                                }
                              : {
                                  background: "#0d1017",
                                  borderColor: "rgba(216, 176, 122, 0.2)",
                                  color: "#f6f4ef",
                                }
                          }
                        >
                          <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
                            <span
                              className="font-mono-code text-[10.5px] font-extrabold uppercase tracking-wider"
                              style={{
                                color:
                                  slide.svgTheme === "light"
                                    ? "var(--text-secondary)"
                                    : "#d8b07a",
                              }}
                            >
                              Visual Diagram · {slide.slideRef}
                            </span>
                            <button
                              type="button"
                              onClick={() => setZoomedSlide(slide)}
                              className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors hover:opacity-85 cursor-pointer"
                              style={
                                slide.svgTheme === "light"
                                  ? {
                                      background: "var(--bg-surface)",
                                      borderColor: "var(--border-soft)",
                                      color: "var(--text-primary)",
                                    }
                                  : {
                                      background: "rgba(216, 176, 122, 0.12)",
                                      borderColor: "rgba(216, 176, 122, 0.28)",
                                      color: "#eed2a4",
                                    }
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
                                ? "chapter-svg-stage cursor-zoom-in overflow-x-auto rounded-xl border bg-[#ffffff] p-2.5"
                                : "chapter-svg-stage cursor-zoom-in overflow-x-auto rounded-xl bg-[#090b10] p-2.5"
                            }
                            style={
                              slide.svgTheme === "light"
                                ? { borderColor: "var(--border-soft)" }
                                : undefined
                            }
                            dangerouslySetInnerHTML={{ __html: slide.svg }}
                          />

                          {slide.svgCaption ? (
                            <p
                              className="mt-2.5 px-1 text-center text-[11.5px] font-medium leading-relaxed"
                              style={{
                                color:
                                  slide.svgTheme === "light"
                                    ? "var(--text-secondary)"
                                    : "#c8c2b7",
                              }}
                            >
                              {slide.svgCaption}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      {/* Static Lecture Figure Image */}
                      {!slide.svg && slide.img ? (
                        <div
                          className="overflow-hidden rounded-2xl border p-3.5"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
                            <span
                              className="font-mono-code text-[10.5px] font-extrabold uppercase tracking-wider"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Slide Figure · {slide.slideRef}
                            </span>
                            <button
                              type="button"
                              onClick={() => setZoomedSlide(slide)}
                              className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors hover:opacity-85 cursor-pointer"
                              style={{
                                background: "var(--bg-surface)",
                                borderColor: "var(--border-soft)",
                                color: "var(--text-primary)",
                              }}
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
                            className="cursor-zoom-in overflow-hidden rounded-xl border bg-white p-2"
                            style={{ borderColor: "var(--border-soft)" }}
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

                    {/* LEFT PANE: Refined Dual Atelier Arabic Explanation */}
                    <div className="flex flex-col justify-between space-y-4 xl:col-span-7">
                      <div className="space-y-4">
                        {/* 1. Core Idea — Architectural Focus Card */}
                        <div
                          className="rounded-2xl border p-4"
                          style={{
                            background:
                              "color-mix(in srgb, var(--brand-soft) 45%, var(--bg-canvas))",
                            borderColor:
                              "color-mix(in srgb, var(--brand-primary) 22%, var(--border-soft))",
                            borderRightWidth: "3px",
                            borderRightColor: "var(--brand-primary)",
                          }}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-lg"
                              style={{
                                background: "var(--brand-soft)",
                                color: "var(--brand-soft-text)",
                              }}
                            >
                              <Lightbulb className="h-3.5 w-3.5" />
                            </span>
                            <span
                              className="text-[12.5px] font-black"
                              style={{ color: "var(--brand-soft-text)" }}
                            >
                              الفكرة الأساسية (الزتونة)
                            </span>
                          </div>
                          <p
                            className="text-[1em] font-semibold leading-[1.9] text-[var(--text-primary)]"
                            dangerouslySetInnerHTML={{ __html: slide.why }}
                          />
                        </div>

                        {/* 2. Detailed Breakdown — Champagne Numbered Editorial Cards */}
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
                            {slide.deepPoints.map((pt, i) => (
                              <div
                                key={i}
                                className="relative flex items-start gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-[0.96em] leading-[1.9] transition-colors"
                                style={{
                                  background: "var(--bg-canvas)",
                                  borderColor: "var(--border-soft)",
                                  borderRightWidth: "2.5px",
                                  borderRightColor:
                                    "color-mix(in srgb, var(--accent-warm) 55%, var(--border-strong))",
                                }}
                              >
                                <span
                                  className="font-mono-code mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[11px] font-black"
                                  style={{
                                    background: "var(--accent-warm-soft)",
                                    borderColor:
                                      "color-mix(in srgb, var(--accent-warm) 32%, transparent)",
                                    color: "var(--accent-warm-text)",
                                  }}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <span
                                  className="min-w-0 flex-1 text-[var(--text-primary)]"
                                  dangerouslySetInnerHTML={{ __html: pt }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. Exam Focus Spotlight — Warm Champagne / Terracotta Card */}
                        <div
                          className="rounded-2xl border p-4"
                          style={{
                            background:
                              "color-mix(in srgb, var(--accent-warm-soft) 55%, var(--bg-canvas))",
                            borderColor:
                              "color-mix(in srgb, var(--accent-warm) 30%, var(--border-soft))",
                            borderRightWidth: "3px",
                            borderRightColor: "var(--accent-warm)",
                          }}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-lg"
                              style={{
                                background: "var(--accent-warm-soft)",
                                color: "var(--accent-warm-text)",
                              }}
                            >
                              <Target className="h-3.5 w-3.5" />
                            </span>
                            <span
                              className="text-[12.5px] font-black"
                              style={{ color: "var(--accent-warm-text)" }}
                            >
                              موضع سؤال الامتحان (ركز هنا)
                            </span>
                          </div>
                          <div
                            className="text-[0.96em] font-medium leading-[1.85] text-[var(--text-primary)]"
                            dangerouslySetInnerHTML={{ __html: slide.examSpot }}
                          />
                        </div>
                      </div>

                      {/* 4. Quick Memory Card — Calm Emerald Editorial Block + Copy */}
                      <div
                        className="rounded-2xl border p-4"
                        style={{
                          background:
                            "color-mix(in srgb, var(--success-soft) 55%, var(--bg-canvas))",
                          borderColor:
                            "color-mix(in srgb, var(--success-fg) 28%, var(--border-soft))",
                          borderRightWidth: "3px",
                          borderRightColor: "var(--success-fg)",
                        }}
                      >
                        <div className="mb-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-lg"
                              style={{
                                background: "var(--success-soft)",
                                color: "var(--success-fg)",
                              }}
                            >
                              <NotebookPen className="h-3.5 w-3.5" />
                            </span>
                            <span
                              className="text-[12.5px] font-black"
                              style={{ color: "var(--success-fg)" }}
                            >
                              الخلاصة السريعة للحفظ
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyNotebook(slide)}
                            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors hover:opacity-85 cursor-pointer"
                            style={{
                              background: "var(--bg-surface)",
                              borderColor:
                                "color-mix(in srgb, var(--success-fg) 30%, var(--border-soft))",
                              color: "var(--success-fg)",
                            }}
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
                          className="font-en whitespace-pre-line rounded-xl border px-3.5 py-2.5 text-left text-[0.92em] font-bold leading-[1.75] text-[var(--text-primary)]"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          {slide.notebookEn}
                        </p>
                        <p className="mt-2.5 text-[0.93em] font-semibold leading-relaxed text-[var(--text-secondary)]">
                          {slide.notebookAr}
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
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-[12.5px] font-bold transition-colors hover:border-[var(--border-strong)] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <ChevronRight className="h-4 w-4" />
                <span>الشريحة السابقة</span>
              </button>

              <div className="flex flex-col items-center gap-1.5">
                <span className="font-mono-code text-[12px] font-extrabold text-[var(--text-primary)]">
                  Slide {activeSlideIndex + 1} / {totalSlides}
                </span>
                <div
                  className="h-1.5 w-32 overflow-hidden rounded-full sm:w-44"
                  style={{ background: "var(--bg-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(((activeSlideIndex + 1) / totalSlides) * 100)}%`,
                      background: "var(--accent-warm)",
                    }}
                  />
                </div>
              </div>

              {activeSlideIndex < totalSlides - 1 ? (
                <button
                  type="button"
                  onClick={() => handleStepSlide(activeSlideIndex + 1)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-5 py-2 text-[12.5px] font-extrabold transition-opacity hover:opacity-92 cursor-pointer"
                  style={{
                    background: "var(--atelier-cta-bg)",
                    color: "var(--atelier-cta-fg)",
                  }}
                >
                  <span>الشريحة التالية</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : onGoToQuiz ? (
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-5 py-2 text-[12.5px] font-extrabold text-white transition-opacity hover:opacity-92 cursor-pointer"
                  style={{ background: "var(--success-fg)" }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>اختبر نفسك في الكويز</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-4 py-2 text-[12.5px] font-bold opacity-50"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>نهاية الفصل ✓</span>
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
                ? "flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-[#ffffff] text-[#131c2b] shadow-2xl"
                : "flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[rgba(216,176,122,0.24)] bg-[#0d1017] text-[#f6f4ef] shadow-2xl"
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
                      : "font-mono-code text-[11px] font-semibold text-[#d8b07a]"
                  }
                >
                  {zoomedSlide.slideRef}
                </span>
                <h5
                  className={
                    zoomedSlide.img || zoomedSlide.svgTheme === "light"
                      ? "truncate text-[14px] font-extrabold text-slate-900"
                      : "truncate text-[14px] font-extrabold text-[#f6f4ef]"
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
                      : "mt-4 text-center text-[13px] leading-relaxed text-[#c8c2b7]"
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
