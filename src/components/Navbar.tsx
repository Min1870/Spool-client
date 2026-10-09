"use client";

import clsx from "clsx";
import { Bell, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks, siteName } from "@/lib/siteConfig";

const SEARCH_DEBOUNCE_MS = 350;

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteName} home`}
      className={clsx("font-display text-2xl font-extrabold tracking-tight sm:text-3xl", className)}
    >
      <span className="text-gradient-brand">{siteName}</span>
      <span className="text-brand-red">.</span>
    </Link>
  );
}

function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const onSearchPage = pathname === "/search";

  // Box state is tagged with the page it was typed on. Once the user leaves
  // /search (e.g. clicks a result) it resets instead of following them around.
  const [box, setBox] = useState({ query: "", open: false, path: pathname });
  const stale = box.path !== pathname && !onSearchPage;
  const query = stale ? "" : box.query;
  const open = stale ? false : box.open;
  const update = (next: Partial<{ query: string; open: boolean }>) =>
    setBox({ query, open, ...next, path: pathname });

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Debounced navigation, triggered only by typing — never by route changes.
  const onType = (value: string) => {
    update({ query: value });
    window.clearTimeout(timer.current);
    const q = value.trim();
    if (!q) return;
    timer.current = window.setTimeout(() => {
      const url = `/search?q=${encodeURIComponent(q)}`;
      if (onSearchPage) router.replace(url, { scroll: false });
      else router.push(url);
    }, SEARCH_DEBOUNCE_MS);
  };

  const expand = () => {
    update({ open: true });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        window.clearTimeout(timer.current);
        const q = query.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className={clsx(
        "flex items-center overflow-hidden rounded-full border transition-all duration-300",
        open ? "w-44 border-white/30 bg-black/60 sm:w-64" : "w-9 border-transparent",
      )}
    >
      <button
        type="button"
        aria-label="Search"
        onClick={() => (open ? inputRef.current?.focus() : expand())}
        className="grid size-9 shrink-0 place-items-center"
      >
        <Search className="size-5" aria-hidden />
      </button>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => onType(e.target.value)}
        onBlur={() => !query && update({ open: false })}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            window.clearTimeout(timer.current);
            update({ query: "", open: false });
            inputRef.current?.blur();
          }
        }}
        placeholder="Movies, series, genres"
        aria-label="Search movies and series"
        tabIndex={open ? 0 : -1}
        className="w-full min-w-0 bg-transparent pr-3 text-sm outline-none placeholder:text-white/50 [&::-webkit-search-cancel-button]:hidden"
      />
    </form>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || menuOpen
          ? "bg-ink/95 shadow-lg shadow-black/40 backdrop-blur-md"
          : "bg-linear-to-b from-black/80 to-transparent",
      )}
    >
      <nav aria-label="Main" className="gutter flex h-16 items-center gap-6 lg:h-[72px]">
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="-ml-1 grid size-9 place-items-center md:hidden"
        >
          {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>

        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={clsx(
                  "relative rounded-md px-3 py-2 text-sm transition",
                  isActive(link.href) ? "font-semibold text-white" : "text-white/70 hover:text-white",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="bg-gradient-brand absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <SearchBox />
          <button type="button" aria-label="Notifications" className="hidden size-9 place-items-center sm:grid">
            <Bell className="size-5" aria-hidden />
          </button>
          <span
            aria-hidden
            className="bg-gradient-brand grid size-8 place-items-center rounded-md text-sm font-bold"
          >
            M
          </span>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="gutter animate-fade-in space-y-1 border-t border-line pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={clsx(
                  "block rounded-md px-3 py-3 text-base",
                  isActive(link.href) ? "bg-white/10 font-semibold" : "text-white/75",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
