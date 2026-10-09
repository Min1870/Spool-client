"use client";

import clsx from "clsx";
import {
  ArrowLeft,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { formatTime } from "@/lib/format";
import { HLS_TEST_STREAM, LOCAL_MP4_FALLBACK } from "@/lib/mockData";
import { backdropUrl, releaseYear } from "@/lib/tmdb";
import type { Movie, PlayerSource, PlayerSourceKind } from "@/lib/types";
import { YT_STATE, loadYouTubeApi, type YTPlayer } from "@/lib/youtube";

// ---------------------------------------------------------------------------
// Engine abstraction: YouTube iframe and HTML5 <video> expose the same API so
// the custom control bar works identically for both.
// ---------------------------------------------------------------------------

interface PlaybackSnapshot {
  playing: boolean;
  waiting: boolean;
  ended: boolean;
  current: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
}

interface PlayerApi {
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  snapshot(): PlaybackSnapshot;
}

interface EngineProps {
  startAt: number;
  onReady: (api: PlayerApi) => void;
  onFail: () => void;
}

const SOURCE_LABEL: Record<PlayerSourceKind, string> = {
  youtube: "YouTube",
  hls: "HLS Test Stream",
  mp4: "Local Sample",
};

const EMPTY_SNAPSHOT: PlaybackSnapshot = {
  playing: false,
  waiting: true,
  ended: false,
  current: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  muted: false,
};

function YouTubeEngine({ videoKey, startAt, onReady, onFail }: EngineProps & { videoKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // YT replaces its mount node, so give it one React doesn't own.
    const mount = document.createElement("div");
    container.appendChild(mount);
    let player: YTPlayer | null = null;
    let cancelled = false;

    loadYouTubeApi().then(
      (YT) => {
        if (cancelled) return;
        player = new YT.Player(mount, {
          videoId: videoKey,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            start: Math.floor(startAt),
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              if (cancelled) return;
              target.playVideo();
              onReady({
                play: () => target.playVideo(),
                pause: () => target.pauseVideo(),
                seek: (s) => target.seekTo(s, true),
                setVolume: (v) => target.setVolume(Math.round(v * 100)),
                setMuted: (m) => (m ? target.mute() : target.unMute()),
                snapshot: () => {
                  const state = target.getPlayerState();
                  const duration = target.getDuration() || 0;
                  return {
                    playing: state === YT_STATE.PLAYING || state === YT_STATE.BUFFERING,
                    waiting: state === YT_STATE.BUFFERING,
                    ended: state === YT_STATE.ENDED,
                    current: target.getCurrentTime() || 0,
                    duration,
                    buffered: (target.getVideoLoadedFraction() || 0) * duration,
                    volume: target.getVolume() / 100,
                    muted: target.isMuted(),
                  };
                },
              });
            },
            // 2: bad id, 5: HTML5 error, 100: removed, 101/150: embedding disabled.
            onError: () => !cancelled && onFail(),
          },
        });
      },
      () => !cancelled && onFail(),
    );

    return () => {
      cancelled = true;
      player?.destroy();
      mount.remove();
    };
  }, [videoKey, startAt, onReady, onFail]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 [&_iframe]:pointer-events-none [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full"
    />
  );
}

function VideoEngine({ source, startAt, onReady, onFail }: EngineProps & { source: PlayerSource & { url: string } }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    let destroyHls: (() => void) | undefined;

    const onMeta = () => {
      if (startAt > 0 && startAt < video.duration) video.currentTime = startAt;
      video.play().catch(() => {
        /* Autoplay blocked — the user can press play. */
      });
    };
    const onError = () => !cancelled && onFail();
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("error", onError);

    const nativeHls = video.canPlayType("application/vnd.apple.mpegurl") !== "";
    if (source.kind === "hls" && !nativeHls) {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) return onFail();
        const hls = new Hls({ startPosition: startAt > 0 ? startAt : -1 });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal && !cancelled) onFail();
        });
        hls.loadSource(source.url);
        hls.attachMedia(video);
        destroyHls = () => hls.destroy();
      }, onFail);
    } else {
      video.src = source.url;
    }

    onReady({
      play: () => void video.play().catch(() => {}),
      pause: () => video.pause(),
      seek: (s) => {
        video.currentTime = s;
      },
      setVolume: (v) => {
        video.volume = v;
      },
      setMuted: (m) => {
        video.muted = m;
      },
      snapshot: () => ({
        playing: !video.paused && !video.ended,
        waiting: video.readyState < 3 && !video.paused,
        ended: video.ended,
        current: video.currentTime,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        buffered: video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0,
        volume: video.volume,
        muted: video.muted,
      }),
    });

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("error", onError);
      destroyHls?.();
      video.removeAttribute("src");
      video.load();
    };
  }, [source.kind, source.url, startAt, onReady, onFail]);

  return <video ref={videoRef} playsInline className="absolute inset-0 size-full bg-black object-contain" />;
}

