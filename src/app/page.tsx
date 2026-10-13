"use client";

import { Film } from "lucide-react";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroBanner from "@/components/HeroBanner";
import { MovieRowView } from "@/components/MovieRow";
import { RowSkeleton } from "@/components/Skeleton";
import SpoolRow from "@/components/SpoolRow";
import { getCatalog, type CatalogMovie } from "@/lib/catalog";
import { getGenres } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";
import type { Genre } from "@/lib/types";

/** A genre row only makes sense once a genre has a few movies in it. */
const MIN_PER_GENRE_ROW = 2;

function genreRows(movies: CatalogMovie[], genres: Genre[]) {
  return genres
    .map((g) => ({ genre: g, movies: movies.filter((m) => m.genreIds.includes(g.id)) }))
    .filter((row) => row.movies.length >= MIN_PER_GENRE_ROW)
    .sort((a, b) => b.movies.length - a.movies.length);
}

export default function HomePage() {
  // Everything here comes from the catalogue: movies uploaded to Spool, with TMDB details.
  const catalog = useAsync("catalog", getCatalog);
  const genres = useAsync("genres:movie", () => getGenres("movie"));
  const movies = catalog.data ?? [];

  return (
    <>
      <ErrorBoundary fallbackMessage="The featured banner failed to load.">
        <HeroBanner movies={movies} loading={catalog.loading} />
      </ErrorBoundary>

      <div className="relative z-10 -mt-16 space-y-6 pb-8 sm:-mt-24 md:space-y-10">
        <ErrorBoundary>
          <ContinueWatchingRow />
        </ErrorBoundary>

        {catalog.loading ? (
          <RowSkeleton />
        ) : movies.length === 0 ? (
          <section className="gutter">
            <div className="flex max-w-xl flex-col items-start gap-3 rounded-2xl border border-line bg-surface/60 p-8">
              <span className="bg-gradient-brand grid size-12 place-items-center rounded-full">
                <Film className="size-6" aria-hidden />
              </span>
              <h1 className="font-display text-3xl font-bold">No movies yet</h1>
              <p className="text-muted">
                Movies appear here as soon as they&apos;re uploaded to Spool and linked to their TMDB entry.
              </p>
            </div>
          </section>
        ) : (
          <>
            <ErrorBoundary>
              <MovieRowView title="Now Streaming" eyebrow="Full Movies" href="/movies" movies={movies} />
            </ErrorBoundary>
            {genreRows(movies, genres.data ?? []).map(({ genre, movies: inGenre }) => (
              <ErrorBoundary key={genre.id}>
                <MovieRowView title={genre.name} href={`/movies?genre=${genre.id}`} movies={inGenre} />
              </ErrorBoundary>
            ))}
          </>
        )}

        <ErrorBoundary>
          <SpoolRow />
        </ErrorBoundary>
      </div>
    </>
  );
}
