"use client";

import { Check, Clock, Film, Play, Plus, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ErrorState } from "@/components/ErrorBoundary";
import EpisodeList from "@/components/EpisodeList";
import MovieGrid from "@/components/MovieGrid";
import { RowHeader, RowScroller } from "@/components/MovieRow";
import { HeroSkeleton, Skeleton } from "@/components/Skeleton";
import { formatRuntime } from "@/lib/format";
import {
  backdropUrl,
  episodeLabel,
  posterUrl,
  profileUrl,
  releaseYear,
  watchHref,
} from "@/lib/tmdb";
import { getCatalog } from "@/lib/catalog";
import { useAsync } from "@/lib/useAsync";
import type { CastMember, MediaType, MovieDetails } from "@/lib/types";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useInWatchlist, useProgressFor, useWatchStore } from "@/store/useWatchStore";

function CastCard({ person }: { person: CastMember }) {
  const photo = profileUrl(person.profilePath);
  return (
    <div role="listitem" className="w-24 shrink-0 snap-start text-center sm:w-28">
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-white/10">
        {photo ? (
          <Image src={photo} alt="" fill sizes="112px" className="object-cover" />
        ) : (
          <User className="absolute inset-0 m-auto size-10 text-white/30" aria-hidden />
        )}
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium">{person.name}</p>
      <p className="line-clamp-1 text-xs text-muted">{person.character}</p>
    </div>
  );
}

