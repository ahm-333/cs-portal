import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseDetailBySlug, getDashboardData } from "@/lib/data";
import type { LessonSummaryItem } from "@/types/database";
import { DashboardClient } from "@/components/course/DashboardClient";

export const metadata: Metadata = {
  title: "كمّل رحلتك — مذاكرتي",
  description: `تابع تقدمك في المواد الدراسية ومتوسط درجات الكويزات على ${SITE_CONFIG.arabicName}.`,
};

export default async function DashboardPage() {
  const data = await getDashboardData();
  const courseLessonsMap: Record<string, LessonSummaryItem[]> = {};

  const details = await Promise.all(
    data.courses.map((item) => getCourseDetailBySlug(item.course.slug))
  );

  for (const detail of details) {
    if (detail) {
      courseLessonsMap[detail.course.id] = detail.lessons;
    }
  }

  return <DashboardClient data={data} courseLessonsMap={courseLessonsMap} />;
}
