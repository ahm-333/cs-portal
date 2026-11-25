"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { SITE_CONFIG } from "@/lib/config";
import { EDITORIAL_EASE } from "@/components/ui/AwwwardsPrimitives";

const NAV_LINKS = [
  { id: "interactive-showcase", href: "#interactive-showcase", label: "الأركان" },
  { id: "compare", href: "#compare", label: "الفرق" },
  { id: "courses", href: "/courses", label: "المقررات" },
  { id: "faq", href: "#faq", label: "الأسئلة" },
  { id: "community", href: "#community", label: "التواصل" },
] as const;

export function LandingTopbar() {
  const theme = useTheme();
  const [isOverHero, setIsOverHero] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncScroll = () => {
      const heroEl = document.getElementById("top");
      const overHero = heroEl
        ? heroEl.getBoundingClientRect().bottom > 88
        : window.scrollY < 480;
      setIsOverHero(overHero);

      const probeY = window.scrollY + 210;
      let current = "";
      for (const item of NAV_LINKS) {
        if (item.href.startsWith("/")) continue;
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
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

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const isDark = theme === "dark";

  return (
    <header
      id="mainTopbar"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ${
        isOverHero ? "px-0 pt-0" : "px-3 sm:px-5 pt-2.5"
      }`}
    >
      <div
        className={`mx-auto backdrop-blur-2xl border transition-all duration-200 ${
          isOverHero
            ? "max-w-full rounded-none border-x-0 border-t-0"
            : "max-w-[1180px] rounded-2xl md:rounded-full"
        }`}
        style={
          isOverHero
            ? {
                background: "rgba(7, 13, 25, 0.72)",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
              }
            : {
                background: isDark
                  ? "rgba(12, 18, 30, 0.86)"
                  : "rgba(255, 253, 248, 0.88)",
                borderColor: "var(--border-soft)",
                boxShadow: isDark
                  ? "0 12px 34px rgba(0, 0, 0, 0.42)"
                  : "0 12px 34px rgba(15, 23, 42, 0.08)",
              }
        }
      >
        <div
          className={`mx-auto flex items-center justify-between gap-2 sm:gap-4 transition-all duration-500 ${
            isOverHero
              ? "max-w-[1280px] px-4 sm:px-6 lg:px-8 h-14 md:h-16"
              : "px-3.5 sm:px-5 h-13 md:h-14"
          }`}
        >
          {/* Right (RTL Start): Founder Avatar + Eng. Ahmed Amir */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="mobileMenuBtn"
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isOverHero
                  ? "hover:bg-white/10"
                  : "hover:bg-[var(--bg-hover)]"
              }`}
              style={{
                color: isOverHero ? "#ffffff" : "var(--text-primary)",
              }}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 shrink-0" />
              ) : (
                <Menu className="w-4 h-4 shrink-0" />
              )}
            </button>

            <a
              href="#top"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 min-w-0 group"
            >
              <div
                className={`relative w-8 h-8 rounded-full overflow-hidden ring-2 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isOverHero ? "ring-[#e58a62]/85" : "ring-[#c25e33]"
                }`}
              >
                <Image
                  src="/images/founder.jpg"
                  alt={SITE_CONFIG.name}
                  fill
                  sizes="32px"
                  className="object-cover object-[50%_15%]"
                />
              </div>
              <BrandName inverted={isOverHero} size="md" />
              <span
                className="hidden lg:inline-block h-3.5 w-px shrink-0"
                style={{
                  background: isOverHero
                    ? "rgba(255, 255, 255, 0.18)"
                    : "var(--border-strong)",
                }}
                aria-hidden="true"
              />
              <span
                className="hidden lg:inline-block font-mono-code text-[10px] font-bold tracking-widest whitespace-nowrap shrink-0 uppercase"
                style={{
                  color: isOverHero
                    ? "rgba(148, 163, 184, 0.9)"
                    : "var(--text-muted)",
                }}
              >
                CS PORTAL
              </span>
            </a>
          </div>

          {/* Center: Sleek Recessed Pill Navigation Capsule with layoutId Spring Indicator */}
          <nav
            className="hidden md:flex items-center gap-0.5 p-1 rounded-full border transition-colors"
            style={
              isOverHero
                ? {
                    background: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(255, 255, 255, 0.09)",
                  }
                : {
                    background: "var(--bg-subtle)",
                    borderColor: "var(--border-soft)",
                  }
            }
            aria-label="أقسام الصفحة"
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeId === item.id;
              const cls = `relative px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-colors ${
                isOverHero
                  ? "hover:text-white"
                  : "hover:text-[var(--text-primary)]"
              }`;
              const textColor = isOverHero
                ? isActive
                  ? "#ffffff"
                  : "rgba(226, 232, 240, 0.78)"
                : isActive
                  ? "var(--text-primary)"
                  : "var(--text-secondary)";

              const activeBg = isActive ? (
                <motion.span
                  layoutId="topbarActivePill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full"
                  style={
                    isOverHero
                      ? { background: "rgba(255, 255, 255, 0.14)" }
                      : {
                          background: "var(--bg-surface)",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }
                  }
                />
              ) : null;

              if (item.href.startsWith("/")) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cls}
                    style={{ color: textColor }}
                  >
                    {activeBg}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              }
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cls}
                  style={{ color: textColor }}
                >
                  {activeBg}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Left (RTL End): Circular Theme Toggle + Pill Primary CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="themeToggleBtn"
              type="button"
              onClick={() => toggleTheme()}
              title="تبديل المظهر"
              aria-label={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isOverHero
                  ? "border-white/12 bg-white/[0.06] hover:bg-white/[0.14]"
                  : "hover:bg-[var(--bg-subtle)]"
              }`}
              style={
                isOverHero
                  ? { color: "rgba(226, 232, 240, 0.92)" }
                  : {
                      borderColor: "var(--border-soft)",
                      background: "var(--bg-canvas)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {isDark ? (
                <Sun className="w-4 h-4 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" />
              )}
            </button>

            <Link
              href="/courses"
              className="magnetic-btn h-9 px-3.5 sm:px-4 rounded-full text-[11.5px] sm:text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #cf6739 0%, #b5532a 100%)",
                boxShadow: "0 6px 18px rgba(194, 94, 51, 0.34)",
              }}
            >
              <span>ابدأ</span>
              <span className="hidden sm:inline">المذاكرة</span>
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Spring Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
              className="md:hidden border-t overflow-hidden rounded-b-2xl"
              style={
                isOverHero
                  ? {
                      background: "rgba(11, 19, 34, 0.96)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }
                  : {
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                    }
              }
            >
              <div className="px-4 py-3 space-y-1 max-h-[calc(100svh-4rem)] overflow-y-auto">
                {NAV_LINKS.map((item) => {
                  const cls = `block px-3 py-2.5 rounded-xl text-[13.5px] font-bold transition-colors ${
                    isOverHero
                      ? "text-white hover:bg-white/10"
                      : "hover:bg-[var(--bg-subtle)]"
                  }`;
                  const st = isOverHero
                    ? undefined
                    : { color: "var(--text-primary)" };

                  if (item.href.startsWith("/")) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cls}
                        style={st}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cls}
                      style={st}
                    >
                      {item.label}
                    </a>
                  );
                })}
                <div
                  className="pt-2 mt-1 border-t"
                  style={{
                    borderColor: isOverHero
                      ? "rgba(255, 255, 255, 0.1)"
                      : "var(--border-soft)",
                  }}
                >
                  <Link
                    href="/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-extrabold text-white"
                    style={{ background: "#c25e33" }}
                  >
                    <span>مكتبة المقررات</span>
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
