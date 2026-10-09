"use client";

import { getSpoolVideos } from "@/lib/spool";
import { useAsync } from "@/lib/useAsync";
import { RowHeader, RowScroller } from "./MovieRow";
import { Skeleton } from "./Skeleton";
import SpoolCard from "./SpoolCard";

/** Home-page row of the newest Spool uploads. Renders nothing if Spool has no videos or is offline. */
export default function SpoolRow() {
  const { data, loading } = useAsync("spool:latest", () => getSpoolVideos(20));
  const title = "Fresh from Creators";

  if (loading) {
    return (
      <section aria-label={title} aria-busy>
        <RowHeader title={title} eyebrow="Spool" href="/spool" />
        <div className="gutter flex gap-2 overflow-hidden py-4 sm:gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-video w-[70%] shrink-0 sm:w-[45%] md:w-[30%] lg:w-[23%]" />
          ))}
        </div>
      </section>
    );
  }
  if (!data?.length) return null;

  return (
    <section aria-label={title}>
      <RowHeader title={title} eyebrow="Spool" href="/spool" />
      <RowScroller label={title}>
        {data.map((video) => (
          <div key={video.id} role="listitem" className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[30%] lg:w-[23%]">
            <SpoolCard video={video} />
          </div>
        ))}
      </RowScroller>
    </section>
  );
}
