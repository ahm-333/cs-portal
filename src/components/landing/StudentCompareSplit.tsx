"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, X } from "lucide-react";

export function StudentCompareSplit() {
  const [hoveredSide, setHoveredSide] = useState<"with" | "without" | null>(
    null
  );

  return (
    <section
      aria-label="الفرق بين المذاكرة مع المنصة ومن غيرها"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-9 sm:pt-12 pb-2 space-y-5 sm:space-y-6"
    >
      {/* Crisp Minimal Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
          style={{
            background: "var(--accent-warm-soft)",
            color: "var(--accent-warm-text)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>الفرق قدام عينك</span>
        </span>

        <h2
          className="text-[22px] sm:text-3xl font-black tracking-tight text-balance"
          style={{ color: "var(--text-primary)" }}
        >
          نفس المنهج..{" "}
          <span style={{ color: "var(--accent-warm)" }}>بس فرق السما والأرض</span>
        </h2>
      </div>

      {/* Cinematic Two-Halves Split Stage */}
      <div className="relative overflow-hidden rounded-[26px] sm:rounded-[32px] border border-white/10 bg-[#0b1322] shadow-2xl">
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* ============ HALF 1 (RTL RIGHT): WITH US — CALM & FOCUSED STUDENT ============ */}
          <div
            onMouseEnter={() => setHoveredSide("with")}
            onMouseLeave={() => setHoveredSide(null)}
            className={`group/with relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] md:aspect-auto md:min-h-[410px] lg:min-h-[450px] transition-opacity duration-500 ${
              hoveredSide === "without" ? "md:opacity-80" : "opacity-100"
            }`}
          >
            {/* Top Emerald Accent Hairline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px]"
              style={{
                background:
                  "linear-gradient(270deg, #66c7a6 0%, rgba(102, 199, 166, 0.25) 100%)",
              }}
            />

            {/* Focused Student 3D Illustration */}
            <Image
              src="/images/landing/student-focused.jpg"
              alt="طالب يذاكر بهدوء وتركيز مع المنصة"
              fill
              sizes="(max-width: 768px) 100vw, 590px"
              className="object-cover object-[50%_26%] transition-transform duration-700 ease-out group-hover/with:scale-[1.04] select-none pointer-events-none"
              draggable={false}
            />

            {/* Soft Bottom Gradient Scrim (Leaves face & desk completely clear) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(8, 16, 30, 0.32) 0%, rgba(8, 16, 30, 0) 28%, rgba(8, 16, 30, 0.14) 56%, rgba(8, 16, 30, 0.94) 100%)",
              }}
            />

            {/* Top Badge */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-[#0a1d24]/80 px-3 py-1 text-[11.5px] sm:text-[12px] font-extrabold text-[#7ae0bc] backdrop-blur-md shadow-lg">
                <span className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-[#7ae0bc]" />
                </span>
                <span>مع المنصة</span>
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 lg:p-7 text-right">
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-[17px] sm:text-[20px] font-black text-white leading-snug">
                    تركيز وهدوء.. وكل حاجة مترتّبة
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-slate-300/90 leading-relaxed">
                    شرح تفاعلي، كشكول ملخص بالعامية، وبنك أسئلة في مكان واحد.
                  </p>
                </div>

                <Link
                  href="/courses"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#66c7a6]/20 hover:bg-[#66c7a6]/30 border border-[#66c7a6]/40 px-3.5 py-1.5 text-[11.5px] font-extrabold text-[#9af0d0] backdrop-blur-md transition-colors shrink-0"
                >
                  <span>ابدأ صح</span>
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>

          {/* ============ HALF 2 (RTL LEFT): WITHOUT US — STRESSED & SCATTERED STUDENT ============ */}
          <div
            onMouseEnter={() => setHoveredSide("without")}
            onMouseLeave={() => setHoveredSide(null)}
            className={`group/without relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] md:aspect-auto md:min-h-[410px] lg:min-h-[450px] transition-opacity duration-500 ${
              hoveredSide === "with" ? "md:opacity-80" : "opacity-100"
            }`}
          >
            {/* Top Coral/Warm Accent Hairline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px]"
              style={{
                background:
                  "linear-gradient(90deg, #e58a62 0%, rgba(229, 138, 98, 0.25) 100%)",
              }}
            />

            {/* Overwhelmed Student 3D Illustration */}
            <Image
              src="/images/landing/student-stressed.jpg"
              alt="طالب مشتت ومتوتر وسط زحمة الملفات والورق بدون المنصة"
              fill
              sizes="(max-width: 768px) 100vw, 590px"
              className="object-cover object-[50%_26%] transition-transform duration-700 ease-out group-hover/without:scale-[1.04] select-none pointer-events-none"
              draggable={false}
            />

            {/* Soft Bottom Gradient Scrim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(12, 14, 28, 0.34) 0%, rgba(12, 14, 28, 0) 28%, rgba(12, 14, 28, 0.16) 56%, rgba(10, 13, 24, 0.94) 100%)",
              }}
            />

            {/* Top Badge */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/35 bg-[#231019]/80 px-3 py-1 text-[11.5px] sm:text-[12px] font-extrabold text-[#fba899] backdrop-blur-md shadow-lg">
                <span className="w-4 h-4 rounded-full bg-rose-400/20 flex items-center justify-center">
                  <X className="w-2.5 h-2.5 text-[#fba899]" />
                </span>
                <span>من غيرنا</span>
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 lg:p-7 text-right">
              <div className="space-y-1 max-w-sm">
                <h3 className="text-[17px] sm:text-[20px] font-black text-white leading-snug">
                  تشتيت وزحمة قبل الامتحان
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-300/90 leading-relaxed">
                  جروبات تليجرام، ملفات PDF متفرقة، ومفيش وقت تجمّع المنهج.
                </p>
              </div>
            </div>
          </div>

          {/* ============ CENTER DIVIDER + FLOATING VS MEDALLION ============ */}
          {/* Vertical Divider (Desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] z-20"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.34) 50%, rgba(255,255,255,0.08) 100%)",
            }}
          />
          {/* Horizontal Divider (Mobile) */}
          <div
            aria-hidden="true"
            className="pointer-events-none md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] z-20"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.06) 100%)",
            }}
          />

          {/* Centered VS Badge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0b1322] border-2 border-white/25 text-white shadow-[0_0_26px_rgba(0,0,0,0.65)]"
          >
            <span
              dir="ltr"
              className="font-mono-code text-[12px] sm:text-[13px] font-black tracking-wider bg-gradient-to-l from-[#7ae0bc] via-white to-[#fba899] bg-clip-text text-transparent"
            >
              VS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
