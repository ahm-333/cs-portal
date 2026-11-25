"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { PomodoroTimer } from "./PomodoroTimer";
import { ThemeSwitcher } from "./ThemeSwitcher";

function BrandChipIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      fill="none"
      className="h-5 w-5"
    >
      <rect
        x="7"
        y="7"
        width="14"
        height="14"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="11"
        y="11"
        width="6"
        height="6"
        rx="1.5"
        fill="currentColor"
      />
      <path
        d="M11 3.5V7M17 3.5V7M11 21V24.5M17 21V24.5M3.5 11H7M3.5 17H7M21 11H24.5M21 17H24.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/", label: "المواد", icon: BookOpen },
  { href: "/dashboard", label: "كمّل رحلتك", icon: Compass },
] as const;

export function NavbarClient() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/courses");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Brand + Clean Inline Navigation */}
        <div className="flex items-center gap-5 lg:gap-7">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 focus:outline-none"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--hero)] text-[var(--hero-ink)] shadow-[var(--shadow-pill)] transition-transform group-hover:scale-[1.03]">
              <BrandChipIcon />
              <span
                aria-hidden="true"
                className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--signal)] ring-2 ring-[var(--paper)]"
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-[var(--ink)] sm:text-base">
                {SITE_CONFIG.arabicName}
              </span>
              <span
                dir="ltr"
                className="font-mono text-[11px] font-semibold text-[var(--accent)]"
              >
                {SITE_CONFIG.name}
              </span>
            </div>
          </Link>

          <nav
            aria-label="التنقل الرئيسي"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors sm:text-sm ${
                    active
                      ? "bg-[var(--signal-soft)] text-[var(--accent)]"
                      : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Utility Cluster: Pomodoro + 3-Mode Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <PomodoroTimer />
          <ThemeSwitcher compact />
        </div>
      </div>
    </header>
  );
}
