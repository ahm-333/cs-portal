"use client";

import { useSyncExternalStore } from "react";
import type { SessionUser } from "@/lib/auth/session";
import { clearPortalLocalState, getPortalSnapshot } from "@/lib/stores/portalStore";

export type AuthStatus = "loading" | "authenticated" | "guest";

export interface AuthState {
  status: AuthStatus;
  dbConfigured: boolean;
  googleEnabled: boolean;
  user: SessionUser | null;
  syncing: boolean;
  lastSyncedAt: string | null;
}

const SERVER_SNAPSHOT: AuthState = Object.freeze({
  status: "loading",
  dbConfigured: false,
  googleEnabled: false,
  user: null,
  syncing: false,
  lastSyncedAt: null,
});

let currentState: AuthState = {
  status: "loading",
  dbConfigured: false,
  googleEnabled: false,
  user: null,
  syncing: false,
  lastSyncedAt: null,
};

const listeners = new Set<() => void>();
let inFlightMeRequest: Promise<SessionUser | null> | null = null;
let cloudSyncRunner: (() => Promise<boolean>) | null = null;

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function updateState(partial: Partial<AuthState>): void {
  const next: AuthState = { ...currentState, ...partial };
  if (
    next.status === currentState.status &&
    next.dbConfigured === currentState.dbConfigured &&
    next.googleEnabled === currentState.googleEnabled &&
    next.user === currentState.user &&
    next.syncing === currentState.syncing &&
    next.lastSyncedAt === currentState.lastSyncedAt
  ) {
    return;
  }
  currentState = next;
  emitChange();
}

export function subscribeAuth(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getAuthSnapshot(): AuthState {
  return currentState;
}

function getAuthServerSnapshot(): AuthState {
  return SERVER_SNAPSHOT;
}

export function useAuthState(): AuthState {
  return useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );
}

export function setAuthSyncing(syncing: boolean): void {
  updateState({ syncing });
}

export function markAuthSynced(isoTimestamp?: string): void {
  updateState({
    syncing: false,
    lastSyncedAt: isoTimestamp ?? new Date().toISOString(),
  });
}

export function setAuthenticatedUser(
  user: SessionUser | null,
  dbConfigured?: boolean
): void {
  updateState({
    status: user ? "authenticated" : "guest",
    user,
    ...(typeof dbConfigured === "boolean" ? { dbConfigured } : {}),
    ...(user ? {} : { syncing: false, lastSyncedAt: null }),
  });
}

export function registerCloudSyncRunner(
  runner: (() => Promise<boolean>) | null
): void {
  cloudSyncRunner = runner;
}

export async function refreshAuthSession(): Promise<SessionUser | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (inFlightMeRequest) {
    return inFlightMeRequest;
  }

  inFlightMeRequest = (async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        updateState({
          status: "guest",
          user: null,
          syncing: false,
        });
        return null;
      }

      const data = (await res.json()) as {
        ok?: boolean;
        dbConfigured?: boolean;
        googleEnabled?: boolean;
        user?: SessionUser | null;
      };

      const user = data.user ?? null;
      updateState({
        status: user ? "authenticated" : "guest",
        dbConfigured: Boolean(data.dbConfigured),
        googleEnabled: Boolean(data.googleEnabled),
        user,
        ...(user ? {} : { syncing: false, lastSyncedAt: null }),
      });

      return user;
    } catch {
      updateState({
        status: currentState.user ? "authenticated" : "guest",
        syncing: false,
      });
      return currentState.user;
    } finally {
      inFlightMeRequest = null;
    }
  })();

  return inFlightMeRequest;
}

export async function logoutCloudAccount(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    // Still clear client auth state cleanly
  }

  clearPortalLocalState();

  updateState({
    status: "guest",
    user: null,
    syncing: false,
    lastSyncedAt: null,
  });
}

export async function triggerCloudSyncNow(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (currentState.status !== "authenticated" || !currentState.user) {
    return false;
  }

  if (cloudSyncRunner) {
    return cloudSyncRunner();
  }

  // Fallback direct sync if bridge hasn't registered yet
  setAuthSyncing(true);
  try {
    const local = getPortalSnapshot();
    const res = await fetch("/api/sync", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: local.profile,
        completedLessons: local.completedLessons,
        quizScores: local.quizScores,
        notes: local.notes,
        mistakes: local.mistakes,
        examDate: local.examDate,
      }),
    });

    if (!res.ok) {
      setAuthSyncing(false);
      return false;
    }

    markAuthSynced();
    return true;
  } catch {
    setAuthSyncing(false);
    return false;
  }
}
