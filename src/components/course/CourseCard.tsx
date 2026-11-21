"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Cpu, GitFork, Workflow } from "lucide-react";
import { usePortalState } from "@/lib/stores/portalStore";
import { TiltedCard } from "@/components/ui/ReactBits";
import type { CourseWithStats } from "@/types/database";

export interface CourseCardProps {
  course: CourseWithStats;
  lessonIds?: string[];
  index?: number;
}

function CourseIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "git-fork":
      return <GitFork className="w-5 h-5" />;
    case "workflow":
      return <Workflow className="w-5 h-5" />;
    case "cpu":
      return <Cpu className="w-5 h-5" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
}

const TOOL_BADGES = [
  "فيديوهات",
  "شرح تفاعلي",
  "موقع للمادة",
  "ملخصات",
  "كويزات",
] as const;

export function CourseCard({
  course,
  lessonIds = [],
  index = 0,
}: CourseCardProps) {
  const portal = usePortalState();

  const totalLessons =
    lessonIds.length > 0 ? lessonIds.length : course.lesson_count;

  const completedCount =
    lessonIds.length > 0
      ? lessonIds.filter((id) => portal.completedLessons.includes(id)).length
      : (course.completed_count ?? 0);

  const pct =
    totalLessons > 0
      ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
      : 0;

  const isUnlocked =
    !course.is_paid || portal.unlockedCourses.includes(course.id);

  const accent = course.accent || "#1e355c";
  const orderNum = String(index + 1).padStart(2, "0");

  const ctaText =
    completedCount > 0
      ? pct === 100
        ? "مراجعة المقرر ✓"
        : "أكمل المذاكرة"
      : "افتح المقرر";

  return (
    <TiltedCard className="h-full rounded-[22px]" maxTiltDeg={3.2} scaleOnHover={1.008} glare={false}>
      <article className="spotlight-card bp-course-card bp-course-grid h-full p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div className="bp-fold-corner" aria-hidden="true" />

      <div className="space-y-4">
        {/* Header: Icon + Code/Meta + Transparent Index */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="bp-course-icon w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{
                background: `color-mix(in srgb, ${accent} 14%, var(--bg-surface))`,
                color: accent,
                border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
              }}
            >
              <CourseIcon icon={course.icon} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono-code text-[11.5px] font-extrabold px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  {course.code}
                </span>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: "var(--text-muted)" }}
                >
                  فرقة <span className="font-en">{course.year_level}</span> · ترم{" "}
                  <span className="font-en">{course.term}</span>
                </span>
              </div>
              <div
                className="font-en text-[11.5px] font-semibold mt-0.5 truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {course.title_en}
              </div>
            </div>
          </div>

          <span
            aria-hidden="true"
            className="font-en text-2xl sm:text-3xl font-black leading-none opacity-[0.14] pl-6 sm:pl-7 pt-0.5 shrink-0 select-none"
            style={{ color: "var(--text-primary)" }}
          >
            {orderNum}
          </span>
        </div>

        {/* Title & Summary */}
        <div className="space-y-1.5">
          <h3
            className="text-[17.5px] sm:text-[18.5px] font-black leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            {course.title}
          </h3>
          <p
            className="text-[12.5px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {course.description}
          </p>
        </div>
      </div>

      {/* Bottom Section: 5 Tool Badges + Progress Bar + Price/CTA */}
      <div
        className="space-y-3.5 pt-3 border-t"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div
          className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-bold"
          style={{ color: "var(--text-secondary)" }}
        >
          {TOOL_BADGES.map((badge) => (
            <span
              key={badge}
              className="px-2 py-0.5 rounded-md"
              style={{ background: "var(--bg-subtle)" }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Per-Course Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span style={{ color: "var(--text-muted)" }}>
              {completedCount} / {totalLessons} دروس · {course.duration_minutes}{" "}
              د
            </span>
            <span
              className="font-mono-code"
              style={{
                color: pct > 0 ? "var(--success-fg)" : "var(--text-muted)",
              }}
            >
              {pct}%
            </span>
          </div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: "var(--bg-subtle)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: accent }}
            />
          </div>
        </div>

        {/* Price Pill + Primary CTA */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {!course.is_paid ? (
            <span
              className="text-[11px] font-extrabold px-2.5 py-1 rounded-full"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              مجاني بالكامل
            </span>
          ) : isUnlocked ? (
            <span
              className="text-[11px] font-extrabold px-2.5 py-1 rounded-full"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              مُفعّل بالكامل ✓
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                الدرس 1 مجاني
              </span>
              <span
                className="text-[11px] font-extrabold px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                {course.price} ج.م
              </span>
            </div>
          )}

          <Link
            href={`/courses/${course.slug}`}
            className="min-h-[42px] px-4 py-2 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5 shadow-sm shrink-0"
            style={{ background: "var(--hero-bg)" }}
          >
            <span>{ctaText}</span>
            <ArrowLeft className="bp-course-arrow w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
    </TiltedCard>
  );
}
