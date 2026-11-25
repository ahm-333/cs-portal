"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Clock, Layers, Sparkles } from "lucide-react";
import {
  EDITORIAL_EASE,
  MaskedLineReveal,
  SpringNumber,
} from "@/components/ui/AwwwardsPrimitives";

type RealityMode = "before" | "after";

export function RealitySwitchSection() {
  const [mode, setMode] = useState<RealityMode>("before");
  const isAfter = mode === "after";

  return (
    <section
      id="compare"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-9"
    >
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <div className="space-y-2">
          <span
            className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-wide"
            style={{ color: "var(--accent-warm)" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الفرق بالأرقام والواقع</span>
          </span>
          <h2
            className="text-2xl sm:text-4xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            <MaskedLineReveal>
              اختار تشوف ليلة الامتحان إزاي
            </MaskedLineReveal>
          </h2>
        </div>

        {/* Tactile Spring-Animated Segmented Mode Switch */}
        <div className="flex justify-center">
          <div
            className="reality-switch relative"
            role="tablist"
            aria-label="تبديل بين المذاكرة التقليدية والمنصة"
          >
            <button
              id="realityBeforeBtn"
              type="button"
              role="tab"
              aria-selected={!isAfter}
              onClick={() => setMode("before")}
              className="relative px-5 sm:px-6 py-2.5 rounded-full text-[13px] font-extrabold cursor-pointer transition-colors"
              style={{
                color: !isAfter ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              {!isAfter && (
                <motion.span
                  layoutId="realityActivePill"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#c25e33",
                    boxShadow: "0 8px 22px rgba(194, 94, 51, 0.34)",
                  }}
                />
              )}
              <span className="relative z-10">المذاكرة التقليدية</span>
            </button>

            <button
              id="realityAfterBtn"
              type="button"
              role="tab"
              aria-selected={isAfter}
              onClick={() => setMode("after")}
              className="relative px-5 sm:px-6 py-2.5 rounded-full text-[13px] font-extrabold cursor-pointer transition-colors"
              style={{
                color: isAfter ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              {isAfter && (
                <motion.span
                  layoutId="realityActivePill"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #182947 0%, #1d6b52 100%)",
                    boxShadow: "0 8px 22px rgba(29, 107, 82, 0.32)",
                  }}
                />
              )}
              <span className="relative z-10">مع Eng. Ahmed Amir</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Morphing Editorial Metric Cards (CSS Scroll-Driven + Border Beam in After Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Search Time */}
        <div
          className={`css-scroll-card spotlight-card reality-metric-card flex flex-col justify-between gap-4 ${
            isAfter ? "awwwards-beam awwwards-beam-mint" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              وقت تجميع المصادر
            </span>
            <motion.div
              id="rmIcon1"
              animate={{ rotate: isAfter ? 0 : -12, scale: isAfter ? 1.06 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfter
                  ? "var(--success-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              <Clock className="w-4 h-4" />
            </motion.div>
          </div>

          <div className="space-y-1.5">
            <div
              id="rmVal1"
              className="text-3xl font-black tracking-tight transition-colors flex items-baseline gap-1.5"
              style={{
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              <SpringNumber value={isAfter ? 0 : 45} />
              <span className="text-[22px]">
                {isAfter ? "دقيقة" : "دقيقة ضايعة"}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc1-${mode}`}
                id="rmDesc1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {isAfter
                  ? "كل دروس المادة وفيديوهاتها وملخصاتها في مكان واحد مرتب."
                  : "توهان بين روابط Drive المقفولة وجروبات التليجرام ويوتيوب قبل أول سطر."}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`tags1-${mode}`}
              id="rmTags1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card 2: Understanding Depth */}
        <div
          className={`css-scroll-card spotlight-card reality-metric-card flex flex-col justify-between gap-4 ${
            isAfter ? "awwwards-beam" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              أسلوب الفهم والمراجعة
            </span>
            <motion.div
              id="rmIcon2"
              animate={{ scale: isAfter ? 1.06 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
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
            </motion.div>
          </div>

          <div className="space-y-1.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`val2-${mode}`}
                id="rmVal2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="text-2xl font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {isAfter ? "فيديو + تفاعلي + كشكول" : "صور وملفات جامدة"}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc2-${mode}`}
                id="rmDesc2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {isAfter
                  ? "شرح تفاعلي مع كشكول ملخص بالعامية وورقة قوانين سريعة."
                  : "أكواد مصورة بالموبايل ومقلوبة الاتجاه من غير تطبيق أو شرح خطوات."}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`tags2-${mode}`}
              id="rmTags2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card 3: Exam Readiness */}
        <div
          className={`css-scroll-card spotlight-card reality-metric-card flex flex-col justify-between gap-4 ${
            isAfter ? "awwwards-beam awwwards-beam-mint" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              جاهزيتك قبل الامتحان
            </span>
            <motion.div
              id="rmIcon3"
              animate={{ scale: isAfter ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfter
                  ? "var(--success-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </motion.div>
          </div>

          <div className="space-y-2.5">
            <div
              id="rmVal3"
              dir="ltr"
              className="text-3xl font-black font-mono-code transition-colors text-right"
              style={{
                color: isAfter ? "var(--success-fg)" : "var(--accent-warm)",
              }}
            >
              <SpringNumber value={isAfter ? 94 : 22} suffix="%" />
            </div>

            <div
              className="h-2.5 w-full rounded-full overflow-hidden"
              style={{ background: "var(--bg-subtle)" }}
            >
              <motion.div
                id="rmBar3"
                className="h-full rounded-full"
                initial={false}
                animate={{
                  width: isAfter ? "94%" : "22%",
                }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 22,
                }}
                style={{
                  background: isAfter
                    ? "linear-gradient(90deg, #66c7a6 0%, #1d6b52 100%)"
                    : "linear-gradient(90deg, #e58a62 0%, #c25e33 100%)",
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={`desc3-${mode}`}
                id="rmDesc3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {isAfter
                  ? "كويزات تثبيت فورية وبنك أخطاء يخلّيك تدخل الامتحان مطمّن."
                  : "مفيش تتبع للي خلّصته ولا أسئلة تتأكد بيها إنك فاهم بجد."}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
