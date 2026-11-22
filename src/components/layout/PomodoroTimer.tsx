"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { emitToast } from "@/lib/stores/events";

const POMODORO_KEY = "cs_portal_pomodoro";
const POMODORO_EVENT = "cs-portal-pomodoro-updated";
const DEFAULT_DURATION_SEC = 25 * 60;

interface PomodoroState {
  durationSec: number;
  remainingSec: number;
  targetEndMs: number | null;
}

const DEFAULT_POMODORO: PomodoroState = {
  durationSec: DEFAULT_DURATION_SEC,
  remainingSec: DEFAULT_DURATION_SEC,
  targetEndMs: null,
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
        : DEFAULT_DURATION_SEC;

    const remainingSec =
      typeof parsed.remainingSec === "number" && parsed.remainingSec >= 0
        ? Math.min(durationSec, Math.round(parsed.remainingSec))
        : durationSec;

    const targetEndMs =
      typeof parsed.targetEndMs === "number" &&
      Number.isFinite(parsed.targetEndMs)
        ? parsed.targetEndMs
        : null;

    return {
      durationSec,
      remainingSec,
      targetEndMs,
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
    cachedState = next;
  }
}

function subscribePomodoro(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === POMODORO_KEY) {
      cachedRaw = undefined;
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
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // ignore audio restrictions
  }
}

export interface PomodoroTimerProps {
  className?: string;
}

export function PomodoroTimer({ className = "" }: PomodoroTimerProps) {
  const state = useSyncExternalStore(
    subscribePomodoro,
    getPomodoroSnapshot,
    () => DEFAULT_POMODORO
  );
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const isRunning = state.targetEndMs !== null;

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
        });
        emitToast("انتهت جلسة التركيز — عاش!");
      } else {
        setNowMs(current);
      }
    };

    const intervalId = window.setInterval(tick, 500);
    return () => window.clearInterval(intervalId);
  }, [isRunning, state.targetEndMs, state.durationSec]);

  const liveRemainingSec =
    isRunning && state.targetEndMs !== null
      ? Math.max(0, Math.ceil((state.targetEndMs - nowMs) / 1000))
      : state.remainingSec;

  const progressRatio =
    state.durationSec > 0
      ? Math.max(0, Math.min(1, 1 - liveRemainingSec / state.durationSec))
      : 0;
  const ringCircumference = 2 * Math.PI * 12; // r=12 -> ~75.4
  const ringOffset = ringCircumference * (1 - progressRatio);
  const isDirty = isRunning || liveRemainingSec < state.durationSec;

  function handleToggle() {
    if (isRunning) {
      const remaining =
        state.targetEndMs !== null
          ? Math.max(1, Math.ceil((state.targetEndMs - Date.now()) / 1000))
          : state.remainingSec;
      savePomodoroState({
        ...state,
        remainingSec: remaining,
        targetEndMs: null,
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
      });
    }
  }

  function handleReset() {
    savePomodoroState({
      durationSec: DEFAULT_DURATION_SEC,
      remainingSec: DEFAULT_DURATION_SEC,
      targetEndMs: null,
    });
  }

  return (
    <div
      className={`items-center gap-2 pl-2.5 pr-1.5 h-10 rounded-full border shadow-xs transition-all shrink-0 ${
        className || "inline-flex"
      }`}
      style={{
        background: isRunning ? "var(--accent-warm-soft)" : "var(--bg-surface)",
        borderColor: isRunning ? "var(--accent-warm)" : "var(--border-soft)",
      }}
    >
      {/* Play / Pause Button with Live Circular SVG Progress Ring */}
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 cursor-pointer group"
        title={isRunning ? "إيقاف مؤقت للتركيز" : "ابدأ جلسة تركيز (25 دقيقة)"}
        aria-label={isRunning ? "إيقاف مؤقت التركيز" : "تشغيل مؤقت التركيز"}
      >
        <span className="relative w-7 h-7 flex items-center justify-center shrink-0">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 28 28"
            aria-hidden="true"
          >
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke="var(--border-soft)"
              strokeWidth="2"
            />
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke={isRunning ? "#c25e33" : "var(--brand-primary)"}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <span
            className="relative w-5 h-5 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-105"
            style={{
              background: isRunning ? "#c25e33" : "var(--hero-bg)",
            }}
          >
            {isRunning ? (
              <Pause className="w-2.5 h-2.5 fill-white" />
            ) : (
              <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
            )}
          </span>
        </span>

        <div className="flex flex-col items-start leading-none text-right">
          <span
            className="font-mono-code text-[12.5px] font-black tabular-nums tracking-tight"
            style={{
              color: isRunning
                ? "var(--accent-warm-text)"
                : "var(--text-primary)",
            }}
          >
            {formatClock(liveRemainingSec)}
          </span>
          <span
            className="text-[9.5px] font-bold mt-0.5"
            style={{
              color: isRunning
                ? "var(--accent-warm)"
                : "var(--text-muted)",
            }}
          >
            {isRunning ? "تركيز نشط" : "بومودورو"}
          </span>
        </div>
      </button>

      {/* Clean Reset Trigger (only visible once timer has started/modified) */}
      {isDirty && (
        <button
          type="button"
          onClick={handleReset}
          className="w-6 h-6 rounded-full inline-flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          title="إعادة ضبط المؤقت"
          aria-label="إعادة ضبط مؤقت التركيز"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
