# CS Portal — Architecture & Engineering Specification

This document describes the full-stack architecture, database schema, authentication & sync model, activation code concurrency design, Chapter AI tutor, protected HLS video pipeline, design system, and security invariants of **Ahmed Amir Ahmed — CS Portal (بوابة حاسبات)**.

---

## 1. System Philosophy & Dual-Mode Architecture

- **Framework:** Next.js `16.4` (App Router + Turbopack) + React `19.3` + TypeScript `5` (strict) + Tailwind CSS `v4`.
- **Dual-Mode Operation (Zero-DB Standalone ↔ Full Cloud Production):**
  - **Standalone Zero-DB Mode (Default when `DATABASE_URL` is unset):** Builds and runs 100% cleanly on Vercel or locally with ZERO environment variables. Curriculum renders from static TypeScript data, progress/notes/mistakes persist in browser `localStorage` (`cs_portal_state_v3`), `/admin` displays a Neon setup checklist, and protected cloud/admin APIs return `503` cleanly without crashing.
  - **Full Cloud Production Mode (When `DATABASE_URL` is set):** Enables **Neon Serverless PostgreSQL + Drizzle ORM** (`src/lib/db/`), optional student accounts with cross-device cloud sync, race-condition-proof activation codes, strict server-side paid-content authorization, private `/admin` control center, Gemini 2.5 Flash Chapter AI Tutor, and short-lived token-signed Bunny Stream HLS playback.
- **Data Access Boundary:** All Server Components read content and server-verified enrollments through `src/lib/data.ts`.
- **Next.js 16 Convention:** Dynamic route `params` and `searchParams` are async Promises and are always awaited (`const { slug } = await params`).

---

## 2. Database Layer — Neon PostgreSQL + Drizzle ORM

Defined in `src/lib/db/index.ts`, `src/lib/db/schema.ts`, `drizzle.config.ts`, and `src/lib/db/seed-admin.ts`:

### Connection Topology
- **Runtime (`DATABASE_URL`):** Uses `@neondatabase/serverless` WebSocket `Pool` + `drizzle-orm/neon-serverless` with Neon's **pooled** connection string (`-pooler` hostname) so ACID `db.transaction()` calls work seamlessly in serverless functions.
- **Migrations (`DATABASE_URL_UNPOOLED`):** `drizzle.config.ts` prefers `DATABASE_URL_UNPOOLED` (direct Neon connection) for `npm run db:push`, `npm run db:generate`, and `npm run db:migrate`.
- **Zero-DB Safety:** `isDatabaseConfigured()` and `getDbOrNull()` guard all DB callers so missing env vars never throw at import time or during `next build`.

### Schema (9 Tables in `src/lib/db/schema.ts`)

| Table | Purpose & Key Constraints |
| --- | --- |
| `users` | Accounts (`id`, unique `email`, `password_hash`, `full_name`, `year_level`, `department`, `role: "student" \| "admin"`, `exam_date`, `last_active_at`) |
| `sessions` | Opaque session store (`token_hash` SHA-256 unique, `user_id` FK cascade, `user_agent`, `expires_at`) |
| `user_progress` | Per-lesson completion & highest quiz score (`unique(user_id, lesson_id)`, `course_id`, `is_completed`, `best_quiz_score`) |
| `user_notes` | Auto-saved per-lesson student notes (`unique(user_id, lesson_id)`) |
| `user_mistakes` | Mistake Bank items (`unique(user_id, course_id, question_text)`) |
| `activation_codes` | Admin-generated codes (`unique(code)`, `scope_type: "course" \| "lesson" \| "bundle"`, `target_id`, `batch_label`, `max_uses`, `used_count`, `is_revoked`, `expires_at`, `created_by`) |
| `enrollments` | Active student entitlements (`unique(user_id, scope_type, target_id)`, `code_id`, `status: "active" \| "revoked" \| "expired"`, `expires_at`) |
| `code_redemptions` | Immutable redemption audit log (`code_id`, `user_id`, salted SHA-256 `ip_hash`, `redeemed_at`) |
| `ai_chat_usage` | Daily AI quota tracking (`unique(actor_key, date_key)`, `request_count`) |

