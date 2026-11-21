"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckSquare,
  ChevronDown,
  FileText,
  Globe,
  PlayCircle,
  Sparkles,
} from "lucide-react";

interface StageCopyItem {
  tag: string;
  title: string;
  sub: string;
  mob: string;
  ariaLabel: string;
  cardCode: string;
  cardTitle: string;
  cardDesc: string;
  cardAccent: string;
  cardBorder: string;
  cardIconBg: string;
  iconKey: "sparkles" | "video" | "summary" | "site" | "quiz";
}

const STAGE_COPY: readonly StageCopyItem[] = [
  {
    tag: "المرحلة 1 من 5 · الفوضى قبل المنصة",
    title: "بدل فوضى الملفات والروابط المبعثرة...",
    sub: "اسكرول بهدوء وشوف إزاي بوابة حاسبات بتبني مكتب مذاكرتك 3D قطعة قطعة.",
    mob: "1/5 · فوضى ملفات وروابط متفرقة",
    ariaLabel: "المرحلة 1: الفوضى",
    cardCode: "00 · البداية",
    cardTitle: "وداعاً لفوضى الملفات المتفرقة",
    cardDesc: "ملفات PDF، جروبات تليجرام، وروابط يوتيوب مبعثرة بتتجمع في مكتب واحد.",
    cardAccent: "#f0a786",
    cardBorder: "rgba(229, 138, 98, 0.45)",
    cardIconBg: "rgba(229, 138, 98, 0.16)",
    iconKey: "sparkles",
  },
  {
    tag: "المرحلة 2 من 5 · ظهور اللابتوب",
    title: "فيديوهات شرح مرتبة في مكان واحد",
    sub: "الفوضى بتتلمّ، ويظهر اللابتوب بشرح منظم لكل درس بدون تشتيت.",
    mob: "2/5 · اللابتوب: فيديوهات شرح مرتبة",
    ariaLabel: "المرحلة 2: فيديوهات الشرح",
    cardCode: "01 · اللابتوب نزل",
    cardTitle: "فيديوهات شرح مرتبة بفصول زمنية",
    cardDesc: "كل درس بفيديو واضح ومقسّم لشابترز عشان توصل للنقطة اللي محتاجها فوراً.",
    cardAccent: "#f0a786",
    cardBorder: "rgba(229, 138, 98, 0.52)",
    cardIconBg: "rgba(229, 138, 98, 0.18)",
    iconKey: "video",
  },
  {
    tag: "المرحلة 3 من 5 · ظهور التابلت",
    title: "ملخصات منظمة وأكواد واضحة للعين",
    sub: "ينضم التابلت للمكتب عشان تراجع الملخصات والأكواد والمعادلات جنب الفيديو.",
    mob: "3/5 · التابلت: ملخصات منظمة وأكواد",
    ariaLabel: "المرحلة 3: الملخصات",
    cardCode: "02 · التابلت نزل",
    cardTitle: "ملخصات هندسية وأكواد LTR واضحة",
    cardDesc: "ملخص منسّق وأكواد C++/Python من اليسار لليمين ومعادلات جاهزة للمراجعة.",
    cardAccent: "#9dc0f7",
    cardBorder: "rgba(124, 167, 240, 0.52)",
    cardIconBg: "rgba(124, 167, 240, 0.18)",
    iconKey: "summary",
  },
  {
    tag: "المرحلة 4 من 5 · الشبكة المضيئة",
    title: "شرح تفاعلي وموقع خاص لكل مادة",
    sub: "تشتغل طبقة الشرح التفاعلي عشان تفهم وتطبّق الخوارزميات خطوة بخطوة.",
    mob: "4/5 · شرح تفاعلي + موقع خاص للمادة",
    ariaLabel: "المرحلة 4: الشرح التفاعلي والموقع",
    cardCode: "03 · الشبكة المضيئة",
    cardTitle: "معمل تفاعلي حي + موقع لكل مادة",
    cardDesc: "طبّق الخوارزميات وهياكل البيانات عملياً خطوة بخطوة داخل المتصفح.",
    cardAccent: "#66c7a6",
    cardBorder: "rgba(102, 199, 166, 0.52)",
    cardIconBg: "rgba(102, 199, 166, 0.18)",
    iconKey: "site",
  },
  {
    tag: "المرحلة 5 من 5 · مكتب مذاكرتك اكتمل",
    title: "كويزات تثبيت وتركيز تام حتى الامتحان",
    sub: "القهوة والسماعة جاهزين، وكل كويز بيشرحلك الإجابة ويحفظ تقدمك تلقائياً.",
    mob: "5/5 · كويزات تثبيت واكتمال المكتب 100%",
    ariaLabel: "المرحلة 5: الكويزات واكتمال المكتب",
    cardCode: "04 · المكتب اكتمل 100%",
    cardTitle: "كويزات تثبيت وبنك أخطاء ذكي",
    cardDesc: "اختبر فهمك بشرح فوري لكل إجابة مع مؤقت بومودورو وحفظ تلقائي لتقدمك.",
    cardAccent: "#f0a786",
    cardBorder: "rgba(229, 138, 98, 0.58)",
    cardIconBg: "rgba(229, 138, 98, 0.2)",
    iconKey: "quiz",
  },
];

