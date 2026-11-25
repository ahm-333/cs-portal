"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  Database,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Moon,
  Phone,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  UserPlus,
} from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { Footer } from "@/components/layout/Footer";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { TiltedCard } from "@/components/ui/ReactBits";
import type { SessionUser } from "@/lib/auth/session";
import {
  logoutCloudAccount,
  setAuthenticatedUser,
  triggerCloudSyncNow,
  useAuthState,
} from "@/lib/stores/authStore";
import { emitToast } from "@/lib/stores/events";
import {
  getPortalSnapshot,
  saveProfile,
  usePortalState,
  type PortalDepartment,
} from "@/lib/stores/portalStore";

const YEAR_OPTIONS = [
  { value: 1, label: "الفرقة الأولى", short: "ف1" },
  { value: 2, label: "الفرقة الثانية", short: "ف2" },
  { value: 3, label: "الفرقة الثالثة", short: "ف3" },
  { value: 4, label: "الفرقة الرابعة", short: "ف4" },
] as const;

const DEPT_OPTIONS: ReadonlyArray<{
  id: PortalDepartment;
  nameEn: string;
  accent: string;
}> = [
  { id: "CS", nameEn: "Computer Science", accent: "#7ca7f0" },
  { id: "AI", nameEn: "Artificial Intelligence", accent: "#e58a62" },
  { id: "IS", nameEn: "Information Systems", accent: "#66c7a6" },
  { id: "IT", nameEn: "Information Tech", accent: "#c084fc" },
];

type AuthTab = "register" | "login";

function getMatchedCoursesPreview(year: number): {
  badge: string;
  items: string[];
} {
  if (year === 2) {
    return {
      badge: "مقرران مخصصان لفرقتك هذا الترم",
      items: ["CS-213 · Data Structures", "IS-211 · Database Systems"],
    };
  }
  if (year === 3) {
    return {
      badge: "مقرران أساسيان لفرقتك هذا الترم",
      items: ["CS-311 · Operating Systems", "CS-321 · Computer Graphics"],
    };
  }
  return {
    badge: "4 مقررات جاهزة ومخططة لهذا الترم",
    items: [
      "CS-213 · Data Structures",
      "IS-211 · Database Systems",
      "CS-311 · Operating Systems",
      "CS-321 · Computer Graphics",
    ],
  };
}

function getInitials(rawName: string): string {
  const clean = rawName.trim();
  if (!clean) return "CS";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function getSafeNextPath(): string {
  if (typeof window === "undefined") return "/courses";
  try {
    const raw = new URLSearchParams(window.location.search).get("next") ?? "";
    const trimmed = raw.trim();
    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
      return trimmed;
    }
  } catch {
    // ignore
  }
  return "/courses";
}

function GoogleLogoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.3a7.21 7.21 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_not_configured:
    "تسجيل الدخول عبر جوجل يحتاج إضافة GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET في إعدادات السيرفر (.env.local).",
  google_cancelled: "تم إلغاء تسجيل الدخول عبر جوجل.",
  google_state_expired: "انتهت مهلة جلسة جوجل — اضغط الزر وحاول مرة أخرى.",
  google_state_invalid: "تعذر التحقق من جلسة جوجل — حاول مرة أخرى.",
  google_state_mismatch: "تعذر التحقق من أمان الجلسة — حاول مرة أخرى.",
  google_token_failed: "تعذر إتمام المصادقة مع جوجل — تأكد من إعدادات OAuth.",
  google_profile_failed: "تعذر قراءة بيانات حساب جوجل — حاول مرة أخرى.",
  google_unverified_email: "يجب أن يكون بريد جوجل مفعّلاً وموثّقاً للمتابعة.",
  google_callback_error: "حدث خطأ مؤقت أثناء الدخول بحساب جوجل — حاول مجدداً.",
  db_not_configured: "قاعدة البيانات غير مربوطة بعد.",
};

function readInitialOAuthError(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const code = new URLSearchParams(window.location.search).get("error");
    if (code && OAUTH_ERROR_MESSAGES[code]) {
      return OAUTH_ERROR_MESSAGES[code];
    }
  } catch {
    // ignore
  }
  return null;
}

function readIsCompleteFlow(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("complete") === "1";
  } catch {
    // ignore
  }
  return false;
}

