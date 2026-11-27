"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Plus } from "lucide-react";
import {
  EDITORIAL_EASE,
  MaskedLineReveal,
} from "@/components/ui/AwwwardsPrimitives";

const FAQ_ITEMS = [
  {
    num: "01",
    q: "ماذا يحتوي كل فصل داخل المنصة؟",
    a: "كل فصل منظّم حول 4 أركان أساسية في صفحة واحدة: فيديو الشرح مقسّماً بفصول زمنية، شرح مكتوب كامل للفصل كبديل للفيديو، ملخص سريع للمراجعة قبل الامتحان، وبنك أسئلة وكويزات كثيرة بتصحيح فوري.",
  },
  {
    num: "02",
    q: "هل يمكنني تجربة المقرر قبل الاشتراك؟",
    a: "نعم، تتوفر مقررات مجانية بالكامل، كما أن الفصل الأول في المقررات المدفوعة مفتوح للمعاينة المجانية لتجرّب أسلوب الشرح والأركان الأربعة بنفسك قبل التفعيل.",
  },
  {
    num: "03",
    q: "هل أحتاج إلى إنشاء حساب لحفظ تقدّمي؟",
    a: "لا يشترط ذلك للبدء؛ تقدّمك وملاحظاتك وبنك أخطائك تُحفظ تلقائياً على جهازك، ويمكنك تسجيل الدخول في أي وقت لمزامنة تقدّمك عبر جميع أجهزتك.",
  },
  {
    num: "04",
    q: "كيف تعمل المنصة على الهاتف المحمول؟",
    a: "تم تصميم المنصة خصيصاً لتجربة الهاتف بشريط سفلي زجاجي عائم للتنقّل السريع بيد واحدة، مع عرض مريح للأكواد والمعادلات والملخصات على الشاشات الصغيرة.",
  },
] as const;

export function LandingFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="faq"
      className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-start">
        {/* Sticky Editorial Header Column (RTL Right) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-3 text-right">
          <span className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-wide text-[#c25e33] dark:text-[#d8b07a]">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-[#c25e33] dark:bg-[#d8b07a]"
            />
            <span>الأسئلة الشائعة</span>
          </span>

          <h2
            className="text-[22px] sm:text-[31px] font-black tracking-[-0.02em] leading-[1.3]"
            style={{ color: "var(--text-primary)" }}
          >
            <MaskedLineReveal>كل ما تحتاج معرفته قبل البدء</MaskedLineReveal>
          </h2>

          <p
            className="text-[13px] sm:text-[13.5px] leading-[1.75]"
            style={{ color: "var(--text-secondary)" }}
          >
            إجابات واضحة ومختصرة حول نظام المحاضرات، المعاينة المجانية، وتجربة
            الاستخدام على الهاتف.
          </p>

          <div className="pt-1.5">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12.5px] font-extrabold transition-all bg-[#1e355c]/[0.055] dark:bg-[#fff5e6]/[0.045] border-[#1e355c]/20 dark:border-[#d8b07a]/25 hover:bg-[#1e355c]/[0.09] dark:hover:bg-[#fff5e6]/[0.08] hover:border-[#c25e33]/50 dark:hover:border-[#d8b07a]/55"
              style={{ color: "var(--text-primary)" }}
            >
              <span>ابدأ المعاينة المجانية</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#c25e33] dark:text-[#d8b07a]" />
            </Link>
          </div>
        </div>

        {/* Hairline Editorial Accordion (RTL Left) */}
        <div
          className="lg:col-span-8 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.num}
                className={`relative border-b transition-[padding] duration-300 ${
                  isOpen ? "pr-4 sm:pr-[18px] pl-1" : "px-1"
                }`}
                style={{ borderColor: "var(--border-soft)" }}
              >
                {/* Animated Vertical 2.5px Accent Bar on RTL Right Edge */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      aria-hidden="true"
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { scaleY: 0, opacity: 0 }
                      }
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { scaleY: 0, opacity: 0 }
                      }
                      transition={
                        prefersReducedMotion
                          ? { duration: 0.15 }
                          : { type: "spring", stiffness: 380, damping: 28 }
                      }
                      className="pointer-events-none absolute right-0 top-3.5 bottom-3.5 w-[2.5px] rounded-full origin-top bg-[#c25e33] dark:bg-[#d8b07a]"
                    />
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="group w-full py-4 sm:py-[18px] text-right flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <span
                      dir="ltr"
                      className={`font-mono-code text-[11px] font-extrabold shrink-0 transition-colors duration-200 ${
                        isOpen
                          ? "text-[#c25e33] dark:text-[#d8b07a]"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span
                      className="text-[14px] sm:text-[15.5px] font-extrabold leading-snug transition-colors duration-200 group-hover:text-[#c25e33] dark:group-hover:text-[#eed2a4]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.q}
                    </span>
                  </div>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.12 }
                        : { type: "spring", stiffness: 340, damping: 24 }
                    }
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isOpen
                        ? "border-[#c25e33] dark:border-[#d8b07a] bg-[#c25e33]/10 dark:bg-[#d8b07a]/12 text-[#c25e33] dark:text-[#d8b07a]"
                        : "border-[var(--border-soft)] bg-[#1e355c]/[0.05] dark:bg-[#fff5e6]/[0.045] text-[var(--text-secondary)]"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0.15 : 0.34,
                        ease: EDITORIAL_EASE,
                      }}
                      className="overflow-hidden"
                    >
                      <p
                        className="pb-4 sm:pb-5 pr-6 sm:pr-7 pl-2 text-[12.5px] sm:text-[13.5px] leading-[1.8]"
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
