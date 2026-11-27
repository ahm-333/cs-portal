"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { BookOpenText, Check, CheckCircle2, PlayCircle, X, Zap } from "lucide-react";
import {
  EDITORIAL_EASE,
  MaskedLineReveal,
} from "@/components/ui/AwwwardsPrimitives";

interface ChaosScrap {
  title: string;
  subtitle: string;
  align: "start" | "end";
  desktopTilt: number;
  mobileTilt: number;
  rotateClass: string;
  accentBorder?: boolean;
  muted?: boolean;
  zClass: string;
}

const CHAOS_SCRAPS: readonly ChaosScrap[] = [
  {
    title: "روابط Drive مقفولة أو مفقودة",
    subtitle: "انتظار صلاحيات وتنقّل بين مجلدات عشوائية",
    align: "start",
    desktopTilt: 2.8,
    mobileTilt: 1.4,
    rotateClass: "rotate-[1.4deg] sm:rotate-[2.8deg]",
    zClass: "z-[4]",
  },
  {
    title: "جروبات تليجرام مزدحمة بالملفات",
    subtitle: "نسخ مكرّرة وصعوبة الوصول للملف الصحيح",
    align: "end",
    desktopTilt: -3.4,
    mobileTilt: -1.5,
    rotateClass: "-rotate-[1.5deg] sm:-rotate-[3.4deg]",
    accentBorder: true,
    zClass: "z-[3]",
  },
  {
    title: "فيديو طويل بدون تقسيم أو بديل مكتوب",
    subtitle: "صعوبة المراجعة السريعة أو القراءة المنظّمة",
    align: "start",
    desktopTilt: 2,
    mobileTilt: 1.2,
    rotateClass: "rotate-[1.2deg] sm:rotate-[2deg]",
    zClass: "z-[2]",
  },
  {
    title: "دخول الامتحان بدون تدريب كافٍ",
    subtitle: "غياب أسئلة مرتّبة وتصحيح فوري على كل فصل",
    align: "end",
    desktopTilt: -2.4,
    mobileTilt: -1.4,
    rotateClass: "-rotate-[1.4deg] sm:-rotate-[2.4deg]",
    muted: true,
    zClass: "z-[1]",
  },
] as const;

const PRECISION_TILES = [
  {
    code: "01 · VIDEO",
    title: "فيديو الشرح",
    desc: "فصول زمنية واضحة وبدون إعلانات.",
    highlight: false,
    Icon: PlayCircle,
  },
  {
    code: "02 · FULL GUIDE",
    title: "اقرأ شرح الفصل",
    desc: "بديل مكتوب متكامل بالرسومات والأكواد.",
    highlight: true,
    Icon: BookOpenText,
  },
  {
    code: "03 · SUMMARY",
    title: "ملخص سريع",
    desc: "مراجعة مركّزة لاسترجاع الفصل في دقائق.",
    highlight: false,
    Icon: Zap,
  },
  {
    code: "04 · QUIZZES",
    title: "أسئلة وكويزات",
    desc: "تدريب متدرّج بتصحيح فوري وبنك أخطاء.",
    highlight: true,
    Icon: CheckCircle2,
  },
] as const;

const PRECISION_KPIS = [
  {
    value: "0 دقيقة",
    label: "وقت ضائع في البحث",
    tone: "champagne" as const,
    ltr: false,
  },
  {
    value: "4 أركان",
    label: "داخل كل محاضرة",
    tone: "sage" as const,
    ltr: false,
  },
  {
    value: "100%",
    label: "هدوء وبدون إعلانات",
    tone: "champagne" as const,
    ltr: true,
  },
] as const;

