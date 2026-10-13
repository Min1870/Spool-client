"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MovieGrid from "@/components/MovieGrid";
import { GridSkeleton } from "@/components/Skeleton";
import { getCatalog, type CatalogMovie } from "@/lib/catalog";
import { useAsync } from "@/lib/useAsync";

type Sort = "added" | "top_rated" | "title";

const SORTS: { value: Sort; label: string }[] = [
  { value: "added", label: "Recently Added" },
  { value: "top_rated", label: "Top Rated" },
  { value: "title", label: "A–Z" },
];

function sortMovies(movies: CatalogMovie[], sort: Sort) {
  const list = [...movies]; // the catalogue is already newest-upload first
  if (sort === "top_rated") list.sort((a, b) => b.voteAverage - a.voteAverage);
  if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
  return list;
}

/** Every movie on MSW (= uploaded to Spool), filterable by genre. */
function MoviesBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const genreId = Number(params.get("genre")) || null;
  const sort = (SORTS.some((s) => s.value === params.get("sort")) ? params.get("sort") : "added") as Sort;

  const { data, loading } = useAsync("catalog", getCatalog);
  const movies = data ?? [];

  // Genre chips: only genres that at least one of OUR movies has.
  const genres = [...new Map(movies.flatMap((m) => m.genres).map((g) => [g.id, g])).values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const shown = sortMovies(
    genreId ? movies.filter((m) => m.genreIds.includes(genreId)) : movies,
    sort,
  );

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const chip = (id: number | null, label: string) => (
    <button
      key={id ?? "all"}
      type="button"
      aria-pressed={genreId === id}
      onClick={() => setParam("genre", id ? String(id) : null)}
      className={clsx(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition",
        genreId === id
          ? "bg-gradient-brand border-transparent text-white shadow-lg shadow-brand-violet/30"
          : "border-white/15 bg-white/5 text-white/75 hover:border-white/40 hover:text-white",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="gutter pt-24 pb-16 lg:pt-28">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-gradient-brand text-xs font-bold uppercase tracking-[0.25em]">Full Movies</p>
          <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Movies</h1>
          {!loading && (
            <p className="mt-2 text-sm text-muted">
              {movies.length} {movies.length === 1 ? "movie" : "movies"} streaming now
            </p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Sort
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "added" ? null : e.target.value)}
            className="rounded-md border border-white/15 bg-surface px-3 py-2 text-white"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {genres.length > 1 && (
        <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {chip(null, "All")}
          {genres.map((g) => chip(g.id, g.name))}
        </div>
      )}

      {!loading && shown.length === 0 ? (
        <p className="py-16 text-center text-muted">
          {movies.length === 0 ? "No movies yet. They appear here once uploaded to Spool." : "No movies in this genre yet."}
        </p>
      ) : (
        <MovieGrid movies={shown} loading={loading} />
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="gutter pt-28">
          <GridSkeleton />
        </div>
      }
    >
      <MoviesBrowser />
    </Suspense>
  );
}
