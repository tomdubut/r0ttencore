# r0t website — project brief for Claude

Read this file at the start of every session. Update it whenever a decision changes.
Phase plan: `docs/build-plan.md`. Design source: `design-reference/` (start with its README).

## 1. Project

- **r0t** is a curatorial project by the **r0ttencore** collective: underground music (underground hip-hop, rap, hyperpop, alternative electronic, club), internet culture, emerging creative scenes. Art/fashion collaborations later.
- **Team**: Tom (Tokyo, technical owner) and a co-founder in Paris (non-technical, edits content in Sanity).
- **Cities**: Paris, Tokyo, Beijing. Two past events in Paris; the next one is in Tokyo.
- **The site's job**: (1) show photos and videos of past events, (2) announce the next event, (3) explain what r0t is.
- **Audience**: underground music audiences, internet-native generation, young creative communities, fashion/design students. Most arrive from Instagram **on a phone → mobile-first is mandatory**.
- **Language**: English only. **Domain**: r0ttencore.com. **Instagram**: @r0tten.corp. **Email**: contact@r0ttencore.com

## 2. Decisions (do not re-open without a stated reason)

| Topic | Decision |
|---|---|
| Framework | **Astro, static output only** (`output: 'static'`). No server functions, no SSR adapter, no host-specific runtime features. |
| Content | **Sanity**. Project `r0ttencore`, ID `suitidnh`, dataset `production` (exists, ACL **public** → never store private data in it). |
| Hosting | **Cloudflare free plan, Workers with static assets** (Cloudflare's current recommendation for new projects; Pages still works). Git-connected Workers Builds → preview URL per branch. Only a minimal `wrangler.jsonc` pointing at `./dist`; the build output stays plain static files, portable to any host. |
| Rebuild | **Static site + rebuild on publish** (option 1, approved; no server rendering, no live preview for now). Sanity webhook (Create/Update/Delete, drafts off, filter on the 7 site types: event, artist, homePage, aboutPage, artistsPage, headerFooter, siteSettings — **add every new document type to the webhook filter**) → GitHub `repository_dispatch` → **GitHub Actions builds the site and uploads it with `wrangler deploy`** (`.github/workflows/deploy-content.yml`, secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`; the webhook carries a fine-grained GitHub token for this repo only, renew before it expires). Moved off Cloudflare deploy hooks on 2026-10-03: Cloudflare's build service stalled ("Build failed to initialize") and publishes were silently lost. **Publish = live in ~2–3 min.** Bursts: one run at a time + one waiting (newest wins). Same workflow runs daily at 00:15 UTC. Failed runs are emailed by GitHub. Code pushes are still built by Workers Builds (production on `main`, branch previews). Repo is public → GitHub Actions minutes are free and unlimited, and run logs are public (secrets are masked; never echo them). Optional later: Studio preview of drafts (needs a separate server-rendered preview deployment). |
| Videos | **All videos on YouTube**, linked from Sanity (URL field). Click-to-play embeds use a facade (poster + button; iframe only on click, `youtube-nocookie.com`). **Never** upload videos to the repo. Hero background video: see open question H1 in `docs/build-plan.md`. |
| Media slots | Every place that shows a photo or a video uses one **"media" field in Sanity: the editor picks Image or YouTube video**, and the site renders whichever was chosen. Changing a photo to a video (or back) never needs code. |
| Sanity Studio | Interface in **English**. **Standalone Studio hosted by Sanity at `r0ttencore.sanity.studio`**, code in `studio/`, deployed by GitHub Actions **from `main` only** (after merge; secret `SANITY_AUTH_TOKEN`, project token with *Deploy Studio* only). Free plan → only Administrator / Viewer roles: **the co-founder is an Administrator** (approved), automatic backups in phase 5. |
| Images | **Served from the Sanity image CDN** (option A, approved). Free plan = hard cap of 100 GB bandwidth/month (≈25–50k visits): if reached, images stop loading until the 1st. Escape hatches: Growth plan, or build-time images served by Cloudflare (option B in `docs/phase-2-plan.md`). All image URLs go through one helper so switching is contained. |
| Copy conflicts | When the deck and a mockup disagree on copy, **the deck wins** (e.g. About: 4 Network paragraphs, "CREATIVE COLLABORATIONS"). "Launching in 2026." is outdated and not used. |
| Upcoming events | Same event template; status switches sections (see `docs/build-plan.md`, "Upcoming event page"). Daily scheduled rebuild + build rule: an upcoming event whose date has passed is not shown as NEXT. |
| Backend | None. No database, no Supabase, no accounts, no forms. Contact = `mailto:` link. |
| DNS | Email is hosted on **Hostinger**. **Never touch MX, SPF/DKIM/DMARC TXT, or any mail-related record.** Since 2026-10-04 the DNS zone is on **Cloudflare** (nameservers `deborah` / `lee.ns.cloudflare.com`, free plan, all records grey / DNS only); the domain is still **registered at Namecheap** (transfer to Hostinger or Cloudflare Registrar possible later: afterwards check the nameservers are still Cloudflare's). **Live since 2026-10-04**: Workers custom domains `r0ttencore.com` + `www.r0ttencore.com` (Workers & Pages → r0ttencore → Domains & Routes; they survive `wrangler deploy`), Redirect Rule "Redirect from WWW to root" (301, query string kept). The old Netlify records (`@` A `75.2.60.5`, `www` → `idyllic-klepon-95c6f2.netlify.app`) were deleted; the Netlify site itself still exists (remove the domain there when someone finds the account). No `noindex` while placeholders are online (Tom's decision). DNSSEC off (can be enabled in Cloudflare later). |
| Fonts | Archivo for body (not the deck's Public Sans). Self-hosted via Fontsource: Anton, Archivo Black, Archivo (400/600/700/800), JetBrains Mono (400/600). No Google Fonts CDN. |
| Logo | ASCII cup. Placeholder now: `design-reference/assets/logo-ascii-cup_v2.png` (better one coming from Tom). Rendered through **one component** (`Logo`) so it can be swapped in one place. The **"r0t" text wordmark (Archivo Black) stays** alongside the cup. |

## 3. Page → mockup mapping

| Page | URL | Mockup (`design-reference/pages/`) |
|---|---|---|
| Homepage | `/` | `homepage-A-archive.html`, **modified**: hero = media slot (image now, video later); sections alternate dark/light like the other pages |
| Events listing | `/events` | `events-listing-L1.html` |
| Event page | `/events/<slug>` | `event-page-E2.html` |
| About | `/about` | `about-AB1.html` |
| Footer (all pages) | — | footer of `homepage-D-hybrid.html` **only** |
| Mobile (all pages) | — | **No mobile mockup is used** (`homepage-D-mobile.html` is ignored). Mobile shows **the same content as desktop**, stacked in a single column, with the same dark/light sections. |
| Artists listing | `/artists/` | **No mockup**: designed from existing pieces (approve via screenshots). City filter like `/events`. **ARTISTS in the header and footer nav** (after EVENTS). Title, intro, order and filters editable in Sanity → **Artists page** (see §5). |
| Artist page | `/artists/<slug>/` | **No mockup**: event-hero style (name + big media), work gallery (slideshow), videos, "events with r0t" (event rows), dark/light alternation. Reached via line-up links on event pages. |
| Contact | — | No page: `CONTACT` nav item → footer contact block (`#contact`) / `mailto:`. (Contact form postponed: `docs/build-plan.md` H2.) |

Mockups are fixed-width (1440 desktop / 390 mobile) with absolute positioning: **rebuild as responsive flex/grid**, never copy pixel positions. Ignore canvas tags (`<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>`, `text/x-dc` scripts).

## 4. Design system (from the mockups; match exactly)

**Colors**
| Token | Value | Use |
|---|---|---|
| `--bg-dark` | `#101010` | dark sections |
| `--ink` | `#141414` | ink on light, dark strips, dark pills |
| `--black` | `#000000` | footer, poster panel, Formats pills |
| `--bg-light` | `#EFEFEB` | light sections, text on dark |
| `--muted-on-dark` | `#A8A8A2` / `#CFCFCA` | labels, secondary text on dark |
| `--muted-on-light` | `#55554F` / `#6B6B66` | labels, hover on light |
| `--divider` | `#8A8A85` (ticker slashes), `#3A3A38` (footer/credits rules) | |
| line on dark | `rgba(239,239,235,0.35)` (lists), `0.25` (header) | 1px rules |

**Type**
| Role | Font | Notes |
|---|---|---|
| Display / section titles | Anton 400 | huge sizes (desktop 120–300px, mobile ~96–104px), line-height 0.82–0.9 |
| Wordmark "r0t", pills, buttons, labels | Archivo Black | wordmark uses strong negative letter-spacing |
| Body / lead text | Archivo 600–800 | lead paragraphs 800 weight, 24–30px desktop / 20px mobile, letter-spacing −0.4 to −0.6px |
| Meta (numbers, dates, counters, labels) | JetBrains Mono 400/600 | 11–18px, often letter-spacing 1px, uppercase |

Use fluid sizes (`clamp()`) between the mobile (390) and desktop (1440) mockup values.

**Shapes and layout**
- Pills: `border-radius: 999px`, 44px tall (52–60px for primary CTAs), outlined 1.5px or filled.
- Cards and media: square corners. Formats boxes on About: 28–32px radius.
- Desktop: 12-column grid, 24px gutter, 40px side padding. Mobile: 16px side padding.
- Minimum tap target 44×44px.

**Texture**: inline SVG `feTurbulence` grain overlay (`mix-blend-mode: overlay`, opacity 0.25–0.55) on media/heroes, plus `texture-grain-swoosh.webp` / `texture-grain-splash.webp` (inverted on dark, low opacity). Decorative only (`aria-hidden`, empty `alt`).

**Recurring elements**: ↘ / ↗ arrows on links, the diagonal arrow SVG (`M5 5l14 14M19 8v11H8`), round outlined play buttons, big title + mono counter on a bottom-ruled row.

**Dark/light alternation (all pages, including the homepage)**: consecutive sections always alternate dark (`#101010`/`#141414`) and light (`#EFEFEB`). The footer is black (`#000`) with its top rule.

**Header**: logo + menu (Sanity → Header & footer; today EVENTS / ARTISTS / ABOUT / CONTACT) + `NEXT: <CITY> ↗` pill (**only when an upcoming event exists**). Transparent over dark heroes. Active nav item underlined. Header logo = ASCII cup + "r0t" wordmark side by side. The NEXT pill links to the **upcoming event page** (not the ticket link).
**Mobile header** (two rows, no hamburger, no JS): row 1 = logo + NEXT pill; row 2 = EVENTS / ARTISTS / ABOUT / CONTACT spread across the width, 44px tall. The header scrolls away with the page (not sticky).

**Motion**: subtle only (genre ticker scrolling, hover states, fade-ins). Everything respects `prefers-reduced-motion` (ticker static, no fades).

## 5. Content model (Sanity) — built in phase 2 (`studio/schemaTypes/`)

**media** (reusable object, used for every photo/video slot): `type` radio = **Image** | **YouTube video**. Image → image (hotspot/crop) + alt text (required). YouTube → URL (validated as YouTube) + optional poster image + alt/label. Only the fields of the chosen type are shown. The site renders an image, or a click-to-play YouTube facade.

**event**
- title, slug (from title), number (string, e.g. `02`), city (dropdown: Paris / Tokyo / Beijing), date, venue, status (dropdown: upcoming / past), ticket link (URL)
- coverImage (required image + alt: used for cards, lists and share cards)
- heroMedia (media: fills the whole right half of the E2 hero on desktop, a full-width square on phones; cropped to fit → set the image hotspot; vertical videos get side bars)
- gallery (array of images with alt, drag to reorder)
- videos (array of media/YouTube: main aftermovie + clips, title each, reorderable)
- line-up (array of **references to artist documents**, reorderable)
- short text, credits = list of { role (dropdown: Photos / Video / Location), name, optional Instagram handle }, several people per role, reorderable. Location falls back to the venue if empty.
- **Per-item credit**: each gallery photo, video and media slot (events and artists) has "Photo by" / "Video by": a dropdown of the document's Credits (stores the credit `_key`). Empty = automatic: the only person credited for that role, if there is exactly one. Shown as a `PHOTO — NAME ↗` caption under each slide / video and over the hero; one videographer for all videos → shown once under the main video. Decision (option A): names live in each event's Credits, no shared People list.
- SEO: optional title, description, share image (fallbacks: title / short text / cover)

**artist**
- name, slug, based in (free text city), genres (free tags; same spelling as Settings → Genres is asked in the help text), short description
- portrait (media), work (array of media: images and/or YouTube, reorderable)
- links: Instagram (+ SoundCloud / Spotify / Bandcamp later, platforms not decided)
- **showPage** switch (default off): off → the artist appears in line-ups with an Instagram link only, no page; on → page published at `/artists/<slug>/` and line-up names link to it
- "events with r0t" is **computed** (events whose line-up references the artist), never entered by hand
- Rights: only material the artist has provided or approved; credit photographers (same credits list as events)

**homePage** (singleton, `_id: homePage`): heroMedia (media), tagline lines, cities line, "What is r0t?" paragraphs, SEO description.

**headerFooter** (singleton, `_id: headerFooter`, Tom 2026-10-05; seeded with the site's content): menu links (label + page events/artists/about/contact/home or web address; same menu in header and footer; "contact" = `#contact` in the header, `mailto:` in the footer), NEXT button label, footer contact label, cities line, copyright name (© year is automatic), signature. Email + Instagram stay in siteSettings. Missing/empty → today's content.

**artistsPage** (singleton, `_id: artistsPage`, Tom 2026-10-05): big title (default "They r0tted with us"), optional intro paragraph, order (Name A→Z / Most recent r0t event first / Manual drag & drop list, unlisted artists after it A→Z), filter buttons (by city "Based in" / by genre = Settings → Genres entries that at least one artist has, in that order / none). Missing document → those defaults.

**siteSettings** (singleton, `_id: siteSettings`): contact email, Instagram handle, genre list, default share image, **Short texts** (not in the deck, start as `[PLACEHOLDER]`): tickets-soon button, follow CTA, empty-state title/text, night label, 404 text, events/artists page descriptions.

**aboutPage** (singleton, `_id: aboutPage`): intro paragraphs, cities, The Sounds text + genre cloud (name + size s/m/l/xl), Formats (label + lines + media, 4 expected), Network text + media, SEO description.

**Studio rules**: clear labels, help text on every field, required fields validated, dropdowns for city/status, singletons cannot be duplicated/deleted, media library plugin (search, tags, see where an image is used). The editor must be simple for a non-technical person.

## 6. Content rules

- All copy comes **from the deck (`design-reference/brand/r0t-deck.pdf`) or from Sanity**. Never invent text, artist names, dates, venues, numbers or durations.
- Missing content → visible `[PLACEHOLDER]` text in brackets, never plausible fake content.
- Copy that appears in the mockups but not in the deck ("NEVER MISS THE NEXT ONE.", "THE NIGHT", "SCROLL — ARCHIVE", "PLAYING — REEL 2026", the empty-state lines…) is **sample text, not approved**: render it as `[PLACEHOLDER]` or make it an editable Sanity field.
- Short functional UI labels from the mockups (EVENTS, LINE-UP, CREDITS, MORE EVENTS…) are kept; see `docs/phase-1-plan.md` → Build notes.
- Photo/video sections show grain placeholders while empty; sections with no content at all (e.g. an event without photos) are hidden.
- **About page and homepage** (Tom, 2026-10-05): every section and block appears only when it has content in Sanity (no genres → no bubble cloud, the text stays on the right on desktop; no Formats → no FORMATS section; Network without photo → no empty photo frame; homepage: no tagline/cities line when empty, no aftermovie frame without a video, no WHAT IS r0t? section without text, hero keeps its dark grain background without a label). Remaining sections keep alternating dark / light.
- The site reads **published** content only. Seeded placeholder documents: events 01–03, artists [ARTIST 01–04] (page off), the three singletons.
- Anything the team might want to change must be editable in Sanity without code.
- Counts, "NEXT: <CITY>", years and "LATEST — 02" are computed from Sanity data, never hard-coded.

## 7. Quality bar

- **Performance**: Lighthouse 90+ on mobile. Images from the Sanity image CDN with `auto=format` (WebP/AVIF), `srcset`/`sizes`, explicit width/height, lazy loading below the fold. Video embeds = facade (poster + button), iframe injected on click. Minimal JS (vanilla, islands only where needed).
- **SEO**: per-page title/description from content, canonical URLs, Open Graph + Twitter cards (cover + title + date), schema.org `Event` JSON-LD on event pages, `sitemap.xml`, `robots.txt`, clean URLs (`/events/<slug>`).
- **Accessibility**: semantic HTML, real `<button>`/`<a>`, alt text, keyboard navigation (menu, slideshow, filters), visible focus, WCAG AA contrast, `lang="en"`, skip link.
- **Code**: clean, simple, commented where non-obvious, documented in `README.md`.

## 8. How we work

- **Propose a plan and wait for Tom's OK before writing code.**
- One phase per session (see `docs/build-plan.md`). Small commits with clear messages.
- Work on branches; every change gets a Cloudflare preview URL before merging to `main`.
- If something is unclear or a decision is missing: **ask, don't guess**.
- Keep this file up to date when decisions change.

## 9. Open questions (remove when answered)

See "Open questions" in `docs/build-plan.md`.
