"use client";

import { useLocalProfile } from "@/components/layout/localProfile";

export function HomeGreetingClient() {
  const profile = useLocalProfile();

  return (
    <div className="atelier-enter space-y-1.5">
      <div className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-[var(--signal)]"
        />
        <span
          dir="ltr"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]"
        >
          CS PORTAL // WORKSPACE
        </span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.85rem]">
        {profile
          ? `أهلاً يا ${profile.full_name} — مساحتك جاهزة.`
          : "مساحتك الهندسية جاهزة."}
      </h1>
    </div>
  );
}
