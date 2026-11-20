# بوابة حاسبات — CS Portal

> **منصة مذاكرة تفاعلية لطلبة حاسبات ومعلومات** — شروحات فيديو، ملخصات بالأكواد ومعادلات الرياضة (KaTeX)، معامل HTML تفاعلية لمحاكاة الخوارزميات، وكويزات فورية بالتفسير.
>
> **100% Free, Standalone, Zero-DB Arabic-First CS Learning Portal** — Built with Next.js 16, TypeScript, Tailwind CSS v4, KaTeX, and sandboxed single-file interactive HTML labs. Deploys straight to **GitHub + Vercel** with **zero external database, zero API keys, and $0/month hosting cost**.

---

## نظرة عامة والمعمارية | Overview & Architecture Highlights

| Layer | Technology / Pattern |
| --- | --- |
| **Framework** | Next.js 16 (App Router + Turbopack) + TypeScript + Tailwind CSS v4 |
| **Zero-DB Standalone Hosting** | Runs 100% standalone on **GitHub + Vercel** — no external database, no auth backend, no pausing, and zero required secrets |
| **UI & Typography** | RTL-first Arabic UI (`Cairo`) + Dark Slate theme (`#020617` / `#0f172a`), strict `dir="ltr"` for code blocks (`JetBrains Mono`) and KaTeX math |
| **Local Progress & Student Profile** | Instant browser persistence via `localStorage`: lesson completion & best quiz scores (`cs_portal_progress`) + optional student profile (`cs_portal_profile` at `/login`) |
| **Interactive Labs Security** | Single-file HTML labs (`content/labs/*.html`) lazy-loaded via `GET /api/interactives/[id]` and rendered strictly inside `<iframe srcDoc={...} sandbox="allow-scripts" />` (never `allow-same-origin`, never `dangerouslySetInnerHTML`) |
| **Built-In Content** | 3 CS courses (Data Structures, Algorithms, Operating Systems with free preview + paywall UX), 7 rich Markdown/KaTeX lessons, 2 interactive HTML labs (Binary Search & Sorting Visualizer), and 16 CS quiz questions |
| **Future DB Drop-In Ready** | All pages read exclusively through `src/lib/data.ts` — plug in any database (PostgreSQL, Turso, Neon, Supabase, etc.) later by updating one file without touching UI components |

---

## 1. التشغيل المحلي الفوري | Instant Local Quickstart

لا تحتاج إلى أي قاعدة بيانات أو مفاتيح API — شغّل المشروع في ثانيتين:

```bash
npm install
npm run dev
```

