import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Lock,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import type { CourseWithStats } from "@/types/database";

interface CourseCardProps {
  course: CourseWithStats;
}

function getYearLabel(yearLevel: number): string {
  return (
    SITE_CONFIG.years.find((y) => y.value === yearLevel)?.label ??
    `الفرقة ${yearLevel}`
  );
}

function getTermLabel(term: number): string {
  return (
    SITE_CONFIG.terms.find((t) => t.value === term)?.label ?? `ترم ${term}`
  );
}

const YEAR_ACCENTS: Record<number, string> = {
  1: "from-sky-500/20 via-indigo-500/10 to-slate-900/0",
  2: "from-indigo-500/25 via-violet-500/10 to-slate-900/0",
  3: "from-emerald-500/20 via-teal-500/10 to-slate-900/0",
  4: "from-violet-500/25 via-fuchsia-500/10 to-slate-900/0",
};

export function CourseCard({ course }: CourseCardProps) {
  const yearLabel = getYearLabel(course.year_level);
  const termLabel = getTermLabel(course.term);
  const completedCount = course.completed_count ?? 0;
  const hasProgress = course.lesson_count > 0 && completedCount > 0;
  const progressPercent = hasProgress
    ? Math.min(100, Math.round((completedCount / course.lesson_count) * 100))
    : 0;

  const accentGradient =
    YEAR_ACCENTS[course.year_level] ??
    "from-indigo-500/20 via-slate-800/10 to-slate-900/0";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-950/35">
      {/* Top accent / optional thumbnail */}
      <div
        className={`relative border-b border-slate-800/70 bg-gradient-to-bl ${accentGradient} px-5 pb-4 pt-5`}
      >
        {course.thumbnail_url ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        ) : null}

        {/* Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-slate-200">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
              <span>{yearLabel}</span>
            </span>
            <span className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
              {termLabel}
            </span>
          </div>

          {/* Free vs Paid Badge */}
          {!course.is_paid ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              <Sparkles className="h-3 w-3" />
              <span>مجاني</span>
            </span>
          ) : course.is_enrolled ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/35 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300">
              <CheckCircle2 className="h-3 w-3" />
              <span>مشترك</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              <Lock className="h-3 w-3" />
              <span>{course.price} ج.م</span>
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold leading-snug text-slate-100 transition-colors group-hover:text-indigo-300">
          <Link
            href={`/courses/${course.slug}`}
            className="focus:outline-none after:absolute after:inset-0"
          >
            {course.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
          {course.description ||
            "شرح منظم للمادة مع ملخصات بالأكواد، معامل تفاعلية، وكويزات تدريبية."}
        </p>

        {/* Progress Bar (optional) */}
        {hasProgress && (
          <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                تقدمك في المادة
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {progressPercent}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Meta + CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <BookOpen className="h-4 w-4 text-slate-500" />
            <span>
              {course.lesson_count}{" "}
              {course.lesson_count === 1 ? "درس" : "دروس"}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-indigo-300">
            <span>{hasProgress ? "أكمل المذاكرة" : "ابدأ المذاكرة"}</span>
            <ArrowLeft className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
