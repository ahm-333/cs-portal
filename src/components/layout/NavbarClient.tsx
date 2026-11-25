"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { BrandLogo } from "./BrandLogo";
import { PomodoroTimer } from "./PomodoroTimer";
import { ThemeSwitcher } from "./ThemeSwitcher";

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
            <BrandLogo size="md" className="group-hover:scale-[1.04]" />
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
