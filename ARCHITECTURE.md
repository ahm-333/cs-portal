# CS Portal — Architecture & Engineering Specification

This document describes the architecture, design system, state management, API contracts, security invariants, and multi-agent engineering workflow of **Ahmed Amir Ahmed — CS Portal (بوابة حاسبات)**.

---

## 1. System Philosophy & Tech Stack

- **Framework:** Next.js `16.4` (App Router + Turbopack) + React `19.3` + TypeScript `5` (strict) + Tailwind CSS `v4`.
- **Standalone Zero-DB Model:** Runs 100% standalone on **GitHub + Vercel** with zero external database, zero backend auth service, and zero required environment variables.
- **Database Drop-In Boundary:** All Server Components and API routes read content exclusively through `src/lib/data.ts`. Swapping in PostgreSQL, Neon, Turso, or Supabase later requires updating only `src/lib/data.ts` and API route handlers without touching UI components.
- **Next.js 16 Convention:** Dynamic route `params` and `searchParams` are async Promises and must always be awaited (`const { slug } = await params`).

---

## 2. Warm Editorial Navy Design System

Defined in `src/app/globals.css`, `src/app/layout.tsx`, and `src/components/layout/themeStore.ts`:

### Palette & Theme Tokens
- **Light Mode (`:root` / `[data-theme="light"]`):**
  - Surfaces: `--bg-canvas: #f6f5f1`, `--bg-surface: #ffffff`, `--bg-subtle: #eeece5`, `--bg-hover: #f2f0ea`
  - Borders: `--border-soft: #e5e2d9`, `--border-strong: #d2cec2`
  - Ink: `--text-primary: #171c26`, `--text-secondary: #535c6b`, `--text-muted: #7f8896`
  - Brand & Accents: `--brand-primary: #1e355c`, `--accent-warm: #c25e33`, `--success-fg: #1d6b52`, `--hero-bg: #182947 → #0f1c32`
- **Dark Mode (`html.dark` / `[data-theme="dark"]` + Tailwind v4 `@custom-variant dark`):**
  - Surfaces: `--bg-canvas: #0f1319`, `--bg-surface: #161c24`, `--bg-subtle: #1e2631`, `--bg-hover: #232c38`
  - Brand & Accents: `--brand-primary: #7ca7f0`, `--accent-warm: #e58a62`, `--success-fg: #66c7a6`, `--hero-bg: #152238 → #0c1524`
- **Anti-Flash Bootstrap:** `src/app/layout.tsx` executes an inline pre-hydration script reading `localStorage.getItem("cs_portal_theme")` (default `"light"`) and syncing `html.classList` (`dark`) and `html.dataset.theme` before first paint.
- **Backward-Compatibility Aliases:** Legacy token aliases (`--bg`, `--paper`, `--ink`, `--muted`, `--line`, `--accent`, `--signal`, etc.) map directly onto the Warm Editorial tokens so older helper components remain consistent.

### Typography & Strict RTL/LTR Isolation
- Root `<html lang="ar" dir="rtl">` using `next/font/google`:
  - `--font-cairo` (`Cairo`, weights 400–900) for Arabic editorial UI.
  - `--font-inter` (`Inter`, weights 400–800) for English technical labels (`.font-en`).
  - `--font-jetbrains-mono` (`JetBrains_Mono`, weights 400–600) for code, indices, and badges (`.font-mono-code`).
- **Strict LTR Rule:** All `pre`, `code`, `kbd`, `samp`, `.code-ltr`, `.katex`, and `.katex-display` elements enforce `direction: ltr; unicode-bidi: isolate;` so code and math never break inside RTL paragraphs.

