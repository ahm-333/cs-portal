import { NextRequest, NextResponse } from "next/server";
import { and, count, desc, eq, gt, gte, inArray, lte, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import {
  getAiDailyLimit,
  getGeminiModel,
  getUtcDayWindow,
  isAiConfigured,
} from "@/lib/ai/provider";
import { isGoogleAuthConfigured } from "@/lib/auth/google";
import {
  hashSessionToken,
  requireAdmin,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import {
  activationCodes,
  aiChatUsage,
  codeRedemptions,
  enrollments,
  getDb,
  isDatabaseConfigured,
  sessions,
  userMistakes,
  userNotes,
  userProgress,
  users,
} from "@/lib/db";
import { isValidUuid } from "@/app/api/admin/_catalog";
import type { AdminSystemData } from "@/components/admin/adminTypes";

export const dynamic = "force-dynamic";

function utcDateKeyDaysAgo(daysAgo: number, now: Date): string {
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متصلة حالياً." },
      { status: 503 }
    );
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح لك بعرض حالة النظام." },
      { status: 403 }
    );
  }

  try {
    const db = getDb();
    const now = new Date();
    const { dateKey: todayKey } = getUtcDayWindow(now);
    const sevenDaysAgoKey = utcDateKeyDaysAgo(6, now);

    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value?.trim();
    const currentTokenHash = rawToken ? hashSessionToken(rawToken) : null;

    const pingStart = Date.now();
    await db.execute(sql`SELECT 1`);
    const dbLatencyMs = Math.max(1, Date.now() - pingStart);

    const [
      usersCnt,
      sessionsCnt,
      activeSessionsCnt,
      codesCnt,
      enrollmentsCnt,
      redemptionsCnt,
      progressCnt,
      notesCnt,
      mistakesCnt,
      aiUsageCnt,
      activeSessionRows,
      aiTodayTotalRows,
      ai7dTotalRows,
      aiRecentRows,
    ] = await Promise.all([
      db.select({ total: count() }).from(users),
      db.select({ total: count() }).from(sessions),
      db
        .select({ total: count() })
        .from(sessions)
        .where(gt(sessions.expiresAt, now)),
      db.select({ total: count() }).from(activationCodes),
      db.select({ total: count() }).from(enrollments),
      db.select({ total: count() }).from(codeRedemptions),
      db.select({ total: count() }).from(userProgress),
      db.select({ total: count() }).from(userNotes),
      db.select({ total: count() }).from(userMistakes),
      db.select({ total: count() }).from(aiChatUsage),
      db
        .select({
          id: sessions.id,
          tokenHash: sessions.tokenHash,
          userId: sessions.userId,
          userAgent: sessions.userAgent,
          createdAt: sessions.createdAt,
          expiresAt: sessions.expiresAt,
          userName: users.fullName,
          userEmail: users.email,
          userRole: users.role,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(gt(sessions.expiresAt, now))
        .orderBy(desc(sessions.createdAt))
        .limit(60),
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
        .select()
        .from(aiChatUsage)
        .where(gte(aiChatUsage.dateKey, sevenDaysAgoKey))
        .orderBy(desc(aiChatUsage.dateKey), desc(aiChatUsage.requestCount))
        .limit(50),
    ]);

    // Resolve user:<uuid> AI actors to student names
    const aiUserIds = Array.from(
      new Set(
        aiRecentRows
          .filter((r) => r.actorKey.startsWith("user:"))
          .map((r) => r.actorKey.slice(5))
          .filter((id) => isValidUuid(id))
      )
    );

    const aiUserMap = new Map<string, { fullName: string; email: string }>();
    if (aiUserIds.length > 0) {
      const matchedUsers = await db
        .select({
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        })
        .from(users)
        .where(inArray(users.id, aiUserIds));
      for (const u of matchedUsers) {
        aiUserMap.set(u.id, { fullName: u.fullName, email: u.email });
      }
    }

    const totalSess = Number(sessionsCnt[0]?.total ?? 0);
    const activeSess = Number(activeSessionsCnt[0]?.total ?? 0);

    const payload: AdminSystemData = {
      dbConnected: true,
      dbLatencyMs,
      serverTimeIso: now.toISOString(),
      tableCounts: {
        users: Number(usersCnt[0]?.total ?? 0),
        sessions: totalSess,
        activeSessions: activeSess,
        expiredSessions: Math.max(0, totalSess - activeSess),
        activationCodes: Number(codesCnt[0]?.total ?? 0),
        enrollments: Number(enrollmentsCnt[0]?.total ?? 0),
        codeRedemptions: Number(redemptionsCnt[0]?.total ?? 0),
        userProgress: Number(progressCnt[0]?.total ?? 0),
        userNotes: Number(notesCnt[0]?.total ?? 0),
        userMistakes: Number(mistakesCnt[0]?.total ?? 0),
        aiChatUsage: Number(aiUsageCnt[0]?.total ?? 0),
      },
      envStatus: {
        databaseUrl: Boolean(process.env.DATABASE_URL?.trim()),
        databaseUrlUnpooled: Boolean(process.env.DATABASE_URL_UNPOOLED?.trim()),
        googleOAuth: isGoogleAuthConfigured(),
        geminiApiKey: isAiConfigured(),
        geminiModel: getGeminiModel(),
        aiDailyLimit: getAiDailyLimit(),
        bunnyCdnHost: Boolean(process.env.BUNNY_STREAM_CDN_HOST?.trim()),
        bunnyTokenKey: Boolean(process.env.BUNNY_STREAM_TOKEN_KEY?.trim()),
        hlsSigningSecret: Boolean(process.env.HLS_SIGNING_SECRET?.trim()),
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "غير محدد (تلقائي)",
        nodeEnv: process.env.NODE_ENV || "development",
      },
      activeSessions: activeSessionRows.map((s) => ({
        id: s.id,
        userId: s.userId,
        userName: s.userName,
        userEmail: s.userEmail,
        userRole: s.userRole,
        userAgent: s.userAgent ?? null,
        createdAt: s.createdAt.toISOString(),
        expiresAt: s.expiresAt.toISOString(),
        isCurrent: Boolean(currentTokenHash && s.tokenHash === currentTokenHash),
      })),
      aiUsage: {
        dateKey: todayKey,
        dailyLimit: getAiDailyLimit(),
        todayTotalRequests: Number(aiTodayTotalRows[0]?.total ?? 0),
        sevenDayTotalRequests: Number(ai7dTotalRows[0]?.total ?? 0),
        entries: aiRecentRows.map((row) => {
          const isUser = row.actorKey.startsWith("user:");
          const uid = isUser ? row.actorKey.slice(5) : null;
          const userInfo = uid ? aiUserMap.get(uid) : undefined;
          return {
            id: row.id,
            actorKey: row.actorKey,
            actorType: isUser ? "user" : "guest",
            actorLabel: userInfo
              ? userInfo.fullName
              : isUser
                ? `مستخدم (${uid?.slice(0, 8)})`
                : `زائر (${row.actorKey.replace(/^guest:/, "").slice(0, 10)})`,
            actorEmail: userInfo?.email ?? null,
            dateKey: row.dateKey,
            requestCount: row.requestCount,
            updatedAt: row.updatedAt.toISOString(),
          };
        }),
      },
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[GET /api/admin/system] Error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل بيانات صحة النظام." },
      { status: 500 }
    );
  }
}

interface SystemActionBody {
  action?: unknown;
  sessionId?: unknown;
  userId?: unknown;
  actorKey?: unknown;
  dateKey?: unknown;
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
      { error: "غير مصرح لك بتنفيذ عمليات النظام." },
      { status: 403 }
    );
  }

  let body: SystemActionBody;
  try {
    body = (await request.json()) as SystemActionBody;
  } catch {
    return NextResponse.json(
      { error: "بيانات الطلب غير صالحة." },
      { status: 400 }
    );
  }

  const db = getDb();
  const now = new Date();

  try {
    if (body.action === "cleanup_expired_sessions") {
      const deleted = await db
        .delete(sessions)
        .where(lte(sessions.expiresAt, now))
        .returning({ id: sessions.id });
      return NextResponse.json(
        { ok: true, affected: deleted.length },
        { status: 200 }
      );
    }

    if (body.action === "revoke_session") {
      const sessionId =
        typeof body.sessionId === "string" ? body.sessionId.trim() : "";
      if (!isValidUuid(sessionId)) {
        return NextResponse.json(
          { error: "معرّف الجلسة غير صالح." },
          { status: 400 }
        );
      }
      const deleted = await db
        .delete(sessions)
        .where(eq(sessions.id, sessionId))
        .returning({ id: sessions.id });
      return NextResponse.json(
        { ok: true, affected: deleted.length },
        { status: 200 }
      );
    }

    if (body.action === "revoke_user_sessions") {
      const userId =
        typeof body.userId === "string" ? body.userId.trim() : "";
      if (!isValidUuid(userId)) {
        return NextResponse.json(
          { error: "معرّف المستخدم غير صالح." },
          { status: 400 }
        );
      }
      const deleted = await db
        .delete(sessions)
        .where(eq(sessions.userId, userId))
        .returning({ id: sessions.id });
      return NextResponse.json(
        { ok: true, affected: deleted.length },
        { status: 200 }
      );
    }

    if (body.action === "reset_ai_usage") {
      const actorKey =
        typeof body.actorKey === "string" ? body.actorKey.trim() : "";
      const dateKey =
        typeof body.dateKey === "string" && body.dateKey.trim()
          ? body.dateKey.trim()
          : getUtcDayWindow(now).dateKey;

      if (actorKey) {
        const deleted = await db
          .delete(aiChatUsage)
          .where(
            and(
              eq(aiChatUsage.actorKey, actorKey),
              eq(aiChatUsage.dateKey, dateKey)
            )
          )
          .returning({ id: aiChatUsage.id });
        return NextResponse.json(
          { ok: true, affected: deleted.length },
          { status: 200 }
        );
      }

      const deleted = await db
        .delete(aiChatUsage)
        .where(eq(aiChatUsage.dateKey, dateKey))
        .returning({ id: aiChatUsage.id });
      return NextResponse.json(
        { ok: true, affected: deleted.length },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "الإجراء المطلوب غير مدعوم." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[POST /api/admin/system] Error:", error);
    return NextResponse.json(
      { error: "تعذر تنفيذ إجراء النظام." },
      { status: 500 }
    );
  }
}