### Database Scripts
```bash
npm run db:push        # Push Drizzle schema directly to Neon PostgreSQL
npm run db:generate    # Generate SQL migration files into ./drizzle
npm run db:migrate     # Run generated migrations
npm run db:studio      # Open Drizzle Studio locally
npm run db:seed-admin  # Upsert initial admin account from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME
```

---

## 3. Optional Auth & Local-First Cloud Sync

Students can study immediately as guests (zero login friction) and optionally create a cloud account at `/login` to sync progress across devices and redeem paid activation codes.

### Security & Session Mechanics
- **Password Hashing (`src/lib/auth/password.ts`):** Uses Node's built-in `crypto.scryptSync` with a random 16-byte salt (`scrypt:<hex-salt>:<hex-hash>`) and constant-time verification via `crypto.timingSafeEqual`. Matches `src/lib/db/seed-admin.ts`.
- **Sessions (`src/lib/auth/session.ts`):** 32-byte cryptographically random token stored in an `HttpOnly`, `SameSite=Lax`, `Secure` (in production) cookie (`cs_portal_session`, 30-day TTL). Only the **SHA-256 hash** of the token is persisted in `sessions.token_hash`.
- **Guards:** `getServerSession()`, `requireUser()`, and `requireAdmin()` (`user.role === "admin"`).

### Local-First Bidirectional Sync
- **Client Stores:** `src/lib/stores/portalStore.ts` (`localStorage["cs_portal_state_v3"]`, SSR-safe `useSyncExternalStore`) + `src/lib/stores/authStore.ts`.
- **Sync Bridge (`src/components/auth/CloudSyncBridge.tsx`):** Mounted globally in `src/app/layout.tsx`. On sign-in or page load, hydrates from `/api/auth/me` and `/api/sync`, merges guest local state into Neon PostgreSQL without losing progress (`GREATEST` for quiz scores, union for completions/mistakes), and debounces subsequent local mutations to `POST /api/sync`.
- **Auth & Sync Endpoints (all return `Cache-Control: private, no-store`):**
  - `POST /api/auth/register` — Creates student account, merges optional `localState`, sets session cookie.
  - `POST /api/auth/login` — Verifies credentials, merges optional `localState`, sets session cookie.
  - `POST /api/auth/logout` — Deletes DB session row and clears cookie.
  - `GET /api/auth/me` — Returns `{ ok: true, dbConfigured, user }`.
  - `GET /api/sync` & `POST /api/sync` — Bidirectional cloud state snapshot & merge.
  - `POST /api/progress` — Upserts per-lesson completion/quiz score to Neon when signed in, or returns `{ ok: true, local: true }` cleanly in guest/Zero-DB mode.

---

## 4. Atomic Activation Codes & Server-Side Paid Gating

Implemented in `src/lib/activation/codes.ts`, `src/app/api/codes/redeem/route.ts`, and `src/app/api/enrollments/route.ts`.

### Race-Condition-Proof Redemption (`POST /api/codes/redeem`)
Runs inside a Neon PostgreSQL ACID `db.transaction()` with double defense-in-depth:
1. Acquires a row-level exclusive lock (`SELECT ... FROM activation_codes WHERE code = $1 FOR UPDATE`) so concurrent attempts serialize cleanly.
2. Validates `is_revoked = false`, `expires_at`, and `used_count < max_uses`.
3. Checks existing active enrollments (`bundle('all')`, `course`, or `lesson`) **before** consuming the code so an already-enrolled student never wastes a code.
4. Executes an atomic conditional update:
   ```sql
   UPDATE activation_codes
   SET used_count = used_count + 1
   WHERE id = $1 AND is_revoked = false
     AND (expires_at IS NULL OR expires_at > NOW())
     AND used_count < max_uses
   RETURNING *
   ```
5. Upserts the `enrollments` row and inserts an audit entry in `code_redemptions` with a salted IP hash.

### Server-Side Authorization Enforcement
For any lesson where `course.is_paid && !lesson.is_free_preview`, `hasUserAccessToLesson()` (admin bypass or active non-expired `bundle`/`course`/`lesson` enrollment) is enforced **server-side** across EVERY delivery surface:
- `getLessonPageData()` in `src/lib/data.ts` (returns `lesson: null, isLocked: true, interactives: [], questions: []`)
- `GET /api/interactives/[id]` (returns `403` + `private, no-store`)
- `POST /api/ai/chat` (fail-closed `403 LESSON_LOCKED`)
- `POST /api/video/token` (fail-closed `401` / `403`)

