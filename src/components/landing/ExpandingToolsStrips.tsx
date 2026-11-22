"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Copy,
  Cpu,
  FileCode2,
  Globe,
  Pause,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  Volume2,
} from "lucide-react";

const VIDEO_CHAPTERS = [
  { timeSec: 12, btnLabel: "00:00 · المقدمة", progress: 22 },
  { timeSec: 375, btnLabel: "06:15 · الكود", progress: 62 },
  { timeSec: 700, btnLabel: "11:40 · Big-O", progress: 88 },
] as const;

const SPEED_OPTIONS = ["1.0x", "1.5x", "2.0x"] as const;

const RAW_CPP_CODE = `void insertHead(Node*& head, int val) {
  Node* n = new Node(val);
  n->next = head;
  head = n;
}`;

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

function formatSec(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExpandingToolsStrips() {
  const [activeStrip, setActiveStrip] = useState(0);

  // Strip 01: Playable Video Preview state
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedOffset, setElapsedOffset] = useState(0);

  // Strip 02: Interactive Linked List (strictly capped at 3 nodes so zero overflow)
  const [nodes, setNodes] = useState<LinkedNode[]>(INITIAL_NODES);
  const [nextNodeId, setNextNodeId] = useState(4);

  // Strip 04: Copy C++ code feedback
  const [copied, setCopied] = useState(false);

  // Strip 05: Instant Quiz state
  const [quizAnswer, setQuizAnswer] = useState<"ok" | "no" | null>(null);

  useEffect(() => {
    if (!isPlaying || activeStrip !== 0) return;
    const id = window.setInterval(() => {
      setElapsedOffset((prev) => (prev < 45 ? prev + 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, activeStrip]);

  const activeChapter = VIDEO_CHAPTERS[selectedChapter] ?? VIDEO_CHAPTERS[1];
  const liveTimeStr = formatSec(activeChapter.timeSec + elapsedOffset);
  const liveBarPct = Math.min(98, activeChapter.progress + elapsedOffset * 0.25);

  const handleSelectChapter = (idx: number) => {
    setSelectedChapter(idx);
    setElapsedOffset(0);
  };

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
    const val = ((nextNodeId * 17 + 19) % 85) + 10;
    setNodes((prev) => [
      { id: nextNodeId, value: val, isNew: true },
      ...prev.slice(0, 2).map((n) => ({ ...n, isNew: false })),
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
      // ignore
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
          confettiModule.default({
            particleCount: 42,
            spread: 58,
            origin: { y: 0.72 },
            colors: ["#c25e33", "#66c7a6", "#7ca7f0"],
          });
        }
      } catch {
        // ignore
      }
    }
  };

  return (
    <section
      id="five-tools"
      className="reveal max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-8"
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
        {/* ================= STRIP 01: CINEMA VIDEO PLAYER ================= */}
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
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
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

          <div className="exp-expanded !p-5 sm:!p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="font-en text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  01 · VIDEO LECTURES
                </span>
                <h3
                  className="text-lg sm:text-xl font-black mt-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  فيديوهات شرح مقسّمة لفصول
                </h3>
              </div>
              <span
                className="font-en text-3xl font-black opacity-15 select-none"
                style={{ color: "var(--text-primary)" }}
              >
                01
              </span>
            </div>

            {/* REAL CINEMA VIDEO PLAYER FRAME WITH CUSTOM STUDIO ARTWORK */}
            <div className="relative w-full h-[215px] sm:h-[235px] rounded-2xl overflow-hidden border border-white/15 bg-[#0b1322] shadow-xl group">
              <Image
                src="/images/tools/video-preview.jpg"
                alt="معاينة فيديو شرح هياكل البيانات"
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Subtle Bottom Vignette Only — Artwork stays crystal clear */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#070d18]/90 via-transparent to-[#070d18]/35 pointer-events-none"
                aria-hidden="true"
              />

              {/* Clean Top-Left HD Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="font-mono-code text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/55 backdrop-blur-md border border-white/15 text-[#a7f3d0]">
                  1080p HD
                </span>
              </div>

              {/* Clean Center Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "إيقاف الفيديو" : "تشغيل الفيديو"}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-13 h-13 rounded-full flex items-center justify-center text-white border border-white/30 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xl ${
                  isPlaying
                    ? "bg-black/45 opacity-80 hover:opacity-100 scale-95"
                    : "bg-[#c25e33]/92 hover:bg-[#c25e33] hover:scale-105"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              {/* Razor-Clean Bottom Player Bar */}
              <div className="absolute inset-x-0 bottom-0 z-10 px-3.5 pb-3 pt-2 space-y-2">
                <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#66c7a6] to-[#e58a62] transition-all duration-300"
                    style={{ width: `${liveBarPct}%` }}
                  />
                </div>

                <div
                  dir="ltr"
                  className="flex items-center justify-between gap-2 text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="inline-flex items-center justify-center hover:text-[#f0a786] cursor-pointer"
                      aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>
                    <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                    <span className="font-mono-code text-[11px] font-bold tabular-nums text-slate-200">
                      {liveTimeStr} / 16:40
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSpeedIdx((prev) => (prev + 1) % SPEED_OPTIONS.length)
                    }
                    className="font-mono-code px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-[10.5px] font-extrabold text-white cursor-pointer transition-colors"
                  >
                    {SPEED_OPTIONS[speedIdx]}
                  </button>
                </div>
              </div>
            </div>

            {/* Clean Chapter Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {VIDEO_CHAPTERS.map((chap, idx) => (
                <button
                  key={chap.btnLabel}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  className="px-3 py-2 rounded-xl border text-[11.5px] font-extrabold transition-all cursor-pointer truncate"
                  style={{
                    background:
                      selectedChapter === idx
                        ? "var(--accent-warm-soft)"
                        : "var(--bg-canvas)",
                    borderColor:
                      selectedChapter === idx
                        ? "var(--accent-warm)"
                        : "var(--border-soft)",
                    color:
                      selectedChapter === idx
                        ? "var(--accent-warm-text)"
                        : "var(--text-secondary)",
                  }}
                >
                  {chap.btnLabel}
                </button>
              ))}
            </div>
          </div>
        </article>

        {/* ================= STRIP 02: CLEAN INTERACTIVE LAB ================= */}
        <article
          data-strip="1"
          role="region"
          aria-label="الشرح التفاعلي"
          onClick={(e) => handleStripClick(1, e)}
          onKeyDown={(e) => handleStripKeyDown(1, e)}
          className={`exp-strip ${
            activeStrip === 1
              ? "active ring-2 ring-[var(--success-fg)]/25"
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
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
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

          <div className="exp-expanded !p-5 sm:!p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="font-en text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  02 · INTERACTIVE LAB
                </span>
                <h3
                  className="text-lg sm:text-xl font-black mt-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  طبّق الخوارزميات حيّة قدام عينك
                </h3>
              </div>
              <span
                className="font-en text-3xl font-black opacity-15 select-none"
                style={{ color: "var(--text-primary)" }}
              >
                02
              </span>
            </div>

            {/* Spacious, Zero-Overflow Visual Lab */}
            <div
              className="rounded-2xl border p-5 space-y-5"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className="text-[12px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  جرّب الإدراج في بداية القائمة:
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handlePushHead}
                    className="px-3 py-1.5 rounded-xl text-[11.5px] font-extrabold text-white inline-flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
                    style={{ background: "var(--success-fg)" }}
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>إضافة عقدة</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetNodes}
                    aria-label="إعادة ضبط"
                    className="p-1.5 rounded-xl border cursor-pointer shrink-0"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

              <div
                dir="ltr"
                className="rounded-xl border py-6 px-3 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <span
                  className="font-mono-code text-[11px] font-extrabold px-2 py-1 rounded-md shrink-0"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  HEAD
                </span>
                <span style={{ color: "var(--text-muted)" }}>→</span>

                {nodes.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-center gap-2 sm:gap-3 shrink-0 ${
                      n.isNew ? "node-pop" : ""
                    }`}
                  >
                    <span
                      className="font-mono-code text-[14px] font-black px-3.5 py-2 rounded-xl border shadow-xs"
                      style={{
                        background: n.isNew
                          ? "var(--success-soft)"
                          : "var(--bg-canvas)",
                        borderColor: n.isNew
                          ? "var(--success-fg)"
                          : "var(--border-strong)",
                        color: n.isNew
                          ? "var(--success-fg)"
                          : "var(--text-primary)",
                      }}
                    >
                      {n.value}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>→</span>
                  </div>
                ))}

                <span
                  className="font-mono-code text-[11px] font-bold shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  NULL
                </span>
              </div>

              <div className="flex items-center justify-between text-[11.5px] font-bold">
                <span style={{ color: "var(--text-secondary)" }}>
                  الإدراج في البداية يعدّل مؤشر head مباشرة
                </span>
                <span
                  className="font-mono-code px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  O(1)
                </span>
              </div>
            </div>

            <p
              className="text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              معامل تفاعلية للـ Linked List و Binary Search و CPU Scheduling
              عشان تفهم الفكرة عملياً بدون حفظ.
            </p>
          </div>
        </article>

        {/* ================= STRIP 03: CLEAN COURSE ROADMAP ================= */}
        <article
          data-strip="2"
          role="region"
          aria-label="موقع المادة"
          onClick={(e) => handleStripClick(2, e)}
          onKeyDown={(e) => handleStripKeyDown(2, e)}
          className={`exp-strip ${
            activeStrip === 2
              ? "active ring-2 ring-[var(--brand-primary)]/25"
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
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
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

          <div className="exp-expanded !p-5 sm:!p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="font-en text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--brand-soft)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  03 · COURSE ROADMAP
                </span>
                <h3
                  className="text-lg sm:text-xl font-black mt-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  خريطة واضحة ومنظمة لكل مادة
                </h3>
              </div>
              <span
                className="font-en text-3xl font-black opacity-15 select-none"
                style={{ color: "var(--text-primary)" }}
              >
                03
              </span>
            </div>

            <div
              className="rounded-2xl border p-4 space-y-3"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between text-[12px] font-extrabold">
                <span style={{ color: "var(--text-primary)" }}>
                  هياكل البيانات · CS-213
                </span>
                <span
                  className="font-mono-code"
                  style={{ color: "var(--success-fg)" }}
                >
                  66% مكتمل
                </span>
              </div>

              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ background: "var(--bg-subtle)" }}
              >
                <div
                  className="h-full w-2/3 rounded-full"
                  style={{ background: "var(--success-fg)" }}
                />
              </div>

              <div className="space-y-2 pt-1">
                {[
                  { num: "01", title: "المصفوفات والمؤشرات", done: true },
                  { num: "02", title: "القوائم المترابطة", done: true },
                  { num: "03", title: "البحث الثنائي والتحليل", done: false },
                ].map((m) => (
                  <div
                    key={m.num}
                    className="rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-2"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="font-mono-code w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0"
                        style={{
                          background: m.done
                            ? "var(--success-soft)"
                            : "var(--accent-warm-soft)",
                          color: m.done
                            ? "var(--success-fg)"
                            : "var(--accent-warm-text)",
                        }}
                      >
                        {m.done ? "✓" : m.num}
                      </span>
                      <span
                        className="text-[12.5px] font-extrabold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {m.title}
                      </span>
                    </div>
                    <span
                      className="text-[11px] font-bold shrink-0"
                      style={{
                        color: m.done
                          ? "var(--success-fg)"
                          : "var(--accent-warm)",
                      }}
                    >
                      {m.done ? "مكتمل" : "الدرس الحالي"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p
              className="text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              ترتيب المنهج كامل مع نسبة إنجازك والروابط الخارجية الموثّقة لكل
              درس.
            </p>
          </div>
        </article>

        {/* ================= STRIP 04: CLEAN LTR CODE & SUMMARIES ================= */}
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
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <FileCode2 className="w-4 h-4" />
              </div>
              <span
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
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

          <div className="exp-expanded !p-5 sm:!p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="font-en text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--accent-warm-soft)",
                    color: "var(--accent-warm-text)",
                  }}
                >
                  04 · SUMMARIES &amp; LTR CODE
                </span>
                <h3
                  className="text-lg sm:text-xl font-black mt-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  أكواد C++ نظيفة ومعادلات KaTeX
                </h3>
              </div>
              <span
                className="font-en text-3xl font-black opacity-15 select-none"
                style={{ color: "var(--text-primary)" }}
              >
                04
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d131d] text-white shadow-lg">
              <div className="px-4 py-2.5 bg-[#141d2b] border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e58a62]" />
                  <span className="font-mono-code text-[11px] font-bold text-slate-300">
                    insert_head.cpp
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-[#66c7a6]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copied ? "تم النسخ ✓" : "نسخ الكود"}</span>
                </button>
              </div>
              <pre
                dir="ltr"
                className="w-full p-4 font-mono-code text-[12px] leading-relaxed overflow-x-auto text-[#dbeafe]"
              >
                {RAW_CPP_CODE}
              </pre>
            </div>

            <p
              className="text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              عزل تام لاتجاه الكود والمعادلات الرياضية مع ورقة قوانين Cheat
              Sheet ووضع «ليلة الامتحان».
            </p>
          </div>
        </article>

        {/* ================= STRIP 05: CLEAN INSTANT QUIZ ================= */}
        <article
          data-strip="4"
          role="region"
          aria-label="الكويزات والتثبيت"
          onClick={(e) => handleStripClick(4, e)}
          onKeyDown={(e) => handleStripKeyDown(4, e)}
          className={`exp-strip ${
            activeStrip === 4
              ? "active ring-2 ring-[var(--success-fg)]/25"
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
                className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center"
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

          <div className="exp-expanded !p-5 sm:!p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="font-en text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-fg)",
                  }}
                >
                  05 · INSTANT QUIZZES
                </span>
                <h3
                  className="text-lg sm:text-xl font-black mt-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  كويزات تثبيت بشرح فوري
                </h3>
              </div>
              <span
                className="font-en text-3xl font-black opacity-15 select-none"
                style={{ color: "var(--text-primary)" }}
              >
                05
              </span>
            </div>

            <div
              className="rounded-2xl border p-4 sm:p-5 space-y-3.5"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div
                className="text-[13.5px] font-extrabold leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                ما هو التعقيد الزمني لإضافة عنصر في بداية Singly Linked List؟
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => void handleQuizAnswer("ok")}
                  className="px-4 py-3 rounded-xl border text-center text-[13px] font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  style={{
                    background:
                      quizAnswer === "ok"
                        ? "var(--success-soft)"
                        : "var(--bg-surface)",
                    borderColor:
                      quizAnswer === "ok"
                        ? "var(--success-fg)"
                        : "var(--border-soft)",
                    color:
                      quizAnswer === "ok"
                        ? "var(--success-fg)"
                        : "var(--text-primary)",
                  }}
                >
                  <span className="font-mono-code">O(1)</span>
                  {quizAnswer === "ok" && (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void handleQuizAnswer("no")}
                  className="px-4 py-3 rounded-xl border text-center text-[13px] font-extrabold flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    background:
                      quizAnswer === "no"
                        ? "var(--accent-warm-soft)"
                        : "var(--bg-surface)",
                    borderColor:
                      quizAnswer === "no"
                        ? "var(--accent-warm)"
                        : "var(--border-soft)",
                    color:
                      quizAnswer === "no"
                        ? "var(--accent-warm-text)"
                        : "var(--text-primary)",
                  }}
                >
                  <span className="font-mono-code">O(n)</span>
                </button>
              </div>
              {quizAnswer && (
                <div
                  className="text-[12px] font-bold px-3.5 py-2.5 rounded-xl"
                  style={{
                    background:
                      quizAnswer === "ok"
                        ? "var(--success-soft)"
                        : "var(--accent-warm-soft)",
                    color:
                      quizAnswer === "ok"
                        ? "var(--success-fg)"
                        : "var(--accent-warm-text)",
                  }}
                >
                  {quizAnswer === "ok"
                    ? "عاش! تعديل مؤشر head مباشرة يتم في خطوات ثابتة O(1) ✓"
                    : "الإجابة الصح O(1) — والسؤال بيتحفظ تلقائياً في بنك الأخطاء."}
                </div>
              )}
            </div>

            <p
              className="text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              تقييم فوري بعد كل درس مع حفظ أعلى درجة وتحويل أي خطأ تلقائياً لبنك
              الأخطاء.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
