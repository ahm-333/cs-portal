import { NextResponse } from "next/server";
import { isGoogleAuthConfigured } from "@/lib/auth/google";
import { getServerSession } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET() {
  const dbConfigured = isDatabaseConfigured();
  const googleEnabled = isGoogleAuthConfigured();
  const user = dbConfigured ? await getServerSession() : null;

  return NextResponse.json(
    {
      ok: true,
      dbConfigured,
      googleEnabled,
      user,
    },
    { status: 200, headers: NO_STORE_HEADERS }
  );
}
