"use client";

import { useSyncExternalStore } from "react";

export interface GuestLessonProgress {
  is_completed: boolean;
  best_quiz_score: number | null;
}

export const GUEST_PROGRESS_STORAGE_KEY = "cs_portal_progress";
export const GUEST_PROGRESS_UPDATED_EVENT = "cs-portal-progress-updated";

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

  const onCustomUpdate = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(GUEST_PROGRESS_UPDATED_EVENT, onCustomUpdate);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(GUEST_PROGRESS_UPDATED_EVENT, onCustomUpdate);
  };
}

/**
 * Toggles a lesson's completion flag in localStorage ("cs_portal_progress")
 * while preserving any existing best_quiz_score.
 */
export function toggleGuestLessonCompletion(lessonId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = window.localStorage.getItem(GUEST_PROGRESS_STORAGE_KEY);
    const currentObj: Record<string, unknown> = {};
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isRecord(parsed)) {
        Object.assign(currentObj, parsed);
      }
    }

    const existing = isRecord(currentObj[lessonId])
      ? (currentObj[lessonId] as Record<string, unknown>)
      : {};

    const wasCompleted =
      typeof existing.is_completed === "boolean"
        ? existing.is_completed
        : typeof existing.isCompleted === "boolean"
          ? existing.isCompleted
          : false;

    const existingScore =
      typeof existing.best_quiz_score === "number"
        ? existing.best_quiz_score
        : typeof existing.bestQuizScore === "number"
          ? existing.bestQuizScore
          : null;

    const nextCompleted = !wasCompleted;

    currentObj[lessonId] = {
      is_completed: nextCompleted,
      best_quiz_score: existingScore,
      updated_at: new Date().toISOString(),
    };

    const serialized = JSON.stringify(currentObj);
    window.localStorage.setItem(GUEST_PROGRESS_STORAGE_KEY, serialized);
    cachedRaw = undefined;
    window.dispatchEvent(new Event(GUEST_PROGRESS_UPDATED_EVENT));
    return nextCompleted;
  } catch {
    return false;
  }
}

/**
 * Hydration-safe hook to read guest progress from localStorage ("cs_portal_progress").
 */
export function useGuestProgress(
  enabled = true
): Record<string, GuestLessonProgress> {
  const snapshot = useSyncExternalStore(
    subscribeGuestProgress,
    getGuestProgressSnapshot,
    getServerSnapshot
  );

  return enabled ? snapshot : EMPTY_GUEST_PROGRESS;
}
