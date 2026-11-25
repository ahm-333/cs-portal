<div align="center">

# Ahmed Amir Ahmed — بوابة حاسبات | CS Portal

### مساحة مذاكرة هندسية منظمة لطلبة الحاسبات والذكاء الاصطناعي — جامعة الزقازيق
*An Arabic-First, Warm Editorial Engineering Study Platform for Computer Science & AI Students*

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Neon + Drizzle](https://img.shields.io/badge/Database-Neon_PostgreSQL_%2B_Drizzle-00E599?style=flat-square&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Gemini AI](https://img.shields.io/badge/AI_Tutor-Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel_Ready-1E355C?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## نظرة عامة | Overview

**بوابة حاسبات (CS Portal)** هي منصة مذاكرة عربية منظمة صُمّمت خصيصًا لطلبة كليات الحاسبات والذكاء الاصطناعي؛ تجمع بين الشرح المرئي المحمي، المحاكيات والمعامل التفاعلية المعزولة، الملخصات المكتوبة بـ Markdown ومعادلات KaTeX وأكواد LTR النظيفة، الكويزات الفورية المربوطة ببنك الأخطاء، **والمساعد الذكي الخاص بكل فصل (الركن الخامس)** المدعوم بـ **Gemini 2.5 Flash**.

تعمل المنصة بنمط مزدوج مرن:
- **الوضع المحلي الفوري (Standalone Zero-DB):** تعمل المنصة فورًا محليًا وعلى Vercel بدون أي متغيرات بيئة (`0 env vars`) مع حفظ التقدّم والملاحظات وبنك الأخطاء في المتصفح (`localStorage`).
- **الوضع السحابي الكامل (Full Production Cloud):** عند ربط **Neon PostgreSQL** و **Gemini API** و **Bunny Stream HLS**، تتفعّل حسابات الطلاب والمزامنة السحابية عبر الأجهزة، أكواد التفعيل الذرية (`ACID`)، لوحة التحكم الخاصة (`/admin`) مع تصدير Excel CSV، المساعد الذكي لكل فصل، وبث الفيديو المشفر بالعلامة المائية الديناميكية.

---

## أبرز المميزات | Platform Highlights

### 1. الصفحة الرئيسية التفاعلية | Cinematic Landing (`/`)
- **Interactive Desk Hero & Scrollytelling** + **5 Expanding Tool Strips** لتجربة أدوات المنصة قبل الدخول + **Reality Switch** + **CS Marquee** + دعم كامل للوضع الليلي والنهاري (`Light` / `Dark`).

### 2. مكتبة المقررات وأدوات الإنتاجية | Courses Hub (`/courses`)
- بطاقات **Corner-Fold Editorial Blueprint (Style C)** بمؤشر إنجاز مباشر وحالة التفعيل.
- **Exam Countdown & Daily Target Planner** + **بنك الأخطاء (Mistake Bank)** + **مؤقت Pomodoro (`25:00`)** + بحث فوري (`Ctrl+K` / `Cmd+K`) عبر `/api/search-index` + تصدير/استيراد JSON.

### 3. مساحة المذاكرة ذات الأركان الخمسة | 5-Corner Study Workspace (`/courses/[slug]/[lessonId]`)
1. **فيديوهات الشرح المحمية (`VideoPlayer` + `ProtectedHlsPlayer`):**
   - دعم YouTube للمحتوى المجاني، و**بث HLS المشفر (`hls.js` + Safari Native HLS)** عبر روابط موقّتة من `/api/video/token` (Bunny Stream Directory Token Auth أو HMAC-SHA256).
   - **علامة مائية ديناميكية متحركة (`DynamicStudentWatermark`)** باسم الطالب وبريده ومعرّف جلسته تبقى ظاهرة حتى في وضع ملء الشاشة (Fullscreen) مع حارس `MutationObserver` يوقف التشغيل ويعيد بناء العلامة عند أي محاولة لإخفائها أو حذفها من الـ DOM.
2. **الشرح التفاعلي (`CourseInteractiveLab`):** محاكيات مدمجة ومعامل HTML مستقلة تُحمّل كسولًا عبر `/api/interactives/[id]` داخل `<iframe srcDoc={...} sandbox="allow-scripts" />` معزول تمامًا.
3. **الملخصات والأكواد والـ Cheat Sheets:** ملخصات منظمة + Markdown + معادلات **KaTeX** + أكواد **LTR** قابلة للنسخ + وضع ليلة الامتحان (Cram Mode) + نوتس تلقائية لكل درس.
4. **الكويزات الفورية (`QuizEngine`):** تصحيح فوري بالتفسير، حفظ أعلى درجة، وإضافة تلقائية للأخطاء إلى **بنك الأخطاء**.
5. **الركن الخامس — المساعد الذكي للفصل (`ChapterAiAssistant`):** شات تفاعلي مباشر (Streaming) مدعوم بـ **Gemini 2.5 Flash** يفهم محتوى الفصل الحالي تحديدًا مع أسئلة سريعة جاهزة وحد يومي تلقائي (`AI_DAILY_LIMIT`).

### 4. الحسابات الاختيارية والمزامنة السحابية | Optional Auth & Cloud Sync (`/login`)
- التصفح والمذاكرة متاحان فورًا كضيف بدون تسجيل.
- عند إنشاء حساب أو تسجيل الدخول في `/login` (تشفير كلمات المرور بـ `crypto.scryptSync` + جلسات `HttpOnly` مخزنة بـ SHA-256 في Neon)، يقوم `CloudSyncBridge` بدمج تقدمك المحلي تلقائيًا مع السحابة ومزامنة الدروس والدرجات والملاحظات وبنك الأخطاء عبر `/api/sync`.

### 5. أكواد التفعيل الذرية وحماية المحتوى المدفوع | Atomic Activation Codes
- تفعيل الكود عبر `POST /api/codes/redeem` يتم داخل معاملة **PostgreSQL ACID (`db.transaction`)** مع قفل صفّي (`FOR UPDATE`) وتحديث شرطي ذري (`WHERE used_count < max_uses`) لمنع الاستخدام المزدوج في السباقات المتزامنة.
- التحقق من الاشتراك للمحتوى المدفوع (`course.is_paid && !lesson.is_free_preview`) يتم حصريًا على السيرفر في `getLessonPageData()` و `/api/interactives/[id]` و `/api/ai/chat` و `/api/video/token`.

### 6. لوحة التحكم الخاصة | Private Admin Dashboard (`/admin`)
- محمية بصلاحية المشرف (`role === "admin"`) على مستوى الصفحة وجميع نقاط `/api/admin/*`.
- توليد دفعات أكواد التفعيل (حتى 500 كود بالدفعة، للمقرر أو الفصل أو الباقة الشاملة) بأحرف غير متشابهة، إلغاء/استعادة الأكواد، **تصدير CSV متوافق مع Excel العربي (UTF-8 BOM + حماية من CSV Formula Injection)**، متابعة إحصائيات الطلاب، ومنح/سحب الصلاحيات يدويًا.

---

## خريطة المسارات | Route Map

| Route | Purpose |
| --- | --- |
| `/` | Editorial Landing Page |
| `/courses` | Courses Library Hub, Exam Planner, Mistake Bank, Pomodoro, Search (`Ctrl+K`) |
| `/courses/[slug]` & `/courses/[slug]/[lessonId]` | 5-Corner Study Workspace (Video/HLS, Interactive Lab, Summary, Quiz, AI Tutor) |
| `/login` | Optional Cloud Account Sign-In / Sign-Up (or Local Student Profile in Zero-DB mode) |
| `/admin` | Private Admin Control Center (or Neon setup checklist when `DATABASE_URL` is unset) |
| `/dashboard` | Server redirect to `/courses` |
| `POST /api/auth/{register,login,logout}` & `GET /api/auth/me` | Session authentication (`HttpOnly` cookie, `private, no-store`) |
| `GET / POST /api/sync` & `POST /api/progress` | Bidirectional local-first ↔ Neon cloud sync |
| `POST /api/codes/redeem` & `GET /api/enrollments` | Atomic activation code redemption & active enrollment queries |
| `GET / POST / PATCH /api/admin/{overview,codes,codes/[id],codes/export,students}` | Admin-only analytics, code generation, CSV export, and enrollment management |
| `POST /api/ai/chat` | Streaming Gemini 2.5 Flash Chapter AI Tutor with daily rate limits & paid gating |
| `POST /api/video/token` | Short-lived signed HLS URL minting (Bunny Token Auth / HMAC) + student watermark payload |
| `GET /api/interactives/[id]` | Lazy-loaded sandboxed HTML labs with server-side paid-lesson enforcement |
| `GET /api/search-index` | Public cached (`s-maxage=3600`) catalog index for `Ctrl+K` |

---

## التشغيل المحلي السريع | Quick Start (Zero-DB Mode)

لا يلزم أي إعداد لقاعدة البيانات لتشغيل المنصة محليًا:

```bash
npm install
npm run dev
```

افتح: **[http://localhost:3000](http://localhost:3000)**

---

## دليل الإعداد الكامل للإنتاج | Production Setup Guide (Neon + Vercel + Gemini + Bunny HLS)

انسخ `.env.example` إلى `.env.local` (للتشغيل المحلي) أو أضف المتغيرات في **Vercel → Project Settings → Environment Variables**:

### 1. قاعدة بيانات Neon PostgreSQL + Drizzle ORM
1. أنشئ مشروعًا مجانيًا على **[Neon](https://neon.tech/)** واحصل على رابطي الاتصال:
   - **`DATABASE_URL`**: الرابط الـ **Pooled** (يحتوي على `-pooler` في اسم المضيف) — يُستخدم في وقت التشغيل.
   - **`DATABASE_URL_UNPOOLED`**: الرابط المباشر (**Direct / Unpooled**) — يُستخدم لأوامر Drizzle migrations.
2. ادفع الجداول التسعة (`users`, `sessions`, `user_progress`, `user_notes`, `user_mistakes`, `activation_codes`, `enrollments`, `code_redemptions`, `ai_chat_usage`) إلى Neon:
   ```bash
   npm run db:push
   ```

### 2. إنشاء حساب المشرف | Seed Admin Account
أضف بيانات المشرف إلى `.env.local` ثم شغّل سكربت التهيئة (يقوم بعمل upsert آمن بدون تكرار):

```env
ADMIN_EMAIL="admin@csportal.edu"
ADMIN_PASSWORD="StrongPassword123!"
ADMIN_NAME="Eng. Ahmed Amir"
```

```bash
npm run db:seed-admin
```

بعد ذلك يمكنك تسجيل الدخول من `/login` ثم فتح **`/admin`** لإدارة الأكواد والطلاب.
> **ملاحظة أمنية:** لا تحتاج لحفظ `ADMIN_PASSWORD` في متغيرات Vercel بعد تشغيل `db:seed-admin` بنجاح.

### 3. المساعد الذكي للفصل | Gemini 2.5 Flash AI Tutor
1. احصل على مفتاح API من **[Google AI Studio](https://aistudio.google.com/apikey)**.
2. أضف المتغيرات التالية:
   ```env
   GEMINI_API_KEY="AIza..."
   GEMINI_MODEL="gemini-2.5-flash"   # Optional (default: gemini-2.5-flash)
   AI_DAILY_LIMIT="25"               # Optional daily cap per student/guest (default: 25)
   ```

### 4. بث الفيديو المحمي | Bunny Stream HLS Token Auth
1. في لوحة **[Bunny.net Stream](https://bunny.net/)**:
   - فعّل **CDN Token Authentication** (URL Token Auth) على الـ Pull Zone الخاص بمكتبة الفيديو.
   - انسخ اسم مضيف الـ CDN (مثل `vz-xxxxxxxx-xxx.b-cdn.net`) ومفتاح التوقيع (`Token Authentication Key`).
2. أضف المتغيرات التالية:
   ```env
   BUNNY_STREAM_CDN_HOST="vz-xxxxxxxx-xxx.b-cdn.net"
   BUNNY_STREAM_TOKEN_KEY="your-bunny-url-token-key"
   # Optional fallback for custom/non-Bunny HTTPS HLS origins:
   HLS_SIGNING_SECRET="your-random-hmac-secret"
   ```
3. في بيانات الفصل (`src/lib/mock-data.ts`)، اضبط `video_provider: "hls"` وضع المسار النسبي في `hls_path` (مثل `/<video-guid>/playlist.m3u8`). يقوم السيرفر بحذف `hls_path` تلقائيًا من استجابة SSR ولا يصدر الرابط الموقّت إلا عبر `POST /api/video/token` بعد التحقق من الاشتراك.

### 5. النشر على Vercel | Deploying to Vercel
1. اربط مستودع GitHub بمشروع جديد على **[Vercel](https://vercel.com/new)**.
2. اضبط `NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app` (اختياري) وأضف متغيرات Neon / Gemini / Bunny أعلاه حسب المميزات التي تريد تفعيلها.
3. اضغط **Deploy** — ملف `vercel.json` مضبوط مسبقًا على منطقة `fra1` وترويسات الأمان القياسية دون تخزين مؤقت لأي مسارات API خاصة.

---

## أوامر التحقق والبناء | Verification & Database Scripts

```bash
npm run dev           # Start local dev server (Turbopack)
npx tsc --noEmit      # Strict TypeScript type-check
npm run lint          # ESLint check
npm run build         # Production build (verified with 0 env vars)
npm run start         # Serve production build locally
npm run db:push       # Push Drizzle schema (9 tables) to Neon PostgreSQL
npm run db:generate   # Generate Drizzle SQL migrations
npm run db:migrate    # Apply Drizzle SQL migrations
npm run db:studio     # Launch Drizzle Studio
npm run db:seed-admin # Upsert initial admin user into Neon PostgreSQL
```

---

## المزيد من التفاصيل المعمارية | Architecture Documentation

لمراجعة تفاصيل الجداول التسعة، تصميم قفل أكواد التفعيل (`FOR UPDATE`)، حارس العلامة المائية، وقائمة القواعد الأمنية الكاملة، راجع **[ARCHITECTURE.md](ARCHITECTURE.md)**.

---

<div align="center">

**Built with care by Ahmed Amir Ahmed · AI · Zagazig University**
*مبادرة طلابية مفتوحة — من طلاب لطلاب*

</div>
