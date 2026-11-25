import type { NextRequest } from "next/server";

export const GOOGLE_OAUTH_COOKIE_NAME = "cs_portal_google_oauth";

export function getGoogleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID?.trim() || "";
}

export function getGoogleClientSecret(): string {
  return process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}

/**
 * Resolves the exact Google OAuth callback URL based on the current request origin
 * (falling back to NEXT_PUBLIC_SITE_URL if needed).
 */
export function resolveGoogleRedirectUri(request: NextRequest): string {
  const explicit = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (explicit) return explicit;

  const origin =
    request.nextUrl.origin ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/+$/, "") ||
    "http://localhost:3000";

  return `${origin}/api/auth/google/callback`;
}

export function sanitizeNextPath(raw: string | null | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  return "/courses";
}
