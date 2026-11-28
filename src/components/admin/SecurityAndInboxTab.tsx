"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bug,
  Check,
  CheckCircle2,
  Clock,
  Inbox,
  Laptop,
  Lightbulb,
  Loader2,
  Lock,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  Unlock,
  User,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/auth/phone";
import { emitToast } from "@/lib/stores/events";
import {
  formatArabicDateTime,
  formatRelativeArabicTime,
  MESSAGE_TYPE_AR,
  type AdminMessageStatus,
  type AdminMessageType,
  type AdminNotificationItem,
  type AdminStudentItem,
  type AdminStudentMessageItem,
} from "@/components/admin/adminTypes";

export interface SecurityAndInboxTabProps {
  mode: "security" | "inbox";
  onStatsChanged: () => void;
  onInspectStudent: (studentId: string) => void;
}

type MsgStatusFilter = "open" | "resolved" | "all";
type MsgTypeFilter = "all" | AdminMessageType;

function pickDeviceIcon(name: string) {
  const lower = name.toLowerCase();
  if (
    lower.includes("iphone") ||
    lower.includes("android") ||
    lower.includes("samsung") ||
    lower.includes("mobile") ||
    lower.includes("ipad")
  ) {
    return Smartphone;
  }
  return Laptop;
}

export function SecurityAndInboxTab({
  mode,
  onStatsChanged,
  onInspectStudent,
}: SecurityAndInboxTabProps) {
  if (mode === "security") {
    return (
      <SecurityRadarView
        onStatsChanged={onStatsChanged}
        onInspectStudent={onInspectStudent}
      />
    );
  }
  return (
    <StudentInboxView
      onStatsChanged={onStatsChanged}
      onInspectStudent={onInspectStudent}
    />
  );
}

/* ============================================================================
   1. SECURITY RADAR & ANTI-SHARING VIEW
   ============================================================================ */