### Motion Architecture (`src/components/layout/MotionEffects.tsx`)
- Renders `#scrollProgressBar` at the top viewport edge.
- Syncs `Lenis` smooth scrolling with `gsap` + `ScrollTrigger` (completely skipped when `prefers-reduced-motion: reduce` is active) and tears down listeners cleanly on unmount.
- Delegates pointer tracking for `.spotlight-card` (`--mx`, `--my`) and subtle `.magnetic-btn` pull effects.
- Per-view layout ownership: `layout.tsx` mounts `<MotionEffects />` and `<ToastProvider>{children}<GlobalModalsHost /></ToastProvider>`, while each view (`/`, `/courses`, `/courses/[slug]`) renders its own tailored `.topbar-shell` and `<Footer />`.

---

## 3. Unified Client Store & Event Bus

### `src/lib/stores/portalStore.ts`
A single SSR-safe `useSyncExternalStore` store backed by `localStorage["cs_portal_state_v3"]`:

```ts
export interface PortalState {
  profile: { name: string; year: number; dept: "CS" | "AI" | "IS" | "IT"; saved: boolean };
  completedLessons: string[];
  quizScores: Record<string, number>;
  notes: Record<string, string>;
  mistakes: Array<{ courseId: string; courseCode: string; lessonId?: string; q: string; ansText: string }>;
  unlockedCourses: string[];
  examDate: string; // YYYY-MM-DD (defaults to today + 5 days)
}
```

- **Zero-Hydration-Mismatch SSR:** Uses an immutable frozen `SERVER_SNAPSHOT` on the server and memoized raw-string parsing on the client.
- **Automatic Legacy Migration & Mirroring:** Transparently migrates legacy keys (`cs_portal_progress`, `cs_portal_profile`, `cs_portal_progress_v2`, `cs_portal_extras_v2`) into `cs_portal_state_v3` on first read and mirrors profile/progress back to legacy keys for backward compatibility.
- **Live Cross-Tab & Same-Tab Sync:** Synchronizes via `window` event `cs-portal-state-v3-updated` within the active tab and native `storage` events across tabs.
- **Portable Backup:** Exposes `exportPortalBackupJson()` and `importPortalBackupJson(rawJson)` with full schema sanitization.

### `src/lib/stores/events.ts`
Typed `CustomEvent` bus decoupling trigger buttons across pages from `ToastProvider` and `GlobalModalsHost`:
- `PORTAL_EVENTS.TOAST` (`cs-portal-toast`) → `emitToast(message)`
- `PORTAL_EVENTS.OPEN_CMDK` (`cs-portal-open-cmdk`) → `openCommandPalette()`
- `PORTAL_EVENTS.OPEN_PROFILE` (`cs-portal-open-profile`) → `openProfileModal()`
- `PORTAL_EVENTS.OPEN_MISTAKES` (`cs-portal-open-mistakes`) → `openMistakeBankModal()`
- `PORTAL_EVENTS.OPEN_FEEDBACK` (`cs-portal-open-feedback`) → `openFeedbackModal()`
- `PORTAL_EVENTS.OPEN_UNLOCK` (`cs-portal-open-unlock`) → `openUnlockModal({ courseId, courseTitle, courseCode, unlockCode })`

---

## 4. Application Views & Module Map

### Landing & Scrollytelling (`src/app/page.tsx` + `src/components/landing/*`)
- `LandingTopbar.tsx` — Auto-hides (`.topbar-hidden`) while inside `#desk-assembly`, reveals smoothly once past the 3D cinema.
- `DeskScrollytellingCinema.tsx` — `480vh` sticky desktop cinema (`requestAnimationFrame` cross-fade across `/images/desk/frame-0.jpg`..`frame-3.jpg`, 5 stages, 4 chaos chips, 4 floating feature pop cards) + responsive mobile stepper.
- `ExpandingToolsStrips.tsx` — 5 horizontal expanding editorial strips with live mini-demos (video chapters, `dir="ltr"` Linked List toy, course map preview, C++ copyable snippet, instant quiz + `canvas-confetti`).
- `CsMarqueeStrip.tsx`, `RealitySwitchSection.tsx`, `InstructorBrandCard.tsx`, `FinalCtaSection.tsx`.

