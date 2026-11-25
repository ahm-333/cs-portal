"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, HelpCircle, Plus } from "lucide-react";
import { EDITORIAL_EASE, MaskedLineReveal } from "@/components/ui/AwwwardsPrimitives";

const FAQ_ITEMS = [
  {
    num: "01",
    q: "هل لازم أعمل حساب أو أسجل إيميل وباسورد عشان أبدأ؟",
    a: "لأ إطلاقاً! المنصة شغّالة بنظام Local-First: تدخل فوراً وتختار فرقتك في 5 ثوانٍ، وتقدمك ودرجات الكويزات والملاحظات وبنك الأخطاء بيتحفظوا تلقائياً على جهازك مع إمكانية تصدير واستعادة نسخة JSON في أي وقت.",
  },
  {
    num: "02",
    q: "إيه اللي هلاقيه جوه كل فصل على المنصة؟",
    a: "كل فصل متنظّم حوالين 4 أركان أساسية في شاشة واحدة: فيديو شرح للفصل، شرح تفاعلي تطبّق بيه الفكرة عملياً، ملخص منسّق بالأكواد والمعادلات للمراجعة السريعة، وكويزات وأسئلة بتصحيح فوري تثبّت اللي ذاكرته.",
  },
  {
    num: "03",
    q: "إيه الفرق بين المقررات المجانية والمدفوعة على المنصة؟",
    a: "في مقررات مجانية 100% متاحة بالكامل من غير أي قيود، أما المقررات المدفوعة فبيكون الفصل الأول فيها مفتوح مجاناً للمعاينة عشان تجرّب أسلوب الشرح والـ 4 أركان بنفسك قبل ما تفعّل المقرر بكود التفعيل.",
  },
  {
    num: "04",
    q: "هل المنصة مريحة للموبايل؟ وأقدر أقترح مادة أو أبلّغ عن خطأ؟",
    a: "متصممة Mobile-First بالكامل بشريط سفلي سريع (Bottom Dock) على الموبايل للتنقّل بين الفصول والملاحظات والبحث السريع، وكمان الأكواد والمعادلات معزولة LTR عشان متتكسرش على الشاشات الصغيرة. وتقدر في أي وقت تقترح مادة لفرقتك أو تبلّغ عن أي خطأ من زر «اقترح مادة لفرقتك» أو من صفحة المقررات.",
  },
] as const;

export function LandingFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Sticky Editorial Header Column (RTL Right) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 text-right">
          <span
            className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-wide"
            style={{ color: "var(--brand-primary)" }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>أسئلة متكررة</span>
          </span>

          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            <MaskedLineReveal>كل اللي محتاج تعرفه</MaskedLineReveal>
            <MaskedLineReveal delay={0.08}>قبل ما تبدأ</MaskedLineReveal>
          </h2>

          <p
            className="text-[13.5px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            إجابات واضحة ومباشرة عن نظام المذاكرة، المقررات المجانية، وتجربة
            الاستخدام على الموبايل.
          </p>

          <div className="pt-1">
            <Link
              href="/courses"
              className="magnetic-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12.5px] font-extrabold transition-colors hover:border-[var(--accent-warm)]"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <span>جرّب الفصل الأول مجاناً</span>
              <ArrowLeft
                className="w-3.5 h-3.5"
                style={{ color: "var(--accent-warm)" }}
              />
            </Link>
          </div>
        </div>

        {/* Numbered Spring FAQ Accordion Stack (RTL Left) */}
        <div className="lg:col-span-8 space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className={`css-scroll-card spotlight-card surface-card rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? "border-[var(--accent-warm)]" : ""
                }`}
                style={{
                  borderColor: isOpen
                    ? "var(--accent-warm)"
                    : "var(--border-soft)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4.5 text-right flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      dir="ltr"
                      className="font-mono-code text-[11.5px] font-black px-2 py-0.5 rounded-lg shrink-0 transition-colors"
                      style={{
                        background: isOpen
                          ? "var(--accent-warm-soft)"
                          : "var(--bg-subtle)",
                        color: isOpen
                          ? "var(--accent-warm)"
                          : "var(--text-muted)",
                      }}
                    >
                      {item.num}
                    </span>
                    <span
                      className="text-[14px] sm:text-[15.5px] font-extrabold leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.q}
                    </span>
                  </div>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
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
                    <Plus className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-5 pr-14 text-[13.5px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
