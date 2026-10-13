# MSW

The public movie site. It shows **only what is uploaded to Spool** (the admin/upload site, a separate repo).

## Deploy on Vercel (free)

Full guide, including Spool, R2, Redis and the worker: `docs/deploy-free.md` in the Spool repo.
For this site:

1. vercel.com → **Add New… → Project** → import this repo (root directory = the repo root, preset Next.js).
2. Environment variables:
   - `NEXT_PUBLIC_TMDB_API_KEY`: your TMDB v3 key (the same as in `.env.local`)
   - `NEXT_PUBLIC_SPOOL_API_URL`: Spool's live address, e.g. `https://spool-abc123.vercel.app` (no trailing slash)
3. **Deploy.** Every `git push` redeploys. `NEXT_PUBLIC_*` values are baked in at build time, so after changing
   one, use **Redeploy**.

## Content comes from Spool

MSW shows **only what's uploaded to [Spool](../MSW_admin)** (a separate project, the admin/upload site):

- **Movies:** Spool uploads linked to a TMDB movie. MSW shows them with TMDB's poster, backdrop,
  overview, genres and cast, and **Play** streams the uploaded file. Home, **Movies**, search and
  My List only ever contain these. Any other TMDB title says "isn't available on MSW".
- **Creators:** Spool uploads that aren't linked to a movie ("Fresh from Creators" row, `/spool`).

To add a movie: upload it in Spool, pick the movie in **Link to TMDB**, and wait for it to finish
processing. It appears here within about a minute.

### Run it

1. Start Spool (in `D:\Work Folder\MSW_admin`): `docker compose up -d`, then `cd web` and `npm run dev`
   (port 3000).
2. In this folder, make sure `.env.local` has `NEXT_PUBLIC_SPOOL_API_URL=http://localhost:3000`
   (see `.env.example`) and your TMDB key (`NEXT_PUBLIC_TMDB_API_KEY`).
3. `npm run dev` here (port **3001**) and open http://localhost:3001.

If Spool isn't reachable, the site is empty ("No movies yet").
