"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Dices,
  KeyRound,
  Laptop,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  MonitorSmartphone,
  RotateCcw,
  Save,
  Shield,
  Smartphone,
  Trash2,
  Unlock,
  UserCog,
  X,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/auth/phone";
import { emitToast } from "@/lib/stores/events";
import {
  formatArabicDate,
  formatArabicDateTime,
  formatRelativeArabicTime,
  type AdminCourseOption,
  type AdminLessonOption,
  type AdminStudentCourseBreakdown,
  type AdminStudentDetailData,
  type AdminStudentDevice,
} from "@/components/admin/adminTypes";

export interface StudentDetailModalProps {
  studentId: string;
  currentAdminId: string;
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
  variant?: "drawer" | "inline";
  onClose: () => void;
  onChanged: () => void;
}

type InspectorTab = "courses" | "devices" | "profile" | "activity";

function randomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let out = "CS";
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function getDeviceIcon(deviceName: string, os?: string | null) {
  const text = `${deviceName} ${os ?? ""}`.toLowerCase();
  if (
    text.includes("iphone") ||
    text.includes("android") ||
    text.includes("samsung") ||
    text.includes("ios") ||
    text.includes("ipad") ||
    text.includes("mobile")
  ) {
    return Smartphone;
  }
  return Laptop;
}

