"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckSquare,
  Clock,
  Cpu,
  Gauge,
  PenLine,
  PlayCircle,
  RefreshCw,
  Sparkles,
  StickyNote,
} from "lucide-react";

interface LineDemo {
  label: string;
  p0: string;
  from: [number, number];
  to: [number, number];
  pixels: readonly [number, number][];
}

const BRESENHAM_DEMOS: readonly LineDemo[] = [
  {
    label: "(0,0) → (7,4)",
    p0: "p₀ = 2(4) − 7 = +1",
    from: [0, 0],
    to: [7, 4],
    pixels: [
      [0, 0],
      [1, 1],
      [2, 1],
      [3, 2],
      [4, 2],
      [5, 3],
      [6, 3],
      [7, 4],
    ],
  },
  {
    label: "(0,0) → (7,2)",
    p0: "p₀ = 2(2) − 7 = −3",
    from: [0, 0],
    to: [7, 2],
    pixels: [
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 2],
      [7, 2],
    ],
  },
  {
    label: "(0,1) → (7,4)",
    p0: "p₀ = 2(3) − 7 = −1",
    from: [0, 1],
    to: [7, 4],
    pixels: [
      [0, 1],
      [1, 1],
      [2, 2],
      [3, 2],
      [4, 3],
      [5, 3],
      [6, 4],
      [7, 4],
    ],
  },
] as const;

const VIDEO_HIGHLIGHTS = [
  {
    Icon: Clock,
    title: "فصول زمنية دقيقة",
    desc: "تنط للجزئية اللي واقفة معاك في ثانية بدون لف.",
    accent: "var(--accent-warm)",
    softBg: "var(--accent-warm-soft)",
  },
  {
    Icon: Gauge,
    title: "تحكم كامل بدون إعلانات",
    desc: "سرعات 1.0x لـ 2.0x وشاشة هادية مريحة للعين.",
    accent: "var(--success-fg)",
    softBg: "var(--success-soft)",
  },
  {
    Icon: StickyNote,
    title: "بومودورو ونوتس جنبك",
    desc: "اكتب ملاحظاتك واحفظها على جهازك وأنت بتسمع.",
    accent: "var(--brand-primary)",
    softBg: "var(--brand-soft)",
  },
] as const;

