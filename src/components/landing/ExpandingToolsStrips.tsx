"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
  cardIdleShadow: string;
  cardActiveShadow: string;
  cardHoverShadow: string;
  borderSoft: string;
  borderActive: string;
  borderHover: string;
  textMain: string;
  textSub: string;
  textMuted: string;
  accent1: string;
  accent1Bright: string;
  accent2: string;
  accent3: string;
  accentSummaryTag: string;
  threadTrack: string;
  threadFill: string;
  threadGlow: string;
  /** Strictly opaque solid fills so the vertical thread never bleeds inside nodes. */
  nodeIdleBg: string;
  nodeIdleText: string;
  nodeIdleBorder: string;
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
  summaryPillText: string;
  specularTop: string;
}

const DARK_PALETTE: ThreadPalette = {
  bgGrad: "linear-gradient(175deg, #08090c 0%, #101218 55%, #090b0f 100%)",
  gridLine: "rgba(216, 176, 122, 0.032)",
  glowA: "rgba(216, 176, 122, 0.08)",
  glowB: "rgba(110, 196, 163, 0.06)",
  cardBg: "rgba(19, 22, 30, 0.88)",
  cardActiveBg: "linear-gradient(165deg, #1a1e29 0%, #11141c 100%)",
  cardIdleShadow: "0 12px 32px rgba(0, 0, 0, 0.28)",
  cardActiveShadow: "0 22px 52px rgba(0, 0, 0, 0.48)",
  cardHoverShadow:
    "0 26px 58px rgba(0, 0, 0, 0.56), 0 0 0 1px rgba(216, 176, 122, 0.22)",
  borderSoft: "rgba(255, 245, 230, 0.085)",
  borderActive: "rgba(216, 176, 122, 0.38)",
  borderHover: "rgba(216, 176, 122, 0.52)",
  textMain: "#f6f4ef",
  textSub: "rgba(220, 215, 206, 0.82)",
  textMuted: "rgba(160, 155, 146, 0.78)",
  accent1: "#d8b07a",
  accent1Bright: "#ebd0a3",
  accent2: "#6ec4a3",
  accent3: "#b4a7d6",
  accentSummaryTag: "#e59b72",
  threadTrack: "rgba(255, 255, 255, 0.085)",
  threadFill: "linear-gradient(180deg, #d8b07a 0%, #6ec4a3 60%, #d8b07a 100%)",
  threadGlow: "0 0 14px rgba(216, 176, 122, 0.42)",
  nodeIdleBg: "#12151e",
  nodeIdleText: "rgba(160, 155, 146, 0.55)",
  nodeIdleBorder: "rgba(255, 245, 230, 0.11)",
  nodeDoneBg: "#1b2c2a",
  nodeActiveBg: "#d8b07a",
  nodeActiveBorder: "#d8b07a",
  nodeActiveFg: "#101115",
  nodeHalo: "rgba(216, 176, 122, 0.2)",
  chipBg: "rgba(255, 245, 230, 0.055)",
  innerBoxBg: "rgba(9, 11, 16, 0.78)",
  playBg: "rgba(216, 176, 122, 0.14)",
  playBorder: "rgba(216, 176, 122, 0.42)",
  docCodeBg: "rgba(110, 196, 163, 0.22)",
  docCodeBorder: "rgba(110, 196, 163, 0.4)",
  quizOkBg: "rgba(110, 196, 163, 0.18)",
  summaryPillBg: "rgba(229, 155, 114, 0.14)",
  summaryPillBorder: "rgba(229, 155, 114, 0.34)",
  summaryPillText: "#f0b999",
  specularTop:
    "linear-gradient(90deg, transparent 8%, rgba(235, 208, 163, 0.4) 50%, transparent 92%)",
};

