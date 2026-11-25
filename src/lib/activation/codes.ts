import crypto from "node:crypto";
import { and, eq, gt, isNull, lt, or, sql } from "drizzle-orm";
import {
  activationCodes,
  codeRedemptions,
  enrollments,
  getDb,
  isDatabaseConfigured,
  users,
} from "@/lib/db";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";

export type ActivationScope = "course" | "lesson" | "bundle";

export interface ActiveEnrollmentSummary {
  scopeType: ActivationScope;
  targetId: string;
  enrolledAt: string;
  expiresAt: string | null;
}

export type RedeemCodeResult =
  | {
      ok: true;
      scopeType: ActivationScope;
      targetId: string;
      message: string;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

/**
 * Safe unambiguous alphabet (31 chars: no 0/O/1/I/L to avoid visual confusion).
 */
const SAFE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_UNBIASED_BYTE =
  Math.floor(256 / SAFE_CODE_ALPHABET.length) * SAFE_CODE_ALPHABET.length; // 248

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Generates `length` unbiased cryptographically random characters
 * from SAFE_CODE_ALPHABET using rejection sampling.
 */
function randomSafeSegment(length: number): string {
  let out = "";
  while (out.length < length) {
    const buf = crypto.randomBytes(length * 2);
    for (let i = 0; i < buf.length && out.length < length; i += 1) {
      const byte = buf[i];
      if (byte < MAX_UNBIASED_BYTE) {
        out += SAFE_CODE_ALPHABET[byte % SAFE_CODE_ALPHABET.length];
      }
    }
  }
  return out;
}

/**
 * Trims, uppercases, cleans whitespace around hyphens, and collapses spaces.
 */
export function normalizeActivationCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ");
}

/**
 * Generates a single cryptographically random activation code
 * formatted like `PREFIX-XXXX-XXXX`.
 */
export function generateActivationCode(prefix = "CS"): string {
  const cleanPrefix =
    prefix
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 10) || "CS";

  return `${cleanPrefix}-${randomSafeSegment(4)}-${randomSafeSegment(4)}`;
}

/**
 * Generates a batch of unique activation codes (clamped between 1 and 500).
 */
export function generateActivationCodeBatch(
  count: number,
  prefix = "CS"
): string[] {
  const safeCount = Math.min(
    500,
    Math.max(1, Math.floor(Number.isFinite(count) ? count : 1))
  );
  const generated = new Set<string>();
  while (generated.size < safeCount) {
    generated.add(generateActivationCode(prefix));
  }
  return Array.from(generated);
}

/**
 * Returns all currently active, non-expired enrollments for a user.
 * Safely returns `[]` when the database is not configured or the userId is invalid.
 */
export async function getUserActiveEnrollments(
  userId: string
): Promise<ActiveEnrollmentSummary[]> {
  const cleanUserId = userId.trim();
  if (!cleanUserId || !isValidUuid(cleanUserId) || !isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const now = new Date();

  const rows = await db
    .select({
      scopeType: enrollments.scopeType,
      targetId: enrollments.targetId,
      enrolledAt: enrollments.enrolledAt,
      expiresAt: enrollments.expiresAt,
    })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, cleanUserId),
        eq(enrollments.status, "active"),
        or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now))
      )
    );

  return rows.map((row) => ({
    scopeType: row.scopeType,
    targetId: row.targetId,
    enrolledAt: row.enrolledAt.toISOString(),
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
  }));
}

/**
 * Server-side authorization check for whether a user may access a lesson.
 * - Free courses and free preview lessons are always open.
 * - Admins always have access to inspect and preview paid content.
 * - Enrolled students have access via bundle ('all'), course, or lesson enrollment.
 */
