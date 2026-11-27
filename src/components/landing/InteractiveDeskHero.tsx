"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/layout/themeStore";
import { usePortalState } from "@/lib/stores/portalStore";
import { EDITORIAL_EASE } from "@/components/ui/AwwwardsPrimitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type PillarId = "video" | "read" | "summary" | "quiz";

interface StudyPillar {
  id: PillarId;
  index: number;
  num: string;
  label: string;
  sub: string;
  kicker: string;
  needleDeg: number;
  arcProgress: number;
  positionClass: string;
  isPaperNode?: boolean;
}

const STUDY_PILLARS: readonly StudyPillar[] = [
  {
    id: "video",
    index: 0,
    num: "01",
    label: "فيديو الشرح",
    sub: "اسمع الفصل",
    kicker: "01 · VIDEO",
    needleDeg: 90,
    arcProgress: 0.25,
    positionClass: "right-0 lg:-right-3 top-1/2 -translate-y-1/2",
  },
  {
    id: "read",
    index: 1,
    num: "02",
    label: "اقرأ شرح الفصل",
    sub: "بديل الفيديو",
    kicker: "02 · GUIDE",
    needleDeg: 0,
    arcProgress: 0.5,
    positionClass: "top-1 lg:top-2 left-1/2 -translate-x-1/2",
  },
  {
    id: "summary",
    index: 2,
    num: "03",
    label: "ملخص سريع",
    sub: "افتكر في دقايق",
    kicker: "03 · REVISION",
    needleDeg: 180,
    arcProgress: 0.75,
    positionClass: "bottom-1 lg:bottom-2 left-1/2 -translate-x-1/2",
    isPaperNode: true,
  },
  {
    id: "quiz",
    index: 3,
    num: "04",
    label: "أسئلة وكويزات",
    sub: "حلّ وثبّت",
    kicker: "94% READY",
    needleDeg: 270,
    arcProgress: 1,
    positionClass: "left-0 lg:-left-3 top-1/2 -translate-y-1/2",
  },
] as const;

interface BezelTick {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  major: boolean;
}

// Deterministic 48 watchmaker perimeter ticks (SSR-hydration safe)
const WATCHMAKER_TICKS: readonly BezelTick[] = Array.from({ length: 48 }, (_, i) => {
  const angle = ((i * 360) / 48) * (Math.PI / 180);
  const major = i % 12 === 0;
  const r1 = major ? 166 : 170;
  const r2 = 176;
  return {
    x1: (255 + r1 * Math.cos(angle)).toFixed(1),
    y1: (255 + r1 * Math.sin(angle)).toFixed(1),
    x2: (255 + r2 * Math.cos(angle)).toFixed(1),
    y2: (255 + r2 * Math.sin(angle)).toFixed(1),
    major,
  };
});

const WAVEFORM_BARS: readonly { height: number; active: boolean }[] = [
  { height: 8, active: true },
  { height: 14, active: true },
  { height: 20, active: true },
  { height: 12, active: true },
  { height: 18, active: true },
  { height: 15, active: true },
  { height: 22, active: true },
  { height: 11, active: true },
  { height: 16, active: true },
  { height: 14, active: false },
  { height: 19, active: false },
  { height: 11, active: false },
  { height: 15, active: false },
  { height: 9, active: false },
  { height: 13, active: false },
];

const AUTO_CYCLE_MS = 6000;

interface CenterLensContentProps {
  pillar: StudyPillar;
  isDark: boolean;
  reducedMotion: boolean;
}

