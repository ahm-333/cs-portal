import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { redeemActivationCode } from "@/lib/activation/codes";
import { requireUser } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db";

const PRIVATE_NO_STORE = "private, no-store";

function computeClientIpHash(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const rawIp =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "";

  if (!rawIp) {
    return null;
  }

  const salt = process.env.SESSION_SECRET?.trim() || "cs-portal-redemption-ip";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${rawIp}`)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        code: "DB_NOT_CONFIGURED",
        error: "قاعدة البيانات غير مربوطة بعد.",
      },
      { status: 503, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        code: "AUTH_REQUIRED",
        error:
          "سجّل دخولك بحساب سحابي أولاً علشان التفعيل يتحفظ لحسابك وما يضيعش.",
      },
      { status: 401, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "صيغة الطلب غير صالحة." },
      { status: 400, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }

  const payload =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const rawCode = typeof payload.code === "string" ? payload.code : "";
  const expectedCourseId =
    typeof payload.courseId === "string" && payload.courseId.trim()
      ? payload.courseId.trim()
      : undefined;

  if (!rawCode.trim()) {
    return NextResponse.json(
      { ok: false, error: "أدخل كود التفعيل أولاً." },
      { status: 400, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }

  try {
    const ipHash = computeClientIpHash(request);
    const result = await redeemActivationCode({
      userId: user.id,
      rawCode,
      expectedCourseId,
      ipHash,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        {
          status: result.status,
          headers: { "Cache-Control": PRIVATE_NO_STORE },
        }
      );
    }

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": PRIVATE_NO_STORE },
    });
  } catch (error) {
    console.error("[POST /api/codes/redeem] Unexpected error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "حدث خطأ مؤقت أثناء التفعيل — حاول مرة أخرى بعد لحظات.",
      },
      { status: 500, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }
}