افتح المتصفح على: **[http://localhost:3000](http://localhost:3000)**

- تصفح المواد حسب الفرقة والترم من الصفحة الرئيسية (`/`).
- افتح أي درس لمشاهدة الفيديو، قراءة الملخص بالأكواد ومعادلات الرياضة، تجربة المعمل التفاعلي (Lab)، وحل الكويز الفوري.
- خصّص اسمك وفرقتك وقسمك في 5 ثوانٍ من صفحة **ملف الطالب** (`/login`) وتابع إنجازك ومتوسط درجاتك في **مذاكرتي** (`/dashboard`).

---

## 2. النشر المجاني على GitHub + Vercel | Free GitHub + Vercel Deployment

### أ) الرفع إلى GitHub وتفعيل CI
1. أنشئ مستودعًا على GitHub وارفع الكود باستخدام نظام الفروع الموصى به (`dev` للتطوير → `main` للإنتاج):
   ```bash
   git push -u origin main
   git checkout -b dev
   git push -u origin dev
   ```
2. ملف `.github/workflows/ci.yml` يعمل تلقائيًا عند كل `push` أو `pull_request` على `main` و `dev` باستخدام **Node 24** ويتحقق من:
   - `npm ci`
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm run build`

### ب) النشر على Vercel بضغطة زر
1. افتح [Vercel](https://vercel.com/new) واختر مستودع GitHub الخاص بالمشروع.
2. سيتعرف Vercel تلقائيًا على **Next.js 16** وملف `vercel.json` (الذي يفعّل ترويسات الأمان `X-Content-Type-Options` و `X-Frame-Options` و `Referrer-Policy` و `Permissions-Policy` بدون التأثير على YouTube أو المعامل التفاعلية).
3. *(اختياري)* أضف متغير بيئة واحد فقط لروابط المشاركة (OpenGraph):
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app`
4. اضغط **Deploy**:
   - فرع `main` ينشر تلقائيًا على **Production**.
   - فرع `dev` وأي Pull Request ينشئ رابط **Preview** تلقائي للمراجعة قبل الدمج.

---

## 3. حفظ التقدم وملف الطالب محليًا | Local Persistence (`localStorage`)

تعمل المنصة بالكامل بدون تسجيل دخول إجباري أو خوادم خارجية عبر مفتاحين منظمين في المتصفح:

- **`cs_portal_progress`**: يحفظ لكل درس حالة الإكمال (`is_completed`) وأعلى درجة في الكويز (`best_quiz_score`)، مع مزامنة فورية داخل نفس التبويب وبين التبويبات المفتوحة.
- **`cs_portal_profile`**: يحفظ بيانات ملف الطالب الاختيارية من صفحة `/login` (`full_name`, `year_level`, `department`) لعرض ترحيب مخصص في الشريط العلوي ولوحة **مذاكرتي** (`/dashboard`).

---

## 4. إضافة معمل HTML تفاعلي جديد | Adding a Single-File Interactive HTML Lab

تستطيع إضافة أي محاكي خوارزميات أو معمل تفاعلي جديد كملف HTML واحد مستقل في دقائق:

### قواعد المعمل المثالي (Lab Checklist)
- ملف HTML واحد مستقل تمامًا (HTML + CSS + JS داخل نفس الملف، بدون أي مكتبات أو CDNs خارجية).
- تصميم داكن متناسق مع المنصة (`#020617` / `#0f172a`، وألوان `indigo` / `emerald`).
- متجاوب مع الموبايل وحجمه أقل من **150KB**.
- يُعرض تلقائيًا داخل `<iframe srcDoc={...} sandbox="allow-scripts" />` معزول وآمن تمامًا.

### خطوات الإضافة
1. أنشئ ملف المعمل داخل `content/labs/my-new-lab.html` (مثل `content/labs/binary-search-lab.html` و `content/labs/sorting-visualizer-lab.html`).
2. أضف كود المعمل في `src/lib/mock-data.ts` داخل مصفوفة `MOCK_INTERACTIVES` واربطه بمعرّف الدرس `lesson_id` (`source_type: "html_code"`، مع إمكانية استخدام `source_type: "external_url"` للروابط الخارجية الموثوقة).
3. ادفع التغيير إلى GitHub (`git push`) وسيُبنى وينشر تلقائيًا على Vercel خلال ثوانٍ!

---

## 5. إضافة مواد ودروس وكويزات جديدة | Adding Courses, Lessons & Quizzes

كل المحتوى مُعرّف بأنواع TypeScript صارمة (`src/types/database.ts`) داخل `src/lib/mock-data.ts`:
- **`MOCK_COURSES`**: أضف المادة (العنوان، `slug`، الفرقة `year_level`، الترم `term`، الوصف، و`is_paid`).
- **`MOCK_LESSONS`**: أضف الدروس مع `section_title`، معرف فيديو YouTube (`video_id`)، ملخص `summary_md` يدعم Markdown + أكواد C++/Python + معادلات KaTeX (`$...$` و `$$...$$`)، ومصادر خارجية `resources`.
- **`MOCK_QUESTIONS`**: أضف أسئلة اختيار من متعدد مع `code_snippet` اختياري وشرح `explanation` للإجابة.

---

## 6. إضافة قاعدة بيانات مستقبلًا (اختياري) | Future Database Drop-In

صُممت المنصة بطبقة فصل نظيفة في **`src/lib/data.ts`**:
- جميع صفحات التطبيق تستدعي الدوال الست الموحدة فقط (`getCurrentUser`, `getPublishedCourses`, `getCourseDetailBySlug`, `getLessonPageData`, `getDashboardData`, `getInteractiveById`).
- عندما تقرر لاحقًا إضافة قاعدة بيانات (PostgreSQL / Neon / Turso / Supabase) أو حسابات سحابية أو اشتراكات مدفوعة، يكفي استبدال التنفيذ داخل `src/lib/data.ts` و `src/app/api/progress/route.ts` و `src/app/api/interactives/[id]/route.ts` بدون تعديل صفحات الواجهة.

---

## هيكل المشروع | Project Structure

```text
├── .github/workflows/
│   └── ci.yml                     # Node 24 CI (tsc, lint, build)
├── content/labs/
│   ├── binary-search-lab.html     # Single-file interactive Binary Search lab
│   └── sorting-visualizer-lab.html# Single-file interactive Sorting Visualizer lab
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home & course catalog with filters
│   │   ├── login/page.tsx         # Local student profile setup (ملف الطالب)
│   │   ├── dashboard/page.tsx     # Study progress dashboard (مذاكرتي)
│   │   ├── courses/[slug]/        # Course syllabus & lesson study workspace
│   │   └── api/                   # Lazy-loaded interactives & progress API
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, Student Profile Form
│   │   ├── course/                # Course cards, filters, curriculum, dashboard
│   │   └── lesson/                # Video player, Markdown/KaTeX, Lab sandbox, Quiz
│   ├── lib/
│   │   ├── config.ts              # Site metadata & academic years/terms
│   │   ├── data.ts                # Data access boundary (zero-DB, future DB ready)
│   │   └── mock-data.ts           # Courses, lessons, HTML labs & quiz bank
│   └── types/database.ts          # Shared TypeScript contracts
├── vercel.json                    # Security headers (YouTube & srcDoc safe)
└── .env.example                   # Optional site URL template
```

---

## الأوامر المتاحة | Available Scripts

```bash
npm run dev       # Start local development server (Turbopack)
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint
npx tsc --noEmit  # Run TypeScript strict type checking
```
