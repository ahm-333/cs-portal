import {
  MOCK_COURSES,
  MOCK_INTERACTIVES,
  MOCK_LESSONS,
  MOCK_QUESTIONS,
} from "@/lib/mock-data";
import type {
  CourseDetailData,
  CourseWithStats,
  CurrentUser,
  DashboardCourseProgress,
  DashboardData,
  LessonInteractive,
  LessonInteractiveMeta,
  LessonPageData,
  LessonSummaryItem,
  SearchIndexItem,
} from "@/types/database";

// ============================================================================
// Lightweight Projection Helpers
// Omit `summary_md` and `html_content` from list/metadata responses so pages
// stay lean and interactive labs remain strictly lazy-loaded via API.
// ============================================================================

function toLessonSummaryItem(lesson: LessonSummaryItem): LessonSummaryItem {
  return {
    id: lesson.id,
    course_id: lesson.course_id,
    section_title: lesson.section_title,
    title: lesson.title,
    title_en: lesson.title_en,
    order_index: lesson.order_index,
    is_free_preview: lesson.is_free_preview,
    duration_minutes: lesson.duration_minutes ?? null,
    chapters: lesson.chapters,
    key_code: lesson.key_code,
    exam_tip: lesson.exam_tip,
  };
}

function toInteractiveMeta(item: LessonInteractive): LessonInteractiveMeta {
  return {
    id: item.id,
    lesson_id: item.lesson_id,
    title: item.title,
    description: item.description,
    order_index: item.order_index,
    source_type: item.source_type,
    external_url: item.external_url,
    default_height: item.default_height,
  };
}

// ============================================================================
// 1. getCurrentUser (Standalone local-profile mode: no server session)
// ============================================================================

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return null;
}

// ============================================================================
// 2. getPublishedCourses
// ============================================================================

export async function getPublishedCourses(): Promise<CourseWithStats[]> {
  const lessonCounts = new Map<string, number>();
  for (const lesson of MOCK_LESSONS) {
    lessonCounts.set(
      lesson.course_id,
      (lessonCounts.get(lesson.course_id) ?? 0) + 1
    );
  }

  return MOCK_COURSES.filter((course) => course.is_published)
    .sort(
      (a, b) =>
        a.year_level - b.year_level ||
        a.term - b.term ||
        a.created_at.localeCompare(b.created_at)
    )
    .map((course) => ({
      ...course,
      lesson_count: lessonCounts.get(course.id) ?? 0,
      completed_count: 0,
      is_enrolled: !course.is_paid,
    }));
}

// ============================================================================
// 3. getCourseDetailBySlug
// ============================================================================

export async function getCourseDetailBySlug(
  slug: string
): Promise<CourseDetailData | null> {
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    return null;
  }

  const course = MOCK_COURSES.find(
    (c) => c.slug === cleanSlug && c.is_published
  );
  if (!course) {
    return null;
  }

  const lessons = MOCK_LESSONS.filter((l) => l.course_id === course.id)
    .sort((a, b) => a.order_index - b.order_index)
    .map(toLessonSummaryItem);

  return {
    course,
    lessons,
    progressMap: {},
    isEnrolled: !course.is_paid,
    currentUser: null,
  };
}

// ============================================================================
// 4. getLessonPageData
// ============================================================================

