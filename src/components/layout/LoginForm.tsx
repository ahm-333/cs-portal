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
      {/* Header */}
      <div className="text-center">
        <Link
          href="/"
          className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--hero)] text-white shadow-[var(--shadow-pill)]"
        >
          <GraduationCap className="h-6 w-6" />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
          ملف الطالب
        </h1>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          إعداد حسابك المحلي في 5 ثوانٍ لتخصيص استوديو مذاكرتك في{" "}
          <span className="font-bold text-[var(--ink)]">
            {SITE_CONFIG.arabicName}
          </span>
          .
        </p>
      </div>

      {/* Study Studio Paper Card */}
      <div className="studio-card p-6 sm:p-7">
        {/* Local Privacy Notice */}
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[var(--pos)]/25 bg-[var(--pos-soft)] p-3.5 text-xs leading-relaxed text-[var(--pos)]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="font-semibold">
            بدون كلمة مرور أو إيميل — يُحفظ اسمك وفرقتك وتقدمك الدراسي محلياً
            على جهازك مباشرة وبخصوصية تامة.
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-[var(--neg)]/30 bg-[var(--neg-soft)] p-3.5 text-xs font-semibold leading-relaxed text-[var(--neg)]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {clearedMessage && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-[var(--pos)]/30 bg-[var(--pos-soft)] p-3.5 text-xs font-semibold leading-relaxed text-[var(--pos)]"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{clearedMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="student-name"
              className="mb-2 block text-xs font-extrabold text-[var(--ink)]"
            >
              الاسم
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
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
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] py-3 pl-4 pr-10 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--paper)] focus:outline-none"
              />
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-[var(--ink)]">
              <GraduationCap className="h-4 w-4 text-[var(--accent)]" />
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
                        ? "border-[var(--accent)] bg-[var(--soft)] text-[var(--accent)] shadow-[var(--shadow-pill)]"
                        : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
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
            <span className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-[var(--ink)]">
              <Cpu className="h-4 w-4 text-[var(--pos)]" />
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
                        ? "border-[var(--pos)] bg-[var(--pos-soft)] text-[var(--pos)] shadow-[var(--shadow-pill)]"
                        : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <span className="truncate">{dept.label}</span>
                    <span
                      dir="ltr"
                      className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        active
                          ? "bg-[var(--paper)]/80 text-[var(--pos)]"
                          : "bg-[var(--paper)] text-[var(--muted)]"
                      }`}
                    >
                      {dept.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit + Optional Clear */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--hero)] px-4 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-pill)] transition-colors hover:bg-[var(--hero-deep)]"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--neg)]/30 bg-[var(--neg-soft)] px-4 py-2.5 text-xs font-bold text-[var(--neg)] transition-opacity hover:opacity-90"
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
