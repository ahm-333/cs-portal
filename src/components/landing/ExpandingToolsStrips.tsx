"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { useTheme } from "@/components/layout/themeStore";
import {
  EDITORIAL_EASE,
  MaskedLineReveal,
} from "@/components/ui/AwwwardsPrimitives";

type StationVisualType = "video" | "guide" | "summary" | "quiz";

interface ThreadStation {
  readonly idx: number;
  readonly num: string;
  readonly tag: string;
  readonly title: string;
  readonly desc: string;
  readonly sideKicker: string;
  readonly sideText: string;
  readonly visual: StationVisualType;
  readonly isPaper?: boolean;
  /** On desktop lg+, stations alternate Right (start) / Left (end) across the center thread. */
  readonly cardOnStart: boolean;
}

const STATIONS: readonly ThreadStation[] = [
  {
    idx: 0,
    num: "01",
    tag: "01 · VIDEO LECTURE",
    title: "فيديو الشرح",
    desc: "المحاضرة كاملة مقسّمة إلى فصول زمنية واضحة — تنتقل للجزئية التي تحتاجها مباشرة وبدون إعلانات.",
    sideKicker: "✓ استمع للشرح بالترتيب",
    sideText: "تحكّم كامل في السرعة وجودة مريحة للعين",
    visual: "video",
    cardOnStart: true,
  },
  {
    idx: 1,
    num: "02",
    tag: "02 · FULL CHAPTER GUIDE",
    title: "اقرأ شرح الفصل",
    desc: "شرح مكتوب ومتكامل للفصل بالرسومات والأكواد كبديل كامل للفيديو — مع شريط تحكّم في حجم الخط لراحة عينيك.",
    sideKicker: "● بديل كامل للفيديو",
    sideText: "اقرأ الفصل بالتفصيل متى شئت",
    visual: "guide",
    cardOnStart: false,
  },
  {
    idx: 2,
    num: "03",
    tag: "03 · QUICK REVISION",
    title: "ملخص سريع",
    desc: "راجعت الفصل وتريد استرجاعه سريعاً قبل الامتحان؟ أهم القوانين والفروق والنقاط الجوهرية في صفحة واحدة.",
    sideKicker: "ليلة الامتحان بدون تشتّت",
    sideText: "مراجعة مركّزة بعيداً عن التفاصيل الطويلة",
    visual: "summary",
    isPaper: true,
    cardOnStart: true,
  },
  {
    idx: 3,
    num: "04",
    tag: "04 · QUESTIONS & QUIZZES",
    title: "أسئلة وكويزات",
    desc: "كمّ كبير من الأسئلة والاختبارات المتدرّجة على كل فصل مع تصحيح لحظي وبنك أخطاء تلقائي للمراجعة.",
    sideKicker: "ثبّت فهمك بالتطبيق",
    sideText: "شرح فوري لسبب كل إجابة",
    visual: "quiz",
    cardOnStart: false,
  },
] as const;

const WAVEFORM_BAR_HEIGHTS = [7, 14, 18, 10, 15, 8] as const;

interface ThreadPalette {
  bgGrad: string;
  gridLine: string;
  glowA: string;
  glowB: string;
  cardBg: string;
  cardActiveBg: string;
  cardShadow: string;
  borderSoft: string;
  borderActive: string;
  textMain: string;
  textSub: string;
  textMuted: string;
  accent1: string;
  accent1Bright: string;
  accent2: string;
  accent3: string;
  terracotta: string;
  paperBg: string;
  paperInk: string;
  paperSub: string;
  paperBorder: string;
  paperActiveBorder: string;
  paperIdleShadow: string;
  paperActiveShadow: string;
  threadTrack: string;
  threadFill: string;
  threadGlow: string;
  /** Strictly opaque solid fills so the vertical thread never bleeds inside nodes. */
  nodeIdleBg: string;
  nodeDoneBg: string;
  nodeActiveBg: string;
  nodeActiveBorder: string;
  nodeActiveFg: string;
  nodeHalo: string;
  chipBg: string;
  innerBoxBg: string;
  playBg: string;
  playBorder: string;
  docCodeBg: string;
  docCodeBorder: string;
  quizOkBg: string;
  summaryPillBg: string;
  summaryPillBorder: string;
  specularTop: string;
}

