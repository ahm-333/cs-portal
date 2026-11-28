import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, or } from "drizzle-orm";
import { getAiDailyLimit, getUtcDayWindow } from "@/lib/ai/provider";
import { hashPassword } from "@/lib/auth/password";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import { requireAdmin } from "@/lib/auth/session";
import { getCourseOverridesMap } from "@/lib/data";
import {
  activationCodes,
  aiChatUsage,
  codeRedemptions,
  enrollments,
  getDb,
  isDatabaseConfigured,
  sessions,
  userDevices,
  userMistakes,
  userNotes,
  userProgress,
  users,
} from "@/lib/db";
import {
  ensureAdminTables,
  getEffectiveSiteSettings,
} from "@/lib/db/ensure-tables";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";
import { isValidUuid, resolveAdminTargetLabel } from "@/app/api/admin/_catalog";
import type {
  AdminStudentCourseBreakdown,
  AdminStudentDetailData,
  AdminStudentDevice,
} from "@/components/admin/adminTypes";

export const dynamic = "force-dynamic";

const VALID_DEPTS = new Set(["CS", "AI", "IS", "IT"]);

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بعرض ملف الطالب." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  if (!id || !isValidUuid(id)) {
    return NextResponse.json(
      { error: "معرّف المستخدم غير صالح." },
      { status: 400 }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();
    const [student] = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        googleId: users.googleId,
        fullName: users.fullName,
        yearLevel: users.yearLevel,
        department: users.department,
        role: users.role,
        examDate: users.examDate,
        isSuspended: users.isSuspended,
        suspendReason: users.suspendReason,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastActiveAt: users.lastActiveAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: "الحساب غير موجود." },
        { status: 404 }
      );
    }

    const now = new Date();
    const { dateKey } = getUtcDayWindow(now);

    const [
      enrollmentRows,
      progressRows,
      mistakeRows,
      noteRows,
      redemptionRows,
      sessionRows,
      deviceRows,
      aiRows,
      overridesMap,
      siteSettings,
    ] = await Promise.all([
      db
        .select()
        .from(enrollments)
        .where(eq(enrollments.userId, id))
        .orderBy(desc(enrollments.enrolledAt)),
      db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, id))
        .orderBy(desc(userProgress.updatedAt))
        .limit(300),
      db
        .select()
        .from(userMistakes)
        .where(eq(userMistakes.userId, id))
        .orderBy(desc(userMistakes.createdAt))
        .limit(50),
      db
        .select()
        .from(userNotes)
        .where(eq(userNotes.userId, id))
        .orderBy(desc(userNotes.updatedAt))
        .limit(30),
      db
        .select({
          id: codeRedemptions.id,
          ipHash: codeRedemptions.ipHash,
          redeemedAt: codeRedemptions.redeemedAt,
          code: activationCodes.code,
          scopeType: activationCodes.scopeType,
          targetId: activationCodes.targetId,
        })
        .from(codeRedemptions)
        .innerJoin(
          activationCodes,
          eq(codeRedemptions.codeId, activationCodes.id)
        )
        .where(eq(codeRedemptions.userId, id))
        .orderBy(desc(codeRedemptions.redeemedAt))
        .limit(50),
      db
        .select({
          id: sessions.id,
          userAgent: sessions.userAgent,
          deviceId: sessions.deviceId,
          deviceName: sessions.deviceName,
          ipAddress: sessions.ipAddress,
          lastSeenAt: sessions.lastSeenAt,
          createdAt: sessions.createdAt,
          expiresAt: sessions.expiresAt,
        })
        .from(sessions)
        .where(eq(sessions.userId, id))
        .orderBy(desc(sessions.createdAt))
        .limit(20),
      db
        .select()
        .from(userDevices)
        .where(eq(userDevices.userId, id))
        .orderBy(desc(userDevices.lastSeenAt)),
      db
        .select({ requestCount: aiChatUsage.requestCount })
        .from(aiChatUsage)
        .where(
          and(
            eq(aiChatUsage.actorKey, `user:${id}`),
            eq(aiChatUsage.dateKey, dateKey)
          )
        )
        .limit(1),
      getCourseOverridesMap(),
      getEffectiveSiteSettings(),
    ]);

    // Active enrollment lookup for courseBreakdown
    const activeEnrollments = enrollmentRows.filter(
      (e) =>
        e.status === "active" &&
        (!e.expiresAt || e.expiresAt.getTime() > now.getTime())
    );
    const hasBundleAll = activeEnrollments.some(
      (e) => e.scopeType === "bundle" && e.targetId === "all"
    );
    const enrolledCourseTargets = new Set(
      activeEnrollments
        .filter((e) => e.scopeType === "course")
        .map((e) => e.targetId)
    );

    const progressByLessonId = new Map(
      progressRows.map((p) => [p.lessonId, p])
    );

    const courseBreakdown: AdminStudentCourseBreakdown[] = MOCK_COURSES.slice()
      .sort(
        (a, b) =>
          a.year_level - b.year_level ||
          a.term - b.term ||
          a.created_at.localeCompare(b.created_at)
      )
      .map((baseCourse) => {
        const override = overridesMap.get(baseCourse.id);
        const effectiveIsPaid = override ? override.isPaid : baseCourse.is_paid;

        const isEnrolled =
          student.role === "admin" ||
          hasBundleAll ||
          enrolledCourseTargets.has(baseCourse.id) ||
          enrolledCourseTargets.has(baseCourse.slug);

        const courseLessons = MOCK_LESSONS.filter(
          (l) => l.course_id === baseCourse.id
        ).sort((a, b) => a.order_index - b.order_index);

        let completedCount = 0;
        let scoreSum = 0;
        let scoreCount = 0;
        let latestUpdatedMs = -1;
        let lastLessonTitle: string | null = null;

        const chapterGrades = courseLessons.map((lesson) => {
          const prog = progressByLessonId.get(lesson.id);
          const isCompleted = Boolean(prog?.isCompleted);
          const bestQuizScore =
            typeof prog?.bestQuizScore === "number" ? prog.bestQuizScore : null;

          if (isCompleted) {
            completedCount += 1;
          }
          if (bestQuizScore !== null) {
            scoreSum += bestQuizScore;
            scoreCount += 1;
          }
          if (prog) {
            const ms = prog.updatedAt.getTime();
            if (ms > latestUpdatedMs) {
              latestUpdatedMs = ms;
              lastLessonTitle = lesson.title;
            }
          }

          return {
            lessonId: lesson.id,
            title: lesson.title,
            orderIndex: lesson.order_index,
            isCompleted,
            bestQuizScore,
            updatedAt: prog ? prog.updatedAt.toISOString() : null,
          };
        });

        return {
          courseId: baseCourse.id,
          courseCode: baseCourse.code,
          code: baseCourse.code,
          courseTitle: baseCourse.title,
          title: baseCourse.title,
          isPaid: effectiveIsPaid,
          isEnrolled,
          completedCount,
          totalLessons: courseLessons.length,
          lastLessonTitle,
          averageQuizScore:
            scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null,
          chapterGrades,
        };
      });

    // Build exact registered devices list enriched with active session status
    const activeSessionDeviceIds = new Set(
      sessionRows
        .filter((s) => s.expiresAt.getTime() > now.getTime() && s.deviceId)
        .map((s) => s.deviceId as string)
    );

    const devices: AdminStudentDevice[] = deviceRows.map((d) => ({
      id: d.id,
      deviceId: d.deviceId,
      deviceName: d.deviceName,
      browser: d.browser ?? null,
      os: d.os ?? null,
      ipAddress: d.ipAddress ?? null,
      firstSeenAt: d.firstSeenAt.toISOString(),
      lastSeenAt: d.lastSeenAt.toISOString(),
      isActiveNow: !d.isBlocked && activeSessionDeviceIds.has(d.deviceId),
      isBlocked: d.isBlocked,
    }));

    // Include any active legacy sessions that don't have a matching user_devices row
    const knownDeviceIds = new Set(devices.map((d) => d.deviceId));
    for (const s of sessionRows) {
      if (s.expiresAt.getTime() <= now.getTime()) continue;
      const key = s.deviceId || `session:${s.id}`;
      if (knownDeviceIds.has(key)) continue;
      knownDeviceIds.add(key);
      devices.push({
        id: s.id,
        deviceId: key,
        deviceName: s.deviceName || s.userAgent?.slice(0, 60) || "جلسة نشطة",
        browser: null,
        os: null,
        ipAddress: s.ipAddress ?? null,
        firstSeenAt: s.createdAt.toISOString(),
        lastSeenAt: (s.lastSeenAt ?? s.createdAt).toISOString(),
        isActiveNow: true,
        isBlocked: false,
      });
    }

    const payload: AdminStudentDetailData = {
      student: {
        id: student.id,
        email: student.email,
        phone: student.phone ?? null,
        googleLinked: Boolean(student.googleId),
        fullName: student.fullName,
        yearLevel: student.yearLevel,
        department: student.department,
        role: student.role,
        examDate: student.examDate ?? null,
        isSuspended: Boolean(student.isSuspended),
        suspendReason: student.suspendReason ?? null,
        createdAt: student.createdAt.toISOString(),
        updatedAt: student.updatedAt.toISOString(),
        lastActiveAt: student.lastActiveAt.toISOString(),
      },
      enrollments: enrollmentRows.map((row) => ({
        id: row.id,
        scopeType: row.scopeType,
        targetId: row.targetId,
        targetLabel: resolveAdminTargetLabel(row.scopeType, row.targetId),
        status: row.status,
        enrolledAt: row.enrolledAt.toISOString(),
        expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
      })),
      progress: progressRows.slice(0, 100).map((row) => ({
        id: row.id,
        courseId: row.courseId,
        lessonId: row.lessonId,
        lessonLabel: resolveAdminTargetLabel("lesson", row.lessonId),
        isCompleted: row.isCompleted,
        bestQuizScore: row.bestQuizScore ?? null,
        updatedAt: row.updatedAt.toISOString(),
      })),
      mistakes: mistakeRows.map((row) => ({
        id: row.id,
        courseId: row.courseId,
        courseCode: row.courseCode,
        lessonId: row.lessonId ?? null,
        questionText: row.questionText,
        answerText: row.answerText,
        createdAt: row.createdAt.toISOString(),
      })),
      notes: noteRows.map((row) => ({
        id: row.id,
        lessonId: row.lessonId,
        lessonLabel: resolveAdminTargetLabel("lesson", row.lessonId),
        content: row.content,
        updatedAt: row.updatedAt.toISOString(),
      })),
      redemptions: redemptionRows.map((row) => ({
        id: row.id,
        code: row.code,
        targetLabel: resolveAdminTargetLabel(row.scopeType, row.targetId),
        ipHash: row.ipHash ? row.ipHash.slice(0, 12) : null,
        redeemedAt: row.redeemedAt.toISOString(),
      })),
      sessions: sessionRows.map((row) => ({
        id: row.id,
        userAgent: row.userAgent ?? null,
        deviceId: row.deviceId ?? null,
        deviceName: row.deviceName ?? null,
        ipAddress: row.ipAddress ?? null,
        lastSeenAt: row.lastSeenAt ? row.lastSeenAt.toISOString() : null,
        createdAt: row.createdAt.toISOString(),
        expiresAt: row.expiresAt.toISOString(),
        isActive: row.expiresAt.getTime() > now.getTime(),
      })),
      courseBreakdown,
      devices,
      aiUsageToday: Number(aiRows[0]?.requestCount ?? 0),
      aiDailyLimit: siteSettings.aiDailyLimit || getAiDailyLimit(),
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[GET /api/admin/students/[id]] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل تفاصيل الحساب." },
      { status: 500 }
    );
  }
}

