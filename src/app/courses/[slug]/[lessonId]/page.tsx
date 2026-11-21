import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseWorkspaceClient from "@/components/lesson/CourseWorkspaceClient";
import { SITE_CONFIG } from "@/lib/config";
import { splitBilingualTitle } from "@/lib/courseTheme";
import { getLessonPageData } from "@/lib/data";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const data = await getLessonPageData(slug, lessonId);

  if (!data) {
    return {
      title: `الدرس غير موجود | ${SITE_CONFIG.arabicName}`,
      description: SITE_CONFIG.description,
    };
  }

  const matchedLessonMeta = data.allLessons.find(
    (item) => item.id === lessonId
  );
  const rawLessonTitle =
    data.lesson?.title ?? matchedLessonMeta?.title ?? "الدرس";
  const lessonTitle = splitBilingualTitle(rawLessonTitle).primary;
  const pageTitle = `${lessonTitle} — ${data.course.title} | ${SITE_CONFIG.arabicName}`;
  const pageDescription =
    data.course.description ??
    `ذاكر درس ${lessonTitle} ضمن مادة ${data.course.title} مع الشرح والملخص والأكواد والمعمل التفاعلي والكويز.`;
  const canonicalUrl = `${SITE_CONFIG.url}/courses/${data.course.slug}/${lessonId}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
      url: canonicalUrl,
      locale: "ar_EG",
      siteName: SITE_CONFIG.arabicName,
      images: data.course.thumbnail_url
        ? [{ url: data.course.thumbnail_url, alt: data.course.title }]
        : undefined,
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = await params;
  const data = await getLessonPageData(slug, lessonId);

  if (!data) {
    notFound();
  }

  return (
    <CourseWorkspaceClient
      key={lessonId}
      data={data}
      requestedLessonId={lessonId}
    />
  );
}
