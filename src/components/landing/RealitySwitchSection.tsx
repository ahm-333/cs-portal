"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileWarning,
  Layers,
  Lock,
  MessageSquareOff,
  MoveHorizontal,
  Sparkles,
  Terminal,
} from "lucide-react";

export function RealitySwitchSection() {
  // sliderPct: 0 = 100% Before (Chaos), 100 = 100% After (CS Portal)
  const [sliderPct, setSliderPct] = useState<number>(62);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const isAfterDominant = sliderPct >= 50;

  // Live interpolated readiness & search minutes
  const readinessPct = Math.round(22 + (sliderPct / 100) * 72); // 22% -> 94%
  const wastedMins = Math.round(45 - (sliderPct / 100) * 45); // 45 -> 0

  const updateFromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(4, Math.min(96, Math.round(raw)));
    setSliderPct(clamped);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="compare"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-7"
    >
      {/* Section Header + Quick Snap Presets */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="space-y-1.5">
          <span
            className="text-[12px] font-extrabold tracking-wide"
            style={{ color: "var(--accent-warm)" }}
          >
            اسحب الستارة وشوف الفرق بعينك
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            ليلة الامتحان قبل وبعد بوابة حاسبات
          </h2>
          <p
            className="text-[13.5px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            اسحب المقبض يمين وشمال للمقارنة البصرية المباشرة، أو اختار وضع سريع.
          </p>
        </div>

        {/* 3 Quick Snap Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setSliderPct(8)}
            className={`ba-preset-btn min-h-[40px] px-4 py-1.5 rounded-full text-[12px] font-extrabold cursor-pointer ${
              sliderPct <= 20 ? "active" : ""
            }`}
          >
            قبل المنصة (الفوضى)
          </button>
          <button
            type="button"
            onClick={() => setSliderPct(50)}
            className={`ba-preset-btn min-h-[40px] px-4 py-1.5 rounded-full text-[12px] font-extrabold cursor-pointer ${
              sliderPct > 20 && sliderPct < 80 ? "active" : ""
            }`}
          >
            مقارنة 50 / 50
          </button>
          <button
            type="button"
            onClick={() => setSliderPct(92)}
            className={`ba-preset-btn min-h-[40px] px-4 py-1.5 rounded-full text-[12px] font-extrabold cursor-pointer ${
              sliderPct >= 80 ? "active" : ""
            }`}
          >
            مع Ahmed Amir Ahmed
          </button>
        </div>
      </div>

      {/* INTERACTIVE BEFORE / AFTER CURTAIN REVEAL STAGE (dir="ltr" for accurate X clipping) */}
      <div
        ref={stageRef}
        dir="ltr"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="ba-stage select-none"
      >
        {/* Accessible Range Overlay for Keyboard Navigation */}
        <input
          type="range"
          min={4}
          max={96}
          value={sliderPct}
          onChange={(e) => setSliderPct(Number(e.target.value))}
          aria-label="شريط المقارنة بين المذاكرة التقليدية ومنصة بوابة حاسبات"
          className="sr-only"
        />

        {/* BASE LAYER (RIGHT SIDE): BEFORE — CHAOS DESKTOP */}
        <div className="ba-layer ba-before-calm p-4 sm:p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-[#c25e33]/15 border border-[#c25e33]/35 text-[11px] font-extrabold text-[#9e4722] dark:text-[#f0a786]">
              قبل المنصة · 14 تاب مفتوح
            </span>
            <span className="font-mono-code text-[11px] font-bold opacity-65">
              02:47 AM · ليلة الامتحان
            </span>
          </div>

          {/* Chaotic Mock Windows */}
          <div
            dir="rtl"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 max-w-4xl mx-auto w-full"
          >
            <div className="ba-calm-card rounded-2xl p-3.5 space-y-2 border-dashed">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-[#c25e33]">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Google Drive · Access Denied</span>
                </span>
                <span className="font-mono-code text-[10px]">403</span>
              </div>
              <div className="text-[12.5px] font-bold opacity-85">
                Lecture_Final_v4_NEW_REAL.pdf
              </div>
              <div className="text-[11px] opacity-65">
                &ldquo;تحتاج إلى إذن للوصول إلى هذا الملف... اطلب الإذن وانتظر!&rdquo;
              </div>
            </div>

            <div className="ba-calm-card rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                <span className="inline-flex items-center gap-1.5">
                  <FileWarning className="w-3.5 h-3.5" />
                  <span>IMG_board_blurry.jpg</span>
                </span>
                <span className="font-mono-code text-[10px]">480p</span>
              </div>
              <div
                dir="ltr"
                className="font-mono-code text-[11px] p-2 rounded-lg bg-black/5 dark:bg-white/5 blur-[0.7px] opacity-70"
              >
                Node* n = ??? ; next-&gt;head = // صورة مهزوزة
              </div>
              <div className="text-[11px] opacity-65">
                أكواد مصورة بالموبايل ومقلوبة الاتجاه بدون شرح خطوات.
              </div>
            </div>

            <div className="ba-calm-card rounded-2xl p-3.5 flex items-center justify-between gap-2 sm:col-span-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquareOff className="w-4 h-4 text-[#c25e33] shrink-0" />
                <div className="text-[12px] font-bold truncate opacity-80">
                  جروب الدفعة (1,482 رسالة غير مقروءة): &ldquo;يا جماعة هو شيت 3 داخل في الميد؟!&rdquo;
                </div>
              </div>
              <span className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded bg-[#c25e33]/15 text-[#c25e33] shrink-0">
                -45m ضايعة
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11.5px] font-bold opacity-70">
            <span>تشتت بين 5 تطبيقات</span>
            <span className="font-mono-code">Readiness: 22%</span>
          </div>
        </div>

        {/* TOP CLIPPED LAYER (LEFT SIDE): AFTER — CLEAN CS PORTAL STUDIO */}
        <div
          className="ba-layer ba-after-calm p-4 sm:p-7 flex flex-col justify-between"
          style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-[#1d6b52]/15 border border-[#1d6b52]/35 text-[11px] font-extrabold text-[#1d6b52] dark:text-[#66c7a6] inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>مع بوابة حاسبات · مكتب واحد منظم</span>
            </span>
            <span className="font-mono-code text-[11px] font-bold text-[#1d6b52] dark:text-[#66c7a6]">
              Pomodoro · 24:18
            </span>
          </div>

          {/* Clean Organized Studio Preview */}
          <div
            dir="rtl"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 max-w-4xl mx-auto w-full"
          >
            <div className="ba-calm-card rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#1e355c] dark:text-[#7ca7f0] inline-flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>كود C++ نظيف (LTR)</span>
                </span>
                <span className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded bg-[#1d6b52]/15 text-[#1d6b52] dark:text-[#66c7a6]">
                  O(1)
                </span>
              </div>
              <div
                dir="ltr"
                className="font-mono-code text-[11px] p-2.5 rounded-lg bg-[#0d131d] text-[#a7f3d0] leading-relaxed"
              >
                Node* n = new Node(val);
                <br />
                n-&gt;next = head; head = n;
              </div>
            </div>

            <div className="ba-calm-card rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#1d6b52] dark:text-[#66c7a6]">
                  تقدمك في CS-213
                </span>
                <span className="font-mono-code text-[12px] font-black text-[#1d6b52] dark:text-[#66c7a6]">
                  94%
                </span>
              </div>
              <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-l from-[#66c7a6] to-[#1e355c]" />
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10.5px] font-bold">
                <span className="px-2 py-0.5 rounded bg-[#1d6b52]/15 text-[#1d6b52] dark:text-[#66c7a6]">
                  ✓ الفيديو
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1d6b52]/15 text-[#1d6b52] dark:text-[#66c7a6]">
                  ✓ المعمل
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1d6b52]/15 text-[#1d6b52] dark:text-[#66c7a6]">
                  ✓ الكويز 100%
                </span>
              </div>
            </div>

            <div className="ba-calm-card rounded-2xl p-3.5 flex items-center justify-between gap-2 sm:col-span-2">
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#1d6b52] dark:text-[#66c7a6]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>فيديو + معمل تفاعلي + ملخص KaTeX + وضع ليلة الامتحان في صفحة واحدة</span>
              </div>
              <span className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded bg-[#1d6b52]/15 text-[#1d6b52] dark:text-[#66c7a6] shrink-0">
                0m بحث
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11.5px] font-bold text-[#1d6b52] dark:text-[#66c7a6]">
            <span>تركيز تام · حفظ محلي تلقائي</span>
            <span className="font-mono-code">Readiness: 94%</span>
          </div>
        </div>

        {/* CENTER VERTICAL DIVIDER & DRAG HANDLE */}
        <div className="ba-divider" style={{ left: `${sliderPct}%` }}>
          <div className="ba-handle" aria-hidden="true">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3 Live Morphing Metric Cards synced to sliderPct */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="spotlight-card reality-metric-card flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              وقت تجميع المصادر
            </span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfterDominant
                  ? "var(--success-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfterDominant
                  ? "var(--success-fg)"
                  : "var(--accent-warm)",
              }}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div
              className="text-3xl font-black tracking-tight tabular-nums transition-colors"
              style={{
                color: isAfterDominant
                  ? "var(--success-fg)"
                  : "var(--accent-warm)",
              }}
            >
              {wastedMins === 0 ? "0 دقيقة" : `${wastedMins} دقيقة ضايعة`}
            </div>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {isAfterDominant
                ? "كل دروس المادة وفيديوهاتها وملخصاتها في مكان واحد مرتب."
                : "توهان بين روابط Drive المقفولة وجروبات التليجرام ويوتيوب قبل أول سطر."}
            </p>
          </div>
        </div>

        <div className="spotlight-card reality-metric-card flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              أسلوب الفهم والمراجعة
            </span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfterDominant
                  ? "var(--brand-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfterDominant
                  ? "var(--brand-soft-text)"
                  : "var(--accent-warm)",
              }}
            >
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {isAfterDominant ? "فيديو + معمل + كود" : "صور وملفات جامدة"}
            </div>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {isAfterDominant
                ? "شرح عملي تفاعلي مع أكواد LTR واضحة وورقة قوانين سريعة."
                : "أكواد مصورة بالموبايل ومقلوبة الاتجاه من غير تطبيق أو شرح خطوات."}
            </p>
          </div>
        </div>

        <div className="spotlight-card reality-metric-card flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-muted)" }}
            >
              جاهزيتك قبل الامتحان
            </span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isAfterDominant
                  ? "var(--success-soft)"
                  : "var(--accent-warm-soft)",
                color: isAfterDominant
                  ? "var(--success-fg)"
                  : "var(--accent-warm)",
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2.5">
            <div
              className="text-3xl font-black font-mono-code tabular-nums transition-colors"
              style={{
                color: isAfterDominant
                  ? "var(--success-fg)"
                  : "var(--accent-warm)",
              }}
            >
              {readinessPct}%
            </div>
            <div
              className="h-2.5 w-full rounded-full overflow-hidden"
              style={{ background: "var(--bg-subtle)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${readinessPct}%`,
                  background: isAfterDominant
                    ? "var(--success-fg)"
                    : "var(--accent-warm)",
                }}
              />
            </div>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {isAfterDominant
                ? "كويزات تثبيت فورية وبنك أخطاء يخلّيك تدخل الامتحان مطمّن."
                : "مفيش تتبع للي خلّصته ولا أسئلة تتأكد بيها إنك فاهم بجد."}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Editorial Delta Strip */}
      <div
        id="realityDeltaStrip"
        className="px-4 sm:px-6 py-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-300"
        style={{
          background: isAfterDominant
            ? "var(--success-soft)"
            : "var(--accent-warm-soft)",
          borderColor: isAfterDominant
            ? "var(--success-fg)"
            : "var(--accent-warm)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--bg-surface)",
              color: isAfterDominant
                ? "var(--success-fg)"
                : "var(--accent-warm)",
            }}
            aria-hidden="true"
          >
            {isAfterDominant ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </span>
          <span
            className="text-[13px] sm:text-[13.5px] font-extrabold leading-snug"
            style={{
              color: isAfterDominant
                ? "var(--success-fg)"
                : "var(--accent-warm-text)",
            }}
          >
            {isAfterDominant
              ? "النتيجة: توفير 45 دقيقة تشتيت + قفزة +72% في جاهزيتك للامتحان"
              : "المشكلة: 45 دقيقة ضايعة قبل ما تبدأ أول سطر مذاكرة"}
          </span>
        </div>

        {isAfterDominant ? (
          <span
            className="font-mono-code text-[11px] font-extrabold px-3 py-1 rounded-xl border self-end sm:self-auto shrink-0"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--success-fg)",
            }}
          >
            -45m Search · +72% Readiness
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setSliderPct(92)}
            className="text-[12px] font-extrabold px-3.5 py-1.5 rounded-xl border self-end sm:self-auto shrink-0 cursor-pointer transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--accent-warm)",
              color: "var(--accent-warm-text)",
            }}
          >
            اسحب للمنصة فوراً ←
          </button>
        )}
      </div>
    </section>
  );
}
