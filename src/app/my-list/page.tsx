"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import MovieGrid from "@/components/MovieGrid";
import { useWatchStore } from "@/store/useWatchStore";

export default function MyListPage() {
  const watchlist = useWatchStore((s) => s.watchlist);
  const hydrated = useWatchStore((s) => s.hydrated);

  return (
    <div className="pt-24 lg:pt-28">
      <header className="gutter mb-8">
        <p className="text-gradient-brand text-xs font-bold uppercase tracking-[0.25em]">Your Library</p>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">My List</h1>
        {hydrated && watchlist.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved
          </p>
        )}
      </header>

      <div className="mb-10">
        <ContinueWatchingRow />
      </div>

      <div className="gutter">
        {!hydrated ? (
          <MovieGrid movies={[]} loading skeletonCount={5} />
        ) : watchlist.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line bg-surface/60 px-6 py-16 text-center">
            <span className="bg-gradient-brand grid size-14 place-items-center rounded-full">
              <Bookmark className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold">Your list is empty</h2>
            <p className="mt-2 text-sm text-muted">
              Tap the + on any title to save it here and pick up where you left off.
            </p>
            <Link
              href="/movies"
              className="mt-6 rounded-md bg-brand-red px-6 py-2.5 text-sm font-semibold transition hover:bg-brand-red-dark"
            >
              Browse movies
            </Link>
          </div>
        ) : (
          <MovieGrid movies={watchlist} />
        )}
      </div>
    </div>
  );
}
