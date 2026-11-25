"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  BookOpen,
  CheckSquare,
  FileText,
  Globe,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { BlurText, ShinyText } from "@/components/ui/ReactBits";
import { usePortalState } from "@/lib/stores/portalStore";

interface StageCopyItem {
  tag: string;
  title: string;
  sub: string;
  ariaLabel: string;
}

const STAGE_COPY: readonly StageCopyItem[] = [
  {
    tag: "المرحلة 1 من 5 · الفوضى قبل المنصة",
    title: "بدل ما كل حاجة في حتة وتلف وتدوّر عشان تذاكر...",
    sub: "انسى تشتيت تليجرام وروابط Drive المقفولة — اسكرول وشوف مكتب مذاكرتك الكامل بيتبني قدام عينك!",
    ariaLabel: "المرحلة 1: الفوضى",
  },
  {
    tag: "المرحلة 2 من 5 · ظهور اللابتوب",
    title: "كل فيديوهات الشرح مترتّبة ومستنياك في مكان واحد!",
    sub: "شابترز دقيقة تدخلك على الفكرة اللي واقفة معاك في ثانية — صفر تشتيت، صفر تدوير.",
    ariaLabel: "المرحلة 2: فيديوهات الشرح",
  },
  {
    tag: "المرحلة 3 من 5 · ظهور التابلت",
    title: "ملخصات تخلّصك وأكواد واضحة تتقري من أول نظرة!",
    sub: "وداعاً لصور السبورة المهزوزة — كشكول ملخص بالعامية ومعادلات جاهزة لليلة الامتحان.",
    ariaLabel: "المرحلة 3: الملخصات",
  },
  {
    tag: "المرحلة 4 من 5 · الشبكة المضيئة",
    title: "افهم بجد وطبّق بإيدك داخل شرح تفاعلي حي!",
    sub: "ما تحفظش خوارزميات على الورق — شغّلها قدام عينك خطوة بخطوة وامتلك المادة.",
    ariaLabel: "المرحلة 4: الشرح التفاعلي والموقع",
  },
  {
    tag: "المرحلة 5 من 5 · مكتب مذاكرتك اكتمل",
    title: "هنا هتلاقي كل حاجة... ادخل الامتحان وإنت ضامنها!",
    sub: "كويزات فورية، بنك أخطاء ذكي، ومؤقت تركيز — مكتب مذاكرتك اكتمل 100% وجاهز تنطلق!",
    ariaLabel: "المرحلة 5: الكويزات واكتمال المكتب",
  },
] as const;

const STAGE_TARGETS = [0.0, 0.24, 0.42, 0.58, 0.76] as const;

