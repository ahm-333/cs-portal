"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CheckSquare,
  Copy,
  Cpu,
  FileCode2,
  Lightbulb,
  Minus,
  Pause,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  XCircle,
} from "lucide-react";

export type PreviewTabId = "video" | "interactive" | "summary" | "quiz";

interface TabMeta {
  id: PreviewTabId;
  indexLabel: string;
  title: string;
  shortTag: string;
  accentColor: string;
  accentSoft: string;
  accentText: string;
}

const PREVIEW_TABS: readonly TabMeta[] = [
  {
    id: "video",
    indexLabel: "01 / 04",
    title: "فيديو شرح للفصل",
    shortTag: "فيديو مقسّم",
    accentColor: "var(--accent-warm)",
    accentSoft: "var(--accent-warm-soft)",
    accentText: "var(--accent-warm-text)",
  },
  {
    id: "interactive",
    indexLabel: "02 / 04",
    title: "الشرح التفاعلي للفصل",
    shortTag: "معمل حيّ",
    accentColor: "var(--success-fg)",
    accentSoft: "var(--success-soft)",
    accentText: "var(--success-fg)",
  },
  {
    id: "summary",
    indexLabel: "03 / 04",
    title: "ملخص وأكواد الفصل",
    shortTag: "ملخص وكود",
    accentColor: "var(--brand-primary)",
    accentSoft: "var(--brand-soft)",
    accentText: "var(--brand-soft-text)",
  },
  {
    id: "quiz",
    indexLabel: "04 / 04",
    title: "كويزات وأسئلة الفصل",
    shortTag: "كويز فوري",
    accentColor: "var(--accent-warm)",
    accentSoft: "var(--success-soft)",
    accentText: "var(--success-fg)",
  },
] as const;

const VALID_TAB_IDS: readonly PreviewTabId[] = [
  "video",
  "interactive",
  "summary",
  "quiz",
];

/* ================= TAB 1: VIDEO DATA ================= */

interface VideoChapter {
  timeSec: number;
  label: string;
  detail: string;
  progress: number;
}

const VIDEO_CHAPTERS: readonly VideoChapter[] = [
  {
    timeSec: 0,
    label: "00:00 · بنية العقدة Node",
    detail: "تمثيل القيمة data والمؤشر next في الذاكرة",
    progress: 10,
  },
  {
    timeSec: 375,
    label: "06:15 · الإدراج في البداية",
    detail: "ربط العقدة الجديدة وتحديث مؤشر head",
    progress: 46,
  },
  {
    timeSec: 700,
    label: "11:40 · تحليل Big-O",
    detail: "مقارنة سرعة الإدراج والبحث مع الـ Array",
    progress: 78,
  },
];

const SPEED_OPTIONS = ["1.0x", "1.5x", "2.0x"] as const;
const VIDEO_TOTAL_SEC = 1000; // 16:40

function formatTime(totalSec: number): string {
  const clamped = Math.max(0, Math.min(VIDEO_TOTAL_SEC, Math.floor(totalSec)));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ================= TAB 2: LINKED LIST LAB DATA ================= */

interface LinkedNode {
  id: number;
  value: number;
  isNew: boolean;
}

const MAX_LAB_NODES = 5;

const INITIAL_NODES: LinkedNode[] = [
  { id: 1, value: 12, isNew: false },
  { id: 2, value: 27, isNew: false },
  { id: 3, value: 45, isNew: false },
];

const INITIAL_STEP_NOTE =
  "مؤشر HEAD يشير حالياً إلى العقدة (12) — جرّب الإضافة أو الحذف لترى كيف تتحدث المؤشرات في خطوة واحدة.";

/* ================= TAB 3: SUMMARY & C++ CODE DATA ================= */

const RAW_CPP_CODE = `// Insert a new node at the head in O(1) time
struct Node {
  int data;
  Node* next;
  Node(int val) : data(val), next(nullptr) {}
};

void insertHead(Node*& head, int val) {
  Node* fresh = new Node(val);
  fresh->next = head; // point to old head
  head = fresh;       // move head pointer
}`;

const SUMMARY_TAKEAWAYS = [
  {
    title: "بنية العقدة في الذاكرة",
    body: "كل عقدة تحفظ قيمتها data ومؤشر next يشير لعنوان العقدة التالية مباشرة.",
  },
  {
    title: "حجم مرن بدون نسخ",
    body: "على عكس الـ Array، لا تحتاج حجز مساحة متجاورة مسبقاً ولا نقل العناصر عند الإضافة.",
  },
  {
    title: "تحديث المؤشرات بحذر",
    body: "اربط fresh->next = head أولاً قبل تحريك head وإلا ستفقد بقية القائمة في الذاكرة.",
  },
] as const;

/* ================= TAB 4: QUIZ DATA ================= */

interface QuizOption {
  letter: "A" | "B" | "C" | "D";
  label: string;
  isMono?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: readonly QuizOption[];
  correctLetter: "A" | "B" | "C" | "D";
  explanation: string;
}

const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "q1",
    question:
      "ما هو التعقيد الزمني (Time Complexity) لإضافة عقدة جديدة في بداية Singly Linked List؟",
    options: [
      { letter: "A", label: "O(1)", isMono: true },
      { letter: "B", label: "O(log n)", isMono: true },
      { letter: "C", label: "O(n)", isMono: true },
      { letter: "D", label: "O(n²)", isMono: true },
    ],
    correctLetter: "A",
    explanation:
      "الإدراج في البداية يعدّل مؤشر next للعقدة الجديدة ثم مؤشر head فقط — خطوات ثابتة بغض النظر عن طول القائمة O(1).",
  },
  {
    id: "q2",
    question:
      "أي بنية بيانات تمنحك وصولاً عشوائياً مباشراً للعنصر باستخدام الـ index في وقت ثابت O(1)؟",
    options: [
      { letter: "A", label: "Singly Linked List", isMono: true },
      { letter: "B", label: "Array", isMono: true },
      { letter: "C", label: "Queue", isMono: true },
      { letter: "D", label: "Stack", isMono: true },
    ],
    correctLetter: "B",
    explanation:
      "عناصر الـ Array متجاورة في الذاكرة، فيُحسب عنوان العنصر مباشرةً عبر (base + index × size) في وقت ثابت O(1).",
  },
];

