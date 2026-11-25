"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize, Minimize, PlayCircle, ShieldCheck, VideoOff } from "lucide-react";
import type { VideoChapter, VideoProvider } from "@/types/database";
import ProtectedHlsPlayer, {
  DynamicStudentWatermark,
  type WatermarkData,
} from "./ProtectedHlsPlayer";

interface VideoPlayerProps {
  provider: VideoProvider;
  videoId: string | null;
  title: string;
  chapters?: VideoChapter[];
  durationMinutes?: number | null;
  lessonId?: string;
  courseId?: string;
  isPaidCourse?: boolean;
  hasProtectedVideo?: boolean;
  watermarkFallback?: { label: string; sublabel?: string };
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

function ProtectedBunnyEmbed({
  embedUrl,
  title,
  watermark,
}: {
  embedUrl: string;
  title: string;
  watermark: WatermarkData;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      const activeEl =
        document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setIsFullscreen(activeEl === wrapperRef.current);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  const toggleWrapperFullscreen = useCallback(async () => {
    const el = wrapperRef.current as
      | (HTMLDivElement & {
          webkitRequestFullscreen?: () => Promise<void> | void;
        })
      | null;
    if (!el) return;

    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };

    try {
      const currentFs =
        document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      if (currentFs === el) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch {
      // Ignore rejected fullscreen request
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      onContextMenu={(e) => e.preventDefault()}
      className={`group relative w-full overflow-hidden bg-[#09111f] select-none ${
        isFullscreen
          ? "h-screen w-screen rounded-none border-0"
          : "aspect-video rounded-2xl border shadow-sm"
      }`}
      style={{
        borderColor: isFullscreen ? "transparent" : "var(--border-soft)",
      }}
    >
      <iframe
        key={embedUrl}
        src={embedUrl}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      />

      {/* Dynamic Moving Anti-Leak Student Watermark over Bunny Embed */}
      <DynamicStudentWatermark
        watermark={watermark}
        containerRef={wrapperRef}
        isActive
      />

      {/* Protected Stream Badge + Fullscreen Wrapper Button (keeps watermark in fullscreen) */}
      <div className="pointer-events-none absolute top-3 right-3 left-3 z-30 flex items-center justify-between gap-2 opacity-90 transition-opacity group-hover:opacity-100">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#09111f]/75 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-200 backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-[#e58a62]" />
          <span>فيديو محمي</span>
        </span>

        <button
          type="button"
          onClick={() => void toggleWrapperFullscreen()}
          title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة مع الحماية"}
          aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
          className="pointer-events-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-[#09111f]/80 text-white backdrop-blur-sm transition hover:bg-[#c25e33]"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function VideoPlayer({
  provider,
  videoId,
  title,
  lessonId,
  isPaidCourse = false,
  hasProtectedVideo = false,
  watermarkFallback,
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

  const bunnyWatermark = useMemo<WatermarkData>(
    () => ({
      label: watermarkFallback?.label || "طالب بوابة حاسبات",
      sublabel: watermarkFallback?.sublabel || "CS Portal · Protected",
    }),
    [watermarkFallback]
  );

  // Route HLS or protected video streams to the token-signed ProtectedHlsPlayer
  if (provider === "hls" || hasProtectedVideo) {
    return (
      <ProtectedHlsPlayer
        lessonId={lessonId}
        title={title}
        watermarkFallback={watermarkFallback}
      />
    );
  }

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

  // Paid Bunny iframe embeds get the dynamic moving anti-leak student watermark
  if (provider === "bunny" && isPaidCourse) {
    return (
      <ProtectedBunnyEmbed
        embedUrl={embedUrl}
        title={title}
        watermark={bunnyWatermark}
      />
    );
  }

  // Free YouTube (youtube-nocookie.com) and unpaid Bunny embeds remain 100% intact
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
