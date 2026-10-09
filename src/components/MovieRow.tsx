"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { mediaKey } from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";
import type { Movie } from "@/lib/types";
import { ErrorState } from "./ErrorBoundary";
import MovieCard from "./MovieCard";
import { RowSkeleton, rowItemWidth } from "./Skeleton";

export function RowHeader({ title, href, eyebrow }: { title: string; href?: string; eyebrow?: string }) {
  return (
    <div className="gutter mb-1 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-gradient-brand text-[11px] font-bold uppercase tracking-[0.2em]">{eyebrow}</p>
        )}
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl lg:text-2xl">
          {href ? (
            <Link href={href} className="group inline-flex items-center gap-1 hover:text-white">
              {title}
              <span className="inline-flex max-w-0 items-center overflow-hidden text-sm font-medium whitespace-nowrap text-brand-violet transition-all duration-300 group-hover:max-w-32 group-hover:pl-2">
                Explore all <ChevronRight className="size-4" aria-hidden />
              </span>
            </Link>
          ) : (
            title
          )}
        </h2>
      </div>
    </div>
  );
}

/** Horizontal, snap-scrolling carousel with Netflix-style edge arrows. */
export function RowScroller({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);

  const scrollBy = (direction: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow = (direction: 1 | -1, hidden: boolean) => (
    <button
      type="button"
      aria-label={direction === 1 ? `Scroll ${label} right` : `Scroll ${label} left`}
      onClick={() => scrollBy(direction)}
      className={clsx(
        "absolute inset-y-4 z-30 hidden w-10 items-center justify-center bg-ink/60 opacity-0 backdrop-blur-sm transition md:flex lg:w-14",
        "group-hover/row:opacity-100 hover:bg-ink/80 focus-visible:opacity-100",
        direction === 1 ? "right-0 rounded-l-md" : "left-0 rounded-r-md",
        hidden && "pointer-events-none !opacity-0",
      )}
    >
      {direction === 1 ? (
        <ChevronRight className="size-8 transition group-hover/row:scale-110" aria-hidden />
      ) : (
        <ChevronLeft className="size-8 transition group-hover/row:scale-110" aria-hidden />
      )}
    </button>
  );

  return (
    <div className="group/row relative">
      {arrow(-1, edges.start)}
      <div
        ref={ref}
        role="list"
        aria-label={label}
        className="no-scrollbar gutter flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overflow-y-visible py-4 sm:scroll-px-8 sm:gap-3 lg:scroll-px-14"
      >
        {children}
      </div>
      {arrow(1, edges.end)}
    </div>
  );
}

export function MovieRowView({ title, movies, href, eyebrow }: { title: string; movies: Movie[]; href?: string; eyebrow?: string }) {
  return (
    <section aria-label={title}>
      <RowHeader title={title} href={href} eyebrow={eyebrow} />
      <RowScroller label={title}>
        {movies.map((movie) => (
          <div key={mediaKey(movie)} role="listitem" className={clsx("shrink-0 snap-start", rowItemWidth)}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </RowScroller>
    </section>
  );
}

interface MovieRowProps {
  id: string;
  title: string;
  href?: string;
  eyebrow?: string;
  load: () => Promise<Movie[]>;
}

/** Self-loading row: fetches its own data and shows a skeleton meanwhile. */
export default function MovieRow({ id, title, href, eyebrow, load }: MovieRowProps) {
  const { data, error, loading, retry } = useAsync(`row:${id}`, load);

  if (loading) {
    return (
      <section aria-label={title} aria-busy>
        <RowHeader title={title} href={href} eyebrow={eyebrow} />
        <RowSkeleton />
      </section>
    );
  }
  if (error) {
    return (
      <section aria-label={title}>
        <RowHeader title={title} />
        <div className="gutter py-4">
          <ErrorState onRetry={retry} />
        </div>
      </section>
    );
  }
  const movies = (data ?? []).filter((m) => m.posterPath);
  if (movies.length === 0) return null;
  return <MovieRowView title={title} movies={movies} href={href} eyebrow={eyebrow} />;
}
