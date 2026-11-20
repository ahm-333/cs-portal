"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Save,
  ShieldCheck,
  Terminal,
  Trash2,
  User,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import {
  clearLocalProfile,
  DEPARTMENTS,
  saveLocalProfile,
  useLocalProfile,
  type StudentDepartment,
} from "./localProfile";

interface LoginFormProps {
  nextPath: string;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const existingProfile = useLocalProfile();

  const [fullNameInput, setFullNameInput] = useState<string | null>(null);
  const [yearLevelInput, setYearLevelInput] = useState<number | null>(null);
  const [departmentInput, setDepartmentInput] =
    useState<StudentDepartment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clearedMessage, setClearedMessage] = useState<string | null>(null);

  const fullName = fullNameInput ?? existingProfile?.full_name ?? "";
  const yearLevel = yearLevelInput ?? existingProfile?.year_level ?? 2;
  const department = departmentInput ?? existingProfile?.department ?? "CS";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setClearedMessage(null);

    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      setErrorMessage("يرجى كتابة اسمك (حرفين على الأقل) لحفظ ملفك المحلي.");
      return;
    }

    saveLocalProfile({
      full_name: trimmedName,
      year_level: yearLevel,
      department,
    });

    router.push(nextPath || "/dashboard");
  }

  function handleClearProfile() {
    clearLocalProfile();
    setFullNameInput("");
    setYearLevelInput(2);
    setDepartmentInput("CS");
    setErrorMessage(null);
    setClearedMessage("تم مسح بيانات ملف الطالب من هذا الجهاز بنجاح.");
  }

  return (
    <div className="w-full max-w-lg space-y-5">
      {/* Brand Header */}
      <div className="text-center">
        <Link
          href="/"
          className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/35 bg-indigo-500/15 text-indigo-400 shadow-lg shadow-indigo-950/50"
        >
          <Terminal className="h-6 w-6" />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          ملف الطالب
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          إعداد حسابك المحلي في 5 ثوانٍ لتخصيص لوحة مذاكرتك في{" "}
          <span className="font-bold text-slate-200">
            {SITE_CONFIG.arabicName}
          </span>
          .
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 sm:p-7">
        {/* Privacy / Local Storage Note */}
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-100/90">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <p>
            بدون كلمة مرور أو إيميل — يُحفظ اسمك وفرقتك وتقدمك الدراسي محلياً
            على جهازك مباشرة وبخصوصية تامة.
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs leading-relaxed text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {clearedMessage && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-200"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{clearedMessage}</span>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="student-name"
              className="mb-2 block text-xs font-bold text-slate-300"
            >
              الاسم
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="student-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullNameInput(e.target.value);
                  setErrorMessage(null);
                  setClearedMessage(null);
                }}
                placeholder="مثال: أحمد طارق"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 py-3 pl-4 pr-10 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              <span>الفرقة الدراسية</span>
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {SITE_CONFIG.years.map((year) => {
                const active = yearLevel === year.value;
                return (
                  <button
                    key={year.value}
                    type="button"
                    onClick={() => setYearLevelInput(year.value)}
                    aria-pressed={active}
                    className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? "border-indigo-500 bg-indigo-600/20 text-indigo-200 ring-1 ring-inset ring-indigo-500/40"
                        : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {year.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Department */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>القسم / التخصص</span>
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {DEPARTMENTS.map((dept) => {
                const active = department === dept.value;
                return (
                  <button
                    key={dept.value}
                    type="button"
                    onClick={() => setDepartmentInput(dept.value)}
                    aria-pressed={active}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? "border-emerald-500/80 bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-500/35"
                        : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <span className="truncate">{dept.label}</span>
                    <span
                      dir="ltr"
                      className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        active
                          ? "bg-emerald-500/25 text-emerald-200"
                          : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      {dept.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Save Action */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/60 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <Save className="h-4 w-4" />
              <span>
                {existingProfile
                  ? "حفظ التعديلات والمتابعة"
                  : "حفظ الملف والانتقال لمذاكرتي"}
              </span>
              <ArrowLeft className="h-4 w-4" />
            </button>

            {existingProfile && (
              <button
                type="button"
                onClick={handleClearProfile}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>مسح الملف المحلي (تسجيل الخروج)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
