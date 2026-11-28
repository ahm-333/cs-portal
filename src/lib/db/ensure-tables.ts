import { eq, sql } from "drizzle-orm";
import { getDbOrNull, isDatabaseConfigured } from "./index";
import { siteSettings } from "./schema";

export interface EffectiveSiteSettings {
  id: string;
  maxDevicesPerUser: number;
  enforceSingleSession: boolean;
  aiDailyLimit: number;
  registrationOpen: boolean;
  announcementEnabled: boolean;
  announcementText: string;
  announcementAudience: string;
  vodafoneCashNumber: string;
  instaPayHandle: string;
  updatedAt: string;
}

export const DEFAULT_SITE_SETTINGS: EffectiveSiteSettings = {
  id: "default",
  maxDevicesPerUser: 2,
  enforceSingleSession: true,
  aiDailyLimit: 25,
  registrationOpen: true,
  announcementEnabled: false,
  announcementText: "",
  announcementAudience: "all",
  vodafoneCashNumber: "01000000000",
  instaPayHandle: "ahmed.amir@instapay",
  updatedAt: new Date(0).toISOString(),
};

type EnsureTablesGlobalCache = {
  __csPortalEnsureTablesPromise?: Promise<boolean>;
  __csPortalEnsureTablesDone?: boolean;
  __csPortalSettingsCache?: { data: EffectiveSiteSettings; expiresAt: number };
};

const globalCache = globalThis as unknown as EnsureTablesGlobalCache;

const COMBINED_DDL_BLOCK = `
DO $$
BEGIN
  ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended boolean NOT NULL DEFAULT false;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS suspend_reason text;
  ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_id text;
  ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_name text;
  ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip_address text;
  ALTER TABLE sessions ADD COLUMN IF NOT EXISTS last_seen_at timestamptz NOT NULL DEFAULT now();

  CREATE TABLE IF NOT EXISTS user_devices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id text NOT NULL,
    device_name text NOT NULL,
    browser text,
    os text,
    ip_address text,
    first_seen_at timestamptz NOT NULL DEFAULT now(),
    last_seen_at timestamptz NOT NULL DEFAULT now(),
    is_blocked boolean NOT NULL DEFAULT false
  );
  CREATE UNIQUE INDEX IF NOT EXISTS user_devices_user_device_uidx ON user_devices (user_id, device_id);
  CREATE INDEX IF NOT EXISTS user_devices_user_id_idx ON user_devices (user_id);

  CREATE TABLE IF NOT EXISTS subscription_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id text NOT NULL,
    course_code text NOT NULL,
    course_title text NOT NULL,
    amount integer NOT NULL DEFAULT 0,
    method text NOT NULL DEFAULT 'vodafone_cash',
    sender_info text NOT NULL,
    receipt_data text,
    status text NOT NULL DEFAULT 'pending',
    admin_note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    reviewed_at timestamptz
  );
  CREATE INDEX IF NOT EXISTS subscription_requests_user_id_idx ON subscription_requests (user_id);
  CREATE INDEX IF NOT EXISTS subscription_requests_status_idx ON subscription_requests (status);

  CREATE TABLE IF NOT EXISTS student_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    sender_name text NOT NULL,
    sender_phone text,
    sender_email text,
    type text NOT NULL DEFAULT 'support',
    title text NOT NULL,
    body text NOT NULL,
    status text NOT NULL DEFAULT 'open',
    created_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS student_messages_status_idx ON student_messages (status);
  CREATE INDEX IF NOT EXISTS student_messages_created_at_idx ON student_messages (created_at);

  CREATE TABLE IF NOT EXISTS admin_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    severity text NOT NULL DEFAULT 'info',
    title text NOT NULL,
    body text NOT NULL,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    meta_json text,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS admin_notifications_is_read_idx ON admin_notifications (is_read);
  CREATE INDEX IF NOT EXISTS admin_notifications_created_at_idx ON admin_notifications (created_at);

  CREATE TABLE IF NOT EXISTS course_overrides (
    course_id text PRIMARY KEY,
    is_published boolean NOT NULL DEFAULT true,
    is_paid boolean NOT NULL DEFAULT false,
    price integer NOT NULL DEFAULT 0,
    is_locked boolean NOT NULL DEFAULT false,
    free_lesson_ids_json text,
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id text PRIMARY KEY DEFAULT 'default',
    max_devices_per_user integer NOT NULL DEFAULT 2,
    enforce_single_session boolean NOT NULL DEFAULT true,
    ai_daily_limit integer NOT NULL DEFAULT 25,
    registration_open boolean NOT NULL DEFAULT true,
    announcement_enabled boolean NOT NULL DEFAULT false,
    announcement_text text NOT NULL DEFAULT '',
    announcement_audience text NOT NULL DEFAULT 'all',
    vodafone_cash_number text NOT NULL DEFAULT '01000000000',
    insta_pay_handle text NOT NULL DEFAULT 'ahmed.amir@instapay',
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  INSERT INTO site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
END $$;
`;

