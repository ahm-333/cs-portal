import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  CoursesHubClient,
  type CourseLessonPreview,
} from "@/components/course/CoursesHubClient";
import { getServerSession } from "@/lib/auth/session";
import { SITE_CONFIG } from "@/lib/config";
import { getPublishedCourses } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { MOCK_LESSONS, MOCK_QUESTIONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "استكشف المواد المتاحة",
  description: `استكشف المواد المتاحة في ${SITE_CONFIG.name} مع فيديو الشرح، اقرأ الفصل، ملخص سريع، وأسئلة وكويزات.`,
};

export default async function CoursesPage() {
  if (isDatabaseConfigured()) {
    const session = await getServerSession();
    if (!session) {
      redirect("/login?next=/courses");
    }
  }

  const courses = await getPublishedCourses();

  const questionsCountByLesson = new Map<string, number>();
  for (const question of MOCK_QUESTIONS) {
    questionsCountByLesson.set(
      question.lesson_id,
      (questionsCountByLesson.get(question.lesson_id) ?? 0) + 1
    );
  }

  const courseLessonIdsMap: Record<string, string[]> = {};
  const courseLessonsMap: Record<string, CourseLessonPreview[]> = {};
  let totalLessons = 0;

  for (const course of courses) {
    const lessons = MOCK_LESSONS.filter((l) => l.course_id === course.id).sort(
      (a, b) => a.order_index - b.order_index
    );

    courseLessonIdsMap[course.id] = lessons.map((l) => l.id);
    courseLessonsMap[course.id] = lessons.map((l) => ({
      id: l.id,
      title: l.title,
      ...(l.title_en ? { title_en: l.title_en } : {}),
      duration_minutes: l.duration_minutes ?? null,
      is_free_preview: l.is_free_preview,
      order_index: l.order_index,
      questionsCount: questionsCountByLesson.get(l.id) ?? 0,
    }));

    totalLessons += lessons.length;
  }

  return (
    <div className="portal-page-enter flex-1 flex flex-col w-full">
      <CoursesHubClient
        courses={courses}
        courseLessonIdsMap={courseLessonIdsMap}
        courseLessonsMap={courseLessonsMap}
        totalLessons={totalLessons}
      />
    </div>
  );
}