const LIGHT_PALETTE: ThreadPalette = {
  bgGrad: "linear-gradient(175deg, #faf8f3 0%, #f3efe6 56%, #ece7dc 100%)",
  gridLine: "rgba(22, 40, 71, 0.045)",
  glowA: "rgba(194, 94, 51, 0.085)",
  glowB: "rgba(21, 102, 75, 0.075)",
  cardBg: "#ffffff",
  cardActiveBg: "#ffffff",
  cardIdleShadow: "0 14px 36px rgba(18, 28, 45, 0.08)",
  cardActiveShadow:
    "0 20px 48px rgba(18, 28, 45, 0.12), 0 0 0 1px rgba(22, 40, 71, 0.08)",
  cardHoverShadow:
    "0 24px 54px rgba(18, 28, 45, 0.15), 0 0 0 1px rgba(194, 94, 51, 0.14)",
  borderSoft: "rgba(22, 40, 71, 0.11)",
  borderActive: "rgba(22, 40, 71, 0.28)",
  borderHover: "rgba(194, 94, 51, 0.42)",
  textMain: "#121c2e",
  textSub: "#3b475c",
  textMuted: "#5e6b80",
  accent1: "#c25e33",
  accent1Bright: "#9e4722",
  accent2: "#15664b",
  accent3: "#162847",
  accentSummaryTag: "#c25e33",
  threadTrack: "rgba(22, 40, 71, 0.13)",
  threadFill: "linear-gradient(180deg, #162847 0%, #15664b 52%, #c25e33 100%)",
  threadGlow:
    "0 0 14px rgba(194, 94, 51, 0.34), 0 0 6px rgba(21, 102, 75, 0.28)",
  nodeIdleBg: "#ffffff",
  nodeIdleText: "rgba(94, 107, 128, 0.62)",
  nodeIdleBorder: "rgba(22, 40, 71, 0.15)",
  nodeDoneBg: "#e2f1eb",
  nodeActiveBg: "#162847",
  nodeActiveBorder: "#162847",
  nodeActiveFg: "#ffffff",
  nodeHalo: "rgba(22, 40, 71, 0.16)",
  chipBg: "rgba(22, 40, 71, 0.055)",
  innerBoxBg: "rgba(245, 241, 233, 0.92)",
  playBg: "rgba(194, 94, 51, 0.12)",
  playBorder: "rgba(194, 94, 51, 0.36)",
  docCodeBg: "rgba(21, 102, 75, 0.15)",
  docCodeBorder: "rgba(21, 102, 75, 0.36)",
  quizOkBg: "rgba(21, 102, 75, 0.13)",
  summaryPillBg: "rgba(194, 94, 51, 0.11)",
  summaryPillBorder: "rgba(194, 94, 51, 0.28)",
  summaryPillText: "#a94b24",
  specularTop:
    "linear-gradient(90deg, transparent 8%, rgba(22, 40, 71, 0.22) 50%, transparent 92%)",
};

