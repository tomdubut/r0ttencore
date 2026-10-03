# r0t website — build plan

One phase per session. Each phase starts with a plan that Tom approves, runs on its own branch, and ends with a Cloudflare preview URL to review before merging to `main`.
Decisions and design rules live in `/CLAUDE.md`.

---

## Phase 1: Base

**Goal**: the site skeleton, deployed, with placeholder content that matches the mockups.

- Astro project (static output), TypeScript, plain CSS with design tokens (custom properties). No UI framework unless a need appears.
- Self-hosted fonts via Fontsource (Anton, Archivo Black, Archivo, JetBrains Mono), with preload for the display fonts.
- Design system: tokens, type scale (`clamp()` from 390 → 1440), grid, pills, buttons, grain overlay, arrows, play button, section dark/light variants.
- Shared components: `Logo` (single swap point for the future SVG), `Header` (desktop and mobile with menu overlay, NEXT pill shown only if an upcoming event exists), `Footer` (from homepage-D-hybrid + mobile version), `GenreTicker`, `VideoFacade`, `ResponsiveImage`.
- 4 page templates with `[PLACEHOLDER]` content from a local mock data file shaped like the future Sanity data: `/`, `/events`, `/events/[slug]`, `/about`. Also a 404 page.
- Events listing city filter: progressive enhancement (all events visible without JS).
- `prefers-reduced-motion` handling from the start.
- Cloudflare: Worker with static assets connected to the GitHub repo (Workers Builds), production = `main`, preview URLs for branches. First deploy on the `*.workers.dev` URL.
- `README.md`: how to run, build and deploy.

**Done when**: the 4 pages match the mockups on desktop and phone width on a preview URL, with no invented content.

## Phase 2: Sanity

**Goal**: all content comes from Sanity; the co-founder could edit it.

- Embedded or standalone Studio (decide at phase start; standalone hosted on `*.sanity.studio` keeps the site 100% static).
- Schemas: `event`, `siteSettings` (singleton), `aboutPage` (singleton), per `/CLAUDE.md` §5, refined with Tom first.
- Studio UX: labels, help text on every field, validation, dropdowns, ordered lists, singleton structure, previews, a simple desk structure (Events / Settings / About).
- Media library plugin (search, tags, usage). Check compatibility with the current Studio version first.
- Deploy schema; GROQ queries; typed data layer; build-time fetch (published content only, CDN API).
- Replace mock data on all pages; image pipeline via `@sanity/image-url` (format auto, srcset, hotspot/crop respected).
- Hero loop: stored in Sanity, copied into the build output at build time so it is served from Cloudflare (to be confirmed, see Open questions).

**Done when**: changing a field in Studio and rebuilding updates the preview site.

## Phase 3: Real content

**Goal**: the two Paris events and the Tokyo announcement are live in the content.

- Enter events 01 and 02 (Paris): titles, dates, venues, line-ups, texts, credits.
- Upload and order photo galleries with alt text; cover images.
- Aftermovies and clips on YouTube/Vimeo, linked in Sanity.
- Tokyo event (03) as `upcoming`, with ticket link when available.
- About page content from the deck; Formats photos; Network photo (final resolution).
- Final logo (SVG) and hero loop (desktop + vertical + poster, < 3 MB each).

**Done when**: no `[PLACEHOLDER]` text remains on any public page (or every remaining one is approved).

## Phase 4: Polish, performance, SEO, accessibility

- Mobile polish on real devices (iOS Safari, Android Chrome); fix layout edge cases with real text lengths.
- Lighthouse mobile ≥ 90 on all 4 templates; image sizes, font loading, CLS, JS weight.
- SEO: titles/descriptions, canonical, Open Graph/Twitter cards, schema.org `Event` JSON-LD, `sitemap.xml`, `robots.txt`, favicon set, web manifest.
- Accessibility audit: keyboard paths (menu, slideshow, filters, video facades), focus styles, contrast, screen-reader labels, reduced motion.

