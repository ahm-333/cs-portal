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
    a: "كل فصل منظّم حول 4 أركان أساسية في مساحة مذاكرة واحدة: «فيديو الشرح» مقسّماً بفصول زمنية واضحة، «اقرأ الفصل» كشرح مكتوب كامل بالرسومات والأكواد كبديل للفيديو، «ملخص سريع» للمراجعة في دقائق قبل الامتحان، و«أسئلة وكويزات» بتصحيح فوري وبنك أخطاء تلقائي — بالإضافة إلى المساعد الذكي (AI) الجانبي داخل كل فصل للإجابة عن أي نقطة غير واضحة وأنت تذاكر.",
  },
  {
    num: "02",
    q: "كيف أجرّب المادة وأشترك في المواد المدفوعة؟",
    a: "تتوفر مواد مجانية بالكامل، كما أن الفصل الأول مفتوح مجاناً للتجربة في كل مادة مدفوعة لتتأكد من أسلوب الشرح بنفسك قبل الاشتراك. للاشتراك الكامل يتم التحويل عبر فودافون كاش أو InstaPay ثم إرسال بيانات التحويل من داخل المنصة، لتتم مراجعة الطلب وتفعيل المادة على حسابك فوراً.",
  },
  {
    num: "03",
    q: "كيف يُحفظ تقدّمي؟ وما سياسة الأجهزة للحساب؟",
    a: "حسابك شخصي وتُحفظ عليه تلقائياً جميع الفصول المكتملة ودرجات الكويزات وملاحظاتك وبنك أخطائك دون أي خطوات إضافية. يمكنك استخدام حسابك من جهازين (مثل الهاتف واللابتوب)، مع عدم إمكانية التشغيل المتزامن على جهازين في نفس الوقت حفاظاً على المحتوى.",
  },
  {
    num: "04",
    q: "كيف أبلّغ عن خطأ أو أقترح إضافة مادة جديدة؟",
    a: "يمكنك من داخل المنصة (عبر صفحة المواد أو صفحة حسابك) فتح نافذة التواصل مباشرة لاقتراح مادة جديدة، أو التبليغ عن أي خطأ أو مشكلة تقنية، أو إرسال رسالة مباشرة لم. أحمد، وتصلنا رسالتك فوراً للمراجعة والرد.",
  },
  {
    num: "05",
    q: "كيف تعمل المنصة على الهاتف المحمول؟",
    a: "تم تصميم المنصة لتجربة هاتف مريحة بشريط تنقّل سفلي ثابت للوصول السريع للمواد ومتابعة آخر فصل بيد واحدة، مع عرض واضح للأكواد والمعادلات والملخصات والمساعد الذكي على الشاشات الصغيرة.",
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
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: prefersReducedMotion ? 0.15 : 0.55,
            ease: EDITORIAL_EASE,
          }}
          className="lg:col-span-4 lg:sticky lg:top-28 space-y-3 text-right"
        >
          <span className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-wide text-[#c25e33] dark:text-[#d8b07a]">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-[#c25e33] dark:bg-[#d8b07a]"
            />
            <span>الأسئلة الشائعة</span>
          </span>

          <h2 className="text-[22px] sm:text-[31px] font-black tracking-[-0.02em] leading-[1.3] text-[#14233d] dark:text-[#f6f4ef]">
            <MaskedLineReveal>كل ما تحتاج معرفته قبل البدء</MaskedLineReveal>
          </h2>

          <p className="text-[13px] sm:text-[13.5px] leading-[1.75] text-[#3c485c] dark:text-[#d4cfc5]">
            إجابات واضحة ومختصرة حول أركان المذاكرة الأربعة، نظام الاشتراك،
            سياسة الحساب والأجهزة، وطريقة التواصل معنا.
          </p>

          <div className="pt-1.5">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12.5px] font-extrabold transition-all duration-200 hover:-translate-y-0.5 bg-white/80 dark:bg-[#fff5e6]/[0.045] border-[#1e355c]/20 dark:border-[#d8b07a]/25 text-[#14233d] dark:text-[#f6f4ef] shadow-[0_2px_10px_rgba(20,35,61,0.05)] dark:shadow-none hover:bg-white dark:hover:bg-[#d8b07a]/[0.09] hover:border-[#c25e33]/55 dark:hover:border-[#d8b07a]/55 hover:shadow-[0_8px_22px_rgba(20,35,61,0.09)] dark:hover:shadow-[0_8px_22px_rgba(216,176,122,0.1)]"
            >
              <span>استكشف المواد المتاحة</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#c25e33] dark:text-[#d8b07a] transition-transform duration-200 group-hover:-translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Hairline Editorial Accordion (RTL Left) */}
        <div className="lg:col-span-8 border-t border-[#1e355c]/14 dark:border-[#fff5e6]/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={item.num}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: prefersReducedMotion ? 0.15 : 0.48,
                  delay: prefersReducedMotion ? 0 : idx * 0.06,
                  ease: EDITORIAL_EASE,
                }}
                className={`relative border-b border-[#1e355c]/14 dark:border-[#fff5e6]/10 transition-[padding,background-color] duration-300 ${
                  isOpen
                    ? "pr-4 sm:pr-[18px] pl-2 bg-white/55 dark:bg-[#d8b07a]/[0.03]"
                    : "px-2 hover:bg-[#1e355c]/[0.035] dark:hover:bg-[#d8b07a]/[0.035]"
                }`}
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
                      className="pointer-events-none absolute right-0 top-3 bottom-3 w-[2.5px] rounded-full origin-top bg-[#c25e33] dark:bg-[#d8b07a]"
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
                          : "text-[#626e82] dark:text-[#989389] group-hover:text-[#c25e33] dark:group-hover:text-[#d8b07a]"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span
                      className={`text-[14px] sm:text-[15.5px] font-extrabold leading-snug transition-colors duration-200 ${
                        isOpen
                          ? "text-[#14233d] dark:text-[#f6f4ef]"
                          : "text-[#14233d] dark:text-[#f6f4ef] group-hover:text-[#c25e33] dark:group-hover:text-[#eed2a4]"
                      }`}
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
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? "border-[#c25e33] dark:border-[#d8b07a] bg-[#c25e33]/12 dark:bg-[#d8b07a]/14 text-[#c25e33] dark:text-[#d8b07a] ring-2 ring-[#c25e33]/15 dark:ring-[#d8b07a]/15"
                        : "border-[#1e355c]/16 dark:border-[#fff5e6]/12 bg-white/70 dark:bg-[#fff5e6]/[0.045] text-[#3c485c] dark:text-[#d4cfc5] group-hover:border-[#c25e33]/60 dark:group-hover:border-[#d8b07a]/60 group-hover:bg-[#c25e33]/10 dark:group-hover:bg-[#d8b07a]/12 group-hover:text-[#c25e33] dark:group-hover:text-[#d8b07a] group-hover:ring-2 group-hover:ring-[#c25e33]/15 dark:group-hover:ring-[#d8b07a]/15"
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
                      <p className="pb-4 sm:pb-5 pr-6 sm:pr-7 pl-2 text-[12.5px] sm:text-[13.5px] leading-[1.8] text-[#3c485c] dark:text-[#d4cfc5]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
