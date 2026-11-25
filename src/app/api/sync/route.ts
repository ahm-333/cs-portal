import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import {
  requireUser,
  type SessionDepartment,
  type SessionUser,
} from "@/lib/auth/session";
import {
  DB_NOT_CONFIGURED_MESSAGE,
  getCloudSyncSnapshot,
  mergeLocalStateIntoCloud,
  parseDepartment,
} from "@/lib/auth/sync";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { users } from "@/lib/db/schema";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        code: "DB_NOT_CONFIGURED",
        error: DB_NOT_CONFIGURED_MESSAGE,
      },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNAUTHORIZED",
        error: "يجب تسجيل الدخول أولاً للوصول للمزامنة السحابية.",
      },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const snapshot = await getCloudSyncSnapshot(user);
    return NextResponse.json(
      { ok: true, ...snapshot },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[api/sync GET] Failed to load cloud state:", error);
    return NextResponse.json(
      { ok: false, error: "تعذّر جلب بيانات المزامنة السحابية." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        code: "DB_NOT_CONFIGURED",
        error: DB_NOT_CONFIGURED_MESSAGE,
      },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNAUTHORIZED",
        error: "يجب تسجيل الدخول أولاً لمزامنة تقدمك.",
      },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "تنسيق بيانات المزامنة غير صالح." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "بيانات المزامنة غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const record = body as Record<string, unknown>;
  const authoritative = record.authoritative === true;

  try {
    await mergeLocalStateIntoCloud(user.id, record, {
      mode: authoritative ? "sync" : "merge",
      updateProfile: true,
      overwriteExamDate: true,
    });

    // Reload user row in case profile or examDate was updated
    const db = getDb();
    const refreshedRows = await db
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
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const refreshed = refreshedRows[0];
    const effectiveUser: SessionUser = refreshed
      ? {
          id: refreshed.id,
          email: refreshed.email,
          phone: refreshed.phone ?? null,
          avatarUrl: refreshed.avatarUrl ?? null,
          googleLinked: Boolean(refreshed.googleId),
          fullName: refreshed.fullName,
          yearLevel: refreshed.yearLevel,
          department: (parseDepartment(refreshed.department, "CS") ??
            "CS") as SessionDepartment,
          role: refreshed.role === "admin" ? "admin" : "student",
          examDate: refreshed.examDate ?? null,
        }
      : user;

    const snapshot = await getCloudSyncSnapshot(effectiveUser);
    return NextResponse.json(
      { ok: true, ...snapshot },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[api/sync POST] Failed to sync cloud state:", error);
    return NextResponse.json(
      { ok: false, error: "تعذّرت مزامنة البيانات مع السحابة الآن." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
