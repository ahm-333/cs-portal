"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { openFeedbackModal } from "@/lib/stores/events";

export function FinalCtaSection() {
  return (
    <section className="reveal max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="hero-shell rounded-[28px] p-6 sm:p-10 text-white text-center space-y-4 border border-white/10 shadow-lg">
        {/* Refined Circular Founder Signature Badge */}
        <div className="inline-flex items-center gap-2.5 pl-3.5 pr-1.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mx-auto">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#e58a62] shrink-0">
            <Image
              src="/images/founder.jpg"
              alt={SITE_CONFIG.instructorName}
              fill
              sizes="36px"
              className="object-cover object-[50%_15%]"
            />
          </div>
          <span className="text-[12px] sm:text-[12.5px] font-bold text-slate-100">
            بإشراف وشرح{" "}
            <span className="font-en font-extrabold text-white">
              {SITE_CONFIG.instructorName}
            </span>{" "}
            <span className="text-slate-300/90">· جامعة الزقازيق</span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
          جاهز ترتّب مذاكرتك من النهاردة؟
        </h2>
        <p className="text-[13.5px] sm:text-[15px] text-slate-200/85 max-w-xl mx-auto leading-relaxed">
          اختار فرقتك في 5 ثوانٍ، وابدأ بأول درس في مادتك بدون أي خطوات معقدة.
        </p>

        {/* Full-Width Stacked on <480px, Side-by-Side on >=480px */}
        <div className="flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center justify-center gap-3 pt-2 max-w-md min-[480px]:max-w-none mx-auto">
          <Link
            id="finalCtaProfileBtn"
            href="/courses"
            className="start-study-cta magnetic-btn cta-shimmer w-full min-[480px]:w-auto min-h-[46px] px-6 py-3 rounded-xl font-extrabold text-[14px] text-white inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            style={{ background: "#c25e33" }}
          >
            <span>ابدأ المذاكرة الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button
            id="openFeedbackBtn"
            type="button"
            onClick={() => openFeedbackModal()}
            className="w-full min-[480px]:w-auto min-h-[46px] px-5 py-3 rounded-xl font-bold text-[13.5px] bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors cursor-pointer inline-flex items-center justify-center"
          >
            اقترح مادة / بلّغ عن خطأ
          </button>
        </div>
      </div>
    </section>
  );
}
