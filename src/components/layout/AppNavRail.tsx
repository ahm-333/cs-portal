"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, UserCircle2 } from "lucide-react";
import { isLessonPathname } from "@/components/layout/MainShell";

const MOBILE_ITEMS = [
  { href: "/", label: "المواد", icon: BookOpen },
  { href: "/dashboard", label: "كمّل رحلتك", icon: Compass },
  { href: "/login", label: "ملفي", icon: UserCircle2 },
] as const;

export function AppNavRail() {
  const pathname = usePathname();

  // Hidden completely on desktop (navigation lives cleanly in the top Navbar) and hidden in Lesson pages
  if (isLessonPathname(pathname)) {
    return null;
  }

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/courses");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      aria-label="التنقل السفلي للموبايل"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-[var(--line)] bg-[var(--paper)]/95 px-3 backdrop-blur-md md:hidden"
    >
      {MOBILE_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-w-[92px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[11px] transition-colors ${
              active
                ? "bg-[var(--signal-soft)] font-bold text-[var(--accent)]"
                : "font-medium text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {active && (
              <span
                aria-hidden="true"
                className="absolute top-0 h-[2.5px] w-8 rounded-full bg-[var(--signal)]"
              />
            )}
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
