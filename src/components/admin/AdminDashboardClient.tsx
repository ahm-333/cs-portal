"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";
import { logoutCloudAccount } from "@/lib/stores/authStore";
import { emitToast } from "@/lib/stores/events";
import { BrandName } from "@/components/layout/BrandName";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { OverviewAnalyticsTab } from "@/components/admin/OverviewAnalyticsTab";
import { SubscriptionsTab } from "@/components/admin/SubscriptionsTab";
import { StudentsAnalyticsTab } from "@/components/admin/StudentsAnalyticsTab";
import { CoursesCatalogTab } from "@/components/admin/CoursesCatalogTab";
import { SecurityAndInboxTab } from "@/components/admin/SecurityAndInboxTab";
import { SystemOperationsTab } from "@/components/admin/SystemOperationsTab";
import { StudentDetailModal } from "@/components/admin/StudentDetailModal";
import {
  formatRelativeArabicTime,
  type AdminCourseOption,
  type AdminLessonOption,
  type AdminNotificationItem,
  type AdminOverviewData,
  type AdminTab,
} from "@/components/admin/adminTypes";

export interface AdminDashboardClientProps {
  adminUser: SessionUser;
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
}

interface NavItem {
  id: AdminTab;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  tone?: "warm" | "rose" | "emerald" | "neutral";
}

function parseMetaJson(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // ignore malformed meta
  }
  return {};
}

