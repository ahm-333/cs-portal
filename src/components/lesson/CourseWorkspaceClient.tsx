"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CheckSquare,
  Copy,
  Cpu,
  ExternalLink,
  FileCode2,
  Globe,
  KeyRound,
  ListVideo,
  Lock,
  Maximize2,
  Minimize2,
  Moon,
  NotebookPen,
  PlayCircle,
  Search,
  Sun,
  Table2,
  X,
  Zap,
} from "lucide-react";
import { saveLastLesson } from "@/components/course/lastLessonStore";
import { Footer } from "@/components/layout/Footer";
import { toggleTheme, useTheme } from "@/components/layout/themeStore";
import { splitBilingualTitle } from "@/lib/courseTheme";
import {
  emitToast,
  openCommandPalette,
  openUnlockModal,
} from "@/lib/stores/events";
import {
  setLastVisited,
  setLessonNote,
  toggleLessonComplete,
  usePortalState,
} from "@/lib/stores/portalStore";
import type {
  Course,
  LessonPageData,
  Question,
  VideoChapter,
} from "@/types/database";
import CourseInteractiveLab from "./CourseInteractiveLab";
import MarkdownViewer from "./MarkdownViewer";
import QuizEngine from "./QuizEngine";
import VideoPlayer from "./VideoPlayer";

type WorkspaceTab = "video" | "lab" | "site" | "summary" | "quiz";

interface CourseWorkspaceClientProps {
  data: LessonPageData;
  requestedLessonId?: string;
}

function isSafeHttpUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

function fireCelebrationConfetti(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#c25e33", "#66c7a6", "#7ca7f0"],
    });
  } catch {
    // ignore
  }
}

function getFallbackChapters(course: Course): VideoChapter[] {
  if (course.lab_type === "linked-list") {
    return [
      {
        time: "00:00",
        name: "بنية العقدة Node في الذاكرة",
        pct: "28%",
        visual: "Struct Node { int data; Node* next; }",
      },
      {
        time: "05:40",
        name: "الإدراج في البداية Insert Head",
        pct: "64%",
        visual: "HEAD → [NEW] → [14] → [29] → NULL",
      },
      {
        time: "11:20",
        name: "حذف عقدة وتحليل Big-O",
        pct: "92%",
        visual: "Time Complexity: O(1) at Head · O(n) at Tail",
      },
    ];
  }
  if (course.lab_type === "binary-search") {
    return [
      {
        time: "00:00",
        name: "فكرة Divide & Conquer",
        pct: "30%",
        visual: "Divide → Conquer → Combine",
      },
      {
        time: "07:10",
        name: "تحليل Binary Search خطوة بخطوة",
        pct: "66%",
        visual: "T(n) = T(n/2) + O(1)  ⇒  O(log n)",
      },
      {
        time: "13:05",
        name: "مقارنة Merge Sort و Quick Sort",
        pct: "94%",
        visual: "Worst Case: Merge O(n log n) vs Quick O(n²)",
      },
    ];
  }
  return [
    {
      time: "00:00",
      name: "دورة حياة العملية Process States",
      pct: "25%",
      visual: "New → Ready → Running → Terminated",
    },
    {
      time: "08:15",
      name: "جدولة المعالج FCFS مقابل SJF",
      pct: "65%",
      visual: "Gantt Chart: | P1 (0-4) | P2 (4-7) | P3 (7-12) |",
    },
    {
      time: "15:30",
      name: "حساب Average Waiting Time",
      pct: "95%",
      visual: "Avg WT = (0 + 4 + 7) / 3 = 3.67 ms",
    },
  ];
}

function getFallbackKeyCode(course: Course): string {
  if (course.lab_type === "linked-list") {
    return `struct Node {
  int data;
  Node* next;
  Node(int v) : data(v), next(nullptr) {}
};

void insertHead(Node*& head, int val) {
  Node* n = new Node(val);
  n->next = head;
  head = n;
}`;
  }
  if (course.lab_type === "binary-search") {
    return `int binarySearch(int arr[], int n, int target) {
  int low = 0, high = n - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`;
  }
  return `// Waiting Time = Turnaround Time - Burst Time
// FCFS Order: P1(8ms) -> P2(2ms) -> P3(4ms)
// Wait Times: P1=0, P2=8, P3=10  => Avg = 6.00 ms

// SJF Order:  P2(2ms) -> P3(4ms) -> P1(8ms)
// Wait Times: P2=0, P3=2, P1=6   => Avg = 2.67 ms (Optimal!)`;
}

