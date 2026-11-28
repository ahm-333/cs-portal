"use client";

export const PORTAL_EVENTS = {
  TOAST: "cs-portal-toast",
  OPEN_CMDK: "cs-portal-open-cmdk",
  OPEN_PROFILE: "cs-portal-open-profile",
  OPEN_MISTAKES: "cs-portal-open-mistakes",
  OPEN_FEEDBACK: "cs-portal-open-feedback",
  OPEN_UNLOCK: "cs-portal-open-unlock",
} as const;

export type PortalEventName = (typeof PORTAL_EVENTS)[keyof typeof PORTAL_EVENTS];

export interface ToastEventDetail {
  message: string;
}

export interface UnlockModalEventDetail {
  courseId: string;
  courseTitle: string;
  courseCode: string;
  unlockCode?: string;
  price?: number;
}

function dispatchPortalEvent<T = undefined>(name: PortalEventName, detail?: T): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    detail === undefined
      ? new CustomEvent(name)
      : new CustomEvent<T>(name, { detail })
  );
}

export function emitToast(message: string): void {
  dispatchPortalEvent<ToastEventDetail>(PORTAL_EVENTS.TOAST, { message });
}

export function openCommandPalette(): void {
  dispatchPortalEvent(PORTAL_EVENTS.OPEN_CMDK);
}

export function openProfileModal(): void {
  dispatchPortalEvent(PORTAL_EVENTS.OPEN_PROFILE);
}

export function openMistakeBankModal(): void {
  dispatchPortalEvent(PORTAL_EVENTS.OPEN_MISTAKES);
}

export function openFeedbackModal(): void {
  dispatchPortalEvent(PORTAL_EVENTS.OPEN_FEEDBACK);
}

export function openUnlockModal(detail: UnlockModalEventDetail): void {
  dispatchPortalEvent<UnlockModalEventDetail>(PORTAL_EVENTS.OPEN_UNLOCK, detail);
}
