"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "هل لازم أعمل حساب أو أسجل إيميل وباسورد عشان أبدأ؟",
    a: "لأ إطلاقاً! المنصة شغّالة بنظام Local-First: تدخل فوراً وتختار فرقتك في 5 ثوانٍ، وتقدمك ودرجات الكويزات والملاحظات وبنك الأخطاء بيتحفظوا تلقائياً على جهازك مع إمكانية تصدير واستعادة نسخة JSON في أي وقت.",
  },
  {
    q: "إيه اللي هلاقيه جوه كل فصل على المنصة؟",
    a: "كل فصل متنظّم حوالين 4 أركان أساسية في شاشة واحدة: فيديو شرح للفصل، شرح تفاعلي تطبّق بيه الفكرة عملياً، ملخص منسّق بالأكواد والمعادلات للمراجعة السريعة، وكويزات وأسئلة بتصحيح فوري تثبّت اللي ذاكرته.",
  },
  {
    q: "إيه الفرق بين المقررات المجانية والمدفوعة على المنصة؟",
    a: "في مقررات مجانية 100% متاحة بالكامل من غير أي قيود، أما المقررات المدفوعة فبيكون الفصل الأول فيها مفتوح مجاناً للمعاينة عشان تجرّب أسلوب الشرح والـ 4 أركان بنفسك قبل ما تفعّل المقرر بكود التفعيل.",
  },
  {
    q: "هل المنصة مريحة للموبايل؟ وأقدر أقترح مادة أو أبلّغ عن خطأ؟",
    a: "متصممة Mobile-First بالكامل بشريط سفلي سريع (Bottom Dock) على الموبايل للتنقّل بين الفصول والملاحظات والبحث السريع، وكمان الأكواد والمعادلات معزولة LTR عشان متتكسرش على الشاشات الصغيرة. وتقدر في أي وقت تقترح مادة لفرقتك أو تبلّغ عن أي خطأ من زر «اقترح مادة لفرقتك» أو من صفحة المقررات.",
  },
] as const;

export function LandingFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="reveal max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
    >
      <div className="text-center space-y-1.5">
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-wide"
          style={{ color: "var(--brand-primary)" }}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>أسئلة متكررة</span>
        </span>
        <h2
          className="text-2xl sm:text-3xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          كل اللي محتاج تعرفه قبل ما تبدأ
        </h2>
      </div>

      <div className="space-y-2.5">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className={`faq-item surface-card rounded-2xl overflow-hidden ${
                isOpen ? "open" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full px-5 py-4 text-right flex items-center justify-between gap-3 cursor-pointer"
              >
                <span
                  className="text-[14px] sm:text-[15px] font-extrabold leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.q}
                </span>
                <span
                  className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: isOpen
                      ? "var(--accent-warm-soft)"
                      : "var(--bg-canvas)",
                    borderColor: isOpen
                      ? "var(--accent-warm)"
                      : "var(--border-soft)",
                    color: isOpen
                      ? "var(--accent-warm)"
                      : "var(--text-secondary)",
                  }}
                >
                  <ChevronDown className="faq-chevron w-4 h-4 transition-transform duration-200" />
                </span>
              </button>

              <div className="faq-content">
                <div className="faq-inner">
                  <p
                    className="px-5 pb-4 text-[13px] sm:text-[13.5px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
