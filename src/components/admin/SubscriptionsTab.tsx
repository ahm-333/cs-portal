"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Eye,
  Loader2,
  MessageCircle,
  RefreshCw,
  User,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/auth/phone";
import { emitToast } from "@/lib/stores/events";
import {
  formatArabicDateTime,
  formatEgp,
  formatRelativeArabicTime,
  PAYMENT_METHOD_AR,
  SUBSCRIPTION_STATUS_AR,
  type AdminSubscriptionRequest,
  type AdminSubscriptionStatus,
} from "@/components/admin/adminTypes";

export interface SubscriptionsTabProps {
  onStatsChanged: () => void;
  onInspectStudent?: (studentId: string) => void;
}

type StatusFilter = "pending" | "approved" | "rejected" | "all";

const FILTER_OPTIONS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: "pending", label: "معلّق" },
  { value: "approved", label: "مقبول" },
  { value: "rejected", label: "مرفوض" },
  { value: "all", label: "الكل" },
];

const QUICK_REJECT_REASONS = [
  "لم يصل التحويل بعد — برجاء التأكد من الرقم",
  "صورة الإيصال غير واضحة",
  "المبلغ المحوّل غير مطابق لسعر المادة",
] as const;

function statusBadgeColors(status: AdminSubscriptionStatus): {
  background: string;
  color: string;
} {
  if (status === "approved") {
    return { background: "var(--success-soft)", color: "var(--success-fg)" };
  }
  if (status === "rejected") {
    return { background: "var(--danger-soft)", color: "var(--danger-fg)" };
  }
  return {
    background: "var(--accent-warm-soft)",
    color: "var(--accent-warm-text)",
  };
}

