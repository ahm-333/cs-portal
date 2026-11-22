"use client";

import { Check, Sparkles, X } from "lucide-react";

const WITHOUT_ITEMS = [
  {
    title: "45 دقيقة ضايعة قبل أول سطر",
    desc: "توهان بين روابط Drive المقفولة وجروبات التليجرام وبلايليستات ناقصة.",
  },
  {
    title: "صور سبورة مهزوزة وأكواد مقلوبة",
    desc: "ملفات PDF قديمة وأكواد متداخلة مع الكلام العربي صعب تراجع منها.",
  },
  {
    title: "مفيش خطة ولا ترتيب واضح",
    desc: "تدخل ليلة الامتحان مش عارف خلّصت قد إيه ولا باقي عليك إيه.",
  },
  {
    title: "حفظ نظري بدون اختبار حقيقي",
    desc: "مفيش معمل تطبّق فيه ولا كويزات تتأكد بيها إنك فاهم بجد.",
  },
] as const;

const WITH_ITEMS = [
  {
    title: "0 دقيقة تشتيت — كل حاجة في صفحة واحدة",
    desc: "فيديو الشرح، الملخص، المعمل، والكويز مترتّبين حسب المنهج بالظبط.",
  },
  {
    title: "أكواد LTR صافية ومعادلات واضحة",
    desc: "أكواد C++ بنسخ فوري، معادلات KaTeX، وورقة قوانين لليلة الامتحان.",
  },
  {
    title: "خطة يومية وعدّاد تلقائي للامتحان",
    desc: "يحسبلك محتاج تذاكر كام درس في اليوم ويحفظ تقدمك تلقائياً على جهازك.",
  },
  {
    title: "معمل تفاعلي + كويزات وبنك أخطاء",
    desc: "طبّق الخوارزميات بإيدك وأي سؤال غلط يتحفظلك للمراجعة قبل اللجنة.",
  },
] as const;

export function ScrollChaosCompare() {
  return (
    <section
      id="chaos-compare"
      className="reveal max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8"
    >
      {/* Calm, Simple Centered Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-wide"
          style={{ color: "var(--accent-warm)" }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>الفرق ببساطة</span>
        </span>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          بينا ومن غيرنا... في ثواني
        </h2>
        <p
          className="text-[14px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          مقارنة واضحة ومباشرة بين المذاكرة التقليدية ومساحتك هنا.
        </p>
      </div>

      {/* Simple, Ultra-Clean 2-Column Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Column 1: Without Portal */}
        <div
          className="surface-card rounded-[26px] p-6 sm:p-7 space-y-5"
          style={{ borderColor: "var(--border-soft)" }}
        >
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
              className="font-mono-code text-[11px] font-extrabold px-2.5 py-1 rounded-full"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              -45m تشتيت
            </span>
          </div>

          <ul className="space-y-4">
            {WITHOUT_ITEMS.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </span>
                <div className="space-y-0.5">
                  <div
                    className="text-[14px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </div>
                  <p
                    className="text-[12.5px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: With Portal (Elevated Accent Border) */}
        <div
          className="surface-card rounded-[26px] p-6 sm:p-7 space-y-5"
          style={{
            borderColor: "var(--success-fg)",
            boxShadow: "var(--shadow-hover)",
          }}
        >
          <div
            className="flex items-center justify-between gap-2 pb-4 border-b"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <div>
              <span
                className="text-[11px] font-extrabold"
                style={{ color: "var(--success-fg)" }}
              >
                بوابة حاسبات المنظمة
              </span>
              <h3
                className="text-lg sm:text-xl font-black mt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                مع المنصة
              </h3>
            </div>
            <span
              className="font-mono-code text-[11px] font-extrabold px-2.5 py-1 rounded-full"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              جاهزية 94%
            </span>
          </div>

          <ul className="space-y-4">
            {WITH_ITEMS.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                </span>
                <div className="space-y-0.5">
                  <div
                    className="text-[14px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </div>
                  <p
                    className="text-[12.5px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
