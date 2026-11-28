"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  BookOpenText,
  Box,
  Check,
  ChevronLeft,
  CircuitBoard,
  Clock,
  Cpu,
  Database,
  FileText,
  GitFork,
  HelpCircle,
  Lock,
  LogIn,
  LogOut,
  MessageSquarePlus,
  Moon,
  PlayCircle,
  Search,
  Shield,
  Sparkles,
  Star,
  Sun,
  User,
  Workflow,
  X,
} from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { BroadcastBanner } from "@/components/layout/BroadcastBanner";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomDock } from "@/components/layout/MobileBottomDock";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { logoutCloudAccount, useAuthState } from "@/lib/stores/authStore";
import {
  emitToast,
  openCommandPalette,
  openFeedbackModal,
  openUnlockModal,
} from "@/lib/stores/events";
import { usePortalState } from "@/lib/stores/portalStore";
import type { CourseWithStats } from "@/types/database";

export interface CourseLessonPreview {
  id: string;
  title: string;
  title_en?: string;
  duration_minutes: number | null;
  is_free_preview: boolean;
  order_index: number;
  questionsCount: number;
}

export interface CoursesHubClientProps {
  courses: CourseWithStats[];
  courseLessonIdsMap: Record<string, string[]>;
  courseLessonsMap?: Record<string, CourseLessonPreview[]>;
  totalLessons: number;
}

type FilterMode =
  | "all"
  | "my-year"
  | "in-progress"
  | "free"
  | "paid"
  | `year-${number}`;

function CourseIcon({
  icon,
  className = "w-[18px] h-[18px]",
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "git-fork":
      return <GitFork className={className} />;
    case "workflow":
      return <Workflow className={className} />;
    case "cpu":
      return <Cpu className={className} />;
    case "circuit-board":
      return <CircuitBoard className={className} />;
    case "database":
      return <Database className={className} />;
    case "box":
      return <Box className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

function getChaptersUnit(total: number): string {
  if (total === 1) return "فصل";
  if (total === 2) return "فصلان";
  if (total >= 3 && total <= 10) return "فصول";
  return "فصل";
}

function getVideosLabel(count: number): string {
  if (count === 0) return "قريباً";
  if (count === 1) return "فيديو واحد";
  if (count === 2) return "فيديوهان";
  if (count >= 3 && count <= 10) return `${count} فيديوهات`;
  return `${count} فيديو`;
}

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ط";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function truncateChapterTitle(title: string, maxLen = 22): string {
  const trimmed = title.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen).trim()}…`;
}

interface ProgressRingProps {
  pct: number;
  isSoon: boolean;
  isSelected: boolean;
  isDark: boolean;
}

function MiniSwissProgressRing({
  pct,
  isSoon,
  isSelected,
  isDark,
}: ProgressRingProps) {
  const size = 40;
  const strokeWidth = 2.6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = isSoon ? 0 : Math.min(100, Math.max(0, pct));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  const isComplete = !isSoon && clampedPct === 100;

  const trackColor = isDark
    ? "rgba(255, 245, 230, 0.09)"
    : "rgba(22, 40, 71, 0.1)";

  const arcColor = isComplete
    ? isDark
      ? "#6ec4a3"
      : "#15664b"
    : isDark
      ? "#d8b07a"
      : isSelected
        ? "#162847"
        : "#c25e33";

  const labelColor = isSoon
    ? isDark
      ? "#d8b07a"
      : "#c25e33"
    : isComplete
      ? isDark
        ? "#6ec4a3"
        : "#15664b"
      : isSelected
        ? isDark
          ? "#f6f4ef"
          : "#162847"
        : "var(--text-muted)";

  return (
    <div
      className="relative w-10 h-10 shrink-0 flex items-center justify-center"
      aria-label={isSoon ? "قريباً" : `نسبة الإنجاز ${clampedPct}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {clampedPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        )}
      </svg>
      <span
        dir="ltr"
        className="absolute inset-0 flex items-center justify-center font-mono-code font-extrabold select-none"
        style={{
          color: labelColor,
          fontSize: isSoon ? "8px" : isComplete ? "13px" : "9.5px",
          letterSpacing: isSoon ? "0.04em" : undefined,
        }}
      >
        {isSoon ? "SOON" : isComplete ? "✓" : `${clampedPct}%`}
      </span>
    </div>
  );
}

interface CourseInspectorContentProps {
  course: CourseWithStats;
  lessons: CourseLessonPreview[];
  completedLessons: string[];
  isUnlocked: boolean;
  lastVisitedLessonId: string | null;
  isDark: boolean;
  onNavigate?: () => void;
}

