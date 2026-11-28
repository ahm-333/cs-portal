import { NextRequest, NextResponse } from "next/server";
import {
  and,
  avg,
  count,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import { requireAdmin } from "@/lib/auth/session";
import {
  adminNotifications,
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
import {
  getPublishedLessonCount,
  isValidUuid,
  resolveAdminTargetLabel,
} from "@/app/api/admin/_catalog";
import type {
  ActivationScope,
  AdminStudentEnrollmentItem,
  AdminStudentItem,
} from "@/components/admin/adminTypes";

export const dynamic = "force-dynamic";

const VALID_SCOPES = new Set<ActivationScope>(["course", "lesson", "bundle"]);
const VALID_DEPTS = new Set(["CS", "AI", "IS", "IT"]);

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بالوصول إلى بيانات الطلاب." },
      { status: 403 }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const q = (searchParams.get("q") ?? "").trim();
    const yearParam = (searchParams.get("year") ?? "all").trim();
    const deptParam = (searchParams.get("dept") ?? "all").trim().toUpperCase();
    const roleParam = (searchParams.get("role") ?? "student").trim().toLowerCase();

    const conditions: SQL[] = [];

    if (roleParam === "student" || roleParam === "admin") {
      conditions.push(eq(users.role, roleParam));
    }

    if (yearParam !== "all") {
      const yearNum = Number.parseInt(yearParam, 10);
      if ([1, 2, 3, 4].includes(yearNum)) {
        conditions.push(eq(users.yearLevel, yearNum));
      }
    }

    if (deptParam !== "ALL" && VALID_DEPTS.has(deptParam)) {
      conditions.push(eq(users.department, deptParam));
    }

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(
        or(
          ilike(users.fullName, pattern),
          ilike(users.email, pattern),
          ilike(users.phone, pattern)
        )!
      );
    }

    const [userRows, siteSettings] = await Promise.all([
      db
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
          lastActiveAt: users.lastActiveAt,
        })
        .from(users)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(users.lastActiveAt))
        .limit(300),
      getEffectiveSiteSettings(),
    ]);

    if (userRows.length === 0) {
      return NextResponse.json(
        { students: [], total: 0 },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    const userIds = userRows.map((u) => u.id);
    const now = new Date();

    const [
      progressAgg,
      quizAgg,
      mistakeAgg,
      noteAgg,
      activeEnrollments,
      deviceRows,
      securityNotifRows,
    ] = await Promise.all([
      db
        .select({
          userId: userProgress.userId,
          completedCount: sql<number>`count(*) filter (where ${userProgress.isCompleted} = true)`,
        })
        .from(userProgress)
        .where(inArray(userProgress.userId, userIds))
        .groupBy(userProgress.userId),
      db
        .select({
          userId: userProgress.userId,
          avgScore: avg(userProgress.bestQuizScore),
        })
        .from(userProgress)
        .where(
          and(
            inArray(userProgress.userId, userIds),
            isNotNull(userProgress.bestQuizScore)
          )
        )
        .groupBy(userProgress.userId),
      db
        .select({
          userId: userMistakes.userId,
          total: count(),
        })
        .from(userMistakes)
        .where(inArray(userMistakes.userId, userIds))
        .groupBy(userMistakes.userId),
      db
        .select({
          userId: userNotes.userId,
          total: count(),
        })
        .from(userNotes)
        .where(inArray(userNotes.userId, userIds))
        .groupBy(userNotes.userId),
      db
        .select()
        .from(enrollments)
        .where(
          and(
            inArray(enrollments.userId, userIds),
            eq(enrollments.status, "active"),
            or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now))
          )
        )
        .orderBy(desc(enrollments.enrolledAt)),
      db
        .select({
          userId: userDevices.userId,
          deviceName: userDevices.deviceName,
          isBlocked: userDevices.isBlocked,
          lastSeenAt: userDevices.lastSeenAt,
        })
        .from(userDevices)
        .where(inArray(userDevices.userId, userIds))
        .orderBy(desc(userDevices.lastSeenAt)),
      db
        .select({
          userId: adminNotifications.userId,
          total: count(),
        })
        .from(adminNotifications)
        .where(
          and(
            inArray(adminNotifications.userId, userIds),
            eq(adminNotifications.type, "security")
          )
        )
        .groupBy(adminNotifications.userId),
    ]);

    const completedMap = new Map(
      progressAgg.map((r) => [r.userId, Number(r.completedCount ?? 0)])
    );
    const quizMap = new Map(
      quizAgg.map((r) => [
        r.userId,
        r.avgScore !== null && !Number.isNaN(Number(r.avgScore))
          ? Math.round(Number(r.avgScore))
          : null,
      ])
    );
    const mistakeMap = new Map(
      mistakeAgg.map((r) => [r.userId, Number(r.total ?? 0)])
    );
    const noteMap = new Map(
      noteAgg.map((r) => [r.userId, Number(r.total ?? 0)])
    );

    const enrollmentsByUser = new Map<string, AdminStudentEnrollmentItem[]>();
    for (const row of activeEnrollments) {
      const list = enrollmentsByUser.get(row.userId) ?? [];
      list.push({
        id: row.id,
        scopeType: row.scopeType,
        targetId: row.targetId,
        targetLabel: resolveAdminTargetLabel(row.scopeType, row.targetId),
        status: row.status,
        enrolledAt: row.enrolledAt.toISOString(),
        expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
      });
      enrollmentsByUser.set(row.userId, list);
    }

    const devicesByUser = new Map<
      string,
      Array<{ deviceName: string; isBlocked: boolean }>
    >();
    for (const row of deviceRows) {
      const list = devicesByUser.get(row.userId) ?? [];
      list.push({ deviceName: row.deviceName, isBlocked: row.isBlocked });
      devicesByUser.set(row.userId, list);
    }

    const securityNotifCountByUser = new Map<string, number>();
    for (const row of securityNotifRows) {
      if (row.userId) {
        securityNotifCountByUser.set(row.userId, Number(row.total ?? 0));
      }
    }

    const totalLessonsCount = getPublishedLessonCount();
    const maxDevices = Math.max(1, siteSettings.maxDevicesPerUser);

    const students: AdminStudentItem[] = userRows.map((u) => {
      const completedLessonsCount = completedMap.get(u.id) ?? 0;
      const completionPercent =
        totalLessonsCount > 0
          ? Math.min(
              100,
              Math.round((completedLessonsCount / totalLessonsCount) * 100)
            )
          : 0;

      const userDevs = devicesByUser.get(u.id) ?? [];
      const activeDevs = userDevs.filter((d) => !d.isBlocked);
      const hasBlockedDevice = userDevs.some((d) => d.isBlocked);
      const secAlerts = securityNotifCountByUser.get(u.id) ?? 0;
      const deviceAlert =
        secAlerts > 0 || hasBlockedDevice || activeDevs.length > maxDevices;

      return {
        id: u.id,
        email: u.email,
        phone: u.phone ?? null,
        googleLinked: Boolean(u.googleId),
        fullName: u.fullName,
        yearLevel: u.yearLevel,
        department: u.department,
        role: u.role,
        examDate: u.examDate ?? null,
        createdAt: u.createdAt.toISOString(),
        lastActiveAt: u.lastActiveAt.toISOString(),
        completedLessonsCount,
        totalLessonsCount,
        completionPercent,
        averageQuizScore: quizMap.get(u.id) ?? null,
        mistakesCount: mistakeMap.get(u.id) ?? 0,
        notesCount: noteMap.get(u.id) ?? 0,
        enrollments: enrollmentsByUser.get(u.id) ?? [],
        isSuspended: Boolean(u.isSuspended),
        suspendReason: u.suspendReason ?? null,
        devicesCount: userDevs.length,
        deviceAlert,
        activeDeviceNames: activeDevs.map((d) => d.deviceName),
      };
    });

    return NextResponse.json(
      { students, total: students.length },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[GET /api/admin/students] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل بيانات الطلاب." },
      { status: 500 }
    );
  }
}

