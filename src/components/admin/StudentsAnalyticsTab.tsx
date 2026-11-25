"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Award,
  Download,
  MessageCircle,
  RefreshCw,
  Search,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/auth/phone";
import { emitToast } from "@/lib/stores/events";
import { CreateAccountModal } from "@/components/admin/CreateAccountModal";
import { StudentDetailModal } from "@/components/admin/StudentDetailModal";
import {
  formatArabicDate,
  formatArabicDateTime,
  type AdminCourseOption,
  type AdminLessonOption,
  type AdminStudentItem,
} from "@/components/admin/adminTypes";

export interface StudentsAnalyticsTabProps {
  currentAdminId: string;
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
  initialShowCreate?: boolean;
  onStatsChanged: () => void;
}

const ROLE_FILTERS = [
  { value: "student", label: "الطلاب" },
  { value: "admin", label: "المشرفون" },
  { value: "all", label: "الكل" },
] as const;

const YEAR_FILTERS = [
  { value: "all", label: "كل الفرق" },
  { value: "1", label: "ف1" },
  { value: "2", label: "ف2" },
  { value: "3", label: "ف3" },
  { value: "4", label: "ف4" },
] as const;

const DEPT_FILTERS = ["all", "CS", "AI", "IS", "IT"] as const;

function getStudentInitials(fullName: string): string {
  const clean = fullName.trim();
  if (!clean) return "ST";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function getQuizBadgeStyle(score: number | null): {
  background: string;
  color: string;
} {
  if (score === null) {
    return { background: "var(--bg-subtle)", color: "var(--text-muted)" };
  }
  if (score >= 80) {
    return { background: "var(--success-soft)", color: "var(--success-fg)" };
  }
  if (score >= 55) {
    return { background: "var(--brand-soft)", color: "var(--brand-soft-text)" };
  }
  return { background: "var(--danger-soft)", color: "var(--danger-fg)" };
}

export function StudentsAnalyticsTab({
  currentAdminId,
  courses,
  lessons,
  initialShowCreate = false,
  onStatsChanged,
}: StudentsAnalyticsTabProps) {
  const [students, setStudents] = useState<AdminStudentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"student" | "admin" | "all">(
    "student"
  );
  const [yearFilter, setYearFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(initialShowCreate);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 260);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const triggerReload = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    params.set("role", roleFilter);
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (yearFilter !== "all") params.set("year", yearFilter);
    if (deptFilter !== "all") params.set("dept", deptFilter);

    (async () => {
      try {
        const res = await fetch(`/api/admin/students?${params.toString()}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          students?: AdminStudentItem[];
          error?: string;
        };

        if (!active) return;
        if (!res.ok) {
          throw new Error(data.error || "تعذر تحميل بيانات الحسابات.");
        }

        setStudents(data.students ?? []);
        setLoadError(null);
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error ? error.message : "تعذر تحميل بيانات الحسابات."
        );
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [debouncedQuery, roleFilter, yearFilter, deptFilter, refreshTick]);

  function buildExportUrl(): string {
    const params = new URLSearchParams();
    params.set("role", roleFilter);
    if (yearFilter !== "all") params.set("year", yearFilter);
    if (deptFilter !== "all") params.set("dept", deptFilter);
    return `/api/admin/students/export?${params.toString()}`;
  }

  return (
    <div className="space-y-5">
      {/* Search, Filter & Action Toolbar */}
      <section className="surface-card rounded-3xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search
              className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الطالب، البريد الإلكتروني، أو رقم الموبايل..."
              className="w-full min-h-[42px] pr-10 pl-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer hover:opacity-95 shadow-sm"
              style={{ background: "var(--accent-warm)" }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة حساب جديد</span>
            </button>

            <a
              href={buildExportUrl()}
              onClick={() => emitToast("جاري تحميل ملف بيانات الطلاب CSV...")}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </a>

            <span
              className="text-[12px] font-bold px-3 py-1.5 rounded-xl"
              style={{
                background: "var(--bg-subtle)",
                color: "var(--text-secondary)",
              }}
            >
              النتائج:{" "}
              <strong className="font-mono-code">{students.length}</strong>
            </span>

            <button
              type="button"
              onClick={triggerReload}
              aria-label="تحديث القائمة"
              className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ROLE_FILTERS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRoleFilter(r.value)}
                aria-pressed={roleFilter === r.value}
                className={`filter-pill min-h-[34px] px-3 py-1 rounded-xl text-[12px] cursor-pointer ${
                  roleFilter === r.value ? "active-warm" : ""
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div
            className="h-5 w-px hidden sm:block"
            style={{ background: "var(--border-soft)" }}
          />

          <div className="flex flex-wrap items-center gap-1.5">
            {YEAR_FILTERS.map((y) => (
              <button
                key={y.value}
                type="button"
                onClick={() => setYearFilter(y.value)}
                aria-pressed={yearFilter === y.value}
                className={`filter-pill min-h-[34px] px-3 py-1 rounded-xl text-[12px] cursor-pointer ${
                  yearFilter === y.value ? "active" : ""
                }`}
              >
                {y.label}
              </button>
            ))}
          </div>

          <div
            className="h-5 w-px hidden sm:block"
            style={{ background: "var(--border-soft)" }}
          />

          <div className="flex flex-wrap items-center gap-1.5">
            {DEPT_FILTERS.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDeptFilter(dept)}
                aria-pressed={deptFilter === dept}
                className={`filter-pill min-h-[34px] px-3 py-1 rounded-xl text-[12px] cursor-pointer ${
                  dept !== "all" ? "font-en" : ""
                } ${deptFilter === dept ? "active" : ""}`}
              >
                {dept === "all" ? "كل الأقسام" : dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Students Table / Cards */}
      <section className="surface-card rounded-3xl p-5 sm:p-6">
        {loadError ? (
          <div
            className="rounded-2xl p-6 text-center space-y-2"
            style={{
              background: "var(--danger-soft)",
              color: "var(--danger-fg)",
            }}
          >
            <p className="text-[13.5px] font-bold">{loadError}</p>
            <button
              type="button"
              onClick={triggerReload}
              className="px-4 py-1.5 rounded-xl text-[12px] font-extrabold bg-white/90 text-slate-900 cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-16 rounded-2xl animate-pulse"
                style={{ background: "var(--bg-subtle)" }}
              />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-10 text-center space-y-2"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-strong)",
            }}
          >
            <Users
              className="w-8 h-8 mx-auto opacity-60"
              style={{ color: "var(--text-muted)" }}
            />
            <div
              className="text-[15px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              لا توجد حسابات مطابقة لخيارات البحث
            </div>
            <p className="text-[12.5px]" style={{ color: "var(--text-muted)" }}>
              يمكنك إضافة حساب جديد مباشرة من زر «إضافة حساب جديد» بالأعلى أو انتظار تسجيل الطلاب.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div
              className="hidden lg:block overflow-x-auto rounded-2xl border"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr
                    className="text-[11.5px] font-extrabold border-b"
                    style={{
                      background: "var(--bg-subtle)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <th className="py-3 px-4">الحساب</th>
                    <th className="py-3 px-4">الفرقة والتخصص</th>
                    <th className="py-3 px-4">المقررات المفعّلة</th>
                    <th className="py-3 px-4">التقدم</th>
                    <th className="py-3 px-4">متوسط الكويزات</th>
                    <th className="py-3 px-4">الأخطاء</th>
                    <th className="py-3 px-4">آخر نشاط</th>
                    <th className="py-3 px-4 text-left">إدارة كاملة</th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y text-[13px]"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  {students.map((student) => {
                    const quizStyle = getQuizBadgeStyle(
                      student.averageQuizScore
                    );

                    return (
                      <tr
                        key={student.id}
                        className="transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ borderColor: "var(--border-soft)" }}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 min-w-[210px]">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-black text-white shrink-0"
                              style={{
                                background:
                                  student.role === "admin"
                                    ? "var(--accent-warm)"
                                    : "var(--hero-bg)",
                              }}
                            >
                              {getStudentInitials(student.fullName)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="font-extrabold text-[13.5px] truncate"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {student.fullName}
                                </span>
                                {student.role === "admin" && (
                                  <span
                                    className="font-en text-[10px] font-extrabold px-1.5 py-0.2 rounded-md"
                                    style={{
                                      background: "var(--accent-warm-soft)",
                                      color: "var(--accent-warm-text)",
                                    }}
                                  >
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div
                                dir="ltr"
                                className="font-mono-code text-[11px] truncate text-right"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {student.email}
                              </div>
                              {student.phone && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span
                                    dir="ltr"
                                    className="font-mono-code text-[11px] font-bold"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {student.phone}
                                  </span>
                                  {buildWhatsAppLink(student.phone) && (
                                    <a
                                      href={buildWhatsAppLink(student.phone)!}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="تواصل عبر واتساب"
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-extrabold hover:opacity-85"
                                      style={{
                                        background: "var(--success-soft)",
                                        color: "var(--success-fg)",
                                      }}
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span>واتساب</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-2 py-0.5 rounded-lg text-[11.5px] font-bold"
                              style={{
                                background: "var(--bg-subtle)",
                                color: "var(--text-primary)",
                              }}
                            >
                              ف{student.yearLevel}
                            </span>
                            <span
                              className="font-en px-2 py-0.5 rounded-lg text-[11.5px] font-extrabold"
                              style={{
                                background: "var(--brand-soft)",
                                color: "var(--brand-soft-text)",
                              }}
                            >
                              {student.department}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {student.enrollments.length === 0 ? (
                            <span
                              className="text-[11.5px]"
                              style={{ color: "var(--text-muted)" }}
                            >
                              بدون اشتراك مدفوع
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {student.enrollments.slice(0, 3).map((enr) => (
                                <span
                                  key={enr.id}
                                  className="px-2 py-0.5 rounded-lg text-[11px] font-bold truncate max-w-[190px]"
                                  style={{
                                    background:
                                      enr.scopeType === "bundle"
                                        ? "var(--accent-warm-soft)"
                                        : "var(--success-soft)",
                                    color:
                                      enr.scopeType === "bundle"
                                        ? "var(--accent-warm-text)"
                                        : "var(--success-fg)",
                                  }}
                                  title={enr.targetLabel}
                                >
                                  {enr.scopeType === "bundle"
                                    ? "باقة شاملة"
                                    : enr.targetLabel.split("—")[0]?.trim() ||
                                      enr.targetLabel}
                                </span>
                              ))}
                              {student.enrollments.length > 3 && (
                                <span
                                  className="font-mono-code px-2 py-0.5 rounded-lg text-[11px] font-bold"
                                  style={{
                                    background: "var(--bg-subtle)",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  +{student.enrollments.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="w-24 space-y-1">
                            <div className="flex items-center justify-between text-[11.5px] font-bold">
                              <span
                                className="font-mono-code"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {student.completionPercent}%
                              </span>
                              <span
                                className="font-mono-code text-[10.5px]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {student.completedLessonsCount}/
                                {student.totalLessonsCount}
                              </span>
                            </div>
                            <div
                              className="h-1.5 rounded-full overflow-hidden"
                              style={{ background: "var(--bg-subtle)" }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${student.completionPercent}%`,
                                  background: "var(--brand-primary)",
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className="font-mono-code inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-extrabold"
                            style={quizStyle}
                          >
                            <Award className="w-3 h-3" />
                            {student.averageQuizScore !== null
                              ? `${student.averageQuizScore}%`
                              : "—"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className="font-mono-code px-2 py-0.5 rounded-lg text-[11.5px] font-bold"
                            style={{
                              background:
                                student.mistakesCount > 0
                                  ? "var(--accent-warm-soft)"
                                  : "var(--bg-subtle)",
                              color:
                                student.mistakesCount > 0
                                  ? "var(--accent-warm-text)"
                                  : "var(--text-muted)",
                            }}
                          >
                            {student.mistakesCount}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div
                            className="text-[11.5px] font-semibold"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {formatArabicDateTime(student.lastActiveAt)}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-left whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setActiveStudentId(student.id)}
                            className="min-h-[34px] px-3 py-1.5 rounded-xl border text-[11.5px] font-extrabold inline-flex items-center gap-1.5 transition-colors hover:border-[var(--brand-primary)] cursor-pointer"
                            style={{
                              background: "var(--bg-surface)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-primary)",
                            }}
                          >
                            <Shield
                              className="w-3.5 h-3.5"
                              style={{ color: "var(--accent-warm)" }}
                            />
                            <span>إدارة الملف</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
              {students.map((student) => {
                const quizStyle = getQuizBadgeStyle(student.averageQuizScore);
                return (
                  <div
                    key={student.id}
                    className="rounded-2xl border p-4 space-y-3"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black text-white shrink-0"
                          style={{
                            background:
                              student.role === "admin"
                                ? "var(--accent-warm)"
                                : "var(--hero-bg)",
                          }}
                        >
                          {getStudentInitials(student.fullName)}
                        </div>
                        <div className="min-w-0">
                          <div
                            className="font-extrabold text-[14px] truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {student.fullName}
                          </div>
                          <div
                            dir="ltr"
                            className="font-mono-code text-[11px] truncate text-right"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {student.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className="px-2 py-0.5 rounded-lg text-[11px] font-bold"
                          style={{
                            background: "var(--bg-subtle)",
                            color: "var(--text-primary)",
                          }}
                        >
                          ف{student.yearLevel}
                        </span>
                        <span
                          className="font-en px-2 py-0.5 rounded-lg text-[11px] font-extrabold"
                          style={{
                            background: "var(--brand-soft)",
                            color: "var(--brand-soft-text)",
                          }}
                        >
                          {student.department}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div
                        className="rounded-xl p-2 border"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                        }}
                      >
                        <div
                          className="text-[10.5px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          التقدم
                        </div>
                        <div
                          className="font-mono-code text-[13px] font-extrabold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {student.completionPercent}%
                        </div>
                      </div>
                      <div className="rounded-xl p-2" style={quizStyle}>
                        <div className="text-[10.5px] opacity-85">الكويزات</div>
                        <div className="font-mono-code text-[13px] font-extrabold">
                          {student.averageQuizScore !== null
                            ? `${student.averageQuizScore}%`
                            : "—"}
                        </div>
                      </div>
                      <div
                        className="rounded-xl p-2 border"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                        }}
                      >
                        <div
                          className="text-[10.5px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          الأخطاء
                        </div>
                        <div
                          className="font-mono-code text-[13px] font-extrabold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {student.mistakesCount}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between pt-2.5 border-t"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        نشط: {formatArabicDate(student.lastActiveAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStudentId(student.id)}
                        className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                        style={{
                          background: "var(--hero-bg)",
                          color: "#ffffff",
                        }}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>إدارة الملف</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {showCreateModal && (
        <CreateAccountModal
          courses={courses}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            triggerReload();
            onStatsChanged();
          }}
        />
      )}

      {activeStudentId && (
        <StudentDetailModal
          studentId={activeStudentId}
          currentAdminId={currentAdminId}
          courses={courses}
          lessons={lessons}
          onClose={() => setActiveStudentId(null)}
          onChanged={() => {
            triggerReload();
            onStatsChanged();
          }}
        />
      )}
    </div>
  );
}
