"use client";

import clsx from "clsx";
import { ChevronDown, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatRuntime } from "@/lib/format";
import { backdropUrl, getSeasonEpisodes, watchHref } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";
import type { EpisodeRef, Movie, SeasonSummary } from "@/lib/types";
import { ErrorState } from "./ErrorBoundary";
import { Skeleton } from "./Skeleton";

/** Episodes rendered per "page"; some daily soaps have thousands per season. */
const EPISODES_PER_PAGE = 24;

interface EpisodeListProps {
  show: Movie;
  seasons: SeasonSummary[];
  season: number;
  onSeasonChange: (season: number) => void;
  /** Highlights the episode currently playing. */
  current?: EpisodeRef;
  /** Compact layout for the watch-page drawer. */
  compact?: boolean;
  /** Use router.replace semantics (watch page) instead of pushing history. */
  replace?: boolean;
}

export function SeasonSelect({
  seasons,
  season,
  onChange,
}: {
  seasons: SeasonSummary[];
  season: number;
  onChange: (season: number) => void;
}) {
  if (seasons.length <= 1) {
    return <p className="text-lg font-semibold">{seasons[0]?.name ?? `Season ${season}`}</p>;
  }
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Season</span>
      <select
        value={season}
        onChange={(e) => onChange(Number(e.target.value))}
        className="appearance-none rounded-md border border-white/20 bg-surface-2 py-2 pl-4 pr-10 text-sm font-semibold outline-none transition hover:border-white/40 focus:border-brand-violet"
      >
        {seasons.map((s) => (
          <option key={s.seasonNumber} value={s.seasonNumber}>
            {s.name} ({s.episodeCount} ep)
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-white/60" aria-hidden />
    </label>
  );
}

export default function EpisodeList({
  show,
  seasons,
  season,
  onSeasonChange,
  current,
  compact,
  replace,
}: EpisodeListProps) {
  const { data: episodes, error, loading, retry } = useAsync(`season:${show.id}:${season}`, () =>
    getSeasonEpisodes(show.id, season),
  );

  // Always include the playing episode; the count resets when the season changes.
  const baseCount = Math.max(EPISODES_PER_PAGE, current?.season === season ? current.episode + 5 : 0);
  const [extra, setExtra] = useState({ season, count: 0 });
  const visibleCount = baseCount + (extra.season === season ? extra.count : 0);
  const total = episodes?.length ?? 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <SeasonSelect seasons={seasons} season={season} onChange={onSeasonChange} />
        {!compact && episodes && <span className="text-sm text-muted">{episodes.length} episodes</span>}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className={compact ? "h-20" : "h-28"} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : (
        <ol className="divide-y divide-line">
          {(episodes ?? []).slice(0, visibleCount).map((ep) => {
            const ref = { season: ep.seasonNumber, episode: ep.episodeNumber };
            const isCurrent = current?.season === ref.season && current.episode === ref.episode;
            const runtime = formatRuntime(ep.runtime);
            return (
              <li key={ep.id}>
                <Link
                  href={watchHref(show, { episode: ref })}
                  replace={replace}
                  aria-current={isCurrent ? "true" : undefined}
                  className={clsx(
                    "group/ep flex gap-3 rounded-lg p-2 transition sm:gap-4",
                    isCurrent ? "bg-brand-violet/20 ring-1 ring-brand-violet/50" : "hover:bg-white/5",
                  )}
                >
                  {!compact && (
                    <span className="hidden w-8 shrink-0 self-center text-center text-xl font-semibold text-white/50 sm:block">
                      {ep.episodeNumber}
                    </span>
                  )}
                  <span
                    className={clsx(
                      "relative aspect-video shrink-0 overflow-hidden rounded-md bg-surface-2",
                      compact ? "w-28" : "w-32 sm:w-44",
                    )}
                  >
                    <Image
                      src={backdropUrl(ep.stillPath ?? show.backdropPath, "w300")}
                      alt=""
                      fill
                      sizes="176px"
                      unoptimized={!(ep.stillPath ?? show.backdropPath)}
                      className="object-cover"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover/ep:opacity-100">
                      <Play className="size-7 fill-white" aria-hidden />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="line-clamp-1 text-sm font-semibold sm:text-base">
                        {compact && `${ep.episodeNumber}. `}
                        {ep.name}
                      </span>
                      {runtime && <span className="shrink-0 text-xs text-muted">{runtime}</span>}
                    </span>
                    <span
                      className={clsx(
                        "mt-1 text-xs leading-relaxed text-white/60 sm:text-sm",
                        compact ? "line-clamp-2" : "line-clamp-3",
                      )}
                    >
                      {ep.overview || "No description available."}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      {!loading && !error && visibleCount < total && (
        <button
          type="button"
          onClick={() =>
            setExtra((prev) => ({
              season,
              count: (prev.season === season ? prev.count : 0) + EPISODES_PER_PAGE,
            }))
          }
          className="mt-4 w-full rounded-lg border border-white/15 bg-white/5 py-3 text-sm font-semibold transition hover:border-brand-violet hover:bg-brand-violet/15"
        >
          Show more episodes ({(total - visibleCount).toLocaleString()} more)
        </button>
      )}
    </div>
  );
}
