import { NextResponse } from "next/server";
import { getUserActiveEnrollments } from "@/lib/activation/codes";
import { getServerSession } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db";

const PRIVATE_NO_STORE = "private, no-store";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: true, enrollments: [] },
      { status: 200, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }

  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { ok: true, enrollments: [] },
        { status: 200, headers: { "Cache-Control": PRIVATE_NO_STORE } }
      );
    }

    const enrollments = await getUserActiveEnrollments(session.id);

    return NextResponse.json(
      { ok: true, enrollments },
      { status: 200, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  } catch (error) {
    console.error("[GET /api/enrollments] Unexpected error:", error);
    return NextResponse.json(
      { ok: false, enrollments: [], error: "تعذّر تحميل التفعيلات الحالية." },
      { status: 500, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }
}
