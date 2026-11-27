"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { usePortalState } from "@/lib/stores/portalStore";
import { SITE_CONFIG } from "@/lib/config";

const NAV_LINKS = [
  { id: "interactive-showcase", href: "#interactive-showcase", label: "الأركان" },
  { id: "compare", href: "#compare", label: "الفرق" },
  { id: "courses", href: "/courses", label: "المقررات" },
  { id: "faq", href: "#faq", label: "الأسئلة" },
  { id: "community", href: "#community", label: "التواصل" },
] as const;

export function LandingTopbar() {
  const theme = useTheme();
  const portal = usePortalState();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("interactive-showcase");

  useEffect(() => {
    const syncScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 28);

      const probeY = y + 220;
      let current = "interactive-showcase";
      for (const item of NAV_LINKS) {
        if (item.href.startsWith("/")) continue;
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + y;
        if (probeY >= top) current = item.id;
      }
      setActiveId(current);
    };

    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
    };
  }, []);

  const isDark = theme === "dark";
  const lastVisited = portal.lastVisited;

  // Dual Atelier Palette Tokens (Obsidian & Champagne vs Daylight Ivory)
  const capsuleBg = isDark
    ? isScrolled
      ? "rgba(14, 16, 22, 0.88)"
      : "rgba(16, 18, 24, 0.72)"
    : isScrolled
      ? "rgba(255, 253, 249, 0.94)"
      : "rgba(255, 253, 249, 0.82)";

  const capsuleBorder = isDark
    ? isScrolled
      ? "rgba(216, 176, 122, 0.16)"
      : "rgba(255, 244, 226, 0.09)"
    : isScrolled
      ? "rgba(30, 53, 92, 0.14)"
      : "rgba(30, 53, 92, 0.1)";

  const capsuleShadow = isDark
    ? "0 12px 32px rgba(0, 0, 0, 0.36)"
    : "0 10px 28px rgba(18, 28, 45, 0.06)";

  const pillBg = isDark
    ? "rgba(255, 245, 230, 0.055)"
    : "rgba(30, 53, 92, 0.055)";

  const activePillBg = isDark
    ? "rgba(216, 176, 122, 0.13)"
    : "rgba(30, 53, 92, 0.085)";

  const borderSoft = isDark
    ? "rgba(255, 245, 230, 0.09)"
    : "rgba(30, 53, 92, 0.11)";

  const borderMid = isDark
    ? "rgba(216, 176, 122, 0.22)"
    : "rgba(30, 53, 92, 0.16)";

  const textMain = isDark ? "#f6f4ef" : "#131c2b";
  const textSub = isDark ? "rgba(220, 215, 206, 0.82)" : "#3c485c";
  const textMuted = isDark ? "rgba(160, 155, 146, 0.78)" : "#626e82";
  const avatarRingColor = isDark ? "#d8b07a" : "#1d6b52";
  const liveDotColor = isDark ? "#6ec4a3" : "#1d6b52";

  const ctaBg = isDark
    ? "linear-gradient(135deg, #d6a96c 0%, #b88749 100%)"
    : "linear-gradient(135deg, #1e355c 0%, #132442 100%)";

  const ctaText = isDark ? "#101115" : "#ffffff";

  const ctaShadow = isDark
    ? "0 10px 26px rgba(214, 169, 108, 0.26), inset 0 1px 0 rgba(255, 250, 240, 0.35)"
    : "0 10px 24px rgba(30, 53, 92, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.16)";

  return (
    <header
      id="mainTopbar"
      className="fixed top-0 inset-x-0 z-40 px-4 md:px-7 pt-3 md:pt-4 pointer-events-none"
    >
      {/* Desktop: Floating Architectural Glass Capsule | Mobile: Ultra-Calm Minimal Header */}
      <div
        className={`pointer-events-auto mx-auto max-w-[1180px] rounded-full transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-xl border"
            : "md:backdrop-blur-xl md:border bg-transparent border-transparent shadow-none"
        }`}
        style={{
          // On desktop always glass capsule; on mobile transparent until scrolled
          ...(isScrolled
            ? {
                background: capsuleBg,
                borderColor: capsuleBorder,
                boxShadow: capsuleShadow,
              }
            : {}),
        }}
      >
        {/* Desktop-always surface wrapper so mobile stays transparent at top while md+ always shows glass capsule */}
        <div className="relative flex items-center justify-between gap-3 h-12 md:h-[58px] px-2.5 md:px-4 md:ps-3 rounded-full transition-all duration-300">
          {/* Desktop glass backdrop layer (visible on md+ even when !isScrolled) */}
          {!isScrolled && (
            <div
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute inset-0 rounded-full backdrop-blur-xl border"
              style={{
                background: capsuleBg,
                borderColor: capsuleBorder,
                boxShadow: capsuleShadow,
              }}
            />
          )}

          {/* Right (RTL Start): Founder Avatar + BrandName + CS PORTAL */}
          <a
            href="#top"
            className="relative z-10 flex items-center gap-2.5 min-w-0 group"
          >
            <div
              className="relative w-8 h-8 md:w-[34px] md:h-[34px] rounded-full overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{
                border: `1.5px solid ${avatarRingColor}`,
                boxShadow: isDark
                  ? "0 2px 10px rgba(0, 0, 0, 0.45)"
                  : "0 2px 8px rgba(18, 28, 45, 0.12)",
              }}
            >
              <Image
                src="/images/founder.jpg"
                alt={SITE_CONFIG.name}
                fill
                sizes="34px"
                className="object-cover object-[50%_15%]"
              />
            </div>

            <BrandName size="md" />

            <span
              className="hidden lg:inline-block w-px h-3.5 shrink-0"
              style={{ background: borderMid }}
              aria-hidden="true"
            />
            <span
              dir="ltr"
              className="hidden lg:inline-block font-mono-code text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap shrink-0"
              style={{ color: textMuted }}
            >
              CS PORTAL
            </span>
          </a>

          {/* Center (Desktop Only): Quiet Pill Navigation with Motion layoutId */}
          <nav
            className="relative z-10 hidden md:flex items-center gap-0.5"
            aria-label="أقسام الصفحة"
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeId === item.id;
              const linkClass =
                "relative px-3.5 py-1.5 rounded-full text-[12.5px] font-bold transition-colors whitespace-nowrap";
              const linkColor = isActive ? textMain : textSub;

              const activeIndicator = isActive ? (
                <motion.span
                  layoutId="topbarActivePill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: activePillBg,
                    border: `1px solid ${borderSoft}`,
                  }}
                />
              ) : null;

              if (item.href.startsWith("/")) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={linkClass}
                    style={{ color: linkColor }}
                  >
                    {activeIndicator}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={linkClass}
                  style={{ color: linkColor }}
                >
                  {activeIndicator}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Left (RTL End): Desktop Smart Resume/Login + Theme Toggle + Primary CTA | Mobile: Theme Toggle ONLY */}
          <div className="relative z-10 flex items-center gap-2 shrink-0">
            {/* Smart Resume Pill OR Subtle Login Link (Desktop Only) */}
            {lastVisited ? (
              <Link
                href={`/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`}
                title={`أكمل: ${lastVisited.lessonTitle}`}
                className="hidden md:inline-flex h-[34px] px-3 rounded-full items-center gap-2 text-[11.5px] font-bold transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{
                  background: pillBg,
                  border: `1px solid ${borderSoft}`,
                  color: textSub,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: liveDotColor,
                    boxShadow: `0 0 8px ${liveDotColor}`,
                  }}
                  aria-hidden="true"
                />
                <span>
                  كمّل:{" "}
                  <strong
                    dir="ltr"
                    className="font-mono-code font-bold"
                    style={{ color: textMain }}
                  >
                    {lastVisited.courseCode}
                  </strong>
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex h-[34px] px-3.5 rounded-full items-center justify-center text-[12px] font-bold transition-colors whitespace-nowrap hover:opacity-90"
                style={{
                  background: pillBg,
                  border: `1px solid ${borderSoft}`,
                  color: textSub,
                }}
              >
                دخول
              </Link>
            )}

            {/* Theme Toggle Button (Visible on BOTH Mobile and Desktop) */}
            <button
              id="themeToggleBtn"
              type="button"
              onClick={() => toggleTheme()}
              title={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
              aria-label={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              style={{
                background: pillBg,
                border: `1px solid ${borderSoft}`,
                color: textSub,
              }}
            >
              {isDark ? (
                <Sun className="w-4 h-4 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" />
              )}
            </button>

            {/* Primary CTA (Desktop Only — Mobile uses Floating Bottom Dock) */}
            <Link
              href="/courses"
              className="hidden md:inline-flex h-9 px-4 rounded-full text-[12px] font-extrabold items-center gap-1.5 whitespace-nowrap shrink-0 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: ctaBg,
                color: ctaText,
                boxShadow: ctaShadow,
              }}
            >
              <span>ابدأ المذاكرة</span>
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
