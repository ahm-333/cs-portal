"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Timer,
  X,
} from "lucide-react";

const POMODORO_KEY = "cs_portal_pomodoro";
const POMODORO_EVENT = "cs-portal-pomodoro-updated";

const PRESETS = [
  { minutes: 25, label: "25 د" },
  { minutes: 45, label: "45 د" },
  { minutes: 15, label: "15 د" },
  { minutes: 5, label: "5 د" },
] as const;

interface PomodoroState {
  durationSec: number;
  remainingSec: number;
  targetEndMs: number | null;
  completedSessions: number;
  justFinished: boolean;
}

const DEFAULT_POMODORO: PomodoroState = {
  durationSec: 25 * 60,
  remainingSec: 25 * 60,
  targetEndMs: null,
  completedSessions: 0,
  justFinished: false,
};

let cachedRaw: string | null | undefined = undefined;
let cachedState: PomodoroState = DEFAULT_POMODORO;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePomodoroRaw(raw: string): PomodoroState {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return DEFAULT_POMODORO;

    const durationSec =
      typeof parsed.durationSec === "number" && parsed.durationSec >= 60
        ? Math.round(parsed.durationSec)
        : 25 * 60;

    const remainingSec =
      typeof parsed.remainingSec === "number" && parsed.remainingSec >= 0
        ? Math.min(durationSec, Math.round(parsed.remainingSec))
        : durationSec;

    const targetEndMs =
      typeof parsed.targetEndMs === "number" && Number.isFinite(parsed.targetEndMs)
        ? parsed.targetEndMs
        : null;

    const completedSessions =
      typeof parsed.completedSessions === "number" && parsed.completedSessions >= 0
        ? Math.floor(parsed.completedSessions)
        : 0;

    const justFinished = Boolean(parsed.justFinished);

    return {
      durationSec,
      remainingSec,
      targetEndMs,
      completedSessions,
      justFinished,
    };
  } catch {
    return DEFAULT_POMODORO;
  }
}

function getPomodoroSnapshot(): PomodoroState {
  if (typeof window === "undefined") return DEFAULT_POMODORO;
  try {
    const raw = window.localStorage.getItem(POMODORO_KEY);
    if (raw === cachedRaw) return cachedState;
    cachedRaw = raw;
    cachedState = raw ? parsePomodoroRaw(raw) : DEFAULT_POMODORO;
    return cachedState;
  } catch {
    return DEFAULT_POMODORO;
  }
}

function savePomodoroState(next: PomodoroState): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(next);
    window.localStorage.setItem(POMODORO_KEY, serialized);
    cachedRaw = serialized;
    cachedState = next;
    window.dispatchEvent(new Event(POMODORO_EVENT));
  } catch {
    // ignore storage errors
  }
}

function subscribePomodoro(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === POMODORO_KEY) {
      callback();
    }
  };
  window.addEventListener(POMODORO_EVENT, handler);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(POMODORO_EVENT, handler);
    window.removeEventListener("storage", onStorage);
  };
}

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function playGentleChime(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // A5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch {
    // ignore audio restrictions
  }
}

