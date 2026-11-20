"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Terminal } from "lucide-react";
import { isLessonPathname } from "@/components/layout/MainShell";

const RAIL_ITEMS = [
  {
    href: "/",
    label: "المواد",
    subtitle: "فهرس المقررات",
    icon: BookOpen,
  },
  {
    href: "/dashboard",
    label: "كمّل رحلتك",
    subtitle: "التقدم والكويزات",
    icon: Compass,
  },
] as const;

export function AppNavRail() {
  const pathname = usePathname();

  // Auto-hide the global navigation rail inside Lesson pages for distraction-free study
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
    <>
      {/* Desktop Fixed Right RTL Rail */}
      <aside
        aria-label="التنقل الجانبي"
        className="fixed bottom-0 right-0 top-[72px] z-30 hidden w-[224px] flex-col justify-between border-l border-[var(--line)] bg-[var(--rail)] px-3.5 py-5 lg:flex"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 pb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
            <p
              dir="ltr"
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]"
            >
              CS // WORKSPACE
            </p>
          </div>

          <nav className="space-y-1.5">
            {RAIL_ITEMS.map(({ href, label, subtitle, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                    active
                      ? "border-r-[3px] border-[var(--signal)] bg-[var(--paper)] font-bold text-[var(--ink)] shadow-[var(--shadow-pill)]"
                      : "border-r-[3px] border-transparent text-[var(--muted)] hover:bg-[var(--paper)]/70 hover:text-[var(--ink)]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      active
                        ? "bg-[var(--signal-soft)] text-[var(--accent)]"
                        : "bg-[var(--soft)]/80 text-[var(--muted)] group-hover:text-[var(--ink)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-sm font-bold">
                      {label}
                    </span>
                    <span className="block truncate text-[11px] font-normal text-[var(--muted)]">
                      {subtitle}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quiet Study Mode Tip (no duplicate profile CTA) */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]">
            <Terminal className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>نصيحة مذاكرة</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--muted)]">
            استخدم <strong className="text-[var(--ink)]">مؤقت التركيز</strong> مع{" "}
            <strong className="text-[var(--ink)]">وضع القراءة</strong> لجلسات
            مذاكرة هادئة بدون إجهاد.
          </p>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav
        aria-label="التنقل السفلي"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-[var(--line)] bg-[var(--rail)]/95 px-4 backdrop-blur-md lg:hidden"
      >
        {RAIL_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-[120px] flex-col items-center justify-center gap-1 rounded-xl px-4 py-1.5 text-xs transition-colors ${
                active
                  ? "bg-[var(--paper)] font-bold text-[var(--ink)] shadow-[var(--shadow-pill)]"
                  : "font-medium text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-[2.5px] w-10 rounded-full bg-[var(--signal)]"
                />
              )}
              <Icon
                className={`h-4 w-4 ${active ? "text-[var(--accent)]" : ""}`}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
