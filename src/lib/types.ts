export interface Genre {
  id: number;
  name: string;
}

export type MediaType = "movie" | "tv";

/** A movie or TV series. TV titles map name → title, first_air_date → releaseDate. */
export interface Movie {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  popularity: number;
  originalLanguage: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface SeasonSummary {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  posterPath: string | null;
  airDate: string | null;
}

export interface Episode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  runtime: number | null;
  airDate: string | null;
  voteAverage: number;
}

export interface MovieDetails extends Movie {
  tagline: string;
  runtime: number | null;
  genres: Genre[];
  status: string;
  cast: CastMember[];
  similar: Movie[];
  /** TV only: seasons (specials excluded). Empty for movies. */
  seasons: SeasonSummary[];
}

/** A YouTube video entry from TMDB's /movie/{id}/videos endpoint. */
export interface TrailerVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt: string;
}

export type PlayerSource =
  | { kind: "youtube"; key: string }
  | { kind: "hls"; url: string }
  | { kind: "mp4"; url: string };

export type PlayerSourceKind = PlayerSource["kind"];

/** Mock entries carry a trailer key so playback works without the API. */
export interface MockMovie extends Movie {
  trailerKey: string | null;
  /** TV only: episodes per season, used to synthesize seasons offline. */
  seasonEpisodeCounts?: number[];
}

/** Which episode is playing; absent for movies. */
export interface EpisodeRef {
  season: number;
  episode: number;
}

export interface Paged<T> {
  page: number;
  totalPages: number;
  results: T[];
}

export interface WatchProgress {
  movie: Movie;
  /** TV only: the episode this progress belongs to. */
  episode?: EpisodeRef & { name?: string };
  /** Seconds into the trailer. */
  position: number;
  /** Total trailer length in seconds. */
  duration: number;
  updatedAt: number;
}

export interface UserWatchState {
  watchlist: Movie[];
  /** Keyed by mediaKey(), e.g. "movie:550" / "tv:1399". */
  progress: Record<string, WatchProgress>;
}

export type SortOption = "popular" | "top_rated" | "newest";

export interface Collection {
  id: string;
  name: string;
  tagline: string;
  genreId: number;
  /** Tailwind gradient classes for the tile overlay. */
  gradient: string;
}

export interface HomeRowConfig {
  id: string;
  title: string;
  href?: string;
  eyebrow?: string;
  load: () => Promise<Movie[]>;
}
