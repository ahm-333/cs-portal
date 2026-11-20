"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  PencilLine,
  Terminal,
  UserCircle2,
  X,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { clearLocalProfile, useLocalProfile } from "./localProfile";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية", icon: BookOpen },
  { href: "/dashboard", label: "مذاكرتي", icon: LayoutDashboard },
] as const;

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return fullName.trim().slice(0, 2).toUpperCase() || "ط";
}

function getYearShortLabel(yearLevel: number): string {
  return (
    SITE_CONFIG.years.find((y) => y.value === yearLevel)?.label ??
    `الفرقة ${yearLevel}`
  );
}

export function NavbarClient() {
  const pathname = usePathname();
  const profile = useLocalProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/courses");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  function handleClearProfile() {
    clearLocalProfile();
    setMobileMenuOpen(false);
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

        {/* Desktop Student Profile Controls */}
        <div className="hidden items-center gap-2.5 md:flex">
          {profile ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 py-1 pr-1.5 pl-3 transition-colors hover:border-indigo-500/40 hover:bg-slate-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 font-mono text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40">
                  {getInitials(profile.full_name)}
                </span>
                <span className="max-w-[140px] truncate text-sm font-semibold text-slate-200">
                  {profile.full_name}
                </span>
                <span
                  dir="ltr"
                  className="rounded-md border border-slate-700/80 bg-slate-950 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400"
                >
                  {profile.department}
                </span>
              </Link>

              <Link
                href="/login"
                title="تعديل ملف الطالب"
                aria-label="تعديل ملف الطالب"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                <PencilLine className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleClearProfile}
                title="مسح الملف المحلي"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>خروج</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-950/50 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <UserCircle2 className="h-4 w-4" />
              <span>ملف الطالب</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
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
            {profile ? (
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-mono text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40">
                    {getInitials(profile.full_name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-100">
                      {profile.full_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {getYearShortLabel(profile.year_level)} •{" "}
                      <span dir="ltr" className="font-mono text-emerald-400">
                        {profile.department}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-bold text-slate-200 transition-colors hover:border-indigo-500/40 hover:text-indigo-200"
                  >
                    <PencilLine className="h-3.5 w-3.5" />
                    <span>تعديل الملف</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleClearProfile}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>مسح الملف</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
              >
                <UserCircle2 className="h-4 w-4" />
                <span>إعداد ملف الطالب</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
