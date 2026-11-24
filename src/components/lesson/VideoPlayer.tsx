"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { PlayCircle, VideoOff } from "lucide-react";
import type { VideoChapter, VideoProvider } from "@/types/database";

interface VideoPlayerProps {
  provider: VideoProvider;
  videoId: string | null;
  title: string;
  chapters?: VideoChapter[];
  durationMinutes?: number | null;
}

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function extractYouTubeId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (YOUTUBE_ID_REGEX.test(trimmed)) return trimmed;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
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
      if (vParam && YOUTUBE_ID_REGEX.test(vParam)) return vParam;
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

  if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9-]+$/.test(trimmed)) {
    return `https://iframe.mediadelivery.net/embed/${trimmed}?autoplay=false&preload=true`;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
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
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  const ytId = useMemo(() => {
    if (!videoId || provider !== "youtube") return null;
    return extractYouTubeId(videoId);
  }, [videoId, provider]);

  const embedUrl = useMemo(() => {
    if (!videoId) return null;
    if (provider === "youtube" && ytId) {
      return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
    }
    if (provider === "bunny") return buildBunnyEmbedUrl(videoId);
    return null;
  }, [provider, videoId, ytId]);

  const safeChapterIdx =
    chapters.length > 0 ? Math.min(activeChapterIdx, chapters.length - 1) : 0;
  const activeChapter = chapters[safeChapterIdx] ?? null;

  const sendYouTubeCommand = useCallback(
    (func: string, args: unknown[] = []) => {
      const target = iframeRef.current?.contentWindow;
      if (!target) return;
      target.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    },
    []
  );

  const handleSelectChapter = useCallback(
    (idx: number) => {
      setActiveChapterIdx(idx);
      const chosen = chapters[idx];
      if (!chosen || provider !== "youtube" || !ytId) return;
      const secs = parseTimestampToSeconds(chosen.time);
      sendYouTubeCommand("seekTo", [secs, true]);
      sendYouTubeCommand("playVideo");
    },
    [chapters, provider, ytId, sendYouTubeCommand]
  );

  if (!embedUrl) {
    return (
      <div
        className="flex aspect-video max-h-[54vh] w-full flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            background: videoId ? "var(--accent-warm-soft)" : "var(--bg-subtle)",
            color: videoId ? "var(--accent-warm)" : "var(--brand-primary)",
          }}
        >
          {videoId ? (
            <VideoOff className="h-6 w-6" />
          ) : (
            <PlayCircle className="h-6 w-6" />
          )}
        </div>
        <h2
          className="text-[15px] font-extrabold"
          style={{ color: "var(--text-primary)" }}
        >
          {videoId
            ? "تعذّر تحميل رابط الفيديو لهذا الفصل"
            : "لا يوجد فيديو مرفق لهذا الفصل حالياً"}
        </h2>
        <p
          className="max-w-sm text-[12.5px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          تقدر تذاكر الفصل من الشرح التفاعلي والملخص والكويزات.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Pure Cinema Frame */}
      <div
        className="relative mx-auto aspect-video w-full max-h-[56vh] overflow-hidden rounded-2xl border bg-[#09111f] shadow-sm"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <iframe
          ref={iframeRef}
          key={embedUrl}
          src={embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {/* Slim Real Chapter Strip */}
      {chapters.length > 0 ? (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {chapters.map((chapter, idx) => {
              const isActive = idx === safeChapterIdx;
              return (
                <button
                  key={`${chapter.time}-${idx}`}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  aria-pressed={isActive}
                  title={chapter.name}
                  className="flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-2 text-right transition-colors cursor-pointer"
                  style={{
                    background: isActive
                      ? "var(--accent-warm-soft)"
                      : "var(--bg-canvas)",
                    borderColor: isActive
                      ? "var(--accent-warm)"
                      : "var(--border-soft)",
                  }}
                >
                  <span
                    dir="ltr"
                    className="font-mono-code shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold"
                    style={{
                      background: isActive
                        ? "var(--accent-warm)"
                        : "var(--bg-subtle)",
                      color: isActive ? "#ffffff" : "var(--accent-warm)",
                    }}
                  >
                    {chapter.time}
                  </span>
                  <span
                    className="truncate text-[12.5px] font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {chapter.name}
                  </span>
                </button>
              );
            })}
          </div>

          {activeChapter?.visual ? (
            <div
              className="flex flex-col gap-1 rounded-xl border px-3.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span
                className="text-[11.5px] font-extrabold"
                style={{ color: "var(--text-secondary)" }}
              >
                الفكرة الأساسية في الجزء ده
              </span>
              <span
                dir="ltr"
                className="font-mono-code truncate text-[12px] font-bold"
                style={{ color: "var(--success-fg)" }}
              >
                {activeChapter.visual}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
