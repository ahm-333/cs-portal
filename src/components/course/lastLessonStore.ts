"use client";

import { useSyncExternalStore } from "react";

export interface LastVisitedLesson {
  slug: string;
  courseTitle: string;
  courseCode: string;
  lessonId: string;
  lessonTitle: string;
  sectionTitle: string;
  visitedAt: string;
}

const STORAGE_KEY = "cs_portal_last_lesson";
const UPDATE_EVENT = "cs-portal-last-lesson-updated";

let cachedRaw: string | null = null;
let cachedValue: LastVisitedLesson | null = null;

function getSnapshot(): LastVisitedLesson | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    if (!raw) {
      cachedValue = null;
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<LastVisitedLesson>;
    if (
      typeof parsed.slug === "string" &&
      typeof parsed.lessonId === "string" &&
      typeof parsed.lessonTitle === "string"
    ) {
      cachedValue = {
        slug: parsed.slug,
        courseTitle: parsed.courseTitle ?? parsed.slug,
        courseCode: parsed.courseCode ?? "CS",
        lessonId: parsed.lessonId,
        lessonTitle: parsed.lessonTitle,
        sectionTitle: parsed.sectionTitle ?? "",
        visitedAt: parsed.visitedAt ?? new Date().toISOString(),
      };
      return cachedValue;
    }
    cachedValue = null;
    return null;
  } catch {
    return null;
  }
}

export function saveLastLesson(entry: Omit<LastVisitedLesson, "visitedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: LastVisitedLesson = {
      ...entry,
      visitedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    cachedRaw = null;
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // ignore storage errors
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useLastLesson(): LastVisitedLesson | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
