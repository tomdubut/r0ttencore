# Phase 2 plan — Sanity

Status: **approved**. Decisions: 1 → A (Sanity image CDN), 2 → `r0ttencore.sanity.studio`, 3 → co-founder Administrator. Deploy token added as GitHub secret `SANITY_AUTH_TOKEN`. Rules: `/CLAUDE.md`. Phases: `docs/build-plan.md`.

## Goal

All content comes from Sanity. Tom and the co-founder can edit everything in a simple English Studio at `<name>.sanity.studio`; a rebuild of the site shows the changes. Includes the artist pages (they change how line-ups are stored).

## Findings that shape the plan

| Finding | Consequence |
|---|---|
| Current Studio = v6; `sanity-plugin-media` 6.3 supports it (updated Sept 2026) | Media library plugin: search, tags, "where is this image used". |
| The Sanity connector can only deploy a basic Studio (no custom structure, plugins or previews) | The Studio is real code in `studio/`, deployed with the Sanity CLI. Needs a **deploy token** (see "Needs from Tom"). |
| Dataset is public | The site reads published content **without any token**: no secret in Cloudflare or in the code. |
| **Free plan: hard caps, no overage.** 100 GB bandwidth / month, 100 GB assets, 10,000 documents, 1M CDN requests, 20 seats | If bandwidth runs out, **images stop loading on the site** until the 1st of next month. See decision 1. |
| **Free plan roles: only Administrator and Viewer** | The co-founder must be an **Administrator** to edit. Admins can also delete content, so we add an automatic backup (phase 5). |

## Repository layout

```
/                 the website (unchanged location: Cloudflare keeps building "/")
studio/           Sanity Studio, own package.json
  schemaTypes/
    documents/    event, artist, homePage, aboutPage, siteSettings
    objects/      media, credit, galleryImage, video, link, seo
  structure.ts    sidebar: Settings · Homepage · About | Events (Upcoming / Past) · Artists
  sanity.config.ts, sanity.cli.ts
.github/workflows/deploy-studio.yml   deploys the Studio when studio/ changes on main
```

Recommended by Sanity's own rules (Studio standalone in the same repo, not embedded in the site).

## Content model

Field lists are in `CLAUDE.md` §5. Every field gets a clear English label, a one-line help text, validation, and sensible defaults.

- **media** (object): radio *Image / YouTube video*; only the chosen type's fields show. Image: hotspot/crop + required alt text. YouTube: URL (validated) + optional poster.
- **event**: title, slug (generated from title), number, city (dropdown), date, venue, status (dropdown), ticket link, cover image, hero media, gallery (drag to reorder), videos, **line-up = picked artists** (create a new artist inline from the picker), text, credits (Photos / Video / Location, several people), SEO.
- **artist**: name, slug, based in, genres (from the settings list), description, portrait (media), work (media list), Instagram, **"Show artist page"** switch (off by default).
- **homePage / aboutPage / siteSettings**: singletons, with fixed IDs. They can't be duplicated or deleted, and each opens directly from the sidebar.
- Studio list previews show the cover image, "02 · PARIS · date", and an UPCOMING/PAST badge, so the editor can find things.

## Website changes

- `src/lib/content.ts` keeps the same functions; the inside switches from `src/data/mock.ts` to Sanity queries (`@sanity/client`, GROQ, published content only). Pages barely change.
- Images: `@sanity/image-url` → responsive `srcset` (WebP/AVIF, sizes per slot, hotspot respected, width/height from the asset metadata, lazy below the fold).
- Line-ups render picked artists; names link to `/artists/<slug>/` only when the page is switched on, else to Instagram.
- New pages: `/artists/` (city filter) and `/artists/<slug>/` (hero with name + portrait, work slideshow, videos, "events with r0t"). Same design language, screenshots for approval. Not linked in the header.
- Sample texts not in the deck become siteSettings fields (start as `[PLACEHOLDER]`).
- `src/data/mock.ts` is deleted at the end; its content is seeded into Sanity instead.
- TypeGen: types generated from the schemas + queries, so a renamed field breaks the build instead of silently emptying the page.

## Seeding

After the first Studio deploy, I create the documents through the Sanity connector: deck copy (home, about, genres), events 01/02/03, and the four placeholder artists, all with `[PLACEHOLDER]` text exactly as today. The site should look identical before and after the switch. That's the test that the connection works.

## Checks before each push

`astro check` + build, Studio build (`sanity build`), screenshots of every page at 390 / 1440 compared with phase 1, artist pages screenshots for approval, keyboard pass, Lighthouse mobile ≥ 90.

## Not in phase 2

Rebuild-on-publish webhook, daily rebuild and backups (phase 5). Real content (phase 3). SEO tags (phase 4). Contact form (postponed, H2).

## Commits (indicative)

1. Studio scaffold (`studio/`), config, structure, deploy workflow
2. Schemas: objects
3. Schemas: documents + previews + validation
4. Media plugin
5. Seed content (via connector) + site data layer (client, queries, TypeGen, images)
6. Pages switched to Sanity, mock removed
7. Artist listing + artist page
8. Docs: README (Studio section), CLAUDE.md updates

## Decisions needed from Tom

1. **How the site's images are delivered** (because of the free-plan bandwidth cap):
   - **A. From Sanity's image CDN** (current decision). Simplest, and builds stay fast. 100 GB/month covers roughly 30,000 visits of a few photo-heavy pages each, which is far above a small collective's normal traffic. The risk: a viral moment could hit the cap and images would disappear until the 1st. Sanity emails at 80%. All images go through one helper, so switching to B later is a contained change.
   - **B. Downloaded and optimized at build time, served by Cloudflare** (unlimited bandwidth; images live inside the static build, which also makes the site fully portable). Costs: slower builds as galleries grow (every photo processed in every build), more moving parts, and Cloudflare's free limit of 20,000 files per deploy.
   - **Recommendation: A now**, with the escape hatch documented. Revisit if traffic grows.
2. **Studio address**: `<name>.sanity.studio`. Suggestions: `r0t`, `r0ttencore`, `r0ttencore-studio` (must be free globally).
3. **Co-founder as Administrator** (the only editing role on the free plan): OK, with backups added in phase 5?

## Needs from Tom

- A **Sanity deploy token**: sanity.io/manage → project r0ttencore → API → Tokens → *Add token*, permission **Deploy Studio**. Save it as a **GitHub secret** named `SANITY_AUTH_TOKEN`: repo → Settings → Secrets and variables → Actions → *New repository secret*. Never paste it in chat.