const DARK_PALETTE: ThreadPalette = {
  bgGrad: "linear-gradient(175deg, #08090c 0%, #101218 55%, #090b0f 100%)",
  gridLine: "rgba(216, 176, 122, 0.032)",
  glowA: "rgba(216, 176, 122, 0.08)",
  glowB: "rgba(110, 196, 163, 0.06)",
  cardBg: "rgba(19, 22, 30, 0.86)",
  cardActiveBg: "linear-gradient(165deg, #1a1e29 0%, #11141c 100%)",
  cardShadow: "0 20px 48px rgba(0, 0, 0, 0.44)",
  borderSoft: "rgba(255, 245, 230, 0.08)",
  borderActive: "rgba(216, 176, 122, 0.36)",
  textMain: "#f6f4ef",
  textSub: "rgba(220, 215, 206, 0.82)",
  textMuted: "rgba(160, 155, 146, 0.78)",
  accent1: "#d8b07a",
  accent1Bright: "#ebd0a3",
  accent2: "#6ec4a3",
  accent3: "#b4a7d6",
  terracotta: "#c25e33",
  paperBg: "#f6f5f1",
  paperInk: "#121721",
  paperSub: "#3b4454",
  paperBorder: "rgba(255, 255, 255, 0.65)",
  paperActiveBorder: "rgba(216, 176, 122, 0.78)",
  paperIdleShadow: "0 14px 32px rgba(0, 0, 0, 0.28)",
  paperActiveShadow:
    "0 22px 52px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(216, 176, 122, 0.35)",
  threadTrack: "rgba(255, 255, 255, 0.08)",
  threadFill: "linear-gradient(180deg, #d8b07a 0%, #6ec4a3 60%, #d8b07a 100%)",
  threadGlow: "0 0 12px rgba(216, 176, 122, 0.35)",
  nodeIdleBg: "#12151e",
  nodeDoneBg: "#1b2c2a",
  nodeActiveBg: "#d8b07a",
  nodeActiveBorder: "#d8b07a",
  nodeActiveFg: "#101115",
  nodeHalo: "rgba(216, 176, 122, 0.18)",
  chipBg: "rgba(255, 245, 230, 0.055)",
  innerBoxBg: "rgba(9, 11, 16, 0.75)",
  playBg: "rgba(194, 94, 51, 0.16)",
  playBorder: "rgba(229, 138, 98, 0.45)",
  docCodeBg: "rgba(110, 196, 163, 0.22)",
  docCodeBorder: "rgba(110, 196, 163, 0.4)",
  quizOkBg: "rgba(110, 196, 163, 0.18)",
  summaryPillBg: "rgba(194, 94, 51, 0.12)",
  summaryPillBorder: "rgba(194, 94, 51, 0.22)",
  specularTop:
    "linear-gradient(90deg, transparent 8%, rgba(235, 208, 163, 0.38) 50%, transparent 92%)",
};

