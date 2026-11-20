import { isSupabaseConfigured } from "@/lib/config";
import {
  MOCK_COURSES,
  MOCK_INTERACTIVES,
  MOCK_LESSONS,
  MOCK_QUESTIONS,
} from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type {
  Course,
  CourseDetailData,
  CourseWithStats,
  CurrentUser,
  DashboardCourseProgress,
  DashboardData,
  InteractiveSourceType,
  Lesson,
  LessonInteractive,
  LessonInteractiveMeta,
  LessonPageData,
  LessonResource,
  LessonSummaryItem,
  Question,
  UserProgress,
  VideoProvider,
} from "@/types/database";

// ============================================================================
// Explicit Column Projections (Free-Tier Egress Optimization)
// NEVER select `summary_md` or `html_content` in course/lesson list queries.
// ============================================================================

const COURSE_COLUMNS =
  "id, slug, title, description, thumbnail_url, year_level, term, is_paid, price, is_published, created_at";

const LESSON_SUMMARY_COLUMNS =
  "id, course_id, section_title, title, order_index, is_free_preview, duration_minutes";

const LESSON_DETAIL_COLUMNS =
  "id, course_id, section_title, title, order_index, is_free_preview, duration_minutes, video_provider, video_id, summary_md, resources, created_at";

const INTERACTIVE_META_COLUMNS =
  "id, lesson_id, title, description, order_index, source_type, external_url, default_height";

const INTERACTIVE_FULL_COLUMNS =
  "id, lesson_id, title, description, order_index, source_type, external_url, default_height, html_content, created_at";

const QUESTION_COLUMNS =
  "id, lesson_id, question_text, code_snippet, code_lang, options, correct_index, explanation, order_index";

const PROGRESS_COLUMNS =
  "id, user_id, lesson_id, is_completed, best_quiz_score, updated_at";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface RawCourseRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  year_level: number;
  term: number;
  is_paid: boolean;
  price: number | string;
  is_published: boolean;
  created_at: string;
}

interface RawLessonDetailRow extends LessonSummaryItem {
  video_provider: string;
  video_id: string | null;
  summary_md: string | null;
  resources: unknown;
  created_at: string;
}

interface RawInteractiveMetaRow {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  order_index: number;
  source_type: string;
  external_url: string | null;
  default_height: number;
}

interface RawInteractiveFullRow extends RawInteractiveMetaRow {
  html_content: string | null;
  created_at: string;
}

interface RawQuestionRow {
  id: string;
  lesson_id: string;
  question_text: string;
  code_snippet: string | null;
  code_lang: string | null;
  options: unknown;
  correct_index: number;
  explanation: string | null;
  order_index: number;
}

interface EnrollmentCheckRow {
  course_id: string;
  status: string;
  expires_at: string | null;
}

interface LessonCountRow {
  course_id: string;
  lesson_count: number | string;
}

// ============================================================================
// Normalization & Projection Helpers
// ============================================================================

function normalizeCourse(row: RawCourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    thumbnail_url: row.thumbnail_url,
    year_level: Number(row.year_level),
    term: Number(row.term),
    is_paid: Boolean(row.is_paid),
    price: Number(row.price ?? 0),
    is_published: Boolean(row.is_published),
    created_at: row.created_at,
  };
}

function toLessonSummaryItem(lesson: LessonSummaryItem): LessonSummaryItem {
  return {
    id: lesson.id,
    course_id: lesson.course_id,
    section_title: lesson.section_title,
    title: lesson.title,
    order_index: lesson.order_index,
    is_free_preview: lesson.is_free_preview,
    duration_minutes: lesson.duration_minutes ?? null,
  };
}

function toVideoProvider(value: string): VideoProvider {
  return value === "bunny" ? "bunny" : "youtube";
}

function toInteractiveSourceType(value: string): InteractiveSourceType {
  return value === "external_url" ? "external_url" : "html_code";
}

function toInteractiveMeta(item: RawInteractiveMetaRow): LessonInteractiveMeta {
  return {
    id: item.id,
    lesson_id: item.lesson_id,
    title: item.title,
    description: item.description,
    order_index: item.order_index,
    source_type: toInteractiveSourceType(item.source_type),
    external_url: item.external_url,
    default_height: item.default_height,
  };
}

const VALID_RESOURCE_TYPES = new Set<NonNullable<LessonResource["type"]>>([
  "article",
  "video",
  "tool",
  "sheet",
  "problem",
  "other",
]);