interface PatchStudentBody {
  action?: unknown;
  reason?: unknown;
  suspendReason?: unknown;
  deviceId?: unknown;
  block?: unknown;
  courseId?: unknown;
  grant?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  yearLevel?: unknown;
  department?: unknown;
  role?: unknown;
  examDate?: unknown;
  newPassword?: unknown;
  revokeSessionsOnReset?: unknown;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بتعديل بيانات المستخدمين." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  if (!id || !isValidUuid(id)) {
    return NextResponse.json(
      { error: "معرّف المستخدم غير صالح." },
      { status: 400 }
    );
  }

  let body: PatchStudentBody;
  try {
    body = (await request.json()) as PatchStudentBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400 }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();
    const now = new Date();

    // ------------------------------------------------------------------
    // Action 1: Suspend account (also deletes all active sessions)
    // ------------------------------------------------------------------
    if (body.action === "suspend") {
      if (id === admin.id) {
        return NextResponse.json(
          { error: "لا يمكنك تجميد حساب الأدمن الذي تستخدمه حالياً." },
          { status: 400 }
        );
      }

      const rawReason =
        typeof body.reason === "string"
          ? body.reason.trim()
          : typeof body.suspendReason === "string"
            ? body.suspendReason.trim()
            : "";
      const suspendReason = rawReason.slice(0, 400) || null;

      const [updated] = await db
        .update(users)
        .set({
          isSuspended: true,
          suspendReason,
          updatedAt: now,
        })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          isSuspended: users.isSuspended,
          suspendReason: users.suspendReason,
        });

      if (!updated) {
        return NextResponse.json(
          { error: "الحساب غير موجود." },
          { status: 404 }
        );
      }

      await db.delete(sessions).where(eq(sessions.userId, id));

      return NextResponse.json(
        {
          ok: true,
          action: "suspend",
          isSuspended: updated.isSuspended,
          suspendReason: updated.suspendReason,
        },
        { status: 200 }
      );
    }

    // ------------------------------------------------------------------
    // Action 2: Unsuspend account
    // ------------------------------------------------------------------
    if (body.action === "unsuspend") {
      const [updated] = await db
        .update(users)
        .set({
          isSuspended: false,
          suspendReason: null,
          updatedAt: now,
        })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          isSuspended: users.isSuspended,
          suspendReason: users.suspendReason,
        });

      if (!updated) {
        return NextResponse.json(
          { error: "الحساب غير موجود." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          ok: true,
          action: "unsuspend",
          isSuspended: false,
          suspendReason: null,
        },
        { status: 200 }
      );
    }

    // ------------------------------------------------------------------
    // Action 3: Kick a specific device (and terminate its sessions)
    // ------------------------------------------------------------------
    if (body.action === "kick_device") {
      const rawDeviceId =
        typeof body.deviceId === "string" ? body.deviceId.trim() : "";
      if (!rawDeviceId) {
        return NextResponse.json(
          { error: "يرجى تحديد الجهاز المطلوب طرده." },
          { status: 400 }
        );
      }

      let resolvedDeviceId = rawDeviceId;

      if (body.block === true) {
        const updatedDevices = await db
          .update(userDevices)
          .set({ isBlocked: true })
          .where(
            and(
              eq(userDevices.userId, id),
              isValidUuid(rawDeviceId)
                ? or(
                    eq(userDevices.deviceId, rawDeviceId),
                    eq(userDevices.id, rawDeviceId)
                  )
                : eq(userDevices.deviceId, rawDeviceId)
            )
          )
          .returning({ deviceId: userDevices.deviceId });
        if (updatedDevices[0]?.deviceId) {
          resolvedDeviceId = updatedDevices[0].deviceId;
        }
      } else {
        const deletedDevices = await db
          .delete(userDevices)
          .where(
            and(
              eq(userDevices.userId, id),
              isValidUuid(rawDeviceId)
                ? or(
                    eq(userDevices.deviceId, rawDeviceId),
                    eq(userDevices.id, rawDeviceId)
                  )
                : eq(userDevices.deviceId, rawDeviceId)
            )
          )
          .returning({ deviceId: userDevices.deviceId });
        if (deletedDevices[0]?.deviceId) {
          resolvedDeviceId = deletedDevices[0].deviceId;
        }
      }

      // Also support legacy `session:<uuid>` identifiers or direct session UUIDs
      if (rawDeviceId.startsWith("session:")) {
        const sessionId = rawDeviceId.slice("session:".length);
        if (isValidUuid(sessionId)) {
          await db
            .delete(sessions)
            .where(and(eq(sessions.userId, id), eq(sessions.id, sessionId)));
        }
      } else {
        await db
          .delete(sessions)
          .where(
            and(
              eq(sessions.userId, id),
              isValidUuid(rawDeviceId)
                ? or(
                    eq(sessions.deviceId, resolvedDeviceId),
                    eq(sessions.id, rawDeviceId)
                  )
                : eq(sessions.deviceId, resolvedDeviceId)
            )
          );
      }

      return NextResponse.json(
        { ok: true, action: "kick_device", deviceId: resolvedDeviceId },
        { status: 200 }
      );
    }

    // ------------------------------------------------------------------
    // Action 4: Reset all bound devices & terminate all sessions
    // ------------------------------------------------------------------
    if (body.action === "reset_devices") {
      await db.delete(userDevices).where(eq(userDevices.userId, id));
      await db.delete(sessions).where(eq(sessions.userId, id));

      return NextResponse.json(
        { ok: true, action: "reset_devices" },
        { status: 200 }
      );
    }

    // ------------------------------------------------------------------
    // Action 5: Toggle single course access immediately
    // ------------------------------------------------------------------
    if (body.action === "toggle_course") {
      const courseId =
        typeof body.courseId === "string" ? body.courseId.trim() : "";
      const grant = body.grant === true;

      if (!courseId) {
        return NextResponse.json(
          { error: "يرجى تحديد المادة المطلوبة." },
          { status: 400 }
        );
      }

      const course = MOCK_COURSES.find(
        (c) => c.id === courseId || c.slug === courseId
      );
      const targetCourseId = course?.id ?? courseId;

      if (grant) {
        await db
          .insert(enrollments)
          .values({
            userId: id,
            scopeType: "course",
            targetId: targetCourseId,
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
              status: "active",
              enrolledAt: now,
              expiresAt: null,
            },
          });
      } else {
        await db
          .update(enrollments)
          .set({ status: "revoked" })
          .where(
            and(
              eq(enrollments.userId, id),
              eq(enrollments.scopeType, "course"),
              course
                ? or(
                    eq(enrollments.targetId, course.id),
                    eq(enrollments.targetId, course.slug)
                  )
                : eq(enrollments.targetId, targetCourseId)
            )
          );
      }

      return NextResponse.json(
        {
          ok: true,
          action: "toggle_course",
          courseId: targetCourseId,
          grant,
        },
        { status: 200 }
      );
    }

    // ------------------------------------------------------------------
    // Default: Profile & password update (preserved existing behavior)
    // ------------------------------------------------------------------
    const updates: Partial<typeof users.$inferInsert> = {
      updatedAt: now,
    };

    if (typeof body.fullName === "string") {
      const clean = body.fullName.trim();
      if (clean.length < 2 || clean.length > 120) {
        return NextResponse.json(
          { error: "الاسم الكامل يجب أن يكون بين حرفين و 120 حرفاً." },
          { status: 400 }
        );
      }
      updates.fullName = clean;
    }

    if (typeof body.email === "string") {
      const cleanEmail = body.email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@") || cleanEmail.length > 180) {
        return NextResponse.json(
          { error: "البريد الإلكتروني غير صالح." },
          { status: 400 }
        );
      }
      updates.email = cleanEmail;
    }

    if (body.phone !== undefined) {
      if (body.phone === null || body.phone === "") {
        updates.phone = null;
      } else if (typeof body.phone === "string") {
        const normalized = normalizePhoneNumber(body.phone);
        if (!normalized) {
          return NextResponse.json(
            { error: "رقم الموبايل غير صالح (مثال: 01012345678)." },
            { status: 400 }
          );
        }
        updates.phone = normalized;
      }
    }

    if (body.yearLevel !== undefined) {
      const yearNum = Number(body.yearLevel);
      if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 4) {
        return NextResponse.json(
          { error: "الفرقة الدراسية يجب أن تكون بين 1 و 4." },
          { status: 400 }
        );
      }
      updates.yearLevel = yearNum;
    }

    if (typeof body.department === "string") {
      const dept = body.department.trim().toUpperCase();
      if (!VALID_DEPTS.has(dept)) {
        return NextResponse.json(
          { error: "التخصص غير صالح (CS | AI | IS | IT)." },
          { status: 400 }
        );
      }
      updates.department = dept;
    }

    if (body.role !== undefined) {
      if (body.role !== "student" && body.role !== "admin") {
        return NextResponse.json(
          { error: "الصلاحية يجب أن تكون student أو admin." },
          { status: 400 }
        );
      }
      if (id === admin.id && body.role !== "admin") {
        return NextResponse.json(
          { error: "لا يمكنك سحب صلاحية الأدمن من حسابك الحالي." },
          { status: 400 }
        );
      }
      updates.role = body.role;
    }

    if (body.examDate !== undefined) {
      if (body.examDate === null || body.examDate === "") {
        updates.examDate = null;
      } else if (typeof body.examDate === "string") {
        updates.examDate = body.examDate.trim().slice(0, 32);
      }
    }

    let passwordChanged = false;
    if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
      if (body.newPassword.length < 6 || body.newPassword.length > 128) {
        return NextResponse.json(
          { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل." },
          { status: 400 }
        );
      }
      updates.passwordHash = hashPassword(body.newPassword);
      passwordChanged = true;
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        yearLevel: users.yearLevel,
        department: users.department,
        role: users.role,
        examDate: users.examDate,
      });

    if (!updated) {
      return NextResponse.json(
        { error: "الحساب غير موجود." },
        { status: 404 }
      );
    }

    if (passwordChanged && body.revokeSessionsOnReset === true && id !== admin.id) {
      await db.delete(sessions).where(eq(sessions.userId, id));
    }

    return NextResponse.json(
      { ok: true, user: updated, passwordChanged },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "هذا البريد الإلكتروني مستخدم بالفعل لحساب آخر."
        : "تعذر تحديث بيانات الحساب.";
    console.error("[PATCH /api/admin/students/[id]] Error:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بحذف الحسابات." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  if (!id || !isValidUuid(id)) {
    return NextResponse.json(
      { error: "معرّف المستخدم غير صالح." },
      { status: 400 }
    );
  }

  if (id === admin.id) {
    return NextResponse.json(
      { error: "لا يمكنك حذف حساب الأدمن الذي تستخدمه حالياً." },
      { status: 400 }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id, fullName: users.fullName });

    if (!deleted) {
      return NextResponse.json(
        { error: "الحساب غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, deleted }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/students/[id]] Error:", error);
    return NextResponse.json(
      { error: "تعذر حذف الحساب." },
      { status: 500 }
    );
  }
}
