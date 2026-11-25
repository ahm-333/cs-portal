"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Database,
  Loader2,
  LogOut,
  MonitorSmartphone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { emitToast } from "@/lib/stores/events";
import {
  formatArabicDateTime,
  type AdminSystemData,
} from "@/components/admin/adminTypes";

export interface SystemOperationsTabProps {
  onStatsChanged: () => void;
}

function summarizeUserAgent(ua: string | null): string {
  if (!ua) return "متصفح غير معروف";
  let browser = "متصفح";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/")) browser = "Safari";

  let os = "";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";

  return os ? `${browser} · ${os}` : browser;
}

export function SystemOperationsTab({
  onStatsChanged,
}: SystemOperationsTabProps) {
  const [data, setData] = useState<AdminSystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/system", { cache: "no-store" });
        const json = (await res.json()) as AdminSystemData & { error?: string };
        if (!active) return;
        if (!res.ok) throw new Error(json.error || "تعذر تحميل حالة النظام.");
        setData(json);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "تعذر تحميل حالة النظام.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshTick]);

  async function runSystemAction(
    key: string,
    body: Record<string, unknown>,
    successMsg: string
  ) {
    setBusyKey(key);
    try {
      const res = await fetch("/api/admin/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        affected?: number;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "تعذر تنفيذ العملية.");
      }
      emitToast(`${successMsg} (${json.affected ?? 0})`);
      reload();
      onStatsChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر تنفيذ العملية.");
    } finally {
      setBusyKey(null);
    }
  }

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-44 rounded-3xl animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="surface-card rounded-3xl p-6 text-center space-y-3"
        style={{ color: "var(--danger-fg)" }}
      >
        <p className="text-[13.5px] font-bold">
          {error || "تعذر تحميل بيانات النظام."}
        </p>
        <button
          type="button"
          onClick={reload}
          className="px-4 py-2 rounded-xl text-[12.5px] font-extrabold text-white cursor-pointer"
          style={{ background: "var(--accent-warm)" }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const envChecks = [
    {
      label: "Neon Pooled DB (DATABASE_URL)",
      ok: data.envStatus.databaseUrl,
      detail: `${data.dbLatencyMs}ms ping`,
    },
    {
      label: "Neon Direct DB (DATABASE_URL_UNPOOLED)",
      ok: data.envStatus.databaseUrlUnpooled,
      detail: data.envStatus.databaseUrlUnpooled ? "جاهز للهجرات" : "غير مضبوط",
    },
    {
      label: "Google OAuth 2.0 (GOOGLE_CLIENT_ID)",
      ok: data.envStatus.googleOAuth,
      detail: data.envStatus.googleOAuth ? "مفعّل" : "أضف المفاتيح في .env.local",
    },
    {
      label: "Gemini AI Tutor (GEMINI_API_KEY)",
      ok: data.envStatus.geminiApiKey,
      detail: `${data.envStatus.geminiModel} · حد يومي ${data.envStatus.aiDailyLimit}`,
    },
    {
      label: "Bunny Stream CDN Host",
      ok: data.envStatus.bunnyCdnHost,
      detail: data.envStatus.bunnyCdnHost ? "مفعّل" : "اختياري (غير مضبوط)",
    },
    {
      label: "Bunny Stream Token Key",
      ok: data.envStatus.bunnyTokenKey,
      detail: data.envStatus.bunnyTokenKey ? "مفعّل" : "اختياري (غير مضبوط)",
    },
    {
      label: "Protected HLS Signing Secret",
      ok: data.envStatus.hlsSigningSecret,
      detail: data.envStatus.hlsSigningSecret ? "مفعّل" : "اختياري (غير مضبوط)",
    },
  ];

  const tableStats = [
    { label: "المستخدمون (users)", count: data.tableCounts.users },
    { label: "الجلسات النشطة", count: data.tableCounts.activeSessions },
    { label: "الجلسات المنتهية", count: data.tableCounts.expiredSessions },
    { label: "أكواد التفعيل", count: data.tableCounts.activationCodes },
    { label: "الاشتراكات", count: data.tableCounts.enrollments },
    { label: "سجل التفعيلات", count: data.tableCounts.codeRedemptions },
    { label: "سجل التقدم", count: data.tableCounts.userProgress },
    { label: "الملاحظات", count: data.tableCounts.userNotes },
    { label: "بنك الأخطاء", count: data.tableCounts.userMistakes },
    { label: "سجلات AI", count: data.tableCounts.aiChatUsage },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Neon DB Health + Environment Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-6 surface-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <Database className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2
                  className="text-base font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  صحة قاعدة بيانات Neon والجداول
                </h2>
                <p
                  className="text-[11.5px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  متصل · زمن الاستجابة{" "}
                  <strong className="font-mono-code">{data.dbLatencyMs}ms</strong>{" "}
                  · البيئة:{" "}
                  <strong className="font-mono-code">
                    {data.envStatus.nodeEnv}
                  </strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={reload}
              aria-label="تحديث حالة النظام"
              className="w-9 h-9 rounded-xl border inline-flex items-center justify-center cursor-pointer"
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {tableStats.map((t) => (
              <div
                key={t.label}
                className="rounded-2xl border p-3 space-y-0.5"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div
                  className="font-mono-code text-lg font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.count}
                </div>
                <div
                  className="text-[11px] font-bold truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-6 surface-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <ShieldCheck className="w-4.5 h-4.5" />
            </span>
            <div>
              <h2
                className="text-base font-black"
                style={{ color: "var(--text-primary)" }}
              >
                حالة التكاملات ومتغيرات البيئة
              </h2>
              <p
                className="text-[11.5px] font-mono-code"
                style={{ color: "var(--text-muted)" }}
              >
                SITE: {data.envStatus.siteUrl}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {envChecks.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.ok ? (
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--success-fg)" }}
                    />
                  ) : (
                    <XCircle
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                  <span
                    className="font-mono-code text-[12px] font-bold truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  className="text-[11px] font-bold shrink-0"
                  style={{
                    color: item.ok ? "var(--success-fg)" : "var(--text-muted)",
                  }}
                >
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 2. AI Usage Monitor */}
      <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h2
                className="text-base font-black"
                style={{ color: "var(--text-primary)" }}
              >
                مراقبة المساعد الذكي (Gemini AI Tutor)
              </h2>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                اليوم ({data.aiUsage.dateKey}):{" "}
                <strong className="font-mono-code">
                  {data.aiUsage.todayTotalRequests}
                </strong>{" "}
                طلب · آخر 7 أيام:{" "}
                <strong className="font-mono-code">
                  {data.aiUsage.sevenDayTotalRequests}
                </strong>{" "}
                طلب · الحد اليومي لكل مستخدم:{" "}
                <strong className="font-mono-code">
                  {data.aiUsage.dailyLimit}
                </strong>
              </p>
            </div>
          </div>

          {data.aiUsage.todayTotalRequests > 0 && (
            <button
              type="button"
              disabled={busyKey === "reset-ai-all"}
              onClick={() =>
                void runSystemAction(
                  "reset-ai-all",
                  { action: "reset_ai_usage", dateKey: data.aiUsage.dateKey },
                  "تم تصفير حصص الذكاء الاصطناعي لليوم"
                )
              }
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              {busyKey === "reset-ai-all" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>تصفير حصص اليوم للجميع</span>
            </button>
          )}
        </div>

        {data.aiUsage.entries.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-6 text-center text-[12.5px]"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-muted)",
            }}
          >
            لا توجد طلبات مسجلة للمساعد الذكي خلال آخر 7 أيام.
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
                  <th className="py-2.5 px-4">المستخدم / الزائر</th>
                  <th className="py-2.5 px-4">التاريخ (UTC)</th>
                  <th className="py-2.5 px-4">الاستهلاك</th>
                  <th className="py-2.5 px-4">آخر طلب</th>
                  <th className="py-2.5 px-4 text-left">إجراء</th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: "var(--border-soft)" }}
              >
                {data.aiUsage.entries.map((entry) => {
                  const pct = Math.min(
                    100,
                    Math.round(
                      (entry.requestCount / Math.max(1, data.aiUsage.dailyLimit)) *
                        100
                    )
                  );
                  const key = `ai-${entry.id}`;
                  return (
                    <tr
                      key={entry.id}
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      <td className="py-2.5 px-4">
                        <div
                          className="font-extrabold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {entry.actorLabel}
                        </div>
                        {entry.actorEmail && (
                          <div
                            dir="ltr"
                            className="font-mono-code text-[11px] text-right"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {entry.actorEmail}
                          </div>
                        )}
                      </td>
                      <td
                        className="py-2.5 px-4 font-mono-code"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {entry.dateKey}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="w-32 space-y-1">
                          <div className="font-mono-code text-[11.5px] font-extrabold">
                            {entry.requestCount} / {data.aiUsage.dailyLimit}
                          </div>
                          <div
                            className="h-1.5 rounded-full overflow-hidden"
                            style={{ background: "var(--bg-subtle)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background:
                                  pct >= 90
                                    ? "var(--danger-fg)"
                                    : "var(--brand-primary)",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td
                        className="py-2.5 px-4 text-[11.5px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatArabicDateTime(entry.updatedAt)}
                      </td>
                      <td className="py-2.5 px-4 text-left">
                        <button
                          type="button"
                          disabled={busyKey === key}
                          onClick={() =>
                            void runSystemAction(
                              key,
                              {
                                action: "reset_ai_usage",
                                actorKey: entry.actorKey,
                                dateKey: entry.dateKey,
                              },
                              `تم تصفير حصة ${entry.actorLabel}`
                            )
                          }
                          className="px-2.5 py-1 rounded-xl border text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>تصفير</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 3. Active Sessions & Security Control */}
      <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <MonitorSmartphone className="w-5 h-5" />
            </span>
            <div>
              <h2
                className="text-base font-black"
                style={{ color: "var(--text-primary)" }}
              >
                الجلسات النشطة وإدارة الأمان
              </h2>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                راقب الأجهزة المتصلة حالياً وأنهِ أي جلسة مشبوهة أو نظّف الجلسات المنتهية بضغطة واحدة.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={
              busyKey === "cleanup-sessions" ||
              data.tableCounts.expiredSessions === 0
            }
            onClick={() =>
              void runSystemAction(
                "cleanup-sessions",
                { action: "cleanup_expired_sessions" },
                "تم حذف الجلسات المنتهية"
              )
            }
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            {busyKey === "cleanup-sessions" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>
              تنظيف الجلسات المنتهية ({data.tableCounts.expiredSessions})
            </span>
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
                <th className="py-2.5 px-4">الحساب</th>
                <th className="py-2.5 px-4">الجهاز / المتصفح</th>
                <th className="py-2.5 px-4">بدأت في</th>
                <th className="py-2.5 px-4">تنتهي في</th>
                <th className="py-2.5 px-4 text-left">إنهاء</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {data.activeSessions.map((sess) => {
                const key = `sess-${sess.id}`;
                return (
                  <tr
                    key={sess.id}
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-extrabold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {sess.userName}
                        </span>
                        {sess.userRole === "admin" && (
                          <span
                            className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                            style={{
                              background: "var(--accent-warm-soft)",
                              color: "var(--accent-warm-text)",
                            }}
                          >
                            ADMIN
                          </span>
                        )}
                        {sess.isCurrent && (
                          <span
                            className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                            style={{
                              background: "var(--success-soft)",
                              color: "var(--success-fg)",
                            }}
                          >
                            جلستك الحالية
                          </span>
                        )}
                      </div>
                      <div
                        dir="ltr"
                        className="font-mono-code text-[11px] text-right"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {sess.userEmail}
                      </div>
                    </td>
                    <td
                      className="py-2.5 px-4 text-[12px] font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                      title={sess.userAgent ?? ""}
                    >
                      {summarizeUserAgent(sess.userAgent)}
                    </td>
                    <td
                      className="py-2.5 px-4 text-[11.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatArabicDateTime(sess.createdAt)}
                    </td>
                    <td
                      className="py-2.5 px-4 text-[11.5px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatArabicDateTime(sess.expiresAt)}
                    </td>
                    <td className="py-2.5 px-4 text-left">
                      {sess.isCurrent ? (
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          نشطة الآن
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={busyKey === key}
                          onClick={() =>
                            void runSystemAction(
                              key,
                              { action: "revoke_session", sessionId: sess.id },
                              `تم إنهاء جلسة ${sess.userName}`
                            )
                          }
                          className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                          style={{
                            background: "var(--danger-soft)",
                            color: "var(--danger-fg)",
                          }}
                        >
                          <LogOut className="w-3 h-3" />
                          <span>إنهاء</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
