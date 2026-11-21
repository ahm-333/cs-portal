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
      className={`items-center gap-1.5 px-2.5 h-9 rounded-xl border text-[12px] transition-colors ${
        className || "flex"
      }`}
      style={{
        background: "var(--bg-surface)",
        borderColor: isRunning ? "var(--accent-warm)" : "var(--border-soft)",
      }}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 font-en font-semibold cursor-pointer"
        style={{ color: "var(--text-primary)" }}
        title={isRunning ? "إيقاف مؤقت للتركيز" : "تشغيل مؤقت التركيز"}
        aria-label={isRunning ? "إيقاف مؤقت التركيز" : "تشغيل مؤقت التركيز"}
      >
        {isRunning ? (
          <Pause
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "var(--accent-warm)" }}
          />
        ) : (
          <Play
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "var(--accent-warm)" }}
          />
        )}
        <span className="tabular-nums">{formatClock(liveRemainingSec)}</span>
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="p-0.5 rounded hover:opacity-75 transition-opacity cursor-pointer"
        style={{ color: "var(--text-muted)" }}
        title="إعادة ضبط"
        aria-label="إعادة ضبط مؤقت التركيز"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}
