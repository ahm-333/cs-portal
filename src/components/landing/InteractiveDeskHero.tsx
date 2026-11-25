"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  BookOpen,
  CheckSquare,
  Cpu,
  FileCode2,
  Layers,
  PlayCircle,
} from "lucide-react";
import { usePortalState } from "@/lib/stores/portalStore";

type PillarId = "video" | "interactive" | "summary" | "quiz";

interface PillarLink {
  id: PillarId;
  num: string;
  label: string;
  shortLabel: string;
  sub: string;
  accent: string;
  softBg: string;
}

const CHAPTER_PILLARS: readonly PillarLink[] = [
  {
    id: "video",
    num: "01",
    label: "فيديو شرح",
    shortLabel: "فيديو",
    sub: "فصول زمنية واضحة",
    accent: "#f0a786",
    softBg: "rgba(229, 138, 98, 0.14)",
  },
  {
    id: "interactive",
    num: "02",
    label: "شرح تفاعلي",
    shortLabel: "تفاعلي",
    sub: "طبّق الفكرة بإيدك",
    accent: "#66c7a6",
    softBg: "rgba(102, 199, 166, 0.14)",
  },
  {
    id: "summary",
    num: "03",
    label: "ملخص منظم",
    shortLabel: "ملخص",
    sub: "منسّق لليلة الامتحان",
    accent: "#7ca7f0",
    softBg: "rgba(124, 167, 240, 0.14)",
  },
  {
    id: "quiz",
    num: "04",
    label: "كويزات وأسئلة",
    shortLabel: "كويز",
    sub: "تصحيح وشرح فوري",
    accent: "#f5b899",
    softBg: "rgba(240, 167, 134, 0.14)",
  },
] as const;

function PillarIcon({ id, className }: { id: PillarId; className?: string }) {
  switch (id) {
    case "video":
      return <PlayCircle className={className} />;
    case "interactive":
      return <Cpu className={className} />;
    case "summary":
      return <FileCode2 className={className} />;
    case "quiz":
      return <CheckSquare className={className} />;
  }
}

