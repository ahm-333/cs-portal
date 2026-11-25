"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  BookOpen,
  CheckSquare,
  FileText,
  Globe,
  Play,
  PlayCircle,
} from "lucide-react";
import { usePortalState } from "@/lib/stores/portalStore";

interface StageCopyItem {
  title: string;
  gradientLine?: string;
  sub: string;
  ariaLabel: string;
}

const STAGE_COPY: readonly StageCopyItem[] = [
  {
    title: "بدل ما كل حاجة في حتة وتلف وتدوّر عشان تذاكر...",
    sub: "اسكرول بهدوء وشوف مكتب مذاكرتك الكامل بيتبني قدام عينك.",
    ariaLabel: "المرحلة 1: الفوضى قبل المنصة",
  },
  {
    title: "كل فيديوهات الشرح مترتّبة في مكان واحد",
    sub: "فصول زمنية واضحة تدخلك على الجزئية اللي واقفة معاك في ثانية بدون تشتيت.",
    ariaLabel: "المرحلة 2: فيديوهات الشرح",
  },
  {
    title: "كشكول ملخصات بالعامية وأكواد واضحة",
    sub: "كل سطر إنجليزي وتحته شرحه بالقلم الأزرق + تريكات الامتحان جاهزة للطباعة.",
    ariaLabel: "المرحلة 3: كشكول الملخصات",
  },
  {
    title: "شرح تفاعلي حيّ وكويزات بتصحيح فوري",
    sub: "سلايدات ملونة + تغبيش للحفظ + أسئلة شيتات وميدتيرم وبنك أخطاء ذكي.",
    ariaLabel: "المرحلة 4: الشرح التفاعلي والكويزات",
  },
  {
    title: "بدل تشتيت الملفات..",
    gradientLine: "كل حاجة تخص المادة في مكان واحد",
    sub: "فيديو، شرح تفاعلي، كشكول ملخص، وكويزات لكل فصل — جاهز تبدأ دلوقتي.",
    ariaLabel: "المرحلة 5: اكتمال مكتب المذاكرة",
  },
] as const;

const STAGE_TARGETS = [0.0, 0.26, 0.48, 0.69, 0.9] as const;

