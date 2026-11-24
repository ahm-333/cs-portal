"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckSquare,
  Cpu,
  FileCode2,
  PlayCircle,
  Sparkles,
  X,
} from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";

interface CompareRow {
  id: string;
  pillar: string;
  Icon: typeof PlayCircle;
  withoutTitle: string;
  withoutDesc: string;
  withTitle: string;
  withDesc: string;
  accent: string;
}

const COMPARE_ROWS: readonly CompareRow[] = [
  {
    id: "video",
    pillar: "01 · الفيديو",
    Icon: PlayCircle,
    withoutTitle: "توهان بين روابط Drive وجروبات تليجرام",
    withoutDesc: "45 دقيقة ضايعة قبل أول سطر بين ملفات ناقصة وبلايليستات متفرقة.",
    withTitle: "فيديو شرح مترتّب ومقسّم لفصول زمنية",
    withDesc: "تدخل على الجزئية اللي واقفة معاك في ثانية — صفر تدوير، صفر تشتيت.",
    accent: "#f0a786",
  },
  {
    id: "interactive",
    pillar: "02 · التفاعلي",
    Icon: Cpu,
    withoutTitle: "حفظ نظري على الورق بدون فهم عملي",
    withoutDesc: "تقرأ خطوات الخوارزمية جامدة ومش شايف اللي بيحصل في الذاكرة.",
    withTitle: "شرح تفاعلي حيّ تطبّق فيه بإيدك",
    withDesc: "تشغّل الخوارزميات خطوة بخطوة قدام عينك فتثبت الفكرة من أول مرة.",
    accent: "#66c7a6",
  },
  {
    id: "summary",
    pillar: "03 · الملخص",
    Icon: FileCode2,
    withoutTitle: "صور سبورة مهزوزة وأكواد مقلوبة",
    withoutDesc: "ملفات PDF قديمة وأكواد متداخلة مع الكلام العربي صعب تراجع منها.",
    withTitle: "ملخص هندسي منسّق وأكواد LTR صافية",
    withDesc: "أكواد C++ بنسخ فوري ومعادلات KaTeX وورقة قوانين جاهزة لليلة الامتحان.",
    accent: "#7ca7f0",
  },
  {
    id: "quiz",
    pillar: "04 · الكويزات",
    Icon: CheckSquare,
    withoutTitle: "تدخل اللجنة وإنت مش متأكد إنك فاهم",
    withoutDesc: "مفيش اختبار حقيقي يقيس مستواك ولا مكان يجمّعلك الأسئلة اللي غلطت فيها.",
    withTitle: "كويزات فورية + بنك أخطاء ذكي",
    withDesc: "تصحيح لحظي بشرح لكل إجابة وأي غلط يتحفظلك تلقائياً للمراجعة قبل الامتحان.",
    accent: "#f0a786",
  },
] as const;