function SecurityRadarView({
  onStatsChanged,
  onInspectStudent,
}: {
  onStatsChanged: () => void;
  onInspectStudent: (studentId: string) => void;
}) {
  const [students, setStudents] = useState<AdminStudentItem[]>([]);
  const [alerts, setAlerts] = useState<AdminNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [studentsRes, notifRes] = await Promise.all([
          fetch("/api/admin/students?role=student", { cache: "no-store" }),
          fetch("/api/admin/notifications", { cache: "no-store" }),
        ]);

        const studentsJson = (await studentsRes.json()) as {
          students?: AdminStudentItem[];
          error?: string;
        };
        const notifJson = notifRes.ok
          ? ((await notifRes.json()) as {
              notifications?: AdminNotificationItem[];
            })
          : { notifications: [] };

        if (!active) return;
        if (!studentsRes.ok) {
          throw new Error(
            studentsJson.error || "تعذر تحميل بيانات رادار الأمان."
          );
        }

        setStudents(studentsJson.students ?? []);
        setAlerts(
          (notifJson.notifications ?? []).filter((n) => n.type === "security")
        );
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "تعذر تحميل بيانات رادار الأمان."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshTick]);

  const flaggedStudents = useMemo(() => {
    return students
      .filter(
        (s) =>
          Boolean(s.deviceAlert) ||
          Boolean(s.isSuspended) ||
          (s.devicesCount ?? 0) >= 2
      )
      .sort((a, b) => {
        const scoreA =
          (a.deviceAlert ? 4 : 0) +
          (a.isSuspended ? 2 : 0) +
          (a.devicesCount ?? 0);
        const scoreB =
          (b.deviceAlert ? 4 : 0) +
          (b.isSuspended ? 2 : 0) +
          (b.devicesCount ?? 0);
        return scoreB - scoreA;
      });
  }, [students]);

  const unreadAlertsCount = useMemo(
    () => alerts.filter((a) => !a.isRead).length,
    [alerts]
  );

  const suspendedCount = useMemo(
    () => students.filter((s) => s.isSuspended).length,
    [students]
  );

  async function runStudentSecurityAction(
    studentId: string,
    key: string,
    payload: Record<string, unknown>,
    successMsg: string
  ) {
    setBusyKey(key);
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "تعذر تنفيذ الإجراء الأمني.");
      }
      emitToast(successMsg);
      reload();
      onStatsChanged();
    } catch (err) {
      emitToast(
        err instanceof Error ? err.message : "تعذر تنفيذ الإجراء الأمني."
      );
    } finally {
      setBusyKey(null);
    }
  }

  async function markAlertRead(id: string) {
    setBusyKey(`read-${id}`);
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
      onStatsChanged();
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header & Summary Strip */}
      <section className="surface-card rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-10 h-10 rounded-2xl inline-flex items-center justify-center shrink-0"
            style={{
              background: "var(--danger-soft)",
              color: "var(--danger-fg)",
            }}
          >
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h2
              className="text-base sm:text-lg font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              رادار الأجهزة والمخالفات
            </h2>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              رصد محاولات مشاركة الحساب وتجاوز حد الأجهزة المسموح بأسماء الأجهزة الدقيقة.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span
            className="px-3 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5"
            style={{
              background:
                unreadAlertsCount > 0 ? "var(--danger-soft)" : "var(--bg-subtle)",
              color:
                unreadAlertsCount > 0
                  ? "var(--danger-fg)"
                  : "var(--text-secondary)",
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>تنبيهات جديدة: {unreadAlertsCount}</span>
          </span>

          <span
            className="px-3 py-1.5 rounded-xl text-[12px] font-extrabold"
            style={{
              background: "var(--accent-warm-soft)",
              color: "var(--accent-warm-text)",
            }}
          >
            حسابات مجمدة: {suspendedCount}
          </span>

          <button
            type="button"
            onClick={reload}
            aria-label="تحديث الرادار"
            className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>

      {error && (
        <div
          className="rounded-2xl px-4 py-3 text-[13px] font-bold flex items-center justify-between gap-3"
          style={{
            background: "var(--danger-soft)",
            color: "var(--danger-fg)",
          }}
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="px-3 py-1 rounded-lg bg-white/90 text-slate-900 text-[12px] font-extrabold cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Security Notifications Feed */}
      <section className="surface-card rounded-3xl p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-[14.5px] font-black flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <AlertTriangle
              className="w-4 h-4"
              style={{ color: "var(--danger-fg)" }}
            />
            <span>سجل محاولات الاختراق وتجاوز الأجهزة ({alerts.length})</span>
          </h3>
        </div>

        {loading && alerts.length === 0 ? (
          <div className="space-y-2.5">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-20 rounded-2xl animate-pulse"
                style={{ background: "var(--bg-subtle)" }}
              />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-6 text-center space-y-1.5"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
            }}
          >
            <CheckCircle2
              className="w-7 h-7 mx-auto"
              style={{ color: "var(--success-fg)" }}
            />
            <div
              className="text-[13.5px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              الوضع الأمني هادئ تماماً
            </div>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              لم يتم رصد أي محاولات لتجاوز حد الأجهزة المسموح بها حتى الآن.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.map((alert) => {
              const userId = alert.userId;
              return (
                <div
                  key={alert.id}
                  className="rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: !alert.isRead
                      ? "var(--danger-fg)"
                      : "var(--border-soft)",
                  }}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!alert.isRead && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: "var(--danger-fg)" }}
                        />
                      )}
                      <span
                        className="text-[13.5px] font-black"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {alert.title}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold"
                        style={{
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }}
                      >
                        {alert.severity === "critical" ? "تنبيه عاجل" : "تحذير"}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatRelativeArabicTime(alert.createdAt)} ·{" "}
                        {formatArabicDateTime(alert.createdAt)}
                      </span>
                    </div>
                    <p
                      className="text-[12.5px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {alert.body}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {userId && (
                      <>
                        <button
                          type="button"
                          disabled={busyKey === `freeze-alert-${alert.id}`}
                          onClick={() =>
                            void runStudentSecurityAction(
                              userId,
                              `freeze-alert-${alert.id}`,
                              {
                                action: "suspend",
                                reason:
                                  "تم تجميد الحساب مؤقتاً بسبب محاولة مشاركة الحساب على أكثر من جهاز.",
                              },
                              "تم تجميد الحساب وطرد جميع الجلسات ✓"
                            )
                          }
                          className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                          style={{
                            background: "var(--danger-soft)",
                            color: "var(--danger-fg)",
                          }}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>تجميد الحساب</span>
                        </button>

                        <button
                          type="button"
                          disabled={busyKey === `reset-alert-${alert.id}`}
                          onClick={() =>
                            void runStudentSecurityAction(
                              userId,
                              `reset-alert-${alert.id}`,
                              { action: "reset_devices" },
                              "تم إعادة ضبط جميع أجهزة الطالب ✓"
                            )
                          }
                          className="min-h-[34px] px-3 py-1 rounded-xl border text-[11.5px] font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>إعادة ضبط الأجهزة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onInspectStudent(userId)}
                          className="min-h-[34px] px-3 py-1 rounded-xl border text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                          style={{
                            background: "var(--brand-soft)",
                            borderColor: "transparent",
                            color: "var(--brand-soft-text)",
                          }}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>فتح ملف الطالب</span>
                        </button>
                      </>
                    )}

                    {!alert.isRead && (
                      <button
                        type="button"
                        disabled={busyKey === `read-${alert.id}`}
                        onClick={() => void markAlertRead(alert.id)}
                        className="min-h-[34px] px-2.5 py-1 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>مقروء</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Flagged / Multi-Device / Suspended Students */}
      <section className="surface-card rounded-3xl p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-[14.5px] font-black"
            style={{ color: "var(--text-primary)" }}
          >
            الحسابات متعددة الأجهزة أو المجمّدة ({flaggedStudents.length})
          </h3>
          <span
            className="text-[11.5px]"
            style={{ color: "var(--text-muted)" }}
          >
            يعرض أي طالب لديه جهازين فأكثر، تنبيه أمني، أو تجميد نشط
          </span>
        </div>

        {loading && students.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-32 rounded-2xl animate-pulse"
                style={{ background: "var(--bg-subtle)" }}
              />
            ))}
          </div>
        ) : flaggedStudents.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-6 text-center text-[12.5px]"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-muted)",
            }}
          >
            لا توجد حسابات مجمّدة أو عليها تنبيهات أجهزة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {flaggedStudents.map((st) => {
              const baseWa = st.phone ? buildWhatsAppLink(st.phone) : null;
              const waLink = baseWa
                ? `${baseWa}?text=${encodeURIComponent(
                    `أهلاً يا ${st.fullName}، لاحظنا تسجيل دخول لحسابك على المنصة من أكثر من جهاز:`
                  )}`
                : null;
              const devicesList = st.activeDeviceNames ?? [];
              return (
                <article
                  key={st.id}
                  className="rounded-2xl border p-4 space-y-3"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor:
                      st.isSuspended || st.deviceAlert
                        ? "var(--danger-fg)"
                        : "var(--border-soft)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="text-[14px] font-black truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {st.fullName}
                        </span>
                        {st.isSuspended && (
                          <span
                            className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold"
                            style={{
                              background: "var(--danger-soft)",
                              color: "var(--danger-fg)",
                            }}
                          >
                            مجمّد
                          </span>
                        )}
                        {st.deviceAlert && (
                          <span
                            className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold"
                            style={{
                              background: "var(--accent-warm-soft)",
                              color: "var(--accent-warm-text)",
                            }}
                          >
                            تنبيه أجهزة
                          </span>
                        )}
                      </div>
                      <div
                        dir="ltr"
                        className="font-mono-code text-[11px] text-right truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {st.email}
                        {st.phone ? ` · ${st.phone}` : ""}
                      </div>
                    </div>

                    <span
                      className="font-mono-code px-2.5 py-1 rounded-xl text-[11.5px] font-extrabold shrink-0"
                      style={{
                        background: "var(--bg-subtle)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {st.devicesCount ?? devicesList.length} أجهزة
                    </span>
                  </div>

                  {st.isSuspended && st.suspendReason && (
                    <div
                      className="rounded-xl px-3 py-2 text-[11.5px] font-bold"
                      style={{
                        background: "var(--danger-soft)",
                        color: "var(--danger-fg)",
                      }}
                    >
                      سبب التجميد: {st.suspendReason}
                    </div>
                  )}

                  {devicesList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {devicesList.map((dev, idx) => {
                        const DevIcon = pickDeviceIcon(dev);
                        return (
                          <span
                            key={`${st.id}-dev-${idx}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11.5px] font-bold"
                            style={{
                              background: "var(--bg-surface)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <DevIcon
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: "var(--brand-primary)" }}
                            />
                            <span dir="ltr" className="font-en">
                              {dev}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className="pt-2.5 border-t flex flex-wrap items-center gap-1.5"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    {st.isSuspended ? (
                      <button
                        type="button"
                        disabled={busyKey === `unsuspend-${st.id}`}
                        onClick={() =>
                          void runStudentSecurityAction(
                            st.id,
                            `unsuspend-${st.id}`,
                            { action: "unsuspend" },
                            `تم فك تجميد حساب ${st.fullName} ✓`
                          )
                        }
                        className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                        style={{
                          background: "var(--success-soft)",
                          color: "var(--success-fg)",
                        }}
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>فك التجميد</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busyKey === `suspend-${st.id}`}
                        onClick={() =>
                          void runStudentSecurityAction(
                            st.id,
                            `suspend-${st.id}`,
                            {
                              action: "suspend",
                              reason:
                                "تم تجميد الحساب لمخالفة سياسة الأجهزة. تواصل مع م. أحمد.",
                            },
                            `تم تجميد حساب ${st.fullName} ✓`
                          )
                        }
                        className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                        style={{
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>تجميد الحساب</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={busyKey === `reset-${st.id}`}
                      onClick={() =>
                        void runStudentSecurityAction(
                          st.id,
                          `reset-${st.id}`,
                          { action: "reset_devices" },
                          `تم إعادة ضبط أجهزة ${st.fullName} ✓`
                        )
                      }
                      className="min-h-[34px] px-3 py-1 rounded-xl border text-[11.5px] font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة ضبط الأجهزة</span>
                    </button>

                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 hover:opacity-85"
                        style={{
                          background: "var(--success-soft)",
                          color: "var(--success-fg)",
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onInspectStudent(st.id)}
                      className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer mr-auto"
                      style={{
                        background: "var(--brand-soft)",
                        color: "var(--brand-soft-text)",
                      }}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>فتح ملف الطالب</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================================
   2. STUDENT MESSAGES & BUG REPORTS INBOX VIEW
   ============================================================================ */

function StudentInboxView({
  onStatsChanged,
  onInspectStudent,
}: {
  onStatsChanged: () => void;
  onInspectStudent: (studentId: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<MsgStatusFilter>("open");
  const [typeFilter, setTypeFilter] = useState<MsgTypeFilter>("all");
  const [messages, setMessages] = useState<AdminStudentMessageItem[]>([]);
  const [openCount, setOpenCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/messages?status=${statusFilter}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          messages?: AdminStudentMessageItem[];
          openCount?: number;
          error?: string;
        };
        if (!active) return;
        if (!res.ok) {
          throw new Error(data.error || "تعذر تحميل رسائل الطلاب.");
        }
        setMessages(data.messages ?? []);
        setOpenCount(data.openCount ?? 0);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "تعذر تحميل رسائل الطلاب."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [statusFilter, refreshTick]);

  const filteredMessages = useMemo(() => {
    if (typeFilter === "all") return messages;
    return messages.filter((m) => m.type === typeFilter);
  }, [messages, typeFilter]);

  async function toggleMessageStatus(
    msg: AdminStudentMessageItem,
    nextStatus: AdminMessageStatus
  ) {
    setBusyId(msg.id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, status: nextStatus }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "تعذر تحديث حالة الرسالة.");
      }
      emitToast(
        nextStatus === "resolved"
          ? "تم تحديد الرسالة كمُحلّة ✓"
          : "تم إعادة فتح الرسالة"
      );
      reload();
      onStatsChanged();
    } catch (err) {
      emitToast(
        err instanceof Error ? err.message : "تعذر تحديث حالة الرسالة."
      );
    } finally {
      setBusyId(null);
    }
  }

  function typeBadge(type: AdminMessageType) {
    if (type === "bug") {
      return {
        icon: Bug,
        bg: "var(--danger-soft)",
        fg: "var(--danger-fg)",
        label: MESSAGE_TYPE_AR.bug,
      };
    }
    if (type === "suggest") {
      return {
        icon: Lightbulb,
        bg: "var(--accent-warm-soft)",
        fg: "var(--accent-warm-text)",
        label: MESSAGE_TYPE_AR.suggest,
      };
    }
    return {
      icon: MessageSquare,
      bg: "var(--brand-soft)",
      fg: "var(--brand-soft-text)",
      label: MESSAGE_TYPE_AR.support,
    };
  }

  return (
    <div className="space-y-5">
      {/* Header & Filter Bar */}
      <section className="surface-card rounded-3xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-10 h-10 rounded-2xl inline-flex items-center justify-center shrink-0"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              <Inbox className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2
                className="text-base sm:text-lg font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                رسائل وبلاغات الطلاب
              </h2>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                تبليغات الأخطاء، اقتراحات المواد الجديدة، ورسائل الدعم المباشر.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {(
              [
                { value: "open", label: "مفتوحة" },
                { value: "resolved", label: "مُحلّة" },
                { value: "all", label: "الكل" },
              ] as const
            ).map((f) => {
              const active = statusFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(f.value);
                    setLoading(true);
                  }}
                  className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
                    active ? "active" : ""
                  }`}
                >
                  <span>{f.label}</span>
                  {f.value === "open" && openCount > 0 && (
                    <span
                      className="font-mono-code text-[10.5px] px-1.5 rounded-full"
                      style={{
                        background: active
                          ? "rgba(255,255,255,0.22)"
                          : "var(--success-soft)",
                        color: active ? "#ffffff" : "var(--success-fg)",
                      }}
                    >
                      {openCount}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={reload}
              aria-label="تحديث الرسائل"
              className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
          {(
            [
              { value: "all", label: "كل الأنواع" },
              { value: "bug", label: "تبليغ خطأ" },
              { value: "suggest", label: "اقتراح مادة" },
              { value: "support", label: "رسالة" },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTypeFilter(t.value)}
              className={`filter-pill min-h-[32px] px-3 py-1 rounded-xl text-[11.5px] font-bold cursor-pointer ${
                typeFilter === t.value ? "active-warm" : ""
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {error ? (
        <div
          className="surface-card rounded-3xl p-6 text-center space-y-3"
          style={{ color: "var(--danger-fg)" }}
        >
          <p className="text-[13.5px] font-bold">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="px-4 py-2 rounded-xl text-[12px] font-extrabold text-white cursor-pointer"
            style={{ background: "var(--accent-warm)" }}
          >
            إعادة المحاولة
          </button>
        </div>
      ) : loading && messages.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-32 rounded-3xl animate-pulse"
              style={{ background: "var(--bg-subtle)" }}
            />
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div
          className="surface-card rounded-3xl p-10 text-center space-y-2"
          style={{ borderStyle: "dashed" }}
        >
          <CheckCircle2
            className="w-8 h-8 mx-auto opacity-75"
            style={{ color: "var(--success-fg)" }}
          />
          <div
            className="text-[15px] font-black"
            style={{ color: "var(--text-primary)" }}
          >
            صندوق الوارد نظيف تماماً
          </div>
          <p className="text-[12.5px]" style={{ color: "var(--text-muted)" }}>
            لا توجد رسائل أو بلاغات مطابقة لخيارات الفلترة الحالية.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const badge = typeBadge(msg.type);
            const BadgeIcon = badge.icon;
            const baseWa = msg.senderPhone
              ? buildWhatsAppLink(msg.senderPhone)
              : null;
            const waLink = baseWa
              ? `${baseWa}?text=${encodeURIComponent(
                  `أهلاً يا ${msg.senderName}، بخصوص رسالتك «${msg.title}» على المنصة:`
                )}`
              : null;
            const isBusy = busyId === msg.id;

            return (
              <article
                key={msg.id}
                className="surface-card rounded-3xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2.5">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                        style={{ background: badge.bg, color: badge.fg }}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                        style={{
                          background:
                            msg.status === "resolved"
                              ? "var(--success-soft)"
                              : "var(--bg-subtle)",
                          color:
                            msg.status === "resolved"
                              ? "var(--success-fg)"
                              : "var(--text-secondary)",
                        }}
                      >
                        {msg.status === "resolved" ? "تم الحل ✓" : "مفتوح"}
                      </span>
                      <span
                        className="text-[11px] inline-flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatRelativeArabicTime(msg.createdAt)} ·{" "}
                          {formatArabicDateTime(msg.createdAt)}
                        </span>
                      </span>
                    </div>

                    <h3
                      className="text-[15px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {msg.title}
                    </h3>
                  </div>

                  <div className="text-left shrink-0">
                    <div
                      className="text-[13px] font-extrabold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {msg.senderName}
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono-code text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {msg.senderPhone || msg.senderEmail || "زائر"}
                    </div>
                  </div>
                </div>

                <p
                  className="rounded-2xl border p-3.5 text-[13px] leading-relaxed whitespace-pre-wrap"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {msg.body}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 hover:opacity-85"
                        style={{
                          background: "var(--success-soft)",
                          color: "var(--success-fg)",
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>الرد عبر واتساب</span>
                      </a>
                    )}

                    {msg.userId && (
                      <button
                        type="button"
                        onClick={() => onInspectStudent(msg.userId!)}
                        className="min-h-[36px] px-3 py-1.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>فتح ملف الطالب</span>
                      </button>
                    )}
                  </div>

                  {msg.status === "open" ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void toggleMessageStatus(msg, "resolved")}
                      className="min-h-[38px] px-4 py-1.5 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer hover:opacity-95 disabled:opacity-60"
                      style={{ background: "var(--success-fg)" }}
                    >
                      {isBusy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>تحديد كمُحل ✓</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void toggleMessageStatus(msg, "open")}
                      className="min-h-[36px] px-3.5 py-1.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {isBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                      <span>إعادة فتح</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
