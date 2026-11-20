"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  Terminal,
  User,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  nextPath: string;
  initialError: string | null;
  isDemoMode: boolean;
}

type AuthMode = "login" | "signup";

export function LoginForm({
  nextPath,
  initialError,
  isDemoMode,
}: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleGoogleLogin() {
    if (isDemoMode) {
      setErrorMessage(
        "تسجيل الدخول عبر Google يتطلب إعداد متغيرات Supabase في ملف .env.local. يمكنك تصفح المنصة الآن بوضع العرض التجريبي."
      );
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setOauthLoading(true);

    try {
      const supabase = createClient();
      const callbackUrl =
        nextPath && nextPath !== "/dashboard"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        setErrorMessage(error.message || "تعذر تسجيل الدخول عبر Google.");
        setOauthLoading(false);
      }
    } catch {
      setErrorMessage("حدث خطأ غير متوقع أثناء الاتصال بخدمة Google.");
      setOauthLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isDemoMode) {
      setErrorMessage(
        "الموقع يعمل حالياً في وضع العرض التجريبي بدون قاعدة بيانات Supabase. يمكنك المذاكرة وحفظ تقدمك محلياً مباشرة."
      );
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < 6) {
      setErrorMessage(
        "يرجى إدخال بريد إلكتروني صحيح وكلمة مرور لا تقل عن 6 أحرف."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMessage(
            error.message === "Invalid login credentials"
              ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
              : error.message
          );
          return;
        }

        router.push(nextPath || "/dashboard");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim() || undefined,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setErrorMessage(error.message || "تعذر إنشاء الحساب الجديد.");
          return;
        }

        if (data.session) {
          router.push(nextPath || "/dashboard");
          router.refresh();
        } else {
          setSuccessMessage(
            "تم إنشاء حسابك بنجاح! يرجى فحص بريدك الإلكتروني لتأكيد الحساب ثم تسجيل الدخول."
          );
          setMode("login");
          setPassword("");
        }
      }
    } catch {
      setErrorMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-5">
      {/* Brand Header */}
      <div className="text-center">
        <Link
          href="/"
          className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/35 bg-indigo-500/15 text-indigo-400 shadow-lg shadow-indigo-950/50"
        >
          <Terminal className="h-6 w-6" />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
          {mode === "login"
            ? `تسجيل الدخول إلى ${SITE_CONFIG.arabicName}`
            : `إنشاء حساب جديد في ${SITE_CONFIG.arabicName}`}
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          احفظ تقدمك في الدروس ودرجات الكويزات وتابع مذاكرتك من أي جهاز.
        </p>
      </div>

      {/* Demo Mode Helpful Banner */}
      {isDemoMode && (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 text-right">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div className="space-y-2 text-xs leading-relaxed text-amber-100/90">
              <p className="font-bold text-amber-300">
                أنت تتصفح المنصة في وضع العرض التجريبي (Demo Mode)
              </p>
              <p>
                لم يتم ربط مشروع Supabase بعد، لذلك لا تحتاج إلى تسجيل الدخول
                لتجربة المنصة — تقدمك في الدروس والكويزات يُحفظ تلقائياً في
                متصفحك.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-3 py-1.5 font-bold text-amber-200 transition-colors hover:bg-amber-500/30"
                >
                  <span>افتح مذاكرتي</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 px-3 py-1.5 font-semibold text-amber-200 transition-colors hover:bg-amber-500/15"
                >
                  <span>تصفح المواد</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Card */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 sm:p-7">
        {/* 1-Click Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={oauthLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700/90 bg-slate-950/90 px-4 py-3 text-sm font-bold text-slate-100 transition-all hover:border-indigo-500/50 hover:bg-slate-800/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {oauthLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          ) : (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>المتابعة باستخدام Google</span>
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs font-semibold text-slate-500">
            أو بالبريد الإلكتروني
          </span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Mode Toggle Tabs */}
        <div
          role="tablist"
          aria-label="نوع الحساب"
          className="mb-5 grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-950/80 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              mode === "signup"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs leading-relaxed text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-200"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="full-name"
                className="mb-1.5 block text-xs font-bold text-slate-300"
              >
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/90 py-2.5 pl-4 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-bold text-slate-300"
            >
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu.eg"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 py-2.5 pl-4 pr-10 text-left font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold text-slate-300"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 py-2.5 pl-4 pr-10 text-left font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || oauthLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/60 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>
              {mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب الآن"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
