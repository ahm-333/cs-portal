"use client";

import { useCallback, useEffect, useState } from "react";
import {
  History,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  formatArabicDateTime,
  SCOPE_LABELS_AR,
  type AdminRedemptionItem,
} from "@/components/admin/adminTypes";

export function RedemptionsLogPanel() {
  const [items, setItems] = useState<AdminRedemptionItem[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ limit: "200" });
    if (debouncedQuery) params.set("q", debouncedQuery);

    (async () => {
      try {
        const res = await fetch(`/api/admin/redemptions?${params.toString()}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          redemptions?: AdminRedemptionItem[];
          error?: string;
        };
        if (!active) return;
        if (!res.ok) throw new Error(data.error || "تعذر تحميل سجل التفعيلات.");
        setItems(data.redemptions ?? []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "تعذر تحميل سجل التفعيلات."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [debouncedQuery, tick]);

  return (
    <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <History
            className="w-5 h-5"
            style={{ color: "var(--brand-primary)" }}
          />
          <h2
            className="text-lg font-black"
            style={{ color: "var(--text-primary)" }}
          >
            سجل استخدام وتفعيل الأكواد (Audit Log)
          </h2>
          <span
            className="font-mono-code text-[11.5px] font-bold px-2.5 py-0.5 rounded-full"
            style={{
              background: "var(--bg-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={reload}
          aria-label="تحديث سجل التفعيلات"
          className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
            color: "var(--text-secondary)",
          }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative max-w-lg">
        <Search
          className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالكود، اسم الطالب، البريد، أو الدفعة..."
          className="w-full min-h-[42px] pr-10 pl-3.5 py-2 rounded-xl border text-[13px] font-semibold outline-none"
          style={{
            background: "var(--bg-canvas)",
            borderColor: "var(--border-soft)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {error ? (
        <div
          className="rounded-2xl p-5 text-center text-[13px] font-bold"
          style={{
            background: "var(--danger-soft)",
            color: "var(--danger-fg)",
          }}
        >
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-14 rounded-2xl animate-pulse"
              style={{ background: "var(--bg-subtle)" }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-10 text-center space-y-1.5"
          style={{
            background: "var(--bg-canvas)",
            borderColor: "var(--border-strong)",
          }}
        >
          <History
            className="w-7 h-7 mx-auto opacity-60"
            style={{ color: "var(--text-muted)" }}
          />
          <div
            className="text-[14px] font-extrabold"
            style={{ color: "var(--text-primary)" }}
          >
            لا توجد عمليات تفعيل مسجلة بعد
          </div>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            سيظهر هنا كل طالب استخدم كود تفعيل مع التوقيت وبصمة الـ IP لكشف أي مشاركة غير مصرح بها.
          </p>
        </div>
      ) : (
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
                <th className="py-3 px-4">الكود</th>
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-4">المقرر / النطاق</th>
                <th className="py-3 px-4">الدفعة</th>
                <th className="py-3 px-4">بصمة IP</th>
                <th className="py-3 px-4">وقت التفعيل</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--bg-hover)] transition-colors"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      dir="ltr"
                      className="font-mono-code font-extrabold px-2 py-0.5 rounded-lg border"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.code}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className="font-extrabold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.userName}
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono-code text-[11px] text-right"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.userEmail}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className="font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.targetLabel}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {SCOPE_LABELS_AR[item.scopeType]}
                    </div>
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.batchLabel || "—"}
                  </td>
                  <td
                    className="py-3 px-4 font-mono-code text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.ipHash || "—"}
                  </td>
                  <td
                    className="py-3 px-4 whitespace-nowrap text-[11.5px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {formatArabicDateTime(item.redeemedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
