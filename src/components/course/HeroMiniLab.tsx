"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pause, Play, RotateCcw, StepForward } from "lucide-react";

const SAMPLE_ARRAY = [4, 11, 19, 27, 35, 48, 62] as const;

interface SearchFrame {
  low: number;
  mid: number;
  high: number;
  found: boolean;
  caption: string;
}

function buildSearchFrames(target: number): SearchFrame[] {
  const frames: SearchFrame[] = [];
  let low = 0;
  let high = SAMPLE_ARRAY.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const val = SAMPLE_ARRAY[mid];
    if (val === target) {
      frames.push({
        low,
        mid,
        high,
        found: true,
        caption: `تم العثور على ${target} عند الفهرس [${mid}] في ${frames.length + 1} خطوات!`,
      });
      break;
    }
    if (val < target) {
      frames.push({
        low,
        mid,
        high,
        found: false,
        caption: `${val} < ${target} ← نستبعد النصف الأيسر ونحرّك low إلى ${mid + 1}`,
      });
      low = mid + 1;
    } else {
      frames.push({
        low,
        mid,
        high,
        found: false,
        caption: `${val} > ${target} ← نستبعد النصف الأيمن ونحرّك high إلى ${mid - 1}`,
      });
      high = mid - 1;
    }
  }
  return frames;
}

interface HeroMiniLabProps {
  labLessonHref: string;
}

export function HeroMiniLab({ labLessonHref }: HeroMiniLabProps) {
  const [target, setTarget] = useState<number>(48);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const frames = useMemo(() => buildSearchFrames(target), [target]);
  const safeIndex = Math.min(stepIndex, frames.length - 1);
  const current = frames[safeIndex] ?? frames[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1 >= frames.length ? 0 : prev + 1));
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlaying, frames.length]);

  function handleSelectTarget(val: number) {
    setTarget(val);
    setStepIndex(0);
    setIsPlaying(true);
  }

  function handleNextStep() {
    setIsPlaying(false);
    setStepIndex((prev) => (prev + 1 >= frames.length ? 0 : prev + 1));
  }

  return (
    <div className="rounded-2xl border border-white/12 bg-black/35 p-4 shadow-2xl backdrop-blur-md sm:p-5">
      {/* Editor Window Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          <span
            dir="ltr"
            className="font-mono text-xs font-semibold text-white/90"
          >
            binary_search.lab
          </span>
        </div>
        <span
          dir="ltr"
          className="rounded-md border border-emerald-400/25 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300"
        >
          O(log n) · LIVE
        </span>
      </div>

      {/* Target selector hint */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span className="text-[var(--hero-sub)]">
          اضغط أي رقم لتجربة البحث عنه:
        </span>
        <span
          dir="ltr"
          className="rounded-md bg-white/[0.07] px-2 py-0.5 font-mono font-bold text-emerald-300"
        >
          target = {target}
        </span>
      </div>

      {/* Interactive Array Cells (strict LTR) */}
      <div dir="ltr" className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {SAMPLE_ARRAY.map((num, idx) => {
          const isMid = idx === current.mid;
          const isOut = idx < current.low || idx > current.high;
          const isFoundCell = isMid && current.found;

          return (
            <button
              key={num}
              type="button"
              onClick={() => handleSelectTarget(num)}
              title={`ابحث عن ${num}`}
              className={`group relative flex flex-col items-center justify-center rounded-xl border py-2.5 font-mono transition-all duration-300 ${
                isFoundCell
                  ? "scale-105 border-emerald-400 bg-emerald-500/25 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  : isMid
                    ? "border-emerald-400/80 bg-emerald-500/15 text-emerald-200"
                    : isOut
                      ? "border-white/5 bg-white/[0.02] text-white/25 opacity-45"
                      : "border-white/15 bg-white/[0.06] text-white/90 hover:border-emerald-400/50 hover:bg-white/[0.12]"
              }`}
            >
              <span className="text-xs font-bold sm:text-sm">{num}</span>
              <span className="mt-0.5 text-[9px] text-white/40">[{idx}]</span>

              {isMid ? (
                <span className="mt-1 rounded bg-emerald-400 px-1 py-px text-[8px] font-extrabold text-slate-950">
                  mid
                </span>
              ) : idx === current.low ? (
                <span className="mt-1 text-[8px] font-bold text-sky-300">
                  low
                </span>
              ) : idx === current.high ? (
                <span className="mt-1 text-[8px] font-bold text-amber-300">
                  high
                </span>
              ) : (
                <span className="mt-1 text-[8px] opacity-0">·</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Arabic Step Explanation */}
      <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs leading-relaxed text-[var(--hero-sub)]">
        <span className="ml-1.5 font-mono text-[11px] font-bold text-emerald-300">
          [{safeIndex + 1}/{frames.length}]
        </span>
        <span>{current.caption}</span>
      </div>

      {/* Interactive Controls + Deep Link to Full Lab */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/15 bg-white/[0.06] px-2.5 text-[11px] font-bold text-white transition-colors hover:border-emerald-400/50 hover:bg-white/[0.12]"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 text-emerald-300" />
                <span>إيقاف</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-emerald-300" />
                <span>تشغيل</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/15 bg-white/[0.06] px-2.5 text-[11px] font-bold text-white transition-colors hover:border-emerald-400/50 hover:bg-white/[0.12]"
          >
            <StepForward className="h-3 w-3 text-emerald-300" />
            <span>خطوة</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStepIndex(0);
              setIsPlaying(true);
            }}
            aria-label="إعادة"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-white/80 transition-colors hover:border-emerald-400/50 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link
          href={labLessonHref}
          className="group inline-flex items-center gap-1 text-xs font-bold text-emerald-300 transition-colors hover:text-emerald-200"
        >
          <span>افتح المعمل الكامل</span>
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
