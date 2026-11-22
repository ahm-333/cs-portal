"use client";

import { MessageCircle, Send } from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
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
      className="reveal max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="surface-card rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-right space-y-0.5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <BrandName size="lg" />
            <span
              className="font-mono-code text-[10.5px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              {SITE_CONFIG.universityBadge}
            </span>
          </div>
          <p
            className="text-[12.5px]"
            style={{ color: "var(--text-secondary)" }}
          >
            تابع القنوات وجروبات المراجعة والتنبيهات قبل الامتحانات
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {SITE_CONFIG.socialLinks.map((item) => {
            const cls =
              "min-h-[40px] px-3.5 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-warm)] cursor-pointer";
            const st = {
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
                  className={cls}
                  style={st}
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
                style={st}
              >
                <SocialIcon icon={item.icon} color={item.color} />
                <span className="font-en">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
