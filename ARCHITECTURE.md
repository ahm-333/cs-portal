# CS Portal — Architecture & Multi-Agent Contract

This file is the single source of truth for all agents working on CS Portal.

## 1. Tech Stack & Conventions
- **Framework:** Next.js 16 App Router + TypeScript + Tailwind CSS v4
- **Auth & DB:** Supabase (`@supabase/ssr`, PostgreSQL + RLS)
- **Direction & Theme:** Root `<html lang="ar" dir="rtl" className="dark">`, dark slate surfaces (`bg-slate-950`, `bg-slate-900`, `border-slate-800`, accent `indigo-500` & `emerald-500`).
- **Typography:** Arabic UI font `Cairo` (`--font-cairo`), Monospace code font `JetBrains_Mono` (`--font-jetbrains-mono`).
- **Strict RTL/LTR Rule:** All code blocks (`<pre>`, `<code>`) and KaTeX math blocks MUST be `dir="ltr"`.
- **Demo/Fallback Mode:** If `isSupabaseConfigured()` from `@/lib/config` is `false`, `src/lib/data.ts` automatically falls back to `src/lib/mock-data.ts` so the entire UI works locally out-of-the-box without Supabase credentials!

## 2. Shared Types & Data Layer Contract
All types live in `src/types/database.ts`. DO NOT duplicate types.

### Next.js 16 Note
- Next.js 16.4 uses `src/proxy.ts` exporting `export async function proxy(request: NextRequest)` (NOT `src/middleware.ts`).
- `params` and `searchParams` in App Router pages/routes are async Promises (`const { slug } = await params`).

### Mock Data exports from `src/lib/mock-data.ts` (owned by `content-labs`):
```ts
export const MOCK_COURSES: Course[];
export const MOCK_LESSONS: Lesson[];
export const MOCK_INTERACTIVES: LessonInteractive[];
export const MOCK_QUESTIONS: Question[];
```

### Browser Supabase Client (`src/lib/supabase/client.ts`, owned by `db-auth`):
```ts
export function createClient();
```

### Data functions exported from `src/lib/data.ts` (owned by `db-auth`):
```ts
export async function getCurrentUser(): Promise<CurrentUser | null>;
export async function getPublishedCourses(): Promise<CourseWithStats[]>;
export async function getCourseDetailBySlug(slug: string): Promise<CourseDetailData | null>;
export async function getLessonPageData(slug: string, lessonId: string): Promise<LessonPageData | null>;
export async function getDashboardData(): Promise<DashboardData>;
export async function getInteractiveById(id: string): Promise<LessonInteractive | null>;
```

### API Routes (owned by `db-auth`):
- `GET /auth/callback` — Exchanges Supabase OAuth code for session and redirects to `/dashboard` (or `next` param).
- `GET /api/interactives/[id]` — Lazy-loads a `LessonInteractive` (`html_content` or `external_url`) respecting RLS. Sets `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` ONLY if parent course is free (`is_paid = false`), otherwise `Cache-Control: private, no-store`.
- `POST /api/progress` — Upserts `{ lesson_id: string; is_completed?: boolean; best_quiz_score?: number }` for authenticated user (returns `{ ok: true, demo?: boolean, progress }` — if unauthenticated/demo, returns `{ ok: true, demo: true }` cleanly so client can mirror in `localStorage`).

## 3. Strict File Ownership Matrix
- **Coordinator:** `package.json`, `next.config.ts`, `tsconfig.json`, `src/types/database.ts`, `src/lib/config.ts`, `ARCHITECTURE.md`, `.env.example`, `.gitignore`
- **`db-auth`:** `supabase/migrations/*`, `src/lib/supabase/*`, `src/lib/data.ts`, `src/proxy.ts` (or middleware), `src/app/auth/callback/route.ts`, `src/app/api/interactives/[id]/route.ts`, `src/app/api/progress/route.ts`
- **`ui-core`:** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/courses/[slug]/page.tsx`, `src/components/layout/*`, `src/components/course/*`
- **`lesson-engine`:** `src/app/courses/[slug]/[lessonId]/page.tsx`, `src/components/lesson/*`
- **`content-labs`:** `src/lib/mock-data.ts`, `supabase/seed/seed.sql`, `content/labs/*.html`
- **`qa-devops`:** `.github/workflows/*`, `vercel.json`, `README.md`, build/type/security fixes

## 4. Security & Free-Tier Rules
1. Never select `html_content` in course/lesson listing queries; lazy-load via `/api/interactives/[id]`.
2. Render interactive HTML ONLY inside `<iframe srcDoc={...} sandbox="allow-scripts" ... />` (NO `allow-same-origin`, NO `dangerouslySetInnerHTML`).
3. Never commit `.env.local`.
4. All interactive HTML labs must be single-file, dark-themed (`#020617` / `#0f172a`), fluid/mobile responsive, and `< 150KB`.