function getFallbackQuestions(course: Course, lessonId: string): Question[] {
  if (course.lab_type === "linked-list") {
    return [
      {
        id: `fallback-${lessonId}-1`,
        lesson_id: lessonId,
        question_text:
          "ما هو التعقيد الزمني لإضافة عنصر في بداية Singly Linked List؟",
        code_snippet: null,
        code_lang: null,
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct_index: 0,
        explanation:
          "تعديل مؤشر head مباشرة يتم في خطوتين ثابتتين فقط O(1) بدون المرور على باقي العقد.",
        order_index: 1,
      },
      {
        id: `fallback-${lessonId}-2`,
        lesson_id: lessonId,
        question_text:
          "أي هيكل بيانات يدعم الوصول المباشر لأي عنصر بالـ Index في زمن O(1)؟",
        code_snippet: null,
        code_lang: null,
        options: ["Singly Linked List", "Array", "Queue", "Stack"],
        correct_index: 1,
        explanation:
          "المصفوفة (Array) تحسب عنوان العنصر مباشرة بمعادلة (Base + i × size) في O(1).",
        order_index: 2,
      },
    ];
  }
  if (course.lab_type === "binary-search") {
    return [
      {
        id: `fallback-${lessonId}-1`,
        lesson_id: lessonId,
        question_text: "ما هو الشرط الأساسي لاستخدام خوارزمية Binary Search؟",
        code_snippet: null,
        code_lang: null,
        options: [
          "أن تكون المصفوفة مرتّبة",
          "أن يكون حجمها زوجياً",
          "استخدام Linked List",
          "عدم وجود أرقام سالبة",
        ],
        correct_index: 0,
        explanation:
          "بدون الترتيب لا يمكن استبعاد نصف العناصر بثقة في كل خطوة.",
        order_index: 1,
      },
      {
        id: `fallback-${lessonId}-2`,
        lesson_id: lessonId,
        question_text:
          "ما هو التعقيد الزمني لـ Merge Sort في أسوأ حالة (Worst Case)؟",
        code_snippet: null,
        code_lang: null,
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correct_index: 1,
        explanation:
          "Merge Sort دائماً O(n log n) لأن التقسيم والدمج ثابتان في جميع الحالات.",
        order_index: 2,
      },
    ];
  }
  return [
    {
      id: `fallback-${lessonId}-1`,
      lesson_id: lessonId,
      question_text:
        "أي خوارزمية جدولة تعطي أقل Average Waiting Time لمجموعة عمليات تصل في نفس اللحظة؟",
      code_snippet: null,
      code_lang: null,
      options: ["FCFS", "SJF", "Round Robin", "Random"],
      correct_index: 1,
      explanation:
        "SJF (Shortest Job First) مثالية لتقليل متوسط وقت الانتظار لأنها تنفذ العمليات الأقصر أولاً.",
      order_index: 1,
    },
    {
      id: `fallback-${lessonId}-2`,
      lesson_id: lessonId,
      question_text:
        "أين يحتفظ نظام التشغيل بحالة كل عملية (Registers, PC, State)؟",
      code_snippet: null,
      code_lang: null,
      options: [
        "Cache Line",
        "PCB (Process Control Block)",
        "BIOS",
        "ALU",
      ],
      correct_index: 1,
      explanation:
        "الـ PCB هو السجل الذي يحفظ كل بيانات العملية عند التبديل (Context Switch).",
      order_index: 2,
    },
  ];
}

