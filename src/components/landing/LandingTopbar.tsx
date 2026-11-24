"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { SITE_CONFIG } from "@/lib/config";

const NAV_LINKS = [
  { id: "chapter-preview", href: "#chapter-preview", label: "شاشة الفصل" },
  { id: "compare", href: "#compare", label: "بينا ومن غيرنا" },
  { id: "courses-picker", href: "#courses-picker", label: "المقررات" },
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

      const probeY = window.scrollY + 180;
      let current = "";
      for (const item of NAV_LINKS) {
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
      className="fixed top-0 inset-x-0 z-40 border-b backdrop-blur-xl transition-colors duration-200"
      style={
        isOverHero
          ? {
              background: "rgba(11, 19, 34, 0.80)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
            }
          : {
              background: isDark
                ? "rgba(12, 16, 23, 0.90)"
                : "rgba(246, 245, 241, 0.92)",
              borderColor: "var(--border-soft)",
            }
      }
    >
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Right (RTL Start): Clean Founder Avatar + Eng. Ahmed Amir */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            id="mobileMenuBtn"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
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
            className="flex items-center gap-2 min-w-0 group"
          >
            <div
              className={`relative w-7 h-7 rounded-full overflow-hidden ring-[1.5px] shrink-0 ${
                isOverHero ? "ring-[#e58a62]" : "ring-[#c25e33]"
              }`}
            >
              <Image
                src="/images/founder.jpg"
                alt={SITE_CONFIG.name}
                fill
                sizes="28px"
                className="object-cover object-[50%_15%]"
              />
            </div>
            <BrandName inverted={isOverHero} size="md" />
            <span
              className="hidden lg:inline-block h-3.5 w-px shrink-0"
              style={{
                background: isOverHero
                  ? "rgba(255, 255, 255, 0.2)"
                  : "var(--border-strong)",
              }}
              aria-hidden="true"
            />
            <span
              className="hidden lg:inline-block font-mono-code text-[10.5px] font-bold tracking-wider whitespace-nowrap shrink-0"
              style={{
                color: isOverHero
                  ? "rgba(203, 213, 225, 0.85)"
                  : "var(--text-muted)",
              }}
            >
              CS PORTAL
            </span>
          </a>
        </div>

        {/* Center: Clean Editorial Links with Active Indicator */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="أقسام الصفحة"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-colors ${
                  isOverHero
                    ? "hover:bg-white/10"
                    : "hover:bg-[var(--bg-hover)]"
                }`}
                style={
                  isOverHero
                    ? {
                        color: isActive
                          ? "#ffffff"
                          : "rgba(226, 232, 240, 0.9)",
                        background: isActive
                          ? "rgba(255, 255, 255, 0.14)"
                          : "transparent",
                      }
                    : {
                        color: isActive
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                        background: isActive
                          ? "var(--bg-subtle)"
                          : "transparent",
                      }
                }
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Left (RTL End): Minimal Action Group */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="themeToggleBtn"
            type="button"
            onClick={() => toggleTheme()}
            title="تبديل المظهر"
            aria-label={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              isOverHero ? "hover:bg-white/10" : "hover:bg-[var(--bg-subtle)]"
            }`}
            style={{
              color: isOverHero
                ? "rgba(226, 232, 240, 0.92)"
                : "var(--text-secondary)",
            }}
          >
            {isDark ? (
              <Sun className="w-4 h-4 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 shrink-0" />
            )}
          </button>

          <Link
            href="/courses"
            className="h-9 px-3 sm:px-3.5 rounded-lg text-[11.5px] sm:text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-transform hover:-translate-y-0.5 shadow-sm"
            style={{ background: "#c25e33" }}
          >
            <span>ابدأ</span>
            <span className="hidden sm:inline">المذاكرة</span>
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Clean Full-Width Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 space-y-1 shadow-lg max-h-[calc(100svh-3.5rem)] overflow-y-auto"
          style={
            isOverHero
              ? {
                  background: "rgba(11, 19, 34, 0.96)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                }
              : {
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }
          }
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-[13.5px] font-bold transition-colors ${
                isOverHero
                  ? "text-white hover:bg-white/10"
                  : "hover:bg-[var(--bg-subtle)]"
              }`}
              style={isOverHero ? undefined : { color: "var(--text-primary)" }}
            >
              {item.label}
            </a>
          ))}
          <div
            className="pt-2 mt-1 border-t space-y-1.5"
            style={{
              borderColor: isOverHero
                ? "rgba(255, 255, 255, 0.12)"
                : "var(--border-soft)",
            }}
          >
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-extrabold text-white"
              style={{ background: "#c25e33" }}
            >
              <span>مكتبة المقررات</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-[13px] font-bold"
              style={
                isOverHero
                  ? {
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#f0a786",
                    }
                  : {
                      background: "var(--bg-subtle)",
                      color: "var(--brand-primary)",
                    }
              }
            >
              اصنع كارنيه فرقتك (3D) ←
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
