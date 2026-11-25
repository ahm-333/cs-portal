"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  BookOpenCheck,
  Bot,
  ChevronLeft,
  Download,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  Moon,
  RefreshCw,
  Server,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";
import { logoutCloudAccount } from "@/lib/stores/authStore";
import { emitToast } from "@/lib/stores/events";
import { BrandName } from "@/components/layout/BrandName";
import { Footer } from "@/components/layout/Footer";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { OverviewAnalyticsTab } from "@/components/admin/OverviewAnalyticsTab";
import { CodesManagerTab } from "@/components/admin/CodesManagerTab";
import { StudentsAnalyticsTab } from "@/components/admin/StudentsAnalyticsTab";
import { CoursesCatalogTab } from "@/components/admin/CoursesCatalogTab";
import { SystemOperationsTab } from "@/components/admin/SystemOperationsTab";
import type {
  AdminCourseOption,
  AdminLessonOption,
  AdminOverviewData,
} from "@/components/admin/adminTypes";

export interface AdminDashboardClientProps {
  adminUser: SessionUser;
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
}

type AdminTab = "overview" | "codes" | "students" | "courses" | "system";

export function AdminDashboardClient({
  adminUser,
  courses,
  lessons,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // Cross-tab workflow shortcuts
  const [preselectedCourseId, setPreselectedCourseId] = useState<string | null>(
    null
  );
  const [openCreateStudentTick, setOpenCreateStudentTick] = useState<number>(0);
  const [signingOut, setSigningOut] = useState<boolean>(false);

  const triggerOverviewRefresh = useCallback(() => {
    setOverviewLoading(true);
    setOverviewError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  const downloadCsv = useCallback(async (endpoint: string, filename: string) => {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error("تعذر تصدير الملف.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      emitToast(`تم تحميل ${filename} ✓`);
    } catch {
      setOverviewError(`تعذر تحميل ملف ${filename}.`);
    }
  }, []);

  const handleQuickExportAvailable = useCallback(() => {
    void downloadCsv(
      "/api/admin/codes/export?status=available",
      "activation-codes-available.csv"
    );
  }, [downloadCsv]);

  const handleQuickExportStudents = useCallback(() => {
    void downloadCsv("/api/admin/students/export?role=student", "cs-portal-students.csv");
  }, [downloadCsv]);

  const handleGenerateForCourse = useCallback((courseId: string) => {
    setPreselectedCourseId(courseId);
    setActiveTab("codes");
  }, []);

  const handleOpenCreateStudent = useCallback(() => {
    setActiveTab("students");
    setOpenCreateStudentTick((n) => n + 1);
  }, []);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await logoutCloudAccount();
      emitToast("تم تسجيل الخروج من لوحة التحكم.");
      router.push("/login?tab=login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }, [router]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        const data = (await res.json()) as AdminOverviewData & {
          error?: string;
        };
        if (!active) return;
        if (!res.ok) {
          throw new Error(data.error || "تعذر تحميل إحصائيات لوحة التحكم.");
        }
        setOverview(data);
        setOverviewError(null);
      } catch (error) {
        if (!active) return;
        setOverviewError(
          error instanceof Error
            ? error.message
            : "تعذر تحميل إحصائيات لوحة التحكم."
        );
      } finally {
        if (active) setOverviewLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshTick]);

  const tabs: ReadonlyArray<{
    id: AdminTab;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
    warm?: boolean;
  }> = [
    { id: "overview", label: "النظرة العامة", icon: LayoutDashboard },
    {
      id: "codes",
      label: "أكواد التفعيل والسجل",
      icon: KeyRound,
      badge: overview?.totalCodes,
      warm: true,
    },
    {
      id: "students",
      label: "الطلاب والمستخدمون",
      icon: Users,
      badge: overview ? overview.totalStudents + overview.totalAdmins : undefined,
    },
    {
      id: "courses",
      label: "المقررات والمحتوى",
      icon: BookOpen,
      badge: courses.length,
    },
    {
      id: "system",
      label: "الذكاء الاصطناعي والنظام",
      icon: Server,
      badge: overview?.activeSessionsCount,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col w-full">
      {/* Sticky Warm Editorial Navy Topbar */}
      <header className="topbar-shell sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/courses"
              className="flex items-center gap-2.5 min-w-0 group"
              title="العودة إلى مكتبة المقررات"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-[1.5px] ring-[#c25e33] shrink-0 shadow-sm">
                <Image
                  src="/images/founder.jpg"
                  alt="Eng. Ahmed Amir"
                  fill
                  sizes="36px"
                  className="object-cover object-[50%_15%]"
                />
              </div>
              <BrandName size="md" className="hidden sm:inline-flex" />
            </Link>

            <nav
              aria-label="مسار التنقل"
              className="flex items-center gap-1.5 text-[12px] font-bold min-w-0"
              style={{ color: "var(--text-muted)" }}
            >
              <ChevronLeft className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <Link
                href="/courses"
                className="hover:underline truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                المقررات
              </Link>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span
                className="px-2.5 py-0.5 rounded-lg font-extrabold truncate"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                لوحة التحكم
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              className="hidden lg:inline-flex items-center gap-2 px-3 h-9.5 rounded-xl border text-[12px] font-bold"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <ShieldCheck
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--success-fg)" }}
              />
              <span className="max-w-[140px] truncate">{adminUser.fullName}</span>
              <span
                className="font-en text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                ADMIN
              </span>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 min-h-[38px] h-9.5 rounded-xl border text-[12px] font-semibold transition-colors cursor-pointer shrink-0"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
              title="تبديل المظهر"
              aria-label="تبديل المظهر"
            >
              {theme === "dark" ? (
                <Sun
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
              ) : (
                <Moon
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
              )}
              <span className="hidden sm:inline">
                {theme === "dark" ? "فاتح" : "داكن"}
              </span>
            </button>

            <Link
              href="/courses"
              className="px-3 min-h-[38px] h-9.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors hover:opacity-85 shrink-0"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">بوابة الطلاب</span>
            </Link>

            <button
              type="button"
              disabled={signingOut}
              onClick={() => void handleSignOut()}
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
              className="px-2.5 min-h-[38px] h-9.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
              style={{
                background: "var(--danger-soft)",
                color: "var(--danger-fg)",
              }}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Control Center Body */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 portal-page-enter">
        {/* Editorial Hero Header Strip */}
        <section
          className="hero-shell rounded-3xl p-5 sm:p-7 text-white border border-white/10 shadow-lg relative overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(135deg, var(--hero-bg) 0%, var(--hero-bg-end) 100%)",
            backgroundSize: "28px 28px, 28px 28px, 100% 100%",
          }}
        >
          <div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ background: "#c25e33" }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-en text-[11px] font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#f0a786]">
                  ADMIN CONTROL CENTER · FULL SUITE
                </span>
                <span className="font-mono-code text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-[#a7f3d0]">
                  {courses.length} Courses · {lessons.length} Chapters
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                مركز التحكم الشامل للمنصة
              </h1>
              <p className="text-[13.5px] text-slate-200/90 max-w-2xl">
                مرحباً يا <strong className="text-white">{adminUser.fullName}</strong> — تحكّم كامل في الطلاب والحسابات، أكواد التفعيل وسجل الاستخدام، المقررات، استهلاك الذكاء الاصطناعي، الجلسات النشطة، وصحة قاعدة بيانات Neon.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={triggerOverviewRefresh}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[12.5px] font-bold text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 ${overviewLoading ? "animate-spin" : ""}`}
                />
                <span>تحديث البيانات</span>
              </button>

              <button
                type="button"
                onClick={handleQuickExportAvailable}
                className="min-h-[40px] px-4 py-2 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center gap-2 transition-opacity hover:opacity-95 shadow-sm cursor-pointer"
                style={{ background: "#c25e33" }}
              >
                <Download className="w-4 h-4" />
                <span>تصدير الأكواد المتاحة</span>
              </button>
            </div>
          </div>
        </section>

        {/* Overview Error Banner */}
        {overviewError && (
          <div
            className="rounded-2xl px-4 py-3 text-[13px] font-bold flex items-center justify-between gap-3"
            style={{
              background: "var(--danger-soft)",
              color: "var(--danger-fg)",
            }}
          >
            <span>{overviewError}</span>
            <button
              type="button"
              onClick={triggerOverviewRefresh}
              className="px-3 py-1 rounded-lg bg-white/90 text-slate-900 text-[12px] font-extrabold cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* 6 KPI Overview Cards */}
        <section
          aria-label="مؤشرات الأداء الرئيسية"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5"
        >
          {/* KPI 1: Students */}
          <div className="surface-card hover-lift rounded-2xl p-4 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[12px] font-extrabold"
                style={{ color: "var(--text-secondary)" }}
              >
                الطلاب
              </span>
              <span
                className="w-8 h-8 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div
                className="font-mono-code text-2xl font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {overviewLoading && !overview ? "—" : overview?.totalStudents ?? 0}
              </div>
              <div
                className="text-[11px] font-semibold mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                نشط 7 أيام:{" "}
                <strong style={{ color: "var(--success-fg)" }}>
                  {overview?.activeStudents7d ?? 0}
                </strong>
              </div>
            </div>
          </div>

          {/* KPI 2: Active Enrollments */}
          <div className="surface-card hover-lift rounded-2xl p-4 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[12px] font-extrabold"
                style={{ color: "var(--text-secondary)" }}
              >
                الاشتراكات
              </span>
              <span
                className="w-8 h-8 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <BookOpenCheck className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div
                className="font-mono-code text-2xl font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {overviewLoading && !overview
                  ? "—"
                  : overview?.totalEnrollments ?? 0}
              </div>
              <div
                className="text-[11px] font-semibold mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                إنجازات:{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {overview?.totalCompletedLessons ?? 0}
                </strong>
              </div>
            </div>
          </div>

          {/* KPI 3: Activation Codes */}
          <div className="surface-card hover-lift rounded-2xl p-4 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[12px] font-extrabold"
                style={{ color: "var(--text-secondary)" }}
              >
                الأكواد المتاحة
              </span>
              <span
                className="w-8 h-8 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <KeyRound className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div
                className="font-mono-code text-2xl font-black"
                style={{ color: "var(--success-fg)" }}
              >
                {overviewLoading && !overview ? "—" : overview?.unusedCodes ?? 0}
              </div>
              <div
                className="text-[11px] font-semibold mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                مستخدم:{" "}
                <strong style={{ color: "var(--brand-primary)" }}>
                  {overview?.usedCodes ?? 0}
                </strong>{" "}
                · ملغي:{" "}
                <strong style={{ color: "var(--danger-fg)" }}>
                  {overview?.revokedCodes ?? 0}
                </strong>
              </div>
            </div>
          </div>

          {/* KPI 4: Avg Quiz Score */}
          <div className="surface-card hover-lift rounded-2xl p-4 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[12px] font-extrabold"
                style={{ color: "var(--text-secondary)" }}
              >
                متوسط الكويز
              </span>
              <span
                className="w-8 h-8 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div
                className="font-mono-code text-2xl font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {overviewLoading && !overview
                  ? "—"
                  : overview?.averageQuizScore !== null &&
                      overview?.averageQuizScore !== undefined
                    ? `${overview.averageQuizScore}%`
                    : "—"}
              </div>
              <div
                className="text-[11px] font-semibold mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                أخطاء:{" "}
                <strong>{overview?.totalMistakes ?? 0}</strong> · ملاحظات:{" "}
                <strong>{overview?.totalNotes ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* KPI 5: AI Tutor Usage */}
          <div className="surface-card hover-lift rounded-2xl p-4 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[12px] font-extrabold"
                style={{ color: "var(--text-secondary)" }}
              >
                طلبات AI اليوم
              </span>
              <span
                className="w-8 h-8 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <Bot className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div
                className="font-mono-code text-2xl font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {overviewLoading && !overview
                  ? "—"
                  : overview?.aiRequestsToday ?? 0}
              </div>
              <div
                className="text-[11px] font-semibold mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                آخر 7 أيام:{" "}
                <strong>{overview?.aiRequests7d ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* KPI 6: Active Sessions */}
          <div className="surface-card hover-lift rounded-2xl p-4 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[12px] font-extrabold"
                style={{ color: "var(--text-secondary)" }}
              >
                الجلسات النشطة
              </span>
              <span
                className="w-8 h-8 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <MonitorSmartphone className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div
                className="font-mono-code text-2xl font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {overviewLoading && !overview
                  ? "—"
                  : overview?.activeSessionsCount ?? 0}
              </div>
              <div
                className="text-[11px] font-semibold mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                مشرفون: <strong>{overview?.totalAdmins ?? 1}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Primary 5-Tab Switcher */}
        <div
          role="tablist"
          aria-label="أقسام لوحة التحكم"
          className="flex flex-wrap items-center gap-2"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  if (tab.id === "students") setOpenCreateStudentTick(0);
                  setActiveTab(tab.id);
                }}
                className={`filter-pill min-h-[44px] px-4 py-2 rounded-2xl text-[13px] font-extrabold inline-flex items-center gap-2 cursor-pointer ${
                  active ? (tab.warm ? "active-warm" : "active") : ""
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className="font-mono-code text-[11px] px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--bg-surface)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        {activeTab === "overview" && (
          <OverviewAnalyticsTab
            overview={overview}
            loading={overviewLoading}
            onNavigateTab={setActiveTab}
            onGenerateForCourse={handleGenerateForCourse}
            onOpenCreateStudent={handleOpenCreateStudent}
            onExportCodes={handleQuickExportAvailable}
            onExportStudents={handleQuickExportStudents}
          />
        )}

        {activeTab === "codes" && (
          <CodesManagerTab
            key={preselectedCourseId ?? "default"}
            courses={courses}
            lessons={lessons}
            preselectedCourseId={preselectedCourseId}
            onStatsChanged={triggerOverviewRefresh}
          />
        )}

        {activeTab === "students" && (
          <StudentsAnalyticsTab
            key={openCreateStudentTick}
            currentAdminId={adminUser.id}
            courses={courses}
            lessons={lessons}
            initialShowCreate={openCreateStudentTick > 0}
            onStatsChanged={triggerOverviewRefresh}
          />
        )}

        {activeTab === "courses" && (
          <CoursesCatalogTab
            courses={courses}
            lessons={lessons}
            courseStats={overview?.courseEnrollments ?? []}
            onGenerateForCourse={handleGenerateForCourse}
          />
        )}

        {activeTab === "system" && (
          <SystemOperationsTab onStatsChanged={triggerOverviewRefresh} />
        )}
      </main>

      <Footer variant="compact" />
    </div>
  );
}