export function InteractiveDeskHero() {
  const portal = usePortalState();

  const stageRef = useRef<HTMLDivElement | null>(null);
  const deskTiltRef = useRef<HTMLDivElement | null>(null);
  const canParallaxRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateCapability = () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      canParallaxRef.current = !reducedMotion && !noHover;
    };
    updateCapability();
    window.addEventListener("resize", updateCapability, { passive: true });
    return () => window.removeEventListener("resize", updateCapability);
  }, []);

  const handleStageMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!canParallaxRef.current) return;
      const stage = stageRef.current;
      const tiltEl = deskTiltRef.current;
      if (!stage || !tiltEl) return;

      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const py = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;

      const rotateY = px * 6;
      const rotateX = -py * 6;
      const tx = px * 6;
      const ty = py * 5;

      tiltEl.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
    },
    []
  );

  const handleStageMouseLeave = useCallback(() => {
    const tiltEl = deskTiltRef.current;
    if (!tiltEl) return;
    tiltEl.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0)";
  }, []);

  const handleJumpToPillar = useCallback((id: PillarId) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent<PillarId>("cs-portal-select-preview-tab", {
        detail: id,
      })
    );
    const target = document.getElementById("chapter-preview");
    if (!target) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -64, duration: 1.0 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const lastVisited = portal.lastVisited;

  return (
    <>
      <section
        id="top"
        className="relative w-full overflow-x-clip text-white border-b border-white/[0.08] lg:min-h-[100svh] flex flex-col justify-between"
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

        {/* ==================== MOBILE & TABLET HERO (< lg): BALANCED, CALM, SINGLE-SCREEN ==================== */}
        <div className="lg:hidden relative z-10 w-full max-w-[400px] mx-auto px-4 pt-[72px] pb-6 flex flex-col items-center gap-4">
          {/* 1. Seamless 3D Desk Visual (Radial mask melts edges 100% cleanly) */}
          <div className="relative w-[240px] h-[185px] sm:w-[280px] sm:h-[215px] flex items-center justify-center select-none pointer-events-none">
            <div
              className="relative w-full h-full scale-[1.12]"
              style={{
                maskImage:
                  "radial-gradient(closest-side, #000 64%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(closest-side, #000 64%, transparent 100%)",
              }}
            >
              <Image
                src="/images/desk/frame-3.jpg"
                alt="مكتب المذاكرة المنظم"
                width={900}
                height={900}
                sizes="(max-width: 640px) 240px, 280px"
                className="frame-3d object-contain"
                priority
                draggable={false}
              />
            </div>
          </div>

          {/* 2. Balanced 2-Line Headline + Crisp 1-Line Subtitle (Zero Orphan Words) */}
          <div className="text-center space-y-2">
            <span
              dir="ltr"
              className="font-mono-code inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-semibold tracking-wide text-slate-300"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#66c7a6] shrink-0"
                aria-hidden="true"
              />
              AI · Zagazig University
            </span>

            <h1 className="text-[21px] sm:text-[28px] font-black tracking-tight leading-[1.35] text-white text-balance">
              بدل تشتيت الملفات..
              <span className="block mt-0.5 bg-gradient-to-l from-[#f0a786] via-[#f6c4a8] to-[#66c7a6] bg-clip-text text-transparent">
                كل حاجة تخص المادة في مكان واحد
              </span>
            </h1>

            <p className="text-[12.5px] sm:text-[13.5px] text-slate-300/80 leading-relaxed text-balance">
              فيديو، شرح تفاعلي، ملخص منظم، وكويزات لكل فصل.
            </p>
          </div>

          {/* 3. One Calm Focal Action + Quiet Secondary Link */}
          <div className="w-full flex flex-col items-center gap-2 pt-1">
            {lastVisited ? (
              <>
                <Link
                  href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                  title={lastVisited.lessonTitle}
                  className="cta-shimmer h-11 px-6 rounded-full text-[13.5px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold text-slate-300/90 hover:text-white transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#66c7a6] shrink-0" />
                  <span>تصفح كل المقررات</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/courses"
                  className="cta-shimmer h-11 px-7 rounded-full text-[13.5px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
                  style={{ background: "#c25e33" }}
                >
                  <span>ابدأ المذاكرة الآن</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </Link>
                <a
                  href="#courses-picker"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold text-slate-300/90 hover:text-white transition-colors"
                >
                  <span>تصفح المقررات</span>
                  <ArrowDown className="w-3.5 h-3.5 text-[#66c7a6] shrink-0" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* ==================== DESKTOP HERO (>= lg): PRESERVED 2-COLUMN SPLIT ==================== */}
        <div className="hidden lg:flex lg:flex-col lg:justify-between lg:flex-1 pt-20 pb-8">
          <div className="relative z-10 flex-1 flex items-center w-full max-w-[1200px] mx-auto px-8 py-2">
            <div className="w-full grid grid-cols-12 items-center gap-8">
              {/* Right Column (RTL Start): Clean Editorial Copy + Immediate CTAs */}
              <div className="col-span-6 text-right space-y-5">
                <div className="flex flex-wrap items-center justify-start gap-2">
                  <span
                    dir="ltr"
                    className="font-mono-code inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 text-[11px] font-bold tracking-wide text-slate-200 backdrop-blur-md"
                  >
                    <span
                      className="w-2 h-2 rounded-full bg-[#66c7a6] shrink-0"
                      aria-hidden="true"
                    />
                    AI · Zagazig University
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c25e33]/20 border border-[#e58a62]/40 text-[11.5px] font-extrabold text-[#f5b899]">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span>4 أركان لكل فصل</span>
                  </span>
                </div>

                <h1 className="text-[38px] xl:text-[44px] font-black tracking-tight leading-[1.25] text-white">
                  بدل تشتيت الملفات..
                  <span className="block mt-1 bg-gradient-to-l from-[#f0a786] via-[#f6c4a8] to-[#66c7a6] bg-clip-text text-transparent">
                    كل حاجة تخص المادة في مكان واحد
                  </span>
                </h1>

                <p className="text-[15.5px] text-slate-300 leading-relaxed max-w-lg">
                  انسى تشتيت جروبات تليجرام وروابط درايف المقفولة — كل فصل
                  متجهّزلك من الألف للياء في مساحة مذاكرة واحدة هادية ومنظمة.
                </p>

                <div className="flex flex-wrap items-center justify-start gap-3 pt-1">
                  {lastVisited ? (
                    <>
                      <Link
                        href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                        title={lastVisited.lessonTitle}
                        className="cta-shimmer h-12 px-6 rounded-xl text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                        style={{ background: "#c25e33" }}
                      >
                        <span>
                          أكمل:{" "}
                          <span dir="ltr" className="font-mono-code font-bold">
                            {lastVisited.courseCode}
                          </span>
                        </span>
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                      </Link>
                      <Link
                        href="/courses"
                        className="h-12 px-5 rounded-xl text-[14px] font-bold text-slate-100 bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md inline-flex items-center justify-center gap-2 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-[#66c7a6] shrink-0" />
                        <span>مكتبة المقررات</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/courses"
                        className="cta-shimmer h-12 px-6 rounded-xl text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                        style={{ background: "#c25e33" }}
                      >
                        <span>ابدأ المذاكرة الآن</span>
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                      </Link>
                      <a
                        href="#courses-picker"
                        className="h-12 px-5 rounded-xl text-[14px] font-bold text-slate-100 bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md inline-flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>تصفح المقررات</span>
                        <ArrowDown className="w-4 h-4 text-[#66c7a6] shrink-0" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Left Column (RTL End): Pure Sculptural 3D Desk */}
              <div className="col-span-6 flex items-center justify-center">
                <div
                  ref={stageRef}
                  onMouseMove={handleStageMouseMove}
                  onMouseLeave={handleStageMouseLeave}
                  className="relative w-full max-w-[475px] xl:max-w-[510px] aspect-square flex items-center justify-center select-none -translate-x-2"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-4 rounded-full blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(102, 199, 166, 0.22) 0%, rgba(194, 94, 51, 0.14) 50%, transparent 72%)",
                    }}
                  />
                  <div
                    ref={deskTiltRef}
                    className="relative w-full h-full transition-transform duration-200 ease-out will-change-transform"
                  >
                    <div className="relative w-full h-full scale-[1.2]">
                      <Image
                        src="/images/desk/frame-3.jpg"
                        alt="مكتب المذاكرة المنظم"
                        width={900}
                        height={900}
                        sizes="(max-width: 1280px) 475px, 510px"
                        className="frame-3d"
                        priority
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Bottom 4-Pillar Row (Desktop Only — Clean & Borderless) */}
          <div className="relative z-10 w-full max-w-[1200px] mx-auto px-8 pt-2">
            <div className="grid grid-cols-4 gap-4">
              {CHAPTER_PILLARS.map((pillar) => (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => handleJumpToPillar(pillar.id)}
                  className="group relative text-right px-3 py-2.5 rounded-2xl hover:bg-white/[0.05] transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{
                      backgroundColor: pillar.softBg,
                      color: pillar.accent,
                    }}
                  >
                    <PillarIcon id={pillar.id} className="w-4 h-4" />
                  </span>

                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span
                        dir="ltr"
                        className="font-mono-code text-[10px] font-bold opacity-80 shrink-0"
                        style={{ color: pillar.accent }}
                      >
                        {pillar.num}
                      </span>
                      <span className="text-[13px] font-extrabold text-white group-hover:text-[#f5b899] transition-colors truncate">
                        {pillar.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {pillar.sub}
                    </div>
                  </div>

                  <ArrowDown
                    className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-y-0.5 group-hover:opacity-75 group-hover:translate-y-0.5 transition-all"
                    style={{ color: pillar.accent }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
