"use client";

import { create } from "zustand";
import { getTrailerSource } from "@/lib/tmdb";
import type { Movie, PlayerSource } from "@/lib/types";

/** State for the trailer preview modal (VideoPlayerModal). */
interface PlayerStore {
  isOpen: boolean;
  movie: Movie | null;
  source: PlayerSource | null;
  /** Increments per open() so stale trailer lookups are ignored. */
  session: number;
  open: (movie: Movie) => void;
  close: () => void;
}

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  isOpen: false,
  movie: null,
  source: null,
  session: 0,

  open: (movie) => {
    const session = get().session + 1;
    set({ isOpen: true, movie, source: null, session });
    getTrailerSource(movie).then((source) => {
      if (get().session === session && get().isOpen) set({ source });
    });
  },

  close: () => set({ isOpen: false, movie: null, source: null }),
}));
