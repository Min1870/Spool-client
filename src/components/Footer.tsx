import Link from "next/link";
import { footerLinks, siteName } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className="gutter mt-20 border-t border-line pb-10 pt-12 text-sm text-muted">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="font-display text-2xl font-extrabold">
          <span className="text-gradient-brand">{siteName}</span>
        </Link>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          {footerLinks.map((label) => (
            <li key={label}>
              <span className="cursor-default transition hover:text-white">{label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/40">
          Movies stream from Spool. Movie details and images come from the TMDB API; this product is not
          endorsed or certified by TMDB. Trailers are streamed from their official YouTube sources.
        </p>
        <p className="mt-2 text-xs text-white/40">© {new Date().getFullYear()} {siteName}.</p>
      </div>
    </footer>
  );
}