// ---------------------------------------------------------------------------
// Control bar
// ---------------------------------------------------------------------------

function ProgressBar({
  current,
  duration,
  buffered,
  onSeek,
}: {
  current: number;
  duration: number;
  buffered: number;
  onSeek: (seconds: number) => void;
}) {
  const [hover, setHover] = useState<{ x: number; time: number } | null>(null);
  const [scrub, setScrub] = useState<number | null>(null);

  const timeAt = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    return { x: ratio * rect.width, time: ratio * duration };
  };

  const shown = scrub ?? current;
  const pct = (v: number) => (duration ? `${(v / duration) * 100}%` : "0%");

  return (
    <div
      role="slider"
      tabIndex={-1}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(shown)}
      aria-valuetext={`${formatTime(shown)} of ${formatTime(duration)}`}
      onPointerDown={(e) => {
        if (!duration) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setScrub(timeAt(e).time);
      }}
      onPointerMove={(e) => {
        if (!duration) return;
        const point = timeAt(e);
        setHover(point);
        if (scrub !== null) setScrub(point.time);
      }}
      onPointerUp={(e) => {
        if (scrub === null) return;
        onSeek(timeAt(e).time);
        setScrub(null);
      }}
      onPointerLeave={() => setHover(null)}
      className="group/progress relative flex h-5 cursor-pointer touch-none items-center"
    >
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 transition-[height] group-hover/progress:h-1.5">
        <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: pct(buffered) }} />
        <div className="bg-gradient-brand absolute inset-y-0 left-0" style={{ width: pct(shown) }} />
      </div>
      <div
        className="pointer-events-none absolute size-3.5 -translate-x-1/2 rounded-full bg-white shadow ring-4 ring-brand-violet/40 transition-transform group-hover/progress:scale-110"
        style={{ left: pct(shown) }}
      />
      {hover && (
        <div
          className="pointer-events-none absolute bottom-6 -translate-x-1/2 rounded bg-black/85 px-2 py-0.5 text-xs font-medium tabular-nums"
          style={{ left: hover.x }}
        >
          {formatTime(hover.time)}
        </div>
      )}
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={clsx(
        "grid size-10 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-brand-violet",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Player shell
// ---------------------------------------------------------------------------

const SEEK_STEP = 10;
const IDLE_MS = 3000;
const SAVE_INTERVAL_MS = 5000;

export interface VideoPlayerProps {
  movie: Movie;
  /** Initial source; re-key the player to switch titles/episodes. Null while resolving. */
  source: PlayerSource | null;
  startAt?: number;
  /** "modal" = framed 16:9 preview, "page" = full-viewport watch page. */
  variant?: "modal" | "page";
  /** Shown above the title, e.g. "Trailer" or "S1:E3". */
  eyebrow?: string;
  /** Shown next to the title, e.g. the episode name. */
  subtitle?: string;
  /** Overrides the source label after the eyebrow (e.g. "Adaptive HD" for Spool streams). */
  sourceLabel?: string;
  onClose: () => void;
  /** Called every few seconds and on unmount with the playback position. */
  onProgress?: (position: number, duration: number) => void;
  onEnded?: () => void;
  /** Extra buttons in the control bar (e.g. Next Episode). */
  controls?: ReactNode;
  /** Overlay content rendered inside the player frame (e.g. episode drawer). */
  children?: ReactNode;
}

export default function VideoPlayer({
  movie,
  source: initialSource,
  startAt = 0,
  variant = "modal",
  eyebrow,
  subtitle,
  sourceLabel,
  onClose,
  onProgress,
  onEnded,
  controls,
  children,
}: VideoPlayerProps) {
  // Fallback chain lives here: YouTube → HLS test stream → local MP4 → error.
  const [fallback, setFallback] = useState<PlayerSource | null>(null);
  const source = fallback ?? initialSource;
  const callbacks = useRef({ onProgress, onEnded });
  useEffect(() => {
    callbacks.current = { onProgress, onEnded };
  });

  const frameRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<PlayerApi | null>(null);
  const idleTimer = useRef<number | undefined>(undefined);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [snap, setSnap] = useState<PlaybackSnapshot>(EMPTY_SNAPSHOT);
  const [idle, setIdle] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const poke = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
  }, []);

  const handleReady = useCallback(
    (api: PlayerApi) => {
      apiRef.current = api;
      setReady(true);
      poke();
    },
    [poke],
  );

  const handleFail = useCallback(() => {
    apiRef.current = null;
    setReady(false);
    if (source?.kind === "youtube") setFallback({ kind: "hls", url: HLS_TEST_STREAM });
    else if (source?.kind === "hls") setFallback({ kind: "mp4", url: LOCAL_MP4_FALLBACK });
    else setFailed(true);
  }, [source?.kind]);

  // Poll the active engine so YouTube and <video> share one render path.
  useEffect(() => {
    if (!ready) return;
    let wasEnded = false;
    const id = window.setInterval(() => {
      const next = apiRef.current?.snapshot();
      if (!next) return;
      setSnap(next);
      if (next.ended && !wasEnded) callbacks.current.onEnded?.();
      wasEnded = next.ended;
    }, 250);
    return () => window.clearInterval(id);
  }, [ready]);

  // Report progress (feeds "Continue Watching").
  useEffect(() => {
    if (!ready) return;
    const report = () => {
      const s = apiRef.current?.snapshot();
      if (s && s.duration > 0 && s.current > 3) callbacks.current.onProgress?.(s.current, s.duration);
    };
    const id = window.setInterval(report, SAVE_INTERVAL_MS);
    return () => {
      window.clearInterval(id);
      report();
    };
  }, [ready]);

  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const togglePlay = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    const s = api.snapshot();
    if (s.ended) {
      api.seek(0);
      api.play();
    } else if (s.playing) api.pause();
    else api.play();
  }, []);

  const seekBy = useCallback((delta: number) => {
    const api = apiRef.current;
    if (!api) return;
    const s = api.snapshot();
    api.seek(Math.min(Math.max(0, s.current + delta), s.duration || Infinity));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const api = apiRef.current;
    if (!api) return;
    const v = Math.min(1, Math.max(0, volume));
    api.setVolume(v);
    api.setMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    const s = api.snapshot();
    if (s.muted || s.volume === 0) {
      if (s.volume === 0) api.setVolume(0.5);
      api.setMuted(false);
    } else api.setMuted(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Keyboard shortcuts + scroll lock while the player is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const handlers: Record<string, () => void> = {
        Escape: () => !document.fullscreenElement && onClose(),
        " ": togglePlay,
        k: togglePlay,
        ArrowLeft: () => seekBy(-SEEK_STEP),
        ArrowRight: () => seekBy(SEEK_STEP),
        ArrowUp: () => setVolume((apiRef.current?.snapshot().volume ?? 1) + 0.1),
        ArrowDown: () => setVolume((apiRef.current?.snapshot().volume ?? 1) - 0.1),
        m: toggleMute,
        f: toggleFullscreen,
      };
      const handler = handlers[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!handler) return;
      e.preventDefault();
      handler();
      poke();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, togglePlay, seekBy, setVolume, toggleMute, toggleFullscreen, poke]);

  const controlsVisible = !idle || !snap.playing;
  const effectiveVolume = snap.muted ? 0 : snap.volume;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;
  const spinner = !failed && (!source || !ready || snap.waiting);

  return (
    <div
      ref={frameRef}
      onPointerMove={poke}
      onClick={(e) => e.stopPropagation()}
      className={clsx(
        "relative w-full overflow-hidden bg-black",
        variant === "page" || fullscreen
          ? "h-full"
          : "aspect-video max-h-[85vh] max-w-6xl shadow-2xl shadow-brand-violet/20 sm:rounded-xl sm:ring-1 sm:ring-white/10",
        !controlsVisible && "cursor-none",
      )}
    >
      {/* Engine */}
      {source?.kind === "youtube" && (
        <YouTubeEngine
          key={source.key}
          videoKey={source.key}
          startAt={startAt}
          onReady={handleReady}
          onFail={handleFail}
        />
      )}
      {source && source.kind !== "youtube" && (
        <VideoEngine
          key={source.url}
          source={source}
          startAt={source.kind === "hls" ? startAt : 0}
          onReady={handleReady}
          onFail={handleFail}
        />
      )}

      {/* YouTube shows its own title/branding UI whenever it isn't playing;
          cover it with a Netflix-style paused screen instead. */}
      {source?.kind === "youtube" && !snap.playing && !failed && (
        <div className="pointer-events-none absolute inset-0 z-[5] animate-fade-in bg-black">
          <Image
            src={backdropUrl(movie.backdropPath, "w1280")}
            alt=""
            fill
            sizes="100vw"
            unoptimized={!movie.backdropPath}
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent" />
          {ready && snap.current > 0 && (
            <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-6 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {snap.ended ? "Finished watching" : "You're watching"}
              </p>
              <p className="mt-2 font-display text-3xl font-bold sm:text-5xl">{movie.title}</p>
              {subtitle && <p className="mt-1 text-lg font-semibold text-white/85">{subtitle}</p>}
              <p className="mt-3 line-clamp-3 hidden text-sm text-white/75 sm:block">{movie.overview}</p>
            </div>
          )}
        </div>
      )}

      {/* Click layer: toggles playback, double-click for fullscreen */}
      <button
        type="button"
        aria-label={snap.playing ? "Pause" : "Play"}
        onClick={() => {
          togglePlay();
          poke();
        }}
        onDoubleClick={toggleFullscreen}
        className="absolute inset-0 z-10 cursor-[inherit] focus:outline-none"
      />

      {/* Status overlays */}
      {spinner && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <Loader2 className="size-12 animate-spin text-white/80" aria-label="Loading" />
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/80 p-6 text-center">
          <div>
            <p className="font-display text-2xl font-bold">Video unavailable</p>
            <p className="mt-2 text-sm text-muted">
              No playable source was found. Add <code>public/videos/sample.mp4</code> as a local fallback.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-md bg-white px-5 py-2 text-sm font-semibold text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {ready && !snap.playing && !snap.waiting && !failed && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-black/50 ring-1 ring-white/30 backdrop-blur-md sm:size-20">
            {snap.ended ? (
              <RotateCcw className="size-8" aria-hidden />
            ) : (
              <Play className="size-8 translate-x-0.5 fill-white" aria-hidden />
            )}
          </span>
        </div>
      )}

      {/* Top bar */}
      <div
        className={clsx(
          "absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 bg-linear-to-b from-black/80 to-transparent p-3 transition-opacity duration-300 sm:p-5",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {variant === "page" && (
          <IconButton label="Back" onClick={onClose} className="-ml-1 shrink-0">
            <ArrowLeft className="size-7" aria-hidden />
          </IconButton>
        )}
        <div className={clsx("min-w-0", variant === "page" && "mr-auto")}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 sm:text-xs">
            {eyebrow ?? "Trailer"} · {source ? (sourceLabel ?? SOURCE_LABEL[source.kind]) : "Loading…"}
          </p>
          <h2 className="truncate font-display text-lg font-bold sm:text-2xl">
            {movie.title}{" "}
            {subtitle ? (
              <span className="font-sans text-sm font-normal text-white/70">{subtitle}</span>
            ) : (
              <span className="font-sans text-sm font-normal text-white/60">({releaseYear(movie)})</span>
            )}
          </h2>
        </div>
        {variant === "modal" && (
          <IconButton label="Close player" onClick={onClose} className="shrink-0 bg-black/40">
            <X className="size-6" aria-hidden />
          </IconButton>
        )}
      </div>

      {/* Bottom controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-black/90 via-black/50 to-transparent px-3 pb-2 pt-10 transition-opacity duration-300 sm:px-5 sm:pb-4",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ProgressBar
          current={snap.current}
          duration={snap.duration}
          buffered={snap.buffered}
          onSeek={(s) => apiRef.current?.seek(s)}
        />
        <div className="mt-1 flex items-center gap-0.5 sm:gap-1">
          <IconButton label={snap.playing ? "Pause (k)" : "Play (k)"} onClick={togglePlay}>
            {snap.playing ? (
              <Pause className="size-6 fill-white" aria-hidden />
            ) : (
              <Play className="size-6 fill-white" aria-hidden />
            )}
          </IconButton>
          <IconButton label="Back 10 seconds" onClick={() => seekBy(-SEEK_STEP)}>
            <RotateCcw className="size-5" aria-hidden />
          </IconButton>
          <IconButton label="Forward 10 seconds" onClick={() => seekBy(SEEK_STEP)}>
            <RotateCw className="size-5" aria-hidden />
          </IconButton>

          <div className="group/vol flex items-center">
            <IconButton label={snap.muted ? "Unmute (m)" : "Mute (m)"} onClick={toggleMute}>
              <VolumeIcon className="size-5" aria-hidden />
            </IconButton>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={effectiveVolume}
              aria-label="Volume"
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ "--fill": `${effectiveVolume * 100}%` } as React.CSSProperties}
              className="range-brand hidden w-0 opacity-0 transition-all duration-300 group-hover/vol:w-20 group-hover/vol:opacity-100 focus:w-20 focus:opacity-100 sm:block"
            />
          </div>

          <span className="ml-2 text-xs tabular-nums text-white/80 sm:text-sm">
            {formatTime(snap.current)} <span className="text-white/40">/ {formatTime(snap.duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">{controls}</div>
          <IconButton label={fullscreen ? "Exit full screen (f)" : "Full screen (f)"} onClick={toggleFullscreen}>
            {fullscreen ? <Minimize className="size-5" aria-hidden /> : <Maximize className="size-5" aria-hidden />}
          </IconButton>
        </div>
      </div>

      {children}
    </div>
  );
}
