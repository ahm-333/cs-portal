"use client";

import { useSyncExternalStore } from "react";

export type PortalDepartment = "CS" | "AI" | "IS" | "IT";

export interface PortalProfile {
  name: string;
  year: number; // 1 | 2 | 3 | 4
  dept: PortalDepartment;
  saved: boolean;
}

export interface MistakeItem {
  courseId: string;
  courseCode: string;
  lessonId?: string;
  q: string;
  ansText: string;
}

export interface LastVisitedLesson {
  courseSlug: string;
  courseCode: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  visitedAt: string;
}

export interface PortalState {
  profile: PortalProfile;
  completedLessons: string[];
  quizScores: Record<string, number>;
  notes: Record<string, string>;
  mistakes: MistakeItem[];
  unlockedCourses: string[];
  examDate: string; // YYYY-MM-DD
  lastVisited: LastVisitedLesson | null;
}

export const PORTAL_STORAGE_KEY = "cs_portal_state_v3";
export const PORTAL_UPDATED_EVENT = "cs-portal-state-v3-updated";

const LEGACY_PROGRESS_KEY = "cs_portal_progress";
const LEGACY_PROFILE_KEY = "cs_portal_profile";
const LEGACY_V2_PROGRESS_KEY = "cs_portal_progress_v2";
const LEGACY_V2_EXTRAS_KEY = "cs_portal_extras_v2";

const VALID_DEPTS = new Set<PortalDepartment>(["CS", "AI", "IS", "IT"]);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const SERVER_SNAPSHOT: PortalState = Object.freeze({
  profile: Object.freeze({
    name: "",
    year: 2,
    dept: "CS" as PortalDepartment,
    saved: false,
  }),
  completedLessons: Object.freeze([]) as unknown as string[],
  quizScores: Object.freeze({}),
  notes: Object.freeze({}),
  mistakes: Object.freeze([]) as unknown as MistakeItem[],
  unlockedCourses: Object.freeze([]) as unknown as string[],
  examDate: "",
  lastVisited: null,
});

let cachedRaw: string | null | undefined = undefined;
let cachedState: PortalState = SERVER_SNAPSHOT;
let memoryFallbackState: PortalState | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getDefaultExamDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sanitizeYear(raw: unknown, fallback = 2): number {
  const num = typeof raw === "number" ? raw : Number(raw);
  return Number.isInteger(num) && num >= 1 && num <= 4 ? num : fallback;
}

function sanitizeDept(
  raw: unknown,
  fallback: PortalDepartment = "CS"
): PortalDepartment {
  if (typeof raw !== "string") return fallback;
  const upper = raw.trim().toUpperCase() as PortalDepartment;
  return VALID_DEPTS.has(upper) ? upper : fallback;
}

function sanitizeStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

function sanitizeQuizScores(raw: unknown): Record<string, number> {
  if (!isRecord(raw)) return {};
  const out: Record<string, number> = {};
  for (const [lessonId, val] of Object.entries(raw)) {
    if (typeof val !== "number" || !Number.isFinite(val)) continue;
    const key = lessonId.trim();
    if (!key) continue;
    out[key] = Math.min(100, Math.max(0, Math.round(val)));
  }
  return out;
}

function sanitizeNotes(raw: unknown): Record<string, string> {
  if (!isRecord(raw)) return {};
  const out: Record<string, string> = {};
  for (const [lessonId, val] of Object.entries(raw)) {
    if (typeof val !== "string") continue;
    const key = lessonId.trim();
    if (!key) continue;
    out[key] = val;
  }
  return out;
}

