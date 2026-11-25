import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  getGoogleClientId,
  GOOGLE_OAUTH_COOKIE_NAME,
  isGoogleAuthConfigured,
  resolveGoogleRedirectUri,
  sanitizeNextPath,
} from "@/lib/auth/google";
import { parseDepartment, parseYearLevel } from "@/lib/auth/sync";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get("next"));
  const loginFallback = new URL("/login", request.nextUrl.origin);
  loginFallback.searchParams.set("next", nextPath);

  if (!isDatabaseConfigured()) {
    loginFallback.searchParams.set("error", "db_not_configured");
    return NextResponse.redirect(loginFallback);
  }

  if (!isGoogleAuthConfigured()) {
    loginFallback.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(loginFallback);
  }

  const state = crypto.randomBytes(24).toString("hex");
  const yearLevel =
    parseYearLevel(request.nextUrl.searchParams.get("year"), 2) ?? 2;
  const department =
    parseDepartment(request.nextUrl.searchParams.get("dept"), "CS") ?? "CS";

  const redirectUri = resolveGoogleRedirectUri(request);

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", getGoogleClientId());
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const cookiePayload = Buffer.from(
    JSON.stringify({
      state,
      next: nextPath,
      year: yearLevel,
      dept: department,
    }),
    "utf8"
  ).toString("base64url");

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(GOOGLE_OAUTH_COOKIE_NAME, cookiePayload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });

  return response;
}
