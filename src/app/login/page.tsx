"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  FileWarning,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  Smartphone,
  Sun,
  User,
  UserPlus,
  XCircle,
} from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomDock } from "@/components/layout/MobileBottomDock";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import type { SessionUser } from "@/lib/auth/session";
import {
  logoutCloudAccount,
  setAuthenticatedUser,
  useAuthState,
} from "@/lib/stores/authStore";
import {
  emitToast,
  openFeedbackModal,
  openMistakeBankModal,
} from "@/lib/stores/events";
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
  { id: "CS", nameEn: "Computer Science", accent: "#d8b07a" },
  { id: "AI", nameEn: "Artificial Intelligence", accent: "#c25e33" },
  { id: "IS", nameEn: "Information Systems", accent: "#6ec4a3" },
  { id: "IT", nameEn: "Information Tech", accent: "#9fb5e8" },
];

type AuthTab = "register" | "login";

interface StudentSubscriptionRequest {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  amount: number;
  method: "vodafone_cash" | "instapay" | string;
  senderInfo: string;
  status: "pending" | "approved" | "rejected" | string;
  adminNote: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

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

function formatArabicDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
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
  google_not_configured: "تسجيل الدخول عبر جوجل غير مفعّل حالياً — استخدم البريد الإلكتروني وكلمة المرور.",
  google_cancelled: "تم إلغاء تسجيل الدخول عبر جوجل.",
  google_state_expired: "انتهت مهلة جلسة جوجل — اضغط الزر وحاول مرة أخرى.",
  google_state_invalid: "تعذّر التحقق من جلسة جوجل — حاول مرة أخرى.",
  google_state_mismatch: "تعذّر التحقق من أمان الجلسة — حاول مرة أخرى.",
  google_token_failed: "تعذّر إتمام المصادقة مع جوجل — حاول مجدداً.",
  google_profile_failed: "تعذّر قراءة بيانات حساب جوجل — حاول مرة أخرى.",
  google_unverified_email: "يجب أن يكون بريد جوجل مفعّلاً وموثّقاً للمتابعة.",
  google_callback_error: "حدث خطأ مؤقت أثناء الدخول بحساب جوجل — حاول مجدداً.",
  account_suspended: "تم تجميد هذا الحساب مؤقتاً. تواصل مع م. أحمد أمير للمساعدة.",
  suspended: "تم تجميد هذا الحساب مؤقتاً. تواصل مع م. أحمد أمير للمساعدة.",
  device_limit:
    "تم الوصول للحد الأقصى للأجهزة المسموحة لهذا الحساب. تواصل مع م. أحمد لإعادة ضبط الأجهزة.",
  device_limit_reached:
    "تم الوصول للحد الأقصى للأجهزة المسموحة لهذا الحساب. تواصل مع م. أحمد لإعادة ضبط الأجهزة.",
  device_blocked:
    "تم حظر هذا الجهاز من الوصول إلى الحساب. تواصل مع م. أحمد أمير للمساعدة.",
  registration_closed:
    "التسجيل الجديد مغلق مؤقتاً في الوقت الحالي. تواصل مع م. أحمد أمير للمساعدة.",
  google_account_conflict:
    "هذا البريد الإلكتروني مرتبط بحساب جوجل آخر — تواصل مع م. أحمد أمير.",
  db_not_configured: "الخدمة قيد التجهيز حالياً.",
};