function CenterLensContent({ pillar, isDark, reducedMotion }: CenterLensContentProps) {
  const textMain = isDark ? "#f6f4ef" : "#131c2b";
  const textMuted = isDark ? "rgba(182, 176, 166, 0.84)" : "#5c687c";
  const accent1 = isDark ? "#d8b07a" : "#1d6b52";
  const accent2 = isDark ? "#6ec4a3" : "#c25e33";
  const pillBg = isDark ? "rgba(255, 245, 230, 0.06)" : "rgba(30, 53, 92, 0.06)";
  const borderMid = isDark ? "rgba(216, 176, 122, 0.24)" : "rgba(30, 53, 92, 0.16)";

  switch (pillar.id) {
    case "video":
      return (
        <div className="w-full flex flex-col items-center justify-center gap-2 lg:gap-3">
          <span
            dir="ltr"
            className="font-mono-code text-[8.5px] lg:text-[10px] font-extrabold tracking-[0.1em] px-2.5 py-0.5 rounded-full"
            style={{
              color: isDark ? "#eed2a4" : "#c25e33",
              background: pillBg,
              border: `1px solid ${borderMid}`,
            }}
          >
            {pillar.kicker}
          </span>

          {/* Minimalist Glowing Play Orb */}
          <div className="relative flex items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full scale-125 opacity-45 blur-md"
              style={{
                background: isDark
                  ? "rgba(216, 176, 122, 0.35)"
                  : "rgba(194, 94, 51, 0.25)",
              }}
            />
            <div
              className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(216,176,122,0.24), rgba(216,176,122,0.08))"
                  : "linear-gradient(135deg, rgba(194,94,51,0.18), rgba(194,94,51,0.06))",
                border: `1.5px solid ${isDark ? "rgba(238,210,164,0.65)" : "rgba(194,94,51,0.55)"}`,
                boxShadow: isDark
                  ? "0 0 22px rgba(216, 176, 122, 0.24)"
                  : "0 6px 18px rgba(194, 94, 51, 0.16)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill={isDark ? "#eed2a4" : "#c25e33"}
                className="translate-x-[1px]"
                aria-hidden="true"
              >
                <path d="M5 3.2L13 8L5 12.8V3.2Z" />
              </svg>
            </div>
          </div>

          {/* Calm Audio/Video Waveform Bars */}
          <div
            className="flex items-center justify-center gap-[2.5px] lg:gap-[3.5px] h-5 lg:h-6 w-[134px] lg:w-[176px]"
            aria-hidden="true"
          >
            {WAVEFORM_BARS.map((bar, idx) => (
              <motion.span
                key={idx}
                className="w-[2.5px] lg:w-[3px] rounded-full"
                style={{
                  height: `${Math.round(bar.height * 0.85)}px`,
                  background: bar.active
                    ? isDark
                      ? "#d8b07a"
                      : "#c25e33"
                    : isDark
                      ? "rgba(255, 245, 230, 0.16)"
                      : "rgba(30, 53, 92, 0.15)",
                }}
                animate={
                  !reducedMotion && bar.active && idx % 3 === 1
                    ? { scaleY: [1, 0.65, 1] }
                    : undefined
                }
                transition={{
                  duration: 2.2 + (idx % 3) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* 3-Segment Chapter Progress Rail */}
          <div
            className="w-[134px] lg:w-[176px] grid grid-cols-[1.1fr_1.4fr_0.9fr] gap-1"
            aria-hidden="true"
          >
            <div
              className="h-1 rounded-full"
              style={{ background: isDark ? "#d8b07a" : "#c25e33" }}
            />
            <div
              className="h-1 rounded-full"
              style={{
                background: isDark
                  ? "linear-gradient(270deg, #d8b07a 58%, rgba(255,245,230,0.14) 58%)"
                  : "linear-gradient(270deg, #c25e33 58%, rgba(30,53,92,0.13) 58%)",
              }}
            />
            <div
              className="h-1 rounded-full"
              style={{
                background: isDark
                  ? "rgba(255, 245, 230, 0.14)"
                  : "rgba(30, 53, 92, 0.13)",
              }}
            />
          </div>

          <span
            className="text-[9.5px] lg:text-[11px] font-bold leading-snug max-w-[155px] lg:max-w-[205px]"
            style={{ color: textMuted }}
          >
            فصول زمنية واضحة بدون إعلانات
          </span>
        </div>
      );

    case "read":
      return (
        <div className="w-full flex flex-col items-center justify-center gap-2 lg:gap-2.5">
          <span
            dir="ltr"
            className="font-mono-code text-[8.5px] lg:text-[10px] font-extrabold tracking-[0.1em] px-2.5 py-0.5 rounded-full"
            style={{
              color: accent1,
              background: pillBg,
              border: `1px solid ${borderMid}`,
            }}
          >
            {pillar.kicker}
          </span>

          {/* Universal Structured Chapter Page Preview */}
          <div
            className="w-[138px] sm:w-[156px] lg:w-[192px] rounded-xl p-2 lg:p-2.5 text-right flex flex-col gap-1.5 lg:gap-2"
            style={{
              background: isDark
                ? "rgba(12, 14, 20, 0.88)"
                : "rgba(255, 255, 255, 0.94)",
              border: `1px solid ${borderMid}`,
              boxShadow: isDark
                ? "0 10px 24px rgba(0, 0, 0, 0.42)"
                : "0 8px 20px rgba(18, 28, 45, 0.08)",
            }}
          >
            {/* Header bar with A- / A+ */}
            <div
              className="flex items-center justify-between pb-1.5"
              style={{
                borderBottom: `1px solid ${
                  isDark ? "rgba(255,245,230,0.08)" : "rgba(30,53,92,0.1)"
                }`,
              }}
            >
              <span
                dir="ltr"
                className="font-mono-code text-[8px] lg:text-[9px] font-bold"
                style={{ color: accent1 }}
              >
                CHAPTER
              </span>
              <div dir="ltr" className="flex items-center gap-1">
                <span
                  className="font-mono-code text-[7.5px] lg:text-[8.5px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: pillBg, color: textMain }}
                >
                  A-
                </span>
                <span
                  className="font-mono-code text-[7.5px] lg:text-[8.5px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: isDark
                      ? "rgba(216,176,122,0.18)"
                      : "rgba(30,53,92,0.12)",
                    color: isDark ? "#eed2a4" : "#1e355c",
                  }}
                >
                  A+
                </span>
              </div>
            </div>

            {/* Clean Structured Heading + Text Lines */}
            <div className="space-y-1">
              <div
                className="h-1.5 lg:h-2 w-3/4 rounded-full"
                style={{
                  background: isDark
                    ? "rgba(246, 244, 239, 0.85)"
                    : "rgba(19, 28, 43, 0.8)",
                }}
              />
              <div
                className="h-1 w-full rounded-full"
                style={{
                  background: isDark
                    ? "rgba(220, 215, 206, 0.25)"
                    : "rgba(30, 53, 92, 0.16)",
                }}
              />
            </div>

            {/* Mini Universal Diagram / Schema Flow */}
            <div
              className="rounded-lg px-2 py-1.5 flex items-center justify-between gap-1"
              style={{
                background: isDark
                  ? "rgba(216, 176, 122, 0.06)"
                  : "rgba(30, 53, 92, 0.045)",
                border: `1px solid ${
                  isDark ? "rgba(216,176,122,0.15)" : "rgba(30,53,92,0.1)"
                }`,
              }}
              aria-hidden="true"
            >
              <span
                className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-md border"
                style={{
                  background: isDark ? "rgba(110,196,163,0.16)" : "rgba(29,107,82,0.14)",
                  borderColor: accent2,
                }}
              />
              <span
                className="flex-1 h-[1.5px] rounded-full"
                style={{ background: borderMid }}
              />
              <span
                className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full border"
                style={{
                  background: isDark ? "rgba(216,176,122,0.22)" : "rgba(30,53,92,0.16)",
                  borderColor: accent1,
                }}
              />
              <span
                className="flex-1 h-[1.5px] rounded-full"
                style={{ background: borderMid }}
              />
              <span
                className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-md border"
                style={{
                  background: isDark ? "rgba(180,167,214,0.2)" : "rgba(194,94,51,0.14)",
                  borderColor: isDark ? "#b4a7d6" : "#c25e33",
                }}
              />
            </div>

            {/* Clean Syntax Block */}
            <div
              dir="ltr"
              className="rounded-lg px-2 py-1.5 font-mono-code text-[7.5px] lg:text-[9px] leading-tight text-left"
              style={{
                background: isDark ? "#090b10" : "#152238",
                color: "#e6e2da",
              }}
            >
              <span style={{ color: "#6ec4a3" }}>step</span>
              <span style={{ color: "#d8b07a" }}>(data)</span>
              <span style={{ color: "rgba(230,226,218,0.65)" }}> → out</span>
            </div>
          </div>

          <span
            className="text-[9.5px] lg:text-[11px] font-bold leading-snug max-w-[155px] lg:max-w-[208px]"
            style={{ color: textMuted }}
          >
            شرح الشابتر كامل برسومات وأكواد
          </span>
        </div>
      );

    case "summary":
      return (
        <div className="w-full flex flex-col items-center justify-center gap-2 lg:gap-2.5">
          {/* Tactile Warm Ivory Paper Card with Terracotta Bookmark Ribbon */}
          <div
            className="relative w-[142px] sm:w-[162px] lg:w-[196px] rounded-[14px] p-2.5 lg:p-3.5 text-right flex flex-col gap-1.5 lg:gap-2"
            style={{
              background: "#f6f5f1",
              color: "#171614",
              border: "1px solid rgba(30, 53, 92, 0.12)",
              boxShadow: isDark
                ? "0 16px 32px rgba(0, 0, 0, 0.48)"
                : "0 12px 28px rgba(24, 34, 52, 0.12)",
            }}
          >
            {/* Terracotta Bookmark Ribbon */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-3.5 w-[9px] h-[14px] lg:h-[16px] rounded-b-[3px]"
              style={{ background: "#c25e33" }}
            />

            <div className="text-[8.5px] lg:text-[10px] font-extrabold text-[#c25e33] pl-4">
              ملخص الفصل في دقائق
            </div>

            <div className="space-y-1 lg:space-y-1.5">
              {[
                "أهم القوانين والمفاهيم",
                "مقارنات مركّزة ومنظّمة",
                "نقاط المراجعة السريعة",
              ].map((line, i) => (
                <div
                  key={line}
                  className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 lg:py-1 text-[8.5px] lg:text-[10px] font-bold"
                  style={{
                    background:
                      i === 0
                        ? "rgba(194, 94, 51, 0.11)"
                        : "rgba(30, 53, 92, 0.055)",
                    color: i === 0 ? "#8f3d1c" : "#1e355c",
                  }}
                >
                  <Check className="w-2.5 h-2.5 lg:w-3 lg:h-3 shrink-0 text-[#1d6b52]" />
                  <span className="truncate">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <span
            className="text-[9.5px] lg:text-[11px] font-bold leading-snug max-w-[155px] lg:max-w-[205px]"
            style={{ color: textMuted }}
          >
            مذاكر وتريد التذكّر سريعاً؟
          </span>
        </div>
      );

    case "quiz":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 lg:gap-2.5">
          {/* Concentric Circular Readiness Ring Hugging Inner Rim */}
          <svg
            viewBox="0 0 288 288"
            className="pointer-events-none absolute inset-0 w-full h-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="144"
              cy="144"
              r="134"
              fill="none"
              stroke={
                isDark ? "rgba(110, 196, 163, 0.14)" : "rgba(29, 107, 82, 0.13)"
              }
              strokeWidth="3.2"
            />
            <motion.circle
              cx="144"
              cy="144"
              r="134"
              fill="none"
              stroke={isDark ? "#6ec4a3" : "#1d6b52"}
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: reducedMotion ? 0.94 : 0.12 }}
              animate={{ pathLength: 0.94 }}
              transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
            />
          </svg>

          <span
            dir="ltr"
            className="font-mono-code text-[8.5px] lg:text-[10px] font-extrabold tracking-[0.1em] px-2.5 py-0.5 rounded-full"
            style={{
              color: isDark ? "#6ec4a3" : "#1d6b52",
              background: isDark
                ? "rgba(110, 196, 163, 0.12)"
                : "rgba(29, 107, 82, 0.1)",
              border: `1px solid ${
                isDark ? "rgba(110, 196, 163, 0.34)" : "rgba(29, 107, 82, 0.25)"
              }`,
            }}
          >
            {pillar.kicker}
          </span>

          {/* Readiness Percentage */}
          <div
            dir="ltr"
            className="font-mono-code text-[28px] lg:text-[38px] font-black leading-none tracking-tight"
            style={{ color: textMain }}
          >
            94%
          </div>

          {/* Instant Check Pill */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1 rounded-full text-[9.5px] lg:text-[11px] font-extrabold"
            style={{
              background: isDark
                ? "rgba(110, 196, 163, 0.15)"
                : "rgba(29, 107, 82, 0.12)",
              border: `1px solid ${
                isDark ? "rgba(110, 196, 163, 0.45)" : "rgba(29, 107, 82, 0.35)"
              }`,
              color: isDark ? "#a7ead0" : "#155742",
            }}
          >
            <Check className="w-3 h-3 shrink-0" />
            <span>تصحيح فوري</span>
          </div>

          <span
            className="text-[10px] lg:text-[11.5px] font-extrabold"
            style={{ color: textMuted }}
          >
            +40 سؤال لكل فصل
          </span>
        </div>
      );
  }
}

export function InteractiveDeskHero() {
  const theme = useTheme();
  const portal = usePortalState();
  const reducedMotion = useReducedMotion() ?? false;

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const heroSectionRef = useRef<HTMLElement | null>(null);
  const copyColRef = useRef<HTMLDivElement | null>(null);
  const dialColRef = useRef<HTMLDivElement | null>(null);
  const pauseTimerRef = useRef<number | null>(null);

  const isDark = theme === "dark";
  const lastVisited = portal.lastVisited;
  const activePillar = STUDY_PILLARS[activeIdx];

  const clearManualPauseTimer = useCallback(() => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const handleSelectPillar = useCallback(
    (index: number) => {
      const safeIdx = ((index % STUDY_PILLARS.length) + STUDY_PILLARS.length) % STUDY_PILLARS.length;
      setActiveIdx(safeIdx);
      setIsPaused(true);
      clearManualPauseTimer();
      pauseTimerRef.current = window.setTimeout(() => {
        setIsPaused(false);
        pauseTimerRef.current = null;
      }, 10000);
    },
    [clearManualPauseTimer]
  );

  // Calm 6-second auto-cycle (pauses on hover, focus, interaction, or reduced motion)
  useEffect(() => {
    if (reducedMotion || isPaused) return;
    const id = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STUDY_PILLARS.length);
    }, AUTO_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [isPaused, reducedMotion]);

  useEffect(() => {
    return () => clearManualPauseTimer();
  }, [clearManualPauseTimer]);

  // Listen for external pillar selection events if dispatched
  useEffect(() => {
    const onExternalSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ index?: number }>).detail;
      if (typeof detail?.index === "number") {
        handleSelectPillar(detail.index);
      }
    };
    window.addEventListener("cs-portal:select-hero-pillar", onExternalSelect);
    return () =>
      window.removeEventListener("cs-portal:select-hero-pillar", onExternalSelect);
  }, [handleSelectPillar]);

  // GSAP choreographed entrance + restrained desktop ScrollTrigger exit parallax
  useEffect(() => {
    const section = heroSectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.04,
      });

      tl.fromTo(
        "[data-hero-eyebrow]",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.62, clearProps: "transform,opacity" }
      )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.09,
            clearProps: "transform,opacity",
          },
          "-=0.42"
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.68,
            stagger: 0.07,
            clearProps: "transform,opacity",
          },
          "-=0.52"
        )
        .fromTo(
          "[data-hero-dial]",
          { scale: 0.94, y: 18, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.86, clearProps: "transform,opacity" },
          "-=0.68"
        )
        .fromTo(
          "[data-hero-stepper]",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.58, clearProps: "transform,opacity" },
          "-=0.48"
        );

      // Desktop-only subtle, restrained exit parallax on scroll
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (copyColRef.current) {
          gsap.to(copyColRef.current, {
            y: -26,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.65,
            },
          });
        }
        if (dialColRef.current) {
          gsap.to(dialColRef.current, {
            y: -38,
            scale: 0.965,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleJumpToShowcase = useCallback((pillarIndex?: number) => {
    if (typeof window === "undefined") return;
    if (typeof pillarIndex === "number") {
      window.dispatchEvent(
        new CustomEvent("cs-portal:jump-pillar", { detail: { index: pillarIndex } })
      );
      return;
    }
    const target = document.getElementById("interactive-showcase");
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -72, duration: 1.0 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Dual Mode Palette Tokens (Dark: Obsidian & Champagne | Light: Daylight Ivory Atelier)
  const bgGrad = isDark
    ? "linear-gradient(175deg, #08090c 0%, #111319 54%, #0a0c10 100%)"
    : "linear-gradient(175deg, #f9f7f2 0%, #f2eee5 56%, #ebe6da 100%)";

  const gridLine = isDark ? "rgba(216, 176, 122, 0.038)" : "rgba(30, 53, 92, 0.05)";
  const glowGrad = isDark
    ? "radial-gradient(circle, rgba(216, 176, 122, 0.11) 0%, rgba(110, 196, 163, 0.08) 48%, transparent 72%)"
    : "radial-gradient(circle, rgba(194, 94, 51, 0.08) 0%, rgba(29, 107, 82, 0.075) 48%, transparent 72%)";

  const borderSoft = isDark ? "rgba(255, 245, 230, 0.085)" : "rgba(30, 53, 92, 0.1)";
  const borderMid = isDark ? "rgba(216, 176, 122, 0.22)" : "rgba(30, 53, 92, 0.16)";
  const textMain = isDark ? "#f6f4ef" : "#131c2b";
  const textSub = isDark ? "rgba(220, 215, 206, 0.82)" : "#3c485c";
  const textMuted = isDark ? "rgba(160, 155, 146, 0.8)" : "#626e82";
  const pillBg = isDark ? "rgba(255, 245, 230, 0.055)" : "rgba(30, 53, 92, 0.055)";

  const titleGrad = isDark
    ? "linear-gradient(270deg, #e7c694 0%, #f7e8d0 46%, #79d2ad 100%)"
    : "linear-gradient(270deg, #c25e33 0%, #1e355c 56%, #1d6b52 100%)";

  const ctaBg = isDark
    ? "linear-gradient(135deg, #d6a96c 0%, #b88749 100%)"
    : "linear-gradient(135deg, #1e355c 0%, #132442 100%)";
  const ctaText = isDark ? "#101115" : "#ffffff";
  const ctaShadow = isDark
    ? "0 10px 28px rgba(214, 169, 108, 0.28), inset 0 1px 0 rgba(255, 250, 240, 0.35)"
    : "0 12px 28px rgba(30, 53, 92, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.16)";

  const secBg = isDark ? "rgba(255, 255, 255, 0.045)" : "rgba(255, 255, 255, 0.78)";
  const secText = isDark ? "#f3efe8" : "#1e355c";

  const accent1 = isDark ? "#d8b07a" : "#1d6b52";
  const accent3 = isDark ? "#b4a7d6" : "#1e355c";

  const ringOuter = isDark ? "rgba(216, 176, 122, 0.17)" : "rgba(30, 53, 92, 0.15)";
  const ringInner = isDark ? "rgba(255, 255, 255, 0.075)" : "rgba(30, 53, 92, 0.1)";
  const tickColor = isDark ? "rgba(216, 176, 122, 0.32)" : "rgba(30, 53, 92, 0.24)";
  const needleColor = isDark ? "#d8b07a" : "#1e355c";

  const coreBg = isDark
    ? "radial-gradient(circle at 36% 18%, #1e222c 0%, #0d0f14 78%)"
    : "radial-gradient(circle at 34% 20%, #ffffff 0%, #f5f2ea 82%)";
  const coreBorder = isDark ? "rgba(216, 176, 122, 0.28)" : "rgba(30, 53, 92, 0.15)";
  const coreHalo = isDark ? "rgba(216, 176, 122, 0.04)" : "rgba(30, 53, 92, 0.035)";
  const coreShadow = isDark
    ? `0 32px 72px rgba(0, 0, 0, 0.68), 0 0 0 12px ${coreHalo}`
    : `0 26px 58px rgba(24, 34, 52, 0.13), 0 4px 14px rgba(194, 94, 51, 0.05), 0 0 0 12px ${coreHalo}`;
  const rimGlint = isDark
    ? "linear-gradient(90deg, transparent 10%, rgba(245, 224, 188, 0.65) 50%, transparent 90%)"
    : "linear-gradient(90deg, transparent 10%, rgba(255, 255, 255, 0.95) 50%, transparent 90%)";

  const stepperBg = isDark ? "rgba(16, 18, 24, 0.76)" : "rgba(255, 253, 249, 0.86)";

  // Per-station number badge palette when inactive
  const getInactiveNumStyle = (id: PillarId) => {
    switch (id) {
      case "video":
        return {
          background: isDark
            ? "rgba(216, 176, 122, 0.14)"
            : "rgba(194, 94, 51, 0.13)",
          color: isDark ? "#eed2a4" : "#c25e33",
        };
      case "read":
        return {
          background: isDark
            ? "rgba(110, 196, 163, 0.14)"
            : "rgba(29, 107, 82, 0.13)",
          color: isDark ? "#6ec4a3" : "#1d6b52",
        };
      case "summary":
        return {
          background: "rgba(194, 94, 51, 0.15)",
          color: "#c25e33",
        };
      case "quiz":
        return {
          background: isDark
            ? "rgba(180, 167, 214, 0.16)"
            : "rgba(30, 53, 92, 0.11)",
          color: accent3,
        };
    }
  };

  return (
    <section
      id="top"
      ref={heroSectionRef}
      className="relative w-full overflow-x-clip min-h-[100svh] flex flex-col justify-between transition-colors duration-300"
      style={{
        background: bgGrad,
        color: textMain,
        borderBottom: `1px solid ${borderSoft}`,
      }}
    >
      {/* Architectural Drafting Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 76% at 34% 50%, #000 28%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 76% at 34% 50%, #000 28%, transparent 100%)",
        }}
      />

      {/* Tactile Paper / Obsidian Micro-Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isDark ? 0.03 : 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Restrained Ambient Glow Behind Study Dial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[12%] left-[8%] w-[360px] h-[360px] lg:w-[560px] lg:h-[560px] rounded-full blur-[54px]"
        style={{ background: glowGrad }}
      />

      {/* ==================== MAIN HERO GRID ==================== */}
      <div className="relative z-10 flex-1 w-full max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 pt-[72px] md:pt-[96px] pb-24 md:pb-8 lg:pb-4 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.06fr_0.94fr] items-center gap-6 lg:gap-9">
          {/* Copy Column (Right in RTL on Desktop, Centered on Mobile) */}
          <div
            ref={copyColRef}
            className="flex flex-col items-center lg:items-start text-center lg:text-right gap-3 lg:gap-[18px]"
          >
            {/* Eyebrow */}
            <div
              data-hero-eyebrow
              className="inline-flex items-center gap-2 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full text-[10.5px] lg:text-[11.5px] font-bold"
              style={{
                background: pillBg,
                border: `1px solid ${borderSoft}`,
                color: textSub,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: accent1,
                  boxShadow: `0 0 8px ${accent1}`,
                }}
                aria-hidden="true"
              />
              <span>حاسبات والذكاء الاصطناعي · جامعة الزقازيق</span>
            </div>

            {/* Sculptural 2-Line Headline */}
            <h1
              className="text-[24px] sm:text-[32px] lg:text-[35px] xl:text-[42px] font-black leading-[1.32] tracking-[-0.02em]"
              style={{ color: textMain }}
            >
              <span className="block overflow-hidden pb-0.5">
                <span data-hero-line className="block">
                  بدل تشتيت الملفات..
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span
                  data-hero-line
                  className="block mt-0.5 lg:whitespace-nowrap bg-clip-text text-transparent"
                  style={{
                    backgroundImage: titleGrad,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  كل حاجة تخص المادة في مكان واحد
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              data-hero-fade
              className="text-[12.5px] sm:text-[14px] lg:text-[15.5px] leading-[1.72] lg:leading-[1.82] font-medium max-w-[345px] sm:max-w-[460px] lg:max-w-[500px]"
              style={{ color: textSub }}
            >
              اسمع الفيديو أو اقرأ شرح الفصل كامل، راجع من الملخص السريع، وحلّ
              أسئلة وكويزات كثيرة — كل ذلك في مساحة مذاكرة هادئة ومنظّمة.
            </p>

            {/* Primary & Secondary CTAs */}
            <div
              data-hero-fade
              className="w-full lg:w-auto flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 lg:gap-3 pt-1"
            >
              {lastVisited ? (
                <Link
                  href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                  title={lastVisited.lessonTitle}
                  className="w-full sm:w-auto h-[44px] lg:h-[48px] px-6 lg:px-[26px] rounded-[13px] lg:rounded-[14px] text-[13.5px] lg:text-[14px] font-extrabold inline-flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{
                    background: ctaBg,
                    color: ctaText,
                    boxShadow: ctaShadow,
                  }}
                >
                  <span>أكمل مذاكرة</span>
                  <span
                    dir="ltr"
                    className="font-mono-code rounded-md px-1.5 py-0.5 text-[11.5px] font-bold"
                    style={{
                      background: isDark
                        ? "rgba(16, 17, 21, 0.16)"
                        : "rgba(255, 255, 255, 0.16)",
                    }}
                  >
                    {lastVisited.courseCode}
                  </span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="w-full sm:w-auto h-[44px] lg:h-[48px] px-6 lg:px-[26px] rounded-[13px] lg:rounded-[14px] text-[13.5px] lg:text-[14px] font-extrabold inline-flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{
                    background: ctaBg,
                    color: ctaText,
                    boxShadow: ctaShadow,
                  }}
                >
                  <span>ابدأ المذاكرة الآن</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </Link>
              )}

              <Link
                href="/courses"
                className="hidden lg:inline-flex h-[48px] px-5 rounded-[14px] text-[13.5px] font-bold items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  background: secBg,
                  border: `1px solid ${borderMid}`,
                  color: secText,
                }}
              >
                <span>تصفّح المقررات</span>
              </Link>
            </div>

            {/* Whisper-Quiet Editorial Trust Strip (Desktop) */}
            <div
              data-hero-fade
              className="hidden lg:flex items-center gap-4 flex-wrap mt-2 pt-4 text-[12px] font-bold"
              style={{
                borderTop: `1px solid ${borderSoft}`,
                color: textMuted,
              }}
            >
              {[
                "4 أركان لكل فصل",
                "حفظ تلقائي لتقدمك",
                "مساحة هادئة بدون إعلانات",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <i
                    aria-hidden="true"
                    className="w-[5px] h-[5px] rounded-full inline-block opacity-85"
                    style={{ background: accent1 }}
                  />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Progressive Swiss Study Dial Column */}
          <div
            ref={dialColRef}
            className="flex flex-col items-center gap-3 lg:gap-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            {/* Dial Stage */}
            <div
              data-hero-dial
              className="relative w-[328px] h-[328px] sm:w-[390px] sm:h-[390px] lg:w-[468px] lg:h-[468px] xl:w-[510px] xl:h-[510px] flex items-center justify-center select-none"
            >
              {/* Watchmaker Bezel SVG */}
              <svg
                className="pointer-events-none absolute inset-0 w-full h-full"
                viewBox="0 0 510 510"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Outer Dashed Precision Bezel */}
                <circle
                  cx="255"
                  cy="255"
                  r="224"
                  stroke={ringOuter}
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />

                {/* Progressive Illuminated Arc (25% / 50% / 75% / 100%, sweeping CCW from 3 o'clock) */}
                <g transform="translate(0 510) scale(1 -1)">
                  <motion.circle
                    cx="255"
                    cy="255"
                    r="224"
                    stroke="url(#heroProgArc)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    initial={{ pathLength: activePillar.arcProgress }}
                    animate={{ pathLength: activePillar.arcProgress }}
                    transition={
                      reducedMotion
                        ? { duration: 0.15 }
                        : { duration: 0.7, ease: EDITORIAL_EASE }
                    }
                  />
                </g>

                {/* Inner Hairline Compass */}
                <circle cx="255" cy="255" r="176" stroke={ringInner} strokeWidth="1" />

                {/* Fine Crosshairs */}
                <line x1="255" y1="18" x2="255" y2="492" stroke={ringInner} strokeWidth="1" />
                <line x1="18" y1="255" x2="492" y2="255" stroke={ringInner} strokeWidth="1" />

                {/* 48 Fine Bezel Ticks */}
                <g>
                  {WATCHMAKER_TICKS.map((tick, idx) => (
                    <line
                      key={idx}
                      x1={tick.x1}
                      y1={tick.y1}
                      x2={tick.x2}
                      y2={tick.y2}
                      stroke={tickColor}
                      strokeWidth={tick.major ? "1.6" : "0.9"}
                    />
                  ))}
                </g>

                <defs>
                  <linearGradient
                    id="heroProgArc"
                    x1="479"
                    y1="255"
                    x2="31"
                    y2="255"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={isDark ? "#6ec4a3" : "#c25e33"} />
                    <stop offset="1" stopColor={isDark ? "#d8b07a" : "#1d6b52"} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Smooth Spring-Rotated Watchmaker Triangle Needle */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                animate={{ rotate: activePillar.needleDeg }}
                transition={
                  reducedMotion
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 170, damping: 24, mass: 0.85 }
                }
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 510 510"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M 255 56 L 250 70 L 260 70 Z" fill={needleColor} />
                </svg>
              </motion.div>

              {/* 4 Interactive Orbital Station Pills */}
              {STUDY_PILLARS.map((pillar) => {
                const isActive = pillar.index === activeIdx;
                const isPaper = Boolean(pillar.isPaperNode) && !isActive;

                const nodeBg = isActive
                  ? isDark
                    ? "rgba(29, 31, 40, 0.98)"
                    : "#1e355c"
                  : isPaper
                    ? isDark
                      ? "#f4efe6"
                      : "#faece5"
                    : isDark
                      ? "rgba(19, 21, 27, 0.92)"
                      : "rgba(255, 255, 255, 0.95)";

                const nodeBorder = isActive
                  ? isDark
                    ? "rgba(216, 176, 122, 0.68)"
                    : "#1e355c"
                  : borderMid;

                const nodeTitleColor = isActive
                  ? "#ffffff"
                  : isPaper
                    ? isDark
                      ? "#171614"
                      : "#8f3d1c"
                    : textMain;

                const nodeSubColor = isActive
                  ? isDark
                    ? "rgba(226, 220, 210, 0.82)"
                    : "rgba(226, 232, 240, 0.85)"
                  : isPaper
                    ? isDark
                      ? "#5c574f"
                      : "#a05537"
                    : textMuted;

                const numStyle = isActive
                  ? isDark
                    ? {
                        background: "rgba(216, 176, 122, 0.2)",
                        color: "#eed2a4",
                      }
                    : {
                        background: "rgba(122, 211, 181, 0.22)",
                        color: "#8ce2c4",
                      }
                  : getInactiveNumStyle(pillar.id);

                const nodeShadow = isActive
                  ? isDark
                    ? `0 14px 34px rgba(0, 0, 0, 0.52), 0 0 0 4px ${coreHalo}`
                    : `0 12px 28px rgba(30, 53, 92, 0.22), 0 0 0 4px ${coreHalo}`
                  : isDark
                    ? "0 14px 34px rgba(0, 0, 0, 0.48)"
                    : "0 10px 26px rgba(18, 28, 45, 0.09)";

                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => handleSelectPillar(pillar.index)}
                    aria-pressed={isActive}
                    className={`absolute z-10 ${pillar.positionClass} px-2.5 py-1.5 lg:px-3.5 lg:py-2 rounded-[11px] lg:rounded-[14px] backdrop-blur-md flex items-center gap-1.5 lg:gap-2.5 whitespace-nowrap cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2`}
                    style={{
                      background: nodeBg,
                      border: `1px solid ${nodeBorder}`,
                      boxShadow: nodeShadow,
                      color: nodeTitleColor,
                    }}
                  >
                    <span
                      dir="ltr"
                      className="font-mono-code w-[19px] h-[19px] lg:w-6 lg:h-6 rounded-[6px] lg:rounded-[8px] flex items-center justify-center text-[9px] lg:text-[10.5px] font-extrabold shrink-0"
                      style={numStyle}
                    >
                      {pillar.num}
                    </span>
                    <span className="flex flex-col text-right leading-[1.25]">
                      <span className="text-[10.5px] lg:text-[12px] font-extrabold">
                        {pillar.label}
                      </span>
                      <span
                        className="hidden lg:block text-[10px] font-semibold"
                        style={{ color: nodeSubColor }}
                      >
                        {pillar.sub}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Sapphire Crystal Center Lens */}
              <div
                className="relative z-[6] w-[186px] h-[186px] sm:w-[224px] sm:h-[224px] lg:w-[266px] lg:h-[266px] xl:w-[288px] xl:h-[288px] rounded-full flex flex-col items-center justify-center text-center overflow-hidden"
                style={{
                  background: coreBg,
                  border: `1px solid ${coreBorder}`,
                  boxShadow: coreShadow,
                }}
              >
                {/* 1px Sapphire Specular Glint along Top Rim */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-[16%] right-[16%] h-[1.5px] z-20"
                  style={{ background: rimGlint }}
                />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePillar.id}
                    initial={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, y: 6 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.97, y: -5 }
                    }
                    transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                    className="relative w-full h-full p-3.5 lg:p-6 flex flex-col items-center justify-center"
                  >
                    <CenterLensContent
                      pillar={activePillar}
                      isDark={isDark}
                      reducedMotion={reducedMotion}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Quiet Interactive Stepper Control Beneath Dial */}
            <div
              data-hero-stepper
              className="inline-flex items-center gap-2.5 lg:gap-3 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full backdrop-blur-md text-[10px] lg:text-[11px] font-bold"
              style={{
                background: stepperBg,
                border: `1px solid ${borderSoft}`,
                color: textMuted,
              }}
            >
              <button
                type="button"
                onClick={() => handleSelectPillar(activeIdx - 1)}
                aria-label="الركن السابق"
                className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px] rounded-full inline-flex items-center justify-center transition-colors cursor-pointer hover:opacity-85"
                style={{ background: pillBg, color: textMain }}
              >
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <div className="inline-flex items-center gap-1.5" role="tablist" aria-label="أركان الفصل">
                {STUDY_PILLARS.map((pillar) => {
                  const on = pillar.index === activeIdx;
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-label={`${pillar.num} ${pillar.label}`}
                      onClick={() => handleSelectPillar(pillar.index)}
                      className="h-[5px] rounded-full transition-all duration-300 cursor-pointer"
                      style={{
                        width: on ? "18px" : "5px",
                        background: on ? accent1 : borderMid,
                      }}
                    />
                  );
                })}
              </div>

              <span
                dir="ltr"
                className="font-mono-code font-bold tabular-nums"
                style={{ color: textMain }}
              >
                {activePillar.num} / 04
              </span>

              <button
                type="button"
                onClick={() => handleSelectPillar(activeIdx + 1)}
                aria-label="الركن التالي"
                className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px] rounded-full inline-flex items-center justify-center transition-colors cursor-pointer hover:opacity-85"
                style={{ background: pillBg, color: textMain }}
              >
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Whisper-Quiet Footer Bar */}
      <div className="hidden lg:block relative z-10 w-full max-w-[1220px] mx-auto px-8 pb-5">
        <div
          className="pt-3 flex items-center justify-between text-[11px] font-semibold"
          style={{
            borderTop: `1px solid ${borderSoft}`,
            color: textMuted,
          }}
        >
          <button
            type="button"
            onClick={() => handleJumpToShowcase(activeIdx)}
            className="inline-flex items-center gap-1.5 transition-colors hover:opacity-90 cursor-pointer"
            style={{ color: textSub }}
          >
            <span>استكشف الـ 4 أركان بالتفصيل</span>
            <ArrowDown
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: accent1 }}
            />
          </button>

          <span dir="ltr" className="font-mono-code tracking-[0.08em]">
            CS PORTAL · ZAGAZIG UNIVERSITY
          </span>
        </div>
      </div>
    </section>
  );
}