### Courses Hub & Global Modals (`src/app/courses/page.tsx`, `src/components/course/*`, `src/components/modals/*`)
- `CoursesHubClient.tsx` — Sticky `.topbar-shell` with `Ctrl+K`, compact `PomodoroTimer.tsx`, theme toggle, and profile chip; `.hero-shell` personalized welcome + overall progress bar + JSON export/import; Productivity Strip (Exam Countdown & Daily Target Planner + Mistake Bank summary); Smart RTL search & year/price filters.
- `CourseCard.tsx` — Style C Corner-Fold Editorial Blueprint card (`.bp-course-card`, `.bp-fold-corner`, `.bp-course-icon`, live progress bar, free/paid/unlocked pills).
- `GlobalModalsHost.tsx` — Centralized listener for `PORTAL_EVENTS` + `Ctrl/Cmd+K` and `Escape`, hosting 5 modals: Command Palette (lazy `/api/search-index`), Profile Setup, Mistake Bank, Feedback/Suggest Course, and Paid Course Unlock (case-insensitive code verification + `canvas-confetti`).
- `/login` (`src/app/login/page.tsx`) — Dedicated 5-second local student profile setup page redirecting to `/courses`.
- `/dashboard` (`src/app/dashboard/page.tsx`) — Clean server redirect to `/courses`.

### 5-Tool Study Workspace (`src/app/courses/[slug]/page.tsx`, `src/app/courses/[slug]/[lessonId]/page.tsx`, `src/components/lesson/*`)
- `CourseWorkspaceClient.tsx` — Full workspace shell:
  - Sticky `.topbar-shell` with live course completion pill, `Ctrl+K`, **Exam-Night Cram Mode** toggle, **Auto-Saved Lesson Notes** drawer toggle, desktop **Focus Mode** toggle (`lg:col-span-12`), and theme switcher.
  - Course Hero Strip + lesson completion toggle (fires `canvas-confetti` at 100%) + 5-Tool Switcher Dock (`.tool-dock-pill`):
    1. **Video (`VideoPlayer.tsx`)** — Validated YouTube/Bunny embeds + interactive `lesson.chapters` markers, speed selector (`1.0x`/`1.5x`/`2.0x`), and visual board toggle.
    2. **Interactive Lab (`CourseInteractiveLab.tsx`)** — Built-in course simulators (`linked-list`, `binary-search`, `cpu-scheduling`) + lazy-loaded single-file HTML labs via `GET /api/interactives/[id]`.
    3. **Course Website Map** — Module breakdown (`course.site_url`, lesson tags, validated `http:`/`https:` external resources).
    4. **Summaries & Cheat Sheets (`MarkdownViewer.tsx`)** — Markdown + KaTeX + Prism LTR code blocks with copy buttons + Key Code + Exam Tip + `course.cheat_sheet` reference table.
    5. **Instant Quizzes (`QuizEngine.tsx`)** — Progress tracking, explanations, `saveQuizScore`, confetti celebration, automatic Mistake Bank capture (`addMistake`), and manual bookmarking.
  - Paid course lock card with seamless unlock modal flow (`openUnlockModal`) and immediate client-side unlock state.

---

## 5. Data Layer & API Contracts

All shared domain interfaces live in `src/types/database.ts`.

### Data Access Boundary (`src/lib/data.ts`)
```ts
export async function getCurrentUser(): Promise<CurrentUser | null>;
export async function getPublishedCourses(): Promise<CourseWithStats[]>;
export async function getCourseDetailBySlug(slug: string): Promise<CourseDetailData | null>;
export async function getLessonPageData(slug: string, lessonId: string): Promise<LessonPageData | null>;
export async function getDashboardData(): Promise<DashboardData>;
export async function getInteractiveById(id: string): Promise<LessonInteractive | null>;
export async function getSearchIndex(): Promise<SearchIndexItem[]>;
```

