"use client";

import Image from "next/image";
import {
  BookOpen,
  Cpu,
  MessageCircle,
  Send,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { SITE_CONFIG, type SocialLinkItem } from "@/lib/config";
import { emitToast } from "@/lib/stores/events";

const IMPACT_METRICS = [
  {
    label: "3 مقررات أساسية",
    icon: BookOpen,
    accent: "var(--brand-primary)",
    bg: "var(--brand-soft)",
  },
  {
    label: "معامل تفاعلية حيّة",
    icon: Cpu,
    accent: "var(--success-fg)",
    bg: "var(--success-soft)",
  },
  {
    label: "مجاني وبدون باسورد",
    icon: ShieldCheck,
    accent: "var(--accent-warm-text)",
    bg: "var(--accent-warm-soft)",
  },
] as const;

function SocialIcon({
  icon,
  color,
}: {
  icon: SocialLinkItem["icon"];
  color: string;
}) {
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

export function InstructorBrandCard() {
  const handleSocialPlaceholder = (label: string) => {
    emitToast(
      `رابط ${label} الخاص بـ ${SITE_CONFIG.instructorName} جاهز للإضافة عند الإطلاق`
    );
  };

  return (
    <section
      id="instructor"
      className="reveal max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="spotlight-card surface-card rounded-[30px] p-6 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-9 lg:gap-10 items-center">
        {/* Museum-Grade Architectural Portrait Frame (aspect-[4/5]) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative group w-[240px] sm:w-[270px] md:w-full max-w-[300px] shrink-0">
            {/* Warm Ambient Studio Glow */}
            <div
              className="absolute -inset-3 rounded-[34px] opacity-65 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-90"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, rgba(194, 94, 51, 0.24), rgba(30, 53, 92, 0.16) 65%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Architectural Offset Blueprint Frame */}
            <div
              className="absolute -inset-2 -translate-x-2.5 translate-y-2.5 rounded-[28px] border border-dashed pointer-events-none transition-transform duration-300 group-hover:-translate-x-3 group-hover:translate-y-3"
              style={{
                borderColor: "var(--accent-warm)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--accent-warm-soft) 35%, transparent), transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* Minimal Architectural + Corner Registration Marks */}
            <span
              className="font-mono-code text-[11px] font-bold absolute -top-3.5 -right-3.5 select-none pointer-events-none opacity-75"
              style={{ color: "var(--accent-warm)" }}
              aria-hidden="true"
            >
              +
            </span>
            <span
              className="font-mono-code text-[11px] font-bold absolute -top-3.5 -left-3.5 select-none pointer-events-none opacity-75"
              style={{ color: "var(--brand-primary)" }}
              aria-hidden="true"
            >
              +
            </span>
            <span
              className="font-mono-code text-[11px] font-bold absolute -bottom-3.5 -right-3.5 select-none pointer-events-none opacity-75"
              style={{ color: "var(--brand-primary)" }}
              aria-hidden="true"
            >
              +
            </span>
            <span
              className="font-mono-code text-[11px] font-bold absolute -bottom-3.5 -left-3.5 select-none pointer-events-none opacity-75"
              style={{ color: "var(--accent-warm)" }}
              aria-hidden="true"
            >
              +
            </span>

            {/* Balanced 4:5 Editorial Portrait Frame */}
            <div
              className="relative aspect-[4/5] w-full rounded-[26px] overflow-hidden border-2 shadow-xl"
              style={{
                borderColor: "var(--border-strong)",
                background: "var(--hero-bg)",
              }}
            >
              <Image
                src="/images/founder.jpg"
                alt={SITE_CONFIG.instructorName}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 768px) 270px, 300px"
                className="object-cover object-[50%_16%] transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Subtle Editorial Bottom Vignette for Credential Legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b1322]/90 via-[#0b1322]/35 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Floating Frosted-Glass Credential Card */}
              <div
                className="absolute bottom-3 right-3 left-3 px-3 py-2 rounded-2xl bg-[#0e1726]/86 backdrop-blur-md border border-white/15 flex items-center justify-between gap-2 shadow-lg"
                dir="ltr"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full bg-[#66c7a6] shadow-[0_0_8px_#66c7a6] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-en text-[11px] font-extrabold text-white truncate">
                    {SITE_CONFIG.universityBadge}
                  </span>
                </div>
                <span className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/10 text-[#66c7a6] border border-white/10 shrink-0">
                  Class of AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Copy, Quote Block, Metrics & Social Links */}
        <div className="md:col-span-7 space-y-4 text-right min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>مقدّم الشرح ومؤسس المنصة</span>
            </div>
            <span
              className="font-mono-code text-[10.5px] font-bold px-2.5 py-1 rounded-full border"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-muted)",
              }}
            >
              FOUNDER &amp; INSTRUCTOR
            </span>
          </div>

          <div className="space-y-1.5">
            <h2
              className="font-en text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {SITE_CONFIG.instructorName}
            </h2>
            <p
              className="text-[14.5px] font-bold"
              style={{ color: "var(--brand-primary)" }}
            >
              طالب فرقة تانية <span className="en-pill">AI</span> — جامعة
              الزقازيق
            </p>
          </div>

          {/* Authentic Editorial Quote Block with Vertical Terracotta Accent Bar */}
          <blockquote
            className="relative pr-4 py-2.5 pl-3 rounded-2xl border-r-[3.5px] text-[13.5px] sm:text-[14px] font-bold leading-relaxed"
            style={{
              borderColor: "var(--accent-warm)",
              background: "var(--bg-canvas)",
              color: "var(--text-primary)",
            }}
          >
            &ldquo;صمّمت المساحة دي عشان تكون بديل هادي ومنظّم لفوضى المذاكرة
            قبل الامتحانات — فيديو، معمل تفاعلي، ملخص واضح، وكويز يثبّت
            الفكرة.&rdquo;
          </blockquote>

          <p
            className="text-[13px] leading-relaxed max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {SITE_CONFIG.instructorBio}
          </p>

          {/* 3 Compact Impact Metrics */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {IMPACT_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11.5px] font-extrabold"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: metric.bg,
                      color: metric.accent,
                    }}
                  >
                    <Icon className="w-3 h-3" />
                  </span>
                  <span>{metric.label}</span>
                </div>
              );
            })}
          </div>

          {/* 5 Social & Contact Buttons (Touch-Friendly min-h-[42px]) */}
          <div className="pt-1.5 space-y-2">
            <div
              className="text-[11.5px] font-bold"
              style={{ color: "var(--text-muted)" }}
            >
              التواصل والاشتراك وجروبات المتابعة:
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              {SITE_CONFIG.socialLinks.map((item, idx) => {
                const isLastOddOnMobile =
                  idx === SITE_CONFIG.socialLinks.length - 1 &&
                  SITE_CONFIG.socialLinks.length % 2 === 1;
                const sharedClass = `social-slot-btn min-h-[42px] px-3.5 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center justify-center sm:justify-start gap-2 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-warm)] hover:shadow-sm cursor-pointer ${
                  isLastOddOnMobile ? "col-span-2 sm:col-span-1" : ""
                }`;
                const sharedStyle = {
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                };

                if (item.url) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={sharedClass}
                      style={sharedStyle}
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
                    onClick={() => handleSocialPlaceholder(item.label)}
                    className={sharedClass}
                    style={sharedStyle}
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
