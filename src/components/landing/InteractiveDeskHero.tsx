"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowLeft,
  BookOpen,
  CheckSquare,
  Cpu,
  FileCode2,
  Layers,
  PlayCircle,
  Sparkles,
  Terminal,
} from "lucide-react";
import { usePortalState } from "@/lib/stores/portalStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type PillarId = "video" | "interactive" | "summary" | "quiz";

interface PillarLink {
  id: PillarId;
  index: number;
  num: string;
  label: string;
  sub: string;
  accent: string;
  softBg: string;
}

const CHAPTER_PILLARS: readonly PillarLink[] = [
  {
    id: "video",
    index: 0,
    num: "01",
    label: "فيديو شرح",
    sub: "فصول زمنية واضحة",
    accent: "#f0a786",
    softBg: "rgba(229, 138, 98, 0.14)",
  },
  {
    id: "interactive",
    index: 1,
    num: "02",
    label: "شرح تفاعلي",
    sub: "طبّق الفكرة بإيدك",
    accent: "#66c7a6",
    softBg: "rgba(102, 199, 166, 0.14)",
  },
  {
    id: "summary",
    index: 2,
    num: "03",
    label: "كشكول ملخص",
    sub: "منسّق لليلة الامتحان",
    accent: "#7ca7f0",
    softBg: "rgba(124, 167, 240, 0.14)",
  },
  {
    id: "quiz",
    index: 3,
    num: "04",
    label: "كويزات وأسئلة",
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

  const heroSectionRef = useRef<HTMLElement | null>(null);
  const deskLayerRef = useRef<HTMLDivElement | null>(null);
  const chipOneRef = useRef<HTMLDivElement | null>(null);
  const chipTwoRef = useRef<HTMLDivElement | null>(null);
  const chipThreeRef = useRef<HTMLDivElement | null>(null);
  const desktopCopyRef = useRef<HTMLDivElement | null>(null);

  // GSAP choreographed entrance + desktop ScrollTrigger scrub parallax + smooth quickTo mouse depth
  useEffect(() => {
    const section = heroSectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Choreographed entrance timeline (React 19 Strict-Mode safe via explicit fromTo)
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.05,
      });

      tl.fromTo(
        "[data-hero-eyebrow]",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, clearProps: "transform,opacity" }
      )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 108, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1, clearProps: "transform,opacity" },
          "-=0.45"
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, clearProps: "transform,opacity" },
          "-=0.55"
        )
        .fromTo(
          "[data-hero-desk]",
          { scale: 0.93, y: 20, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.9, clearProps: "opacity" },
          "-=0.7"
        )
        .fromTo(
          "[data-hero-chip]",
          { scale: 0.88, y: 16, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.68, stagger: 0.08, clearProps: "opacity" },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-dock-item]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, clearProps: "transform,opacity" },
          "-=0.5"
        );

      // 2. Desktop-only GSAP ScrollTrigger scrubbed depth exit
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (deskLayerRef.current) {
          gsap.to(deskLayerRef.current, {
            y: -52,
            scale: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
        }
        if (desktopCopyRef.current) {
          gsap.to(desktopCopyRef.current, {
            y: -34,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        }
        if (chipOneRef.current) {
          gsap.to(chipOneRef.current, {
            y: -95,
            x: 14,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }
        if (chipTwoRef.current) {
          gsap.to(chipTwoRef.current, {
            y: -125,
            x: -16,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.9,
            },
          });
        }
        if (chipThreeRef.current) {
          gsap.to(chipThreeRef.current, {
            y: -70,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.75,
            },
          });
        }
      });

      // 3. Desktop 3-layer spring mouse parallax (zero React re-renders)
      const supportsHover = !window.matchMedia("(hover: none)").matches;
      if (supportsHover && window.innerWidth >= 1024 && deskLayerRef.current) {
        const deskRotX = gsap.quickTo(deskLayerRef.current, "rotationX", {
          duration: 0.55,
          ease: "power3.out",
        });
        const deskRotY = gsap.quickTo(deskLayerRef.current, "rotationY", {
          duration: 0.55,
          ease: "power3.out",
        });
        const deskX = gsap.quickTo(deskLayerRef.current, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        const deskY = gsap.quickTo(deskLayerRef.current, "y", {
          duration: 0.6,
          ease: "power3.out",
        });

        const c1x = chipOneRef.current
          ? gsap.quickTo(chipOneRef.current, "x", { duration: 0.65, ease: "power3.out" })
          : null;
        const c1y = chipOneRef.current
          ? gsap.quickTo(chipOneRef.current, "y", { duration: 0.65, ease: "power3.out" })
          : null;
        const c2x = chipTwoRef.current
          ? gsap.quickTo(chipTwoRef.current, "x", { duration: 0.72, ease: "power3.out" })
          : null;
        const c2y = chipTwoRef.current
          ? gsap.quickTo(chipTwoRef.current, "y", { duration: 0.72, ease: "power3.out" })
          : null;
        const c3x = chipThreeRef.current
          ? gsap.quickTo(chipThreeRef.current, "x", { duration: 0.5, ease: "power3.out" })
          : null;
        const c3y = chipThreeRef.current
          ? gsap.quickTo(chipThreeRef.current, "y", { duration: 0.5, ease: "power3.out" })
          : null;

        let rafId = 0;
        const onMove = (event: MouseEvent) => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const rect = section.getBoundingClientRect();
            const relX = event.clientX - rect.left;
            const relY = event.clientY - rect.top;
            section.style.setProperty("--hx", `${relX}px`);
            section.style.setProperty("--hy", `${relY}px`);

            const nx = relX / Math.max(1, rect.width) - 0.5;
            const ny = relY / Math.max(1, rect.height) - 0.5;

            deskRotY(nx * 9);
            deskRotX(-ny * 8);
            deskX(nx * 14);
            deskY(ny * 10);

            c1x?.(nx * -22);
            c1y?.(ny * -18);
            c2x?.(nx * 26);
            c2y?.(ny * 20);
            c3x?.(nx * -15);
            c3y?.(ny * 14);
          });
        };

        const onLeave = () => {
          cancelAnimationFrame(rafId);
          deskRotX(0);
          deskRotY(0);
          deskX(0);
          deskY(0);
          c1x?.(0);
          c1y?.(0);
          c2x?.(0);
          c2y?.(0);
          c3x?.(0);
          c3y?.(0);
        };

        section.addEventListener("mousemove", onMove, { passive: true });
        section.addEventListener("mouseleave", onLeave);

        return () => {
          cancelAnimationFrame(rafId);
          section.removeEventListener("mousemove", onMove);
          section.removeEventListener("mouseleave", onLeave);
        };
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleJumpToPillar = useCallback((pillarIndex?: number) => {
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
      window.__lenis.scrollTo(target, { offset: -72, duration: 1.05 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const lastVisited = portal.lastVisited;

  return (
    <section
      id="top"
      ref={heroSectionRef}
      className="relative w-full overflow-x-clip text-white border-b border-white/[0.08] min-h-[100svh] flex flex-col justify-between"
      style={{
        background:
          "linear-gradient(175deg, #060c18 0%, #0f1d36 56%, #0a1426 100%)",
      }}
    >
      {/* Architectural Blueprint Coordinate Grid */}
      <div
        aria-hidden="true"
        className="hero-blueprint-mesh pointer-events-none absolute inset-0 opacity-90"
      />

      {/* Interactive Pointer Ambient Spotlight (GPU radial gradient following --hx / --hy) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(620px circle at var(--hx, 68%) var(--hy, 42%), rgba(102, 199, 166, 0.11), rgba(194, 94, 51, 0.05) 38%, transparent 72%)",
        }}
      />

      {/* Subtle Editorial Film Grain */}
      <div
        aria-hidden="true"
        className="editorial-grain pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay"
      />

      {/* Asymmetric Warm Terracotta & Mint Ambient Light Fields */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[6%] w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] rounded-full blur-3xl opacity-[0.2]"
        style={{
          background:
            "radial-gradient(circle, #c25e33 0%, rgba(194, 94, 51, 0.24) 45%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 left-[4%] w-[250px] h-[250px] sm:w-[460px] sm:h-[460px] rounded-full blur-3xl opacity-[0.17]"
        style={{
          background:
            "radial-gradient(circle, #66c7a6 0%, rgba(102, 199, 166, 0.2) 45%, transparent 72%)",
        }}
      />

      {/* ==================== MOBILE & TABLET HERO (< lg): FULL 100svh FOCAL STAGE ==================== */}
      <div className="lg:hidden relative z-10 flex-1 w-full max-w-[420px] mx-auto px-4 pt-20 pb-6 flex flex-col items-center justify-between">
        <div className="my-auto flex flex-col items-center gap-5 py-4">
          <div
            data-hero-desk
            className="relative w-[255px] h-[215px] sm:w-[295px] sm:h-[245px] flex items-center justify-center select-none pointer-events-none"
          >
            <div className="relative w-full h-full scale-[1.12]">
              <Image
                src="/images/desk/frame-3-nobg.png"
                alt="مكتب المذاكرة المنظم"
                width={900}
                height={900}
                sizes="(max-width: 640px) 255px, 295px"
                className="w-full h-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.48)]"
                priority
                draggable={false}
              />
            </div>
          </div>

          <div className="text-center space-y-2.5">
            <span
              data-hero-eyebrow
              dir="ltr"
              className="font-mono-code inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10.5px] font-semibold tracking-wide text-slate-300"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#66c7a6] animate-pulse shrink-0"
                aria-hidden="true"
              />
              AI · Zagazig University
            </span>

            <h1 className="text-[24px] sm:text-[30px] font-black tracking-tight leading-[1.34] text-white text-balance">
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  بدل تشتيت الملفات..
                </span>
              </span>
              <span className="block overflow-hidden mt-0.5">
                <span
                  data-hero-line
                  className="block bg-gradient-to-l from-[#f0a786] via-[#f6c4a8] to-[#66c7a6] bg-clip-text text-transparent"
                >
                  كل حاجة تخص المادة في مكان واحد
                </span>
              </span>
            </h1>

            <p
              data-hero-fade
              className="text-[13px] sm:text-[14px] text-slate-300/85 leading-relaxed text-balance"
            >
              فيديو، شرح تفاعلي، ملخص منظم، وكويزات لكل فصل.
            </p>
          </div>

          <div
            data-hero-fade
            className="w-full flex flex-col items-center gap-2.5 pt-1"
          >
            {lastVisited ? (
              <>
                <Link
                  href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                  title={lastVisited.lessonTitle}
                  className="awwwards-beam cta-shimmer h-12 px-7 rounded-full text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
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
                className="awwwards-beam cta-shimmer h-12 px-8 rounded-full text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
                style={{ background: "#c25e33" }}
              >
                <span>ابدأ المذاكرة الآن</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </Link>
            )}
          </div>
        </div>

        <a
          href="#interactive-showcase"
          className="anim-scroll-cue inline-flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>اسحب لاستكشاف المنصة</span>
          <ArrowDown className="w-4 h-4 text-[#66c7a6]" />
        </a>
      </div>

      {/* ==================== DESKTOP HERO (>= lg): ARCHITECTURAL CINEMATIC STAGE ==================== */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:flex-1 pt-22 pb-7">
        <div className="relative z-10 flex-1 flex items-center w-full max-w-[1220px] mx-auto px-8 py-2">
          <div className="w-full grid grid-cols-12 items-center gap-10">
            {/* Right Column (RTL Start): Sculptural Editorial Typography + Magnetic CTAs */}
            <div ref={desktopCopyRef} className="col-span-6 text-right space-y-6">
              <div className="flex flex-wrap items-center justify-start gap-2.5">
                <span
                  data-hero-eyebrow
                  dir="ltr"
                  className="font-mono-code inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-[11px] font-bold tracking-wider text-slate-200 backdrop-blur-md"
                >
                  <span
                    className="w-2 h-2 rounded-full bg-[#66c7a6] shadow-[0_0_10px_#66c7a6] shrink-0"
                    aria-hidden="true"
                  />
                  AI · ZAGAZIG UNIVERSITY
                </span>
                <span
                  data-hero-eyebrow
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c25e33]/18 border border-[#e58a62]/35 text-[11.5px] font-extrabold text-[#f5b899]"
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>4 أركان لكل فصل</span>
                </span>
              </div>

              <h1 className="text-[42px] xl:text-[50px] font-black tracking-tight leading-[1.2] text-white">
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">
                    بدل تشتيت الملفات..
                  </span>
                </span>
                <span className="block overflow-hidden pb-1.5">
                  <span
                    data-hero-line
                    className="block bg-gradient-to-l from-[#f0a786] via-[#f8cdb4] to-[#66c7a6] bg-clip-text text-transparent"
                  >
                    كل حاجة تخص المادة في مكان واحد
                  </span>
                </span>
              </h1>

              <p
                data-hero-fade
                className="text-[16px] text-slate-300/90 leading-relaxed max-w-[500px]"
              >
                انسى تشتيت جروبات تليجرام وروابط درايف المقفولة — كل فصل
                متجهّزلك من الألف للياء في مساحة مذاكرة هندسية هادية ومنظمة.
              </p>

              <div
                data-hero-fade
                className="flex flex-wrap items-center justify-start gap-3.5 pt-1"
              >
                {lastVisited ? (
                  <>
                    <Link
                      href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                      title={lastVisited.lessonTitle}
                      className="awwwards-beam magnetic-btn cta-shimmer h-13 px-7 rounded-2xl text-[14.5px] font-extrabold text-white inline-flex items-center justify-center gap-2.5 shadow-[0_14px_34px_rgba(194,94,51,0.34)] transition-transform hover:-translate-y-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, #cf6739 0%, #b34f26 100%)",
                      }}
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
                      className="magnetic-btn h-13 px-6 rounded-2xl text-[14px] font-bold text-slate-100 bg-white/[0.06] hover:bg-white/[0.12] border border-white/14 backdrop-blur-md inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#66c7a6] shrink-0" />
                      <span>مكتبة المقررات</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/courses"
                      className="awwwards-beam magnetic-btn cta-shimmer h-13 px-7 rounded-2xl text-[14.5px] font-extrabold text-white inline-flex items-center justify-center gap-2.5 shadow-[0_14px_34px_rgba(194,94,51,0.34)] transition-transform hover:-translate-y-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, #cf6739 0%, #b34f26 100%)",
                      }}
                    >
                      <span>ابدأ المذاكرة الآن</span>
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleJumpToPillar(0)}
                      className="magnetic-btn h-13 px-6 rounded-2xl text-[14px] font-bold text-slate-100 bg-white/[0.06] hover:bg-white/[0.12] border border-white/14 backdrop-blur-md inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>استكشف الأركان</span>
                      <ArrowDown className="w-4 h-4 text-[#66c7a6] shrink-0" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Left Column (RTL End): Sculptural 3D Desk Diorama + Multi-Depth Floating Telemetry */}
            <div className="col-span-6 flex items-center justify-center">
              <div
                className="relative w-full max-w-[500px] xl:max-w-[540px] aspect-square flex items-center justify-center select-none"
                style={{ perspective: "1100px" }}
              >
                {/* Luminous Core Ring Behind Desk */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-10 rounded-full border border-white/[0.07]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(102, 199, 166, 0.24) 0%, rgba(194, 94, 51, 0.14) 48%, transparent 72%)",
                  }}
                />

                {/* 3D Desk Cutout Layer */}
                <div
                  ref={deskLayerRef}
                  data-hero-desk
                  className="relative z-10 w-full h-full will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative w-full h-full scale-[1.12]">
                    <Image
                      src="/images/desk/frame-3-nobg.png"
                      alt="مكتب المذاكرة المنظم"
                      width={900}
                      height={900}
                      sizes="(max-width: 1280px) 490px, 540px"
                      className="w-full h-full object-contain drop-shadow-[0_28px_52px_rgba(0,0,0,0.52)]"
                      priority
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Floating Depth Chip 1 — Top Right */}
                <div
                  ref={chipOneRef}
                  data-hero-chip
                  dir="ltr"
                  className="pointer-events-none absolute top-7 right-2 z-20 px-3.5 py-2 rounded-2xl border border-white/14 bg-[#0d182b]/78 backdrop-blur-xl shadow-[0_14px_34px_rgba(0,0,0,0.4)] flex items-center gap-2.5 will-change-transform"
                >
                  <span className="w-7 h-7 rounded-xl bg-[#66c7a6]/15 border border-[#66c7a6]/30 flex items-center justify-center text-[#66c7a6]">
                    <Terminal className="w-3.5 h-3.5" />
                  </span>
                  <div className="leading-tight text-left">
                    <div className="font-mono-code text-[10.5px] font-bold text-white">
                      CS-321 · Bresenham
                    </div>
                    <div className="font-mono-code text-[9.5px] text-[#66c7a6]">
                      Live Interactive Lab
                    </div>
                  </div>
                </div>

                {/* Floating Depth Chip 2 — Bottom Left */}
                <div
                  ref={chipTwoRef}
                  data-hero-chip
                  className="pointer-events-none absolute bottom-10 left-0 z-20 px-3.5 py-2.5 rounded-2xl border border-white/14 bg-[#0d182b]/82 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.45)] flex items-center gap-2.5 will-change-transform"
                >
                  <span className="w-7 h-7 rounded-xl bg-[#c25e33]/20 border border-[#e58a62]/35 flex items-center justify-center text-[#f0a786]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div className="leading-tight text-right">
                    <div className="text-[11px] font-extrabold text-white">
                      كشكول + كويز فوري
                    </div>
                    <div className="font-mono-code text-[9.5px] text-slate-300/80" dir="ltr">
                      94% Exam Readiness
                    </div>
                  </div>
                </div>

                {/* Floating Depth Chip 3 — Top Left Micro Tag */}
                <div
                  ref={chipThreeRef}
                  data-hero-chip
                  dir="ltr"
                  className="pointer-events-none absolute top-16 left-4 z-20 px-3 py-1 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-md font-mono-code text-[10px] font-bold text-slate-200/90 flex items-center gap-1.5 will-change-transform"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f0a786]" />
                  <span>LOCAL-FIRST · ZERO ADS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Bottom 4-Pillar Architectural Dock (Jumps directly to exact Scrollytelling pillar) */}
        <div className="relative z-10 w-full max-w-[1220px] mx-auto px-8 pt-3">
          <div className="border-t border-white/[0.08] pt-3.5 grid grid-cols-4 gap-3">
            {CHAPTER_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                data-hero-dock-item
                type="button"
                onClick={() => handleJumpToPillar(pillar.index)}
                className="group relative text-right px-3.5 py-2.5 rounded-2xl border border-transparent hover:border-white/[0.1] hover:bg-white/[0.05] transition-colors flex items-center gap-3 cursor-pointer"
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
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
                      className="font-mono-code text-[10px] font-bold opacity-85 shrink-0"
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
                  className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-y-1 group-hover:opacity-85 group-hover:translate-y-0.5 transition-all"
                  style={{ color: pillar.accent }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
