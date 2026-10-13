"use client";

import { Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCatalogIds } from "@/lib/catalog";
import { formatTime } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { backdropUrl, episodeLabel, mediaKey, watchHref } from "@/lib/tmdb";
import { sortContinueWatching, useWatchStore } from "@/store/useWatchStore";
import { RowHeader, RowScroller } from "./MovieRow";

export default function ContinueWatchingRow({ title = "Continue Watching" }: { title?: string }) {
  const progress = useWatchStore((s) => s.progress);
  const removeProgress = useWatchStore((s) => s.removeProgress);
  // Only titles that are still on MSW (uploaded to Spool); older saved progress for other
  // titles (e.g. trailers watched before) is hidden.
  const { data: onMsw } = useAsync("catalog:ids", getCatalogIds);
  const items = sortContinueWatching(progress).filter((p) => p.movie.mediaType === "movie" && onMsw?.has(p.movie.id));

  if (items.length === 0) return null;

  return (
    <section aria-label={title}>
      <RowHeader title={title} />
      <RowScroller label={title}>
        {items.map(({ movie, episode, position, duration }) => {
          const key = mediaKey(movie);
          const percent = Math.min(100, (position / duration) * 100);
          return (
            <div
              key={key}
              role="listitem"
              className="group/cw relative w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[32%] lg:w-[24%] xl:w-[20%]"
            >
              <Link
                href={watchHref(movie, { episode, startAt: position })}
                aria-label={`Resume ${movie.title}${episode ? ` ${episodeLabel(episode)}` : ""}`}
                className="relative block aspect-video w-full overflow-hidden rounded-t-md bg-surface"
              >
                <Image
                  src={backdropUrl(movie.backdropPath, "w780")}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 24vw, (min-width: 768px) 32vw, (min-width: 640px) 44vw, 72vw"
                  unoptimized={!movie.backdropPath}
                  className="object-cover transition duration-500 group-hover/cw:scale-105"
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-12 place-items-center rounded-full border-2 border-white/80 bg-black/40 backdrop-blur-sm transition group-hover/cw:scale-110 group-hover/cw:border-white">
                    <Play className="size-5 translate-x-0.5 fill-white" aria-hidden />
                  </span>
                </span>
                <span className="absolute inset-x-3 bottom-2 flex items-end justify-between gap-2 text-left">
                  <span className="min-w-0">
                    <span className="line-clamp-1 text-sm font-semibold">{movie.title}</span>
                    {episode && (
                      <span className="line-clamp-1 text-[11px] text-white/70">
                        {episodeLabel(episode)}
                        {episode.name && ` · ${episode.name}`}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-[11px] text-white/70">{formatTime(duration - position)} left</span>
                </span>
              </Link>
              <div className="h-1 overflow-hidden rounded-b-md bg-white/15">
                <div className="bg-gradient-brand h-full" style={{ width: `${percent}%` }} />
              </div>
              <button
                type="button"
                aria-label={`Remove ${movie.title} from Continue Watching`}
                onClick={() => removeProgress(key)}
                className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/60 opacity-100 transition hover:bg-black md:opacity-0 md:group-hover/cw:opacity-100"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          );
        })}
      </RowScroller>
    </section>
  );
}
