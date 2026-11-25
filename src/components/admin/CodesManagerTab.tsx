"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Ban,
  Check,
  Copy,
  Download,
  History,
  KeyRound,
  Layers,
  Loader2,
  MessageCircle,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { emitToast } from "@/lib/stores/events";
import { RedemptionsLogPanel } from "@/components/admin/RedemptionsLogPanel";
import {
  formatArabicDate,
  SCOPE_LABELS_AR,
  STATUS_LABELS_AR,
  type ActivationScope,
  type AdminCodeItem,
  type AdminCodeStatus,
  type AdminCourseOption,
  type AdminLessonOption,
} from "@/components/admin/adminTypes";

export interface CodesManagerTabProps {
  courses: AdminCourseOption[];
  lessons: AdminLessonOption[];
  preselectedCourseId?: string | null;
  onStatsChanged: () => void;
}

const QUANTITY_PRESETS = [1, 10, 25, 50, 100] as const;

const STATUS_FILTERS: ReadonlyArray<{
  value: "all" | "available" | "used" | "revoked";
  label: string;
}> = [
  { value: "all", label: "الكل" },
  { value: "available", label: "متاح" },
  { value: "used", label: "مستخدم" },
  { value: "revoked", label: "ملغي" },
];

function getStatusBadgeStyle(status: AdminCodeStatus): {
  background: string;
  color: string;
} {
  switch (status) {
    case "available":
      return {
        background: "var(--success-soft)",
        color: "var(--success-fg)",
      };
    case "used":
      return {
        background: "var(--brand-soft)",
        color: "var(--brand-soft-text)",
      };
    case "expired":
      return {
        background: "var(--accent-warm-soft)",
        color: "var(--accent-warm-text)",
      };
    case "revoked":
      return {
        background: "var(--danger-soft)",
        color: "var(--danger-fg)",
      };
  }
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CodesManagerTab({
  courses,
  lessons,
  preselectedCourseId,
  onStatsChanged,
}: CodesManagerTabProps) {
  const [subView, setSubView] = useState<"codes" | "redemptions">("codes");

  // Generator form state
  const defaultPaidCourse =
    courses.find((c) => c.isPaid) ?? courses[0] ?? null;

  const [scopeType, setScopeType] = useState<ActivationScope>("course");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    preselectedCourseId || defaultPaidCourse?.id || ""
  );
  const [lessonCourseFilter, setLessonCourseFilter] = useState<string>(
    defaultPaidCourse?.id ?? lessons[0]?.courseId ?? ""
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    lessons.find((l) => l.courseId === (defaultPaidCourse?.id ?? ""))?.id ??
      lessons[0]?.id ??
      ""
  );
  const [quantity, setQuantity] = useState<number>(10);
  const [prefix, setPrefix] = useState<string>("CS");
  const [batchLabel, setBatchLabel] = useState<string>("");
  const [maxUses, setMaxUses] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState<string | null>(null);

  // Freshly generated codes preview
  const [freshCodes, setFreshCodes] = useState<AdminCodeItem[] | null>(null);
  const [freshBatchLabel, setFreshBatchLabel] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Table & filter state
  const [codes, setCodes] = useState<AdminCodeItem[]>([]);
  const [batchLabels, setBatchLabels] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "used" | "revoked"
  >("all");
  const [scopeFilter, setScopeFilter] = useState<"all" | ActivationScope>("all");
  const [batchFilter, setBatchFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);

  const filteredLessonsForPicker = useMemo(() => {
    if (!lessonCourseFilter) return lessons;
    const matched = lessons.filter((l) => l.courseId === lessonCourseFilter);
    return matched.length > 0 ? matched : lessons;
  }, [lessons, lessonCourseFilter]);

  const effectiveLessonId = useMemo(() => {
    if (filteredLessonsForPicker.some((l) => l.id === selectedLessonId)) {
      return selectedLessonId;
    }
    return filteredLessonsForPicker[0]?.id ?? "";
  }, [filteredLessonsForPicker, selectedLessonId]);

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
    params.set("status", statusFilter);
    params.set("limit", "200");
    if (scopeFilter !== "all") params.set("scopeType", scopeFilter);
    if (batchFilter) params.set("batchLabel", batchFilter);
    if (debouncedQuery) params.set("q", debouncedQuery);

    (async () => {
      try {
        const res = await fetch(`/api/admin/codes?${params.toString()}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          codes?: AdminCodeItem[];
          batchLabels?: string[];
          error?: string;
        };

        if (!active) return;
        if (!res.ok) {
          throw new Error(data.error || "تعذر تحميل الأكواد.");
        }

        setCodes(data.codes ?? []);
        setBatchLabels(data.batchLabels ?? []);
        setLoadError(null);
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error ? error.message : "تعذر تحميل الأكواد."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [statusFilter, scopeFilter, batchFilter, debouncedQuery, refreshTick]);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGenError(null);

    const targetId =
      scopeType === "bundle"
        ? "all"
        : scopeType === "course"
          ? selectedCourseId
          : effectiveLessonId;

    if (!targetId) {
      setGenError("يرجى اختيار المقرر أو الفصل المستهدف أولاً.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scopeType,
          targetId,
          quantity,
          prefix: prefix.trim() || undefined,
          batchLabel: batchLabel.trim() || undefined,
          maxUses,
          expiresAt: expiresAt ? `${expiresAt}T23:59:59Z` : null,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        codes?: AdminCodeItem[];
        error?: string;
      };

      if (!res.ok || !data.codes) {
        throw new Error(data.error || "فشل توليد الأكواد.");
      }

      setFreshCodes(data.codes);
      setFreshBatchLabel(batchLabel.trim() || null);
      emitToast(`تم توليد ${data.codes.length} كود تفعيل بنجاح ✓`);
      triggerReload();
      onStatsChanged();
    } catch (error) {
      setGenError(
        error instanceof Error ? error.message : "حدث خطأ أثناء التوليد."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleToggleRevoke(item: AdminCodeItem) {
    setTogglingId(item.id);
    try {
      const nextRevoked = !item.isRevoked;
      const res = await fetch(`/api/admin/codes/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRevoked: nextRevoked }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        code?: AdminCodeItem;
        error?: string;
      };

      if (!res.ok || !data.code) {
        throw new Error(data.error || "تعذر تحديث حالة الكود.");
      }

      setCodes((prev) =>
        prev.map((c) => (c.id === item.id ? data.code! : c))
      );
      emitToast(
        nextRevoked
          ? `تم إلغاء الكود ${item.code}`
          : `تم استعادة الكود ${item.code} ✓`
      );
      onStatsChanged();
    } catch (error) {
      emitToast(
        error instanceof Error ? error.message : "تعذر تحديث حالة الكود."
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleCopySingle(code: string, id: string) {
    const ok = await copyTextToClipboard(code);
    if (ok) {
      setCopiedId(id);
      emitToast(`تم نسخ الكود ${code}`);
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 1500);
    }
  }

  async function handleCopyWhatsApp(item: AdminCodeItem) {
    const msg = `أهلاً بك في بوابة حاسبات (CS Portal) 🎓\nكود التفعيل الخاص بك لـ (${item.targetLabel}):\n\n*${item.code}*\n\nطريقة التفعيل:\n1. سجّل دخولك على المنصة\n2. افتح المقرر واضغط «تفعيل بكود»\n3. أدخل الكود أعلاه وسيتم فتح المحتوى فوراً.`;
    const ok = await copyTextToClipboard(msg);
    if (ok) {
      emitToast(`تم نسخ رسالة واتساب جاهزة للكود ${item.code} ✓`);
    }
  }

  async function handleDeleteCode(item: AdminCodeItem) {
    setTogglingId(item.id);
    try {
      const res = await fetch(`/api/admin/codes/${item.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "تعذر حذف الكود.");
      }
      setCodes((prev) => prev.filter((c) => c.id !== item.id));
      emitToast(`تم حذف الكود ${item.code}`);
      onStatsChanged();
    } catch (error) {
      emitToast(error instanceof Error ? error.message : "تعذر حذف الكود.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleBulkBatchAction(
    action: "revoke_batch" | "restore_batch" | "delete_unused_batch"
  ) {
    if (!batchFilter) return;
    setBulkBusy(action);
    try {
      const res = await fetch("/api/admin/codes/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, batchLabel: batchFilter }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        affected?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "تعذر تنفيذ العملية الجماعية.");
      }
      const msg =
        action === "revoke_batch"
          ? `تم إلغاء ${data.affected ?? 0} كود في دفعة «${batchFilter}»`
          : action === "restore_batch"
            ? `تم استعادة ${data.affected ?? 0} كود في دفعة «${batchFilter}»`
            : `تم حذف ${data.affected ?? 0} كود غير مستخدم من دفعة «${batchFilter}»`;
      emitToast(msg);
      triggerReload();
      onStatsChanged();
    } catch (error) {
      emitToast(
        error instanceof Error ? error.message : "تعذر تنفيذ العملية الجماعية."
      );
    } finally {
      setBulkBusy(null);
    }
  }

  async function handleCopyCodesList(items: AdminCodeItem[], label: string) {
    if (items.length === 0) {
      emitToast("لا توجد أكواد لنسخها حالياً.");
      return;
    }
    const text = items.map((c) => c.code).join("\n");
    const ok = await copyTextToClipboard(text);
    if (ok) {
      emitToast(`تم نسخ ${items.length} ${label} ✓`);
    }
  }

  function buildExportUrl(opts?: {
    batch?: string | null;
    status?: string;
    scope?: string;
  }): string {
    const params = new URLSearchParams();
    const useStatus = opts?.status ?? statusFilter;
    const useBatch = opts?.batch !== undefined ? opts.batch : batchFilter;
    const useScope = opts?.scope ?? scopeFilter;
    if (useStatus && useStatus !== "all") params.set("status", useStatus);
    if (useBatch) params.set("batchLabel", useBatch);
    if (useScope && useScope !== "all") params.set("scopeType", useScope);
    const qs = params.toString();
    return qs ? `/api/admin/codes/export?${qs}` : "/api/admin/codes/export";
  }

  const availableVisibleCodes = useMemo(
    () => codes.filter((c) => c.status === "available"),
    [codes]
  );

  return (
    <div className="space-y-6">
      {/* Sub-View Switcher: Codes Generator & Inventory vs Redemptions Audit Log */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSubView("codes")}
          className={`filter-pill min-h-[40px] px-4 py-2 rounded-2xl text-[12.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
            subView === "codes" ? "active" : ""
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>التوليد وجدول الأكواد</span>
        </button>
        <button
          type="button"
          onClick={() => setSubView("redemptions")}
          className={`filter-pill min-h-[40px] px-4 py-2 rounded-2xl text-[12.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
            subView === "redemptions" ? "active-warm" : ""
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل التفعيلات (من استخدم ماذا؟)</span>
        </button>
      </div>

      {subView === "redemptions" ? (
        <RedemptionsLogPanel />
      ) : (
        <>
      {/* 1. Batch Activation Codes Generator */}
      <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center shrink-0"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <PlusCircle className="w-5 h-5" />
              </span>
              <div>
                <h2
                  className="text-lg font-black tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  توليد دفعة أكواد تفعيل جديدة
                </h2>
                <p
                  className="text-[12.5px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  أنشئ من 1 إلى 500 كود دفعة واحدة مع تحديد النطاق، الوسم، وعدد مرات الاستخدام.
                </p>
              </div>
            </div>
          </div>

          <span
            className="font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-lg border"
            style={{
              background: "var(--bg-subtle)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            BATCH: 1 – 500 CODES
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Scope Picker */}
          <div className="space-y-2">
            <label
              className="block text-[12px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              نطاق التفعيل (Scope)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(
                [
                  {
                    value: "course",
                    title: "مقرر كامل",
                    sub: "يفتح جميع فصول مقرر محدد",
                  },
                  {
                    value: "lesson",
                    title: "فصل محدد",
                    sub: "يفتح درساً أو شابتراً واحداً فقط",
                  },
                  {
                    value: "bundle",
                    title: "كل المقررات",
                    sub: "باقة شاملة لجميع المقررات المتاحة",
                  },
                ] as const
              ).map((opt) => {
                const active = scopeType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setScopeType(opt.value)}
                    aria-pressed={active}
                    className={`filter-pill text-right rounded-2xl px-4 py-3 cursor-pointer flex flex-col gap-0.5 ${
                      active ? "active" : ""
                    }`}
                  >
                    <span className="text-[13.5px] font-extrabold">
                      {opt.title}
                    </span>
                    <span className="text-[11.5px] opacity-80">{opt.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scopeType === "course" && (
              <div className="md:col-span-2 space-y-1.5">
                <label
                  htmlFor="codeTargetCourse"
                  className="block text-[12px] font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  اختر المقرر المستهدف
                </label>
                <select
                  id="codeTargetCourse"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-bold outline-none"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.title} (الفرقة {course.yearLevel}
                      {course.isPaid ? " · مدفوع" : " · مجاني"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {scopeType === "lesson" && (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="codeLessonCourseFilter"
                    className="block text-[12px] font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    تصفية الفصول حسب المقرر
                  </label>
                  <select
                    id="codeLessonCourseFilter"
                    value={lessonCourseFilter}
                    onChange={(e) => setLessonCourseFilter(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-bold outline-none"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="">كل المقررات</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="codeTargetLesson"
                    className="block text-[12px] font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    اختر الفصل / الدرس
                  </label>
                  <select
                    id="codeTargetLesson"
                    value={effectiveLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-bold outline-none"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {filteredLessonsForPicker.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.courseCode} · {lesson.title}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {scopeType === "bundle" && (
              <div
                className="md:col-span-2 rounded-2xl border px-4 py-3 flex items-center gap-3"
                style={{
                  background: "var(--brand-soft)",
                  borderColor: "transparent",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Layers className="w-5 h-5 shrink-0" />
                <div className="text-[13px] font-bold">
                  سيتم إصدار أكواد باقة شاملة تفتح للطالب جميع المقررات والفصول على المنصة
                  (<span className="font-mono-code">targetId: all</span>).
                </div>
              </div>
            )}
          </div>

          {/* Quantity, Prefix, Batch Label, Max Uses, Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="space-y-1.5">
              <label
                htmlFor="codeQuantity"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                عدد الأكواد (1–500)
              </label>
              <input
                id="codeQuantity"
                type="number"
                min={1}
                max={500}
                required
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(500, Math.max(1, Number(e.target.value) || 1))
                  )
                }
                className="font-mono-code w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[14px] font-bold outline-none"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {QUANTITY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`font-mono-code text-[11px] px-2 py-0.5 rounded-lg border cursor-pointer transition-colors ${
                      quantity === preset ? "font-extrabold" : ""
                    }`}
                    style={{
                      background:
                        quantity === preset
                          ? "var(--brand-soft)"
                          : "var(--bg-surface)",
                      color:
                        quantity === preset
                          ? "var(--brand-soft-text)"
                          : "var(--text-muted)",
                      borderColor:
                        quantity === preset
                          ? "transparent"
                          : "var(--border-soft)",
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="codePrefix"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                البادئة (Prefix)
              </label>
              <input
                id="codePrefix"
                type="text"
                dir="ltr"
                maxLength={12}
                value={prefix}
                onChange={(e) =>
                  setPrefix(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                  )
                }
                placeholder="CS / OS / CG"
                className="font-mono-code w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[14px] font-bold outline-none"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="codeBatchLabel"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                اسم الدفعة (Batch)
              </label>
              <input
                id="codeBatchLabel"
                type="text"
                maxLength={120}
                value={batchLabel}
                onChange={(e) => setBatchLabel(e.target.value)}
                placeholder="مثال: دفعة ميدتيرم OS"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[13.5px] font-semibold outline-none"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="codeMaxUses"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                الاستخدام لكل كود
              </label>
              <input
                id="codeMaxUses"
                type="number"
                min={1}
                max={1000}
                required
                value={maxUses}
                onChange={(e) =>
                  setMaxUses(
                    Math.min(1000, Math.max(1, Number(e.target.value) || 1))
                  )
                }
                className="font-mono-code w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-[14px] font-bold outline-none"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="codeExpiresAt"
                className="block text-[12px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                تاريخ الانتهاء (اختياري)
              </label>
              <input
                id="codeExpiresAt"
                type="date"
                dir="ltr"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="font-mono-code w-full min-h-[44px] px-3 py-2 rounded-xl border text-[13px] font-semibold outline-none"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {genError && (
            <div
              className="rounded-xl px-4 py-2.5 text-[13px] font-bold"
              style={{
                background: "var(--danger-soft)",
                color: "var(--danger-fg)",
              }}
            >
              {genError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span
              className="text-[12px]"
              style={{ color: "var(--text-muted)" }}
            >
              يتم توليد الأكواد عشوائياً بأحرف واضحة خالية من الالتباس (بدون O/0 و I/1).
            </span>

            <button
              type="submit"
              disabled={isGenerating}
              className="min-h-[44px] px-6 py-2.5 rounded-xl text-[13.5px] font-extrabold text-white inline-flex items-center gap-2 transition-all hover:opacity-95 disabled:opacity-60 cursor-pointer shadow-sm"
              style={{ background: "var(--accent-warm)" }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التوليد...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد {quantity} كود الآن</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 2. Freshly Generated Batch Preview Box */}
      {freshCodes && freshCodes.length > 0 && (
        <section
          className="surface-card rounded-3xl p-5 sm:p-6 space-y-4 border-2"
          style={{ borderColor: "var(--success-fg)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center shrink-0"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <Check className="w-5 h-5" />
              </span>
              <div>
                <h3
                  className="text-base font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  تم توليد {freshCodes.length} كود تفعيل بنجاح!
                </h3>
                <p
                  className="text-[12px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {freshCodes[0].targetLabel}
                  {freshBatchLabel ? ` · الدفعة: ${freshBatchLabel}` : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  void handleCopyCodesList(freshCodes, "كود جديد")
                }
                className="min-h-[38px] px-3.5 py-2 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer"
                style={{ background: "var(--hero-bg)" }}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الأكواد</span>
              </button>

              <a
                href={buildExportUrl({
                  batch: freshBatchLabel ?? "",
                  status: "available",
                  scope: "all",
                })}
                className="min-h-[38px] px-3.5 py-2 rounded-xl text-[12.5px] font-extrabold border inline-flex items-center gap-1.5 transition-colors hover:opacity-85"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير CSV (Excel)</span>
              </a>

              <button
                type="button"
                onClick={() => setFreshCodes(null)}
                aria-label="إغلاق المعاينة"
                className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="max-h-56 overflow-y-auto rounded-2xl border p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
            }}
          >
            {freshCodes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void handleCopySingle(item.code, item.id)}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left transition-colors hover:border-[var(--brand-primary)] cursor-pointer"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }}
                title="اضغط للنسخ"
              >
                <span
                  dir="ltr"
                  className="font-mono-code text-[12.5px] font-bold truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.code}
                </span>
                {copiedId === item.id ? (
                  <Check
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--success-fg)" }}
                  />
                ) : (
                  <Copy
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. Codes Inventory Table & Filters */}
      <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <KeyRound
              className="w-5 h-5"
              style={{ color: "var(--brand-primary)" }}
            />
            <h2
              className="text-lg font-black"
              style={{ color: "var(--text-primary)" }}
            >
              سجل أكواد التفعيل
            </h2>
            <span
              className="font-mono-code text-[11.5px] font-bold px-2.5 py-0.5 rounded-full"
              style={{
                background: "var(--bg-subtle)",
                color: "var(--text-secondary)",
              }}
            >
              {codes.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void handleCopyCodesList(availableVisibleCodes, "كود متاح")
              }
              disabled={availableVisibleCodes.length === 0}
              className="min-h-[38px] px-3 py-1.5 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ المتاح ({availableVisibleCodes.length})</span>
            </button>

            <a
              href={buildExportUrl()}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV (Excel)</span>
            </a>

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

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالكود أو باسم الدفعة..."
              className="w-full min-h-[42px] pr-10 pl-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              {STATUS_FILTERS.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setStatusFilter(st.value)}
                  aria-pressed={statusFilter === st.value}
                  className={`filter-pill min-h-[38px] px-3 py-1.5 rounded-xl text-[12px] cursor-pointer ${
                    statusFilter === st.value ? "active" : ""
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <select
              aria-label="تصفية حسب النطاق"
              value={scopeFilter}
              onChange={(e) =>
                setScopeFilter(e.target.value as "all" | ActivationScope)
              }
              className="min-h-[38px] px-3 py-1.5 rounded-xl border text-[12px] font-bold outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <option value="all">كل النطاقات</option>
              <option value="course">مقرر كامل</option>
              <option value="lesson">فصل محدد</option>
              <option value="bundle">كل المقررات</option>
            </select>

            {batchLabels.length > 0 && (
              <select
                aria-label="تصفية حسب الدفعة"
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl border text-[12px] font-bold outline-none max-w-[190px]"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">كل الدفعات</option>
                {batchLabels.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Batch Bulk Actions Strip */}
        {batchFilter && (
          <div
            className="rounded-2xl border px-4 py-3 flex flex-wrap items-center justify-between gap-2.5"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-strong)",
            }}
          >
            <div className="text-[12.5px] font-extrabold" style={{ color: "var(--text-primary)" }}>
              إجراءات جماعية على دفعة «{batchFilter}»:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={bulkBusy !== null}
                onClick={() => void handleBulkBatchAction("revoke_batch")}
                className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                style={{
                  background: "var(--danger-soft)",
                  color: "var(--danger-fg)",
                }}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>إلغاء الدفعة</span>
              </button>
              <button
                type="button"
                disabled={bulkBusy !== null}
                onClick={() => void handleBulkBatchAction("restore_batch")}
                className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الدفعة</span>
              </button>
              <button
                type="button"
                disabled={bulkBusy !== null}
                onClick={() => void handleBulkBatchAction("delete_unused_batch")}
                className="min-h-[34px] px-3 py-1 rounded-xl border text-[11.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                  color: "var(--danger-fg)",
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف غير المستخدم</span>
              </button>
            </div>
          </div>
        )}

        {/* Error / Loading / Empty / Data */}
        {loadError ? (
          <div
            className="rounded-2xl p-5 text-center space-y-2"
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
          <div className="space-y-2.5 py-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-14 rounded-2xl animate-pulse"
                style={{ background: "var(--bg-subtle)" }}
              />
            ))}
          </div>
        ) : codes.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-10 text-center space-y-2"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-strong)",
            }}
          >
            <KeyRound
              className="w-8 h-8 mx-auto opacity-60"
              style={{ color: "var(--text-muted)" }}
            />
            <div
              className="text-[15px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              لا توجد أكواد مطابقة لخيارات البحث الحالية
            </div>
            <p
              className="text-[12.5px]"
              style={{ color: "var(--text-muted)" }}
            >
              استخدم النموذج بالأعلى لتوليد أول دفعة أكواد أو قم بتوسيع الفلاتر.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border-soft)" }}>
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
                    <th className="py-3 px-4">الكود</th>
                    <th className="py-3 px-4">النطاق والهدف</th>
                    <th className="py-3 px-4">الدفعة</th>
                    <th className="py-3 px-4">الاستخدام</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4">تاريخ الإنشاء / الانتهاء</th>
                    <th className="py-3 px-4 text-left">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-[13px]" style={{ borderColor: "var(--border-soft)" }}>
                  {codes.map((item) => {
                    const badgeStyle = getStatusBadgeStyle(item.status);
                    const pct = Math.min(
                      100,
                      Math.round((item.usedCount / Math.max(1, item.maxUses)) * 100)
                    );
                    const isBusy = togglingId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ borderColor: "var(--border-soft)" }}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <span
                              dir="ltr"
                              className="font-mono-code text-[12.5px] font-extrabold px-2.5 py-1 rounded-lg border"
                              style={{
                                background: "var(--bg-canvas)",
                                borderColor: "var(--border-soft)",
                                color: "var(--text-primary)",
                              }}
                            >
                              {item.code}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                void handleCopySingle(item.code, item.id)
                              }
                              aria-label={`نسخ الكود ${item.code}`}
                              className="w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors hover:bg-[var(--bg-subtle)] cursor-pointer"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {copiedId === item.id ? (
                                <Check
                                  className="w-3.5 h-3.5"
                                  style={{ color: "var(--success-fg)" }}
                                />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span
                              className="font-bold text-[12.5px]"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {item.targetLabel}
                            </span>
                            <span
                              className="text-[11px] font-semibold"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {SCOPE_LABELS_AR[item.scopeType]}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className="text-[12px] font-semibold"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {item.batchLabel || "—"}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="w-24 space-y-1">
                            <div
                              dir="ltr"
                              className="font-mono-code text-[11.5px] font-bold text-right"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {item.usedCount} / {item.maxUses}
                            </div>
                            <div
                              className="h-1.5 rounded-full overflow-hidden"
                              style={{ background: "var(--bg-subtle)" }}
                            >
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  background:
                                    pct >= 100
                                      ? "var(--brand-primary)"
                                      : "var(--success-fg)",
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-extrabold"
                            style={badgeStyle}
                          >
                            {STATUS_LABELS_AR[item.status]}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div
                            className="text-[11.5px] font-semibold"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {formatArabicDate(item.createdAt)}
                          </div>
                          {item.expiresAt && (
                            <div
                              className="text-[11px]"
                              style={{ color: "var(--text-muted)" }}
                            >
                              ينتهي: {formatArabicDate(item.expiresAt)}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handleCopyWhatsApp(item)}
                              title="نسخ رسالة واتساب جاهزة للطالب"
                              aria-label="نسخ رسالة واتساب"
                              className="w-8 h-8 rounded-xl border inline-flex items-center justify-center transition-colors hover:border-[var(--success-fg)] cursor-pointer"
                              style={{
                                background: "var(--bg-surface)",
                                borderColor: "var(--border-soft)",
                                color: "var(--success-fg)",
                              }}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleToggleRevoke(item)}
                              className="min-h-[34px] px-3 py-1 rounded-xl border text-[11.5px] font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                              style={{
                                background: item.isRevoked
                                  ? "var(--success-soft)"
                                  : "var(--danger-soft)",
                                color: item.isRevoked
                                  ? "var(--success-fg)"
                                  : "var(--danger-fg)",
                                borderColor: "transparent",
                              }}
                            >
                              {isBusy ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : item.isRevoked ? (
                                <RotateCcw className="w-3.5 h-3.5" />
                              ) : (
                                <Ban className="w-3.5 h-3.5" />
                              )}
                              <span>{item.isRevoked ? "استعادة" : "إلغاء"}</span>
                            </button>

                            {item.usedCount === 0 && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => void handleDeleteCode(item)}
                                title="حذف الكود غير المستخدم"
                                aria-label="حذف الكود"
                                className="w-8 h-8 rounded-xl border inline-flex items-center justify-center transition-colors hover:border-[var(--danger-fg)] cursor-pointer disabled:opacity-50"
                                style={{
                                  background: "var(--bg-surface)",
                                  borderColor: "var(--border-soft)",
                                  color: "var(--danger-fg)",
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {codes.map((item) => {
                const badgeStyle = getStatusBadgeStyle(item.status);
                const isBusy = togglingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border p-4 space-y-3"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => void handleCopySingle(item.code, item.id)}
                        className="inline-flex items-center gap-2 cursor-pointer"
                      >
                        <span
                          dir="ltr"
                          className="font-mono-code text-[13px] font-extrabold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.code}
                        </span>
                        <Copy
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--text-muted)" }}
                        />
                      </button>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                        style={badgeStyle}
                      >
                        {STATUS_LABELS_AR[item.status]}
                      </span>
                    </div>

                    <div className="text-[12.5px] space-y-1">
                      <div
                        className="font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.targetLabel}
                      </div>
                      <div
                        className="flex flex-wrap items-center gap-2 text-[11.5px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span>{SCOPE_LABELS_AR[item.scopeType]}</span>
                        <span>·</span>
                        <span dir="ltr" className="font-mono-code font-bold">
                          {item.usedCount}/{item.maxUses}
                        </span>
                        {item.batchLabel && (
                          <>
                            <span>·</span>
                            <span>{item.batchLabel}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatArabicDate(item.createdAt)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => void handleCopyWhatsApp(item)}
                          aria-label="نسخ رسالة واتساب"
                          className="w-8 h-8 rounded-xl border inline-flex items-center justify-center cursor-pointer"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                            color: "var(--success-fg)",
                          }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleToggleRevoke(item)}
                          className="min-h-[34px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                          style={{
                            background: item.isRevoked
                              ? "var(--success-soft)"
                              : "var(--danger-soft)",
                            color: item.isRevoked
                              ? "var(--success-fg)"
                              : "var(--danger-fg)",
                          }}
                        >
                          {item.isRevoked ? "استعادة" : "إلغاء"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
        </>
      )}
    </div>
  );
}
