"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  CornerDownLeft,
  Eye,
  EyeOff,
  FileText,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

type StepId = 1 | 2 | 3;

const STEPS: ReadonlyArray<{
  id: StepId;
  num: string;
  title: string;
  mobileTitle: string;
  subtitle: string;
  accent: string;
  soft: string;
}> = [
  {
    id: 1,
    num: "01",
    title: "افهم من السلايد",
    mobileTitle: "السلايد",
    subtitle: "شرح تفاعلي بالهايلايت وتغبيش للحفظ",
    accent: "#2563eb",
    soft: "rgba(37, 99, 235, 0.12)",
  },
  {
    id: 2,
    num: "02",
    title: "راجع الملخص بالعامية",
    mobileTitle: "الملخص",
    subtitle: "كل سطر إنجليزي وتحته شرحه ببساطة",
    accent: "#059669",
    soft: "rgba(5, 150, 105, 0.12)",
  },
  {
    id: 3,
    num: "03",
    title: "حل سؤال ميدتيرم",
    mobileTitle: "الميدتيرم",
    subtitle: "أسئلة شيتات وامتحانات بتصحيح فوري",
    accent: "#c25e33",
    soft: "rgba(194, 94, 51, 0.13)",
  },
];

const DEMO_SUMMARY_POINTS = [
  {
    en: "Bresenham's Advantage: Uses ONLY integer addition, subtraction, and bit-shift (×2) — zero floating-point division.",
    ar: "السر إن Bresenham أسرع بكتير: كلها جمع وطرح أعداد صحيحة بس، من غير أي كسور أو تقريب.",
  },
  {
    en: "Decision Rule (p_k): If p_k < 0 keep y and add 2Δy; if p_k ≥ 0 increment y+1 and add (2Δy − 2Δx).",
    ar: "القاعدة الذهبية للجدول: لو p_k سالب ثبّت y واجمع 2Δy، ولو صفر أو موجب زوّد y+1 واجمع 2Δy − 2Δx.",
  },
] as const;

const DEMO_QUESTION = {
  badge: "Midterm 2025 · CS-321",
  question:
    "In Bresenham's line algorithm (0 < m < 1), what is the initial decision parameter p₀?",
  options: [
    "p₀ = Δy − 2Δx",
    "p₀ = 2Δy − Δx",
    "p₀ = 2Δx − Δy",
    "p₀ = 1 − r",
  ],
  correctIdx: 1,
  explanation:
    "الإجابة الصح هي p₀ = 2Δy − Δx — بنبدأ بيها من النقطة اليسرى (x₀, y₀) ومنها نحدد أول بكسل بدون أي عمليات كسرية!",
} as const;

