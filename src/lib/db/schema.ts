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
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ]
);

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
export type UserProgressRow = typeof userProgress.$inferSelect;
export type UserNoteRow = typeof userNotes.$inferSelect;
export type UserMistakeRow = typeof userMistakes.$inferSelect;
export type ActivationCodeRow = typeof activationCodes.$inferSelect;
export type EnrollmentRow = typeof enrollments.$inferSelect;
export type CodeRedemptionRow = typeof codeRedemptions.$inferSelect;
export type AiChatUsageRow = typeof aiChatUsage.$inferSelect;
