"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Megaphone, X } from "lucide-react";
import { useTheme } from "@/components/layout/themeStore";
import { useAuthState } from "@/lib/stores/authStore";
import { usePortalState } from "@/lib/stores/portalStore";
import { EDITORIAL_EASE } from "@/components/ui/AwwwardsPrimitives";

const DISMISS_STORAGE_KEY = "cs_portal_broadcast_dismissed_v1";

interface SiteConfigAnnouncement {
  announcementEnabled?: boolean;
  announcementText?: string;
  announcementAudience?: string;
}

export interface BroadcastBannerProps {
  className?: string;
  /**
   * When mounted inside an overlay/fixed header (e.g. LandingTopbar),
   * syncs the banner's live height to `--broadcast-h` on `<html>` so
   * sibling sections can reserve exact clearance with zero overlap.
   */
  syncCssVar?: boolean;
}

function matchesAudience(
  rawAudience: string | undefined,
  studentYear: number,
  studentDept: string
): boolean {
  const audience = (rawAudience ?? "all").trim().toLowerCase();
  if (!audience || audience === "all" || audience === "everyone") {
    return true;
  }

  // Match year levels: "1".."4", "year_1", "year-2", "year3", "y4"
  const yearMatch = /^(?:year[-_]?|y)?([1-4])$/i.exec(audience);
  if (yearMatch) {
    return Number(yearMatch[1]) === studentYear;
  }

  // Match department codes if configured: "cs", "ai", "is", "it"
  const normalizedDept = studentDept.trim().toLowerCase();
  if (audience === "cs" || audience === "ai" || audience === "is" || audience === "it") {
    return audience === normalizedDept;
  }

  return true;
}

function readDismissedText(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(DISMISS_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function BroadcastBanner({
  className = "",
  syncCssVar = false,
}: BroadcastBannerProps) {
  const theme = useTheme();
  const auth = useAuthState();
  const portal = usePortalState();
  const reducedMotion = useReducedMotion() ?? false;

  const [config, setConfig] = useState<SiteConfigAnnouncement | null>(null);
  const [dismissedText, setDismissedText] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadAnnouncement() {
      try {
        const res = await fetch("/api/site-config", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as SiteConfigAnnouncement;
        if (!active || !data || typeof data !== "object") return;
        setDismissedText(readDismissedText());
        setConfig({
          announcementEnabled: Boolean(data.announcementEnabled),
          announcementText:
            typeof data.announcementText === "string" ? data.announcementText : "",
          announcementAudience:
            typeof data.announcementAudience === "string"
              ? data.announcementAudience
              : "all",
        });
      } catch {
        // Quiet graceful fallback when offline or endpoint unavailable
      }
    }

    loadAnnouncement();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const trimmedText = (config?.announcementText ?? "").trim();
  const studentYear = auth.user?.yearLevel ?? portal.profile.year;
  const studentDept = auth.user?.department ?? portal.profile.dept;

  const isVisible =
    Boolean(config?.announcementEnabled) &&
    trimmedText.length > 0 &&
    matchesAudience(config?.announcementAudience, studentYear, studentDept) &&
    dismissedText !== trimmedText;

  useLayoutEffect(() => {
    if (!syncCssVar || typeof document === "undefined") return;

    const root = document.documentElement;
    if (!isVisible) {
      root.style.setProperty("--broadcast-h", "0px");
      return;
    }

    const updateHeight = () => {
      const h = bannerRef.current?.offsetHeight ?? 0;
      root.style.setProperty("--broadcast-h", `${h}px`);
    };

    updateHeight();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && bannerRef.current) {
      observer = new ResizeObserver(updateHeight);
      observer.observe(bannerRef.current);
    }

    return () => {
      observer?.disconnect();
      root.style.setProperty("--broadcast-h", "0px");
    };
  }, [isVisible, syncCssVar, trimmedText]);

  const handleDismiss = () => {
    setDismissedText(trimmedText);
    try {
      window.sessionStorage.setItem(DISMISS_STORAGE_KEY, trimmedText);
    } catch {
      // ignore privacy-mode sessionStorage restrictions
    }
  };

  const isDark = theme === "dark";

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          ref={bannerRef}
          role="region"
          aria-label="إعلان المنصة"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: EDITORIAL_EASE }}
          className={`w-full overflow-hidden ${className}`}
        >
          <div
            className="relative w-full border-b backdrop-blur-md transition-colors duration-300"
            style={{
              background: isDark
                ? "linear-gradient(90deg, rgba(13, 15, 22, 0.96) 0%, rgba(23, 21, 18, 0.96) 50%, rgba(13, 15, 22, 0.96) 100%)"
                : "linear-gradient(90deg, #12213b 0%, #192e52 50%, #12213b 100%)",
              borderColor: isDark
                ? "rgba(216, 176, 122, 0.22)"
                : "rgba(255, 255, 255, 0.14)",
              color: isDark ? "#f6f4ef" : "#f8f6f1",
            }}
          >
            {/* Subtle top champagne hairline shimmer */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[15%] top-0 h-px"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(238, 210, 164, 0.35), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(242, 160, 122, 0.45), transparent)",
              }}
            />

            <div className="max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-1.5 sm:py-2 flex items-center justify-between gap-2.5 sm:gap-4">
              <div className="flex-1 min-w-0 flex items-center justify-center gap-2 text-center">
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0"
                  style={{
                    background: isDark
                      ? "rgba(216, 176, 122, 0.14)"
                      : "rgba(242, 160, 122, 0.16)",
                    color: isDark ? "#eed2a4" : "#f5b595",
                  }}
                >
                  <Megaphone className="w-3 h-3" strokeWidth={2.2} />
                </span>

                <p className="text-[11px] sm:text-[12.5px] font-bold leading-snug tracking-tight truncate sm:whitespace-normal">
                  {trimmedText}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="إغلاق الإعلان"
                title="إغلاق الإعلان"
                className="w-6 h-6 rounded-full inline-flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer hover:bg-white/15 active:scale-95"
                style={{
                  color: isDark
                    ? "rgba(212, 207, 197, 0.85)"
                    : "rgba(248, 246, 241, 0.82)",
                }}
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
