import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getSearchIndex } from "@/lib/data";

const PRIVATE_NO_STORE = {
  "Cache-Control": "private, no-store",
};

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, code: "AUTH_REQUIRED", error: "يجب تسجيل الدخول أولاً." },
      { status: 401, headers: PRIVATE_NO_STORE }
    );
  }

  const items = await getSearchIndex();
  return NextResponse.json(items, {
    status: 200,
    headers: PRIVATE_NO_STORE,
  });
}
