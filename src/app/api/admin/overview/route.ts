import { NextResponse } from "next/server";
import {
  and,
  avg,
  count,
  desc,
  eq,
  gt,
  gte,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { getUtcDayWindow } from "@/lib/ai/provider";
import { requireAdmin } from "@/lib/auth/session";
import { getCourseOverridesMap } from "@/lib/data";
import {
  activationCodes,
  adminNotifications,
  aiChatUsage,
  codeRedemptions,
  enrollments,
  getDb,
  isDatabaseConfigured,
  sessions,
  studentMessages,
  subscriptionRequests,
  userMistakes,
  userNotes,
  userProgress,
  users,
} from "@/lib/db";
import { ensureAdminTables } from "@/lib/db/ensure-tables";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";
import {
  computeCodeStatus,
  resolveAdminTargetLabel,
} from "@/app/api/admin/_catalog";
import type {
  AdminActivityItem,
  AdminCourseEnrollmentStat,
  AdminDailySeriesPoint,
  AdminDistributionBucket,
  AdminHardChapterStat,
  AdminOverviewData,
} from "@/components/admin/adminTypes";

export const dynamic = "force-dynamic";

const ARABIC_SHORT_DAYS = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

function toUtcDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function utcDateKeyDaysAgo(daysAgo: number, now: Date): string {
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return toUtcDateKey(d);
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً (DATABASE_URL غير مُعرّف)." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بالوصول إلى بيانات لوحة التحكم." },
      { status: 403 }
    );
  }

  try {
    const startMs = Date.now();
    await ensureAdminTables();
    const db = getDb();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { dateKey: todayKey } = getUtcDayWindow(now);
    const sevenDaysAgoKey = utcDateKeyDaysAgo(6, now);

    const [
      studentTotals,
      adminTotals,
      activeStudentTotals,
      activeSessionTotals,
      activeEnrollmentRows,
      allCodeRows,
      completedTotals,
      quizAverageRows,
      redemptionTotals,
      mistakeTotals,
      noteTotals,
      aiTodayRows,
      ai7dRows,
      yearDistRows,
      deptDistRows,
      courseProgressAgg,
      courseMistakesAgg,
      hardestLessonAgg,
      recentSignups,
      recentRedemptions,
      pendingSubscriptionsRows,
      approvedSubscriptionRows,
      securityAlertsRows,
      unreadNotificationsRows,
      openMessagesRows,
      signups7dRows,
      enrollments7dRows,
      completions7dRows,
      overridesMap,
    ] = await Promise.all([
      db
        .select({ total: count() })
        .from(users)
        .where(eq(users.role, "student")),
      db
        .select({ total: count() })
        .from(users)
        .where(eq(users.role, "admin")),
      db
        .select({ total: count() })
        .from(users)
        .where(
          and(
            eq(users.role, "student"),
            gte(users.lastActiveAt, sevenDaysAgo)
          )
        ),
      db
        .select({ total: count() })
        .from(sessions)
        .where(gt(sessions.expiresAt, now)),
      db
        .select({
          userId: enrollments.userId,
          scopeType: enrollments.scopeType,
          targetId: enrollments.targetId,
        })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.status, "active"),
            or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now))
          )
        ),
      db
        .select({
          isRevoked: activationCodes.isRevoked,
          usedCount: activationCodes.usedCount,
          maxUses: activationCodes.maxUses,
          expiresAt: activationCodes.expiresAt,
        })
        .from(activationCodes),
      db
        .select({ total: count() })
        .from(userProgress)
        .where(eq(userProgress.isCompleted, true)),
      db
        .select({ average: avg(userProgress.bestQuizScore) })
        .from(userProgress)
        .where(isNotNull(userProgress.bestQuizScore)),
      db.select({ total: count() }).from(codeRedemptions),
      db.select({ total: count() }).from(userMistakes),
      db.select({ total: count() }).from(userNotes),
      db
        .select({
          total: sql<number>`coalesce(sum(${aiChatUsage.requestCount}), 0)`,
        })
        .from(aiChatUsage)
        .where(eq(aiChatUsage.dateKey, todayKey)),
      db
        .select({
          total: sql<number>`coalesce(sum(${aiChatUsage.requestCount}), 0)`,
        })
        .from(aiChatUsage)
        .where(gte(aiChatUsage.dateKey, sevenDaysAgoKey)),
      db
        .select({
          yearLevel: users.yearLevel,
          total: count(),
        })
        .from(users)
        .where(eq(users.role, "student"))
        .groupBy(users.yearLevel),
      db
        .select({
          department: users.department,
          total: count(),
        })
        .from(users)
        .where(eq(users.role, "student"))
        .groupBy(users.department),
      db
        .select({
          courseId: userProgress.courseId,
          completedCount: sql<number>`count(*) filter (where ${userProgress.isCompleted} = true)`,
          avgScore: avg(userProgress.bestQuizScore),
        })
        .from(userProgress)
        .groupBy(userProgress.courseId),
      db
        .select({
          courseId: userMistakes.courseId,
          total: count(),
        })
        .from(userMistakes)
        .groupBy(userMistakes.courseId),
      db
        .select({
          lessonId: userMistakes.lessonId,
          courseId: userMistakes.courseId,
          courseCode: userMistakes.courseCode,
          total: count(),
        })
        .from(userMistakes)
        .groupBy(
          userMistakes.lessonId,
          userMistakes.courseId,
          userMistakes.courseCode
        )
        .orderBy(desc(count()))
        .limit(6),
      db
        .select({
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          yearLevel: users.yearLevel,
          department: users.department,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(8),
      db
        .select({
          id: codeRedemptions.id,
          redeemedAt: codeRedemptions.redeemedAt,
          code: activationCodes.code,
          scopeType: activationCodes.scopeType,
          targetId: activationCodes.targetId,
          userName: users.fullName,
          userEmail: users.email,
        })
        .from(codeRedemptions)
        .innerJoin(
          activationCodes,
          eq(codeRedemptions.codeId, activationCodes.id)
        )
        .innerJoin(users, eq(codeRedemptions.userId, users.id))
        .orderBy(desc(codeRedemptions.redeemedAt))
        .limit(8),
      db
        .select({ total: count() })
        .from(subscriptionRequests)
        .where(eq(subscriptionRequests.status, "pending")),
      db
        .select({
          userId: subscriptionRequests.userId,
          courseId: subscriptionRequests.courseId,
          amount: subscriptionRequests.amount,
          courseCode: subscriptionRequests.courseCode,
          courseTitle: subscriptionRequests.courseTitle,
          reviewedAt: subscriptionRequests.reviewedAt,
          createdAt: subscriptionRequests.createdAt,
        })
        .from(subscriptionRequests)
        .where(eq(subscriptionRequests.status, "approved"))
        .orderBy(desc(subscriptionRequests.reviewedAt)),
      db
        .select({ total: count() })
        .from(adminNotifications)
        .where(
          and(
            eq(adminNotifications.type, "security"),
            eq(adminNotifications.isRead, false)
          )
        ),
      db
        .select({ total: count() })
        .from(adminNotifications)
        .where(eq(adminNotifications.isRead, false)),
      db
        .select({ total: count() })
        .from(studentMessages)
        .where(eq(studentMessages.status, "open")),
      db
        .select({ createdAt: users.createdAt })
        .from(users)
        .where(gte(users.createdAt, sevenDaysAgo)),
      db
        .select({ enrolledAt: enrollments.enrolledAt })
        .from(enrollments)
        .where(gte(enrollments.enrolledAt, sevenDaysAgo)),
      db
        .select({ updatedAt: userProgress.updatedAt })
        .from(userProgress)
        .where(
          and(
            eq(userProgress.isCompleted, true),
            gte(userProgress.updatedAt, sevenDaysAgo)
          )
        ),
      getCourseOverridesMap(),
    ]);

    const dbLatencyMs = Math.max(1, Date.now() - startMs);

    let unusedCodes = 0;
    let usedCodes = 0;
    let revokedCodes = 0;
    let expiredCodes = 0;

    for (const row of allCodeRows) {
      const status = computeCodeStatus(row, now);
      if (status === "revoked") revokedCodes += 1;
      else if (status === "used") usedCodes += 1;
      else if (status === "expired") expiredCodes += 1;
      else unusedCodes += 1;
    }

    // Effective course pricing lookup (respecting course_overrides)
    const coursePriceMap = new Map<string, { isPaid: boolean; price: number }>();
    for (const course of MOCK_COURSES) {
      const ov = overridesMap.get(course.id);
      const effective = {
        isPaid: ov ? ov.isPaid : course.is_paid,
        price: ov ? ov.price : course.price,
      };
      coursePriceMap.set(course.id, effective);
      coursePriceMap.set(course.slug, effective);
    }

    // Calculate estimatedRevenue cleanly without double counting
    let estimatedRevenue = 0;
    const paidBySubRequestKey = new Set<string>();
    for (const sub of approvedSubscriptionRows) {
      estimatedRevenue += Number(sub.amount ?? 0);
      paidBySubRequestKey.add(`${sub.userId}:${sub.courseId}`);
    }

    let bundleEnrollments = 0;
    const directCourseCounts = new Map<string, number>();

    for (const row of activeEnrollmentRows) {
      if (row.scopeType === "bundle") {
        bundleEnrollments += 1;
      } else if (row.scopeType === "course") {
        directCourseCounts.set(
          row.targetId,
          (directCourseCounts.get(row.targetId) ?? 0) + 1
        );
        const key = `${row.userId}:${row.targetId}`;
        if (!paidBySubRequestKey.has(key)) {
          const pricing = coursePriceMap.get(row.targetId);
          if (pricing?.isPaid && pricing.price > 0) {
            estimatedRevenue += pricing.price;
          }
        }
      }
    }

    const lessonCountByCourse = new Map<string, number>();
    for (const lesson of MOCK_LESSONS) {
      lessonCountByCourse.set(
        lesson.course_id,
        (lessonCountByCourse.get(lesson.course_id) ?? 0) + 1
      );
    }

    const courseProgressMap = new Map(
      courseProgressAgg.map((r) => [
        r.courseId,
        {
          completed: Number(r.completedCount ?? 0),
          avgScore:
            r.avgScore !== null && !Number.isNaN(Number(r.avgScore))
              ? Math.round(Number(r.avgScore))
              : null,
        },
      ])
    );

    const courseMistakesMap = new Map(
      courseMistakesAgg.map((r) => [r.courseId, Number(r.total ?? 0)])
    );

    const courseEnrollments: AdminCourseEnrollmentStat[] = MOCK_COURSES.map(
      (course) => {
        const ov = overridesMap.get(course.id);
        const direct =
          (directCourseCounts.get(course.id) ?? 0) +
          (directCourseCounts.get(course.slug) ?? 0);
        const prog =
          courseProgressMap.get(course.id) ??
          courseProgressMap.get(course.slug);
        const mistakes =
          (courseMistakesMap.get(course.id) ?? 0) +
          (courseMistakesMap.get(course.slug) ?? 0);

        return {
          courseId: course.id,
          slug: course.slug,
          code: course.code,
          title: course.title,
          titleEn: course.title_en,
          yearLevel: course.year_level,
          isPaid: ov ? ov.isPaid : course.is_paid,
          isPublished: ov ? ov.isPublished : course.is_published,
          price: ov ? ov.price : course.price,
          lessonCount: lessonCountByCourse.get(course.id) ?? 0,
          directEnrollments: direct,
          totalWithBundle: direct + bundleEnrollments,
          completedLessons: prog?.completed ?? 0,
          averageQuizScore: prog?.avgScore ?? null,
          mistakesCount: mistakes,
        };
      }
    );

    const yearMap = new Map(
      yearDistRows.map((r) => [r.yearLevel, Number(r.total ?? 0)])
    );
    const yearDistribution: AdminDistributionBucket[] = [1, 2, 3, 4].map(
      (y) => ({
        key: String(y),
        label: `الفرقة ${y}`,
        count: yearMap.get(y) ?? 0,
      })
    );

    const deptMap = new Map(
      deptDistRows.map((r) => [
        (r.department ?? "CS").toUpperCase(),
        Number(r.total ?? 0),
      ])
    );
    const deptDistribution: AdminDistributionBucket[] = [
      "CS",
      "AI",
      "IS",
      "IT",
    ].map((dept) => ({
      key: dept,
      label: dept,
      count: deptMap.get(dept) ?? 0,
    }));

    const hardestChapters: AdminHardChapterStat[] = hardestLessonAgg.map(
      (row) => ({
        lessonId: row.lessonId ?? null,
        courseId: row.courseId,
        courseCode: row.courseCode,
        label: row.lessonId
          ? resolveAdminTargetLabel("lesson", row.lessonId)
          : resolveAdminTargetLabel("course", row.courseId),
        mistakesCount: Number(row.total ?? 0),
      })
    );

    // Build 7-day dailySeries (oldest -> today)
    const dailyMap = new Map<string, AdminDailySeriesPoint>();
    const dailySeries: AdminDailySeriesPoint[] = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const dayDate = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
      const dateKey = toUtcDateKey(dayDate);
      const label = ARABIC_SHORT_DAYS[dayDate.getUTCDay()] ?? dateKey.slice(5);
      const point: AdminDailySeriesPoint = {
        label,
        dateKey,
        signups: 0,
        enrollments: 0,
        completions: 0,
      };
      dailyMap.set(dateKey, point);
      dailySeries.push(point);
    }

    for (const row of signups7dRows) {
      const bucket = dailyMap.get(toUtcDateKey(row.createdAt));
      if (bucket) bucket.signups += 1;
    }
    for (const row of enrollments7dRows) {
      const bucket = dailyMap.get(toUtcDateKey(row.enrolledAt));
      if (bucket) bucket.enrollments += 1;
    }
    for (const row of completions7dRows) {
      const bucket = dailyMap.get(toUtcDateKey(row.updatedAt));
      if (bucket) bucket.completions += 1;
    }

    const activityItems: AdminActivityItem[] = [
      ...recentSignups.map((u) => ({
        id: `signup-${u.id}`,
        type: "signup" as const,
        title: `تسجيل حساب جديد: ${u.fullName}`,
        subtitle: `${u.email} · الفرقة ${u.yearLevel} (${u.department})`,
        meta: u.role === "admin" ? "أدمن" : "طالب",
        createdAt: u.createdAt.toISOString(),
      })),
      ...recentRedemptions.map((r) => ({
        id: `redemption-${r.id}`,
        type: "redemption" as const,
        title: `تفعيل كود بواسطة ${r.userName}`,
        subtitle: resolveAdminTargetLabel(r.scopeType, r.targetId),
        meta: r.code,
        createdAt: r.redeemedAt.toISOString(),
      })),
      ...approvedSubscriptionRows.slice(0, 6).map((s, idx) => ({
        id: `sub-${s.userId}-${s.courseId}-${idx}`,
        type: "subscription" as const,
        title: `اعتماد اشتراك: ${s.courseCode} — ${s.courseTitle}`,
        subtitle: `قيمة الاشتراك: ${s.amount} ج.م`,
        meta: `${s.amount} ج.م`,
        createdAt: (s.reviewedAt ?? s.createdAt).toISOString(),
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 12);

    const rawAvg = quizAverageRows[0]?.average;
    const averageQuizScore =
      rawAvg !== null && rawAvg !== undefined && !Number.isNaN(Number(rawAvg))
        ? Math.round(Number(rawAvg))
        : null;

    const payload: AdminOverviewData = {
      totalStudents: Number(studentTotals[0]?.total ?? 0),
      totalAdmins: Number(adminTotals[0]?.total ?? 0),
      activeStudents7d: Number(activeStudentTotals[0]?.total ?? 0),
      activeSessionsCount: Number(activeSessionTotals[0]?.total ?? 0),
      totalEnrollments: activeEnrollmentRows.length,
      bundleEnrollments,
      totalCodes: allCodeRows.length,
      unusedCodes,
      usedCodes,
      revokedCodes,
      expiredCodes,
      totalRedemptions: Number(redemptionTotals[0]?.total ?? 0),
      totalCompletedLessons: Number(completedTotals[0]?.total ?? 0),
      totalMistakes: Number(mistakeTotals[0]?.total ?? 0),
      totalNotes: Number(noteTotals[0]?.total ?? 0),
      aiRequestsToday: Number(aiTodayRows[0]?.total ?? 0),
      aiRequests7d: Number(ai7dRows[0]?.total ?? 0),
      averageQuizScore,
      courseEnrollments,
      yearDistribution,
      deptDistribution,
      hardestChapters,
      recentActivity: activityItems,
      estimatedRevenue,
      pendingSubscriptionsCount: Number(pendingSubscriptionsRows[0]?.total ?? 0),
      securityAlertsCount: Number(securityAlertsRows[0]?.total ?? 0),
      unreadNotificationsCount: Number(unreadNotificationsRows[0]?.total ?? 0),
      openMessagesCount: Number(openMessagesRows[0]?.total ?? 0),
      dailySeries,
      dbLatencyMs,
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[GET /api/admin/overview] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل إحصائيات لوحة التحكم." },
      { status: 500 }
    );
  }
}
