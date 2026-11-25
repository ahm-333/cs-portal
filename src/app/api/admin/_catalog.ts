import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";
import type {
  ActivationScope,
  AdminCodeItem,
  AdminCodeStatus,
  AdminCourseOption,
  AdminLessonOption,
} from "@/components/admin/adminTypes";
import type { ActivationCodeRow } from "@/lib/db";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

const COURSE_BY_ID = new Map(MOCK_COURSES.map((course) => [course.id, course]));
const COURSE_BY_SLUG = new Map(
  MOCK_COURSES.map((course) => [course.slug, course])
);
const LESSON_BY_ID = new Map(MOCK_LESSONS.map((lesson) => [lesson.id, lesson]));

export function resolveAdminTargetLabel(
  scopeType: ActivationScope,
  targetId: string
): string {
  if (scopeType === "bundle") {
    return "جميع المقررات (باقة شاملة)";
  }

  if (scopeType === "course") {
    const course = COURSE_BY_ID.get(targetId) ?? COURSE_BY_SLUG.get(targetId);
    if (course) {
      return `${course.code} — ${course.title}`;
    }
    return `مقرر (${targetId})`;
  }

  if (scopeType === "lesson") {
    const lesson = LESSON_BY_ID.get(targetId);
    if (lesson) {
      const parent = COURSE_BY_ID.get(lesson.course_id);
      return parent
        ? `${parent.code} · ${lesson.title}`
        : lesson.title;
    }
    return `فصل (${targetId})`;
  }

  return targetId;
}

export function computeCodeStatus(
  row: Pick<ActivationCodeRow, "isRevoked" | "usedCount" | "maxUses" | "expiresAt">,
  now: Date = new Date()
): AdminCodeStatus {
  if (row.isRevoked) return "revoked";
  if (row.usedCount >= row.maxUses) return "used";
  if (row.expiresAt && row.expiresAt.getTime() <= now.getTime()) return "expired";
  return "available";
}

export function serializeActivationCode(
  row: ActivationCodeRow,
  now: Date = new Date()
): AdminCodeItem {
  return {
    id: row.id,
    code: row.code,
    scopeType: row.scopeType,
    targetId: row.targetId,
    targetLabel: resolveAdminTargetLabel(row.scopeType, row.targetId),
    batchLabel: row.batchLabel ?? null,
    maxUses: row.maxUses,
    usedCount: row.usedCount,
    isRevoked: row.isRevoked,
    status: computeCodeStatus(row, now),
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    createdBy: row.createdBy ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function getAdminCourseOptions(): AdminCourseOption[] {
  const lessonCountMap = new Map<string, number>();
  for (const lesson of MOCK_LESSONS) {
    lessonCountMap.set(
      lesson.course_id,
      (lessonCountMap.get(lesson.course_id) ?? 0) + 1
    );
  }

  return MOCK_COURSES.slice()
    .sort(
      (a, b) =>
        Number(b.is_published) - Number(a.is_published) ||
        a.year_level - b.year_level ||
        a.term - b.term
    )
    .map((course) => ({
      id: course.id,
      slug: course.slug,
      code: course.code,
      title: course.title,
      titleEn: course.title_en,
      yearLevel: course.year_level,
      term: course.term,
      isPaid: course.is_paid,
      isPublished: course.is_published,
      accent: course.accent,
      lessonCount: lessonCountMap.get(course.id) ?? 0,
    }));
}

export function getAdminLessonOptions(): AdminLessonOption[] {
  return MOCK_LESSONS.slice()
    .sort((a, b) => {
      const courseA = COURSE_BY_ID.get(a.course_id);
      const courseB = COURSE_BY_ID.get(b.course_id);
      const codeCmp = (courseA?.code ?? "").localeCompare(courseB?.code ?? "");
      if (codeCmp !== 0) return codeCmp;
      return a.order_index - b.order_index;
    })
    .map((lesson) => {
      const course = COURSE_BY_ID.get(lesson.course_id);
      return {
        id: lesson.id,
        courseId: lesson.course_id,
        courseCode: course?.code ?? "CS",
        courseTitle: course?.title ?? "مقرر",
        sectionTitle: lesson.section_title,
        title: lesson.title,
        titleEn: lesson.title_en,
        orderIndex: lesson.order_index,
        isFreePreview: Boolean(lesson.is_free_preview),
      };
    });
}

export function getPublishedLessonCount(): number {
  const publishedCourseIds = new Set(
    MOCK_COURSES.filter((c) => c.is_published).map((c) => c.id)
  );
  const count = MOCK_LESSONS.filter((l) =>
    publishedCourseIds.has(l.course_id)
  ).length;
  return count > 0 ? count : MOCK_LESSONS.length;
}
