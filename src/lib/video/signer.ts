import { createHash, createHmac, randomBytes } from "node:crypto";

const DEFAULT_TOKEN_TTL_SECONDS = 900; // 15 minutes
const MIN_TOKEN_TTL_SECONDS = 60;
const MAX_TOKEN_TTL_SECONDS = 3600;

export interface SignedHlsPlayback {
  playbackUrl: string;
  expiresAt: string;
}

export interface WatermarkPayload {
  label: string;
  sublabel: string;
  sessionTag: string;
}

export interface WatermarkUserInput {
  fullName?: string | null;
  email?: string | null;
  id?: string | null;
}

function toBase64Url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getBunnyCdnHost(): string | null {
  const raw = process.env.BUNNY_STREAM_CDN_HOST?.trim();
  if (!raw) return null;
  const cleaned = raw
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/g, "")
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

function getBunnyTokenKey(): string | null {
  const raw = process.env.BUNNY_STREAM_TOKEN_KEY?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function getHlsSigningSecret(): string | null {
  const raw = process.env.HLS_SIGNING_SECRET?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function clampTtl(ttlSeconds?: number): number {
  if (typeof ttlSeconds !== "number" || !Number.isFinite(ttlSeconds)) {
    return DEFAULT_TOKEN_TTL_SECONDS;
  }
  return Math.min(
    MAX_TOKEN_TTL_SECONDS,
    Math.max(MIN_TOKEN_TTL_SECONDS, Math.round(ttlSeconds))
  );
}

/**
 * Normalizes a relative Bunny Stream / HLS path into a leading-slash path.
 * Rejects path traversal segments (`..`) or control characters.
 * If a bare Bunny video GUID is provided (no extension), appends `/playlist.m3u8`.
 */
function normalizeRelativeHlsPath(rawPath: string): string | null {
  const trimmed = rawPath.trim();
  if (!trimmed || /[\r\n\0]/.test(trimmed)) {
    return null;
  }

  const withoutQuery = trimmed.split("?")[0]?.split("#")[0] ?? "";
  const cleaned = withoutQuery.replace(/^\/+/, "");
  if (!cleaned) return null;

  const segments = cleaned.split("/").filter(Boolean);
  if (segments.some((seg) => seg === ".." || seg === ".")) {
    return null;
  }

  const joined = `/${segments.join("/")}`;
  const lastSegment = segments[segments.length - 1] ?? "";
  if (!lastSegment.includes(".")) {
    return `${joined}/playlist.m3u8`;
  }
  return joined;
}

/**
 * Extracts the directory prefix ending with `/` so Bunny CDN's `token_path`
 * authorizes both the master `.m3u8`, variant playlists, and `.ts`/`.m4s` segments.
 */
function extractDirectoryTokenPath(normalizedPath: string): string {
  const lastSlash = normalizedPath.lastIndexOf("/");
  if (lastSlash <= 0) {
    return "/";
  }
  return normalizedPath.slice(0, lastSlash + 1);
}

/**
 * Signs a Bunny CDN HLS URL using Bunny's official Directory Token Authentication spec:
 *   token = base64url(sha256(securityKey + tokenPath + expires + "token_path=" + tokenPath))
 *   url   = https://{host}/bcdn_token={token}&expires={expires}&token_path={encodedTokenPath}{path}
 *
 * Embedding the token in the path prefix ensures relative variant playlists and
 * media segments inside `.m3u8` automatically inherit the directory token in `hls.js`
 * and Safari native HLS without rewriting manifests.
 */
function buildBunnySignedUrl(
  cdnHost: string,
  normalizedPath: string,
  securityKey: string,
  expiresUnix: number
): string {
  const tokenPath = extractDirectoryTokenPath(normalizedPath);
  const parameterData = `token_path=${tokenPath}`;
  const hashableBase = `${securityKey}${tokenPath}${expiresUnix}${parameterData}`;
  const token = toBase64Url(createHash("sha256").update(hashableBase).digest());
  const encodedTokenPath = encodeURIComponent(tokenPath);

  return `https://${cdnHost}/bcdn_token=${token}&expires=${expiresUnix}&token_path=${encodedTokenPath}${normalizedPath}`;
}

/**
 * Attaches a short-lived HMAC-SHA256 `exp` + `sig` signature to a generic HTTPS HLS URL.
 */
function buildGenericSignedHlsUrl(
  parsedUrl: URL,
  secret: string,
  expiresUnix: number
): string {
  const signed = new URL(parsedUrl.toString());
  const payload = `${signed.pathname}:${expiresUnix}`;
  const sig = toBase64Url(
    createHmac("sha256", secret).update(payload).digest()
  );
  signed.searchParams.set("exp", String(expiresUnix));
  signed.searchParams.set("sig", sig);
  return signed.toString();
}

/**
 * Returns true when either Bunny Stream Token Authentication (`BUNNY_STREAM_CDN_HOST`
 * + `BUNNY_STREAM_TOKEN_KEY`) or generic HLS HMAC signing (`HLS_SIGNING_SECRET`)
 * is configured in environment variables.
 */
export function isHlsSigningConfigured(): boolean {
  const bunnyConfigured = Boolean(getBunnyCdnHost() && getBunnyTokenKey());
  const genericConfigured = Boolean(getHlsSigningSecret());
  return bunnyConfigured || genericConfigured;
}

/**
 * Signs an HLS playback path or full HTTPS `.m3u8` URL with a short-lived token.
 * - Relative paths (e.g. `/video-guid/playlist.m3u8` or `video-guid`) require
 *   `BUNNY_STREAM_CDN_HOST` and are signed via Bunny Token Auth when
 *   `BUNNY_STREAM_TOKEN_KEY` is configured.
 * - Full `https://...m3u8` URLs are signed via Bunny Token Auth if targeting the
 *   configured Bunny host, or via HMAC `exp` + `sig` query params when
 *   `HLS_SIGNING_SECRET` is configured.
 * - Returns `null` if the input is invalid or if a relative Bunny path cannot be
 *   resolved because `BUNNY_STREAM_CDN_HOST` is not configured.
 */
export function signHlsPlaybackUrl(
  hlsPath: string,
  ttlSeconds: number = DEFAULT_TOKEN_TTL_SECONDS
): SignedHlsPlayback | null {
  const trimmed = hlsPath.trim();
  if (!trimmed) return null;

  const ttl = clampTtl(ttlSeconds);
  const expiresUnix = Math.floor(Date.now() / 1000) + ttl;
  const expiresAt = new Date(expiresUnix * 1000).toISOString();

  const bunnyHost = getBunnyCdnHost();
  const bunnyKey = getBunnyTokenKey();
  const hlsSecret = getHlsSigningSecret();

  // Case 1: Full HTTPS HLS URL
  if (/^https?:\/\//i.test(trimmed)) {
    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      return null;
    }

    const isLocalDevHttp =
      parsed.protocol === "http:" &&
      process.env.NODE_ENV !== "production" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");

    if (parsed.protocol !== "https:" && !isLocalDevHttp) {
      return null;
    }

    const normalizedHost = parsed.hostname.toLowerCase();
    const isBunnyTarget =
      Boolean(bunnyKey) &&
      ((bunnyHost && normalizedHost === bunnyHost.toLowerCase()) ||
        normalizedHost.endsWith(".b-cdn.net"));

    if (isBunnyTarget && bunnyKey) {
      const normalizedPath = normalizeRelativeHlsPath(parsed.pathname);
      if (!normalizedPath) return null;
      return {
        playbackUrl: buildBunnySignedUrl(
          parsed.host,
          normalizedPath,
          bunnyKey,
          expiresUnix
        ),
        expiresAt,
      };
    }

    if (hlsSecret) {
      return {
        playbackUrl: buildGenericSignedHlsUrl(parsed, hlsSecret, expiresUnix),
        expiresAt,
      };
    }

    return {
      playbackUrl: parsed.toString(),
      expiresAt,
    };
  }

  // Case 2: Relative Bunny Stream path
  if (!bunnyHost) {
    return null;
  }

  const normalizedPath = normalizeRelativeHlsPath(trimmed);
  if (!normalizedPath) {
    return null;
  }

  if (bunnyKey) {
    return {
      playbackUrl: buildBunnySignedUrl(
        bunnyHost,
        normalizedPath,
        bunnyKey,
        expiresUnix
      ),
      expiresAt,
    };
  }

  const baseUrl = new URL(`https://${bunnyHost}${normalizedPath}`);
  if (hlsSecret) {
    return {
      playbackUrl: buildGenericSignedHlsUrl(baseUrl, hlsSecret, expiresUnix),
      expiresAt,
    };
  }

  return {
    playbackUrl: baseUrl.toString(),
    expiresAt,
  };
}

/**
 * Builds a concise, forensically traceable student watermark payload for
 * rendering inside the protected video viewport.
 */
export function buildWatermarkPayload(
  user: WatermarkUserInput | null
): WatermarkPayload {
  const cleanName = user?.fullName?.trim();
  const cleanEmail = user?.email?.trim();
  const cleanId = user?.id?.trim();

  const label =
    cleanName && cleanName.length > 0
      ? cleanName.slice(0, 40)
      : cleanEmail
        ? cleanEmail.split("@")[0]?.slice(0, 32) || "طالب بوابة حاسبات"
        : "طالب بوابة حاسبات";

  let sublabel = "CS Portal · Protected";
  if (cleanEmail && cleanEmail.length > 0) {
    sublabel = cleanEmail.slice(0, 42);
  } else if (cleanId && cleanId.length > 0) {
    sublabel = `ID:${cleanId.slice(0, 8).toUpperCase()}`;
  }

  const identitySeed = cleanId || cleanEmail || "guest";
  const identityHash = createHash("sha256")
    .update(identitySeed)
    .digest("hex")
    .slice(0, 4)
    .toUpperCase();
  const nonce = randomBytes(2).toString("hex").toUpperCase();
  const sessionTag = `CS-${identityHash}-${nonce}`;

  return {
    label,
    sublabel,
    sessionTag,
  };
}
