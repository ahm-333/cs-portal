import {
  neon,
  neonConfig,
  type NeonQueryFunction,
} from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const resilientFetch: typeof fetch = async (input, init) => {
  try {
    return await fetch(input, init);
  } catch (err) {
    // Retry once on transient network/connect-timeout hiccups
    if (init?.signal?.aborted) throw err;
    return await fetch(input, init);
  }
};

neonConfig.fetchFunction = resilientFetch;

export type PortalDb = NeonHttpDatabase<typeof schema>;

type DbGlobalCache = {
  __csPortalNeonSql?: NeonQueryFunction<false, false>;
  __csPortalDrizzleDb?: PortalDb;
  __csPortalConnStr?: string;
};

const globalCache = globalThis as unknown as DbGlobalCache;

let cachedSql: NeonQueryFunction<false, false> | null = null;
let cachedDb: PortalDb | null = null;
let cachedConnStr: string | null = null;

const DB_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "NEON_DATABASE_URL",
  "STORAGE_DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
] as const;

export function resolveDatabaseUrl(): string {
  for (const key of DB_ENV_KEYS) {
    const raw = process.env[key];
    if (!raw) continue;
    // Strip accidental surrounding quotes/whitespace when pasted into Vercel Env UI
    const cleaned = raw.trim().replace(/^["']+|["']+$/g, "").trim();
    if (cleaned.length > 0) {
      return cleaned;
    }
  }
  return "";
}

/**
 * Returns true when a Neon / Postgres connection string is configured.
 * Supports DATABASE_URL as well as Vercel Marketplace Neon integration keys (POSTGRES_URL, etc.).
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(resolveDatabaseUrl());
}

function initDbSingleton(): PortalDb {
  const connectionString = resolveDatabaseUrl();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Set DATABASE_URL (or POSTGRES_URL) to your Neon pooled connection string, or guard callers with isDatabaseConfigured() / getDbOrNull()."
    );
  }

  if (process.env.NODE_ENV !== "production") {
    if (
      !globalCache.__csPortalNeonSql ||
      globalCache.__csPortalConnStr !== connectionString
    ) {
      globalCache.__csPortalNeonSql = neon(connectionString);
      globalCache.__csPortalDrizzleDb = drizzle(
        globalCache.__csPortalNeonSql,
        { schema }
      );
      globalCache.__csPortalConnStr = connectionString;
    }
    return globalCache.__csPortalDrizzleDb!;
  }

  if (!cachedSql || !cachedDb || cachedConnStr !== connectionString) {
    cachedSql = neon(connectionString);
    cachedDb = drizzle(cachedSql, { schema });
    cachedConnStr = connectionString;
  }
  return cachedDb;
}

/**
 * Returns the lazily initialized Neon HTTP + Drizzle instance.
 * Uses stateless HTTPS requests (zero WebSocket pool drops or timeouts).
 * Throws a clear error if `DATABASE_URL` is not configured.
 */
export function getDb(): PortalDb {
  return initDbSingleton();
}

/**
 * Safe variant for graceful Zero-DB standalone fallback.
 * Returns `null` when `DATABASE_URL` is unset.
 */
export function getDbOrNull(): PortalDb | null {
  if (!isDatabaseConfigured()) {
    return null;
  }
  return initDbSingleton();
}

/**
 * Resets cached client references (no-op for stateless HTTP driver; kept for CLI script compatibility).
 */
export async function closeDbPool(): Promise<void> {
  globalCache.__csPortalNeonSql = undefined;
  globalCache.__csPortalDrizzleDb = undefined;
  globalCache.__csPortalConnStr = undefined;
  cachedSql = null;
  cachedDb = null;
  cachedConnStr = null;
}

export * from "./schema";
