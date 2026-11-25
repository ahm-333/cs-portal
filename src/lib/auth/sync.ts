import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  enrollments,
  userMistakes,
  userNotes,
  userProgress,
  users,
} from "@/lib/db/schema";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";
import type { SessionDepartment, SessionUser } from "./session";

export const DB_NOT_CONFIGURED_MESSAGE =
  "المزامنة السحابية غير مفعّلة بعد على هذا السيرفر — يمكنك المتابعة كزائر محلياً.";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_DEPTS = new Set<SessionDepartment>(["CS", "AI", "IS", "IT"]);

const LESSON_TO_COURSE_ID = new Map<string, string>(
  MOCK_LESSONS.map((lesson) => [lesson.id, lesson.course_id])
);

const COURSE_SLUG_TO_ID = new Map<string, string>(
  MOCK_COURSES.map((course) => [course.slug, course.id])
);

const ALL_COURSE_IDS = MOCK_COURSES.map((course) => course.id);

export interface CloudMistakeItem {
  courseId: string;
  courseCode: string;
  lessonId?: string;
  q: string;
  ansText: string;
}

export interface CloudSyncSnapshot {
  profile: {
    name: string;
    year: number;
    dept: SessionDepartment;
    saved: boolean;
  };
  completedLessons: string[];
  quizScores: Record<string, number>;
  notes: Record<string, string>;
  mistakes: CloudMistakeItem[];
  examDate: string;
  unlockedCourses: string[];
  unlockedLessons: string[];
}

export interface SanitizedLocalState {
  profile?: {
    name?: string;
    year?: number;
    dept?: SessionDepartment;
    saved?: boolean;
  };
  completedLessons?: string[];
  quizScores?: Record<string, number>;
  notes?: Record<string, string>;
  mistakes?: CloudMistakeItem[];
  examDate?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function resolveCourseIdForLesson(lessonId: string): string {
  return LESSON_TO_COURSE_ID.get(lessonId) ?? "unknown";
}

export function sanitizeExamDateOrNull(raw: unknown): string | null {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (ISO_DATE_RE.test(trimmed)) {
      return trimmed;
    }
  }
  return null;
}

export function parseDepartment(
  raw: unknown,
  fallback?: SessionDepartment
): SessionDepartment | undefined {
  if (typeof raw !== "string") return fallback;
  const upper = raw.trim().toUpperCase() as SessionDepartment;
  return VALID_DEPTS.has(upper) ? upper : fallback;
}

export function parseYearLevel(raw: unknown, fallback?: number): number | undefined {
  const num = typeof raw === "number" ? raw : Number(raw);
  if (Number.isInteger(num) && num >= 1 && num <= 4) {
    return num;
  }
  return fallback;
}