export function RealitySwitchSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Scroll-choreographed contrast: chaotic tilted scraps settle vs tight staggered precision grid
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const setupChoreography = (isDesktop: boolean) => {
      const scraps = Array.from(
        section.querySelectorAll<HTMLElement>("[data-chaos-scrap]")
      );
      const tiles = Array.from(
        section.querySelectorAll<HTMLElement>("[data-precision-tile]")
      );
      const kpis = Array.from(
        section.querySelectorAll<HTMLElement>("[data-precision-kpi]")
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      // 1) Chaos scraps drop gently into their tilted resting angles
      scraps.forEach((scrap, idx) => {
        const meta = CHAOS_SCRAPS[idx];
        const targetRot = isDesktop ? meta.desktopTilt : meta.mobileTilt;
        const startRot = targetRot + (idx % 2 === 0 ? 3.2 : -3.2);

        tl.fromTo(
          scrap,
          {
            opacity: 0,
            y: -16,
            rotation: startRot,
          },
          {
            opacity: meta.muted ? 0.88 : 1,
            y: 0,
            rotation: targetRot,
            duration: 0.62,
            ease: "power3.out",
          },
          idx * 0.085
        );
      });

      // 2) Precision 2x2 tiles align in tight, disciplined architectural unison
      if (tiles.length > 0) {
        tl.fromTo(
          tiles,
          {
            opacity: 0,
            y: 16,
            scale: 0.965,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.54,
            stagger: 0.07,
            ease: "power3.out",
          },
          0.14
        );
      }

      // 3) Bottom KPIs settle cleanly
      if (kpis.length > 0) {
        tl.fromTo(
          kpis,
          {
            opacity: 0,
            y: 10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.36
        );
      }
    };

    mm.add("(min-width: 640px)", () => {
      setupChoreography(true);
    });

    mm.add("(max-width: 639px)", () => {
      setupChoreography(false);
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      id="compare"
      ref={sectionRef}
      className="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-8 sm:space-y-10"
    >
      {/* Section Header */}
      <header className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2.5">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
          className="inline-flex items-center gap-2 text-[12px] font-extrabold tracking-wide text-[#c25e33] dark:text-[#d8b07a]"
        >
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#c25e33] dark:bg-[#d8b07a]"
          />
          <span>الفرق في الواقع</span>
        </motion.span>

        <h2
          className="text-2xl sm:text-4xl font-black tracking-tight leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          <MaskedLineReveal>الفرق بين التشتّت والنظام</MaskedLineReveal>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.5, delay: 0.08, ease: EDITORIAL_EASE }}
          className="text-[13.5px] sm:text-[14.5px] leading-relaxed max-w-xl"
          style={{ color: "var(--text-secondary)" }}
        >
          تباين واضح بين تشتّت الملفات التقليدي ومساحة مذاكرة مصمّمة للهدوء
          والتركيز.
        </motion.p>
      </header>

      {/* Dual Visual Contrast Grid: RTL Start (Right) = Chaos Pile · RTL End (Left) = Precision Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.94fr_1.06fr] gap-6 lg:gap-7 items-stretch">
        {/* RIGHT CARD (RTL Start): BEFORE — Visual Chaos Pile */}
        <article className="scroll-lift relative overflow-hidden rounded-[24px] sm:rounded-[26px] p-5 sm:p-7 flex flex-col justify-between bg-white/65 border border-dashed border-[#c25e33]/30 shadow-[0_12px_32px_rgba(18,28,45,0.04)] backdrop-blur-sm dark:bg-[#0d0f15] dark:border-[#d97852]/30 dark:shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
          {/* Card Header */}
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-mono-code block text-[10px] sm:text-[10.5px] font-bold tracking-wider uppercase text-[#c25e33] dark:text-[#d97852]">
                BEFORE · CHAOS
              </span>
              <h3 className="text-[18px] sm:text-[21px] font-black text-[#2a3648] dark:text-[#f6f4ef]/80">
                المذاكرة التقليدية
              </h3>
            </div>

            <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-extrabold border bg-[#faece5] border-[#c25e33]/25 text-[#a64924] dark:bg-[#d97852]/12 dark:border-[#d97852]/25 dark:text-[#d97852]">
              45 دقيقة تدوير
            </span>
          </div>

          {/* 4 Subtly Tilted Overlapping Chaos Scraps */}
          <div className="relative flex-1 flex flex-col justify-center gap-2.5 sm:gap-3 lg:-space-y-1 my-5 sm:my-6 px-1 sm:px-2">
            {CHAOS_SCRAPS.map((scrap) => (
              <div
                key={scrap.title}
                data-chaos-scrap
                className={[
                  "relative w-[95%] sm:w-[86%] rounded-[15px] px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 border will-change-transform transition-[border-color,box-shadow] duration-200",
                  scrap.align === "start" ? "self-start" : "self-end",
                  scrap.rotateClass,
                  scrap.zClass,
                  scrap.muted ? "opacity-90 dark:opacity-85" : "",
                  scrap.accentBorder
                    ? "bg-white/95 border-[#c25e33]/30 shadow-[0_10px_24px_rgba(18,28,45,0.08)] dark:bg-[#161820]/95 dark:border-[#d97852]/30 dark:shadow-[0_14px_32px_rgba(0,0,0,0.44)]"
                    : "bg-white/95 border-[#1e355c]/12 shadow-[0_10px_24px_rgba(18,28,45,0.06)] dark:bg-[#161820]/92 dark:border-white/[0.08] dark:shadow-[0_14px_32px_rgba(0,0,0,0.42)]",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="text-[12.5px] sm:text-[13.5px] font-extrabold leading-snug text-[#1e293b] dark:text-[#ebe8e2]/85">
                    {scrap.title}
                  </div>
                  <p className="text-[11px] sm:text-[11.5px] leading-relaxed mt-0.5 text-[#626e82] dark:text-[#989389]">
                    {scrap.subtitle}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="w-6 h-6 rounded-[7px] shrink-0 flex items-center justify-center bg-[#faece5] text-[#c25e33] dark:bg-[#d97852]/15 dark:text-[#d97852]"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.6]" />
                </span>
              </div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="pt-3.5 border-t border-[#1e355c]/10 dark:border-white/[0.06] text-[12px] font-semibold text-[#626e82] dark:text-[#989389]">
            يُستنزف وقتك في التجميع قبل أن تبدأ المذاكرة.
          </div>
        </article>

        {/* LEFT CARD (RTL End): WITH PORTAL — Precision 2×2 Architectural Grid */}
        <article className="scroll-lift sapphire-rim relative overflow-hidden rounded-[24px] sm:rounded-[26px] p-5 sm:p-7 flex flex-col justify-between bg-[linear-gradient(165deg,#1b2d4d_0%,#111e36_100%)] border border-[#1e355c]/40 shadow-[0_28px_66px_rgba(18,28,45,0.22)] dark:bg-[linear-gradient(165deg,#171b26_0%,#10131c_100%)] dark:border-[#d8b07a]/40 dark:shadow-[0_34px_80px_rgba(0,0,0,0.56)]">
          {/* Whisper-soft Ambient Champagne & Sage Architectural Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 12%, rgba(216, 176, 122, 0.15) 0%, transparent 54%), radial-gradient(circle at 82% 88%, rgba(110, 196, 163, 0.13) 0%, transparent 55%)",
            }}
          />

          {/* 1px Specular Champagne Top Rim */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-[8%] h-px bg-gradient-to-r from-transparent via-[#eed2a4]/70 to-transparent"
          />

          {/* Card Header */}
          <div className="relative z-10 flex items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-mono-code block text-[10px] sm:text-[10.5px] font-bold tracking-wider uppercase text-[#7ad3b5] dark:text-[#6ec4a3]">
                WITH PORTAL · CALM ORDER
              </span>
              <h3 className="text-[18px] sm:text-[22px] font-black text-white">
                مع{" "}
                <span className="font-en inline-block tracking-tight">
                  Eng. Ahmed Amir
                </span>
              </h3>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-extrabold border bg-[#66c7a6]/16 border-[#66c7a6]/35 text-[#8ce2c4] dark:bg-gradient-to-br dark:from-[#d8b07a]/20 dark:to-[#6ec4a3]/16 dark:border-[#d8b07a]/42 dark:text-[#eed2a4]">
              <Check className="w-3 h-3 stroke-[2.8] shrink-0" />
              <span>صفحة واحدة لكل فصل</span>
            </span>
          </div>

          {/* Precision 2×2 Architectural Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 my-5 sm:my-6 flex-1">
            {PRECISION_TILES.map((tile) => {
              const Icon = tile.Icon;
              return (
                <div
                  key={tile.code}
                  data-precision-tile
                  className={[
                    "group rounded-[15px] sm:rounded-[16px] p-3.5 sm:p-[18px] flex flex-col justify-between gap-3 border will-change-transform transition-[border-color,background-color] duration-200",
                    tile.highlight
                      ? "bg-gradient-to-br from-[#6ec4a3]/[0.14] to-[#d8b07a]/[0.08] border-[#7ad3b5]/30 hover:border-[#7ad3b5]/55 dark:from-[#d8b07a]/[0.13] dark:to-[#6ec4a3]/[0.07] dark:border-[#d8b07a]/35 dark:hover:border-[#d8b07a]/60"
                      : "bg-white/[0.045] border-white/[0.1] hover:border-[#eed2a4]/35 dark:bg-white/[0.035] dark:border-[#fff5e6]/[0.09] dark:hover:border-[#d8b07a]/35",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={[
                        "font-mono-code text-[9.5px] sm:text-[10.5px] font-extrabold tracking-wide",
                        tile.highlight
                          ? "text-[#7ad3b5] dark:text-[#6ec4a3]"
                          : "text-[#eed2a4] dark:text-[#d8b07a]",
                      ].join(" ")}
                    >
                      {tile.code}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className={[
                        "w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-75 transition-opacity group-hover:opacity-100",
                        tile.highlight
                          ? "text-[#7ad3b5] dark:text-[#6ec4a3]"
                          : "text-[#eed2a4] dark:text-[#d8b07a]",
                      ].join(" ")}
                    />
                  </div>

                  <div>
                    <h4 className="text-[14px] sm:text-[16px] font-black text-white leading-snug">
                      {tile.title}
                    </h4>
                    <p className="text-[11px] sm:text-[12px] leading-relaxed mt-1 text-slate-200/80 dark:text-[#dcd7ce]/80">
                      {tile.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom 3 Architectural KPIs */}
          <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3 pt-4 border-t border-white/[0.1] dark:border-white/[0.08]">
            {PRECISION_KPIS.map((kpi) => (
              <div
                key={kpi.label}
                data-precision-kpi
                className="flex flex-col gap-0.5"
              >
                <span
                  dir={kpi.ltr ? "ltr" : undefined}
                  className={[
                    "text-[15px] sm:text-[18px] font-black tabular-nums leading-tight",
                    kpi.ltr ? "font-mono-code inline-block w-fit" : "",
                    kpi.tone === "sage"
                      ? "text-[#7ad3b5] dark:text-[#6ec4a3]"
                      : "text-[#eed2a4]",
                  ].join(" ")}
                >
                  {kpi.value}
                </span>
                <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-slate-300/75 dark:text-[#989389]">
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
