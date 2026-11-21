"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Moon, Sparkles, Sun, UserRound } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { emitToast } from "@/lib/stores/events";
import {
  saveProfile,
  usePortalState,
  type PortalDepartment,
} from "@/lib/stores/portalStore";

const YEARS = [1, 2, 3, 4] as const;
const DEPARTMENTS: ReadonlyArray<PortalDepartment> = ["CS", "AI", "IS", "IT"];

export default function LoginPage() {
  const router = useRouter();
  const portal = usePortalState();
  const theme = useTheme();

  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [yearDraft, setYearDraft] = useState<number | null>(null);
  const [deptDraft, setDeptDraft] = useState<PortalDepartment | null>(null);

  const name = nameDraft ?? portal.profile.name;
  const year = yearDraft ?? portal.profile.year;
  const dept = deptDraft ?? portal.profile.dept;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanName = name.trim() || "طالب حاسبات";
    saveProfile({
      name: cleanName,
      year,
      dept,
      saved: true,
    });
    emitToast(`أهلاً يا ${cleanName}! تم تخصيص مقررات فرقتك`);
    router.push("/courses");
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Compact Warm Editorial Topbar */}
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
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: "var(--hero-bg)" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="leading-tight hidden sm:block truncate">
                <div
                  className="font-en font-extrabold text-[14px] truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  Ahmed Amir Ahmed
                </div>
                <div
                  className="text-[10.5px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  إعداد ملف الطالب
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

            <Link
              href="/courses"
              className="px-3 sm:px-3.5 min-h-[38px] h-9.5 rounded-xl text-[11.5px] sm:text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 shrink-0"
              style={{ background: "var(--hero-bg)" }}
            >
              <span>مكتبة المقررات</span>
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Centered Profile Setup Card */}
      <main className="flex-1 flex items-center justify-center px-3.5 sm:px-6 lg:px-8 py-7 sm:py-10">
        <div className="w-full max-w-md space-y-5">
          <div className="surface-card rounded-3xl p-5 sm:p-7 space-y-5">
            <div className="space-y-2.5">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>إعداد في 5 ثوانٍ · بدون كلمة مرور</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ background: "var(--hero-bg)" }}
                >
                  <UserRound className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h1
                    className="text-xl font-black tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    إعداد ملفك المحلي
                  </h1>
                  <p
                    className="text-[12.5px] leading-snug"
                    style={{ color: "var(--text-muted)" }}
                  >
                    لتخصيص مقررات فرقتك وحفظ تقدمك تلقائياً على جهازك
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="localProfileName"
                  className="block text-[12px] font-bold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  الاسم
                </label>
                <input
                  id="localProfileName"
                  type="text"
                  value={name}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="مثال: أحمد"
                  autoComplete="name"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-colors focus:ring-2"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <div
                  className="text-[12px] font-bold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  الفرقة الدراسية
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYearDraft(y)}
                      aria-pressed={year === y}
                      className={`filter-pill min-h-[44px] py-2.5 rounded-xl text-[12.5px] flex items-center justify-center gap-1 cursor-pointer ${
                        year === y ? "active" : ""
                      }`}
                    >
                      <span>الفرقة</span>
                      <span className="font-en">{y}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div
                  className="text-[12px] font-bold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  التخصص
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDeptDraft(d)}
                      aria-pressed={dept === d}
                      className={`filter-pill min-h-[44px] py-2.5 rounded-xl text-[12.5px] font-en flex items-center justify-center cursor-pointer ${
                        dept === d ? "active" : ""
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] py-3 rounded-xl text-[13.5px] font-extrabold text-white transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
                style={{ background: "#c25e33" }}
              >
                حفظ وتفعيل مقررات فرقتي ←
              </button>
            </form>

            <div
              className="pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[12px]"
              style={{
                borderColor: "var(--border-soft)",
                color: "var(--text-muted)",
              }}
            >
              <span>يُحفظ محلياً في متصفحك فقط</span>
              <Link
                href="/courses"
                className="min-h-[36px] inline-flex items-center font-bold hover:underline"
                style={{ color: "var(--brand-primary)" }}
              >
                تخطي الآن ←
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
