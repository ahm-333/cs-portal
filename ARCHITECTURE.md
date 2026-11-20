# CS Portal — Standalone Zero-DB Architecture

This file documents the architecture and module boundaries of **CS Portal (بوابة حاسبات)**.

## 1. Tech Stack & Conventions
- **Framework:** Next.js 16 App Router + TypeScript + Tailwind CSS v4
- **Hosting & Cost:** 100% Free & Standalone on **GitHub + Vercel** — zero external database, zero auth service, zero required environment variables!
- **Content Source:** Strictly typed in-repo content modules (`src/lib/mock-data.ts`) and standalone single-file HTML labs (`content/labs/*.html`), accessed through the clean `src/lib/data.ts` data-access boundary so any external database can be plugged in later without touching UI components.
- **Client Persistence (`localStorage`):**
  - `cs_portal_progress` — Per-lesson completion (`is_completed`) and best quiz score (`best_quiz_score`), synced across same-tab components via the `cs-portal-progress-updated` window event and cross-tab via `storage`.
  - `cs_portal_profile` — Optional local student profile (`{ full_name, year_level, department }`) configured at `/login` ("ملف الطالب"), synced via `cs-portal-profile-updated`.
- **Direction & Theme:** Root `<html lang="ar" dir="rtl" className="dark">`, dark slate surfaces (`bg-slate-950`, `bg-slate-900`, `border-slate-800`, accent `indigo-500` & `emerald-500`).
- **Typography:** Arabic UI font `Cairo` (`--font-cairo`), Monospace code font `JetBrains_Mono` (`--font-jetbrains-mono`).
- **Strict RTL/LTR Rule:** All code blocks (`<pre>`, `<code>`) and KaTeX math blocks MUST be `dir="ltr"`.

## 2. Shared Types & Data Layer Contract
All domain types live in `src/types/database.ts`. DO NOT duplicate types.

### Next.js 16 Notes
- `params` and `searchParams` in App Router pages/routes are async Promises (`const { slug } = await params`).

### Content Store (`src/lib/mock-data.ts`):
```ts
export const MOCK_COURSES: Course[];
export const MOCK_LESSONS: Lesson[];
export const MOCK_INTERACTIVES: LessonInteractive[];
export const MOCK_QUESTIONS: Question[];
```

### Data Access Boundary (`src/lib/data.ts`):
All pages read content exclusively through `src/lib/data.ts` (making a future database drop-in a single-file swap):
```ts
export async function getCurrentUser(): Promise<CurrentUser | null>;
export async function getPublishedCourses(): Promise<CourseWithStats[]>;
export async function getCourseDetailBySlug(slug: string): Promise<CourseDetailData | null>;
export async function getLessonPageData(slug: string, lessonId: string): Promise<LessonPageData | null>;
export async function getDashboardData(): Promise<DashboardData>;
export async function getInteractiveById(id: string): Promise<LessonInteractive | null>;
```

### API Routes:
- `GET /api/interactives/[id]` — Lazy-loads a `LessonInteractive` (`html_content` or `external_url`) on demand when the student opens the Lab tab, respecting `is_paid && !is_free_preview` locks. Sets `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` ONLY if parent course is free (`is_paid === false`), otherwise `Cache-Control: private, no-store`.
- `POST /api/progress` — Validates `{ lesson_id: string; is_completed?: boolean; best_quiz_score?: number }` and responds `{ ok: true, local: true }` cleanly so client components persist progress locally in `localStorage["cs_portal_progress"]`.

## 3. Module Layout
- **Core & Config:** `package.json`, `next.config.ts`, `tsconfig.json`, `src/types/database.ts`, `src/lib/config.ts`, `ARCHITECTURE.md`, `.env.example`, `.gitignore`
- **Data & API Layer:** `src/lib/data.ts`, `src/app/api/interactives/[id]/route.ts`, `src/app/api/progress/route.ts`
- **Core UI & Pages:** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/courses/[slug]/page.tsx`, `src/components/layout/*`, `src/components/course/*`
- **Lesson Study Engine:** `src/app/courses/[slug]/[lessonId]/page.tsx`, `src/components/lesson/*`
- **Courses, Quizzes & Labs:** `src/lib/mock-data.ts`, `content/labs/*.html`
- **CI/CD & Docs:** `.github/workflows/ci.yml`, `vercel.json`, `README.md`

## 4. Security & Performance Rules
1. Never inline `html_content` in course/lesson page payloads; lazy-load via `/api/interactives/[id]` only after the student clicks the Lab tab.
2. Render interactive HTML ONLY inside `<iframe srcDoc={...} sandbox="allow-scripts" ... />` (NO `allow-same-origin`, NO `dangerouslySetInnerHTML`).
3. Validate external URLs (`http:` / `https:` only) before rendering links or external iframes.
4. All interactive HTML labs must be single-file, zero-external-dependency, dark-themed (`#020617` / `#0f172a`), mobile responsive, and `< 150KB`.
5. Never commit `.env.local`.
