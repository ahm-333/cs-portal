"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  FlaskConical,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import type {
  Course,
  LessonInteractive,
  LessonInteractiveMeta,
} from "@/types/database";

interface CourseInteractiveLabProps {
  course: Course;
  interactives: LessonInteractiveMeta[];
}

type InteractiveApiPayload =
  | LessonInteractive
  | { interactive: LessonInteractive }
  | { data: LessonInteractive }
  | { error: string };

const BS_ARR = [4, 9, 14, 19, 23, 31, 42] as const;

interface BinarySearchStep {
  low: number;
  high: number;
  mid: number;
  found: boolean;
  msg: string;
}

const BS_SCENARIOS: Record<number, BinarySearchStep[]> = {
  14: [
    {
      low: 0,
      high: 6,
      mid: 3,
      found: false,
      msg: "الخطوة 1: نفحص الوسط Index 3 (القيمة 19). بما إن 14 أصغر من 19، نستبعد النصف الأيمن بالكامل.",
    },
    {
      low: 0,
      high: 2,
      mid: 1,
      found: false,
      msg: "الخطوة 2: النطاق الجديد [0..2] والوسط Index 1 (القيمة 9). بما إن 14 أكبر من 9، نتجه لليمين.",
    },
    {
      low: 2,
      high: 2,
      mid: 2,
      found: true,
      msg: "الخطوة 3: تم إيجاد 14 في Index 2 خلال 3 مقارنات فقط!",
    },
  ],
  23: [
    {
      low: 0,
      high: 6,
      mid: 3,
      found: false,
      msg: "الخطوة 1: نفحص الوسط Index 3 (القيمة 19). بما إن 23 أكبر من 19، نستبعد النصف الأيسر بالكامل.",
    },
    {
      low: 4,
      high: 6,
      mid: 5,
      found: false,
      msg: "الخطوة 2: النطاق الجديد [4..6] والوسط Index 5 (القيمة 31). بما إن 23 أصغر من 31، نتجه لليسار.",
    },
    {
      low: 4,
      high: 4,
      mid: 4,
      found: true,
      msg: "الخطوة 3: تم العثور على 23 في Index 4 خلال 3 خطوات بدل 5 في البحث الخطي!",
    },
  ],
  31: [
    {
      low: 0,
      high: 6,
      mid: 3,
      found: false,
      msg: "فحص الوسط Index 3 (القيمة 19): 31 أكبر → نستبعد النصف الأيسر بالكامل.",
    },
    {
      low: 4,
      high: 6,
      mid: 5,
      found: true,
      msg: "تم العثور على 31 في Index 5 خلال خطوتين فقط!",
    },
  ],
  42: [
    {
      low: 0,
      high: 6,
      mid: 3,
      found: false,
      msg: "الخطوة 1: نفحص الوسط Index 3 (القيمة 19). الرقم 42 أكبر، فنستبعد النصف الأيسر فوراً.",
    },
    {
      low: 4,
      high: 6,
      mid: 5,
      found: false,
      msg: "الخطوة 2: الوسط الجديد Index 5 (القيمة 31). الرقم 42 أكبر من 31، نتجه للنطاق [6..6].",
    },
    {
      low: 6,
      high: 6,
      mid: 6,
      found: true,
      msg: "الخطوة 3: وجدنا 42 في Index 6 خلال 3 خطوات بدل 7 خطوات!",
    },
  ],
};

function isSafeHttpUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

function isLessonInteractive(value: unknown): value is LessonInteractive {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    (record.source_type === "html_code" ||
      record.source_type === "external_url")
  );
}

function parseInteractiveResponse(
  payload: InteractiveApiPayload
): LessonInteractive | null {
  if (isLessonInteractive(payload)) {
    return payload;
  }
  if (typeof payload === "object" && payload !== null) {
    if ("interactive" in payload && isLessonInteractive(payload.interactive)) {
      return payload.interactive;
    }
    if ("data" in payload && isLessonInteractive(payload.data)) {
      return payload.data;
    }
  }
  return null;
}

