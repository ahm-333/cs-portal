"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import type { CurrentUser } from "@/types/database";

interface NavbarClientProps {
  user: CurrentUser | null;
  isDemoMode: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "الرئيسية", icon: BookOpen },
  { href: "/dashboard", label: "مذاكرتي", icon: LayoutDashboard },
] as const;

function getInitials(user: CurrentUser): string {
  const source = user.full_name?.trim() || user.email?.trim() || "طالب";
  const parts = source.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function NavbarClient({ user, isDemoMode }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/courses");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand + Primary Nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner shadow-indigo-500/10 transition-colors group-hover:border-indigo-400/50 group-hover:bg-indigo-500/25 group-hover:text-indigo-300">
              <Terminal className="h-5 w-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight text-slate-100 group-hover:text-white">
                {SITE_CONFIG.arabicName}
              </span>
              <span
                dir="ltr"
                className="font-mono text-[11px] font-medium text-indigo-400/90"
              >
                {SITE_CONFIG.name}
              </span>
            </div>
          </Link>

          <nav
            aria-label="التنقل الرئيسي"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions (Left in RTL) */}
        <div className="hidden items-center gap-3 md:flex">
          {isDemoMode && (
            <span
              title="يعمل الموقع حالياً ببيانات تجريبية محفوظة محلياً بدون ربط Supabase"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>وضع العرض التجريبي</span>
            </span>
          )}

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 py-1 pr-1.5 pl-3 transition-colors hover:border-slate-700 hover:bg-slate-900"
              >
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url}
                    alt={user.full_name ?? "صورة الطالب"}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 font-mono text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40">
                    {getInitials(user)}
                  </span>
                )}
                <span className="max-w-[140px] truncate text-sm font-semibold text-slate-200">
                  {user.full_name || user.email || "حسابي"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                title="تسجيل الخروج"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{signingOut ? "جاري الخروج..." : "خروج"}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-950/50 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <LogIn className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isDemoMode && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>تجريبي</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-200 transition-colors hover:border-slate-700 hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1.5" aria-label="قائمة الموبايل">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-slate-800/80 pt-4">
            {isDemoMode && (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                <span>وضع العرض التجريبي مفعّل — تقدمك يُحفظ محلياً في المتصفح.</span>
              </div>
            )}

            {user ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar_url}
                      alt={user.full_name ?? "صورة الطالب"}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-700"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-mono text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40">
                      {getInitials(user)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-100">
                      {user.full_name || "طالب حاسبات"}
                    </p>
                    {user.email && (
                      <p
                        dir="ltr"
                        className="truncate text-right font-mono text-xs text-slate-400"
                      >
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
              >
                <LogIn className="h-4 w-4" />
                <span>تسجيل الدخول / إنشاء حساب</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
