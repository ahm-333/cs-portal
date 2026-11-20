# بوابة حاسبات — CS Portal

> **منصة مذاكرة تفاعلية لطلبة حاسبات ومعلومات** — شروحات فيديو، ملخصات بالأكواد ومعادلات الرياضة (KaTeX)، معامل HTML تفاعلية لمحاكاة الخوارزميات، وكويزات فورية بالتفسير.
>
> **Interactive Arabic-first Computer Science Learning Portal** — Video lectures, Markdown + Syntax Highlighting + KaTeX math summaries, sandboxed single-file interactive HTML algorithm labs, quizzes with explanations, and progress tracking. Built to run **$0/month on Vercel + Supabase Free Tier**, with a built-in Phase 3 monetization architecture ready to activate anytime.

---

## نظرة عامة والمعمارية | Overview & Architecture Highlights

| Layer | Technology / Pattern |
| --- | --- |
| **Framework** | Next.js 16 (App Router, Turbopack, `src/proxy.ts`) + TypeScript + Tailwind CSS v4 |
| **UI & Typography** | RTL-first Arabic UI (`Cairo`) + Dark Slate theme (`#020617` / `#0f172a`), strict `dir="ltr"` for code blocks (`JetBrains Mono`) and KaTeX math |
| **Database & Auth** | Supabase PostgreSQL + Row Level Security (RLS) + Google / Email Auth via `@supabase/ssr` |
| **Zero-Config Demo Mode** | Automatic fallback to built-in mock courses, 2 interactive HTML labs, 12+ CS quizzes, and paywall preview when Supabase env vars are not set |
| **Interactive Labs Security** | Single-file HTML labs rendered strictly inside `<iframe srcDoc={...} sandbox="allow-scripts" />` (never `allow-same-origin`, never `dangerouslySetInnerHTML`) |
| **Free-Tier Egress Protection** | List & sidebar queries use explicit lightweight column projections (never selecting `summary_md` or `html_content`); lab HTML is lazy-loaded on demand via `GET /api/interactives/[id]` with CDN caching (`s-maxage=3600, stale-while-revalidate=86400`) for free courses and `private, no-store` for paid courses |
| **Free-Tier Keep-Alive** | Automated GitHub Action (`.github/workflows/supabase-keepalive.yml`) pings Supabase every 4 days so the Free Tier project never auto-pauses after 7 days of inactivity |
| **Phase 3 Paywall Ready** | Database schema, RLS enrollment checks, preview locks, and deferred migration (`002_paywall_phase3.sql`) with redeem codes & Bunny Stream video support |

---

## 1. التشغيل المحلي السريع | Local Quickstart (Demo Mode)

يمكنك تشغيل المنصة محليًا فورًا **بدون أي إعداد لـ Supabase** — ستعمل تلقائيًا بوضع التجربة (**Demo Mode**) مع 3 مواد، ومعملين تفاعليين (Binary Search و Sorting Visualizer)، وكويزات كاملة، ومعاينة لقفل الكورسات المدفوعة:

```bash
npm install
npm run dev
```

