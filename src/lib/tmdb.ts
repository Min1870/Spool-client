import {
  BACKDROP_PLACEHOLDER,
  HLS_TEST_STREAM,
  POSTER_PLACEHOLDER,
  mockGenres,
  mockMovies,
  mockShows,
  mockTvGenres,
} from "./mockData";
import type {
  CastMember,
  Episode,
  EpisodeRef,
  Genre,
  MediaType,
  MockMovie,
  Movie,
  MovieDetails,
  Paged,
  PlayerSource,
  SeasonSummary,
  SortOption,
  TrailerVideo,
} from "./types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const hasApiKey = Boolean(API_KEY);

// ---------------------------------------------------------------------------
// Image + routing helpers
// ---------------------------------------------------------------------------

type PosterSize = "w185" | "w342" | "w500" | "w780" | "original";
type BackdropSize = "w300" | "w780" | "w1280" | "original";
type ProfileSize = "w185" | "h632";

export function posterUrl(path: string | null, size: PosterSize = "w342") {
  return path ? `${IMAGE_BASE}/${size}${path}` : POSTER_PLACEHOLDER;
}

export function backdropUrl(path: string | null, size: BackdropSize = "w1280") {
  return path ? `${IMAGE_BASE}/${size}${path}` : BACKDROP_PLACEHOLDER;
}

export function profileUrl(path: string | null, size: ProfileSize = "w185") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export const releaseYear = (movie: Pick<Movie, "releaseDate">) =>
  movie.releaseDate ? movie.releaseDate.slice(0, 4) : "TBA";

/** Stable id across media types (TMDB movie and TV ids can collide). */
export const mediaKey = (m: Pick<Movie, "mediaType" | "id">) => `${m.mediaType}:${m.id}`;

export const detailHref = (m: Pick<Movie, "mediaType" | "id">) =>
  m.mediaType === "tv" ? `/tv/${m.id}` : `/movie/${m.id}`;

/** Full-screen watch page; the trailer stands in for the real stream in Phase 1. */
export function watchHref(
  m: Pick<Movie, "mediaType" | "id">,
  options: { episode?: EpisodeRef; startAt?: number } = {},
) {
  const params = new URLSearchParams();
  if (m.mediaType === "tv") {
    params.set("s", String(options.episode?.season ?? 1));
    params.set("e", String(options.episode?.episode ?? 1));
  }
  if (options.startAt && options.startAt > 3) params.set("t", String(Math.floor(options.startAt)));
  const qs = params.toString();
  return `/watch/${m.mediaType}/${m.id}${qs ? `?${qs}` : ""}`;
}

export const episodeLabel = (ref: EpisodeRef) => `S${ref.season}:E${ref.episode}`;

// ---------------------------------------------------------------------------
// Raw TMDB shapes → app types
// ---------------------------------------------------------------------------

interface RawMedia {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  popularity: number;
  original_language: string;
}

interface RawPaged {
  page: number;
  total_pages: number;
  results: RawMedia[];
}

