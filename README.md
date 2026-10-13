This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
