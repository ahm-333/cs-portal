import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(),
  googleId: text("google_id").unique(),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  yearLevel: integer("year_level").notNull().default(2),
  department: text("department").notNull().default("CS"),
  role: text("role").$type<"student" | "admin">().notNull().default("student"),
  examDate: text("exam_date"),
  isSuspended: boolean("is_suspended").notNull().default(false),
  suspendReason: text("suspend_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    userAgent: text("user_agent"),
    deviceId: text("device_id"),
    deviceName: text("device_name"),
    ipAddress: text("ip_address"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ]
);

export const userDevices = pgTable(
  "user_devices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deviceId: text("device_id").notNull(),
    deviceName: text("device_name").notNull(),
    browser: text("browser"),
    os: text("os"),
    ipAddress: text("ip_address"),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    isBlocked: boolean("is_blocked").notNull().default(false),
  },
  (table) => [
    uniqueIndex("user_devices_user_device_uidx").on(table.userId, table.deviceId),
    index("user_devices_user_id_idx").on(table.userId),
  ]
);

export const subscriptionRequests = pgTable(
  "subscription_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    courseCode: text("course_code").notNull(),
    courseTitle: text("course_title").notNull(),
    amount: integer("amount").notNull().default(0),
    method: text("method")
      .$type<"vodafone_cash" | "instapay">()
      .notNull()
      .default("vodafone_cash"),
    senderInfo: text("sender_info").notNull(),
    receiptData: text("receipt_data"),
    status: text("status")
      .$type<"pending" | "approved" | "rejected">()
      .notNull()
      .default("pending"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [
    index("subscription_requests_user_id_idx").on(table.userId),
    index("subscription_requests_status_idx").on(table.status),
  ]
);

export const studentMessages = pgTable(
  "student_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    senderName: text("sender_name").notNull(),
    senderPhone: text("sender_phone"),
    senderEmail: text("sender_email"),
    type: text("type")
      .$type<"suggest" | "bug" | "support">()
      .notNull()
      .default("support"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    status: text("status").$type<"open" | "resolved">().notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("student_messages_status_idx").on(table.status),
    index("student_messages_created_at_idx").on(table.createdAt),
  ]
);

export const adminNotifications = pgTable(
  "admin_notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type").$type<"security" | "payment" | "message">().notNull(),
    severity: text("severity")
      .$type<"info" | "warning" | "critical">()
      .notNull()
      .default("info"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    metaJson: text("meta_json"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("admin_notifications_is_read_idx").on(table.isRead),
    index("admin_notifications_created_at_idx").on(table.createdAt),
  ]
);

export const courseOverrides = pgTable("course_overrides", {
  courseId: text("course_id").primaryKey(),
  isPublished: boolean("is_published").notNull().default(true),
  isPaid: boolean("is_paid").notNull().default(false),
  price: integer("price").notNull().default(0),
  isLocked: boolean("is_locked").notNull().default(false),
  freeLessonIdsJson: text("free_lesson_ids_json"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  maxDevicesPerUser: integer("max_devices_per_user").notNull().default(2),
  enforceSingleSession: boolean("enforce_single_session").notNull().default(true),
  aiDailyLimit: integer("ai_daily_limit").notNull().default(25),
  registrationOpen: boolean("registration_open").notNull().default(true),
  announcementEnabled: boolean("announcement_enabled").notNull().default(false),
  announcementText: text("announcement_text").notNull().default(""),
  announcementAudience: text("announcement_audience").notNull().default("all"),
  vodafoneCashNumber: text("vodafone_cash_number").notNull().default("01000000000"),
  instaPayHandle: text("insta_pay_handle").notNull().default("ahmed.amir@instapay"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    lessonId: text("lesson_id").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    bestQuizScore: integer("best_quiz_score"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_progress_user_lesson_uidx").on(table.userId, table.lessonId),
    index("user_progress_user_id_idx").on(table.userId),
  ]
);

export const userNotes = pgTable(
  "user_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    content: text("content").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_notes_user_lesson_uidx").on(table.userId, table.lessonId),
  ]
);

export const userMistakes = pgTable(
  "user_mistakes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    courseCode: text("course_code").notNull(),
    lessonId: text("lesson_id"),
    questionText: text("question_text").notNull(),
    answerText: text("answer_text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_mistakes_user_course_question_uidx").on(
      table.userId,
      table.courseId,
      table.questionText
    ),
    index("user_mistakes_user_id_idx").on(table.userId),
  ]
);

export const activationCodes = pgTable(
  "activation_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull().unique(),
    scopeType: text("scope_type")
      .$type<"course" | "lesson" | "bundle">()
      .notNull()
      .default("course"),
    targetId: text("target_id").notNull(),
    batchLabel: text("batch_label"),
    maxUses: integer("max_uses").notNull().default(1),
    usedCount: integer("used_count").notNull().default(0),
    isRevoked: boolean("is_revoked").notNull().default(false),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("activation_codes_scope_target_idx").on(table.scopeType, table.targetId),
    index("activation_codes_batch_label_idx").on(table.batchLabel),
  ]
);

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scopeType: text("scope_type")
      .$type<"course" | "lesson" | "bundle">()
      .notNull()
      .default("course"),
    targetId: text("target_id").notNull(),
    codeId: uuid("code_id").references(() => activationCodes.id, { onDelete: "set null" }),
    status: text("status")
      .$type<"active" | "revoked" | "expired">()
      .notNull()
      .default("active"),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("enrollments_user_scope_target_uidx").on(
      table.userId,
      table.scopeType,
      table.targetId
    ),
    index("enrollments_user_id_idx").on(table.userId),
  ]
);

export const codeRedemptions = pgTable(
  "code_redemptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    codeId: uuid("code_id")
      .notNull()
      .references(() => activationCodes.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ipHash: text("ip_hash"),
    redeemedAt: timestamp("redeemed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("code_redemptions_code_id_idx").on(table.codeId),
    index("code_redemptions_user_id_idx").on(table.userId),
  ]
);

export const aiChatUsage = pgTable(
  "ai_chat_usage",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorKey: text("actor_key").notNull(),
    dateKey: text("date_key").notNull(),
    requestCount: integer("request_count").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("ai_chat_usage_actor_date_uidx").on(table.actorKey, table.dateKey),
  ]
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type SessionRow = typeof sessions.$inferSelect;
export type UserDeviceRow = typeof userDevices.$inferSelect;
export type SubscriptionRequestRow = typeof subscriptionRequests.$inferSelect;
export type StudentMessageRow = typeof studentMessages.$inferSelect;
export type AdminNotificationRow = typeof adminNotifications.$inferSelect;
export type CourseOverrideRow = typeof courseOverrides.$inferSelect;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type UserProgressRow = typeof userProgress.$inferSelect;
export type UserNoteRow = typeof userNotes.$inferSelect;
export type UserMistakeRow = typeof userMistakes.$inferSelect;
export type ActivationCodeRow = typeof activationCodes.$inferSelect;
export type EnrollmentRow = typeof enrollments.$inferSelect;
export type CodeRedemptionRow = typeof codeRedemptions.$inferSelect;
export type AiChatUsageRow = typeof aiChatUsage.$inferSelect;
