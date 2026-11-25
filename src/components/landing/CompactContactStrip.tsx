"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BrandName } from "@/components/layout/BrandName";
import { SITE_CONFIG, type SocialLinkItem } from "@/lib/config";
import { emitToast } from "@/lib/stores/events";
import { MaskedLineReveal } from "@/components/ui/AwwwardsPrimitives";

function SocialIcon({
  icon,
  color,
}: {
  icon: SocialLinkItem["icon"];
  color: string;
}) {
  if (icon === "send") {
    return <Send className="w-4 h-4 shrink-0" style={{ color }} />;
  }
  if (icon === "message-circle") {
    return <MessageCircle className="w-4 h-4 shrink-0" style={{ color }} />;
  }
  if (icon === "youtube") {
    return (
      <svg
        width="16"
        height="16"
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
        width="16"
        height="16"
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
      width="16"
      height="16"
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
  const handlePlaceholder = (label: string) => {
    emitToast(`رابط ${label} الخاص بـ ${SITE_CONFIG.name} جاهز للإضافة`);
  };

  return (
    <section
      id="community"
      className="reveal max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16"
    >
      <div
        className="awwwards-beam relative overflow-hidden rounded-[32px] border border-white/12 p-7 sm:p-10 lg:p-12 text-white shadow-[0_28px_70px_rgba(8,14,26,0.34)]"
        style={{
          background:
            "linear-gradient(155deg, #070e1c 0%, #101f3b 55%, #0c172b 100%)",
        }}
      >
        {/* Architectural Blueprint Grid + Grain + Glows (Bookend Symmetry with Hero) */}
        <div
          aria-hidden="true"
          className="hero-blueprint-mesh pointer-events-none absolute inset-0 opacity-75"
        />
        <div
          aria-hidden="true"
          className="editorial-grain pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-16 w-[320px] h-[320px] rounded-full blur-3xl opacity-[0.22]"
          style={{
            background:
              "radial-gradient(circle, #c25e33 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-12 w-[320px] h-[320px] rounded-full blur-3xl opacity-[0.18]"
          style={{
            background:
              "radial-gradient(circle, #66c7a6 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 text-center lg:text-right max-w-xl mx-auto lg:mx-0">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <BrandLogo size="md" inverted />
              <BrandName inverted size="lg" />
              <span
                dir="ltr"
                className="font-mono-code text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/14 text-slate-200"
              >
                {SITE_CONFIG.universityBadge}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              <MaskedLineReveal>
                جاهز تبدأ مذاكرة منظمة من غير تشتيت؟
              </MaskedLineReveal>
            </h2>

            <p className="text-[13.5px] sm:text-[14.5px] text-slate-300/85 leading-relaxed">
              ادخل مكتبة المقررات دلوقتي أو تابع القنوات وجروبات المراجعة
              والتنبيهات قبل الامتحانات.
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-4">
            <Link
              href="/courses"
              className="magnetic-btn cta-shimmer h-12 px-7 rounded-2xl text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2.5 shadow-[0_14px_34px_rgba(194,94,51,0.38)] transition-transform hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg, #cf6739 0%, #b34f26 100%)",
              }}
            >
              <span>افتح مكتبة المقررات</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </Link>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2">
              {SITE_CONFIG.socialLinks.map((item) => {
                const cls =
                  "magnetic-btn min-h-[40px] px-3.5 py-2 rounded-xl border border-white/12 bg-white/[0.06] hover:bg-white/[0.12] hover:border-[#e58a62]/60 text-[12px] font-bold text-slate-100 inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer backdrop-blur-md";

                if (item.url) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cls}
                    >
                      <SocialIcon icon={item.icon} color={item.color} />
                      <span className="font-en">{item.label}</span>
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePlaceholder(item.label)}
                    className={cls}
                  >
                    <SocialIcon icon={item.icon} color={item.color} />
                    <span className="font-en">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
