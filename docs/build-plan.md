# r0t website — build plan

One phase per session. Each phase starts with a plan that Tom approves, runs on its own branch, and ends with a Cloudflare preview URL to review before merging to `main`.
Decisions and design rules live in `/CLAUDE.md`.

---

## Phase 1: Base

**Goal**: the site skeleton, deployed, with placeholder content that matches the mockups. Detailed plan: `docs/phase-1-plan.md`.

- Astro project (static output), TypeScript, plain CSS with design tokens (custom properties). No UI framework unless a need appears.
- Self-hosted fonts via Fontsource (Anton, Archivo Black, Archivo, JetBrains Mono), with preload for the display fonts.
- Design system: tokens, type scale (`clamp()` from 390 → 1440), grid, pills, buttons, grain overlay, arrows, play button, section dark/light variants.
- Shared components: `Logo` (single swap point for the future SVG), `Header` (desktop and mobile with menu overlay, NEXT pill shown only if an upcoming event exists), `Footer` (from homepage-D-hybrid + mobile version), `GenreTicker`, `VideoFacade`, `ResponsiveImage`.
- 4 page templates (every photo/video section built with placeholder media, ready for Sanity) with `[PLACEHOLDER]` content from a local mock data file shaped like the future Sanity data: `/`, `/events`, `/events/[slug]`, `/about`. Also a 404 page.
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
- Reusable `media` field (Image | YouTube video) used by every photo/video slot.
- Studio interface in English.

**Done when**: changing a field in Studio and rebuilding updates the preview site.

## Phase 3: Real content

**Goal**: the two Paris events and the Tokyo announcement are live in the content.

- Enter events 01 and 02 (Paris): titles, dates, venues, line-ups, texts, credits.
- Upload and order photo galleries with alt text; cover images.
- Aftermovies and clips on YouTube/Vimeo, linked in Sanity.
- Tokyo event (03) as `upcoming`, with ticket link when available.
- About page content from the deck; Formats photos; Network photo (final resolution).
- Final logo (SVG or high-res) and homepage hero media.

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

## Decisions taken (session 1 answers)

- **Homepage**: mockup A, but the hero is a media slot (image first, video later) and sections alternate dark/light like the other pages.
- **Mobile**: `homepage-D-mobile.html` is not used. Mobile = same content as desktop, stacked.
- **Logo**: ASCII cup (`design-reference/assets/logo-ascii-cup_v2.png` for now, better file coming) **plus** the "r0t" text wordmark.
- **Dark/light alternation on every page.**
- **Mockup copy not in the deck is sample text, not approved** → `[PLACEHOLDER]` or editable in Sanity.
- **Videos: all on YouTube**, linked from Sanity. Every media slot lets the editor choose Image or YouTube video.
- **Sanity Studio in English.**

## Upcoming event page (approved)

Same E2 template, switched by the event's status:
- **Hero**: left panel identical (number, name, city · date · venue, line-up). Right panel shows `heroMedia`: the flyer, or a YouTube teaser. A big **TICKETS ↗** pill under the meta row; if no ticket link yet, a non-clickable "TICKETS SOON" pill (wording to approve).
- **Shown**: "the night" text (if filled), line-up, MORE EVENTS.
- **Hidden** while upcoming: PHOTOS, VIDEOS, CREDITS (each section is hidden whenever it is empty, on any event).
- **After the night**: the editor sets status to *past* and adds photos/videos; no code change.
- **Safety net**: a free daily scheduled rebuild (GitHub Actions cron → Cloudflare deploy hook) plus a build rule: an "upcoming" event whose date has passed no longer appears in the NEXT pill. Prevents "NEXT: TOKYO" staying online after the event.
- Optional later: "Add to calendar" (.ics file generated at build).

## Open questions

- **H1. Homepage hero video on YouTube**: fine for click-to-play videos, but a poor fit for an autoplaying background loop. The YouTube player adds ~0.5–1 MB of scripts (puts Lighthouse 90+ at risk), shows YouTube branding/controls on load, and often won't autoplay on phones in low-power mode. Recommendation: hero = image now; when you want a video, either (a) a click-to-play YouTube reel, or (b) the single exception of a small muted MP4 (< 3 MB) uploaded in the hero media field. Decide when the video exists.
- **H2. Contact page with a form (postponed by Tom)**: Tom wants a `/contact` page with a secured form instead of showing the email address. Feasible while keeping the site static. Recommendation: **Formspree** (free: 50 messages/month, Cloudflare Turnstile anti-bot included, messages emailed to contact@r0ttencore.com, no DNS change) + a hidden honeypot field; subject dropdown (Booking / Press / Collaboration / Other); privacy line under the form (wording from Tom). Rejected: own Cloudflare Worker + email API (server code, and needs mail DNS records → conflicts with the Hostinger rule). When built: CONTACT nav → `/contact`, footer email replaced by a link to the form, success/error/privacy texts editable in Sanity. Needs from Tom: Formspree account + form ID, Turnstile enabled. Overrides the "no forms" decision in `CLAUDE.md` §2 once approved.

Answered in session 1 (now in `CLAUDE.md`): NEXT pill → event page · mobile header = two rows (logo + NEXT pill, then the 3 nav links) · header = cup + "r0t" · deck wins on copy · Archivo body · standalone Studio.
