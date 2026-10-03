# r0t — r0ttencore.com

Website of **r0t**, a curatorial project by the r0ttencore collective (Paris · Tokyo · Beijing).

- Project brief and rules: [`CLAUDE.md`](CLAUDE.md)
- Build phases: [`docs/build-plan.md`](docs/build-plan.md)
- Approved mockups and brand deck: [`design-reference/`](design-reference/README.md)

## Stack

- [Astro](https://astro.build), static output only: `npm run build` produces plain files in `dist/` that any host can serve.
- Content: Sanity (project `suitidnh`, dataset `production`), read at build time. Editors use the Studio at https://r0ttencore.sanity.studio (code in `studio/`).
- Hosting: Cloudflare Workers with static assets (`wrangler.jsonc` is the only host-specific file).

## Run it locally

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + build into dist/
npm run preview   # serve the built site
```

## Sanity Studio (`studio/`)

```bash
cd studio
npm install
npm run dev       # local Studio at http://localhost:3333 (log in with your Sanity account)
npm run typegen   # after changing a schema or a query in src/lib/queries.ts
```

- Schemas: `studio/schemaTypes/` (documents: event, artist, homePage, aboutPage, siteSettings; objects: media, video, credit, seo).
- Sidebar: `studio/structure.ts`. Settings, Homepage and About are single pages (fixed IDs, can't be deleted or duplicated).
- Deploy: automatic via GitHub Actions (`.github/workflows/deploy-studio.yml`) when `studio/` changes, using the repo secret `SANITY_AUTH_TOKEN` (Sanity project token with the *Deploy Studio* permission only).
- The website only reads **published** content.

## Publishing → live site

The site is static: every **Publish** in the Studio triggers a rebuild, live about 2–3 minutes later.

- Sanity webhook (sanity.io/manage → API → Webhooks): Create/Update/Delete, drafts **off**, filter `_type in ["event", "artist", "homePage", "aboutPage", "siteSettings"]`, POST to `https://api.github.com/repos/tomdubut/r0ttencore/dispatches`, projection `{"event_type": "sanity-publish"}`, headers `Accept: application/vnd.github+json` and `Authorization: Bearer <GitHub token>` (fine-grained token, this repo only, Contents read/write; renew before it expires).
- That starts `.github/workflows/deploy-content.yml` (Actions → Deploy content): `npm ci`, `npm run build`, `wrangler deploy` (repo secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). The same workflow runs daily at 00:15 UTC; manual run: Actions → Deploy content → Run workflow.
- Why not a Cloudflare deploy hook: Cloudflare's build service sometimes fails to start, and publishes were lost silently. Here each publish is a run with logs, and GitHub emails on failure.
- A failed run keeps the previous version online.
- Several publishes in a row are merged into one or two runs (one running, one waiting); the last run always includes everything published.

## Where things are

```
src/
  layouts/BaseLayout.astro   page shell: <head>, fonts, footer
  components/                Header, Footer, Logo, Media (image | YouTube | placeholder), …
  pages/                     /, /events, /events/[slug], /artists, /artists/[slug], /about, 404
  lib/content.ts             the only place pages get content from (Sanity → page types)
  lib/queries.ts             GROQ queries (types generated into src/sanity.types.ts)
  lib/image.ts               Sanity image URLs: srcset + focal point (only place images are built)
  lib/types.ts               page content types
  styles/tokens.css          colors, fonts, fluid type scale (from the mockups)
  styles/base.css            reset, section themes (dark / light / black), utilities
  scripts/                   small vanilla scripts (YouTube facade, filters, slideshow, fade-in)
public/
  brand/logo-cup.png         logo placeholder — swap here (and in components/Logo.astro)
  textures/                  grain textures from the deck
```

## Content rules

Text in `[BRACKETS]` is a placeholder. Never replace it with invented content: real text comes from the brand deck or from Sanity.

## Deploy

Cloudflare builds the repo on every push (Workers Builds):

- build command: `npm run build`
- deploy command: `npx wrangler deploy`
- `main` → production; other branches → preview URLs.