const LIGHT_PALETTE: ThreadPalette = {
  bgGrad: "linear-gradient(175deg, #f9f7f2 0%, #f2eee5 56%, #ebe6da 100%)",
  gridLine: "rgba(30, 53, 92, 0.045)",
  glowA: "rgba(194, 94, 51, 0.07)",
  glowB: "rgba(29, 107, 82, 0.06)",
  cardBg: "rgba(255, 255, 255, 0.88)",
  cardActiveBg: "#ffffff",
  cardShadow: "0 18px 44px rgba(18, 28, 45, 0.09)",
  borderSoft: "rgba(30, 53, 92, 0.1)",
  borderActive: "rgba(30, 53, 92, 0.28)",
  textMain: "#131c2b",
  textSub: "#3c485c",
  textMuted: "#626e82",
  accent1: "#c25e33",
  accent1Bright: "#9e4722",
  accent2: "#1d6b52",
  accent3: "#1e355c",
  terracotta: "#c25e33",
  paperBg: "#faece5",
  paperInk: "#131c2b",
  paperSub: "#573528",
  paperBorder: "rgba(194, 94, 51, 0.26)",
  paperActiveBorder: "rgba(194, 94, 51, 0.54)",
  paperIdleShadow: "0 10px 26px rgba(194, 94, 51, 0.07)",
  paperActiveShadow: "0 18px 42px rgba(194, 94, 51, 0.14)",
  threadTrack: "rgba(30, 53, 92, 0.12)",
  threadFill: "linear-gradient(180deg, #1e355c 0%, #1d6b52 55%, #c25e33 100%)",
  threadGlow: "0 0 12px rgba(30, 53, 92, 0.2)",
  nodeIdleBg: "#ffffff",
  nodeDoneBg: "#e3f0eb",
  nodeActiveBg: "#1e355c",
  nodeActiveBorder: "#1e355c",
  nodeActiveFg: "#ffffff",
  nodeHalo: "rgba(30, 53, 92, 0.15)",
  chipBg: "rgba(30, 53, 92, 0.055)",
  innerBoxBg: "rgba(242, 238, 229, 0.82)",
  playBg: "rgba(194, 94, 51, 0.12)",
  playBorder: "rgba(194, 94, 51, 0.34)",
  docCodeBg: "rgba(29, 107, 82, 0.16)",
  docCodeBorder: "rgba(29, 107, 82, 0.36)",
  quizOkBg: "rgba(29, 107, 82, 0.14)",
  summaryPillBg: "rgba(194, 94, 51, 0.13)",
  summaryPillBorder: "rgba(194, 94, 51, 0.26)",
  specularTop:
    "linear-gradient(90deg, transparent 10%, rgba(30, 53, 92, 0.2) 50%, transparent 90%)",
};

function getStationTagColor(idx: number, palette: ThreadPalette): string {
  switch (idx) {
    case 0:
      return palette.accent2;
    case 1:
      return palette.accent1;
    case 2:
      return palette.terracotta;
    default:
      return palette.accent3;
  }
}

function getSideKickerColor(
  idx: number,
  isActive: boolean,
  isDone: boolean,
  palette: ThreadPalette
): string {
  if (idx === 0) return palette.accent2;
  if (idx === 1) return palette.accent1Bright;
  if (isActive) return palette.accent1Bright;
  if (isDone) return palette.accent2;
  return palette.textSub;
}

interface StationMicroVisualProps {
  visual: StationVisualType;
  palette: ThreadPalette;
  isActive: boolean;
  prefersReducedMotion: boolean;
}