function sanitizeMistakes(raw: unknown): MistakeItem[] {
  if (!Array.isArray(raw)) return [];
  const out: MistakeItem[] = [];
  const seen = new Set<string>();
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    const q = typeof entry.q === "string" ? entry.q.trim() : "";
    const ansText =
      typeof entry.ansText === "string" ? entry.ansText.trim() : "";
    if (!q || !ansText) continue;

    const courseId =
      typeof entry.courseId === "string" ? entry.courseId.trim() : "";
    const courseCode =
      typeof entry.courseCode === "string" ? entry.courseCode.trim() : "";
    const lessonId =
      typeof entry.lessonId === "string" && entry.lessonId.trim()
        ? entry.lessonId.trim()
        : undefined;

    const dedupeKey = `${courseId}::${q}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    out.push({
      courseId,
      courseCode: courseCode || courseId || "CS",
      ...(lessonId ? { lessonId } : {}),
      q,
      ansText,
    });
  }
  return out;
}

function sanitizeExamDate(raw: unknown): string {
  if (typeof raw === "string" && ISO_DATE_RE.test(raw.trim())) {
    return raw.trim();
  }
  return getDefaultExamDate();
}

function sanitizeLastVisited(raw: unknown): LastVisitedLesson | null {
  if (!isRecord(raw)) return null;
  const courseSlug = typeof raw.courseSlug === "string" ? raw.courseSlug.trim() : "";
  const courseCode = typeof raw.courseCode === "string" ? raw.courseCode.trim() : "";
  const courseTitle = typeof raw.courseTitle === "string" ? raw.courseTitle.trim() : "";
  const lessonId = typeof raw.lessonId === "string" ? raw.lessonId.trim() : "";
  const lessonTitle = typeof raw.lessonTitle === "string" ? raw.lessonTitle.trim() : "";
  const visitedAt = typeof raw.visitedAt === "string" ? raw.visitedAt.trim() : "";
  if (!courseSlug || !lessonId || !courseTitle) return null;
  return {
    courseSlug,
    courseCode: courseCode || "CS",
    courseTitle,
    lessonId,
    lessonTitle: lessonTitle || courseTitle,
    visitedAt: visitedAt || new Date().toISOString(),
  };
}

function createEmptyClientState(): PortalState {
  return {
    profile: {
      name: "",
      year: 2,
      dept: "CS",
      saved: false,
    },
    completedLessons: [],
    quizScores: {},
    notes: {},
    mistakes: [],
    unlockedCourses: [],
    examDate: getDefaultExamDate(),
    lastVisited: null,
  };
}

function sanitizePortalState(raw: unknown): PortalState {
  const base = createEmptyClientState();
  if (!isRecord(raw)) return base;

  let profile = base.profile;
  if (isRecord(raw.profile)) {
    const rawName =
      typeof raw.profile.name === "string"
        ? raw.profile.name.trim()
        : typeof raw.profile.full_name === "string"
          ? raw.profile.full_name.trim()
          : "";
    const rawYear = raw.profile.year ?? raw.profile.year_level;
    const rawDept = raw.profile.dept ?? raw.profile.department;
    const saved =
      typeof raw.profile.saved === "boolean"
        ? raw.profile.saved
        : rawName.length > 0;

    profile = {
      name: rawName,
      year: sanitizeYear(rawYear, 2),
      dept: sanitizeDept(rawDept, "CS"),
      saved,
    };
  }

  return {
    profile,
    completedLessons: sanitizeStringArray(raw.completedLessons),
    quizScores: sanitizeQuizScores(raw.quizScores),
    notes: sanitizeNotes(raw.notes),
    mistakes: sanitizeMistakes(raw.mistakes),
    unlockedCourses: sanitizeStringArray(raw.unlockedCourses),
    examDate: sanitizeExamDate(raw.examDate),
    lastVisited: sanitizeLastVisited(raw.lastVisited),
  };
}

/**
 * Migrates legacy localStorage keys (`cs_portal_progress`, `cs_portal_profile`,
 * and prototype v2 keys) into the unified v3 state when v3 does not exist yet.
 */
function readAndMigrateLegacyState(): { state: PortalState; migrated: boolean } {
  const base = createEmptyClientState();
  let migrated = false;

  if (typeof window === "undefined") {
    return { state: base, migrated: false };
  }

  try {
    // 1. Migrate legacy `cs_portal_profile`
    const legacyProfileRaw = window.localStorage.getItem(LEGACY_PROFILE_KEY);
    if (legacyProfileRaw) {
      const parsed: unknown = JSON.parse(legacyProfileRaw);
      if (isRecord(parsed)) {
        const name =
          typeof parsed.full_name === "string"
            ? parsed.full_name.trim()
            : typeof parsed.name === "string"
              ? parsed.name.trim()
              : "";
        if (name) {
          base.profile = {
            name,
            year: sanitizeYear(parsed.year_level ?? parsed.year, 2),
            dept: sanitizeDept(parsed.department ?? parsed.dept, "CS"),
            saved: true,
          };
          migrated = true;
        }
      }
    }
  } catch {
    // ignore malformed legacy profile
  }

  try {
    // 2. Migrate legacy `cs_portal_progress`
    const legacyProgressRaw = window.localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (legacyProgressRaw) {
      const parsed: unknown = JSON.parse(legacyProgressRaw);
      if (isRecord(parsed)) {
        const completedSet = new Set<string>(base.completedLessons);
        for (const [lessonId, entry] of Object.entries(parsed)) {
          if (!isRecord(entry)) continue;
          const isCompleted =
            typeof entry.is_completed === "boolean"
              ? entry.is_completed
              : typeof entry.isCompleted === "boolean"
                ? entry.isCompleted
                : false;
          if (isCompleted) {
            completedSet.add(lessonId);
            migrated = true;
          }
          const score =
            typeof entry.best_quiz_score === "number"
              ? entry.best_quiz_score
              : typeof entry.bestQuizScore === "number"
                ? entry.bestQuizScore
                : null;
          if (score !== null && Number.isFinite(score)) {
            base.quizScores[lessonId] = Math.min(
              100,
              Math.max(0, Math.round(score))
            );
            migrated = true;
          }
        }
        base.completedLessons = Array.from(completedSet);
      }
    }
  } catch {
    // ignore malformed legacy progress
  }

  try {
    // 3. Migrate prototype `cs_portal_progress_v2` if present
    const v2Raw = window.localStorage.getItem(LEGACY_V2_PROGRESS_KEY);
    if (v2Raw) {
      const parsed: unknown = JSON.parse(v2Raw);
      if (isRecord(parsed)) {
        if (!base.profile.saved && isRecord(parsed.profile)) {
          const name =
            typeof parsed.profile.name === "string"
              ? parsed.profile.name.trim()
              : "";
          if (name || parsed.profile.saved === true) {
            base.profile = {
              name,
              year: sanitizeYear(parsed.profile.year, 2),
              dept: sanitizeDept(parsed.profile.dept, "CS"),
              saved: Boolean(parsed.profile.saved ?? name),
            };
            migrated = true;
          }
        }
        if (Array.isArray(parsed.completedLessons)) {
          const merged = new Set<string>([
            ...base.completedLessons,
            ...sanitizeStringArray(parsed.completedLessons),
          ]);
          base.completedLessons = Array.from(merged);
          migrated = true;
        }
      }
    }
  } catch {
    // ignore malformed v2 progress
  }

  try {
    // 4. Migrate prototype `cs_portal_extras_v2` if present
    const extrasRaw = window.localStorage.getItem(LEGACY_V2_EXTRAS_KEY);
    if (extrasRaw) {
      const parsed: unknown = JSON.parse(extrasRaw);
      if (isRecord(parsed)) {
        base.notes = sanitizeNotes(parsed.notes);
        base.mistakes = sanitizeMistakes(parsed.mistakes);
        base.unlockedCourses = sanitizeStringArray(parsed.unlockedCourses);
        if (typeof parsed.examDate === "string" && ISO_DATE_RE.test(parsed.examDate)) {
          base.examDate = parsed.examDate;
        }
        migrated = true;
      }
    }
  } catch {
    // ignore malformed v2 extras
  }

  return { state: base, migrated };
}

function mirrorToLegacyKeys(state: PortalState): void {
  if (typeof window === "undefined") return;
  try {
    // Keep legacy `cs_portal_profile` synced for backward compatibility
    if (state.profile.saved && state.profile.name) {
      window.localStorage.setItem(
        LEGACY_PROFILE_KEY,
        JSON.stringify({
          full_name: state.profile.name,
          year_level: state.profile.year,
          department: state.profile.dept,
        })
      );
      window.dispatchEvent(new Event("cs-portal-profile-updated"));
    }

    // Keep legacy `cs_portal_progress` synced for backward compatibility
    const progressMap: Record<
      string,
      { is_completed: boolean; best_quiz_score: number | null; updated_at: string }
    > = {};
    const now = new Date().toISOString();
    const allLessonIds = new Set<string>([
      ...state.completedLessons,
      ...Object.keys(state.quizScores),
    ]);
    for (const lessonId of allLessonIds) {
      progressMap[lessonId] = {
        is_completed: state.completedLessons.includes(lessonId),
        best_quiz_score:
          typeof state.quizScores[lessonId] === "number"
            ? state.quizScores[lessonId]
            : null,
        updated_at: now,
      };
    }
    window.localStorage.setItem(
      LEGACY_PROGRESS_KEY,
      JSON.stringify(progressMap)
    );
    window.dispatchEvent(new Event("cs-portal-progress-updated"));
  } catch {
    // ignore storage quota or privacy-mode errors
  }
}

function persistState(next: PortalState): PortalState {
  memoryFallbackState = next;

  if (typeof window === "undefined") {
    cachedState = next;
    return next;
  }

  try {
    const serialized = JSON.stringify(next);
    window.localStorage.setItem(PORTAL_STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedState = next;
  } catch {
    cachedRaw = undefined;
    cachedState = next;
  }

  mirrorToLegacyKeys(next);
  window.dispatchEvent(new Event(PORTAL_UPDATED_EVENT));
  return next;
}

export function getPortalSnapshot(): PortalState {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }

  try {
    const raw = window.localStorage.getItem(PORTAL_STORAGE_KEY);
    if (raw !== null && raw === cachedRaw) {
      return cachedState;
    }

    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      const sanitized = sanitizePortalState(parsed);
      cachedRaw = raw;
      cachedState = sanitized;
      memoryFallbackState = sanitized;
      return cachedState;
    }

    // Key does not exist yet: return cached client empty/migrated state if already computed
    if (cachedRaw === null && cachedState !== SERVER_SNAPSHOT) {
      return cachedState;
    }

    const { state, migrated } = readAndMigrateLegacyState();
    if (migrated) {
      try {
        const serialized = JSON.stringify(state);
        window.localStorage.setItem(PORTAL_STORAGE_KEY, serialized);
        cachedRaw = serialized;
      } catch {
        cachedRaw = null;
      }
    } else {
      cachedRaw = null;
    }

    cachedState = state;
    memoryFallbackState = state;
    return cachedState;
  } catch {
    if (!memoryFallbackState) {
      memoryFallbackState = createEmptyClientState();
    }
    return memoryFallbackState;
  }
}

function getServerSnapshot(): PortalState {
  return SERVER_SNAPSHOT;
}

export function subscribePortal(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === PORTAL_STORAGE_KEY ||
      event.key === LEGACY_PROGRESS_KEY ||
      event.key === LEGACY_PROFILE_KEY
    ) {
      cachedRaw = undefined;
      callback();
    }
  };

  const onLocalUpdate = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(PORTAL_UPDATED_EVENT, onLocalUpdate);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PORTAL_UPDATED_EVENT, onLocalUpdate);
  };
}

export function usePortalState(): PortalState {
  return useSyncExternalStore(
    subscribePortal,
    getPortalSnapshot,
    getServerSnapshot
  );
}

// ============================================================================
// Mutator Actions
// ============================================================================

export function saveProfile(profile: {
  name: string;
  year: number;
  dept: PortalDepartment;
  saved?: boolean;
}): PortalState {
  const current = getPortalSnapshot();
  const next: PortalState = {
    ...current,
    profile: {
      name: profile.name.trim(),
      year: sanitizeYear(profile.year, current.profile.year),
      dept: sanitizeDept(profile.dept, current.profile.dept),
      saved: profile.saved ?? true,
    },
  };
  return persistState(next);
}

export function toggleLessonComplete(
  lessonId: string,
  forceValue?: boolean
): boolean {
  const cleanId = lessonId.trim();
  if (!cleanId) return false;

  const current = getPortalSnapshot();
  const exists = current.completedLessons.includes(cleanId);
  const nextCompleted =
    typeof forceValue === "boolean" ? forceValue : !exists;

  if (nextCompleted === exists) {
    return nextCompleted;
  }

  const completedLessons = nextCompleted
    ? [...current.completedLessons, cleanId]
    : current.completedLessons.filter((id) => id !== cleanId);

  persistState({
    ...current,
    completedLessons,
  });

  return nextCompleted;
}

export function saveQuizScore(lessonId: string, score: number): PortalState {
  const cleanId = lessonId.trim();
  if (!cleanId || !Number.isFinite(score)) {
    return getPortalSnapshot();
  }

  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  const current = getPortalSnapshot();
  const prevBest = current.quizScores[cleanId] ?? -1;
  const bestScore = Math.max(prevBest, clamped);

  return persistState({
    ...current,
    quizScores: {
      ...current.quizScores,
      [cleanId]: bestScore,
    },
  });
}

export function setLessonNote(lessonId: string, content: string): PortalState {
  const cleanId = lessonId.trim();
  if (!cleanId) return getPortalSnapshot();

  const current = getPortalSnapshot();
  const nextNotes = { ...current.notes };
  if (content.length === 0) {
    delete nextNotes[cleanId];
  } else {
    nextNotes[cleanId] = content;
  }

  return persistState({
    ...current,
    notes: nextNotes,
  });
}

export function addMistake(item: MistakeItem): boolean {
  const q = item.q.trim();
  const ansText = item.ansText.trim();
  if (!q || !ansText) return false;

  const current = getPortalSnapshot();
  const alreadyExists = current.mistakes.some(
    (m) => m.q === q && (m.courseId === item.courseId || !item.courseId)
  );
  if (alreadyExists) {
    return false;
  }

  const sanitizedItem: MistakeItem = {
    courseId: item.courseId.trim(),
    courseCode: item.courseCode.trim() || "CS",
    ...(item.lessonId?.trim() ? { lessonId: item.lessonId.trim() } : {}),
    q,
    ansText,
  };

  persistState({
    ...current,
    mistakes: [...current.mistakes, sanitizedItem],
  });
  return true;
}

export function removeMistake(indexOrQuestion: number | string): PortalState {
  const current = getPortalSnapshot();
  const nextMistakes =
    typeof indexOrQuestion === "number"
      ? current.mistakes.filter((_, idx) => idx !== indexOrQuestion)
      : current.mistakes.filter((m) => m.q !== indexOrQuestion);

  return persistState({
    ...current,
    mistakes: nextMistakes,
  });
}

export function unlockCourse(courseId: string): boolean {
  const cleanId = courseId.trim();
  if (!cleanId) return false;

  const current = getPortalSnapshot();
  if (current.unlockedCourses.includes(cleanId)) {
    return true;
  }

  persistState({
    ...current,
    unlockedCourses: [...current.unlockedCourses, cleanId],
  });
  return true;
}

export function setExamDate(dateStr: string): PortalState {
  const clean = dateStr.trim();
  const current = getPortalSnapshot();
  return persistState({
    ...current,
    examDate: ISO_DATE_RE.test(clean) ? clean : getDefaultExamDate(),
  });
}

export function setLastVisited(
  entry: Omit<LastVisitedLesson, "visitedAt"> & { visitedAt?: string }
): PortalState {
  const cleanSlug = entry.courseSlug.trim();
  const cleanLesson = entry.lessonId.trim();
  if (!cleanSlug || !cleanLesson) return getPortalSnapshot();
  const current = getPortalSnapshot();
  if (
    current.lastVisited &&
    current.lastVisited.courseSlug === cleanSlug &&
    current.lastVisited.lessonId === cleanLesson
  ) {
    return current;
  }
  return persistState({
    ...current,
    lastVisited: {
      courseSlug: cleanSlug,
      courseCode: entry.courseCode.trim() || "CS",
      courseTitle: entry.courseTitle.trim() || cleanSlug,
      lessonId: cleanLesson,
      lessonTitle: entry.lessonTitle.trim() || entry.courseTitle.trim(),
      visitedAt: entry.visitedAt || new Date().toISOString(),
    },
  });
}

export function exportPortalBackupJson(): string {
  const state = getPortalSnapshot();
  return JSON.stringify(
    {
      schema: "cs_portal_state_v3",
      exportedAt: new Date().toISOString(),
      ...state,
    },
    null,
    2
  );
}

export function importPortalBackupJson(
  rawJson: string
): { ok: true; state: PortalState } | { ok: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(rawJson);
    if (!isRecord(parsed)) {
      return { ok: false, error: "تنسيق النسخة الاحتياطية غير صالح." };
    }
    const sanitized = sanitizePortalState(parsed);
    const saved = persistState(sanitized);
    return { ok: true, state: saved };
  } catch {
    return { ok: false, error: "تعذّر قراءة ملف JSON — تأكد من صحة النص." };
  }
}
