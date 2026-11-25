"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function AdminBootstrapForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Eng. Ahmed Amir");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        setError(data?.error || "تعذر إنشاء حساب المشرف.");
        return;
      }

      router.refresh();
    } catch {
      setError("تعذر الاتصال بالسيرفر، حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="surface-card w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="space-y-2 text-right">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
          style={{
            background: "var(--success-soft)",
            color: "var(--success-fg)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>إعداد لمرة واحدة · قاعدة البيانات متصلة</span>
        </span>
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          إنشاء حساب الأدمن الرئيسي
        </h1>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          لا يوجد حساب مشرف بعد في قاعدة البيانات. أنشئ حساب الأدمن الأول الآن للدخول مباشرة إلى لوحة التحكم الكاملة (تُغلق هذه الشاشة تلقائياً فور إنشاء أول مشرف).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="bootAdminName"
            className="block text-[12px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            اسم المشرف
          </label>
          <input
            id="bootAdminName"
            type="text"
            required
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-semibold outline-none"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="bootAdminEmail"
            className="block text-[12px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            البريد الإلكتروني
          </label>
          <input
            id="bootAdminEmail"
            type="email"
            dir="ltr"
            required
            placeholder="admin@csportal.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-mono-code w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-semibold outline-none"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="bootAdminPassword"
            className="block text-[12px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            كلمة المرور (8 أحرف على الأقل)
          </label>
          <div className="relative">
            <input
              id="bootAdminPassword"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              required
              minLength={8}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-mono-code w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-xl border text-[13.5px] font-semibold outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg cursor-pointer"
              style={{ color: "var(--text-muted)" }}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-2.5 text-[12.5px] font-bold"
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
          className="w-full min-h-[46px] px-5 py-2.5 rounded-xl text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-95 disabled:opacity-60 cursor-pointer shadow-sm"
          style={{ background: "var(--accent-warm)" }}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري تفعيل حساب الأدمن...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>إنشاء حساب الأدمن والدخول للوحة التحكم</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