افتح المتصفح على: **[http://localhost:3000](http://localhost:3000)**

> **ملاحظة:** لتشغيل وضع Supabase الحقيقي محليًا، انسخ ملف `.env.example` إلى `.env.local` وأضف بيانات مشروعك (لا تقم برفع `.env.local` إلى Git أبدًا).
>
> ```bash
> cp .env.example .env.local
> ```

---

## 2. إعداد Supabase المجاني في دقيقتين | 2-Minute Supabase Free Setup

1. **إنشاء المشروع (Create Project):**
   - سجّل دخولك إلى [Supabase Dashboard](https://supabase.com/dashboard) وأنشئ مشروعًا جديدًا على الباقة المجانية (Free Tier).

2. **إنشاء الجداول وسياسات الحماية (Run Schema Migration):**
   - افتح **SQL Editor** → **New Query**.
   - انسخ محتوى الملف `supabase/migrations/001_init_schema.sql` بالكامل واضغط **Run**.
   - هذا ينشئ الجداول (`profiles`, `courses`, `lessons`, `lesson_interactives`, `questions`, `user_progress`, `enrollments`)، الـ Indexes، الـ Trigger التلقائي لإنشاء `profile` عند التسجيل، وسياسات **Row Level Security (RLS)**.

3. **إضافة البيانات الأولية والمعامل (Seed Initial Courses & Labs):**
   - افتح Query جديدة في **SQL Editor**.
   - انسخ محتوى `supabase/seed/seed.sql` واضغط **Run**.
   - السكربت يستخدم `ON CONFLICT DO NOTHING` لذلك يمكن إعادة تشغيله بأمان.

4. **نسخ مفاتيح الـ API إلى `.env.local`:**
   - من **Project Settings → API** انسخ:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ضعها في `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     ```

5. **تفعيل تسجيل الدخول بـ Google وإعداد روابط التحويل (Google Auth & Redirect URLs):**
   - اذهب إلى **Authentication → Providers → Google** وفعّله بإضافة `Client ID` و `Client Secret` من Google Cloud Console.
   - اذهب إلى **Authentication → URL Configuration**:
     - **Site URL:** `https://<your-production-domain>.vercel.app` (أو `http://localhost:3000` أثناء التطوير).
     - **Redirect URLs (أضف كليهما):**
       - `http://localhost:3000/auth/callback`
       - `https://<your-production-domain>.vercel.app/auth/callback`
       - (اختياري لبيئات الـ Preview): `https://*-<your-vercel-scope>.vercel.app/auth/callback`

---

## 3. إعداد GitHub والـ CI والـ Keep-Alive | GitHub Setup

### أ) نظام الفروع الموصى به (Branch Flow: `dev` → `main`)
- **`dev`**: فرع التطوير اليومي وإضافة الدروس والمعامل الجديدة (يُنشئ تلقائيًا Preview URL على Vercel).
- **`main`**: فرع الإنتاج (Production) — ادمج فيه عبر Pull Request بعد نجاح فحوصات CI.

```bash
git checkout -b dev
git push -u origin dev
```

### ب) فحص الجودة التلقائي (CI Workflow)
ملف `.github/workflows/ci.yml` يعمل تلقائيًا عند كل `push` أو `pull_request` على `main` و `dev` باستخدام **Node 24** وينفّذ:
1. `npm ci`
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build` (يعمل بسلاسة حتى لو لم تُضف أسرار Supabase بعد عبر قيم fallback آمنة لوضع Demo Mode).

### ج) منع توقف Supabase المجاني تلقائيًا (Supabase Keep-Alive)
ملف `.github/workflows/supabase-keepalive.yml` يرسل طلب `GET` خفيف جدًا (`courses?select=id&limit=1`) كل **4 أيام** (`0 8 */4 * *`) لضمان عدم توقف قاعدة البيانات بعد 7 أيام خمول.

لتفعيله، افتح في مستودع GitHub:
**Settings → Secrets and variables → Actions → New repository secret** وأضف:

| Secret Name | Value | Required For |
| --- | --- | --- |
| `SUPABASE_URL` | `https://<project-id>.supabase.co` | `supabase-keepalive.yml` |
| `SUPABASE_ANON_KEY` | Your Supabase `anon public` key | `supabase-keepalive.yml` |
| `NEXT_PUBLIC_SUPABASE_URL` *(اختياري)* | Same as `SUPABASE_URL` | Optional live CI build |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(اختياري)* | Same as `SUPABASE_ANON_KEY` | Optional live CI build |

> يمكنك تجربة Keep-Alive فورًا من تبويب **Actions → Supabase Keep-Alive → Run workflow**. إذا لم تُضف الأسرار بعد، ينجح الـ Workflow برسالة تنبيه لطيفة بدون فشل.

---

## 4. النشر على Vercel | Vercel Deployment Guide

1. ادخل إلى [Vercel](https://vercel.com/new) واربط مستودع GitHub الخاص بالمشروع.
2. سيتعرف Vercel تلقائيًا على Next.js 16 وملف `vercel.json` (الذي يضيف ترويسات الأمان مثل `X-Content-Type-Options` و `X-Frame-Options` و `Referrer-Policy` و `Permissions-Policy` بدون التأثير على YouTube أو المعامل التفاعلية).
3. أضف متغيرات البيئة في **Project Settings → Environment Variables**:

   | Variable | Production (`main`) | Preview (`dev` / PRs) |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-id>.supabase.co` | Same (or staging Supabase project) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase `anon public` key | Same (or staging key) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Leave unset or set preview URL |

4. اضغط **Deploy**:
   - كل دمج في `main` ينشر تلقائيًا على **Production**.
   - كل `push` على `dev` أو Pull Request ينشئ رابط **Preview** مستقل للمراجعة قبل النشر.
5. لا تنسَ إضافة رابط الإنتاج النهائي `https://<your-domain>.vercel.app/auth/callback` داخل **Supabase → Authentication → URL Configuration → Redirect URLs**.

---

## 5. إضافة معمل HTML تفاعلي جديد في 10 ثوانٍ | Add a Single-File Interactive Lab in 10 Seconds

تتيح المنصة إضافة أي محاكي خوارزميات أو معمل تفاعلي كملف HTML واحد (Single-File HTML/CSS/JS) بدون تعديل أي كود في Next.js!

### قواعد المعمل المثالي (Lab Checklist)
- ملف HTML واحد مستقل (CSS + JS داخل نفس الملف بدون مكتبات خارجية غير موثوقة).
- تصميم داكن متناسق مع المنصة (`#020617` / `#0f172a`، وألوان `indigo` / `emerald`).
- متجاوب مع الموبايل (`viewport` و layout مرن) وحجمه أقل من **150KB**.
- يُعرض تلقائيًا داخل `<iframe sandbox="allow-scripts" />` معزول وآمن تمامًا.

### خطوات الإضافة (10 Seconds)
1. احفظ ملف المعمل اختياريًا في `content/labs/my-new-lab.html` للنسخ الاحتياطي داخل Git.
2. نفّذ هذا الأمر في **Supabase SQL Editor** (مع استبدال `LESSON_UUID` بمعرّف الدرس):

```sql
INSERT INTO public.lesson_interactives (
  lesson_id,
  title,
  description,
  order_index,
  source_type,
  html_content,
  default_height
)
VALUES (
  'LESSON_UUID_HERE',
  'محاكي مكدس التنفيذ (Stack Visualizer)',
  'جرّب عمليات Push و Pop وشاهد التغيّر خطوة بخطوة',
  1,
  'html_code',
  $lab_html$
  <!doctype html>
  <html lang="ar" dir="rtl">
    <!-- ضع كود ملف الـ HTML الكامل هنا -->
  </html>
  $lab_html$,
  540
);
```

> **بديل خارجي:** لو لديك معمل مستضاف على رابط خارجي موثوق، اضبط `source_type = 'external_url'` وضع الرابط في `external_url` مع ترك `html_content = NULL`.

---

## 6. تفعيل المرحلة الثالثة: الكورسات المدفوعة | Activating Phase 3 Paid Courses

البنية التحتية للدفع والاشتراكات جاهزة بالفعل ومحمية على مستوى قاعدة البيانات (RLS). لتفعيل الكورسات المدفوعة لاحقًا:

1. **تشغيل هجرة المرحلة الثالثة (Run Phase 3 Migration):**
   - في **Supabase SQL Editor** نفّذ الملف `supabase/migrations/002_paywall_phase3.sql`.
   - هذا يضيف جدولي `redeem_codes` و `payment_requests` مع سياسات RLS ودالة `redeem_course_code(p_code text)` الآمنة (`SECURITY DEFINER`) التي تتحقق من الكود وتفعّل اشتراك الطالب في معاملة واحدة (Atomic).

2. **تحويل أي كورس إلى مدفوع مع درس مجاني للمعاينة:**
   ```sql
   -- 1) تفعيل الدفع على الكورس وتحديد السعر
   UPDATE public.courses
   SET is_paid = true, price = 150
   WHERE slug = 'operating-systems';

   -- 2) جعل الدرس الأول معاينة مجانية والباقي مقفول للمشتركين فقط
   UPDATE public.lessons
   SET is_free_preview = (order_index = 1)
   WHERE course_id = (SELECT id FROM public.courses WHERE slug = 'operating-systems');
   ```
   بمجرد ذلك:
   - يمنع RLS تلقائيًا قراءة الدروس المغلقة ومعاملها وأسئلتها لغير المشتركين.
   - يقوم `/api/interactives/[id]` تلقائيًا بتحويل الكاش إلى `Cache-Control: private, no-store` لمنع تسريب المعامل المدفوعة عبر الـ CDN.

3. **توليد أكواد تفعيل (Redeem Codes) للطلاب:**
   ```sql
   INSERT INTO public.redeem_codes (code, course_id)
   VALUES ('OS-2026-A1B2', (SELECT id FROM public.courses WHERE slug = 'operating-systems'));
   ```
   ويستطيع الطالب تفعيل الكود مباشرة عبر RPC: `supabase.rpc('redeem_course_code', { p_code: 'OS-2026-A1B2' })` (راجع `supabase/migrations/002_paywall_phase3.sql` لأي أعمدة اختيارية مثل تاريخ الانتهاء).

4. **الانتقال إلى Bunny Stream لحماية الفيديوهات المدفوعة:**
   - بدلاً من YouTube (المناسب للكورسات المجانية)، ارفع الفيديوهات المدفوعة على **Bunny Stream** وفعّل Domain/Token Protection.
   - حدّث الدرس في جدول `lessons`:
     ```sql
     UPDATE public.lessons
     SET video_provider = 'bunny',
         video_id = '<library_id>/<video_guid>'
     WHERE id = 'LESSON_UUID_HERE';
     ```

---

## هيكل المشروع | Project Structure

```text
├── .github/workflows/
│   ├── ci.yml                     # Node 24 CI (tsc, lint, build)
│   └── supabase-keepalive.yml     # 4-day cron ping to prevent Free Tier pause
├── content/labs/                  # Single-file interactive HTML labs
├── supabase/
│   ├── migrations/
│   │   ├── 001_init_schema.sql    # Core tables, indexes, triggers, RLS
│   │   └── 002_paywall_phase3.sql # Phase 3 redeem codes, payment requests, RPC
│   └── seed/
│       └── seed.sql               # Seed courses, lessons, labs, and quizzes
├── src/
│   ├── app/                       # Next.js 16 App Router pages & API routes
│   ├── components/                # Layout, course catalog, and lesson engine UI
│   ├── lib/                       # Config, Supabase clients, data layer, mock data
│   ├── types/database.ts          # Shared TypeScript contracts
│   └── proxy.ts                   # Next.js 16 auth session refresh proxy
├── vercel.json                    # Security headers (YouTube & srcDoc safe)
└── .env.example                   # Environment variable template
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
