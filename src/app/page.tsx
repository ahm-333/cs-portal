import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getPublishedCourses } from "@/lib/data";
import { CourseFilters } from "@/components/course/CourseFilters";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    icon: PlayCircle,
    title: "فيديوهات شرح مركّزة",
    description: "شرح مباشر للمفاهيم الأساسية بدون حشو، مناسب للمراجعة قبل الامتحان.",
    accent: "text-indigo-400 bg-indigo-500/15 border-indigo-500/25",
  },
  {
    icon: Code2,
    title: "ملخصات بأكواد ومعادلات",
    description: "أكواد منظمة قابلة للنسخ ومعادلات رياضية واضحة بصيغة KaTeX.",
    accent: "text-sky-400 bg-sky-500/15 border-sky-500/25",
  },
  {
    icon: FlaskConical,
    title: "معامل HTML تفاعلية",
    description: "شغّل الخوارزميات وهياكل البيانات خطوة بخطوة داخل المتصفح مباشرة.",
    accent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  },
  {
    icon: CheckCircle2,
    title: "كويزات فورية بالتفسير",
    description: "اختبر فهمك بعد كل درس مع تصحيح فوري وشرح مفصل لكل إجابة.",
    accent: "text-violet-400 bg-violet-500/15 border-violet-500/25",
  },
] as const;

export default async function HomePage() {
  const courses = await getPublishedCourses();

  const totalCourses = courses.length;
  const totalLessons = courses.reduce((sum, c) => sum + c.lesson_count, 0);
  const freeCoursesCount = courses.filter((c) => !c.is_paid).length;
  const coveredYears = new Set(courses.map((c) => c.year_level)).size;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 bg-cs-hero-glow">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cs-grid [mask-image:linear-gradient(to_bottom,white_30%,transparent)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300 shadow-sm shadow-indigo-950/50">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              <span>منصة المذاكرة التفاعلية لطلبة حاسبات ومعلومات</span>
              <span
                dir="ltr"
                className="hidden rounded bg-indigo-500/20 px-1.5 py-0.5 font-mono text-[10px] text-indigo-200 sm:inline"
              >
                {SITE_CONFIG.name}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl sm:leading-[1.18]">
              ذاكر مواد{" "}
              <span className="bg-gradient-to-l from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                علوم الحاسب
              </span>{" "}
              بفهم عملي ومعامل تفاعلية
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              كل ما تحتاجه في مكان واحد: فيديوهات مركّزة، ملخصات بالأكواد
              والمعادلات الرياضية، معامل{" "}
              <span dir="ltr" className="font-mono font-semibold text-emerald-300">
                HTML
              </span>{" "}
              تفاعلية لمحاكاة الخوارزميات، وكويزات فورية لقياس مستواك قبل
              الامتحان.
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#courses"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/60 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:w-auto"
              >
                <BookOpen className="h-4 w-4" />
                <span>تصفح المواد الدراسية</span>
                <ArrowLeft className="h-4 w-4" />
              </a>

              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/90 bg-slate-900/90 px-6 py-3.5 text-sm font-bold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:w-auto"
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                <span>انتقل إلى مذاكرتي</span>
              </Link>
            </div>
          </div>

          {/* Live Platform Stats */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 text-center backdrop-blur-sm">
              <p className="font-mono text-2xl font-extrabold text-white sm:text-3xl">
                {totalCourses}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                مادة متاحة الآن
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 text-center backdrop-blur-sm">
              <p className="font-mono text-2xl font-extrabold text-indigo-400 sm:text-3xl">
                {totalLessons}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                درس وملخص منظم
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 text-center backdrop-blur-sm">
              <p className="font-mono text-2xl font-extrabold text-emerald-400 sm:text-3xl">
                {freeCoursesCount}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                مواد مجانية بالكامل
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 text-center backdrop-blur-sm">
              <p className="font-mono text-2xl font-extrabold text-sky-400 sm:text-3xl">
                {coveredYears > 0 ? coveredYears : 4}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                فرق دراسية مغطاة
              </p>
            </div>
          </div>

          {/* 4 Value Pillars */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm transition-colors hover:border-slate-700/80"
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${feature.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-3.5 text-sm font-extrabold text-slate-100">
                    {feature.title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section
        id="courses"
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <GraduationCap className="h-4 w-4" />
              <span>المنهج الدراسي</span>
            </div>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              المواد الدراسية المتاحة
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              اختر فرقتك الدراسية أو ابحث مباشرة باسم المادة للبدء في المذاكرة.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>معاينة مجانية متاحة لأول الدروس في المواد المدفوعة</span>
          </div>
        </div>

        <CourseFilters courses={courses} />
      </section>
    </div>
  );
}
