"use client";

import { ErrorState } from "@/components/ErrorBoundary";

export default function RouteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  console.error(error);
  return (
    <div className="gutter mx-auto max-w-xl pt-32">
      <ErrorState message="Something went wrong while loading this page." onRetry={() => retry()} />
    </div>
  );
}