function CheatSheetTable({ course }: { course: Course }) {
  const sheet = course.cheat_sheet;
  if (!sheet || !sheet.headers.length || !sheet.rows.length) return null;

  return (
    <div
      className="w-full max-w-full overflow-x-auto rounded-2xl border"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <table className="w-full min-w-[340px] text-right text-[12px]">
        <thead
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-primary)",
          }}
        >
          <tr>
            {sheet.headers.map((header, idx) => (
              <th
                key={idx}
                className="whitespace-nowrap px-3.5 py-2.5 text-right font-extrabold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{
            borderColor: "var(--border-soft)",
            color: "var(--text-secondary)",
          }}
        >
          {sheet.rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className="transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {row.map((cell, cIdx) => {
                const hasArabic = /[\u0600-\u06FF]/.test(cell);
                const isLtrCode = cIdx > 0 && !hasArabic;
                return (
                  <td
                    key={cIdx}
                    dir={isLtrCode ? "ltr" : undefined}
                    className={`px-3.5 py-2.5 ${
                      cIdx === 0
                        ? "whitespace-nowrap font-bold"
                        : isLtrCode
                          ? "font-mono-code text-right"
                          : "font-semibold"
                    }`}
                    style={
                      cIdx === 0 ? { color: "var(--text-primary)" } : undefined
                    }
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TOOL_TABS: ReadonlyArray<{
  id: WorkspaceTab;
  label: string;
  Icon: typeof PlayCircle;
}> = [
  { id: "video", label: "فيديوهات الشرح", Icon: PlayCircle },
  { id: "lab", label: "الشرح التفاعلي", Icon: Cpu },
  { id: "site", label: "موقع المادة", Icon: Globe },
  { id: "summary", label: "الملخصات والأكواد", Icon: FileCode2 },
  { id: "quiz", label: "الكويزات", Icon: CheckSquare },
];

export default function CourseWorkspaceClient({
  data,
  requestedLessonId,
}: CourseWorkspaceClientProps) {
  const { course, lesson, allLessons, interactives, questions, progressMap } =
    data;

  const portal = usePortalState();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("video");
  const [hasOpenedLab, setHasOpenedLab] = useState(false);
  const [examNight, setExamNight] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [mobileLessonsOpen, setMobileLessonsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const notesDrawerRef = useRef<HTMLDivElement | null>(null);

  const sortedLessons = useMemo(
    () => [...allLessons].sort((a, b) => a.order_index - b.order_index),
    [allLessons]
  );

  const currentLessonId =
    lesson?.id ?? requestedLessonId ?? sortedLessons[0]?.id ?? "";

  const currentLessonIndex = useMemo(() => {
    const idx = sortedLessons.findIndex((l) => l.id === currentLessonId);
    return idx >= 0 ? idx : 0;
  }, [sortedLessons, currentLessonId]);

  const activeLessonMeta = sortedLessons[currentLessonIndex] ?? null;

  const isUnlockedLocally = useMemo(() => {
    if (!course.is_paid) return true;
    if (data.isEnrolled) return true;
    return (
      portal.unlockedCourses.includes(course.id) ||
      portal.unlockedCourses.includes(course.slug)
    );
  }, [course.is_paid, course.id, course.slug, data.isEnrolled, portal.unlockedCourses]);

  const isLockedView = data.isLocked && !isUnlockedLocally;

  const completedSet = useMemo(() => {
    const set = new Set<string>(portal.completedLessons);
    for (const [id, entry] of Object.entries(progressMap)) {
      if (entry.is_completed) set.add(id);
    }
    return set;
  }, [portal.completedLessons, progressMap]);

  const doneCount = useMemo(
    () => sortedLessons.filter((l) => completedSet.has(l.id)).length,
    [sortedLessons, completedSet]
  );

  const progressPct =
    sortedLessons.length > 0
      ? Math.round((doneCount / sortedLessons.length) * 100)
      : 0;

  const isCurrentLessonDone = Boolean(
    currentLessonId && completedSet.has(currentLessonId)
  );

  const rawTitle = lesson?.title ?? activeLessonMeta?.title ?? course.title;
  const parsedLessonTitle = useMemo(() => splitBilingualTitle(rawTitle), [rawTitle]);
  const lessonNumPadded = String(currentLessonIndex + 1).padStart(2, "0");

  // Save last visited lesson for resume banner (/courses and unified portalStore v3)
  useEffect(() => {
    if (!currentLessonId || isLockedView) return;
    saveLastLesson({
      slug: course.slug,
      courseTitle: course.title,
      courseCode: course.code,
      lessonId: currentLessonId,
      lessonTitle: parsedLessonTitle.primary,
      sectionTitle: activeLessonMeta?.section_title ?? "",
    });
    setLastVisited({
      courseSlug: course.slug,
      courseCode: course.code,
      courseTitle: course.title,
      lessonId: currentLessonId,
      lessonTitle: parsedLessonTitle.primary,
    });
  }, [
    course.slug,
    course.title,
    course.code,
    currentLessonId,
    isLockedView,
    parsedLessonTitle.primary,
    activeLessonMeta?.section_title,
  ]);

  // Lock body scroll & listen for Escape when Slide-Over Mobile Lessons Drawer is open
  useEffect(() => {
    if (!mobileLessonsOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileLessonsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileLessonsOpen]);

  const firstFreeLesson = useMemo(
    () => sortedLessons.find((l) => l.is_free_preview) ?? null,
    [sortedLessons]
  );

  const lessonChapters = useMemo(() => {
    if (lesson?.chapters && lesson.chapters.length > 0) return lesson.chapters;
    if (activeLessonMeta?.chapters && activeLessonMeta.chapters.length > 0) {
      return activeLessonMeta.chapters;
    }
    return getFallbackChapters(course);
  }, [lesson, activeLessonMeta, course]);

  const activeKeyCode = useMemo(() => {
    return (
      lesson?.key_code ||
      activeLessonMeta?.key_code ||
      getFallbackKeyCode(course)
    );
  }, [lesson, activeLessonMeta, course]);

  const activeExamTip =
    lesson?.exam_tip || activeLessonMeta?.exam_tip || course.exam_tip;

  const effectiveQuestions = useMemo(() => {
    if (questions.length > 0) return questions;
    return getFallbackQuestions(course, currentLessonId);
  }, [questions, course, currentLessonId]);

  const currentBestScore = useMemo(() => {
    const localScore = portal.quizScores[currentLessonId];
    const serverScore = progressMap[currentLessonId]?.best_quiz_score ?? null;
    if (typeof localScore === "number" && serverScore !== null) {
      return Math.max(localScore, serverScore);
    }
    return typeof localScore === "number" ? localScore : serverScore;
  }, [portal.quizScores, progressMap, currentLessonId]);

  const safeResources = useMemo(() => {
    const raw = lesson?.resources ?? [];
    return raw
      .map((res) => {
        const safeUrl = isSafeHttpUrl(res.url);
        return safeUrl ? { ...res, url: safeUrl } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [lesson?.resources]);

  const safeSiteUrl = isSafeHttpUrl(course.site_url);
  const currentNote = portal.notes[currentLessonId] ?? "";

  const handleSelectTab = useCallback((tab: WorkspaceTab) => {
    setExamNight(false);
    setActiveTab(tab);
    if (tab === "lab") {
      setHasOpenedLab(true);
    }
  }, []);

  const handleToggleDone = useCallback(() => {
    if (!currentLessonId) return;
    const nowDone = toggleLessonComplete(currentLessonId);

    if (nowDone) {
      emitToast("تم حفظ إنجازك في الدرس ✓");
      const projectedDone = sortedLessons.filter(
        (l) => l.id === currentLessonId || completedSet.has(l.id)
      ).length;
      if (
        sortedLessons.length > 0 &&
        projectedDone >= sortedLessons.length
      ) {
        fireCelebrationConfetti();
      }
    } else {
      emitToast("تم إلغاء تحديد الدرس كمكتمل");
    }

    // Best-effort sync with /api/progress
    void fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson_id: currentLessonId,
        is_completed: nowDone,
      }),
    }).catch(() => {});
  }, [currentLessonId, sortedLessons, completedSet]);

  const handleCopyKeyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeKeyCode);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = activeKeyCode;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedCode(true);
    emitToast("تم نسخ الكود ✓");
    window.setTimeout(() => setCopiedCode(false), 1600);
  }, [activeKeyCode]);

  const handleCopyNotes = useCallback(async () => {
    const trimmed = currentNote.trim();
    if (!trimmed) {
      emitToast("اكتب ملاحظة الأول عشان تنسخها");
      return;
    }
    try {
      await navigator.clipboard.writeText(trimmed);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = trimmed;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    emitToast("تم نسخ ملاحظاتك ✓");
  }, [currentNote]);

  const handleTriggerUnlock = useCallback(() => {
    openUnlockModal({
      courseId: course.id,
      courseTitle: course.title,
      courseCode: course.code,
      unlockCode: course.unlock_code || "AI2026",
    });
  }, [course.id, course.title, course.code, course.unlock_code]);

  const handleToggleNotes = useCallback(() => {
    setNotesOpen((prev) => {
      const next = !prev;
      if (next) {
        window.setTimeout(() => {
          notesDrawerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 80);
      }
      return next;
    });
  }, []);

  const handleQuizScoreUpdate = useCallback(() => {
    // Score is already persisted in portalStore by QuizEngine
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col">
      {/* ==================== WORKSPACE TOPBAR ==================== */}
      <header className="topbar-shell sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-[1260px] items-center justify-between gap-2.5 px-3.5 sm:gap-3 sm:px-6 lg:px-8">
          {/* Right side (RTL start): Back + Course Code + Title */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href="/courses"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[12px] font-bold transition-colors hover:opacity-85 sm:px-3"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>المقررات</span>
            </Link>

            <div
              className="hidden h-5 w-px shrink-0 sm:block"
              style={{ background: "var(--border-strong)" }}
            />

            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <span
                className="font-mono-code shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-extrabold sm:text-[11px]"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                {course.code}
              </span>
              <span
                className="truncate text-[13px] font-extrabold sm:text-[15px]"
                style={{ color: "var(--text-primary)" }}
              >
                {course.title}
              </span>
            </div>
          </div>

          {/* Left side (RTL end): Progress, Desktop Actions (Ctrl+K, Cram Mode, Notes, Focus), Theme */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span
              className="inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-[11.5px] font-extrabold sm:gap-1.5 sm:px-3 sm:text-[12px]"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>{progressPct}%</span>
              <span className="hidden sm:inline">مكتمل</span>
            </span>

            <button
              type="button"
              onClick={() => openCommandPalette()}
              className="hidden h-9 items-center gap-1.5 rounded-xl border px-2.5 text-[11.5px] font-bold transition-colors hover:opacity-85 lg:inline-flex"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
              title="بحث سريع في المقررات والدروس"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="font-mono-code text-[10px]">Ctrl+K</span>
            </button>

            <button
              type="button"
              onClick={() => setExamNight((prev) => !prev)}
              aria-pressed={examNight}
              className="hidden h-9 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-extrabold transition-all lg:inline-flex"
              style={
                examNight
                  ? {
                      background: "var(--accent-warm)",
                      borderColor: "var(--accent-warm)",
                      color: "#ffffff",
                    }
                  : {
                      background: "var(--accent-warm-soft)",
                      borderColor: "var(--accent-warm)",
                      color: "var(--accent-warm-text)",
                    }
              }
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{examNight ? "خروج من ليلة الامتحان" : "ليلة الامتحان"}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleNotes}
              aria-pressed={notesOpen}
              className="hidden h-9 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-bold transition-colors lg:inline-flex"
              style={{
                background: notesOpen
                  ? "var(--brand-soft)"
                  : "var(--bg-surface)",
                borderColor: notesOpen
                  ? "var(--brand-primary)"
                  : "var(--border-soft)",
                color: notesOpen
                  ? "var(--brand-soft-text)"
                  : "var(--text-primary)",
              }}
            >
              <NotebookPen
                className="h-3.5 w-3.5"
                style={{ color: "var(--brand-primary)" }}
              />
              <span>نوتس</span>
              {currentNote.trim().length > 0 ? (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--accent-warm)" }}
                />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setFocusMode((prev) => !prev)}
              aria-pressed={focusMode}
              title="إخفاء القائمة الجانبية للتركيز"
              className="hidden h-9 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-bold transition-colors lg:inline-flex"
              style={{
                background: focusMode
                  ? "var(--brand-soft)"
                  : "var(--bg-surface)",
                borderColor: focusMode
                  ? "var(--brand-primary)"
                  : "var(--border-soft)",
                color: focusMode
                  ? "var(--brand-soft-text)"
                  : "var(--text-primary)",
              }}
            >
              {focusMode ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
              <span>{focusMode ? "إظهار الدروس" : "وضع التركيز"}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleTheme()}
              title="تبديل الوضع الفاتح والداكن"
              className="flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-[12px] font-semibold transition-colors"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              {isDark ? (
                <Sun
                  className="h-4 w-4"
                  style={{ color: "var(--brand-primary)" }}
                />
              ) : (
                <Moon
                  className="h-4 w-4"
                  style={{ color: "var(--brand-primary)" }}
                />
              )}
              <span className="hidden sm:inline">
                {isDark ? "فاتح" : "داكن"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== WORKSPACE BODY ==================== */}
      <main className="mx-auto w-full max-w-[1260px] flex-1 space-y-6 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        {/* Course Hero Strip + 5-Feature Switcher Dock */}
        <section className="surface-card space-y-5 rounded-[26px] p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[11.5px] font-bold"
                  style={{ color: "var(--accent-warm)" }}
                >
                  الفرقة {course.year_level} · الترم {course.term} ·{" "}
                  {course.duration_minutes} دقيقة
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
                  style={{
                    background:
                      !course.is_paid || isUnlockedLocally
                        ? "var(--success-soft)"
                        : "var(--accent-warm-soft)",
                    color:
                      !course.is_paid || isUnlockedLocally
                        ? "var(--success-fg)"
                        : "var(--accent-warm-text)",
                  }}
                >
                  {!course.is_paid
                    ? "مجاني بالكامل"
                    : isUnlockedLocally
                      ? "مفعّل بالكامل ✓"
                      : `${course.price} ج.م · الدرس 1 مجاني`}
                </span>
              </div>

              <h1
                className="text-lg font-black sm:text-2xl"
                style={{ color: "var(--text-primary)" }}
              >
                الدرس {lessonNumPadded} · {parsedLessonTitle.primary}
              </h1>
            </div>

            {!isLockedView ? (
              <button
                type="button"
                onClick={handleToggleDone}
                aria-pressed={isCurrentLessonDone}
                className="inline-flex min-h-[42px] shrink-0 items-center gap-2 self-start rounded-xl border px-4 py-2.5 text-[12.5px] font-extrabold transition-all hover:opacity-90 md:self-auto"
                style={{
                  background: isCurrentLessonDone
                    ? "var(--success-soft)"
                    : "var(--bg-canvas)",
                  borderColor: isCurrentLessonDone
                    ? "var(--success-fg)"
                    : "var(--border-strong)",
                  color: isCurrentLessonDone
                    ? "var(--success-fg)"
                    : "var(--text-primary)",
                }}
              >
                <Check className="h-4 w-4" />
                <span>
                  {isCurrentLessonDone
                    ? "مكتمل ✓ (اضغط للإلغاء)"
                    : "تحديد الدرس كمكتمل"}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTriggerUnlock}
                className="inline-flex min-h-[42px] shrink-0 items-center gap-2 self-start rounded-xl px-4 py-2.5 text-[12.5px] font-extrabold text-white transition-transform hover:scale-[1.02] md:self-auto"
                style={{ background: "#c25e33" }}
              >
                <KeyRound className="h-4 w-4" />
                <span>تفعيل المقرر بكود</span>
              </button>
            )}
          </div>

          {/* 5 Real Course Features Dock — Horizontally Swipeable on Mobile */}
          <div
            role="tablist"
            aria-label="أدوات دراسة الدرس"
            className="hide-scrollbar flex flex-nowrap items-center gap-1.5 overflow-x-auto rounded-2xl border p-1.5 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
            }}
          >
            {TOOL_TABS.map(({ id, label, Icon }) => {
              const isActive = !examNight && activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectTab(id)}
                  className={`tool-dock-pill min-h-[42px] shrink-0 snap-start whitespace-nowrap ${
                    isActive ? "active" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Right Sidebar: Course Lessons List (Desktop >= 1024px only; Mobile/Tablet uses Bottom Thumb Dock Drawer) */}
          {!focusMode ? (
            <aside className="surface-card hidden space-y-3.5 rounded-[24px] p-4 sm:p-5 lg:col-span-4 lg:block">
              <div
                className="flex items-center justify-between border-b pb-2"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <span
                  className="text-[13px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  دروس المقرر
                </span>
                <span
                  className="font-mono-code rounded-md px-2 py-0.5 text-[11px] font-bold"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {doneCount} / {sortedLessons.length}
                </span>
              </div>

              <div className="space-y-2">
                {sortedLessons.map((item, idx) => {
                  const done = completedSet.has(item.id);
                  const locked =
                    course.is_paid &&
                    !item.is_free_preview &&
                    !isUnlockedLocally;
                  const active = item.id === currentLessonId;
                  const itemTitle = splitBilingualTitle(item.title);
                  const subEn = item.title_en ?? itemTitle.secondaryEn ?? "";
                  const durationStr = item.duration_minutes
                    ? `${item.duration_minutes} د`
                    : "";

                  const cardStyle = {
                    background: active
                      ? "var(--accent-warm-soft)"
                      : "var(--bg-canvas)",
                    borderColor: active
                      ? "var(--accent-warm)"
                      : "var(--border-soft)",
                  };

                  const badgeStyle = {
                    background: done
                      ? "var(--success-fg)"
                      : active
                        ? "var(--accent-warm)"
                        : "var(--bg-subtle)",
                    color: done || active ? "#ffffff" : "var(--text-primary)",
                  };

                  const inner = (
                    <>
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="font-en flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11.5px] font-extrabold"
                          style={badgeStyle}
                        >
                          {done ? "✓" : String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 text-right">
                          <div
                            className="truncate text-[12.5px] font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {itemTitle.primary}
                          </div>
                          {subEn || durationStr ? (
                            <div
                              className="font-en truncate text-[10.5px]"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {[subEn, durationStr].filter(Boolean).join(" · ")}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {locked ? (
                        <span
                          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            background: "var(--accent-warm-soft)",
                            color: "var(--accent-warm-text)",
                          }}
                        >
                          <Lock className="h-2.5 w-2.5" />
                          <span>مغلق</span>
                        </span>
                      ) : null}
                    </>
                  );

                  if (locked) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={handleTriggerUnlock}
                        className="flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-2xl border p-3 text-right opacity-80 transition-all hover:opacity-100"
                        style={cardStyle}
                      >
                        {inner}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={`/courses/${course.slug}/${item.id}`}
                      className="flex w-full items-center justify-between gap-2.5 rounded-2xl border p-3 text-right transition-all hover:opacity-95"
                      style={cardStyle}
                    >
                      {inner}
                    </Link>
                  );
                })}
              </div>

              {/* Subtle Instructor Mini-Signature */}
              <div
                className="flex items-center justify-between gap-2.5 border-t pt-3.5"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Image
                    src="/images/founder.jpg"
                    alt="Ahmed Amir Ahmed"
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-full border object-cover object-[50%_15%]"
                    style={{ borderColor: "var(--border-strong)" }}
                  />
                  <div className="min-w-0 text-right">
                    <div
                      className="truncate text-[11.5px] font-extrabold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      شرح: <span className="font-en">Ahmed Amir Ahmed</span>
                    </div>
                    <div
                      className="truncate text-[10px] font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Faculty of Computers & AI
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          ) : null}

          {/* Left Main Feature Stage */}
          <section
            className={`surface-card min-h-[420px] overflow-hidden rounded-[24px] p-4 sm:p-7 ${
              focusMode ? "lg:col-span-12" : "lg:col-span-8"
            }`}
          >
            {/* ==================== EXAM-NIGHT CRAM MODE PANE ==================== */}
            {examNight ? (
              <div className="space-y-5">
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 text-white"
                  style={{
                    background: "linear-gradient(135deg, #182947, #c25e33)",
                  }}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-[11px] font-bold text-[#fed7aa]">
                      وضع ليلة الامتحان · مراجعة سريعة في 5 دقائق
                    </div>
                    <h2 className="text-base font-black sm:text-lg">
                      خلاصة ليلة الامتحان · {course.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExamNight(false)}
                    className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-white/15 px-3.5 py-1.5 text-[12px] font-bold transition-colors hover:bg-white/25"
                  >
                    العودة للدرس
                  </button>
                </div>

                <CheatSheetTable course={course} />

                <div
                  className="rounded-2xl border p-4 text-[13px] font-bold leading-relaxed"
                  style={{
                    background: "var(--accent-warm-soft)",
                    borderColor: "var(--accent-warm)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  {activeExamTip}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div
                      className="text-[12.5px] font-extrabold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      أهم كود للمراجعة السريعة:
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyKeyCode}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1 text-[11.5px] font-bold transition-colors hover:opacity-85"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {copiedCode ? (
                        <Check className="h-3.5 w-3.5 text-[var(--success-fg)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedCode ? "تم النسخ ✓" : "نسخ الكود"}</span>
                    </button>
                  </div>
                  <pre
                    dir="ltr"
                    className="code-ltr max-w-full overflow-x-auto text-[12px] leading-relaxed"
                  >
                    {activeKeyCode}
                  </pre>
                </div>
              </div>
            ) : isLockedView ? (
              /* ==================== EDITORIAL LOCK CARD ==================== */
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] p-6 text-center sm:p-10">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border"
                  style={{
                    background: "var(--accent-warm-soft)",
                    borderColor: "var(--accent-warm)",
                    color: "var(--accent-warm)",
                  }}
                >
                  <Lock className="h-7 w-7" />
                </div>

                <span
                  className="mb-1.5 text-[11.5px] font-extrabold"
                  style={{ color: "var(--accent-warm)" }}
                >
                  محتوى مدفوع للمشتركين · {course.code}
                </span>

                <h2
                  className="text-xl font-black sm:text-2xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  هذا الدرس جزء من مقرر {course.title}
                </h2>

                <p
                  className="mt-2 max-w-md text-[13.5px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  أدخل كود تفعيل المقرر لفتح جميع الدروس والشرح التفاعلي
                  والكويزات فوراً، أو جرّب الكود التجريبي{" "}
                  <span
                    className="font-mono-code rounded px-1.5 py-0.5 font-bold"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    {course.unlock_code || "AI2026"}
                  </span>
                  .
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleTriggerUnlock}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-extrabold text-white shadow-sm transition-transform hover:scale-[1.02]"
                    style={{ background: "#c25e33" }}
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>إدخال كود التفعيل ({course.price} ج.م)</span>
                  </button>

                  {firstFreeLesson && firstFreeLesson.id !== currentLessonId ? (
                    <Link
                      href={`/courses/${course.slug}/${firstFreeLesson.id}`}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-bold transition-colors hover:opacity-85"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border-strong)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>معاينة الدرس المجاني</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : (
              /* ==================== 5-TOOL ACTIVE STAGE ==================== */
              <>
                {/* TAB 1: Video Player */}
                <div className={activeTab === "video" ? "space-y-5" : "hidden"}>
                  <VideoPlayer
                    provider={lesson?.video_provider ?? "youtube"}
                    videoId={lesson?.video_id ?? null}
                    title={parsedLessonTitle.primary}
                    chapters={lessonChapters}
                    durationMinutes={
                      lesson?.duration_minutes ??
                      activeLessonMeta?.duration_minutes ??
                      null
                    }
                  />
                </div>

                {/* TAB 2: Interactive Lab (strictly lazy-mounted on first Lab click) */}
                <div className={activeTab === "lab" ? "space-y-5" : "hidden"}>
                  {hasOpenedLab ? (
                    <CourseInteractiveLab
                      course={course}
                      interactives={interactives}
                    />
                  ) : null}
                </div>

                {/* TAB 3: Dedicated Course Website Map */}
                <div className={activeTab === "site" ? "space-y-5" : "hidden"}>
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 border-b pb-3"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    <div>
                      <span
                        className="text-[11px] font-extrabold"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        موقع المادة المستقل
                      </span>
                      <h2
                        className="mt-0.5 text-lg font-black"
                        style={{ color: "var(--text-primary)" }}
                      >
                        خريطة موقع مقرر {course.title}
                      </h2>
                    </div>

                    {safeSiteUrl ? (
                      <a
                        href={safeSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-code inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-[11px] font-bold hover:opacity-85"
                        style={{
                          background: "var(--brand-soft)",
                          color: "var(--brand-soft-text)",
                        }}
                      >
                        <span>{course.site_url}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span
                        className="font-mono-code rounded-xl px-3 py-1 text-[11px] font-bold"
                        style={{
                          background: "var(--brand-soft)",
                          color: "var(--brand-soft-text)",
                        }}
                      >
                        {course.site_url}
                      </span>
                    )}
                  </div>

                  {/* Modules Grid — Clickable unlocked modules & unlock modal for locked modules */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {sortedLessons.map((item, idx) => {
                      const done = completedSet.has(item.id);
                      const locked =
                        course.is_paid &&
                        !item.is_free_preview &&
                        !isUnlockedLocally;
                      const isCurrent = item.id === currentLessonId;
                      const titleParts = splitBilingualTitle(item.title);
                      const durationLabel = item.duration_minutes
                        ? `${item.duration_minutes} د`
                        : "15 د";

                      const moduleCard = (
                        <div
                          className="group flex h-full flex-col justify-between space-y-2.5 rounded-2xl border p-4 text-right transition-all hover:-translate-y-0.5"
                          style={{
                            background: isCurrent
                              ? "var(--accent-warm-soft)"
                              : "var(--bg-canvas)",
                            borderColor: isCurrent
                              ? "var(--accent-warm)"
                              : "var(--border-soft)",
                          }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="font-mono-code rounded px-2 py-0.5 text-[11px] font-bold"
                                style={{
                                  background: "var(--bg-subtle)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                Module {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span
                                className="inline-flex items-center gap-1 text-[11px] font-bold"
                                style={{
                                  color: done
                                    ? "var(--success-fg)"
                                    : locked
                                      ? "var(--accent-warm)"
                                      : "var(--text-muted)",
                                }}
                              >
                                {locked ? (
                                  <>
                                    <Lock className="h-3 w-3" />
                                    <span>تفعيل بكود</span>
                                  </>
                                ) : done ? (
                                  <span>مكتمل ✓</span>
                                ) : (
                                  <span>{durationLabel}</span>
                                )}
                              </span>
                            </div>

                            <div
                              className="text-[14px] font-extrabold group-hover:underline"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {titleParts.primary}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div
                              className="flex flex-wrap gap-1.5 text-[10.5px] font-bold"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {["فيديو", "ملخص", "تفاعلي", "كويز"].map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded px-2 py-0.5"
                                  style={{ background: "var(--bg-subtle)" }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span
                              className="shrink-0 text-[11px] font-extrabold"
                              style={{
                                color: locked
                                  ? "var(--accent-warm)"
                                  : "var(--brand-primary)",
                              }}
                            >
                              {isCurrent
                                ? "الدرس الحالي"
                                : locked
                                  ? "فتح الكود ←"
                                  : "فتح الدرس ←"}
                            </span>
                          </div>
                        </div>
                      );

                      if (locked) {
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={handleTriggerUnlock}
                            className="w-full cursor-pointer text-right"
                          >
                            {moduleCard}
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={item.id}
                          href={`/courses/${course.slug}/${item.id}`}
                          className="block"
                        >
                          {moduleCard}
                        </Link>
                      );
                    })}
                  </div>

                  {/* External Resources (strictly http/https validated) */}
                  {safeResources.length > 0 ? (
                    <div
                      className="space-y-2.5 border-t pt-4"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      <div
                        className="text-[12.5px] font-extrabold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        مصادر وروابط إضافية للدرس
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {safeResources.map((res, idx) => (
                          <a
                            key={`${res.url}-${idx}`}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start justify-between gap-2.5 rounded-2xl border p-3.5 transition-all hover:-translate-y-0.5"
                            style={{
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                            }}
                          >
                            <div className="min-w-0 space-y-1">
                              <div
                                className="truncate text-[13px] font-extrabold group-hover:underline"
                                style={{ color: "var(--brand-primary)" }}
                              >
                                {res.title}
                              </div>
                              {res.description ? (
                                <p
                                  className="text-[11.5px] leading-relaxed"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {res.description}
                                </p>
                              ) : null}
                            </div>
                            <ExternalLink
                              className="mt-0.5 h-4 w-4 shrink-0"
                              style={{ color: "var(--text-muted)" }}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* TAB 4: Structured Summaries, LTR Code & Cheat Sheet */}
                <div
                  className={activeTab === "summary" ? "space-y-5" : "hidden"}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span
                        className="text-[11px] font-extrabold"
                        style={{ color: "var(--accent-warm)" }}
                      >
                        ملخص هندسي + كود LTR
                      </span>
                      <h2
                        className="mt-0.5 text-lg font-black"
                        style={{ color: "var(--text-primary)" }}
                      >
                        ملخص {parsedLessonTitle.primary}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyKeyCode}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[12px] font-bold transition-colors hover:opacity-85"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {copiedCode ? (
                        <Check
                          className="h-3.5 w-3.5"
                          style={{ color: "var(--success-fg)" }}
                        />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedCode ? "تم النسخ ✓" : "نسخ الكود"}</span>
                    </button>
                  </div>

                  {/* Full Markdown + KaTeX Summary when available */}
                  {lesson?.summary_md ? (
                    <MarkdownViewer content={lesson.summary_md} embedded />
                  ) : null}

                  {/* Key Code LTR Block */}
                  {activeKeyCode ? (
                    <div className="space-y-1.5">
                      <div
                        className="text-[12px] font-extrabold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        الكود الأساسي للمراجعة السريعة (LTR):
                      </div>
                      <pre
                        dir="ltr"
                        className="code-ltr max-w-full overflow-x-auto text-[12.5px] leading-relaxed"
                      >
                        {activeKeyCode}
                      </pre>
                    </div>
                  ) : null}

                  {/* Exam Tip Callout */}
                  {activeExamTip ? (
                    <div
                      className="rounded-2xl border p-4 text-[13px] font-semibold leading-relaxed"
                      style={{
                        background: "var(--accent-warm-soft)",
                        borderColor:
                          "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                        color: "var(--accent-warm-text)",
                      }}
                    >
                      {activeExamTip}
                    </div>
                  ) : null}

                  {/* Quick Cheat Sheet Reference Table */}
                  <div className="space-y-2 pt-2">
                    <div
                      className="flex items-center gap-1.5 text-[12px] font-extrabold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      <Table2 className="h-4 w-4 shrink-0" />
                      <span>
                        ورقة القوانين والمقارنات السريعة (Cheat Sheet)
                      </span>
                    </div>
                    <CheatSheetTable course={course} />
                  </div>
                </div>

                {/* TAB 5: Course-Specific Instant Quiz */}
                <div className={activeTab === "quiz" ? "space-y-5" : "hidden"}>
                  <QuizEngine
                    key={currentLessonId}
                    lessonId={currentLessonId}
                    courseId={course.id}
                    courseCode={course.code}
                    questions={effectiveQuestions}
                    bestScore={currentBestScore}
                    onScoreUpdate={handleQuizScoreUpdate}
                  />
                </div>
              </>
            )}

            {/* ==================== QUICK LESSON NOTES DRAWER ==================== */}
            {notesOpen ? (
              <div
                ref={notesDrawerRef}
                id="lesson-notes-drawer"
                className="mt-5 space-y-3 border-t pt-5"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div
                    className="flex min-w-0 items-center gap-2 text-[13px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <NotebookPen
                      className="h-4 w-4 shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <span className="truncate">
                      ملاحظاتك على: {parsedLessonTitle.primary}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-md px-2 py-0.5 text-[10.5px] font-bold"
                      style={{
                        background: "var(--success-soft)",
                        color: "var(--success-fg)",
                      }}
                    >
                      حفظ تلقائي ✓
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNotes}
                      className="inline-flex min-h-[36px] items-center rounded-xl border px-3 py-1 text-[11.5px] font-bold transition-colors hover:opacity-85"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      نسخ الملاحظات
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={currentNote}
                  onChange={(e) =>
                    setLessonNote(currentLessonId, e.target.value)
                  }
                  placeholder="اكتب هنا أي فكرة قالها المحاضر أو ملاحظة عاوز تفتكرها ليلة الامتحان... (حفظ تلقائي)"
                  className="w-full rounded-2xl border p-3.5 text-[13px] leading-relaxed outline-none focus:ring-2"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            ) : null}
          </section>
        </div>
      </main>

      {/* ==================== STICKY MOBILE BOTTOM THUMB-ZONE DOCK (< 1024px) ==================== */}
      <nav
        aria-label="شريط أدوات المذاكرة السريع للموبايل"
        className="fixed inset-x-0 bottom-0 z-40 border-t px-2.5 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
        style={{
          background: "color-mix(in srgb, var(--bg-surface) 92%, transparent)",
          borderColor: "var(--border-soft)",
          boxShadow: "0 -8px 28px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1.5">
          {/* 1. الدروس (done/total) */}
          <button
            type="button"
            onClick={() => setMobileLessonsOpen(true)}
            aria-expanded={mobileLessonsOpen}
            className="flex min-h-[46px] flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-1 text-[11px] font-extrabold transition-all"
            style={{
              background: mobileLessonsOpen
                ? "var(--brand-soft)"
                : "var(--bg-canvas)",
              borderColor: mobileLessonsOpen
                ? "var(--brand-primary)"
                : "var(--border-soft)",
              color: mobileLessonsOpen
                ? "var(--brand-soft-text)"
                : "var(--text-primary)",
            }}
          >
            <ListVideo
              className="h-4 w-4 shrink-0"
              style={{ color: "var(--brand-primary)" }}
            />
            <span className="truncate">
              الدروس ({doneCount}/{sortedLessons.length})
            </span>
          </button>

          {/* 2. ليلة الامتحان */}
          <button
            type="button"
            onClick={() => setExamNight((prev) => !prev)}
            aria-pressed={examNight}
            className="flex min-h-[46px] flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-1 text-[11px] font-extrabold transition-all"
            style={
              examNight
                ? {
                    background: "var(--accent-warm)",
                    borderColor: "var(--accent-warm)",
                    color: "#ffffff",
                  }
                : {
                    background: "var(--accent-warm-soft)",
                    borderColor: "var(--accent-warm)",
                    color: "var(--accent-warm-text)",
                  }
            }
          >
            <Zap className="h-4 w-4 shrink-0" />
            <span className="truncate">ليلة الامتحان</span>
          </button>

          {/* 3. نوتس */}
          <button
            type="button"
            onClick={handleToggleNotes}
            aria-pressed={notesOpen}
            className="relative flex min-h-[46px] flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-1 text-[11px] font-extrabold transition-all"
            style={{
              background: notesOpen ? "var(--brand-soft)" : "var(--bg-canvas)",
              borderColor: notesOpen
                ? "var(--brand-primary)"
                : "var(--border-soft)",
              color: notesOpen
                ? "var(--brand-soft-text)"
                : "var(--text-primary)",
            }}
          >
            <div className="relative inline-flex items-center">
              <NotebookPen
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--brand-primary)" }}
              />
              {currentNote.trim().length > 0 ? (
                <span
                  aria-hidden="true"
                  className="-top-0.5 -end-1.5 absolute h-2 w-2 rounded-full"
                  style={{ background: "var(--accent-warm)" }}
                />
              ) : null}
            </div>
            <span className="truncate">نوتس</span>
          </button>

          {/* 4. بحث */}
          <button
            type="button"
            onClick={() => openCommandPalette()}
            className="flex min-h-[46px] flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-1 text-[11px] font-extrabold transition-all"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            <Search
              className="h-4 w-4 shrink-0"
              style={{ color: "var(--text-secondary)" }}
            />
            <span className="truncate">بحث</span>
          </button>
        </div>
      </nav>

      {/* ==================== SLIDE-OVER MOBILE LESSONS DRAWER (< 1024px) ==================== */}
      {mobileLessonsOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="دروس المقرر"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="modal-backdrop fixed inset-0"
            onClick={() => setMobileLessonsOpen(false)}
          />

          {/* Slide-Over Panel */}
          <div
            className="relative z-10 flex h-full w-full max-w-[340px] flex-col border-e p-4 shadow-2xl sm:p-5"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div
              className="flex items-center justify-between gap-2 border-b pb-3"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[14px] font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  دروس المقرر
                </span>
                <span
                  className="font-mono-code rounded-md px-2 py-0.5 text-[11px] font-bold"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {doneCount} / {sortedLessons.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileLessonsOpen(false)}
                aria-label="إغلاق قائمة الدروس"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:opacity-85"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto py-3.5">
              {sortedLessons.map((item, idx) => {
                const done = completedSet.has(item.id);
                const locked =
                  course.is_paid &&
                  !item.is_free_preview &&
                  !isUnlockedLocally;
                const active = item.id === currentLessonId;
                const itemTitle = splitBilingualTitle(item.title);
                const subEn = item.title_en ?? itemTitle.secondaryEn ?? "";
                const durationStr = item.duration_minutes
                  ? `${item.duration_minutes} د`
                  : "";

                const cardStyle = {
                  background: active
                    ? "var(--accent-warm-soft)"
                    : "var(--bg-canvas)",
                  borderColor: active
                    ? "var(--accent-warm)"
                    : "var(--border-soft)",
                };

                const badgeStyle = {
                  background: done
                    ? "var(--success-fg)"
                    : active
                      ? "var(--accent-warm)"
                      : "var(--bg-subtle)",
                  color: done || active ? "#ffffff" : "var(--text-primary)",
                };

                const inner = (
                  <>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="font-en flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11.5px] font-extrabold"
                        style={badgeStyle}
                      >
                        {done ? "✓" : String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 text-right">
                        <div
                          className="truncate text-[12.5px] font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {itemTitle.primary}
                        </div>
                        {subEn || durationStr ? (
                          <div
                            className="font-en truncate text-[10.5px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {[subEn, durationStr].filter(Boolean).join(" · ")}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {locked ? (
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          background: "var(--accent-warm-soft)",
                          color: "var(--accent-warm-text)",
                        }}
                      >
                        <Lock className="h-2.5 w-2.5" />
                        <span>مغلق</span>
                      </span>
                    ) : null}
                  </>
                );

                if (locked) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMobileLessonsOpen(false);
                        handleTriggerUnlock();
                      }}
                      className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-2.5 rounded-2xl border p-3 text-right opacity-85 transition-all hover:opacity-100"
                      style={cardStyle}
                    >
                      {inner}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={`/courses/${course.slug}/${item.id}`}
                    onClick={() => setMobileLessonsOpen(false)}
                    className="flex min-h-[52px] w-full items-center justify-between gap-2.5 rounded-2xl border p-3 text-right transition-all hover:opacity-95"
                    style={cardStyle}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>

            {/* Subtle Instructor Mini-Signature in Mobile Drawer */}
            <div
              className="flex items-center justify-between gap-2.5 border-t pt-3.5"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Image
                  src="/images/founder.jpg"
                  alt="Ahmed Amir Ahmed"
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full border object-cover object-[50%_15%]"
                  style={{ borderColor: "var(--border-strong)" }}
                />
                <div className="min-w-0 text-right">
                  <div
                    className="truncate text-[11.5px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    شرح: <span className="font-en">Ahmed Amir Ahmed</span>
                  </div>
                  <div
                    className="truncate text-[10px] font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Faculty of Computers & AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Footer variant="compact" className="pb-20 lg:pb-0" />
    </div>
  );
}
