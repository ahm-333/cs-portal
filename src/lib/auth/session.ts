import crypto from "node:crypto";
import { cache } from "react";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb, getDbOrNull } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "cs_portal_session";

const SESSION_TTL_DAYS = 30;
const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
const LAST_ACTIVE_THROTTLE_MS = 5 * 60 * 1000;

export type SessionDepartment = "CS" | "AI" | "IS" | "IT";

export interface SessionUser {
  id: string;
  email: string;
  phone: string | null;
  avatarUrl?: string | null;
  googleLinked?: boolean;
  fullName: string;
  yearLevel: number;
  department: SessionDepartment;
  role: "student" | "admin";
  examDate: string | null;
}

const VALID_DEPARTMENTS = new Set<SessionDepartment>(["CS", "AI", "IS", "IT"]);

function normalizeDepartment(raw: string | null | undefined): SessionDepartment {
  const upper = (raw ?? "CS").trim().toUpperCase() as SessionDepartment;
  return VALID_DEPARTMENTS.has(upper) ? upper : "CS";
}

function normalizeYearLevel(raw: number | null | undefined): number {
  return typeof raw === "number" && Number.isInteger(raw) && raw >= 1 && raw <= 4
    ? raw
    : 2;
}

export function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const getServerSession = cache(async function getServerSession(): Promise<SessionUser | null> {
  const db = getDbOrNull();
  if (!db) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value?.trim();
    if (!rawToken) {
      return null;
    }

    const tokenHash = hashSessionToken(rawToken);
    const now = new Date();

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        googleId: users.googleId,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        yearLevel: users.yearLevel,
        department: users.department,
        role: users.role,
        examDate: users.examDate,
        lastActiveAt: users.lastActiveAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return null;
    }

    // Best-effort throttled lastActiveAt touch; never breaks session reads
    if (
      !row.lastActiveAt ||
      now.getTime() - row.lastActiveAt.getTime() > LAST_ACTIVE_THROTTLE_MS
    ) {
      db.update(users)
        .set({ lastActiveAt: now })
        .where(eq(users.id, row.id))
        .catch(() => {
          // ignore non-critical telemetry update failures
        });
    }

    return {
      id: row.id,
      email: row.email,
      phone: row.phone ?? null,
      avatarUrl: row.avatarUrl ?? null,
      googleLinked: Boolean(row.googleId),
      fullName: row.fullName,
      yearLevel: normalizeYearLevel(row.yearLevel),
      department: normalizeDepartment(row.department),
      role: row.role === "admin" ? "admin" : "student",
      examDate: row.examDate ?? null,
    };
  } catch {
    return null;
  }
});

export async function createSession(
  userId: string,
  userAgent?: string | null
): Promise<{ token: string; expiresAt: Date }> {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    userAgent: userAgent ? userAgent.slice(0, 512) : null,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function setSessionCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function destroyCurrentSession(): Promise<void> {
  try {
    const db = getDbOrNull();
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value?.trim();

    if (db && rawToken) {
      const tokenHash = hashSessionToken(rawToken);
      await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
    }
  } catch {
    // Always proceed to clear cookie even if DB delete fails
  } finally {
    try {
      await clearSessionCookie();
    } catch {
      // ignore if headers already immutable
    }
  }
}

export async function requireUser(): Promise<SessionUser | null> {
  return getServerSession();
}

export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getServerSession();
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}
