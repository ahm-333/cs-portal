"use client";

import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";

export interface ReadingPrefs {
  fontScale: number; // 85..125
  relaxedSpacing: boolean;
}

export const THEME_OPTIONS: ReadonlyArray<{
  mode: ThemeMode;
  label: string;
}> = [
  { mode: "light", label: "فاتح" },
  { mode: "dark", label: "داكن" },
];

const THEME_KEY = "cs_portal_theme";
const THEME_EVENT = "cs-portal-theme-updated";

const READING_KEY = "cs_portal_reading_prefs";
const READING_EVENT = "cs-portal-reading-updated";

const DEFAULT_THEME: ThemeMode = "light";
const DEFAULT_READING: ReadingPrefs = { fontScale: 100, relaxedSpacing: false };

function normalizeTheme(val: unknown): ThemeMode {
  return val === "dark" ? "dark" : "light";
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    return normalizeTheme(raw);
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyThemeToDom(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const resolved = normalizeTheme(mode);
  document.documentElement.dataset.theme = resolved;
  if (resolved === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function applyTheme(mode: ThemeMode): void {
  const resolved = normalizeTheme(mode);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_KEY, resolved);
    } catch {
      // ignore storage quota/privacy errors
    }
  }
  applyThemeToDom(resolved);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(THEME_EVENT));
  }
}

export function setTheme(mode: ThemeMode): void {
  applyTheme(mode);
}

export function setThemeMode(mode: ThemeMode): void {
  applyTheme(mode);
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getStoredTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

export function cycleThemeMode(): void {
  toggleTheme();
}

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onInternal = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_KEY) {
      applyThemeToDom(getStoredTheme());
      callback();
    }
  };
  window.addEventListener(THEME_EVENT, onInternal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onInternal);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme(): ThemeMode {
  return useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    () => DEFAULT_THEME
  );
}

export function useThemeMode(): ThemeMode {
  return useTheme();
}

// --- Reading Comfort Preferences (preserved for lesson workspace compatibility) ---

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
