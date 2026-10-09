import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx("shimmer animate-shimmer rounded-md", className)} />;
}

export const rowItemWidth =
  "w-[40%] sm:w-[28%] md:w-[22%] lg:w-[18%] xl:w-[15.2%]";

export function CardSkeleton({ className }: { className?: string }) {
  return <Skeleton className={clsx("aspect-2/3 w-full", className)} />;
}

export function RowSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading" className="gutter flex gap-2 overflow-hidden py-4 sm:gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={clsx("shrink-0", rowItemWidth)}>
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
    >
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="relative h-[78svh] min-h-[480px] w-full md:h-[88vh]">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="gutter absolute inset-x-0 bottom-[22%] space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-3/4 max-w-xl md:h-16" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
    </div>
  );
}