const CHAOS_CONFIG = [
  {
    id: "chaos1",
    label: "📄 Lecture_final_v4_OLD.pdf",
    className:
      "chaos-chip absolute top-[12%] right-[14%] px-3.5 py-2 rounded-xl bg-[#2a1d24]/92 border border-[#e58a62]/55 text-[12px] font-bold text-[#fed7aa] shadow-xl",
    rx: 9,
    dx: -160,
    dy: 90,
  },
  {
    id: "chaos2",
    label: "▶ رابط يوتيوب ناقص (جزء 3)",
    className:
      "chaos-chip absolute top-[18%] left-[14%] px-3.5 py-2 rounded-xl bg-[#2a1d24]/92 border border-rose-400/50 text-[12px] font-bold text-rose-200 shadow-xl",
    rx: -10,
    dx: 160,
    dy: 80,
  },
  {
    id: "chaos3",
    label: "🖼 IMG_code_blurry.jpg",
    className:
      "chaos-chip absolute bottom-[18%] right-[16%] px-3.5 py-2 rounded-xl bg-[#1e2638]/92 border border-amber-400/45 text-[12px] font-bold text-amber-200 shadow-xl",
    rx: -7,
    dx: -150,
    dy: -80,
  },
  {
    id: "chaos4",
    label: "💬 رسالة تليجرام ضايعة...",
    className:
      "chaos-chip absolute bottom-[14%] left-[16%] px-3.5 py-2 rounded-xl bg-[#1e2638]/92 border border-slate-400/40 text-[12px] font-bold text-slate-200 shadow-xl",
    rx: 11,
    dx: 150,
    dy: -75,
  },
] as const;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function InteractiveDeskHero() {
  const portal = usePortalState();
  const lastVisited = portal.lastVisited;

  // Desktop scroll-assembled 3D desk cinema state & refs
  const [stageIdx, setStageIdx] = useState(0);
  const stageIdxRef = useRef(0);

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

  const applyScrollyProgress = useCallback((rawP: number) => {
    const p = clamp01(rawP);
    const a = clamp01(p / 0.72);
    const exitT = clamp01((p - 0.88) / 0.12);

    const pct = Math.round(a * 100);
    if (pctLabelRef.current) {
      pctLabelRef.current.textContent = `${pct}%`;
    }

    const nextStageIdx =
      a < 0.16 ? 0 : a < 0.4 ? 1 : a < 0.64 ? 2 : a < 0.86 ? 3 : 4;
    if (nextStageIdx !== stageIdxRef.current) {
      stageIdxRef.current = nextStageIdx;
      setStageIdx(nextStageIdx);
    }

    const deskWrap = deskWrapRef.current;
    if (deskWrap) {
      const sc = 0.9 + a * 0.14 - exitT * 0.05;
      const ty = (1 - a) * 14 - exitT * 18;
      deskWrap.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
      deskWrap.style.opacity = String(1 - exitT * 0.25);
    }

    const chaosFade = clamp01((a - 0.03) / 0.22);
    CHAOS_CONFIG.forEach((item, idx) => {
      const el = chaosRefs.current[idx];
      if (!el) return;
      el.style.opacity = String(1 - chaosFade);
      el.style.transform = `translate(${(item.dx * chaosFade).toFixed(1)}px, ${(item.dy * chaosFade).toFixed(1)}px) rotate(${(item.rx * (1 - chaosFade)).toFixed(1)}deg) scale(${(1 - chaosFade * 0.35).toFixed(3)})`;
    });

    const op1 = clamp01((a - 0.16) / 0.16);
    const op2 = clamp01((a - 0.4) / 0.16);
    const op3 = clamp01((a - 0.66) / 0.18);

    const f0 = frameRefs.current[0];
    const f1 = frameRefs.current[1];
    const f2 = frameRefs.current[2];
    const f3 = frameRefs.current[3];

    if (f0) f0.style.opacity = "1";
    if (f1) f1.style.opacity = String(op1);
    if (f2) f2.style.opacity = String(op2);
    if (f3) f3.style.opacity = String(op3);

    const exitScale = 1 - exitT * 0.45;
    const safeDenom = Math.max(0.01, exitScale);

    const pops = [
      { val: clamp01((a - 0.2) / 0.14) * exitScale, dir: 30 },
      { val: clamp01((a - 0.44) / 0.14) * exitScale, dir: -30 },
      { val: clamp01((a - 0.66) / 0.14) * exitScale, dir: 30 },
      { val: clamp01((a - 0.82) / 0.14) * exitScale, dir: -30 },
    ];

    pops.forEach((pop, idx) => {
      const el = featPopRefs.current[idx];
      if (!el) return;
      el.style.opacity = String(pop.val);
      const tx = (1 - Math.min(1, pop.val / safeDenom)) * pop.dir;
      el.style.transform = `translateX(${tx.toFixed(1)}px) scale(${(0.92 + pop.val * 0.08).toFixed(3)})`;
    });
  }, []);

  useEffect(() => {
    let scrollyRaf: number | null = null;

    const computeScrollProgress = () => {
      const track = trackRef.current;
      if (!track || track.offsetHeight === 0) return;
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        applyScrollyProgress(0);
        return;
      }
      const p = clamp01(-rect.top / scrollable);
      applyScrollyProgress(p);
    };

    const onScroll = () => {
      if (!trackRef.current) return;
      if (scrollyRaf !== null) return;
      scrollyRaf = requestAnimationFrame(() => {
        scrollyRaf = null;
        computeScrollProgress();
      });
    };

    computeScrollProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (scrollyRaf !== null) cancelAnimationFrame(scrollyRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [applyScrollyProgress]);

  const handleStageSelect = (idx: number) => {
    const targetP = STAGE_TARGETS[idx] ?? 0;
    const track = trackRef.current;
    if (typeof window !== "undefined" && track) {
      const topAbs = track.getBoundingClientRect().top + window.scrollY;
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable > 0) {
        const destY = topAbs + targetP * scrollable;
        if (window.__lenis) {
          window.__lenis.scrollTo(destY, { duration: 1.05 });
        } else {
          window.scrollTo({ top: destY, behavior: "smooth" });
        }
        return;
      }
    }
    applyScrollyProgress(targetP);
  };

  const currentCopy = STAGE_COPY[stageIdx] ?? STAGE_COPY[0];

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

      {/* ==================== DESKTOP HERO (>= lg): ORIGINAL SCROLL-ASSEMBLED 3D DESK CINEMA ==================== */}
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

          {/* Top Minimal Header Overlay (Padded safely below Fixed Topbar) */}
          <div className="relative z-20 max-w-[1220px] w-full mx-auto px-6 pt-[68px] flex flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md">
                <div className="relative w-6 h-6 rounded-full overflow-hidden ring-[1.5px] ring-[#e58a62] shrink-0">
                  <Image
                    src="/images/founder.jpg"
                    alt="ENG. AHMED AMIR"
                    fill
                    sizes="24px"
                    className="object-cover object-[50%_15%]"
                    priority
                  />
                </div>
                <BrandName inverted size="sm" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11.5px] font-bold text-[#f0a786]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <ShinyText id-tag="cinemaStageTag">
                  <span id="cinemaStageTag">{currentCopy.tag}</span>
                </ShinyText>
              </div>
            </div>

            <h1
              id="cinemaHeadline"
              className="text-3xl xl:text-4xl font-black tracking-tight leading-snug transition-all"
            >
              <BlurText
                key={currentCopy.title}
                text={currentCopy.title}
                stagger={0.035}
                duration={0.5}
              />
            </h1>
            <p
              id="cinemaSubline"
              className="text-[14.5px] text-slate-300 mt-1.5 max-w-2xl leading-relaxed"
            >
              {currentCopy.sub}
            </p>
          </div>

          {/* CENTER FULL-SCREEN 3D STAGE */}
          <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-4 flex items-center justify-center my-1 min-h-0">
            {/* CHAOS LAYER (Morphs inward & dissolves as Stage 1 begins) */}
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
                  style={{ transform: `rotate(${chip.rx}deg)` }}
                >
                  {chip.label}
                </div>
              ))}
            </div>

            {/* FLOATING FEATURE POP-UP CARDS */}
            <div
              id="featPop1"
              ref={(el) => {
                featPopRefs.current[0] = el;
              }}
              className="feature-pop-card absolute top-[14%] right-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#e58a62]/45 backdrop-blur-md shadow-2xl"
              style={{ opacity: 0, transform: "translateX(30px) scale(0.92)" }}
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
              className="feature-pop-card absolute top-[18%] left-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#7ca7f0]/45 backdrop-blur-md shadow-2xl"
              style={{ opacity: 0, transform: "translateX(-30px) scale(0.92)" }}
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
              className="feature-pop-card absolute bottom-[14%] right-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#66c7a6]/50 backdrop-blur-md shadow-2xl"
              style={{ opacity: 0, transform: "translateX(30px) scale(0.92)" }}
            >
              <div className="flex items-center gap-2 text-[#66c7a6] text-[11px] font-extrabold mb-1">
                <Globe className="w-4 h-4" />
                <span>03 · الشبكة المضيئة</span>
              </div>
              <div className="text-[14px] font-extrabold text-white">
                شرح تفاعلي + موقع للمادة
              </div>
              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                طبّق الفكرة عملياً خطوة بخطوة مع تغبيش للحفظ داخل كل شابتر.
              </p>
            </div>

            <div
              id="featPop4"
              ref={(el) => {
                featPopRefs.current[3] = el;
              }}
              className="feature-pop-card absolute bottom-[12%] left-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#e58a62]/55 backdrop-blur-md shadow-2xl"
              style={{ opacity: 0, transform: "translateX(-30px) scale(0.92)" }}
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
              className="desk-cinema-wrap relative w-[450px] h-[450px] xl:w-[490px] xl:h-[490px] flex items-center justify-center"
              style={{ transform: "translateY(14px) scale(0.9)" }}
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
                sizes="490px"
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
                sizes="490px"
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
                sizes="490px"
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
                sizes="490px"
                className="frame-3d"
                style={{ opacity: 0 }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Stage Progress Dots & Percentage */}
          <div className="relative z-20 max-w-2xl w-full mx-auto px-4 pb-5 flex items-center justify-center">
            <div className="flex items-center gap-1 px-3.5 py-1 rounded-full bg-white/[0.07] border border-white/12">
              {STAGE_COPY.map((stage, idx) => (
                <button
                  key={stage.ariaLabel}
                  type="button"
                  onClick={() => handleStageSelect(idx)}
                  className="stage-step-btn min-h-[36px] px-1 flex items-center justify-center cursor-pointer"
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
          </div>
        </div>
      </div>
    </section>
  );
}
