import Link from "next/link";
import {
  ArrowLeft,
  Binary,
  BookOpen,
  Compass,
  Cpu,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Sparkles,
  Terminal,
} from "lucide-react";
import { getCourseVisualMeta } from "@/lib/courseTheme";
import { getCourseDetailBySlug, getPublishedCourses } from "@/lib/data";
import { HomeGreetingClient } from "@/components/course/HomeGreetingClient";
import { CourseFilters } from "@/components/course/CourseFilters";

const BOOK_ROTATIONS = ["-3deg", "2deg", "-2deg"] as const;

function renderBookIcon(slug: string) {
  if (slug.includes("data-structures")) {
    return <GitBranch className="h-4 w-4" />;
  }
  if (slug.includes("algorithm")) {
    return <Binary className="h-4 w-4" />;
  }
  if (slug.includes("operating-systems")) {
    return <Cpu className="h-4 w-4" />;
  }
  return <Terminal className="h-4 w-4" />;
}

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
  const stackCourses = courses.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      {/* Personalized Study Studio Greeting */}
      <HomeGreetingClient />

      {/* Royal-Indigo Study Studio Hero */}
      <section className="studio-hero studio-hero-network p-6 sm:p-9 lg:p-10">
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Right Column (RTL Primary Copy) */}
          <div className="space-y-5 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>استوديو مذاكرة طلبة حاسبات ومعلومات</span>
            </div>

            <h2 className="text-3xl font-extrabold leading-[1.22] tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
              كل فكرة صعبة، ليها بداية بسيطة.
            </h2>

            <p className="max-w-xl text-sm leading-relaxed text-[var(--hero-sub)] sm:text-base">
              فيديوهات مركّزة، ملخصات بأكواد ومعادلات واضحة، معامل{" "}
              <span dir="ltr" className="font-mono font-bold text-white">
                HTML
              </span>{" "}
              تفاعلية لمحاكاة الخوارزميات خطوة بخطوة، وكويزات فورية بالتفسير.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[var(--hero-deep)] shadow-[var(--shadow-pill)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--hero-sub)]"
              >
                <BookOpen className="h-4 w-4" />
                <span>استكشف المواد</span>
                <ArrowLeft className="h-4 w-4" />
              </a>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <Compass className="h-4 w-4" />
                <span>كمّل رحلتك</span>
              </Link>
            </div>

            {/* Compact Live Stat Pills */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-[var(--hero-sub)]">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-white" />
                <span>{courses.length} مواد منشورة</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-white" />
                <span>{totalLessons} درس وملخص</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-white" />
                <span>معامل تفاعلية وكويزات</span>
              </span>
            </div>
          </div>

          {/* Left Column: Tilted Pastel Subject Book Stack */}
          <div className="lg:col-span-5">
            <div className="mx-auto flex max-w-sm flex-col gap-3 py-1">
              {stackCourses.map((course, idx) => {
                const visual = getCourseVisualMeta(
                  course.slug,
                  course.title,
                  course.year_level
                );
                const rotation =
                  BOOK_ROTATIONS[idx % BOOK_ROTATIONS.length];

                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    style={{
                      backgroundColor: visual.tintVar,
                      color: "var(--tint-ink)",
                      transform: `rotate(${rotation})`,
                    }}
                    className="studio-book-card group flex items-center justify-between gap-3 border border-black/5 px-4 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--paper)]/85 text-[var(--accent)]">
                        {renderBookIcon(course.slug)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            dir="ltr"
                            className="truncate text-sm font-extrabold"
                          >
                            {visual.englishTitle}
                          </span>
                          <span
                            dir="ltr"
                            className="shrink-0 rounded bg-[var(--paper)]/75 px-1.5 py-0.5 font-mono text-[10px] font-bold"
                          >
                            {visual.code}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs opacity-80">
                          {visual.shortTagline}
                        </p>
                      </div>
                    </div>

                    <ArrowLeft className="h-4 w-4 shrink-0 opacity-70 transition-transform group-hover:-translate-x-1 group-hover:opacity-100" />
                  </Link>
                );
              })}
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
              <span>المنهج الدراسي</span>
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
              المواد الدراسية المتاحة
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-semibold text-[var(--muted)] sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 text-[var(--pos)]" />
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
