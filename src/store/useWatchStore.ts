"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mediaKey } from "@/lib/tmdb";
import type { Movie, UserWatchState, WatchProgress } from "@/lib/types";

interface WatchStore extends UserWatchState {
  hydrated: boolean;
  toggleWatchlist: (movie: Movie) => void;
  saveProgress: (
    movie: Movie,
    position: number,
    duration: number,
    episode?: WatchProgress["episode"],
  ) => void;
  removeProgress: (key: string) => void;
}

/** Videos within this many seconds of the end count as finished. */
const FINISHED_THRESHOLD = 10;

const sameTitle = (a: Movie, b: Movie) => mediaKey(a) === mediaKey(b);

export const useWatchStore = create<WatchStore>()(
  persist(
    (set) => ({
      watchlist: [],
      progress: {},
      hydrated: false,

      toggleWatchlist: (movie) =>
        set((state) => ({
          watchlist: state.watchlist.some((m) => sameTitle(m, movie))
            ? state.watchlist.filter((m) => !sameTitle(m, movie))
            : [movie, ...state.watchlist],
        })),

      saveProgress: (movie, position, duration, episode) =>
        set((state) => {
          const key = mediaKey(movie);
          const progress = { ...state.progress };
          if (!duration || duration - position < FINISHED_THRESHOLD) {
            delete progress[key];
          } else {
            progress[key] = { movie, episode, position, duration, updatedAt: Date.now() };
          }
          return { progress };
        }),

      removeProgress: (key) =>
        set((state) => {
          const progress = { ...state.progress };
          delete progress[key];
          return { progress };
        }),
    }),
    {
      name: "msw-watch-state",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ watchlist, progress }) => ({ watchlist, progress }),
      // v0 stored movies without mediaType and keyed progress by numeric id.
      migrate: (persisted, version) => {
        const state = persisted as UserWatchState;
        if (version === 0) {
          const asMovie = (m: Movie): Movie => ({ ...m, mediaType: m.mediaType ?? "movie" });
          return {
            watchlist: (state.watchlist ?? []).map(asMovie),
            progress: Object.fromEntries(
              Object.values(state.progress ?? {}).map((p) => {
                const movie = asMovie(p.movie);
                return [mediaKey(movie), { ...p, movie }];
              }),
            ),
          };
        }
        return state;
      },
      // Rehydrated manually after mount (see Providers) to avoid SSR mismatches.
      skipHydration: true,
      onRehydrateStorage: () => () => useWatchStore.setState({ hydrated: true }),
    },
  ),
);

export const useInWatchlist = (movie: Movie) =>
  useWatchStore((s) => s.watchlist.some((m) => sameTitle(m, movie)));

export const useProgressFor = (movie: Movie) => useWatchStore((s) => s.progress[mediaKey(movie)]);

/** Select `progress` from the store, then derive this outside the selector. */
export function sortContinueWatching(progress: UserWatchState["progress"]): WatchProgress[] {
  return Object.values(progress).sort((a, b) => b.updatedAt - a.updatedAt);
}