const STAGE_TARGETS = [0.0, 0.24, 0.42, 0.58, 0.76] as const;

const CHAOS_CONFIG = [
  {
    id: "chaos1",
    label: "📄 Lecture_final_v4_OLD.pdf",
    className:
      "chaos-chip absolute top-[3%] right-[2.5%] sm:top-[12%] sm:right-[14%] px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#2a1d24]/92 border border-[#e58a62]/55 text-[10.5px] sm:text-[12px] font-bold text-[#fed7aa] shadow-xl max-w-[162px] sm:max-w-none truncate",
    rx: 9,
    dx: -160,
    dy: 90,
    mobDx: -70,
    mobDy: 45,
  },
  {
    id: "chaos2",
    label: "▶ رابط يوتيوب ناقص (جزء 3)",
    className:
      "chaos-chip absolute top-[7%] left-[2.5%] sm:top-[18%] sm:left-[14%] px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#2a1d24]/92 border border-rose-400/50 text-[10.5px] sm:text-[12px] font-bold text-rose-200 shadow-xl max-w-[162px] sm:max-w-none truncate",
    rx: -10,
    dx: 160,
    dy: 80,
    mobDx: 70,
    mobDy: 42,
  },
  {
    id: "chaos3",
    label: "🖼 IMG_code_blurry.jpg",
    className:
      "chaos-chip absolute bottom-[7%] right-[2.5%] sm:bottom-[18%] sm:right-[16%] px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#1e2638]/92 border border-amber-400/45 text-[10.5px] sm:text-[12px] font-bold text-amber-200 shadow-xl max-w-[162px] sm:max-w-none truncate",
    rx: -7,
    dx: -150,
    dy: -80,
    mobDx: -68,
    mobDy: -42,
  },
  {
    id: "chaos4",
    label: "💬 رسالة تليجرام ضايعة...",
    className:
      "chaos-chip absolute bottom-[3%] left-[2.5%] sm:bottom-[14%] sm:left-[16%] px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#1e2638]/92 border border-slate-400/40 text-[10.5px] sm:text-[12px] font-bold text-slate-200 shadow-xl max-w-[162px] sm:max-w-none truncate",
    rx: 11,
    dx: 150,
    dy: -75,
    mobDx: 68,
    mobDy: -40,
  },
] as const;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function StageIcon({
  iconKey,
  className,
}: {
  iconKey: StageCopyItem["iconKey"];
  className?: string;
}) {
  switch (iconKey) {
    case "video":
      return <PlayCircle className={className} />;
    case "summary":
      return <FileText className={className} />;
    case "site":
      return <Globe className={className} />;
    case "quiz":
      return <CheckSquare className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function DeskScrollytellingCinema() {
  const [stageIdx, setStageIdx] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const stageIdxRef = useRef(0);
  const hasScrolledRef = useRef(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const deskWrapRef = useRef<HTMLDivElement | null>(null);
  const pctLabelRef = useRef<HTMLSpanElement | null>(null);

  const frameRefs = useRef<(HTMLImageElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const chaosRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const featPopRefs = useRef<(HTMLDivElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const applyScrollyProgress = useCallback((rawP: number) => {
    const p = clamp01(rawP);
    // Map assembly smoothly into 0..0.72, leaving 0.72..1.00 as a calm full-desk hold & graceful exit
    const a = clamp01(p / 0.72);
    const exitT = clamp01((p - 0.88) / 0.12);

    const pct = Math.round(a * 100);
    if (pctLabelRef.current) {
      pctLabelRef.current.textContent = `${pct}%`;
    }

    const scrolledNow = p > 0.02;
    if (scrolledNow !== hasScrolledRef.current) {
      hasScrolledRef.current = scrolledNow;
      setHasScrolled(scrolledNow);
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
    const isSmallPhone =
      typeof window !== "undefined" && window.innerWidth < 640;

    CHAOS_CONFIG.forEach((item, idx) => {
      const el = chaosRefs.current[idx];
      if (!el) return;
      const targetDx = isSmallPhone ? item.mobDx : item.dx;
      const targetDy = isSmallPhone ? item.mobDy : item.dy;
      el.style.opacity = String(1 - chaosFade);
      el.style.transform = `translate(${(targetDx * chaosFade).toFixed(1)}px, ${(targetDy * chaosFade).toFixed(1)}px) rotate(${(item.rx * (1 - chaosFade)).toFixed(1)}deg) scale(${(1 - chaosFade * 0.35).toFixed(3)})`;
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
      {
        val: clamp01((a - 0.2) / 0.14) * exitScale,
        dir: 30,
      },
      {
        val: clamp01((a - 0.44) / 0.14) * exitScale,
        dir: -30,
      },
      {
        val: clamp01((a - 0.66) / 0.14) * exitScale,
        dir: 30,
      },
      {
        val: clamp01((a - 0.82) / 0.14) * exitScale,
        dir: -30,
      },
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
      if (!track) return;
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
        window.scrollTo({
          top: topAbs + targetP * scrollable,
          behavior: "smooth",
        });
        return;
      }
    }
    applyScrollyProgress(targetP);
  };

  const currentCopy = STAGE_COPY[stageIdx] ?? STAGE_COPY[0];
  const showScrollCue = stageIdx === 0 && !hasScrolled;

  return (
    <section id="desk-assembly" className="w-full">
      <div id="scrollyTrack" ref={trackRef} className="scrolly-track">
        <div className="scrolly-sticky text-white border-b border-white/10">
          {/* Ambient Cinema Glows */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[560px] sm:h-[560px] rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #66c7a6 0%, #c25e33 55%, transparent 72%)",
            }}
            aria-hidden="true"
          />

          {/* Top Minimal Header Overlay + Skip Cinema Ghost Button */}
          <div className="relative z-20 max-w-[1220px] w-full mx-auto px-3.5 sm:px-6 pt-2.5 sm:pt-4 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between sm:justify-center relative mb-1.5 sm:mb-2">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-[11.5px] font-bold text-[#f0a786]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span id="cinemaStageTag">{currentCopy.tag}</span>
              </div>

              <a
                id="skipCinemaBtn"
                href="#interactive-showcase"
                className="sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-[11px] font-bold text-slate-300 hover:text-white transition-colors"
                aria-label="تخطي العرض والانتقال إلى أدوات المادة"
              >
                <span>تخطي ↓</span>
              </a>
            </div>

            <h1
              id="cinemaHeadline"
              className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug transition-all"
            >
              {currentCopy.title}
            </h1>
            <p
              id="cinemaSubline"
              className="text-[12px] sm:text-[15px] text-slate-300 mt-1 sm:mt-1.5 max-w-2xl leading-relaxed"
            >
              {currentCopy.sub}
            </p>
          </div>

          {/* CENTER FULL-SCREEN 3D STAGE */}
          <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-3 sm:px-4 flex items-center justify-center my-0.5 sm:my-2 min-h-0">
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

            {/* FLOATING FEATURE POP-UP CARDS (Desktop >= 1024px) */}
            <div
              id="featPop1"
              ref={(el) => {
                featPopRefs.current[0] = el;
              }}
              className="feature-pop-card hidden lg:block absolute top-[14%] right-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#e58a62]/45 backdrop-blur-md shadow-2xl"
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
              className="feature-pop-card hidden lg:block absolute top-[18%] left-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#7ca7f0]/45 backdrop-blur-md shadow-2xl"
              style={{ opacity: 0, transform: "translateX(-30px) scale(0.92)" }}
            >
              <div className="flex items-center gap-2 text-[#9dc0f7] text-[11px] font-extrabold mb-1">
                <FileText className="w-4 h-4" />
                <span>02 · التابلت نزل</span>
              </div>
              <div className="text-[14px] font-extrabold text-white">
                ملخصات منظمة وأكواد
              </div>
              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                ملخص هندسي منسّق وأكواد LTR واضحة ومعادلات جاهزة للمراجعة.
              </p>
            </div>

            <div
              id="featPop3"
              ref={(el) => {
                featPopRefs.current[2] = el;
              }}
              className="feature-pop-card hidden lg:block absolute bottom-[14%] right-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#66c7a6]/50 backdrop-blur-md shadow-2xl"
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
                طبّق الفكرة عملياً خطوة بخطوة داخل موقع تفاعلي خاص بكل مادة.
              </p>
            </div>

            <div
              id="featPop4"
              ref={(el) => {
                featPopRefs.current[3] = el;
              }}
              className="feature-pop-card hidden lg:block absolute bottom-[12%] left-8 z-30 w-64 p-4 rounded-2xl bg-[#0e1726]/88 border border-[#e58a62]/55 backdrop-blur-md shadow-2xl"
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
                اختبر فهمك بشرح فوري لكل إجابة مع مؤقت بومودورو وحفظ تلقائي.
              </p>
            </div>

            {/* PIXEL-LOCKED 4-FRAME 3D STUDIO DESK STACK */}
            <div
              id="deskCinemaWrap"
              ref={deskWrapRef}
              className="desk-cinema-wrap relative w-[250px] h-[250px] sm:w-[360px] sm:h-[360px] lg:w-[490px] lg:h-[490px] flex items-center justify-center"
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
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 360px, 490px"
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
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 360px, 490px"
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
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 360px, 490px"
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
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 360px, 490px"
                className="frame-3d"
                style={{ opacity: 0 }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Dynamic Mobile/Tablet Glass Feature Stage Card + Dots + CTA */}
          <div className="relative z-20 max-w-2xl w-full mx-auto px-3.5 sm:px-4 pb-3 sm:pb-5 flex flex-col items-center gap-2">
            {/* Gentle Stage-0 Scroll Cue */}
            <div
              id="cinemaScrollCue"
              className={`anim-scroll-cue inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.07] border border-white/15 text-[11px] font-bold text-[#f0a786] transition-all duration-300 ${
                showScrollCue
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1 pointer-events-none h-0 py-0 overflow-hidden border-0"
              }`}
              aria-hidden={!showScrollCue}
            >
              <span>اسكرول لبناء مكتبك ↓</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {/* Dynamic Glass Feature Stage Card for Phones & Tablets (< 1024px) */}
            <div
              id="mobileCinemaPill"
              className="lg:hidden w-full max-w-md px-3.5 py-2.5 rounded-2xl bg-[#0e1726]/88 backdrop-blur-md shadow-2xl transition-all duration-300"
              style={{
                border: `1px solid ${currentCopy.cardBorder}`,
              }}
            >
              <div className="flex items-start gap-3 text-right">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: currentCopy.cardIconBg,
                    color: currentCopy.cardAccent,
                  }}
                >
                  <StageIcon iconKey={currentCopy.iconKey} className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[10.5px] font-extrabold tracking-wide"
                      style={{ color: currentCopy.cardAccent }}
                    >
                      {currentCopy.cardCode}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {currentCopy.mob}
                    </span>
                  </div>
                  <div className="text-[13px] sm:text-[14px] font-extrabold text-white truncate mt-0.5">
                    {currentCopy.cardTitle}
                  </div>
                  <p className="text-[11px] sm:text-[11.5px] text-slate-300 line-clamp-1 mt-0.5">
                    {currentCopy.cardDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Touch-Friendly Stage Dots & Direct CTA */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.07] border border-white/12">
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
                      className={`cinema-dot ${
                        stageIdx === idx ? "active" : ""
                      }`}
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

              <Link
                id="cinemaQuickStartBtn"
                href="/courses"
                className="start-study-cta magnetic-btn cta-shimmer min-h-[36px] px-4 sm:px-5 py-2 rounded-full text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 shadow-lg"
                style={{ background: "#c25e33" }}
              >
                <span>ابدأ المذاكرة الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