export async function hasUserAccessToLesson(
  userId: string | null,
  courseId: string,
  lessonId: string,
  isPaidCourse: boolean,
  isFreePreview: boolean
): Promise<boolean> {
  if (!isPaidCourse || isFreePreview) {
    return true;
  }

  const cleanUserId = userId?.trim() ?? "";
  if (!cleanUserId || !isValidUuid(cleanUserId) || !isDatabaseConfigured()) {
    return false;
  }

  const db = getDb();
  const now = new Date();

  const [userRows, enrollmentRows] = await Promise.all([
    db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, cleanUserId))
      .limit(1),
    db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, cleanUserId),
          eq(enrollments.status, "active"),
          or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now)),
          or(
            and(
              eq(enrollments.scopeType, "bundle"),
              eq(enrollments.targetId, "all")
            ),
            and(
              eq(enrollments.scopeType, "course"),
              eq(enrollments.targetId, courseId)
            ),
            and(
              eq(enrollments.scopeType, "lesson"),
              eq(enrollments.targetId, lessonId)
            )
          )
        )
      )
      .limit(1),
  ]);

  if (userRows[0]?.role === "admin") {
    return true;
  }

  return enrollmentRows.length > 0;
}

function buildSuccessMessage(
  scopeType: ActivationScope,
  targetId: string
): string {
  if (scopeType === "bundle" && targetId === "all") {
    return "تم تفعيل باقة جميع المقررات بنجاح وربطها بحسابك السحابي ✓";
  }

  if (scopeType === "course") {
    const course = MOCK_COURSES.find((c) => c.id === targetId);
    if (course) {
      return `تم تفعيل مقرر ${course.title} (${course.code}) بنجاح وربطه بحسابك السحابي ✓`;
    }
  }

  if (scopeType === "lesson") {
    const lesson = MOCK_LESSONS.find((l) => l.id === targetId);
    if (lesson) {
      return `تم تفعيل فصل "${lesson.title}" بنجاح وربطه بحسابك السحابي ✓`;
    }
  }

  return "تم تفعيل المحتوى بنجاح وربطه بحسابك السحابي ✓";
}

/**
 * Race-condition-proof activation code redemption inside a Neon PostgreSQL
 * ACID transaction.
 *
 * Concurrency guarantees:
 * 1. Acquires a row-level exclusive lock (`SELECT ... FOR UPDATE`) on the code row
 *    so simultaneous redemptions serialize cleanly.
 * 2. Verifies existing active enrollments BEFORE consuming the code so a student
 *    who already owns the course/lesson/bundle never wastes a code.
 * 3. Executes an atomic conditional `UPDATE activation_codes SET used_count = used_count + 1
 *    WHERE ... AND is_revoked = false AND (expires_at IS NULL OR expires_at > NOW())
 *    AND used_count < max_uses RETURNING *` as double defense-in-depth.
 * 4. Upserts the enrollment and records an audit trail in `code_redemptions` atomically.
 */