export function LiveChapterPreview() {
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [blurRecall, setBlurRecall] = useState(false);
  const [showArabic, setShowArabic] = useState(true);
  const [pickedOpt, setPickedOpt] = useState<number | null>(null);

  // Keep cross-section jump compatibility from Desktop Hero pillar links
  useEffect(() => {
    const onExternalSelect = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (detail === "video" || detail === "interactive") setActiveStep(1);
      else if (detail === "summary") setActiveStep(2);
      else if (detail === "quiz") setActiveStep(3);
    };
    window.addEventListener("cs-portal-select-preview-tab", onExternalSelect);
    return () =>
      window.removeEventListener(
        "cs-portal-select-preview-tab",
        onExternalSelect
      );
  }, []);

  const currentMeta = STEPS.find((s) => s.id === activeStep) ?? STEPS[0];
  const isCorrect = pickedOpt === DEMO_QUESTION.correctIdx;

  return (
    <section
      id="chapter-preview"
      className="reveal max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-5 sm:space-y-7"
    >
      {/* Clean Minimal Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
          style={{
            background: "var(--brand-soft)",
            color: "var(--brand-soft-text)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>مسار المذاكرة في المنصة</span>
        </span>

        <h2
          className="text-[20px] sm:text-3xl font-black tracking-tight leading-snug text-balance"
          style={{ color: "var(--text-primary)" }}
        >
          3 خطوات بسيطة.. تقفّل بيهم أي فصل
        </h2>

        <p
          className="text-[12.5px] sm:text-[14.5px] leading-relaxed text-balance"
          style={{ color: "var(--text-secondary)" }}
        >
          اضغط على كل خطوة وجرّب أسلوب المذاكرة الحقيقي جوا المنصة.
        </p>
      </div>

      {/* 3-Step Horizontal Stepper (Single Clean Row on Mobile & Desktop) */}
      <div
        role="tablist"
        aria-label="خطوات المذاكرة الثلاثة"
        className="grid grid-cols-3 gap-2 sm:gap-3"
      >
        {STEPS.map((step) => {
          const active = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveStep(step.id)}
              className="group relative rounded-2xl border p-2.5 sm:p-4 text-center sm:text-right transition-all duration-200 cursor-pointer"
              style={{
                background: active ? "var(--bg-surface)" : "var(--bg-canvas)",
                borderColor: active ? step.accent : "var(--border-soft)",
                boxShadow: active ? "var(--shadow-card)" : "none",
              }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3">
                <span
                  className="font-mono-code w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-[11.5px] sm:text-[12px] font-black shrink-0 transition-colors"
                  style={
                    active
                      ? { background: step.accent, color: "#ffffff" }
                      : { background: step.soft, color: step.accent }
                  }
                >
                  {step.num}
                </span>

                <div className="min-w-0">
                  <div
                    className="sm:hidden text-[11.5px] font-extrabold leading-tight"
                    style={{
                      color: active
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {step.mobileTitle}
                  </div>
                  <div
                    className="hidden sm:block text-[14px] font-black leading-snug"
                    style={{
                      color: active
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {step.title}
                  </div>
                  <p
                    className="hidden md:block mt-0.5 text-[11.5px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Single Calm Interactive Showcase Surface (Zero Nested Box Soup!) */}
      <div
        className="surface-card rounded-2xl sm:rounded-3xl overflow-hidden transition-all"
        style={{
          borderTopWidth: "3px",
          borderTopColor: currentMeta.accent,
        }}
      >
        <div className="p-4 sm:p-7">
          {/* ---------------- STEP 1: REAL INTERACTIVE SLIDE ---------------- */}
          {activeStep === 1 && (
            <div
              key="step-1"
              className={`chapter-viewer ${blurRecall ? "recall-blur" : ""} space-y-4`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code rounded-lg bg-blue-500/12 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-700 dark:text-blue-300">
                    CS-321 · Slide 15
                  </span>
                  <span
                    className="text-[12px] font-bold hidden sm:inline"
                    style={{ color: "var(--text-muted)" }}
                  >
                    مثال حقيقي من الشرح التفاعلي
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setBlurRecall((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11.5px] font-bold transition-colors cursor-pointer ${
                    blurRecall
                      ? "border-violet-500/40 bg-violet-500/15 text-violet-700 dark:text-violet-300"
                      : "border-[var(--border-soft)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]"
                  }`}
                >
                  {blurRecall ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {blurRecall ? "إظهار الهايلايت" : "جرّب تغبيش الحفظ"}
                  </span>
                </button>
              </div>

              <div className="space-y-3">
                <h3
                  dir="ltr"
                  className="font-en text-left text-[15.5px] sm:text-[17.5px] font-black text-[var(--text-primary)]"
                >
                  Bresenham&apos;s Decision Parameter (p_k)
                </h3>

                <p className="text-[13.5px] sm:text-[14.5px] leading-[1.9] text-[var(--text-primary)]">
                  فكرة خوارزمية{" "}
                  <span className="en-term">Bresenham</span> إنها بتختار أقرب
                  بكسل للخط باستخدام{" "}
                  <span className="hl-yellow">أعداد صحيحة فقط (Integers)</span>{" "}
                  من غير أي كسور أو تقريب! بنبدأ بمعامل القرار{" "}
                  <span className="math-pill">p₀ = 2Δy − Δx</span>، ولو طلع{" "}
                  <span className="hl-cyan">سالب (p_k &lt; 0)</span> بنثبّت الـ{" "}
                  <span className="en-term">y</span>، ولو طلع{" "}
                  <span className="hl-emerald">صفر أو موجب (p_k ≥ 0)</span>{" "}
                  بنزوّد <span className="math-pill">y + 1</span>.
                </p>

                {blurRecall ? (
                  <p className="text-[11.5px] font-semibold text-violet-600 dark:text-violet-300">
                    👆 مرّر الماوس أو اضغط على أي جزء مغبّش عشان تتأكد من حفظك!
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-soft)]">
                <span className="text-[11.5px] font-semibold text-[var(--text-muted)]">
                  خطوة 1 من 3 · فهم بالهايلايت
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-extrabold text-white transition-opacity hover:opacity-95 cursor-pointer"
                  style={{ background: "#2563eb" }}
                >
                  <span>التالي: شوف الملخص</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 2: 1-TO-1 BILINGUAL SUMMARY ---------------- */}
          {activeStep === 2 && (
            <div key="step-2" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/12 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
                    <FileText className="w-3 h-3" />
                    <span>ملخص 1 لـ 1 (إنجليزي + عامية)</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowArabic((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] px-3 py-1.5 text-[11.5px] font-bold text-[var(--text-secondary)] cursor-pointer"
                >
                  {showArabic ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  <span>{showArabic ? "إخفاء العامية" : "إظهار العامية"}</span>
                </button>
              </div>

              <div className="space-y-3">
                {DEMO_SUMMARY_POINTS.map((pt, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-canvas)]"
                  >
                    <div
                      dir="ltr"
                      className="flex items-start gap-2.5 px-3.5 py-3 text-left"
                    >
                      <span className="font-mono-code mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-[10.5px] font-black text-white">
                        {idx + 1}
                      </span>
                      <p className="font-en text-[13px] sm:text-[13.5px] font-semibold leading-[1.7] text-[var(--text-primary)]">
                        {pt.en}
                      </p>
                    </div>
                    {showArabic ? (
                      <div
                        dir="rtl"
                        className="flex items-start gap-2 border-t border-[var(--border-soft)] bg-emerald-500/[0.06] px-3.5 py-2.5 text-right text-[12.5px] font-medium leading-relaxed text-[var(--text-secondary)]"
                      >
                        <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{pt.ar}</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-soft)]">
                <span className="text-[11.5px] font-semibold text-[var(--text-muted)]">
                  خطوة 2 من 3 · مراجعة منظمة
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-extrabold text-white transition-opacity hover:opacity-95 cursor-pointer"
                  style={{ background: "#059669" }}
                >
                  <span>التالي: جرّب سؤال ميدتيرم</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3: REAL MIDTERM QUESTION ---------------- */}
          {activeStep === 3 && (
            <div key="step-3" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono-code inline-flex items-center gap-1.5 rounded-lg bg-amber-500/12 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-800 dark:text-amber-300">
                  <Target className="w-3.5 h-3.5" />
                  <span>{DEMO_QUESTION.badge}</span>
                </span>

                {pickedOpt !== null ? (
                  <button
                    type="button"
                    onClick={() => setPickedOpt(null)}
                    className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>إعادة</span>
                  </button>
                ) : null}
              </div>

              <h3
                dir="ltr"
                className="font-en text-left text-[14.5px] sm:text-[16.5px] font-black leading-relaxed text-[var(--text-primary)]"
              >
                {DEMO_QUESTION.question}
              </h3>

              <div dir="ltr" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_QUESTION.options.map((opt, idx) => {
                  const answered = pickedOpt !== null;
                  const isRight = idx === DEMO_QUESTION.correctIdx;
                  const isChosen = pickedOpt === idx;

                  let style: React.CSSProperties = {
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  };

                  if (answered) {
                    if (isRight) {
                      style = {
                        background: "var(--success-soft)",
                        borderColor: "var(--success-fg)",
                        color: "var(--success-fg)",
                      };
                    } else if (isChosen) {
                      style = {
                        background: "var(--accent-warm-soft)",
                        borderColor: "var(--accent-warm)",
                        color: "var(--accent-warm-text)",
                      };
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={answered}
                      onClick={() => setPickedOpt(idx)}
                      className={`font-mono-code flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-[13px] font-bold transition-all ${
                        answered
                          ? "cursor-default"
                          : "cursor-pointer hover:border-[var(--border-strong)]"
                      }`}
                      style={style}
                    >
                      <span>{opt}</span>
                      {answered && isRight ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : null}
                      {answered && isChosen && !isRight ? (
                        <XCircle className="w-4 h-4 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {pickedOpt !== null ? (
                <div
                  className="rounded-xl border px-3.5 py-3 text-[12.5px] sm:text-[13px] font-semibold leading-relaxed"
                  style={{
                    background: isCorrect
                      ? "var(--success-soft)"
                      : "var(--accent-warm-soft)",
                    borderColor: isCorrect
                      ? "var(--success-fg)"
                      : "var(--accent-warm)",
                    color: "var(--text-primary)",
                  }}
                >
                  <div className="flex items-center gap-1.5 font-black mb-1">
                    <BookOpenCheck className="w-4 h-4 shrink-0" />
                    <span>{isCorrect ? "إجابة صح! عاش عليك" : "قريبة! بص على الصح:"}</span>
                  </div>
                  <p>{DEMO_QUESTION.explanation}</p>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-soft)]">
                <span className="text-[11.5px] font-semibold text-[var(--text-muted)]">
                  خطوة 3 من 3 · تثبيت بالميدتيرم
                </span>
                <Link
                  href="/courses/computer-graphics"
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-extrabold text-white transition-opacity hover:opacity-95"
                  style={{ background: "#c25e33" }}
                >
                  <span>جرّب المادة كاملة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
