"use client";

import { useSyncExternalStore } from "react";

export interface GuestLessonProgress {
  is_completed: boolean;
  best_quiz_score: number | null;
}

export const GUEST_PROGRESS_STORAGE_KEY = "cs_portal_progress";
export const GUEST_PROGRESS_EVENT = "cs-portal-progress-updated";

const EMPTY_GUEST_PROGRESS: Record<string, GuestLessonProgress> = Object.freeze(
  {}
);

let cachedRaw: string | null | undefined = undefined;
let cachedParsed: Record<string, GuestLessonProgress> = EMPTY_GUEST_PROGRESS;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseGuestProgressRaw(
  raw: string
): Record<string, GuestLessonProgress> {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_GUEST_PROGRESS;

    const result: Record<string, GuestLessonProgress> = {};
    for (const [lessonId, entry] of Object.entries(parsed)) {
      if (!isRecord(entry)) continue;

      const completed =
        typeof entry.is_completed === "boolean"
          ? entry.is_completed
          : typeof entry.isCompleted === "boolean"
            ? entry.isCompleted
            : false;

      const scoreRaw =
        typeof entry.best_quiz_score === "number"
          ? entry.best_quiz_score
          : typeof entry.bestQuizScore === "number"
            ? entry.bestQuizScore
            : null;

      result[lessonId] = {
        is_completed: completed,
        best_quiz_score:
          scoreRaw !== null && Number.isFinite(scoreRaw) ? scoreRaw : null,
      };
    }

    return result;
  } catch {
    return EMPTY_GUEST_PROGRESS;
  }
}

function getGuestProgressSnapshot(): Record<string, GuestLessonProgress> {
  if (typeof window === "undefined") {
    return EMPTY_GUEST_PROGRESS;
  }

  try {
    const raw = window.localStorage.getItem(GUEST_PROGRESS_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedParsed;
    }
    cachedRaw = raw;
    cachedParsed = raw ? parseGuestProgressRaw(raw) : EMPTY_GUEST_PROGRESS;
    return cachedParsed;
  } catch {
    return EMPTY_GUEST_PROGRESS;
  }
}

function getServerSnapshot(): Record<string, GuestLessonProgress> {
  return EMPTY_GUEST_PROGRESS;
}

function subscribeGuestProgress(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === GUEST_PROGRESS_STORAGE_KEY) {
      callback();
    }
  };
  const onSameTabUpdate = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(GUEST_PROGRESS_EVENT, onSameTabUpdate);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(GUEST_PROGRESS_EVENT, onSameTabUpdate);
  };
}

/**
 * Hydration-safe hook to read guest progress from localStorage ("cs_portal_progress").
 */
export function useGuestProgress(
  enabled: boolean
): Record<string, GuestLessonProgress> {
  const snapshot = useSyncExternalStore(
    subscribeGuestProgress,
    getGuestProgressSnapshot,
    getServerSnapshot
  );

  return enabled ? snapshot : EMPTY_GUEST_PROGRESS;
}