export function sanitizeLocalStatePayload(raw: unknown): SanitizedLocalState {
  if (!isRecord(raw)) return {};

  const result: SanitizedLocalState = {};

  if (isRecord(raw.profile)) {
    const name =
      typeof raw.profile.name === "string" ? raw.profile.name.trim().slice(0, 120) : undefined;
    const year = parseYearLevel(raw.profile.year);
    const dept = parseDepartment(raw.profile.dept);
    const saved =
      typeof raw.profile.saved === "boolean" ? raw.profile.saved : undefined;

    if (name || year !== undefined || dept !== undefined || saved !== undefined) {
      result.profile = {
        ...(name ? { name } : {}),
        ...(year !== undefined ? { year } : {}),
        ...(dept !== undefined ? { dept } : {}),
        ...(saved !== undefined ? { saved } : {}),
      };
    }
  }

  if (Array.isArray(raw.completedLessons)) {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const item of raw.completedLessons) {
      if (typeof item !== "string") continue;
      const clean = item.trim();
      if (!clean || clean.length > 120 || seen.has(clean)) continue;
      seen.add(clean);
      list.push(clean);
    }
    result.completedLessons = list;
  }

  if (isRecord(raw.quizScores)) {
    const scores: Record<string, number> = {};
    for (const [lessonId, score] of Object.entries(raw.quizScores)) {
      const key = lessonId.trim();
      if (!key || key.length > 120) continue;
      if (typeof score !== "number" || !Number.isFinite(score)) continue;
      scores[key] = Math.min(100, Math.max(0, Math.round(score)));
    }
    result.quizScores = scores;
  }

  if (isRecord(raw.notes)) {
    const notes: Record<string, string> = {};
    for (const [lessonId, content] of Object.entries(raw.notes)) {
      const key = lessonId.trim();
      if (!key || key.length > 120 || typeof content !== "string") continue;
      notes[key] = content.slice(0, 50_000);
    }
    result.notes = notes;
  }

  if (Array.isArray(raw.mistakes)) {
    const out: CloudMistakeItem[] = [];
    const seen = new Set<string>();
    for (const entry of raw.mistakes) {
      if (!isRecord(entry)) continue;
      const q = typeof entry.q === "string" ? entry.q.trim().slice(0, 2000) : "";
      const ansText =
        typeof entry.ansText === "string"
          ? entry.ansText.trim().slice(0, 2000)
          : "";
      if (!q || !ansText) continue;

      const courseId =
        typeof entry.courseId === "string" && entry.courseId.trim()
          ? entry.courseId.trim().slice(0, 120)
          : "general";
      const courseCode =
        typeof entry.courseCode === "string" && entry.courseCode.trim()
          ? entry.courseCode.trim().slice(0, 64)
          : "CS";
      const lessonId =
        typeof entry.lessonId === "string" && entry.lessonId.trim()
          ? entry.lessonId.trim().slice(0, 120)
          : undefined;

      const dedupeKey = `${courseId}::${q}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      out.push({
        courseId,
        courseCode,
        ...(lessonId ? { lessonId } : {}),
        q,
        ansText,
      });
    }
    result.mistakes = out;
  }

  const examDate = sanitizeExamDateOrNull(raw.examDate);
  if (examDate) {
    result.examDate = examDate;
  }

  return result;
}

export interface MergeCloudOptions {
  /**
   * - `"merge"` (default, used on login/register): strictly non-destructive union.
   *   Never uncompletes lessons, never clears existing cloud notes/mistakes,
   *   and keeps the max quiz score.
   * - `"sync"` (used by ongoing CloudSyncBridge after initial pull): allows
   *   reflecting explicit lesson unchecks, cleared notes, and deleted mistakes
   *   while STILL preserving `Math.max` for quiz scores.
   */
  mode?: "merge" | "sync";
  /** Whether to apply incoming `profile` fields to the `users` table. */
  updateProfile?: boolean;
  /** Whether to overwrite an already-set cloud `examDate`. */
  overwriteExamDate?: boolean;
}

export async function mergeLocalStateIntoCloud(
  userId: string,
  rawLocalState: unknown,
  options: MergeCloudOptions = {}
): Promise<void> {
  const payload = sanitizeLocalStatePayload(rawLocalState);
  const mode = options.mode ?? "merge";
  const db = getDb();
  const now = new Date();

  // 1. Update user profile / examDate if relevant
  const userUpdates: Partial<typeof users.$inferInsert> = {
    lastActiveAt: now,
  };
  let shouldUpdateUser = false;

  if (options.updateProfile && payload.profile) {
    if (payload.profile.name && payload.profile.name.length >= 2) {
      userUpdates.fullName = payload.profile.name;
      shouldUpdateUser = true;
    }
    if (payload.profile.year !== undefined) {
      userUpdates.yearLevel = payload.profile.year;
      shouldUpdateUser = true;
    }
    if (payload.profile.dept !== undefined) {
      userUpdates.department = payload.profile.dept;
      shouldUpdateUser = true;
    }
  }

  if (payload.examDate) {
    if (options.overwriteExamDate) {
      userUpdates.examDate = payload.examDate;
      shouldUpdateUser = true;
    } else {
      // Only fill cloud examDate if currently NULL
      await db
        .update(users)
        .set({ examDate: payload.examDate, updatedAt: now, lastActiveAt: now })
        .where(and(eq(users.id, userId), isNull(users.examDate)));
    }
  }

  if (shouldUpdateUser) {
    userUpdates.updatedAt = now;
    await db.update(users).set(userUpdates).where(eq(users.id, userId));
  }

  // 2. Upsert progress (completedLessons + quizScores)
  const completedSet = new Set<string>(payload.completedLessons ?? []);
  const quizScores = payload.quizScores ?? {};
  const allProgressLessonIds = new Set<string>([
    ...completedSet,
    ...Object.keys(quizScores),
  ]);

  if (allProgressLessonIds.size > 0) {
    const progressValues = Array.from(allProgressLessonIds).map((lessonId) => ({
      userId,
      courseId: resolveCourseIdForLesson(lessonId),
      lessonId,
      isCompleted: completedSet.has(lessonId),
      bestQuizScore:
        typeof quizScores[lessonId] === "number" ? quizScores[lessonId] : null,
      updatedAt: now,
    }));

    await db
      .insert(userProgress)
      .values(progressValues)
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: {
          courseId: sql`excluded.course_id`,
          isCompleted:
            mode === "sync" && payload.completedLessons !== undefined
              ? sql`excluded.is_completed`
              : sql`${userProgress.isCompleted} OR excluded.is_completed`,
          bestQuizScore: sql`NULLIF(GREATEST(COALESCE(${userProgress.bestQuizScore}, -1), COALESCE(excluded.best_quiz_score, -1)), -1)`,
          updatedAt: now,
        },
      });
  }

  // In authoritative sync mode, reflect lessons explicitly unchecked by the student
  if (mode === "sync" && payload.completedLessons !== undefined) {
    const existingCompleted = await db
      .select({ lessonId: userProgress.lessonId })
      .from(userProgress)
      .where(
        and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true))
      );

    const toUncheck = existingCompleted
      .map((r) => r.lessonId)
      .filter((id) => !completedSet.has(id));

    for (const lessonId of toUncheck) {
      await db
        .update(userProgress)
        .set({ isCompleted: false, updatedAt: now })
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.lessonId, lessonId)
          )
        );
    }
  }

  // 3. Upsert notes
  if (payload.notes !== undefined) {
    const noteEntries = Object.entries(payload.notes);
    const nonEmptyNotes = noteEntries.filter(
      ([, content]) => content.trim().length > 0
    );

    if (nonEmptyNotes.length > 0) {
      await db
        .insert(userNotes)
        .values(
          nonEmptyNotes.map(([lessonId, content]) => ({
            userId,
            lessonId,
            content,
            updatedAt: now,
          }))
        )
        .onConflictDoUpdate({
          target: [userNotes.userId, userNotes.lessonId],
          set: {
            content:
              mode === "sync"
                ? sql`excluded.content`
                : sql`CASE WHEN length(trim(${userNotes.content})) > 0 THEN ${userNotes.content} ELSE excluded.content END`,
            updatedAt: now,
          },
        });
    }

    if (mode === "sync") {
      const nonEmptyIds = new Set(nonEmptyNotes.map(([id]) => id));
      const existingNotes = await db
        .select({ lessonId: userNotes.lessonId })
        .from(userNotes)
        .where(eq(userNotes.userId, userId));

      for (const row of existingNotes) {
        if (!nonEmptyIds.has(row.lessonId)) {
          await db
            .delete(userNotes)
            .where(
              and(
                eq(userNotes.userId, userId),
                eq(userNotes.lessonId, row.lessonId)
              )
            );
        }
      }
    }
  }

  // 4. Upsert mistakes
  if (payload.mistakes !== undefined) {
    if (payload.mistakes.length > 0) {
      await db
        .insert(userMistakes)
        .values(
          payload.mistakes.map((m) => ({
            userId,
            courseId: m.courseId,
            courseCode: m.courseCode,
            lessonId: m.lessonId ?? null,
            questionText: m.q,
            answerText: m.ansText,
          }))
        )
        .onConflictDoUpdate({
          target: [
            userMistakes.userId,
            userMistakes.courseId,
            userMistakes.questionText,
          ],
          set: {
            courseCode: sql`excluded.course_code`,
            lessonId: sql`COALESCE(excluded.lesson_id, ${userMistakes.lessonId})`,
            answerText: sql`excluded.answer_text`,
          },
        });
    }

    if (mode === "sync") {
      const incomingKeys = new Set(
        payload.mistakes.map((m) => `${m.courseId}::${m.q}`)
      );
      const existingMistakes = await db
        .select({
          id: userMistakes.id,
          courseId: userMistakes.courseId,
          questionText: userMistakes.questionText,
        })
        .from(userMistakes)
        .where(eq(userMistakes.userId, userId));

      for (const row of existingMistakes) {
        if (!incomingKeys.has(`${row.courseId}::${row.questionText}`)) {
          await db.delete(userMistakes).where(eq(userMistakes.id, row.id));
        }
      }
    }
  }
}

export async function getCloudSyncSnapshot(
  user: SessionUser
): Promise<CloudSyncSnapshot> {
  const db = getDb();
  const now = new Date();

  const [progressRows, noteRows, mistakeRows, activeEnrollments] =
    await Promise.all([
      db
        .select({
          lessonId: userProgress.lessonId,
          isCompleted: userProgress.isCompleted,
          bestQuizScore: userProgress.bestQuizScore,
        })
        .from(userProgress)
        .where(eq(userProgress.userId, user.id)),
      db
        .select({
          lessonId: userNotes.lessonId,
          content: userNotes.content,
        })
        .from(userNotes)
        .where(eq(userNotes.userId, user.id)),
      db
        .select({
          courseId: userMistakes.courseId,
          courseCode: userMistakes.courseCode,
          lessonId: userMistakes.lessonId,
          questionText: userMistakes.questionText,
          answerText: userMistakes.answerText,
        })
        .from(userMistakes)
        .where(eq(userMistakes.userId, user.id)),
      db
        .select({
          scopeType: enrollments.scopeType,
          targetId: enrollments.targetId,
        })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, user.id),
            eq(enrollments.status, "active"),
            or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now))
          )
        ),
    ]);

  const completedLessons: string[] = [];
  const quizScores: Record<string, number> = {};

  for (const row of progressRows) {
    if (row.isCompleted) {
      completedLessons.push(row.lessonId);
    }
    if (typeof row.bestQuizScore === "number") {
      quizScores[row.lessonId] = row.bestQuizScore;
    }
  }

  const notes: Record<string, string> = {};
  for (const row of noteRows) {
    if (row.content.length > 0) {
      notes[row.lessonId] = row.content;
    }
  }

  const mistakes: CloudMistakeItem[] = mistakeRows.map((row) => ({
    courseId: row.courseId,
    courseCode: row.courseCode,
    ...(row.lessonId ? { lessonId: row.lessonId } : {}),
    q: row.questionText,
    ansText: row.answerText,
  }));

  const unlockedCoursesSet = new Set<string>();
  const unlockedLessonsSet = new Set<string>();

  for (const enr of activeEnrollments) {
    if (enr.scopeType === "bundle" && enr.targetId === "all") {
      for (const courseId of ALL_COURSE_IDS) {
        unlockedCoursesSet.add(courseId);
      }
    } else if (enr.scopeType === "course") {
      unlockedCoursesSet.add(enr.targetId);
      const mappedId = COURSE_SLUG_TO_ID.get(enr.targetId);
      if (mappedId) {
        unlockedCoursesSet.add(mappedId);
      }
    } else if (enr.scopeType === "lesson") {
      unlockedLessonsSet.add(enr.targetId);
    }
  }

  return {
    profile: {
      name: user.fullName,
      year: user.yearLevel,
      dept: user.department,
      saved: true,
    },
    completedLessons,
    quizScores,
    notes,
    mistakes,
    examDate: user.examDate ?? "",
    unlockedCourses: Array.from(unlockedCoursesSet),
    unlockedLessons: Array.from(unlockedLessonsSet),
  };
}
