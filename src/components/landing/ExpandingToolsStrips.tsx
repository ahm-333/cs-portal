"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckSquare,
  ChevronDown,
  Cpu,
  FileCode2,
  Globe,
  PlayCircle,
  RotateCcw,
} from "lucide-react";

const VIDEO_CHAPTERS = [
  {
    btnLabel: "00:00 · المقدمة",
    title: "الدرس 02 · مقدمة القوائم المترابطة (00:00)",
    progress: "28%",
  },
  {
    btnLabel: "06:15 · Insert",
    title: "الدرس 02 · الإدراج في البداية Insert Head (06:15)",
    progress: "64%",
  },
  {
    btnLabel: "11:40 · Big-O",
    title: "الدرس 02 · ليه التعقيد ثابت O(1)؟ (11:40)",
    progress: "92%",
  },
] as const;

const SPEED_OPTIONS = ["1.0x", "1.5x", "2.0x"] as const;

const RAW_CPP_CODE =
  "void insertHead(Node*& head, int val) { Node* n = new Node(val); n->next = head; head = n; }";

interface LinkedNode {
  id: number;
  value: number;
  isNew?: boolean;
}

const INITIAL_NODES: LinkedNode[] = [
  { id: 1, value: 7, isNew: false },
  { id: 2, value: 14, isNew: false },
  { id: 3, value: 29, isNew: false },
];

