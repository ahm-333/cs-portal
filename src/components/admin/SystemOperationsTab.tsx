"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  CreditCard,
  Database,
  Loader2,
  LogOut,
  Megaphone,
  MonitorSmartphone,
  RefreshCw,
  RotateCcw,
  Save,
  Shield,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { emitToast } from "@/lib/stores/events";
import {
  formatArabicDateTime,
  type AdminSiteSettings,
  type AdminSystemData,
} from "@/components/admin/adminTypes";

export interface SystemOperationsTabProps {
  onStatsChanged: () => void;
  onDbLatency?: (ms: number) => void;
}

const DEFAULT_SETTINGS: AdminSiteSettings = {
  maxDevicesPerUser: 2,
  enforceSingleSession: true,
  aiDailyLimit: 25,
  registrationOpen: true,
  announcementEnabled: false,
  announcementText: "",
  announcementAudience: "all",
  vodafoneCashNumber: "01000000000",
  instaPayHandle: "ahmed.amir@instapay",
};

const AUDIENCE_OPTIONS = [
  { value: "all", label: "كل الفرق" },
  { value: "1", label: "ف1" },
  { value: "2", label: "ف2" },
  { value: "3", label: "ف3" },
  { value: "4", label: "ف4" },
] as const;

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
  onDbLatency,
}: SystemOperationsTabProps) {
  const [data, setData] = useState<AdminSystemData | null>(null);
  const [settings, setSettings] = useState<AdminSiteSettings>(DEFAULT_SETTINGS);
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
        const [sysRes, setRes] = await Promise.all([
          fetch("/api/admin/system", { cache: "no-store" }),
          fetch("/api/admin/settings", { cache: "no-store" }),
        ]);

        const sysJson = (await sysRes.json()) as AdminSystemData & {
          error?: string;
        };
        if (!active) return;
        if (!sysRes.ok) {
          throw new Error(sysJson.error || "تعذر تحميل حالة النظام.");
        }
        setData(sysJson);
        onDbLatency?.(sysJson.dbLatencyMs);

        if (setRes.ok) {
          const setJson = (await setRes.json()) as
            | (AdminSiteSettings & { settings?: AdminSiteSettings })
            | { settings: AdminSiteSettings };
          const resolved =
            "settings" in setJson && setJson.settings
              ? setJson.settings
              : (setJson as AdminSiteSettings);
          if (resolved && typeof resolved.maxDevicesPerUser === "number") {
            setSettings({
              ...DEFAULT_SETTINGS,
              ...resolved,
            });
          }
        }
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "تعذر تحميل حالة النظام."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshTick, onDbLatency]);

  async function saveSettings(
    sectionKey: string,
    patch: Partial<AdminSiteSettings>,
    successMsg: string
  ) {
    const merged: AdminSiteSettings = {
      ...settings,
      ...patch,
    };
    setBusyKey(sectionKey);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        settings?: AdminSiteSettings;
        error?: string;
      };
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "تعذر حفظ الإعدادات.");
      }
      setSettings(json.settings ? { ...merged, ...json.settings } : merged);
      emitToast(successMsg);
      onStatsChanged();
    } catch (err) {
      emitToast(err instanceof Error ? err.message : "تعذر حفظ الإعدادات.");
    } finally {
      setBusyKey(null);
    }
  }

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
      detail: data.envStatus.databaseUrlUnpooled ? "جاهز" : "غير مضبوط",
    },
    {
      label: "Google OAuth 2.0",
      ok: data.envStatus.googleOAuth,
      detail: data.envStatus.googleOAuth ? "مفعّل" : "غير مضبوط",
    },
    {
      label: "Gemini AI Tutor",
      ok: data.envStatus.geminiApiKey,
      detail: `${data.envStatus.geminiModel} · حد يومي ${settings.aiDailyLimit}`,
    },
    {
      label: "Bunny Stream CDN Host",
      ok: data.envStatus.bunnyCdnHost,
      detail: data.envStatus.bunnyCdnHost ? "مفعّل" : "اختياري",
    },
    {
      label: "Bunny Stream Token Key",
      ok: data.envStatus.bunnyTokenKey,
      detail: data.envStatus.bunnyTokenKey ? "مفعّل" : "اختياري",
    },
    {
      label: "Protected HLS Signing Secret",
      ok: data.envStatus.hlsSigningSecret,
      detail: data.envStatus.hlsSigningSecret ? "مفعّل" : "اختياري",
    },
  ];

  const tableStats = [
    { label: "المستخدمون", count: data.tableCounts.users },
    { label: "الجلسات النشطة", count: data.tableCounts.activeSessions },
    { label: "الجلسات المنتهية", count: data.tableCounts.expiredSessions },
    { label: "الاشتراكات", count: data.tableCounts.enrollments },
    { label: "سجل التقدم", count: data.tableCounts.userProgress },
    { label: "الملاحظات", count: data.tableCounts.userNotes },
    { label: "بنك الأخطاء", count: data.tableCounts.userMistakes },
    { label: "سجلات AI", count: data.tableCounts.aiChatUsage },
  ];

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE POLICIES & PAYMENT INFO (2-col grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Security & Device Policies Card */}
        <section className="xl:col-span-6 surface-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Shield className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2
                  className="text-base font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  سياسات الأمان والأجهزة والذكاء الاصطناعي
                </h2>
                <p
                  className="text-[11.5px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  تُطبق فوراً على جميع عمليات تسجيل الدخول وحماية الحسابات.
                </p>
              </div>
            </div>

            {/* Max Devices Selector */}
            <div
              className="rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-3"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div>
                <div
                  className="text-[13px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  الحد الأقصى للأجهزة لكل طالب
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  عند تجاوزه يتم حظر الدخول وإرسال تنبيه فوري للأدمن
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        maxDevicesPerUser: num,
                      }))
                    }
                    className={`filter-pill min-w-[40px] min-h-[36px] rounded-xl font-mono-code text-[13px] font-black cursor-pointer ${
                      settings.maxDevicesPerUser === num ? "active" : ""
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Single Session Switch */}
            <div
              className="rounded-2xl border p-3.5 flex items-center justify-between gap-3"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div>
                <div
                  className="text-[13px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  منع تشغيل جهازين في نفس اللحظة
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  تسجيل الدخول من جهاز جديد يخرج الجلسة المفتوحة تلقائياً
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.enforceSingleSession}
                aria-label="منع تشغيل جهازين في نفس اللحظة"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    enforceSingleSession: !prev.enforceSingleSession,
                  }))
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0"
                style={{
                  background: settings.enforceSingleSession
                    ? "var(--success-fg)"
                    : "var(--bg-subtle)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <span
                  className="inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform"
                  style={{
                    transform: settings.enforceSingleSession
                      ? "translateX(-22px)"
                      : "translateX(-2px)",
                  }}
                />
              </button>
            </div>

            {/* Registration Open Switch + AI Limit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className="rounded-2xl border p-3.5 flex items-center justify-between gap-2"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div>
                  <div
                    className="text-[12.5px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    فتح تسجيل حسابات جديدة
                  </div>
                  <div
                    className="text-[10.5px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {settings.registrationOpen ? "متاح للطلاب" : "مغلق مؤقتاً"}
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.registrationOpen}
                  aria-label="فتح تسجيل حسابات جديدة"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      registrationOpen: !prev.registrationOpen,
                    }))
                  }
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0"
                  style={{
                    background: settings.registrationOpen
                      ? "var(--success-fg)"
                      : "var(--bg-subtle)",
                    border: "1px solid var(--border-soft)",
                  }}
                >
                  <span
                    className="inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform"
                    style={{
                      transform: settings.registrationOpen
                        ? "translateX(-22px)"
                        : "translateX(-2px)",
                    }}
                  />
                </button>
              </div>

              <div
                className="rounded-2xl border p-3.5 flex items-center justify-between gap-2"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <label
                  htmlFor="aiDailyLimitInput"
                  className="text-[12.5px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  حد AI اليومي للطالب
                </label>
                <input
                  id="aiDailyLimitInput"
                  type="number"
                  min={1}
                  max={500}
                  dir="ltr"
                  value={settings.aiDailyLimit}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      aiDailyLimit: Math.max(
                        1,
                        Number.parseInt(e.target.value || "1", 10) || 1
                      ),
                    }))
                  }
                  className="font-mono-code w-20 min-h-[36px] px-2.5 py-1 rounded-xl border text-[13px] font-extrabold text-center outline-none"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={busyKey === "save-policies"}
            onClick={() =>
              void saveSettings(
                "save-policies",
                {
                  maxDevicesPerUser: settings.maxDevicesPerUser,
                  enforceSingleSession: settings.enforceSingleSession,
                  registrationOpen: settings.registrationOpen,
                  aiDailyLimit: settings.aiDailyLimit,
                },
                "تم حفظ سياسات الأمان والذكاء الاصطناعي ✓"
              )
            }
            className="w-full min-h-[42px] py-2 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 disabled:opacity-60"
            style={{ background: "var(--hero-bg)" }}
          >
            {busyKey === "save-policies" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>حفظ سياسات الأمان ✓</span>
          </button>
        </section>

        {/* Payment Info Card + Global Broadcast Card */}
        <div className="xl:col-span-6 space-y-5">
          {/* Payment Info Card */}
          <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <CreditCard className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2
                  className="text-base font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  بيانات التحويل والدفع للطلاب
                </h2>
                <p
                  className="text-[11.5px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  تظهر تلقائياً في نافذة الاشتراك لكل طالب عند اختيار فودافون كاش أو InstaPay.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="vfCashInput"
                  className="block text-[12px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  رقم فودافون كاش
                </label>
                <input
                  id="vfCashInput"
                  type="text"
                  dir="ltr"
                  value={settings.vodafoneCashNumber}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      vodafoneCashNumber: e.target.value,
                    }))
                  }
                  placeholder="010XXXXXXXX"
                  className="font-mono-code w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-bold outline-none"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="instaPayInput"
                  className="block text-[12px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  عنوان InstaPay
                </label>
                <input
                  id="instaPayInput"
                  type="text"
                  dir="ltr"
                  value={settings.instaPayHandle}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      instaPayHandle: e.target.value,
                    }))
                  }
                  placeholder="name@instapay"
                  className="font-mono-code w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-[13px] font-bold outline-none"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={busyKey === "save-payment"}
              onClick={() =>
                void saveSettings(
                  "save-payment",
                  {
                    vodafoneCashNumber: settings.vodafoneCashNumber.trim(),
                    instaPayHandle: settings.instaPayHandle.trim(),
                  },
                  "تم تحديث بيانات الدفع بنجاح ✓"
                )
              }
              className="w-full min-h-[40px] py-2 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 disabled:opacity-60"
              style={{ background: "var(--accent-warm)" }}
            >
              {busyKey === "save-payment" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>حفظ بيانات الدفع ✓</span>
            </button>
          </section>

          {/* Global Broadcast Announcement Banner Card */}
          <section className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  <Megaphone className="w-4.5 h-4.5" />
                </span>
                <div>
                  <h2
                    className="text-base font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    شريط الإعلانات العام للطلاب
                  </h2>
                  <p
                    className="text-[11.5px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    نشر تنبيه فوري أعلى المنصة لكل الطلاب أو لفرقة محددة.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.announcementEnabled}
                aria-label="تفعيل شريط الإعلانات"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    announcementEnabled: !prev.announcementEnabled,
                  }))
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0"
                style={{
                  background: settings.announcementEnabled
                    ? "var(--success-fg)"
                    : "var(--bg-subtle)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <span
                  className="inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform"
                  style={{
                    transform: settings.announcementEnabled
                      ? "translateX(-22px)"
                      : "translateX(-2px)",
                  }}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="text-[11.5px] font-bold ml-1"
                style={{ color: "var(--text-muted)" }}
              >
                الفئة المستهدفة:
              </span>
              {AUDIENCE_OPTIONS.map((aud) => (
                <button
                  key={aud.value}
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      announcementAudience: aud.value,
                    }))
                  }
                  className={`filter-pill min-h-[32px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold cursor-pointer ${
                    settings.announcementAudience === aud.value ? "active" : ""
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={settings.announcementText}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  announcementText: e.target.value,
                }))
              }
              placeholder="مثال: تم رفع محاضرة المراجعة النهائية لمادة شبكات الحاسب — بالتوفيق للجميع!"
              className="w-full px-3.5 py-2.5 rounded-2xl border text-[13px] font-semibold outline-none resize-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />

            <button
              type="button"
              disabled={busyKey === "save-broadcast"}
              onClick={() =>
                void saveSettings(
                  "save-broadcast",
                  {
                    announcementEnabled: settings.announcementEnabled,
                    announcementAudience: settings.announcementAudience,
                    announcementText: settings.announcementText.trim(),
                  },
                  settings.announcementEnabled
                    ? "تم حفظ ونشر الإعلان للطلاب ✓"
                    : "تم حفظ إعدادات الإعلان (موقوف حالياً)"
                )
              }
              className="w-full min-h-[40px] py-2 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 disabled:opacity-60"
              style={{ background: "var(--success-fg)" }}
            >
              {busyKey === "save-broadcast" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Megaphone className="w-4 h-4" />
              )}
              <span>حفظ ونشر ✓</span>
            </button>
          </section>
        </div>
      </div>

      {/* 2. Neon DB Health + Environment Checklist */}
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                حالة التكاملات والبيئة
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
                className="rounded-2xl border px-3.5 py-2 flex items-center justify-between gap-2"
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

      {/* 3. AI Usage Monitor */}
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
                  <th className="py-2.5 px-4">التاريخ</th>
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
                      (entry.requestCount /
                        Math.max(1, data.aiUsage.dailyLimit)) *
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

      {/* 4. Active Sessions Table */}
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
                الجلسات النشطة الآن ({data.activeSessions.length})
              </h2>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                أنهِ أي جلسة مشبوهة أو نظّف الجلسات المنتهية فوراً.
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
                      <span dir="ltr" className="font-en">
                        {sess.deviceName || summarizeUserAgent(sess.userAgent)}
                      </span>
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
