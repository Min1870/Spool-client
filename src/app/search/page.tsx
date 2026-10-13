"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import { GridSkeleton } from "@/components/Skeleton";
import { getCatalog } from "@/lib/catalog";
import { useAsync } from "@/lib/useAsync";

const DEBOUNCE_MS = 250;

/** Search within MSW's catalogue only (movies uploaded to Spool). */
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

  const { data, loading } = useAsync("catalog", getCatalog);
  const needle = urlQuery.toLowerCase();
  const matches = (data ?? []).filter(
    (m) =>
      !needle ||
      m.title.toLowerCase().includes(needle) ||
      m.overview.toLowerCase().includes(needle) ||
      m.cast.some((c) => c.name.toLowerCase().includes(needle)),
  );

  return (
    <div className="gutter pt-24 pb-16 lg:pt-28">
      <div className="relative mx-auto mb-10 max-w-3xl">
        <Search className="pointer-events-none absolute left-5 top-1/2 size-6 -translate-y-1/2 text-white/50" aria-hidden />
        <input
          type="search"
          autoFocus
          value={value}
          onChange={(e) => setDraft({ value: e.target.value, base: urlQuery })}
          placeholder="Search movies, actors…"
          aria-label="Search movies"
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

      <section aria-live="polite">
        <h1 className="mb-6 text-lg text-muted">
          {urlQuery ? (
            <>
              Results for <span className="font-semibold text-white">“{urlQuery}”</span>
            </>
          ) : (
            <span className="font-display text-3xl font-bold text-white">All movies</span>
          )}
        </h1>
        {!loading && matches.length === 0 ? (
          <p className="py-16 text-center text-muted">
            {urlQuery ? `No movies match “${urlQuery}”.` : "No movies yet."}
          </p>
        ) : (
          <MovieGrid movies={matches} loading={loading} />
        )}
      </section>
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
