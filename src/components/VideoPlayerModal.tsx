"use client";

import { useShallow } from "zustand/react/shallow";
import { usePlayerStore } from "@/store/usePlayerStore";
import VideoPlayer from "./player/VideoPlayer";

/** Quick trailer preview overlay. Full playback lives on /watch/[type]/[id]. */
export default function VideoPlayerModal() {
  const { isOpen, movie, source, session, close } = usePlayerStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      movie: s.movie,
      source: s.source,
      session: s.session,
      close: s.close,
    })),
  );

  if (!isOpen || !movie) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${movie.title} trailer`}
      onClick={close}
      className="fixed inset-0 z-[100] grid animate-fade-in place-items-center bg-black/90 backdrop-blur-sm sm:p-6"
    >
      <VideoPlayer key={`${session}-${source ? "ready" : "pending"}`} movie={movie} source={source} onClose={close} />
    </div>
  );
}
