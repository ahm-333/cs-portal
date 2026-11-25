"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  KeyRound,
  Lock,
  Search,
  Unlock,
} from "lucide-react";
import type {
  AdminCourseEnrollmentStat,
  AdminCourseOption,
  AdminLessonOption,
} from "@/components/admin/adminTypes";

export interface CoursesCatalogTabProps {
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
  courseStats: AdminCourseEnrollmentStat[];
  onGenerateForCourse: (courseId: string) => void;
}

export function CoursesCatalogTab({
  courses,
  lessons,
  courseStats,
  onGenerateForCourse,
}: CoursesCatalogTabProps) {
  const [search, setSearch] = useState("");
  const [paidFilter, setPaidFilter] = useState<"all" | "paid" | "free">("all");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(
    courses[0]?.id ?? null
  );

  const statsMap = useMemo(
    () => new Map(courseStats.map((s) => [s.courseId, s])),
    [courseStats]
  );

  const lessonsByCourse = useMemo(() => {
    const map = new Map<string, AdminLessonOption[]>();
    for (const lesson of lessons) {
      const list = map.get(lesson.courseId) ?? [];
      list.push(lesson);
      map.set(lesson.courseId, list);
    }
    return map;
  }, [lessons]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      if (paidFilter === "paid" && !c.isPaid) return false;
      if (paidFilter === "free" && c.isPaid) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.titleEn.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [courses, search, paidFilter]);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <section className="surface-card rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المقرر أو الكود..."
            className="w-full min-h-[42px] pr-10 pl-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { value: "all", label: `الكل (${courses.length})` },
              {
                value: "paid",
                label: `مدفوعة (${courses.filter((c) => c.isPaid).length})`,
              },
              {
                value: "free",
                label: `مجانية (${courses.filter((c) => !c.isPaid).length})`,
              },
            ] as const
          ).map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setPaidFilter(f.value)}
              className={`filter-pill min-h-[36px] px-3.5 py-1 rounded-xl text-[12px] cursor-pointer ${
                paidFilter === f.value ? "active" : ""
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Course Cards */}
      <div className="space-y-4">
        {filteredCourses.map((course) => {
          const stat = statsMap.get(course.id);
          const courseLessons = lessonsByCourse.get(course.id) ?? [];
          const expanded = expandedCourseId === course.id;

          return (
            <article
              key={course.id}
              className="surface-card rounded-3xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="font-en px-2.5 py-0.5 rounded-lg text-[11.5px] font-extrabold"
                      style={{
                        background: "var(--brand-soft)",
                        color: "var(--brand-soft-text)",
                      }}
                    >
                      {course.code}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1"
                      style={{
                        background: course.isPaid
                          ? "var(--accent-warm-soft)"
                          : "var(--success-soft)",
                        color: course.isPaid
                          ? "var(--accent-warm-text)"
                          : "var(--success-fg)",
                      }}
                    >
                      {course.isPaid ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                      {course.isPaid ? "مقرر مدفوع" : "مقرر مجاني"}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold"
                      style={{
                        background: "var(--bg-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      الفرقة {course.yearLevel} · ترم {course.term}
                    </span>
                    {!course.isPublished && (
                      <span
                        className="px-2 py-0.5 rounded-lg text-[11px] font-bold"
                        style={{
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }}
                      >
                        غير منشور
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-black tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {course.title}
                  </h3>
                  <div
                    className="font-en text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {course.titleEn} · {course.lessonCount} فصل
                  </div>
                </div>

                {/* Metrics & Quick Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <div
                    className="rounded-2xl border px-3.5 py-2 text-center min-w-[82px]"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      className="font-mono-code text-base font-black"
                      style={{ color: "var(--success-fg)" }}
                    >
                      {stat?.totalWithBundle ?? 0}
                    </div>
                    <div
                      className="text-[10.5px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      مشترك
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border px-3.5 py-2 text-center min-w-[82px]"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      className="font-mono-code text-base font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {stat?.completedLessons ?? 0}
                    </div>
                    <div
                      className="text-[10.5px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      إنجاز فصل
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border px-3.5 py-2 text-center min-w-[82px]"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      className="font-mono-code text-base font-black inline-flex items-center gap-1"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      <Award className="w-3.5 h-3.5" />
                      {stat?.averageQuizScore !== null &&
                      stat?.averageQuizScore !== undefined
                        ? `${stat.averageQuizScore}%`
                        : "—"}
                    </div>
                    <div
                      className="text-[10.5px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      متوسط الكويز
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onGenerateForCourse(course.id)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer hover:opacity-95"
                    style={{ background: "var(--accent-warm)" }}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>توليد أكواد لهذا المقرر</span>
                  </button>

                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 hover:opacity-85"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>معاينة صفحة المقرر</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedCourseId((prev) =>
                      prev === course.id ? null : course.id
                    )
                  }
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>عرض الفصول ({courseLessons.length})</span>
                  {expanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {expanded && courseLessons.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {courseLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="font-mono-code text-[11px] font-extrabold px-1.5 py-0.5 rounded-md"
                            style={{
                              background: "var(--bg-subtle)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            #{lesson.orderIndex}
                          </span>
                          <span
                            className="text-[12.5px] font-extrabold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="text-[11px] truncate"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {lesson.sectionTitle}
                          </span>
                          {lesson.isFreePreview && (
                            <span
                              className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md"
                              style={{
                                background: "var(--success-soft)",
                                color: "var(--success-fg)",
                              }}
                            >
                              معاينة مجانية
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/courses/${course.slug}/${lesson.id}`}
                        target="_blank"
                        className="p-2 rounded-xl border shrink-0 hover:opacity-80"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--brand-primary)",
                        }}
                        title="فتح الفصل"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
