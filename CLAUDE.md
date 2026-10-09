# Project Guidelines: Streaming Platform (UI-First & TMDB Strategy)

## 🎯 Development Philosophy
We are building this application using a **Frontend-First / Static & API Mock** approach split into two distinct phases:

- **Phase 1 (Current):** Build pixel-perfect UI components, responsive movie grids, hero banners, and interactive state using client-side TMDB API calls, official movie trailers for video testing, and local mock state.
- **Phase 2 (Future):** Build backend API routes, Supabase/PostgreSQL database integration, authentication, and custom video streaming infrastructure (Mux/Cloudflare Stream).

---

## 🛠️ Tech Stack & Standards
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons (`lucide-react`)
- **State Management:** React local state (`useState`, `useContext`) or Zustand for client UI state (e.g., active modals, local watchlists).
- **Video Player (Trailer Testing):** 
  - Official Movie Trailers fetched via TMDB Videos API (embedded via YouTube iFrame player or HTML5 `<video>` tag).
  - Optional fallback to public HLS trailer streams (`.m3u8`) or local static `.mp4` samples.

---

## 🎬 Data & Media Rules (TMDB + Trailer Streaming Strategy)

### 1. Movie Metadata & Trailers (TMDB API)
- Fetch real movie posters, backdrop banners, titles, overviews, and ratings directly on the client side using `/src/lib/tmdb.ts`.
- **API Key:** Environment variable `NEXT_PUBLIC_TMDB_API_KEY`.
- **Video Trailer Testing Strategy:**
  - Query TMDB's `/movie/{id}/videos` endpoint to retrieve official trailer YouTube keys (`key` property).
  - Use trailer URLs/keys as the primary source for testing the Video Player component (`VideoPlayerModal.tsx`).
  - Fallback sequence if no TMDB trailer exists: Public HLS trailer test stream (`https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`) $\rightarrow$ Static local MP4 placeholder.

### 2. Local Fallback Data (`/src/lib/mockData.ts`)
- Use a local mock array featuring trailer streams as a fallback whenever the TMDB API key is missing or offline.
- Do not write inline hardcoded data inside component JSX. Always import from `mockData.ts` or `tmdb.ts`.

### 3. Static Media Assets
- Store local static fallbacks in `/public/images/` or `/public/posters/`.
- Use Next.js `<Image />` components with proper `sizes` and `aspect-ratio` utility classes.

---

## 🎨 Component Architecture & UI Standards

### Core UI Modules
1. `Navbar.tsx` – Sticky header with logo, navigation links, and client-side search filtering.
2. `HeroBanner.tsx` – Dynamic top banner displaying featured movie backdrops, metadata, and "Play Trailer" / "More Info" buttons.
3. `MovieGrid.tsx` – Responsive grid layout (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`) rendering poster cards with loading skeletons.
4. `MovieCard.tsx` – Poster card featuring rating badge, hover scaling, and quick-action play controls.
5. `VideoPlayerModal.tsx` – Modal overlay hosting a video/trailer player driven by client state.

### Client State & Interactivity
- Implement **Watchlist** and **Continue Watching** UI state using `localStorage` or React Context to allow full visual interaction without backend calls.
- Always include loading skeletons (`Skeleton.tsx`) and graceful error boundaries for async data components.

---

## 💻 Claude Code Rules of Engagement

When executing tasks in this repository, Claude Code must follow these operational constraints:

1. **Strictly No Backend Execution:** Do not create database migration files, SQL schemas, API endpoints (`/app/api/...`), or database clients (`@supabase/supabase-js`) during Phase 1.
2. **Client-First Data Fetching:** Fetch TMDB data and trailer video IDs directly in React Client Components or client helper modules.
3. **Trailer Playback Focus:** Ensure video player UI elements (Play, Pause, Progress Bar, Fullscreen, Volume) interact properly with trailer sources during Phase 1 testing.
4. **TypeScript First:** Maintain strict TypeScript interfaces (`Movie`, `Genre`, `TrailerVideo`, `UserWatchState`) across all components and utility functions.
5. **Responsive Design:** Ensure every visual component is fully responsive across mobile, tablet, and desktop viewports using Tailwind classes.

---

## 🎞️ Spool integration (creator uploads)

MSW also shows videos uploaded on **Spool** (the sibling project at `D:\Work Folder\MSW_admin`),
next to the TMDB catalogue: the "Fresh from Creators" home row, `/spool` (all creator videos)
and `/spool/[id]` (full-screen player).

- Data comes from Spool's **public API** only, fetched in the browser (fits the client-first rule):
  `GET {NEXT_PUBLIC_SPOOL_API_URL}/api/videos?limit=…` and `/api/videos/{id}`. No keys, no backend,
  no Supabase client here. Spool sends CORS headers, so the browser may call it from this site.
- Playback: the API returns an HLS `hlsUrl` (480p + 720p). Play it with `{ kind: "hls", url }`
  in `VideoPlayer` (hls.js). Spool thumbnails use a plain `<img>` because their host is environment-specific.
- All Spool code lives in `src/lib/spool.ts`, `src/components/SpoolCard.tsx`, `src/components/SpoolRow.tsx`
  and `src/app/spool/`. If Spool is unconfigured or offline, Spool sections hide themselves; the rest
  of the site must keep working.
- Ports: Spool's web app runs on **3000**, MSW on **3001** (`npm run dev`).
