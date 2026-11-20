import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  Compass,
  FlaskConical,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { getCourseVisualMeta } from "@/lib/courseTheme";
import { getCourseDetailBySlug, getPublishedCourses } from "@/lib/data";
import { FounderBadge } from "@/components/layout/FounderBadge";
import { HomeGreetingClient } from "@/components/course/HomeGreetingClient";
import { CourseFilters } from "@/components/course/CourseFilters";

export default async function HomePage() {
  const courses = await getPublishedCourses();

  const details = await Promise.all(
    courses.map((course) => getCourseDetailBySlug(course.slug))
  );

  const courseLessonIdsMap: Record<string, string[]> = {};
  for (const detail of details) {
    if (detail) {
      courseLessonIdsMap[detail.course.id] = detail.lessons.map((l) => l.id);
    }
  }

  const totalLessons = courses.reduce((sum, c) => sum + c.lesson_count, 0);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-9 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      {/* Top Editorial Greeting */}
      <HomeGreetingClient />

      {/* Asymmetric Architectural Hero */}
      <section className="studio-hero studio-hero-network atelier-enter p-6 sm:p-9 lg:p-10">
        {/* Swiss Registration Corner Crosshairs */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-3 font-mono text-xs text-white/25"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-3 font-mono text-xs text-white/25"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3.5 font-mono text-xs text-white/25"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3.5 font-mono text-xs text-white/25"
        >
          +
        </span>

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Right Side (60%): Editorial Thesis + Copper CTA + Quiet Founder Whisper */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-7">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold text-[var(--hero-sub)]">
                <FlaskConical className="h-3.5 w-3.5 text-[var(--signal)]" />
                <span>ملخصات هندسية · معامل HTML تفاعلية · كويزات فورية</span>
              </div>

              <h2 className="text-3xl font-bold leading-[1.24] tracking-tight text-[var(--hero-ink)] sm:text-4xl lg:text-[2.65rem]">
                افهم الكود من الجذور،
                <br />
                مش بالحفظ.
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-[var(--hero-sub)] sm:text-base">
                منصة مذاكرة منظمة لطلبة حاسبات ومعلومات: شروحات مركّزة بأكواد
                نظيفة ومعادلات واضحة، معامل{" "}
                <span dir="ltr" className="font-mono font-semibold text-white">
                  HTML
                </span>{" "}
                تفاعلية تحاكي الخوارزميات خطوة بخطوة، واختبارات بمستوى الامتحان
                مع تفسير فوري.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--signal)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-pill)] transition-all hover:brightness-110"
              >
                <span>تصفح المقررات</span>
                <ArrowDown className="h-4 w-4" />
              </a>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-white/22 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:border-white/35 hover:bg-white/[0.14]"
              >
                <Compass className="h-4 w-4" />
                <span>كمّل رحلتك</span>
              </Link>
            </div>

            {/* Bottom Edge: Quiet Founder Whisper + Compact Live Telemetry */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-4">
              <FounderBadge variant="hero-whisper" />

              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[var(--hero-sub)]">
                <span>{courses.length} مقررات</span>
                <span className="text-white/30">·</span>
                <span>{totalLessons} دروس</span>
                <span className="text-white/30">·</span>
                <span>معملان HTML</span>
              </div>
            </div>
          </div>

          {/* Left Side (40%): Interactive Syllabus Workbench Blueprint Index Panel */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/12 bg-black/25 p-4 backdrop-blur-sm sm:p-5">
              {/* Blueprint Header */}
              <div className="mb-3.5 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[var(--signal)]"
                  />
                  <span className="text-xs font-bold text-white">
                    <span dir="ltr" className="font-mono text-[11px] text-white/65">
                      INDEX //{" "}
                    </span>
                    المقررات النشطة
                  </span>
                </div>
                <span
                  dir="ltr"
                  className="rounded border border-white/12 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-white/70"
                >
                  {String(courses.length).padStart(2, "0")} VOLS
                </span>
              </div>

              {/* Clean Horizontal Ledger Rows (Zero Truncation) */}
              <div className="space-y-2">
                {courses.map((course) => {
                  const visual = getCourseVisualMeta(
                    course.slug,
                    course.title,
                    course.year_level
                  );
                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 transition-all hover:border-white/25 hover:bg-white/[0.10]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          dir="ltr"
                          className="font-mono text-xs font-bold text-white/55 transition-colors group-hover:text-white"
                        >
                          {visual.monographNumber}
                        </span>
                        <span
                          aria-hidden="true"
                          style={{ backgroundColor: visual.spineVar }}
                          className="h-8 w-1 shrink-0 rounded-full"
                        />
                        <div className="leading-snug">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              dir="ltr"
                              className="text-sm font-bold text-white"
                            >
                              {visual.englishTitle}
                            </span>
                            <span
                              dir="ltr"
                              className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--hero-sub)]"
                            >
                              {visual.code}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-[var(--hero-sub)]/85">
                            {visual.arabicSubtitle}
                          </p>
                        </div>
                      </div>

                      <ArrowLeft className="h-4 w-4 shrink-0 text-white/55 transition-all group-hover:-translate-x-1 group-hover:text-white" />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/60">
                <span>اختر مقرراً للبدء الفوري</span>
                <span dir="ltr" className="font-mono">
                  READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section id="courses" className="scroll-mt-24 space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
              <GraduationCap className="h-4 w-4" />
              <span>فهرس المقررات الهندسية</span>
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--ink)]">
              المواد الدراسية المتاحة
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-semibold text-[var(--muted)] sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 text-[var(--signal)]" />
            <span>معاينة مجانية لأول الدروس في المواد المدفوعة</span>
          </span>
        </div>

        <CourseFilters
          courses={courses}
          courseLessonIdsMap={courseLessonIdsMap}
        />
      </section>
    </div>
  );
}