interface RawDetails extends RawMedia {
  tagline: string;
  runtime?: number | null;
  episode_run_time?: number[];
  status: string;
  seasons?: {
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    air_date: string | null;
  }[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  similar?: RawPaged;
}

interface RawEpisode {
  id: number;
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  air_date: string | null;
  vote_average: number;
}

interface RawVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

function toMedia(raw: RawMedia, mediaType: MediaType): Movie {
  return {
    id: raw.id,
    mediaType,
    title: raw.title ?? raw.name ?? "Untitled",
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date ?? raw.first_air_date ?? "",
    voteAverage: Math.round(raw.vote_average * 10) / 10,
    voteCount: raw.vote_count,
    genreIds: raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? [],
    popularity: raw.popularity,
    originalLanguage: raw.original_language,
  };
}

function toPaged(raw: RawPaged, mediaType: MediaType): Paged<Movie> {
  return {
    page: raw.page,
    // TMDB refuses pages above 500.
    totalPages: Math.min(raw.total_pages, 500),
    results: raw.results.map((r) => toMedia(r, mediaType)),
  };
}

/** For mixed endpoints (trending/all, search/multi): keep movies + TV, drop people. */
function toMixedPaged(raw: RawPaged): Paged<Movie> {
  return {
    page: raw.page,
    totalPages: Math.min(raw.total_pages, 500),
    results: raw.results
      .filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .map((r) => toMedia(r, r.media_type as MediaType)),
  };
}

function stripMock(mock: MockMovie): Movie {
  const movie: Partial<MockMovie> = { ...mock };
  delete movie.trailerKey;
  delete movie.seasonEpisodeCounts;
  return movie as Movie;
}

// ---------------------------------------------------------------------------
// Fetch core: cached, falls back to mock data on any failure
// ---------------------------------------------------------------------------

const requestCache = new Map<string, Promise<unknown>>();

function tmdbFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!API_KEY) return Promise.reject(new Error("TMDB API key missing"));

  const search = new URLSearchParams({ api_key: API_KEY, language: "en-US" });
  for (const [key, value] of Object.entries(params)) search.set(key, String(value));
  const url = `${API_BASE}${path}?${search}`;

  const cached = requestCache.get(url);
  if (cached) return cached as Promise<T>;

  const request = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`TMDB ${path} failed with ${res.status}`);
    return res.json() as Promise<T>;
  });
  // Don't cache failures, so a retry actually hits the network again.
  request.catch(() => requestCache.delete(url));
  requestCache.set(url, request);
  return request;
}

async function withFallback<T>(live: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await live();
  } catch (error) {
    if (hasApiKey) console.warn("[tmdb] using mock data:", (error as Error).message);
    return fallback();
  }
}

const mockSource = (mediaType: MediaType) => (mediaType === "tv" ? mockShows : mockMovies);
const mockList = (mediaType: MediaType) => mockSource(mediaType).map(stripMock);
const mockAll = () => [...mockList("movie"), ...mockList("tv")];

function mockPaged(items: Movie[], page = 1, pageSize = 20): Paged<Movie> {
  const start = (page - 1) * pageSize;
  return {
    page,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    results: items.slice(start, start + pageSize),
  };
}

const byPopularity = (a: Movie, b: Movie) => b.popularity - a.popularity;
const byRating = (a: Movie, b: Movie) => b.voteAverage - a.voteAverage;
const byDate = (a: Movie, b: Movie) => b.releaseDate.localeCompare(a.releaseDate);

/** A TMDB list endpoint with a sorted-mock fallback. */
function list(
  mediaType: MediaType,
  path: string,
  sorter: (a: Movie, b: Movie) => number,
  params: Record<string, string | number> = {},
): Promise<Movie[]> {
  return withFallback(
    async () => toPaged(await tmdbFetch<RawPaged>(path, params), mediaType).results,
    () => mockList(mediaType).sort(sorter),
  );
}

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

export const getTrending = () => list("movie", "/trending/movie/day", byPopularity);
export const getPopular = (page = 1) => list("movie", "/movie/popular", byPopularity, { page });
export const getTopRated = () => list("movie", "/movie/top_rated", byRating);
export const getNowPlaying = () => list("movie", "/movie/now_playing", byDate);
export const getUpcoming = () => list("movie", "/movie/upcoming", (a, b) => byDate(b, a));

export const getTrendingTv = () => list("tv", "/trending/tv/day", byPopularity);
export const getPopularTv = () => list("tv", "/tv/popular", byPopularity);
export const getTopRatedTv = () => list("tv", "/tv/top_rated", byRating);
export const getOnTheAirTv = () => list("tv", "/tv/on_the_air", byDate);

/** Movies and series trending today, interleaved. Powers the home hero. */
export function getTrendingAll(): Promise<Movie[]> {
  return withFallback(
    async () => toMixedPaged(await tmdbFetch<RawPaged>("/trending/all/day")).results,
    () => mockAll().sort(byPopularity),
  );
}

export function getGenres(mediaType: MediaType = "movie"): Promise<Genre[]> {
  return withFallback(
    async () => (await tmdbFetch<{ genres: Genre[] }>(`/genre/${mediaType}/list`)).genres,
    () => (mediaType === "tv" ? mockTvGenres : mockGenres),
  );
}

