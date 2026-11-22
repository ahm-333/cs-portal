"use client";

import { useMemo, useState } from "react";
import { MonitorPlay, Pause, Play, PlayCircle, Sparkles, VideoOff } from "lucide-react";
import type { VideoChapter, VideoProvider } from "@/types/database";

interface VideoPlayerProps {
  provider: VideoProvider;
  videoId: string | null;
  title: string;
  chapters?: VideoChapter[];
  durationMinutes?: number | null;
}

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const SPEEDS = ["1.0x", "1.5x", "2.0x"] as const;

function extractYouTubeId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

    if (hostname === "youtu.be") {
      const candidate = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return YOUTUBE_ID_REGEX.test(candidate) ? candidate : null;
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      const vParam = url.searchParams.get("v");
      if (vParam && YOUTUBE_ID_REGEX.test(vParam)) {
        return vParam;
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const prefix = segments[0];
      const candidate = segments[1] ?? "";
      if (
        (prefix === "embed" ||
          prefix === "shorts" ||
          prefix === "live" ||
          prefix === "v") &&
        YOUTUBE_ID_REGEX.test(candidate)
      ) {
        return candidate;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function buildBunnyEmbedUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("https://iframe.mediadelivery.net/embed/")) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === "https:" ? parsed.toString() : null;
    } catch {
      return null;
    }
  }

  // Supports "libraryId/videoGuid" shorthand for Bunny Stream
  if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9-]+$/.test(trimmed)) {
    return `https://iframe.mediadelivery.net/embed/${trimmed}?autoplay=false&preload=true`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function parseTimestampToSeconds(ts: string): number {
  const parts = ts
    .trim()
    .split(":")
    .map((part) => Number.parseInt(part, 10));
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export default function VideoPlayer({
  provider,
  videoId,
  title,
  chapters = [],
  durationMinutes,
}: VideoPlayerProps) {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1); // 1.5x default as in reference HTML
  const [isPlayingBoard, setIsPlayingBoard] = useState(false);
  const [viewMode, setViewMode] = useState<"video" | "board">("video");
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);

  const ytId = useMemo(() => {
    if (!videoId || provider !== "youtube") return null;
    return extractYouTubeId(videoId);
  }, [videoId, provider]);

  const baseEmbedUrl = useMemo(() => {
    if (!videoId) return null;
    if (provider === "youtube" && ytId) {
      return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`;
    }
    if (provider === "bunny") {
      return buildBunnyEmbedUrl(videoId);
    }
    return null;
  }, [provider, videoId, ytId]);

  const embedUrl = useMemo(() => {
    if (!baseEmbedUrl) return null;
    if (provider === "youtube" && seekSeconds !== null && seekSeconds > 0) {
      return `${baseEmbedUrl}&start=${seekSeconds}`;
    }
    return baseEmbedUrl;
  }, [baseEmbedUrl, provider, seekSeconds]);

  const safeChapterIdx =
    chapters.length > 0 ? Math.min(activeChapterIdx, chapters.length - 1) : 0;
  const activeChapter = chapters[safeChapterIdx] ?? null;
  const durationLabel = durationMinutes ? `${durationMinutes}:00` : "15:00";
  const hasRealVideo = Boolean(embedUrl);
  const showEmbed = hasRealVideo && viewMode === "video";

  function handleSelectChapter(idx: number) {
    setActiveChapterIdx(idx);
    const chosen = chapters[idx];
    if (chosen && provider === "youtube" && hasRealVideo) {
      const secs = parseTimestampToSeconds(chosen.time);
      setSeekSeconds(secs);
    }
  }

  if (!hasRealVideo && chapters.length === 0) {
    return (
      <div className="surface-card relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl p-6 text-center">
        <div className="relative z-10 flex max-w-md flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border"
            style={{
              borderColor: videoId ? "var(--accent-warm)" : "var(--border-soft)",
              background: videoId ? "var(--accent-warm-soft)" : "var(--bg-subtle)",
              color: videoId ? "var(--accent-warm)" : "var(--brand-primary)",
            }}
          >
            {videoId ? (
              <VideoOff className="h-7 w-7" />
            ) : (
              <PlayCircle className="h-7 w-7" />
            )}
          </div>
          <h2 className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg">
            {videoId
              ? "تعذّر تحميل رابط الفيديو لهذا الدرس"
              : "لا يوجد فيديو مرفق لهذا الدرس حالياً"}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            يمكنك الاعتماد على الملخص المكتوب والأكواد والمعمل التفاعلي والكويز
            لإتقان الدرس بالكامل.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Dark Navy Video / Visual Board Stage (matches #cwPane-video) */}
      <div className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#162642] to-[#0c1628] p-4 text-white sm:p-6">
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#e58a62]/40 bg-[#c25e33]/25 px-3 py-1 text-[11.5px] font-extrabold text-[#fed7aa]">
              فيديو الدرس · HD 1080p
            </span>
            {hasRealVideo && chapters.length > 0 ? (
              <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode("video")}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                    viewMode === "video"
                      ? "bg-[#c25e33] text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <MonitorPlay className="h-3.5 w-3.5" />
                  <span>مشغّل الفيديو</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("board")}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                    viewMode === "board"
                      ? "bg-[#c25e33] text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>اللوحة البصرية</span>
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSpeedIdx((prev) => (prev + 1) % SPEEDS.length)}
              title="سرعة التشغيل المفضلة"
              className="font-mono-code inline-flex min-h-[36px] min-w-[50px] items-center justify-center rounded-xl bg-white/10 px-2.5 py-1 text-[11.5px] font-bold text-slate-200 transition-colors hover:bg-white/15"
            >
              {SPEEDS[speedIdx]}
            </button>
            <button
              type="button"
              onClick={() => {
                if (showEmbed && chapters.length > 0) {
                  setViewMode("board");
                  setIsPlayingBoard(true);
                } else {
                  setIsPlayingBoard((prev) => !prev);
                }
              }}
              aria-label={isPlayingBoard ? "إيقاف مؤقت" : "تشغيل"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c25e33] text-white shadow-lg transition-transform hover:scale-105"
            >
              {isPlayingBoard && !showEmbed ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </button>
          </div>
        </div>

        {/* Video Embed OR Visual Board */}
        {showEmbed && embedUrl ? (
          <div className="relative z-0 isolate aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#09111f]">
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={title}
              className="relative z-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="flex min-h-[180px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#09111f] p-4 text-center sm:p-5">
            <div className="max-w-full break-words text-[12.5px] font-bold text-[#f0a786]">
              {activeChapter ? activeChapter.name : title}
            </div>
            <div
              dir="ltr"
              className="font-mono-code max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-[#66c7a6]/35 bg-white/[0.06] px-3.5 py-2.5 text-[12.5px] font-bold text-[#a7f3d0] sm:px-4 sm:text-[15.5px]"
            >
              {activeChapter?.visual ?? title}
            </div>
            {isPlayingBoard ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#66c7a6]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#66c7a6]" />
                <span>وضع المراجعة البصرية نشط · {SPEEDS[speedIdx]}</span>
              </span>
            ) : null}
          </div>
        )}

        {/* Active Chapter Visual Pill when Real Video is shown */}
        {showEmbed && activeChapter ? (
          <div className="flex flex-col items-start justify-between gap-2 overflow-hidden rounded-xl border border-white/10 bg-[#09111f]/80 px-3.5 py-2.5 sm:flex-row sm:items-center sm:px-4">
            <div className="max-w-full break-words text-[12px] font-bold text-[#f0a786]">
              {activeChapter.name}
            </div>
            <div
              dir="ltr"
              className="font-mono-code max-w-full overflow-x-auto break-words text-[11.5px] font-bold text-[#a7f3d0] sm:text-[12px]"
            >
              {activeChapter.visual}
            </div>
          </div>
        ) : null}

        {/* Progress Bar + Timestamp */}
        <div className="space-y-1.5">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#66c7a6] to-[#c25e33] transition-all duration-300"
              style={{ width: activeChapter?.pct ?? "35%" }}
            />
          </div>
          <div
            dir="ltr"
            className="font-mono-code flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400"
          >
            <span>
              {activeChapter?.time ?? "00:00"} / {durationLabel}
            </span>
            <span dir="rtl" className="font-sans">
              فصول الدرس مقسّمة بدون إعلانات
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Chapters Grid */}
      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {chapters.map((chapter, idx) => {
            const isActive = idx === safeChapterIdx;
            return (
              <button
                key={`${chapter.time}-${idx}`}
                type="button"
                onClick={() => handleSelectChapter(idx)}
                aria-pressed={isActive}
                className="flex min-h-[54px] flex-col justify-center rounded-xl border p-3 text-right transition-all hover:-translate-y-0.5"
                style={{
                  background: isActive
                    ? "var(--accent-warm-soft)"
                    : "var(--bg-canvas)",
                  borderColor: isActive
                    ? "var(--accent-warm)"
                    : "var(--border-soft)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-mono-code text-[10.5px] font-bold"
                    style={{ color: "var(--accent-warm)" }}
                  >
                    {chapter.time}
                  </span>
                  <span
                    className="text-[10px] font-bold"
                    style={{
                      color: isActive
                        ? "var(--accent-warm-text)"
                        : "var(--text-muted)",
                    }}
                  >
                    فصل {idx + 1}
                  </span>
                </div>
                <div
                  className="mt-1 line-clamp-2 text-[12px] font-bold sm:truncate"
                  style={{ color: "var(--text-primary)" }}
                  title={chapter.name}
                >
                  {chapter.name}
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
