"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { featuredCollections } from "@/lib/mockData";
import { backdropUrl, getByGenre } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";
import type { Collection } from "@/lib/types";
import { RowHeader, RowScroller } from "./MovieRow";
import { Skeleton } from "./Skeleton";

function CollectionTile({ collection, index }: { collection: Collection; index: number }) {
  // Artwork: a popular title in this genre, offset per tile so tiles sharing
  // a blockbuster (e.g. Action and Sci-Fi) don't show the same image.
  const { data, loading } = useAsync(`collection:${collection.genreId}`, () => getByGenre(collection.genreId));
  const withArt = data?.filter((m) => m.backdropPath) ?? [];
  const backdrop = withArt[index % Math.max(1, withArt.length)]?.backdropPath ?? null;

  return (
    <Link
      role="listitem"
      href={`/movies?genre=${collection.genreId}`}
      className="group/tile relative aspect-video w-[72%] shrink-0 snap-start overflow-hidden rounded-xl p-px sm:w-[44%] md:w-[32%] lg:w-[24%]"
    >
      {/* Gradient border, HBO Max style */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl bg-linear-to-br from-white/25 via-white/5 to-white/20 transition group-hover/tile:from-brand-violet group-hover/tile:to-brand-blue"
      />
      <span className="relative block h-full overflow-hidden rounded-[11px] bg-surface">
        {loading ? (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) : (
          <Image
            src={backdropUrl(backdrop, "w780")}
            alt=""
            fill
            sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, (min-width: 640px) 44vw, 72vw"
            unoptimized={!backdrop}
            className="object-cover transition duration-700 group-hover/tile:scale-110"
          />
        )}
        <span aria-hidden className={clsx("absolute inset-0 bg-linear-to-tr to-transparent", collection.gradient)} />
        <span className="absolute inset-x-0 bottom-0 p-4">
          <span className="block font-display text-xl font-bold leading-tight drop-shadow sm:text-2xl">
            {collection.name}
          </span>
          <span className="mt-0.5 block text-xs text-white/80 sm:text-sm">{collection.tagline}</span>
        </span>
      </span>
    </Link>
  );
}

export default function CollectionTiles() {
  return (
    <section aria-label="Collections">
      <RowHeader title="Curated Collections" eyebrow="Hand-picked" />
      <RowScroller label="Collections">
        {featuredCollections.map((collection, index) => (
          <CollectionTile key={collection.id} collection={collection} index={index} />
        ))}
      </RowScroller>
    </section>
  );
}
