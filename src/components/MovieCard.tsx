"use client";

import clsx from "clsx";
import { Check, ChevronDown, Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { detailHref, posterUrl, releaseYear, watchHref } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";
import { useInWatchlist, useWatchStore } from "@/store/useWatchStore";

interface MovieCardProps {
  movie: Movie;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export const ROW_CARD_SIZES =
  "(min-width: 1280px) 15vw, (min-width: 1024px) 18vw, (min-width: 768px) 22vw, (min-width: 640px) 28vw, 40vw";

export function RatingBadge({ rating, className }: { rating: number; className?: string }) {
  if (!rating) return null;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm",
        className,
      )}
    >
      <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
      {rating.toFixed(1)}
    </span>
  );
}

export function QuickActionButton({
  label,
  onClick,
  children,
  primary,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={clsx(
        "grid size-8 place-items-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-brand-violet",
        primary
          ? "border-white bg-white text-black hover:bg-white/85"
          : "border-white/50 bg-black/40 text-white hover:border-white",
      )}
    >
      {children}
    </button>
  );
}

export default function MovieCard({ movie, sizes = ROW_CARD_SIZES, priority, className }: MovieCardProps) {
  const router = useRouter();
  const toggleWatchlist = useWatchStore((s) => s.toggleWatchlist);
  const inList = useInWatchlist(movie);
  const href = detailHref(movie);
  const src = posterUrl(movie.posterPath);

  return (
    <article
      className={clsx(
        "group/card relative aspect-2/3 w-full overflow-hidden rounded-md bg-surface ring-1 ring-white/5",
        "transition duration-300 ease-out md:hover:z-20 md:hover:scale-[1.07] md:hover:shadow-2xl md:hover:shadow-black/70 md:hover:ring-brand-violet/60",
        className,
      )}
    >
      <Link href={href} className="absolute inset-0 z-0" aria-label={movie.title}>
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={src.startsWith("/")}
          className="object-cover"
        />
      </Link>

      <RatingBadge rating={movie.voteAverage} className="pointer-events-none absolute left-2 top-2" />
      {movie.mediaType === "tv" && (
        <span className="bg-gradient-brand pointer-events-none absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          Series
        </span>
      )}

      {/* Hover panel (pointer devices only) */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black via-black/85 to-transparent p-3 pt-12",
          "opacity-0 transition duration-300 md:group-hover/card:pointer-events-auto md:group-hover/card:opacity-100",
          "md:group-focus-within/card:pointer-events-auto md:group-focus-within/card:opacity-100",
        )}
      >
        <div className="mb-2 flex items-center gap-1.5">
          <QuickActionButton label={`Play ${movie.title}`} onClick={() => router.push(watchHref(movie))} primary>
            <Play className="size-4 translate-x-px fill-current" aria-hidden />
          </QuickActionButton>
          <QuickActionButton
            label={inList ? "Remove from My List" : "Add to My List"}
            onClick={() => toggleWatchlist(movie)}
          >
            {inList ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          </QuickActionButton>
          <Link
            href={href}
            aria-label="More info"
            title="More info"
            className="ml-auto grid size-8 place-items-center rounded-full border border-white/50 bg-black/40 transition hover:border-white"
          >
            <ChevronDown className="size-4" aria-hidden />
          </Link>
        </div>
        <h3 className="line-clamp-1 text-sm font-semibold">{movie.title}</h3>
        <p className="text-xs text-white/60">{releaseYear(movie)}</p>
      </div>
    </article>
  );
}