function getStationTagColor(idx: number, palette: ThreadPalette): string {
  switch (idx) {
    case 0:
      return palette.accent2;
    case 1:
      return palette.accent1;
    case 2:
      return palette.accentSummaryTag;
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
        className="shrink-0 rounded-[11px] sm:rounded-[13px] border p-2 sm:px-3 sm:py-2.5 flex items-center gap-2.5 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        style={{
          background: palette.innerBoxBg,
          borderColor: palette.borderSoft,
        }}
        aria-hidden="true"
      >
        <span
          className={`w-7 h-7 sm:w-[34px] sm:h-[34px] rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
            isActive
              ? "scale-105 group-hover:scale-110"
              : "scale-100 group-hover:scale-105"
          }`}
          style={{
            background: palette.playBg,
            borderColor: palette.playBorder,
            color: palette.accent1,
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
                opacity: isActive ? 0.94 : 0.7,
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
        className="shrink-0 rounded-[11px] sm:rounded-[13px] border p-2 sm:px-3 sm:py-2.5 flex items-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        style={{
          background: palette.innerBoxBg,
          borderColor: palette.borderSoft,
        }}
        aria-hidden="true"
      >
        <div className="w-12 sm:w-[82px] flex flex-col gap-[4.5px] sm:gap-[5px]">
          <span
            className="block h-[5px] rounded-full transition-transform duration-300 origin-right group-hover:scale-x-105"
            style={{ width: "65%", background: palette.accent1 }}
          />
          <span
            className="block h-[4px] rounded-full opacity-45"
            style={{ width: "92%", background: palette.textMuted }}
          />
          <span
            className="block h-[10px] rounded-[4px] border transition-transform duration-300 origin-right group-hover:scale-x-[1.04]"
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
        className="shrink-0 px-2.5 sm:px-3 py-1.5 rounded-[10px] border text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        style={{
          background: palette.summaryPillBg,
          borderColor: palette.summaryPillBorder,
          color: palette.summaryPillText,
        }}
      >
        استرجاع في دقائق
      </span>
    );
  }

  return (
    <div
      className="shrink-0 rounded-[11px] sm:rounded-[13px] border p-1.5 sm:p-2 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
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

  // Starts at -1 in normal motion so all nodes begin subtle/dim until scrolled into view.
  const [activeIdx, setActiveIdx] = useState<number>(() =>
    prefersReducedMotion ? 0 : -1
  );

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
  const cardWrapRefs = useRef<Array<HTMLDivElement | null>>([
    null,
    null,
    null,
    null,
  ]);
  const sideMetaRefs = useRef<Array<HTMLDivElement | null>>([
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
      // Position target comfortably above the 78% reveal trigger so thread + card reveal cleanly.
      const revealOffset = -Math.round(window.innerHeight * 0.42);
      window.__lenis.scrollTo(target, {
        offset: revealOffset,
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
        ? new ResizeObserver(() => {
            syncRailGeometry();
            try {
              ScrollTrigger.refresh();
            } catch {
              // ignore if plugin not initialized yet
            }
          })
        : null;
    ro?.observe(stageEl);
    window.addEventListener("resize", syncRailGeometry, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          syncRailGeometry();
          try {
            ScrollTrigger.refresh();
          } catch {
            // ignore
          }
        })
        .catch(() => {});
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", syncRailGeometry);
    };
  }, []);

  // GSAP ScrollTrigger: 1:1 scrubbed thread fill + one-by-one reversible station reveal
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const railEl = railRef.current;
    const fillEl = threadFillRef.current;
    if (!sectionEl || !railEl || !fillEl) return;

    const reduced =
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      fillEl.style.transform = "scaleY(1)";
      cardWrapRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      sideMetaRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Scrub the glowing 2px vertical thread 1:1 from Node 01 center to Node 04 center at viewport 78%
      gsap.fromTo(
        fillEl,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: railEl,
            start: "top 78%",
            end: "bottom 78%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        }
      );

      // 2. Hidden until scrolled to — reveal each station's card + side meta one by one and reverse when scrolling up
      STATIONS.forEach((station) => {
        const rowEl = rowRefs.current[station.idx];
        const cardWrap = cardWrapRefs.current[station.idx];
        const sideMeta = sideMetaRefs.current[station.idx];
        if (!rowEl || !cardWrap) return;

        const targets: HTMLElement[] = sideMeta
          ? [cardWrap, sideMeta]
          : [cardWrap];

        gsap.set(targets, {
          opacity: 0,
          y: 42,
          scale: 0.96,
          willChange: "transform, opacity",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rowEl,
            start: "top 78%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
            onEnter: () => {
              setActiveIdx(station.idx);
            },
            onLeaveBack: () => {
              setActiveIdx(station.idx - 1);
            },
          },
        });

        tl.to(
          cardWrap,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          0
        );

        if (sideMeta) {
          tl.to(
            sideMeta,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            0.08
          );
        }
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

  const effectiveActiveIdx = prefersReducedMotion
    ? Math.max(0, activeIdx)
    : activeIdx;
  const displayedStep = Math.max(0, effectiveActiveIdx + 1);

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
        className="pointer-events-none absolute top-[20%] left-[20%] w-[520px] sm:w-[660px] h-[380px] sm:h-[480px] rounded-full blur-[58px]"
        style={{
          background: `radial-gradient(circle, ${palette.glowA} 0%, ${palette.glowB} 50%, transparent 74%)`,
        }}
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-22 lg:py-28">
        {/* Section Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-12 sm:mb-16 lg:mb-20">
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
              0{displayedStep} / 0{STATIONS.length}
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

          {/* 4 Universal Stations with Generous Scroll Step Spacing */}
          <ol className="relative z-10 space-y-12 lg:space-y-16 list-none m-0 p-0">
            {STATIONS.map((station) => {
              const isDone = station.idx < effectiveActiveIdx;
              const isActive = station.idx === effectiveActiveIdx;
              const tagColor = getStationTagColor(station.idx, palette);
              const sideKickerColor = getSideKickerColor(
                station.idx,
                isActive,
                isDone,
                palette
              );

              const cardStyle = {
                background: isActive ? palette.cardActiveBg : palette.cardBg,
                "--card-border": isActive
                  ? palette.borderActive
                  : palette.borderSoft,
                "--card-border-hover": palette.borderHover,
                "--card-shadow": isActive
                  ? palette.cardActiveShadow
                  : palette.cardIdleShadow,
                "--card-shadow-hover": palette.cardHoverShadow,
              } as CSSProperties;

              const nodeStyle: CSSProperties = isActive
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
                      borderColor: palette.nodeIdleBorder,
                      color: palette.nodeIdleText,
                      boxShadow: "none",
                    };

              const cardElement = (
                <div
                  ref={(el) => {
                    cardWrapRefs.current[station.idx] = el;
                  }}
                  className="flex-1 min-w-0"
                >
                  <article
                    onClick={() => setActiveIdx(station.idx)}
                    className="group relative w-full min-w-0 rounded-[16px] lg:rounded-[20px] border [border-color:var(--card-border)] hover:[border-color:var(--card-border-hover)] [box-shadow:var(--card-shadow)] hover:[box-shadow:var(--card-shadow-hover)] hover:-translate-y-1 p-4 sm:p-5 lg:px-6 lg:py-5 flex items-center justify-between gap-3 sm:gap-4 lg:gap-[18px] backdrop-blur-md transition-[transform,border-color,box-shadow,background-color] duration-300 ease-out cursor-pointer overflow-hidden will-change-transform"
                    style={cardStyle}
                  >
                    {/* Delicate 1px Top Specular Rim */}
                    <span
                      className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-80"
                      }`}
                      style={{ background: palette.specularTop }}
                      aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                      <div
                        dir="ltr"
                        className="inline-block font-mono text-[9.5px] sm:text-[10.5px] font-extrabold tracking-[0.04em]"
                        style={{ color: tagColor }}
                      >
                        {station.tag}
                      </div>
                      <h3
                        className="mt-0.5 text-[15px] sm:text-[17px] lg:text-[18.5px] font-black leading-snug"
                        style={{ color: palette.textMain }}
                      >
                        {station.title}
                      </h3>
                      <p
                        className="mt-1.5 text-[11.5px] sm:text-[12.5px] lg:text-[13px] leading-[1.68]"
                        style={{ color: palette.textSub }}
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
                </div>
              );

              const nodeElement = (
                <div className="relative z-20 flex justify-center items-start lg:items-center pt-3.5 lg:pt-0 w-8 lg:w-auto shrink-0 order-first lg:order-none">
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
                        : {
                            scale: isActive ? 1.09 : isDone ? 1 : 0.94,
                          }
                    }
                    transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
                    dir="ltr"
                    className="relative z-20 w-8 h-8 lg:w-[38px] lg:h-[38px] rounded-full border-[1.5px] flex items-center justify-center font-mono text-[10px] lg:text-[11px] font-extrabold transition-[background-color,border-color,color,box-shadow] duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={nodeStyle}
                  >
                    {station.num}
                  </motion.button>
                </div>
              );

              const sideMetaElement = (
                <div
                  ref={(el) => {
                    sideMetaRefs.current[station.idx] = el;
                  }}
                  className={`hidden lg:flex flex-col gap-1 px-6 ${
                    station.cardOnStart
                      ? "text-right items-start"
                      : "text-left items-end"
                  }`}
                >
                  <span
                    className="text-[12px] font-extrabold leading-snug transition-colors duration-300"
                    style={{ color: sideKickerColor }}
                  >
                    {station.sideKicker}
                  </span>
                  <span
                    className="text-[12.5px] leading-relaxed"
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
                    className="flex items-start gap-3.5 lg:grid lg:grid-cols-[1fr_84px_1fr] lg:items-center lg:gap-0"
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
