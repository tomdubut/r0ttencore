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
| Rebuild | Sanity webhook (on publish) → Workers Builds **Deploy Hook** URL (production branch). |
| Videos | YouTube or Vimeo embeds only, loaded on click (facade). **Never** upload event videos to Sanity or the repo. Only exception: homepage hero loop (see §5). |
| Backend | None. No database, no Supabase, no accounts, no forms. Contact = `mailto:` link. |
| DNS | Email is hosted on **Hostinger**. When connecting the domain, **never touch MX, SPF/DKIM/DMARC TXT, or any mail-related record**. |
| Fonts | Self-hosted via Fontsource: Anton, Archivo Black, Archivo (400/600/700/800), JetBrains Mono (400/600). No Google Fonts CDN. |
| Logo | Low-res PNG placeholder now. Rendered through **one component** (`Logo`) so it can be swapped for an SVG in one place. |

## 3. Page → mockup mapping

| Page | URL | Mockup (`design-reference/pages/`) |
|---|---|---|
| Homepage | `/` | `homepage-A-archive.html` (light, closest to the deck) |
| Events listing | `/events` | `events-listing-L1.html` |
| Event page | `/events/<slug>` | `event-page-E2.html` |
| About | `/about` | `about-AB1.html` |
| Footer (all pages) | — | footer of `homepage-D-hybrid.html` **only** |
| Mobile (all pages) | — | `homepage-D-mobile.html`: header = logo + NEXT pill + menu button; stacked sections; mobile footer. Adapt to each page's own design. |
| Contact | — | No page: `CONTACT` nav item → footer contact block (`#contact`) / `mailto:`. |

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

**Recurring elements**: ↘ / ↗ arrows on links, the diagonal arrow SVG (`M5 5l14 14M19 8v11H8`), round outlined play buttons, big title + mono counter on a bottom-ruled row, dark/light section alternation.

**Header**: logo + EVENTS / ABOUT / CONTACT + `NEXT: <CITY> ↗` pill (**only when an upcoming event exists**). Transparent over dark heroes. Active nav item underlined. Mobile: logo + NEXT pill + menu button (the menu overlay has no mockup: design it in the same language).

**Motion**: subtle only (genre ticker scrolling, hover states, fade-ins). Everything respects `prefers-reduced-motion` (ticker static, no fades).

## 5. Content model (Sanity) — draft, to refine in phase 2

**event**
- title, slug (from title), number (string, e.g. `02`), city (dropdown: Paris / Tokyo / Beijing), date, venue, status (dropdown: upcoming / past), ticket link (URL)
- coverImage (required, with alt text), gallery (array of images with alt, drag to reorder)
- aftermovie link (YouTube/Vimeo), extra clip links (title + URL), line-up (array: artist name + Instagram handle, reorderable)
- short text, credits (photographer, videographer)
- SEO: optional title, description, share image (fallbacks: title / short text / cover)

**siteSettings** (singleton): contact email, Instagram handle, genre list (ticker), homepage hero video loop (desktop + vertical mobile + poster), default share image.

**aboutPage** (singleton): the About sections (hero texts, The Sounds text + genre cloud, Formats ×4 = photo + label + text, Network text + photo).

**Studio rules**: clear labels, help text on every field, required fields validated, dropdowns for city/status, singletons cannot be duplicated/deleted, media library plugin (search, tags, see where an image is used). The editor must be simple for a non-technical person.

## 6. Content rules

- All copy comes **from the deck (`design-reference/brand/r0t-deck.pdf`) or from Sanity**. Never invent text, artist names, dates, venues, numbers or durations.
- Missing content → visible `[PLACEHOLDER]` text in brackets, never plausible fake content.
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

See the "Open questions" section of `docs/build-plan.md`.
