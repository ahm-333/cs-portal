"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Layers } from "lucide-react";

type RealityMode = "before" | "after";

export function RealitySwitchSection() {
  const [mode, setMode] = useState<RealityMode>("before");
  const isAfter = mode === "after";

  return (
    <section
      id="compare"
      className="reveal max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="space-y-1.5">
          <span
            className="text-[12px] font-extrabold tracking-wide"
            style={{ color: "var(--accent-warm)" }}
          >
            الفرق بالأرقام والواقع
          </span>
          <h2
            className="text-2xl sm:text-3xl font-black"
            style={{ color: "var(--text-primary)" }}
          >
            اختار تشوف ليلة الامتحان إزاي
          </h2>
        </div>

        {/* Tactile Editorial Mode Switch */}
        <div className="flex justify-center">
          <div
            className="reality-switch"
            role="tablist"
            aria-label="تبديل بين المذاكرة التقليدية والمنصة"
          >
            <button
              id="realityBeforeBtn"
              type="button"
              role="tab"
              aria-selected={!isAfter}
              onClick={() => setMode("before")}
              className={`reality-btn ${!isAfter ? "active-before" : ""}`}
            >
              المذاكرة التقليدية
            </button>
            <button
              id="realityAfterBtn"
              type="button"
              role="tab"
              aria-selected={isAfter}
              onClick={() => setMode("after")}
              className={`reality-btn ${isAfter ? "active-after" : ""}`}
            >
              مع Eng. Ahmed Amir
            </button>
          </div>
        </div>
      </div>

      {/* 3 Morphing Editorial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Search Time */}
        <div className="spotlight-card reality-metric-card flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              وقت تجميع المصادر
            </span>
            <div
              id="rmIcon1"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfter
                  ? "var(--success-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div
              id="rmVal1"
              className="text-3xl font-black tracking-tight transition-colors"
              style={{
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              {isAfter ? "0 دقيقة" : "45 دقيقة ضايعة"}
            </div>
            <p
              id="rmDesc1"
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {isAfter
                ? "كل دروس المادة وفيديوهاتها وملخصاتها في مكان واحد مرتب."
                : "توهان بين روابط Drive المقفولة وجروبات التليجرام ويوتيوب قبل أول سطر."}
            </p>
          </div>

          <div
            id="rmTags1"
            className="flex flex-wrap gap-1.5 text-[11px] font-bold"
          >
            {isAfter ? (
              <>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  صفحة واحدة
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  ترتيب المنهج
                </span>
              </>
            ) : (
              <>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  14 تاب مفتوح
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Drive · Telegram
                </span>
              </>
            )}
          </div>
        </div>

        {/* Card 2: Understanding Depth */}
        <div className="spotlight-card reality-metric-card flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              أسلوب الفهم والمراجعة
            </span>
            <div
              id="rmIcon2"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfter
                  ? "var(--brand-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfter
                  ? "var(--brand-soft-text)"
                  : "var(--accent-warm)",
              }}
            >
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div
              id="rmVal2"
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {isAfter ? "فيديو + تفاعلي + كشكول" : "صور وملفات جامدة"}
            </div>
            <p
              id="rmDesc2"
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {isAfter
                ? "شرح تفاعلي مع كشكول ملخص بالعامية وورقة قوانين سريعة."
                : "أكواد مصورة بالموبايل ومقلوبة الاتجاه من غير تطبيق أو شرح خطوات."}
            </p>
          </div>

          <div
            id="rmTags2"
            className="flex flex-wrap gap-1.5 text-[11px] font-bold"
          >
            {isAfter ? (
              <>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--brand-soft)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  كشكول بالعامية
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  وضع ليلة الامتحان
                </span>
              </>
            ) : (
              <>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  PDF مبعثر
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  حفظ نظري
                </span>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Exam Readiness */}
        <div className="spotlight-card reality-metric-card flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              جاهزيتك قبل الامتحان
            </span>
            <div
              id="rmIcon3"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfter
                  ? "var(--success-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2.5">
            <div
              id="rmVal3"
              className="text-3xl font-black font-mono-code transition-colors"
              style={{
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              {isAfter ? "94%" : "22%"}
            </div>
            <div
              className="h-2.5 w-full rounded-full overflow-hidden"
              style={{ background: "var(--bg-subtle)" }}
            >
              <div
                id="rmBar3"
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: isAfter ? "94%" : "22%",
                  background: isAfter
                    ? "var(--success-fg)"
                    : "var(--accent-warm)",
                }}
              />
            </div>
            <p
              id="rmDesc3"
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {isAfter
                ? "كويزات تثبيت فورية وبنك أخطاء يخلّيك تدخل الامتحان مطمّن."
                : "مفيش تتبع للي خلّصته ولا أسئلة تتأكد بيها إنك فاهم بجد."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
