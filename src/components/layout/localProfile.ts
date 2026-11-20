"use client";

import { useSyncExternalStore } from "react";

export type StudentDepartment = "CS" | "AI" | "IS" | "IT";

export interface LocalStudentProfile {
  full_name: string;
  year_level: number;
  department: StudentDepartment;
}

export const LOCAL_PROFILE_STORAGE_KEY = "cs_portal_profile";
export const LOCAL_PROFILE_UPDATED_EVENT = "cs-portal-profile-updated";

export const DEPARTMENTS: ReadonlyArray<{
  value: StudentDepartment;
  label: string;
  shortLabel: string;
}> = [
  { value: "CS", label: "علوم الحاسب (CS)", shortLabel: "CS" },
  { value: "AI", label: "الذكاء الاصطناعي (AI)", shortLabel: "AI" },
  { value: "IS", label: "نظم المعلومات (IS)", shortLabel: "IS" },
  { value: "IT", label: "تكنولوجيا المعلومات (IT)", shortLabel: "IT" },
];

const VALID_DEPARTMENTS = new Set<string>(["CS", "AI", "IS", "IT"]);

let cachedRaw: string | null | undefined = undefined;
let cachedProfile: LocalStudentProfile | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseProfileRaw(raw: string): LocalStudentProfile | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;

    const fullName =
      typeof parsed.full_name === "string" ? parsed.full_name.trim() : "";
    if (!fullName) return null;

    const yearRaw =
      typeof parsed.year_level === "number"
        ? parsed.year_level
        : Number(parsed.year_level);
    const yearLevel =
      Number.isInteger(yearRaw) && yearRaw >= 1 && yearRaw <= 4 ? yearRaw : 1;

    const deptRaw =
      typeof parsed.department === "string"
        ? parsed.department.toUpperCase()
        : "CS";
    const department: StudentDepartment = VALID_DEPARTMENTS.has(deptRaw)
      ? (deptRaw as StudentDepartment)
      : "CS";

    return {
      full_name: fullName,
      year_level: yearLevel,
      department,
    };
  } catch {
    return null;
  }
}

function getProfileSnapshot(): LocalStudentProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_PROFILE_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedProfile;
    }
    cachedRaw = raw;
    cachedProfile = raw ? parseProfileRaw(raw) : null;
    return cachedProfile;
  } catch {
    return null;
  }
}

function getServerSnapshot(): LocalStudentProfile | null {
  return null;
}

function subscribeProfile(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === LOCAL_PROFILE_STORAGE_KEY) {
      callback();
    }
  };

  const onCustomUpdate = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_PROFILE_UPDATED_EVENT, onCustomUpdate);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_PROFILE_UPDATED_EVENT, onCustomUpdate);
  };
}

export function saveLocalProfile(profile: LocalStudentProfile): void {
  if (typeof window === "undefined") return;

  const sanitized: LocalStudentProfile = {
    full_name: profile.full_name.trim(),
    year_level:
      Number.isInteger(profile.year_level) &&
      profile.year_level >= 1 &&
      profile.year_level <= 4
        ? profile.year_level
        : 1,
    department: VALID_DEPARTMENTS.has(profile.department)
      ? profile.department
      : "CS",
  };

  const serialized = JSON.stringify(sanitized);
  window.localStorage.setItem(LOCAL_PROFILE_STORAGE_KEY, serialized);
  cachedRaw = serialized;
  cachedProfile = sanitized;
  window.dispatchEvent(new Event(LOCAL_PROFILE_UPDATED_EVENT));
}

export function clearLocalProfile(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(LOCAL_PROFILE_STORAGE_KEY);
  cachedRaw = null;
  cachedProfile = null;
  window.dispatchEvent(new Event(LOCAL_PROFILE_UPDATED_EVENT));
}

export function useLocalProfile(): LocalStudentProfile | null {
  return useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getServerSnapshot
  );
}