const SORT_PARAMS: Record<MediaType, Record<SortOption, Record<string, string | number>>> = {
  movie: {
    popular: { sort_by: "popularity.desc" },
    top_rated: { sort_by: "vote_average.desc", "vote_count.gte": 1000 },
    newest: { sort_by: "primary_release_date.desc", "vote_count.gte": 50 },
  },
  tv: {
    popular: { sort_by: "popularity.desc" },
    top_rated: { sort_by: "vote_average.desc", "vote_count.gte": 300 },
    newest: { sort_by: "first_air_date.desc", "vote_count.gte": 30 },
  },
};

const MOCK_SORTERS: Record<SortOption, (a: Movie, b: Movie) => number> = {
  popular: byPopularity,
  top_rated: byRating,
  newest: byDate,
};

/** Browse movies or series, optionally filtered by genre. */
export function discover({
  mediaType = "movie",
  genreId,
  sort = "popular",
  page = 1,
}: {
  mediaType?: MediaType;
  genreId?: number | null;
  sort?: SortOption;
  page?: number;
}): Promise<Paged<Movie>> {
  return withFallback(
    async () =>
      toPaged(
        await tmdbFetch<RawPaged>(`/discover/${mediaType}`, {
          ...SORT_PARAMS[mediaType][sort],
          include_adult: "false",
          page,
          ...(genreId ? { with_genres: genreId } : {}),
        }),
        mediaType,
      ),
    () => {
      const filtered = mockList(mediaType).filter((m) => !genreId || m.genreIds.includes(genreId));
      return mockPaged(filtered.sort(MOCK_SORTERS[sort]), page);
    },
  );
}

export async function getByGenre(genreId: number, mediaType: MediaType = "movie"): Promise<Movie[]> {
  return (await discover({ mediaType, genreId })).results;
}

/** Searches movies and series together. */
export function searchMulti(query: string, page = 1): Promise<Paged<Movie>> {
  const q = query.trim();
  return withFallback(
    async () => toMixedPaged(await tmdbFetch<RawPaged>("/search/multi", { query: q, page, include_adult: "false" })),
    () => {
      const needle = q.toLowerCase();
      return mockPaged(
        mockAll().filter(
          (m) => m.title.toLowerCase().includes(needle) || m.overview.toLowerCase().includes(needle),
        ),
        page,
      );
    },
  );
}

// ---------------------------------------------------------------------------
// Details, seasons, episodes
// ---------------------------------------------------------------------------

function mockSeasons(mock: MockMovie): SeasonSummary[] {
  return (mock.seasonEpisodeCounts ?? []).map((count, i) => ({
    seasonNumber: i + 1,
    name: `Season ${i + 1}`,
    episodeCount: count,
    posterPath: mock.posterPath,
    airDate: null,
  }));
}

export function getDetails(mediaType: MediaType, id: number): Promise<MovieDetails> {
  return withFallback(
    async () => {
      const raw = await tmdbFetch<RawDetails>(`/${mediaType}/${id}`, {
        append_to_response: "credits,similar",
      });
      const cast: CastMember[] = (raw.credits?.cast ?? []).slice(0, 15).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      }));
      return {
        ...toMedia(raw, mediaType),
        tagline: raw.tagline ?? "",
        runtime: raw.runtime ?? raw.episode_run_time?.[0] ?? null,
        status: raw.status,
        genres: raw.genres ?? [],
        cast,
        similar: (raw.similar?.results ?? [])
          .map((r) => toMedia(r, mediaType))
          .filter((m) => m.posterPath)
          .slice(0, 10),
        seasons: (raw.seasons ?? [])
          .filter((s) => s.season_number > 0 && s.episode_count > 0)
          .map((s) => ({
            seasonNumber: s.season_number,
            name: s.name,
            episodeCount: s.episode_count,
            posterPath: s.poster_path,
            airDate: s.air_date,
          })),
      };
    },
    () => {
      const found = mockSource(mediaType).find((m) => m.id === id);
      if (!found) throw new Error("Title not found");
      const movie = stripMock(found);
      const genres = mediaType === "tv" ? mockTvGenres : mockGenres;
      return {
        ...movie,
        tagline: "",
        runtime: null,
        status: "Released",
        genres: genres.filter((g) => movie.genreIds.includes(g.id)),
        cast: [],
        similar: mockList(mediaType)
          .filter((m) => m.id !== id && m.genreIds.some((g) => movie.genreIds.includes(g)))
          .slice(0, 10),
        seasons: mockSeasons(found),
      };
    },
  );
}

