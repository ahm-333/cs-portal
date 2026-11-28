"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpLeft,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CheckCheck,
  CreditCard,
  Download,
  MessageSquare,
  ShieldAlert,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  formatEgp,
  formatRelativeArabicTime,
  type AdminDailySeriesPoint,
  type AdminNotificationItem,
  type AdminOverviewData,
  type AdminTab,
} from "@/components/admin/adminTypes";

export interface OverviewAnalyticsTabProps {
  overview: AdminOverviewData | null;
  loading: boolean;
  notifications: AdminNotificationItem[];
  onNavigateTab: (tab: AdminTab) => void;
  onInspectStudent: (studentId: string) => void;
  onMarkAllNotificationsRead: () => void;
  onQuickNotificationAction: (notif: AdminNotificationItem) => void;
  onOpenCreateStudent: () => void;
  onExportStudents: () => void;
}

type ChartMetric = "all" | "completions" | "enrollments" | "signups";

function buildFallbackDailySeries(): AdminDailySeriesPoint[] {
  const days: AdminDailySeriesPoint[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    let label = key.slice(5);
    try {
      label = new Intl.DateTimeFormat("ar-EG", { weekday: "short" }).format(d);
    } catch {
      label = key.slice(5);
    }
    days.push({
      label,
      dateKey: key,
      signups: 0,
      enrollments: 0,
      completions: 0,
    });
  }
  return days;
}

