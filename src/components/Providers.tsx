"use client";

import { useEffect, type ReactNode } from "react";
import { useWatchStore } from "@/store/useWatchStore";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Watchlist / progress live in localStorage; load them only on the client.
    useWatchStore.persist.rehydrate();
  }, []);

  return children;
}