function StationMicroVisual({
  visual,
  palette,
  isActive,
  prefersReducedMotion,
}: StationMicroVisualProps) {
  if (visual === "video") {
    return (
      <div
        className="shrink-0 rounded-[11px] sm:rounded-[13px] border p-2 sm:px-3 sm:py-2.5 flex items-center gap-2.5"
        style={{
          background: palette.innerBoxBg,
          borderColor: palette.borderSoft,
        }}
        aria-hidden="true"
      >
        <span
          className="w-7 h-7 sm:w-[34px] sm:h-[34px] rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300"
          style={{
            background: palette.playBg,
            borderColor: palette.playBorder,
            color: palette.accent1,
            transform: isActive ? "scale(1.05)" : "scale(1)",
          }}
        >
          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current translate-x-[0.5px]" />
        </span>
        <div
          dir="ltr"
          className="hidden sm:flex items-center gap-[3px] h-[18px]"
        >
          {WAVEFORM_BAR_HEIGHTS.map((heightPx, barIdx) => (
            <motion.span
              key={barIdx}
              className="w-[2.5px] rounded-full block"
              style={{
                height: `${heightPx}px`,
                background: palette.accent1,
                opacity: isActive ? 0.92 : 0.68,
              }}
              animate={
                isActive && !prefersReducedMotion
                  ? { scaleY: [0.78, 1.15, 0.82] }
                  : { scaleY: 1 }
              }
              transition={
                isActive && !prefersReducedMotion
                  ? {
                      duration: 1.5 + barIdx * 0.14,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                      delay: barIdx * 0.08,
                    }
                  : { duration: 0.25 }
              }
            />
          ))}
        </div>
      </div>
    );
  }

  if (visual === "guide") {
    return (
      <div
        className="shrink-0 rounded-[11px] sm:rounded-[13px] border p-2 sm:px-3 sm:py-2.5 flex items-center"
        style={{
          background: palette.innerBoxBg,
          borderColor: palette.borderSoft,
        }}
        aria-hidden="true"
      >
        <div className="w-12 sm:w-[82px] flex flex-col gap-[4.5px] sm:gap-[5px]">
          <span
            className="block h-[5px] rounded-full"
            style={{ width: "65%", background: palette.accent1 }}
          />
          <span
            className="block h-[4px] rounded-full opacity-45"
            style={{ width: "92%", background: palette.textMuted }}
          />
          <span
            className="block h-[10px] rounded-[4px] border"
            style={{
              width: "82%",
              background: palette.docCodeBg,
              borderColor: palette.docCodeBorder,
            }}
          />
          <span
            className="block h-[4px] rounded-full opacity-45"
            style={{ width: "70%", background: palette.textMuted }}
          />
        </div>
      </div>
    );
  }

  if (visual === "summary") {
    return (
      <span
        className="shrink-0 px-2.5 sm:px-3 py-1.5 rounded-[10px] border text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap"
        style={{
          background: palette.summaryPillBg,
          borderColor: palette.summaryPillBorder,
          color: palette.terracotta,
        }}
      >
        استرجاع في دقائق
      </span>
    );
  }

  return (
    <div
      className="shrink-0 rounded-[11px] sm:rounded-[13px] border p-1.5 sm:p-2"
      style={{
        background: palette.innerBoxBg,
        borderColor: palette.borderSoft,
      }}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-1 min-w-[76px] sm:min-w-[96px]">
        <span
          className="text-[9.5px] sm:text-[10px] font-extrabold px-2 py-[3px] rounded-[6px] inline-flex items-center justify-between gap-1 whitespace-nowrap"
          style={{
            background: palette.quizOkBg,
            color: palette.accent2,
          }}
        >
          <span>✓ تصحيح فوري</span>
        </span>
        <span
          className="text-[9.5px] sm:text-[10px] font-extrabold px-2 py-[3px] rounded-[6px] inline-flex items-center justify-between gap-1 whitespace-nowrap"
          style={{
            background: palette.chipBg,
            color: palette.textMuted,
          }}
        >
          <span>+40 سؤال</span>
        </span>
      </div>
    </div>
  );
}

