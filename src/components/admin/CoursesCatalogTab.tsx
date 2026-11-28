"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Lock,
  RefreshCw,
  Save,
  Search,
  Unlock,
} from "lucide-react";
import { emitToast } from "@/lib/stores/events";
import type {
  AdminCourseEnrollmentStat,
  AdminCourseOption,
  AdminCourseOverride,
  AdminLessonOption,
} from "@/components/admin/adminTypes";

export interface CoursesCatalogTabProps {
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
  courseStats: AdminCourseEnrollmentStat[];
  onStatsChanged?: () => void;
}

interface EffectiveCourseState {
  isPublished: boolean;
  isPaid: boolean;
  price: number;
  isLocked: boolean;
  freeLessonIds: string[];
}

function parseFreeLessonIds(
  override: AdminCourseOverride | undefined,
  defaultLessons: AdminLessonOption[]
): string[] {
  if (override) {
    if (Array.isArray(override.freeLessonIds)) {
      return override.freeLessonIds;
    }
    if (typeof override.freeLessonIdsJson === "string") {
      try {
        const parsed = JSON.parse(override.freeLessonIdsJson) as unknown;
        if (Array.isArray(parsed)) {
          return parsed.filter((x): x is string => typeof x === "string");
        }
      } catch {
        // fall through
      }
    }
  }
  return defaultLessons.filter((l) => l.isFreePreview).map((l) => l.id);
}

