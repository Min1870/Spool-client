"use client";

import { ErrorState } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/Skeleton";
import SpoolCard from "@/components/SpoolCard";
import { getSpoolVideos, hasSpool } from "@/lib/spool";
import { useAsync } from "@/lib/useAsync";

/** All creator uploads from Spool, newest first. */
export default function SpoolPage() {
  const { data, loading, retry } = useAsync("spool:all", () => getSpoolVideos(50));

  return (
    <div className="gutter pt-28 pb-16">
      <p className="text-gradient-brand text-[11px] font-bold uppercase tracking-[0.2em]">Spool</p>
      <h1 className="font-display text-3xl font-bold sm:text-5xl">Fresh from Creators</h1>
      <p className="mt-2 max-w-xl text-muted">Original videos uploaded by creators on Spool, streamed in adaptive HD.</p>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-video w-full" />
            ))}
          </div>
        ) : !data?.length ? (
          <div className="max-w-md">
            <ErrorState
              message={
                hasSpool
                  ? "No creator videos yet, or Spool isn't reachable right now."
                  : "Spool isn't configured. Set NEXT_PUBLIC_SPOOL_API_URL in .env.local."
              }
              onRetry={hasSpool ? retry : undefined}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((video) => (
              <SpoolCard key={video.id} video={video} className="animate-fade-in" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
