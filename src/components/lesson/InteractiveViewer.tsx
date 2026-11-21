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
      <div className="studio-card flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--signal-soft)] text-[var(--signal)]">
          <FlaskConical className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[var(--ink)]">
          لا توجد معامل تفاعلية لهذا الدرس حالياً
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">
          المعامل التفاعلية تساعدك على محاكاة الخوارزميات وهياكل البيانات خطوة
          بخطوة.
        </p>
      </div>
    );
  }

  const loadedLab = cache[activeLab.id];
  const isLoading = !loadedLab && !activeError;
  const iframeHeight = `${Math.max(activeLab.default_height || 560, 420)}px`;
  const resolvedExternalUrl =
    loadedLab?.external_url ?? activeLab.external_url ?? "";

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
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                  isSelected
                    ? "border-[var(--hero)] bg-[var(--hero)] text-[var(--hero-ink)] shadow-[var(--shadow-pill)]"
                    : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--soft)] hover:text-[var(--accent)]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                    isSelected
                      ? "bg-[var(--signal)] text-white"
                      : "bg-[var(--signal-soft)] text-[var(--signal)]"
                  }`}
                >
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
            ? "fixed inset-0 z-50 flex flex-col bg-[var(--bg)]"
            : isNativeFullscreen
              ? "flex h-screen w-screen flex-col bg-[var(--bg)]"
              : "studio-card overflow-hidden shadow-[var(--shadow-pill)]"
        }
      >
        {/* Swiss Atelier Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--paper)] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--signal)]/30 bg-[var(--signal-soft)] text-[var(--signal)]">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[var(--ink)]">
                {activeLab.title}
              </h3>
              {activeLab.description ? (
                <p className="truncate text-xs text-[var(--muted)]">
                  {activeLab.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeLab.source_type === "external_url" && resolvedExternalUrl ? (
              <a
                href={resolvedExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--soft)] hover:text-[var(--accent)]"
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--soft)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>إعادة تشغيل</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--accent)]/35 bg-[var(--soft)] px-3 py-1.5 text-xs font-bold text-[var(--accent)] transition-colors hover:bg-[var(--soft-hover)]"
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
          className={`relative w-full bg-[var(--bg)] ${
            isFullscreen ? "flex-1" : ""
          }`}
        >
          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center gap-3 p-8 text-center"
              style={{ height: isFullscreen ? "100%" : iframeHeight }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-[var(--signal)]" />
              <p className="text-sm font-bold text-[var(--ink)]">
                جاري تحميل المعمل التفاعلي...
              </p>
              <p className="text-xs text-[var(--muted)]">
                يتم تحميل المعمل عند الطلب فقط للحفاظ على سرعة التصفح
              </p>
            </div>
          ) : activeError ? (
            <div
              className="flex flex-col items-center justify-center gap-3 p-8 text-center"
              style={{ height: isFullscreen ? "100%" : "320px" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--neg)]/30 bg-[var(--neg-soft)] text-[var(--neg)]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="max-w-md text-sm font-bold text-[var(--ink)]">
                {activeError}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--hero)] px-4 py-2 text-xs font-bold text-[var(--hero-ink)] transition-colors hover:bg-[var(--hero-deep)]"
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
                className="block w-full border-0 bg-[var(--code-bg)]"
                style={{
                  height: isFullscreen ? "100%" : iframeHeight,
                }}
              />
            ) : resolvedExternalUrl ? (
              <iframe
                key={`${loadedLab.id}-${resetKey}`}
                src={resolvedExternalUrl}
                title={loadedLab.title}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                className="block w-full border-0 bg-[var(--paper)]"
                style={{
                  height: isFullscreen ? "100%" : iframeHeight,
                }}
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
                لم يتم تعيين رابط خارجي لهذا المعمل بعد.
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
