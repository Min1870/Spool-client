"use client";

import Image from "next/image";
import Link from "next/link";
import { detailHref, posterUrl } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";
import type { Movie } from "@/lib/types";
import { ErrorState } from "./ErrorBoundary";
import { RowHeader, RowScroller } from "./MovieRow";
import { RowSkeleton } from "./Skeleton";

/** Netflix-style "Top 10" row with oversized outlined rank numerals. */
export default function TopTenRow({ id, title, load }: { id: string; title: string; load: () => Promise<Movie[]> }) {
  const { data, error, loading, retry } = useAsync(`row:top10:${id}`, load);
  const movies = (data ?? []).filter((m) => m.posterPath).slice(0, 10);

  return (
    <section aria-label={title}>
      <RowHeader title={title} eyebrow="Today" />
      {loading ? (
        <RowSkeleton count={5} />
      ) : error ? (
        <div className="gutter py-4">
          <ErrorState onRetry={retry} />
        </div>
      ) : (
        <RowScroller label={title}>
          {movies.map((movie, index) => (
            <Link
              key={movie.id}
              role="listitem"
              href={detailHref(movie)}
              aria-label={`#${index + 1} ${movie.title}`}
              className="group/top flex w-[62%] shrink-0 snap-start items-end sm:w-[40%] md:w-[30%] lg:w-[23%] xl:w-[19%]"
            >
              <span
                aria-hidden
                className="text-stroke -mr-[6%] select-none font-display text-[7.5rem] leading-[0.8] font-black tracking-tighter transition group-hover/top:[-webkit-text-stroke-color:var(--color-brand-red)] sm:text-[9rem] lg:text-[10.5rem]"
              >
                {index + 1}
              </span>
              <div className="relative aspect-2/3 w-[58%] shrink-0 overflow-hidden rounded-md ring-1 ring-white/5 transition duration-300 group-hover/top:scale-105 group-hover/top:ring-brand-red/70">
                <Image
                  src={posterUrl(movie.posterPath)}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 11vw, (min-width: 1024px) 13vw, (min-width: 768px) 17vw, (min-width: 640px) 23vw, 36vw"
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </RowScroller>
      )}
    </section>
  );
}