export function PomodoroTimer() {
  const state = useSyncExternalStore(
    subscribePomodoro,
    getPomodoroSnapshot,
    () => DEFAULT_POMODORO
  );
  const [open, setOpen] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isRunning = state.targetEndMs !== null;

  // Tick every 500ms only when running, and finalize when targetEndMs passes
  useEffect(() => {
    if (!isRunning || state.targetEndMs === null) return;

    const targetEnd = state.targetEndMs;

    const tick = () => {
      const current = Date.now();
      if (current >= targetEnd) {
        playGentleChime();
        savePomodoroState({
          durationSec: state.durationSec,
          remainingSec: state.durationSec,
          targetEndMs: null,
          completedSessions: state.completedSessions + 1,
          justFinished: true,
        });
        setOpen(true);
      } else {
        setNowMs(current);
      }
    };

    const intervalId = window.setInterval(tick, 500);
    return () => window.clearInterval(intervalId);
  }, [
    isRunning,
    state.targetEndMs,
    state.durationSec,
    state.completedSessions,
  ]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const liveRemainingSec =
    isRunning && state.targetEndMs !== null
      ? Math.max(0, Math.ceil((state.targetEndMs - nowMs) / 1000))
      : state.remainingSec;

  const progressPercent =
    state.durationSec > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((state.durationSec - liveRemainingSec) / state.durationSec) * 100
            )
          )
        )
      : 0;

  function handleStartPause() {
    if (isRunning) {
      const remaining =
        state.targetEndMs !== null
          ? Math.max(1, Math.ceil((state.targetEndMs - Date.now()) / 1000))
          : state.remainingSec;
      savePomodoroState({
        ...state,
        remainingSec: remaining,
        targetEndMs: null,
        justFinished: false,
      });
    } else {
      const startFrom =
        state.remainingSec > 0 ? state.remainingSec : state.durationSec;
      const now = Date.now();
      setNowMs(now);
      savePomodoroState({
        ...state,
        remainingSec: startFrom,
        targetEndMs: now + startFrom * 1000,
        justFinished: false,
      });
    }
  }

  function handleReset() {
    savePomodoroState({
      ...state,
      remainingSec: state.durationSec,
      targetEndMs: null,
      justFinished: false,
    });
  }

  function handlePreset(minutes: number) {
    const secs = minutes * 60;
    savePomodoroState({
      ...state,
      durationSec: secs,
      remainingSec: secs,
      targetEndMs: null,
      justFinished: false,
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="مؤقت المذاكرة بومودورو"
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
          isRunning
            ? "border-[var(--accent)] bg-[var(--soft)] text-[var(--accent)] shadow-[var(--shadow-pill)]"
            : state.justFinished
              ? "border-[var(--pos)] bg-[var(--pos-soft)] text-[var(--pos)]"
              : "border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
      >
        <Timer className="h-4 w-4 shrink-0" />
        {isRunning ? (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
            <span dir="ltr" className="font-mono text-xs font-extrabold">
              {formatClock(liveRemainingSec)}
            </span>
          </span>
        ) : (
          <span className="hidden sm:inline">
            {state.remainingSec < state.durationSec
              ? formatClock(state.remainingSec)
              : "مؤقت التركيز"}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="مؤقت التركيز بومودورو"
          className="fixed inset-x-4 top-[80px] z-50 mx-auto max-w-xs rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-modal)] sm:absolute sm:inset-x-auto sm:left-0 sm:top-[54px] sm:mx-0 sm:w-80"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
                <Timer className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-[var(--ink)]">
                  مؤقت التركيز
                </h3>
                <p className="text-[11px] text-[var(--muted)]">
                  جلسات مكتملة:{" "}
                  <strong className="font-mono text-[var(--accent)]">
                    {state.completedSessions}
                  </strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق المؤقت"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Completion Alert */}
          {state.justFinished && (
            <div
              role="status"
              className="mt-3 flex items-start gap-2 rounded-xl border border-[var(--pos)]/30 bg-[var(--pos-soft)] p-3 text-xs font-semibold text-[var(--pos)]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>أحسنت! أنهيت جلسة تركيز بنجاح — خذ استراحة قصيرة.</span>
            </div>
          )}

          {/* Clock Display */}
          <div className="my-4 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-5 text-center">
            <div
              dir="ltr"
              className="font-mono text-4xl font-extrabold tracking-tight text-[var(--ink)]"
            >
              {formatClock(liveRemainingSec)}
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {PRESETS.map((preset) => {
              const active = state.durationSec === preset.minutes * 60;
              return (
                <button
                  key={preset.minutes}
                  type="button"
                  onClick={() => handlePreset(preset.minutes)}
                  className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                    active
                      ? "border-[var(--accent)] bg-[var(--soft)] text-[var(--accent)]"
                      : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartPause}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--hero)] px-4 py-2.5 text-xs font-extrabold text-white transition-colors hover:bg-[var(--hero-deep)]"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>ابدأ الجلسة</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="إعادة ضبط"
              aria-label="إعادة ضبط المؤقت"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