function readInitialOAuthError(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error");
    const reason = params.get("reason")?.trim();
    if (
      (code === "device_limit_reached" || code === "device_blocked") &&
      reason
    ) {
      return reason;
    }
    if (code && OAUTH_ERROR_MESSAGES[code]) {
      return reason
        ? `${OAUTH_ERROR_MESSAGES[code]} (${reason})`
        : OAUTH_ERROR_MESSAGES[code];
    }
    if (reason) return reason;
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

interface StudentAcademicPassProps {
  isDark: boolean;
  displayName: string;
  year: number;
  dept: PortalDepartment;
  deptNameEn: string;
  deptAccent: string;
  passSerial: string;
  displayPhone: string;
  email?: string;
  isAdmin?: boolean;
  matchedCourses: { badge: string; items: string[] };
}

function StudentAcademicPass({
  isDark,
  displayName,
  year,
  dept,
  deptNameEn,
  deptAccent,
  passSerial,
  displayPhone,
  email,
  isAdmin = false,
  matchedCourses,
}: StudentAcademicPassProps) {
  return (
    <div className="space-y-3.5">
      {/* Luxury Digital Student Academic Pass (No TiltedCard) */}
      <div
        className="relative rounded-[28px] p-5 sm:p-6 text-white overflow-hidden border transition-all duration-300"
        style={{
          background: isDark
            ? "linear-gradient(138deg, #1b1e29 0%, #0f1118 54%, #151822 100%)"
            : "linear-gradient(138deg, #1b3158 0%, #101f3a 56%, #0b1629 100%)",
          borderColor: isDark
            ? "rgba(216, 176, 122, 0.30)"
            : "rgba(231, 198, 148, 0.36)",
          boxShadow: isDark
            ? "0 24px 56px rgba(0, 0, 0, 0.56), inset 0 1px 0 rgba(245, 224, 188, 0.28)"
            : "0 24px 56px rgba(16, 30, 56, 0.28), inset 0 1px 0 rgba(255, 240, 210, 0.32)",
        }}
      >
        {/* Top champagne / gold foil specular rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-10 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(244, 217, 172, 0.85) 50%, transparent 100%)",
          }}
        />

        {/* Subtle brushed foil sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            background:
              "radial-gradient(circle at 12% 16%, rgba(216, 176, 122, 0.20) 0%, transparent 48%), radial-gradient(circle at 88% 85%, rgba(110, 196, 163, 0.14) 0%, transparent 45%)",
          }}
        />

        {/* Swiss Geometric Arc Watermark */}
        <svg
          aria-hidden="true"
          viewBox="0 0 240 240"
          className="pointer-events-none absolute -bottom-14 -left-14 w-56 h-56 opacity-[0.16]"
        >
          <circle
            cx="120"
            cy="120"
            r="96"
            fill="none"
            stroke="#e7c694"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx="120"
            cy="120"
            r="70"
            fill="none"
            stroke="#e7c694"
            strokeWidth="0.9"
          />
          <circle
            cx="120"
            cy="120"
            r="44"
            fill="none"
            stroke="#6ec4a3"
            strokeWidth="0.8"
            strokeDasharray="2 5"
          />
          <path
            d="M120 12 L120 30 M120 210 L120 228 M12 120 L30 120 M210 120 L228 120"
            stroke="#e7c694"
            strokeWidth="1"
          />
        </svg>

        {/* Pass Top Row: University Title + Serial */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: deptAccent,
                boxShadow: `0 0 10px ${deptAccent}`,
              }}
            />
            <span className="font-en text-[10.5px] font-extrabold tracking-[0.14em] uppercase text-[#eed8b4] truncate">
              ZAGAZIG FCI · ACADEMIC PASS
            </span>
          </div>
          <span
            dir="ltr"
            className="font-mono-code text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg bg-white/[0.08] border border-[#e7c694]/25 text-[#f3dfb9] whitespace-nowrap shrink-0"
          >
            {passSerial}
          </span>
        </div>

        {/* Pass Main Identity Row */}
        <div className="relative z-10 py-5 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white border shrink-0 shadow-lg"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(216,176,122,0.34), rgba(16,19,28,0.92))"
                : "linear-gradient(135deg, rgba(231,198,148,0.32), rgba(15,28,52,0.92))",
              borderColor: "rgba(231, 198, 148, 0.42)",
            }}
          >
            {getInitials(displayName)}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xl sm:text-[22px] font-black tracking-tight text-white truncate">
                {displayName}
              </div>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#d8b07a]/20 border border-[#d8b07a]/40 text-[#f3dfb9]">
                  <Shield className="w-3 h-3" />
                  <span>أدمن</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-bold">
              <span className="px-2.5 py-0.5 rounded-lg bg-white/12 text-white">
                الفرقة {year}
              </span>
              <span
                dir="ltr"
                className="font-en px-2.5 py-0.5 rounded-lg font-extrabold border border-[#e7c694]/35 bg-[#d8b07a]/15 text-[#f7e7cb]"
              >
                {dept} · {deptNameEn}
              </span>
            </div>

            {(displayPhone || email) && (
              <div
                dir="ltr"
                className="font-mono-code text-[11px] text-slate-300/85 truncate text-right pt-0.5"
              >
                {displayPhone}
                {displayPhone && email ? " · " : ""}
                {email}
              </div>
            )}
          </div>
        </div>

        {/* Pass Footer Strip */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300/90">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6ec4a3] shrink-0" />
            <span>بطاقة طالب · بوابة م. أحمد أمير</span>
          </span>
          <span className="font-mono-code text-[10px] tracking-widest uppercase text-[#e7c694]/80">
            TERM 2026
          </span>
        </div>
      </div>

      {/* Matched Courses Preview Underneath */}
      <div
        className="rounded-2xl border p-4 space-y-2.5 backdrop-blur-md"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center gap-2 text-[12px] font-extrabold">
          <BookOpen
            className="w-4 h-4 shrink-0"
            style={{ color: "var(--brand-primary)" }}
          />
          <span style={{ color: "var(--text-primary)" }}>
            {matchedCourses.badge}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {matchedCourses.items.map((item) => (
            <span
              key={item}
              dir="ltr"
              className="font-en px-2.5 py-1 rounded-xl border text-[11px] font-bold"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const portal = usePortalState();
  const auth = useAuthState();
  const theme = useTheme();
  const isDark = theme === "dark";

  const [authTab, setAuthTab] = useState<AuthTab>("register");

  // Student pass & registration/edit drafts
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [yearDraft, setYearDraft] = useState<number | null>(null);
  const [deptDraft, setDeptDraft] = useState<PortalDepartment | null>(null);
  const [phoneDraft, setPhoneDraft] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [completingProfile, setCompletingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [isCompleteFlow, setIsCompleteFlow] = useState<boolean>(false);

  // Student Subscription Requests state (Logged-in view)
  const [subRequests, setSubRequests] = useState<StudentSubscriptionRequest[]>(
    []
  );
  const [subRequestsLoading, setSubRequestsLoading] = useState(false);
  const [subRequestsLoaded, setSubRequestsLoaded] = useState(false);

  // Sync URL query params after hydration cleanly
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

  // Fetch student's Vodafone Cash / InstaPay subscription requests when logged in
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    let cancelled = false;

    const loadMySubscriptions = async () => {
      setSubRequestsLoading(true);
      try {
        const res = await fetch("/api/subscriptions/my", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as {
          requests?: StudentSubscriptionRequest[];
        } | null;
        if (!cancelled && Array.isArray(data?.requests)) {
          setSubRequests(data.requests);
        }
      } catch {
        // gracefully keep empty list if offline
      } finally {
        if (!cancelled) {
          setSubRequestsLoading(false);
          setSubRequestsLoaded(true);
        }
      }
    };

    void loadMySubscriptions();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, currentUser]);

  const name = currentUser
    ? (nameDraft ?? currentUser.fullName)
    : (nameDraft ?? portal.profile.name);
  const year = currentUser
    ? (yearDraft ?? currentUser.yearLevel)
    : (yearDraft ?? portal.profile.year);
  const dept: PortalDepartment = currentUser
    ? (deptDraft ?? currentUser.department)
    : (deptDraft ?? portal.profile.dept);
  const phone = currentUser
    ? (phoneDraft ?? currentUser.phone ?? "")
    : (phoneDraft ?? "");

  const activeDept =
    DEPT_OPTIONS.find((d) => d.id === dept) ?? DEPT_OPTIONS[0];
  const matchedCourses = getMatchedCoursesPreview(year);
  const displayName = name.trim() || "طالب حاسبات";
  const displayPhone = phone.trim();
  const passSerial = `ZAG-2026-${dept}-0${year}`;

  const quizAverage = useMemo(() => {
    const scores = Object.values(portal.quizScores);
    if (scores.length === 0) return null;
    const sum = scores.reduce((acc, s) => acc + s, 0);
    return Math.round(sum / scores.length);
  }, [portal.quizScores]);

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
    const oauthUrl = new URL(
      `/api/auth/google?${params.toString()}`,
      window.location.origin
    ).toString();
    window.location.assign(oauthUrl);
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
        setErrorMsg(data?.error || "تعذّر حفظ رقم الموبايل — حاول مرة أخرى.");
        return;
      }

      saveProfile({
        name: data.user.fullName,
        year: data.user.yearLevel,
        dept: data.user.department,
        saved: true,
      });
      setAuthenticatedUser(data.user);
      setNameDraft(null);
      setYearDraft(null);
      setDeptDraft(null);
      setPhoneDraft(null);
      emitToast(`تم حفظ بياناتك يا ${data.user.fullName} بنجاح ✓`);
      router.push(getSafeNextPath());
      router.refresh();
    } catch {
      setErrorMsg("تعذّر الاتصال بالسيرفر — حاول مرة أخرى.");
    } finally {
      setCompletingProfile(false);
    }
  }

  async function handleAccountProfileSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentUser || savingProfile) return;
    setProfileError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (cleanName.length < 2) {
      setProfileError("أدخل اسمك الكامل (حرفين على الأقل).");
      return;
    }

    if (cleanPhone.length > 0 && cleanPhone.length < 10) {
      setProfileError("أدخل رقم موبايل صحيح (مثال: 01012345678).");
      return;
    }

    setSavingProfile(true);
    try {
      saveProfile({
        name: cleanName,
        year,
        dept,
        saved: true,
      });

      if (cleanPhone.length >= 10) {
        const res = await fetch("/api/auth/complete-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            phone: cleanPhone,
            fullName: cleanName,
            yearLevel: year,
            department: dept,
          }),
        });
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          user?: SessionUser;
          error?: string;
        } | null;

        if (!res.ok || !data?.ok || !data.user) {
          setProfileError(
            data?.error || "تعذّر تحديث بياناتك حالياً — حاول مرة أخرى."
          );
          return;
        }

        setAuthenticatedUser(data.user);
      } else {
        const snap = getPortalSnapshot();
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            profile: { name: cleanName, year, dept, saved: true },
            completedLessons: snap.completedLessons,
            quizScores: snap.quizScores,
            notes: snap.notes,
            mistakes: snap.mistakes,
            examDate: snap.examDate,
          }),
        });
        if (!res.ok) {
          setProfileError("تعذّر حفظ التعديلات حالياً — حاول مرة أخرى.");
          return;
        }
        setAuthenticatedUser({
          ...currentUser,
          fullName: cleanName,
          yearLevel: year,
          department: dept,
        });
      }

      setNameDraft(null);
      setYearDraft(null);
      setDeptDraft(null);
      setPhoneDraft(null);
      emitToast("تم تحديث بياناتك الأكاديمية بنجاح ✓");
    } catch {
      setProfileError("تعذّر الاتصال بالسيرفر — تحقق من الإنترنت وحاول مجدداً.");
    } finally {
      setSavingProfile(false);
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
            (res.status === 403
              ? "تعذّر تسجيل الدخول لهذا الحساب. تواصل مع م. أحمد أمير للمساعدة."
              : "تعذّر إتمام العملية حالياً — تأكد من البيانات وحاول مرة أخرى.")
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
      setNameDraft(null);
      setYearDraft(null);
      setDeptDraft(null);
      setPhoneDraft(null);
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
      setSubRequests([]);
      setSubRequestsLoaded(false);
      emitToast("تم تسجيل الخروج من حسابك.");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col w-full relative overflow-x-clip"
      style={{ background: "var(--atelier-bg)" }}
    >
      {/* Subtle Dual Atelier Dot Matrix & Ambient Glows */}
      <div
        aria-hidden="true"
        className="atelier-blueprint-grid fixed inset-0 z-0 opacity-75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-28 -right-24 w-[420px] h-[420px] rounded-full blur-3xl z-0"
        style={{ background: "var(--atelier-glow-a)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 -left-24 w-[380px] h-[380px] rounded-full blur-3xl z-0"
        style={{ background: "var(--atelier-glow-b)" }}
      />

      {/* Full-Width Atelier Topbar */}
      <header
        className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-300"
        style={{
          background: "var(--atelier-topbar-bg)",
          borderColor: "var(--atelier-topbar-border)",
        }}
      >
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-10 h-15 md:h-16 flex items-center justify-between gap-3">
          {/* Right (RTL Start): Founder Avatar + Eng. Ahmed Amir | CS PORTAL */}
          <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
            <div
              className="relative w-8 h-8 md:w-[34px] md:h-[34px] rounded-full overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{
                border: `1.5px solid ${isDark ? "#d8b07a" : "#15664b"}`,
              }}
            >
              <Image
                src="/images/founder.jpg"
                alt="Eng. Ahmed Amir"
                fill
                sizes="34px"
                className="object-cover object-[50%_15%]"
              />
            </div>

            <BrandName size="md" />

            <span
              className="hidden sm:inline-block w-px h-3.5 shrink-0"
              style={{ background: "var(--border-strong)" }}
              aria-hidden="true"
            />
            <span
              dir="ltr"
              className="hidden sm:inline-block font-mono-code text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              CS PORTAL
            </span>
          </Link>

          {/* Left (RTL End): العودة للمواد + Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/courses"
              className="h-9 px-3.5 rounded-full border text-[12px] font-extrabold inline-flex items-center gap-1.5 transition-all hover:-translate-y-px hover:opacity-90 whitespace-nowrap"
              style={{
                background: "var(--atelier-sec-bg)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              <span>العودة للمواد</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              title={
                isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"
              }
              aria-label={
                isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"
              }
              className="w-9 h-9 rounded-full border inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              style={{
                background: "var(--atelier-sec-bg)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              {isDark ? (
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
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-11 pb-24 md:pb-14 flex items-center">
        {isAuthenticated && currentUser && !needsPhoneCompletion ? (
          /* ================= LOGGED-IN VIEW: STUDENT ACCOUNT HUB ================= */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Right Column: Luxury Student Pass + Quick Actions */}
            <div className="lg:col-span-5 space-y-4">
              <StudentAcademicPass
                isDark={isDark}
                displayName={displayName}
                year={year}
                dept={dept}
                deptNameEn={activeDept.nameEn}
                deptAccent={activeDept.accent}
                passSerial={passSerial}
                displayPhone={displayPhone}
                email={currentUser.email}
                isAdmin={currentUser.role === "admin"}
                matchedCourses={matchedCourses}
              />

              {/* Quick Actions Panel */}
              <div
                className="sapphire-rim rounded-3xl border p-4 sm:p-5 space-y-2.5 backdrop-blur-xl"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <Link
                  href="/courses"
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2 transition-all hover:brightness-105 hover:-translate-y-px"
                  style={{
                    background: "var(--atelier-cta-bg)",
                    color: "var(--atelier-cta-fg)",
                    boxShadow: "var(--atelier-cta-shadow)",
                  }}
                >
                  <span>العودة للمواد</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </Link>

                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border text-[13px] font-extrabold inline-flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{
                      background: "var(--accent-warm-soft)",
                      borderColor: "transparent",
                      color: "var(--accent-warm-text)",
                    }}
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>لوحة التحكم</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={openFeedbackModal}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border text-[13px] font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors hover:opacity-90"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <MessageSquare
                    className="w-4 h-4 shrink-0"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <span>تواصل / إبلاغ عن مشكلة</span>
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border border-rose-500/20 bg-rose-500/[0.08] text-rose-700 dark:text-rose-300 text-[13px] font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-rose-500/15 disabled:opacity-60"
                >
                  {signingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  ) : (
                    <LogOut className="w-4 h-4 shrink-0" />
                  )}
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>

            {/* Left Column: Telemetry Tiles + Profile Editor + Subscription Requests */}
            <div className="lg:col-span-7 space-y-5">
              {/* Calm Welcome Header */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
                    style={{
                      background: "var(--brand-soft)",
                      color: "var(--brand-soft-text)",
                    }}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>حساب الطالب</span>
                  </span>
                </div>
                <h1
                  className="text-2xl sm:text-[26px] font-black tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  أهلاً يا {currentUser.fullName}
                </h1>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  تقدمك وملاحظاتك محفوظة تلقائياً على حسابك.
                </p>
              </div>

              {/* 3 Calm Telemetry Tiles */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="rounded-2xl border p-4 space-y-1.5 backdrop-blur-md"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--success-fg)" }}
                    />
                  </div>
                  <div
                    className="font-mono-code text-2xl font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {portal.completedLessons.length}
                  </div>
                  <div
                    className="text-[11.5px] font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    فصول مكتملة
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-4 space-y-1.5 backdrop-blur-md"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <Award
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                  </div>
                  <div
                    className="font-mono-code text-2xl font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {quizAverage !== null ? `${quizAverage}%` : "—"}
                  </div>
                  <div
                    className="text-[11.5px] font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    متوسط الكويزات
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openMistakeBankModal}
                  className="rounded-2xl border p-4 space-y-1.5 text-right backdrop-blur-md cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <FileWarning
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--accent-warm)" }}
                    />
                    <span
                      className="text-[10px] font-extrabold hidden sm:inline"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      مراجعة ←
                    </span>
                  </div>
                  <div
                    className="font-mono-code text-2xl font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {portal.mistakes.length}
                  </div>
                  <div
                    className="text-[11.5px] font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    أسئلة في بنك الأخطاء
                  </div>
                </button>
              </div>

              {/* Academic Profile Editor */}
              <div
                className="sapphire-rim rounded-3xl border p-5 sm:p-6 space-y-4 backdrop-blur-xl"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div>
                  <h2
                    className="text-[16px] font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    البيانات الأكاديمية
                  </h2>
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    عدّل اسمك أو فرقتك أو تخصصك وسيتم تحديث بطاقتك ومقرراتك
                    تلقائياً
                  </p>
                </div>

                <form
                  onSubmit={handleAccountProfileSave}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="editFullName"
                        className="block text-[12px] font-bold mb-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        الاسم الكامل
                      </label>
                      <input
                        id="editFullName"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setNameDraft(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-bold outline-none"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="editPhone"
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
                          id="editPhone"
                          type="tel"
                          dir="ltr"
                          value={phone}
                          onChange={(e) => setPhoneDraft(e.target.value)}
                          placeholder="01012345678"
                          className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border text-[13.5px] font-mono-code font-semibold text-left outline-none"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      className="text-[12px] font-bold mb-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      الفرقة الدراسية
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {YEAR_OPTIONS.map((y) => (
                        <button
                          key={y.value}
                          type="button"
                          onClick={() => setYearDraft(y.value)}
                          aria-pressed={year === y.value}
                          className={`filter-pill min-h-[42px] px-3 py-1.5 rounded-xl text-[12px] flex items-center justify-between cursor-pointer ${
                            year === y.value ? "active" : ""
                          }`}
                        >
                          <span className="font-bold">{y.label}</span>
                          <span className="font-mono-code text-[10.5px] opacity-75">
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
                          className={`filter-pill min-h-[42px] py-1.5 px-2 rounded-xl font-en text-[12.5px] font-extrabold cursor-pointer ${
                            dept === d.id ? "active" : ""
                          }`}
                        >
                          {d.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {profileError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 flex items-start gap-2 text-[12.5px] font-bold text-rose-700 dark:text-rose-300"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="min-h-[44px] px-5 py-2.5 rounded-2xl text-[13px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 disabled:opacity-60"
                      style={{
                        background: "var(--atelier-cta-bg)",
                        color: "var(--atelier-cta-fg)",
                        boxShadow: "var(--atelier-cta-shadow)",
                      }}
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>حفظ التعديلات</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Subscription Requests Status Section */}
              <div
                className="sapphire-rim rounded-3xl border p-5 sm:p-6 space-y-4 backdrop-blur-xl"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2
                      className="text-[16px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      حالة طلبات الاشتراك
                    </h2>
                    <p
                      className="text-[12px] mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      متابعة طلبات فودافون كاش و InstaPay وتفعيل المقررات
                    </p>
                  </div>
                  {subRequests.length > 0 && (
                    <span
                      className="font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: "var(--brand-soft)",
                        color: "var(--brand-soft-text)",
                      }}
                    >
                      {subRequests.length}
                    </span>
                  )}
                </div>

                {subRequestsLoading && !subRequestsLoaded ? (
                  <div
                    className="rounded-2xl border p-6 flex items-center justify-center gap-2 text-[12.5px] font-bold"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تحميل طلباتك...</span>
                  </div>
                ) : subRequests.length === 0 ? (
                  <div
                    className="rounded-2xl border p-5 text-center space-y-1.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      className="text-[13px] font-bold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      لا توجد طلبات اشتراك مسجلة حتى الآن
                    </div>
                    <p
                      className="text-[11.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      عند إرسال طلب اشتراك لأي مقرر مدفوع عبر فودافون كاش أو
                      InstaPay، ستظهر حالته هنا فوراً.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subRequests.map((req) => {
                      const isApproved = req.status === "approved";
                      const isRejected = req.status === "rejected";
                      const isVf = req.method === "vodafone_cash";
                      return (
                        <div
                          key={req.id}
                          className="rounded-2xl border p-4 space-y-2.5"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  dir="ltr"
                                  className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded-md"
                                  style={{
                                    background: "var(--brand-soft)",
                                    color: "var(--brand-soft-text)",
                                  }}
                                >
                                  {req.courseCode}
                                </span>
                                <span
                                  className="text-[13.5px] font-black"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {req.courseTitle}
                                </span>
                              </div>
                            </div>

                            {isApproved ? (
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0"
                                style={{
                                  background: "var(--success-soft)",
                                  color: "var(--success-fg)",
                                }}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>تم التفعيل</span>
                              </span>
                            ) : isRejected ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 bg-rose-500/12 text-rose-700 dark:text-rose-300">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>مرفوض</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0"
                                style={{
                                  background: "var(--accent-warm-soft)",
                                  color: "var(--accent-warm-text)",
                                }}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>قيد المراجعة</span>
                              </span>
                            )}
                          </div>

                          <div
                            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] font-semibold"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <span className="inline-flex items-center gap-1">
                              {isVf ? (
                                <Smartphone className="w-3.5 h-3.5" />
                              ) : (
                                <CreditCard className="w-3.5 h-3.5" />
                              )}
                              <span>{isVf ? "فودافون كاش" : "InstaPay"}</span>
                            </span>
                            {req.amount > 0 && (
                              <span
                                className="font-extrabold"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {req.amount} ج.م
                              </span>
                            )}
                            <span dir="ltr" className="font-mono-code">
                              {req.senderInfo}
                            </span>
                            <span>{formatArabicDate(req.createdAt)}</span>
                          </div>

                          {req.adminNote && (
                            <div
                              className={`rounded-xl border px-3 py-2 text-[12px] font-bold leading-relaxed ${
                                isRejected
                                  ? "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                  : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                              }`}
                            >
                              ملاحظة الإدارة: {req.adminNote}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ================= LOGGED-OUT OR GOOGLE PHONE COMPLETION VIEW ================= */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            {/* Right Column: Luxury Digital Student Academic Pass */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1.5 text-right">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
                  style={{
                    background: "var(--brand-soft)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>حساب الطالب</span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-black tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  بطاقتك الدراسية على المنصة
                </h2>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  تقدمك وملاحظاتك محفوظة تلقائياً على حسابك لتكمل مذاكرتك من
                  حيث توقفت في أي وقت.
                </p>
              </div>

              <StudentAcademicPass
                isDark={isDark}
                displayName={displayName}
                year={year}
                dept={dept}
                deptNameEn={activeDept.nameEn}
                deptAccent={activeDept.accent}
                passSerial={passSerial}
                displayPhone={displayPhone}
                matchedCourses={matchedCourses}
              />
            </div>

            {/* Left Column: Clean Atelier Auth Card */}
            <div className="lg:col-span-6">
              <div
                className="sapphire-rim rounded-[28px] border p-5 sm:p-7 space-y-5 backdrop-blur-xl"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {isAuthenticated && currentUser && needsPhoneCompletion ? (
                  /* Google OAuth Final Step: Phone + Academic Year/Dept */
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
                        أهلاً يا <strong>{currentUser.fullName}</strong> — أضف
                        رقم موبايلك (واتساب) واختر فرقتك وقسمك لتخصيص مقرراتك.
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
                            onChange={(e) => setPhoneDraft(e.target.value)}
                            placeholder="01012345678"
                            autoComplete="tel"
                            className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border text-[13.5px] font-mono-code font-semibold outline-none text-left"
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
                          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 flex items-start gap-2 text-[12.5px] font-bold text-rose-700 dark:text-rose-300"
                        >
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={completingProfile}
                        className="w-full min-h-[48px] py-3 rounded-2xl text-[14px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 disabled:opacity-65"
                        style={{
                          background: "var(--atelier-cta-bg)",
                          color: "var(--atelier-cta-fg)",
                          boxShadow: "var(--atelier-cta-shadow)",
                        }}
                      >
                        {completingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>جاري الحفظ...</span>
                          </>
                        ) : (
                          <span>حفظ البيانات والدخول للمنصة ←</span>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Standard Register / Login Form */
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                          background: "var(--brand-soft)",
                          color: "var(--brand-soft-text)",
                        }}
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
                            ? "إنشاء حساب طالب"
                            : "تسجيل الدخول"}
                        </h1>
                        <p
                          className="text-[12.5px] leading-snug"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {authTab === "register"
                            ? "تقدمك وملاحظاتك محفوظة تلقائياً على حسابك"
                            : "أدخل بريدك الإلكتروني أو رقم موبايلك لفتح مقرراتك"}
                        </p>
                      </div>
                    </div>

                    {/* Segmented Tabs: إنشاء حساب طالب | تسجيل الدخول */}
                    <div
                      role="tablist"
                      aria-label="إنشاء حساب طالب أو تسجيل الدخول"
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
                                background: "var(--atelier-cta-bg)",
                                color: "var(--atelier-cta-fg)",
                              }
                            : { color: "var(--text-secondary)" }
                        }
                      >
                        <UserPlus className="w-3.5 h-3.5 shrink-0" />
                        <span>إنشاء حساب طالب</span>
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
                                background: "var(--atelier-cta-bg)",
                                color: "var(--atelier-cta-fg)",
                              }
                            : { color: "var(--text-secondary)" }
                        }
                      >
                        <LogIn className="w-3.5 h-3.5 shrink-0" />
                        <span>تسجيل الدخول</span>
                      </button>
                    </div>

                    {/* Google Sign-In Button */}
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleContinueWithGoogle}
                        className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl border text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2.5 transition-all hover:opacity-90 cursor-pointer"
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
                          أو بالبريد الإلكتروني وكلمة المرور
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
                              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-bold outline-none"
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
                                onChange={(e) => setPhoneDraft(e.target.value)}
                                placeholder="01012345678"
                                autoComplete="tel"
                                className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border text-[13.5px] font-mono-code font-semibold outline-none text-left"
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
                            className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl border text-[13.5px] font-en font-semibold outline-none text-left"
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
                            className="w-full min-h-[44px] pr-10 pl-10 py-2 rounded-xl border text-[13.5px] font-mono-code outline-none text-left"
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
                            <div className="grid grid-cols-4 gap-2">
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

                      {/* Restrained Rose Alert Box (403 Suspended / Device-Limit / Validation Errors) */}
                      {errorMsg && (
                        <div
                          role="alert"
                          className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 flex items-start gap-2.5 text-[12.5px] font-bold leading-relaxed text-rose-700 dark:text-rose-300"
                        >
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full min-h-[48px] py-3 rounded-2xl text-[14px] font-extrabold inline-flex items-center justify-center gap-2 transition-all hover:brightness-105 hover:-translate-y-px cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--atelier-cta-bg)",
                          color: "var(--atelier-cta-fg)",
                          boxShadow: "var(--atelier-cta-shadow)",
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>جاري التحقق...</span>
                          </>
                        ) : authTab === "register" ? (
                          <span>إنشاء الحساب والدخول للمنصة ←</span>
                        ) : (
                          <span>تسجيل الدخول ←</span>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer variant="compact" className="relative z-10" />
      <MobileBottomDock />
    </div>
  );
}
