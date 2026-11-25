import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CoursesHubClient } from "@/components/course/CoursesHubClient";
import { getServerSession } from "@/lib/auth/session";
import { SITE_CONFIG } from "@/lib/config";
import { getPublishedCourses } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { MOCK_LESSONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مكتبة المقررات",
  description: `تصفح مقررات ${SITE_CONFIG.name} مع فيديوهات الشرح، الشرح التفاعلي، الملخصات المنظمة، والكويزات التفاعلية.`,
};

export default async function CoursesPage() {
  if (isDatabaseConfigured()) {
    const session = await getServerSession();
    if (!session) {
      redirect("/login?next=/courses");
    }
  }

  const courses = await getPublishedCourses();

  const courseLessonIdsMap: Record<string, string[]> = {};
  let totalLessons = 0;

  for (const course of courses) {
    const ids = MOCK_LESSONS.filter((l) => l.course_id === course.id)
      .sort((a, b) => a.order_index - b.order_index)
      .map((l) => l.id);
    courseLessonIdsMap[course.id] = ids;
    totalLessons += ids.length;
  }

  return (
    <div className="portal-page-enter flex-1 flex flex-col w-full">
      <CoursesHubClient
        courses={courses}
        courseLessonIdsMap={courseLessonIdsMap}
        totalLessons={totalLessons}
      />
    </div>
  );
}
