"use client";

import clsx from "clsx";
import { Check, Info, Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mockGenres, mockTvGenres } from "@/lib/mockData";
import { backdropUrl, detailHref, mediaKey, releaseYear, watchHref } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useInWatchlist, useWatchStore } from "@/store/useWatchStore";
import { HeroSkeleton } from "./Skeleton";

const genreName = new Map([...mockGenres, ...mockTvGenres].map((g) => [g.id, g.name]));

interface HeroBannerProps {
  movies: Movie[] | undefined;
  loading?: boolean;
}

function HeroActions({ movie }: { movie: Movie }) {
  const toggleWatchlist = useWatchStore((s) => s.toggleWatchlist);
  const inList = useInWatchlist(movie);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <Link
        href={watchHref(movie)}
        className="inline-flex items-center gap-2 rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold shadow-lg shadow-brand-red/30 transition hover:bg-brand-red-dark sm:px-7 sm:py-3 sm:text-base"
      >
        <Play className="size-5 fill-current" aria-hidden /> Play
      </Link>
      <Link
        href={detailHref(movie)}
        className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/25 sm:px-7 sm:py-3 sm:text-base"
      >
        <Info className="size-5" aria-hidden /> More Info
      </Link>
      <button
        type="button"
        onClick={() => toggleWatchlist(movie)}
        aria-label={inList ? "Remove from My List" : "Add to My List"}
        title={inList ? "Remove from My List" : "Add to My List"}
        className="grid size-11 place-items-center rounded-full border border-white/40 bg-black/30 backdrop-blur-md transition hover:border-white sm:size-12"
      >
        {inList ? <Check className="size-5" aria-hidden /> : <Plus className="size-5" aria-hidden />}
      </button>
    </div>
  );
}

export default function HeroBanner({ movies, loading }: HeroBannerProps) {
  const featured = (movies ?? []).filter((m) => m.backdropPath && m.overview).slice(0, 6);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const playerOpen = usePlayerStore((s) => s.isOpen);
  const count = featured.length;

  if (loading) return <HeroSkeleton />;
  // Nothing with a backdrop to feature: keep the space under the navbar, show no banner.
  if (count === 0) return <div aria-hidden className="h-40 sm:h-48" />;

  const index = active % count;
  const movie = featured[index];
  const genres = movie.genreIds.map((id) => genreName.get(id)).filter(Boolean).slice(0, 3);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured movies"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[78svh] min-h-[480px] w-full overflow-hidden md:h-[88vh] md:min-h-[560px]"
    >
      {/* Backdrops (cross-fade) */}
      {featured.map((m, i) => (
        <div
          key={mediaKey(m)}
          aria-hidden={i !== index}
          className={clsx(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={backdropUrl(m.backdropPath, "original")}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={clsx(
              "object-cover object-[center_20%] transition-transform duration-[10000ms] ease-linear",
              i === index ? "scale-105" : "scale-100",
            )}
          />
        </div>
      ))}

      {/* Netflix-style side + bottom fades, HBO-style violet glow */}
      <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/70 to-transparent md:via-ink/40 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink via-ink/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(123,47,247,0.35),transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/70 to-transparent" />

      {/* Content */}
      <div className="gutter absolute inset-x-0 bottom-[16%] md:bottom-[22%]">
        <div key={mediaKey(movie)} className="max-w-2xl animate-rise">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
            <span className="bg-gradient-brand rounded px-1.5 py-0.5 text-[10px] tracking-widest text-white">
              {index === 0 ? "New" : "Now"}
            </span>
            {/* Featured = the newest uploads on MSW, not TMDB's trending list. */}
            {index === 0 ? "Just Added" : "Now Streaming"}
          </p>
          <h1 className="font-display text-4xl leading-[1.05] font-bold drop-shadow-xl sm:text-5xl lg:text-6xl xl:text-7xl">
            {movie.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
            {movie.voteAverage > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-white">
                <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                {movie.voteAverage.toFixed(1)}
              </span>
            )}
            <span>{releaseYear(movie)}</span>
            <span className="rounded border border-white/40 px-1.5 text-[11px] font-semibold">HD</span>
            {genres.length > 0 && <span className="hidden sm:inline">{genres.join(" • ")}</span>}
          </div>
          <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/85 drop-shadow sm:text-base">
            {movie.overview}
          </p>
          <div className="mt-6">
            <HeroActions movie={movie} />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {count > 1 && (
        <div className="gutter absolute right-0 top-20 flex gap-1.5 sm:top-auto sm:bottom-[10%] md:bottom-[14%]">
          {featured.map((m, i) => (
            <button
              key={mediaKey(m)}
              type="button"
              aria-label={`Show ${m.title}`}
              aria-current={i === index}
              onClick={() => setActive(i)}
              className="relative h-1 w-6 overflow-hidden rounded-full bg-white/25 transition-all hover:bg-white/50 sm:w-10"
            >
              {i === index && (
                // The progress animation doubles as the rotation timer.
                <span
                  key={mediaKey(m)}
                  onAnimationEnd={() => setActive((index + 1) % count)}
                  className={clsx(
                    "bg-gradient-brand animate-hero-progress absolute inset-y-0 left-0 w-full origin-left",
                    (paused || playerOpen) && "[animation-play-state:paused]",
                  )}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
