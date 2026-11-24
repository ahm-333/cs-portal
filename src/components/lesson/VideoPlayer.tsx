"use client";

import { useMemo } from "react";
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

export default function VideoPlayer({
  provider,
  videoId,
  title,
}: VideoPlayerProps) {
  const ytId = useMemo(() => {
    if (!videoId || provider !== "youtube") return null;
    return extractYouTubeId(videoId);
  }, [videoId, provider]);

  const embedUrl = useMemo(() => {
    if (!videoId) return null;
    if (provider === "youtube" && ytId) {
      return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1`;
    }
    if (provider === "bunny") return buildBunnyEmbedUrl(videoId);
    return null;
  }, [provider, videoId, ytId]);

  if (!embedUrl) {
    return (
      <div
        className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center"
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
    <div
      className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-[#09111f] shadow-sm"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <iframe
        key={embedUrl}
        src={embedUrl}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