export function SubscriptionsTab({
  onStatsChanged,
  onInspectStudent,
}: SubscriptionsTabProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [requests, setRequests] = useState<AdminSubscriptionRequest[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState<string>("");

  // Lightbox for receipt image
  const [lightboxReq, setLightboxReq] =
    useState<AdminSubscriptionRequest | null>(null);

  const triggerReload = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxReq(null);
    };
    if (lightboxReq) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
    return undefined;
  }, [lightboxReq]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/subscriptions?status=${statusFilter}`,
          { cache: "no-store" }
        );
        const data = (await res.json()) as {
          requests?: AdminSubscriptionRequest[];
          pendingCount?: number;
          error?: string;
        };
        if (!active) return;
        if (!res.ok) {
          throw new Error(data.error || "تعذر تحميل طلبات الاشتراك.");
        }
        setRequests(data.requests ?? []);
        setPendingCount(data.pendingCount ?? 0);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "تعذر تحميل طلبات الاشتراك."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [statusFilter, refreshTick]);

  async function handleAction(
    req: AdminSubscriptionRequest,
    action: "approve" | "reject",
    adminNote?: string
  ) {
    setBusyId(req.id);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: req.id,
          action,
          adminNote: adminNote?.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "تعذر تنفيذ العملية.");
      }

      const studentLabel = req.studentName || req.userName || "الطالب";
      emitToast(
        action === "approve"
          ? `تم قبول الطلب وتفعيل ${req.courseTitle} لـ ${studentLabel} ✓`
          : `تم رفض طلب ${studentLabel}`
      );
      setRejectingId(null);
      setRejectNote("");
      triggerReload();
      onStatsChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر تنفيذ العملية.");
    } finally {
      setBusyId(null);
    }
  }

  function handleCopySender(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      emitToast("تم نسخ بيانات المحوّل ✓");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header & Filter Bar */}
      <section className="surface-card rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-10 h-10 rounded-2xl inline-flex items-center justify-center shrink-0"
            style={{
              background: "var(--accent-warm-soft)",
              color: "var(--accent-warm-text)",
            }}
          >
            <CreditCard className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h2
              className="text-base sm:text-lg font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              طلبات الاشتراك والتحويلات
            </h2>
            <p
              className="text-[12px]"
              style={{ color: "var(--text-muted)" }}
            >
              مراجعة تحويلات فودافون كاش وInstaPay وتفعيل المواد للطلاب بضغطة واحدة.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_OPTIONS.map((opt) => {
              const isActive = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setLoading(true);
                  }}
                  aria-pressed={isActive}
                  className={`filter-pill min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? opt.value === "pending"
                        ? "active-warm"
                        : "active"
                      : ""
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.value === "pending" && pendingCount > 0 && (
                    <span
                      className="font-mono-code text-[10.5px] px-1.5 py-0.2 rounded-full"
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.22)"
                          : "var(--accent-warm-soft)",
                        color: isActive ? "#ffffff" : "var(--accent-warm-text)",
                      }}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={triggerReload}
            aria-label="تحديث الطلبات"
            className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer transition-colors hover:opacity-80"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </section>

      {/* Body */}
      {error ? (
        <div
          className="surface-card rounded-3xl p-6 text-center space-y-3"
          style={{ color: "var(--danger-fg)" }}
        >
          <p className="text-[13.5px] font-bold">{error}</p>
          <button
            type="button"
            onClick={triggerReload}
            className="px-4 py-2 rounded-xl text-[12px] font-extrabold text-white cursor-pointer"
            style={{ background: "var(--accent-warm)" }}
          >
            إعادة المحاولة
          </button>
        </div>
      ) : loading && requests.length === 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-52 rounded-3xl animate-pulse"
              style={{ background: "var(--bg-subtle)" }}
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div
          className="surface-card rounded-3xl p-10 text-center space-y-2.5"
          style={{ borderStyle: "dashed" }}
        >
          <CheckCircle2
            className="w-9 h-9 mx-auto opacity-75"
            style={{ color: "var(--success-fg)" }}
          />
          <h3
            className="text-[15px] font-black"
            style={{ color: "var(--text-primary)" }}
          >
            {statusFilter === "pending"
              ? "لا توجد طلبات اشتراك معلّقة حالياً"
              : "لا توجد طلبات مطابقة لهذا الفلتر"}
          </h3>
          <p
            className="text-[12.5px] max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            فور إرسال أي طالب لتحويل فودافون كاش أو InstaPay سيظهر هنا مع الإيصال والتفعيل الفوري بضغطة واحدة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {requests.map((req) => {
            const studentName = req.studentName || req.userName || "طالب";
            const studentEmail = req.studentEmail || req.userEmail || "";
            const studentPhone = req.studentPhone ?? req.userPhone ?? null;
            const baseWa = studentPhone ? buildWhatsAppLink(studentPhone) : null;
            const waLink = baseWa
              ? `${baseWa}?text=${encodeURIComponent(
                  `أهلاً يا ${studentName}، بخصوص طلب اشتراكك في مادة ${req.courseTitle} على المنصة:`
                )}`
              : null;
            const methodLabel =
              PAYMENT_METHOD_AR[req.method] ?? req.method ?? "تحويل";
            const isBusy = busyId === req.id;
            const isRejectOpen = rejectingId === req.id;
            const badgeStyle = statusBadgeColors(req.status);

            return (
              <article
                key={req.id}
                className="surface-card rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all"
                style={{
                  borderColor:
                    req.status === "pending"
                      ? "var(--border-strong)"
                      : "var(--border-soft)",
                }}
              >
                <div className="space-y-3.5">
                  {/* Top Row: Student + Status + Amount */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="text-[15px] font-black truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {studentName}
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                          style={badgeStyle}
                        >
                          {SUBSCRIPTION_STATUS_AR[req.status] ?? req.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
                        {studentPhone && (
                          <span
                            dir="ltr"
                            className="font-mono-code font-bold"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {studentPhone}
                          </span>
                        )}
                        {studentEmail && (
                          <span
                            dir="ltr"
                            className="font-mono-code truncate"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {studentEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div
                        className="font-mono-code text-lg font-black"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {formatEgp(req.amount)}
                      </div>
                      <div
                        className="text-[11px] inline-flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                        title={formatArabicDateTime(req.createdAt)}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeArabicTime(req.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Course & Payment Details Box */}
                  <div
                    className="rounded-2xl border p-3.5 space-y-2.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="font-en px-2 py-0.5 rounded-lg text-[11px] font-extrabold shrink-0"
                          style={{
                            background: "var(--brand-soft)",
                            color: "var(--brand-soft-text)",
                          }}
                        >
                          {req.courseCode}
                        </span>
                        <span
                          className="text-[13.5px] font-extrabold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {req.courseTitle}
                        </span>
                      </div>

                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold shrink-0"
                        style={{
                          background:
                            req.method === "instapay"
                              ? "var(--brand-soft)"
                              : "var(--accent-warm-soft)",
                          color:
                            req.method === "instapay"
                              ? "var(--brand-soft-text)"
                              : "var(--accent-warm-text)",
                        }}
                      >
                        <Wallet className="w-3 h-3" />
                        <span>{methodLabel}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[12px]" style={{ borderColor: "var(--border-soft)" }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span style={{ color: "var(--text-muted)" }}>
                          حساب المحوّل:
                        </span>
                        <span
                          dir="ltr"
                          className="font-mono-code font-extrabold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {req.senderInfo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopySender(req.senderInfo)}
                          title="نسخ"
                          className="p-1 rounded-lg hover:opacity-80 cursor-pointer"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatArabicDateTime(req.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Admin Note if reviewed */}
                  {req.adminNote && (
                    <div
                      className="rounded-xl px-3 py-2 text-[12px] font-semibold"
                      style={{
                        background:
                          req.status === "rejected"
                            ? "var(--danger-soft)"
                            : "var(--bg-subtle)",
                        color:
                          req.status === "rejected"
                            ? "var(--danger-fg)"
                            : "var(--text-secondary)",
                      }}
                    >
                      ملاحظة المشرف: {req.adminNote}
                    </div>
                  )}

                  {/* Inline Reject Reason Prompt */}
                  {isRejectOpen && req.status === "pending" && (
                    <div
                      className="rounded-2xl border p-3.5 space-y-2.5"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--danger-fg)",
                      }}
                    >
                      <div
                        className="text-[12px] font-extrabold"
                        style={{ color: "var(--danger-fg)" }}
                      >
                        سبب الرفض (سيظهر للطالب في حسابه):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_REJECT_REASONS.map((reason) => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => setRejectNote(reason)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors hover:opacity-85"
                            style={{
                              background: "var(--bg-surface)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="اكتب سبب الرفض..."
                        className="w-full min-h-[38px] px-3 py-1.5 rounded-xl border text-[12.5px] font-semibold outline-none"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            void handleAction(req, "reject", rejectNote)
                          }
                          className="min-h-[36px] px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          style={{ background: "var(--danger-fg)" }}
                        >
                          {isBusy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>تأكيد الرفض</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectNote("");
                          }}
                          className="min-h-[36px] px-3 py-1.5 rounded-xl border text-[12px] font-bold cursor-pointer"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div
                  className="pt-3 border-t flex flex-wrap items-center justify-between gap-2"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {req.receiptData && (
                      <button
                        type="button"
                        onClick={() => setLightboxReq(req)}
                        className="min-h-[36px] px-3 py-1.5 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors hover:border-[var(--brand-primary)]"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Eye
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--brand-primary)" }}
                        />
                        <span>عرض سكرين شوت الإيصال</span>
                      </button>
                    )}

                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[36px] px-3 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1.5 hover:opacity-85"
                        style={{
                          background: "var(--success-soft)",
                          color: "var(--success-fg)",
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    )}

                    {onInspectStudent && (
                      <button
                        type="button"
                        onClick={() => onInspectStudent(req.userId)}
                        className="min-h-[36px] px-2.5 py-1.5 rounded-xl border text-[11.5px] font-bold inline-flex items-center gap-1 cursor-pointer hover:opacity-85"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>ملف الطالب</span>
                      </button>
                    )}
                  </div>

                  {req.status === "pending" && !isRejectOpen && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleAction(req, "approve")}
                        className="min-h-[38px] px-4 py-1.5 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-95 disabled:opacity-60"
                        style={{ background: "var(--success-fg)" }}
                      >
                        {isBusy ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>قبول وتفعيل المادة</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => {
                          setRejectingId(req.id);
                          setRejectNote("");
                        }}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl text-[12px] font-extrabold inline-flex items-center gap-1 cursor-pointer hover:opacity-85 disabled:opacity-60"
                        style={{
                          background: "var(--danger-soft)",
                          color: "var(--danger-fg)",
                        }}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>رفض مع سبب</span>
                      </button>
                    </div>
                  )}

                  {req.status !== "pending" && req.reviewedAt && (
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      تمت المراجعة: {formatArabicDateTime(req.reviewedAt)}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Receipt Image Lightbox Modal */}
      {lightboxReq && lightboxReq.receiptData && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="معاينة إيصال التحويل"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxReq(null);
          }}
        >
          <div
            className="surface-card w-full max-w-2xl rounded-3xl p-4 sm:p-5 space-y-4 max-h-[92vh] flex flex-col"
            style={{ boxShadow: "var(--shadow-modal)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div
                  className="text-[14.5px] font-black truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  إيصال تحويل —{" "}
                  {lightboxReq.studentName || lightboxReq.userName || "طالب"}
                </div>
                <div
                  className="text-[12px] truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {lightboxReq.courseCode} · {lightboxReq.courseTitle} ·{" "}
                  {formatEgp(lightboxReq.amount)} ({lightboxReq.senderInfo})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLightboxReq(null)}
                aria-label="إغلاق المعاينة"
                className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer shrink-0"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="flex-1 overflow-auto rounded-2xl border p-2 flex items-center justify-center min-h-[260px]"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxReq.receiptData}
                alt="إيصال التحويل"
                className="max-w-full max-h-[64vh] object-contain rounded-xl"
              />
            </div>

            {lightboxReq.status === "pending" && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={busyId === lightboxReq.id}
                  onClick={() => {
                    const target = lightboxReq;
                    setLightboxReq(null);
                    void handleAction(target, "approve");
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer"
                  style={{ background: "var(--success-fg)" }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>قبول وتفعيل المادة فوراً</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = lightboxReq.id;
                    setLightboxReq(null);
                    setRejectingId(id);
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl text-[12.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  style={{
                    background: "var(--danger-soft)",
                    color: "var(--danger-fg)",
                  }}
                >
                  <XCircle className="w-4 h-4" />
                  <span>رفض مع سبب</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
