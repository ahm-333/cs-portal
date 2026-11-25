"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckSquare,
  Cpu,
  FileCode2,
  Globe,
  PlayCircle,
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

export function ExpandingToolsStrips() {
  const [activeStrip, setActiveStrip] = useState(0);

  // Strip 01: Video chapters & playback speed
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [speedIdx, setSpeedIdx] = useState(1);

  // Strip 02: Interactive Linked List live toy
  const [nodes, setNodes] = useState<LinkedNode[]>([
    { id: 1, value: 7, isNew: false },
    { id: 2, value: 14, isNew: false },
    { id: 3, value: 29, isNew: false },
  ]);
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
    if ((e.target as HTMLElement).closest("button")) return;
    setActiveStrip(idx);
  };

  const handleStripKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLElement>
  ) => {
    if (activeStrip === idx) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveStrip(idx);
    }
  };

  const handlePushHead = () => {
    const val = ((nextNodeId * 17 + 19) % 85) + 10;
    setNodes((prev) => [
      { id: nextNodeId, value: val, isNew: true },
      ...prev.slice(0, 3).map((n) => ({ ...n, isNew: false })),
    ]);
    setNextNodeId((id) => id + 1);
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
      className="reveal max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 space-y-7"
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

      {/* 5 Horizontal Expanding Strips */}
      <div id="expGallery" className="exp-gallery">
        {/* STRIP 01: Video Lectures */}
        <article
          data-strip="0"
          role="region"
          aria-label="فيديوهات الشرح"
          tabIndex={activeStrip === 0 ? -1 : 0}
          onClick={(e) => handleStripClick(0, e)}
          onKeyDown={(e) => handleStripKeyDown(0, e)}
          className={`exp-strip ${activeStrip === 0 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--accent-warm)" }}
            >
              01
            </span>
            <span className="exp-vertical-title">فيديوهات الشرح</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--accent-warm-soft)",
                color: "var(--accent-warm-text)",
              }}
            >
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--accent-warm)" }}
                >
                  01 · VIDEO LECTURES
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  فيديوهات شرح مقسّمة لفصول
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                01
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border space-y-3 my-2"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between gap-2 text-[12px]">
                <span
                  id="stripVidTitle"
                  className="font-extrabold"
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
                  className="font-mono-code text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 cursor-pointer"
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

              <div className="grid grid-cols-3 gap-2 pt-1">
                {VIDEO_CHAPTERS.map((chap, idx) => {
                  const isActive = activeChapterIdx === idx;
                  return (
                    <button
                      key={chap.btnLabel}
                      type="button"
                      onClick={() => setSelectedChapter(idx)}
                      className="sv-btn p-2 rounded-xl border text-right text-[11px] font-bold transition-all cursor-pointer"
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
                      {chap.btnLabel}
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
          tabIndex={activeStrip === 1 ? -1 : 0}
          onClick={(e) => handleStripClick(1, e)}
          onKeyDown={(e) => handleStripKeyDown(1, e)}
          className={`exp-strip ${activeStrip === 1 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--success-fg)" }}
            >
              02
            </span>
            <span className="exp-vertical-title">الشرح التفاعلي</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--success-fg)" }}
                >
                  02 · INTERACTIVE LABS
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  تطبيق عملي حيّ جوه الدرس
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                02
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border space-y-3 my-2"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[12px] font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  جرّب إضافة عقدة في Linked List
                </span>
                <button
                  id="stripPushBtn"
                  type="button"
                  onClick={handlePushHead}
                  className="px-3 py-1 rounded-xl text-[11.5px] font-extrabold text-white cursor-pointer transition-transform active:scale-95"
                  style={{ background: "var(--success-fg)" }}
                >
                  + Push Head
                </button>
              </div>

              <div
                id="stripNodesRow"
                className="flex items-center justify-center gap-2 flex-wrap py-2"
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
                  <span key={node.id} className="inline-flex items-center gap-2">
                    <span
                      className="font-mono-code"
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
                      } px-3 py-1.5 rounded-xl border font-mono-code text-[12px] font-extrabold`}
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
          tabIndex={activeStrip === 2 ? -1 : 0}
          onClick={(e) => handleStripClick(2, e)}
          onKeyDown={(e) => handleStripKeyDown(2, e)}
          className={`exp-strip ${activeStrip === 2 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--brand-primary)" }}
            >
              03
            </span>
            <span className="exp-vertical-title">موقع المادة</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              <Globe className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--brand-primary)" }}
                >
                  03 · COURSE WEBSITE
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  موقع منظّم مخصص لكل مادة
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                03
              </span>
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
                  شرح تفاعلي + كشكول
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
          tabIndex={activeStrip === 3 ? -1 : 0}
          onClick={(e) => handleStripClick(3, e)}
          onKeyDown={(e) => handleStripKeyDown(3, e)}
          className={`exp-strip ${activeStrip === 3 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--accent-warm)" }}
            >
              04
            </span>
            <span className="exp-vertical-title">الملخصات والأكواد</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--bg-subtle)",
                color: "var(--text-primary)",
              }}
            >
              <FileCode2 className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--accent-warm)" }}
                >
                  04 · SUMMARIES &amp; CODE
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  كشكول ملخصات وأكواد LTR نظيفة
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                04
              </span>
            </div>

            <div className="space-y-2.5 my-2">
              <pre className="code-ltr text-[11.5px] leading-relaxed" dir="ltr">
                <span style={{ color: "#9dc0f7" }}>void</span>{" "}
                {"insertHead(Node*& head, "}
                <span style={{ color: "#9dc0f7" }}>int</span>
                {" val) {\n  Node* n = "}
                <span style={{ color: "#f0a786" }}>new</span>
                {" Node(val); n->next = head; head = n;\n}"}
              </pre>
              <div className="flex items-center justify-between text-[11.5px] font-bold px-1">
                <span style={{ color: "var(--success-fg)" }}>
                  التعقيد الزمني ثابت دائماً: O(1)
                </span>
                <button
                  id="stripCopyBtn"
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg border cursor-pointer transition-colors"
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
              كشكول مذاكرة مسطّر بالهايلايتر والملحوظات بالعامية + ورقة قوانين
              ومقارنات سريعة جاهزة لليلة الامتحان.
            </p>
          </div>
        </article>

        {/* STRIP 05: Instant Quizzes */}
        <article
          data-strip="4"
          role="region"
          aria-label="الكويزات والتثبيت"
          tabIndex={activeStrip === 4 ? -1 : 0}
          onClick={(e) => handleStripClick(4, e)}
          onKeyDown={(e) => handleStripKeyDown(4, e)}
          className={`exp-strip ${activeStrip === 4 ? "active" : ""}`}
        >
          <div className="exp-collapsed">
            <span
              className="font-en text-[12px] font-black"
              style={{ color: "var(--success-fg)" }}
            >
              05
            </span>
            <span className="exp-vertical-title">الكويزات والتثبيت</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--success-soft)",
                color: "var(--success-fg)",
              }}
            >
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>

          <div className="exp-expanded">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className="font-en text-[11px] font-extrabold tracking-widest uppercase"
                  style={{ color: "var(--success-fg)" }}
                >
                  05 · INSTANT QUIZZES
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  كويزات فورية وبنك أخطاء ذكي
                </h3>
              </div>
              <span
                className="font-en text-4xl font-black opacity-[0.1] select-none"
                style={{ color: "var(--text-primary)" }}
                aria-hidden="true"
              >
                05
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border space-y-3 my-2"
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
                  className="strip-q-btn px-3 py-2 rounded-xl border text-[12px] font-mono-code font-bold transition-all cursor-pointer"
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
                  A) O(1)
                </button>
                <button
                  type="button"
                  onClick={() => void handleQuizAnswer("no")}
                  className="strip-q-btn px-3 py-2 rounded-xl border text-[12px] font-mono-code font-bold transition-all cursor-pointer"
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
                  B) O(n)
                </button>
              </div>
              {quizAnswer !== null && (
                <div
                  id="stripQuizFb"
                  className="text-[12px] font-bold"
                  style={{
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