function PrimaryActions({ title }: { title: MovieDetails }) {
  const openTrailer = usePlayerStore((s) => s.open);
  const toggleWatchlist = useWatchStore((s) => s.toggleWatchlist);
  const inList = useInWatchlist(title);
  const progress = useProgressFor(title);

  // Every title on MSW is a movie uploaded to Spool, so Play always plays the full movie.
  const resumeLabel = progress
    ? progress.episode
      ? `Resume ${episodeLabel(progress.episode)}`
      : "Resume"
    : title.mediaType === "tv"
      ? "Play S1:E1"
      : "Play";
  const href = progress
    ? watchHref(title, { episode: progress.episode, startAt: progress.position })
    : watchHref(title);

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-md bg-brand-red px-7 py-3 font-semibold shadow-lg shadow-brand-red/30 transition hover:bg-brand-red-dark"
      >
        <Play className="size-5 fill-current" aria-hidden /> {resumeLabel}
      </Link>
      <button
        type="button"
        onClick={() => openTrailer(title)}
        className="inline-flex items-center gap-2 rounded-md bg-white/15 px-6 py-3 font-semibold backdrop-blur-md transition hover:bg-white/25"
      >
        <Film className="size-5" aria-hidden /> Trailer
      </button>
      <button
        type="button"
        onClick={() => toggleWatchlist(title)}
        aria-pressed={inList}
        aria-label={inList ? "Remove from My List" : "Add to My List"}
        title={inList ? "Remove from My List" : "Add to My List"}
        className="grid size-12 place-items-center rounded-full border border-white/40 bg-black/30 backdrop-blur-md transition hover:border-white"
      >
        {inList ? <Check className="size-5" aria-hidden /> : <Plus className="size-5" aria-hidden />}
      </button>
      {progress && (
        <div className="basis-full">
          <div className="h-1 max-w-xs overflow-hidden rounded-full bg-white/15">
            <div
              className="bg-gradient-brand h-full"
              style={{ width: `${Math.min(100, (progress.position / progress.duration) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailsHero({ title }: { title: MovieDetails }) {
  const runtime = formatRuntime(title.runtime);
  const poster = posterUrl(title.posterPath, "w500");
  const isTv = title.mediaType === "tv";

  return (
    <section className="relative min-h-[80svh] w-full overflow-hidden">
      <Image
        src={backdropUrl(title.backdropPath, "original")}
        alt=""
        fill
        priority
        sizes="100vw"
        unoptimized={!title.backdropPath}
        className="object-cover object-top opacity-60"
      />
      <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/80 to-ink/20" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(42,92,255,0.25),transparent_55%)]" />

      <div className="gutter relative flex min-h-[80svh] items-end gap-10 pb-12 pt-28">
        <div className="relative hidden aspect-2/3 w-64 shrink-0 overflow-hidden rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10 md:block lg:w-72">
          <Image
            src={poster}
            alt={`${title.title} poster`}
            fill
            sizes="288px"
            unoptimized={!title.posterPath}
            className="object-cover"
          />
        </div>

        <div className="max-w-3xl animate-rise">
          {isTv && (
            <p className="text-gradient-brand mb-2 text-xs font-bold uppercase tracking-[0.25em]">Series</p>
          )}
          <h1 className="font-display text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">{title.title}</h1>
          {title.tagline && <p className="mt-2 text-lg italic text-white/70">“{title.tagline}”</p>}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            {title.voteAverage > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-white">
                <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                {title.voteAverage.toFixed(1)}
                <span className="font-normal text-white/50">({title.voteCount.toLocaleString()})</span>
              </span>
            )}
            <span>{releaseYear(title)}</span>
            {isTv && title.seasons.length > 0 && (
              <span>
                {title.seasons.length} {title.seasons.length === 1 ? "Season" : "Seasons"}
              </span>
            )}
            {runtime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" aria-hidden /> {runtime}
                {isTv && <span className="text-white/50">/ ep</span>}
              </span>
            )}
            <span className="rounded border border-white/40 px-1.5 text-[11px] font-semibold">HD</span>
            <span className="uppercase text-white/50">{title.originalLanguage}</span>
          </div>

          {title.genres.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {title.genres.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/${isTv ? "tv" : "movies"}?genre=${g.id}`}
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium transition hover:border-brand-violet hover:bg-brand-violet/20"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-5 max-w-2xl leading-relaxed text-white/85">{title.overview}</p>

          <PrimaryActions title={title} />
        </div>
      </div>
    </section>
  );
}

function Episodes({ show }: { show: MovieDetails }) {
  const progress = useProgressFor(show);
  const [season, setSeason] = useState<number | null>(null);
  const activeSeason = season ?? progress?.episode?.season ?? show.seasons[0]?.seasonNumber ?? 1;

  if (show.seasons.length === 0) return null;
  return (
    <section aria-label="Episodes" className="gutter mt-6">
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Episodes</h2>
      <div className="max-w-4xl">
        <EpisodeList
          show={show}
          seasons={show.seasons}
          season={activeSeason}
          onSeasonChange={setSeason}
          current={progress?.episode}
        />
      </div>
    </section>
  );
}

export default function TitleDetails({ mediaType, id }: { mediaType: MediaType; id: number }) {
  const valid = Number.isInteger(id) && mediaType === "movie";
  // Only movies in the catalogue (uploaded to Spool) have a page; anything else isn't on MSW.
  const { data: catalog, error, loading, retry } = useAsync(valid ? "catalog" : null, getCatalog);
  const title = catalog?.find((m) => m.id === id);

  if (!valid || error || (catalog && !title)) {
    return (
      <div className="gutter mx-auto max-w-xl pt-32">
        <ErrorState
          message={error ? "We couldn't load this title." : "This title isn't available on MSW."}
          onRetry={error ? retry : undefined}
        />
      </div>
    );
  }

  if (loading || !title) {
    return (
      <>
        <HeroSkeleton />
        <div className="gutter mt-8 flex gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="size-24 shrink-0 rounded-full" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <DetailsHero title={title} />

      {title.mediaType === "tv" && <Episodes show={title} />}

      {title.cast.length > 0 && (
        <section aria-label="Cast" className="mt-10">
          <RowHeader title="Top Cast" />
          <RowScroller label="Cast">
            {title.cast.map((person) => (
              <CastCard key={`${person.id}-${person.character}`} person={person} />
            ))}
          </RowScroller>
        </section>
      )}

      {(() => {
        // "More like this" = other movies ON MSW sharing a genre (not TMDB's suggestions).
        const others = (catalog ?? []).filter((m) => m.id !== title.id && m.genreIds.some((g) => title.genreIds.includes(g)));
        return others.length > 0 ? (
          <section aria-label="More like this" className="gutter mt-10">
            <h2 className="mb-4 text-xl font-semibold sm:text-2xl">More Like This</h2>
            <MovieGrid movies={others} />
          </section>
        ) : null;
      })()}
    </>
  );
}
