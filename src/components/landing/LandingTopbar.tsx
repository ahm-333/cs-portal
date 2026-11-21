"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { SITE_CONFIG } from "@/lib/config";

const NAV_LINKS = [
  { href: "#interactive-showcase", label: "أدوات المادة" },
  { href: "#compare", label: "الفرق الحقيقي" },
  { href: "#instructor", label: "عن المحاضر" },
] as const;

export function LandingTopbar() {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncNavbarReveal = () => {
      const cinemaEl = document.getElementById("desk-assembly");
      if (!cinemaEl) {
        setIsVisible(true);
        return;
      }
      const rect = cinemaEl.getBoundingClientRect();
      const pastCinema = rect.bottom <= 110;
      setIsVisible(pastCinema);
      if (!pastCinema) {
        setMobileMenuOpen(false);
      }
    };

    syncNavbarReveal();
    window.addEventListener("scroll", syncNavbarReveal, { passive: true });
    window.addEventListener("resize", syncNavbarReveal, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncNavbarReveal);
      window.removeEventListener("resize", syncNavbarReveal);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const isDark = theme === "dark";

  return (
    <header
      id="mainTopbar"
      className={`topbar-shell fixed top-0 inset-x-0 z-40 ${
        isVisible ? "" : "topbar-hidden"
      }`}
    >
      <div className="max-w-[1220px] mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand + Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <button
            id="mobileMenuBtn"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden min-w-[42px] min-h-[42px] p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-colors shrink-0"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobileNavDrawer"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          <a
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 sm:gap-2.5 text-right min-w-0"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ background: "var(--hero-bg)" }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
                <path d="M9 12l2 2 4-4" />
                <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
              </svg>
            </div>
            <div className="leading-tight min-w-0">
              <div
                className="font-en font-extrabold text-[14.5px] sm:text-[15px] tracking-tight truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {SITE_CONFIG.name}
              </div>
              <div
                className="text-[10.5px] font-semibold truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {SITE_CONFIG.arabicName}
              </div>
            </div>
          </a>
        </div>

        {/* Center Pill Nav (Desktop >= 1024px) */}
        <nav
          className="hidden lg:flex items-center gap-1 p-1 rounded-2xl border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
          }}
          aria-label="أقسام الصفحة"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link px-3.5 py-1.5 rounded-xl text-[13px] font-semibold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Left Controls: Theme + Magnetic Start CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="themeToggleBtn"
            type="button"
            onClick={() => toggleTheme()}
            className="flex items-center justify-center gap-1.5 px-3 min-h-[40px] rounded-xl border text-[12px] font-semibold transition-colors cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
            title="تبديل الوضع الفاتح والداكن"
            aria-label={
              isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"
            }
          >
            {isDark ? (
              <Sun
                className="w-4 h-4"
                style={{ color: "var(--brand-primary)" }}
              />
            ) : (
              <Moon
                className="w-4 h-4"
                style={{ color: "var(--brand-primary)" }}
              />
            )}
            <span className="hidden sm:inline">
              {isDark ? "فاتح" : "داكن"}
            </span>
          </button>

          <Link
            href="/courses"
            className="start-study-cta magnetic-btn px-3.5 sm:px-4 min-h-[40px] rounded-xl text-[12px] sm:text-[12.5px] font-extrabold text-white flex items-center gap-1.5 shadow-sm"
            style={{ background: "#c25e33" }}
          >
            <span>ابدأ المذاكرة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Sleek Frosted Glass Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobileNavDrawer"
          className="lg:hidden border-t px-4 py-3.5 flex flex-col gap-1.5 backdrop-blur-xl shadow-xl"
          style={{
            background: "color-mix(in srgb, var(--bg-surface) 94%, transparent)",
            borderColor: "var(--border-soft)",
          }}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link nav-link min-h-[44px] px-3.5 py-2.5 rounded-xl text-[13.5px] font-bold flex items-center justify-between"
            >
              <span>{item.label}</span>
              <ArrowLeft
                className="w-3.5 h-3.5 opacity-60"
                style={{ color: "var(--text-muted)" }}
              />
            </a>
          ))}

          <div
            className="pt-2 mt-1 border-t"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl text-[13px] font-extrabold text-white flex items-center justify-center gap-2 shadow-sm"
              style={{ background: "#c25e33" }}
            >
              <span>ابدأ المذاكرة ←</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
