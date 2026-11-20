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
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
          {profile
            ? `يلا نعمل خطوة لقدّام، يا ${profile.full_name}.`
            : "يلا نعمل خطوة لقدّام."}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
          مكانك جاهز. اختار مادة، افهم فكرة، وجرّب نفسك.
        </p>
      </div>

      {profile ? (
        <Link
          href="/login"
          className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:self-auto"
        >
          <GraduationCap className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>{getYearLabel(profile.year_level)}</span>
          <span
            dir="ltr"
            className="rounded-md bg-[var(--soft)] px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-[var(--accent)]"
          >
            {profile.department}
          </span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-bold text-[var(--accent)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--soft)] sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>أضف اسمك وفرقتك</span>
        </Link>
      )}
    </div>
  );
}