export const getMovieDetails = (id: number) => getDetails("movie", id);

export function getSeasonEpisodes(tvId: number, seasonNumber: number): Promise<Episode[]> {
  return withFallback(
    async () => {
      const raw = await tmdbFetch<{ episodes: RawEpisode[] }>(`/tv/${tvId}/season/${seasonNumber}`);
      return raw.episodes.map((e) => ({
        id: e.id,
        seasonNumber: e.season_number,
        episodeNumber: e.episode_number,
        name: e.name,
        overview: e.overview,
        stillPath: e.still_path,
        runtime: e.runtime,
        airDate: e.air_date,
        voteAverage: e.vote_average,
      }));
    },
    () => {
      const show = mockShows.find((s) => s.id === tvId);
      const count = show?.seasonEpisodeCounts?.[seasonNumber - 1] ?? 0;
      return Array.from({ length: count }, (_, i) => ({
        id: tvId * 1000 + seasonNumber * 100 + i,
        seasonNumber,
        episodeNumber: i + 1,
        name: `Episode ${i + 1}`,
        overview: show?.overview ?? "",
        stillPath: show?.backdropPath ?? null,
        runtime: null,
        airDate: null,
        voteAverage: 0,
      }));
    },
  );
}

// ---------------------------------------------------------------------------
// Videos / trailer resolution
// ---------------------------------------------------------------------------

async function getVideos(path: string): Promise<TrailerVideo[]> {
  const raw = await tmdbFetch<{ results: RawVideo[] }>(path);
  return raw.results
    .filter((v) => v.site === "YouTube")
    .map((v) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      site: v.site,
      type: v.type,
      official: v.official,
      publishedAt: v.published_at,
    }));
}

export const getMovieVideos = (id: number) => getVideos(`/movie/${id}/videos`);

/** Picks the best trailer: official Trailer → any Trailer → Teaser. */
export function pickTrailer(videos: TrailerVideo[]): TrailerVideo | undefined {
  return (
    videos.find((v) => v.type === "Trailer" && v.official) ??
    videos.find((v) => v.type === "Trailer") ??
    videos.find((v) => v.type === "Teaser")
  );
}

const PLAYABLE_TYPES = ["Trailer", "Teaser", "Clip", "Featurette", "Opening Credits"];

/** Season videos first, then series videos; rotates per episode for variety. */
async function pickEpisodeVideo(tvId: number, episode: EpisodeRef): Promise<TrailerVideo | undefined> {
  const [seasonVideos, showVideos] = await Promise.all([
    getVideos(`/tv/${tvId}/season/${episode.season}/videos`).catch(() => []),
    getVideos(`/tv/${tvId}/videos`),
  ]);
  const rank = (v: TrailerVideo) => PLAYABLE_TYPES.indexOf(v.type);
  const pool = [...seasonVideos, ...showVideos]
    .filter((v) => rank(v) !== -1)
    .sort((a, b) => rank(a) - rank(b));
  return pool.length ? pool[(episode.episode - 1) % pool.length] : undefined;
}

/**
 * Resolves what the player should play. In Phase 1 the trailer stands in for
 * the real stream. Fallback chain (CLAUDE.md): TMDB YouTube video → mock
 * trailer key → HLS test stream. The player falls back to the local MP4 last.
 */
export async function getTrailerSource(
  media: Pick<Movie, "mediaType" | "id">,
  episode?: EpisodeRef,
): Promise<PlayerSource> {
  try {
    const video =
      media.mediaType === "tv"
        ? await pickEpisodeVideo(media.id, episode ?? { season: 1, episode: 1 })
        : pickTrailer(await getMovieVideos(media.id));
    if (video) return { kind: "youtube", key: video.key };
  } catch {
    const mockKey = mockSource(media.mediaType).find((m) => m.id === media.id)?.trailerKey;
    if (mockKey) return { kind: "youtube", key: mockKey };
  }
  return { kind: "hls", url: HLS_TEST_STREAM };
}