export function CoursesCatalogTab({
  courses,
  lessons,
  courseStats,
  onStatsChanged,
}: CoursesCatalogTabProps) {
  const [search, setSearch] = useState("");
  const [paidFilter, setPaidFilter] = useState<"all" | "paid" | "free">("all");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(
    courses[0]?.id ?? null
  );

  const [overridesMap, setOverridesMap] = useState<
    Record<string, AdminCourseOverride>
  >({});
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [loadingOverrides, setLoadingOverrides] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);

  const reloadOverrides = useCallback(() => {
    setLoadingOverrides(true);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/courses/overrides", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as {
          overrides?: AdminCourseOverride[];
        };
        if (!active) return;
        const nextMap: Record<string, AdminCourseOverride> = {};
        const nextDrafts: Record<string, string> = {};
        for (const row of json.overrides ?? []) {
          nextMap[row.courseId] = row;
          nextDrafts[row.courseId] = String(row.price ?? 0);
        }
        setOverridesMap(nextMap);
        setPriceDrafts((prev) => ({ ...prev, ...nextDrafts }));
      } catch {
        // Keep static defaults if overrides API not reachable
      } finally {
        if (active) setLoadingOverrides(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshTick]);

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

  const getEffectiveState = useCallback(
    (course: AdminCourseOption): EffectiveCourseState => {
      const ov = overridesMap[course.id];
      const courseLessons = lessonsByCourse.get(course.id) ?? [];
      return {
        isPublished: ov ? ov.isPublished : course.isPublished,
        isPaid: ov ? ov.isPaid : course.isPaid,
        price: ov ? ov.price : course.price ?? (course.isPaid ? 150 : 0),
        isLocked: ov ? ov.isLocked : Boolean(course.isLocked),
        freeLessonIds: parseFreeLessonIds(ov, courseLessons),
      };
    },
    [overridesMap, lessonsByCourse]
  );

  const saveOverride = useCallback(
    async (
      course: AdminCourseOption,
      patch: Partial<EffectiveCourseState>,
      busyId: string,
      successMsg: string
    ) => {
      const current = getEffectiveState(course);
      const next: EffectiveCourseState = {
        ...current,
        ...patch,
      };
      setSavingKey(busyId);
      try {
        const res = await fetch("/api/admin/courses/overrides", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course.id,
            isPublished: next.isPublished,
            isPaid: next.isPaid,
            price: next.price,
            isLocked: next.isLocked,
            freeLessonIds: next.freeLessonIds,
          }),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          override?: AdminCourseOverride;
          error?: string;
        };
        if (!res.ok || json.ok === false) {
          throw new Error(json.error || "تعذر حفظ إعدادات المادة.");
        }

        const saved: AdminCourseOverride = json.override ?? {
          courseId: course.id,
          isPublished: next.isPublished,
          isPaid: next.isPaid,
          price: next.price,
          isLocked: next.isLocked,
          freeLessonIds: next.freeLessonIds,
        };
        setOverridesMap((prev) => ({
          ...prev,
          [course.id]: saved,
        }));
        setPriceDrafts((prev) => ({
          ...prev,
          [course.id]: String(saved.price ?? next.price),
        }));
        emitToast(successMsg);
        onStatsChanged?.();
      } catch (err) {
        emitToast(
          err instanceof Error ? err.message : "تعذر حفظ إعدادات المادة."
        );
      } finally {
        setSavingKey(null);
      }
    },
    [getEffectiveState, onStatsChanged]
  );

  const effectiveSummary = useMemo(() => {
    let paid = 0;
    let free = 0;
    for (const c of courses) {
      if (getEffectiveState(c).isPaid) paid += 1;
      else free += 1;
    }
    return { paid, free };
  }, [courses, getEffectiveState]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      const eff = getEffectiveState(c);
      if (paidFilter === "paid" && !eff.isPaid) return false;
      if (paidFilter === "free" && eff.isPaid) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.titleEn.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [courses, search, paidFilter, getEffectiveState]);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <section className="surface-card rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المادة أو الكود..."
            className="w-full min-h-[42px] pr-10 pl-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { value: "all", label: `الكل (${courses.length})` },
              { value: "paid", label: `مدفوعة (${effectiveSummary.paid})` },
              { value: "free", label: `مجانية (${effectiveSummary.free})` },
            ] as const
          ).map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setPaidFilter(f.value)}
              className={`filter-pill min-h-[36px] px-3.5 py-1 rounded-xl text-[12px] font-extrabold cursor-pointer ${
                paidFilter === f.value ? "active" : ""
              }`}
            >
              {f.label}
            </button>
          ))}

          <button
            type="button"
            onClick={reloadOverrides}
            aria-label="تحديث إعدادات المواد"
            className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <RefreshCw
              className={`w-4 h-4 ${loadingOverrides ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </section>

      {/* Live Course Control Cards */}
      <div className="space-y-4">
        {filteredCourses.map((course) => {
          const stat = statsMap.get(course.id);
          const courseLessons = lessonsByCourse.get(course.id) ?? [];
          const expanded = expandedCourseId === course.id;
          const eff = getEffectiveState(course);
          const draftPriceStr =
            priceDrafts[course.id] !== undefined
              ? priceDrafts[course.id]
              : String(eff.price);
          const parsedDraftPrice = Math.max(
            0,
            Number.parseInt(draftPriceStr || "0", 10) || 0
          );
          const priceChanged = parsedDraftPrice !== eff.price;

          const publishBusy = savingKey === `pub-${course.id}`;
          const paidBusy = savingKey === `paid-${course.id}`;
          const priceBusy = savingKey === `price-${course.id}`;

          return (
            <article
              key={course.id}
              className="surface-card rounded-3xl p-5 sm:p-6 space-y-4 transition-all"
              style={{
                borderColor: eff.isPublished
                  ? "var(--border-soft)"
                  : "var(--danger-fg)",
              }}
            >
              {/* Top Row: Course Info + Metrics */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
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
                        background: eff.isPaid
                          ? "var(--accent-warm-soft)"
                          : "var(--success-soft)",
                        color: eff.isPaid
                          ? "var(--accent-warm-text)"
                          : "var(--success-fg)",
                      }}
                    >
                      {eff.isPaid ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                      {eff.isPaid ? `مدفوعة · ${eff.price} ج.م` : "مجانية"}
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
                    {!eff.isPublished && (
                      <span
                        className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold"
                        style={{
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }}
                      >
                        مخفية عن الطلاب
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
                    {course.titleEn} · {courseLessons.length} فصل ·{" "}
                    {eff.freeLessonIds.length} معاينة مجانية
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <div
                    className="rounded-2xl border px-3.5 py-2 text-center min-w-[84px]"
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
                    className="rounded-2xl border px-3.5 py-2 text-center min-w-[84px]"
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
                    className="rounded-2xl border px-3.5 py-2 text-center min-w-[84px]"
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

              {/* LIVE Controls Bar */}
              <div
                className="rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-3"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Master Switch: Open/Close for Students */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={eff.isPublished}
                      aria-label={`مفتوحة للطلاب: ${course.title}`}
                      disabled={publishBusy}
                      onClick={() =>
                        void saveOverride(
                          course,
                          { isPublished: !eff.isPublished },
                          `pub-${course.id}`,
                          !eff.isPublished
                            ? `تم فتح مادة «${course.title}» للطلاب ✓`
                            : `تم إخفاء مادة «${course.title}» عن الطلاب`
                        )
                      }
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-60"
                      style={{
                        background: eff.isPublished
                          ? "var(--success-fg)"
                          : "var(--bg-subtle)",
                        border: "1px solid var(--border-soft)",
                      }}
                    >
                      {publishBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-white" />
                      ) : (
                        <span
                          className="inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform"
                          style={{
                            transform: eff.isPublished
                              ? "translateX(-22px)"
                              : "translateX(-2px)",
                          }}
                        />
                      )}
                    </button>
                    <span
                      className="text-[12.5px] font-extrabold"
                      style={{
                        color: eff.isPublished
                          ? "var(--text-primary)"
                          : "var(--danger-fg)",
                      }}
                    >
                      مفتوحة للطلاب
                    </span>
                  </div>

                  <div
                    className="h-5 w-px hidden sm:block"
                    style={{ background: "var(--border-soft)" }}
                  />

                  {/* Free / Paid Segmented Toggle */}
                  <div
                    className="inline-flex rounded-xl p-0.5 border"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <button
                      type="button"
                      disabled={paidBusy}
                      onClick={() => {
                        if (!eff.isPaid) return;
                        void saveOverride(
                          course,
                          { isPaid: false },
                          `paid-${course.id}`,
                          `تم تحويل «${course.title}» إلى مجانية ✓`
                        );
                      }}
                      className="px-3 py-1 rounded-lg text-[11.5px] font-extrabold transition-colors cursor-pointer disabled:opacity-60"
                      style={{
                        background: !eff.isPaid
                          ? "var(--success-soft)"
                          : "transparent",
                        color: !eff.isPaid
                          ? "var(--success-fg)"
                          : "var(--text-muted)",
                      }}
                    >
                      مجانية
                    </button>
                    <button
                      type="button"
                      disabled={paidBusy}
                      onClick={() => {
                        if (eff.isPaid) return;
                        const nextPrice = eff.price > 0 ? eff.price : 150;
                        void saveOverride(
                          course,
                          { isPaid: true, price: nextPrice },
                          `paid-${course.id}`,
                          `تم تحويل «${course.title}» إلى مدفوعة (${nextPrice} ج.م) ✓`
                        );
                      }}
                      className="px-3 py-1 rounded-lg text-[11.5px] font-extrabold transition-colors cursor-pointer disabled:opacity-60"
                      style={{
                        background: eff.isPaid
                          ? "var(--accent-warm-soft)"
                          : "transparent",
                        color: eff.isPaid
                          ? "var(--accent-warm-text)"
                          : "var(--text-muted)",
                      }}
                    >
                      مدفوعة
                    </button>
                  </div>

                  {/* Inline Price Input + Save */}
                  <div className="flex items-center gap-1.5">
                    <label
                      htmlFor={`price-${course.id}`}
                      className="text-[11.5px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      السعر:
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id={`price-${course.id}`}
                        type="number"
                        min={0}
                        max={10000}
                        step={10}
                        dir="ltr"
                        value={draftPriceStr}
                        onChange={(e) =>
                          setPriceDrafts((prev) => ({
                            ...prev,
                            [course.id]: e.target.value,
                          }))
                        }
                        className="font-mono-code w-24 min-h-[34px] px-2.5 py-1 rounded-xl border text-[12.5px] font-extrabold outline-none text-center"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: priceChanged
                            ? "var(--brand-primary)"
                            : "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      />
                      <span
                        className="text-[11px] font-bold mr-1.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        ج.م
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={priceBusy || !priceChanged}
                      onClick={() =>
                        void saveOverride(
                          course,
                          { price: parsedDraftPrice },
                          `price-${course.id}`,
                          `تم تحديث سعر «${course.title}» إلى ${parsedDraftPrice} ج.م ✓`
                        )
                      }
                      className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-45"
                      style={{
                        background: priceChanged
                          ? "var(--brand-primary)"
                          : "var(--bg-surface)",
                        border: "1px solid var(--border-soft)",
                        color: priceChanged
                          ? "#0b0d12"
                          : "var(--text-secondary)",
                      }}
                    >
                      {priceBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : priceChanged ? (
                        <Save className="w-3.5 h-3.5" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>حفظ</span>
                    </button>
                  </div>
                </div>

                {/* Right: Preview & Expand Chapters */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="min-h-[36px] px-3 py-1.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 hover:opacity-85"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>معاينة</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCourseId((prev) =>
                        prev === course.id ? null : course.id
                      )
                    }
                    className="min-h-[36px] px-3.5 py-1.5 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    style={{
                      background: expanded
                        ? "var(--brand-soft)"
                        : "var(--bg-surface)",
                      borderColor: expanded
                        ? "var(--brand-primary)"
                        : "var(--border-soft)",
                      color: expanded
                        ? "var(--brand-soft-text)"
                        : "var(--text-primary)",
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>الفصول ({courseLessons.length})</span>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Chapters Panel with Per-Chapter Free Preview Toggle */}
              {expanded && courseLessons.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {courseLessons.map((lesson) => {
                    const isFree = eff.freeLessonIds.includes(lesson.id);
                    const chBusy = savingKey === `lesson-${lesson.id}`;
                    return (
                      <div
                        key={lesson.id}
                        className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2.5"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: isFree
                            ? "var(--success-fg)"
                            : "var(--border-soft)",
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="font-mono-code text-[10.5px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0"
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
                          <div
                            className="text-[11px] truncate mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {lesson.sectionTitle}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                            <span
                              className="text-[10.5px] font-extrabold"
                              style={{
                                color: isFree
                                  ? "var(--success-fg)"
                                  : "var(--text-muted)",
                              }}
                            >
                              معاينة مجانية
                            </span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isFree}
                              aria-label={`معاينة مجانية للفصل ${lesson.title}`}
                              disabled={chBusy}
                              onClick={() => {
                                const nextIds = isFree
                                  ? eff.freeLessonIds.filter(
                                      (id) => id !== lesson.id
                                    )
                                  : [...eff.freeLessonIds, lesson.id];
                                void saveOverride(
                                  course,
                                  { freeLessonIds: nextIds },
                                  `lesson-${lesson.id}`,
                                  !isFree
                                    ? `تم فتح «${lesson.title}» كمعاينة مجانية ✓`
                                    : `تم قفل المعاينة المجانية لـ «${lesson.title}»`
                                );
                              }}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer disabled:opacity-60"
                              style={{
                                background: isFree
                                  ? "var(--success-fg)"
                                  : "var(--bg-subtle)",
                                border: "1px solid var(--border-soft)",
                              }}
                            >
                              {chBusy ? (
                                <Loader2 className="w-3 h-3 animate-spin mx-auto text-white" />
                              ) : (
                                <span
                                  className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                                  style={{
                                    transform: isFree
                                      ? "translateX(-18px)"
                                      : "translateX(-2px)",
                                  }}
                                />
                              )}
                            </button>
                          </label>

                          <Link
                            href={`/courses/${course.slug}/${lesson.id}`}
                            target="_blank"
                            className="p-1.5 rounded-xl border shrink-0 hover:opacity-80"
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
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
