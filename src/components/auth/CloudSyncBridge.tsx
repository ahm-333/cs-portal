"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  markAuthSynced,
  refreshAuthSession,
  registerCloudSyncRunner,
  setAuthSyncing,
  setAuthenticatedUser,
  useAuthState,
} from "@/lib/stores/authStore";
import {
  getPortalSnapshot,
  importPortalBackupJson,
  PORTAL_UPDATED_EVENT,
  type MistakeItem,
  type PortalDepartment,
  type PortalState,
} from "@/lib/stores/portalStore";

interface CloudSyncResponse {
  ok: boolean;
  profile?: {
    name: string;
    year: number;
    dept: PortalDepartment;
    saved: boolean;
  };
  completedLessons?: string[];
  quizScores?: Record<string, number>;
  notes?: Record<string, string>;
  mistakes?: MistakeItem[];
  examDate?: string;
  unlockedCourses?: string[];
  unlockedLessons?: string[];
}

const SYNC_DEBOUNCE_MS = 1500;

function computeSyncFingerprint(state: PortalState): string {
  const sortedCompleted = [...state.completedLessons].sort();
  const sortedScores = Object.keys(state.quizScores)
    .sort()
    .map((k) => [k, state.quizScores[k]]);
  const sortedNotes = Object.keys(state.notes)
    .sort()
    .map((k) => [k, state.notes[k]]);
  const sortedMistakes = [...state.mistakes]
    .map((m) => `${m.courseId}::${m.courseCode}::${m.lessonId ?? ""}::${m.q}::${m.ansText}`)
    .sort();

  return JSON.stringify({
    profile: state.profile,
    completedLessons: sortedCompleted,
    quizScores: sortedScores,
    notes: sortedNotes,
    mistakes: sortedMistakes,
    examDate: state.examDate,
  });
}

function mergeCloudAndLocal(
  local: PortalState,
  cloud: CloudSyncResponse
): { merged: PortalState; localHadExtras: boolean } {
  // 1. Completed lessons: non-destructive union
  const cloudCompletedSet = new Set(cloud.completedLessons ?? []);
  const mergedCompletedSet = new Set<string>([
    ...cloudCompletedSet,
    ...local.completedLessons,
  ]);
  const localHadExtraCompleted = local.completedLessons.some(
    (id) => !cloudCompletedSet.has(id)
  );

  // 2. Quiz scores: keep max per lesson
  const cloudScores = cloud.quizScores ?? {};
  const mergedQuizScores: Record<string, number> = { ...cloudScores };
  let localHadHigherScore = false;
  for (const [lessonId, localScore] of Object.entries(local.quizScores)) {
    const cloudScore = mergedQuizScores[lessonId];
    if (cloudScore === undefined || localScore > cloudScore) {
      mergedQuizScores[lessonId] = localScore;
      localHadHigherScore = true;
    }
  }

  // 3. Notes: keep cloud notes + any non-empty local notes missing from cloud
  const cloudNotes = cloud.notes ?? {};
  const mergedNotes: Record<string, string> = { ...cloudNotes };
  let localHadExtraNote = false;
  for (const [lessonId, content] of Object.entries(local.notes)) {
    if (content.trim().length === 0) continue;
    if (!mergedNotes[lessonId] || mergedNotes[lessonId].trim().length === 0) {
      mergedNotes[lessonId] = content;
      localHadExtraNote = true;
    }
  }

  // 4. Mistakes: union deduplicated by courseId::q
  const mergedMistakes: MistakeItem[] = [];
  const seenMistakes = new Set<string>();
  const cloudMistakeKeys = new Set<string>();
  for (const m of cloud.mistakes ?? []) {
    const key = `${m.courseId}::${m.q}`;
    if (seenMistakes.has(key)) continue;
    seenMistakes.add(key);
    cloudMistakeKeys.add(key);
    mergedMistakes.push(m);
  }
  let localHadExtraMistake = false;
  for (const m of local.mistakes) {
    const key = `${m.courseId}::${m.q}`;
    if (seenMistakes.has(key)) continue;
    seenMistakes.add(key);
    mergedMistakes.push(m);
    if (!cloudMistakeKeys.has(key)) {
      localHadExtraMistake = true;
    }
  }

  // 5. Unlocked courses: cloud enrollments are authoritative for signed-in users
  const mergedUnlockedCourses = Array.from(
    new Set<string>(cloud.unlockedCourses ?? [])
  );

  // 6. Exam date: prefer cloud if set, else preserve local
  const examDate =
    cloud.examDate && /^\d{4}-\d{2}-\d{2}$/.test(cloud.examDate)
      ? cloud.examDate
      : local.examDate;

  // 7. Profile: cloud profile is authoritative for signed-in student
  const profile = cloud.profile
    ? {
        name: cloud.profile.name,
        year: cloud.profile.year,
        dept: cloud.profile.dept,
        saved: true,
      }
    : local.profile;

  const merged: PortalState = {
    profile,
    completedLessons: Array.from(mergedCompletedSet),
    quizScores: mergedQuizScores,
    notes: mergedNotes,
    mistakes: mergedMistakes,
    unlockedCourses: mergedUnlockedCourses,
    examDate,
    lastVisited: local.lastVisited,
  };

  return {
    merged,
    localHadExtras:
      localHadExtraCompleted ||
      localHadHigherScore ||
      localHadExtraNote ||
      localHadExtraMistake,
  };
}

