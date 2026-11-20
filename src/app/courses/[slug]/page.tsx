import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseDetailBySlug, getPublishedCourses } from "@/lib/data";
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
  const [data, allCourses] = await Promise.all([
    getCourseDetailBySlug(slug),
    getPublishedCourses(),
  ]);

  if (!data) {
    notFound();
  }

  const { course, lessons, progressMap, isEnrolled, currentUser } = data;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <CourseCurriculumClient
        course={course}
        lessons={lessons}
        allCourses={allCourses}
        serverProgressMap={progressMap}
        isEnrolled={isEnrolled}
        isGuest={!currentUser}
      />
    </div>
  );
}