export function invalidateSiteSettingsCache(): void {
  globalCache.__csPortalSettingsCache = undefined;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Idempotently ensures all new overhaul columns and tables exist in Neon Postgres
 * in ONE single roundtrip DO block. Cached once per Node process.
 */
export async function ensureAdminTables(): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  if (globalCache.__csPortalEnsureTablesDone) {
    return true;
  }

  if (globalCache.__csPortalEnsureTablesPromise) {
    return globalCache.__csPortalEnsureTablesPromise;
  }

  const run = async (): Promise<boolean> => {
    const db = getDbOrNull();
    if (!db) {
      return false;
    }

    try {
      await withTimeout(
        db.execute(sql.raw(COMBINED_DDL_BLOCK)),
        6000,
        "ensureAdminTables"
      );
      globalCache.__csPortalEnsureTablesDone = true;
      return true;
    } catch (error) {
      console.warn("[ensureAdminTables] DDL ensure failed:", error);
      globalCache.__csPortalEnsureTablesPromise = undefined;
      return false;
    }
  };

  globalCache.__csPortalEnsureTablesPromise = run();
  return globalCache.__csPortalEnsureTablesPromise;
}

/**
 * Reads the global `site_settings` row (creating default if missing).
 * Short 15s in-process cache keeps public `/api/site-config` ultra-fast.
 */
export async function getEffectiveSiteSettings(options?: {
  bypassCache?: boolean;
}): Promise<EffectiveSiteSettings> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_SITE_SETTINGS;
  }

  const nowMs = Date.now();
  if (
    !options?.bypassCache &&
    globalCache.__csPortalSettingsCache &&
    globalCache.__csPortalSettingsCache.expiresAt > nowMs
  ) {
    return globalCache.__csPortalSettingsCache.data;
  }

  try {
    const ok = await ensureAdminTables();
    if (!ok) {
      return DEFAULT_SITE_SETTINGS;
    }
    const db = getDbOrNull();
    if (!db) {
      return DEFAULT_SITE_SETTINGS;
    }

    const rows = await withTimeout(
      db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.id, "default"))
        .limit(1),
      4000,
      "getEffectiveSiteSettings"
    );

    let row = rows[0];
    if (!row) {
      const inserted = await db
        .insert(siteSettings)
        .values({ id: "default" })
        .onConflictDoNothing()
        .returning();
      row = inserted[0];
      if (!row) {
        const refetched = await db
          .select()
          .from(siteSettings)
          .where(eq(siteSettings.id, "default"))
          .limit(1);
        row = refetched[0];
      }
    }

    if (!row) {
      return DEFAULT_SITE_SETTINGS;
    }

    const result: EffectiveSiteSettings = {
      id: row.id,
      maxDevicesPerUser: row.maxDevicesPerUser,
      enforceSingleSession: row.enforceSingleSession,
      aiDailyLimit: row.aiDailyLimit,
      registrationOpen: row.registrationOpen,
      announcementEnabled: row.announcementEnabled,
      announcementText: row.announcementText,
      announcementAudience: row.announcementAudience,
      vodafoneCashNumber: row.vodafoneCashNumber,
      instaPayHandle: row.instaPayHandle,
      updatedAt: row.updatedAt.toISOString(),
    };

    globalCache.__csPortalSettingsCache = {
      data: result,
      expiresAt: Date.now() + 15_000,
    };

    return result;
  } catch (error) {
    console.warn("[getEffectiveSiteSettings] Falling back to defaults:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}