export function CloudSyncBridge() {
  const auth = useAuthState();
  const suppressLocalEventRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncedUserIdRef = useRef<string | null>(null);
  const lastSyncedFingerprintRef = useRef<string>("");
  const isPushingRef = useRef(false);
  const pendingPushRef = useRef(false);

  const applyPortalStateSilently = useCallback((nextState: PortalState) => {
    suppressLocalEventRef.current = true;
    try {
      importPortalBackupJson(JSON.stringify(nextState));
    } finally {
      suppressLocalEventRef.current = false;
    }
  }, []);

  const pushLocalToCloud = useCallback(
    async (initialAuthoritative = true): Promise<boolean> => {
      if (isPushingRef.current) {
        pendingPushRef.current = true;
        return true;
      }

      isPushingRef.current = true;
      setAuthSyncing(true);
      let authoritative = initialAuthoritative;
      let lastOk = false;

      try {
        do {
          pendingPushRef.current = false;
          const current = getPortalSnapshot();
          const res = await fetch("/api/sync", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              profile: current.profile,
              completedLessons: current.completedLessons,
              quizScores: current.quizScores,
              notes: current.notes,
              mistakes: current.mistakes,
              examDate: current.examDate,
              authoritative,
            }),
          });

          if (res.status === 401) {
            setAuthenticatedUser(null);
            return false;
          }

          if (!res.ok) {
            setAuthSyncing(false);
            return false;
          }

          const data = (await res.json()) as CloudSyncResponse;

          // If server returned newly unlocked courses (e.g. from code redemption / admin),
          // reflect them into local portalStore without triggering another push.
          const latestLocal = getPortalSnapshot();
          const serverUnlocked = data.unlockedCourses ?? [];
          const hasNewUnlock = serverUnlocked.some(
            (id) => !latestLocal.unlockedCourses.includes(id)
          );

          if (hasNewUnlock) {
            applyPortalStateSilently({
              ...latestLocal,
              unlockedCourses: Array.from(
                new Set([...latestLocal.unlockedCourses, ...serverUnlocked])
              ),
            });
          }

          lastSyncedFingerprintRef.current = computeSyncFingerprint(
            getPortalSnapshot()
          );
          lastOk = true;
          authoritative = true;
        } while (pendingPushRef.current);

        markAuthSynced();
        return lastOk;
      } catch {
        setAuthSyncing(false);
        return false;
      } finally {
        isPushingRef.current = false;
      }
    },
    [applyPortalStateSilently]
  );

  // 1. Check active server session once on mount
  useEffect(() => {
    void refreshAuthSession();
  }, []);

  // 2. Register immediate sync runner for triggerCloudSyncNow()
  useEffect(() => {
    registerCloudSyncRunner(async () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return pushLocalToCloud(true);
    });

    return () => {
      registerCloudSyncRunner(null);
    };
  }, [pushLocalToCloud]);

  // 3. Pull & merge cloud state whenever a user becomes authenticated
  useEffect(() => {
    if (auth.status !== "authenticated" || !auth.user) {
      syncedUserIdRef.current = null;
      lastSyncedFingerprintRef.current = "";
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    const activeUserId = auth.user.id;
    if (syncedUserIdRef.current === activeUserId) {
      return;
    }

    let cancelled = false;

    async function pullAndMerge() {
      setAuthSyncing(true);
      try {
        const res = await fetch("/api/sync", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (cancelled) return;

        if (res.status === 401) {
          setAuthenticatedUser(null);
          return;
        }

        if (!res.ok) {
          setAuthSyncing(false);
          return;
        }

        const cloud = (await res.json()) as CloudSyncResponse;
        if (cancelled || !cloud.ok) {
          setAuthSyncing(false);
          return;
        }

        const local = getPortalSnapshot();
        const { merged, localHadExtras } = mergeCloudAndLocal(local, cloud);

        const localCompare = JSON.stringify({
          ...local,
          lastVisited: null,
        });
        const mergedCompare = JSON.stringify({
          ...merged,
          lastVisited: null,
        });

        if (localCompare !== mergedCompare) {
          applyPortalStateSilently(merged);
        }

        syncedUserIdRef.current = activeUserId;
        lastSyncedFingerprintRef.current = computeSyncFingerprint(
          getPortalSnapshot()
        );

        if (localHadExtras) {
          await pushLocalToCloud(false);
        } else {
          markAuthSynced();
        }
      } catch {
        if (!cancelled) {
          setAuthSyncing(false);
        }
      }
    }

    void pullAndMerge();

    return () => {
      cancelled = true;
    };
  }, [auth.status, auth.user, applyPortalStateSilently, pushLocalToCloud]);

  // 4. Debounced push whenever local portalStore updates for an authenticated user
  useEffect(() => {
    if (auth.status !== "authenticated" || !auth.user) {
      return;
    }

    const activeUserId = auth.user.id;

    const handlePortalUpdate = () => {
      if (suppressLocalEventRef.current) {
        return;
      }
      if (syncedUserIdRef.current !== activeUserId) {
        return;
      }

      const nextFingerprint = computeSyncFingerprint(getPortalSnapshot());
      if (nextFingerprint === lastSyncedFingerprintRef.current) {
        return;
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        void pushLocalToCloud(true);
      }, SYNC_DEBOUNCE_MS);
    };

    window.addEventListener(PORTAL_UPDATED_EVENT, handlePortalUpdate);
    return () => {
      window.removeEventListener(PORTAL_UPDATED_EVENT, handlePortalUpdate);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [auth.status, auth.user, pushLocalToCloud]);

  return null;
}
