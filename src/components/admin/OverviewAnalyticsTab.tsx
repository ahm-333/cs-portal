"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpLeft,
  Award,
  BarChart3,
  BookOpen,
  Download,
  KeyRound,
  PlusCircle,
  Server,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import {
  formatArabicDateTime,
  type AdminOverviewData,
} from "@/components/admin/adminTypes";

export interface OverviewAnalyticsTabProps {
  overview: AdminOverviewData | null;
  loading: boolean;
  onNavigateTab: (
    tab: "overview" | "codes" | "students" | "courses" | "system"
  ) => void;
  onGenerateForCourse: (courseId: string) => void;
  onOpenCreateStudent: () => void;
  onExportCodes: () => void;
  onExportStudents: () => void;
}

export function OverviewAnalyticsTab({
  overview,
  loading,
  onNavigateTab,
  onGenerateForCourse,
  onOpenCreateStudent,
  onExportCodes,
  onExportStudents,
}: OverviewAnalyticsTabProps) {
  if (loading && !overview) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-56 rounded-3xl animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
        ))}
      </div>
    );
  }

  if (!overview) return null;

  const maxYear = Math.max(1, ...overview.yearDistribution.map((b) => b.count));
  const maxDept = Math.max(1, ...overview.deptDistribution.map((b) => b.count));

  return (
    <div className="space-y-6">
      {/* 1. Quick Actions Command Strip */}
      <section className="surface-card rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles
              className="w-4 h-4"
              style={{ color: "var(--accent-warm)" }}
            />
            <h2
              className="text-[14px] font-black"
              style={{ color: "var(--text-primary)" }}
            >
              إجراءات سريعة للأدمن
            </h2>
          </div>
          <span
            className="text-[11px] font-bold"
            style={{ color: "var(--text-muted)" }}
          >
            اختصارات يومية
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab("codes")}
            className="min-h-[46px] px-3.5 py-2.5 rounded-2xl border text-[12.5px] font-extrabold inline-flex items-center justify-center gap-2 transition-colors hover:border-[var(--accent-warm)] cursor-pointer"
            style={{
              background: "var(--accent-warm-soft)",
              borderColor: "transparent",
              color: "var(--accent-warm-text)",
            }}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>توليد أكواد</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateStudent}
            className="min-h-[46px] px-3.5 py-2.5 rounded-2xl border text-[12.5px] font-extrabold inline-flex items-center justify-center gap-2 transition-colors hover:border-[var(--brand-primary)] cursor-pointer"
            style={{
              background: "var(--brand-soft)",
              borderColor: "transparent",
              color: "var(--brand-soft-text)",
            }}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>إضافة طالب / أدمن</span>
          </button>

          <button
            type="button"
            onClick={onExportStudents}
            className="min-h-[46px] px-3.5 py-2.5 rounded-2xl border text-[12.5px] font-bold inline-flex items-center justify-center gap-2 transition-colors hover:opacity-85 cursor-pointer"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>تصدير الطلاب CSV</span>
          </button>

          <button
            type="button"
            onClick={onExportCodes}
            className="min-h-[46px] px-3.5 py-2.5 rounded-2xl border text-[12.5px] font-bold inline-flex items-center justify-center gap-2 transition-colors hover:opacity-85 cursor-pointer"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <span>تصدير الأكواد المتاحة</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("system")}
            className="col-span-2 sm:col-span-1 min-h-[46px] px-3.5 py-2.5 rounded-2xl border text-[12.5px] font-bold inline-flex items-center justify-center gap-2 transition-colors hover:opacity-85 cursor-pointer"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            <Server className="w-4 h-4 shrink-0" />
            <span>صحة النظام والـ AI</span>
          </button>
        </div>
      </section>

      {/* 2. Course Performance Matrix */}
      <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <BookOpen className="w-4.5 h-4.5" />
            </span>
            <div>
              <h2
                className="text-base font-black"
                style={{ color: "var(--text-primary)" }}
              >
                أداء المقررات والاشتراكات
              </h2>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                مقارنة فورية للاشتراكات، الدروس المكتملة، متوسط الكويزات، وحجم بنك الأخطاء لكل مقرر.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("courses")}
            className="text-[12px] font-extrabold inline-flex items-center gap-1 hover:underline cursor-pointer"
            style={{ color: "var(--brand-primary)" }}
          >
            <span>دليل المقررات الكامل</span>
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          className="overflow-x-auto rounded-2xl border"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <table className="w-full text-right border-collapse text-[12.5px]">
            <thead>
              <tr
                className="border-b text-[11.5px] font-extrabold"
                style={{
                  background: "var(--bg-subtle)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                <th className="py-3 px-4">المقرر</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">الاشتراكات</th>
                <th className="py-3 px-4">دروس مكتملة</th>
                <th className="py-3 px-4">متوسط الكويز</th>
                <th className="py-3 px-4">أخطاء الطلاب</th>
                <th className="py-3 px-4 text-left">إجراء سريع</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {overview.courseEnrollments.map((c) => (
                <tr
                  key={c.courseId}
                  className="hover:bg-[var(--bg-hover)] transition-colors"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <td className="py-3 px-4">
                    <div className="font-extrabold" style={{ color: "var(--text-primary)" }}>
                      <span
                        className="font-en ml-1.5"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {c.code}
                      </span>
                      {c.title}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      الفرقة {c.yearLevel} · {c.lessonCount} فصل
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-lg text-[11px] font-bold"
                        style={{
                          background: c.isPaid
                            ? "var(--accent-warm-soft)"
                            : "var(--success-soft)",
                          color: c.isPaid
                            ? "var(--accent-warm-text)"
                            : "var(--success-fg)",
                        }}
                      >
                        {c.isPaid ? "مدفوع" : "مجاني"}
                      </span>
                      {!c.isPublished && (
                        <span
                          className="px-2 py-0.5 rounded-lg text-[10.5px] font-bold"
                          style={{
                            background: "var(--bg-subtle)",
                            color: "var(--text-muted)",
                          }}
                        >
                          مسودة
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono-code font-extrabold">
                    <span style={{ color: "var(--success-fg)" }}>
                      {c.totalWithBundle}
                    </span>
                    <span
                      className="text-[10.5px] font-normal mr-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ({c.directEnrollments} مباشر)
                    </span>
                  </td>

                  <td
                    className="py-3 px-4 whitespace-nowrap font-mono-code font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c.completedLessons}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className="font-mono-code inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold"
                      style={{
                        background:
                          c.averageQuizScore !== null
                            ? "var(--brand-soft)"
                            : "var(--bg-subtle)",
                        color:
                          c.averageQuizScore !== null
                            ? "var(--brand-soft-text)"
                            : "var(--text-muted)",
                      }}
                    >
                      <Award className="w-3 h-3" />
                      {c.averageQuizScore !== null ? `${c.averageQuizScore}%` : "—"}
                    </span>
                  </td>

                  <td
                    className="py-3 px-4 whitespace-nowrap font-mono-code font-bold"
                    style={{
                      color:
                        c.mistakesCount > 0
                          ? "var(--accent-warm-text)"
                          : "var(--text-muted)",
                    }}
                  >
                    {c.mistakesCount}
                  </td>

                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onGenerateForCourse(c.courseId)}
                      className="px-2.5 py-1.5 rounded-xl border text-[11.5px] font-extrabold inline-flex items-center gap-1 transition-colors hover:border-[var(--accent-warm)] cursor-pointer"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <KeyRound
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--accent-warm)" }}
                      />
                      <span>توليد أكواد</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Two-Column Analytics: Demographics + Hardest Chapters + Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left/Start: Student Distribution & Hardest Chapters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Distribution by Year & Dept */}
          <section className="surface-card rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3
                className="w-4.5 h-4.5"
                style={{ color: "var(--brand-primary)" }}
              />
              <h3
                className="text-[14.5px] font-black"
                style={{ color: "var(--text-primary)" }}
              >
                توزيع الطلاب حسب الفرقة والقسم
              </h3>
            </div>

            <div className="space-y-2.5">
              <div
                className="text-[11.5px] font-extrabold"
                style={{ color: "var(--text-muted)" }}
              >
                حسب الفرقة الدراسية
              </div>
              {overview.yearDistribution.map((bucket) => (
                <div key={bucket.key} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px] font-bold">
                    <span style={{ color: "var(--text-primary)" }}>
                      {bucket.label}
                    </span>
                    <span
                      className="font-mono-code"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {bucket.count}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-subtle)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round((bucket.count / maxYear) * 100)}%`,
                        background: "var(--brand-primary)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="pt-3 border-t space-y-2.5"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div
                className="text-[11.5px] font-extrabold"
                style={{ color: "var(--text-muted)" }}
              >
                حسب التخصص
              </div>
              {overview.deptDistribution.map((bucket) => (
                <div key={bucket.key} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px] font-bold">
                    <span
                      className="font-en"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {bucket.label}
                    </span>
                    <span
                      className="font-mono-code"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {bucket.count}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-subtle)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round((bucket.count / maxDept) * 100)}%`,
                        background: "var(--accent-warm)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hardest Chapters (Most Mistakes) */}
          <section className="surface-card rounded-3xl p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="w-4.5 h-4.5"
                style={{ color: "var(--accent-warm)" }}
              />
              <h3
                className="text-[14.5px] font-black"
                style={{ color: "var(--text-primary)" }}
              >
                أكثر الفصول التي يخطئ فيها الطلاب
              </h3>
            </div>

            {overview.hardestChapters.length === 0 ? (
              <p
                className="text-[12.5px] rounded-2xl p-4 border border-dashed text-center"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-muted)",
                }}
              >
                لا توجد أخطاء مسجلة في بنك الأخطاء بعد. ستظهر هنا الفصول التي تحتاج مراجعة إضافية فور حل الطلاب للكويزات.
              </p>
            ) : (
              <div className="space-y-2">
                {overview.hardestChapters.map((ch, idx) => (
                  <div
                    key={`${ch.courseId}-${ch.lessonId ?? idx}`}
                    className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="min-w-0">
                      <div
                        className="text-[12.5px] font-extrabold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {ch.label}
                      </div>
                      <div
                        className="font-en text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {ch.courseCode}
                      </div>
                    </div>
                    <span
                      className="font-mono-code px-2.5 py-1 rounded-xl text-[11.5px] font-extrabold shrink-0"
                      style={{
                        background: "var(--accent-warm-soft)",
                        color: "var(--accent-warm-text)",
                      }}
                    >
                      {ch.mistakesCount} خطأ
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right/End: Live Activity Timeline */}
        <section className="lg:col-span-7 surface-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity
                className="w-4.5 h-4.5"
                style={{ color: "var(--success-fg)" }}
              />
              <h3
                className="text-[15px] font-black"
                style={{ color: "var(--text-primary)" }}
              >
                آخر النشاطات على المنصة
              </h3>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              تحديث مباشر من Neon
            </span>
          </div>

          {overview.recentActivity.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed p-10 text-center space-y-1.5"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-strong)",
              }}
            >
              <Users
                className="w-7 h-7 mx-auto opacity-60"
                style={{ color: "var(--text-muted)" }}
              />
              <div
                className="text-[14px] font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                لا توجد نشاطات مسجلة بعد
              </div>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                عند تسجيل أول طالب أو تفعيل أول كود، سيظهر السجل الزمني هنا تلقائياً.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {overview.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border px-4 py-3 flex items-start justify-between gap-3"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className="w-8 h-8 rounded-xl inline-flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background:
                          item.type === "redemption"
                            ? "var(--success-soft)"
                            : "var(--brand-soft)",
                        color:
                          item.type === "redemption"
                            ? "var(--success-fg)"
                            : "var(--brand-soft-text)",
                      }}
                    >
                      {item.type === "redemption" ? (
                        <KeyRound className="w-4 h-4" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div
                        className="text-[13px] font-extrabold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-[11.5px] truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0 space-y-1">
                    {item.meta && (
                      <div
                        className="font-mono-code text-[11px] font-extrabold px-2 py-0.5 rounded-lg inline-block"
                        style={{
                          background: "var(--bg-subtle)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.meta}
                      </div>
                    )}
                    <div
                      className="text-[10.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatArabicDateTime(item.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
