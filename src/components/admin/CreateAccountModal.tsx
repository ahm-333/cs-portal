"use client";

import { useState, type FormEvent } from "react";
import {
  Dices,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { emitToast } from "@/lib/stores/events";
import type {
  ActivationScope,
  AdminCourseOption,
} from "@/components/admin/adminTypes";

export interface CreateAccountModalProps {
  courses: AdminCourseOption[];
  onClose: () => void;
  onCreated: () => void;
}

function generateStrongPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let out = "CS";
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function CreateAccountModal({
  courses,
  onClose,
  onCreated,
}: CreateAccountModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [yearLevel, setYearLevel] = useState(2);
  const [department, setDepartment] = useState<"CS" | "AI" | "IS" | "IT">("CS");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [grantInitial, setGrantInitial] = useState<"" | ActivationScope>("");
  const [initialCourseId, setInitialCourseId] = useState(
    courses.find((c) => c.isPaid)?.id ?? courses[0]?.id ?? ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          password,
          yearLevel,
          department,
          role,
          initialScopeType: grantInitial || undefined,
          initialTargetId:
            grantInitial === "bundle"
              ? "all"
              : grantInitial === "course"
                ? initialCourseId
                : undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "تعذر إنشاء الحساب.");
        return;
      }

      emitToast(`تم إنشاء حساب ${fullName.trim()} بنجاح ✓`);
      onCreated();
      onClose();
    } catch {
      setError("تعذر الاتصال بالسيرفر.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="createAccountTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="surface-card w-full max-w-lg rounded-3xl p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <UserPlus className="w-3 h-3" />
              <span>إنشاء حساب مباشر</span>
            </span>
            <h3
              id="createAccountTitle"
              className="text-lg font-black"
              style={{ color: "var(--text-primary)" }}
            >
              إضافة طالب أو مشرف جديد
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: "student", label: "حساب طالب" },
                { value: "admin", label: "حساب أدمن (مشرف)" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`filter-pill min-h-[40px] rounded-xl text-[12.5px] font-extrabold cursor-pointer ${
                  role === opt.value
                    ? opt.value === "admin"
                      ? "active-warm"
                      : "active"
                    : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="newFullName"
              className="block text-[12px] font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              الاسم الكامل
            </label>
            <input
              id="newFullName"
              type="text"
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: محمد أحمد علي"
              className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="newEmail"
              className="block text-[12px] font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              البريد الإلكتروني
            </label>
            <input
              id="newEmail"
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@csportal.edu"
              className="font-mono-code w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="newPhone"
              className="block text-[12px] font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              رقم الموبايل / واتساب (اختياري)
            </label>
            <input
              id="newPhone"
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="newPassword"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                كلمة المرور (6 أحرف على الأقل)
              </label>
              <button
                type="button"
                onClick={() => setPassword(generateStrongPassword())}
                className="text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer hover:underline"
                style={{ color: "var(--brand-primary)" }}
              >
                <Dices className="w-3.5 h-3.5" />
                <span>توليد عشوائي</span>
              </button>
            </div>
            <input
              id="newPassword"
              type="text"
              dir="ltr"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة مرور قوية"
              className="font-mono-code w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="newYear"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                الفرقة
              </label>
              <select
                id="newYear"
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

            <div className="space-y-1.5">
              <label
                htmlFor="newDept"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                التخصص
              </label>
              <select
                id="newDept"
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value as "CS" | "AI" | "IS" | "IT")
                }
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
          </div>

          {role === "student" && (
            <div
              className="rounded-2xl border p-3.5 space-y-2.5"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <label
                htmlFor="newInitialScope"
                className="block text-[12px] font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                تفعيل اشتراك فوري مع إنشاء الحساب (اختياري)
              </label>
              <select
                id="newInitialScope"
                value={grantInitial}
                onChange={(e) =>
                  setGrantInitial(e.target.value as "" | ActivationScope)
                }
                className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-bold outline-none"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">بدون اشتراك مدفوع حالياً</option>
                <option value="course">فتح مقرر محدد</option>
                <option value="bundle">فتح باقة شاملة (كل المقررات)</option>
              </select>

              {grantInitial === "course" && (
                <select
                  aria-label="اختر المقرر"
                  value={initialCourseId}
                  onChange={(e) => setInitialCourseId(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border text-[12.5px] font-bold outline-none"
                  style={{
                    background: "var(--bg-surface)",
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
            </div>
          )}

          {error && (
            <div
              className="rounded-xl px-3.5 py-2 text-[12.5px] font-bold"
              style={{
                background: "var(--danger-soft)",
                color: "var(--danger-fg)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[44px] py-2.5 rounded-xl text-[13.5px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            style={{ background: "var(--accent-warm)" }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الإنشاء...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>إنشاء الحساب الآن</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