---

## 5. Private Admin Control Center (`/admin`)

Implemented in `src/app/admin/page.tsx`, `src/components/admin/*`, and `src/app/api/admin/*`:

- **Strict Server-Side Access Control:**
  - When `DATABASE_URL` is unset, `/admin` renders a clean Neon PostgreSQL setup checklist (`200 OK`, no server errors) while `/api/admin/*` returns `503`.
  - When `DATABASE_URL` is set, `/admin` and EVERY `/api/admin/*` route strictly enforce `requireAdmin()` (`role === "admin"`). Non-admins receive `403` on API routes and a locked access screen on `/admin`.
  - `/admin` sets `robots: { index: false, follow: false }` and `dynamic = "force-dynamic"`.
- **Admin API Endpoints (all `dynamic = "force-dynamic"` + `Cache-Control: no-store`):**
  - `GET /api/admin/overview` — KPI summary (total students, 7-day active students, active enrollments & per-course breakdown, code inventory, completed lessons, average quiz score).
  - `GET /api/admin/codes` & `POST /api/admin/codes` — Filterable code table + bulk cryptographically unbiased generator (up to 500 codes/batch, unambiguous alphabet omitting `0/O/1/I/L`).
  - `PATCH /api/admin/codes/[id]` — Revoke or restore an activation code.
  - `GET /api/admin/codes/export` — Exports filtered codes to Excel-ready UTF-8 CSV (with `\uFEFF` BOM for Arabic support and formula-injection sanitization escaping leading `= + - @ \t \r`).
  - `GET /api/admin/students` & `POST /api/admin/students` — Searchable student analytics table (completion %, average quiz score, mistakes, notes, enrollments) + manual `grant` / `revoke` enrollment actions.

---

## 6. The 5th Corner — Chapter AI Assistant

Implemented in `src/app/api/ai/chat/route.ts`, `src/lib/ai/provider.ts`, `src/lib/ai/chapterContext.ts`, `src/lib/ai/quickPrompts.ts`, and `src/components/lesson/ChapterAiAssistant.tsx`:

- **Model & Streaming:** Uses official `@google/genai` SDK targeting `GEMINI_MODEL` (default `gemini-2.5-flash`) with streaming `ReadableStream` responses (`text/plain; charset=utf-8`).
- **Chapter-Scoped Grounding:** `buildChapterAiContext(courseId, lessonId)` compiles the active chapter's structured summary, Markdown notes, key code, and exam tips into the system prompt so answers stay grounded in the student's current chapter.
- **Daily Rate Limiting:** Controlled by `AI_DAILY_LIMIT` (default `25` requests/day per `user:<id>` or `guest:<sha256-ip>`). Persisted in `ai_chat_usage` when Neon is configured, with automatic in-memory fallback when running without a database. Returns `X-AI-Remaining`, `X-AI-Limit`, and `X-AI-Reset-At` headers.
- **Graceful Unconfigured State:** If `GEMINI_API_KEY` is unset, returns `503 AI_NOT_CONFIGURED` cleanly without crashing.

---

## 7. Protected HLS Video Streaming & Anti-Leak Watermark

Implemented in `src/lib/video/signer.ts`, `src/app/api/video/token/route.ts`, `src/components/lesson/ProtectedHlsPlayer.tsx`, and `src/components/lesson/VideoPlayer.tsx`:

- **Zero Raw URL Leakage in SSR:** `sanitizeLessonForClient()` in `src/lib/data.ts` strips `hls_path` (and `video_id` when `video_provider === "hls"`) before passing lesson props to the browser, setting `has_protected_video: true`.
- **Short-Lived Signed Playback (`POST /api/video/token`):**
  - Verifies session + server-side enrollment before minting a short-lived playback URL (default 15-minute TTL).
  - Supports **Bunny Stream Directory Token Authentication** (`BUNNY_STREAM_CDN_HOST` + `BUNNY_STREAM_TOKEN_KEY`) using path-embedded tokens (`/bcdn_token=...&expires=...&token_path=.../`) so nested `.m3u8` variants and `.ts`/`.m4s` segments inherit authorization automatically.
  - Supports generic HTTPS HLS HMAC-SHA256 signing (`HLS_SIGNING_SECRET`) as a fallback.
