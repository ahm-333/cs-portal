"use client";

import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { useLastLesson } from "./lastLessonStore";

export function ContinueStudyingBanner() {
  const last = useLastLesson();
  if (!last) return null;

  return (
    <section
      aria-label="متابعة آخر درس"
      className="studio-card monograph-card atelier-enter flex flex-col justify-between gap-4 px-5 py-4 ps-6 sm:flex-row sm:items-center"
    >
      <div
        aria-hidden="true"
        className="monograph-spine"
        style={{ backgroundColor: "var(--signal)" }}
      />

      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--signal-soft)] text-[var(--accent)]">
          <PlayCircle className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[var(--accent)]">
            <span>كمّل من حيث وقفت</span>
            <span className="text-[var(--line-strong)]">·</span>
            <span dir="ltr" className="font-mono text-[var(--muted)]">
              {last.courseCode}
            </span>
            <span className="truncate text-[var(--muted)]">
              {last.courseTitle}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm font-bold text-[var(--ink)] sm:text-base">
            {last.lessonTitle}
          </p>
        </div>
      </div>

      <Link
        href={`/courses/${last.slug}/${last.lessonId}`}
        className="group inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[var(--accent-hover)] sm:text-sm"
      >
        <span>متابعة الدرس</span>
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      </Link>
    </section>
  );
}
