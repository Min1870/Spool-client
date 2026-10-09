"use client";

import clsx from "clsx";
import { ListVideo, Loader2, SkipForward, X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorState } from "@/components/ErrorBoundary";
import EpisodeList from "@/components/EpisodeList";
import VideoPlayer, { IconButton } from "@/components/player/VideoPlayer";
import {
  detailHref,
  episodeLabel,
  getDetails,
  getSeasonEpisodes,
  getTrailerSource,
  watchHref,
} from "@/lib/tmdb";
import { useAsync } from "@/lib/useAsync";
import type { EpisodeRef, MediaType, MovieDetails } from "@/lib/types";
import { useWatchStore } from "@/store/useWatchStore";

const isMediaType = (v: string): v is MediaType => v === "movie" || v === "tv";
const positiveInt = (v: string | null, fallback: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

function EpisodesDrawer({
  show,
  current,
  onClose,
}: {
  show: MovieDetails;
  current: EpisodeRef;
  onClose: () => void;
}) {
  const [season, setSeason] = useState(current.season);
  return (
    <aside
      aria-label="Episodes"
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-y-0 right-0 z-40 flex w-full animate-fade-in flex-col border-l border-line bg-ink/95 backdrop-blur-xl sm:w-[26rem]"
    >
      <div className="flex items-center justify-between border-b border-line p-4">
        <h2 className="font-display text-xl font-bold">Episodes</h2>
        <IconButton label="Close episodes" onClick={onClose}>
          <X className="size-5" aria-hidden />
        </IconButton>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto p-3">
        <EpisodeList
          show={show}
          seasons={show.seasons}
          season={season}
          onSeasonChange={setSeason}
          current={current}
          compact
          replace
        />
      </div>
    </aside>
  );
}

function WatchView() {
  const router = useRouter();
  const params = useParams<{ type: string; id: string }>();
  const search = useSearchParams();
  const saveProgress = useWatchStore((s) => s.saveProgress);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mediaType = isMediaType(params.type) ? params.type : null;
  const id = Number(params.id);
  const valid = mediaType !== null && Number.isInteger(id);
  const episode: EpisodeRef | undefined =
    mediaType === "tv"
      ? { season: positiveInt(search.get("s"), 1), episode: positiveInt(search.get("e"), 1) }
      : undefined;
  const startAt = positiveInt(search.get("t"), 0);
  const playKey = `${mediaType}:${id}:${episode ? episodeLabel(episode) : ""}`;

  const details = useAsync(valid ? `details:${mediaType}:${id}` : null, () => getDetails(mediaType ?? "movie", id));
  const source = useAsync(valid ? `source:${playKey}` : null, () =>
    getTrailerSource({ mediaType: mediaType ?? "movie", id }, episode),
  );
  const episodes = useAsync(episode ? `season:${id}:${episode.season}` : null, () =>
    getSeasonEpisodes(id, episode?.season ?? 1),
  );

  const show = details.data;
  const currentEpisode = episodes.data?.find((e) => e.episodeNumber === episode?.episode);

  // Next episode: same season, else first episode of the next season.
  let next: EpisodeRef | null = null;
  if (episode && show && episodes.data) {
    if (episode.episode < episodes.data.length) next = { season: episode.season, episode: episode.episode + 1 };
    else if (show.seasons.some((s) => s.seasonNumber === episode.season + 1))
      next = { season: episode.season + 1, episode: 1 };
  }

  const leave = () => {
    if (window.history.length > 1) router.back();
    else router.push(show ? detailHref(show) : "/");
  };

  if (!valid || details.error) {
    return (
      <div className="fixed inset-0 z-[90] grid place-items-center bg-black p-6">
        <div className="w-full max-w-md">
          <ErrorState message="This title isn't available." onRetry={valid ? details.retry : undefined} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black">
      {!show ? (
        <div className="grid h-full place-items-center">
          <Loader2 className="size-12 animate-spin text-white/70" aria-label="Loading" />
        </div>
      ) : (
        <VideoPlayer
          key={`${playKey}:${source.data ? "ready" : "pending"}`}
          variant="page"
          movie={show}
          source={source.data ?? null}
          startAt={startAt}
          eyebrow={episode ? episodeLabel(episode) : "Now Playing"}
          subtitle={currentEpisode?.name}
          onClose={leave}
          onProgress={(position, duration) =>
            saveProgress(show, position, duration, episode && { ...episode, name: currentEpisode?.name })
          }
          onEnded={() => next && router.replace(watchHref(show, { episode: next }))}
          controls={
            episode && (
              <>
                {next && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.replace(watchHref(show, { episode: next }));
                    }}
                    className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition hover:bg-white/15"
                  >
                    <SkipForward className="size-5 fill-white" aria-hidden />
                    <span className="hidden sm:inline">Next Episode</span>
                  </button>
                )}
                <IconButton
                  label="Episodes"
                  onClick={() => setDrawerOpen((o) => !o)}
                  className={clsx(drawerOpen && "bg-white/15")}
                >
                  <ListVideo className="size-5" aria-hidden />
                </IconButton>
              </>
            )
          }
        >
          {episode && drawerOpen && (
            <EpisodesDrawer show={show} current={episode} onClose={() => setDrawerOpen(false)} />
          )}
        </VideoPlayer>
      )}
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[90] bg-black" />}>
      <WatchView />
    </Suspense>
  );
}