export function OverviewAnalyticsTab({
  overview,
  loading,
  notifications,
  onNavigateTab,
  onInspectStudent,
  onMarkAllNotificationsRead,
  onQuickNotificationAction,
  onOpenCreateStudent,
  onExportStudents,
}: OverviewAnalyticsTabProps) {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("all");

  const dailySeries = useMemo(() => {
    if (overview?.dailySeries && overview.dailySeries.length > 0) {
      return overview.dailySeries;
    }
    return buildFallbackDailySeries();
  }, [overview]);

  const maxBarValue = useMemo(() => {
    let max = 1;
    for (const pt of dailySeries) {
      const val =
        chartMetric === "all"
          ? pt.completions + pt.enrollments + pt.signups
          : chartMetric === "completions"
            ? pt.completions
            : chartMetric === "enrollments"
              ? pt.enrollments
              : pt.signups;
      if (val > max) max = val;
    }
    return max;
  }, [dailySeries, chartMetric]);

  if (loading && !overview) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-32 rounded-3xl animate-pulse"
              style={{ background: "var(--bg-subtle)" }}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div
            className="lg:col-span-7 h-72 rounded-3xl animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
          <div
            className="lg:col-span-5 h-72 rounded-3xl animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const estimatedRevenue = overview.estimatedRevenue ?? 0;
  const pendingSubs = overview.pendingSubscriptionsCount ?? 0;
  const securityAlerts = overview.securityAlertsCount ?? 0;
  const openMessages = overview.openMessagesCount ?? 0;
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const maxYear = Math.max(1, ...overview.yearDistribution.map((b) => b.count));
  const maxDept = Math.max(1, ...overview.deptDistribution.map((b) => b.count));

  return (
    <div className="space-y-6">
      {/* 1. Four Executive KPI Cards */}
      <section
        aria-label="المؤشرات التنفيذية الرئيسية"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {/* KPI 1: Revenue */}
        <button
          type="button"
          onClick={() => onNavigateTab("subscriptions")}
          className="surface-card hover-lift rounded-3xl p-5 text-right flex flex-col justify-between gap-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between gap-2 w-full">
            <span
              className="text-[12.5px] font-extrabold"
              style={{ color: "var(--text-secondary)" }}
            >
              إجمالي الإيرادات (الترم)
            </span>
            <span
              className="w-9 h-9 rounded-2xl inline-flex items-center justify-center"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              <Wallet className="w-4.5 h-4.5" />
            </span>
          </div>
          <div>
            <div
              className="font-mono-code text-2xl sm:text-[26px] font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {formatEgp(estimatedRevenue)}
            </div>
            <div className="flex items-center justify-between gap-2 mt-1.5 text-[11.5px] font-bold">
              <span style={{ color: "var(--text-muted)" }}>
                اشتراكات نشطة:{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {overview.totalEnrollments}
                </strong>
              </span>
              {pendingSubs > 0 ? (
                <span
                  className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  {pendingSubs} طلب معلّق
                </span>
              ) : (
                <span style={{ color: "var(--success-fg)" }}>لا طلبات معلّقة</span>
              )}
            </div>
          </div>
        </button>

        {/* KPI 2: Students */}
        <button
          type="button"
          onClick={() => onNavigateTab("students")}
          className="surface-card hover-lift rounded-3xl p-5 text-right flex flex-col justify-between gap-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between gap-2 w-full">
            <span
              className="text-[12.5px] font-extrabold"
              style={{ color: "var(--text-secondary)" }}
            >
              الطلاب المسجلون
            </span>
            <span
              className="w-9 h-9 rounded-2xl inline-flex items-center justify-center"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <Users className="w-4.5 h-4.5" />
            </span>
          </div>
          <div>
            <div
              className="font-mono-code text-2xl sm:text-[26px] font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {overview.totalStudents}
            </div>
            <div className="flex items-center justify-between gap-2 mt-1.5 text-[11.5px] font-bold">
              <span style={{ color: "var(--text-muted)" }}>
                نشط 7 أيام:{" "}
                <strong style={{ color: "var(--success-fg)" }}>
                  {overview.activeStudents7d}
                </strong>
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                متصل الآن:{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {overview.activeSessionsCount}
                </strong>
              </span>
            </div>
          </div>
        </button>

        {/* KPI 3: Quiz Average */}
        <button
          type="button"
          onClick={() => onNavigateTab("courses")}
          className="surface-card hover-lift rounded-3xl p-5 text-right flex flex-col justify-between gap-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between gap-2 w-full">
            <span
              className="text-[12.5px] font-extrabold"
              style={{ color: "var(--text-secondary)" }}
            >
              متوسط الكويزات بالمنصة
            </span>
            <span
              className="w-9 h-9 rounded-2xl inline-flex items-center justify-center"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              <Award className="w-4.5 h-4.5" />
            </span>
          </div>
          <div>
            <div
              className="font-mono-code text-2xl sm:text-[26px] font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {overview.averageQuizScore !== null
                ? `${overview.averageQuizScore}%`
                : "—"}
            </div>
            <div className="flex items-center justify-between gap-2 mt-1.5 text-[11.5px] font-bold">
              <span style={{ color: "var(--text-muted)" }}>
                فصول مكتملة:{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {overview.totalCompletedLessons}
                </strong>
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                AI اليوم:{" "}
                <strong style={{ color: "var(--brand-primary)" }}>
                  {overview.aiRequestsToday}
                </strong>
              </span>
            </div>
          </div>
        </button>

        {/* KPI 4: Security & Devices Alerts */}
        <button
          type="button"
          onClick={() => onNavigateTab("security")}
          className="surface-card hover-lift rounded-3xl p-5 text-right flex flex-col justify-between gap-3 cursor-pointer transition-all"
          style={{
            borderColor:
              securityAlerts > 0 ? "var(--danger-fg)" : "var(--border-soft)",
          }}
        >
          <div className="flex items-center justify-between gap-2 w-full">
            <span
              className="text-[12.5px] font-extrabold"
              style={{ color: "var(--text-secondary)" }}
            >
              تنبيهات الأمان والأجهزة
            </span>
            <span
              className="w-9 h-9 rounded-2xl inline-flex items-center justify-center"
              style={{
                background:
                  securityAlerts > 0
                    ? "var(--danger-soft)"
                    : "var(--success-soft)",
                color:
                  securityAlerts > 0
                    ? "var(--danger-fg)"
                    : "var(--success-fg)",
              }}
            >
              <ShieldAlert className="w-4.5 h-4.5" />
            </span>
          </div>
          <div>
            <div
              className="font-mono-code text-2xl sm:text-[26px] font-black tracking-tight"
              style={{
                color:
                  securityAlerts > 0
                    ? "var(--danger-fg)"
                    : "var(--success-fg)",
              }}
            >
              {securityAlerts}
            </div>
            <div className="flex items-center justify-between gap-2 mt-1.5 text-[11.5px] font-bold">
              <span style={{ color: "var(--text-muted)" }}>
                {securityAlerts > 0 ? "يحتاج مراجعة فورية" : "النظام مؤمّن ✓"}
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                رسائل مفتوحة:{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {openMessages}
                </strong>
              </span>
            </div>
          </div>
        </button>
      </section>

      {/* 2. 7-Day Activity & Subscriptions Bar Chart + Live Notifications Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* 7-Day Activity Bar Chart */}
        <section className="xl:col-span-7 surface-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <TrendingUp className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2
                  className="text-[15.5px] font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  نشاط المنصة والاشتراكات — آخر 7 أيام
                </h2>
                <p
                  className="text-[11.5px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  متابعة يومية لإنجاز الفصول، تفعيل الاشتراكات، وتسجيلات الطلاب الجدد.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  { id: "all", label: "الإجمالي" },
                  { id: "completions", label: "إنجاز" },
                  { id: "enrollments", label: "اشتراكات" },
                  { id: "signups", label: "تسجيلات" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setChartMetric(m.id)}
                  className={`filter-pill min-h-[30px] px-2.5 py-1 rounded-xl text-[11px] font-extrabold cursor-pointer ${
                    chartMetric === m.id ? "active" : ""
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div
            className="rounded-2xl border p-4 sm:p-5"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-48 pt-6">
              {dailySeries.map((pt) => {
                const value =
                  chartMetric === "all"
                    ? pt.completions + pt.enrollments + pt.signups
                    : chartMetric === "completions"
                      ? pt.completions
                      : chartMetric === "enrollments"
                        ? pt.enrollments
                        : pt.signups;
                const heightPct =
                  value === 0
                    ? 6
                    : Math.max(14, Math.round((value / maxBarValue) * 100));

                return (
                  <div
                    key={pt.dateKey}
                    className="group relative flex flex-col items-center justify-end h-full gap-2"
                  >
                    {/* Hover Tooltip */}
                    <div
                      className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 z-20 whitespace-nowrap rounded-xl border px-2.5 py-1.5 text-[10.5px] font-bold shadow-lg"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border-strong)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <div className="font-mono-code text-center mb-0.5">
                        {pt.dateKey}
                      </div>
                      <div style={{ color: "var(--success-fg)" }}>
                        إنجاز: {pt.completions} · اشتراك: {pt.enrollments}
                      </div>
                      <div style={{ color: "var(--brand-primary)" }}>
                        طلاب جدد: {pt.signups}
                      </div>
                    </div>

                    <span
                      className="font-mono-code text-[11px] font-extrabold"
                      style={{
                        color:
                          value > 0
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                      }}
                    >
                      {value}
                    </span>

                    <div
                      className="w-full max-w-[44px] h-full flex items-end rounded-xl overflow-hidden p-0.5"
                      style={{ background: "var(--bg-subtle)" }}
                    >
                      <div
                        className="w-full rounded-lg transition-all duration-500"
                        style={{
                          height: `${heightPct}%`,
                          background:
                            value > 0
                              ? "linear-gradient(180deg, var(--brand-primary) 0%, var(--success-fg) 100%)"
                              : "var(--border-soft)",
                        }}
                      />
                    </div>

                    <span
                      className="text-[11px] font-bold truncate max-w-full"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Operations Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab("subscriptions")}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>مراجعة طلبات الاشتراك</span>
              </button>

              <button
                type="button"
                onClick={onOpenCreateStudent}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إضافة طالب / أدمن</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onExportStudents}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer hover:opacity-85"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>
          </div>
        </section>

        {/* Live Notifications Center Summary Panel */}
        <section className="xl:col-span-5 surface-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  <Bell className="w-4.5 h-4.5" />
                </span>
                <div>
                  <h2
                    className="text-[15.5px] font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    مركز التنبيهات الفورية
                  </h2>
                  <p
                    className="text-[11.5px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {unreadNotifs > 0
                      ? `${unreadNotifs} تنبيه غير مقروء`
                      : "جميع التنبيهات مقروءة ✓"}
                  </p>
                </div>
              </div>

              {unreadNotifs > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllNotificationsRead}
                  className="px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer hover:opacity-85"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>قراءة الكل</span>
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div
                className="rounded-2xl border border-dashed p-8 text-center space-y-1.5"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <Bell
                  className="w-7 h-7 mx-auto opacity-50"
                  style={{ color: "var(--text-muted)" }}
                />
                <div
                  className="text-[13.5px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  لا توجد إشعارات جديدة
                </div>
                <p
                  className="text-[12px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  ستظهر هنا تنبيهات الأجهزة، طلبات الاشتراك، ورسائل الطلاب لحظياً.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pl-0.5">
                {notifications.slice(0, 6).map((n) => {
                  const Icon =
                    n.type === "security"
                      ? ShieldAlert
                      : n.type === "payment"
                        ? CreditCard
                        : MessageSquare;
                  const iconStyle =
                    n.type === "security"
                      ? {
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }
                      : n.type === "payment"
                        ? {
                            background: "var(--accent-warm-soft)",
                            color: "var(--accent-warm-text)",
                          }
                        : {
                            background: "var(--success-soft)",
                            color: "var(--success-fg)",
                          };
                  const ctaLabel =
                    n.type === "security"
                      ? "فحص"
                      : n.type === "payment"
                        ? "مراجعة"
                        : "عرض";

                  return (
                    <div
                      key={n.id}
                      className="rounded-2xl border p-3 flex items-start justify-between gap-2.5 transition-colors"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: !n.isRead
                          ? "var(--border-strong)"
                          : "var(--border-soft)",
                      }}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span
                          className="w-8 h-8 rounded-xl inline-flex items-center justify-center shrink-0 mt-0.5"
                          style={iconStyle}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            {!n.isRead && (
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: "var(--brand-primary)" }}
                              />
                            )}
                            <span
                              className="text-[12.5px] font-extrabold truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {n.title}
                            </span>
                          </div>
                          <p
                            className="text-[11.5px] line-clamp-2 mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {n.body}
                          </p>
                          <span
                            className="text-[10.5px] font-semibold"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {formatRelativeArabicTime(n.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onQuickNotificationAction(n)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold cursor-pointer hover:opacity-85"
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-soft)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {ctaLabel}
                        </button>
                        {n.userId && (
                          <button
                            type="button"
                            onClick={() => onInspectStudent(n.userId!)}
                            className="text-[10.5px] font-bold hover:underline cursor-pointer"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            ملف الطالب
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className="pt-3 border-t flex items-center justify-between text-[12px] font-extrabold"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <button
              type="button"
              onClick={() => onNavigateTab("security")}
              className="hover:underline cursor-pointer"
              style={{ color: "var(--danger-fg)" }}
            >
              رادار الأمان ←
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("inbox")}
              className="hover:underline cursor-pointer"
              style={{ color: "var(--success-fg)" }}
            >
              صندوق الرسائل ({openMessages}) ←
            </button>
          </div>
        </section>
      </div>

      {/* 3. Hardest Chapters + Demographics + Course Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hardest Chapters */}
        <section className="lg:col-span-5 surface-card rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="w-4.5 h-4.5"
              style={{ color: "var(--accent-warm)" }}
            />
            <h3
              className="text-[14.5px] font-black"
              style={{ color: "var(--text-primary)" }}
            >
              أكثر الفصول التي يخطئ فيها الطلاب
            </h3>
          </div>

          {overview.hardestChapters.length === 0 ? (
            <p
              className="text-[12.5px] rounded-2xl p-4 border border-dashed text-center"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-muted)",
              }}
            >
              لا توجد أخطاء مسجلة بعد. ستظهر هنا أصعب الفصول فور حل الطلاب للكويزات.
            </p>
          ) : (
            <div className="space-y-2">
              {overview.hardestChapters.slice(0, 6).map((ch, idx) => (
                <div
                  key={`${ch.courseId}-${ch.lessonId ?? idx}`}
                  className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="min-w-0">
                    <div
                      className="text-[12.5px] font-extrabold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {ch.label}
                    </div>
                    <div
                      className="font-en text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {ch.courseCode}
                    </div>
                  </div>
                  <span
                    className="font-mono-code px-2.5 py-1 rounded-xl text-[11.5px] font-extrabold shrink-0"
                    style={{
                      background: "var(--accent-warm-soft)",
                      color: "var(--accent-warm-text)",
                    }}
                  >
                    {ch.mistakesCount} خطأ
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Compact Year / Dept Bars */}
          <div
            className="pt-4 border-t grid grid-cols-2 gap-4"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <div className="space-y-2">
              <div
                className="text-[11px] font-extrabold flex items-center gap-1"
                style={{ color: "var(--text-muted)" }}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>الفرق الدراسية</span>
              </div>
              {overview.yearDistribution.map((b) => (
                <div key={b.key} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span style={{ color: "var(--text-primary)" }}>
                      {b.label}
                    </span>
                    <span
                      className="font-mono-code"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {b.count}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-subtle)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((b.count / maxYear) * 100)}%`,
                        background: "var(--brand-primary)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div
                className="text-[11px] font-extrabold"
                style={{ color: "var(--text-muted)" }}
              >
                التخصصات
              </div>
              {overview.deptDistribution.map((b) => (
                <div key={b.key} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span
                      className="font-en"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {b.label}
                    </span>
                    <span
                      className="font-mono-code"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {b.count}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-subtle)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((b.count / maxDept) * 100)}%`,
                        background: "var(--success-fg)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Performance Matrix */}
        <section className="lg:col-span-7 surface-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <BookOpen className="w-4.5 h-4.5" />
              </span>
              <div>
                <h3
                  className="text-[15px] font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  أداء المواد والاشتراكات
                </h3>
                <p
                  className="text-[11.5px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  المشتركون، الفصول المكتملة، ومتوسط الكويز لكل مادة.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab("courses")}
              className="text-[12px] font-extrabold inline-flex items-center gap-1 hover:underline cursor-pointer"
              style={{ color: "var(--brand-primary)" }}
            >
              <span>إدارة المواد والأسعار</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className="overflow-x-auto rounded-2xl border"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <table className="w-full text-right border-collapse text-[12.5px]">
              <thead>
                <tr
                  className="border-b text-[11px] font-extrabold"
                  style={{
                    background: "var(--bg-subtle)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <th className="py-2.5 px-3.5">المادة</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3">المشتركون</th>
                  <th className="py-2.5 px-3">إنجاز</th>
                  <th className="py-2.5 px-3">الكويز</th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: "var(--border-soft)" }}
              >
                {overview.courseEnrollments.map((c) => (
                  <tr
                    key={c.courseId}
                    onClick={() => onNavigateTab("courses")}
                    className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    <td className="py-2.5 px-3.5">
                      <div
                        className="font-extrabold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <span
                          className="font-en ml-1.5"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          {c.code}
                        </span>
                        {c.title}
                      </div>
                      <div
                        className="text-[10.5px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        ف{c.yearLevel} · {c.lessonCount} فصل
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className="px-2 py-0.5 rounded-lg text-[10.5px] font-extrabold"
                        style={{
                          background: c.isPaid
                            ? "var(--accent-warm-soft)"
                            : "var(--success-soft)",
                          color: c.isPaid
                            ? "var(--accent-warm-text)"
                            : "var(--success-fg)",
                        }}
                      >
                        {c.isPaid ? "مدفوعة" : "مجانية"}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-3 whitespace-nowrap font-mono-code font-extrabold"
                      style={{ color: "var(--success-fg)" }}
                    >
                      {c.totalWithBundle}
                    </td>
                    <td
                      className="py-2.5 px-3 whitespace-nowrap font-mono-code font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {c.completedLessons}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className="font-mono-code px-2 py-0.5 rounded-full text-[11px] font-extrabold"
                        style={{
                          background:
                            c.averageQuizScore !== null
                              ? "var(--brand-soft)"
                              : "var(--bg-subtle)",
                          color:
                            c.averageQuizScore !== null
                              ? "var(--brand-soft-text)"
                              : "var(--text-muted)",
                        }}
                      >
                        {c.averageQuizScore !== null
                          ? `${c.averageQuizScore}%`
                          : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Keep recentActivity link cleanly accessible */}
          {overview.recentActivity.length > 0 && (
            <div className="pt-2 space-y-2">
              <div
                className="text-[11.5px] font-extrabold"
                style={{ color: "var(--text-muted)" }}
              >
                آخر الأحداث المسجلة
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {overview.recentActivity.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border px-3 py-2 flex items-center justify-between gap-2 text-[11.5px]"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="min-w-0">
                      <div
                        className="font-extrabold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-[10.5px] truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                    <span
                      className="text-[10px] shrink-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatRelativeArabicTime(item.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
