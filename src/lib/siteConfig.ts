import {
  getByGenre,
  getNowPlaying,
  getOnTheAirTv,
  getPopular,
  getPopularTv,
  getTopRated,
  getTopRatedTv,
  getUpcoming,
} from "./tmdb";
import type { HomeRowConfig, SortOption } from "./types";

export const siteName = "MSW";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "Series" },
  { href: "/spool", label: "Creators" },
  { href: "/my-list", label: "My List" },
] as const;

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "top_rated", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

/** Rows rendered on the home page, in order, after the hero and Top 10s. */
export const homeRows: HomeRowConfig[] = [
  { id: "popular", title: "Popular Movies", href: "/movies?sort=popular", load: () => getPopular() },
  { id: "popular-tv", title: "Binge-Worthy Series", eyebrow: "Series", href: "/tv", load: getPopularTv },
  { id: "now-playing", title: "New Releases", load: getNowPlaying },
  { id: "top-rated", title: "Critically Acclaimed", href: "/movies?sort=top_rated", load: getTopRated },
  { id: "on-air-tv", title: "New Episodes Weekly", eyebrow: "Series", load: getOnTheAirTv },
  { id: "action", title: "Adrenaline Rush", href: "/movies?genre=28", load: () => getByGenre(28) },
  { id: "top-tv", title: "Prestige TV", eyebrow: "Series", href: "/tv?sort=top_rated", load: getTopRatedTv },
  { id: "upcoming", title: "Coming Soon", load: getUpcoming },
  { id: "scifi", title: "Sci-Fi & Fantasy", href: "/movies?genre=878", load: () => getByGenre(878) },
  { id: "animation", title: "Animated Adventures", href: "/movies?genre=16", load: () => getByGenre(16) },
];

export const footerLinks = [
  "Audio Description",
  "Help Center",
  "Gift Cards",
  "Media Center",
  "Terms of Use",
  "Privacy",
  "Cookie Preferences",
  "Contact Us",
] as const;