export function ExpandingToolsStrips() {
  const theme = useTheme();
  const isDark = theme === "dark";
  const palette = useMemo(
    () => (isDark ? DARK_PALETTE : LIGHT_PALETTE),
    [isDark]
  );
  const prefersReducedMotion = Boolean(useReducedMotion());

  const [activeIdx, setActiveIdx] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const threadFillRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([
    null,
    null,
    null,
    null,
  ]);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([
    null,
    null,
    null,
    null,
  ]);

  const scrollToStation = useCallback((idx: number) => {
    const clamped = Math.min(STATIONS.length - 1, Math.max(0, idx));
    setActiveIdx(clamped);

    const target = rowRefs.current[clamped] ?? sectionRef.current;
    if (!target) return;

    if (window.__lenis) {
      const centerOffset = -Math.round(window.innerHeight * 0.34);
      window.__lenis.scrollTo(target, {
        offset: centerOffset,
        duration: 0.95,
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Listen to Hero pillar jump events and scroll smoothly straight to that station
  useEffect(() => {
    const onJumpPillar = (event: Event) => {
      const custom = event as CustomEvent<{ index?: number }>;
      const idx = custom.detail?.index ?? 0;
      scrollToStation(idx);
    };

    window.addEventListener("cs-portal:jump-pillar", onJumpPillar);
    return () => {
      window.removeEventListener("cs-portal:jump-pillar", onJumpPillar);
    };
  }, [scrollToStation]);

  // Keep the 2px vertical rail pinned strictly from Node 01 center to Node 04 center (transform-immune layout math)
  useEffect(() => {
    const stageEl = stageRef.current;
    const railEl = railRef.current;
    if (!stageEl || !railEl) return;

    const getOffsetTopRelativeTo = (el: HTMLElement, ancestor: HTMLElement) => {
      let top = 0;
      let curr: HTMLElement | null = el;
      while (curr && curr !== ancestor) {
        top += curr.offsetTop;
        curr = curr.offsetParent as HTMLElement | null;
      }
      return top;
    };

    const syncRailGeometry = () => {
      const firstNode = nodeRefs.current[0];
      const lastNode = nodeRefs.current[STATIONS.length - 1];
      if (!firstNode || !lastNode) return;

      const startY =
        getOffsetTopRelativeTo(firstNode, stageEl) + firstNode.offsetHeight / 2;
      const endY =
        getOffsetTopRelativeTo(lastNode, stageEl) + lastNode.offsetHeight / 2;

      if (endY > startY) {
        railEl.style.top = `${startY}px`;
        railEl.style.bottom = "auto";
        railEl.style.height = `${endY - startY}px`;
      }
    };

    syncRailGeometry();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncRailGeometry())
        : null;
    ro?.observe(stageEl);
    window.addEventListener("resize", syncRailGeometry, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncRailGeometry).catch(() => {});
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", syncRailGeometry);
    };
  }, []);

  // GSAP ScrollTrigger: 1:1 scrubbed thread fill + progressive station activation + card glide reveals
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const stageEl = stageRef.current;
    const fillEl = threadFillRef.current;
    if (!sectionEl || !stageEl || !fillEl) return;

    const reduced =
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      fillEl.style.transform = "scaleY(1)";
      rowRefs.current.forEach((row) => {
        if (row) {
          row.style.opacity = "1";
          row.style.transform = "none";
        }
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Scrub the glowing thread line 1:1 with scroll (GPU-composited scaleY from top)
      gsap.fromTo(
        fillEl,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stageEl,
            start: "top 68%",
            end: "bottom 56%",
            scrub: 0.55,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const nextIdx =
                p < 0.28 ? 0 : p < 0.56 ? 1 : p < 0.82 ? 2 : 3;
              setActiveIdx((prev) => (prev === nextIdx ? prev : nextIdx));
            },
          },
        }
      );

      // 2. Smooth editorial reveal for each station row without layout jitter
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.68,
            delay: i === 0 ? 0 : 0.04,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    const refreshId = requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        // ignore if ScrollTrigger is unmounted
      }
    });

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="interactive-showcase"
      ref={sectionRef}
      aria-labelledby="thread-showcase-title"
      className="relative w-full overflow-x-clip border-y transition-colors duration-300"
      style={{
        background: palette.bgGrad,
        borderColor: palette.borderSoft,
      }}
    >
      {/* Subtle Architectural Drafting Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${palette.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${palette.gridLine} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(ellipse 84% 82% at 50% 50%, #000 32%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 84% 82% at 50% 50%, #000 32%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Whisper-Soft Ambient Atelier Glow */}
      <div
        className="pointer-events-none absolute top-[22%] left-[20%] w-[520px] sm:w-[640px] h-[380px] sm:h-[460px] rounded-full blur-[56px]"
        style={{
          background: `radial-gradient(circle, ${palette.glowA} 0%, ${palette.glowB} 50%, transparent 74%)`,
        }}
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-18 lg:py-22">
        {/* Section Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 sm:mb-12 lg:mb-14">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 text-[11px] sm:text-[12px] font-extrabold tracking-wide"
              style={{ color: palette.accent1 }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: palette.accent1 }}
                aria-hidden="true"
              />
              <span>داخل كل محاضرة · في أي مادة</span>
            </div>

            <h2
              id="thread-showcase-title"
              className="mt-1.5 text-[24px] sm:text-[32px] lg:text-[36px] font-black tracking-tight leading-[1.24]"
              style={{ color: palette.textMain }}
            >
              <MaskedLineReveal>4 أركان تتكشّف خطوة بخطوة</MaskedLineReveal>
            </h2>

            <p
              className="mt-1.5 text-[13px] sm:text-[14.5px] leading-relaxed"
              style={{ color: palette.textSub }}
            >
              نظام مذاكرة هادئ ومنظّم يرافقك في كل فصل وكل مقرر على المنصة.
            </p>
          </div>

          {/* Architectural Progress Badge (Desktop) */}
          <div
            dir="ltr"
            className="hidden lg:inline-flex items-center gap-2.5 self-start lg:self-auto px-3.5 py-1.5 rounded-full border font-mono text-[11px] font-bold tracking-[0.04em]"
            style={{
              background: palette.chipBg,
              borderColor: palette.borderActive,
              color: palette.accent1Bright,
            }}
          >
            <span>CONNECTED SCROLL THREAD</span>
            <span className="opacity-45">·</span>
            <span className="tabular-nums">
              0{activeIdx + 1} / 0{STATIONS.length}
            </span>
          </div>
        </header>

        {/* Connected 4-Station Architectural Thread Stage */}
        <div ref={stageRef} className="relative py-2">
          {/* Stationary 2px Rail Wrapper (Right RTL rail on < lg, Centerline on lg+) */}
          <div
            ref={railRef}
            className="pointer-events-none absolute top-7 bottom-20 lg:top-12 lg:bottom-12 right-[15px] lg:right-auto lg:left-1/2 lg:-translate-x-1/2 w-[2px] z-[1]"
            aria-hidden="true"
          >
            {/* Track Line */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: palette.threadTrack }}
            />

            {/* Scrubbed Glowing Fill Line (pure GPU scaleY from top, zero transform conflicts) */}
            <div
              ref={threadFillRef}
              className="absolute inset-0 rounded-full origin-top will-change-transform"
              style={{
                background: palette.threadFill,
                boxShadow: palette.threadGlow,
                transform: "scaleY(0)",
              }}
            />
          </div>

          {/* 4 Universal Stations */}
          <ol className="relative z-10 flex flex-col gap-3.5 sm:gap-4 lg:gap-5 list-none m-0 p-0">
            {STATIONS.map((station) => {
              const isDone = station.idx < activeIdx;
              const isActive = station.idx === activeIdx;
              const tagColor = getStationTagColor(station.idx, palette);
              const sideKickerColor = getSideKickerColor(
                station.idx,
                isActive,
                isDone,
                palette
              );

              const cardStyle: React.CSSProperties = station.isPaper
                ? {
                    background: palette.paperBg,
                    borderColor: isActive
                      ? palette.paperActiveBorder
                      : palette.paperBorder,
                    boxShadow: isActive
                      ? palette.paperActiveShadow
                      : palette.paperIdleShadow,
                    color: palette.paperInk,
                  }
                : {
                    background: isActive
                      ? palette.cardActiveBg
                      : palette.cardBg,
                    borderColor: isActive
                      ? palette.borderActive
                      : palette.borderSoft,
                    boxShadow: isActive ? palette.cardShadow : "none",
                  };

              const nodeStyle: React.CSSProperties = isActive
                ? {
                    background: palette.nodeActiveBg,
                    borderColor: palette.nodeActiveBorder,
                    color: palette.nodeActiveFg,
                    boxShadow: `0 0 0 7px ${palette.nodeHalo}`,
                  }
                : isDone
                  ? {
                      background: palette.nodeDoneBg,
                      borderColor: palette.accent2,
                      color: palette.accent2,
                      boxShadow: "none",
                    }
                  : {
                      background: palette.nodeIdleBg,
                      borderColor: palette.borderSoft,
                      color: palette.textMuted,
                      boxShadow: "none",
                    };

              const cardElement = (
                <article
                  onClick={() => setActiveIdx(station.idx)}
                  className="relative flex-1 min-w-0 rounded-[16px] lg:rounded-[20px] border p-3.5 sm:p-4 lg:px-[22px] lg:py-[18px] flex items-center justify-between gap-3 sm:gap-4 lg:gap-[18px] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 cursor-pointer overflow-hidden"
                  style={cardStyle}
                >
                  {/* Delicate 1px Top Specular Rim on Active Non-Paper Cards */}
                  {isActive && !station.isPaper && (
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-px"
                      style={{ background: palette.specularTop }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div
                      dir="ltr"
                      className="inline-block font-mono text-[9.5px] sm:text-[10.5px] font-extrabold tracking-[0.04em]"
                      style={{ color: tagColor }}
                    >
                      {station.tag}
                    </div>
                    <h3
                      className="mt-0.5 text-[15px] sm:text-[17px] lg:text-[18px] font-black leading-snug"
                      style={{
                        color: station.isPaper
                          ? palette.paperInk
                          : palette.textMain,
                      }}
                    >
                      {station.title}
                    </h3>
                    <p
                      className="mt-1 text-[11.5px] sm:text-[12.5px] lg:text-[13px] leading-[1.65]"
                      style={{
                        color: station.isPaper
                          ? palette.paperSub
                          : palette.textSub,
                      }}
                    >
                      {station.desc}
                    </p>
                  </div>

                  <StationMicroVisual
                    visual={station.visual}
                    palette={palette}
                    isActive={isActive}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </article>
              );

              const nodeElement = (
                <div className="relative z-20 flex justify-center items-start lg:items-center pt-3 lg:pt-0 w-8 lg:w-auto shrink-0 order-first lg:order-none">
                  <motion.button
                    ref={(el) => {
                      nodeRefs.current[station.idx] = el;
                    }}
                    type="button"
                    onClick={() => scrollToStation(station.idx)}
                    aria-label={`المحطة ${station.num}: ${station.title}`}
                    aria-current={isActive ? "step" : undefined}
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { scale: isActive ? 1.08 : 1 }
                    }
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    dir="ltr"
                    className="relative z-20 w-8 h-8 lg:w-[36px] lg:h-[36px] rounded-full border-[1.5px] flex items-center justify-center font-mono text-[10px] lg:text-[11px] font-extrabold transition-[background-color,border-color,color,box-shadow] duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={nodeStyle}
                  >
                    {station.num}
                  </motion.button>
                </div>
              );

              const sideMetaElement = (
                <div
                  className={`hidden lg:flex flex-col gap-1 px-5 transition-opacity duration-300 ${
                    station.cardOnStart
                      ? "text-right items-start"
                      : "text-left items-end"
                  } ${isActive ? "opacity-100" : "opacity-75"}`}
                >
                  <span
                    className="text-[11.5px] font-extrabold leading-snug transition-colors duration-300"
                    style={{ color: sideKickerColor }}
                  >
                    {station.sideKicker}
                  </span>
                  <span
                    className="text-[12px] leading-relaxed"
                    style={{ color: palette.textMuted }}
                  >
                    {station.sideText}
                  </span>
                </div>
              );

              return (
                <li key={station.num}>
                  <div
                    ref={(el) => {
                      rowRefs.current[station.idx] = el;
                    }}
                    className="flex items-start gap-3 lg:grid lg:grid-cols-[1fr_78px_1fr] lg:items-center lg:gap-0"
                  >
                    {station.cardOnStart ? (
                      <>
                        {cardElement}
                        {nodeElement}
                        {sideMetaElement}
                      </>
                    ) : (
                      <>
                        {sideMetaElement}
                        {nodeElement}
                        {cardElement}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
