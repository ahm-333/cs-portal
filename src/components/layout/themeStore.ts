"use client";

import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "reading" | "dark";

export interface ReadingPrefs {
  fontScale: number; // 90 | 100 | 110 | 120
  relaxedSpacing: boolean;
}

const THEME_KEY = "cs_portal_theme";
const THEME_EVENT = "cs-portal-theme-updated";

const READING_KEY = "cs_portal_reading_prefs";
const READING_EVENT = "cs-portal-reading-updated";

const DEFAULT_THEME: ThemeMode = "light";
const DEFAULT_READING: ReadingPrefs = { fontScale: 100, relaxedSpacing: false };

function isValidTheme(val: unknown): val is ThemeMode {
  return val === "light" || val === "reading" || val === "dark";
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    if (isValidTheme(raw)) return raw;
  } catch {
    // ignore
  }
  return DEFAULT_THEME;
}

export function applyThemeToDom(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = mode;
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function setThemeMode(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_KEY, mode);
  } catch {
    // ignore
  }
  applyThemeToDom(mode);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function cycleThemeMode(): void {
  const cur = getStoredTheme();
  const next: ThemeMode =
    cur === "light" ? "reading" : cur === "reading" ? "dark" : "light";
  setThemeMode(next);
}

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(THEME_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(THEME_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    () => DEFAULT_THEME
  );
}

// --- Reading Comfort Preferences ---

let cachedReadingRaw: string | null = null;
let cachedReadingObj: ReadingPrefs = DEFAULT_READING;

function getReadingPrefsSnapshot(): ReadingPrefs {
  if (typeof window === "undefined") return DEFAULT_READING;
  try {
    const raw = window.localStorage.getItem(READING_KEY);
    if (raw === cachedReadingRaw) return cachedReadingObj;
    cachedReadingRaw = raw;
    if (!raw) {
      cachedReadingObj = DEFAULT_READING;
      return cachedReadingObj;
    }
    const parsed = JSON.parse(raw) as Partial<ReadingPrefs>;
    const scale =
      typeof parsed.fontScale === "number" &&
      parsed.fontScale >= 85 &&
      parsed.fontScale <= 130
        ? parsed.fontScale
        : 100;
    cachedReadingObj = {
      fontScale: scale,
      relaxedSpacing: Boolean(parsed.relaxedSpacing),
    };
    return cachedReadingObj;
  } catch {
    return DEFAULT_READING;
  }
}

export function updateReadingPrefs(patch: Partial<ReadingPrefs>): void {
  if (typeof window === "undefined") return;
  const current = getReadingPrefsSnapshot();
  const next: ReadingPrefs = {
    fontScale: Math.min(125, Math.max(85, patch.fontScale ?? current.fontScale)),
    relaxedSpacing: patch.relaxedSpacing ?? current.relaxedSpacing,
  };
  try {
    window.localStorage.setItem(READING_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  cachedReadingRaw = null;
  window.dispatchEvent(new Event(READING_EVENT));
}

function subscribeReading(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(READING_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(READING_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useReadingPrefs(): ReadingPrefs {
  return useSyncExternalStore(
    subscribeReading,
    getReadingPrefsSnapshot,
    () => DEFAULT_READING
  );
}
