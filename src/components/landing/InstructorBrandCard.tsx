"use client";

import Image from "next/image";
import { MessageCircle, Send, UserCheck } from "lucide-react";
import { SITE_CONFIG, type SocialLinkItem } from "@/lib/config";
import { emitToast } from "@/lib/stores/events";

function SocialIcon({
  icon,
  color,
}: {
  icon: SocialLinkItem["icon"];
  color: string;
}) {
  if (icon === "send") {
    return <Send className="w-3.5 h-3.5" style={{ color }} />;
  }
  if (icon === "message-circle") {
    return <MessageCircle className="w-3.5 h-3.5" style={{ color }} />;
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
      className="reveal max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="spotlight-card surface-card rounded-[28px] p-6 sm:p-8 lg:p-9 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Portrait (Full Uncropped Container Matching Exact Photo Proportions) */}
        <div className="md:col-span-4 flex justify-center">
          <div
            className="relative w-52 sm:w-60 rounded-[26px] overflow-hidden border-2 shadow-xl shrink-0"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <Image
              src="/images/founder.jpg"
              alt={SITE_CONFIG.instructorName}
              width={502}
              height={900}
              sizes="(max-width: 640px) 208px, 240px"
              className="w-full h-auto block"
            />
            <div className="absolute bottom-2.5 right-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-[#0e1726]/82 backdrop-blur-md border border-white/15 text-center">
              <span className="font-en text-[10.5px] font-bold text-[#66c7a6]">
                {SITE_CONFIG.universityBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Bio & Social Links Feature */}
        <div className="md:col-span-8 space-y-4 text-right">
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

          <div className="space-y-1.5">
            <h2
              className="font-en text-2xl sm:text-3xl font-black tracking-tight"
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

          <p
            className="text-[13.5px] leading-relaxed max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {SITE_CONFIG.instructorBio}
          </p>

          {/* Social & Contact Links Feature */}
          <div className="pt-2 space-y-2">
            <div
              className="text-[11.5px] font-bold"
              style={{ color: "var(--text-muted)" }}
            >
              التواصل والاشتراك وجروبات المتابعة:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {SITE_CONFIG.socialLinks.map((item) => {
                const sharedClass =
                  "social-slot-btn px-3.5 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer";
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
