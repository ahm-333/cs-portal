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
  LessonInteractive,
  LessonInteractiveMeta,
} from "@/types/database";

interface InteractiveViewerProps {
  interactives: LessonInteractiveMeta[];
}

type InteractiveApiPayload =
  | LessonInteractive
  | { interactive: LessonInteractive }
  | { data: LessonInteractive }
  | { error: string };

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

function toSafeHttpUrl(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    const parsed = new URL(raw.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}

export default function InteractiveViewer({
  interactives,
}: InteractiveViewerProps) {
  const sortedLabs = useMemo(
    () => [...interactives].sort((a, b) => a.order_index - b.order_index),
    [interactives]
  );

  const [selectedId, setSelectedId] = useState<string>(
    sortedLabs[0]?.id ?? ""
  );
  const [cache, setCache] = useState<Record<string, LessonInteractive>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [retryCount, setRetryCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeLab = useMemo(
    () => sortedLabs.find((lab) => lab.id === selectedId) ?? sortedLabs[0],
    [sortedLabs, selectedId]
  );

  const activeLabId = activeLab?.id ?? "";
  const isCached = Boolean(activeLabId && cache[activeLabId]);
  const activeError = activeLabId ? errorMap[activeLabId] : undefined;
  const isFullscreen = isNativeFullscreen || isFallbackFullscreen;

  // Lazy-load the selected lab on demand only when mounted & not cached
  useEffect(() => {
    if (!activeLabId || isCached || activeError) return;

    const controller = new AbortController();

    async function loadInteractive() {
      try {
        const response = await fetch(`/api/interactives/${activeLabId}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("هذا المعمل التفاعلي متاح للمشتركين في المادة فقط.");
          }
          throw new Error("تعذّر تحميل المعمل التفاعلي، حاول مرة أخرى.");
        }

        const payload = (await response.json()) as InteractiveApiPayload;
        const parsed = parseInteractiveResponse(payload);

        if (!parsed) {
          throw new Error("بيانات المعمل التفاعلي غير مكتملة.");
        }

        setCache((prev) => ({
          ...prev,
          [activeLabId]: parsed,
        }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "حدث خطأ غير متوقع أثناء تحميل المعمل.";
        setErrorMap((prev) => ({
          ...prev,
          [activeLabId]: message,
        }));
      }
    }

    void loadInteractive();

    return () => {
      controller.abort();
    };
  }, [activeLabId, isCached, activeError, retryCount]);

  // Keep native fullscreen state synced when user presses Esc
  useEffect(() => {
    function handleFullscreenChange() {
      const currentEl = document.fullscreenElement;
      setIsNativeFullscreen(
        Boolean(currentEl && currentEl === containerRef.current)
      );
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Lock body scroll & support Escape key during fixed-overlay fullscreen fallback (mobile / iOS)
  useEffect(() => {
    if (!isFallbackFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFallbackFullscreen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFallbackFullscreen]);

  const handleRetry = useCallback(() => {
    if (!activeLabId) return;
    setErrorMap((prev) => {
      const next = { ...prev };
      delete next[activeLabId];
      return next;
    });
    setRetryCount((prev) => prev + 1);
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

    const target = containerRef.current;
    if (target && typeof target.requestFullscreen === "function") {
      try {
        await target.requestFullscreen();
        return;
      } catch {
        // Fallback cleanly to fixed full-viewport overlay (common on iOS Safari)
        setIsFallbackFullscreen(true);
        return;
      }
    }

    setIsFallbackFullscreen(true);
  }

  function handleReset() {
    setResetKey((prev) => prev + 1);
  }

  if (sortedLabs.length === 0 || !activeLab) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-500">
          <FlaskConical className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">
          لا توجد معامل تفاعلية لهذا الدرس حالياً
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          المعامل التفاعلية تساعدك على محاكاة الخوارزميات وهياكل البيانات خطوة
          بخطوة.
        </p>
      </div>
    );
  }

  const loadedLab = cache[activeLab.id];
  const isLoading = !loadedLab && !activeError;
  const iframeHeight = `${Math.max(activeLab.default_height || 560, 420)}px`;
  const resolvedExternalUrl = toSafeHttpUrl(
    loadedLab?.external_url ?? activeLab.external_url
  );

  return (
    <div className="space-y-4">
      {/* Multiple labs pill selector */}
      {sortedLabs.length > 1 ? (
        <div
          role="tablist"
          aria-label="اختيار المعمل التفاعلي"
          className="flex flex-wrap items-center gap-2"
        >
          {sortedLabs.map((lab, idx) => {
            const isSelected = lab.id === activeLab.id;
            return (
              <button
                key={lab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedId(lab.id);
                  setResetKey(0);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isSelected
                    ? "border-indigo-500/60 bg-indigo-500/15 text-indigo-200 shadow-sm"
                    : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-100"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950/70 text-[11px] font-bold text-indigo-300">
                  {idx + 1}
                </span>
                <span>{lab.title}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Interactive sandbox container */}
      <div
        ref={containerRef}
        className={
          isFallbackFullscreen
            ? "fixed inset-0 z-50 flex flex-col bg-slate-950"
            : isNativeFullscreen
              ? "flex h-screen w-screen flex-col bg-slate-950"
              : "overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/40"
        }
      >
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/95 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-100">
                {activeLab.title}
              </h3>
              {activeLab.description ? (
                <p className="truncate text-xs text-slate-400">
                  {activeLab.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeLab.source_type === "external_url" && resolvedExternalUrl ? (
              <a
                href={resolvedExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-indigo-500/50 hover:text-indigo-200"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>فتح في نافذة جديدة</span>
              </a>
            ) : null}

            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading || !loadedLab}
              title="إعادة تشغيل المعمل"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-indigo-500/50 hover:bg-slate-800 hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>إعادة تشغيل</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/25"
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

        {/* Body */}
        <div
          className={`relative w-full bg-slate-950 ${
            isFullscreen ? "flex-1" : ""
          }`}
        >
          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center gap-3 p-8 text-center"
              style={{ height: isFullscreen ? "100%" : iframeHeight }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
              <p className="text-sm font-semibold text-slate-300">
                جاري تحميل المعمل التفاعلي...
              </p>
              <p className="text-xs text-slate-500">
                يتم تحميل المعمل عند الطلب فقط للحفاظ على سرعة التصفح
              </p>
            </div>
          ) : activeError ? (
            <div
              className="flex flex-col items-center justify-center gap-3 p-8 text-center"
              style={{ height: isFullscreen ? "100%" : "320px" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="max-w-md text-sm font-semibold text-slate-200">
                {activeError}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-4 py-2 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/25"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          ) : loadedLab ? (
            loadedLab.source_type === "html_code" ? (
              <iframe
                key={`${loadedLab.id}-${resetKey}`}
                srcDoc={loadedLab.html_content ?? ""}
                title={loadedLab.title}
                sandbox="allow-scripts"
                className="block w-full border-0 bg-slate-950"
                style={{
                  height: isFullscreen ? "100%" : iframeHeight,
                }}
              />
            ) : resolvedExternalUrl ? (
              <iframe
                key={`${loadedLab.id}-${resetKey}`}
                src={resolvedExternalUrl}
                title={loadedLab.title}
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
                className="block w-full border-0 bg-slate-950"
                style={{
                  height: isFullscreen ? "100%" : iframeHeight,
                }}
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                لم يتم تعيين رابط خارجي لهذا المعمل بعد.
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
