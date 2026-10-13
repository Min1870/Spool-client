import type { Movie, PlayerSource } from "./types";

/**
 * Client for Spool's PUBLIC API: the video platform where creators upload videos.
 * Spool transcodes uploads to HLS; this site only reads the public list and plays the
 * streams. No keys or backend needed (fits the Phase 1 "client-first" rule in CLAUDE.md):
 * the API sends CORS headers so the browser may call it from this site directly.
 *
 *   GET {SPOOL}/api/videos?limit=20  → { videos: SpoolVideo[] }   (ready videos only)
 *   GET {SPOOL}/api/videos/{id}      → SpoolVideo
 *
 * Uploads linked to a TMDB movie are MSW's movie catalogue (see catalog.ts); unlinked
 * uploads are "creator videos" (the Creators page).
 */

const SPOOL_API = process.env.NEXT_PUBLIC_SPOOL_API_URL?.replace(/\/+$/, "");

export const hasSpool = Boolean(SPOOL_API);

/** Which TMDB entry a Spool upload is (set by the uploader in Spool's admin). */
export interface SpoolTmdbLink {
  type: "movie" | "tv";
  id: number;
  title: string | null;
  year: number | null;
  posterUrl: string | null;
}

/** A video as Spool's public API returns it. */
export interface SpoolVideo {
  id: string;
  title: string;
  status: "uploading" | "queued" | "processing" | "ready" | "failed";
  error: string | null;
  /** Seconds. */
  duration: number | null;
  createdAt: string;
  /** HLS master playlist (480p + 720p), once ready. */
  hlsUrl: string | null;
  thumbnailUrl: string | null;
  /** The video's page on Spool itself. */
  watchUrl: string;
  embedUrl: string;
  /** Set when this upload is a TMDB movie. */
  tmdb: SpoolTmdbLink | null;
}

async function spoolFetch<T>(path: string): Promise<T> {
  if (!SPOOL_API) throw new Error("NEXT_PUBLIC_SPOOL_API_URL is not set");
  const res = await fetch(`${SPOOL_API}${path}`);
  if (res.status === 404) throw new Error("Video not found");
  if (!res.ok) throw new Error(`Spool ${path} failed with ${res.status}`);
  return res.json() as Promise<T>;
}

/**
 * Newest ready videos. `linked`: true = only uploads linked to TMDB movies, false = only
 * creator originals. Resolves to [] if Spool isn't configured or reachable, so the rest of
 * the site keeps working.
 */
export async function getSpoolVideos(limit = 20, { linked }: { linked?: boolean } = {}): Promise<SpoolVideo[]> {
  try {
    const filter = linked === undefined ? "" : `&linked=${linked}`;
    const data = await spoolFetch<{ videos: SpoolVideo[] }>(`/api/videos?limit=${limit}${filter}`);
    return data.videos;
  } catch (error) {
    if (hasSpool) console.warn("[spool] couldn't load videos:", (error as Error).message);
    return [];
  }
}

export const getSpoolVideo = (id: string) => spoolFetch<SpoolVideo>(`/api/videos/${encodeURIComponent(id)}`);

export const spoolWatchHref = (id: string) => `/spool/${id}`;

/** The player's source for a ready Spool video: HLS with adaptive 480p/720p. */
export function spoolSource(video: SpoolVideo): PlayerSource | null {
  return video.hlsUrl ? { kind: "hls", url: video.hlsUrl } : null;
}

/**
 * VideoPlayer is built around TMDB's Movie shape; it only reads the title, overview,
 * backdrop and release date. This adapter fills those from a Spool video.
 */
export function spoolAsMovie(video: SpoolVideo): Movie {
  return {
    id: 0,
    mediaType: "movie",
    title: video.title,
    overview: "",
    posterPath: null,
    backdropPath: null,
    releaseDate: video.createdAt.slice(0, 10),
    voteAverage: 0,
    voteCount: 0,
    genreIds: [],
    popularity: 0,
    originalLanguage: "",
  };
}
