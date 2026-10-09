"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  retry: () => void;
}

/**
 * Runs `load` on the client whenever `key` changes. Pass `null` to skip.
 * Results are tagged with the key they belong to, so stale data is never
 * shown for a new key and no synchronous state reset is needed.
 */
export function useAsync<T>(key: string | null, load: () => Promise<T>): AsyncState<T> {
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ tag: string; data?: T; error?: Error } | null>(null);
  const tag = key === null ? null : `${key}#${attempt}`;

  useEffect(() => {
    if (tag === null) return;
    let cancelled = false;
    loadRef.current().then(
      (data) => !cancelled && setResult({ tag, data }),
      (error: unknown) =>
        !cancelled && setResult({ tag, error: error instanceof Error ? error : new Error(String(error)) }),
    );
    return () => {
      cancelled = true;
    };
  }, [tag]);

  const current = result !== null && result.tag === tag;
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    data: current ? result.data : undefined,
    error: current ? result.error : undefined,
    loading: tag !== null && !current,
    retry,
  };
}