- **Custom Protected Player (`ProtectedHlsPlayer.tsx`):**
  - Uses `hls.js` (with native HLS fallback for Safari/iOS), custom quality/speed/seek controls, automatic token refresh before expiration, `controlsList="nodownload noplaybackrate"`, `disablePictureInPicture`, and context-menu suppression.
  - **Fullscreen-Persistent Dynamic Watermark + Tamper Guard (`DynamicStudentWatermark`):** Renders the student's name, email/ID, live clock, and unique session tag inside the fullscreen container so the watermark stays visible in fullscreen. Repositions across safe zones every ~10 seconds and monitors DOM removal, `display: none`, `visibility: hidden`, or opacity reduction via `MutationObserver` + computed-style checks, automatically pausing/remounting on tampering.

---

## 8. Warm Editorial Navy Design System & Workspace

- **Palette (`src/app/globals.css`):** Light (`#f6f5f1` canvas, `#1e355c` navy brand, `#c25e33` terracotta warm accent, `#1d6b52` emerald) and Dark (`#0f1319` canvas, `#7ca7f0`, `#e58a62`, `#66c7a6`) with anti-flash pre-hydration script in `src/app/layout.tsx`.
- **Typography & Strict RTL/LTR Isolation:** `<html lang="ar" dir="rtl">` with `Cairo`, `Inter`, and `JetBrains Mono`. All `pre`, `code`, `.code-ltr`, and `.katex` elements enforce `direction: ltr; unicode-bidi: isolate;`.
- **Motion (`MotionEffects.tsx`):** Scroll progress bar, `Lenis` + `gsap` / `ScrollTrigger` (fully disabled under `prefers-reduced-motion: reduce`), spotlight cards, and magnetic buttons.
- **Workspace 5 Corners (`CourseWorkspaceClient.tsx`):**
  1. Video Lectures (`VideoPlayer.tsx` → YouTube / Protected Bunny Embed / `ProtectedHlsPlayer.tsx`)
  2. Interactive Labs (`CourseInteractiveLab.tsx` + lazy `/api/interactives/[id]` in `<iframe srcDoc={...} sandbox="allow-scripts" />`)
  3. Structured Summary & Cheat Sheet (`ChapterSummarySheet.tsx`, `MarkdownViewer.tsx`)
  4. Instant Quizzes & Mistake Bank (`QuizEngine.tsx`)
  5. Chapter AI Tutor (`ChapterAiAssistant.tsx`)

---

## 9. Security Invariants Checklist

1. **Zero Server Secrets in Client Bundles:** `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `GEMINI_API_KEY`, `BUNNY_STREAM_TOKEN_KEY`, `HLS_SIGNING_SECRET`, and `ADMIN_PASSWORD` are NEVER imported or referenced inside any `"use client"` file.
2. **Strict Admin Isolation:** `/admin` and every `/api/admin/*` endpoint enforce `requireAdmin()` (`role === "admin"`) and return `503` when DB is unconfigured.
3. **Fail-Closed Paid Content Gating:** Paid non-preview lessons enforce server-side enrollment in `getLessonPageData()`, `/api/interactives/[id]`, `/api/ai/chat`, and `/api/video/token`.
4. **Atomic Code Redemption:** `POST /api/codes/redeem` executes inside `db.transaction()` with `FOR UPDATE` row locking and conditional `WHERE used_count < max_uses`.
5. **No Raw Paid Video Paths in SSR HTML:** `sanitizeLessonForClient()` redacts `hls_path` (and `video_id` for HLS lessons) before rendering.
6. **Strict Lab Iframe Sandboxing:** Every `srcDoc` lab iframe uses `sandbox="allow-scripts"` ONLY — **NEVER** `allow-same-origin` and **NEVER** `dangerouslySetInnerHTML`.
7. **No Edge Caching of Private APIs:** `vercel.json` and `next.config.ts` cache only `/images/*` (immutable) and `/api/search-index` (public catalog). All auth, sync, admin, codes, enrollments, AI, and video token routes return `Cache-Control: private, no-store` / `no-store`.
8. **Zero-Env Build & Boot Guarantee:** `npm run build` and runtime routes (`/`, `/courses`, `/login`, `/admin`, `/api/auth/me`) work cleanly with zero environment variables set.
