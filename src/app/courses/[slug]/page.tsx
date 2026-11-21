import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import CourseWorkspaceClient from "@/components/lesson/CourseWorkspaceClient";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseDetailBySlug, getLessonPageData } from "@/lib/data";

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
    title: `${course.code} · ${course.title}`,
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
  const courseDetail = await getCourseDetailBySlug(slug);

  if (!courseDetail) {
    notFound();
  }

  const sortedLessons = [...courseDetail.lessons].sort(
    (a, b) => a.order_index - b.order_index
  );
  const firstLesson =
    (courseDetail.course.is_paid
      ? sortedLessons.find((l) => l.is_free_preview)
      : undefined) ?? sortedLessons[0];

  if (!firstLesson) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="surface-card space-y-4 rounded-3xl p-8">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: "var(--brand-soft)",
              color: "var(--brand-primary)",
            }}
          >
            <BookOpen className="h-6 w-6" />
          </div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--text-primary)" }}
          >
            {courseDetail.course.title}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            جاري تجهيز دروس هذا المقرر وإضافتها قريباً.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-extrabold text-white"
            style={{ background: "var(--hero-bg)" }}
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للمقررات</span>
          </Link>
        </div>
      </div>
    );
  }

  const lessonData = await getLessonPageData(slug, firstLesson.id);
  if (!lessonData) {
    notFound();
  }

  return (
    <CourseWorkspaceClient
      key={firstLesson.id}
      data={lessonData}
      requestedLessonId={firstLesson.id}
    />
  );
}
