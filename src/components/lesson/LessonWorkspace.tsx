"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ClipboardCheck,
  Clock,
  FileText,
  FlaskConical,
  Home,
  ListTree,
  Lock,
  Trophy,
  X,
} from "lucide-react";
import type {
  Course,
  CurrentUser,
  Lesson,
  LessonInteractiveMeta,
  LessonSummaryItem,
  Question,
  UserProgress,
} from "@/types/database";
import CompleteButton from "./CompleteButton";
import InteractiveViewer from "./InteractiveViewer";
import LessonSidebar from "./LessonSidebar";
import MarkdownViewer from "./MarkdownViewer";
import QuizEngine from "./QuizEngine";
import ResourcesList from "./ResourcesList";
import VideoPlayer from "./VideoPlayer";

interface LessonWorkspaceProps {
  course: Course;
  lesson: Lesson;
  isEnrolled?: boolean;
  allLessons: LessonSummaryItem[];
  interactives: LessonInteractiveMeta[];
  questions: Question[];
  initialProgressMap: Record<string, UserProgress>;
  currentUser: CurrentUser | null;
}

type StudyTab = "summary" | "lab" | "resources" | "quiz";

const LOCAL_STORAGE_KEY = "cs_portal_progress";
const LOCAL_STORAGE_EVENT = "cs-portal-progress-updated";

interface StoredLessonProgress {
  is_completed: boolean;
  best_quiz_score: number | null;
  updated_at: string;
}

function subscribeLocalProgress(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(LOCAL_STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(LOCAL_STORAGE_EVENT, handler);
  };
}

function getLocalProgressSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(LOCAL_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerProgressSnapshot(): string {
  return "";
}

function parseLocalProgress(raw: string): Record<string, StoredLessonProgress> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    const result: Record<string, StoredLessonProgress> = {};
    for (const [lessonId, value] of Object.entries(
      parsed as Record<string, unknown>
    )) {
      if (typeof value === "object" && value !== null) {
        const entry = value as Record<string, unknown>;
        const isCompleted =
          typeof entry.is_completed === "boolean" ? entry.is_completed : false;
        const bestScore =
          typeof entry.best_quiz_score === "number"
            ? entry.best_quiz_score
            : null;
        const updatedAt =
          typeof entry.updated_at === "string"
            ? entry.updated_at
            : new Date().toISOString();
        result[lessonId] = {
          is_completed: isCompleted,
          best_quiz_score: bestScore,
          updated_at: updatedAt,
        };
      }
    }
    return result;
  } catch {
    return {};
  }
}

function writeLocalProgress(
  lessonId: string,
  update: { is_completed?: boolean; best_quiz_score?: number | null }
): void {
  if (typeof window === "undefined") return;
  try {
    const existingMap = parseLocalProgress(getLocalProgressSnapshot());
    const prev = existingMap[lessonId];
    const nextBestScore =
      update.best_quiz_score !== undefined
        ? Math.max(prev?.best_quiz_score ?? 0, update.best_quiz_score ?? 0)
        : (prev?.best_quiz_score ?? null);

    existingMap[lessonId] = {
      is_completed:
        update.is_completed !== undefined
          ? update.is_completed
          : (prev?.is_completed ?? false),
      best_quiz_score:
        update.best_quiz_score === null && prev?.best_quiz_score == null
          ? null
          : nextBestScore,
      updated_at: new Date().toISOString(),
    };

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingMap));
    window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
  } catch {
    // Ignore storage quota or private-browsing errors
  }
}

