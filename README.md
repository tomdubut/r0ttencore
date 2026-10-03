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
- The website only reads **published** content. Publishing in the Studio doesn't rebuild the site yet (rebuild webhook: phase 5); until then, redeploy from Cloudflare.

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