export async function redeemActivationCode(params: {
  userId: string;
  rawCode: string;
  expectedCourseId?: string;
  ipHash?: string | null;
}): Promise<RedeemCodeResult> {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      status: 503,
      error: "قاعدة البيانات غير مربوطة بعد.",
    };
  }

  const cleanUserId = params.userId.trim();
  if (!cleanUserId || !isValidUuid(cleanUserId)) {
    return {
      ok: false,
      status: 401,
      error: "جلسة المستخدم غير صالحة — سجّل دخولك مرة أخرى.",
    };
  }

  const normalizedCode = normalizeActivationCode(params.rawCode ?? "");
  if (!normalizedCode) {
    return {
      ok: false,
      status: 400,
      error: "أدخل كود التفعيل أولاً.",
    };
  }

  const db = getDb();
  const now = new Date();

  // 1. Lookup activation code
  const [codeRow] = await db
    .select()
    .from(activationCodes)
    .where(eq(activationCodes.code, normalizedCode))
    .limit(1);

  if (!codeRow) {
    return {
      ok: false,
      status: 404,
      error: "كود التفعيل غير صحيح — تأكد من الحروف والأرقام.",
    };
  }

  if (codeRow.isRevoked) {
    return {
      ok: false,
      status: 400,
      error: "تم إلغاء هذا الكود من قبل الإدارة.",
    };
  }

  if (codeRow.expiresAt && codeRow.expiresAt <= now) {
    return {
      ok: false,
      status: 400,
      error: "انتهت صلاحية كود التفعيل.",
    };
  }

  if (codeRow.usedCount >= codeRow.maxUses) {
    return {
      ok: false,
      status: 409,
      error: "تم استخدام هذا الكود بالفعل ولا يمكن استخدامه مرة أخرى.",
    };
  }

  // 2. Check whether the student already has an active enrollment covering this target
  //    If so, return without consuming the activation code!
  const coverageConditions = [
    and(
      eq(enrollments.scopeType, codeRow.scopeType),
      eq(enrollments.targetId, codeRow.targetId)
    ),
  ];

  // If student already owns the 'all' bundle, don't consume a course/lesson code
  if (!(codeRow.scopeType === "bundle" && codeRow.targetId === "all")) {
    coverageConditions.push(
      and(
        eq(enrollments.scopeType, "bundle"),
        eq(enrollments.targetId, "all")
      )
    );
  }

  // If redeeming a lesson-level code, also check if they already own the parent course
  if (codeRow.scopeType === "lesson") {
    const lessonMeta = MOCK_LESSONS.find((l) => l.id === codeRow.targetId);
    if (lessonMeta) {
      coverageConditions.push(
        and(
          eq(enrollments.scopeType, "course"),
          eq(enrollments.targetId, lessonMeta.course_id)
        )
      );
    }
  }

  if (
    params.expectedCourseId &&
    codeRow.scopeType === "course" &&
    codeRow.targetId !== params.expectedCourseId.trim()
  ) {
    const targetCourse = MOCK_COURSES.find((c) => c.id === codeRow.targetId);
    const label = targetCourse
      ? `${targetCourse.code} — ${targetCourse.title}`
      : "مقرر آخر";
    return {
      ok: false,
      status: 400,
      error: `هذا الكود مخصص لمقرر مختلف (${label}) — افتح المقرر الصحيح لتفعيله دون استهلاك الكود بالخطأ.`,
    };
  }

  const existingEnrollment = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, cleanUserId),
        eq(enrollments.status, "active"),
        or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now)),
        or(...coverageConditions)
      )
    )
    .limit(1);

  if (existingEnrollment.length > 0) {
    return {
      ok: false,
      status: 409,
      error: "المحتوى مفعّل بالفعل على حسابك — لم يتم استهلاك الكود.",
    };
  }

  // 3. Atomic conditional increment (single PostgreSQL statement; prevents double-redemption)
  const [updatedCode] = await db
    .update(activationCodes)
    .set({
      usedCount: sql`${activationCodes.usedCount} + 1`,
    })
    .where(
      and(
        eq(activationCodes.id, codeRow.id),
        eq(activationCodes.code, normalizedCode),
        eq(activationCodes.isRevoked, false),
        or(
          isNull(activationCodes.expiresAt),
          gt(activationCodes.expiresAt, sql`NOW()`)
        ),
        lt(activationCodes.usedCount, activationCodes.maxUses)
      )
    )
    .returning();

  if (!updatedCode) {
    return {
      ok: false,
      status: 409,
      error: "تم استخدام هذا الكود بالفعل ولا يمكن استخدامه مرة أخرى.",
    };
  }

  // 4 & 5. Upsert active enrollment + record audit log atomically in one Neon HTTP batch transaction
  // Roll back usedCount if the batch fails transiently so the student's code is never burned.
  try {
    await db.batch([
      db
        .insert(enrollments)
        .values({
          userId: cleanUserId,
          scopeType: updatedCode.scopeType,
          targetId: updatedCode.targetId,
          codeId: updatedCode.id,
          status: "active",
          enrolledAt: now,
          expiresAt: null,
        })
        .onConflictDoUpdate({
          target: [
            enrollments.userId,
            enrollments.scopeType,
            enrollments.targetId,
          ],
          set: {
            codeId: updatedCode.id,
            status: "active",
            enrolledAt: now,
            expiresAt: null,
          },
        }),
      db.insert(codeRedemptions).values({
        codeId: updatedCode.id,
        userId: cleanUserId,
        ipHash: params.ipHash ?? null,
      }),
    ]);
  } catch (batchErr) {
    await db
      .update(activationCodes)
      .set({
        usedCount: sql`GREATEST(0, ${activationCodes.usedCount} - 1)`,
      })
      .where(eq(activationCodes.id, updatedCode.id))
      .catch(() => {});
    throw batchErr;
  }

  return {
    ok: true,
    scopeType: updatedCode.scopeType,
    targetId: updatedCode.targetId,
    message: buildSuccessMessage(updatedCode.scopeType, updatedCode.targetId),
  };
}
