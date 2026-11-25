import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Lock,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { count, eq } from "drizzle-orm";
import { getServerSession, requireAdmin } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, users } from "@/lib/db";
import {
  getAdminCourseOptions,
  getAdminLessonOptions,
} from "@/app/api/admin/_catalog";
import { AdminBootstrapForm } from "@/components/admin/AdminBootstrapForm";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { BrandName } from "@/components/layout/BrandName";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: {
    index: false,
    follow: false,
  },
};

function AdminGateShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col w-full">
      <header className="topbar-shell sticky top-0 z-40">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-[1.5px] ring-[#c25e33] shrink-0 shadow-sm">
              <Image
                src="/images/founder.jpg"
                alt="Eng. Ahmed Amir"
                fill
                sizes="36px"
                className="object-cover object-[50%_15%]"
              />
            </div>
            <BrandName size="md" />
          </Link>

          <Link
            href="/courses"
            className="px-3.5 min-h-[38px] h-9.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors hover:opacity-85"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للمقررات</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>

      <Footer variant="compact" />
    </div>
  );
}

export default async function AdminPage() {
  // 1. Helpful Neon setup checklist when running locally without DATABASE_URL
  if (!isDatabaseConfigured()) {
    return (
      <AdminGateShell>
        <div className="surface-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span
              className="font-en inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              <Database className="w-3.5 h-3.5" />
              <span>NEON POSTGRES · SETUP REQUIRED</span>
            </span>

            <h1
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              لوحة التحكم تحتاج ربط قاعدة بيانات Neon
            </h1>
            <p
              className="text-[13.5px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              المنصة تعمل حالياً في الوضع المحلي بدون قاعدة بيانات (
              <span className="font-mono-code">DATABASE_URL</span> غير مُعرّف).
              لتفعيل إدارة أكواد التفعيل وحسابات الطلاب، اتبع الخطوات التالية:
            </p>
          </div>

          <div className="space-y-3">
            <div
              className="rounded-2xl border p-4 space-y-2"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div
                className="text-[12.5px] font-extrabold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <Terminal
                  className="w-4 h-4"
                  style={{ color: "var(--brand-primary)" }}
                />
                <span>1. أضف متغيرات البيئة في ملف .env.local</span>
              </div>
              <pre className="code-ltr text-[12px]">{`DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.neon.tech/neondb?sslmode=require"
ADMIN_EMAIL="admin@csportal.local"
ADMIN_PASSWORD="StrongPassword123!"
ADMIN_NAME="Eng. Ahmed Amir"`}</pre>
            </div>

            <div
              className="rounded-2xl border p-4 space-y-2"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div
                className="text-[12.5px] font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                2. أنشئ الجداول وحساب المشرف ثم أعد تشغيل السيرفر
              </div>
              <pre className="code-ltr text-[12px]">{`npm run db:push
npm run db:seed-admin`}</pre>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/login?tab=login&next=/admin"
              className="min-h-[44px] px-5 py-2.5 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center gap-2"
              style={{ background: "var(--accent-warm)" }}
            >
              <span>الذهاب لصفحة الدخول</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/courses"
              className="min-h-[44px] px-5 py-2.5 rounded-xl border text-[13px] font-bold inline-flex items-center gap-2"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <span>تصفح المقررات</span>
            </Link>
          </div>
        </div>
      </AdminGateShell>
    );
  }

  // 2. Enforce strict server-side admin verification (never leak admin data)
  const admin = await requireAdmin();

  if (!admin) {
    // Check whether zero admin accounts exist yet -> show one-time secure bootstrap form
    let hasAnyAdmin = true;
    try {
      const db = getDb();
      const [row] = await db
        .select({ total: count() })
        .from(users)
        .where(eq(users.role, "admin"));
      hasAnyAdmin = Number(row?.total ?? 0) > 0;
    } catch {
      hasAnyAdmin = true;
    }

    if (!hasAnyAdmin) {
      return (
        <AdminGateShell>
          <AdminBootstrapForm />
        </AdminGateShell>
      );
    }

    const session = await getServerSession();
    const isSignedInStudent = Boolean(session && session.role !== "admin");

    return (
      <AdminGateShell>
        <div className="surface-card w-full max-w-md rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
            style={{
              background: isSignedInStudent
                ? "var(--danger-soft)"
                : "var(--brand-soft)",
              color: isSignedInStudent
                ? "var(--danger-fg)"
                : "var(--brand-soft-text)",
            }}
          >
            {isSignedInStudent ? (
              <ShieldAlert className="w-7 h-7" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-2">
            <h1
              className="text-xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {isSignedInStudent
                ? "هذه الصفحة مخصصة للمشرف فقط"
                : "تسجيل الدخول مطلوب للوحة التحكم"}
            </h1>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {isSignedInStudent
                ? "حسابك الحالي مسجل بصلاحية طالب ولا يملك صلاحية الوصول إلى مركز التحكم الإداري."
                : "يرجى تسجيل الدخول بحساب المشرف للمتابعة إلى إدارة أكواد التفعيل وتحليلات الطلاب."}
            </p>
          </div>

          {session && (
            <div
              className="rounded-2xl border px-4 py-2.5 text-[12px] space-y-0.5"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div
                className="font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                {session.fullName}
              </div>
              <div
                dir="ltr"
                className="font-mono-code text-[11.5px]"
                style={{ color: "var(--text-muted)" }}
              >
                {session.email}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            <Link
              href="/login?tab=login&next=/admin"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center justify-center gap-2"
              style={{ background: "var(--accent-warm)" }}
            >
              <span>
                {isSignedInStudent
                  ? "تبديل الحساب"
                  : "تسجيل الدخول كمشرف"}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/courses"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border text-[13px] font-bold inline-flex items-center justify-center gap-2"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <span>مكتبة المقررات</span>
            </Link>
          </div>
        </div>
      </AdminGateShell>
    );
  }

  // 3. Verified admin -> render full control center with lightweight course/chapter catalog
  const courses = getAdminCourseOptions();
  const lessons = getAdminLessonOptions();

  return (
    <AdminDashboardClient
      adminUser={admin}
      courses={courses}
      lessons={lessons}
    />
  );
}