export default function CourseInteractiveLab({
  course,
  interactives,
}: CourseInteractiveLabProps) {
  // --- Built-in Simulator State ---
  const [dsNodes, setDsNodes] = useState<number[]>([14, 29, 42]);
  const [dsCounter, setDsCounter] = useState(0);

  const [bsTarget, setBsTarget] = useState<number>(31);
  const [bsStep, setBsStep] = useState<number>(0);

  const [osMode, setOsMode] = useState<"fcfs" | "sjf">("fcfs");

  // --- Lazy-loaded HTML Lab State ---
  const sortedLabs = useMemo(
    () => [...interactives].sort((a, b) => a.order_index - b.order_index),
    [interactives]
  );

  const [selectedLabId, setSelectedLabId] = useState<string>(
    sortedLabs[0]?.id ?? ""
  );
  const [labCache, setLabCache] = useState<Record<string, LessonInteractive>>(
    {}
  );
  const [labErrors, setLabErrors] = useState<Record<string, string>>({});
  const [retryTick, setRetryTick] = useState(0);
  const [iframeResetKey, setIframeResetKey] = useState(0);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);
  const sandboxRef = useRef<HTMLDivElement | null>(null);

  const activeLab = useMemo(
    () => sortedLabs.find((lab) => lab.id === selectedLabId) ?? sortedLabs[0],
    [sortedLabs, selectedLabId]
  );

  const activeLabId = activeLab?.id ?? "";
  const isCached = Boolean(activeLabId && labCache[activeLabId]);
  const activeError = activeLabId ? labErrors[activeLabId] : undefined;
  const isFullscreen = isNativeFullscreen || isFallbackFullscreen;

  // Strictly lazy-load HTML lab via GET /api/interactives/[id] only when this component is mounted
  useEffect(() => {
    if (!activeLabId || isCached || activeError) return;

    const controller = new AbortController();

    async function fetchLab() {
      try {
        const res = await fetch(`/api/interactives/${activeLabId}`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("هذا المعمل التفاعلي متاح للمشتركين في المادة فقط.");
          }
          throw new Error("تعذّر تحميل المعمل التفاعلي، حاول مرة أخرى.");
        }
        const payload = (await res.json()) as InteractiveApiPayload;
        const parsed = parseInteractiveResponse(payload);
        if (!parsed) {
          throw new Error("بيانات المعمل التفاعلي غير مكتملة.");
        }
        setLabCache((prev) => ({ ...prev, [activeLabId]: parsed }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const msg =
          err instanceof Error
            ? err.message
            : "حدث خطأ غير متوقع أثناء تحميل المعمل.";
        setLabErrors((prev) => ({ ...prev, [activeLabId]: msg }));
      }
    }

    void fetchLab();
    return () => controller.abort();
  }, [activeLabId, isCached, activeError, retryTick]);

  useEffect(() => {
    function onFsChange() {
      const el = document.fullscreenElement;
      setIsNativeFullscreen(Boolean(el && el === sandboxRef.current));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    if (!isFallbackFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFallbackFullscreen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isFallbackFullscreen]);

  const handleRetryLab = useCallback(() => {
    if (!activeLabId) return;
    setLabErrors((prev) => {
      const next = { ...prev };
      delete next[activeLabId];
      return next;
    });
    setRetryTick((prev) => prev + 1);
  }, [activeLabId]);

  async function toggleFullscreen() {
    if (isFallbackFullscreen) {
      setIsFallbackFullscreen(false);
      return;
    }
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsNativeFullscreen(false);
      }
      return;
    }
    const target = sandboxRef.current;
    if (target && typeof target.requestFullscreen === "function") {
      try {
        await target.requestFullscreen();
        return;
      } catch {
        setIsFallbackFullscreen(true);
        return;
      }
    }
    setIsFallbackFullscreen(true);
  }

  // --- Built-in Simulator Handlers ---
  function handleDsPush() {
    const nextVal = Math.floor(Math.random() * 85) + 10;
    setDsNodes((prev) => {
      const next = [nextVal, ...prev];
      return next.length > 5 ? next.slice(0, 5) : next;
    });
    setDsCounter((c) => c + 1);
  }

  function handleDsPop() {
    setDsNodes((prev) => (prev.length > 1 ? prev.slice(1) : prev));
  }

  function handleDsReset() {
    setDsNodes([14, 29, 42]);
    setDsCounter((c) => c + 1);
  }

  const activeBsSteps = BS_SCENARIOS[bsTarget] ?? BS_SCENARIOS[31];
  const currentBs = activeBsSteps[bsStep % activeBsSteps.length];

  const osBlocks =
    osMode === "sjf"
      ? [
          { p: "P2", w: "22%", t: "0–2", col: "#66c7a6" },
          { p: "P3", w: "30%", t: "2–6", col: "#7ca7f0" },
          { p: "P1", w: "48%", t: "6–14", col: "#e58a62" },
        ]
      : [
          { p: "P1", w: "48%", t: "0–8", col: "#e58a62" },
          { p: "P2", w: "22%", t: "8–10", col: "#66c7a6" },
          { p: "P3", w: "30%", t: "10–14", col: "#7ca7f0" },
        ];

  const loadedLab = activeLab ? labCache[activeLab.id] : undefined;
  const isLabLoading = Boolean(activeLab && !loadedLab && !activeError);
  const iframeHeight = `${Math.max(activeLab?.default_height || 540, 420)}px`;
  const safeExternalUrl = isSafeHttpUrl(
    loadedLab?.external_url ?? activeLab?.external_url
  );

  return (
    <div className="space-y-6">
      {/* 1. Built-in Course-Specific Interactive Simulator (matches #cwPane-lab) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span
              className="text-[11px] font-extrabold"
              style={{ color: "var(--success-fg)" }}
            >
              الشرح التفاعلي العملي
            </span>
            <h3 className="mt-0.5 text-lg font-black text-[var(--text-primary)]">
              {course.lab_title}
            </h3>
          </div>

          {/* Controls by lab_type */}
          <div className="flex flex-wrap items-center gap-2">
            {course.lab_type === "linked-list" ? (
              <>
                <button
                  type="button"
                  onClick={handleDsPush}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-3.5 py-2 text-[12px] font-extrabold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: "#c25e33" }}
                >
                  + Push Head
                </button>
                <button
                  type="button"
                  onClick={handleDsPop}
                  disabled={dsNodes.length <= 1}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-xl border px-3.5 py-2 text-[12px] font-bold transition-colors hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  Pop Head
                </button>
                <button
                  type="button"
                  onClick={handleDsReset}
                  title="إعادة ضبط القائمة"
                  aria-label="إعادة ضبط القائمة"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:opacity-85"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </>
            ) : course.lab_type === "binary-search" ? (
              <>
                <div className="flex items-center gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] p-1">
                  {([14, 23, 31, 42] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setBsTarget(t);
                        setBsStep(0);
                      }}
                      className="font-mono-code inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-lg px-2 py-1 text-[11px] font-bold transition-colors"
                      style={{
                        background:
                          bsTarget === t ? "var(--brand-soft)" : "transparent",
                        color:
                          bsTarget === t
                            ? "var(--brand-soft-text)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setBsStep((prev) => (prev + 1) % activeBsSteps.length)
                  }
                  className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-4 py-2 text-[12px] font-extrabold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: "#c25e33" }}
                >
                  الخطوة التالية ←
                </button>
                <button
                  type="button"
                  onClick={() => setBsStep(0)}
                  title="إعادة من الخطوة الأولى"
                  aria-label="إعادة من الخطوة الأولى"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:opacity-85"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setOsMode("fcfs")}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-3.5 py-2 text-[12px] font-extrabold transition-all"
                  style={
                    osMode === "fcfs"
                      ? { background: "#c25e33", color: "#ffffff" }
                      : {
                          background: "var(--bg-canvas)",
                          border: "1px solid var(--border-soft)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  FCFS
                </button>
                <button
                  type="button"
                  onClick={() => setOsMode("sjf")}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-3.5 py-2 text-[12px] font-extrabold transition-all"
                  style={
                    osMode === "sjf"
                      ? { background: "#1d6b52", color: "#ffffff" }
                      : {
                          background: "var(--bg-canvas)",
                          border: "1px solid var(--border-soft)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  SJF (Optimal)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dark Interactive Stage */}
        <div className="space-y-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e1726] p-4 text-white sm:p-5">
          {course.lab_type === "linked-list" ? (
            <>
              <div
                dir="ltr"
                className="flex flex-wrap items-center justify-center gap-2 py-4 sm:gap-2.5 sm:py-5"
              >
                <span className="font-mono-code rounded-xl border border-[#e58a62] bg-[#c25e33]/30 px-2.5 py-1.5 text-[11.5px] font-bold text-[#fed7aa] sm:px-3 sm:text-[12px]">
                  HEAD
                </span>
                {dsNodes.map((val, idx) => (
                  <div
                    key={`${dsCounter}-${idx}-${val}`}
                    className="inline-flex items-center gap-2 sm:gap-2.5"
                  >
                    <span className="font-mono-code font-bold text-[#66c7a6]">
                      →
                    </span>
                    <span
                      className={`node-pop font-mono-code rounded-xl border px-3.5 py-1.5 text-[12.5px] font-bold sm:px-4 sm:py-2 sm:text-[13px] ${
                        idx === 0
                          ? "border-[#66c7a6] bg-[#66c7a6]/25 text-[#a7f3d0]"
                          : "border-white/15 bg-white/10 text-white"
                      }`}
                    >
                      {val}
                    </span>
                  </div>
                ))}
                <span className="font-mono-code text-[12px] font-bold text-slate-400">
                  → NULL
                </span>
              </div>
              <div
                dir="ltr"
                className="font-mono-code text-center text-[11.5px] text-slate-300"
              >
                Size: {dsNodes.length} · Operation Cost: O(1)
              </div>
            </>
          ) : course.lab_type === "binary-search" ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-slate-300">
                <span>
                  الهدف المطلوب:{" "}
                  <strong className="font-mono-code text-[#66c7a6]">
                    target = {bsTarget}
                  </strong>
                </span>
                <span className="font-mono-code text-slate-400" dir="ltr">
                  Step {(bsStep % activeBsSteps.length) + 1}/
                  {activeBsSteps.length} · Range [{currentBs.low}..
                  {currentBs.high}]
                </span>
              </div>
              <div dir="ltr" className="grid grid-cols-7 gap-1 py-2 sm:gap-1.5">
                {BS_ARR.map((val, idx) => {
                  const out = idx < currentBs.low || idx > currentBs.high;
                  const isMid = idx === currentBs.mid;
                  const cls = out
                    ? "bg-white/[0.03] border-white/5 text-slate-500 opacity-40"
                    : isMid
                      ? "bg-[#66c7a6]/25 border-[#66c7a6] text-[#a7f3d0] scale-[1.03] sm:scale-105"
                      : "bg-white/10 border-white/15 text-white";
                  return (
                    <div
                      key={idx}
                      className={`min-w-0 overflow-hidden rounded-lg border px-0.5 py-2 text-center transition-all sm:rounded-xl sm:px-1.5 sm:py-2.5 ${cls}`}
                    >
                      <div className="font-mono-code text-[11.5px] font-bold leading-tight sm:text-[13px]">
                        {val}
                      </div>
                      <div className="font-mono-code mt-0.5 truncate text-[8.5px] leading-tight opacity-80 sm:text-[9.5px]">
                        {isMid ? (currentBs.found ? "FOUND" : "MID") : `[${idx}]`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-xl bg-white/[0.06] p-3 text-[12.5px] leading-relaxed text-slate-200">
                {currentBs.msg}
              </div>
            </>
          ) : (
            <div dir="ltr" className="space-y-3 py-2">
              <div className="flex h-14 w-full overflow-hidden rounded-xl border border-white/15">
                {osBlocks.map((b) => (
                  <div
                    key={`${osMode}-${b.p}`}
                    style={{ width: b.w, background: b.col, color: "#0f172a" }}
                    className="font-mono-code flex min-w-0 flex-col items-center justify-center overflow-hidden border-r border-black/20 px-1 text-[11.5px] font-black transition-all duration-300 sm:text-[12px]"
                  >
                    <span className="truncate">{b.p}</span>
                    <span className="truncate text-[9.5px] opacity-85 sm:text-[10px]">
                      {b.t}ms
                    </span>
                  </div>
                ))}
              </div>
              <div className="font-mono-code flex flex-wrap items-center gap-2 text-[10.5px] text-slate-300">
                <span className="rounded-md bg-white/10 px-2 py-0.5">
                  P1 Burst: 8ms
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5">
                  P2 Burst: 2ms
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5">
                  P3 Burst: 4ms
                </span>
              </div>
              <div className="font-mono-code flex flex-wrap items-center justify-between gap-2 px-1 text-[12px] text-slate-200">
                <span>Algorithm: {osMode === "sjf" ? "SJF" : "FCFS"}</span>
                <span
                  className={`font-bold ${
                    osMode === "sjf" ? "text-[#66c7a6]" : "text-[#f0a786]"
                  }`}
                >
                  Avg Waiting Time:{" "}
                  {osMode === "sjf" ? "2.67 ms ✓" : "6.00 ms"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hint Box */}
        <div
          className="rounded-xl p-3.5 text-[13px] leading-relaxed"
          style={{
            background: "var(--bg-canvas)",
            color: "var(--text-secondary)",
          }}
        >
          {course.lab_hint}
        </div>
      </div>

      {/* 2. Lazy-Loaded Sandboxed HTML Lab(s) via GET /api/interactives/[id] */}
      {sortedLabs.length > 0 && activeLab ? (
        <div className="space-y-3 border-t border-[var(--border-soft)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span
                className="text-[11px] font-extrabold"
                style={{ color: "var(--brand-primary)" }}
              >
                معمل HTML تفاعلي متقدم (معزول وآمن)
              </span>
              <h4 className="mt-0.5 text-[15px] font-black text-[var(--text-primary)]">
                {activeLab.title}
              </h4>
            </div>

            {sortedLabs.length > 1 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {sortedLabs.map((lab, idx) => {
                  const selected = lab.id === activeLab.id;
                  return (
                    <button
                      key={lab.id}
                      type="button"
                      onClick={() => {
                        setSelectedLabId(lab.id);
                        setIframeResetKey(0);
                      }}
                      className="rounded-xl border px-3 py-1 text-[11.5px] font-bold transition-colors"
                      style={{
                        background: selected
                          ? "var(--brand-soft)"
                          : "var(--bg-canvas)",
                        borderColor: selected
                          ? "var(--brand-primary)"
                          : "var(--border-soft)",
                        color: selected
                          ? "var(--brand-soft-text)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {idx + 1}. {lab.title}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div
            ref={sandboxRef}
            className={
              isFallbackFullscreen
                ? "fixed inset-0 z-50 flex flex-col bg-[var(--bg-canvas)]"
                : isNativeFullscreen
                  ? "flex h-screen w-screen flex-col bg-[var(--bg-canvas)]"
                  : "overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)]"
            }
          >
            {/* Lab Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-soft)] bg-[var(--bg-canvas)] px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <FlaskConical
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--accent-warm)" }}
                />
                <span className="truncate text-[12px] font-bold text-[var(--text-secondary)]">
                  {activeLab.description ?? activeLab.title}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {activeLab.source_type === "external_url" && safeExternalUrl ? (
                  <a
                    href={safeExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--text-primary)] hover:opacity-85"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>فتح خارجياً</span>
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={() => setIframeResetKey((k) => k + 1)}
                  disabled={isLabLoading || !loadedLab}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--text-primary)] hover:opacity-85 disabled:opacity-45"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>إعادة تشغيل</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-xl border px-2.5 py-1 text-[11.5px] font-bold transition-colors hover:opacity-90"
                  style={{
                    background: "var(--brand-soft)",
                    borderColor: "transparent",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5" />
                      <span>إنهاء ملء الشاشة</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>ملء الشاشة</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sandbox Stage */}
            <div
              className={`relative w-full bg-[#020617] ${
                isFullscreen ? "flex-1" : ""
              }`}
            >
              {isLabLoading ? (
                <div
                  className="flex flex-col items-center justify-center gap-2.5 p-8 text-center"
                  style={{ height: isFullscreen ? "100%" : "360px" }}
                >
                  <Loader2 className="h-7 w-7 animate-spin text-[#e58a62]" />
                  <p className="text-sm font-bold text-white">
                    جاري تحميل المعمل التفاعلي...
                  </p>
                  <p className="text-xs text-slate-400">
                    يتم تحميله عند الطلب فقط للحفاظ على سرعة التصفح
                  </p>
                </div>
              ) : activeError ? (
                <div
                  className="flex flex-col items-center justify-center gap-3 p-8 text-center"
                  style={{ height: isFullscreen ? "100%" : "280px" }}
                >
                  <AlertTriangle className="h-7 w-7 text-[#e58a62]" />
                  <p className="max-w-md text-sm font-bold text-white">
                    {activeError}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetryLab}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#c25e33] px-4 py-2 text-xs font-extrabold text-white"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>إعادة المحاولة</span>
                  </button>
                </div>
              ) : loadedLab ? (
                loadedLab.source_type === "html_code" ? (
                  <iframe
                    key={`${loadedLab.id}-${iframeResetKey}`}
                    srcDoc={loadedLab.html_content ?? ""}
                    title={loadedLab.title}
                    sandbox="allow-scripts"
                    className={`block w-full border-0 bg-[#020617] ${
                      isFullscreen ? "h-full" : "min-h-[420px] sm:min-h-[540px]"
                    }`}
                    style={
                      isFullscreen
                        ? { height: "100%" }
                        : activeLab.default_height
                          ? { height: iframeHeight }
                          : undefined
                    }
                  />
                ) : safeExternalUrl ? (
                  <iframe
                    key={`${loadedLab.id}-${iframeResetKey}`}
                    src={safeExternalUrl}
                    title={loadedLab.title}
                    sandbox="allow-scripts"
                    referrerPolicy="no-referrer"
                    className={`block w-full border-0 bg-[var(--bg-surface)] ${
                      isFullscreen ? "h-full" : "min-h-[420px] sm:min-h-[540px]"
                    }`}
                    style={
                      isFullscreen
                        ? { height: "100%" }
                        : activeLab.default_height
                          ? { height: iframeHeight }
                          : undefined
                    }
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-300">
                    رابط المعمل الخارجي غير صالح أو غير متاح.
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
