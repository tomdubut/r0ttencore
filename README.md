# r0t — r0ttencore.com

Website of **r0t**, a curatorial project by the r0ttencore collective (Paris · Tokyo · Beijing).

- Project brief and rules: [`CLAUDE.md`](CLAUDE.md)
- Build phases: [`docs/build-plan.md`](docs/build-plan.md)
- Approved mockups and brand deck: [`design-reference/`](design-reference/README.md)

## Stack

- [Astro](https://astro.build), static output only: `npm run build` produces plain files in `dist/` that any host can serve.
- Content: Sanity (from phase 2). Until then, placeholder content lives in `src/data/mock.ts`.
- Hosting: Cloudflare Workers with static assets (`wrangler.jsonc` is the only host-specific file).

## Run it locally

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + build into dist/
npm run preview   # serve the built site
```

## Where things are

```
src/
  layouts/BaseLayout.astro   page shell: <head>, fonts, footer
  components/                Header, Footer, Logo, Media (image | YouTube | placeholder), …
  pages/                     /, /events, /events/[slug], /about, 404
  lib/content.ts             the only place pages get content from (mock now, Sanity later)
  lib/types.ts               content types (mirror the Sanity schemas)
  data/mock.ts               phase 1 placeholder content
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