const CHAOS_CONFIG = [
  {
    id: "chaos1",
    label: "📄 Lecture_final_v4_OLD.pdf",
    className:
      "chaos-chip absolute top-[12%] right-[13%] px-3.5 py-2 rounded-xl bg-[#2a1d24]/92 border border-[#e58a62]/55 text-[12px] font-bold text-[#fed7aa] shadow-xl",
    rx: 8,
    dx: -155,
    dy: 85,
  },
  {
    id: "chaos2",
    label: "▶ رابط يوتيوب ناقص (جزء 3)",
    className:
      "chaos-chip absolute top-[18%] left-[13%] px-3.5 py-2 rounded-xl bg-[#2a1d24]/92 border border-rose-400/50 text-[12px] font-bold text-rose-200 shadow-xl",
    rx: -9,
    dx: 155,
    dy: 75,
  },
  {
    id: "chaos3",
    label: "🖼 IMG_code_blurry.jpg",
    className:
      "chaos-chip absolute bottom-[18%] right-[15%] px-3.5 py-2 rounded-xl bg-[#1e2638]/92 border border-amber-400/45 text-[12px] font-bold text-amber-200 shadow-xl",
    rx: -6,
    dx: -145,
    dy: -75,
  },
  {
    id: "chaos4",
    label: "💬 رسالة تليجرام ضايعة...",
    className:
      "chaos-chip absolute bottom-[14%] left-[15%] px-3.5 py-2 rounded-xl bg-[#1e2638]/92 border border-slate-400/40 text-[12px] font-bold text-slate-200 shadow-xl",
    rx: 10,
    dx: 145,
    dy: -70,
  },
] as const;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function InteractiveDeskHero() {
  const router = useRouter();
  const portal = usePortalState();
  const lastVisited = portal.lastVisited;

  // Desktop scroll-assembled 3D desk cinema state & smooth physics refs
  const [stageIdx, setStageIdx] = useState(0);
  const [isAutoTouring, setIsAutoTouring] = useState(false);

  const stageIdxRef = useRef(0);
  const targetPRef = useRef(0);
  const smoothPRef = useRef(0);
  const autoTourActiveRef = useRef(false);
  const autoTourRafRef = useRef<number | null>(null);
  const autoTourNavTimerRef = useRef<number | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const deskWrapRef = useRef<HTMLDivElement | null>(null);
  const pctLabelRef = useRef<HTMLSpanElement | null>(null);

  const frameRefs = useRef<(HTMLImageElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const chaosRefs = useRef<(HTMLDivElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const featPopRefs = useRef<(HTMLDivElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const stopAutoTour = useCallback(() => {
    if (!autoTourActiveRef.current) return;
    autoTourActiveRef.current = false;
    setIsAutoTouring(false);
    if (autoTourRafRef.current !== null) {
      cancelAnimationFrame(autoTourRafRef.current);
      autoTourRafRef.current = null;
    }
    if (autoTourNavTimerRef.current !== null) {
      window.clearTimeout(autoTourNavTimerRef.current);
      autoTourNavTimerRef.current = null;
    }
  }, []);

  const renderScrollyVisuals = useCallback((p: number) => {
    // Map assembly smoothly across 0..0.82, leaving 0.82..1.00 as a calm finale hold
    const assemblyPct = Math.round(clamp01(p / 0.8) * 100);
    if (pctLabelRef.current) {
      pctLabelRef.current.textContent = `${assemblyPct}%`;
    }

    // Calm, spacious stage thresholds so every headline stays readable & organized
    const nextStageIdx =
      p < 0.16 ? 0 : p < 0.37 ? 1 : p < 0.58 ? 2 : p < 0.78 ? 3 : 4;
    if (nextStageIdx !== stageIdxRef.current) {
      stageIdxRef.current = nextStageIdx;
      setStageIdx(nextStageIdx);
    }

    const exitT = smoothstep(0.92, 1.0, p);
    const deskWrap = deskWrapRef.current;
    if (deskWrap) {
      const grow = smoothstep(0.0, 0.8, p);
      const sc = 0.91 + grow * 0.12 - exitT * 0.04;
      const ty = (1 - grow) * 12 - exitT * 14;
      deskWrap.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
      deskWrap.style.opacity = String(1 - exitT * 0.18);
    }

    // Chaos chips smoothly pull inward and fade out cleanly during 0.03..0.22
    const chaosFade = smoothstep(0.03, 0.22, p);
    CHAOS_CONFIG.forEach((item, idx) => {
      const el = chaosRefs.current[idx];
      if (!el) return;
      el.style.opacity = String(1 - chaosFade);
      el.style.transform = `translate3d(${(item.dx * chaosFade).toFixed(1)}px, ${(item.dy * chaosFade).toFixed(1)}px, 0) rotate(${(item.rx * (1 - chaosFade)).toFixed(1)}deg) scale(${(1 - chaosFade * 0.32).toFixed(3)})`;
    });

    // Silky smoothstep frame crossfades
    const op1 = smoothstep(0.15, 0.3, p);
    const op2 = smoothstep(0.36, 0.52, p);
    const op3 = smoothstep(0.57, 0.74, p);

    const f0 = frameRefs.current[0];
    const f1 = frameRefs.current[1];
    const f2 = frameRefs.current[2];
    const f3 = frameRefs.current[3];

    if (f0) f0.style.opacity = "1";
    if (f1) f1.style.opacity = String(op1);
    if (f2) f2.style.opacity = String(op2);
    if (f3) f3.style.opacity = String(op3);

    // Staggered, calm feature pop-up cards aligned with each desk item
    const exitScale = 1 - exitT * 0.35;
    const pops = [
      { val: smoothstep(0.18, 0.31, p) * exitScale, dir: 26 },
      { val: smoothstep(0.39, 0.52, p) * exitScale, dir: -26 },
      { val: smoothstep(0.58, 0.7, p) * exitScale, dir: 26 },
      { val: smoothstep(0.68, 0.8, p) * exitScale, dir: -26 },
    ];

    pops.forEach((pop, idx) => {
      const el = featPopRefs.current[idx];
      if (!el) return;
      el.style.opacity = String(pop.val);
      const tx = (1 - Math.min(1, pop.val / Math.max(0.01, exitScale))) * pop.dir;
      el.style.transform = `translate3d(${tx.toFixed(1)}px, 0, 0) scale(${(0.94 + pop.val * 0.06).toFixed(4)})`;
    });
  }, []);

  // Continuous butter-smooth physics lerp loop (Desktop >= 1024px)
  useEffect(() => {
    let rafId = 0;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readTargetProgress = () => {
      const track = trackRef.current;
      if (!track || track.offsetHeight === 0) return;
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        targetPRef.current = 0;
        return;
      }
      targetPRef.current = clamp01(-rect.top / scrollable);
    };

    const tick = () => {
      readTargetProgress();
      const target = targetPRef.current;
      const current = smoothPRef.current;

      if (reducedMotion) {
        smoothPRef.current = target;
      } else {
        const diff = target - current;
        // Liquid-smooth damping factor (faster when close so it never stalls)
        smoothPRef.current =
          Math.abs(diff) < 0.0004 ? target : current + diff * 0.095;
      }

      renderScrollyVisuals(smoothPRef.current);
      rafId = requestAnimationFrame(tick);
    };

    readTargetProgress();
    smoothPRef.current = targetPRef.current;
    renderScrollyVisuals(smoothPRef.current);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [renderScrollyVisuals]);

  // Automated cinematic scroll tour when clicking "ابدأ المذاكرة" on Desktop
  const startAutoTour = useCallback(() => {
    const track = trackRef.current;
    if (typeof window === "undefined" || !track || window.innerWidth < 1024) {
      router.push("/courses");
      return;
    }

    // If user clicks a second time while already touring, jump straight to /courses
    if (autoTourActiveRef.current) {
      stopAutoTour();
      router.push("/courses");
      return;
    }

    const topAbs = track.getBoundingClientRect().top + window.scrollY;
    const scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      router.push("/courses");
      return;
    }

    autoTourActiveRef.current = true;
    setIsAutoTouring(true);

    // Piecewise timeline with calm, cinematic pauses at each desk milestone
    const startP = clamp01((window.scrollY - topAbs) / scrollable);
    const endP = 0.91;

    if (startP >= 0.84) {
      // Already assembled — briefly show finale then open courses
      autoTourNavTimerRef.current = window.setTimeout(() => {
        stopAutoTour();
        router.push("/courses");
      }, 650);
      return;
    }

    const totalDurationMs = Math.max(3600, Math.round((endP - startP) * 7600));
    const startTime = performance.now();

    const stepTour = (now: number) => {
      if (!autoTourActiveRef.current) return;
      const elapsed = now - startTime;
      const t = clamp01(elapsed / totalDurationMs);

      // Gentle breathing cadence: smooth glide with slight slowdowns around feature stages
      const baseEase = easeInOutCubic(t);
      const subtleCadence =
        baseEase + Math.sin(baseEase * Math.PI * 6) * 0.014 * (1 - t);
      const nextP = clamp01(startP + (endP - startP) * clamp01(subtleCadence));

      const targetY = topAbs + nextP * scrollable;
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { immediate: true, force: true });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: "auto",
        });
      }

      if (t < 1) {
        autoTourRafRef.current = requestAnimationFrame(stepTour);
      } else {
        // Hold briefly on the complete desk + signature headline, then navigate to /courses
        autoTourNavTimerRef.current = window.setTimeout(() => {
          stopAutoTour();
          router.push("/courses");
        }, 1250);
      }
    };

    autoTourRafRef.current = requestAnimationFrame(stepTour);
  }, [router, stopAutoTour]);

  // Listen for Topbar "ابدأ المذاكرة" event & yield instantly if user scrolls manually
  useEffect(() => {
    const onStartTour = () => startAutoTour();
    const onUserInterrupt = () => {
      if (autoTourActiveRef.current) stopAutoTour();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        autoTourActiveRef.current &&
        (e.key === "Escape" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === " ")
      ) {
        stopAutoTour();
      }
    };

    window.addEventListener("cs-portal:start-desk-tour", onStartTour);
    window.addEventListener("wheel", onUserInterrupt, { passive: true });
    window.addEventListener("touchstart", onUserInterrupt, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("cs-portal:start-desk-tour", onStartTour);
      window.removeEventListener("wheel", onUserInterrupt);
      window.removeEventListener("touchstart", onUserInterrupt);
      window.removeEventListener("keydown", onKeyDown);
      stopAutoTour();
    };
  }, [startAutoTour, stopAutoTour]);

  const handleStageSelect = (idx: number) => {
    stopAutoTour();
    const targetP = STAGE_TARGETS[idx] ?? 0;
    const track = trackRef.current;
    if (typeof window !== "undefined" && track) {
      const topAbs = track.getBoundingClientRect().top + window.scrollY;
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable > 0) {
        const destY = topAbs + targetP * scrollable;
        if (window.__lenis) {
          window.__lenis.scrollTo(destY, { duration: 1.15 });
        } else {
          window.scrollTo({ top: destY, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section
      id="top"
      className="relative w-full overflow-x-clip lg:overflow-visible text-white"
    >
      {/* ==================== MOBILE & TABLET HERO (< lg): UNCHANGED FULL 100svh INTRO SCREEN ==================== */}
      <div
        className="lg:hidden relative min-h-[100svh] flex flex-col justify-between border-b border-white/[0.08]"
        style={{
          background:
            "linear-gradient(180deg, #0b1322 0%, #13213a 62%, #0f1b30 100%)",
        }}
      >
        {/* Soft Ambient Terracotta & Mint Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[8%] w-[260px] h-[260px] sm:w-[460px] sm:h-[460px] rounded-full blur-3xl opacity-[0.18]"
          style={{
            background:
              "radial-gradient(circle, #c25e33 0%, rgba(194, 94, 51, 0.22) 45%, transparent 72%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 left-[6%] w-[240px] h-[240px] sm:w-[440px] sm:h-[440px] rounded-full blur-3xl opacity-[0.16]"
          style={{
            background:
              "radial-gradient(circle, #66c7a6 0%, rgba(102, 199, 166, 0.18) 45%, transparent 72%)",
          }}
        />

        <div className="relative z-10 flex-1 w-full max-w-[400px] mx-auto px-4 pt-20 pb-6 flex flex-col items-center justify-between">
          {/* Centered Hero Focal Group */}
          <div className="my-auto flex flex-col items-center gap-5 py-4">
            {/* 1. Seamless 3D Desk Visual (True transparent cutout — zero box/edge artifacts) */}
            <div className="relative w-[255px] h-[215px] sm:w-[295px] sm:h-[245px] flex items-center justify-center select-none pointer-events-none">
              <div className="relative w-full h-full scale-[1.12]">
                <Image
                  src="/images/desk/frame-3-nobg.png"
                  alt="مكتب المذاكرة المنظم"
                  width={900}
                  height={900}
                  sizes="(max-width: 640px) 255px, 295px"
                  className="w-full h-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.42)]"
                  priority
                  draggable={false}
                />
              </div>
            </div>

            {/* 2. Balanced 2-Line Headline + Crisp 1-Line Subtitle (Zero Orphan Words) */}
            <div className="text-center space-y-2.5">
              <span
                dir="ltr"
                className="font-mono-code inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10.5px] font-semibold tracking-wide text-slate-300"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#66c7a6] shrink-0"
                  aria-hidden="true"
                />
                AI · Zagazig University
              </span>

              <h1 className="text-[22px] sm:text-[28px] font-black tracking-tight leading-[1.35] text-white text-balance">
                بدل تشتيت الملفات..
                <span className="block mt-0.5 bg-gradient-to-l from-[#f0a786] via-[#f6c4a8] to-[#66c7a6] bg-clip-text text-transparent">
                  كل حاجة تخص المادة في مكان واحد
                </span>
              </h1>

              <p className="text-[13px] sm:text-[14px] text-slate-300/80 leading-relaxed text-balance">
                فيديو، شرح تفاعلي، ملخص منظم، وكويزات لكل فصل.
              </p>
            </div>

            {/* 3. One Calm Focal Action */}
            <div className="w-full flex flex-col items-center gap-2.5 pt-1">
              {lastVisited ? (
                <>
                  <Link
                    href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                    title={lastVisited.lessonTitle}
                    className="cta-shimmer h-12 px-7 rounded-full text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
                    style={{ background: "#c25e33" }}
                  >
                    <span>أكمل مذاكرة</span>
                    <span
                      dir="ltr"
                      className="font-mono-code rounded-md bg-black/20 px-1.5 py-0.5 text-[11.5px] font-bold"
                    >
                      {lastVisited.courseCode}
                    </span>
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-[12.5px] font-semibold text-slate-300/90 hover:text-white transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#66c7a6] shrink-0" />
                    <span>تصفح كل المقررات</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/courses"
                  className="cta-shimmer h-12 px-8 rounded-full text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
                  style={{ background: "#c25e33" }}
                >
                  <span>ابدأ المذاكرة الآن</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </Link>
              )}
            </div>
          </div>

          {/* Subtle Bottom Scroll Cue Anchored Cleanly to Viewport Bottom */}
          <a
            href="#courses-picker"
            className="anim-scroll-cue inline-flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <span>اسحب لتصفح المقررات</span>
            <ArrowDown className="w-4 h-4 text-[#66c7a6]" />
          </a>
        </div>
      </div>

      {/* ==================== DESKTOP HERO (>= lg): BUTTER-SMOOTH SCROLL-ASSEMBLED 3D DESK CINEMA ==================== */}
      <div
        id="scrollyTrack"
        ref={trackRef}
        className="hidden lg:block scrolly-track"
      >
        <div className="scrolly-sticky text-white border-b border-white/10">
          {/* Ambient Cinema Glows */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #66c7a6 0%, #c25e33 55%, transparent 72%)",
            }}
            aria-hidden="true"
          />

          {/* Top Clean Crossfading Headline Stage (Zero pill clutter, zero jitter) */}
          <div className="relative z-20 max-w-[960px] w-full mx-auto px-6 pt-[76px]">
            <div className="relative h-[108px] xl:h-[118px] w-full">
              {STAGE_COPY.map((stage, idx) => {
                const isActive = stageIdx === idx;
                return (
                  <div
                    key={stage.ariaLabel}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 ease-out ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2.5 pointer-events-none"
                    }`}
                  >
                    <h1 className="text-3xl xl:text-[38px] font-black tracking-tight leading-[1.28] text-white">
                      {stage.title}
                      {stage.gradientLine && (
                        <span className="block mt-1 bg-gradient-to-l from-[#f0a786] via-[#f6c4a8] to-[#66c7a6] bg-clip-text text-transparent">
                          {stage.gradientLine}
                        </span>
                      )}
                    </h1>
                    <p className="text-[14.5px] text-slate-300/90 mt-2 max-w-2xl leading-relaxed">
                      {stage.sub}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER FULL-SCREEN 3D STAGE */}
          <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-4 flex items-center justify-center my-1 min-h-0">
            {/* CHAOS LAYER (Smoothly glides inward & dissolves) */}
            <div
              id="chaosOverlay"
              className="absolute inset-0 z-30 pointer-events-none"
              aria-hidden="true"
            >
              {CHAOS_CONFIG.map((chip, idx) => (
                <div
                  key={chip.id}
                  id={chip.id}
                  ref={(el) => {
                    chaosRefs.current[idx] = el;
                  }}
                  className={chip.className}
                  style={{
                    transform: `rotate(${chip.rx}deg)`,
                    willChange: "transform, opacity",
                  }}
                >
                  {chip.label}
                </div>
              ))}
            </div>

            {/* FLOATING FEATURE POP-UP CARDS (Calmed spacing + GPU-accelerated) */}
            <div
              id="featPop1"
              ref={(el) => {
                featPopRefs.current[0] = el;
              }}
              className="feature-pop-card absolute top-[12%] right-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#e58a62]/45 backdrop-blur-md shadow-2xl"
              style={{
                opacity: 0,
                transform: "translate3d(26px, 0, 0) scale(0.94)",
                willChange: "transform, opacity",
              }}
            >
              <div className="flex items-center gap-2 text-[#f0a786] text-[11px] font-extrabold mb-1">
                <PlayCircle className="w-4 h-4" />
                <span>01 · اللابتوب نزل</span>
              </div>
              <div className="text-[14px] font-extrabold text-white">
                فيديوهات شرح مرتبة
              </div>
              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                كل درس بفيديو واضح ومقسّم بدون تشتيت بين قنوات متفرقة.
              </p>
            </div>

            <div
              id="featPop2"
              ref={(el) => {
                featPopRefs.current[1] = el;
              }}
              className="feature-pop-card absolute top-[16%] left-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#7ca7f0]/45 backdrop-blur-md shadow-2xl"
              style={{
                opacity: 0,
                transform: "translate3d(-26px, 0, 0) scale(0.94)",
                willChange: "transform, opacity",
              }}
            >
              <div className="flex items-center gap-2 text-[#9dc0f7] text-[11px] font-extrabold mb-1">
                <FileText className="w-4 h-4" />
                <span>02 · التابلت نزل</span>
              </div>
              <div className="text-[14px] font-extrabold text-white">
                كشكول ملخصات وأكواد
              </div>
              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                ملخص بالعامية على شكل كشكول منظم ومعادلات جاهزة للمراجعة.
              </p>
            </div>

            <div
              id="featPop3"
              ref={(el) => {
                featPopRefs.current[2] = el;
              }}
              className="feature-pop-card absolute bottom-[12%] right-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#66c7a6]/50 backdrop-blur-md shadow-2xl"
              style={{
                opacity: 0,
                transform: "translate3d(26px, 0, 0) scale(0.94)",
                willChange: "transform, opacity",
              }}
            >
              <div className="flex items-center gap-2 text-[#66c7a6] text-[11px] font-extrabold mb-1">
                <Globe className="w-4 h-4" />
                <span>03 · الشبكة المضيئة</span>
              </div>
              <div className="text-[14px] font-extrabold text-white">
                شرح تفاعلي وتغبيش للحفظ
              </div>
              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                سلايدات ملونة + تغبيش للمصطلحات وحاسبة مسائل خطوة بخطوة.
              </p>
            </div>

            <div
              id="featPop4"
              ref={(el) => {
                featPopRefs.current[3] = el;
              }}
              className="feature-pop-card absolute bottom-[10%] left-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#e58a62]/55 backdrop-blur-md shadow-2xl"
              style={{
                opacity: 0,
                transform: "translate3d(-26px, 0, 0) scale(0.94)",
                willChange: "transform, opacity",
              }}
            >
              <div className="flex items-center gap-2 text-[#f0a786] text-[11px] font-extrabold mb-1">
                <CheckSquare className="w-4 h-4" />
                <span>04 · المكتب اكتمل 100%</span>
              </div>
              <div className="text-[14px] font-extrabold text-white">
                كويزات تثبيت وتركيز تام
              </div>
              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                أسئلة ميدتيرم وشيتات بتصحيح فوري مع مؤقت بومودورو وحفظ تلقائي.
              </p>
            </div>

            {/* PIXEL-LOCKED 4-FRAME 3D STUDIO DESK STACK */}
            <div
              id="deskCinemaWrap"
              ref={deskWrapRef}
              className="desk-cinema-wrap relative w-[440px] h-[440px] xl:w-[485px] xl:h-[485px] flex items-center justify-center"
              style={{
                transform: "translate3d(0, 12px, 0) scale(0.91)",
                willChange: "transform, opacity",
              }}
            >
              <Image
                id="frame3d0"
                ref={(el) => {
                  frameRefs.current[0] = el;
                }}
                src="/images/desk/frame-0.jpg"
                alt="المرحلة الأولى: المكتب فارغ جاهز للترتيب"
                width={900}
                height={900}
                sizes="485px"
                className="frame-3d"
                style={{ opacity: 1 }}
                priority
                decoding="async"
                draggable={false}
              />
              <Image
                id="frame3d1"
                ref={(el) => {
                  frameRefs.current[1] = el;
                }}
                src="/images/desk/frame-1.jpg"
                alt="المرحلة الثانية: ظهور اللابتوب بفيديوهات الشرح"
                width={900}
                height={900}
                sizes="485px"
                className="frame-3d"
                style={{ opacity: 0 }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
              <Image
                id="frame3d2"
                ref={(el) => {
                  frameRefs.current[2] = el;
                }}
                src="/images/desk/frame-2.jpg"
                alt="المرحلة الثالثة: انضمام التابلت والملخصات"
                width={900}
                height={900}
                sizes="485px"
                className="frame-3d"
                style={{ opacity: 0 }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
              <Image
                id="frame3d3"
                ref={(el) => {
                  frameRefs.current[3] = el;
                }}
                src="/images/desk/frame-3.jpg"
                alt="المرحلة النهائية: اكتمال مكتب المذاكرة التفاعلي"
                width={900}
                height={900}
                sizes="485px"
                className="frame-3d"
                style={{ opacity: 0 }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Stage Progress Dots + Interactive Auto-Tour / Enter Courses Control */}
          <div className="relative z-20 max-w-2xl w-full mx-auto px-4 pb-5 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1 px-3.5 py-1 rounded-full bg-white/[0.07] border border-white/12 backdrop-blur-md">
              {STAGE_COPY.map((stage, idx) => (
                <button
                  key={stage.ariaLabel}
                  type="button"
                  onClick={() => handleStageSelect(idx)}
                  className="stage-step-btn min-h-[34px] px-1 flex items-center justify-center cursor-pointer"
                  aria-label={stage.ariaLabel}
                  aria-pressed={stageIdx === idx}
                >
                  <span
                    className={`cinema-dot ${stageIdx === idx ? "active" : ""}`}
                  />
                </button>
              ))}
              <span
                id="scrollyPctLabel"
                ref={pctLabelRef}
                className="text-[11px] font-mono-code font-bold text-[#66c7a6] mr-1.5"
              >
                0%
              </span>
            </div>

            {isAutoTouring ? (
              <Link
                href="/courses"
                onClick={stopAutoTour}
                className="h-[42px] px-4 rounded-full bg-white/[0.10] hover:bg-white/[0.16] border border-white/20 text-[12px] font-extrabold text-white inline-flex items-center gap-2 backdrop-blur-md transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#66c7a6] animate-pulse" />
                <span>تخطي للمواد</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              </Link>
            ) : stageIdx === 4 ? (
              <Link
                href="/courses"
                className="cta-shimmer h-[42px] px-5 rounded-full text-[12.5px] font-extrabold text-white inline-flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ background: "#c25e33" }}
              >
                <span>ادخل على المقررات</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={startAutoTour}
                className="h-[42px] px-4 rounded-full bg-[#c25e33] hover:bg-[#d16a3e] text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 shadow-lg cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>ابدأ المذاكرة</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