function normalizeResources(raw: unknown): LessonResource[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const resources: LessonResource[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }
    const obj = entry as Record<string, unknown>;
    if (typeof obj.title !== "string" || typeof obj.url !== "string") {
      continue;
    }

    const rawType = obj.type;
    const type =
      typeof rawType === "string" &&
      VALID_RESOURCE_TYPES.has(rawType as NonNullable<LessonResource["type"]>)
        ? (rawType as NonNullable<LessonResource["type"]>)
        : undefined;

    resources.push({
      title: obj.title,
      url: obj.url,
      type,
      description:
        typeof obj.description === "string" ? obj.description : undefined,
    });
  }

  return resources;
}

function normalizeLessonDetail(row: RawLessonDetailRow): Lesson {
  return {
    ...toLessonSummaryItem(row),
    video_provider: toVideoProvider(row.video_provider),
    video_id: row.video_id,
    summary_md: row.summary_md,
    resources: normalizeResources(row.resources),
    created_at: row.created_at,
  };
}

function normalizeQuestion(row: RawQuestionRow): Question {
  const options = Array.isArray(row.options)
    ? row.options.filter((opt): opt is string => typeof opt === "string")
    : [];

  return {
    id: row.id,
    lesson_id: row.lesson_id,
    question_text: row.question_text,
    code_snippet: row.code_snippet,
    code_lang: row.code_lang,
    options,
    correct_index: row.correct_index,
    explanation: row.explanation,
    order_index: row.order_index,
  };
}

function isEnrollmentActive(row: EnrollmentCheckRow): boolean {
  if (row.status !== "active") {
    return false;
  }
  if (!row.expires_at) {
    return true;
  }
  return new Date(row.expires_at).getTime() > Date.now();
}

async function fetchCourseCurriculum(
  supabase: ServerSupabaseClient,
  courseId: string
): Promise<LessonSummaryItem[]> {
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_course_curriculum",
      { p_course_id: courseId }
    );

    if (!rpcError && Array.isArray(rpcData)) {
      return (rpcData as LessonSummaryItem[]).map(toLessonSummaryItem);
    }
  } catch {
    // Fallback to direct lightweight query below
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("lessons")
    .select(LESSON_SUMMARY_COLUMNS)
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (fallbackError || !fallbackData) {
    return [];
  }

  return (fallbackData as LessonSummaryItem[]).map(toLessonSummaryItem);
}

async function fetchUserCourseEnrollment(
  supabase: ServerSupabaseClient,
  userId: string,
  courseId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select("course_id, status, expires_at")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("status", "active")
      .maybeSingle<EnrollmentCheckRow>();

    if (error || !data) {
      return false;
    }

    return isEnrollmentActive(data);
  } catch {
    return false;
  }
}

async function fetchProgressMapForLessons(
  supabase: ServerSupabaseClient,
  userId: string,
  lessonIds: string[]
): Promise<Record<string, UserProgress>> {
  if (lessonIds.length === 0) {
    return {};
  }

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select(PROGRESS_COLUMNS)
      .eq("user_id", userId)
      .in("lesson_id", lessonIds);

    if (error || !data) {
      return {};
    }

    const map: Record<string, UserProgress> = {};
    for (const row of data as UserProgress[]) {
      map[row.lesson_id] = row;
    }
    return map;
  } catch {
    return {};
  }
}

// ============================================================================
// 1. getCurrentUser
// ============================================================================

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, role")
      .eq("id", user.id)
      .maybeSingle<{
        full_name: string | null;
        avatar_url: string | null;
        role: string;
      }>();

    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const metaFullName =
      typeof meta?.full_name === "string"
        ? meta.full_name
        : typeof meta?.name === "string"
          ? meta.name
          : null;
    const metaAvatarUrl =
      typeof meta?.avatar_url === "string" ? meta.avatar_url : null;

    return {
      id: user.id,
      email: user.email ?? null,
      full_name: profile?.full_name ?? metaFullName,
      avatar_url: profile?.avatar_url ?? metaAvatarUrl,
      role: profile?.role === "admin" ? "admin" : "student",
    };
  } catch {
    return null;
  }
}

// ============================================================================
// 2. getPublishedCourses
// ============================================================================

