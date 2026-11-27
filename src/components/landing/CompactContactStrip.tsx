"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { SITE_CONFIG, type SocialLinkItem } from "@/lib/config";
import { emitToast } from "@/lib/stores/events";
import {
  EDITORIAL_EASE,
  MaskedLineReveal,
} from "@/components/ui/AwwwardsPrimitives";

const ICON_TINT: Record<SocialLinkItem["icon"], string> = {
  send: "#38bdf8",
  "message-circle": "#6ec4a3",
  youtube: "#f87171",
  linkedin: "#93c5fd",
  github: "#e2e8f0",
};

function SocialIcon({ icon }: { icon: SocialLinkItem["icon"] }) {
  const color = ICON_TINT[icon];

  if (icon === "send") {
    return <Send className="w-3.5 h-3.5 shrink-0" style={{ color }} />;
  }
  if (icon === "message-circle") {
    return <MessageCircle className="w-3.5 h-3.5 shrink-0" style={{ color }} />;
  }
  if (icon === "youtube") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        style={{ color }}
        aria-hidden="true"
      >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        style={{ color }}
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      style={{ color }}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function CompactContactStrip() {
  const prefersReducedMotion = useReducedMotion();

  const handlePlaceholder = (label: string) => {
    emitToast(`رابط ${label} الخاص بـ ${SITE_CONFIG.name} جاهز للإضافة`);
  };

  return (
    <section
      id="community"
      className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 sm:pb-16"
    >
      <motion.div
        initial={
          prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.985 }
        }
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: prefersReducedMotion ? 0.15 : 0.65,
          ease: EDITORIAL_EASE,
        }}
        className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] border border-[#1e355c]/30 dark:border-[#d8b07a]/30 px-5 py-7 sm:px-10 sm:py-9 text-white shadow-[0_28px_66px_rgba(0,0,0,0.24)] bg-[radial-gradient(circle_at_12%_50%,rgba(194,94,51,0.22)_0%,transparent_56%),radial-gradient(circle_at_86%_20%,rgba(102,199,166,0.14)_0%,transparent_52%),linear-gradient(165deg,#1b2d4d_0%,#101c33_100%)] dark:bg-[radial-gradient(circle_at_12%_50%,rgba(216,176,122,0.14)_0%,transparent_56%),radial-gradient(circle_at_86%_18%,rgba(110,196,163,0.09)_0%,transparent_52%),linear-gradient(165deg,#171a24_0%,#0e1016_100%)]"
      >
        {/* 1px Top Specular Hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#eed2a4]/55 to-transparent"
        />

        {/* Signature Visual Echo: Architectural Swiss Dial SVG Arc (Left Edge Bookend) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 310 310"
          fill="none"
          className="pointer-events-none absolute -left-[70px] sm:-left-[65px] top-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[310px] sm:h-[310px] opacity-55 sm:opacity-90"
        >
          <circle
            cx="155"
            cy="155"
            r="140"
            className="stroke-white/[0.14] dark:stroke-[#d8b07a]/[0.16]"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          <circle
            cx="155"
            cy="155"
            r="102"
            className="stroke-white/[0.14] dark:stroke-[#d8b07a]/[0.16]"
            strokeWidth="1"
          />
          <path
            d="M 155 15 A 140 140 0 0 1 295 155"
            stroke="#d8b07a"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-9">
          {/* Copy Column */}
          <div className="max-w-[560px] flex flex-col gap-2.5 text-center lg:text-right mx-auto lg:mx-0">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-[1.5px] ring-[#d8b07a] shrink-0 bg-[#132138] shadow-sm">
                <Image
                  src="/images/founder.jpg"
                  alt="Eng. Ahmed Amir"
                  fill
                  sizes="32px"
                  className="object-cover object-[50%_15%]"
                />
              </div>
              <BrandName inverted size="lg" />
              <span
                dir="ltr"
                className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15 bg-white/[0.06] text-[#e2e8f0]/80"
              >
                AI · ZU
              </span>
            </div>

            <h2 className="text-[20px] sm:text-[28px] font-black tracking-tight leading-[1.3] text-white">
              <MaskedLineReveal>
                مساحة مذاكرة منظّمة.. تبدأ بخطوة واحدة
              </MaskedLineReveal>
            </h2>

            <p className="text-[12.5px] sm:text-[13.5px] leading-[1.7] text-[#e2e8f0]/85 dark:text-[#dcd7ce]/80">
              تصفّح مكتبة المقررات الآن، أو انضم لقنوات المراجعة والتنبيهات قبل
              الامتحانات.
            </p>
          </div>

          {/* Actions Column */}
          <div className="flex flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <Link
              href="/courses"
              className="h-[44px] sm:h-[46px] px-6 rounded-[12px] sm:rounded-[14px] text-[13.5px] sm:text-[14px] font-extrabold inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.985] bg-[linear-gradient(135deg,#c25e33_0%,#a54b24_100%)] text-white shadow-[0_10px_26px_rgba(194,94,51,0.3)] dark:bg-[linear-gradient(135deg,#d6a96c_0%,#b88749_100%)] dark:text-[#101115] dark:shadow-[0_10px_26px_rgba(214,169,108,0.26)]"
            >
              <span>تصفّح مكتبة المقررات</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </Link>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2">
              {SITE_CONFIG.socialLinks.map((item) => {
                const pillClass =
                  "px-3.5 py-2 rounded-full border border-white/15 dark:border-white/[0.11] bg-white/[0.08] dark:bg-white/[0.05] hover:bg-white/[0.14] hover:border-[#d8b07a]/45 text-[11.5px] font-bold text-white dark:text-[#f1f5f9] inline-flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer backdrop-blur-md";

                if (item.url) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={pillClass}
                    >
                      <SocialIcon icon={item.icon} />
                      <span className="font-en">{item.label}</span>
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePlaceholder(item.label)}
                    className={pillClass}
                  >
                    <SocialIcon icon={item.icon} />
                    <span className="font-en">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
