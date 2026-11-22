"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles, UserRound } from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { SITE_CONFIG } from "@/lib/config";
import { openFeedbackModal } from "@/lib/stores/events";
import { usePortalState } from "@/lib/stores/portalStore";
import { BlurText } from "@/components/ui/ReactBits";

export function FinalCtaSection() {
  const portal = usePortalState();
  const hasProfile = portal.profile.saved && portal.profile.name.length > 0;
  const completedCount = portal.completedLessons.length;

  const headline = hasProfile
    ? `جاهز تكمل مذاكرتك يا ${portal.profile.name}؟`
    : "جاهز ترتّب مذاكرتك من النهاردة؟";

  return (
    <section className="reveal max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div
        className="hero-shell blueprint-grid-dark rounded-[30px] p-6 sm:p-10 lg:p-12 text-white text-center space-y-5 border border-white/15 shadow-xl relative overflow-hidden"
        style={{
          backgroundColor: "#14233d",
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.055) 1px, transparent 1px), linear-gradient(135deg, #182947 0%, #0f1c32 100%)",
          backgroundSize: "28px 28px, 28px 28px, 100% 100%",
        }}
      >
        {/* Corner Architectural Coordinate Marks */}
        <span
          className="hidden sm:block font-mono-code text-[10px] font-bold text-white/30 absolute top-4 right-5 select-none pointer-events-none"
          aria-hidden="true"
        >
          CS-PORTAL // READY
        </span>
        <span
          className="hidden sm:block font-mono-code text-[10px] font-bold text-[#66c7a6]/60 absolute top-4 left-5 select-none pointer-events-none"
          aria-hidden="true"
        >
          ZERO-DB · 100% LOCAL
        </span>

        {/* Ambient Warm Radial Highlight */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[220px] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #c25e33 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Refined Founder Signature + Personalized Progress Pill */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2.5 pl-3.5 pr-1.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#e58a62] shrink-0">
              <Image
                src="/images/founder.jpg"
                alt={SITE_CONFIG.instructorName}
                fill
                sizes="32px"
                className="object-cover object-[50%_15%]"
              />
            </div>
            <span className="text-[12px] font-bold text-slate-100 inline-flex items-center gap-1.5" dir="ltr">
              <BrandName inverted size="sm" />
              <span className="text-slate-300/90 font-en">· AI · Zagazig</span>
            </span>
          </div>

          {hasProfile && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#66c7a6]/15 border border-[#66c7a6]/35 text-[11.5px] font-extrabold text-[#a7f3d0]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                الفرقة {portal.profile.year} · {portal.profile.dept}
                {completedCount > 0 ? ` · أنجزت ${completedCount} درس` : ""}
              </span>
            </div>
          )}
        </div>

        <h2 className="relative z-10 text-2xl sm:text-3xl lg:text-4xl font-black leading-snug tracking-tight">
          <BlurText key={headline} text={headline} />
        </h2>

        <p className="relative z-10 text-[13.5px] sm:text-[15px] text-slate-200/85 max-w-xl mx-auto leading-relaxed">
          {hasProfile
            ? "تقدمك وملاحظاتك وبنك أخطاءك محفوظين بأمان على جهازك — ادخل كمل من آخر درس وقفت عنده."
            : "اختار فرقتك في 5 ثوانٍ، وابدأ بأول درس في مادتك بدون باسورد أو أي خطوات معقدة."}
        </p>

        {/* Action Row */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-md sm:max-w-none mx-auto">
          <Link
            id="finalCtaProfileBtn"
            href="/courses"
            className="start-study-cta magnetic-btn cta-shimmer w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-2xl font-extrabold text-[14px] text-white inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg"
            style={{ background: "#c25e33" }}
          >
            <span>{hasProfile ? "ادخل مكتبة مقرراتك" : "ابدأ المذاكرة الآن"}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {!hasProfile && (
            <Link
              href="/login"
              className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-2xl font-bold text-[13.5px] bg-white/12 hover:bg-white/18 border border-white/20 text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              <UserRound className="w-4 h-4 text-[#f0a786]" />
              <span>إعداد كارنيه فرقتك (5 ثوانٍ)</span>
            </Link>
          )}

          <button
            id="openFeedbackBtn"
            type="button"
            onClick={() => openFeedbackModal()}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-2xl font-bold text-[13px] bg-white/[0.06] hover:bg-white/14 border border-white/15 text-slate-200 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#66c7a6]" />
            <span>اقترح مادة / بلّغ عن خطأ</span>
          </button>
        </div>
      </div>
    </section>
  );
}
