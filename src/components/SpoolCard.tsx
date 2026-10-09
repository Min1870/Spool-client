"use client";

import clsx from "clsx";
import { Play } from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/lib/format";
import { spoolWatchHref, type SpoolVideo } from "@/lib/spool";

/**
 * A creator upload from Spool. Landscape (16:9) because Spool thumbnails are video
 * frames, not movie posters. Clicking plays it in MSW's own player.
 */
export default function SpoolCard({ video, className }: { video: SpoolVideo; className?: string }) {
  return (
    <Link
      href={spoolWatchHref(video.id)}
      aria-label={`Play ${video.title}`}
      className={clsx(
        "group/card relative block aspect-video w-full overflow-hidden rounded-md bg-surface ring-1 ring-white/5",
        "transition duration-300 ease-out md:hover:z-20 md:hover:scale-[1.05] md:hover:shadow-2xl md:hover:shadow-black/70 md:hover:ring-brand-violet/60",
        className,
      )}
    >
      {video.thumbnailUrl ? (
        // A plain <img>: thumbnails come from Spool's storage, whose host depends on the
        // environment (Garage locally, R2 in production), so next/image's allow-list doesn't fit.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={video.thumbnailUrl} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="shimmer absolute inset-0" />
      )}

      <span className="bg-gradient-brand pointer-events-none absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
        Spool
      </span>
      {video.duration != null && (
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums">
          {formatTime(video.duration)}
        </span>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-black opacity-0 transition group-hover/card:opacity-100 group-focus-visible/card:opacity-100">
          <Play className="size-4 translate-x-px fill-current" aria-hidden />
        </span>
        <h3 className="line-clamp-1 pr-12 text-sm font-semibold">{video.title}</h3>
      </div>
    </Link>
  );
}
