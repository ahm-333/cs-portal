"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import Hls from "hls.js";
import {
  AlertTriangle,
  Gauge,
  Loader2,
  Lock,
  Maximize,
  Minimize,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ServerCog,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { VideoTokenResponse } from "@/types/database";

export interface WatermarkData {
  label: string;
  sublabel: string;
  sessionTag?: string;
}

export interface ProtectedHlsPlayerProps {
  lessonId?: string;
  title: string;
  watermarkFallback?: { label: string; sublabel?: string };
}

interface QualityOption {
  levelIndex: number;
  height: number;
  bitrate: number;
  label: string;
}

interface TokenErrorState {
  code?: string;
  message: string;
  isSetupPending?: boolean;
  isAuthError?: boolean;
}

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const;

const WATERMARK_ZONES = [
  { top: "14%", left: "10%", rotate: -4 },
  { top: "15%", left: "60%", rotate: 3 },
  { top: "38%", left: "14%", rotate: 5 },
  { top: "42%", left: "58%", rotate: -5 },
  { top: "62%", left: "12%", rotate: 4 },
  { top: "60%", left: "58%", rotate: -3 },
  { top: "26%", left: "36%", rotate: 2 },
  { top: "52%", left: "34%", rotate: -6 },
] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hrs > 0
    ? `${hrs}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

function formatLiveClock(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
  };
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

async function requestContainerFullscreen(el: HTMLElement): Promise<void> {
  const target = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
  };
  if (target.requestFullscreen) {
    await target.requestFullscreen();
  } else if (target.webkitRequestFullscreen) {
    await target.webkitRequestFullscreen();
  }
}

async function exitContainerFullscreen(): Promise<void> {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void> | void;
  };
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    await doc.webkitExitFullscreen();
  }
}

// ============================================================================
// Dynamic Anti-Leak Student Watermark + MutationObserver Tamper Guard
// Exported so VideoPlayer.tsx can also overlay it on paid Bunny embeds.
// ============================================================================

export function DynamicStudentWatermark({
  watermark,
  containerRef,
  onTamperDetected,
  isActive = true,
}: {
  watermark: WatermarkData;
  containerRef: RefObject<HTMLDivElement | null>;
  onTamperDetected?: () => void;
  isActive?: boolean;
}) {
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const [zoneIndex, setZoneIndex] = useState<number>(0);
  const [clockText, setClockText] = useState<string>("");
  const [remountNonce, setRemountNonce] = useState<number>(0);
  const lastTamperAtRef = useRef<number>(0);
  const onTamperRef = useRef(onTamperDetected);

  useEffect(() => {
    onTamperRef.current = onTamperDetected;
  }, [onTamperDetected]);

  // Smoothly reposition across safe zones every ~10 seconds
  useEffect(() => {
    if (!isActive) return;
    const initTimer = window.setTimeout(() => {
      setClockText(formatLiveClock());
    }, 0);
    const moveTimer = window.setInterval(() => {
      setZoneIndex((prev) => {
        const nextOffset = 1 + Math.floor(Math.random() * (WATERMARK_ZONES.length - 1));
        return (prev + nextOffset) % WATERMARK_ZONES.length;
      });
      setClockText(formatLiveClock());
    }, 10_000);

    const clockTimer = window.setInterval(() => {
      setClockText(formatLiveClock());
    }, 15_000);

    return () => {
      window.clearTimeout(initTimer);
      window.clearInterval(moveTimer);
      window.clearInterval(clockTimer);
    };
  }, [isActive]);

  // MutationObserver + computed-style tamper guard
  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;

    const triggerTamperRecovery = () => {
      const now = Date.now();
      if (now - lastTamperAtRef.current < 450) return;
      lastTamperAtRef.current = now;
      onTamperRef.current?.();
      setRemountNonce((n) => n + 1);
    };

    const verifyWatermarkIntegrity = () => {
      // Skip visibility checks when the whole player tab is hidden (e.g. switched to Lab/Quiz tab)
      if (!container.isConnected || container.offsetParent === null) {
        return;
      }

      const el = watermarkRef.current;
      if (!el || !container.contains(el)) {
        triggerTamperRecovery();
        return;
      }

      if (el.hasAttribute("hidden")) {
        triggerTamperRecovery();
        return;
      }

      const computed = window.getComputedStyle(el);
      const opacityValue = Number.parseFloat(computed.opacity || "0");
      const rect = el.getBoundingClientRect();

      if (
        computed.display === "none" ||
        computed.visibility === "hidden" ||
        !Number.isFinite(opacityValue) ||
        opacityValue < 0.12 ||
        rect.width < 12 ||
        rect.height < 8
      ) {
        triggerTamperRecovery();
      }
    };

    const observer = new MutationObserver((mutations) => {
      if (!container.isConnected || container.offsetParent === null) {
        return;
      }

      const wmEl = watermarkRef.current;
      if (!wmEl || !container.contains(wmEl)) {
        triggerTamperRecovery();
        return;
      }

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const removed of Array.from(mutation.removedNodes)) {
            if (removed === wmEl || (removed instanceof Node && removed.contains(wmEl))) {
              triggerTamperRecovery();
              return;
            }
          }
        } else if (mutation.type === "attributes" && mutation.target === wmEl) {
          verifyWatermarkIntegrity();
          return;
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });

    // Periodic computed-style check catches DevTools <style> overrides too
    const integrityInterval = window.setInterval(verifyWatermarkIntegrity, 2500);

    return () => {
      observer.disconnect();
      window.clearInterval(integrityInterval);
    };
  }, [containerRef, isActive, remountNonce]);

  const zone = WATERMARK_ZONES[zoneIndex] ?? WATERMARK_ZONES[0];

  const metaParts = [
    watermark.sublabel,
    watermark.sessionTag,
    clockText,
  ].filter(Boolean);

  return (
    <div
      key={`wm-${remountNonce}`}
      ref={watermarkRef}
      data-portal-watermark="active"
      aria-hidden="true"
      className="pointer-events-none select-none absolute z-30 max-w-[78%] transition-[top,left,transform] duration-1000 ease-in-out"
      style={{
        top: zone.top,
        left: zone.left,
        opacity: 0.22,
        display: "block",
        visibility: "visible",
        transform: `rotate(${zone.rotate}deg)`,
        willChange: "top, left, transform",
      }}
    >
      <div
        className="rounded-lg px-2.5 py-1 text-white"
        style={{
          background: "rgba(9, 17, 31, 0.28)",
          textShadow: "0 1px 4px rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(1px)",
        }}
      >
        <p className="truncate text-[11px] font-bold leading-tight tracking-wide sm:text-[12px]">
          {watermark.label}
        </p>
        <p
          dir="ltr"
          className="font-mono-code truncate text-[9.5px] font-medium leading-tight text-white/90 sm:text-[10.5px]"
        >
          {metaParts.join(" · ")}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Protected Encrypted HLS Cinema Player (hls.js + Safari Native HLS)
// ============================================================================

export default function ProtectedHlsPlayer(props: ProtectedHlsPlayerProps) {
  return (
    <ProtectedHlsPlayerInner
      key={props.lessonId ?? "no-lesson"}
      {...props}
    />
  );
}

function ProtectedHlsPlayerInner({
  lessonId,
  title,
  watermarkFallback,
}: ProtectedHlsPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const seekTrackRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimerRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<number | null>(null);
  const tamperBannerTimerRef = useRef<number | null>(null);
  const pendingResumeRef = useRef<{ time: number; shouldPlay: boolean } | null>(null);
  const hasRetriedAuthRefreshRef = useRef<boolean>(false);

  // Token & stream status
  const [tokenData, setTokenData] = useState<VideoTokenResponse | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<TokenErrorState | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isNativeHls, setIsNativeHls] = useState<boolean>(false);

  // Player playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Seek scrub preview
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [hoverSeekPct, setHoverSeekPct] = useState<number | null>(null);

  // Menus & Quality levels
  const [activeMenu, setActiveMenu] = useState<"speed" | "quality" | null>(null);
  const [qualityLevels, setQualityLevels] = useState<QualityOption[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1); // -1 = Auto
  const [autoResolvedHeight, setAutoResolvedHeight] = useState<number | null>(null);

  // Tamper feedback
  const [tamperNotice, setTamperNotice] = useState<boolean>(false);

  const effectiveWatermark = useMemo<WatermarkData>(() => {
    if (tokenData?.watermark) {
      return tokenData.watermark;
    }
    return {
      label: watermarkFallback?.label || "طالب بوابة حاسبات",
      sublabel: watermarkFallback?.sublabel || "CS Portal · Protected",
    };
  }, [tokenData, watermarkFallback]);

  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimerRef.current !== null) {
      window.clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = null;
    }
    setShowControls(true);
    const video = videoRef.current;
    if (video && !video.paused && !activeMenu) {
      hideControlsTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3200);
    }
  }, [activeMenu]);

  // Fetch signed playback token from POST /api/video/token
  const fetchSignedToken = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = Boolean(options?.silent);
      if (!lessonId) {
        setIsLoadingToken(false);
        setTokenError({
          code: "MISSING_LESSON_ID",
          message: "تعذّر تحديد الفصل المرتبط بهذا الفيديو المحمي.",
        });
        return;
      }

      if (!silent) {
        setIsLoadingToken(true);
        setTokenError(null);
        setPlaybackError(null);
      }

      try {
        const response = await fetch("/api/video/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({ lessonId }),
        });

        const body = (await response.json().catch(() => null)) as
          | (VideoTokenResponse & { ok?: boolean; code?: string; error?: string })
          | null;

        if (!response.ok || !body?.playbackUrl) {
          const code = body?.code;
          const message =
            body?.error ||
            (response.status === 401
              ? "سجّل دخولك أولاً لمشاهدة الفيديوهات المدفوعة."
              : response.status === 403
                ? "هذا الفيديو متاح للمشتركين فقط."
                : "تعذّر تجهيز البث المشفر حالياً. حاول مرة أخرى.");

          if (silent) {
            setPlaybackError("انتهت صلاحية جلسة البث. اضغط إعادة المحاولة لاستكمال المشاهدة.");
            return;
          }

          setTokenError({
            code,
            message,
            isSetupPending:
              code === "VIDEO_CDN_NOT_CONFIGURED" ||
              code === "NO_HLS_STREAM" ||
              response.status === 503,
            isAuthError: response.status === 401 || response.status === 403,
          });
          setTokenData(null);
          return;
        }

        // Preserve playback position on seamless token refresh
        if (silent && videoRef.current) {
          pendingResumeRef.current = {
            time: videoRef.current.currentTime || 0,
            shouldPlay: !videoRef.current.paused,
          };
        }

        hasRetriedAuthRefreshRef.current = false;
        setTokenError(null);
        setPlaybackError(null);
        setTokenData({
          playbackUrl: body.playbackUrl,
          provider: body.provider,
          expiresAt: body.expiresAt,
          watermark: body.watermark,
        });
      } catch {
        if (silent) {
          setPlaybackError("انقطع الاتصال بخادم البث. اضغط إعادة المحاولة.");
        } else {
          setTokenError({
            code: "NETWORK_ERROR",
            message: "تعذّر الاتصال بخادم البث. تأكد من اتصالك بالإنترنت وحاول مجدداً.",
          });
        }
      } finally {
        if (!silent) {
          setIsLoadingToken(false);
        }
      }
    },
    [lessonId]
  );

  // Initial fetch on mount (keyed by lessonId in wrapper so state resets cleanly)
  useEffect(() => {
    let cancelled = false;

    const loadInitialToken = async () => {
      if (!lessonId) {
        if (!cancelled) {
          setIsLoadingToken(false);
          setTokenError({
            code: "MISSING_LESSON_ID",
            message: "تعذّر تحديد الفصل المرتبط بهذا الفيديو المحمي.",
          });
        }
        return;
      }

      try {
        const response = await fetch("/api/video/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({ lessonId }),
        });

        const body = (await response.json().catch(() => null)) as
          | (VideoTokenResponse & { ok?: boolean; code?: string; error?: string })
          | null;

        if (cancelled) return;

        if (!response.ok || !body?.playbackUrl) {
          const code = body?.code;
          const message =
            body?.error ||
            (response.status === 401
              ? "سجّل دخولك أولاً لمشاهدة الفيديوهات المدفوعة."
              : response.status === 403
                ? "هذا الفيديو متاح للمشتركين فقط."
                : "تعذّر تجهيز البث المشفر حالياً. حاول مرة أخرى.");

          setTokenError({
            code,
            message,
            isSetupPending:
              code === "VIDEO_CDN_NOT_CONFIGURED" ||
              code === "NO_HLS_STREAM" ||
              response.status === 503,
            isAuthError: response.status === 401 || response.status === 403,
          });
          setTokenData(null);
          return;
        }

        hasRetriedAuthRefreshRef.current = false;
        setTokenError(null);
        setPlaybackError(null);
        setTokenData({
          playbackUrl: body.playbackUrl,
          provider: body.provider,
          expiresAt: body.expiresAt,
          watermark: body.watermark,
        });
      } catch {
        if (!cancelled) {
          setTokenError({
            code: "NETWORK_ERROR",
            message: "تعذّر الاتصال بخادم البث. تأكد من اتصالك بالإنترنت وحاول مجدداً.",
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoadingToken(false);
        }
      }
    };

    void loadInitialToken();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  // Schedule silent token auto-refresh 90s before expiry
  useEffect(() => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!tokenData?.expiresAt) return;
    const expiresMs = Date.parse(tokenData.expiresAt);
    if (!Number.isFinite(expiresMs)) return;

    const msRemaining = expiresMs - Date.now();
    const refreshDelay = Math.max(15_000, msRemaining - 90_000);

    refreshTimerRef.current = window.setTimeout(() => {
      void fetchSignedToken({ silent: true });
    }, refreshDelay);

    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [tokenData?.expiresAt, fetchSignedToken]);

  // Attach HLS stream via hls.js or native Safari/iOS HLS fallback
  useEffect(() => {
    const video = videoRef.current;
    const playbackUrl = tokenData?.playbackUrl;
    if (!video || !playbackUrl) return;

    // Clean up any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const restorePendingPlayback = () => {
      const pending = pendingResumeRef.current;
      if (!pending) return;
      pendingResumeRef.current = null;
      if (pending.time > 0 && Number.isFinite(pending.time)) {
        try {
          video.currentTime = pending.time;
        } catch {
          // Ignore seek failures before metadata
        }
      }
      if (pending.shouldPlay) {
        void video.play().catch(() => {});
      }
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 60,
        maxBufferLength: 30,
        startLevel: -1,
      });
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_LOADING, () => {
        setPlaybackError(null);
        setIsBuffering(true);
        setIsNativeHls(false);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        const rawLevels = hls.levels.map((lvl, idx) => ({
          levelIndex: idx,
          height: lvl.height || 0,
          bitrate: lvl.bitrate || 0,
          label:
            lvl.height && lvl.height > 0
              ? `${lvl.height}p`
              : `${Math.max(1, Math.round((lvl.bitrate || 0) / 1000))}kbps`,
        }));

        // Deduplicate by label keeping the highest bitrate variant, sorted high->low
        const byLabel = new Map<string, QualityOption>();
        for (const item of rawLevels) {
          const existing = byLabel.get(item.label);
          if (!existing || item.bitrate > existing.bitrate) {
            byLabel.set(item.label, item);
          }
        }
        const sorted = Array.from(byLabel.values()).sort(
          (a, b) => b.height - a.height || b.bitrate - a.bitrate
        );
        setQualityLevels(sorted);
        setSelectedLevel(-1);
        restorePendingPlayback();
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const active = hls.levels[data.level];
        if (active?.height) {
          setAutoResolvedHeight(active.height);
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;

        const httpStatus = data.response?.code;
        if (
          (httpStatus === 401 || httpStatus === 403) &&
          !hasRetriedAuthRefreshRef.current
        ) {
          hasRetriedAuthRefreshRef.current = true;
          void fetchSignedToken({ silent: true });
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          setPlaybackError("حدث انقطاع مؤقت في تحميل البث. جاري إعادة المحاولة...");
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        setIsBuffering(false);
        setPlaybackError("تعذّر تشغيل البث المشفر. جرّب إعادة التحميل.");
        hls.destroy();
        hlsRef.current = null;
      });

      hls.loadSource(playbackUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
        if (hlsRef.current === hls) {
          hlsRef.current = null;
        }
      };
    }

    // Native HLS fallback (Safari / iOS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      const handleLoadStart = () => {
        setIsNativeHls(true);
        setQualityLevels([]);
        setPlaybackError(null);
        setIsBuffering(true);
      };
      const handleLoadedMetadata = () => {
        setIsBuffering(false);
        restorePendingPlayback();
      };
      const handleNativeError = () => {
        setIsBuffering(false);
        setPlaybackError("تعذّر تشغيل البث على هذا المتصفح. اضغط إعادة المحاولة.");
      };

      video.addEventListener("loadstart", handleLoadStart);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleNativeError);
      video.src = playbackUrl;

      return () => {
        video.removeEventListener("loadstart", handleLoadStart);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("error", handleNativeError);
        video.removeAttribute("src");
        video.load();
      };
    }

    const unsupportedTimer = window.setTimeout(() => {
      setIsBuffering(false);
      setPlaybackError("متصفحك الحالي لا يدعم تشغيل بث HLS المشفر.");
    }, 0);

    return () => {
      window.clearTimeout(unsupportedTimer);
    };
  }, [tokenData?.playbackUrl, fetchSignedToken]);

  // Sync HTMLVideoElement events to UI state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setPlaybackError(null);
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onPlaying = () => {
      setIsBuffering(false);
      setPlaybackError(null);
    };
    const onTimeUpdate = () => {
      if (!isScrubbing) {
        setCurrentTime(video.currentTime || 0);
      }
      if (video.buffered.length > 0) {
        setBufferedEnd(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onDurationChange = () => {
      if (Number.isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBufferedEnd(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted || video.volume === 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("progress", onProgress);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("ended", onEnded);
    };
  }, [isScrubbing, tokenData?.playbackUrl]);

  // Listen to fullscreen state changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(getFullscreenElement() === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current !== null) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
      if (tamperBannerTimerRef.current !== null) {
        window.clearTimeout(tamperBannerTimerRef.current);
      }
    };
  }, []);

  // Tamper callback: immediately pause video and flash brief notice
  const handleTamperDetected = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
    setTamperNotice(true);
    if (tamperBannerTimerRef.current !== null) {
      window.clearTimeout(tamperBannerTimerRef.current);
    }
    tamperBannerTimerRef.current = window.setTimeout(() => {
      setTamperNotice(false);
    }, 4500);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setActiveMenu(null);
    if (video.paused || video.ended) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
    scheduleHideControls();
  }, [scheduleHideControls]);

  const skipBy = useCallback(
    (deltaSeconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      const maxTime = Number.isFinite(video.duration) ? video.duration : duration;
      const next = Math.min(Math.max(0, video.currentTime + deltaSeconds), maxTime || 0);
      video.currentTime = next;
      setCurrentTime(next);
      scheduleHideControls();
    },
    [duration, scheduleHideControls]
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted || video.volume === 0) {
      video.muted = false;
      if (video.volume === 0) video.volume = 0.8;
    } else {
      video.muted = true;
    }
    scheduleHideControls();
  }, [scheduleHideControls]);

  const handleVolumeSlider = useCallback(
    (nextVolume: number) => {
      const video = videoRef.current;
      if (!video) return;
      const clamped = Math.min(1, Math.max(0, nextVolume));
      video.volume = clamped;
      video.muted = clamped === 0;
      scheduleHideControls();
    },
    [scheduleHideControls]
  );

  const handleSelectRate = useCallback(
    (rate: number) => {
      const video = videoRef.current;
      if (video) {
        video.playbackRate = rate;
      }
      setPlaybackRate(rate);
      setActiveMenu(null);
      scheduleHideControls();
    },
    [scheduleHideControls]
  );

  const handleSelectQuality = useCallback(
    (levelIndex: number) => {
      const hls = hlsRef.current;
      if (hls) {
        hls.currentLevel = levelIndex;
      }
      setSelectedLevel(levelIndex);
      setActiveMenu(null);
      scheduleHideControls();
    },
    [scheduleHideControls]
  );

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    setActiveMenu(null);
    try {
      if (getFullscreenElement() === container) {
        await exitContainerFullscreen();
      } else {
        await requestContainerFullscreen(container);
      }
    } catch {
      // Ignore fullscreen rejection if user gesture was lost
    }
    scheduleHideControls();
  }, [scheduleHideControls]);

  // Seek bar pointer interaction (always LTR)
  const computeSeekPct = useCallback((clientX: number): number => {
    const track = seekTrackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }, []);

  const applySeekPct = useCallback(
    (pct: number) => {
      const video = videoRef.current;
      if (!video || !duration) return;
      const nextTime = pct * duration;
      video.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [duration]
  );

  const handleSeekPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsScrubbing(true);
    const pct = computeSeekPct(e.clientX);
    applySeekPct(pct);
    setHoverSeekPct(pct);
  };

  const handleSeekPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const pct = computeSeekPct(e.clientX);
    setHoverSeekPct(pct);
    if (isScrubbing) {
      applySeekPct(pct);
    }
  };

  const handleSeekPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsScrubbing(false);
    scheduleHideControls();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    switch (e.key) {
      case " ":
      case "k":
      case "K":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowRight":
        e.preventDefault();
        skipBy(5);
        break;
      case "ArrowLeft":
        e.preventDefault();
        skipBy(-5);
        break;
      case "m":
      case "M":
        e.preventDefault();
        toggleMute();
        break;
      case "f":
      case "F":
        e.preventDefault();
        void toggleFullscreen();
        break;
      case "Escape":
        setActiveMenu(null);
        break;
    }
  };

  const handleSurfaceClick = (e: ReactMouseEvent<HTMLElement>) => {
    if (activeMenu) {
      setActiveMenu(null);
      e.stopPropagation();
      return;
    }
    togglePlay();
  };

  const playedPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const bufferedPct = duration > 0 ? Math.min(100, (bufferedEnd / duration) * 100) : 0;

  const activeQualityLabel = useMemo(() => {
    if (isNativeHls || selectedLevel === -1) {
      return autoResolvedHeight ? `تلقائي (${autoResolvedHeight}p)` : "تلقائي";
    }
    const found = qualityLevels.find((q) => q.levelIndex === selectedLevel);
    return found ? found.label : "تلقائي";
  }, [isNativeHls, selectedLevel, qualityLevels, autoResolvedHeight]);

  // --------------------------------------------------------------------------
  // State 1: Loading signed playback token
  // --------------------------------------------------------------------------
  if (isLoadingToken) {
    return (
      <div
        className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border bg-[#09111f] p-6 text-center text-white shadow-sm"
        style={{ borderColor: "var(--border-soft)" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
          style={{ background: "rgba(194, 94, 51, 0.16)", color: "#e58a62" }}
        >
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-[14.5px] font-extrabold text-white">
            جاري تجهيز البث المشفر...
          </p>
          <p className="font-mono-code text-[11.5px] text-slate-400">
            HLS Token Authentication · Anti-Leak Guard
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // State 2: Error / Auth Required / CDN Setup Pending (Warm Editorial Navy)
  // --------------------------------------------------------------------------
  if (tokenError || !tokenData) {
    const isSetupPending = tokenError?.isSetupPending;
    const isAuthError = tokenError?.isAuthError;

    return (
      <div
        className="relative flex aspect-video w-full flex-col items-center justify-center gap-3.5 overflow-hidden rounded-2xl border p-6 text-center shadow-sm"
        style={{
          background:
            "linear-gradient(145deg, #13213a 0%, #09111f 68%, #070d18 100%)",
          borderColor: "var(--border-soft)",
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="flex h-13 w-13 items-center justify-center rounded-2xl border"
          style={{
            background: isAuthError
              ? "rgba(194, 94, 51, 0.18)"
              : isSetupPending
                ? "rgba(124, 167, 240, 0.14)"
                : "rgba(194, 94, 51, 0.16)",
            borderColor: isAuthError
              ? "rgba(229, 138, 98, 0.35)"
              : isSetupPending
                ? "rgba(124, 167, 240, 0.3)"
                : "rgba(229, 138, 98, 0.3)",
            color: isSetupPending ? "#9dc0f7" : "#e58a62",
          }}
        >
          {isAuthError ? (
            <Lock className="h-6 w-6" />
          ) : isSetupPending ? (
            <ServerCog className="h-6 w-6" />
          ) : (
            <AlertTriangle className="h-6 w-6" />
          )}
        </div>

        <div className="max-w-md space-y-1.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
            }}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#e58a62]" />
            <span>فيديو محمي · Encrypted HLS</span>
          </span>

          <h3 className="text-[15.5px] font-extrabold text-white">
            {tokenError?.message || "تعذّر تحميل البث المحمي لهذا الفصل"}
          </h3>

          {isSetupPending && (
            <p className="text-[12.5px] leading-relaxed text-slate-300">
              سيظهر الفيديو تلقائياً فور ربط إعدادات البث المشفر في الخادم. يمكنك
              الاستمرار في المذاكرة من الملخص التفاعلي والكويزات الآن.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void fetchSignedToken({ silent: false })}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
          style={{ background: "#c25e33" }}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // State 3: Active Protected HLS Cinema Player
  // --------------------------------------------------------------------------
  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={scheduleHideControls}
      onMouseEnter={scheduleHideControls}
      onMouseLeave={() => {
        if (isPlaying && !activeMenu && !isScrubbing) {
          setShowControls(false);
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`مشغل الفيديو المحمي: ${title}`}
      className={`group relative w-full overflow-hidden bg-[#09111f] text-white select-none outline-none ${
        isFullscreen
          ? "flex h-screen w-screen items-center justify-center rounded-none border-0"
          : "aspect-video rounded-2xl border shadow-sm"
      }`}
      style={{
        borderColor: isFullscreen ? "transparent" : "var(--border-soft)",
      }}
    >
      {/* Underlying Protected HTML5 Video Element */}
      <video
        ref={videoRef}
        className="h-full w-full cursor-pointer object-contain bg-[#09111f]"
        playsInline
        controls={false}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        preload="metadata"
        onClick={handleSurfaceClick}
        onDoubleClick={() => void toggleFullscreen()}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Dynamic Floating Anti-Leak Student Watermark (inside Fullscreen wrapper!) */}
      <DynamicStudentWatermark
        watermark={effectiveWatermark}
        containerRef={containerRef}
        onTamperDetected={handleTamperDetected}
        isActive
      />

      {/* Top Subtle Editorial Cinema Header */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-[#050a14]/88 via-[#09111f]/45 to-transparent px-4 pt-3 pb-8 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-[#09111f]/75 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-200 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c25e33]" />
            <span>بث محمي</span>
            <span className="font-mono-code text-[10px] text-[#e58a62]">HLS</span>
          </span>
          <p className="truncate text-[12.5px] font-bold text-white/92 drop-shadow-sm">
            {title}
          </p>
        </div>

        <span className="font-mono-code hidden shrink-0 rounded-md border border-white/10 bg-[#09111f]/65 px-2 py-0.5 text-[10px] text-slate-300 sm:inline-flex">
          {effectiveWatermark.sessionTag || "PROTECTED"}
        </span>
      </div>

      {/* Tamper Guard Warning Toast */}
      {tamperNotice && (
        <div className="pointer-events-none absolute inset-x-4 top-12 z-40 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#e58a62]/45 bg-[#09111f]/95 px-3.5 py-2 text-[12px] font-bold text-[#f0a786] shadow-lg backdrop-blur-md">
            <ShieldAlert className="h-4 w-4 shrink-0 text-[#c25e33]" />
            <span>تم إيقاف التشغيل مؤقتاً للحفاظ على العلامة المائية وحماية المحتوى.</span>
          </div>
        </div>
      )}

      {/* Playback Error Overlay */}
      {playbackError && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-[#09111f]/88 p-6 text-center backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <AlertTriangle className="h-7 w-7 text-[#e58a62]" />
          <p className="max-w-sm text-[13.5px] font-bold text-white">
            {playbackError}
          </p>
          <button
            type="button"
            onClick={() => void fetchSignedToken({ silent: false })}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#c25e33] px-4 py-2 text-[12.5px] font-bold text-white transition hover:brightness-110"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>إعادة تحميل البث</span>
          </button>
        </div>
      )}

      {/* Center Play Button / Buffering Spinner */}
      {!playbackError && (isBuffering || !isPlaying) && (
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          {isBuffering ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#09111f]/80 text-[#e58a62] shadow-lg backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSurfaceClick}
              aria-label="تشغيل الفيديو"
              className="pointer-events-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-[#c25e33]/92 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition duration-200 hover:scale-105 hover:bg-[#c25e33] active:scale-95"
            >
              <Play className="h-7 w-7 fill-white translate-x-[1px]" />
            </button>
          )}
        </div>
      )}

      {/* Bottom Custom Warm Editorial Navy Cinema Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#050a14]/96 via-[#09111f]/82 to-transparent px-3 pt-10 pb-2.5 transition-opacity duration-250 sm:px-4 sm:pb-3 ${
          showControls || !isPlaying || Boolean(activeMenu)
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Interactive Seek Bar (Always LTR so playback progresses left -> right) */}
        <div
          ref={seekTrackRef}
          dir="ltr"
          role="slider"
          aria-label="شريط التقدم"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
          onPointerDown={handleSeekPointerDown}
          onPointerMove={handleSeekPointerMove}
          onPointerUp={handleSeekPointerUp}
          onPointerCancel={handleSeekPointerUp}
          onPointerLeave={() => {
            if (!isScrubbing) setHoverSeekPct(null);
          }}
          className="group/seek relative mb-2.5 flex h-4 w-full cursor-pointer items-center touch-none"
        >
          {/* Hover Time Preview Tooltip */}
          {hoverSeekPct !== null && duration > 0 && (
            <div
              className="font-mono-code pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md border border-white/15 bg-[#09111f]/95 px-2 py-0.5 text-[10.5px] font-semibold text-white shadow-md"
              style={{ left: `${Math.min(95, Math.max(5, hoverSeekPct * 100))}%` }}
            >
              {formatTime(hoverSeekPct * duration)}
            </div>
          )}

          {/* Track */}
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20 transition-all group-hover/seek:h-2">
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/35 transition-[width] duration-150"
              style={{ width: `${bufferedPct}%` }}
            />
            {/* Played (Terracotta Accent) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#c25e33]"
              style={{ width: `${playedPct}%` }}
            />
          </div>

          {/* Playhead Thumb */}
          <div
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#c25e33] shadow-[0_0_10px_rgba(194,94,51,0.75)] transition-transform group-hover/seek:scale-115"
            style={{ left: `${playedPct}%` }}
          />
        </div>

        {/* Control Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Primary Playback & Audio Group */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? "إيقاف مؤقت (مسافة)" : "تشغيل (مسافة)"}
              aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white transition hover:bg-white/12"
            >
              {isPlaying ? (
                <Pause className="h-4.5 w-4.5 fill-white" />
              ) : (
                <Play className="h-4.5 w-4.5 fill-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skipBy(-10)}
              title="رجوع 10 ثوانٍ"
              aria-label="رجوع 10 ثوانٍ"
              className="hidden h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition hover:bg-white/12 hover:text-white sm:flex"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => skipBy(10)}
              title="تقديم 10 ثوانٍ"
              aria-label="تقديم 10 ثوانٍ"
              className="hidden h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition hover:bg-white/12 hover:text-white sm:flex"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* Volume & Mute */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "إلغاء كتم الصوت (M)" : "كتم الصوت (M)"}
                aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition hover:bg-white/12 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-[#e58a62]" />
                ) : volume < 0.5 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              <input
                type="range"
                dir="ltr"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeSlider(Number(e.target.value))}
                aria-label="مستوى الصوت"
                className="hidden h-1 w-16 cursor-pointer accent-[#c25e33] sm:block"
              />
            </div>

            {/* LTR Monospace Timecode */}
            <span
              dir="ltr"
              className="font-mono-code ms-1 rounded-md bg-white/8 px-2 py-0.5 text-[11px] font-medium text-slate-200 tabular-nums"
            >
              {formatTime(currentTime)} <span className="text-slate-400">/</span>{" "}
              {formatTime(duration)}
            </span>
          </div>

          {/* Right/End Settings & Fullscreen Group */}
          <div className="relative flex items-center gap-1 sm:gap-1.5">
            {/* Playback Speed Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveMenu((prev) => (prev === "speed" ? null : "speed"))
                }
                title="سرعة التشغيل"
                aria-label="سرعة التشغيل"
                className={`flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-[11.5px] font-bold transition ${
                  activeMenu === "speed" || playbackRate !== 1
                    ? "bg-[#c25e33]/25 text-[#f0a786] ring-1 ring-[#c25e33]/50"
                    : "text-slate-200 hover:bg-white/12 hover:text-white"
                }`}
              >
                <Gauge className="h-3.5 w-3.5" />
                <span className="font-mono-code">{playbackRate}x</span>
              </button>

              {activeMenu === "speed" && (
                <div className="absolute bottom-10 left-0 z-40 w-28 overflow-hidden rounded-xl border border-white/12 bg-[#0c1628]/96 p-1 shadow-2xl backdrop-blur-md">
                  <p className="px-2 py-1 text-[10px] font-bold text-slate-400">
                    سرعة التشغيل
                  </p>
                  {PLAYBACK_RATES.map((rate) => {
                    const active = playbackRate === rate;
                    return (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleSelectRate(rate)}
                        className={`font-mono-code flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                          active
                            ? "bg-[#c25e33] text-white"
                            : "text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        <span>{rate}x</span>
                        {rate === 1 && (
                          <span className="font-sans text-[10px] opacity-85">
                            عادي
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* HLS Quality Level Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveMenu((prev) => (prev === "quality" ? null : "quality"))
                }
                title="جودة البث (HLS)"
                aria-label="جودة البث"
                className={`flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-[11.5px] font-bold transition ${
                  activeMenu === "quality" || selectedLevel !== -1
                    ? "bg-[#c25e33]/25 text-[#f0a786] ring-1 ring-[#c25e33]/50"
                    : "text-slate-200 hover:bg-white/12 hover:text-white"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                <span className="hidden max-w-[92px] truncate sm:inline">
                  {activeQualityLabel}
                </span>
              </button>

              {activeMenu === "quality" && (
                <div className="absolute bottom-10 left-0 z-40 w-36 overflow-hidden rounded-xl border border-white/12 bg-[#0c1628]/96 p-1 shadow-2xl backdrop-blur-md">
                  <p className="px-2 py-1 text-[10px] font-bold text-slate-400">
                    جودة البث
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectQuality(-1)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px] font-bold transition ${
                      selectedLevel === -1
                        ? "bg-[#c25e33] text-white"
                        : "text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    <span>تلقائي</span>
                    <span className="font-mono-code text-[10px] opacity-85">
                      {autoResolvedHeight ? `${autoResolvedHeight}p` : "Auto"}
                    </span>
                  </button>

                  {qualityLevels.map((lvl) => {
                    const active = selectedLevel === lvl.levelIndex;
                    return (
                      <button
                        key={lvl.levelIndex}
                        type="button"
                        onClick={() => handleSelectQuality(lvl.levelIndex)}
                        className={`font-mono-code flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                          active
                            ? "bg-[#c25e33] text-white"
                            : "text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        <span>{lvl.label}</span>
                        {lvl.height >= 720 && (
                          <span className="rounded bg-white/15 px-1 text-[9px] font-bold">
                            HD
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Fullscreen Toggle on Outer Container (preserves watermark!) */}
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              title={isFullscreen ? "إنهاء ملء الشاشة (F)" : "ملء الشاشة (F)"}
              aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition hover:bg-white/12 hover:text-white"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