export function ExpandingToolsStrips() {
  const [activeStrip, setActiveStrip] = useState(0);

  // Strip 01: Video chapters & playback speed
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [speedIdx, setSpeedIdx] = useState(1);

  // Strip 02: Interactive Linked List live toy
  const [nodes, setNodes] = useState<LinkedNode[]>(INITIAL_NODES);
  const [nextNodeId, setNextNodeId] = useState(4);

  // Strip 04: Copy C++ code feedback
  const [copied, setCopied] = useState(false);

  // Strip 05: Instant Quiz state
  const [quizAnswer, setQuizAnswer] = useState<"ok" | "no" | null>(null);

  const activeChapterIdx = selectedChapter ?? 0;
  const videoTitle =
    selectedChapter === null
      ? "الدرس 02 · القوائم المترابطة (16:40)"
      : VIDEO_CHAPTERS[selectedChapter].title;
  const videoBarWidth =
    selectedChapter === null ? "38%" : VIDEO_CHAPTERS[selectedChapter].progress;

  const handleStripClick = (
    idx: number,
    e: React.MouseEvent<HTMLElement>
  ) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    setActiveStrip(idx);
  };

  const handleStripKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLElement>
  ) => {
    if (
      e.target !== e.currentTarget &&
      (e.target as HTMLElement).closest("button, a")
    ) {
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveStrip(idx);
    }
  };

  const handlePushHead = () => {
    const val = Math.floor(Math.random() * 88) + 10;
    setNodes((prev) => [
      { id: nextNodeId, value: val, isNew: true },
      ...prev.slice(0, 4).map((n) => ({ ...n, isNew: false })),
    ]);
    setNextNodeId((id) => id + 1);
  };

  const handleResetNodes = () => {
    setNodes(INITIAL_NODES);
    setNextNodeId(4);
  };

  const handleCopyCode = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        void navigator.clipboard.writeText(RAW_CPP_CODE);
      }
    } catch {
      // ignore clipboard restrictions
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleQuizAnswer = async (choice: "ok" | "no") => {
    setQuizAnswer(choice);
    if (choice === "ok") {
      try {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (!reducedMotion) {
          const confettiModule = await import("canvas-confetti");
          const confetti = confettiModule.default;
          confetti({
            particleCount: 42,
            spread: 58,
            origin: { y: 0.72 },
            colors: ["#c25e33", "#66c7a6", "#7ca7f0"],
          });
        }
      } catch {
        // ignore if confetti fails to load
      }
    }
  };

  return (
    <section
      id="interactive-showcase"
      className="reveal max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <span
            className="text-[12px] font-extrabold tracking-wide"
            style={{ color: "var(--accent-warm)" }}
          >
            داخل كل مادة
          </span>
          <h2
            className="text-2xl sm:text-4xl font-black tracking-tight leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            5 أدوات تفتحلك مع كل خطوة مذاكرة
          </h2>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            اضغط على أي شريط عشان يتمدّد وتجرّب الأداة بنفسك — بدون أي زحمة.
          </p>
        </div>

        <Link
          href="/courses"
          className="start-study-cta magnetic-btn self-start md:self-auto px-5 py-2.5 rounded-xl text-[13px] font-extrabold text-white inline-flex items-center gap-2 shadow-sm"
          style={{ background: "var(--hero-bg)" }}
        >
          <span>ادخل صفحة المواد</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* 5 Horizontal Expanding Strips (Accordion on <1024px) */}
      <div id="expGallery" className="exp-gallery">
        {/* STRIP 01: Video Lectures */}
        <article
          data-strip="0"
          role="region"
          aria-label="فيديوهات الشرح"
          onClick={(e) => handleStripClick(0, e)}
          onKeyDown={(e) => handleStripKeyDown(0, e)}
          className={`exp-strip ${
            activeStrip === 0
              ? "active ring-2 ring-[var(--accent-warm)]/25"
              : ""
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={activeStrip === 0}
            aria-label="01 · فيديوهات الشرح"
            onKeyDown={(e) => handleStripKeyDown(0, e)}
            className="exp-collapsed"
          >
            <div className="flex items-center gap-2.5 lg:flex-col lg:gap-0">
              <span
                className="font-en text-[11.5px] font-black px-2 py-0.5 rounded-lg lg:px-0 lg:py-0"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                01
              </span>
              <span className="exp-vertical-title lg:hidden">
                فيديوهات الشرح
              </span>
            </div>

            <span className="exp-vertical-title hidden lg:inline-block">
              فيديوهات الشرح
            </span>

            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <PlayCircle className="w-4 h-4" />
              </div>
              <span
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center transition-transform duration-300"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
                aria-hidden="true"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeStrip === 0 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </div>
          </div>

          <div className="exp-expanded min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-en text-[11px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--accent-warm-soft)",
                      color: "var(--accent-warm-text)",
                    }}
                  >
                    01 · VIDEO LECTURES
                  </span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  فيديوهات شرح مقسّمة لفصول
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
                  style={{
                    background: "var(--accent-warm-soft)",
                    borderColor: "var(--accent-warm)",
                    color: "var(--accent-warm-text)",
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-300" />
                </span>
                <span
                  className="hidden lg:inline-block font-en text-4xl font-black opacity-[0.1] select-none"
                  style={{ color: "var(--text-primary)" }}
                  aria-hidden="true"
                >
                  01
                </span>
              </div>
            </div>

            <div
              className="p-3.5 sm:p-4 rounded-2xl border space-y-3 my-2 min-w-0"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between gap-2 text-[12px]">
                <span
                  id="stripVidTitle"
                  className="font-extrabold min-w-0 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {videoTitle}
                </span>
                <button
                  id="stripSpeedBtn"
                  type="button"
                  onClick={() =>
                    setSpeedIdx((prev) => (prev + 1) % SPEED_OPTIONS.length)
                  }
                  className="font-mono-code text-[11px] font-bold px-2.5 py-1 min-h-[32px] rounded-lg border shrink-0 cursor-pointer"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  {SPEED_OPTIONS[speedIdx]}
                </button>
              </div>

              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg-subtle)" }}
              >
                <div
                  id="stripVidBar"
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: videoBarWidth,
                    background:
                      "linear-gradient(270deg, var(--success-fg), var(--accent-warm))",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {VIDEO_CHAPTERS.map((chap, idx) => {
                  const isActive = activeChapterIdx === idx;
                  return (
                    <button
                      key={chap.btnLabel}
                      type="button"
                      onClick={() => setSelectedChapter(idx)}
                      className="sv-btn min-h-[40px] px-3 py-2 rounded-xl border text-right text-[11.5px] font-bold transition-all cursor-pointer flex items-center justify-between sm:justify-center"
                      style={{
                        background: isActive
                          ? "var(--accent-warm-soft)"
                          : "var(--bg-surface)",
                        borderColor: isActive
                          ? "var(--accent-warm)"
                          : "var(--border-soft)",
                        color: isActive
                          ? "var(--accent-warm-text)"
                          : "var(--text-secondary)",
                      }}
                    >
                      <span>{chap.btnLabel}</span>
                      <span
                        className="sm:hidden font-mono-code text-[10px] opacity-75"
                        aria-hidden="true"
                      >
                        {chap.progress}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              كل درس مشروح بهدوء ومقسّم بعلامات زمنية عشان ترجع للنقطة اللي
              عاوزها في ثانية بدون إعلانات أو تشتيت.
            </p>
          </div>
        </article>

        {/* STRIP 02: Interactive Explanation */}
        <article
          data-strip="1"
          role="region"
          aria-label="الشرح التفاعلي"
          onClick={(e) => handleStripClick(1, e)}
          onKeyDown={(e) => handleStripKeyDown(1, e)}
          className={`exp-strip ${
            activeStrip === 1
              ? "active ring-2 ring-[var(--accent-warm)]/25"
              : ""
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={activeStrip === 1}
            aria-label="02 · الشرح التفاعلي"
            onKeyDown={(e) => handleStripKeyDown(1, e)}
            className="exp-collapsed"
          >
            <div className="flex items-center gap-2.5 lg:flex-col lg:gap-0">
              <span
                className="font-en text-[11.5px] font-black px-2 py-0.5 rounded-lg lg:px-0 lg:py-0"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                02
              </span>
              <span className="exp-vertical-title lg:hidden">
                الشرح التفاعلي
              </span>
            </div>

            <span className="exp-vertical-title hidden lg:inline-block">
              الشرح التفاعلي
            </span>

            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <span
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center transition-transform duration-300"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
                aria-hidden="true"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeStrip === 1 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </div>
          </div>

          <div className="exp-expanded min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-en text-[11px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    02 · INTERACTIVE LABS
                  </span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  تطبيق عملي حيّ جوه الدرس
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
                  style={{
                    background: "var(--success-soft)",
                    borderColor: "var(--success-fg)",
                    color: "var(--success-fg)",
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-300" />
                </span>
                <span
                  className="hidden lg:inline-block font-en text-4xl font-black opacity-[0.1] select-none"
                  style={{ color: "var(--text-primary)" }}
                  aria-hidden="true"
                >
                  02
                </span>
              </div>
            </div>

            <div
              className="p-3.5 sm:p-4 rounded-2xl border space-y-3 my-2 min-w-0"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[12px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    جرّب إضافة عقدة في Linked List
                  </span>
                  <span
                    className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded-md border"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Size: {nodes.length}
                  </span>
                  <span
                    className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    O(1)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id="stripPushBtn"
                    type="button"
                    onClick={handlePushHead}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl text-[11.5px] font-extrabold text-white cursor-pointer transition-transform active:scale-95"
                    style={{ background: "var(--success-fg)" }}
                  >
                    + Push Head
                  </button>
                  <button
                    id="stripResetNodesBtn"
                    type="button"
                    onClick={handleResetNodes}
                    aria-label="إعادة ضبط القائمة"
                    className="min-h-[36px] px-2.5 py-1.5 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="font-en">Reset</span>
                  </button>
                </div>
              </div>

              <div
                id="stripNodesRow"
                className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap py-2"
                dir="ltr"
              >
                <span
                  className="px-2.5 py-1 rounded-lg font-mono-code text-[11px] font-extrabold"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  HEAD
                </span>
                {nodes.map((node, idx) => (
                  <span
                    key={node.id}
                    className="inline-flex items-center gap-1.5 sm:gap-2"
                  >
                    <span
                      className="font-mono-code text-[12px]"
                      style={{
                        color:
                          idx === 0
                            ? "var(--success-fg)"
                            : "var(--text-muted)",
                      }}
                    >
                      →
                    </span>
                    <span
                      className={`${
                        node.isNew ? "node-pop" : ""
                      } px-2.5 sm:px-3 py-1.5 rounded-xl border font-mono-code text-[12px] font-extrabold`}
                      style={
                        idx === 0
                          ? {
                              background: "var(--success-soft)",
                              borderColor: "var(--success-fg)",
                              color: "var(--success-fg)",
                            }
                          : {
                              background: "var(--bg-surface)",
                              borderColor: "var(--border-strong)",
                              color: "var(--text-primary)",
                            }
                      }
                    >
                      {String(node.value).padStart(2, "0")}
                    </span>
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 font-mono-code text-[11px]">
                  <span style={{ color: "var(--text-muted)" }}>→</span>
                  <span
                    className="px-2 py-1 rounded-lg border"
                    style={{
                      background: "var(--bg-subtle)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-muted)",
                    }}
                  >
                    NULL
                  </span>
                </span>
              </div>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              بدل ما تحفظ خطوات الخوارزمية نظري، بتحرّك المؤشرات وتجرب بنفسك
              عشان الفكرة تثبت للأبد.
            </p>
          </div>
        </article>

        {/* STRIP 03: Dedicated Course Website */}
        <article
          data-strip="2"
          role="region"
          aria-label="موقع المادة"
          onClick={(e) => handleStripClick(2, e)}
          onKeyDown={(e) => handleStripKeyDown(2, e)}
          className={`exp-strip ${
            activeStrip === 2
              ? "active ring-2 ring-[var(--accent-warm)]/25"
              : ""
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={activeStrip === 2}
            aria-label="03 · موقع المادة"
            onKeyDown={(e) => handleStripKeyDown(2, e)}
            className="exp-collapsed"
          >
            <div className="flex items-center gap-2.5 lg:flex-col lg:gap-0">
              <span
                className="font-en text-[11.5px] font-black px-2 py-0.5 rounded-lg lg:px-0 lg:py-0"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                03
              </span>
              <span className="exp-vertical-title lg:hidden">موقع المادة</span>
            </div>

            <span className="exp-vertical-title hidden lg:inline-block">
              موقع المادة
            </span>

            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Globe className="w-4 h-4" />
              </div>
              <span
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center transition-transform duration-300"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
                aria-hidden="true"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeStrip === 2 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </div>
          </div>

          <div className="exp-expanded min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-en text-[11px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--brand-soft)",
                      color: "var(--brand-soft-text)",
                    }}
                  >
                    03 · COURSE WEBSITE
                  </span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  موقع منظّم مخصص لكل مادة
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
                  style={{
                    background: "var(--brand-soft)",
                    borderColor: "var(--brand-primary)",
                    color: "var(--brand-soft-text)",
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-300" />
                </span>
                <span
                  className="hidden lg:inline-block font-en text-4xl font-black opacity-[0.1] select-none"
                  style={{ color: "var(--text-primary)" }}
                  aria-hidden="true"
                >
                  03
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
              <div
                className="p-3.5 rounded-2xl border space-y-1"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <span
                  className="font-mono-code text-[10.5px] font-bold"
                  style={{ color: "var(--success-fg)" }}
                >
                  CH 01 · ✓
                </span>
                <div
                  className="text-[12.5px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Arrays &amp; Big-O
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  فيديو + ملخص + كويز
                </div>
              </div>

              <div
                className="p-3.5 rounded-2xl border space-y-1"
                style={{
                  background: "var(--accent-warm-soft)",
                  borderColor: "var(--accent-warm)",
                }}
              >
                <span
                  className="font-mono-code text-[10.5px] font-bold"
                  style={{ color: "var(--accent-warm-text)" }}
                >
                  CH 02 · الآن
                </span>
                <div
                  className="text-[12.5px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Linked Lists
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  معمل تفاعلي + كود
                </div>
              </div>

              <div
                className="p-3.5 rounded-2xl border space-y-1"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <span
                  className="font-mono-code text-[10.5px] font-bold"
                  style={{ color: "var(--text-muted)" }}
                >
                  CH 03 · 14 د
                </span>
                <div
                  className="text-[12.5px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Stacks &amp; Queues
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  تطبيقات امتحان
                </div>
              </div>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              تصفّح المادة شابتر بشابتر مع حفظ محلي تلقائي لمكان ما وقفت وعدّاد
              لأيام الامتحان.
            </p>
          </div>
        </article>

        {/* STRIP 04: Summaries & LTR Code */}
        <article
          data-strip="3"
          role="region"
          aria-label="الملخصات والأكواد"
          onClick={(e) => handleStripClick(3, e)}
          onKeyDown={(e) => handleStripKeyDown(3, e)}
          className={`exp-strip ${
            activeStrip === 3
              ? "active ring-2 ring-[var(--accent-warm)]/25"
              : ""
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={activeStrip === 3}
            aria-label="04 · الملخصات والأكواد"
            onKeyDown={(e) => handleStripKeyDown(3, e)}
            className="exp-collapsed"
          >
            <div className="flex items-center gap-2.5 lg:flex-col lg:gap-0">
              <span
                className="font-en text-[11.5px] font-black px-2 py-0.5 rounded-lg lg:px-0 lg:py-0"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                04
              </span>
              <span className="exp-vertical-title lg:hidden">
                الملخصات والأكواد
              </span>
            </div>

            <span className="exp-vertical-title hidden lg:inline-block">
              الملخصات والأكواد
            </span>

            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "var(--bg-subtle)",
                  color: "var(--text-primary)",
                }}
              >
                <FileCode2 className="w-4 h-4" />
              </div>
              <span
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center transition-transform duration-300"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
                aria-hidden="true"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeStrip === 3 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </div>
          </div>

          <div className="exp-expanded min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-en text-[11px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--accent-warm-soft)",
                      color: "var(--accent-warm-text)",
                    }}
                  >
                    04 · SUMMARIES &amp; CODE
                  </span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  ملخصات هندسية وأكواد LTR نظيفة
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
                  style={{
                    background: "var(--accent-warm-soft)",
                    borderColor: "var(--accent-warm)",
                    color: "var(--accent-warm-text)",
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-300" />
                </span>
                <span
                  className="hidden lg:inline-block font-en text-4xl font-black opacity-[0.1] select-none"
                  style={{ color: "var(--text-primary)" }}
                  aria-hidden="true"
                >
                  04
                </span>
              </div>
            </div>

            <div className="space-y-2.5 my-2 min-w-0 w-full">
              <pre
                className="code-ltr text-[11.5px] leading-relaxed min-w-0 max-w-full overflow-x-auto"
                dir="ltr"
              >
                <span style={{ color: "#9dc0f7" }}>void</span>{" "}
                {"insertHead(Node*& head, "}
                <span style={{ color: "#9dc0f7" }}>int</span>
                {" val) {\n  Node* n = "}
                <span style={{ color: "#f0a786" }}>new</span>
                {" Node(val); n->next = head; head = n;\n}"}
              </pre>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] font-bold px-1">
                <span style={{ color: "var(--success-fg)" }}>
                  التعقيد الزمني ثابت دائماً: O(1)
                </span>
                <button
                  id="stripCopyBtn"
                  type="button"
                  onClick={handleCopyCode}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg border cursor-pointer transition-colors"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  {copied ? "تم النسخ ✓" : "نسخ الكود"}
                </button>
              </div>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              ملخصات مركّزة + ورقة قوانين ومقارنات سريعة (Cheat Sheet) جاهزة
              للمراجعة ليلة الامتحان.
            </p>
          </div>
        </article>

        {/* STRIP 05: Instant Quizzes */}
        <article
          data-strip="4"
          role="region"
          aria-label="الكويزات والتثبيت"
          onClick={(e) => handleStripClick(4, e)}
          onKeyDown={(e) => handleStripKeyDown(4, e)}
          className={`exp-strip ${
            activeStrip === 4
              ? "active ring-2 ring-[var(--accent-warm)]/25"
              : ""
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={activeStrip === 4}
            aria-label="05 · الكويزات والتثبيت"
            onKeyDown={(e) => handleStripKeyDown(4, e)}
            className="exp-collapsed"
          >
            <div className="flex items-center gap-2.5 lg:flex-col lg:gap-0">
              <span
                className="font-en text-[11.5px] font-black px-2 py-0.5 rounded-lg lg:px-0 lg:py-0"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                05
              </span>
              <span className="exp-vertical-title lg:hidden">
                الكويزات والتثبيت
              </span>
            </div>

            <span className="exp-vertical-title hidden lg:inline-block">
              الكويزات والتثبيت
            </span>

            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <CheckSquare className="w-4 h-4" />
              </div>
              <span
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center transition-transform duration-300"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
                aria-hidden="true"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeStrip === 4 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </div>
          </div>

          <div className="exp-expanded min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-en text-[11px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    05 · INSTANT QUIZZES
                  </span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  كويزات فورية وبنك أخطاء ذكي
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
                  style={{
                    background: "var(--success-soft)",
                    borderColor: "var(--success-fg)",
                    color: "var(--success-fg)",
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-300" />
                </span>
                <span
                  className="hidden lg:inline-block font-en text-4xl font-black opacity-[0.1] select-none"
                  style={{ color: "var(--text-primary)" }}
                  aria-hidden="true"
                >
                  05
                </span>
              </div>
            </div>

            <div
              className="p-3.5 sm:p-4 rounded-2xl border space-y-3 my-2 min-w-0"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div
                className="text-[13px] font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                تعقيد الوصول لعنصر في مصفوفة بالـ Index هو؟
              </div>
              <div className="grid grid-cols-2 gap-2" dir="ltr">
                <button
                  type="button"
                  onClick={() => void handleQuizAnswer("ok")}
                  className="strip-q-btn min-h-[44px] px-3 py-2.5 rounded-xl border text-[12px] font-mono-code font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  style={
                    quizAnswer !== null
                      ? {
                          background: "var(--success-soft)",
                          borderColor: "var(--success-fg)",
                          color: "var(--text-primary)",
                        }
                      : {
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  <span>A) O(1)</span>
                  {quizAnswer !== null && (
                    <span style={{ color: "var(--success-fg)" }}>✓</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void handleQuizAnswer("no")}
                  className="strip-q-btn min-h-[44px] px-3 py-2.5 rounded-xl border text-[12px] font-mono-code font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  style={
                    quizAnswer === "no"
                      ? {
                          background: "var(--accent-warm-soft)",
                          borderColor: "var(--accent-warm)",
                          color: "var(--text-primary)",
                        }
                      : {
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  <span>B) O(n)</span>
                  {quizAnswer === "no" && (
                    <span style={{ color: "var(--accent-warm)" }}>✕</span>
                  )}
                </button>
              </div>
              {quizAnswer !== null && (
                <div
                  id="stripQuizFb"
                  className="text-[12px] font-bold px-2.5 py-1.5 rounded-xl border"
                  style={{
                    background:
                      quizAnswer === "ok"
                        ? "var(--success-soft)"
                        : "var(--accent-warm-soft)",
                    borderColor:
                      quizAnswer === "ok"
                        ? "var(--success-fg)"
                        : "var(--accent-warm)",
                    color:
                      quizAnswer === "ok"
                        ? "var(--success-fg)"
                        : "var(--accent-warm-text)",
                  }}
                >
                  {quizAnswer === "ok"
                    ? "إجابة صحيحة ✓ الوصول بالـ Index يتم مباشرة في O(1)."
                    : "الإجابة الصح هي O(1) لأن العناصر متجاورة في الذاكرة."}
                </div>
              )}
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              تصحيح فوري مع شرح سبب الإجابة الصح، وأي سؤال تغلط فيه يتحفظ
              تلقائياً في بنك الأخطاء للمراجعة.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
