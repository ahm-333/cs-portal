import { NextResponse } from "next/server";
import { destroyCurrentSession } from "@/lib/auth/session";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST() {
  await destroyCurrentSession();
  return NextResponse.json({ ok: true }, { status: 200, headers: NO_STORE_HEADERS });
}
