"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ErrorState } from "@/components/ErrorBoundary";
import MovieGrid from "@/components/MovieGrid";
import { GridSkeleton } from "@/components/Skeleton";
import { getTrendingAll, searchMulti } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";

const DEBOUNCE_MS = 350;

function SearchResults() {
  const router = useRouter();
  const params = useSearchParams();
  const urlQuery = params.get("q")?.trim() ?? "";

  // Local draft so typing stays responsive; the URL is the source of truth.
  const [draft, setDraft] = useState<{ value: string; base: string }>({ value: urlQuery, base: urlQuery });
  const value = draft.base === urlQuery || draft.value.trim() === urlQuery ? draft.value : urlQuery;

  useEffect(() => {
    const q = value.trim();
    if (q === urlQuery) return;
    const timer = window.setTimeout(() => {
      router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search", { scroll: false });
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [value, urlQuery, router]);

  const results = useAsync(urlQuery ? `search:${urlQuery}` : null, () => searchMulti(urlQuery));
  const trending = useAsync(urlQuery ? null : "trending:all", getTrendingAll);
  const movies = (results.data?.results ?? []).filter((m) => m.posterPath);

  return (
    <div className="gutter pt-24 lg:pt-28">
      <div className="relative mx-auto mb-10 max-w-3xl">
        <Search className="pointer-events-none absolute left-5 top-1/2 size-6 -translate-y-1/2 text-white/50" aria-hidden />
        <input
          type="search"
          autoFocus
          value={value}
          onChange={(e) => setDraft({ value: e.target.value, base: urlQuery })}
          placeholder="Search movies and series…"
          aria-label="Search movies and series"
          className="w-full rounded-2xl border border-white/15 bg-surface py-4 pl-14 pr-12 text-lg outline-none transition placeholder:text-white/40 focus:border-brand-violet focus:shadow-[0_0_0_4px_rgba(123,47,247,0.25)] [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setDraft({ value: "", base: urlQuery })}
            className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-white/10"
          >
            <X className="size-5" aria-hidden />
          </button>
        )}
      </div>

      {urlQuery ? (
        <section aria-live="polite">
          <h1 className="mb-6 text-lg text-muted">
            Results for <span className="font-semibold text-white">“{urlQuery}”</span>
          </h1>
          {results.error ? (
            <ErrorState onRetry={results.retry} />
          ) : !results.loading && movies.length === 0 ? (
            <p className="py-16 text-center text-muted">
              No titles match “{urlQuery}”. Try a different title or keyword.
            </p>
          ) : (
            <MovieGrid movies={movies} loading={results.loading} />
          )}
        </section>
      ) : (
        <section>
          <h1 className="mb-6 font-display text-3xl font-bold">Trending searches</h1>
          <MovieGrid movies={trending.data ?? []} loading={trending.loading} />
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="gutter pt-28">
          <GridSkeleton />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
