"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, Sparkles } from "lucide-react";

const UNIVERSE_PILLS = [
  {
    code: "CS-321",
    label: "Computer Graphics",
    href: "/courses/computer-graphics",
    dot: "#e58a62",
  },
  {
    code: "CS-311",
    label: "Operating Systems",
    href: "/courses/operating-systems",
    dot: "#66c7a6",
  },
  {
    code: "CS-213",
    label: "Data Structures",
    href: "/courses/data-structures",
    dot: "#7ca7f0",
  },
  {
    code: "IS-211",
    label: "Database Systems",
    href: "/courses/database-systems",
    dot: "#f5b899",
  },
] as const;

export function CinematicUniverseBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const artLayerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const scrollOffsetRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const applyTransform = useCallback(() => {
    const el = artLayerRef.current;
    if (!el || reducedMotionRef.current) return;
    const tx = mouseOffsetRef.current.x;
    const ty = scrollOffsetRef.current + mouseOffsetRef.current.y;
    el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(1.1)`;
  }, []);

  // Lightweight scroll-driven parallax (GPU-composited via rAF)
  useEffect(() => {
    if (typeof window === "undefined") return;
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotionRef.current) return;

    let rafId = 0;

    const updateScroll = () => {
      rafId = 0;
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Normalized progress [-1 .. 1] as section passes viewport center
      const centerDelta = (rect.top + rect.height / 2 - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, centerDelta));
      scrollOffsetRef.current = clamped * -22;
      applyTransform();
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [applyTransform]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotionRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;

      mouseOffsetRef.current = { x: nx * -14, y: ny * -10 };
      applyTransform();

      if (glowRef.current) {
        const gx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
        const gy = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100;
        glowRef.current.style.background = `radial-gradient(420px circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(102, 199, 166, 0.14), rgba(229, 138, 98, 0.08) 42%, transparent 72%)`;
      }
    },
    [applyTransform]
  );

  const handleMouseLeave = useCallback(() => {
    mouseOffsetRef.current = { x: 0, y: 0 };
    applyTransform();
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  }, [applyTransform]);

  return (
    <section
      ref={sectionRef}
      aria-label="عالم علوم الحاسب والذكاء الاصطناعي"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-11 pb-2"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-[26px] sm:rounded-[32px] border border-white/10 bg-[#0b1322] text-white shadow-2xl"
      >
        {/* ================= DESKTOP CINEMATIC LAYERED STAGE (>= lg) ================= */}
        <div className="hidden lg:block relative min-h-[420px] xl:min-h-[455px]">
          {/* Parallax 3D Artwork Layer */}
          <div
            ref={artLayerRef}
            className="absolute inset-0 will-change-transform transition-transform duration-300 ease-out"
            style={{ transform: "scale(1.08)" }}
          >
            <Image
              src="/images/landing/cs-universe-banner.jpg"
              alt="عالم علوم الحاسب والذكاء الاصطناعي ثلاثي الأبعاد"
              fill
              sizes="(max-width: 1200px) 100vw, 1180px"
              className="object-cover object-left select-none pointer-events-none"
              priority={false}
              draggable={false}
            />
          </div>

          {/* Cursor-Reactive Soft Ambient Spotlight */}
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          />

          {/* Seamless RTL Gradient Scrim so Arabic Copy Pops on the Right while 3D Art Shines on the Left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(270deg, rgba(9, 16, 30, 0.94) 0%, rgba(11, 19, 34, 0.80) 36%, rgba(11, 19, 34, 0.28) 62%, rgba(11, 19, 34, 0.08) 100%)",
            }}
          />

          {/* Right-Side Editorial Content Overlay */}
          <div className="relative z-10 flex min-h-[420px] xl:min-h-[455px] items-center justify-start p-9 xl:p-12">
            <div className="max-w-[470px] space-y-5 text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11.5px] font-extrabold text-[#f5b899] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#66c7a6] shrink-0" />
                <span>عالم علوم الحاسب والذكاء الاصطناعي</span>
              </span>

              <h2 className="text-[32px] xl:text-[38px] font-black leading-[1.25] tracking-tight text-white">
                منهجك بالكامل..
                <span className="block mt-1 bg-gradient-to-l from-[#f0a786] via-[#f6c4a8] to-[#66c7a6] bg-clip-text text-transparent">
                  مرسوم ومفهوم قدام عينك
                </span>
              </h2>

              <p className="text-[14.5px] leading-[1.8] text-slate-300/90">
                من قلب المعالج والـ Kernel لحد رسوميات الـ 3D وقواعد البيانات —
                كل مفهوم صعب اتحوّل لشرح تفاعلي واضح وملخص مرتب وأسئلة امتحان
                حقيقية.
              </p>

              {/* 4 Quiet Floating Course Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {UNIVERSE_PILLS.map((pill) => (
                  <Link
                    key={pill.code}
                    href={pill.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.07] px-3 py-1.5 text-[12px] font-bold text-slate-100 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14]"
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: pill.dot,
                        boxShadow: `0 0 8px ${pill.dot}`,
                      }}
                    />
                    <span dir="ltr" className="font-en">
                      {pill.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="pt-1">
                <a
                  href="#courses-picker"
                  className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#f5b899] hover:text-white transition-colors"
                >
                  <span>اختار مادتك وابدأ فوراً</span>
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE & TABLET CLEAN CINEMATIC CARD (< lg) ================= */}
        <div className="lg:hidden flex flex-col">
          {/* Unobstructed Centered 3D Artwork Stage */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#0b1322]">
            <Image
              src="/images/landing/cs-universe-banner.jpg"
              alt="عالم علوم الحاسب والذكاء الاصطناعي ثلاثي الأبعاد"
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover object-[38%_50%] scale-[1.06] select-none pointer-events-none"
              draggable={false}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, #0b1322 100%)",
              }}
            />
          </div>

          {/* Crisp, Calm Copy Underneath — Zero Clutter */}
          <div className="px-5 pb-6 pt-1 text-center space-y-2.5 bg-[#0b1322]">
            <h2 className="text-[20px] sm:text-[24px] font-black leading-[1.35] tracking-tight text-white text-balance">
              منهجك بالكامل..{" "}
              <span className="bg-gradient-to-l from-[#f0a786] via-[#f6c4a8] to-[#66c7a6] bg-clip-text text-transparent">
                مرسوم ومفهوم قدام عينك
              </span>
            </h2>

            <p className="text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-300/85 max-w-md mx-auto text-balance">
              كل مادة متجهّزة بشرح تفاعلي، ملخص بالعامية، وبنك أسئلة ميدتيرم.
            </p>

            <div className="pt-1">
              <a
                href="#courses-picker"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-[12px] font-extrabold text-white active:scale-[0.98] transition-transform"
              >
                <span>اختار مادتك تحت</span>
                <ArrowDown className="h-3.5 w-3.5 text-[#66c7a6] shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
