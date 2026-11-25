"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckSquare,
  Cpu,
  Eye,
  EyeOff,
  PenLine,
  PlayCircle,
  Sparkles,
} from "lucide-react";

const VIDEO_CHAPTERS = [
  {
    btnLabel: "00:00 · الفكرة الأساسية",
    title: "CS-311 · مقدمة نظم التشغيل والـ Kernel (00:00)",
    progress: "26%",
  },
  {
    btnLabel: "08:20 · الشرح العملي",
    title: "CS-311 · الـ Interrupts والـ DMA بالتفصيل (08:20)",
    progress: "62%",
  },
  {
    btnLabel: "15:10 · تريكات الميدتيرم",
    title: "CS-311 · أسئلة Dual-Mode و Timer في الامتحان (15:10)",
    progress: "92%",
  },
] as const;

const SPEED_OPTIONS = ["1.0x", "1.5x", "2.0x"] as const;

export function ExpandingToolsStrips() {
  const [activeStrip, setActiveStrip] = useState(0);

  // Strip 01: Video chapters & playback speed
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [speedIdx, setSpeedIdx] = useState(1);

  // Strip 02: Real Interactive Slide active-recall blur demo
  const [recallBlur, setRecallBlur] = useState(false);

  // Strip 03: Real Student Notebook hide/show Arabic pen notes demo
  const [showPenNotes, setShowPenNotes] = useState(true);

  // Strip 04: Real CG / OS Exam Quiz demo
  const [quizAnswer, setQuizAnswer] = useState<"ok" | "no" | null>(null);

  const activeChapterIdx = selectedChapter ?? 0;
  const videoTitle =
    selectedChapter === null
      ? "CS-311 · Chapter 1: Operating Systems (18:40)"
      : VIDEO_CHAPTERS[selectedChapter].title;
  const videoBarWidth =
    selectedChapter === null ? "38%" : VIDEO_CHAPTERS[selectedChapter].progress;

  const handleStripClick = (
    idx: number,
    e: React.MouseEvent<HTMLElement>
  ) => {
    if ((e.target as HTMLElement).closest("button")) return;
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
            اضغط على أي ركن عشان يتمدّد وتجرّب مميزات المنصة الحقيقية بنفسك —
            بدون أي زحمة.
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
        {/* STRIP 01: Video Lectures */}
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
                  فيديو شرح صافٍ ومقسّم لفصول
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

            <div
              className="p-4 rounded-2xl border space-y-3 my-2"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between gap-2 text-[12px]">
                <span
                  id="stripVidTitle"
                  className="font-extrabold truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {videoTitle}
                </span>
                <button
                  id="stripSpeedBtn"
                  type="button"
                  onClick={() =>
                    setSpeedIdx((prev) => (prev + 1) % SPEED_OPTIONS.length)
                  }
                  className="font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 cursor-pointer"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  {SPEED_OPTIONS[speedIdx]}
                </button>
              </div>

              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg-subtle)" }}
              >
                <div
                  id="stripVidBar"
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: videoBarWidth,
                    background:
                      "linear-gradient(270deg, var(--success-fg), var(--accent-warm))",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {VIDEO_CHAPTERS.map((chap, idx) => {
                  const isActive = activeChapterIdx === idx;
                  return (
                    <button
                      key={chap.btnLabel}
                      type="button"
                      onClick={() => setSelectedChapter(idx)}
                      className="sv-btn p-2 rounded-xl border text-right text-[11px] font-bold transition-all cursor-pointer truncate"
                      style={{
                        background: isActive
                          ? "var(--accent-warm-soft)"
                          : "var(--bg-surface)",
                        borderColor: isActive
                          ? "var(--accent-warm)"
                          : "var(--border-soft)",
                        color: isActive
                          ? "var(--accent-warm-text)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {chap.btnLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              مساحة عرض هادية مع مؤقت بومودورو وملاحظات خاصة بكل شابتر عشان
              تركز في الشرح بدون إعلانات أو تشتيت.
            </p>
          </div>
        </article>

        {/* STRIP 02: Interactive Slides + Active-Recall Blur */}
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
                  02 · INTERACTIVE SLIDES
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  سلايدات ملونة + تغبيش للحفظ + مسائل محلولة
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

            <div
              className={`p-4 rounded-2xl border space-y-3 my-2 ${
                recallBlur ? "recall-blur" : ""
              }`}
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  dir="ltr"
                  className="font-mono-code text-[11px] font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--brand-soft)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  CS-321 · Bresenham&apos;s Algorithm
                </span>
                <button
                  type="button"
                  onClick={() => setRecallBlur((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11.5px] font-extrabold cursor-pointer transition-colors"
                  style={{
                    background: recallBlur
                      ? "var(--success-soft)"
                      : "var(--bg-surface)",
                    borderColor: recallBlur
                      ? "var(--success-fg)"
                      : "var(--border-soft)",
                    color: recallBlur
                      ? "var(--success-fg)"
                      : "var(--text-primary)",
                  }}
                >
                  {recallBlur ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>إظهار المصطلحات</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>جرّب تغبيش الحفظ</span>
                    </>
                  )}
                </button>
              </div>

              <p
                className="text-[13px] leading-[1.95]"
                style={{ color: "var(--text-primary)" }}
              >
                خوارزمية <span className="en-term">Bresenham</span> بترسم الخط
                باستخدام <span className="hl-yellow">أعداد صحيحة فقط</span> بدون
                تقريب: بنبدأ بـ <span className="math-pill">p₀ = 2Δy − Δx</span>
                ، ولو طلع <span className="hl-cyan">سالب</span> بنثبّت الـ{" "}
                <span className="en-term">y</span>، ولو طلع{" "}
                <span className="hl-emerald">صفر أو موجب</span> بنزوّد{" "}
                <span className="math-pill">y + 1</span>.
              </p>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              تفتح بوضع التركيز الكامل تلقائياً مع هايلايت ملوّن لكل فكرة مهمة،
              وتغبيش للحفظ، وحاسبة تفاعلية لمسائل الرسوميات خطوة بخطوة.
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
                  كشكول مذاكرة مسطّر بالعامية
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
              بالعامية + Sticky Note بتريكات الامتحان + طباعة PDF بضغطة زر.
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
                  أسئلة شيتات وميدتيرم + بنك أخطاء ذكي
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