### API Routes
- `GET /api/search-index` — Returns `SearchIndexItem[]` (`{ type, title, sub, courseSlug, lessonId? }`) for the `Ctrl+K` Command Palette with `Cache-Control: public, s-maxage=3600`.
- `GET /api/interactives/[id]` — Lazy-loads a `LessonInteractive` (`html_content` or `external_url`) on demand when the student opens the Lab tab, respecting `is_paid && !is_free_preview` locks. Sets `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` only for free courses, and `private, no-store` for paid courses.
- `POST /api/progress` — Validates `{ lesson_id, is_completed?, best_quiz_score? }` and returns `{ ok: true, local: true }` cleanly for local-first persistence.

---

## 6. Security & Performance Invariants

1. **Strict Interactive Lab Isolation:** Never inline `html_content` in course or lesson page payloads; always lazy-load via `GET /api/interactives/[id]` when the Lab tab is opened.
2. **Sandboxed Iframes Only:** Render HTML lab code strictly inside `<iframe srcDoc={html} sandbox="allow-scripts" />`. **NEVER** add `allow-same-origin` to `srcDoc` lab iframes and **NEVER** use `dangerouslySetInnerHTML` for lab content.
3. **URL Sanitization:** Validate all external lesson resources, video embeds, and external lab URLs to allow only `http:` and `https:` protocols before rendering links or iframes.
4. **Standalone HTML Lab Budget:** Each file in `content/labs/*.html` must be self-contained (zero external CDNs), mobile responsive, and `< 150KB`.
5. **Security & Caching Headers:** `next.config.ts` and `vercel.json` enforce `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: SAMEORIGIN` (protecting against clickjacking while keeping sandboxed `srcDoc` iframes functional), and 1-year immutable caching for `/images/*`.
6. **Secrets & Repo Hygiene:** Never commit `.env.local`, build caches (`.next/`, `*.tsbuildinfo`), or scratch local PDFs (`.gitignore` excludes `*.pdf`).

---

## 7. Multi-Agent Engineering Workflow (8-Agent Swarm)

This redesign and production hardening was executed using a clean, file-isolated **8-Agent Swarm** architecture to avoid merge conflicts and guarantee end-to-end verification:

| Agent | Role | Exclusive Ownership |
| --- | --- | --- |
| **Agent 1 (`design-system`)** | Design System & Motion Architect | `globals.css`, `layout.tsx`, `themeStore.ts`, `MotionEffects.tsx`, `Footer.tsx`, `ToastProvider.tsx` |
| **Agent 2 (`data-stores`)** | Data, Stores & Contracts Engineer | `types/database.ts`, `lib/config.ts`, `lib/mock-data.ts`, `lib/data.ts`, `lib/stores/events.ts`, `lib/stores/portalStore.ts` |
| **Agent 3 (`landing-agent`)** | Landing & Scrollytelling Specialist | `app/page.tsx`, `components/landing/*` |
| **Agent 4 (`courses-agent`)** | Courses Hub, Productivity & Modals | `app/courses/page.tsx`, `app/dashboard/page.tsx`, `app/login/page.tsx`, `app/api/search-index/route.ts`, `CoursesHubClient.tsx`, `CourseCard.tsx`, `PomodoroTimer.tsx`, `ThemeSwitcher.tsx`, `GlobalModalsHost.tsx` |
| **Agent 5 (`workspace-agent`)** | Study Workspace & Interactive Labs | `app/courses/[slug]/*`, `CourseWorkspaceClient.tsx`, `CourseInteractiveLab.tsx`, `MarkdownViewer.tsx`, `VideoPlayer.tsx`, `QuizEngine.tsx`, `ReadingComfortBar.tsx` |
| **Agent 6 (`vercel-ops`)** | Vercel & Next.js Deployment Engineer | `next.config.ts`, `vercel.json`, `.env.example` |
| **Agent 7 (`github-ops`)** | GitHub Ops & Repo Commander | `.gitignore`, `README.md`, `ARCHITECTURE.md`, `.github/workflows/ci.yml` |
| **Agent 8 (`qa-verifier`)** | Build, Lint, Runtime & Security QA | Full `tsc`, `eslint`, `next build`, security/sandbox audit, and route smoke verification before commit & push |
