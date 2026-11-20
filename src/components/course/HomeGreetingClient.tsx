"use client";

import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { useLocalProfile } from "@/components/layout/localProfile";

function getYearLabel(yearLevel: number): string {
  return (
    SITE_CONFIG.years.find((y) => y.value === yearLevel)?.label ??
    `الفرقة ${yearLevel}`
  );
}

export function HomeGreetingClient() {
  const profile = useLocalProfile();

  return (
    <div className="atelier-enter flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[var(--signal)]"
          />
          <span
            dir="ltr"
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            CS PORTAL // WORKBENCH
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.85rem]">
          {profile
            ? `أهلاً يا ${profile.full_name} — مساحتك جاهزة.`
            : "مساحتك الهندسية جاهزة."}
        </h1>
      </div>

      {profile ? (
        <Link
          href="/login"
          className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)] sm:self-auto"
        >
          <GraduationCap className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>{getYearLabel(profile.year_level)}</span>
          <span
            dir="ltr"
            className="rounded-md bg-[var(--signal-soft)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--signal)]"
          >
            {profile.department}
          </span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-bold text-[var(--accent)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)] sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--signal)]" />
          <span>أضف اسمك وفرقتك</span>
        </Link>
      )}
    </div>
  );
}
