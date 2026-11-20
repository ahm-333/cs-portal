import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

function getSafeRedirectPath(rawNext: string | null): string {
  if (!rawNext) {
    return "/dashboard";
  }

  const trimmed = rawNext.trim();

  // Must be a strict relative path starting with single '/' (block '//', '/\', control chars)
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\") ||
    /[\r\n]/.test(trimmed)
  ) {
    return "/dashboard";
  }

  return trimmed;
}

function getRedirectOrigin(request: NextRequest, fallbackOrigin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (!isLocalEnv && forwardedHost) {
    const cleanHost = forwardedHost.split(",")[0]?.trim();
    if (cleanHost && /^[a-zA-Z0-9.-]+(?::\d+)?$/.test(cleanHost)) {
      return `https://${cleanHost}`;
    }
  }

  return fallbackOrigin;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = getSafeRedirectPath(searchParams.get("next"));
  const targetOrigin = getRedirectOrigin(request, origin);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${targetOrigin}${nextPath}`);
  }

  if (!code) {
    return NextResponse.redirect(`${targetOrigin}/login?error=missing_code`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${targetOrigin}${nextPath}`);
    }
  } catch {
    // Fall through to login error redirect
  }

  return NextResponse.redirect(
    `${targetOrigin}/login?error=auth_callback_failed`
  );
}