**Done when**: audits pass and Tom has reviewed on his phone.

## Phase 5: Go live

- Sanity webhook (publish/unpublish/delete on `event`, `siteSettings`, `aboutPage`) → Cloudflare Workers Builds deploy hook for `main`.
- Domain `r0ttencore.com` on Cloudflare: add only the web records (apex + `www`, redirect `www` → apex or the reverse). **Do not touch MX / mail TXT records (Hostinger email).** Check that email still works after the change.
- Invite the co-founder to Sanity (editor role) and test an edit end-to-end.
- One-page editor guide for the co-founder (how to add an event, photos, videos, announce the next one).
- Final checks: 404, redirects, sitemap submitted to Google Search Console.

**Done when**: r0ttencore.com serves the site, publishing in Studio updates it automatically, and email still works.

---

## Open questions

To answer before or during the phase that needs them.

1. **Homepage hero video and ticker** (phase 1): the chosen homepage A has no video hero and no genre ticker; both exist only in homepage D. Where should they appear on A? (Options: video loop in place of the ASCII cup or as the hero background; ticker between the hero and the NEXT EVENT strip.)
2. **Homepage mobile** (phase 1): the only mobile mockup is the dark homepage D. Should mobile A stay light (adapting A's sections), or use D's dark video hero on mobile?
3. **Homepage A header** (phase 1): A's header is the text wordmark + nav + "2026", with no logo image and no NEXT pill, unlike the other pages. Use A's header as drawn, or the shared header (logo + nav + NEXT pill)?
4. **Dark/light alternation on homepage A** (phase 1): A's "ARCHIVE" and "WHAT IS r0t?" sections are both light, which breaks the alternation rule. Keep A as drawn, or make one of them dark?
5. **Upcoming event page** (phase 1): E2 is designed for a past event (photos, videos, credits). What does `/events/<tokyo>` show before the event? Proposal: same hero with line-up + TICKETS button instead of the vertical aftermovie, and photo/video sections hidden.
6. **Aftermovie formats** (phase 2): E2 shows a vertical 9:16 aftermovie in the hero and a 16:9 aftermovie in VIDEOS. Do we need two aftermovie fields (vertical + horizontal)? If there is only one, what goes in the hero?
7. **Clip durations** (phase 2): E2 shows durations next to clips. A static site can't read them from YouTube/Vimeo without an API key, so either an optional manual field or drop them.
8. **NEXT pill target** (phase 1): link to the upcoming event page, or straight to the ticket link? (Mobile footer says "NEXT: TOKYO — TICKETS ↗".)
9. **Hero loop storage** (phase 2): the brief stores it in `siteSettings` (Sanity file) but also says videos are never uploaded to Sanity. Proposal: allow this one exception in Sanity (editable), copied into the static build at build time so visitors download it from Cloudflare, not Sanity's bandwidth quota.
10. **Mockup UI copy not in the deck** (phase 1): "NEVER MISS THE NEXT ONE.", "THE NIGHT", "SCROLL — ARCHIVE", "PLAYING — REEL 2026", the empty-state lines ("Beijing is next on the map…"). Are these approved? Proposal: short UI labels approved as drawn; sentences become editable in Sanity.
11. **About copy vs deck** (phase 2): the deck's NETWORK slide has a 4th paragraph and the Formats card is "CREATIVE COLLABORATIONS"; the mockup has 3 paragraphs and "COLLABORATIONS". Which is right? ("Launching in 2026." from the deck is outdated and is left out.)
12. **Body font** (phase 1): the deck's body text is Public Sans Bold; the mockups use Archivo. Brief says Archivo: confirm.
13. **Studio location** (phase 2): standalone Studio on `r0t.sanity.studio` (simplest, keeps site static) vs embedded at `/studio` (needs client-side app in the site). Recommendation: standalone.