export async function getLessonPageData(
  slug: string,
  lessonId: string
): Promise<LessonPageData | null> {
  const cleanSlug = slug.trim();
  const cleanLessonId = lessonId.trim();
  if (!cleanSlug || !cleanLessonId) {
    return null;
  }

  const course = MOCK_COURSES.find(
    (c) => c.slug === cleanSlug && c.is_published
  );
  if (!course) {
    return null;
  }

  const courseLessons = MOCK_LESSONS.filter(
    (l) => l.course_id === course.id
  ).sort((a, b) => a.order_index - b.order_index);

  const allLessons = courseLessons.map(toLessonSummaryItem);
  const targetLesson = courseLessons.find((l) => l.id === cleanLessonId);
  if (!targetLesson) {
    return null;
  }

  // Preserve paid/free-preview lock behavior so the Paywall Card preview works
  const isLocked = course.is_paid && !targetLesson.is_free_preview;
  if (isLocked) {
    return {
      course,
      lesson: null,
      isLocked: true,
      allLessons,
      interactives: [],
      questions: [],
      progressMap: {},
      currentUser: null,
    };
  }

  // Omit html_content here so InteractiveViewer lazy-loads via /api/interactives/[id]
  const interactives = MOCK_INTERACTIVES.filter(
    (item) => item.lesson_id === targetLesson.id
  )
    .sort((a, b) => a.order_index - b.order_index)
    .map(toInteractiveMeta);

  const questions = MOCK_QUESTIONS.filter(
    (q) => q.lesson_id === targetLesson.id
  ).sort((a, b) => a.order_index - b.order_index);

  return {
    course,
    lesson: targetLesson,
    isLocked: false,
    allLessons,
    interactives,
    questions,
    progressMap: {},
    currentUser: null,
  };
}

// ============================================================================
// 5. getDashboardData
// ============================================================================

export async function getDashboardData(): Promise<DashboardData> {
  const publishedCourses = MOCK_COURSES.filter((c) => c.is_published).sort(
    (a, b) =>
      a.year_level - b.year_level ||
      a.term - b.term ||
      a.created_at.localeCompare(b.created_at)
  );

  let totalLessonsAcrossEnrolled = 0;

  const courses: DashboardCourseProgress[] = publishedCourses.map((course) => {
    const courseLessons = MOCK_LESSONS.filter(
      (l) => l.course_id === course.id
    ).sort((a, b) => a.order_index - b.order_index);

    totalLessonsAcrossEnrolled += courseLessons.length;

    return {
      course,
      totalLessons: courseLessons.length,
      completedLessons: 0,
      averageQuizScore: null,
      nextLessonId: courseLessons[0]?.id ?? null,
    };
  });

  return {
    currentUser: null,
    courses,
    totalCompletedLessons: 0,
    totalLessonsAcrossEnrolled,
    overallAverageQuizScore: null,
    isDemoMode: false,
  };
}

// ============================================================================
// 6. getInteractiveById
// ============================================================================

export async function getInteractiveById(
  id: string
): Promise<LessonInteractive | null> {
  const interactiveId = id.trim();
  if (!interactiveId) {
    return null;
  }

  const interactive = MOCK_INTERACTIVES.find(
    (item) => item.id === interactiveId
  );
  if (!interactive) {
    return null;
  }

  const lesson = MOCK_LESSONS.find((l) => l.id === interactive.lesson_id);
  const course = lesson
    ? MOCK_COURSES.find((c) => c.id === lesson.course_id)
    : undefined;

  if (!lesson || !course || !course.is_published) {
    return null;
  }

  if (course.is_paid && !lesson.is_free_preview) {
    return null;
  }

  return interactive;
}

// ============================================================================
// 7. getSearchIndex (Command Palette Ctrl+K index — lightweight, no html/md)
// ============================================================================

export async function getSearchIndex(): Promise<SearchIndexItem[]> {
  const publishedCourses = MOCK_COURSES.filter((c) => c.is_published).sort(
    (a, b) =>
      a.year_level - b.year_level ||
      a.term - b.term ||
      a.created_at.localeCompare(b.created_at)
  );

  const items: SearchIndexItem[] = [];

  for (const course of publishedCourses) {
    items.push({
      type: "مقرر",
      title: `${course.code} · ${course.title_en}`,
      sub: course.title,
      courseSlug: course.slug,
    });

    const courseLessons = MOCK_LESSONS.filter(
      (l) => l.course_id === course.id
    ).sort((a, b) => a.order_index - b.order_index);

    for (const lesson of courseLessons) {
      items.push({
        type: "درس",
        title: lesson.title,
        sub: `${course.code} · ${lesson.title_en ?? course.title_en}`,
        courseSlug: course.slug,
        lessonId: lesson.id,
      });
    }
  }

  return items;
}
