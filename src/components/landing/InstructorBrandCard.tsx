"use client";

import Image from "next/image";
import {
  BookOpen,
  Cpu,
  MessageCircle,
  Send,
  ShieldCheck,
  Terminal,
  UserCheck,
} from "lucide-react";
import { SITE_CONFIG, type SocialLinkItem } from "@/lib/config";
import { emitToast } from "@/lib/stores/events";
import { BlurText, ShinyText, TiltedCard } from "@/components/ui/ReactBits";

const SOCIAL_SUBTITLES: Record<SocialLinkItem["id"], string> = {
  telegram: "تنبيهات وملخصات",
  whatsapp: "جروب المناقشة",
  youtube: "شروحات كاملة",
  linkedin: "التواصل المهني",
  github: "الأكواد المفتوحة",
};

const IMPACT_METRICS = [
  {
    label: "3 مقررات أساسية",
    sub: "CS-213 · CS-214 · CS-311",
    icon: BookOpen,
    accent: "var(--brand-primary)",
    bg: "var(--brand-soft)",
  },
  {
    label: "معامل تفاعلية حيّة",
    sub: "محاكاة داخل المتصفح",
    icon: Cpu,
    accent: "var(--success-fg)",
    bg: "var(--success-soft)",
  },
  {
    label: "مجاني وبدون باسورد",
    sub: "خصوصية كاملة على جهازك",
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

export function InstructorBrandCard() {
  const handleSocialPlaceholder = (label: string) => {
    emitToast(
      `رابط ${label} الخاص بـ ${SITE_CONFIG.instructorName} جاهز للإضافة عند الإطلاق`
    );
  };

  return (
    <section
      id="instructor"
      className="reveal max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="spotlight-card surface-card rounded-[32px] p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* LEFT/START: University Lab ID Pass Frame (aspect-[4/5]) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-3">
          <div className="relative group w-[250px] sm:w-[280px] lg:w-full max-w-[310px] shrink-0">
            {/* Ambient Studio Glow */}
            <div
              className="absolute -inset-3 rounded-[36px] opacity-65 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-95"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, rgba(194, 94, 51, 0.26), rgba(30, 53, 92, 0.18) 65%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Offset Blueprint Dashed Frame */}
            <div
              className="absolute -inset-2 -translate-x-2.5 translate-y-2.5 rounded-[30px] border border-dashed pointer-events-none transition-transform duration-300 group-hover:-translate-x-3 group-hover:translate-y-3"
              style={{
                borderColor: "var(--accent-warm)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--accent-warm-soft) 35%, transparent), transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* Corner Registration + Coordinates */}
            <span
              className="font-mono-code text-[10px] font-bold absolute -top-5 right-0 select-none pointer-events-none opacity-70"
              style={{ color: "var(--text-muted)" }}
              aria-hidden="true"
            >
              + ZAG · 30.58°N
            </span>
            <span
              className="font-mono-code text-[10px] font-bold absolute -bottom-5 left-0 select-none pointer-events-none opacity-70"
              style={{ color: "var(--accent-warm)" }}
              aria-hidden="true"
            >
              ID // FOUNDER-01 +
            </span>

            {/* Tilted 3D University Lab Pass */}
            <TiltedCard
              className="rounded-[26px]"
              maxTiltDeg={5.5}
              scaleOnHover={1.018}
            >
              <div
                className="relative aspect-[4/5] w-full rounded-[26px] overflow-hidden border-2 shadow-xl"
                style={{
                  borderColor: "var(--border-strong)",
                  background: "var(--hero-bg)",
                }}
              >
                {/* Lanyard Slot Detail at Top */}
                <div
                  className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 w-12 h-2 rounded-full bg-[#0b1322]/70 border border-white/25 backdrop-blur-sm"
                  aria-hidden="true"
                />

                {/* Top Right Live Status Pill */}
                <div className="absolute top-3.5 right-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0e1726]/82 backdrop-blur-md border border-white/15 text-[10px] font-extrabold text-[#a7f3d0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#66c7a6] animate-pulse" />
                  <span>Active · Term 2</span>
                </div>

                <Image
                  src="/images/founder.jpg"
                  alt={SITE_CONFIG.instructorName}
                  fill
                  sizes="(max-width: 640px) 250px, (max-width: 768px) 280px, 310px"
                  className="object-cover object-[50%_16%] transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div
                  className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b1322]/92 via-[#0b1322]/40 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Frosted Credential Strip */}
                <div
                  className="absolute bottom-3 right-3 left-3 px-3 py-2.5 rounded-2xl bg-[#0e1726]/88 backdrop-blur-md border border-white/15 flex items-center justify-between gap-2 shadow-lg"
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
            </TiltedCard>
          </div>
        </div>

        {/* RIGHT/END: Bento Dossier Copy, Quote + Signature, Metrics & Rich Social Dock */}
        <div className="lg:col-span-7 space-y-5 text-right min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <ShinyText>مقدّم الشرح ومؤسس المنصة</ShinyText>
            </div>
            <span
              className="font-mono-code text-[10.5px] font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-muted)",
              }}
            >
              <Terminal className="w-3 h-3" />
              <span>FOUNDER &amp; INSTRUCTOR</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h2
              className="font-en text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              <BlurText text={SITE_CONFIG.instructorName} stagger={0.07} />
            </h2>
            <p
              className="text-[14.5px] font-bold"
              style={{ color: "var(--brand-primary)" }}
            >
              طالب فرقة تانية <span className="en-pill">AI</span> — جامعة
              الزقازيق
            </p>
          </div>

          {/* Editorial Quote Block + Minimal Vector Signature */}
          <div
            className="relative pr-4 py-3.5 pl-4 rounded-2xl border-r-[4px] space-y-2.5"
            style={{
              borderColor: "var(--accent-warm)",
              background: "var(--bg-canvas)",
            }}
          >
            <blockquote
              className="text-[13.5px] sm:text-[14.5px] font-bold leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              &ldquo;صمّمت المساحة دي عشان تكون بديل هادي ومنظّم لفوضى المذاكرة
              قبل الامتحانات — فيديو، معمل تفاعلي، ملخص واضح، وكويز يثبّت
              الفكرة.&rdquo;
            </blockquote>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span
                className="text-[11px] font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                {SITE_CONFIG.instructorBio}
              </span>
              {/* Minimalist Vector Signature Accent */}
              <svg
                width="92"
                height="24"
                viewBox="0 0 120 32"
                fill="none"
                className="shrink-0 opacity-75"
                style={{ color: "var(--accent-warm)" }}
                aria-hidden="true"
              >
                <path
                  d="M6 25 C16 6, 22 6, 26 24 M11 19 L24 17 M34 23 C38 11, 44 12, 46 22 C50 13, 56 14, 60 22 C65 18, 72 13, 78 21 C85 16, 98 15, 114 14"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 3 Bento Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {IMPACT_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="p-3 rounded-2xl border space-y-1"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: metric.bg,
                        color: metric.accent,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span
                      className="text-[12px] font-extrabold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {metric.label}
                    </span>
                  </div>
                  <div
                    className="text-[10.5px] font-semibold truncate"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {metric.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upgraded Social Channel Dock with Channel Context */}
          <div className="space-y-2 pt-0.5">
            <div
              className="text-[11.5px] font-bold"
              style={{ color: "var(--text-muted)" }}
            >
              قنوات الشرح وجروبات المتابعة:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SITE_CONFIG.socialLinks.map((item, idx) => {
                const isLastOdd =
                  idx === SITE_CONFIG.socialLinks.length - 1 &&
                  SITE_CONFIG.socialLinks.length % 2 === 1;
                const sharedClass = `social-slot-btn min-h-[52px] px-3 py-2 rounded-2xl border text-right flex items-center gap-2.5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-warm)] hover:shadow-sm cursor-pointer ${
                  isLastOdd ? "col-span-2 sm:col-span-1" : ""
                }`;
                const sharedStyle = {
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                };

                const content = (
                  <>
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--bg-surface)" }}
                    >
                      <SocialIcon icon={item.icon} color={item.color} />
                    </span>
                    <div className="min-w-0 leading-tight">
                      <div className="font-en text-[12px] font-extrabold truncate">
                        {item.label}
                      </div>
                      <div
                        className="text-[10px] font-semibold truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {SOCIAL_SUBTITLES[item.id]}
                      </div>
                    </div>
                  </>
                );

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
                      {content}
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
                    {content}
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
