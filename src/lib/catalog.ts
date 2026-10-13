import { getSpoolVideos, type SpoolVideo } from "./spool";
import { getDetails } from "./tmdb";
import type { MovieDetails } from "./types";

/**
 * MSW's catalogue = the movies uploaded to Spool and linked to TMDB. Nothing else is
 * shown on the site: every page (home, movies, search, details, watch) reads from here.
 *
 * Spool says WHICH movies exist and provides the video; TMDB provides everything you see
 * about them (title, poster, backdrop, overview, genres, cast).
 */

export interface CatalogMovie extends MovieDetails {
  /** The Spool upload that plays when you press Play. */
  spool: SpoolVideo;
}

/** Rebuild the catalogue at most once a minute (Spool's list is cached for 60s anyway). */
const TTL_MS = 60_000;
let cache: { at: number; promise: Promise<CatalogMovie[]> } | null = null;

export function getCatalog(): Promise<CatalogMovie[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.promise;
  const promise = buildCatalog();
  cache = { at: Date.now(), promise };
  promise.catch(() => (cache = null)); // don't keep a failure around
  return promise;
}

async function buildCatalog(): Promise<CatalogMovie[]> {
  // Newest uploads first; if a movie was uploaded twice, the newest upload wins.
  const uploads = (await getSpoolVideos(50, { linked: true })).filter((v) => v.tmdb?.type === "movie" && v.hlsUrl);
  const newestPerMovie = new Map<number, SpoolVideo>();
  for (const v of uploads) if (!newestPerMovie.has(v.tmdb!.id)) newestPerMovie.set(v.tmdb!.id, v);

  const movies = await Promise.all(
    [...newestPerMovie.entries()].map(async ([tmdbId, spool]) => {
      try {
        return { ...(await getDetails("movie", tmdbId)), spool };
      } catch {
        // TMDB unreachable: still list the movie, using the small copy Spool saved when it was linked.
        return { ...fromSpoolCopy(tmdbId, spool), spool };
      }
    }),
  );
  return movies;
}

/** Minimal movie details from Spool's saved TMDB copy (title, year, poster). */
function fromSpoolCopy(tmdbId: number, v: SpoolVideo): MovieDetails {
  // Spool gives a full poster URL (https://image.tmdb.org/t/p/w342/abc.jpg); MSW wants the path ("/abc.jpg").
  const posterPath = v.tmdb?.posterUrl?.match(/\/t\/p\/[^/]+(\/.+)$/)?.[1] ?? null;
  return {
    id: tmdbId,
    mediaType: "movie",
    title: v.tmdb?.title ?? v.title,
    overview: "",
    posterPath,
    backdropPath: null,
    releaseDate: v.tmdb?.year ? `${v.tmdb.year}-01-01` : "",
    voteAverage: 0,
    voteCount: 0,
    genreIds: [],
    popularity: 0,
    originalLanguage: "",
    tagline: "",
    runtime: v.duration ? Math.round(v.duration / 60) : null,
    genres: [],
    status: "Released",
    cast: [],
    similar: [],
    seasons: [],
  };
}

/** The catalogue entry for a TMDB movie id, or null if it isn't on MSW. */
export async function getCatalogMovie(tmdbId: number): Promise<CatalogMovie | null> {
  return (await getCatalog()).find((m) => m.id === tmdbId) ?? null;
}

/** Ids of everything on MSW, for filtering saved lists (My List, Continue Watching). */
export async function getCatalogIds(): Promise<Set<number>> {
  return new Set((await getCatalog()).map((m) => m.id));
}