export function StudentDetailModal({
  studentId,
  currentAdminId,
  courses,
  lessons,
  variant = "drawer",
  onClose,
  onChanged,
}: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("courses");
  const [detail, setDetail] = useState<AdminStudentDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // Course expand & toggle state
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null);

  // Suspend / Unsuspend UI state
  const [showSuspendBox, setShowSuspendBox] = useState<boolean>(false);
  const [suspendReasonInput, setSuspendReasonInput] = useState<string>(
    "تم تجميد الحساب لمخالفة سياسة الأجهزة. برجاء التواصل مع م. أحمد."
  );
  const [busyAction, setBusyAction] = useState<string | null>(null);

  // Profile editor state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [yearLevel, setYearLevel] = useState(2);
  const [department, setDepartment] = useState("CS");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [examDate, setExamDate] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [revokeSessionsOnReset, setRevokeSessionsOnReset] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Danger zone state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    if (variant !== "drawer") return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, variant]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/students/${studentId}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as AdminStudentDetailData & {
          error?: string;
        };
        if (!active) return;
        if (!res.ok) throw new Error(json.error || "تعذر تحميل ملف الطالب.");
        setDetail(json);
        setFullName(json.student.fullName);
        setEmail(json.student.email);
        setPhone(json.student.phone ?? "");
        setYearLevel(json.student.yearLevel);
        setDepartment(json.student.department);
        setRole(json.student.role);
        setExamDate(json.student.examDate ?? "");
        if (json.student.suspendReason) {
          setSuspendReasonInput(json.student.suspendReason);
        }
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "تعذر تحميل ملف الطالب."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [studentId, refreshTick]);

  // Build resilient courseBreakdown (uses API courseBreakdown when provided, otherwise derives cleanly)
  const courseBreakdown = useMemo<AdminStudentCourseBreakdown[]>(() => {
    if (!detail) return [];
    if (detail.courseBreakdown && detail.courseBreakdown.length > 0) {
      return detail.courseBreakdown;
    }

    const activeEnrollments = detail.enrollments.filter(
      (e) => e.status === "active"
    );
    const hasBundle = activeEnrollments.some((e) => e.scopeType === "bundle");
    const enrolledCourseIds = new Set(
      activeEnrollments
        .filter((e) => e.scopeType === "course")
        .map((e) => e.targetId)
    );
    const progressByLesson = new Map(
      detail.progress.map((p) => [p.lessonId, p])
    );

    return courses.map((course) => {
      const courseLessons = lessons.filter((l) => l.courseId === course.id);
      const chapterGrades = courseLessons.map((l) => {
        const p = progressByLesson.get(l.id);
        return {
          lessonId: l.id,
          title: l.title,
          orderIndex: l.orderIndex,
          isCompleted: Boolean(p?.isCompleted),
          bestQuizScore: p?.bestQuizScore ?? null,
          updatedAt: p?.updatedAt ?? null,
        };
      });

      const completed = chapterGrades.filter((c) => c.isCompleted);
      const scores = chapterGrades
        .map((c) => c.bestQuizScore)
        .filter((s): s is number => s !== null);
      const avg =
        scores.length > 0
          ? Math.round(scores.reduce((acc, n) => acc + n, 0) / scores.length)
          : null;
      const lastCompleted = completed[completed.length - 1] ?? null;

      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        isPaid: course.isPaid,
        isEnrolled: !course.isPaid || hasBundle || enrolledCourseIds.has(course.id),
        completedCount: completed.length,
        totalLessons: courseLessons.length,
        lastLessonTitle: lastCompleted?.title ?? null,
        averageQuizScore: avg,
        chapterGrades,
      };
    });
  }, [detail, courses, lessons]);

  // Build resilient devices list
  const devices = useMemo<AdminStudentDevice[]>(() => {
    if (!detail) return [];
    if (detail.devices && detail.devices.length > 0) {
      return detail.devices;
    }
    // Fallback from sessions if devices table is empty
    return detail.sessions.map((s) => ({
      id: s.id,
      deviceId: s.deviceId || s.id,
      deviceName: s.deviceName || s.userAgent || "متصفح غير محدد",
      browser: null,
      os: null,
      ipAddress: s.ipAddress ?? null,
      lastSeenAt: s.lastSeenAt ?? s.createdAt,
      isActiveNow: s.isActive,
      isBlocked: false,
    }));
  }, [detail]);

  const isSelf = studentId === currentAdminId;
  const isSuspended = Boolean(detail?.student.isSuspended);
  const isOnline = devices.some((d) => d.isActiveNow) ||
    Boolean(detail?.sessions.some((s) => s.isActive));

  async function runPatchAction(
    key: string,
    body: Record<string, unknown>,
    successMsg: string
  ) {
    setBusyAction(key);
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "تعذر تنفيذ العملية.");
      }
      emitToast(successMsg);
      setShowSuspendBox(false);
      reload();
      onChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر تنفيذ العملية.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleToggleCourse(
    courseId: string,
    courseTitle: string,
    nextGrant: boolean
  ) {
    setTogglingCourseId(courseId);
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_course",
          courseId,
          grant: nextGrant,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "تعذر تحديث صلاحية المادة.");
      }
      emitToast(
        nextGrant
          ? `تم فتح مادة «${courseTitle}» للطالب فوراً ✓`
          : `تم إغلاق مادة «${courseTitle}» عن الطالب`
      );
      reload();
      onChanged();
    } catch (err) {
      emitToast(
        err instanceof Error ? err.message : "تعذر تحديث صلاحية المادة."
      );
    } finally {
      setTogglingCourseId(null);
    }
  }

  async function handleSaveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          yearLevel,
          department,
          role,
          examDate: examDate.trim() || null,
          newPassword: newPassword || undefined,
          revokeSessionsOnReset,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        passwordChanged?: boolean;
        error?: string;
      };
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "تعذر حفظ التعديلات.");
      }
      emitToast(
        json.passwordChanged
          ? "تم حفظ البيانات وتغيير كلمة المرور ✓"
          : "تم حفظ بيانات الطالب ✓"
      );
      setNewPassword("");
      reload();
      onChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر حفظ التعديلات.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleDeleteUser() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "تعذر حذف الحساب.");
      }
      emitToast("تم حذف الحساب نهائياً.");
      onChanged();
      onClose();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر حذف الحساب.");
    } finally {
      setDeleting(false);
    }
  }

  const baseWaLink = detail?.student.phone
    ? buildWhatsAppLink(detail.student.phone)
    : null;
  const waLink =
    baseWaLink && detail
      ? `${baseWaLink}?text=${encodeURIComponent(
          `أهلاً يا ${detail.student.fullName}، معك م. أحمد عامر من بوابة CS Portal:`
        )}`
      : null;

  const inspectorBody = (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div
        className="p-5 border-b space-y-3.5 shrink-0"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Shield className="w-3 h-3" />
                <span>ملف الطالب 360°</span>
              </span>

              {isSuspended ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                  style={{
                    background: "var(--danger-soft)",
                    color: "var(--danger-fg)",
                  }}
                >
                  <Lock className="w-3 h-3" />
                  <span>حساب مجمّد</span>
                </span>
              ) : isOnline ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span>متصل</span>
                </span>
              ) : null}

              {detail?.student.role === "admin" && (
                <span
                  className="font-en px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>

            <h3
              id="studentInspectorTitle"
              className="text-lg font-black truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {detail?.student.fullName ?? "جاري تحميل ملف الطالب..."}
            </h3>

            {detail && (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px]">
                <span
                  dir="ltr"
                  className="font-mono-code truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {detail.student.email}
                </span>
                {detail.student.phone && (
                  <span
                    dir="ltr"
                    className="font-mono-code font-bold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {detail.student.phone}
                  </span>
                )}
                <span
                  className="font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  ف{detail.student.yearLevel} · {detail.student.department}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer shrink-0 hover:opacity-80"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Quick Actions: WhatsApp + Freeze / Unfreeze */}
        {detail && (
          <div className="flex flex-wrap items-center gap-2">
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 hover:opacity-85"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>تواصل واتساب</span>
              </a>
            )}

            {!isSelf &&
              (isSuspended ? (
                <button
                  type="button"
                  disabled={busyAction === "unsuspend"}
                  onClick={() =>
                    void runPatchAction(
                      "unsuspend",
                      { action: "unsuspend" },
                      "تم فك تجميد الحساب بنجاح ✓"
                    )
                  }
                  className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  {busyAction === "unsuspend" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                  <span>فك التجميد</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSuspendBox((v) => !v)}
                  className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  style={{
                    background: "var(--danger-soft)",
                    color: "var(--danger-fg)",
                  }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>تجميد الحساب</span>
                </button>
              ))}

            <span
              className="text-[11px] font-semibold mr-auto"
              style={{ color: "var(--text-muted)" }}
            >
              انضم {formatArabicDate(detail.student.createdAt)}
            </span>
          </div>
        )}

        {/* Active Suspend Reason Banner */}
        {detail && isSuspended && detail.student.suspendReason && (
          <div
            className="rounded-xl px-3 py-2 text-[11.5px] font-bold"
            style={{
              background: "var(--danger-soft)",
              color: "var(--danger-fg)",
            }}
          >
            سبب التجميد الحالي: {detail.student.suspendReason}
          </div>
        )}

        {/* Inline Suspend Reason Input */}
        {showSuspendBox && !isSuspended && (
          <div
            className="rounded-2xl border p-3 space-y-2.5"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--danger-fg)",
            }}
          >
            <label
              htmlFor="suspendReasonInput"
              className="block text-[11.5px] font-extrabold"
              style={{ color: "var(--danger-fg)" }}
            >
              سبب التجميد (سيظهر للطالب عند محاولة الدخول):
            </label>
            <input
              id="suspendReasonInput"
              type="text"
              value={suspendReasonInput}
              onChange={(e) => setSuspendReasonInput(e.target.value)}
              className="w-full min-h-[38px] px-3 py-1.5 rounded-xl border text-[12px] font-semibold outline-none"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busyAction === "suspend"}
                onClick={() =>
                  void runPatchAction(
                    "suspend",
                    {
                      action: "suspend",
                      reason: suspendReasonInput.trim(),
                    },
                    "تم تجميد الحساب وطرد جميع الجلسات ✓"
                  )
                }
                className="min-h-[34px] px-3.5 py-1 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                style={{ background: "var(--danger-fg)" }}
              >
                {busyAction === "suspend" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>تأكيد التجميد</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSuspendBox(false)}
                className="min-h-[34px] px-3 py-1 rounded-xl border text-[12px] font-bold cursor-pointer"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* 4 Compact Inner Section Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {(
            [
              {
                id: "courses",
                label: "المواد والدرجات",
                icon: BookOpen,
                count: courseBreakdown.length,
              },
              {
                id: "devices",
                label: "الأجهزة والأمان",
                icon: MonitorSmartphone,
                count: devices.length,
              },
              { id: "profile", label: "البيانات", icon: UserCog },
              { id: "activity", label: "الأخطاء وAI", icon: Award },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`filter-pill min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
                  active ? "active" : ""
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {"count" in t && detail && (
                  <span className="font-mono-code text-[10px] opacity-80">
                    ({t.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {loading && !detail ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-16 rounded-2xl animate-pulse"
                style={{ background: "var(--bg-subtle)" }}
              />
            ))}
          </div>
        ) : error || !detail ? (
          <div
            className="rounded-2xl p-5 text-center text-[13px] font-bold space-y-2"
            style={{
              background: "var(--danger-soft)",
              color: "var(--danger-fg)",
            }}
          >
            <div>{error || "تعذر تحميل بيانات الطالب."}</div>
            <button
              type="button"
              onClick={reload}
              className="px-3.5 py-1.5 rounded-xl bg-white/90 text-slate-900 text-[12px] font-extrabold cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            {/* TAB 1: PER-COURSE PROGRESS, QUIZ GRADES & INSTANT ACCESS SWITCHES */}
            {activeTab === "courses" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[12px] font-extrabold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    تحكم فوري في فتح/إغلاق المواد ومتابعة الدرجات
                  </span>
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    اضغط على أي مادة لعرض درجات الفصول
                  </span>
                </div>

                {courseBreakdown.map((item) => {
                  const courseMeta = courses.find((c) => c.id === item.courseId);
                  const code = item.courseCode || item.code || courseMeta?.code || "CS";
                  const title =
                    item.courseTitle || item.title || courseMeta?.title || "مادة";
                  const pct =
                    item.totalLessons > 0
                      ? Math.round((item.completedCount / item.totalLessons) * 100)
                      : 0;
                  const expanded = expandedCourseId === item.courseId;
                  const isToggling = togglingCourseId === item.courseId;

                  return (
                    <div
                      key={item.courseId}
                      className="rounded-2xl border overflow-hidden transition-colors"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: item.isEnrolled
                          ? "var(--border-strong)"
                          : "var(--border-soft)",
                      }}
                    >
                      <div className="p-3.5 space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCourseId((prev) =>
                                prev === item.courseId ? null : item.courseId
                              )
                            }
                            className="text-right min-w-0 flex-1 space-y-1 cursor-pointer"
                          >
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className="font-en px-2 py-0.5 rounded-md text-[10.5px] font-extrabold"
                                style={{
                                  background: "var(--brand-soft)",
                                  color: "var(--brand-soft-text)",
                                }}
                              >
                                {code}
                              </span>
                              <span
                                className="text-[13.5px] font-black truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {title}
                              </span>
                              {item.averageQuizScore !== null && (
                                <span
                                  className="font-mono-code px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                                  style={{
                                    background:
                                      item.averageQuizScore >= 75
                                        ? "var(--success-soft)"
                                        : "var(--accent-warm-soft)",
                                    color:
                                      item.averageQuizScore >= 75
                                        ? "var(--success-fg)"
                                        : "var(--accent-warm-text)",
                                  }}
                                >
                                  كويز {item.averageQuizScore}%
                                </span>
                              )}
                            </div>

                            <div
                              className="text-[11.5px] font-semibold flex flex-wrap items-center gap-x-2"
                              style={{ color: "var(--text-muted)" }}
                            >
                              <span>
                                {item.lastLessonTitle
                                  ? `وصل لـ: ${item.lastLessonTitle}`
                                  : "لم يبدأ بعد"}
                              </span>
                              <span>·</span>
                              <span className="font-mono-code font-bold">
                                أنجز {item.completedCount}/{item.totalLessons}
                              </span>
                              {expanded ? (
                                <ChevronUp className="w-3.5 h-3.5 inline" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 inline" />
                              )}
                            </div>
                          </button>

                          {/* Instant Access Toggle Switch */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={item.isEnrolled}
                              aria-label={`فتح أو إغلاق ${title}`}
                              disabled={isToggling}
                              onClick={() =>
                                void handleToggleCourse(
                                  item.courseId,
                                  title,
                                  !item.isEnrolled
                                )
                              }
                              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-60"
                              style={{
                                background: item.isEnrolled
                                  ? "var(--success-fg)"
                                  : "var(--bg-subtle)",
                                border: "1px solid var(--border-soft)",
                              }}
                            >
                              {isToggling ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-white" />
                              ) : (
                                <span
                                  className="inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform"
                                  style={{
                                    transform: item.isEnrolled
                                      ? "translateX(-22px)"
                                      : "translateX(-2px)",
                                  }}
                                />
                              )}
                            </button>
                            <span
                              className="text-[10px] font-extrabold"
                              style={{
                                color: item.isEnrolled
                                  ? "var(--success-fg)"
                                  : "var(--text-muted)",
                              }}
                            >
                              {item.isEnrolled ? "مفتوحة" : "مغلقة"}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: "var(--bg-subtle)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background:
                                pct === 100
                                  ? "var(--success-fg)"
                                  : "var(--brand-primary)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Expandable Chapter-by-Chapter Grades */}
                      {expanded && (
                        <div
                          className="border-t px-3.5 py-2.5 space-y-1.5"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          {item.chapterGrades.length === 0 ? (
                            <p
                              className="text-[11.5px] py-1"
                              style={{ color: "var(--text-muted)" }}
                            >
                              لا توجد فصول مضافة لهذه المادة بعد.
                            </p>
                          ) : (
                            item.chapterGrades.map((ch, idx) => (
                              <div
                                key={ch.lessonId}
                                className="flex items-center justify-between gap-2 text-[12px] py-1"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 shrink-0"
                                    style={{
                                      color: ch.isCompleted
                                        ? "var(--success-fg)"
                                        : "var(--border-strong)",
                                    }}
                                  />
                                  <span
                                    className="font-mono-code text-[10.5px] font-bold shrink-0"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    #{ch.orderIndex ?? idx + 1}
                                  </span>
                                  <span
                                    className="font-bold truncate"
                                    style={{
                                      color: ch.isCompleted
                                        ? "var(--text-primary)"
                                        : "var(--text-secondary)",
                                    }}
                                  >
                                    {ch.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {ch.bestQuizScore !== null ? (
                                    <span
                                      className="font-mono-code px-2 py-0.5 rounded-md text-[10.5px] font-extrabold"
                                      style={{
                                        background:
                                          ch.bestQuizScore >= 75
                                            ? "var(--success-soft)"
                                            : "var(--danger-soft)",
                                        color:
                                          ch.bestQuizScore >= 75
                                            ? "var(--success-fg)"
                                            : "var(--danger-fg)",
                                      }}
                                    >
                                      {ch.bestQuizScore}%
                                    </span>
                                  ) : (
                                    <span
                                      className="text-[10.5px]"
                                      style={{ color: "var(--text-muted)" }}
                                    >
                                      —
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: EXACT REGISTERED DEVICES & SECURITY */}
            {activeTab === "devices" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div
                      className="text-[13px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      الأجهزة المرتبطة بالحساب ({devices.length})
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      عرض دقيق لأسماء الأجهزة، المتصفح، وعنوان IP مع طرد فوري.
                    </div>
                  </div>

                  {!isSelf && devices.length > 0 && (
                    <button
                      type="button"
                      disabled={busyAction === "reset_devices"}
                      onClick={() =>
                        void runPatchAction(
                          "reset_devices",
                          { action: "reset_devices" },
                          "تم إعادة ضبط جميع الأجهزة وطرد الجلسات ✓"
                        )
                      }
                      className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      style={{
                        background: "var(--danger-soft)",
                        color: "var(--danger-fg)",
                      }}
                    >
                      {busyAction === "reset_devices" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                      <span>إعادة ضبط كل الأجهزة</span>
                    </button>
                  )}
                </div>

                {devices.length === 0 ? (
                  <div
                    className="rounded-2xl border border-dashed p-6 text-center text-[12.5px]"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-muted)",
                    }}
                  >
                    لم يتم تسجيل أي أجهزة لهذا الحساب حتى الآن.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {devices.map((dev) => {
                      const DevIcon = getDeviceIcon(dev.deviceName, dev.os);
                      const kickKey = `kick-${dev.deviceId}`;
                      return (
                        <div
                          key={dev.id}
                          className="rounded-2xl border p-3.5 flex items-start justify-between gap-3"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: dev.isActiveNow
                              ? "var(--success-fg)"
                              : dev.isBlocked
                                ? "var(--danger-fg)"
                                : "var(--border-soft)",
                          }}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span
                              className="w-9 h-9 rounded-xl inline-flex items-center justify-center shrink-0 mt-0.5"
                              style={{
                                background: dev.isActiveNow
                                  ? "var(--success-soft)"
                                  : "var(--brand-soft)",
                                color: dev.isActiveNow
                                  ? "var(--success-fg)"
                                  : "var(--brand-soft-text)",
                              }}
                            >
                              <DevIcon className="w-4.5 h-4.5" />
                            </span>

                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  dir="ltr"
                                  className="font-en text-[13px] font-black truncate"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {dev.deviceName}
                                </span>
                                {dev.isActiveNow && (
                                  <span
                                    className="px-2 py-0.2 rounded-full text-[10px] font-extrabold"
                                    style={{
                                      background: "var(--success-soft)",
                                      color: "var(--success-fg)",
                                    }}
                                  >
                                    نشط الآن
                                  </span>
                                )}
                                {dev.isBlocked && (
                                  <span
                                    className="px-2 py-0.2 rounded-full text-[10px] font-extrabold"
                                    style={{
                                      background: "var(--danger-soft)",
                                      color: "var(--danger-fg)",
                                    }}
                                  >
                                    محظور
                                  </span>
                                )}
                              </div>

                              <div
                                className="flex flex-wrap items-center gap-x-2 text-[11px]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {dev.ipAddress && (
                                  <span dir="ltr" className="font-mono-code">
                                    IP: {dev.ipAddress}
                                  </span>
                                )}
                                <span>
                                  آخر ظهور:{" "}
                                  {formatRelativeArabicTime(dev.lastSeenAt)} (
                                  {formatArabicDateTime(dev.lastSeenAt)})
                                </span>
                              </div>
                            </div>
                          </div>

                          {!isSelf && (
                            <button
                              type="button"
                              disabled={busyAction === kickKey}
                              onClick={() =>
                                void runPatchAction(
                                  kickKey,
                                  {
                                    action: "kick_device",
                                    deviceId: dev.deviceId,
                                  },
                                  `تم طرد الجهاز ${dev.deviceName} ✓`
                                )
                              }
                              className="min-h-[32px] px-2.5 py-1 rounded-xl text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-60"
                              style={{
                                background: "var(--danger-soft)",
                                color: "var(--danger-fg)",
                              }}
                            >
                              {busyAction === kickKey ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <LogOut className="w-3.5 h-3.5" />
                              )}
                              <span>طرد الجهاز</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Danger Zone: Permanent Delete */}
                {!isSelf && (
                  <div
                    className="rounded-2xl border p-4 space-y-2.5 mt-4"
                    style={{
                      background: "var(--danger-soft)",
                      borderColor: "transparent",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 text-[12.5px] font-black"
                      style={{ color: "var(--danger-fg)" }}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>منطقة خطرة — حذف الحساب نهائياً</span>
                    </div>
                    <p
                      className="text-[11.5px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      سيتم مسح الحساب وجميع اشتراكاته ودرجاته وأجهزته بشكل نهائي لا يمكن التراجع عنه.
                    </p>
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold bg-white/90 text-slate-900 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف هذا الحساب</span>
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => void handleDeleteUser()}
                          className="px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          style={{ background: "#b91c1c" }}
                        >
                          {deleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>تأكيد الحذف النهائي</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="px-3 py-1.5 rounded-xl text-[12px] font-bold bg-white/90 text-slate-900 cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROFILE & PASSWORD EDITOR */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      className="block text-[11.5px] font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-[11.5px] font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="font-mono-code w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-[11.5px] font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      رقم الموبايل / واتساب
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01012345678"
                      className="font-mono-code w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-[11.5px] font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      الفرقة الدراسية
                    </label>
                    <select
                      value={yearLevel}
                      onChange={(e) => setYearLevel(Number(e.target.value))}
                      className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-bold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value={1}>الفرقة الأولى</option>
                      <option value={2}>الفرقة الثانية</option>
                      <option value={3}>الفرقة الثالثة</option>
                      <option value={4}>الفرقة الرابعة</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-[11.5px] font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      التخصص
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="font-en w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-bold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value="CS">CS</option>
                      <option value="AI">AI</option>
                      <option value="IS">IS</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-[11.5px] font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      الصلاحية
                    </label>
                    <select
                      value={role}
                      disabled={isSelf}
                      onChange={(e) =>
                        setRole(e.target.value as "student" | "admin")
                      }
                      className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-bold outline-none disabled:opacity-60"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value="student">طالب</option>
                      <option value="admin">مشرف (Admin)</option>
                    </select>
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-3.5 space-y-2"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="resetPassInput"
                      className="text-[12px] font-extrabold inline-flex items-center gap-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <KeyRound
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--accent-warm)" }}
                      />
                      <span>تغيير كلمة المرور (اختياري)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewPassword(randomPassword())}
                      className="text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer hover:underline"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>توليد عشوائي</span>
                    </button>
                  </div>
                  <input
                    id="resetPassInput"
                    type="text"
                    dir="ltr"
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="اتركه فارغاً للإبقاء على الحالية"
                    className="font-mono-code w-full min-h-[38px] px-3 py-1.5 rounded-xl border text-[12.5px] font-semibold outline-none"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  />
                  {!isSelf && (
                    <label className="flex items-center gap-2 text-[11.5px] font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={revokeSessionsOnReset}
                        onChange={(e) =>
                          setRevokeSessionsOnReset(e.target.checked)
                        }
                      />
                      <span style={{ color: "var(--text-secondary)" }}>
                        إنهاء الجلسات النشطة عند تغيير كلمة المرور
                      </span>
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full min-h-[42px] py-2 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  style={{ background: "var(--hero-bg)" }}
                >
                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>حفظ التعديلات</span>
                </button>
              </form>
            )}

            {/* TAB 4: MISTAKES, NOTES & AI USAGE */}
            {activeTab === "activity" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div
                    className="rounded-2xl border p-2.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-base font-black">
                      {detail.progress.filter((p) => p.isCompleted).length}
                    </div>
                    <div
                      className="text-[10.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      فصول مكتملة
                    </div>
                  </div>
                  <div
                    className="rounded-2xl border p-2.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-base font-black">
                      {detail.mistakes.length}
                    </div>
                    <div
                      className="text-[10.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      بنك الأخطاء
                    </div>
                  </div>
                  <div
                    className="rounded-2xl border p-2.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-base font-black">
                      {detail.notes.length}
                    </div>
                    <div
                      className="text-[10.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ملاحظات
                    </div>
                  </div>
                  <div
                    className="rounded-2xl border p-2.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-base font-black">
                      {detail.aiUsageToday}/{detail.aiDailyLimit}
                    </div>
                    <div
                      className="text-[10.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      AI اليوم
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="text-[12.5px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    بنك الأخطاء ({detail.mistakes.length})
                  </div>
                  {detail.mistakes.length === 0 ? (
                    <p
                      className="text-[12px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      لا توجد أخطاء مسجلة في بنك الأخطاء.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      {detail.mistakes.slice(0, 10).map((m) => (
                        <div
                          key={m.id}
                          className="rounded-xl border p-2.5 text-[11.5px] space-y-0.5"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <div
                            className="font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            [{m.courseCode}] {m.questionText}
                          </div>
                          <div style={{ color: "var(--success-fg)" }}>
                            الإجابة: {m.answerText}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {detail.notes.length > 0 && (
                  <div className="space-y-2">
                    <div
                      className="text-[12.5px] font-extrabold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ملاحظات الطالب ({detail.notes.length})
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {detail.notes.slice(0, 6).map((note) => (
                        <div
                          key={note.id}
                          className="rounded-xl border p-2.5 text-[11.5px] space-y-1"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <div
                            className="font-extrabold"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            {note.lessonLabel}
                          </div>
                          <div
                            className="line-clamp-3 whitespace-pre-wrap"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {note.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (variant === "inline") {
    return (
      <aside
        aria-labelledby="studentInspectorTitle"
        className="surface-card rounded-3xl overflow-hidden sticky top-20 max-h-[calc(100vh-6.5rem)] flex flex-col"
      >
        {inspectorBody}
      </aside>
    );
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studentInspectorTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="surface-card w-full max-w-xl h-full overflow-hidden flex flex-col border-r"
        style={{
          borderColor: "var(--border-strong)",
          boxShadow: "var(--shadow-modal)",
        }}
      >
        {inspectorBody}
      </div>
    </div>
  );
}
