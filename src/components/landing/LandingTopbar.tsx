"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { SITE_CONFIG } from "@/lib/config";

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

  const isDark = theme === "dark";

  return (
    <header
      id="mainTopbar"
      className={`topbar-shell fixed top-0 inset-x-0 z-40 ${
        isVisible ? "" : "topbar-hidden"
      }`}
    >
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <button
            id="mobileMenuBtn"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl border cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
            aria-label="القائمة"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobileNavDrawer"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          <a href="#top" className="flex items-center gap-2.5 text-right">
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
            <div className="leading-tight">
              <div
                className="font-en font-extrabold text-[15px] tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {SITE_CONFIG.name}
              </div>
              <div
                className="text-[10.5px] font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                {SITE_CONFIG.arabicName}
              </div>
            </div>
          </a>
        </div>

        {/* Center Pill Nav */}
        <nav
          className="hidden lg:flex items-center gap-1 p-1 rounded-2xl border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
          }}
          aria-label="أقسام الصفحة"
        >
          <a
            href="#interactive-showcase"
            className="nav-link px-3.5 py-1.5 rounded-xl text-[13px] font-semibold"
          >
            أدوات المادة
          </a>
          <a
            href="#compare"
            className="nav-link px-3.5 py-1.5 rounded-xl text-[13px] font-semibold"
          >
            الفرق الحقيقي
          </a>
        </nav>

        {/* Left Controls: Theme + Magnetic Start CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="themeToggleBtn"
            type="button"
            onClick={() => toggleTheme()}
            className="flex items-center gap-1.5 px-3 h-9 rounded-xl border text-[12px] font-semibold transition-colors cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
            title="تبديل الوضع الفاتح والداكن"
            aria-label={isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
          >
            {isDark ? (
              <Sun className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />
            ) : (
              <Moon className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />
            )}
            <span className="hidden sm:inline">{isDark ? "فاتح" : "داكن"}</span>
          </button>

          <Link
            href="/courses"
            className="start-study-cta magnetic-btn px-4 h-9 rounded-xl text-[12.5px] font-extrabold text-white flex items-center gap-1.5 shadow-sm"
            style={{ background: "#c25e33" }}
          >
            <span>ابدأ المذاكرة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobileNavDrawer"
          className="lg:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
          }}
        >
          <a
            href="#interactive-showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-link nav-link px-3 py-2 rounded-xl text-[13.5px] font-semibold"
          >
            أدوات المادة
          </a>
          <a
            href="#compare"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-link nav-link px-3 py-2 rounded-xl text-[13.5px] font-semibold"
          >
            الفرق الحقيقي
          </a>
        </div>
      )}
    </header>
  );
}