export function WithWithoutCompare() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [mobileSide, setMobileSide] = useState<"with" | "without">("with");

  return (
    <section
      id="compare"
      className="reveal max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6"
    >
      {/* Crisp Centered Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
          style={{
            background: "var(--accent-warm-soft)",
            color: "var(--accent-warm-text)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>الفرق ببساطة</span>
        </span>

        <h2
          className="text-2xl sm:text-3xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          بينا ومن غيرنا.. في نظرة واحدة
        </h2>
        <p
          className="text-[13.5px] sm:text-[14px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          شوف إزاي كل مشكلة بتعطّلك في المذاكرة ليها حل مباشر جوا منظومة الـ 4
          أركان.
        </p>
      </div>

      {/* Mobile Switcher Pill (< md) */}
      <div className="flex justify-center md:hidden">
        <div
          role="tablist"
          aria-label="تبديل عرض المقارنة"
          className="grid grid-cols-2 w-full max-w-[300px] items-center gap-1 p-1 rounded-2xl border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileSide === "with"}
            onClick={() => setMobileSide("with")}
            className="min-h-[38px] px-3 py-1.5 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer"
            style={
              mobileSide === "with"
                ? { background: "var(--hero-bg)", color: "#ffffff" }
                : { color: "var(--text-secondary)" }
            }
          >
            مع المنصة ✓
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileSide === "without"}
            onClick={() => setMobileSide("without")}
            className="min-h-[38px] px-3 py-1.5 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer"
            style={
              mobileSide === "without"
                ? {
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }
                : { color: "var(--text-secondary)" }
            }
          >
            من غير المنصة
          </button>
        </div>
      </div>

      {/* Unified Architectural Split Card — Matching Theme Surface on Both Halves */}
      <div
        className="surface-card rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[var(--border-soft)]"
        style={{ borderColor: "var(--border-soft)" }}
      >
        {/* RIGHT HALF (RTL Start): WITHOUT PORTAL */}
        <div
          className={`p-5 sm:p-7 flex flex-col justify-between gap-5 ${
            mobileSide === "without" ? "flex" : "hidden md:flex"
          }`}
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="space-y-4">
            <div
              className="flex items-center justify-between gap-2 pb-4 border-b"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div>
                <span
                  className="text-[11px] font-extrabold"
                  style={{ color: "var(--accent-warm)" }}
                >
                  المذاكرة التقليدية
                </span>
                <h3
                  className="text-lg sm:text-xl font-black mt-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  من غير المنصة
                </h3>
              </div>
              <span
                className="font-mono-code text-[11px] font-extrabold px-2.5 py-1 rounded-full shrink-0"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                تشتيت وتوهان
              </span>
            </div>

            <ul className="space-y-2.5">
              {COMPARE_ROWS.map((row) => {
                const isHighlighted = hoveredRow === row.id;
                return (
                  <li
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="rounded-2xl border p-3.5 transition-all duration-200"
                    style={{
                      background: isHighlighted
                        ? "var(--bg-hover)"
                        : "var(--bg-canvas)",
                      borderColor: isHighlighted
                        ? "var(--accent-warm)"
                        : "var(--border-soft)",
                      opacity: hoveredRow && !isHighlighted ? 0.62 : 1,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: "var(--accent-warm-soft)",
                          color: "var(--accent-warm-text)",
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0 space-y-0.5">
                        <div
                          className="text-[13.5px] font-extrabold leading-snug"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.withoutTitle}
                        </div>
                        <p
                          className="text-[12px] leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {row.withoutDesc}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="pt-3 border-t text-[11.5px] font-bold flex items-center justify-between"
            style={{
              borderColor: "var(--border-soft)",
              color: "var(--text-muted)",
            }}
          >
            <span>وقت أطول ومجهود متفرّق</span>
            <span className="font-mono-code opacity-75">CHAOS MODE</span>
          </div>
        </div>

        {/* LEFT HALF (RTL End): WITH PORTAL — Same Surface Color + Subtle Mint Identity */}
        <div
          className={`relative p-5 sm:p-7 flex flex-col justify-between gap-5 ${
            mobileSide === "with" ? "flex" : "hidden md:flex"
          }`}
          style={{ background: "var(--bg-surface)" }}
        >
          {/* Subtle Top Mint Accent Bar */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
            style={{
              background:
                "linear-gradient(90deg, var(--success-fg), var(--brand-primary))",
            }}
          />

          <div className="space-y-4">
            <div
              className="flex items-center justify-between gap-2 pb-4 border-b"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div>
                <span
                  className="text-[11px] font-extrabold"
                  style={{ color: "var(--success-fg)" }}
                >
                  منظومة الـ 4 أركان المنظمة
                </span>
                <div className="mt-0.5 flex items-center gap-2">
                  <h3
                    className="text-lg sm:text-xl font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    مع
                  </h3>
                  <BrandName size="md" />
                </div>
              </div>
              <span
                className="font-mono-code text-[11px] font-extrabold px-2.5 py-1 rounded-full shrink-0"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                0% تشتيت
              </span>
            </div>

            <ul className="space-y-2.5">
              {COMPARE_ROWS.map((row) => {
                const isHighlighted = hoveredRow === row.id;
                const Icon = row.Icon;
                return (
                  <li
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="rounded-2xl border p-3.5 transition-all duration-200"
                    style={{
                      background: isHighlighted
                        ? "var(--success-soft)"
                        : "var(--bg-canvas)",
                      borderColor: isHighlighted
                        ? "var(--success-fg)"
                        : "var(--border-soft)",
                      opacity: hoveredRow && !isHighlighted ? 0.65 : 1,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: "var(--success-soft)",
                          color: "var(--success-fg)",
                        }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className="text-[13.5px] font-extrabold leading-snug"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {row.withTitle}
                          </div>
                          <span
                            className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
                            style={{
                              background: "var(--bg-subtle)",
                              color: "var(--brand-primary)",
                            }}
                          >
                            <Icon className="w-3 h-3 shrink-0" />
                            <span>{row.pillar}</span>
                          </span>
                        </div>
                        <p
                          className="text-[12px] leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {row.withDesc}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="pt-3 border-t flex flex-wrap items-center justify-between gap-2"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <span
              className="text-[11.5px] font-bold"
              style={{ color: "var(--success-fg)" }}
            >
              فهم أسرع ومراجعة جاهزة لليلة الامتحان
            </span>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-[12px] font-extrabold hover:underline transition-colors"
              style={{ color: "var(--accent-warm)" }}
            >
              <span>ابدأ دلوقتي</span>
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
