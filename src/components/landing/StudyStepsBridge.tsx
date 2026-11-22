import { ArrowLeft, CheckCircle2, Cpu, PlayCircle, Sparkles } from "lucide-react";

const STUDY_STEPS = [
  {
    num: "01",
    tag: "UNDERSTAND",
    title: "افهم بهدوء",
    desc: "فيديو شرح متقسّم لفصول زمنية واضحة توصل منها لأي فكرة في ثانية.",
    icon: PlayCircle,
    accent: "var(--accent-warm)",
    softBg: "var(--accent-warm-soft)",
  },
  {
    num: "02",
    tag: "VISUALIZE & CODE",
    title: "طبّق وشوف الكود حي",
    desc: "معامل تفاعلية وأكواد نظيفة تشتغل قدامك خطوة بخطوة عشان الفكرة تثبت.",
    icon: Cpu,
    accent: "var(--brand-primary)",
    softBg: "var(--brand-soft)",
  },
  {
    num: "03",
    tag: "MASTER",
    title: "اختبر وثبّت قبل الامتحان",
    desc: "كويزات فورية وبنك أخطاء وورقة مراجعة ليلة الامتحان جوا كل مادة.",
    icon: CheckCircle2,
    accent: "var(--success-fg)",
    softBg: "var(--success-soft)",
  },
] as const;

export function StudyStepsBridge() {
  return (
    <section
      aria-label="خطوات المذاكرة على المنصة"
      className="relative z-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-4"
    >
      <div
        className="surface-card rounded-3xl p-5 sm:p-7 lg:p-8 shadow-[0_18px_48px_rgba(18,28,45,0.10)]"
        style={{
          borderColor: "var(--border-strong)",
        }}
      >
        {/* Top Row: Narrative Bridge from 3D Desk */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div className="space-y-1">
            <div
              className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold tracking-wide"
              style={{ color: "var(--accent-warm)" }}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>مكتبك جهز بالكامل</span>
            </div>
            <h2
              className="text-lg sm:text-2xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              المذاكرة هنا بتمشي في 3 خطوات بسيطة
            </h2>
          </div>

          <span
            className="self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-bold border shrink-0"
            style={{
              background: "var(--bg-subtle)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            بدون تسجيل · حفظ تلقائي على جهازك
          </span>
        </div>

        {/* 3 Connected Architectural Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Desktop hairline connector running behind step icons */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-[26px] right-[16%] left-[16%] h-px pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(to left, var(--border-strong) 0 6px, transparent 6px 12px)",
            }}
          />

          {STUDY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: step.softBg,
                        color: step.accent,
                      }}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span
                        className="font-mono-code text-[10px] font-extrabold tracking-wider"
                        style={{ color: step.accent }}
                      >
                        {step.num} · {step.tag}
                      </span>
                      <h3
                        className="text-[15px] sm:text-[16px] font-black mt-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {idx < STUDY_STEPS.length - 1 && (
                    <ArrowLeft
                      aria-hidden="true"
                      className="hidden md:block w-4 h-4 shrink-0 opacity-45"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </div>

                <p
                  className="text-[12.5px] leading-relaxed font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