function renderTabIcon(id: PreviewTabId) {
  switch (id) {
    case "video":
      return <PlayCircle className="w-4 h-4 shrink-0" />;
    case "interactive":
      return <Cpu className="w-4 h-4 shrink-0" />;
    case "summary":
      return <FileCode2 className="w-4 h-4 shrink-0" />;
    case "quiz":
      return <CheckSquare className="w-4 h-4 shrink-0" />;
  }
}

export function LiveChapterPreview() {
  const [activeTab, setActiveTab] = useState<PreviewTabId>("video");
  const [syncPulse, setSyncPulse] = useState(false);
  const pulseTimeoutRef = useRef<number | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  // Tab 1: Video state
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(1);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Tab 2: Linked List Lab state
  const [nodes, setNodes] = useState<LinkedNode[]>(INITIAL_NODES);
  const [nextNodeId, setNextNodeId] = useState(4);
  const [labStepNote, setLabStepNote] = useState(INITIAL_STEP_NOTE);

  // Tab 3: Code Copy state
  const [copiedCode, setCopiedCode] = useState(false);

  // Tab 4: Sequential 2-Question Quiz state
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>(
    {}
  );
  const [quizFinished, setQuizFinished] = useState(false);

  // Cross-section sync listener
  useEffect(() => {
    const handleExternalSelect = (event: Event) => {
      const customEvent = event as CustomEvent<unknown>;
      const detail = customEvent.detail;
      if (
        typeof detail === "string" &&
        (VALID_TAB_IDS as readonly string[]).includes(detail)
      ) {
        setActiveTab(detail as PreviewTabId);
        setSyncPulse(true);
        if (pulseTimeoutRef.current !== null) {
          window.clearTimeout(pulseTimeoutRef.current);
        }
        pulseTimeoutRef.current = window.setTimeout(() => {
          setSyncPulse(false);
        }, 950);
      }
    };

    window.addEventListener(
      "cs-portal-select-preview-tab",
      handleExternalSelect
    );
    return () => {
      window.removeEventListener(
        "cs-portal-select-preview-tab",
        handleExternalSelect
      );
      if (pulseTimeoutRef.current !== null) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Video live clock ticker
  useEffect(() => {
    if (!isPlaying || activeTab !== "video") return;
    const speedMultiplier = speedIdx === 0 ? 1 : speedIdx === 1 ? 1.5 : 2;
    const intervalMs = Math.round(1000 / speedMultiplier);
    const id = window.setInterval(() => {
      setElapsedSec((prev) => (prev < 90 ? prev + 1 : 0));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [isPlaying, activeTab, speedIdx]);

  const activeMeta =
    PREVIEW_TABS.find((t) => t.id === activeTab) ?? PREVIEW_TABS[0];

  const handleTabKeyDown = (
    currentIndex: number,
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex + 1) % PREVIEW_TABS.length;
    } else if (e.key === "ArrowRight") {
      nextIndex =
        (currentIndex - 1 + PREVIEW_TABS.length) % PREVIEW_TABS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = PREVIEW_TABS.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      setActiveTab(PREVIEW_TABS[nextIndex].id);
    }
  };

  /* ---- Video handlers ---- */
  const activeChapter =
    VIDEO_CHAPTERS[selectedChapterIdx] ?? VIDEO_CHAPTERS[1];
  const liveTimeStr = formatTime(activeChapter.timeSec + elapsedSec);
  const liveProgressPct = Math.min(
    98,
    activeChapter.progress + elapsedSec * 0.25
  );

  const handleSelectChapter = (idx: number) => {
    setSelectedChapterIdx(idx);
    setElapsedSec(0);
  };

  /* ---- Linked List Lab handlers ---- */
  const handlePushHead = () => {
    if (nodes.length >= MAX_LAB_NODES) return;
    const newVal = ((nextNodeId * 19 + 13) % 83) + 11;
    const previousHead = nodes[0];
    setNodes((prev) => [
      { id: nextNodeId, value: newVal, isNew: true },
      ...prev.map((n) => ({ ...n, isNew: false })),
    ]);
    setNextNodeId((prev) => prev + 1);
    if (previousHead) {
      setLabStepNote(
        `أضفنا العقدة (${newVal})، وجّهنا مؤشر next الخاص بها إلى (${previousHead.value})، ثم حرّكنا HEAD إليها مباشرة في O(1).`
      );
    } else {
      setLabStepNote(
        `أضفنا أول عقدة (${newVal}) ووجّهنا next إلى NULL، ثم أصبح مؤشر HEAD يشير إليها في O(1).`
      );
    }
  };

  const handlePopHead = () => {
    if (nodes.length === 0) return;
    const removed = nodes[0];
    const nextHead = nodes[1];
    setNodes((prev) =>
      prev.slice(1).map((n, idx) => ({ ...n, isNew: idx === 0 }))
    );
    if (nextHead) {
      setLabStepNote(
        `حذفنا العقدة (${removed.value}) وحرّكنا مؤشر HEAD مباشرةً إلى العقدة التالية (${nextHead.value}) في O(1).`
      );
    } else {
      setLabStepNote(
        `حذفنا آخر عقدة (${removed.value}) وأصبح مؤشر HEAD يشير الآن إلى NULL في O(1).`
      );
    }
  };

  const handleResetLab = () => {
    setNodes(INITIAL_NODES);
    setNextNodeId(4);
    setLabStepNote(INITIAL_STEP_NOTE);
  };

  /* ---- Copy Code handler ---- */
  const handleCopyCode = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        void navigator.clipboard.writeText(RAW_CPP_CODE);
      }
    } catch {
      // Clipboard API may be unavailable in restricted contexts
    }
    setCopiedCode(true);
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopiedCode(false);
    }, 1800);
  };

  /* ---- Quiz handlers ---- */
  const currentQuestion = QUIZ_QUESTIONS[questionIdx] ?? QUIZ_QUESTIONS[0];
  const currentAnswer = answers[currentQuestion.id];
  const isCurrentCorrect = currentAnswer === currentQuestion.correctLetter;

  const totalScore = QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctLetter ? 1 : 0);
  }, 0);

  const handleSelectQuizOption = async (letter: "A" | "B" | "C" | "D") => {
    if (answers[currentQuestion.id]) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: letter }));

    if (letter === currentQuestion.correctLetter) {
      try {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (!reducedMotion) {
          const confettiModule = await import("canvas-confetti");
          confettiModule.default({
            particleCount: 44,
            spread: 60,
            origin: { y: 0.72 },
            colors: ["#c25e33", "#66c7a6", "#7ca7f0"],
          });
        }
      } catch {
        // Ignore confetti failures
      }
    }
  };

  const handleNextOrFinishQuiz = () => {
    if (questionIdx < QUIZ_QUESTIONS.length - 1) {
      setQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setQuestionIdx(0);
    setQuizFinished(false);
  };

  return (
    <section
      id="chapter-preview"
      className="reveal max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10 space-y-6"
    >
      {/* ================= SECTION HEADER ================= */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[12px] font-extrabold tracking-wide"
          style={{
            background: "var(--accent-warm-soft)",
            borderColor:
              "color-mix(in srgb, var(--accent-warm) 28%, transparent)",
            color: "var(--accent-warm-text)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>تجربة حيّة قبل ما تدخل</span>
        </div>

        <h2
          className="text-2xl sm:text-4xl font-black tracking-tight leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          كل فصل متقسّم لـ 4 أركان متكاملة
        </h2>

        <p
          className="text-[14px] sm:text-[15.5px] leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          قلّب بين التابات الـ 4 وجرّب بنفسك شكل المذاكرة جوا كل فصل — من الفيديو
          للمعمل التفاعلي للملخص للكويز.
        </p>
      </div>

      {/* ================= STUDIO WINDOW CHROME SHELL ================= */}
      <div
        className={`surface-card rounded-[28px] overflow-hidden transition-all duration-300 ${
          syncPulse
            ? "ring-4 ring-[var(--accent-warm)]/35 border-[var(--accent-warm)]"
            : ""
        }`}
      >
        {/* Top Workspace Chrome Bar */}
        <div
          className="px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3"
          style={{
            background: "var(--bg-canvas)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Subtle macOS-style window dots */}
            <div
              className="hidden sm:flex items-center gap-1.5 shrink-0"
              aria-hidden="true"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#e58a62]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e5b755]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#66c7a6]/85" />
            </div>

            {/* Chapter Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1.5 text-[12px] sm:text-[13px] font-extrabold min-w-0">
              <span
                className="font-mono-code px-2 py-0.5 rounded-md text-[11px] font-black shrink-0"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                CS-213
              </span>
              <span
                className="opacity-45"
                style={{ color: "var(--text-muted)" }}
                aria-hidden="true"
              >
                ·
              </span>
              <span style={{ color: "var(--text-secondary)" }}>الفصل 02</span>
              <span
                className="opacity-45"
                style={{ color: "var(--text-muted)" }}
                aria-hidden="true"
              >
                ·
              </span>
              <span
                className="truncate"
                style={{ color: "var(--text-primary)" }}
              >
                القوائم المترابطة{" "}
                <span className="font-en font-bold opacity-80">
                  (Linked Lists)
                </span>
              </span>
            </div>
          </div>

          {/* Live Pillar Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="hidden md:inline-block text-[11.5px] font-bold"
              style={{ color: "var(--text-muted)" }}
            >
              {activeMeta.shortTag}
            </span>
            <span
              className="font-mono-code text-[11.5px] font-black px-2.5 py-1 rounded-lg border transition-colors duration-200"
              style={{
                background: activeMeta.accentSoft,
                color: activeMeta.accentText,
                borderColor:
                  "color-mix(in srgb, var(--border-strong) 45%, transparent)",
              }}
            >
              {activeMeta.indexLabel}
            </span>
          </div>
        </div>

        {/* 4 Clean Accessible Tabs */}
        <div
          className="px-3 sm:px-5 py-3 border-b"
          style={{
            background: "var(--bg-subtle)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div
            role="tablist"
            aria-label="معاينة أركان الفصل الأربعة"
            className="grid grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {PREVIEW_TABS.map((tab, idx) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`preview-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`preview-panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(idx, e)}
                  className="group relative rounded-2xl px-3 py-2.5 sm:px-3.5 sm:py-3 border text-right flex items-center gap-2.5 cursor-pointer transition-all duration-200"
                  style={{
                    background: isSelected
                      ? "var(--bg-surface)"
                      : "transparent",
                    borderColor: isSelected
                      ? tab.accentColor
                      : "transparent",
                    boxShadow: isSelected ? "var(--shadow-card)" : "none",
                  }}
                >
                  <span
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: isSelected
                        ? tab.accentSoft
                        : "var(--bg-surface)",
                      color: isSelected
                        ? tab.accentText
                        : "var(--text-secondary)",
                    }}
                  >
                    {renderTabIcon(tab.id)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-[11.5px] sm:text-[12.5px] font-extrabold leading-snug line-clamp-2"
                      style={{
                        color: isSelected
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {tab.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= ACTIVE TAB STAGE ================= */}
        <div
          id={`preview-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`preview-tab-${activeTab}`}
          className="p-4 sm:p-6 lg:p-7"
        >
          {/* ---------- TAB 1: VIDEO LECTURE ---------- */}
          {activeTab === "video" && (
            <div
              key="video"
              className="fview-pane grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
            >
              {/* Cinema Video Frame */}
              <div className="lg:col-span-8 flex flex-col">
                <div className="relative w-full h-[230px] sm:h-[300px] lg:h-[340px] rounded-2xl overflow-hidden border border-white/15 bg-[#0b1322] shadow-lg group">
                  <Image
                    src="/images/tools/video-preview.jpg"
                    alt="معاينة فيديو شرح القوائم المترابطة"
                    fill
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  {/* Clean Bottom Dark Gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#070d18]/95 via-[#070d18]/25 to-[#070d18]/30 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 text-slate-100 truncate max-w-[68%]">
                      {activeChapter.label}
                    </span>
                    <span className="font-mono-code text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 text-[#a7f3d0] shrink-0">
                      1080p HD
                    </span>
                  </div>

                  {/* Interactive Center Play/Pause Button */}
                  <button
                    type="button"
                    onClick={() => setIsPlaying((prev) => !prev)}
                    aria-label={isPlaying ? "إيقاف الفيديو" : "تشغيل الفيديو"}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white border border-white/30 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xl ${
                      isPlaying
                        ? "bg-black/50 opacity-85 hover:opacity-100 scale-95"
                        : "bg-[#c25e33]/92 hover:bg-[#c25e33] hover:scale-105"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-white" />
                    ) : (
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    )}
                  </button>

                  {/* Bottom Player Controls */}
                  <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3.5 pt-3 space-y-2.5">
                    <div
                      className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden"
                      role="progressbar"
                      aria-label="تقدم الفيديو"
                      aria-valuenow={Math.round(liveProgressPct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-[#66c7a6] to-[#e58a62] transition-all duration-300"
                        style={{ width: `${liveProgressPct}%` }}
                      />
                    </div>

                    <div
                      dir="ltr"
                      className="flex items-center justify-between gap-2 text-white"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying((prev) => !prev)}
                          aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                          className="inline-flex items-center justify-center hover:text-[#f0a786] cursor-pointer transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current" />
                          )}
                        </button>
                        <Volume2
                          className="w-4 h-4 text-slate-300"
                          aria-hidden="true"
                        />
                        <span className="font-mono-code text-[11.5px] font-bold tabular-nums text-slate-200">
                          {liveTimeStr} / 16:40
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-block text-[10.5px] font-semibold text-slate-300">
                          {isPlaying ? "قيد التشغيل" : "متوقف مؤقتاً"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSpeedIdx(
                              (prev) => (prev + 1) % SPEED_OPTIONS.length
                            )
                          }
                          aria-label="تغيير سرعة التشغيل"
                          className="font-mono-code px-2.5 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-[11px] font-extrabold text-white cursor-pointer transition-colors"
                        >
                          {SPEED_OPTIONS[speedIdx]}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapters Sidebar + Editorial Note */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[13px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      انتقل لأي جزئية في الفصل
                    </span>
                    <span
                      className="font-mono-code text-[11px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      3 فصول
                    </span>
                  </div>

                  <div className="space-y-2">
                    {VIDEO_CHAPTERS.map((chap, idx) => {
                      const isActiveChap = selectedChapterIdx === idx;
                      return (
                        <button
                          key={chap.label}
                          type="button"
                          onClick={() => handleSelectChapter(idx)}
                          className="w-full text-right px-3.5 py-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-2.5"
                          style={{
                            background: isActiveChap
                              ? "var(--accent-warm-soft)"
                              : "var(--bg-canvas)",
                            borderColor: isActiveChap
                              ? "var(--accent-warm)"
                              : "var(--border-soft)",
                          }}
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div
                              className="text-[12.5px] font-extrabold leading-snug"
                              style={{
                                color: isActiveChap
                                  ? "var(--accent-warm-text)"
                                  : "var(--text-primary)",
                              }}
                            >
                              {chap.label}
                            </div>
                            <div
                              className="text-[11.5px] font-medium leading-relaxed"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {chap.detail}
                            </div>
                          </div>
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                            style={{
                              background: isActiveChap
                                ? "var(--accent-warm)"
                                : "var(--bg-surface)",
                              color: isActiveChap
                                ? "#ffffff"
                                : "var(--text-muted)",
                            }}
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="rounded-xl border px-3.5 py-3 flex items-start gap-2.5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <PlayCircle
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: "var(--accent-warm)" }}
                  />
                  <p
                    className="text-[12.5px] font-bold leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    كل فصل متقسّم لفصول زمنية توصل منها للجزئية اللي واقفة معاك
                    في ثانية.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ---------- TAB 2: INTERACTIVE LINKED LIST LAB ---------- */}
          {activeTab === "interactive" && (
            <div key="interactive" className="fview-pane space-y-5">
              {/* Top Controls & Live Stats */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[13px] font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    معمل القوائم المترابطة
                  </span>
                  <span
                    className="text-[11.5px] font-extrabold px-2.5 py-1 rounded-lg border"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    الطول: {nodes.length} عقد
                  </span>
                  <span
                    className="text-[11.5px] font-extrabold px-2.5 py-1 rounded-lg"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    التعقيد:{" "}
                    <span className="font-mono-code font-black">O(1)</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePushHead}
                    disabled={nodes.length >= MAX_LAB_NODES}
                    className="px-3.5 py-2 rounded-xl text-[12px] font-extrabold text-white inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                    style={{ background: "var(--success-fg)" }}
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>إضافة عقدة في البداية</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePopHead}
                    disabled={nodes.length === 0}
                    className="px-3.5 py-2 rounded-xl border text-[12px] font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                    style={{
                      background: "var(--accent-warm-soft)",
                      borderColor:
                        "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                      color: "var(--accent-warm-text)",
                    }}
                  >
                    <Minus className="w-3.5 h-3.5 shrink-0" />
                    <span>حذف من البداية</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetLab}
                    className="px-3 py-2 rounded-xl border text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span>إعادة ضبط</span>
                  </button>
                </div>
              </div>

              {/* Visual LTR Memory Chain Stage */}
              <div
                dir="ltr"
                className="rounded-2xl border editorial-dots px-4 sm:px-6 py-8 sm:py-10 overflow-x-auto"
                style={{
                  backgroundColor: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div className="min-w-max mx-auto flex items-center justify-center gap-2.5 sm:gap-3.5">
                  {/* HEAD Pointer */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span
                      className="font-mono-code text-[11px] font-black px-2.5 py-1.5 rounded-lg border shadow-xs"
                      style={{
                        background: "var(--accent-warm-soft)",
                        borderColor: "var(--accent-warm)",
                        color: "var(--accent-warm-text)",
                      }}
                    >
                      HEAD
                    </span>
                    <span
                      className="font-mono-code text-[9.5px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ptr
                    </span>
                  </div>

                  <span
                    className="font-mono-code text-base font-black -mt-4 shrink-0"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                  >
                    →
                  </span>

                  {/* Dynamic Memory Nodes */}
                  {nodes.map((node, idx) => (
                    <div
                      key={node.id}
                      className={`flex items-center gap-2.5 sm:gap-3.5 shrink-0 ${
                        node.isNew ? "node-pop" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="flex items-stretch rounded-xl border-2 overflow-hidden shadow-sm transition-colors"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: node.isNew
                              ? "var(--success-fg)"
                              : "var(--border-strong)",
                          }}
                        >
                          {/* Value Cell */}
                          <div
                            className="px-3.5 py-2 font-mono-code text-[14px] font-black min-w-[46px] text-center"
                            style={{
                              background: node.isNew
                                ? "var(--success-soft)"
                                : "var(--bg-surface)",
                              color: node.isNew
                                ? "var(--success-fg)"
                                : "var(--text-primary)",
                            }}
                          >
                            {node.value}
                          </div>

                          {/* Next Pointer Cell */}
                          <div
                            className="px-2.5 py-2 border-l font-mono-code text-[10.5px] font-bold flex items-center gap-1"
                            style={{
                              borderColor: node.isNew
                                ? "color-mix(in srgb, var(--success-fg) 45%, transparent)"
                                : "var(--border-soft)",
                              background: "var(--bg-subtle)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <span>next</span>
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: node.isNew
                                  ? "var(--success-fg)"
                                  : "var(--brand-primary)",
                              }}
                            />
                          </div>
                        </div>
                        <span
                          className="font-mono-code text-[9.5px] font-bold"
                          style={{
                            color: node.isNew
                              ? "var(--success-fg)"
                              : "var(--text-muted)",
                          }}
                        >
                          {idx === 0 ? "head" : `node[${idx}]`}
                        </span>
                      </div>

                      <span
                        className="font-mono-code text-base font-black -mt-4 shrink-0"
                        style={{ color: "var(--text-muted)" }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  ))}

                  {/* NULL Terminator */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span
                      className="font-mono-code text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg border border-dashed"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border-strong)",
                        color: "var(--text-muted)",
                      }}
                    >
                      NULL
                    </span>
                    <span
                      className="font-mono-code text-[9.5px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      end
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Pointer Explanation Strip */}
              <div
                className="rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                  </span>
                  <p
                    className="text-[12.5px] sm:text-[13px] font-bold leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {labStepNote}
                  </p>
                </div>

                {nodes.length >= MAX_LAB_NODES && (
                  <span
                    className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-center"
                    style={{
                      background: "var(--accent-warm-soft)",
                      color: "var(--accent-warm-text)",
                    }}
                  >
                    الحد الأقصى للمعاينة 5 عقد
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ---------- TAB 3: CHAPTER SUMMARY & C++ CODE ---------- */}
          {activeTab === "summary" && (
            <div
              key="summary"
              className="fview-pane grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
            >
              {/* Key Concepts + Exam Tip */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className="text-[15px] sm:text-[16px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      أهم أفكار القوائم المترابطة في 60 ثانية
                    </h3>
                    <span
                      className="font-en text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0"
                      style={{
                        background: "var(--brand-soft)",
                        color: "var(--brand-soft-text)",
                      }}
                    >
                      Cheat Sheet
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {SUMMARY_TAKEAWAYS.map((item) => (
                      <li
                        key={item.title}
                        className="rounded-xl border px-3.5 py-3 flex items-start gap-2.5"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                        }}
                      >
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: "var(--brand-primary)" }}
                        />
                        <div className="space-y-0.5">
                          <div
                            className="text-[12.5px] font-extrabold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.title}
                          </div>
                          <p
                            className="text-[12px] leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {item.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Tip Callout */}
                <div
                  className="rounded-2xl border p-4 flex items-start gap-3"
                  style={{
                    background: "var(--accent-warm-soft)",
                    borderColor:
                      "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--accent-warm)",
                      color: "#ffffff",
                    }}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </span>
                  <p
                    className="text-[12.5px] sm:text-[13px] font-extrabold leading-relaxed"
                    style={{ color: "var(--accent-warm-text)" }}
                  >
                    نصيحة ليلة الامتحان: الإدراج في البداية{" "}
                    <span className="font-mono-code font-black">O(1)</span> لكن
                    الوصول بالـ{" "}
                    <span className="font-mono-code font-black">index</span>{" "}
                    بياخد{" "}
                    <span className="font-mono-code font-black">O(n)</span>
                  </p>
                </div>
              </div>

              {/* Syntax-Colored LTR C++ Code Card */}
              <div className="lg:col-span-6 flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0d131d] text-slate-100 shadow-lg">
                {/* Code Card Header */}
                <div className="px-4 py-2.5 bg-[#141d2b] border-b border-white/10 flex items-center justify-between gap-2">
                  <div dir="ltr" className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e58a62] shrink-0" />
                    <span className="font-mono-code text-[11.5px] font-bold text-slate-200 truncate">
                      insert_head.cpp
                    </span>
                    <span className="font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-[#9dc0f7] shrink-0">
                      C++17
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-[#66c7a6]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode ? "تم النسخ ✓" : "نسخ الكود"}</span>
                  </button>
                </div>

                {/* Syntax-Highlighted Code Body */}
                <pre
                  dir="ltr"
                  className="flex-1 m-0 p-4 sm:p-5 font-mono-code text-[12px] sm:text-[12.5px] leading-[1.85] overflow-x-auto text-left"
                >
                  <code>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        01
                      </span>
                      <span className="text-[#6b829e] italic">
                        {"// Insert a new node at the head in O(1) time"}
                      </span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        02
                      </span>
                      <span className="text-[#f0a786]">struct</span>{" "}
                      <span className="text-[#66c7a6]">Node</span>{" "}
                      <span className="text-slate-300">{"{"}</span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        03
                      </span>
                      {"  "}
                      <span className="text-[#7ca7f0]">int</span>{" "}
                      <span className="text-slate-100">data</span>
                      <span className="text-slate-400">;</span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        04
                      </span>
                      {"  "}
                      <span className="text-[#66c7a6]">Node</span>
                      <span className="text-[#f0a786]">*</span>{" "}
                      <span className="text-slate-100">next</span>
                      <span className="text-slate-400">;</span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        05
                      </span>
                      {"  "}
                      <span className="text-[#66c7a6]">Node</span>
                      <span className="text-slate-300">(</span>
                      <span className="text-[#7ca7f0]">int</span>{" "}
                      <span className="text-[#fde68a]">val</span>
                      <span className="text-slate-300">) : </span>
                      <span className="text-slate-100">data</span>
                      <span className="text-slate-300">(</span>
                      <span className="text-[#fde68a]">val</span>
                      <span className="text-slate-300">), </span>
                      <span className="text-slate-100">next</span>
                      <span className="text-slate-300">(</span>
                      <span className="text-[#f0a786]">nullptr</span>
                      <span className="text-slate-300">) {"{}"}</span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        06
                      </span>
                      <span className="text-slate-300">{"};"}</span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        07
                      </span>
                      {" "}
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        08
                      </span>
                      <span className="text-[#7ca7f0]">void</span>{" "}
                      <span className="text-[#9dc0f7] font-semibold">
                        insertHead
                      </span>
                      <span className="text-slate-300">(</span>
                      <span className="text-[#66c7a6]">Node</span>
                      <span className="text-[#f0a786]">*&amp;</span>{" "}
                      <span className="text-[#fde68a]">head</span>
                      <span className="text-slate-300">, </span>
                      <span className="text-[#7ca7f0]">int</span>{" "}
                      <span className="text-[#fde68a]">val</span>
                      <span className="text-slate-300">) {"{"}</span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        09
                      </span>
                      {"  "}
                      <span className="text-[#66c7a6]">Node</span>
                      <span className="text-[#f0a786]">*</span>{" "}
                      <span className="text-slate-100">fresh</span>{" "}
                      <span className="text-[#f0a786]">=</span>{" "}
                      <span className="text-[#f0a786]">new</span>{" "}
                      <span className="text-[#66c7a6]">Node</span>
                      <span className="text-slate-300">(</span>
                      <span className="text-[#fde68a]">val</span>
                      <span className="text-slate-300">);</span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        10
                      </span>
                      {"  "}
                      <span className="text-slate-100">fresh</span>
                      <span className="text-[#f0a786]">-&gt;</span>
                      <span className="text-slate-100">next</span>{" "}
                      <span className="text-[#f0a786]">=</span>{" "}
                      <span className="text-[#fde68a]">head</span>
                      <span className="text-slate-400">;</span>{" "}
                      <span className="text-[#6b829e] italic">
                        {"// point to old head"}
                      </span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        11
                      </span>
                      {"  "}
                      <span className="text-[#fde68a]">head</span>{" "}
                      <span className="text-[#f0a786]">=</span>{" "}
                      <span className="text-slate-100">fresh</span>
                      <span className="text-slate-400">;</span>
                      {"       "}
                      <span className="text-[#6b829e] italic">
                        {"// move head pointer"}
                      </span>
                    </span>
                    <span className="block">
                      <span className="text-slate-500 select-none mr-3">
                        12
                      </span>
                      <span className="text-slate-300">{"}"}</span>
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* ---------- TAB 4: INSTANT 2-QUESTION QUIZ ---------- */}
          {activeTab === "quiz" && (
            <div key="quiz" className="fview-pane max-w-3xl mx-auto space-y-5">
              {!quizFinished ? (
                <>
                  {/* Quiz Progress Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[12px] font-black px-2.5 py-1 rounded-lg"
                        style={{
                          background: "var(--brand-soft)",
                          color: "var(--brand-soft-text)",
                        }}
                      >
                        السؤال {questionIdx + 1} من {QUIZ_QUESTIONS.length}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {QUIZ_QUESTIONS.map((q, idx) => (
                          <span
                            key={q.id}
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: idx === questionIdx ? "26px" : "10px",
                              background:
                                answers[q.id] === q.correctLetter
                                  ? "var(--success-fg)"
                                  : answers[q.id]
                                  ? "var(--accent-warm)"
                                  : idx === questionIdx
                                  ? "var(--brand-primary)"
                                  : "var(--border-strong)",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <span
                      className="text-[12px] font-extrabold px-2.5 py-1 rounded-lg border"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      الدرجة الحالية:{" "}
                      <span
                        className="font-mono-code font-black"
                        style={{ color: "var(--success-fg)" }}
                      >
                        {totalScore} / {QUIZ_QUESTIONS.length}
                      </span>
                    </span>
                  </div>

                  {/* Question Card */}
                  <div
                    className="rounded-2xl border p-4 sm:p-6 space-y-4"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <h3
                      className="text-[15px] sm:text-[17px] font-black leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {currentQuestion.question}
                    </h3>

                    {/* 4 Interactive Option Cards (A/B/C/D) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQuestion.options.map((opt) => {
                        const isPicked = currentAnswer === opt.letter;
                        const isRightOption =
                          opt.letter === currentQuestion.correctLetter;
                        const hasAnswered = Boolean(currentAnswer);

                        let bg = "var(--bg-surface)";
                        let border = "var(--border-soft)";
                        let textColor = "var(--text-primary)";
                        let badgeBg = "var(--bg-subtle)";
                        let badgeColor = "var(--text-secondary)";

                        if (hasAnswered) {
                          if (isRightOption) {
                            bg = "var(--success-soft)";
                            border = "var(--success-fg)";
                            textColor = "var(--success-fg)";
                            badgeBg = "var(--success-fg)";
                            badgeColor = "#ffffff";
                          } else if (isPicked) {
                            bg = "var(--accent-warm-soft)";
                            border = "var(--accent-warm)";
                            textColor = "var(--accent-warm-text)";
                            badgeBg = "var(--accent-warm)";
                            badgeColor = "#ffffff";
                          }
                        }

                        return (
                          <button
                            key={opt.letter}
                            type="button"
                            disabled={hasAnswered}
                            onClick={() =>
                              void handleSelectQuizOption(opt.letter)
                            }
                            className={`px-4 py-3.5 rounded-xl border text-right flex items-center justify-between gap-3 transition-all duration-200 ${
                              hasAnswered
                                ? "cursor-default"
                                : "cursor-pointer hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                            }`}
                            style={{
                              background: bg,
                              borderColor: border,
                              color: textColor,
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className="font-mono-code w-7 h-7 rounded-lg text-[12px] font-black flex items-center justify-center shrink-0 transition-colors"
                                style={{
                                  background: badgeBg,
                                  color: badgeColor,
                                }}
                              >
                                {opt.letter}
                              </span>
                              <span
                                className={`text-[13.5px] font-extrabold truncate ${
                                  opt.isMono ? "font-mono-code" : ""
                                }`}
                              >
                                {opt.label}
                              </span>
                            </div>

                            {hasAnswered && isRightOption && (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            )}
                            {hasAnswered && isPicked && !isRightOption && (
                              <XCircle className="w-4 h-4 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Feedback Explanation Box */}
                    {currentAnswer && (
                      <div
                        className="rounded-xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        style={{
                          background: isCurrentCorrect
                            ? "var(--success-soft)"
                            : "var(--accent-warm-soft)",
                          borderColor: isCurrentCorrect
                            ? "color-mix(in srgb, var(--success-fg) 35%, transparent)"
                            : "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                        }}
                      >
                        <div className="space-y-1">
                          <div
                            className="text-[12.5px] font-black flex items-center gap-1.5"
                            style={{
                              color: isCurrentCorrect
                                ? "var(--success-fg)"
                                : "var(--accent-warm-text)",
                            }}
                          >
                            {isCurrentCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>إجابة صحيحة! عاش عليك</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 shrink-0" />
                                <span>
                                  الإجابة الصح هي ({currentQuestion.correctLetter}
                                  ) — جوا المنصة بيتحفظ تلقائياً في بنك الأخطاء
                                </span>
                              </>
                            )}
                          </div>
                          <p
                            className="text-[12.5px] font-medium leading-relaxed"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {currentQuestion.explanation}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleNextOrFinishQuiz}
                          className="px-4 py-2.5 rounded-xl text-[12.5px] font-extrabold text-white inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm transition-transform hover:scale-[1.02]"
                          style={{ background: "var(--hero-bg)" }}
                        >
                          <span>
                            {questionIdx < QUIZ_QUESTIONS.length - 1
                              ? "السؤال التالي"
                              : "عرض النتيجة"}
                          </span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Quiz Score Summary View */
                <div
                  className="rounded-2xl border p-6 sm:p-7 text-center space-y-5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div
                    className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        totalScore === QUIZ_QUESTIONS.length
                          ? "var(--success-soft)"
                          : "var(--accent-warm-soft)",
                      color:
                        totalScore === QUIZ_QUESTIONS.length
                          ? "var(--success-fg)"
                          : "var(--accent-warm-text)",
                    }}
                  >
                    <Trophy className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className="font-mono-code text-2xl sm:text-3xl font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {totalScore} / {QUIZ_QUESTIONS.length}
                    </div>
                    <h3
                      className="text-[16px] sm:text-[18px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {totalScore === QUIZ_QUESTIONS.length
                        ? "ممتاز! قفّلت الكويز التجريبي بنجاح"
                        : totalScore === 1
                        ? "نتيجة كويسة! راجع الشرح وهتتقنها 100%"
                        : "ولا يهمك — راجع الملخص وجرّب تاني"}
                    </h3>
                    <p
                      className="text-[13px] max-w-md mx-auto leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      داخل المنصة، كل سؤال تحله غلط بيتجمع تلقائياً في «بنك
                      الأخطاء» عشان تراجعه قبل الميدتيرم والفاينل.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleRetakeQuiz}
                      className="px-4 py-2.5 rounded-xl border text-[12.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border-strong)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>أعد الكويز</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("summary")}
                      className="px-4 py-2.5 rounded-xl text-[12.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                      style={{
                        background: "var(--brand-soft)",
                        color: "var(--brand-soft-text)",
                      }}
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>راجع الملخص السريع</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= BOTTOM CONVERSION FOOTER ================= */}
        <div
          className="px-4 sm:px-6 lg:px-7 py-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
          style={{
            background: "var(--bg-canvas)",
            borderColor: "var(--border-soft)",
          }}
        >
          <p
            className="text-[12.5px] sm:text-[13px] font-bold leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            دي مجرد معاينة مصغّرة — التجربة الكاملة جوا كل مادة فيها حفظ تلقائي
            وملاحظات وبنك أخطاء.
          </p>

          <Link
            href="/courses/data-structures"
            className="magnetic-btn px-5 py-2.5 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-sm shrink-0 hover:opacity-95 transition-opacity"
            style={{ background: "var(--accent-warm)" }}
          >
            <span>افتح أول فصل مجاناً</span>
            <ArrowLeft className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