export default function LessonWorkspace({
  course,
  lesson,
  isEnrolled: isEnrolledProp,
  allLessons,
  interactives,
  questions,
  initialProgressMap,
  currentUser,
}: LessonWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<StudyTab>("summary");
  const [hasOpenedLab, setHasOpenedLab] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [optimisticOverrides, setOptimisticOverrides] = useState<
    Record<string, UserProgress>
  >({});

  const isGuestMode = currentUser === null;
  const isEnrolled =
    isEnrolledProp ?? (!course.is_paid || !lesson.is_free_preview);

  const rawLocalProgress = useSyncExternalStore(
    subscribeLocalProgress,
    getLocalProgressSnapshot,
    getServerProgressSnapshot
  );

  const progressMap = useMemo<Record<string, UserProgress>>(() => {
    const merged: Record<string, UserProgress> = { ...initialProgressMap };

    if (isGuestMode && rawLocalProgress) {
      const stored = parseLocalProgress(rawLocalProgress);
      for (const [id, item] of Object.entries(stored)) {
        const current = merged[id];
        merged[id] = {
          id: current?.id ?? `local-${id}`,
          user_id: current?.user_id ?? "guest",
          lesson_id: id,
          is_completed: item.is_completed,
          best_quiz_score:
            item.best_quiz_score !== null
              ? Math.max(current?.best_quiz_score ?? 0, item.best_quiz_score)
              : (current?.best_quiz_score ?? null),
          updated_at: item.updated_at,
        };
      }
    }

    for (const [id, override] of Object.entries(optimisticOverrides)) {
      merged[id] = override;
    }

    return merged;
  }, [initialProgressMap, isGuestMode, rawLocalProgress, optimisticOverrides]);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileDrawerOpen]);

  const sortedLessons = useMemo(
    () => [...allLessons].sort((a, b) => a.order_index - b.order_index),
    [allLessons]
  );

  const currentLessonIndex = useMemo(
    () => sortedLessons.findIndex((item) => item.id === lesson.id),
    [sortedLessons, lesson.id]
  );

  const prevLesson =
    currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < sortedLessons.length - 1
      ? sortedLessons[currentLessonIndex + 1]
      : null;

  const currentProgress = progressMap[lesson.id];
  const isCompleted = Boolean(currentProgress?.is_completed);
  const currentBestScore = currentProgress?.best_quiz_score ?? null;

  const handleToggleComplete = useCallback(
    (nextCompleted: boolean) => {
      const now = new Date().toISOString();
      if (isGuestMode) {
        writeLocalProgress(lesson.id, { is_completed: nextCompleted });
        return;
      }

      setOptimisticOverrides((prev) => {
        const existing = prev[lesson.id] ?? initialProgressMap[lesson.id];
        return {
          ...prev,
          [lesson.id]: {
            id: existing?.id ?? `local-${lesson.id}`,
            user_id: existing?.user_id ?? currentUser?.id ?? "guest",
            lesson_id: lesson.id,
            is_completed: nextCompleted,
            best_quiz_score: existing?.best_quiz_score ?? null,
            updated_at: now,
          },
        };
      });
    },
    [lesson.id, currentUser?.id, initialProgressMap, isGuestMode]
  );

  const handleScoreUpdate = useCallback(
    (score: number) => {
      const now = new Date().toISOString();
      if (isGuestMode) {
        writeLocalProgress(lesson.id, { best_quiz_score: score });
        return;
      }

      setOptimisticOverrides((prev) => {
        const existing = prev[lesson.id] ?? initialProgressMap[lesson.id];
        const nextBest = Math.max(existing?.best_quiz_score ?? 0, score);
        return {
          ...prev,
          [lesson.id]: {
            id: existing?.id ?? `local-${lesson.id}`,
            user_id: existing?.user_id ?? currentUser?.id ?? "guest",
            lesson_id: lesson.id,
            is_completed: existing?.is_completed ?? false,
            best_quiz_score: nextBest,
            updated_at: now,
          },
        };
      });
    },
    [lesson.id, currentUser?.id, initialProgressMap, isGuestMode]
  );

  function handleTabSelect(tab: StudyTab) {
    setActiveTab(tab);
    if (tab === "lab") {
      setHasOpenedLab(true);
    }
  }

  const completedTotal = useMemo(
    () =>
      sortedLessons.filter((item) => progressMap[item.id]?.is_completed).length,
    [sortedLessons, progressMap]
  );

  const resourcesCount = lesson.resources?.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Mobile curriculum trigger bar */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-slate-200">
            {course.title}
          </p>
          <p className="text-[11px] text-slate-400">
            أنجزت {completedTotal} من {sortedLessons.length} دروس
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-bold text-indigo-200 transition-colors hover:bg-indigo-500/25"
        >
          <ListTree className="h-4 w-4" />
          <span>محتوى المادة</span>
        </button>
      </div>

      {/* Mobile slide-over curriculum drawer */}
      {mobileDrawerOpen ? (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="فهرس دروس المادة"
        >
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col border-e border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="text-sm font-bold text-slate-100">
                محتوى المادة
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="إغلاق القائمة"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <LessonSidebar
                course={course}
                lessons={sortedLessons}
                activeLessonId={lesson.id}
                progressMap={progressMap}
                isEnrolled={isEnrolled}
                onNavigate={() => setMobileDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Main 2-column study grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Desktop sticky sidebar */}
        <div className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <LessonSidebar
            course={course}
            lessons={sortedLessons}
            activeLessonId={lesson.id}
            progressMap={progressMap}
            isEnrolled={isEnrolled}
          />
        </div>

        {/* Main study column */}
        <div className="min-w-0 space-y-6">
          {/* Breadcrumb */}
          <nav
            aria-label="مسار التنقل"
            className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-400 sm:text-sm"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-indigo-300"
            >
              <Home className="h-3.5 w-3.5" />
              <span>الرئيسية</span>
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
            <Link
              href={`/courses/${course.slug}`}
              className="truncate transition-colors hover:text-indigo-300"
            >
              {course.title}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
            <span className="truncate font-semibold text-slate-200">
              {lesson.title}
            </span>
          </nav>

          {/* Lesson Header + Complete Toggle */}
          <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:flex-row sm:items-center">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 font-semibold text-indigo-300">
                  {lesson.section_title}
                </span>

                {lesson.duration_minutes ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 px-2.5 py-0.5 text-slate-300">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{lesson.duration_minutes} دقيقة</span>
                  </span>
                ) : null}

                {course.is_paid && lesson.is_free_preview ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-300">
                    معاينة مجانية
                  </span>
                ) : null}

                {isGuestMode ? (
                  <span className="rounded-full border border-slate-800 bg-slate-950/70 px-2.5 py-0.5 text-slate-400">
                    حفظ محلي للتقدم
                  </span>
                ) : null}
              </div>

              <h1 className="text-xl font-extrabold leading-snug text-slate-50 sm:text-2xl">
                {lesson.title}
              </h1>
            </div>

            <div className="shrink-0">
              <CompleteButton
                lessonId={lesson.id}
                isCompleted={isCompleted}
                onToggle={handleToggleComplete}
              />
            </div>
          </header>

          {/* Video Player */}
          <VideoPlayer
            provider={lesson.video_provider}
            videoId={lesson.video_id}
            title={lesson.title}
          />

          {/* 4-Tab Study Bar */}
          <section aria-label="أدوات مذاكرة الدرس" className="space-y-4">
            <div
              role="tablist"
              aria-label="أقسام الدرس"
              className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5"
            >
              <button
                type="button"
                role="tab"
                id="tab-summary"
                aria-selected={activeTab === "summary"}
                aria-controls="panel-summary"
                onClick={() => handleTabSelect("summary")}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  activeTab === "summary"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>الملخص والأكواد</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-lab"
                aria-selected={activeTab === "lab"}
                aria-controls="panel-lab"
                onClick={() => handleTabSelect("lab")}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  activeTab === "lab"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <FlaskConical className="h-4 w-4" />
                <span>الشرح التفاعلي (Lab)</span>
                {interactives.length > 0 ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      activeTab === "lab"
                        ? "bg-white/20 text-white"
                        : "bg-indigo-500/20 text-indigo-300"
                    }`}
                  >
                    {interactives.length}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                role="tab"
                id="tab-resources"
                aria-selected={activeTab === "resources"}
                aria-controls="panel-resources"
                onClick={() => handleTabSelect("resources")}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  activeTab === "resources"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>المصادر</span>
                {resourcesCount > 0 ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      activeTab === "resources"
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {resourcesCount}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                role="tab"
                id="tab-quiz"
                aria-selected={activeTab === "quiz"}
                aria-controls="panel-quiz"
                onClick={() => handleTabSelect("quiz")}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                <span>الكويز</span>
                {questions.length > 0 ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      activeTab === "quiz"
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {questions.length}
                  </span>
                ) : null}
                {currentBestScore !== null ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      activeTab === "quiz"
                        ? "bg-emerald-400/25 text-emerald-100"
                        : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    <Trophy className="h-3 w-3" />
                    <span>{currentBestScore}%</span>
                  </span>
                ) : null}
              </button>
            </div>

            {/* Tab Panels */}
            <div
              id="panel-summary"
              role="tabpanel"
              aria-labelledby="tab-summary"
              hidden={activeTab !== "summary"}
            >
              {activeTab === "summary" ? (
                <MarkdownViewer content={lesson.summary_md} />
              ) : null}
            </div>

            {/* Interactive Lab is strictly lazy-mounted only after clicking the Lab tab, then kept alive to preserve cache & state */}
            <div
              id="panel-lab"
              role="tabpanel"
              aria-labelledby="tab-lab"
              hidden={activeTab !== "lab"}
            >
              {hasOpenedLab ? (
                <InteractiveViewer interactives={interactives} />
              ) : null}
            </div>

            <div
              id="panel-resources"
              role="tabpanel"
              aria-labelledby="tab-resources"
              hidden={activeTab !== "resources"}
            >
              {activeTab === "resources" ? (
                <ResourcesList resources={lesson.resources} />
              ) : null}
            </div>

            <div
              id="panel-quiz"
              role="tabpanel"
              aria-labelledby="tab-quiz"
              hidden={activeTab !== "quiz"}
            >
              {activeTab === "quiz" ? (
                <QuizEngine
                  lessonId={lesson.id}
                  questions={questions}
                  bestScore={currentBestScore}
                  onScoreUpdate={handleScoreUpdate}
                />
              ) : null}
            </div>
          </section>

          {/* Prev / Next Lesson Navigation */}
          <nav
            aria-label="التنقل بين الدروس"
            className="grid grid-cols-1 gap-3 border-t border-slate-800 pt-6 sm:grid-cols-2"
          >
            {prevLesson ? (
              <Link
                href={`/courses/${course.slug}/${prevLesson.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-indigo-500/50 hover:bg-slate-900"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 transition-colors group-hover:border-indigo-500/40 group-hover:text-indigo-300">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">الدرس السابق</p>
                  <p className="truncate text-sm font-bold text-slate-100 group-hover:text-indigo-200">
                    {prevLesson.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${course.slug}/${nextLesson.id}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-end transition-all hover:border-indigo-500/50 hover:bg-slate-900"
              >
                <div className="min-w-0 flex-1">
                  <p className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <span>الدرس التالي</span>
                    {course.is_paid &&
                    !nextLesson.is_free_preview &&
                    !isEnrolled ? (
                      <Lock className="h-3 w-3 text-amber-400" />
                    ) : null}
                  </p>
                  <p className="truncate text-sm font-bold text-slate-100 group-hover:text-indigo-200">
                    {nextLesson.title}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 transition-colors group-hover:border-indigo-500/40 group-hover:text-indigo-300">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </div>
  );
}
