import { NextRequest, NextResponse } from "next/server";
import { and, avg, desc, eq, gt, inArray, isNotNull, isNull, or, sql, type SQL } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import {
  enrollments,
  getDb,
  isDatabaseConfigured,
  userProgress,
  users,
} from "@/lib/db";
import {
  getPublishedLessonCount,
  resolveAdminTargetLabel,
} from "@/app/api/admin/_catalog";

export const dynamic = "force-dynamic";

const VALID_DEPTS = new Set(["CS", "AI", "IS", "IT"]);

function escapeCsvCell(value: string | number | null | undefined): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  if (/[",\r\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

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
      { error: "غير مصرح لك بتصدير بيانات الطلاب." },
      { status: 403 }
    );
  }

  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    const yearParam = (searchParams.get("year") ?? "all").trim();
    const deptParam = (searchParams.get("dept") ?? "all").trim().toUpperCase();
    const roleParam = (searchParams.get("role") ?? "student").trim().toLowerCase();

    const conditions: SQL[] = [];
    if (roleParam === "student" || roleParam === "admin") {
      conditions.push(eq(users.role, roleParam));
    }
    if (yearParam !== "all") {
      const y = Number.parseInt(yearParam, 10);
      if ([1, 2, 3, 4].includes(y)) {
        conditions.push(eq(users.yearLevel, y));
      }
    }
    if (deptParam !== "ALL" && VALID_DEPTS.has(deptParam)) {
      conditions.push(eq(users.department, deptParam));
    }

    const userRows = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        yearLevel: users.yearLevel,
        department: users.department,
        role: users.role,
        createdAt: users.createdAt,
        lastActiveAt: users.lastActiveAt,
      })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.createdAt))
      .limit(5000);

    const userIds = userRows.map((u) => u.id);
    const now = new Date();
    const totalLessons = getPublishedLessonCount();

    const completedMap = new Map<string, number>();
    const quizMap = new Map<string, number | null>();
    const enrollMap = new Map<string, string[]>();

    if (userIds.length > 0) {
      const [progRows, quizRows, enrRows] = await Promise.all([
        db
          .select({
            userId: userProgress.userId,
            completed: sql<number>`count(*) filter (where ${userProgress.isCompleted} = true)`,
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
          .select()
          .from(enrollments)
          .where(
            and(
              inArray(enrollments.userId, userIds),
              eq(enrollments.status, "active"),
              or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now))
            )
          ),
      ]);

      for (const r of progRows) completedMap.set(r.userId, Number(r.completed ?? 0));
      for (const r of quizRows) {
        quizMap.set(
          r.userId,
          r.avgScore !== null && !Number.isNaN(Number(r.avgScore))
            ? Math.round(Number(r.avgScore))
            : null
        );
      }
      for (const r of enrRows) {
        const list = enrollMap.get(r.userId) ?? [];
        list.push(resolveAdminTargetLabel(r.scopeType, r.targetId));
        enrollMap.set(r.userId, list);
      }
    }

    const header = [
      "FullName",
      "Email",
      "Phone",
      "Role",
      "Year",
      "Department",
      "CompletedLessons",
      "CompletionPercent",
      "AvgQuizScore",
      "ActiveEnrollments",
      "CreatedAt",
      "LastActiveAt",
    ].join(",");

    const lines = userRows.map((u) => {
      const completed = completedMap.get(u.id) ?? 0;
      const pct = totalLessons > 0 ? Math.min(100, Math.round((completed / totalLessons) * 100)) : 0;
      const avgScore = quizMap.get(u.id);
      const enrs = (enrollMap.get(u.id) ?? []).join(" | ");
      return [
        escapeCsvCell(u.fullName),
        escapeCsvCell(u.email),
        escapeCsvCell(u.phone ?? ""),
        escapeCsvCell(u.role),
        escapeCsvCell(u.yearLevel),
        escapeCsvCell(u.department),
        escapeCsvCell(completed),
        escapeCsvCell(`${pct}%`),
        escapeCsvCell(avgScore !== null && avgScore !== undefined ? `${avgScore}%` : ""),
        escapeCsvCell(enrs),
        escapeCsvCell(u.createdAt.toISOString().slice(0, 19).replace("T", " ")),
        escapeCsvCell(u.lastActiveAt.toISOString().slice(0, 19).replace("T", " ")),
      ].join(",");
    });

    const csvWithBom = `\uFEFF${[header, ...lines].join("\r\n")}\r\n`;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cs-portal-students.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/students/export] Error:", error);
    return NextResponse.json(
      { error: "تعذر تصدير قائمة الطلاب." },
      { status: 500 }
    );
  }
}
