"use client";

import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ErrorState } from "@/components/ErrorBoundary";
import VideoPlayer from "@/components/player/VideoPlayer";
import { getSpoolVideo, spoolAsMovie, spoolSource } from "@/lib/spool";
import { useAsync } from "@/lib/useAsync";

/** Full-screen player for a Spool video (HLS from Spool's public storage). */
export default function SpoolWatchPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: video, error, retry } = useAsync(`spool:video:${id}`, () => getSpoolVideo(id));

  const leave = () => {
    if (window.history.length > 1) router.back();
    else router.push("/spool");
  };

  const source = video ? spoolSource(video) : null;

  if (error || (video && !source)) {
    return (
      <div className="fixed inset-0 z-[90] grid place-items-center bg-black p-6">
        <div className="w-full max-w-md">
          <ErrorState
            message={video && !source ? "This video is still being processed. Try again in a minute." : "This video isn't available."}
            onRetry={retry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black">
      {!video ? (
        <div className="grid h-full place-items-center">
          <Loader2 className="size-12 animate-spin text-white/70" aria-label="Loading" />
        </div>
      ) : (
        <VideoPlayer
          key={video.id}
          variant="page"
          movie={spoolAsMovie(video)}
          source={source}
          eyebrow="Spool"
          sourceLabel="Adaptive HD"
          onClose={leave}
        />
      )}
    </div>
  );
}