function readInitialAuthTab(): AuthTab {
  if (typeof window === "undefined") return "register";
  try {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab === "login") return "login";
  } catch {
    // ignore
  }
  return "register";
}

export default function LoginPage() {
  const router = useRouter();
  const portal = usePortalState();
  const auth = useAuthState();
  const theme = useTheme();

  const [authTab, setAuthTab] = useState<AuthTab>("register");

  // Student pass & registration fields
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [yearDraft, setYearDraft] = useState<number | null>(null);
  const [deptDraft, setDeptDraft] = useState<PortalDepartment | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [completingProfile, setCompletingProfile] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [isCompleteFlow, setIsCompleteFlow] = useState<boolean>(false);

  // Sync URL query params after hydration to guarantee zero SSR/client mismatch
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const tab = readInitialAuthTab();
      if (tab === "login") setAuthTab("login");
      const oauthErr = readInitialOAuthError();
      if (oauthErr) setErrorMsg(oauthErr);
      if (readIsCompleteFlow()) setIsCompleteFlow(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const currentUser =
    auth.status === "authenticated" && auth.user ? auth.user : null;
  const isAuthenticated = currentUser !== null;
  const needsPhoneCompletion = Boolean(
    currentUser &&
      currentUser.role === "student" &&
      !currentUser.phone &&
      (isCompleteFlow || currentUser.googleLinked)
  );

  const name = currentUser
    ? (nameDraft ?? currentUser.fullName)
    : (nameDraft ?? portal.profile.name);
  const year = currentUser
    ? (yearDraft ?? currentUser.yearLevel)
    : (yearDraft ?? portal.profile.year);
  const dept: PortalDepartment = currentUser
    ? (deptDraft ?? currentUser.department)
    : (deptDraft ?? portal.profile.dept);

  const activeDept =
    DEPT_OPTIONS.find((d) => d.id === dept) ?? DEPT_OPTIONS[0];
  const matchedCourses = getMatchedCoursesPreview(year);
  const displayName = name.trim() || "طالب حاسبات";
  const displayPhone = (currentUser?.phone || phone).trim();
  const passSerial = `ZAG-2026-${dept}-0${year}`;

  function handleContinueWithGoogle() {
    setErrorMsg(null);
    if (!auth.googleEnabled) {
      setErrorMsg(OAUTH_ERROR_MESSAGES.google_not_configured);
      return;
    }
    const nextPath = getSafeNextPath();
    const params = new URLSearchParams({
      next: nextPath,
      year: String(year),
      dept,
    });
    window.location.href = `/api/auth/google?${params.toString()}`;
  }

  async function handleCompleteProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.trim();
    if (cleanPhone.length < 10) {
      setErrorMsg("أدخل رقم موبايل صحيح (مثال: 01012345678).");
      return;
    }

    setCompletingProfile(true);
    try {
      const snap = getPortalSnapshot();
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          phone: cleanPhone,
          fullName: name.trim() || currentUser?.fullName,
          yearLevel: year,
          department: dept,
          localState: {
            profile: snap.profile,
            completedLessons: snap.completedLessons,
            quizScores: snap.quizScores,
            notes: snap.notes,
            mistakes: snap.mistakes,
            examDate: snap.examDate,
          },
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        user?: SessionUser;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok || !data.user) {
        setErrorMsg(data?.error || "تعذر حفظ رقم الموبايل — حاول مرة أخرى.");
        return;
      }

      saveProfile({
        name: data.user.fullName,
        year: data.user.yearLevel,
        dept: data.user.department,
        saved: true,
      });
      setAuthenticatedUser(data.user);
      emitToast(`تم حفظ بياناتك يا ${data.user.fullName} بنجاح ✓`);
      router.push(getSafeNextPath());
      router.refresh();
    } catch {
      setErrorMsg("تعذر الاتصال بالسيرفر — حاول مرة أخرى.");
    } finally {
      setCompletingProfile(false);
    }
  }

  async function handleAuthSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const cleanIdentifier = email.trim();
    if (authTab === "register") {
      const cleanEmail = cleanIdentifier.toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        setErrorMsg("أدخل بريداً إلكترونياً صحيحاً.");
        return;
      }
      if (phone.trim().length < 10) {
        setErrorMsg("أدخل رقم موبايل صحيح (مثال: 01012345678).");
        return;
      }
    } else if (!cleanIdentifier) {
      setErrorMsg("أدخل البريد الإلكتروني أو رقم الموبايل.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    const cleanName = name.trim();
    if (authTab === "register" && cleanName.length < 2) {
      setErrorMsg("أدخل اسمك الكامل (حرفين على الأقل).");
      return;
    }

    setSubmitting(true);
    try {
      const snap = getPortalSnapshot();
      const localState = {
        profile: snap.profile,
        completedLessons: snap.completedLessons,
        quizScores: snap.quizScores,
        notes: snap.notes,
        mistakes: snap.mistakes,
        examDate: snap.examDate,
      };

      const endpoint =
        authTab === "register" ? "/api/auth/register" : "/api/auth/login";
      const body =
        authTab === "register"
          ? {
              email: cleanIdentifier.toLowerCase(),
              phone: phone.trim(),
              password,
              fullName: cleanName,
              yearLevel: year,
              department: dept,
              localState,
            }
          : {
              identifier: cleanIdentifier,
              email: cleanIdentifier.toLowerCase(),
              password,
              localState,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        user?: SessionUser;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok || !data.user) {
        setErrorMsg(
          data?.error ||
            "تعذّر إتمام العملية حالياً — تأكد من البيانات وحاول مرة أخرى."
        );
        return;
      }

      saveProfile({
        name: data.user.fullName,
        year: data.user.yearLevel,
        dept: data.user.department,
        saved: true,
      });
      setAuthenticatedUser(data.user);
      emitToast(
        authTab === "register"
          ? `أهلاً يا ${data.user.fullName}! تم إنشاء حسابك بنجاح ✓`
          : `أهلاً بعودتك يا ${data.user.fullName} ✓`
      );
      router.push(getSafeNextPath());
      router.refresh();
    } catch {
      setErrorMsg("تعذّر الاتصال بالسيرفر — تحقق من الإنترنت وحاول مجدداً.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logoutCloudAccount();
      emitToast("تم تسجيل الخروج من حسابك.");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Compact Warm Editorial Topbar (Exact Original Design) */}
      <header className="topbar-shell sticky top-0 z-40">
        <div className="max-w-[1220px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="px-2.5 sm:px-3 min-h-[38px] h-9.5 rounded-xl border text-[11.5px] sm:text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors hover:opacity-85 shrink-0"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              <span>الرئيسية</span>
            </Link>
            <div
              className="h-5 w-px hidden sm:block shrink-0"
              style={{ background: "var(--border-strong)" }}
            />
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-[1.5px] ring-[#c25e33] shrink-0 shadow-sm">
                <Image
                  src="/images/founder.jpg"
                  alt="Eng. Ahmed Amir"
                  fill
                  sizes="36px"
                  className="object-cover object-[50%_15%]"
                />
              </div>
              <div className="leading-tight hidden sm:block truncate">
                <BrandName size="md" />
                <div
                  className="text-[10.5px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  بوابة حسابات الطلاب · تسجيل الدخول
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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

            {isAuthenticated && (
              <Link
                href="/courses"
                className="px-3 sm:px-3.5 min-h-[38px] h-9.5 rounded-xl text-[11.5px] sm:text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 shrink-0"
                style={{ background: "var(--hero-bg)" }}
              >
                <span>مكتبة المقررات</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main 2-Column Studio Onboarding: Live 3D Student Pass + Mandatory Account Form */}
      <main className="flex-1 flex items-center justify-center px-3.5 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-[1020px] grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-center">
          {/* Column 1: Live Interactive 3D Zagazig CS Student Pass */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1 text-right">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>معاينة حيّة لكارنيه حسابك على المنصة</span>
              </div>
              <p
                className="text-[12.5px]"
                style={{ color: "var(--text-secondary)" }}
              >
                أنشئ حسابك في ثوانٍ علشان مقرراتك وتقدمك وأكواد التفعيل يتحفظوا
                بشكل دائم على حسابك.
              </p>
            </div>

            <TiltedCard
              className="rounded-[28px]"
              maxTiltDeg={6}
              scaleOnHover={1.015}
            >
              <div
                className="hero-shell blueprint-grid-dark rounded-[28px] p-5 sm:p-6 text-white border border-white/15 shadow-2xl space-y-5 relative overflow-hidden"
                style={{
                  backgroundColor: "#14233d",
                  backgroundImage:
                    "linear-gradient(to right, rgba(255, 255, 255, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.055) 1px, transparent 1px), linear-gradient(135deg, #182947 0%, #0f1c32 100%)",
                  backgroundSize: "28px 28px, 28px 28px, 100% 100%",
                }}
              >
                <div
                  className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-300"
                  style={{ background: activeDept.accent }}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        background: activeDept.accent,
                        boxShadow: `0 0 10px ${activeDept.accent}`,
                      }}
                    />
                    <span className="font-en text-[11px] font-extrabold tracking-wide text-slate-200 truncate">
                      ZAGAZIG FCI · STUDENT PASS
                    </span>
                  </div>
                  <span className="font-mono-code text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 text-[#a7f3d0] whitespace-nowrap shrink-0">
                    {passSerial}
                  </span>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white border-2 shrink-0 shadow-lg transition-colors duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${activeDept.accent}, #182947)`,
                      borderColor: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {getInitials(displayName)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1 text-right">
                    <div className="text-xl sm:text-2xl font-black tracking-tight truncate">
                      {displayName}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-bold">
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/12 text-white">
                        الفرقة {year}
                      </span>
                      <span
                        className="font-en px-2.5 py-0.5 rounded-lg font-extrabold"
                        style={{
                          background: `color-mix(in srgb, ${activeDept.accent} 25%, transparent)`,
                          color: "#ffffff",
                          border: `1px solid ${activeDept.accent}`,
                        }}
                      >
                        {activeDept.id} · {activeDept.nameEn}
                      </span>
                      {displayPhone && (
                        <span
                          dir="ltr"
                          className="font-mono-code px-2 py-0.5 rounded-lg bg-white/10 text-[#a7f3d0] text-[10.5px]"
                        >
                          {displayPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 rounded-2xl bg-white/[0.07] border border-white/12 p-3.5 space-y-2 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#a7f3d0]">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>{matchedCourses.badge}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedCourses.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-[11px] font-bold text-slate-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-300">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#66c7a6] shrink-0" />
                    <span>حساب سحابي موثّق · مزامنة فورية</span>
                  </span>
                  <span className="font-mono-code opacity-75 whitespace-nowrap shrink-0">
                    CLOUD-SYNC v3
                  </span>
                </div>
              </div>
            </TiltedCard>
          </div>

          {/* Column 2: Mandatory Account Creation / Sign In Card */}
          <div className="lg:col-span-6">
            <div className="surface-card rounded-3xl p-5 sm:p-7 space-y-5">
              {isAuthenticated && auth.user && needsPhoneCompletion ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
                      style={{
                        background: "var(--success-soft)",
                        color: "var(--success-fg)",
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم ربط حساب جوجل بنجاح — خطوة أخيرة</span>
                    </span>
                    <h1
                      className="text-xl font-black tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      أكمل بياناتك للبدء فوراً
                    </h1>
                    <p
                      className="text-[12.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      أهلاً يا <strong>{auth.user.fullName}</strong> — أضف رقم موبايلك (واتساب) واختر فرقتك وقسمك لتخصيص مقرراتك.
                    </p>
                  </div>

                  <form
                    onSubmit={handleCompleteProfileSubmit}
                    className="space-y-3.5"
                  >
                    <div>
                      <label
                        htmlFor="completePhone"
                        className="block text-[12px] font-bold mb-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        رقم الموبايل / واتساب
                      </label>
                      <div className="relative">
                        <Phone
                          className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "var(--text-muted)" }}
                        />
                        <input
                          id="completePhone"
                          type="tel"
                          dir="ltr"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="01012345678"
                          autoComplete="tel"
                          className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border text-[13.5px] font-mono-code font-semibold outline-none transition-colors focus:ring-2 text-left"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div
                        className="text-[12px] font-bold mb-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        الفرقة الدراسية
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {YEAR_OPTIONS.map((y) => (
                          <button
                            key={y.value}
                            type="button"
                            onClick={() => setYearDraft(y.value)}
                            aria-pressed={year === y.value}
                            className={`filter-pill min-h-[40px] px-3 py-1.5 rounded-xl text-[12px] flex items-center justify-between cursor-pointer ${
                              year === y.value ? "active" : ""
                            }`}
                          >
                            <span className="font-bold">{y.label}</span>
                            <span className="font-mono-code text-[11px] opacity-75">
                              {y.short}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div
                        className="text-[12px] font-bold mb-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        القسم / التخصص
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {DEPT_OPTIONS.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setDeptDraft(d.id)}
                            aria-pressed={dept === d.id}
                            className={`filter-pill min-h-[40px] py-1.5 px-2 rounded-xl font-en text-[12.5px] font-extrabold cursor-pointer ${
                              dept === d.id ? "active" : ""
                            }`}
                          >
                            {d.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {errorMsg && (
                      <div
                        role="alert"
                        className="rounded-xl px-3.5 py-2.5 text-[12.5px] font-bold"
                        style={{
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }}
                      >
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={completingProfile}
                      className="cta-shimmer w-full min-h-[46px] py-3 rounded-2xl text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-65"
                      style={{ background: "#c25e33" }}
                    >
                      {completingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <span>حفظ الرقم والدخول للمنصة ←</span>
                      )}
                    </button>
                  </form>
                </div>
              ) : isAuthenticated && auth.user ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ background: "var(--hero-bg)" }}
                      >
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h1
                            className="text-lg font-black tracking-tight truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {auth.user.fullName}
                          </h1>
                          {auth.user.role === "admin" && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold"
                              style={{
                                background: "var(--accent-warm-soft)",
                                color: "var(--accent-warm-text)",
                              }}
                            >
                              <Shield className="w-3 h-3" />
                              أدمن
                            </span>
                          )}
                        </div>
                        <p
                          dir="ltr"
                          className="font-mono-code text-[11.5px] truncate text-right"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {auth.user.email}
                          {auth.user.phone ? ` · ${auth.user.phone}` : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0"
                      style={{
                        background: "var(--success-soft)",
                        color: "var(--success-fg)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--success-fg)" }}
                      />
                      <span>متصل بالسحابة</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className="rounded-xl border p-3 text-center"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      <div
                        className="font-mono-code text-lg font-black"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {portal.completedLessons.length}
                      </div>
                      <div
                        className="text-[10.5px] font-bold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        دروس مكتملة
                      </div>
                    </div>
                    <div
                      className="rounded-xl border p-3 text-center"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      <div
                        className="font-mono-code text-lg font-black"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {Object.keys(portal.notes).length}
                      </div>
                      <div
                        className="text-[10.5px] font-bold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        ملاحظات
                      </div>
                    </div>
                    <div
                      className="rounded-xl border p-3 text-center"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      <div
                        className="font-mono-code text-lg font-black"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {portal.mistakes.length}
                      </div>
                      <div
                        className="text-[10.5px] font-bold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        بنك الأخطاء
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Link
                      href="/courses"
                      className="cta-shimmer w-full min-h-[48px] py-3 rounded-2xl text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md transition-transform hover:-translate-y-0.5"
                      style={{ background: "#c25e33" }}
                    >
                      <span>الدخول إلى مكتبة المقررات</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {auth.user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="min-h-[42px] px-3.5 py-2 rounded-xl border text-[12.5px] font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors"
                          style={{
                            background: "var(--accent-warm-soft)",
                            borderColor: "transparent",
                            color: "var(--accent-warm-text)",
                          }}
                        >
                          <Shield className="w-4 h-4" />
                          <span>لوحة تحكم الأدمن</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          triggerCloudSyncNow();
                          emitToast("جاري مزامنة بياناتك مع السحابة...");
                        }}
                        disabled={auth.syncing}
                        className="min-h-[42px] px-3.5 py-2 rounded-xl border text-[12.5px] font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${auth.syncing ? "animate-spin" : ""}`}
                        />
                        <span>
                          {auth.syncing ? "جاري المزامنة..." : "مزامنة الآن"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-[12.5px] font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60 ${
                          auth.user.role === "admin" ? "sm:col-span-2" : ""
                        }`}
                        style={{
                          background: "var(--danger-soft)",
                          borderColor: "transparent",
                          color: "var(--danger-fg)",
                        }}
                      >
                        {signingOut ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <LogOut className="w-3.5 h-3.5" />
                        )}
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
                      style={{
                        background: "var(--accent-warm-soft)",
                        color: "var(--accent-warm-text)",
                      }}
                    >
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>الدخول للمنصة يتطلب إنشاء حساب أو تسجيل الدخول</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ background: "var(--hero-bg)" }}
                      >
                        {authTab === "register" ? (
                          <UserPlus className="w-5 h-5" />
                        ) : (
                          <LogIn className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h1
                          className="text-xl font-black tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {authTab === "register"
                            ? "أنشئ حسابك للبدء فوراً"
                            : "سجّل دخولك لحسابك"}
                        </h1>
                        <p
                          className="text-[12.5px] leading-snug"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {authTab === "register"
                            ? "لحفظ تقدمك وملاحظاتك وأكواد التفعيل والمساعد الذكي"
                            : "أدخل بريدك الإلكتروني وكلمة المرور لفتح مقرراتك"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clean 2-Tab Switcher: Register vs Login (Zero Guest Bypass) */}
                  <div
                    role="tablist"
                    aria-label="تسجيل حساب أو دخول"
                    className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl border"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authTab === "register"}
                      onClick={() => {
                        setAuthTab("register");
                        setErrorMsg(null);
                      }}
                      className="min-h-[42px] px-3 py-2 rounded-xl text-[12.5px] font-extrabold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      style={
                        authTab === "register"
                          ? {
                              background: "var(--hero-bg)",
                              color: "#ffffff",
                            }
                          : { color: "var(--text-secondary)" }
                      }
                    >
                      <UserPlus className="w-3.5 h-3.5 shrink-0" />
                      <span>إنشاء حساب جديد</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authTab === "login"}
                      onClick={() => {
                        setAuthTab("login");
                        setErrorMsg(null);
                      }}
                      className="min-h-[42px] px-3 py-2 rounded-xl text-[12.5px] font-extrabold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      style={
                        authTab === "login"
                          ? {
                              background: "var(--hero-bg)",
                              color: "#ffffff",
                            }
                          : { color: "var(--text-secondary)" }
                      }
                    >
                      <LogIn className="w-3.5 h-3.5 shrink-0" />
                      <span>تسجيل الدخول</span>
                    </button>
                  </div>

                  {auth.status !== "loading" && !auth.dbConfigured && (
                    <div
                      className="rounded-2xl border p-3.5 flex items-start gap-2.5 text-[12px] leading-relaxed"
                      style={{
                        background: "var(--accent-warm-soft)",
                        borderColor: "var(--border-soft)",
                        color: "var(--accent-warm-text)",
                      }}
                    >
                      <Database className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-extrabold">
                          بانتظار ربط قاعدة بيانات Neon:
                        </strong>{" "}
                        أضف{" "}
                        <code className="font-mono-code font-bold">
                          DATABASE_URL
                        </code>{" "}
                        في <code className="font-mono-code">.env.local</code>{" "}
                        وشغّل <code className="font-mono-code">npm run db:push</code>{" "}
                        لتفعيل إنشاء الحسابات فوراً.
                      </div>
                    </div>
                  )}

                  {/* Google OAuth Quick Sign-In / Sign-Up Button */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleContinueWithGoogle}
                      className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl border text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2.5 transition-all hover:opacity-90 cursor-pointer shadow-xs"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-strong)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <GoogleLogoIcon />
                      <span>
                        {authTab === "register"
                          ? "التسجيل السريع بحساب جوجل"
                          : "الدخول بحساب جوجل"}
                      </span>
                    </button>

                    <div className="flex items-center gap-3">
                      <div
                        className="h-px flex-1"
                        style={{ background: "var(--border-soft)" }}
                      />
                      <span
                        className="text-[11px] font-bold shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      >
                        أو بالبريد الإلكتروني ورقم الموبايل
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{ background: "var(--border-soft)" }}
                      />
                    </div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                    {authTab === "register" && (
                      <>
                        <div>
                          <label
                            htmlFor="registerFullName"
                            className="block text-[12px] font-bold mb-1.5"
                            style={{ color: "var(--text-primary)" }}
                          >
                            الاسم الكامل
                          </label>
                          <input
                            id="registerFullName"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setNameDraft(e.target.value)}
                            placeholder="مثال: أحمد أمير"
                            autoComplete="name"
                            className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-bold outline-none transition-colors focus:ring-2"
                            style={{
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-primary)",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="registerPhone"
                            className="block text-[12px] font-bold mb-1.5"
                            style={{ color: "var(--text-primary)" }}
                          >
                            رقم الموبايل / واتساب
                          </label>
                          <div className="relative">
                            <Phone
                              className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                              style={{ color: "var(--text-muted)" }}
                            />
                            <input
                              id="registerPhone"
                              type="tel"
                              dir="ltr"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="01012345678"
                              autoComplete="tel"
                              className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border text-[13.5px] font-mono-code font-semibold outline-none transition-colors focus:ring-2 text-left"
                              style={{
                                background: "var(--bg-canvas)",
                                borderColor: "var(--border-soft)",
                                color: "var(--text-primary)",
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label
                        htmlFor="authEmail"
                        className="block text-[12px] font-bold mb-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {authTab === "register"
                          ? "البريد الإلكتروني"
                          : "البريد الإلكتروني أو رقم الموبايل"}
                      </label>
                      <div className="relative">
                        <Mail
                          className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "var(--text-muted)" }}
                        />
                        <input
                          id="authEmail"
                          type={authTab === "register" ? "email" : "text"}
                          dir="ltr"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={
                            authTab === "register"
                              ? "student@example.com"
                              : "student@example.com أو 01012345678"
                          }
                          autoComplete={
                            authTab === "register" ? "email" : "username"
                          }
                          className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border text-[13.5px] font-en font-semibold outline-none transition-colors focus:ring-2 text-left"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="authPassword"
                        className="block text-[12px] font-bold mb-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        كلمة المرور
                      </label>
                      <div className="relative">
                        <Lock
                          className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: "var(--text-muted)" }}
                        />
                        <input
                          id="authPassword"
                          type={showPassword ? "text" : "password"}
                          dir="ltr"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete={
                            authTab === "register"
                              ? "new-password"
                              : "current-password"
                          }
                          className="w-full min-h-[44px] pr-10 pl-10 py-2 rounded-xl border text-[13.5px] font-mono-code outline-none transition-colors focus:ring-2 text-left"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-primary)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword
                              ? "إخفاء كلمة المرور"
                              : "إظهار كلمة المرور"
                          }
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
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

                    {authTab === "register" && (
                      <>
                        <div>
                          <div
                            className="text-[12px] font-bold mb-1.5"
                            style={{ color: "var(--text-primary)" }}
                          >
                            الفرقة الدراسية
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {YEAR_OPTIONS.map((y) => (
                              <button
                                key={y.value}
                                type="button"
                                onClick={() => setYearDraft(y.value)}
                                aria-pressed={year === y.value}
                                className={`filter-pill min-h-[42px] px-3 py-2 rounded-xl text-[12px] flex items-center justify-between cursor-pointer ${
                                  year === y.value ? "active" : ""
                                }`}
                              >
                                <span className="font-bold">{y.label}</span>
                                <span className="font-mono-code text-[11px] opacity-75">
                                  {y.short}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div
                            className="text-[12px] font-bold mb-1.5"
                            style={{ color: "var(--text-primary)" }}
                          >
                            القسم / التخصص
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {DEPT_OPTIONS.map((d) => (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => setDeptDraft(d.id)}
                                aria-pressed={dept === d.id}
                                className={`filter-pill min-h-[44px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                  dept === d.id ? "active" : ""
                                }`}
                              >
                                <span className="font-en text-[12.5px] font-extrabold">
                                  {d.id}
                                </span>
                                <span className="font-en text-[9px] opacity-70 truncate max-w-full">
                                  {d.nameEn.split(" ")[0]}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {errorMsg && (
                      <div
                        role="alert"
                        className="rounded-xl border px-3.5 py-2.5 text-[12.5px] font-bold"
                        style={{
                          background: "var(--danger-soft)",
                          borderColor: "transparent",
                          color: "var(--danger-fg)",
                        }}
                      >
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="cta-shimmer w-full min-h-[48px] py-3 rounded-2xl text-[14px] font-extrabold text-white inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-md disabled:opacity-65 disabled:cursor-not-allowed"
                      style={{ background: "#c25e33" }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري التحقق...</span>
                        </>
                      ) : authTab === "register" ? (
                        <span>إنشاء الحساب والدخول للمنصة ←</span>
                      ) : (
                        <span>تسجيل الدخول والدخول للمنصة ←</span>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
