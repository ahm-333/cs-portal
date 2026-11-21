"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { openFeedbackModal } from "@/lib/stores/events";

export function FinalCtaSection() {
  return (
    <section className="reveal max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="hero-shell rounded-[26px] p-7 sm:p-10 text-white text-center space-y-4 border border-white/10 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          جاهز ترتّب مذاكرتك من النهاردة؟
        </h2>
        <p className="text-[14px] sm:text-[15px] text-slate-200/85 max-w-xl mx-auto">
          اختار فرقتك في 5 ثوانٍ، وابدأ بأول درس في مادتك بدون أي خطوات معقدة.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            id="finalCtaProfileBtn"
            href="/courses"
            className="start-study-cta magnetic-btn cta-shimmer px-6 py-3 rounded-xl font-extrabold text-[14px] text-white inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            style={{ background: "#c25e33" }}
          >
            <span>ابدأ المذاكرة الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button
            id="openFeedbackBtn"
            type="button"
            onClick={() => openFeedbackModal()}
            className="px-5 py-3 rounded-xl font-bold text-[13.5px] bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors cursor-pointer"
          >
            اقترح مادة / بلّغ عن خطأ
          </button>
        </div>
      </div>
    </section>
  );
}
