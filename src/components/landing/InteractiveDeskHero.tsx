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
    positionClass:
      "-right-8 min-[400px]:-right-9 sm:-right-6 lg:-right-2 top-1/2 -translate-y-1/2",
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
    positionClass: "-top-1.5 sm:top-1 lg:top-2 left-1/2 -translate-x-1/2",
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
    positionClass: "-bottom-1.5 sm:bottom-1 lg:bottom-2 left-1/2 -translate-x-1/2",
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
    positionClass:
      "-left-8 min-[400px]:-left-9 sm:-left-6 lg:-left-2 top-1/2 -translate-y-1/2",
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

const AUTO_CYCLE_MS = 5200;

interface CenterLensContentProps {
  pillar: StudyPillar;
  isDark: boolean;
  reducedMotion: boolean;
}

/**
 * CenterLensContent — Luminous inner micro-UI for all 4 universal CS/AI pillars.
 * Both Dark Mode (Obsidian lens) and Light Mode (Deep Architectural Navy Focal Jewel)
 * use a rich deep jewel lens interior so inner details always pop with serene elegance.
 */
function CenterLensContent({ pillar, isDark, reducedMotion }: CenterLensContentProps) {
  const lensTextMain = "#f8f5ef";
  const lensTextMuted = isDark
    ? "rgba(196, 190, 180, 0.86)"
    : "rgba(219, 229, 245, 0.84)";
  const lensWarm = isDark ? "#eed2a4" : "#f2a07a";
  const lensWarmStrong = isDark ? "#d8b07a" : "#e58257";
  const lensMint = isDark ? "#6ec4a3" : "#7ad8b8";
  const lensPillBg = isDark
    ? "rgba(255, 245, 230, 0.065)"
    : "rgba(255, 255, 255, 0.08)";
  const lensBorder = isDark
    ? "rgba(216, 176, 122, 0.26)"
    : "rgba(255, 255, 255, 0.16)";
  const lensSurface = isDark
    ? "rgba(13, 15, 22, 0.9)"
    : "rgba(11, 22, 42, 0.72)";

  switch (pillar.id) {
    case "video":
      return (
        <div className="w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 lg:gap-3">
          <span
            dir="ltr"
            className="font-mono-code text-[7.5px] sm:text-[8.5px] lg:text-[10px] font-extrabold tracking-[0.1em] px-2 lg:px-2.5 py-0.5 rounded-full"
            style={{
              color: lensWarm,
              background: lensPillBg,
              border: `1px solid ${lensBorder}`,
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
                  ? "rgba(216, 176, 122, 0.34)"
                  : "rgba(229, 130, 87, 0.34)",
              }}
            />
            <div
              className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(216,176,122,0.24), rgba(216,176,122,0.08))"
                  : "linear-gradient(135deg, rgba(229,130,87,0.26), rgba(229,130,87,0.08))",
                border: `1.5px solid ${
                  isDark ? "rgba(238,210,164,0.65)" : "rgba(242,160,122,0.7)"
                }`,
                boxShadow: isDark
                  ? "0 0 22px rgba(216, 176, 122, 0.24)"
                  : "0 0 22px rgba(229, 130, 87, 0.24)",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill={lensWarm}
                className="translate-x-[1px] lg:w-[15px] lg:h-[15px]"
                aria-hidden="true"
              >
                <path d="M5 3.2L13 8L5 12.8V3.2Z" />
              </svg>
            </div>
          </div>

          {/* Calm Audio/Video Waveform Bars */}
          <div
            className="flex items-center justify-center gap-[2px] sm:gap-[2.5px] lg:gap-[3.5px] h-4 sm:h-5 lg:h-6 w-[106px] sm:w-[138px] lg:w-[176px]"
            aria-hidden="true"
          >
            {WAVEFORM_BARS.map((bar, idx) => (
              <motion.span
                key={idx}
                className="w-[2px] sm:w-[2.5px] lg:w-[3px] rounded-full"
                style={{
                  height: `${Math.round(bar.height * 0.78)}px`,
                  background: bar.active
                    ? lensWarmStrong
                    : "rgba(255, 248, 238, 0.16)",
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
            className="w-[106px] sm:w-[138px] lg:w-[176px] grid grid-cols-[1.1fr_1.4fr_0.9fr] gap-1"
            aria-hidden="true"
          >
            <div className="h-[3px] lg:h-1 rounded-full" style={{ background: lensWarmStrong }} />
            <div
              className="h-[3px] lg:h-1 rounded-full"
              style={{
                background: `linear-gradient(270deg, ${lensWarmStrong} 58%, rgba(255,248,238,0.14) 58%)`,
              }}
            />
            <div
              className="h-[3px] lg:h-1 rounded-full"
              style={{ background: "rgba(255, 248, 238, 0.14)" }}
            />
          </div>

          <span
            className="text-[8.5px] sm:text-[9.5px] lg:text-[11px] font-bold leading-snug max-w-[122px] sm:max-w-[155px] lg:max-w-[205px]"
            style={{ color: lensTextMuted }}
          >
            فصول زمنية واضحة بدون إعلانات
          </span>
        </div>
      );

    case "read":
      return (
        <div className="w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5">
          <span
            dir="ltr"
            className="font-mono-code text-[7.5px] sm:text-[8.5px] lg:text-[10px] font-extrabold tracking-[0.1em] px-2 lg:px-2.5 py-0.5 rounded-full"
            style={{
              color: lensMint,
              background: lensPillBg,
              border: `1px solid ${lensBorder}`,
            }}
          >
            {pillar.kicker}
          </span>

          {/* Universal Structured Chapter Page Preview */}
          <div
            className="w-[112px] sm:w-[144px] lg:w-[192px] rounded-lg lg:rounded-xl p-1.5 sm:p-2 lg:p-2.5 text-right flex flex-col gap-1 sm:gap-1.5 lg:gap-2"
            style={{
              background: lensSurface,
              border: `1px solid ${lensBorder}`,
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.36)",
            }}
          >
            {/* Header bar with A- / A+ */}
            <div
              className="flex items-center justify-between pb-1"
              style={{ borderBottom: "1px solid rgba(255, 248, 238, 0.08)" }}
            >
              <span
                dir="ltr"
                className="font-mono-code text-[7px] sm:text-[8px] lg:text-[9px] font-bold"
                style={{ color: lensMint }}
              >
                CHAPTER
              </span>
              <div dir="ltr" className="flex items-center gap-1">
                <span
                  className="font-mono-code text-[6.5px] sm:text-[7.5px] lg:text-[8.5px] font-bold px-1 lg:px-1.5 py-0.5 rounded"
                  style={{ background: lensPillBg, color: lensTextMain }}
                >
                  A-
                </span>
                <span
                  className="font-mono-code text-[6.5px] sm:text-[7.5px] lg:text-[8.5px] font-bold px-1 lg:px-1.5 py-0.5 rounded"
                  style={{
                    background: isDark
                      ? "rgba(216,176,122,0.18)"
                      : "rgba(229,130,87,0.22)",
                    color: lensWarm,
                  }}
                >
                  A+
                </span>
              </div>
            </div>

            {/* Clean Structured Heading + Text Lines */}
            <div className="space-y-1">
              <div
                className="h-1 lg:h-1.5 w-3/4 rounded-full"
                style={{ background: "rgba(248, 245, 239, 0.85)" }}
              />
              <div
                className="h-[3px] lg:h-1 w-full rounded-full"
                style={{ background: "rgba(220, 224, 235, 0.24)" }}
              />
            </div>

            {/* Mini Universal Diagram / Schema Flow */}
            <div
              className="rounded-md lg:rounded-lg px-1.5 lg:px-2 py-1 lg:py-1.5 flex items-center justify-between gap-1"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
              }}
              aria-hidden="true"
            >
              <span
                className="w-2.5 h-2.5 lg:w-4 lg:h-4 rounded lg:rounded-md border"
                style={{
                  background: "rgba(122, 216, 184, 0.16)",
                  borderColor: lensMint,
                }}
              />
              <span
                className="flex-1 h-[1.5px] rounded-full"
                style={{ background: lensBorder }}
              />
              <span
                className="w-2.5 h-2.5 lg:w-4 lg:h-4 rounded-full border"
                style={{
                  background: isDark
                    ? "rgba(216,176,122,0.22)"
                    : "rgba(242,160,122,0.22)",
                  borderColor: lensWarmStrong,
                }}
              />
              <span
                className="flex-1 h-[1.5px] rounded-full"
                style={{ background: lensBorder }}
              />
              <span
                className="w-2.5 h-2.5 lg:w-4 lg:h-4 rounded lg:rounded-md border"
                style={{
                  background: "rgba(180, 167, 214, 0.2)",
                  borderColor: "#b4a7d6",
                }}
              />
            </div>

            {/* Clean Syntax Block */}
            <div
              dir="ltr"
              className="hidden sm:block rounded-md lg:rounded-lg px-2 py-1 lg:py-1.5 font-mono-code text-[7.5px] lg:text-[9px] leading-tight text-left"
              style={{
                background: "rgba(6, 9, 16, 0.82)",
                color: "#e6e2da",
              }}
            >
              <span style={{ color: lensMint }}>step</span>
              <span style={{ color: lensWarm }}>(data)</span>
              <span style={{ color: "rgba(230,226,218,0.65)" }}> → out</span>
            </div>
          </div>

          <span
            className="text-[8.5px] sm:text-[9.5px] lg:text-[11px] font-bold leading-snug max-w-[122px] sm:max-w-[155px] lg:max-w-[208px]"
            style={{ color: lensTextMuted }}
          >
            شرح الشابتر كامل برسومات وأكواد
          </span>
        </div>
      );

    case "summary":
      return (
        <div className="w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5">
          {/* Harmonious Obsidian/Champagne (Dark) or Navy/Terracotta (Light Jewel) Framed Summary Sheet */}
          <div
            className="relative w-[114px] sm:w-[148px] lg:w-[196px] rounded-[11px] lg:rounded-[14px] p-2 sm:p-2.5 lg:p-3.5 text-right flex flex-col gap-1 sm:gap-1.5 lg:gap-2"
            style={{
              background: lensSurface,
              color: lensTextMain,
              border: `1px solid ${lensBorder}`,
              boxShadow: "0 14px 28px rgba(0, 0, 0, 0.36)",
            }}
          >
            {/* Subtle Bookmark Ribbon */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-2.5 lg:left-3.5 w-[7px] lg:w-[9px] h-[11px] lg:h-[15px] rounded-b-[3px]"
              style={{ background: lensWarmStrong }}
            />

            <div
              className="text-[7.5px] sm:text-[8.5px] lg:text-[10px] font-extrabold pl-3"
              style={{ color: lensWarm }}
            >
              ملخص الفصل السريع
            </div>

            <div className="space-y-1 lg:space-y-1.5">
              {[
                "أهم القوانين والمفاهيم",
                "مقارنات مركّزة ومنظّمة",
                "نقاط المراجعة السريعة",
              ].map((line, i) => (
                <div
                  key={line}
                  className="flex items-center gap-1 lg:gap-1.5 rounded-md px-1.5 py-0.5 lg:py-1 text-[7.5px] sm:text-[8.5px] lg:text-[10px] font-bold"
                  style={{
                    background:
                      i === 0
                        ? isDark
                          ? "rgba(216, 176, 122, 0.14)"
                          : "rgba(229, 130, 87, 0.16)"
                        : "rgba(255, 255, 255, 0.055)",
                    color: i === 0 ? lensWarm : lensTextMain,
                  }}
                >
                  <Check
                    className="w-2.5 h-2.5 lg:w-3 lg:h-3 shrink-0"
                    style={{ color: lensMint }}
                  />
                  <span className="truncate">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <span
            className="text-[8.5px] sm:text-[9.5px] lg:text-[11px] font-bold leading-snug max-w-[122px] sm:max-w-[155px] lg:max-w-[205px]"
            style={{ color: lensTextMuted }}
          >
            مذاكر وتريد التذكّر سريعاً؟
          </span>
        </div>
      );

    case "quiz":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 sm:gap-1.5 lg:gap-2.5">
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
              stroke="rgba(122, 216, 184, 0.16)"
              strokeWidth="3.2"
            />
            <motion.circle
              cx="144"
              cy="144"
              r="134"
              fill="none"
              stroke={lensMint}
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: reducedMotion ? 0.94 : 0.12 }}
              animate={{ pathLength: 0.94 }}
              transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
            />
          </svg>

          <span
            dir="ltr"
            className="font-mono-code text-[7.5px] sm:text-[8.5px] lg:text-[10px] font-extrabold tracking-[0.1em] px-2 lg:px-2.5 py-0.5 rounded-full"
            style={{
              color: lensMint,
              background: "rgba(122, 216, 184, 0.12)",
              border: "1px solid rgba(122, 216, 184, 0.34)",
            }}
          >
            {pillar.kicker}
          </span>

          {/* Readiness Percentage */}
          <div
            dir="ltr"
            className="font-mono-code text-[22px] sm:text-[28px] lg:text-[38px] font-black leading-none tracking-tight"
            style={{ color: lensTextMain }}
          >
            94%
          </div>

          {/* Instant Check Pill */}
          <div
            className="inline-flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[8.5px] sm:text-[9.5px] lg:text-[11px] font-extrabold"
            style={{
              background: "rgba(122, 216, 184, 0.16)",
              border: "1px solid rgba(122, 216, 184, 0.44)",
              color: "#bdf3df",
            }}
          >
            <Check className="w-2.5 h-2.5 lg:w-3 lg:h-3 shrink-0" />
            <span>تصحيح فوري</span>
          </div>

          <span
            className="text-[8.5px] sm:text-[10px] lg:text-[11.5px] font-extrabold"
            style={{ color: lensTextMuted }}
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
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
      const safeIdx =
        ((index % STUDY_PILLARS.length) + STUDY_PILLARS.length) % STUDY_PILLARS.length;
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

  // Ultra-gentle, calm ~5.2s auto-cycle (pauses cleanly on hover, focus, click, or reduced motion)
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

  // Dual Mode Palette Tokens (Dark: Obsidian & Champagne | Light: Rich Daylight Ivory + Navy Focal Jewel)
  const bgGrad = isDark
    ? "linear-gradient(175deg, #08090c 0%, #111319 54%, #0a0c10 100%)"
    : "linear-gradient(175deg, #f4f0e6 0%, #ebe5d8 56%, #e5dfd1 100%)";

  const dotColor = isDark ? "rgba(216, 176, 122, 0.14)" : "rgba(22, 40, 71, 0.14)";
  const glowGrad = isDark
    ? "radial-gradient(circle, rgba(216, 176, 122, 0.11) 0%, rgba(110, 196, 163, 0.08) 48%, transparent 72%)"
    : "radial-gradient(circle, rgba(194, 94, 51, 0.1) 0%, rgba(21, 102, 75, 0.085) 48%, transparent 72%)";

  const borderSoft = isDark ? "rgba(255, 245, 230, 0.085)" : "rgba(22, 40, 71, 0.11)";
  const borderMid = isDark ? "rgba(216, 176, 122, 0.22)" : "rgba(22, 40, 71, 0.15)";
  const textMain = isDark ? "#f6f4ef" : "#131c2b";
  const textSub = isDark ? "rgba(220, 215, 206, 0.82)" : "#334157";
  const textMuted = isDark ? "rgba(160, 155, 146, 0.8)" : "#5b677c";
  const pillBg = isDark ? "rgba(255, 245, 230, 0.055)" : "rgba(22, 40, 71, 0.055)";

  const titleGrad = isDark
    ? "linear-gradient(270deg, #e7c694 0%, #f7e8d0 46%, #79d2ad 100%)"
    : "linear-gradient(270deg, #c25e33 0%, #162847 54%, #15664b 100%)";

  const ctaBg = isDark
    ? "linear-gradient(135deg, #d6a96c 0%, #b88749 100%)"
    : "linear-gradient(135deg, #162847 0%, #0e1c34 100%)";
  const ctaText = isDark ? "#101115" : "#ffffff";
  const ctaShadow = isDark
    ? "0 10px 28px rgba(214, 169, 108, 0.28), inset 0 1px 0 rgba(255, 250, 240, 0.35)"
    : "0 12px 28px rgba(22, 40, 71, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.16)";

  const secBg = isDark ? "rgba(255, 255, 255, 0.045)" : "rgba(255, 255, 255, 0.86)";
  const secText = isDark ? "#f3efe8" : "#162847";

  const accent1 = isDark ? "#d8b07a" : "#15664b";
  const accent3 = isDark ? "#b4a7d6" : "#162847";

  const ringOuter = isDark ? "rgba(216, 176, 122, 0.18)" : "rgba(22, 40, 71, 0.16)";
  const ringInner = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(22, 40, 71, 0.11)";
  const tickColor = isDark ? "rgba(216, 176, 122, 0.32)" : "rgba(22, 40, 71, 0.26)";
  const needleColor = isDark ? "#d8b07a" : "#162847";

  // Center Lens: Obsidian in Dark Mode | Deep Architectural Navy Focal Jewel in Light Mode
  const coreBg = isDark
    ? "radial-gradient(circle at 36% 18%, #1e222c 0%, #0d0f14 78%)"
    : "radial-gradient(circle at 35% 20%, #1d3257 0%, #0e1a30 82%)";
  const coreBorder = isDark
    ? "rgba(216, 176, 122, 0.28)"
    : "rgba(255, 255, 255, 0.15)";
  const coreHalo = isDark
    ? "rgba(216, 176, 122, 0.045)"
    : "rgba(22, 40, 71, 0.065)";
  const coreShadow = isDark
    ? `0 32px 72px rgba(0, 0, 0, 0.68), 0 0 0 11px ${coreHalo}`
    : `0 28px 60px rgba(14, 26, 48, 0.28), 0 6px 18px rgba(194, 94, 51, 0.1), 0 0 0 11px ${coreHalo}`;
  const rimGlint = isDark
    ? "linear-gradient(90deg, transparent 10%, rgba(245, 224, 188, 0.65) 50%, transparent 90%)"
    : "linear-gradient(90deg, transparent 10%, rgba(255, 255, 255, 0.58) 50%, transparent 90%)";

  const stepperBg = isDark
    ? "rgba(16, 18, 24, 0.78)"
    : "rgba(255, 255, 255, 0.88)";

  // Per-station number badge palette when inactive (uniform node surface across all 4 stations!)
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
            : "rgba(21, 102, 75, 0.13)",
          color: isDark ? "#6ec4a3" : "#15664b",
        };
      case "summary":
        return {
          background: isDark
            ? "rgba(216, 176, 122, 0.14)"
            : "rgba(194, 94, 51, 0.13)",
          color: isDark ? "#eed2a4" : "#c25e33",
        };
      case "quiz":
        return {
          background: isDark
            ? "rgba(180, 167, 214, 0.16)"
            : "rgba(22, 40, 71, 0.1)",
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
      {/* Ultra-Fine Geometric Dot Matrix Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
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
          opacity: isDark ? 0.03 : 0.035,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Restrained Ambient Glow Behind Study Dial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[12%] left-[8%] w-[340px] h-[340px] lg:w-[560px] lg:h-[560px] rounded-full blur-[56px]"
        style={{ background: glowGrad }}
      />

      {/* ==================== MAIN HERO GRID ==================== */}
      <div className="relative z-10 flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 pt-[54px] pb-[68px] md:pt-[86px] md:pb-8 lg:pt-[84px] lg:pb-4 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] items-center gap-3.5 sm:gap-5 lg:gap-12 xl:gap-20">
          {/* Copy Column (Right in RTL on Desktop, Centered on Mobile) */}
          <div
            ref={copyColRef}
            className="flex flex-col items-center lg:items-start text-center lg:text-right gap-2 sm:gap-3 lg:gap-[18px]"
          >
            {/* Eyebrow */}
            <div
              data-hero-eyebrow
              className="inline-flex items-center gap-1.5 lg:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 lg:px-3.5 lg:py-1.5 rounded-full text-[10px] sm:text-[10.5px] lg:text-[11.5px] font-bold"
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
              className="text-[21px] min-[400px]:text-[23px] sm:text-[31px] lg:text-[36px] xl:text-[42px] font-black leading-[1.28] lg:leading-[1.32] tracking-[-0.02em]"
              style={{ color: textMain }}
            >
              <span className="block overflow-hidden pb-0.5">
                <span data-hero-line className="block">
                  بدل تشتيت الملفات..
                </span>
              </span>
              <span className="block overflow-hidden pb-0.5 lg:pb-1">
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
              className="text-[11.5px] min-[400px]:text-[12px] sm:text-[13.5px] lg:text-[15.5px] leading-[1.55] sm:leading-[1.68] lg:leading-[1.82] font-medium max-w-[335px] sm:max-w-[460px] lg:max-w-[520px]"
              style={{ color: textSub }}
            >
              اسمع الفيديو أو اقرأ شرح الفصل كامل، راجع من الملخص السريع، وحلّ
              أسئلة وكويزات كثيرة — كل ذلك في مساحة مذاكرة هادئة ومنظّمة.
            </p>

            {/* Primary & Secondary CTAs */}
            <div
              data-hero-fade
              className="w-full max-w-[330px] sm:max-w-none lg:w-auto flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 lg:gap-3 pt-0.5 lg:pt-1"
            >
              {lastVisited ? (
                <Link
                  href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                  title={lastVisited.lessonTitle}
                  className="group w-full sm:w-auto h-[40px] min-[400px]:h-[42px] lg:h-[48px] px-5 lg:px-[26px] rounded-[12px] lg:rounded-[14px] text-[13px] lg:text-[14px] font-extrabold inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
                  style={{
                    background: ctaBg,
                    color: ctaText,
                    boxShadow: ctaShadow,
                  }}
                >
                  <span>أكمل مذاكرة</span>
                  <span
                    dir="ltr"
                    className="font-mono-code rounded-md px-1.5 py-0.5 text-[11px] lg:text-[11.5px] font-bold"
                    style={{
                      background: isDark
                        ? "rgba(16, 17, 21, 0.16)"
                        : "rgba(255, 255, 255, 0.16)",
                    }}
                  >
                    {lastVisited.courseCode}
                  </span>
                  <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="group w-full sm:w-auto h-[40px] min-[400px]:h-[42px] lg:h-[48px] px-5 lg:px-[26px] rounded-[12px] lg:rounded-[14px] text-[13px] lg:text-[14px] font-extrabold inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
                  style={{
                    background: ctaBg,
                    color: ctaText,
                    boxShadow: ctaShadow,
                  }}
                >
                  <span>ابدأ المذاكرة الآن</span>
                  <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
                </Link>
              )}

              <Link
                href="/courses"
                className={`hidden lg:inline-flex h-[48px] px-5 rounded-[14px] text-[13.5px] font-bold items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                  isDark
                    ? "hover:bg-white/[0.08] hover:border-[#d8b07a]/45"
                    : "hover:bg-white hover:shadow-[0_10px_24px_rgba(18,28,45,0.08)]"
                }`}
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
            className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredIdx(null);
            }}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            {/* Dial Stage (Compact Above-the-Fold on Mobile | Grand Precision Bezel on Desktop) */}
            <div
              data-hero-dial
              className="relative w-[246px] h-[246px] min-[400px]:w-[272px] min-[400px]:h-[272px] sm:w-[356px] sm:h-[356px] lg:w-[456px] lg:h-[456px] xl:w-[500px] xl:h-[500px] flex items-center justify-center select-none"
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
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    initial={{ pathLength: activePillar.arcProgress }}
                    animate={{ pathLength: activePillar.arcProgress }}
                    transition={
                      reducedMotion
                        ? { duration: 0.15 }
                        : { duration: 0.72, ease: EDITORIAL_EASE }
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
                    <stop offset="1" stopColor={isDark ? "#d8b07a" : "#15664b"} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Smooth Gentle Spring-Rotated Watchmaker Triangle Needle */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                animate={{ rotate: activePillar.needleDeg }}
                transition={
                  reducedMotion
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 135, damping: 22, mass: 0.9 }
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

              {/* 4 Uniform Interactive Orbital Station Pills */}
              {STUDY_PILLARS.map((pillar) => {
                const isActive = pillar.index === activeIdx;
                const isHovered = pillar.index === hoveredIdx && !isActive;

                const nodeBg = isActive
                  ? isDark
                    ? "rgba(29, 31, 40, 0.98)"
                    : "#162847"
                  : isDark
                    ? isHovered
                      ? "rgba(25, 28, 36, 0.96)"
                      : "rgba(19, 21, 27, 0.92)"
                    : "#ffffff";

                const nodeBorder = isActive
                  ? isDark
                    ? "rgba(216, 176, 122, 0.72)"
                    : "#162847"
                  : isHovered
                    ? isDark
                      ? "rgba(216, 176, 122, 0.48)"
                      : "rgba(22, 40, 71, 0.34)"
                    : borderMid;

                const nodeTitleColor = isActive ? "#ffffff" : textMain;
                const nodeSubColor = isActive
                  ? isDark
                    ? "rgba(226, 220, 210, 0.82)"
                    : "rgba(226, 232, 240, 0.86)"
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
                    ? `0 14px 34px rgba(0, 0, 0, 0.54), 0 0 0 4px ${coreHalo}`
                    : `0 14px 30px rgba(22, 40, 71, 0.26), 0 0 0 4px ${coreHalo}`
                  : isHovered
                    ? isDark
                      ? "0 16px 36px rgba(0, 0, 0, 0.56)"
                      : "0 14px 32px rgba(18, 28, 45, 0.14)"
                    : isDark
                      ? "0 14px 34px rgba(0, 0, 0, 0.48)"
                      : "0 10px 26px rgba(18, 28, 45, 0.1)";

                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => handleSelectPillar(pillar.index)}
                    onMouseEnter={() => setHoveredIdx(pillar.index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    aria-pressed={isActive}
                    className={`absolute z-10 ${pillar.positionClass} px-2 py-1 min-[400px]:px-2.5 min-[400px]:py-1.5 lg:px-3.5 lg:py-2 rounded-[10px] lg:rounded-[14px] backdrop-blur-md flex items-center gap-1.5 lg:gap-2.5 whitespace-nowrap cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2`}
                    style={{
                      background: nodeBg,
                      border: `1px solid ${nodeBorder}`,
                      boxShadow: nodeShadow,
                      color: nodeTitleColor,
                    }}
                  >
                    <span
                      dir="ltr"
                      className="font-mono-code w-[17px] h-[17px] min-[400px]:w-[19px] min-[400px]:h-[19px] lg:w-6 lg:h-6 rounded-[5px] lg:rounded-[8px] flex items-center justify-center text-[8.5px] min-[400px]:text-[9px] lg:text-[10.5px] font-extrabold shrink-0"
                      style={numStyle}
                    >
                      {pillar.num}
                    </span>
                    <span className="flex flex-col text-right leading-[1.22]">
                      <span className="text-[9.5px] min-[400px]:text-[10px] lg:text-[12px] font-extrabold">
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

              {/* Sapphire Crystal Center Lens (Obsidian in Dark | Deep Architectural Navy Focal Jewel in Light) */}
              <div
                className="relative z-[6] w-[144px] h-[144px] min-[400px]:w-[160px] min-[400px]:h-[160px] sm:w-[208px] sm:h-[208px] lg:w-[264px] lg:h-[264px] xl:w-[288px] xl:h-[288px] rounded-full flex flex-col items-center justify-center text-center overflow-hidden transition-shadow duration-300"
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
                        : { opacity: 0, scale: 0.96, y: 5 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.97, y: -4 }
                    }
                    transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
                    className="relative w-full h-full p-2.5 sm:p-4 lg:p-6 flex flex-col items-center justify-center"
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
              className="inline-flex items-center gap-2 sm:gap-2.5 lg:gap-3 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-full backdrop-blur-md text-[9.5px] sm:text-[10px] lg:text-[11px] font-bold"
              style={{
                background: stepperBg,
                border: `1px solid ${borderSoft}`,
                color: textMuted,
                boxShadow: isDark
                  ? "0 8px 20px rgba(0, 0, 0, 0.25)"
                  : "0 6px 18px rgba(18, 28, 45, 0.07)",
              }}
            >
              <button
                type="button"
                onClick={() => handleSelectPillar(activeIdx - 1)}
                aria-label="الركن السابق"
                className="w-[19px] h-[19px] lg:w-[22px] lg:h-[22px] rounded-full inline-flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                style={{ background: pillBg, color: textMain }}
              >
                <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0" />
              </button>

              <div
                className="inline-flex items-center gap-1.5"
                role="tablist"
                aria-label="أركان الفصل"
              >
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
                      className="h-[5px] rounded-full transition-all duration-300 cursor-pointer hover:opacity-85"
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
                className="w-[19px] h-[19px] lg:w-[22px] lg:h-[22px] rounded-full inline-flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                style={{ background: pillBg, color: textMain }}
              >
                <ChevronLeft className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Whisper-Quiet Footer Bar */}
      <div className="hidden lg:block relative z-10 w-full max-w-[1360px] mx-auto px-12 pb-5">
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
            className="group inline-flex items-center gap-1.5 transition-colors hover:opacity-95 cursor-pointer"
            style={{ color: textSub }}
          >
            <span>استكشف الـ 4 أركان بالتفصيل</span>
            <ArrowDown
              className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
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