export function ExpandingToolsStrips() {
  const [activeStrip, setActiveStrip] = useState(0);

  // Strip 02: Live Interactive Bresenham Pixel Grid Demo
  const [lineDemoIdx, setLineDemoIdx] = useState(0);
  const currentDemo = BRESENHAM_DEMOS[lineDemoIdx] ?? BRESENHAM_DEMOS[0];
  const pixelSet = new Set(currentDemo.pixels.map(([x, y]) => `${x},${y}`));

  // Strip 03: Student Notebook Pen Notes Demo
  const [showPenNotes, setShowPenNotes] = useState(true);

  // Strip 04: Real Exam Quiz Demo
  const [quizAnswer, setQuizAnswer] = useState<"ok" | "no" | null>(null);

  const handleStripClick = (
    idx: number,
    e: React.MouseEvent<HTMLElement>
  ) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    setActiveStrip(idx);
  };

  const handleStripKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLElement>
  ) => {
    if (activeStrip === idx) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveStrip(idx);
    }
  };

  const handleQuizAnswer = async (choice: "ok" | "no") => {
    setQuizAnswer(choice);
    if (choice === "ok") {
      try {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (!reducedMotion) {
          const confettiModule = await import("canvas-confetti");
          const confetti = confettiModule.default;
          confetti({
            particleCount: 42,
            spread: 58,
            origin: { y: 0.72 },
            colors: ["#c25e33", "#66c7a6", "#7ca7f0"],
          });
        }
      } catch {
        // ignore if confetti fails to load
      }
    }
  };

  return (
    <section
      id="interactive-showcase"
      className="reveal max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 space-y-7"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <span
            className="text-[12px] font-extrabold tracking-wide"
            style={{ color: "var(--accent-warm)" }}
          >
            داخل كل فصل
          </span>
          <h2
            className="text-2xl sm:text-4xl font-black tracking-tight leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            4 أركان تفتحلك مع كل خطوة مذاكرة
          </h2>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            اضغط على أي ركن عشان يتمدّد وتجرّب مميزات المنصة بنفسك — بدون أي
            زحمة.
          </p>
        </div>

        <Link
          href="/courses"
          className="start-study-cta magnetic-btn self-start md:self-auto px-5 py-2.5 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center gap-2 shadow-sm"
          style={{ background: "var(--hero-bg)" }}
        >
          <span>ادخل صفحة المواد</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Horizontal Expanding Strips Matching Our Real 4 Portal Pillars */}
      <div id="expGallery" className="exp-gallery">
        {/* STRIP 01: Video Lectures — Clean 3-Card Bento Highlights */}
        <article
          data-strip="0"
          role="region"
          aria-label="فيديو الشرح"
          tabIndex={activeStrip === 0 ? -1 : 0}
          onClick={(e) => handleStripClick(0, e)}
          onKeyDown={(e) => handleStripKeyDown(0, e)}
          className={`exp-strip ${activeStrip === 0 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--accent-warm)" }}
            >
              01
            </span>
            <span className="exp-vertical-title">فيديو الشرح</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--accent-warm)" }}
                >
                  01 · VIDEO LECTURES
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  فيديو شرح صافي ومنظم
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                01
              </span>
            </div>

            {/* Clean 3-Column Feature Cards (Zero fake player chrome) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
              {VIDEO_HIGHLIGHTS.map((item) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-2xl border space-y-2 transition-colors"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: item.softBg,
                        color: item.accent,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div
                      className="text-[13px] font-extrabold leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.title}
                    </div>
                    <p
                      className="text-[11.5px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <p
                className="text-[12.5px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                مساحة هادية تذاكر فيها المحاضرة كاملة من غير ما تتشتت في يوتيوب.
              </p>
              <Link
                href="/courses/operating-systems"
                className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-extrabold whitespace-nowrap shrink-0 hover:underline"
                style={{ color: "var(--accent-warm)" }}
              >
                <span>جرّبها الآن</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </article>

        {/* STRIP 02: Interactive Explanation — Live Bresenham Pixel Grid Visualizer */}
        <article
          data-strip="1"
          role="region"
          aria-label="الشرح التفاعلي"
          tabIndex={activeStrip === 1 ? -1 : 0}
          onClick={(e) => handleStripClick(1, e)}
          onKeyDown={(e) => handleStripKeyDown(1, e)}
          className={`exp-strip ${activeStrip === 1 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--success-fg)" }}
            >
              02
            </span>
            <span className="exp-vertical-title">الشرح التفاعلي</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--success-fg)" }}
                >
                  02 · INTERACTIVE LABS
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  شرح تفاعلي تفهمه من أول مرة
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                02
              </span>
            </div>

            {/* Live Interactive Bresenham Pixel Grid (CS-321 Real Concept!) */}
            <div
              className="p-4 rounded-2xl border my-2 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="space-y-2.5 text-right flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span
                    dir="ltr"
                    className="font-mono-code text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    CS-321 · Bresenham Live
                  </span>
                  <span
                    dir="ltr"
                    className="font-mono-code text-[11px] font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {currentDemo.label}
                  </span>
                </div>

                <div
                  dir="ltr"
                  className="font-mono-code inline-block text-[12px] font-extrabold px-3 py-1 rounded-xl border"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  {currentDemo.p0}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setLineDemoIdx((i) => (i + 1) % BRESENHAM_DEMOS.length)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-extrabold text-white cursor-pointer transition-transform active:scale-95"
                    style={{ background: "var(--success-fg)" }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>جرّب ميل خط تاني</span>
                  </button>
                </div>
              </div>

              {/* Crisp 8x5 Pixel Grid */}
              <div
                dir="ltr"
                className="grid grid-cols-8 gap-1 p-2.5 rounded-xl border shrink-0"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }}
                aria-label="شبكة رسم خط Bresenham"
              >
                {[4, 3, 2, 1, 0].map((y) =>
                  [0, 1, 2, 3, 4, 5, 6, 7].map((x) => {
                    const isLit = pixelSet.has(`${x},${y}`);
                    const isEndpoint =
                      (x === currentDemo.from[0] && y === currentDemo.from[1]) ||
                      (x === currentDemo.to[0] && y === currentDemo.to[1]);
                    return (
                      <span
                        key={`${x}-${y}`}
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-[5px] transition-all duration-300"
                        style={
                          isEndpoint
                            ? {
                                background: "var(--accent-warm)",
                                boxShadow: "0 0 10px rgba(194,94,51,0.45)",
                              }
                            : isLit
                              ? {
                                  background: "var(--success-fg)",
                                  boxShadow: "0 0 8px rgba(102,199,166,0.35)",
                                }
                              : {
                                  background: "var(--bg-subtle)",
                                }
                        }
                      />
                    );
                  })
                )}
              </div>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              تفتح بوضع التركيز الكامل تلقائياً مع سلايدات منظمة، مراجعة ذكية
              للمصطلحات، وحاسبة تفاعلية لمسائل الامتحان خطوة بخطوة.
            </p>
          </div>
        </article>

        {/* STRIP 03: Student Study Notebook Summary */}
        <article
          data-strip="2"
          role="region"
          aria-label="كشكول الملخص"
          tabIndex={activeStrip === 2 ? -1 : 0}
          onClick={(e) => handleStripClick(2, e)}
          onKeyDown={(e) => handleStripKeyDown(2, e)}
          className={`exp-strip ${activeStrip === 2 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--brand-primary)" }}
            >
              03
            </span>
            <span className="exp-vertical-title">كشكول الملخص</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--brand-primary)" }}
                >
                  03 · STUDY NOTEBOOK
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  كشكول ملخص لليلة الامتحان
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                03
              </span>
            </div>

            {/* Live Ruled Student Notebook Preview */}
            <div className="notebook-paper rounded-2xl border p-4 my-2 space-y-2.5">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-amber-500/30">
                <span
                  dir="ltr"
                  className="font-mono-code text-[10.5px] font-extrabold text-amber-700 dark:text-amber-300 inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  CS-311 · Ch.1 Notes
                </span>
                <button
                  type="button"
                  onClick={() => setShowPenNotes((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] font-extrabold cursor-pointer transition-colors"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <PenLine className="w-3 h-3 text-blue-600 dark:text-sky-400" />
                  <span>
                    {showPenNotes ? "إخفاء شرح القلم" : "إظهار شرح القلم"}
                  </span>
                </button>
              </div>

              <div className="space-y-1.5">
                <p
                  dir="ltr"
                  className="text-left text-[12.5px] sm:text-[13px] font-semibold leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span className="nb-marker-yellow font-bold">Kernel:</span>{" "}
                  The one program running at all times on the computer.
                </p>
                {showPenNotes && (
                  <p className="nb-ink-ar text-[12.5px] font-bold leading-relaxed flex items-start gap-1.5">
                    <span>✏️</span>
                    <span>
                      النواة هي «عقل النظام» اللي شغّال طول الوقت في الخلفية
                      بيدير المعالج والرامات.
                    </span>
                  </p>
                )}
              </div>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              كل سطر إنجليزي مهم معمول عليه ماركر وتحته شرحه بالقلم الأزرق
              بالعامية مع تريكات الامتحان وإمكانية طباعته PDF بضغطة زر.
            </p>
          </div>
        </article>

        {/* STRIP 04: Instant Quizzes & Mistake Bank */}
        <article
          data-strip="3"
          role="region"
          aria-label="الكويزات وبنك الأخطاء"
          tabIndex={activeStrip === 3 ? -1 : 0}
          onClick={(e) => handleStripClick(3, e)}
          onKeyDown={(e) => handleStripKeyDown(3, e)}
          className={`exp-strip ${activeStrip === 3 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--success-fg)" }}
            >
              04
            </span>
            <span className="exp-vertical-title">الكويزات والأخطاء</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--success-fg)" }}
                >
                  04 · QUIZZES &amp; MISTAKE BANK
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  كويزات فورية وبنك أخطاء
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                04
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border space-y-3 my-2"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div
                className="text-[13px] font-extrabold leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                أي خوارزمية رسم خط أسرع لأنها تعتمد على الأعداد الصحيحة فقط بدون
                تقريب (Rounding)؟
              </div>
              <div className="grid grid-cols-2 gap-2" dir="ltr">
                <button
                  type="button"
                  onClick={() => void handleQuizAnswer("ok")}
                  className="strip-q-btn px-3 py-2 rounded-xl border text-[12px] font-mono-code font-bold transition-all cursor-pointer"
                  style={
                    quizAnswer !== null
                      ? {
                          background: "var(--success-soft)",
                          borderColor: "var(--success-fg)",
                          color: "var(--text-primary)",
                        }
                      : {
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  A) Bresenham
                </button>
                <button
                  type="button"
                  onClick={() => void handleQuizAnswer("no")}
                  className="strip-q-btn px-3 py-2 rounded-xl border text-[12px] font-mono-code font-bold transition-all cursor-pointer"
                  style={
                    quizAnswer === "no"
                      ? {
                          background: "var(--accent-warm-soft)",
                          borderColor: "var(--accent-warm)",
                          color: "var(--text-primary)",
                        }
                      : {
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  B) DDA
                </button>
              </div>
              {quizAnswer !== null && (
                <div
                  id="stripQuizFb"
                  className="text-[12px] font-bold"
                  style={{
                    color:
                      quizAnswer === "ok"
                        ? "var(--success-fg)"
                        : "var(--accent-warm-text)",
                  }}
                >
                  {quizAnswer === "ok"
                    ? "عاش! Bresenham بتستخدم جمع وطرح أعداد صحيحة فقط فبتكون أسرع بكتير ✓"
                    : "الإجابة الصح Bresenham (الـ DDA فيها كسور وتقريب) — والسؤال بيتحفظلك تلقائياً في بنك الأخطاء."}
                </div>
              )}
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              تصحيح فوري مع شرح سبب الإجابة الصح، وأي سؤال تغلط فيه يتحفظ
              تلقائياً في بنك الأخطاء ووضع ليلة الامتحان.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