export async function getPublishedCourses(): Promise<CourseWithStats[]> {
  if (!isSupabaseConfigured()) {
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

  const supabase = await createClient();

  try {
    const [coursesResult, currentUser] = await Promise.all([
      supabase
        .from("courses")
        .select(COURSE_COLUMNS)
        .eq("is_published", true)
        .order("year_level", { ascending: true })
        .order("term", { ascending: true })
        .order("created_at", { ascending: true }),
      getCurrentUser(),
    ]);

    if (coursesResult.error || !coursesResult.data) {
      return [];
    }

    const courses = (coursesResult.data as RawCourseRow[]).map(normalizeCourse);
    if (courses.length === 0) {
      return [];
    }

    // Fetch lightweight lesson counts per course (never selects summary_md)
    const lessonCountMap = new Map<string, number>();
    let rpcSucceeded = false;

    try {
      const { data: countsData, error: countsError } = await supabase.rpc(
        "get_published_course_lesson_counts"
      );
      if (!countsError && Array.isArray(countsData)) {
        rpcSucceeded = true;
        for (const row of countsData as LessonCountRow[]) {
          lessonCountMap.set(row.course_id, Number(row.lesson_count ?? 0));
        }
      }
    } catch {
      rpcSucceeded = false;
    }

    if (!rpcSucceeded) {
      const courseIds = courses.map((c) => c.id);
      const { data: lessonIdRows } = await supabase
        .from("lessons")
        .select("id, course_id")
        .in("course_id", courseIds);

      if (lessonIdRows) {
        for (const row of lessonIdRows as { id: string; course_id: string }[]) {
          lessonCountMap.set(
            row.course_id,
            (lessonCountMap.get(row.course_id) ?? 0) + 1
          );
        }
      }
    }

    const enrolledCourseIds = new Set<string>();
    const completedCountByCourse = new Map<string, number>();

    if (currentUser) {
      const [enrollmentsRes, completedRes] = await Promise.all([
        supabase
          .from("enrollments")
          .select("course_id, status, expires_at")
          .eq("user_id", currentUser.id)
          .eq("status", "active"),
        supabase
          .from("user_progress")
          .select("lesson_id")
          .eq("user_id", currentUser.id)
          .eq("is_completed", true),
      ]);

      if (!enrollmentsRes.error && enrollmentsRes.data) {
        for (const row of enrollmentsRes.data as EnrollmentCheckRow[]) {
          if (isEnrollmentActive(row)) {
            enrolledCourseIds.add(row.course_id);
          }
        }
      }

      if (
        !completedRes.error &&
        completedRes.data &&
        completedRes.data.length > 0
      ) {
        const completedLessonIds = (
          completedRes.data as { lesson_id: string }[]
        ).map((r) => r.lesson_id);

        const { data: completedLessons } = await supabase
          .from("lessons")
          .select("id, course_id")
          .in("id", completedLessonIds);

        if (completedLessons) {
          for (const row of completedLessons as {
            id: string;
            course_id: string;
          }[]) {
            completedCountByCourse.set(
              row.course_id,
              (completedCountByCourse.get(row.course_id) ?? 0) + 1
            );
          }
        }
      }
    }

    return courses.map((course) => ({
      ...course,
      lesson_count: lessonCountMap.get(course.id) ?? 0,
      completed_count: completedCountByCourse.get(course.id) ?? 0,
      is_enrolled:
        !course.is_paid ||
        currentUser?.role === "admin" ||
        enrolledCourseIds.has(course.id),
    }));
  } catch {
    return [];
  }
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

  if (!isSupabaseConfigured()) {
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

  const supabase = await createClient();

  try {
    const { data: courseRow, error: courseError } = await supabase
      .from("courses")
      .select(COURSE_COLUMNS)
      .eq("slug", cleanSlug)
      .eq("is_published", true)
      .maybeSingle<RawCourseRow>();

    if (courseError || !courseRow) {
      return null;
    }

    const course = normalizeCourse(courseRow);
    const [currentUser, lessons] = await Promise.all([
      getCurrentUser(),
      fetchCourseCurriculum(supabase, course.id),
    ]);

    let isEnrolled = !course.is_paid;
    if (course.is_paid && currentUser) {
      isEnrolled =
        currentUser.role === "admin" ||
        (await fetchUserCourseEnrollment(supabase, currentUser.id, course.id));
    }

    const progressMap = currentUser
      ? await fetchProgressMapForLessons(
          supabase,
          currentUser.id,
          lessons.map((l) => l.id)
        )
      : {};

    return {
      course,
      lessons,
      progressMap,
      isEnrolled,
      currentUser,
    };
  } catch {
    return null;
  }
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

  if (!isSupabaseConfigured()) {
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

    const isLocked = course.is_paid && !targetLesson.is_free_preview;
    if (isLocked) {
      return {
        course,
        lesson: null,
        isLocked: true,
        isEnrolled: false,
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
      isEnrolled: !course.is_paid,
      allLessons,
      interactives,
      questions,
      progressMap: {},
      currentUser: null,
    };
  }

  const supabase = await createClient();

  try {
    const { data: courseRow, error: courseError } = await supabase
      .from("courses")
      .select(COURSE_COLUMNS)
      .eq("slug", cleanSlug)
      .eq("is_published", true)
      .maybeSingle<RawCourseRow>();

    if (courseError || !courseRow) {
      return null;
    }

    const course = normalizeCourse(courseRow);
    const [currentUser, allLessons] = await Promise.all([
      getCurrentUser(),
      fetchCourseCurriculum(supabase, course.id),
    ]);

    const targetSummary = allLessons.find((l) => l.id === cleanLessonId);
    if (!targetSummary) {
      return null;
    }

    let isEnrolled = !course.is_paid;
    if (course.is_paid && currentUser) {
      isEnrolled =
        currentUser.role === "admin" ||
        (await fetchUserCourseEnrollment(supabase, currentUser.id, course.id));
    }

    const isLocked =
      course.is_paid && !isEnrolled && !targetSummary.is_free_preview;

    const progressMap = currentUser
      ? await fetchProgressMapForLessons(
          supabase,
          currentUser.id,
          allLessons.map((l) => l.id)
        )
      : {};

    if (isLocked) {
      return {
        course,
        lesson: null,
        isLocked: true,
        isEnrolled: false,
        allLessons,
        interactives: [],
        questions: [],
        progressMap,
        currentUser,
      };
    }

    const [lessonRes, interactivesRes, questionsRes] = await Promise.all([
      supabase
        .from("lessons")
        .select(LESSON_DETAIL_COLUMNS)
        .eq("id", cleanLessonId)
        .eq("course_id", course.id)
        .maybeSingle<RawLessonDetailRow>(),
      supabase
        .from("lesson_interactives")
        .select(INTERACTIVE_META_COLUMNS)
        .eq("lesson_id", cleanLessonId)
        .order("order_index", { ascending: true }),
      supabase
        .from("questions")
        .select(QUESTION_COLUMNS)
        .eq("lesson_id", cleanLessonId)
        .order("order_index", { ascending: true }),
    ]);

    // If RLS denied access (e.g., enrollment expired mid-request), treat as locked
    if (lessonRes.error || !lessonRes.data) {
      return {
        course,
        lesson: null,
        isLocked: true,
        isEnrolled: false,
        allLessons,
        interactives: [],
        questions: [],
        progressMap,
        currentUser,
      };
    }

    const lesson = normalizeLessonDetail(lessonRes.data);
    const interactives =
      !interactivesRes.error && interactivesRes.data
        ? (interactivesRes.data as RawInteractiveMetaRow[]).map(
            toInteractiveMeta
          )
        : [];
    const questions =
      !questionsRes.error && questionsRes.data
        ? (questionsRes.data as RawQuestionRow[]).map(normalizeQuestion)
        : [];

    return {
      course,
      lesson,
      isLocked: false,
      isEnrolled,
      allLessons,
      interactives,
      questions,
      progressMap,
      currentUser,
    };
  } catch {
    return null;
  }
}

// ============================================================================
// 5. getDashboardData
// ============================================================================

export async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) {
    const publishedCourses = MOCK_COURSES.filter((c) => c.is_published).sort(
      (a, b) =>
        a.year_level - b.year_level ||
        a.term - b.term ||
        a.created_at.localeCompare(b.created_at)
    );

    let totalLessonsAcrossEnrolled = 0;

    const courses: DashboardCourseProgress[] = publishedCourses.map(
      (course) => {
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
      }
    );

    return {
      currentUser: null,
      courses,
      totalCompletedLessons: 0,
      totalLessonsAcrossEnrolled,
      overallAverageQuizScore: null,
      isDemoMode: true,
    };
  }

  const supabase = await createClient();

  try {
    const [currentUser, coursesRes] = await Promise.all([
      getCurrentUser(),
      supabase
        .from("courses")
        .select(COURSE_COLUMNS)
        .eq("is_published", true)
        .order("year_level", { ascending: true })
        .order("term", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (coursesRes.error || !coursesRes.data) {
      return {
        currentUser,
        courses: [],
        totalCompletedLessons: 0,
        totalLessonsAcrossEnrolled: 0,
        overallAverageQuizScore: null,
        isDemoMode: false,
      };
    }

    const allCourses = (coursesRes.data as RawCourseRow[]).map(normalizeCourse);

    const enrolledCourseIds = new Set<string>();
    const progressByLesson = new Map<string, UserProgress>();

    if (currentUser) {
      const [enrollmentsRes, progressRes] = await Promise.all([
        supabase
          .from("enrollments")
          .select("course_id, status, expires_at")
          .eq("user_id", currentUser.id)
          .eq("status", "active"),
        supabase
          .from("user_progress")
          .select(PROGRESS_COLUMNS)
          .eq("user_id", currentUser.id),
      ]);

      if (!enrollmentsRes.error && enrollmentsRes.data) {
        for (const row of enrollmentsRes.data as EnrollmentCheckRow[]) {
          if (isEnrollmentActive(row)) {
            enrolledCourseIds.add(row.course_id);
          }
        }
      }

      if (!progressRes.error && progressRes.data) {
        for (const row of progressRes.data as UserProgress[]) {
          progressByLesson.set(row.lesson_id, row);
        }
      }
    }

    // Show all free published courses + any paid courses the user has active enrollment in
    const accessibleCourses = allCourses.filter(
      (course) =>
        !course.is_paid ||
        currentUser?.role === "admin" ||
        enrolledCourseIds.has(course.id)
    );

    if (accessibleCourses.length === 0) {
      return {
        currentUser,
        courses: [],
        totalCompletedLessons: 0,
        totalLessonsAcrossEnrolled: 0,
        overallAverageQuizScore: null,
        isDemoMode: false,
      };
    }

    const accessibleCourseIds = accessibleCourses.map((c) => c.id);
    // Lightweight projection: ONLY id, course_id, order_index (never summary_md)
    const { data: lessonRows } = await supabase
      .from("lessons")
      .select("id, course_id, order_index")
      .in("course_id", accessibleCourseIds)
      .order("order_index", { ascending: true });

    const lessonsByCourse = new Map<
      string,
      { id: string; course_id: string; order_index: number }[]
    >();

    if (lessonRows) {
      for (const row of lessonRows as {
        id: string;
        course_id: string;
        order_index: number;
      }[]) {
        const list = lessonsByCourse.get(row.course_id) ?? [];
        list.push(row);
        lessonsByCourse.set(row.course_id, list);
      }
    }

    let totalCompletedLessons = 0;
    let totalLessonsAcrossEnrolled = 0;
    const allQuizScores: number[] = [];

    const courses: DashboardCourseProgress[] = accessibleCourses.map(
      (course) => {
        const courseLessons = lessonsByCourse.get(course.id) ?? [];
        const totalLessons = courseLessons.length;
        totalLessonsAcrossEnrolled += totalLessons;

        let completedLessons = 0;
        const courseScores: number[] = [];
        let firstIncompleteLessonId: string | null = null;

        for (const lesson of courseLessons) {
          const progress = progressByLesson.get(lesson.id);
          if (progress?.is_completed) {
            completedLessons += 1;
          } else if (firstIncompleteLessonId === null) {
            firstIncompleteLessonId = lesson.id;
          }

          if (typeof progress?.best_quiz_score === "number") {
            courseScores.push(progress.best_quiz_score);
            allQuizScores.push(progress.best_quiz_score);
          }
        }

        totalCompletedLessons += completedLessons;

        const averageQuizScore =
          courseScores.length > 0
            ? Math.round(
                courseScores.reduce((sum, score) => sum + score, 0) /
                  courseScores.length
              )
            : null;

        const nextLessonId =
          firstIncompleteLessonId ?? courseLessons[0]?.id ?? null;

        return {
          course,
          totalLessons,
          completedLessons,
          averageQuizScore,
          nextLessonId,
        };
      }
    );

    const overallAverageQuizScore =
      allQuizScores.length > 0
        ? Math.round(
            allQuizScores.reduce((sum, score) => sum + score, 0) /
              allQuizScores.length
          )
        : null;

    return {
      currentUser,
      courses,
      totalCompletedLessons,
      totalLessonsAcrossEnrolled,
      overallAverageQuizScore,
      isDemoMode: false,
    };
  } catch {
    return {
      currentUser: null,
      courses: [],
      totalCompletedLessons: 0,
      totalLessonsAcrossEnrolled: 0,
      overallAverageQuizScore: null,
      isDemoMode: false,
    };
  }
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

  if (!isSupabaseConfigured()) {
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

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("lesson_interactives")
      .select(INTERACTIVE_FULL_COLUMNS)
      .eq("id", interactiveId)
      .maybeSingle<RawInteractiveFullRow>();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      lesson_id: data.lesson_id,
      title: data.title,
      description: data.description,
      order_index: data.order_index,
      source_type: toInteractiveSourceType(data.source_type),
      external_url: data.external_url,
      default_height: data.default_height,
      html_content: data.html_content,
      created_at: data.created_at,
    };
  } catch {
    return null;
  }
}
