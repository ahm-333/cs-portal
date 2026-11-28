"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Award,
  Download,
  Laptop,
  Lock,
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
  formatArabicDateTime,
  formatRelativeArabicTime,
  type AdminCourseOption,
  type AdminLessonOption,
  type AdminStudentItem,
} from "@/components/admin/adminTypes";

export interface StudentsAnalyticsTabProps {
  currentAdminId: string;
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
  initialShowCreate?: boolean;
  initialSearchQuery?: string;
  initialSelectedStudentId?: string | null;
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
  initialSearchQuery = "",
  initialSelectedStudentId = null,
  onStatsChanged,
}: StudentsAnalyticsTabProps) {
  const [students, setStudents] = useState<AdminStudentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(
    initialSearchQuery.trim()
  );
  const [roleFilter, setRoleFilter] = useState<"student" | "admin" | "all">(
    "student"
  );
  const [yearFilter, setYearFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const [activeStudentId, setActiveStudentId] = useState<string | null>(
    initialSelectedStudentId
  );
  const [showCreateModal, setShowCreateModal] = useState(initialShowCreate);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 240);
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

  const hasSplitInspector = Boolean(activeStudentId);

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

      {/* Split View on xl+ when a student is selected */}
      <div
        className={
          hasSplitInspector
            ? "grid grid-cols-1 xl:grid-cols-12 gap-5 items-start"
            : ""
        }
      >
        <section
          className={`surface-card rounded-3xl p-4 sm:p-5 ${
            hasSplitInspector ? "xl:col-span-7" : ""
          }`}
        >
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
              <p
                className="text-[12.5px]"
                style={{ color: "var(--text-muted)" }}
              >
                يمكنك إضافة حساب جديد من زر «إضافة حساب جديد» بالأعلى.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {students.map((student) => {
                const quizStyle = getQuizBadgeStyle(student.averageQuizScore);
                const selected = activeStudentId === student.id;
                const waLink = student.phone
                  ? buildWhatsAppLink(student.phone)
                  : null;

                return (
                  <div
                    key={student.id}
                    onClick={() => setActiveStudentId(student.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveStudentId(student.id);
                      }
                    }}
                    className="rounded-2xl border p-3.5 sm:p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{
                      background: selected
                        ? "var(--bg-hover)"
                        : "var(--bg-canvas)",
                      borderColor: selected
                        ? "var(--brand-primary)"
                        : student.isSuspended || student.deviceAlert
                          ? "var(--danger-fg)"
                          : "var(--border-soft)",
                    }}
                  >
                    {/* Right: Identity & Badges */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black text-white shrink-0"
                        style={{
                          background: student.isSuspended
                            ? "var(--danger-fg)"
                            : student.role === "admin"
                              ? "var(--accent-warm)"
                              : "var(--hero-bg)",
                        }}
                      >
                        {getStudentInitials(student.fullName)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className="font-black text-[14px] truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {student.fullName}
                          </span>
                          <span
                            className="px-2 py-0.2 rounded-md text-[10.5px] font-bold"
                            style={{
                              background: "var(--bg-subtle)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            ف{student.yearLevel} · {student.department}
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
                          {student.isSuspended && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md"
                              style={{
                                background: "var(--danger-soft)",
                                color: "var(--danger-fg)",
                              }}
                            >
                              <Lock className="w-2.5 h-2.5" />
                              <span>مجمّد</span>
                            </span>
                          )}
                          {student.deviceAlert && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md"
                              style={{
                                background: "var(--danger-soft)",
                                color: "var(--danger-fg)",
                              }}
                            >
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>تنبيه أجهزة</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px]">
                          <span
                            dir="ltr"
                            className="font-mono-code truncate"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {student.email}
                          </span>
                          {student.phone && (
                            <span
                              dir="ltr"
                              className="font-mono-code font-bold"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {student.phone}
                            </span>
                          )}
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-0.5 font-extrabold hover:underline"
                              style={{ color: "var(--success-fg)" }}
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>واتساب</span>
                            </a>
                          )}
                        </div>

                        {/* Enrolled courses + Devices preview */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {student.enrollments.slice(0, 3).map((enr) => (
                            <span
                              key={enr.id}
                              className="px-2 py-0.2 rounded-md text-[10.5px] font-bold truncate max-w-[160px]"
                              style={{
                                background: "var(--success-soft)",
                                color: "var(--success-fg)",
                              }}
                            >
                              {enr.scopeType === "bundle"
                                ? "باقة شاملة"
                                : enr.targetLabel.split("—")[0]?.trim() ||
                                  enr.targetLabel}
                            </span>
                          ))}
                          {student.enrollments.length > 3 && (
                            <span
                              className="font-mono-code px-1.5 py-0.2 rounded-md text-[10.5px] font-bold"
                              style={{
                                background: "var(--bg-subtle)",
                                color: "var(--text-muted)",
                              }}
                            >
                              +{student.enrollments.length - 3}
                            </span>
                          )}
                          {(student.devicesCount ?? 0) > 0 && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10.5px] font-bold"
                              style={{
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border-soft)",
                                color: "var(--text-secondary)",
                              }}
                              title={(student.activeDeviceNames ?? []).join(" · ")}
                            >
                              <Laptop className="w-3 h-3" />
                              <span>{student.devicesCount} جهاز</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Left: Telemetry & Open Inspector */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: "var(--border-soft)" }}>
                      <div className="flex items-center gap-2.5">
                        <div className="text-center">
                          <div
                            className="font-mono-code text-[12.5px] font-black"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {student.completionPercent}%
                          </div>
                          <div
                            className="text-[10px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {student.completedLessonsCount}/
                            {student.totalLessonsCount}
                          </div>
                        </div>

                        <span
                          className="font-mono-code inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold"
                          style={quizStyle}
                        >
                          <Award className="w-3 h-3" />
                          {student.averageQuizScore !== null
                            ? `${student.averageQuizScore}%`
                            : "—"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="hidden md:inline text-[11px]"
                          style={{ color: "var(--text-muted)" }}
                          title={formatArabicDateTime(student.lastActiveAt)}
                        >
                          {formatRelativeArabicTime(student.lastActiveAt)}
                        </span>
                        <span
                          className="min-h-[32px] px-2.5 py-1 rounded-xl border text-[11.5px] font-extrabold inline-flex items-center gap-1"
                          style={{
                            background: selected
                              ? "var(--brand-primary)"
                              : "var(--bg-surface)",
                            borderColor: selected
                              ? "var(--brand-primary)"
                              : "var(--border-soft)",
                            color: selected ? "#0b0d12" : "var(--text-primary)",
                          }}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>360°</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Inline Split-View Inspector on xl+ */}
        {activeStudentId && (
          <div className="hidden xl:block xl:col-span-5">
            <StudentDetailModal
              key={activeStudentId}
              studentId={activeStudentId}
              currentAdminId={currentAdminId}
              courses={courses}
              lessons={lessons}
              variant="inline"
              onClose={() => setActiveStudentId(null)}
              onChanged={() => {
                triggerReload();
                onStatsChanged();
              }}
            />
          </div>
        )}
      </div>

      {/* Slide-Over Drawer on < xl */}
      {activeStudentId && (
        <div className="xl:hidden">
          <StudentDetailModal
            key={activeStudentId}
            studentId={activeStudentId}
            currentAdminId={currentAdminId}
            courses={courses}
            lessons={lessons}
            variant="drawer"
            onClose={() => setActiveStudentId(null)}
            onChanged={() => {
              triggerReload();
              onStatsChanged();
            }}
          />
        </div>
      )}

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
    </div>
  );
}
