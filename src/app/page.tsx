"use client";

import CollectionTiles from "@/components/CollectionTiles";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import SpoolRow from "@/components/SpoolRow";
import TopTenRow from "@/components/TopTenRow";
import { homeRows } from "@/lib/siteConfig";
import { getTrending, getTrendingAll, getTrendingTv } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";

export default function HomePage() {
  const trending = useAsync("trending:all", getTrendingAll);
  const [firstRow, secondRow, ...otherRows] = homeRows;

  return (
    <>
      <ErrorBoundary fallbackMessage="The featured banner failed to load.">
        <HeroBanner movies={trending.data} loading={trending.loading} />
      </ErrorBoundary>

      <div className="relative z-10 -mt-16 space-y-6 pb-8 sm:-mt-24 md:space-y-10">
        <ErrorBoundary>
          <ContinueWatchingRow />
        </ErrorBoundary>
        <ErrorBoundary>
          <SpoolRow />
        </ErrorBoundary>
        <ErrorBoundary>
          <MovieRow {...firstRow} />
        </ErrorBoundary>
        <ErrorBoundary>
          <TopTenRow id="movies" title="Top 10 Movies Today" load={getTrending} />
        </ErrorBoundary>
        <ErrorBoundary>
          <MovieRow {...secondRow} />
        </ErrorBoundary>
        <ErrorBoundary>
          <CollectionTiles />
        </ErrorBoundary>
        <ErrorBoundary>
          <TopTenRow id="tv" title="Top 10 Series Today" load={getTrendingTv} />
        </ErrorBoundary>
        {otherRows.map((row) => (
          <ErrorBoundary key={row.id}>
            <MovieRow {...row} />
          </ErrorBoundary>
        ))}
      </div>
    </>
  );
}
