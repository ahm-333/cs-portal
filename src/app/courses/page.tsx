import type { Metadata } from "next";
import { CoursesHubClient } from "@/components/course/CoursesHubClient";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseDetailBySlug, getPublishedCourses } from "@/lib/data";

export const metadata: Metadata = {
  title: "مكتبة المقررات",
  description: `تصفح مقررات ${SITE_CONFIG.name} مع فيديوهات الشرح، الشرح التفاعلي، الملخصات المنظمة، والكويزات التفاعلية.`,
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  const details = await Promise.all(
    courses.map((course) => getCourseDetailBySlug(course.slug))
  );

  const courseLessonIdsMap: Record<string, string[]> = {};
  let totalLessons = 0;

  for (const detail of details) {
    if (!detail) continue;
    const ids = detail.lessons.map((lesson) => lesson.id);
    courseLessonIdsMap[detail.course.id] = ids;
    totalLessons += ids.length;
  }

  return (
    <CoursesHubClient
      courses={courses}
      courseLessonIdsMap={courseLessonIdsMap}
      totalLessons={totalLessons}
    />
  );
}
