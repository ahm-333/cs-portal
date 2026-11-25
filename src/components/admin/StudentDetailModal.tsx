"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Dices,
  KeyRound,
  Loader2,
  LogOut,
  MonitorSmartphone,
  Plus,
  Save,
  Shield,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import { emitToast } from "@/lib/stores/events";
import {
  formatArabicDate,
  formatArabicDateTime,
  SCOPE_LABELS_AR,
  type ActivationScope,
  type AdminCourseOption,
  type AdminLessonOption,
  type AdminStudentDetailData,
} from "@/components/admin/adminTypes";

export interface StudentDetailModalProps {
  studentId: string;
  currentAdminId: string;
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
  onClose: () => void;
  onChanged: () => void;
}

type ModalSection = "access" | "profile" | "activity" | "security";

function randomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let out = "CS";
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function StudentDetailModal({
  studentId,
  currentAdminId,
  courses,
  lessons,
  onClose,
  onChanged,
}: StudentDetailModalProps) {
  const [section, setSection] = useState<ModalSection>("access");
  const [detail, setDetail] = useState<AdminStudentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  // Grant form state
  const [grantScope, setGrantScope] = useState<ActivationScope>("course");
  const [grantCourseId, setGrantCourseId] = useState(
    courses.find((c) => c.isPaid)?.id ?? courses[0]?.id ?? ""
  );
  const [grantLessonId, setGrantLessonId] = useState(lessons[0]?.id ?? "");
  const [grantExpiresAt, setGrantExpiresAt] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [revokingKey, setRevokingKey] = useState<string | null>(null);

  // Edit profile + password state
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
  const [busySession, setBusySession] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
        if (!res.ok) throw new Error(json.error || "تعذر تحميل ملف الحساب.");
        setDetail(json);
        setFullName(json.student.fullName);
        setEmail(json.student.email);
        setPhone(json.student.phone ?? "");
        setYearLevel(json.student.yearLevel);
        setDepartment(json.student.department);
        setRole(json.student.role);
        setExamDate(json.student.examDate ?? "");
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "تعذر تحميل ملف الحساب.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [studentId, refreshTick]);

  async function handleGrant(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const targetId =
      grantScope === "bundle"
        ? "all"
        : grantScope === "course"
          ? grantCourseId
          : grantLessonId;
    if (!targetId) return;

    setIsMutating(true);
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant",
          userId: studentId,
          scopeType: grantScope,
          targetId,
          expiresAt: grantExpiresAt ? `${grantExpiresAt}T23:59:59Z` : null,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "تعذر منح الصلاحية.");
      }
      emitToast("تم منح الصلاحية بنجاح ✓");
      setGrantExpiresAt("");
      reload();
      onChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر منح الصلاحية.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRevoke(
    scopeType: ActivationScope,
    targetId: string,
    label: string
  ) {
    const key = `${scopeType}:${targetId}`;
    setRevokingKey(key);
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "revoke",
          userId: studentId,
          scopeType,
          targetId,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "تعذر سحب الصلاحية.");
      }
      emitToast(`تم سحب صلاحية «${label}»`);
      reload();
      onChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر سحب الصلاحية.");
    } finally {
      setRevokingKey(null);
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
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "تعذر حفظ التعديلات.");
      }
      emitToast(
        json.passwordChanged
          ? "تم حفظ البيانات وتغيير كلمة المرور بنجاح ✓"
          : "تم حفظ بيانات الحساب بنجاح ✓"
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

  async function handleRevokeSessions(sessionId?: string) {
    const key = sessionId ?? "all";
    setBusySession(key);
    try {
      const res = await fetch("/api/admin/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          sessionId
            ? { action: "revoke_session", sessionId }
            : { action: "revoke_user_sessions", userId: studentId }
        ),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "تعذر إنهاء الجلسة.");
      emitToast(
        sessionId
          ? "تم إنهاء الجلسة بنجاح"
          : "تم تسجيل خروج الحساب من جميع الأجهزة"
      );
      reload();
      onChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر إنهاء الجلسة.");
    } finally {
      setBusySession(null);
    }
  }

  async function handleDeleteUser() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "تعذر حذف الحساب.");
      emitToast("تم حذف الحساب وجميع بياناته نهائياً.");
      onChanged();
      onClose();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر حذف الحساب.");
    } finally {
      setDeleting(false);
    }
  }

  const isSelf = studentId === currentAdminId;
  const activeEnrollments =
    detail?.enrollments.filter((e) => e.status === "active") ?? [];

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studentDossierTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="surface-card w-full max-w-3xl rounded-3xl p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <Shield className="w-3 h-3" />
                <span>ملف التحكم الكامل بالحساب</span>
              </span>
              {detail?.student.role === "admin" && (
                <span
                  className="font-en px-2 py-0.5 rounded-full text-[10.5px] font-extrabold"
                  style={{
                    background: "var(--brand-soft)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>
            <h3
              id="studentDossierTitle"
              className="text-xl font-black truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {detail?.student.fullName ?? "جاري التحميل..."}
            </h3>
            {detail && (
              <p
                dir="ltr"
                className="font-mono-code text-[12px] text-right truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {detail.student.email} · joined {formatArabicDate(detail.student.createdAt)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer shrink-0"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inner Section Switcher */}
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "access", label: "الصلاحيات والاشتراكات", icon: BookOpenCheck },
              { id: "profile", label: "البيانات وكلمة المرور", icon: UserCog },
              { id: "activity", label: "التقدم والأخطاء", icon: Award },
              { id: "security", label: "الجلسات والأمان", icon: MonitorSmartphone },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSection(t.id)}
                className={`filter-pill min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
                  section === t.id ? "active" : ""
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {loading && !detail ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-14 rounded-2xl animate-pulse"
                style={{ background: "var(--bg-subtle)" }}
              />
            ))}
          </div>
        ) : error || !detail ? (
          <div
            className="rounded-2xl p-5 text-center text-[13px] font-bold"
            style={{
              background: "var(--danger-soft)",
              color: "var(--danger-fg)",
            }}
          >
            {error || "تعذر تحميل بيانات الحساب."}
          </div>
        ) : (
          <>
            {/* SECTION 1: ACCESS & ENROLLMENTS */}
            {section === "access" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div
                    className="text-[12.5px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    الاشتراكات النشطة ({activeEnrollments.length})
                  </div>
                  {activeEnrollments.length === 0 ? (
                    <div
                      className="rounded-2xl border border-dashed p-4 text-[12.5px] text-center"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-muted)",
                      }}
                    >
                      لا توجد اشتراكات نشطة حالياً لهذا الحساب.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeEnrollments.map((enr) => {
                        const key = `${enr.scopeType}:${enr.targetId}`;
                        const busy = revokingKey === key;
                        return (
                          <div
                            key={enr.id}
                            className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-3"
                            style={{
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                            }}
                          >
                            <div className="min-w-0">
                              <div
                                className="text-[13px] font-bold truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {enr.targetLabel}
                              </div>
                              <div
                                className="text-[11px]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {SCOPE_LABELS_AR[enr.scopeType]} · منذ{" "}
                                {formatArabicDate(enr.enrolledAt)}
                                {enr.expiresAt
                                  ? ` · ينتهي ${formatArabicDate(enr.expiresAt)}`
                                  : " · دائم"}
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                void handleRevoke(
                                  enr.scopeType,
                                  enr.targetId,
                                  enr.targetLabel
                                )
                              }
                              className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                              style={{
                                background: "var(--danger-soft)",
                                color: "var(--danger-fg)",
                              }}
                            >
                              {busy ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              <span>سحب</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleGrant}
                  className="pt-4 border-t space-y-3"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <div
                    className="text-[12.5px] font-extrabold flex items-center gap-1.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Plus
                      className="w-4 h-4"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <span>منح صلاحية جديدة</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(["course", "lesson", "bundle"] as const).map((scope) => (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => setGrantScope(scope)}
                        className={`filter-pill min-h-[38px] px-2.5 py-1.5 rounded-xl text-[12px] cursor-pointer ${
                          grantScope === scope ? "active" : ""
                        }`}
                      >
                        {SCOPE_LABELS_AR[scope]}
                      </button>
                    ))}
                  </div>

                  {grantScope === "course" && (
                    <select
                      aria-label="اختر المقرر"
                      value={grantCourseId}
                      onChange={(e) => setGrantCourseId(e.target.value)}
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-bold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </select>
                  )}

                  {grantScope === "lesson" && (
                    <select
                      aria-label="اختر الفصل"
                      value={grantLessonId}
                      onChange={(e) => setGrantLessonId(e.target.value)}
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-bold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.courseCode} · {l.title}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="space-y-1">
                    <label
                      htmlFor="grantExpiryInput"
                      className="block text-[11.5px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      تاريخ انتهاء الاشتراك (اتركه فارغاً ليكون دائماً)
                    </label>
                    <input
                      id="grantExpiryInput"
                      type="date"
                      dir="ltr"
                      value={grantExpiresAt}
                      onChange={(e) => setGrantExpiresAt(e.target.value)}
                      className="font-mono-code w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isMutating}
                    className="w-full min-h-[42px] py-2 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    style={{ background: "var(--accent-warm)" }}
                  >
                    {isMutating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>منح الصلاحية فوراً</span>
                  </button>
                </form>
              </div>
            )}

            {/* SECTION 2: EDIT PROFILE & PASSWORD RESET */}
            {section === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="font-mono-code w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                      رقم الموبايل / واتساب
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01012345678"
                      className="font-mono-code w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                      الفرقة الدراسية
                    </label>
                    <select
                      value={yearLevel}
                      onChange={(e) => setYearLevel(Number(e.target.value))}
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border text-[13px] font-bold outline-none"
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
                    <label className="block text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                      التخصص
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="font-en w-full min-h-[42px] px-3 py-2 rounded-xl border text-[13px] font-bold outline-none"
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
                    <label className="block text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                      الصلاحية (Role)
                    </label>
                    <select
                      value={role}
                      disabled={isSelf}
                      onChange={(e) =>
                        setRole(e.target.value as "student" | "admin")
                      }
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border text-[13px] font-bold outline-none disabled:opacity-60"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value="student">طالب (Student)</option>
                      <option value="admin">مشرف (Admin)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                      موعد الامتحان المستهدف (اختياري)
                    </label>
                    <input
                      type="date"
                      dir="ltr"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="font-mono-code w-full min-h-[42px] px-3 py-2 rounded-xl border text-[13px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Reset Password Box */}
                <div
                  className="rounded-2xl border p-4 space-y-2.5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="resetPasswordField"
                      className="text-[12.5px] font-extrabold flex items-center gap-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <KeyRound className="w-4 h-4" style={{ color: "var(--accent-warm)" }} />
                      <span>إعادة تعيين كلمة المرور (اختياري)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewPassword(randomPassword())}
                      className="text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer hover:underline"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>توليد كلمة مرور</span>
                    </button>
                  </div>

                  <input
                    id="resetPasswordField"
                    type="text"
                    dir="ltr"
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="اتركه فارغاً للإبقاء على كلمة المرور الحالية"
                    className="font-mono-code w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[13px] font-semibold outline-none"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  />

                  {!isSelf && (
                    <label className="flex items-center gap-2 text-[12px] font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={revokeSessionsOnReset}
                        onChange={(e) =>
                          setRevokeSessionsOnReset(e.target.checked)
                        }
                      />
                      <span style={{ color: "var(--text-secondary)" }}>
                        إنهاء جميع الجلسات النشطة عند تغيير كلمة المرور
                      </span>
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full min-h-[44px] py-2.5 rounded-xl text-[13.5px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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

            {/* SECTION 3: PROGRESS, MISTAKES, NOTES & REDEMPTIONS */}
            {section === "activity" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div
                    className="rounded-2xl border p-3"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-lg font-black">
                      {detail.progress.filter((p) => p.isCompleted).length}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      دروس مكتملة
                    </div>
                  </div>
                  <div
                    className="rounded-2xl border p-3"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-lg font-black">
                      {detail.mistakes.length}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      بنك الأخطاء
                    </div>
                  </div>
                  <div
                    className="rounded-2xl border p-3"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-lg font-black">
                      {detail.notes.length}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      ملاحظات
                    </div>
                  </div>
                  <div
                    className="rounded-2xl border p-3"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-mono-code text-lg font-black">
                      {detail.aiUsageToday}/{detail.aiDailyLimit}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      طلبات AI اليوم
                    </div>
                  </div>
                </div>

                {/* Progress List */}
                <div className="space-y-2">
                  <div className="text-[12.5px] font-extrabold" style={{ color: "var(--text-primary)" }}>
                    تقدم الفصول ودرجات الكويزات ({detail.progress.length})
                  </div>
                  {detail.progress.length === 0 ? (
                    <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      لم يكمل الطالب أي دروس أو كويزات بعد.
                    </p>
                  ) : (
                    <div className="max-h-44 overflow-y-auto space-y-1.5">
                      {detail.progress.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-xl border px-3 py-2 flex items-center justify-between gap-2 text-[12px]"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <span className="font-bold truncate">{p.lessonLabel}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {p.isCompleted && (
                              <span
                                className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold"
                                style={{
                                  background: "var(--success-soft)",
                                  color: "var(--success-fg)",
                                }}
                              >
                                مكتمل
                              </span>
                            )}
                            {p.bestQuizScore !== null && (
                              <span
                                className="font-mono-code px-2 py-0.5 rounded-md text-[10.5px] font-extrabold"
                                style={{
                                  background: "var(--brand-soft)",
                                  color: "var(--brand-soft-text)",
                                }}
                              >
                                {p.bestQuizScore}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Redemptions History */}
                <div className="space-y-2">
                  <div className="text-[12.5px] font-extrabold" style={{ color: "var(--text-primary)" }}>
                    سجل الأكواد المُفعّلة ({detail.redemptions.length})
                  </div>
                  {detail.redemptions.length === 0 ? (
                    <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      لم يستخدم أي كود تفعيل حتى الآن.
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1.5">
                      {detail.redemptions.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-xl border px-3 py-2 flex items-center justify-between gap-2 text-[12px]"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <div className="min-w-0">
                            <span className="font-mono-code font-extrabold ml-2">
                              {r.code}
                            </span>
                            <span style={{ color: "var(--text-secondary)" }}>
                              {r.targetLabel}
                            </span>
                          </div>
                          <span
                            className="text-[11px] shrink-0"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {formatArabicDateTime(r.redeemedAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mistakes preview */}
                {detail.mistakes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[12.5px] font-extrabold" style={{ color: "var(--text-primary)" }}>
                      آخر الأسئلة في بنك الأخطاء
                    </div>
                    <div className="max-h-44 overflow-y-auto space-y-1.5">
                      {detail.mistakes.slice(0, 8).map((m) => (
                        <div
                          key={m.id}
                          className="rounded-xl border px-3 py-2 text-[12px] space-y-0.5"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <div className="font-bold" style={{ color: "var(--text-primary)" }}>
                            [{m.courseCode}] {m.questionText}
                          </div>
                          <div style={{ color: "var(--success-fg)" }}>
                            الإجابة: {m.answerText}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 4: SESSIONS & DANGER ZONE */}
            {section === "security" && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[12.5px] font-extrabold" style={{ color: "var(--text-primary)" }}>
                      الجلسات المسجلة ({detail.sessions.length})
                    </div>
                    {!isSelf && detail.sessions.length > 0 && (
                      <button
                        type="button"
                        disabled={busySession === "all"}
                        onClick={() => void handleRevokeSessions()}
                        className="px-3 py-1.5 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        style={{
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>تسجيل الخروج من كل الأجهزة</span>
                      </button>
                    )}
                  </div>

                  {detail.sessions.length === 0 ? (
                    <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      لا توجد جلسات نشطة حالياً لهذا الحساب.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {detail.sessions.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2 text-[12px]"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <div className="min-w-0">
                            <div className="font-bold truncate" style={{ color: "var(--text-primary)" }}>
                              {s.userAgent || "متصفح غير محدد"}
                            </div>
                            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                              بدأت: {formatArabicDateTime(s.createdAt)} ·{" "}
                              {s.isActive ? "نشطة" : "منتهية"}
                            </div>
                          </div>
                          {!isSelf && s.isActive && (
                            <button
                              type="button"
                              disabled={busySession === s.id}
                              onClick={() => void handleRevokeSessions(s.id)}
                              className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold shrink-0 cursor-pointer"
                              style={{
                                background: "var(--danger-soft)",
                                color: "var(--danger-fg)",
                              }}
                            >
                              إنهاء
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Danger Zone: Delete User */}
                {!isSelf && (
                  <div
                    className="rounded-2xl border p-4 space-y-3"
                    style={{
                      background: "var(--danger-soft)",
                      borderColor: "transparent",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 text-[13px] font-black"
                      style={{ color: "var(--danger-fg)" }}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>منطقة خطرة — حذف الحساب نهائياً</span>
                    </div>
                    <p
                      className="text-[12px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      سيؤدي حذف هذا الحساب إلى مسح جميع اشتراكاته، تقدمه، ملاحظاته، وجلساته من قاعدة البيانات بشكل نهائي لا يمكن التراجع عنه.
                    </p>

                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 rounded-xl text-[12px] font-extrabold bg-white/90 text-slate-900 inline-flex items-center gap-1.5 cursor-pointer"
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
                          className="px-4 py-2 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
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
                          className="px-3.5 py-2 rounded-xl text-[12px] font-bold bg-white/90 text-slate-900 cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
