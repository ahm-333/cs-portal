"use client";

import { PlayCircle, VideoOff } from "lucide-react";
import type { VideoProvider } from "@/types/database";

interface VideoPlayerProps {
  provider: VideoProvider;
  videoId: string | null;
  title: string;
}

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

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
    return trimmed;
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

export default function VideoPlayer({
  provider,
  videoId,
  title,
}: VideoPlayerProps) {
  let embedUrl: string | null = null;

  if (videoId) {
    if (provider === "youtube") {
      const ytId = extractYouTubeId(videoId);
      if (ytId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`;
      }
    } else if (provider === "bunny") {
      embedUrl = buildBunnyEmbedUrl(videoId);
    }
  }

  if (!embedUrl) {
    return (
      <div className="studio-card relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden p-6 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--soft),transparent_68%)] opacity-80"
        />
        <div className="relative z-10 flex max-w-md flex-col items-center gap-3">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
              videoId
                ? "border-[var(--warn)]/30 bg-[var(--warn-soft)] text-[var(--warn)]"
                : "border-[var(--line)] bg-[var(--soft)] text-[var(--accent)]"
            }`}
          >
            {videoId ? (
              <VideoOff className="h-7 w-7" />
            ) : (
              <PlayCircle className="h-7 w-7" />
            )}
          </div>
          <h2 className="text-base font-bold text-[var(--ink)] sm:text-lg">
            {videoId
              ? "تعذّر تحميل رابط الفيديو لهذا الدرس"
              : "لا يوجد فيديو مرفق لهذا الدرس حالياً"}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            يمكنك الاعتماد على الملخص المكتوب والأكواد والمعمل التفاعلي والكويز
            بالأسفل لإتقان الدرس بالكامل.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--code-bg)] shadow-[var(--shadow-pill)]">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
