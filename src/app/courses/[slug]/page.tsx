import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock,
  GraduationCap,
  Lock,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseDetailBySlug } from "@/lib/data";
import { CourseCurriculumClient } from "@/components/course/CourseCurriculumClient";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

function getYearLabel(yearLevel: number): string {
  return (
    SITE_CONFIG.years.find((y) => y.value === yearLevel)?.label ??
    `الفرقة ${yearLevel}`
  );
}

function getTermLabel(term: number): string {
  return (
    SITE_CONFIG.terms.find((t) => t.value === term)?.label ?? `الترم ${term}`
  );
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCourseDetailBySlug(slug);

  if (!data) {
    return {
      title: "المادة غير موجودة",
      description: SITE_CONFIG.description,
    };
  }

  const { course, lessons } = data;
  const yearLabel = getYearLabel(course.year_level);
  const termLabel = getTermLabel(course.term);
  const metaDescription =
    course.description ||
    `ذاكر مادة ${course.title} (${yearLabel} — ${termLabel}) على ${SITE_CONFIG.arabicName} مع ${lessons.length} دروس وملخصات ومعامل تفاعلية وكويزات.`;

  return {
    title: course.title,
    description: metaDescription,
    openGraph: {
      type: "article",
      locale: "ar_EG",
      siteName: `${SITE_CONFIG.arabicName} (${SITE_CONFIG.name})`,
      title: `${course.title} | ${SITE_CONFIG.arabicName}`,
      description: metaDescription,
      url: `${SITE_CONFIG.url}/courses/${course.slug}`,
      ...(course.thumbnail_url ? { images: [course.thumbnail_url] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | ${SITE_CONFIG.arabicName}`,
      description: metaDescription,
      ...(course.thumbnail_url ? { images: [course.thumbnail_url] } : {}),
    },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const data = await getCourseDetailBySlug(slug);

  if (!data) {
    notFound();
  }

  const { course, lessons, progressMap, isEnrolled, currentUser } = data;
  const yearLabel = getYearLabel(course.year_level);
  const termLabel = getTermLabel(course.term);
  const totalMinutes = lessons.reduce(
    (sum, lesson) => sum + (lesson.duration_minutes ?? 0),
    0
  );
  const freePreviewCount = lessons.filter((l) => l.is_free_preview).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="مسار التنقل"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-400"
      >
        <Link href="/" className="transition-colors hover:text-indigo-300">
          الرئيسية
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
        <Link
          href="/#courses"
          className="transition-colors hover:text-indigo-300"
        >
          المواد الدراسية
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-slate-200">{course.title}</span>
      </nav>

      {/* Course Header Card */}
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/80 p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cs-hero-glow opacity-75"
        />

        <div className="relative space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-950/85 px-3 py-1 text-xs font-bold text-slate-200">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
              <span>{yearLabel}</span>
            </span>

            <span className="rounded-lg border border-slate-800 bg-slate-950/75 px-3 py-1 text-xs font-semibold text-slate-300">
              {termLabel}
            </span>

            {!course.is_paid ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>مجاني بالكامل</span>
              </span>
            ) : isEnrolled ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/35 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>مشترك في المادة</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                <Lock className="h-3.5 w-3.5" />
                <span>مادة مدفوعة • {course.price} ج.م</span>
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {course.description}
              </p>
            )}
          </div>

          {/* Quick Meta Stats */}
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-800/80 pt-4 text-xs font-semibold text-slate-300 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>
                {lessons.length} {lessons.length === 1 ? "درس" : "دروس"}
              </span>
            </span>

            {totalMinutes > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-sky-400" />
                <span>حوالي {totalMinutes} دقيقة</span>
              </span>
            )}

            {course.is_paid && !isEnrolled && freePreviewCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-emerald-300">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>
                  {freePreviewCount}{" "}
                  {freePreviewCount === 1
                    ? "درس متاح للمعاينة المجانية"
                    : "دروس متاحة للمعاينة المجانية"}
                </span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Progress + Curriculum */}
      <CourseCurriculumClient
        course={course}
        lessons={lessons}
        serverProgressMap={progressMap}
        isEnrolled={isEnrolled}
        isGuest={!currentUser}
      />
    </div>
  );
}
