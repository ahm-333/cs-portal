import type {
  CourseDetailData,
  CourseWithStats,
  CurrentUser,
  DashboardData,
  LessonInteractive,
  LessonPageData,
} from "@/types/database";

// Implemented by db-auth agent
export async function getCurrentUser(): Promise<CurrentUser | null> {
  return null;
}

export async function getPublishedCourses(): Promise<CourseWithStats[]> {
  return [];
}

export async function getCourseDetailBySlug(
  _slug: string
): Promise<CourseDetailData | null> {
  return null;
}

export async function getLessonPageData(
  _slug: string,
  _lessonId: string
): Promise<LessonPageData | null> {
  return null;
}

export async function getDashboardData(): Promise<DashboardData> {
  return {
    currentUser: null,
    courses: [],
    totalCompletedLessons: 0,
    totalLessonsAcrossEnrolled: 0,
    overallAverageQuizScore: null,
    isDemoMode: true,
  };
}

export async function getInteractiveById(
  _id: string
): Promise<LessonInteractive | null> {
  return null;
}