export function AdminDashboardClient({
  adminUser,
  courses,
  lessons,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [dbLatencyMs, setDbLatencyMs] = useState<number | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // Notifications state
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [notifBusyId, setNotifBusyId] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // Quick search state (⌘K)
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  // Cross-tab workflow shortcuts
  const [studentsInitialSearch, setStudentsInitialSearch] =
    useState<string>("");
  const [studentsJumpTick, setStudentsJumpTick] = useState<number>(0);
  const [openCreateStudentTick, setOpenCreateStudentTick] = useState<number>(0);
  const [drawerStudentId, setDrawerStudentId] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState<boolean>(false);

  const triggerOverviewRefresh = useCallback(() => {
    setOverviewLoading(true);
    setOverviewError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  // Load overview + notifications (+ lightweight latency probe on first load)
  useEffect(() => {
    let active = true;
    const t0 = performance.now();

    (async () => {
      try {
        const [ovRes, notifRes] = await Promise.all([
          fetch("/api/admin/overview", { cache: "no-store" }),
          fetch("/api/admin/notifications", { cache: "no-store" }),
        ]);

        const ovData = (await ovRes.json()) as AdminOverviewData & {
          error?: string;
        };
        const elapsed = Math.max(1, Math.round(performance.now() - t0));

        if (!active) return;
        if (!ovRes.ok) {
          throw new Error(ovData.error || "تعذر تحميل إحصائيات لوحة التحكم.");
        }
        setOverview(ovData);
        setDbLatencyMs(ovData.dbLatencyMs ?? elapsed);
        setOverviewError(null);

        if (notifRes.ok) {
          const notifData = (await notifRes.json()) as {
            notifications?: AdminNotificationItem[];
            unreadCount?: number;
          };
          setNotifications(notifData.notifications ?? []);
          setUnreadCount(
            notifData.unreadCount ??
              (notifData.notifications ?? []).filter((n) => !n.isRead).length
          );
        }
      } catch (err) {
        if (!active) return;
        setOverviewError(
          err instanceof Error
            ? err.message
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

  // ⌘K / Ctrl+K shortcut for Admin Quick Search + Escape to close popovers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      } else if (e.key === "Escape") {
        setNotifOpen(false);
        setSearchFocused(false);
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Outside click close for notifications popover & search dropdown
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (searchBoxRef.current && !searchBoxRef.current.contains(target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const navGroups = useMemo<
    ReadonlyArray<{ title: string; items: ReadonlyArray<NavItem> }>
  >(
    () => [
      {
        title: "المتابعة والتحكم",
        items: [
          {
            id: "overview",
            label: "النظرة العامة والإيرادات",
            shortLabel: "النظرة العامة",
            icon: LayoutDashboard,
          },
          {
            id: "subscriptions",
            label: "طلبات الاشتراك",
            shortLabel: "الاشتراكات",
            icon: CreditCard,
            badge: overview?.pendingSubscriptionsCount ?? 0,
            tone: "warm",
          },
          {
            id: "students",
            label: "الطلاب والدرجات",
            shortLabel: "الطلاب",
            icon: Users,
            badge: overview?.totalStudents,
            tone: "neutral",
          },
          {
            id: "courses",
            label: "إدارة المواد والفصول",
            shortLabel: "المواد",
            icon: BookOpen,
            badge: courses.length,
            tone: "neutral",
          },
        ],
      },
      {
        title: "الأمان والتواصل",
        items: [
          {
            id: "security",
            label: "رادار الأجهزة والمخالفات",
            shortLabel: "رادار الأمان",
            icon: ShieldAlert,
            badge: overview?.securityAlertsCount ?? 0,
            tone: "rose",
          },
          {
            id: "inbox",
            label: "رسائل وبلاغات الطلاب",
            shortLabel: "الرسائل",
            icon: Inbox,
            badge: overview?.openMessagesCount ?? 0,
            tone: "emerald",
          },
          {
            id: "system",
            label: "الإعلانات والنظام وAI",
            shortLabel: "النظام وAI",
            icon: Server,
          },
        ],
      },
    ],
    [overview, courses.length]
  );

  const allNavItems = useMemo(
    () => navGroups.flatMap((g) => g.items),
    [navGroups]
  );

  const matchingTabs = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return allNavItems;
    return allNavItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.shortLabel.toLowerCase().includes(q) ||
        item.id.includes(q)
    );
  }, [allNavItems, quickSearch]);

  const activeNavMeta =
    allNavItems.find((i) => i.id === activeTab) ?? allNavItems[0];

  const handleSelectTab = useCallback((tab: AdminTab) => {
    if (tab === "students") {
      setOpenCreateStudentTick(0);
    }
    setActiveTab(tab);
    setMobileNavOpen(false);
  }, []);

  const handleSearchStudentsJump = useCallback((query: string) => {
    setStudentsInitialSearch(query.trim());
    setStudentsJumpTick((n) => n + 1);
    setOpenCreateStudentTick(0);
    setActiveTab("students");
    setSearchFocused(false);
    setQuickSearch("");
  }, []);

  const handleOpenCreateStudent = useCallback(() => {
    setStudentsInitialSearch("");
    setActiveTab("students");
    setOpenCreateStudentTick((n) => n + 1);
  }, []);

  const handleExportStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/students/export?role=student", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("تعذر تصدير الملف.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cs-portal-students.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      emitToast("تم تحميل cs-portal-students.csv ✓");
    } catch {
      emitToast("تعذر تحميل ملف بيانات الطلاب.");
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    setNotifBusyId("all");
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      emitToast("تم تحديد جميع الإشعارات كمقروءة ✓");
    } finally {
      setNotifBusyId(null);
    }
  }, []);

  const markSingleRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // ignore
    }
  }, []);

  const handleQuickFreezeFromNotif = useCallback(
    async (notif: AdminNotificationItem) => {
      if (!notif.userId) return;
      setNotifBusyId(`freeze-${notif.id}`);
      try {
        const res = await fetch(`/api/admin/students/${notif.userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "suspend",
            reason:
              "تم تجميد الحساب مؤقتاً بسبب تجاوز حد الأجهزة المسموح بها. تواصل مع م. أحمد.",
          }),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || json.ok === false) {
          throw new Error(json.error || "تعذر تجميد الحساب.");
        }
        await markSingleRead(notif.id);
        emitToast("تم تجميد الحساب وطرد الجلسات ✓");
        triggerOverviewRefresh();
      } catch (err) {
        emitToast(err instanceof Error ? err.message : "تعذر تجميد الحساب.");
      } finally {
        setNotifBusyId(null);
      }
    },
    [markSingleRead, triggerOverviewRefresh]
  );

  const handleQuickApproveFromNotif = useCallback(
    async (notif: AdminNotificationItem) => {
      const meta = parseMetaJson(notif.metaJson);
      const requestId =
        typeof meta.requestId === "string"
          ? meta.requestId
          : typeof meta.subscriptionRequestId === "string"
            ? meta.subscriptionRequestId
            : null;

      if (!requestId) {
        await markSingleRead(notif.id);
        setNotifOpen(false);
        setActiveTab("subscriptions");
        return;
      }

      setNotifBusyId(`approve-${notif.id}`);
      try {
        const res = await fetch("/api/admin/subscriptions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: requestId, action: "approve" }),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || json.ok === false) {
          throw new Error(json.error || "تعذر قبول الطلب.");
        }
        await markSingleRead(notif.id);
        emitToast("تم قبول الطلب وتفعيل المادة فوراً ✓");
        triggerOverviewRefresh();
      } catch (err) {
        emitToast(err instanceof Error ? err.message : "تعذر قبول الطلب.");
      } finally {
        setNotifBusyId(null);
      }
    },
    [markSingleRead, triggerOverviewRefresh]
  );

  const handleNotificationPrimaryAction = useCallback(
    (notif: AdminNotificationItem) => {
      void markSingleRead(notif.id);
      setNotifOpen(false);
      if (notif.type === "payment") {
        setActiveTab("subscriptions");
      } else if (notif.type === "security") {
        if (notif.userId) setDrawerStudentId(notif.userId);
        else setActiveTab("security");
      } else {
        setActiveTab("inbox");
      }
    },
    [markSingleRead]
  );

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

  function badgeColors(tone: NavItem["tone"], active: boolean) {
    if (active) {
      return {
        background: "rgba(255, 255, 255, 0.16)",
        color: "#ffffff",
      };
    }
    if (tone === "warm") {
      return {
        background: "var(--accent-warm-soft)",
        color: "var(--accent-warm-text)",
      };
    }
    if (tone === "rose") {
      return {
        background: "var(--danger-soft)",
        color: "var(--danger-fg)",
      };
    }
    if (tone === "emerald") {
      return {
        background: "var(--success-soft)",
        color: "var(--success-fg)",
      };
    }
    return {
      background: "var(--bg-subtle)",
      color: "var(--text-secondary)",
    };
  }

  function renderSidebarInner(compact: boolean) {
    return (
      <div className="flex flex-col h-full">
        {/* Sidebar Brand Header */}
        <div
          className="h-16 px-4 flex items-center justify-between gap-2 border-b shrink-0"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <Link
            href="/courses"
            className="flex items-center gap-2.5 min-w-0"
            title="Eng. Ahmed Amir · CS Portal"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-[1.5px] ring-[var(--brand-primary)] shrink-0 shadow-sm">
              <Image
                src="/images/founder.jpg"
                alt="Eng. Ahmed Amir"
                fill
                sizes="36px"
                className="object-cover object-[50%_15%]"
              />
            </div>
            {!compact && (
              <div className="min-w-0">
                <BrandName size="sm" />
                <div
                  className="font-en text-[10px] font-extrabold tracking-wider"
                  style={{ color: "var(--brand-primary)" }}
                >
                  ADMIN COMMAND
                </div>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={compact ? "توسيع القائمة" : "طي القائمة"}
            className="hidden lg:inline-flex w-8 h-8 rounded-xl border items-center justify-center cursor-pointer hover:opacity-80 shrink-0"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            {compact ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="إغلاق القائمة"
            className="lg:hidden w-8 h-8 rounded-xl border inline-flex items-center justify-center cursor-pointer"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav
          aria-label="أقسام مركز التحكم"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
        >
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              {!compact && (
                <div
                  className="px-3 text-[10.5px] font-extrabold tracking-wide"
                  style={{ color: "var(--text-muted)" }}
                >
                  {group.title}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  const showBadge =
                    item.badge !== undefined &&
                    (item.tone === "neutral" || item.badge > 0);
                  const bColors = badgeColors(item.tone, active);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      title={compact ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`w-full min-h-[42px] rounded-2xl transition-all flex items-center cursor-pointer ${
                        compact
                          ? "justify-center px-2 relative"
                          : "justify-between px-3 gap-2.5"
                      }`}
                      style={{
                        background: active
                          ? "var(--hero-bg)"
                          : "transparent",
                        color: active ? "#ffffff" : "var(--text-secondary)",
                        border: active
                          ? "1px solid var(--border-strong)"
                          : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className="w-4.5 h-4.5 shrink-0"
                          style={{
                            color: active
                              ? "var(--brand-primary)"
                              : item.tone === "rose" && (item.badge ?? 0) > 0
                                ? "var(--danger-fg)"
                                : "currentColor",
                          }}
                        />
                        {!compact && (
                          <span className="text-[12.5px] font-extrabold truncate">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {showBadge && !compact && (
                        <span
                          className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
                          style={bColors}
                        >
                          {item.badge}
                        </span>
                      )}

                      {showBadge &&
                        compact &&
                        (item.badge ?? 0) > 0 &&
                        item.tone !== "neutral" && (
                          <span
                            className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full"
                            style={{
                              background:
                                item.tone === "rose"
                                  ? "var(--danger-fg)"
                                  : item.tone === "warm"
                                    ? "var(--accent-warm)"
                                    : "var(--success-fg)",
                            }}
                          />
                        )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer: Live DB Status + Admin Badge */}
        <div
          className="p-3 border-t space-y-2 shrink-0"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {!compact && (
            <div
              className="rounded-2xl border px-3 py-2 flex items-center gap-2"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <ShieldCheck
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--brand-primary)" }}
              />
              <div className="min-w-0">
                <div
                  className="text-[12px] font-black truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {adminUser.fullName}
                </div>
                <div
                  dir="ltr"
                  className="font-mono-code text-[10px] truncate text-right"
                  style={{ color: "var(--text-muted)" }}
                >
                  {adminUser.email}
                </div>
              </div>
            </div>
          )}

          <div
            className={`rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] font-extrabold ${
              compact ? "justify-center" : "justify-between"
            }`}
            style={{
              background: "var(--success-soft)",
              color: "var(--success-fg)",
            }}
            title={
              dbLatencyMs !== null
                ? `النظام متصل · ${dbLatencyMs}ms`
                : "النظام متصل"
            }
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
              {!compact && (
                <span className="truncate">
                  النظام متصل · {dbLatencyMs !== null ? `${dbLatencyMs}ms` : "..."}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex"
      style={{ background: "var(--bg-canvas)" }}
    >
      {/* Desktop Collapsible Right Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen border-l transition-all duration-200 z-30 ${
          sidebarCollapsed ? "w-[72px]" : "w-[248px]"
        }`}
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
        }}
      >
        {renderSidebarInner(sidebarCollapsed)}
      </aside>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="قائمة لوحة التحكم"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileNavOpen(false);
          }}
        >
          <aside
            className="w-[268px] max-w-[82vw] h-full border-l shadow-2xl"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-strong)",
            }}
          >
            {renderSidebarInner(false)}
          </aside>
        </div>
      )}

      {/* Main Fluid Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Executive Top Command Bar */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-xl"
          style={{
            background: "var(--atelier-topbar-bg, var(--bg-surface))",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="max-w-[1600px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2.5 sm:gap-4">
            {/* Start: Mobile Menu + Active Section Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="فتح قائمة التحكم"
                className="lg:hidden w-9.5 h-9.5 rounded-xl border inline-flex items-center justify-center cursor-pointer shrink-0"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <Menu className="w-4.5 h-4.5" />
              </button>

              <div className="min-w-0">
                <h1
                  className="text-[14.5px] sm:text-base font-black truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {activeNavMeta.label}
                </h1>
                <div
                  className="hidden sm:block text-[11px] font-semibold truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  مركز القيادة التنفيذي · {courses.length} مادة ·{" "}
                  {lessons.length} فصل
                </div>
              </div>
            </div>

            {/* Center: Quick Command Search Input (⌘K) */}
            <div
              ref={searchBoxRef}
              className="relative hidden md:block flex-1 max-w-md"
            >
              <Search
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                ref={searchInputRef}
                type="search"
                value={quickSearch}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && quickSearch.trim()) {
                    e.preventDefault();
                    handleSearchStudentsJump(quickSearch);
                  }
                }}
                placeholder="بحث سريع عن طالب أو قسم..."
                className="w-full h-9.5 pr-9 pl-12 rounded-xl border text-[12.5px] font-semibold outline-none transition-colors"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: searchFocused
                    ? "var(--brand-primary)"
                    : "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
              <kbd
                className="font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded-md border absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-muted)",
                }}
              >
                ⌘K
              </kbd>

              {/* Quick Jump Dropdown */}
              {searchFocused && (
                <div
                  className="absolute top-11 inset-x-0 rounded-2xl border p-2 shadow-xl space-y-1 z-50"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-strong)",
                  }}
                >
                  {quickSearch.trim() && (
                    <button
                      type="button"
                      onClick={() => handleSearchStudentsJump(quickSearch)}
                      className="w-full px-3 py-2 rounded-xl text-right text-[12.5px] font-extrabold flex items-center justify-between gap-2 cursor-pointer hover:bg-[var(--bg-hover)]"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      <span className="inline-flex items-center gap-2 truncate">
                        <Users className="w-4 h-4 shrink-0" />
                        <span>بحث في الطلاب عن «{quickSearch.trim()}»</span>
                      </span>
                      <span className="text-[10.5px] opacity-75">Enter</span>
                    </button>
                  )}

                  {matchingTabs.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          handleSelectTab(item.id);
                          setSearchFocused(false);
                          setQuickSearch("");
                        }}
                        className="w-full px-3 py-2 rounded-xl text-right text-[12.5px] font-bold flex items-center justify-between gap-2 cursor-pointer hover:bg-[var(--bg-hover)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <span className="inline-flex items-center gap-2 truncate">
                          <Icon
                            className="w-4 h-4 shrink-0"
                            style={{ color: "var(--text-muted)" }}
                          />
                          <span>{item.label}</span>
                        </span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className="font-mono-code text-[10.5px] px-1.5 py-0.2 rounded-full"
                            style={{
                              background: "var(--bg-subtle)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* End: Refresh + Notifications Bell + Portal Link + Theme + Sign Out */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={triggerOverviewRefresh}
                aria-label="تحديث البيانات"
                title="تحديث البيانات"
                className="w-9.5 h-9.5 rounded-xl border inline-flex items-center justify-center cursor-pointer transition-colors hover:opacity-85"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${overviewLoading ? "animate-spin" : ""}`}
                />
              </button>

              {/* Live Notification Bell + Popover */}
              <div ref={notifRef} className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((o) => !o)}
                  aria-label="مركز الإشعارات"
                  aria-expanded={notifOpen}
                  className="relative w-9.5 h-9.5 rounded-xl border inline-flex items-center justify-center cursor-pointer transition-colors hover:opacity-85"
                  style={{
                    background: notifOpen
                      ? "var(--brand-soft)"
                      : "var(--bg-surface)",
                    borderColor: notifOpen
                      ? "var(--brand-primary)"
                      : "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span
                      className="font-mono-code absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-white inline-flex items-center justify-center shadow"
                      style={{ background: "var(--danger-fg)" }}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div
                    className="absolute left-0 mt-2 w-[340px] sm:w-[400px] max-w-[92vw] rounded-3xl border shadow-2xl overflow-hidden z-50"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-strong)",
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b flex items-center justify-between gap-2"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[13.5px] font-black"
                          style={{ color: "var(--text-primary)" }}
                        >
                          الإشعارات الفورية
                        </span>
                        {unreadCount > 0 && (
                          <span
                            className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.2 rounded-full"
                            style={{
                              background: "var(--danger-soft)",
                              color: "var(--danger-fg)",
                            }}
                          >
                            {unreadCount} جديد
                          </span>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          disabled={notifBusyId === "all"}
                          onClick={() => void handleMarkAllRead()}
                          className="text-[11px] font-extrabold inline-flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-60"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>تحديد الكل كمقروء</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-[420px] overflow-y-auto divide-y" style={{ borderColor: "var(--border-soft)" }}>
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center space-y-1.5">
                          <Bell
                            className="w-7 h-7 mx-auto opacity-45"
                            style={{ color: "var(--text-muted)" }}
                          />
                          <div
                            className="text-[13px] font-extrabold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            لا توجد إشعارات بعد
                          </div>
                          <p
                            className="text-[11.5px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            ستظهر هنا تنبيهات الأجهزة، طلبات الاشتراك، ورسائل الطلاب.
                          </p>
                        </div>
                      ) : (
                        notifications.slice(0, 15).map((n) => {
                          const isSec = n.type === "security";
                          const isPay = n.type === "payment";
                          const Icon = isSec
                            ? ShieldAlert
                            : isPay
                              ? CreditCard
                              : MessageSquare;
                          const badgeBg = isSec
                            ? "var(--danger-soft)"
                            : isPay
                              ? "var(--accent-warm-soft)"
                              : "var(--success-soft)";
                          const badgeFg = isSec
                            ? "var(--danger-fg)"
                            : isPay
                              ? "var(--accent-warm-text)"
                              : "var(--success-fg)";

                          return (
                            <div
                              key={n.id}
                              className="p-3.5 space-y-2 transition-colors"
                              style={{
                                background: !n.isRead
                                  ? "var(--bg-canvas)"
                                  : "transparent",
                                borderColor: "var(--border-soft)",
                              }}
                            >
                              <div className="flex items-start gap-2.5">
                                <span
                                  className="w-8 h-8 rounded-xl inline-flex items-center justify-center shrink-0 mt-0.5"
                                  style={{
                                    background: badgeBg,
                                    color: badgeFg,
                                  }}
                                >
                                  <Icon className="w-4 h-4" />
                                </span>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span
                                      className="text-[12.5px] font-extrabold truncate"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      {n.title}
                                    </span>
                                    <span
                                      className="text-[10px] shrink-0"
                                      style={{ color: "var(--text-muted)" }}
                                    >
                                      {formatRelativeArabicTime(n.createdAt)}
                                    </span>
                                  </div>
                                  <p
                                    className="text-[11.5px] leading-relaxed line-clamp-2"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {n.body}
                                  </p>
                                </div>
                              </div>

                              {/* 1-Click Quick Actions */}
                              <div className="flex flex-wrap items-center gap-1.5 pr-10">
                                {isSec && n.userId && (
                                  <>
                                    <button
                                      type="button"
                                      disabled={
                                        notifBusyId === `freeze-${n.id}`
                                      }
                                      onClick={() =>
                                        void handleQuickFreezeFromNotif(n)
                                      }
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                                      style={{
                                        background: "var(--danger-soft)",
                                        color: "var(--danger-fg)",
                                      }}
                                    >
                                      <Lock className="w-3 h-3" />
                                      <span>تجميد فوري</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        void markSingleRead(n.id);
                                        setNotifOpen(false);
                                        setDrawerStudentId(n.userId);
                                      }}
                                      className="px-2.5 py-1 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                      style={{
                                        background: "var(--bg-surface)",
                                        borderColor: "var(--border-soft)",
                                        color: "var(--text-primary)",
                                      }}
                                    >
                                      <User className="w-3 h-3" />
                                      <span>عرض الطالب</span>
                                    </button>
                                  </>
                                )}

                                {isPay && (
                                  <button
                                    type="button"
                                    disabled={
                                      notifBusyId === `approve-${n.id}`
                                    }
                                    onClick={() =>
                                      void handleQuickApproveFromNotif(n)
                                    }
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-white inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                                    style={{ background: "var(--success-fg)" }}
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>قبول سريع / مراجعة</span>
                                  </button>
                                )}

                                {!isSec && !isPay && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleNotificationPrimaryAction(n)
                                    }
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                                    style={{
                                      background: "var(--success-soft)",
                                      color: "var(--success-fg)",
                                    }}
                                  >
                                    <Inbox className="w-3 h-3" />
                                    <span>فتح الرسالة</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/courses"
                className="px-3 h-9.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors hover:opacity-85 shrink-0"
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
                onClick={toggleTheme}
                aria-label="تبديل المظهر"
                title="تبديل المظهر"
                className="w-9.5 h-9.5 rounded-xl border inline-flex items-center justify-center cursor-pointer shrink-0 hover:opacity-85"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                {theme === "dark" ? (
                  <Sun
                    className="w-4 h-4"
                    style={{ color: "var(--brand-primary)" }}
                  />
                ) : (
                  <Moon
                    className="w-4 h-4"
                    style={{ color: "var(--brand-primary)" }}
                  />
                )}
              </button>

              <button
                type="button"
                disabled={signingOut}
                onClick={() => void handleSignOut()}
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج"
                className="px-2.5 h-9.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
                style={{
                  background: "var(--danger-soft)",
                  color: "var(--danger-fg)",
                }}
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">خروج</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace Container (up to 1600px) */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 portal-page-enter">
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

          {activeTab === "overview" && (
            <OverviewAnalyticsTab
              overview={overview}
              loading={overviewLoading}
              notifications={notifications}
              onNavigateTab={handleSelectTab}
              onInspectStudent={(id) => setDrawerStudentId(id)}
              onMarkAllNotificationsRead={() => void handleMarkAllRead()}
              onQuickNotificationAction={handleNotificationPrimaryAction}
              onOpenCreateStudent={handleOpenCreateStudent}
              onExportStudents={() => void handleExportStudents()}
            />
          )}

          {activeTab === "subscriptions" && (
            <SubscriptionsTab
              onStatsChanged={triggerOverviewRefresh}
              onInspectStudent={(id) => setDrawerStudentId(id)}
            />
          )}

          {activeTab === "students" && (
            <StudentsAnalyticsTab
              key={`${openCreateStudentTick}-${studentsJumpTick}`}
              currentAdminId={adminUser.id}
              courses={courses}
              lessons={lessons}
              initialShowCreate={openCreateStudentTick > 0}
              initialSearchQuery={studentsInitialSearch}
              onStatsChanged={triggerOverviewRefresh}
            />
          )}

          {activeTab === "courses" && (
            <CoursesCatalogTab
              courses={courses}
              lessons={lessons}
              courseStats={overview?.courseEnrollments ?? []}
              onStatsChanged={triggerOverviewRefresh}
            />
          )}

          {activeTab === "security" && (
            <SecurityAndInboxTab
              mode="security"
              onStatsChanged={triggerOverviewRefresh}
              onInspectStudent={(id) => setDrawerStudentId(id)}
            />
          )}

          {activeTab === "inbox" && (
            <SecurityAndInboxTab
              mode="inbox"
              onStatsChanged={triggerOverviewRefresh}
              onInspectStudent={(id) => setDrawerStudentId(id)}
            />
          )}

          {activeTab === "system" && (
            <SystemOperationsTab
              onStatsChanged={triggerOverviewRefresh}
              onDbLatency={setDbLatencyMs}
            />
          )}
        </main>
      </div>

      {/* Global Slide-Over Student 360° Inspector (when opened from Overview, Subscriptions, Security, Inbox, or Notifications) */}
      {drawerStudentId && (
        <StudentDetailModal
          key={drawerStudentId}
          studentId={drawerStudentId}
          currentAdminId={adminUser.id}
          courses={courses}
          lessons={lessons}
          variant="drawer"
          onClose={() => setDrawerStudentId(null)}
          onChanged={triggerOverviewRefresh}
        />
      )}
    </div>
  );
}
