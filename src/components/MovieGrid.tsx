import type { Movie } from "@/lib/types";
import MovieCard from "./MovieCard";
import { CardSkeleton, GridSkeleton } from "./Skeleton";

const GRID_SIZES = "(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw";

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  /** Skeleton cards appended while more results load (pagination). */
  loadingMore?: boolean;
  skeletonCount?: number;
}

export default function MovieGrid({ movies, loading, loadingMore, skeletonCount = 10 }: MovieGridProps) {
  if (loading) return <GridSkeleton count={skeletonCount} />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie, i) => (
        <MovieCard key={`${movie.id}-${i}`} movie={movie} sizes={GRID_SIZES} className="animate-fade-in" />
      ))}
      {loadingMore && Array.from({ length: 5 }, (_, i) => <CardSkeleton key={`more-${i}`} />)}
    </div>
  );
}