function CourseInspectorContent({
  course,
  lessons,
  completedLessons,
  isUnlocked,
  lastVisitedLessonId,
  isDark,
  onNavigate,
}: CourseInspectorContentProps) {
  const totalLessons = lessons.length > 0 ? lessons.length : course.lesson_count;
  const isPreparedShell = totalLessons === 0;

  const completedCount =
    lessons.length > 0
      ? lessons.filter((l) => completedLessons.includes(l.id)).length
      : (course.completed_count ?? 0);

  const pct =
    totalLessons > 0
      ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
      : 0;

  const totalQuestions = lessons.reduce((sum, l) => sum + l.questionsCount, 0);

  const isLessonAccessible = (lesson: CourseLessonPreview) =>
    !course.is_paid || isUnlocked || lesson.is_free_preview;

  // Pick smart primary target chapter: lastVisited in this course -> first uncompleted accessible -> first accessible
  const lastVisitedInCourse = lastVisitedLessonId
    ? lessons.find((l) => l.id === lastVisitedLessonId && isLessonAccessible(l))
    : undefined;

  const firstUncompletedAccessible = lessons.find(
    (l) => !completedLessons.includes(l.id) && isLessonAccessible(l)
  );

  const firstAccessible = lessons.find((l) => isLessonAccessible(l));

  const targetLesson =
    lastVisitedInCourse ?? firstUncompletedAccessible ?? firstAccessible ?? null;

  const primaryHref = targetLesson
    ? `/courses/${course.slug}/${targetLesson.id}`
    : `/courses/${course.slug}`;

  const summaryHref = targetLesson
    ? `/courses/${course.slug}/${targetLesson.id}?tab=summary`
    : `/courses/${course.slug}`;

  const primaryCtaLabel = (() => {
    if (isPreparedShell) return "استعراض صفحة المادة";
    if (lastVisitedInCourse) {
      return `استكمال: ${truncateChapterTitle(lastVisitedInCourse.title, 20)}`;
    }
    if (completedCount > 0 && targetLesson) {
      const idx = lessons.findIndex((l) => l.id === targetLesson.id) + 1;
      return `استكمال الفصل ${String(idx).padStart(2, "0")}`;
    }
    if (course.is_paid && !isUnlocked && firstAccessible) {
      return "ابدأ الفصل المجاني";
    }
    return "ابدأ المادة";
  })();

  const handleOpenSubscribe = () => {
    onNavigate?.();
    openUnlockModal({
      courseId: course.id,
      courseTitle: course.title,
      courseCode: course.code,
      unlockCode: course.unlock_code ?? "",
    });
  };

  // Both Dark (Brushed Obsidian) and Light (Deep Architectural Navy Focal Jewel)
  // render crisp luminous ink over a rich architectural dark surface.
  const accentGold = isDark ? "#d8b07a" : "#ebd0a2";
  const accentMint = isDark ? "#6ec4a3" : "#80dec0";
  const subtleSurface = isDark
    ? "rgba(255, 245, 230, 0.04)"
    : "rgba(255, 255, 255, 0.065)";
  const subtleBorder = isDark
    ? "rgba(255, 245, 230, 0.09)"
    : "rgba(255, 255, 255, 0.12)";
  const chapterHoverBg = isDark
    ? "hover:bg-white/[0.06] hover:border-[#d8b07a]/35"
    : "hover:bg-white/[0.11] hover:border-[#ebd0a2]/45";

  const pillars = [
    {
      icon: PlayCircle,
      label: "فيديو الشرح",
      value: getVideosLabel(lessons.length),
    },
    {
      icon: BookOpenText,
      label: "اقرأ الفصل",
      value: isPreparedShell ? "قريباً" : `${lessons.length} شرح مقروء`,
    },
    {
      icon: FileText,
      label: "ملخص سريع",
      value: isPreparedShell ? "قريباً" : `${lessons.length} ملخص سريع`,
    },
    {
      icon: HelpCircle,
      label: "أسئلة وكويزات",
      value:
        totalQuestions > 0
          ? `${totalQuestions} سؤال وكويز`
          : isPreparedShell
            ? "قريباً"
            : "كويزات تفاعلية",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Header Row: Code + Year + Completion Badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            dir="ltr"
            className="font-mono-code text-[11px] font-extrabold px-2.5 py-1 rounded-lg border"
            style={{
              background: isDark
                ? "rgba(216, 176, 122, 0.13)"
                : "rgba(235, 208, 162, 0.16)",
              borderColor: isDark
                ? "rgba(216, 176, 122, 0.32)"
                : "rgba(235, 208, 162, 0.32)",
              color: accentGold,
            }}
          >
            {course.code}
          </span>
          <span className="text-[11.5px] font-bold text-white/70">
            الفرقة <span className="font-en">{course.year_level}</span> · الترم{" "}
            <span className="font-en">{course.term}</span>
          </span>
        </div>

        <span
          dir="ltr"
          className="font-mono-code text-[11px] font-extrabold px-2.5 py-1 rounded-full"
          style={{
            background: isPreparedShell
              ? "rgba(216, 176, 122, 0.14)"
              : pct === 100
                ? "rgba(110, 196, 163, 0.18)"
                : "rgba(255, 255, 255, 0.08)",
            color: isPreparedShell
              ? accentGold
              : pct > 0
                ? accentMint
                : "rgba(255, 255, 255, 0.78)",
          }}
        >
          {isPreparedShell ? "SOON" : `${pct}% DONE`}
        </span>
      </div>

      {/* Course Title & Arabic Description */}
      <div className="space-y-1.5">
        <h2 className="font-en text-right text-[20px] sm:text-[22px] font-black tracking-tight text-white leading-snug">
          {course.title_en}
        </h2>
        <div className="flex items-center gap-2 text-[13px] font-extrabold" style={{ color: accentGold }}>
          <span>{course.title}</span>
          {!isPreparedShell && (
            <>
              <span className="opacity-40">·</span>
              <span className="text-[12px] font-semibold text-white/70 inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.duration_minutes} دقيقة
              </span>
            </>
          )}
        </div>
        {course.description && (
          <p className="text-[12.5px] leading-relaxed text-white/72 pt-0.5">
            {course.description}
          </p>
        )}
      </div>

      {/* 4-Pillar Real Summary Grid */}
      <div className="grid grid-cols-2 gap-2">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.label}
              className="rounded-xl px-3 py-2.5 border flex items-center gap-2.5"
              style={{
                background: subtleSurface,
                borderColor: subtleBorder,
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(216, 176, 122, 0.12)",
                  color: accentGold,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold text-white/55 truncate">
                  {pillar.label}
                </div>
                <div className="text-[11.5px] font-extrabold text-white/95 truncate">
                  {pillar.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct 1-Click Chapter List */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11.5px] font-extrabold text-white/85">
            فصول المادة — اضغط للدخول مباشرة
          </span>
          {!isPreparedShell && (
            <span className="font-mono-code text-[10.5px] font-bold text-white/55">
              {completedCount}/{totalLessons}
            </span>
          )}
        </div>

        {lessons.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-5 text-center space-y-1.5"
            style={{
              background: subtleSurface,
              borderColor: subtleBorder,
            }}
          >
            <div className="text-[13px] font-extrabold text-white">
              جاري تجهيز فصول هذه المادة قريباً
            </div>
            <p className="text-[11.5px] text-white/65 leading-relaxed">
              تقدر تقترح أولوية رفعها عشان نبدأ بيها في الدفعة الجاية.
            </p>
          </div>
        ) : (
          <div
            data-lenis-prevent
            className="space-y-1.5 max-h-[250px] overflow-y-auto pl-0.5"
          >
            {lessons.map((lesson, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              const isCompleted = completedLessons.includes(lesson.id);
              const isLastVisited = lastVisitedLessonId === lesson.id;
              const isLocked =
                course.is_paid && !isUnlocked && !lesson.is_free_preview;
              const showFreeTag =
                course.is_paid && !isUnlocked && lesson.is_free_preview;

              const rowInner = (
                <>
                  {/* Status Indicator */}
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono-code text-[11px] font-extrabold transition-colors"
                    style={
                      isCompleted
                        ? {
                            background: "rgba(110, 196, 163, 0.2)",
                            color: accentMint,
                            border: "1px solid rgba(110, 196, 163, 0.35)",
                          }
                        : isLocked
                          ? {
                              background: "rgba(255, 255, 255, 0.05)",
                              color: "rgba(255, 255, 255, 0.42)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }
                          : isLastVisited
                            ? {
                                background: "rgba(216, 176, 122, 0.22)",
                                color: accentGold,
                                border: "1px solid rgba(216, 176, 122, 0.55)",
                              }
                            : {
                                background: "rgba(255, 255, 255, 0.07)",
                                color: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                              }
                    }
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.6]" />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      num
                    )}
                  </span>

                  {/* Chapter Title & Meta */}
                  <div className="min-w-0 flex-1 text-right">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`text-[12.5px] font-bold truncate ${
                          isLocked ? "text-white/55" : "text-white/95"
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {showFreeTag && (
                        <span
                          className="shrink-0 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md"
                          style={{
                            background: "rgba(110, 196, 163, 0.18)",
                            color: accentMint,
                          }}
                        >
                          مجاني
                        </span>
                      )}
                      {isLastVisited && !isCompleted && (
                        <span
                          className="shrink-0 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md"
                          style={{
                            background: "rgba(216, 176, 122, 0.2)",
                            color: accentGold,
                          }}
                        >
                          آخر فصل
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10.5px] text-white/48 mt-0.5">
                      {lesson.duration_minutes ? (
                        <span>{lesson.duration_minutes} دقيقة</span>
                      ) : null}
                      {lesson.duration_minutes && lesson.questionsCount > 0 ? (
                        <span>·</span>
                      ) : null}
                      {lesson.questionsCount > 0 ? (
                        <span>{lesson.questionsCount} سؤال</span>
                      ) : null}
                    </div>
                  </div>

                  {/* Trailing Arrow / Unlock Hint */}
                  <span className="shrink-0 text-white/45 group-hover/ch:text-white transition-transform duration-200 group-hover/ch:-translate-x-0.5">
                    {isLocked ? (
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-md"
                        style={{
                          background: "rgba(216, 176, 122, 0.14)",
                          color: accentGold,
                        }}
                      >
                        اشتراك
                      </span>
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </span>
                </>
              );

              const sharedClass = `group/ch w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl border transition-all duration-150 ${chapterHoverBg}`;

              if (isLocked) {
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={handleOpenSubscribe}
                    className={`${sharedClass} cursor-pointer`}
                    style={{
                      background: "rgba(255, 255, 255, 0.025)",
                      borderColor: "rgba(255, 255, 255, 0.065)",
                    }}
                  >
                    {rowInner}
                  </button>
                );
              }

              return (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.slug}/${lesson.id}`}
                  onClick={onNavigate}
                  className={sharedClass}
                  style={{
                    background: isLastVisited
                      ? "rgba(216, 176, 122, 0.1)"
                      : subtleSurface,
                    borderColor: isLastVisited
                      ? "rgba(216, 176, 122, 0.34)"
                      : subtleBorder,
                  }}
                >
                  {rowInner}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom CTAs */}
      <div
        className="pt-3 border-t space-y-2"
        style={{ borderColor: subtleBorder }}
      >
        <div className="flex items-center gap-2">
          <Link
            href={primaryHref}
            onClick={onNavigate}
            className="group/cta flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-[13px] font-extrabold inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #d8b07a 0%, #b9894b 100%)",
              color: "#101115",
              boxShadow:
                "0 10px 24px rgba(216, 176, 122, 0.25), inset 0 1px 0 rgba(255, 250, 240, 0.35)",
            }}
          >
            <span className="truncate">{primaryCtaLabel}</span>
            <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/cta:-translate-x-0.5" />
          </Link>

          {!isPreparedShell && (
            <Link
              href={summaryHref}
              onClick={onNavigate}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[12px] font-extrabold text-white/90 inline-flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-white/[0.1] active:scale-[0.98] shrink-0"
              style={{
                background: subtleSurface,
                borderColor: subtleBorder,
              }}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: accentGold }} />
              <span>الملخص السريع</span>
            </Link>
          )}
        </div>

        {course.is_paid && !isUnlocked && !isPreparedShell && (
          <button
            type="button"
            onClick={handleOpenSubscribe}
            className="w-full min-h-[38px] px-3.5 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center justify-center gap-2 transition-colors hover:bg-white/[0.08] cursor-pointer"
            style={{
              background: "rgba(216, 176, 122, 0.08)",
              borderColor: "rgba(216, 176, 122, 0.26)",
              color: accentGold,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              اشترك لفتح كل الفصول ({course.price} ج.م · فودافون كاش / InstaPay)
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function CoursesHubClient({
  courses,
  courseLessonIdsMap,
  courseLessonsMap = {},
}: CoursesHubClientProps) {
  const router = useRouter();
  const portal = usePortalState();
  const auth = useAuthState();
  const theme = useTheme();
  const isDark = theme === "dark";
  const prefersReducedMotion = useReducedMotion();

  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [mobileSearch, setMobileSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const avatarMenuRef = useRef<HTMLDivElement | null>(null);

  const displayName =
    auth.status === "authenticated" && auth.user?.fullName
      ? auth.user.fullName
      : portal.profile.saved && portal.profile.name
        ? portal.profile.name
        : "";

  const displayYear =
    auth.status === "authenticated" && auth.user?.yearLevel
      ? auth.user.yearLevel
      : portal.profile.saved
        ? portal.profile.year
        : null;

  const displayDept =
    auth.status === "authenticated" && auth.user?.department
      ? auth.user.department
      : portal.profile.saved
        ? portal.profile.dept
        : null;

  const hasProfileYear = typeof displayYear === "number" && displayYear >= 1 && displayYear <= 4;

  // Close avatar popover on outside click or Escape
  useEffect(() => {
    if (!avatarMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAvatarMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [avatarMenuOpen]);

  // Close mobile bottom sheet on Escape and lock body scroll while open
  useEffect(() => {
    if (!mobileSheetOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSheetOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileSheetOpen]);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(courses.map((c) => c.year_level))).sort(
      (a, b) => a - b
    );
    return years.length > 0 ? years : [2, 3];
  }, [courses]);

  const getCourseProgress = (course: CourseWithStats) => {
    const lessons = courseLessonsMap[course.id] ?? [];
    const lessonIds =
      lessons.length > 0
        ? lessons.map((l) => l.id)
        : (courseLessonIdsMap[course.id] ?? []);
    const total = lessonIds.length > 0 ? lessonIds.length : course.lesson_count;
    const completed =
      lessonIds.length > 0
        ? lessonIds.filter((id) => portal.completedLessons.includes(id)).length
        : (course.completed_count ?? 0);
    const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    const isUnlocked =
      !course.is_paid ||
      Boolean(course.is_enrolled) ||
      portal.unlockedCourses.includes(course.id);
    return { lessons, total, completed, pct, isUnlocked };
  };

  const filteredCourses = useMemo(() => {
    const q = mobileSearch.trim().toLowerCase();
    return courses.filter((course) => {
      if (filterMode === "my-year" && hasProfileYear) {
        if (course.year_level !== displayYear) return false;
      } else if (filterMode === "in-progress") {
        const ids = courseLessonIdsMap[course.id] ?? [];
        const done = ids.filter((id) =>
          portal.completedLessons.includes(id)
        ).length;
        const isLastVisitedCourse = portal.lastVisited?.courseSlug === course.slug;
        const isInProgress =
          (done > 0 && done < ids.length) || isLastVisitedCourse;
        if (!isInProgress) return false;
      } else if (filterMode === "free") {
        if (course.is_paid) return false;
      } else if (filterMode === "paid") {
        if (!course.is_paid) return false;
      } else if (filterMode.startsWith("year-")) {
        const targetYear = Number(filterMode.replace("year-", ""));
        if (course.year_level !== targetYear) return false;
      }

      if (q) {
        const haystack =
          `${course.title} ${course.title_en} ${course.code} ${course.description ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [
    courses,
    filterMode,
    hasProfileYear,
    displayYear,
    mobileSearch,
    courseLessonIdsMap,
    portal.completedLessons,
    portal.lastVisited?.courseSlug,
  ]);

  // Smart default selection: explicit selection if still visible -> lastVisited course -> first filtered course
  const activeCourse = useMemo(() => {
    if (filteredCourses.length === 0) return null;
    if (selectedCourseId) {
      const found = filteredCourses.find((c) => c.id === selectedCourseId);
      if (found) return found;
    }
    if (portal.lastVisited?.courseSlug) {
      const visited = filteredCourses.find(
        (c) => c.slug === portal.lastVisited?.courseSlug
      );
      if (visited) return visited;
    }
    return filteredCourses[0];
  }, [filteredCourses, selectedCourseId, portal.lastVisited?.courseSlug]);

  const handleSelectCourse = (courseId: string, openSheetOnMobile: boolean) => {
    setSelectedCourseId(courseId);
    if (openSheetOnMobile && typeof window !== "undefined") {
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        setMobileSheetOpen(true);
      }
    }
  };

  const handleLogout = async () => {
    setSigningOut(true);
    setAvatarMenuOpen(false);
    await logoutCloudAccount();
    setSigningOut(false);
    emitToast("تم تسجيل الخروج بنجاح");
    router.refresh();
  };

  // Dual Atelier Topbar Tokens
  const topbarBg = isDark
    ? "rgba(9, 10, 13, 0.86)"
    : "rgba(249, 247, 242, 0.9)";
  const topbarBorder = isDark
    ? "rgba(255, 244, 226, 0.085)"
    : "rgba(22, 40, 71, 0.11)";
  const utilBg = isDark
    ? "rgba(255, 245, 230, 0.055)"
    : "rgba(22, 40, 71, 0.055)";
  const utilBorder = isDark
    ? "rgba(255, 245, 230, 0.1)"
    : "rgba(22, 40, 71, 0.12)";
  const avatarRing = isDark ? "#d8b07a" : "#15664b";

  const filterPillStyle = (isActive: boolean, warm = false) => {
    if (isActive) {
      if (warm) {
        return {
          background: isDark
            ? "rgba(216, 176, 122, 0.18)"
            : "rgba(194, 94, 51, 0.13)",
          borderColor: isDark
            ? "rgba(216, 176, 122, 0.45)"
            : "rgba(194, 94, 51, 0.35)",
          color: isDark ? "#eed2a4" : "#9a421c",
        };
      }
      return {
        background: isDark ? "#d8b07a" : "#162847",
        borderColor: isDark ? "#d8b07a" : "#162847",
        color: isDark ? "#101115" : "#ffffff",
      };
    }
    return {
      background: isDark ? "rgba(18, 20, 27, 0.85)" : "rgba(255, 255, 255, 0.86)",
      borderColor: "var(--border-soft)",
      color: "var(--text-secondary)",
    };
  };

  return (
    <div
      className="relative flex-1 flex flex-col w-full min-h-screen"
      style={{ background: "var(--bg-canvas)" }}
    >
      {/* Subtle Dot Matrix Atmospheric Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="atelier-blueprint-grid absolute inset-0 opacity-90" />
        <div
          className="absolute -top-32 right-1/4 w-[520px] h-[360px] rounded-full blur-3xl opacity-70"
          style={{ background: "var(--atelier-glow-a)" }}
        />
        <div
          className="absolute top-40 left-1/5 w-[420px] h-[320px] rounded-full blur-3xl opacity-60"
          style={{ background: "var(--atelier-glow-b)" }}
        />
      </div>

      {/* Global Broadcast Announcement Strip */}
      <div className="relative z-30">
        <BroadcastBanner />
      </div>

      {/* ULTRA-CLEAN TOPBAR: Sticky on Desktop (>= md), Non-Sticky on Mobile (< md) */}
      <header
        className="relative md:sticky md:top-0 z-40 w-full border-b md:backdrop-blur-xl transition-colors duration-200"
        style={{
          background: topbarBg,
          borderColor: topbarBorder,
        }}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
          {/* Right (RTL Start): Founder Avatar + Eng. Ahmed Amir | CS PORTAL */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 group"
            title="العودة للرئيسية"
          >
            <div
              className="relative w-8 h-8 md:w-[34px] md:h-[34px] rounded-full overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{
                border: `1.5px solid ${avatarRing}`,
                boxShadow: isDark
                  ? "0 2px 10px rgba(0, 0, 0, 0.45)"
                  : "0 2px 10px rgba(18, 28, 45, 0.14)",
              }}
            >
              <Image
                src="/images/founder.jpg"
                alt="Eng. Ahmed Amir"
                fill
                sizes="34px"
                className="object-cover object-[50%_15%]"
              />
            </div>

            <BrandName size="md" className="hidden sm:inline-flex" />
            <BrandName size="sm" className="sm:hidden" />

            <span
              className="hidden lg:inline-block w-px h-3.5 shrink-0"
              style={{ background: "var(--atelier-border-mid)" }}
              aria-hidden="true"
            />
            <span
              dir="ltr"
              className="hidden lg:inline-block font-mono-code text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              CS PORTAL
            </span>
          </Link>

          {/* Center (Desktop >= md): Clean Segmented Tabs ('الرئيسية' | 'المواد') */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-1 p-1 rounded-full border"
            style={{
              background: utilBg,
              borderColor: utilBorder,
            }}
          >
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full text-[12.5px] font-bold transition-colors hover:text-[var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              الرئيسية
            </Link>
            <span
              aria-current="page"
              className="px-4 py-1.5 rounded-full text-[12.5px] font-extrabold shadow-xs"
              style={{
                background: isDark
                  ? "rgba(216, 176, 122, 0.16)"
                  : "#162847",
                color: isDark ? "#f6f4ef" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(216, 176, 122, 0.3)"
                  : "1px solid #162847",
              }}
            >
              المواد
            </span>
          </nav>

          {/* Left (RTL End): Clean Utility Cluster ONLY (Search + Theme + Icon-Only User Avatar Popover on Desktop) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Quick Search Pill ('بحث سريع ⌘K') */}
            <button
              type="button"
              onClick={openCommandPalette}
              className="hidden md:inline-flex h-9 px-3.5 rounded-full border items-center gap-2.5 text-[12px] font-bold transition-all duration-200 hover:border-[var(--border-strong)] cursor-pointer"
              style={{
                background: utilBg,
                borderColor: utilBorder,
                color: "var(--text-secondary)",
              }}
              title="بحث سريع في المواد والفصول (⌘K)"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span>بحث سريع</span>
              <kbd
                dir="ltr"
                className="font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded-md border"
                style={{
                  background: isDark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(255, 255, 255, 0.85)",
                  borderColor: utilBorder,
                  color: "var(--text-muted)",
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Mobile Quick Search Icon Button (< md) */}
            <button
              type="button"
              onClick={openCommandPalette}
              className="md:hidden w-9 h-9 rounded-full border inline-flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
              style={{
                background: utilBg,
                borderColor: utilBorder,
                color: "var(--text-secondary)",
              }}
              title="بحث سريع"
              aria-label="بحث سريع"
            >
              <Search className="w-4 h-4 shrink-0" />
            </button>

            {/* Theme Toggle Circular Button (36px) */}
            <button
              type="button"
              onClick={() => toggleTheme()}
              className="w-9 h-9 rounded-full border inline-flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              style={{
                background: utilBg,
                borderColor: utilBorder,
                color: "var(--text-primary)",
              }}
              title={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
              aria-label={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 shrink-0" style={{ color: "#d8b07a" }} />
              ) : (
                <Moon className="w-4 h-4 shrink-0" style={{ color: "#162847" }} />
              )}
            </button>

            {/* Desktop Clean Circular User Avatar Button (36px) + Glass Popover Menu */}
            <div ref={avatarMenuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen((prev) => !prev)}
                aria-expanded={avatarMenuOpen}
                aria-haspopup="menu"
                title={displayName || "حسابي"}
                aria-label="قائمة الحساب"
                className="w-9 h-9 rounded-full border inline-flex items-center justify-center text-[12px] font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                style={
                  auth.status === "authenticated"
                    ? {
                        background: isDark
                          ? "rgba(216, 176, 122, 0.16)"
                          : "#162847",
                        borderColor: isDark
                          ? "rgba(216, 176, 122, 0.42)"
                          : "#162847",
                        color: isDark ? "#eed2a4" : "#ffffff",
                      }
                    : {
                        background: utilBg,
                        borderColor: utilBorder,
                        color: "var(--text-primary)",
                      }
                }
              >
                {displayName ? (
                  <span className="leading-none">{getUserInitials(displayName)}</span>
                ) : (
                  <User className="w-4 h-4 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {avatarMenuOpen && (
                  <motion.div
                    role="menu"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 8, scale: 0.96 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 6, scale: 0.96 }
                    }
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 mt-2.5 w-60 rounded-2xl border backdrop-blur-2xl p-2 shadow-2xl z-50"
                    style={{
                      background: isDark
                        ? "rgba(17, 19, 25, 0.96)"
                        : "rgba(255, 255, 255, 0.96)",
                      borderColor: isDark
                        ? "rgba(216, 176, 122, 0.22)"
                        : "rgba(22, 40, 71, 0.14)",
                      boxShadow: "var(--shadow-modal)",
                    }}
                  >
                    {/* User Identity Header */}
                    <div
                      className="px-3 py-2.5 mb-1 border-b"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      <div
                        className="text-[13px] font-extrabold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {displayName || "مرحباً بك"}
                      </div>
                      <div
                        className="text-[11px] font-semibold mt-0.5 truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {hasProfileYear
                          ? `الفرقة ${displayYear}${displayDept ? ` · ${displayDept}` : ""}`
                          : auth.user?.email || "سجّل دخولك لحفظ تقدمك"}
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="space-y-0.5">
                      <Link
                        href="/login"
                        role="menuitem"
                        onClick={() => setAvatarMenuOpen(false)}
                        className="w-full px-3 py-2 rounded-xl text-[12.5px] font-bold flex items-center gap-2.5 transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <User
                          className="w-4 h-4 shrink-0"
                          style={{ color: "var(--brand-primary)" }}
                        />
                        <span>حسابي</span>
                      </Link>

                      {auth.status === "authenticated" &&
                        auth.user?.role === "admin" && (
                          <Link
                            href="/admin"
                            role="menuitem"
                            onClick={() => setAvatarMenuOpen(false)}
                            className="w-full px-3 py-2 rounded-xl text-[12.5px] font-bold flex items-center gap-2.5 transition-colors hover:bg-[var(--bg-hover)]"
                            style={{ color: "var(--accent-warm-text)" }}
                          >
                            <Shield
                              className="w-4 h-4 shrink-0"
                              style={{ color: "var(--accent-warm)" }}
                            />
                            <span>لوحة التحكم</span>
                          </Link>
                        )}

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setAvatarMenuOpen(false);
                          openFeedbackModal();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-[12.5px] font-bold flex items-center gap-2.5 transition-colors hover:bg-[var(--bg-hover)] cursor-pointer text-right"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <MessageSquarePlus
                          className="w-4 h-4 shrink-0"
                          style={{ color: "var(--success-fg)" }}
                        />
                        <span>اقتراح مادة / تواصل</span>
                      </button>

                      <div
                        className="my-1 border-t"
                        style={{ borderColor: "var(--border-soft)" }}
                      />

                      {auth.status === "authenticated" ? (
                        <button
                          type="button"
                          role="menuitem"
                          disabled={signingOut}
                          onClick={handleLogout}
                          className="w-full px-3 py-2 rounded-xl text-[12.5px] font-bold flex items-center gap-2.5 transition-colors hover:bg-[var(--danger-soft)] cursor-pointer text-right disabled:opacity-50"
                          style={{ color: "var(--danger-fg)" }}
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          <span>
                            {signingOut ? "جاري الخروج..." : "تسجيل الخروج"}
                          </span>
                        </button>
                      ) : (
                        <Link
                          href="/login"
                          role="menuitem"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-[12.5px] font-extrabold flex items-center gap-2.5 transition-colors hover:bg-[var(--brand-soft)]"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          <LogIn className="w-4 h-4 shrink-0" />
                          <span>تسجيل الدخول</span>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="relative z-10 flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-9 pb-24 md:pb-12 space-y-6">
        {/* Page Header + Subtle Academic Kicker */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
            <div className="space-y-1.5">
              {hasProfileYear && (
                <div
                  className="inline-flex items-center gap-2 text-[12px] font-extrabold tracking-wide"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: isDark ? "#6ec4a3" : "#15664b",
                      boxShadow: isDark
                        ? "0 0 8px rgba(110, 196, 163, 0.55)"
                        : "0 0 6px rgba(21, 102, 75, 0.35)",
                    }}
                    aria-hidden="true"
                  />
                  <span>
                    الفرقة <span className="font-en">{displayYear}</span> ·
                    حاسبات والذكاء الاصطناعي
                  </span>
                </div>
              )}

              <h1
                className="text-[26px] sm:text-[34px] font-black tracking-tight leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                استكشف المواد المتاحة
              </h1>
            </div>

            <div
              className="text-[12px] font-bold flex items-center gap-2"
              style={{ color: "var(--text-muted)" }}
            >
              <span>
                عرض{" "}
                <strong
                  className="font-mono-code"
                  style={{ color: "var(--text-primary)" }}
                >
                  {filteredCourses.length}
                </strong>{" "}
                من أصل{" "}
                <strong className="font-mono-code">{courses.length}</strong>{" "}
                مواد
              </span>
            </div>
          </div>

          {/* Mobile Subtle Inline Search Input */}
          <div className="md:hidden relative">
            <Search
              className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              dir="rtl"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="ابحث باسم المادة أو الكود..."
              className="w-full h-10 pr-10 pl-9 rounded-xl border text-[13px] outline-none transition-colors focus:border-[var(--border-strong)]"
              style={{
                background: isDark
                  ? "rgba(18, 20, 27, 0.9)"
                  : "rgba(255, 255, 255, 0.92)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
            {mobileSearch.length > 0 && (
              <button
                type="button"
                onClick={() => setMobileSearch("")}
                aria-label="مسح البحث"
                className="w-6 h-6 rounded-lg absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                style={{
                  background: "var(--bg-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sleek Single-Row Filter Pills (Horizontal Scroll on Mobile, Zero Multi-Row Wrap) */}
          <div
            role="tablist"
            aria-label="تصفية المواد"
            className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {hasProfileYear && (
              <button
                type="button"
                role="tab"
                aria-selected={filterMode === "my-year"}
                onClick={() =>
                  setFilterMode((prev) =>
                    prev === "my-year" ? "all" : "my-year"
                  )
                }
                className="h-9 px-3.5 rounded-full border text-[12px] font-extrabold inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all duration-150 cursor-pointer"
                style={filterPillStyle(filterMode === "my-year", true)}
              >
                <Star className="w-3.5 h-3.5 shrink-0" />
                <span>فرقتي</span>
              </button>
            )}

            <button
              type="button"
              role="tab"
              aria-selected={filterMode === "all"}
              onClick={() => setFilterMode("all")}
              className="h-9 px-3.5 rounded-full border text-[12px] font-bold shrink-0 whitespace-nowrap transition-all duration-150 cursor-pointer"
              style={filterPillStyle(filterMode === "all")}
            >
              كل الفرق
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={filterMode === "in-progress"}
              onClick={() => setFilterMode("in-progress")}
              className="h-9 px-3.5 rounded-full border text-[12px] font-bold shrink-0 whitespace-nowrap transition-all duration-150 cursor-pointer"
              style={filterPillStyle(filterMode === "in-progress")}
            >
              قيد المذاكرة
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={filterMode === "free"}
              onClick={() => setFilterMode("free")}
              className="h-9 px-3.5 rounded-full border text-[12px] font-bold shrink-0 whitespace-nowrap transition-all duration-150 cursor-pointer"
              style={filterPillStyle(filterMode === "free")}
            >
              مجاني
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={filterMode === "paid"}
              onClick={() => setFilterMode("paid")}
              className="h-9 px-3.5 rounded-full border text-[12px] font-bold shrink-0 whitespace-nowrap transition-all duration-150 cursor-pointer"
              style={filterPillStyle(filterMode === "paid", true)}
            >
              مدفوع
            </button>

            <span
              className="h-4 w-px mx-1 shrink-0"
              style={{ background: "var(--border-strong)" }}
              aria-hidden="true"
            />

            {availableYears.map((yr) => {
              const mode: FilterMode = `year-${yr}`;
              return (
                <button
                  key={yr}
                  type="button"
                  role="tab"
                  aria-selected={filterMode === mode}
                  onClick={() => setFilterMode(mode)}
                  className="h-9 px-3.5 rounded-full border text-[12px] font-bold shrink-0 whitespace-nowrap transition-all duration-150 cursor-pointer"
                  style={filterPillStyle(filterMode === mode)}
                >
                  الفرقة <span className="font-en">{yr}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* CONCEPT A — SPLIT EDITORIAL INDEX (Right 7 Cols) + LIVE CHAPTER INSPECTOR (Left 5 Cols Sticky) */}
        {filteredCourses.length === 0 ? (
          <section
            className="rounded-3xl border p-10 text-center space-y-3"
            style={{
              background: isDark ? "rgba(18, 20, 27, 0.9)" : "#ffffff",
              borderColor: "var(--border-soft)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              className="text-[16px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              لا توجد مواد مطابقة للتصفية الحالية
            </div>
            <p
              className="text-[13px] max-w-md mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              جرّب اختيار &quot;كل الفرق&quot; أو مسح كلمة البحث لعرض جميع المواد
              المتاحة.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterMode("all");
                setMobileSearch("");
              }}
              className="mt-1 h-10 px-5 rounded-full text-[12.5px] font-extrabold cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{
                background: isDark ? "#d8b07a" : "#162847",
                color: isDark ? "#101115" : "#ffffff",
              }}
            >
              عرض كل المواد
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
            {/* RIGHT (7 Cols): Editorial Numbered Swiss Course Index */}
            <div className="lg:col-span-7 space-y-2.5">
              {filteredCourses.map((course, idx) => {
                const { total, pct, isUnlocked } = getCourseProgress(course);
                const isSoon = total === 0;
                const isSelected = activeCourse?.id === course.id;
                const orderNum = String(idx + 1).padStart(2, "0");

                const rowBg = isSelected
                  ? isDark
                    ? "rgba(24, 27, 36, 0.96)"
                    : "#ffffff"
                  : isDark
                    ? "rgba(15, 17, 23, 0.84)"
                    : "rgba(255, 255, 255, 0.78)";

                const rowBorder = isSelected
                  ? isDark
                    ? "rgba(216, 176, 122, 0.48)"
                    : "rgba(22, 40, 71, 0.34)"
                  : "var(--border-soft)";

                const rowShadow = isSelected
                  ? isDark
                    ? "0 14px 34px rgba(0, 0, 0, 0.42)"
                    : "0 14px 34px rgba(18, 28, 45, 0.09)"
                  : "none";

                return (
                  <button
                    key={course.id}
                    type="button"
                    onMouseEnter={() => setSelectedCourseId(course.id)}
                    onFocus={() => setSelectedCourseId(course.id)}
                    onClick={() => handleSelectCourse(course.id, true)}
                    aria-pressed={isSelected}
                    className="group relative w-full text-right rounded-2xl border p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-200 cursor-pointer overflow-hidden hover:border-[var(--border-strong)]"
                    style={{
                      background: rowBg,
                      borderColor: rowBorder,
                      boxShadow: rowShadow,
                    }}
                  >
                    {/* Active Subtle Right Accent Bar (Desktop visual anchor) */}
                    {isSelected && (
                      <motion.span
                        layoutId={
                          prefersReducedMotion ? undefined : "activeCourseBar"
                        }
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                        aria-hidden="true"
                        className="hidden lg:block absolute right-0 top-3 bottom-3 w-[3px] rounded-l-full"
                        style={{
                          background: isDark ? "#d8b07a" : "#162847",
                        }}
                      />
                    )}

                    {/* Swiss Index Number (01, 02, 03...) */}
                    <span
                      dir="ltr"
                      className="font-mono-code text-[12px] font-extrabold w-6 text-center shrink-0 select-none transition-colors"
                      style={{
                        color: isSelected
                          ? isDark
                            ? "#d8b07a"
                            : "#c25e33"
                          : "var(--text-muted)",
                      }}
                    >
                      {orderNum}
                    </span>

                    {/* Course Icon Tile */}
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-[1.04]"
                      style={{
                        background: isSelected
                          ? isDark
                            ? "rgba(216, 176, 122, 0.14)"
                            : "#162847"
                          : isDark
                            ? "rgba(255, 245, 230, 0.045)"
                            : "rgba(22, 40, 71, 0.06)",
                        borderColor: isSelected
                          ? isDark
                            ? "rgba(216, 176, 122, 0.34)"
                            : "#162847"
                          : "var(--border-soft)",
                        color: isSelected
                          ? isDark
                            ? "#e7c694"
                            : "#ffffff"
                          : isDark
                            ? "#d8b07a"
                            : "#162847",
                      }}
                    >
                      <CourseIcon icon={course.icon} />
                    </div>

                    {/* Title Block: English Title + Code + Arabic Subtitle & Meta */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2
                          className="font-en text-right text-[15px] sm:text-[16px] font-black tracking-tight truncate max-w-full"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {course.title_en}
                        </h2>
                        <span
                          dir="ltr"
                          className="font-mono-code text-[10.5px] font-extrabold px-1.5 py-0.5 rounded-md border shrink-0"
                          style={{
                            background: "var(--bg-subtle)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {course.code}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-1.5 flex-wrap text-[12px] font-semibold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span
                          className="truncate max-w-[160px] sm:max-w-[220px]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {course.title}
                        </span>
                        <span aria-hidden="true" className="opacity-45">
                          ·
                        </span>
                        <span className="whitespace-nowrap">
                          {isSoon
                            ? "جاري التجهيز"
                            : `${total} ${getChaptersUnit(total)} · ${course.duration_minutes} د`}
                        </span>
                      </div>
                    </div>

                    {/* End Cluster: Access Pill + Mini Swiss SVG Progress Ring */}
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      <span
                        className="hidden sm:inline-flex items-center text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={
                          isSoon
                            ? {
                                background: "var(--brand-soft)",
                                color: "var(--brand-soft-text)",
                              }
                            : !course.is_paid || isUnlocked
                              ? {
                                  background: "var(--success-soft)",
                                  color: "var(--success-fg)",
                                }
                              : {
                                  background: "var(--accent-warm-soft)",
                                  color: "var(--accent-warm-text)",
                                }
                        }
                      >
                        {isSoon
                          ? "قريباً"
                          : !course.is_paid
                            ? "مجاني"
                            : isUnlocked
                              ? "مُفعّل ✓"
                              : `${course.price} ج.م`}
                      </span>

                      <MiniSwissProgressRing
                        pct={pct}
                        isSoon={isSoon}
                        isSelected={isSelected}
                        isDark={isDark}
                      />
                    </div>
                  </button>
                );
              })}

              {/* Mobile tap hint */}
              <div
                className="lg:hidden text-center pt-1 text-[11.5px] font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                اضغط على أي مادة لاستعراض فصولها والدخول المباشر
              </div>
            </div>

            {/* LEFT (5 Cols, Desktop Sticky): Live Course & Chapter Inspector Focal Jewel */}
            <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20">
              {activeCourse && (
                <div
                  className="sapphire-rim rounded-[26px] border p-6 overflow-hidden transition-colors duration-300"
                  style={
                    isDark
                      ? {
                          background:
                            "linear-gradient(165deg, #161923 0%, #0e1017 100%)",
                          borderColor: "rgba(216, 176, 122, 0.24)",
                          boxShadow: "0 26px 60px rgba(0, 0, 0, 0.56)",
                        }
                      : {
                          background:
                            "linear-gradient(165deg, #1a2f52 0%, #0d1a30 100%)",
                          borderColor: "rgba(22, 40, 71, 0.32)",
                          boxShadow:
                            "0 26px 56px rgba(18, 28, 45, 0.22), 0 4px 16px rgba(194, 94, 51, 0.08)",
                        }
                  }
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCourse.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: -4 }
                      }
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      {(() => {
                        const { lessons, isUnlocked } =
                          getCourseProgress(activeCourse);
                        const lastVisitedInThis =
                          portal.lastVisited?.courseSlug === activeCourse.slug
                            ? portal.lastVisited.lessonId
                            : null;

                        return (
                          <CourseInspectorContent
                            course={activeCourse}
                            lessons={lessons}
                            completedLessons={portal.completedLessons}
                            isUnlocked={isUnlocked}
                            lastVisitedLessonId={lastVisitedInThis}
                            isDark={isDark}
                          />
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </aside>
          </section>
        )}

        {/* Quiet Bottom Editorial Strip */}
        <section
          className="rounded-2xl border px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
          style={{
            background: isDark
              ? "rgba(17, 19, 25, 0.72)"
              : "rgba(255, 255, 255, 0.72)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="space-y-0.5">
            <h3
              className="text-[14.5px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              تبحث عن مادة غير موجودة؟
            </h3>
            <p
              className="text-[12.5px]"
              style={{ color: "var(--text-muted)" }}
            >
              ابعتلنا اسم المادة أو الفصل اللي محتاجه وهنرتّب أولوية رفعها مع
              بداية الدفعة القادمة.
            </p>
          </div>

          <button
            type="button"
            onClick={openFeedbackModal}
            className="self-start sm:self-auto h-10 px-4 rounded-full border text-[12.5px] font-extrabold inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] cursor-pointer shrink-0"
            style={{
              background: isDark
                ? "rgba(216, 176, 122, 0.12)"
                : "rgba(22, 40, 71, 0.06)",
              borderColor: isDark
                ? "rgba(216, 176, 122, 0.28)"
                : "rgba(22, 40, 71, 0.16)",
              color: isDark ? "#eed2a4" : "#162847",
            }}
          >
            <MessageSquarePlus className="w-4 h-4 shrink-0" />
            <span>اقترح مادة / تواصل</span>
          </button>
        </section>
      </main>

      {/* MOBILE BOTTOM SHEET (< lg): Exact Same Live Chapter Inspector */}
      <AnimatePresence>
        {mobileSheetOpen && activeCourse && (
          <div
            className="lg:hidden fixed inset-0 z-50 flex items-end justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={`تفاصيل مادة ${activeCourse.title}`}
          >
            {/* Dim Backdrop */}
            <motion.button
              type="button"
              aria-label="إغلاق النافذة"
              onClick={() => setMobileSheetOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] cursor-pointer"
            />

            {/* Native-Feeling Sheet Panel */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 0 } : { y: "100%" }
              }
              animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 36 }}
              className="relative z-10 w-full max-w-[540px] max-h-[86vh] overflow-y-auto rounded-t-[28px] border-t border-x px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
              style={
                isDark
                  ? {
                      background:
                        "linear-gradient(165deg, #161923 0%, #0c0e14 100%)",
                      borderColor: "rgba(216, 176, 122, 0.28)",
                      boxShadow: "0 -18px 50px rgba(0, 0, 0, 0.65)",
                    }
                  : {
                      background:
                        "linear-gradient(165deg, #1a2f52 0%, #0d1a30 100%)",
                      borderColor: "rgba(235, 208, 162, 0.24)",
                      boxShadow: "0 -18px 50px rgba(13, 26, 48, 0.45)",
                    }
              }
            >
              {/* Grab Handle + Close */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-8" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="w-10 h-1 rounded-full bg-white/25"
                />
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  aria-label="إغلاق"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/18 text-white/85 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {(() => {
                const { lessons, isUnlocked } = getCourseProgress(activeCourse);
                const lastVisitedInThis =
                  portal.lastVisited?.courseSlug === activeCourse.slug
                    ? portal.lastVisited.lessonId
                    : null;

                return (
                  <CourseInspectorContent
                    course={activeCourse}
                    lessons={lessons}
                    completedLessons={portal.completedLessons}
                    isUnlocked={isUnlocked}
                    lastVisitedLessonId={lastVisitedInThis}
                    isDark={isDark}
                    onNavigate={() => setMobileSheetOpen(false)}
                  />
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer variant="compact" />
      <MobileBottomDock />
    </div>
  );
}
