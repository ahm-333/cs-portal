<div align="center">

# Ahmed Amir Ahmed — بوابة حاسبات | CS Portal

### مساحة مذاكرة هندسية منظمة لطلبة الحاسبات والذكاء الاصطناعي — جامعة الزقازيق
*An Arabic-First, Warm Editorial Engineering Study Platform for Computer Science & AI Students*

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Standalone Zero-DB](https://img.shields.io/badge/Architecture-Standalone_Zero--DB-1D6B52?style=flat-square)](#)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel_Ready-1E355C?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## نظرة عامة | Overview

**بوابة حاسبات (CS Portal)** هي منصة مذاكرة عربية منظمة صُمّمت خصيصًا لطلبة كليات الحاسبات والذكاء الاصطناعي؛ تجمع بين الشرح المرئي المقسّم إلى فصول، المحاكيات والمعامل التفاعلية المعزولة، خريطة موقع المادة، الملخصات المكتوبة بـ Markdown ومعادلات KaTeX وأكواد LTR النظيفة مع جداول الـ Cheat Sheet، والكويزات الفورية المربوطة ببنك الأخطاء — كل ذلك في تجربة **Warm Editorial Navy** هادئة، بدون قاعدة بيانات خارجية وبجاهزية فورية للنشر المجاني على **GitHub + Vercel**.

**CS Portal** is a standalone, zero-database, RTL-first Arabic engineering study portal built with **Next.js 16 App Router**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Every student's progress, notes, exam planner, mistake bank, and course activations persist locally with instant cross-tab sync and one-click JSON backup/restore — requiring **$0/month hosting** and **zero required environment variables**.

---

## أبرز مميزات التجربة | Warm Editorial Navy UX Highlights

### 1. الصفحة الرئيسية التفاعلية | Cinematic Landing (`/`)
- **3D Desk Scrollytelling Cinema (`#desk-assembly`)**: عرض سينمائي متدرّج من 5 مراحل يجمع 4 لقطات متطابقة الإطار (`/images/desk/frame-0.jpg` → `frame-3.jpg`) يحوّل فوضى ملفات المذاكرة المتناثرة إلى مكتب هندسي منظم، مع تجربة خطوات تفاعلية سلسة على الموبايل.
- **5 Expanding Interactive Tool Strips (`#interactive-showcase`)**: شرائط تحريرية قابلة للتوسّع تتيح تجربة أدوات المنصة الخمس مباشرةً قبل الدخول:
  1. مشغل محاضرات بالفصول والتحكم بالسرعة (`1.0x` / `1.5x` / `2.0x`).
  2. محاكي **Linked List** حيّ (`+ Push Head`) بعقد متحركة واتجاه `dir="ltr"`.
  3. معاينة خريطة **موقع المادة** (Modules 01–03).
  4. ملخصات مع كود `C++` قابل للنسخ بنقرة واحدة.
  5. كويز فوري مع احتفال `canvas-confetti` عند الإجابة الصحيحة.
- **Reality Switch (`#compare`)**: مفتاح مقارنة حيّ بين *المذاكرة التقليدية* و*المذاكرة مع Ahmed Amir Ahmed* يحدّث مؤشرات وقت البحث، عمق الفهم، والجاهزية للامتحان (`22% ↔ 94%`).
- **Kinetic CS Marquee + Instructor Brand Card + Clean Editorial Footer**: شريط مصطلحات حاسبات متواصل، بطاقة المحاضر (`AI · Zagazig Univ.`) وروابط التواصل، وتجربة ليلية/نهارية متكاملة (`Light` / `Dark`).

### 2. مكتبة المقررات وأدوات الإنتاجية | Courses Hub (`/courses`)
- **Corner-Fold Editorial Blueprint Cards (Style C)**: بطاقات مواد هندسية بطيّة زاوية، شبكة خلفية دقيقة، أيقونات تفاعلية، مؤشر إنجاز مباشر لكل مادة، وحالة المادة (مجاني / مدفوع مع الدرس الأول مجاني للمعاينة).
- **Exam Countdown & Daily Target Planner**: اختيار تاريخ الامتحان مع حساب تلقائي للأيام المتبقية وعدد الدروس المطلوب مذاكرتها يوميًا.
- **Mistake Bank (بنك الأخطاء)**: يجمع الأسئلة التي أخطأت فيها تلقائيًا أو حفظتها يدويًا لمراجعتها بسرعة قبل الامتحان.
- **Compact Pomodoro Timer (`25:00`)**: مؤقت تركيز مدمج في الشريط العلوي مع تشغيل/إيقاف/إعادة ضبط وتنبيه صوتي لطيف.
- **Global Command Palette (`Ctrl+K` / `Cmd+K`)**: بحث فوري خفيف عبر جميع المقررات والدروس باستخدام `/api/search-index`.
- **JSON Backup & Restore**: تصدير واستيراد نسخة احتياطية كاملة لتقدّمك، ملاحظاتك، وبنك أخطائك في ثانية واحدة.

### 3. مساحة المذاكرة ذات الأدوات الخمس | 5-Tool Study Workspace (`/courses/[slug]` & `/courses/[slug]/[lessonId]`)
1. **فيديوهات الشرح (Video Chapters)**: مشغل YouTube/Bunny آمن مع فصول زمنية، لوحة شرح مرئية، وتغيير سرعة العرض.
2. **الشرح التفاعلي (Sandboxed Interactive Labs)**: محاكيات مدمجة (`Linked List`, `Binary Search`, `CPU Scheduling FCFS/SJF`) بالإضافة إلى معامل HTML مستقلة تُحمّل كسولًا عبر `/api/interactives/[id]` وتُعرض داخل `<iframe srcDoc={...} sandbox="allow-scripts" />` معزول تمامًا.
3. **موقع المادة (Course Website Map)**: خريطة وحدات المادة ومصادرها الخارجية الموثّقة (`http:` / `https:`).
4. **الملخصات والأكواد والـ Cheat Sheets**: عرض Markdown كامل + معادلات **KaTeX** + إبراز أكواد **LTR** مع زر نسخ + نصيحة الامتحان + جدول مرجعي سريع (`CheatSheet`).
5. **الكويزات الفورية (Instant Quizzes)**: أسئلة اختيار من متعدد بالتفسير، حفظ أعلى درجة، وإضافة تلقائية للأخطاء إلى **بنك الأخطاء**.

**أدوات التركيز الإضافية داخل مساحة المذاكرة:**
- **وضع ليلة الامتحان (Exam-Night Cram Mode)**: شاشة مراجعة مركّزة بضغطة واحدة (Cheat Sheet + نصيحة الامتحان + الكود الأساسي).
- **نوتس الدرس (Auto-Saved Lesson Notes)**: درج ملاحظات خاص بكل درس يُحفظ تلقائيًا لحظة بلحظة مع زر نسخ سريع.
- **وضع التركيز (Focus Mode)**: إخفاء القائمة الجانبية على الشاشات الكبيرة وتوسيع مساحة المذاكرة بالكامل.
- **تفعيل المقررات المدفوعة (Paid Course Activation)**: معاينة مجانية للدرس الأول + نافذة تفعيل بكود المقرر (مثال للتجربة: `AI2026` لمقرر نظم التشغيل `CS-311`).

---

## خريطة المسارات | Route Map

| Route | Purpose |
| --- | --- |
| `/` | Warm Editorial Landing Page (3D Desk Scrollytelling Cinema, 5 Expanding Strips, Reality Switch, Instructor Card) |
| `/courses` | Courses Library Hub, Student Welcome Banner, Exam Countdown Planner, Mistake Bank, Smart RTL Filters, Pomodoro, Backup/Restore |
| `/courses/[slug]` | Opens directly into the Course's 5-Tool Study Workspace (defaulting to the first available/preview lesson) |
| `/courses/[slug]/[lessonId]` | Deep-linked Lesson Study Workspace (Video, Interactive Lab, Site Map, Markdown/KaTeX/Cheat Sheet, Quiz, Cram Mode, Notes, Focus Mode) |
| `/login` | 5-second Local Student Profile setup (`Name`, `Year 1–4`, `CS / AI / IS / IT`) — saved locally, no backend auth required |
| `/dashboard` | Server-side redirect (`redirect("/courses")`) preserving legacy links cleanly |
| `GET /api/search-index` | Lightweight cached (`s-maxage=3600`) search index of published courses and lessons for `Ctrl+K` Command Palette |
| `GET /api/interactives/[id]` | Lazy-loads sandboxed single-file HTML labs on demand while enforcing paid-course preview locks & safe cache headers |
| `POST /api/progress` | Validates lesson progress payloads and responds cleanly for local-first client persistence |

---

## المعمارية والتقنيات | Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js `16.4` (App Router + Turbopack) & React `19.3` |
| **Language** | TypeScript `5` (strict mode) |
| **Styling & Design System** | Tailwind CSS `v4` + Warm Editorial Navy CSS tokens (`Light` & `Dark`) |
| **Typography** | `Cairo` (Arabic UI), `Inter` (English labels), `JetBrains Mono` (LTR code & badges) via `next/font/google` |
| **Motion & Micro-interactions** | `gsap` + `ScrollTrigger`, `lenis`, `canvas-confetti`, `lucide-react` (with full `prefers-reduced-motion` guards) |
| **Math & Markdown** | `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `katex`, `react-syntax-highlighter` |
| **Client State** | Unified SSR-safe `useSyncExternalStore` (`cs_portal_state_v3` in `src/lib/stores/portalStore.ts`) + typed `CustomEvent` bus (`src/lib/stores/events.ts`) |
| **CI/CD & Hosting** | GitHub Actions CI (`.github/workflows/ci.yml`) + Zero-DB Vercel deployment (`vercel.json`) |

---

## التشغيل المحلي | Local Development

لا يتطلب المشروع أي قاعدة بيانات أو مفاتيح API — ابدأ التطوير فورًا:

```bash
# 1. Install dependencies
npm install

# 2. Run development server (Turbopack)
npm run dev
```

افتح المتصفح على: **[http://localhost:3000](http://localhost:3000)**

### أوامر التحقق والبناء | Verification & Build Scripts

```bash
npm run dev        # Start local dev server
npx tsc --noEmit   # Strict TypeScript check
npm run lint       # Run ESLint
npm run build      # Create optimized production build
npm run start      # Serve production build locally
```

---

## النشر المجاني بدون متغيرات بيئة | Zero-Env Vercel Deployment

1. ارفع المستودع إلى **GitHub** (يعمل مسار CI في `.github/workflows/ci.yml` تلقائيًا على فرعي `main` و `dev` للتحقق من `tsc` و `lint` و `build`).
2. افتح **[Vercel New Project](https://vercel.com/new)** واختر مستودع `cs-portal`.
3. لا توجد **أي متغيرات بيئة مطلوبة** لتشغيل المنصة — يعمل المشروع بالكامل بنمط **Standalone Zero-DB** وبإعدادات جاهزة في `vercel.json` (بما في ذلك منطقة `fra1` لسرعة استجابة عالية في مصر والشرق الأوسط وترويسات الأمان).
4. *(اختياري)* يمكنك إضافة `NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app` لضبط روابط OpenGraph والروابط القانونية (Canonical URLs).
5. اضغط **Deploy** — فرع `main` ينشر تلقائيًا على **Production**، وكل Pull Request أو فرع `dev` يُنشئ **Preview Deployment** تلقائيًا.

---

## إضافة مقرر أو معمل تفاعلي جديد | Contributing & Adding a New Course

جميع بيانات المقررات والدروس والكويزات مُعرّفة بأنواع صارمة في [`src/types/database.ts`](src/types/database.ts) وتُقرأ حصريًا عبر طبقة البيانات [`src/lib/data.ts`](src/lib/data.ts) مما يجعل إضافة مقرر جديد (أو ربط قاعدة بيانات مستقبلًا) عملية نظيفة ومنظمة:

### 1. إضافة مقرر جديد | Add a Course
افتح [`src/lib/mock-data.ts`](src/lib/mock-data.ts) وأضف عنصرًا جديدًا في:
- **`MOCK_COURSES`**: حدّد `id`, `slug`, `code` (مثل `CS-215`), `title`, `title_en`, `year_level`, `term`, `accent`, `icon`, `duration_minutes`, `site_url`, `exam_tip`, `cheat_sheet`, `lab_type`, `lab_title`, `lab_hint` واختياريًا `is_paid` + `unlock_code`.
- **`MOCK_LESSONS`**: أضف الدروس المرتبطة بـ `course_id` مع `video_id`, `chapters` (الفصول الزمنية), `summary_md` (يدعم Markdown + أكواد LTR + معادلات KaTeX `$...$` و `$$...$$`), `key_code`, `exam_tip`, و `resources`.
- **`MOCK_QUESTIONS`**: أضف أسئلة الكويز مع `code_snippet` اختياري وتفسير `explanation` للإجابة.

### 2. إضافة معمل HTML تفاعلي | Add a Sandboxed Interactive Lab
1. أنشئ ملف HTML واحد مستقل في `content/labs/<your-lab>.html` (HTML + CSS + JS في ملف واحد، بدون CDNs خارجية، متجاوب مع الموبايل، وحجمه أقل من **150KB**).
2. أضف المعمل في `MOCK_INTERACTIVES` داخل [`src/lib/mock-data.ts`](src/lib/mock-data.ts) واربطه بـ `lesson_id`.
3. يُحمّل المعمل تلقائيًا عند فتح تبويب **الشرح التفاعلي** عبر `GET /api/interactives/[id]` ويُعرض داخل `<iframe srcDoc={...} sandbox="allow-scripts" />` معزول وآمن تمامًا.

---

## المزيد من التفاصيل المعمارية | Architecture Documentation

لمراجعة تفاصيل نظام التصميم، بنية الـ Store الموحّد (`portalStore.ts` + `events.ts`)، قواعد الأمان، وهيكلة الملفات بالكامل، راجع ملف **[ARCHITECTURE.md](ARCHITECTURE.md)**.

---

<div align="center">

**Built with care by Ahmed Amir Ahmed · AI · Zagazig University**
*مبادرة طلابية مفتوحة — من طلاب لطلاب*

</div>