interface ManageStudentBody {
  action?: unknown;
  userId?: unknown;
  scopeType?: unknown;
  targetId?: unknown;
  expiresAt?: unknown;
  // For action: "create"
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  yearLevel?: unknown;
  department?: unknown;
  role?: unknown;
  initialScopeType?: unknown;
  initialTargetId?: unknown;
  // For PATCH convenience actions
  reason?: unknown;
  suspendReason?: unknown;
  deviceId?: unknown;
  courseId?: unknown;
  grant?: unknown;
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بإدارة صلاحيات الطلاب." },
      { status: 403 }
    );
  }

  let body: ManageStudentBody;
  try {
    body = (await request.json()) as ManageStudentBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400 }
    );
  }

  await ensureAdminTables();

  // Action: Create a brand-new student or admin account directly
  if (body.action === "create") {
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const rawPhone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const phone = rawPhone ? normalizePhoneNumber(rawPhone) : null;
    const password = typeof body.password === "string" ? body.password : "";
    const yearLevel = Number(body.yearLevel ?? 2);
    const department =
      typeof body.department === "string"
        ? body.department.trim().toUpperCase()
        : "CS";
    const role = body.role === "admin" ? "admin" : "student";

    if (rawPhone && !phone) {
      return NextResponse.json(
        { error: "رقم الموبايل غير صالح (مثال: 01012345678)." },
        { status: 400 }
      );
    }

    if (fullName.length < 2 || fullName.length > 120) {
      return NextResponse.json(
        { error: "الاسم الكامل يجب أن يكون حرفين على الأقل." },
        { status: 400 }
      );
    }
    if (!email || !email.includes("@") || email.length > 180) {
      return NextResponse.json(
        { error: "أدخل بريداً إلكترونياً صحيحاً." },
        { status: 400 }
      );
    }
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." },
        { status: 400 }
      );
    }
    if (!Number.isInteger(yearLevel) || yearLevel < 1 || yearLevel > 4) {
      return NextResponse.json(
        { error: "الفرقة يجب أن تكون بين 1 و 4." },
        { status: 400 }
      );
    }
    if (!VALID_DEPTS.has(department)) {
      return NextResponse.json(
        { error: "التخصص غير صالح (CS | AI | IS | IT)." },
        { status: 400 }
      );
    }

    try {
      const db = getDb();
      const now = new Date();
      const passwordHash = hashPassword(password);

      const [created] = await db
        .insert(users)
        .values({
          fullName,
          email,
          phone,
          passwordHash,
          yearLevel,
          department,
          role,
          createdAt: now,
          updatedAt: now,
          lastActiveAt: now,
        })
        .returning({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          role: users.role,
          yearLevel: users.yearLevel,
          department: users.department,
        });

      // Optional immediate enrollment grant
      if (
        typeof body.initialScopeType === "string" &&
        VALID_SCOPES.has(body.initialScopeType as ActivationScope)
      ) {
        const initScope = body.initialScopeType as ActivationScope;
        const initTarget =
          initScope === "bundle"
            ? "all"
            : typeof body.initialTargetId === "string"
              ? body.initialTargetId.trim()
              : "";
        if (initTarget) {
          await db.insert(enrollments).values({
            userId: created.id,
            scopeType: initScope,
            targetId: initTarget,
            status: "active",
            enrolledAt: now,
            expiresAt: null,
          });
        }
      }

      return NextResponse.json({ ok: true, user: created }, { status: 201 });
    } catch (error) {
      const isDuplicate =
        error instanceof Error && /unique|duplicate/i.test(error.message);
      console.error("[POST /api/admin/students create] Error:", error);
      return NextResponse.json(
        {
          error: isDuplicate
            ? "هذا البريد الإلكتروني مسجل بالفعل."
            : "تعذر إنشاء الحساب الجديد.",
        },
        { status: isDuplicate ? 409 : 500 }
      );
    }
  }

  const action =
    body.action === "grant" || body.action === "revoke" ? body.action : null;
  if (!action) {
    return NextResponse.json(
      { error: "الإجراء المطلوب غير صالح (grant | revoke | create)." },
      { status: 400 }
    );
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  if (!isValidUuid(userId)) {
    return NextResponse.json(
      { error: "معرّف الطالب غير صالح." },
      { status: 400 }
    );
  }

  const scopeType =
    typeof body.scopeType === "string" &&
    VALID_SCOPES.has(body.scopeType as ActivationScope)
      ? (body.scopeType as ActivationScope)
      : null;
  if (!scopeType) {
    return NextResponse.json(
      { error: "نوع النطاق غير صالح (course | lesson | bundle)." },
      { status: 400 }
    );
  }

  const rawTarget =
    typeof body.targetId === "string" ? body.targetId.trim() : "";
  const targetId = scopeType === "bundle" ? rawTarget || "all" : rawTarget;
  if (!targetId) {
    return NextResponse.json(
      { error: "يرجى تحديد المقرر أو الفصل المطلوب." },
      { status: 400 }
    );
  }

  let expiresAt: Date | null = null;
  if (typeof body.expiresAt === "string" && body.expiresAt.trim()) {
    const parsed = new Date(body.expiresAt.trim());
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json(
        { error: "تاريخ انتهاء الاشتراك غير صالح." },
        { status: 400 }
      );
    }
    expiresAt = parsed;
  }

  try {
    const db = getDb();
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { error: "حساب الطالب غير موجود." },
        { status: 404 }
      );
    }

    const now = new Date();

    if (action === "grant") {
      const [row] = await db
        .insert(enrollments)
        .values({
          userId,
          scopeType,
          targetId,
          status: "active",
          enrolledAt: now,
          expiresAt,
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
            expiresAt,
          },
        })
        .returning();

      return NextResponse.json(
        {
          ok: true,
          action,
          enrollment: {
            id: row.id,
            scopeType: row.scopeType,
            targetId: row.targetId,
            targetLabel: resolveAdminTargetLabel(row.scopeType, row.targetId),
            status: row.status,
            enrolledAt: row.enrolledAt.toISOString(),
            expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
          },
        },
        { status: 200 }
      );
    }

    const [revoked] = await db
      .update(enrollments)
      .set({ status: "revoked" })
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.scopeType, scopeType),
          eq(enrollments.targetId, targetId)
        )
      )
      .returning();

    if (!revoked) {
      return NextResponse.json(
        { error: "لم يتم العثور على اشتراك مطابق لسحبه." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        action,
        enrollment: {
          id: revoked.id,
          scopeType: revoked.scopeType,
          targetId: revoked.targetId,
          targetLabel: resolveAdminTargetLabel(
            revoked.scopeType,
            revoked.targetId
          ),
          status: revoked.status,
          enrolledAt: revoked.enrolledAt.toISOString(),
          expiresAt: revoked.expiresAt ? revoked.expiresAt.toISOString() : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/admin/students] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحديث صلاحية الطالب." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بإدارة حسابات الطلاب." },
      { status: 403 }
    );
  }

  let body: ManageStudentBody;
  try {
    body = (await request.json()) as ManageStudentBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400 }
    );
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  if (!isValidUuid(userId)) {
    return NextResponse.json(
      { error: "معرّف الطالب غير صالح." },
      { status: 400 }
    );
  }

  try {
    await ensureAdminTables();
    const db = getDb();
    const now = new Date();

    if (body.action === "suspend") {
      if (userId === admin.id) {
        return NextResponse.json(
          { error: "لا يمكنك تجميد حساب الأدمن الحالي." },
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

      await db
        .update(users)
        .set({ isSuspended: true, suspendReason, updatedAt: now })
        .where(eq(users.id, userId));
      await db.delete(sessions).where(eq(sessions.userId, userId));

      return NextResponse.json({ ok: true, action: "suspend", isSuspended: true, suspendReason });
    }

    if (body.action === "unsuspend") {
      await db
        .update(users)
        .set({ isSuspended: false, suspendReason: null, updatedAt: now })
        .where(eq(users.id, userId));

      return NextResponse.json({ ok: true, action: "unsuspend", isSuspended: false });
    }

    if (body.action === "reset_devices") {
      await db.delete(userDevices).where(eq(userDevices.userId, userId));
      await db.delete(sessions).where(eq(sessions.userId, userId));
      return NextResponse.json({ ok: true, action: "reset_devices" });
    }

    if (body.action === "kick_device") {
      const deviceId =
        typeof body.deviceId === "string" ? body.deviceId.trim() : "";
      if (!deviceId) {
        return NextResponse.json(
          { error: "يرجى تحديد الجهاز المطلوب طرده." },
          { status: 400 }
        );
      }
      const deletedDevices = await db
        .delete(userDevices)
        .where(
          and(
            eq(userDevices.userId, userId),
            isValidUuid(deviceId)
              ? or(eq(userDevices.deviceId, deviceId), eq(userDevices.id, deviceId))
              : eq(userDevices.deviceId, deviceId)
          )
        )
        .returning({ deviceId: userDevices.deviceId });

      const targetDeviceId = deletedDevices[0]?.deviceId ?? deviceId;
      await db
        .delete(sessions)
        .where(
          and(
            eq(sessions.userId, userId),
            eq(sessions.deviceId, targetDeviceId)
          )
        );
      return NextResponse.json({ ok: true, action: "kick_device" });
    }

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
      if (grant) {
        await db
          .insert(enrollments)
          .values({
            userId,
            scopeType: "course",
            targetId: courseId,
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
            set: { status: "active", enrolledAt: now, expiresAt: null },
          });
      } else {
        await db
          .update(enrollments)
          .set({ status: "revoked" })
          .where(
            and(
              eq(enrollments.userId, userId),
              eq(enrollments.scopeType, "course"),
              eq(enrollments.targetId, courseId)
            )
          );
      }
      return NextResponse.json({ ok: true, action: "toggle_course", courseId, grant });
    }

    return NextResponse.json(
      { error: "الإجراء المطلوب غير مدعوم." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[PATCH /api/admin/students] Error:", error);
    return NextResponse.json(
      { error: "تعذر تنفيذ الإجراء على حساب الطالب." },
      { status: 500 }
    );
  }
}
