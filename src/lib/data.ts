import { and, eq } from "drizzle-orm";
import {
  getUserActiveEnrollments,
  hasUserAccessToLesson,
  type ActiveEnrollmentSummary,
} from "@/lib/activation/codes";
import { getServerSession } from "@/lib/auth/session";
import {
  courseOverrides,
  getDb,
  getDbOrNull,
  isDatabaseConfigured,
  userProgress,
  type CourseOverrideRow,
} from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";
import {
  MOCK_COURSES,
  MOCK_INTERACTIVES,
  MOCK_LESSONS,
  MOCK_QUESTIONS,
} from "@/lib/mock-data";
import type {
  Course,
  CourseDetailData,
  CourseWithStats,
  CurrentUser,
  DashboardCourseProgress,
  DashboardData,
  Lesson,
  LessonInteractive,
  LessonInteractiveMeta,
  LessonPageData,
  LessonSummaryItem,
  SearchIndexItem,
  UserProgress,
} from "@/types/database";

// ============================================================================
// Live Course Overrides Loader & Merger
// ============================================================================

export function parseFreeLessonIdsJson(raw: string | null | undefined): string[] | null {
  if (!raw || !raw.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

export async function getCourseOverridesMap(): Promise<Map<string, CourseOverrideRow>> {
  const map = new Map<string, CourseOverrideRow>();
  if (!isDatabaseConfigured()) {
    return map;
  }

  try {
    await ensureAdminTables();
    const db = getDbOrNull();
    if (!db) {
      return map;
    }

    const rows = await db.select().from(courseOverrides);
    for (const row of rows) {
      map.set(row.courseId, row);
    }
  } catch (error) {
    console.warn("[data] Failed to load course_overrides; using defaults:", error);
  }
  return map;
}

interface EffectiveCourseEntry {
  course: Course;
  isLockedByOverride: boolean;
  freeLessonIdsOverride: Set<string> | null;
}

function resolveEffectiveCourse(
  baseCourse: Course,
  override?: CourseOverrideRow
): EffectiveCourseEntry {
  if (!override) {
    return {
      course: baseCourse,
      isLockedByOverride: false,
      freeLessonIdsOverride: null,
    };
  }

  const parsedFreeIds = parseFreeLessonIdsJson(override.freeLessonIdsJson);
  return {
    course: {
      ...baseCourse,
      is_published: override.isPublished,
      is_paid: override.isPaid,
      price: override.price,
    },
    isLockedByOverride: Boolean(override.isLocked),
    freeLessonIdsOverride: parsedFreeIds ? new Set(parsedFreeIds) : null,
  };
}

function applyLessonFreeOverride<T extends LessonSummaryItem>(
  lesson: T,
  freeLessonIdsOverride: Set<string> | null
): T {
  if (!freeLessonIdsOverride) {
    return lesson;
  }
  return {
    ...lesson,
    is_free_preview: freeLessonIdsOverride.has(lesson.id),
  };
}

function isCourseVisibleForUser(
  course: Course,
  currentUser: CurrentUser | null
): boolean {
  if (course.is_published) {
    return true;
  }
  return currentUser?.role === "admin";
}

// ============================================================================
// Lightweight Projection & Redaction Helpers
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

function sanitizeCourseForClient(course: Course): Course {
  if (!isDatabaseConfigured()) {
    return course;
  }
  return {
    ...course,
    unlock_code: undefined,
  };
}

function sanitizeLessonForClient(course: Course, lesson: Lesson): Lesson {
  const hasHlsPath = Boolean(lesson.hls_path?.trim());
  const isProtectedVideo =
    lesson.video_provider === "hls" ||
    hasHlsPath ||
    Boolean(course.is_paid && !lesson.is_free_preview && lesson.has_protected_video);

  if (isProtectedVideo) {
    return {
      ...lesson,
      video_id: lesson.video_provider === "hls" ? null : lesson.video_id,
      hls_path: null,
      has_protected_video: true,
    };
  }

  return {
    ...lesson,
    hls_path: null,
    has_protected_video: false,
  };
}

function hasCourseEnrollment(
  course: Course,
  user: CurrentUser | null,
  enrollments: ActiveEnrollmentSummary[],
  isLockedByOverride = false
): boolean {
  if (user?.role === "admin") {
    return true;
  }
  if (isLockedByOverride) {
    return false;
  }
  if (!course.is_paid) {
    return true;
  }
  return enrollments.some(
    (entry) =>
      (entry.scopeType === "bundle" && entry.targetId === "all") ||
      (entry.scopeType === "course" &&
        (entry.targetId === course.id || entry.targetId === course.slug))
  );
}

function hasLessonEnrollment(
  course: Course,
  lesson: LessonSummaryItem,
  user: CurrentUser | null,
  enrollments: ActiveEnrollmentSummary[],
  isLockedByOverride = false
): boolean {
  if (user?.role === "admin") {
    return true;
  }
  if (isLockedByOverride) {
    return false;
  }
  if (!course.is_paid || lesson.is_free_preview) {
    return true;
  }
  return enrollments.some(
    (entry) =>
      (entry.scopeType === "bundle" && entry.targetId === "all") ||
      (entry.scopeType === "course" &&
        (entry.targetId === course.id || entry.targetId === course.slug)) ||
      (entry.scopeType === "lesson" && entry.targetId === lesson.id)
  );
}

async function getServerProgressMap(
  userId: string,
  courseId?: string
): Promise<Record<string, UserProgress>> {
  if (!isDatabaseConfigured() || !userId.trim()) {
    return {};
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(userProgress)
    .where(
      courseId
        ? and(
            eq(userProgress.userId, userId),
            eq(userProgress.courseId, courseId)
          )
        : eq(userProgress.userId, userId)
    );

  const map: Record<string, UserProgress> = {};
  for (const row of rows) {
    map[row.lessonId] = {
      id: row.id,
      user_id: row.userId,
      lesson_id: row.lessonId,
      is_completed: row.isCompleted,
      best_quiz_score: row.bestQuizScore ?? null,
      updated_at: row.updatedAt.toISOString(),
    };
  }
  return map;
}

async function getUserCloudContext(courseId?: string): Promise<{
  currentUser: CurrentUser | null;
  enrollments: ActiveEnrollmentSummary[];
  progressMap: Record<string, UserProgress>;
}> {
  if (!isDatabaseConfigured()) {
    return { currentUser: null, enrollments: [], progressMap: {} };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { currentUser: null, enrollments: [], progressMap: {} };
  }

  const [enrollments, progressMap] = await Promise.all([
    getUserActiveEnrollments(currentUser.id),
    getServerProgressMap(currentUser.id, courseId),
  ]);

  return { currentUser, enrollments, progressMap };
}

// ============================================================================
// 1. getCurrentUser (Cloud Neon session when configured; null in standalone)
// ============================================================================

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const session = await getServerSession();
  if (!session) {
    return null;
  }

  return {
    id: session.id,
    email: session.email,
    full_name: session.fullName,
    avatar_url: session.avatarUrl ?? null,
    year_level: session.yearLevel,
    department: session.department,
    role: session.role,
  };
}

// ============================================================================
// 2. getPublishedCourses
// ============================================================================

export async function getPublishedCourses(): Promise<CourseWithStats[]> {
  const [{ currentUser, enrollments, progressMap }, overridesMap] =
    await Promise.all([getUserCloudContext(), getCourseOverridesMap()]);

  const lessonIdsByCourse = new Map<string, string[]>();
  for (const lesson of MOCK_LESSONS) {
    const existing = lessonIdsByCourse.get(lesson.course_id);
    if (existing) {
      existing.push(lesson.id);
    } else {
      lessonIdsByCourse.set(lesson.course_id, [lesson.id]);
    }
  }

  return MOCK_COURSES.map((baseCourse) =>
    resolveEffectiveCourse(baseCourse, overridesMap.get(baseCourse.id))
  )
    .filter(({ course }) => isCourseVisibleForUser(course, currentUser))
    .sort(
      (a, b) =>
        a.course.year_level - b.course.year_level ||
        a.course.term - b.course.term ||
        a.course.created_at.localeCompare(b.course.created_at)
    )
    .map(({ course, isLockedByOverride }) => {
      const lessonIds = lessonIdsByCourse.get(course.id) ?? [];
      let completedCount = 0;
      for (const lessonId of lessonIds) {
        if (progressMap[lessonId]?.is_completed) {
          completedCount += 1;
        }
      }

      return {
        ...sanitizeCourseForClient(course),
        lesson_count: lessonIds.length,
        completed_count: completedCount,
        is_enrolled: hasCourseEnrollment(
          course,
          currentUser,
          enrollments,
          isLockedByOverride
        ),
      };
    });
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

  const baseCourse = MOCK_COURSES.find((c) => c.slug === cleanSlug);
  if (!baseCourse) {
    return null;
  }

  const [{ currentUser, enrollments, progressMap }, overridesMap] =
    await Promise.all([
      getUserCloudContext(baseCourse.id),
      getCourseOverridesMap(),
    ]);

  const { course, isLockedByOverride, freeLessonIdsOverride } =
    resolveEffectiveCourse(baseCourse, overridesMap.get(baseCourse.id));

  if (!isCourseVisibleForUser(course, currentUser)) {
    return null;
  }

  const lessons = MOCK_LESSONS.filter((l) => l.course_id === course.id)
    .sort((a, b) => a.order_index - b.order_index)
    .map((l) =>
      toLessonSummaryItem(applyLessonFreeOverride(l, freeLessonIdsOverride))
    );

  return {
    course: sanitizeCourseForClient(course),
    lessons,
    progressMap,
    isEnrolled: hasCourseEnrollment(
      course,
      currentUser,
      enrollments,
      isLockedByOverride
    ),
    currentUser,
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

  const baseCourse = MOCK_COURSES.find((c) => c.slug === cleanSlug);
  if (!baseCourse) {
    return null;
  }

  const [{ currentUser, enrollments, progressMap }, overridesMap] =
    await Promise.all([
      getUserCloudContext(baseCourse.id),
      getCourseOverridesMap(),
    ]);

  const { course, isLockedByOverride, freeLessonIdsOverride } =
    resolveEffectiveCourse(baseCourse, overridesMap.get(baseCourse.id));

  if (!isCourseVisibleForUser(course, currentUser)) {
    return null;
  }

  const courseLessons = MOCK_LESSONS.filter((l) => l.course_id === course.id)
    .sort((a, b) => a.order_index - b.order_index)
    .map((l) => applyLessonFreeOverride(l, freeLessonIdsOverride));

  const allLessons = courseLessons.map(toLessonSummaryItem);
  const targetLesson = courseLessons.find((l) => l.id === cleanLessonId);
  if (!targetLesson) {
    return null;
  }

  const isEnrolled = hasCourseEnrollment(
    course,
    currentUser,
    enrollments,
    isLockedByOverride
  );
  const hasAccess = hasLessonEnrollment(
    course,
    targetLesson,
    currentUser,
    enrollments,
    isLockedByOverride
  );
  const isLocked = !hasAccess;

  const safeCourse = sanitizeCourseForClient(course);

  if (isLocked) {
    return {
      course: safeCourse,
      lesson: null,
      isLocked: true,
      isEnrolled,
      allLessons,
      interactives: [],
      questions: [],
      progressMap,
      currentUser,
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
    course: safeCourse,
    lesson: sanitizeLessonForClient(course, targetLesson),
    isLocked: false,
    isEnrolled,
    allLessons,
    interactives,
    questions,
    progressMap,
    currentUser,
  };
}

// ============================================================================
// 5. getDashboardData
// ============================================================================

export async function getDashboardData(): Promise<DashboardData> {
  const [{ currentUser, enrollments, progressMap }, overridesMap] =
    await Promise.all([getUserCloudContext(), getCourseOverridesMap()]);

  const visibleCourses = MOCK_COURSES.map((baseCourse) =>
    resolveEffectiveCourse(baseCourse, overridesMap.get(baseCourse.id))
  )
    .filter(({ course }) => isCourseVisibleForUser(course, currentUser))
    .sort(
      (a, b) =>
        a.course.year_level - b.course.year_level ||
        a.course.term - b.course.term ||
        a.course.created_at.localeCompare(b.course.created_at)
    );

  let totalCompletedLessons = 0;
  let totalLessonsAcrossEnrolled = 0;
  let overallScoreSum = 0;
  let overallScoreCount = 0;

  const courses: DashboardCourseProgress[] = visibleCourses.map(
    ({ course, isLockedByOverride, freeLessonIdsOverride }) => {
      const courseLessons = MOCK_LESSONS.filter(
        (l) => l.course_id === course.id
      )
        .sort((a, b) => a.order_index - b.order_index)
        .map((l) => applyLessonFreeOverride(l, freeLessonIdsOverride));

      const isEnrolled = hasCourseEnrollment(
        course,
        currentUser,
        enrollments,
        isLockedByOverride
      );
      if (isEnrolled || !isDatabaseConfigured()) {
        totalLessonsAcrossEnrolled += courseLessons.length;
      }

      let completedLessons = 0;
      let courseScoreSum = 0;
      let courseScoreCount = 0;
      let nextLessonId: string | null = null;

      for (const lesson of courseLessons) {
        const progress = progressMap[lesson.id];
        const completed = Boolean(progress?.is_completed);
        if (completed) {
          completedLessons += 1;
          totalCompletedLessons += 1;
        } else if (
          nextLessonId === null &&
          hasLessonEnrollment(
            course,
            lesson,
            currentUser,
            enrollments,
            isLockedByOverride
          )
        ) {
          nextLessonId = lesson.id;
        }

        if (typeof progress?.best_quiz_score === "number") {
          courseScoreSum += progress.best_quiz_score;
          courseScoreCount += 1;
          overallScoreSum += progress.best_quiz_score;
          overallScoreCount += 1;
        }
      }

      return {
        course: sanitizeCourseForClient(course),
        totalLessons: courseLessons.length,
        completedLessons,
        averageQuizScore:
          courseScoreCount > 0
            ? Math.round(courseScoreSum / courseScoreCount)
            : null,
        nextLessonId: nextLessonId ?? courseLessons[0]?.id ?? null,
      };
    }
  );

  return {
    currentUser,
    courses,
    totalCompletedLessons,
    totalLessonsAcrossEnrolled,
    overallAverageQuizScore:
      overallScoreCount > 0
        ? Math.round(overallScoreSum / overallScoreCount)
        : null,
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

  const baseLesson = MOCK_LESSONS.find((l) => l.id === interactive.lesson_id);
  const baseCourse = baseLesson
    ? MOCK_COURSES.find((c) => c.id === baseLesson.course_id)
    : undefined;

  if (!baseLesson || !baseCourse) {
    return null;
  }

  const [currentUser, overridesMap] = await Promise.all([
    getCurrentUser(),
    getCourseOverridesMap(),
  ]);

  const { course, isLockedByOverride, freeLessonIdsOverride } =
    resolveEffectiveCourse(baseCourse, overridesMap.get(baseCourse.id));
  const lesson = applyLessonFreeOverride(baseLesson, freeLessonIdsOverride);

  if (!isCourseVisibleForUser(course, currentUser)) {
    return null;
  }

  if (isLockedByOverride && currentUser?.role !== "admin") {
    return null;
  }

  if (course.is_paid && !lesson.is_free_preview) {
    if (!currentUser) {
      return null;
    }

    const authorized =
      currentUser.role === "admin" ||
      (await hasUserAccessToLesson(
        currentUser.id,
        course.id,
        lesson.id,
        course.is_paid,
        lesson.is_free_preview
      ));

    if (!authorized) {
      return null;
    }
  }

  return interactive;
}

// ============================================================================
// 7. getSearchIndex (Command Palette Ctrl+K index — lightweight, no html/md)
// ============================================================================

export async function getSearchIndex(): Promise<SearchIndexItem[]> {
  const [currentUser, overridesMap] = await Promise.all([
    getCurrentUser(),
    getCourseOverridesMap(),
  ]);

  const visibleCourses = MOCK_COURSES.map((baseCourse) =>
    resolveEffectiveCourse(baseCourse, overridesMap.get(baseCourse.id)).course
  )
    .filter((c) => isCourseVisibleForUser(c, currentUser))
    .sort(
      (a, b) =>
        a.year_level - b.year_level ||
        a.term - b.term ||
        a.created_at.localeCompare(b.created_at)
    );

  const items: SearchIndexItem[] = [];

  for (const course of visibleCourses) {
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
