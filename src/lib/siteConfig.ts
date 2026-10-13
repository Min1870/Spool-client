export const siteName = "MSW";

/**
 * MSW only shows what's uploaded to Spool: movies (with TMDB details) and creator videos.
 * There's no Series section, because Spool links uploads to movies only for now.
 */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/spool", label: "Creators" },
  { href: "/my-list", label: "My List" },
] as const;

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
