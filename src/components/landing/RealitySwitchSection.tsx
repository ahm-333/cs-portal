"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import {
  BookOpenText,
  Check,
  CheckCircle2,
  PlayCircle,
  X,
  Zap,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  MaskedLineReveal,
} from "@/components/ui/AwwwardsPrimitives";

interface ChaosScrap {
  title: string;
  subtitle: string;
  align: "start" | "end";
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
    rotateClass: "rotate-[1.4deg] sm:rotate-[2.8deg]",
    zClass: "z-[4] hover:z-20",
  },
  {
    title: "جروبات تليجرام مزدحمة بالملفات",
    subtitle: "نسخ مكرّرة وصعوبة الوصول للملف الصحيح",
    align: "end",
    rotateClass: "-rotate-[1.5deg] sm:-rotate-[3.4deg]",
    accentBorder: true,
    zClass: "z-[3] hover:z-20",
  },
  {
    title: "فيديو طويل بدون تقسيم أو بديل مكتوب",
    subtitle: "صعوبة المراجعة السريعة أو القراءة المنظّمة",
    align: "start",
    rotateClass: "rotate-[1.2deg] sm:rotate-[2deg]",
    zClass: "z-[2] hover:z-20",
  },
  {
    title: "دخول الامتحان بدون تدريب كافٍ",
    subtitle: "غياب أسئلة مرتّبة وتصحيح فوري على كل فصل",
    align: "end",
    rotateClass: "-rotate-[1.4deg] sm:-rotate-[2.4deg]",
    muted: true,
    zClass: "z-[1] hover:z-20",
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
  const chaosPanelRef = useRef<HTMLElement | null>(null);
  const precisionPanelRef = useRef<HTMLElement | null>(null);

  // Per-panel 60fps GSAP ScrollTrigger choreography (outer wrappers animate so inner CSS hover transforms never clash)
  useEffect(() => {
    const section = sectionRef.current;
    const chaosPanel = chaosPanelRef.current;
    const precisionPanel = precisionPanelRef.current;
    if (!section || !chaosPanel || !precisionPanel) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const scraps = Array.from(
        chaosPanel.querySelectorAll<HTMLElement>("[data-chaos-scrap]")
      );
      const tiles = Array.from(
        precisionPanel.querySelectorAll<HTMLElement>("[data-precision-tile]")
      );
      const kpis = Array.from(
        precisionPanel.querySelectorAll<HTMLElement>("[data-precision-kpi]")
      );

      // 1) Chaos panel: tilted scraps gently drop & settle into place
      if (scraps.length > 0) {
        const chaosTl = gsap.timeline({
          scrollTrigger: {
            trigger: chaosPanel,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        scraps.forEach((scrap, idx) => {
          const jitter = idx % 2 === 0 ? 3 : -3;
          chaosTl.fromTo(
            scrap,
            {
              opacity: 0,
              y: -16,
              rotation: jitter,
            },
            {
              opacity: 1,
              y: 0,
              rotation: 0,
              duration: 0.6,
              ease: "power3.out",
              clearProps: "transform",
            },
            idx * 0.08
          );
        });
      }

      // 2) Precision panel: 2×2 tiles align in tight disciplined unison, followed by KPIs
      if (tiles.length > 0) {
        const precisionTl = gsap.timeline({
          scrollTrigger: {
            trigger: precisionPanel,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        precisionTl.fromTo(
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
            clearProps: "transform",
          },
          0.08
        );

        if (kpis.length > 0) {
          precisionTl.fromTo(
            kpis,
            {
              opacity: 0,
              y: 10,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.44,
              stagger: 0.06,
              ease: "power2.out",
              clearProps: "transform",
            },
            0.3
          );
        }
      }
    }, section);

    return () => {
      ctx.revert();
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
        {/* RIGHT CARD (RTL Start): BEFORE — Recessed Dashed Parchment / Obsidian Chaos Pile */}
        <article
          ref={chaosPanelRef}
          className="scroll-lift relative overflow-hidden rounded-[24px] sm:rounded-[26px] p-5 sm:p-7 flex flex-col justify-between bg-white/[0.58] border border-dashed border-[#c25e33]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_12px_32px_rgba(18,28,45,0.05)] backdrop-blur-sm dark:bg-[#0c0e14]/95 dark:border-[#d97852]/30 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_26px_64px_rgba(0,0,0,0.48)]"
        >
          {/* Card Header */}
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-mono-code block text-[10px] sm:text-[10.5px] font-bold tracking-wider uppercase text-[#b84e25] dark:text-[#d97852]">
                BEFORE · CHAOS
              </span>
              <h3 className="text-[18px] sm:text-[21px] font-black text-[#1d2b42] dark:text-[#f6f4ef]/85">
                المذاكرة التقليدية
              </h3>
            </div>

            <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-extrabold border bg-[#faece5] border-[#c25e33]/30 text-[#9c3f1c] shadow-[0_1px_2px_rgba(194,94,51,0.08)] dark:bg-[#d97852]/14 dark:border-[#d97852]/30 dark:text-[#e59370] dark:shadow-none">
              45 دقيقة تدوير
            </span>
          </div>

          {/* 4 Subtly Tilted Overlapping Chaos Scraps (hover gently straightens & lifts) */}
          <div className="relative flex-1 flex flex-col justify-center gap-2.5 sm:gap-3 lg:-space-y-1 my-5 sm:my-6 px-1 sm:px-2">
            {CHAOS_SCRAPS.map((scrap) => (
              <div
                key={scrap.title}
                data-chaos-scrap
                className={[
                  "relative w-[95%] sm:w-[86%] will-change-transform",
                  scrap.align === "start" ? "self-start" : "self-end",
                  scrap.zClass,
                ].join(" ")}
              >
                <div
                  className={[
                    "group rounded-[15px] px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 border will-change-transform transition-[transform,border-color,box-shadow,opacity] duration-300 ease-out hover:rotate-0 hover:-translate-y-1 hover:opacity-100",
                    scrap.rotateClass,
                    scrap.muted ? "opacity-90 dark:opacity-85" : "",
                    scrap.accentBorder
                      ? "bg-[#fffdfb] border-[#c25e33]/35 shadow-[0_10px_26px_rgba(194,94,51,0.1),0_1px_2px_rgba(18,28,45,0.05)] hover:border-[#c25e33]/55 hover:shadow-[0_16px_34px_rgba(194,94,51,0.16)] dark:bg-[#171a24]/95 dark:border-[#d97852]/32 dark:shadow-[0_16px_36px_rgba(0,0,0,0.46)] dark:hover:border-[#d97852]/55 dark:hover:shadow-[0_20px_42px_rgba(0,0,0,0.58)]"
                      : "bg-white/95 border-[#1e355c]/[0.14] shadow-[0_8px_22px_rgba(18,28,45,0.075),0_1px_2px_rgba(18,28,45,0.04)] hover:border-[#1e355c]/30 hover:shadow-[0_14px_30px_rgba(18,28,45,0.12)] dark:bg-[#151821]/95 dark:border-white/[0.09] dark:shadow-[0_16px_36px_rgba(0,0,0,0.45)] dark:hover:border-[#d97852]/35 dark:hover:shadow-[0_20px_42px_rgba(0,0,0,0.58)]",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <div className="text-[12.5px] sm:text-[13.5px] font-extrabold leading-snug text-[#131c2b] dark:text-[#ebe8e2]/88">
                      {scrap.title}
                    </div>
                    <p className="text-[11px] sm:text-[11.5px] leading-relaxed mt-0.5 text-[#526075] dark:text-[#989389]">
                      {scrap.subtitle}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="w-6 h-6 rounded-[7px] shrink-0 flex items-center justify-center border border-[#c25e33]/20 bg-[#faece5] text-[#b84e25] transition-transform duration-300 group-hover:scale-105 dark:border-[#d97852]/25 dark:bg-[#d97852]/15 dark:text-[#e59370]"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.6]" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="pt-3.5 border-t border-[#1e355c]/[0.12] dark:border-white/[0.06] text-[12px] font-semibold text-[#526075] dark:text-[#989389]">
            يُستنزف وقتك في التجميع قبل أن تبدأ المذاكرة.
          </div>
        </article>

        {/* LEFT CARD (RTL End): WITH PORTAL — Deep Architectural Navy (Light) / Obsidian Glass (Dark) */}
        <article
          ref={precisionPanelRef}
          className="scroll-lift sapphire-rim relative overflow-hidden rounded-[24px] sm:rounded-[26px] p-5 sm:p-7 flex flex-col justify-between bg-[linear-gradient(165deg,#14233d_0%,#0c172b_100%)] border border-[#1e355c]/55 shadow-[0_30px_72px_rgba(12,23,43,0.28),0_6px_20px_rgba(12,23,43,0.14),inset_0_1px_0_rgba(255,255,255,0.14)] dark:bg-[linear-gradient(165deg,#181c28_0%,#0e1119_100%)] dark:border-[#d8b07a]/42 dark:shadow-[0_38px_88px_rgba(0,0,0,0.62),0_0_0_1px_rgba(216,176,122,0.08),inset_0_1px_0_rgba(238,210,164,0.32)]"
        >
          {/* Ambient Champagne & Mint Architectural Depth Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 12%, rgba(216, 176, 122, 0.16) 0%, transparent 54%), radial-gradient(circle at 82% 88%, rgba(110, 196, 163, 0.15) 0%, transparent 56%)",
            }}
          />

          {/* 1px Crisp Specular Champagne Top Rim */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-[7%] h-px bg-gradient-to-r from-transparent via-[#f3dbb1]/80 to-transparent"
          />

          {/* Card Header */}
          <div className="relative z-10 flex items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-mono-code block text-[10px] sm:text-[10.5px] font-bold tracking-wider uppercase text-[#82dec0] dark:text-[#6ec4a3]">
                WITH PORTAL · CALM ORDER
              </span>
              <h3 className="text-[18px] sm:text-[22px] font-black text-white">
                مع{" "}
                <span className="font-en inline-block tracking-tight">
                  Eng. Ahmed Amir
                </span>
              </h3>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-extrabold border bg-[#6ec4a3]/18 border-[#82dec0]/40 text-[#97ebd0] shadow-[0_2px_10px_rgba(110,196,163,0.14)] dark:bg-gradient-to-br dark:from-[#d8b07a]/22 dark:to-[#6ec4a3]/16 dark:border-[#d8b07a]/45 dark:text-[#f2d9af] dark:shadow-none">
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
                  className="will-change-transform h-full"
                >
                  <div
                    className={[
                      "group h-full rounded-[15px] sm:rounded-[16px] p-3.5 sm:p-[18px] flex flex-col justify-between gap-3 border will-change-transform transition-[transform,border-color,background-color,box-shadow] duration-250 ease-out hover:-translate-y-1",
                      tile.highlight
                        ? "bg-gradient-to-br from-[#6ec4a3]/[0.16] to-[#d8b07a]/[0.09] border-[#82dec0]/32 hover:border-[#82dec0]/65 hover:shadow-[0_14px_30px_rgba(0,0,0,0.32),0_0_24px_rgba(110,196,163,0.18)] dark:from-[#d8b07a]/[0.14] dark:to-[#6ec4a3]/[0.08] dark:border-[#d8b07a]/36 dark:hover:border-[#eed2a4]/65 dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.42),0_0_24px_rgba(216,176,122,0.18)]"
                        : "bg-white/[0.05] border-white/[0.12] hover:bg-white/[0.08] hover:border-[#f2d9af]/50 hover:shadow-[0_14px_30px_rgba(0,0,0,0.3),0_0_22px_rgba(216,176,122,0.13)] dark:bg-white/[0.038] dark:border-[#fff5e6]/[0.1] dark:hover:bg-white/[0.06] dark:hover:border-[#d8b07a]/48 dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.4),0_0_22px_rgba(216,176,122,0.14)]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={[
                          "font-mono-code text-[9.5px] sm:text-[10.5px] font-extrabold tracking-wide",
                          tile.highlight
                            ? "text-[#82dec0] dark:text-[#6ec4a3]"
                            : "text-[#f2d9af] dark:text-[#d8b07a]",
                        ].join(" ")}
                      >
                        {tile.code}
                      </span>
                      <Icon
                        aria-hidden="true"
                        className={[
                          "w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-80 transition-[transform,opacity] duration-250 group-hover:scale-110 group-hover:opacity-100",
                          tile.highlight
                            ? "text-[#82dec0] dark:text-[#6ec4a3]"
                            : "text-[#f2d9af] dark:text-[#d8b07a]",
                        ].join(" ")}
                      />
                    </div>

                    <div>
                      <h4 className="text-[14px] sm:text-[16px] font-black text-white leading-snug">
                        {tile.title}
                      </h4>
                      <p className="text-[11px] sm:text-[12px] leading-relaxed mt-1 text-slate-200/85 dark:text-[#dcd7ce]/82">
                        {tile.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom 3 Architectural KPIs */}
          <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3 pt-4 border-t border-white/[0.12] dark:border-white/[0.09]">
            {PRECISION_KPIS.map((kpi) => (
              <div
                key={kpi.label}
                data-precision-kpi
                className="flex flex-col gap-0.5 will-change-transform"
              >
                <span
                  dir={kpi.ltr ? "ltr" : undefined}
                  className={[
                    "text-[15px] sm:text-[18px] font-black tabular-nums leading-tight",
                    kpi.ltr ? "font-mono-code inline-block w-fit" : "",
                    kpi.tone === "sage"
                      ? "text-[#82dec0] dark:text-[#6ec4a3]"
                      : "text-[#f2d9af]",
                  ].join(" ")}
                >
                  {kpi.value}
                </span>
                <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-slate-300/80 dark:text-[#a29d93]">
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
