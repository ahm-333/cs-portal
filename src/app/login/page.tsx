"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { Footer } from "@/components/layout/Footer";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { TiltedCard } from "@/components/ui/ReactBits";
import { emitToast } from "@/lib/stores/events";
import {
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

  const activeDept =
    DEPT_OPTIONS.find((d) => d.id === dept) ?? DEPT_OPTIONS[0];
  const matchedCourses = getMatchedCoursesPreview(year);
  const displayName = name.trim() || "طالب حاسبات";
  const passSerial = `ZAG-2026-${dept}-0${year}`;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanName = name.trim() || "طالب حاسبات";
    saveProfile({
      name: cleanName,
      year,
      dept,
      saved: true,
    });
    emitToast(`أهلاً يا ${cleanName}! تم تخصيص مقررات فرقتك ✓`);
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
                  إعداد كارنيه الطالب المحلي
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

      {/* Main 2-Column Studio Onboarding: Live 3D Student Pass + Setup Form */}
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
                <span>معاينة حيّة لكارنيه مذاكرتك</span>
              </div>
              <p
                className="text-[12.5px]"
                style={{ color: "var(--text-secondary)" }}
              >
                اكتب اسمك واختار فرقتك وشوف بطاقتك ومقرراتك بتتجهّز فوراً.
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
                {/* Ambient Dept Accent Glow */}
                <div
                  className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-300"
                  style={{ background: activeDept.accent }}
                  aria-hidden="true"
                />

                {/* Top Pass Bar */}
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

                {/* Student Identity Row */}
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
                    </div>
                  </div>
                </div>

                {/* Dynamic Matched Courses Strip */}
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

                {/* Bottom Security & Privacy Strip */}
                <div className="relative z-10 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-300">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#66c7a6] shrink-0" />
                    <span>حفظ محلي 100% · بدون باسورد</span>
                  </span>
                  <span className="font-mono-code opacity-75 whitespace-nowrap shrink-0">
                    LOCAL-SYNC v3
                  </span>
                </div>
              </div>
            </TiltedCard>
          </div>

          {/* Column 2: Fast 5-Second Profile Setup Card */}
          <div className="lg:col-span-6">
            <div className="surface-card rounded-3xl p-5 sm:p-7 space-y-5">
              <div className="space-y-2.5">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>إعداد في 5 ثوانٍ · بدون تسجيل أو كلمة مرور</span>
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
                      جهّز مساحة مذاكرتك
                    </h1>
                    <p
                      className="text-[12.5px] leading-snug"
                      style={{ color: "var(--text-muted)" }}
                    >
                      لتخصيص مقررات فرقتك وحفظ تقدمك تلقائياً على متصفحك
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
                    اسمك (للوحة الترحيب والكارنيه)
                  </label>
                  <input
                    id="localProfileName"
                    type="text"
                    value={name}
                    onChange={(e) => setNameDraft(e.target.value)}
                    placeholder="مثال: أحمد أمير"
                    autoComplete="name"
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border text-[14px] font-bold outline-none transition-colors focus:ring-2"
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
                    {YEAR_OPTIONS.map((y) => (
                      <button
                        key={y.value}
                        type="button"
                        onClick={() => setYearDraft(y.value)}
                        aria-pressed={year === y.value}
                        className={`filter-pill min-h-[46px] px-3 py-2.5 rounded-xl text-[12.5px] flex items-center justify-between cursor-pointer ${
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
                        className={`filter-pill min-h-[48px] py-2 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          dept === d.id ? "active" : ""
                        }`}
                      >
                        <span className="font-en text-[13px] font-extrabold">
                          {d.id}
                        </span>
                        <span className="font-en text-[9.5px] opacity-70 truncate max-w-full">
                          {d.nameEn.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="cta-shimmer w-full min-h-[48px] py-3 rounded-2xl text-[14px] font-extrabold text-white transition-transform hover:-translate-y-0.5 cursor-pointer shadow-md"
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
                <span>بياناتك لا تُرسل لأي سيرفر خارجي</span>
                <Link
                  href="/courses"
                  className="min-h-[36px] inline-flex items-center font-bold hover:underline"
                  style={{ color: "var(--brand-primary)" }}
                >
                  تخطي ودخول المقررات ←
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
