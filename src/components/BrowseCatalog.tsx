"use client";

import clsx from "clsx";
import { ChevronDown, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorState } from "@/components/ErrorBoundary";
import MovieGrid from "@/components/MovieGrid";
import { GridSkeleton, Skeleton } from "@/components/Skeleton";
import { sortOptions } from "@/lib/siteConfig";
import { discover, getGenres } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";
import type { MediaType, Movie, SortOption } from "@/lib/types";

function GenreChips({
  mediaType,
  active,
  onSelect,
}: {
  mediaType: MediaType;
  active: number | null;
  onSelect: (id: number | null) => void;
}) {
  const { data: genres, loading } = useAsync(`genres:${mediaType}`, () => getGenres(mediaType));

  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  const chip = (id: number | null, label: string) => (
    <button
      key={id ?? "all"}
      type="button"
      aria-pressed={active === id}
      onClick={() => onSelect(id)}
      className={clsx(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition",
        active === id
          ? "bg-gradient-brand border-transparent text-white shadow-lg shadow-brand-violet/30"
          : "border-white/15 bg-white/5 text-white/75 hover:border-white/40 hover:text-white",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {chip(null, "All")}
      {(genres ?? []).map((g) => chip(g.id, g.name))}
    </div>
  );
}

function Browser({ mediaType }: { mediaType: MediaType }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const genreId = Number(params.get("genre")) || null;
  const sort: SortOption = sortOptions.find((o) => o.value === params.get("sort"))?.value ?? "popular";
  const query = `${mediaType}|${genreId ?? "all"}|${sort}`;

  const { data: genres } = useAsync(`genres:${mediaType}`, () => getGenres(mediaType));
  const first = useAsync(`discover:${query}`, () => discover({ mediaType, genreId, sort, page: 1 }));

  // Extra pages appended by "Load more"; tagged with the query they belong to.
  const [more, setMore] = useState<{ query: string; movies: Movie[]; page: number; loading: boolean }>({
    query: "",
    movies: [],
    page: 1,
    loading: false,
  });
  const extra = more.query === query ? more : null;
  const page = extra?.page ?? 1;
  const totalPages = first.data?.totalPages ?? 1;

  const seen = new Set<number>();
  const movies = [...(first.data?.results ?? []), ...(extra?.movies ?? [])].filter(
    (m) => !seen.has(m.id) && seen.add(m.id),
  );

  const updateParam = (name: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setMore({ query, movies: extra?.movies ?? [], page, loading: true });
    try {
      const res = await discover({ mediaType, genreId, sort, page: nextPage });
      setMore((prev) =>
        prev.query === query
          ? { query, movies: [...prev.movies, ...res.results], page: nextPage, loading: false }
          : prev,
      );
    } catch {
      setMore((prev) => ({ ...prev, loading: false }));
    }
  };

  const genreName = genres?.find((g) => g.id === genreId)?.name;

  return (
    <div className="gutter pt-24 lg:pt-28">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-gradient-brand text-xs font-bold uppercase tracking-[0.25em]">Browse</p>
          <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">{genreName ?? (mediaType === "tv" ? "All Series" : "All Movies")}</h1>
        </div>
        <label className="relative inline-flex items-center self-start sm:self-auto">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value === "popular" ? null : e.target.value)}
            className="appearance-none rounded-md border border-white/20 bg-surface py-2 pl-4 pr-10 text-sm font-medium outline-none transition hover:border-white/40 focus:border-brand-violet"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4 text-white/60" aria-hidden />
        </label>
      </header>

      <div className="mb-8">
        <GenreChips mediaType={mediaType} active={genreId} onSelect={(id) => updateParam("genre", id ? String(id) : null)} />
      </div>

      {first.error ? (
        <ErrorState onRetry={first.retry} />
      ) : !first.loading && movies.length === 0 ? (
        <p className="py-20 text-center text-muted">Nothing found for this filter.</p>
      ) : (
        <MovieGrid movies={movies} loading={first.loading} loadingMore={extra?.loading} skeletonCount={20} />
      )}

      {!first.loading && page < totalPages && movies.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={extra?.loading}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold transition hover:border-brand-violet hover:bg-brand-violet/15 disabled:opacity-60"
          >
            {extra?.loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

/** Browse grid for movies or series: genre chips, sort, and "Load more". */
export default function BrowseCatalog({ mediaType }: { mediaType: MediaType }) {
  return (
    <Suspense
      fallback={
        <div className="gutter pt-28">
          <GridSkeleton count={20} />
        </div>
      }
    >
      <Browser mediaType={mediaType} />
    </Suspense>
  );
}
