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
| Videos | **All videos on YouTube**, linked from Sanity (URL field). Click-to-play embeds use a facade (poster + button; iframe only on click, `youtube-nocookie.com`). **Never** upload videos to the repo. Hero background video: see open question H1 in `docs/build-plan.md`. |
| Media slots | Every place that shows a photo or a video uses one **"media" field in Sanity: the editor picks Image or YouTube video**, and the site renders whichever was chosen. Changing a photo to a video (or back) never needs code. |
| Sanity Studio | Interface in **English**. **Standalone Studio hosted by Sanity** (`<name>.sanity.studio`), not embedded in the site. |
| Copy conflicts | When the deck and a mockup disagree on copy, **the deck wins** (e.g. About: 4 Network paragraphs, "CREATIVE COLLABORATIONS"). "Launching in 2026." is outdated and not used. |
| Upcoming events | Same event template; status switches sections (see `docs/build-plan.md`, "Upcoming event page"). Daily scheduled rebuild + build rule: an upcoming event whose date has passed is not shown as NEXT. |
| Backend | None. No database, no Supabase, no accounts, no forms. Contact = `mailto:` link. |
| DNS | Email is hosted on **Hostinger**. When connecting the domain, **never touch MX, SPF/DKIM/DMARC TXT, or any mail-related record**. |
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

**Recurring elements**: ↘ / ↗ arrows on links, the diagonal arrow SVG (`M5 5l14 14M19 8v11H8`), round outlined play buttons, big title + mono counter on a bottom-ruled row.

**Dark/light alternation (all pages, including the homepage)**: consecutive sections always alternate dark (`#101010`/`#141414`) and light (`#EFEFEB`). The footer is black (`#000`) with its top rule.

**Header**: logo + EVENTS / ABOUT / CONTACT + `NEXT: <CITY> ↗` pill (**only when an upcoming event exists**). Transparent over dark heroes. Active nav item underlined. Header logo = ASCII cup + "r0t" wordmark side by side. The NEXT pill links to the **upcoming event page** (not the ticket link).
**Mobile header** (two rows, no hamburger, no JS): row 1 = logo + NEXT pill; row 2 = EVENTS / ABOUT / CONTACT spread across the width, 44px tall. The header scrolls away with the page (not sticky).

**Motion**: subtle only (genre ticker scrolling, hover states, fade-ins). Everything respects `prefers-reduced-motion` (ticker static, no fades).

## 5. Content model (Sanity) — draft, to refine in phase 2

**media** (reusable object, used for every photo/video slot): `type` radio = **Image** | **YouTube video**. Image → image (hotspot/crop) + alt text (required). YouTube → URL (validated as YouTube) + optional poster image + alt/label. Only the fields of the chosen type are shown. The site renders an image, or a click-to-play YouTube facade.

**event**
- title, slug (from title), number (string, e.g. `02`), city (dropdown: Paris / Tokyo / Beijing), date, venue, status (dropdown: upcoming / past), ticket link (URL)
- coverImage (required image + alt: used for cards, lists and share cards)
- heroMedia (media: fills the whole right half of the E2 hero on desktop, a full-width square on phones; cropped to fit → set the image hotspot; vertical videos get side bars)
- gallery (array of images with alt, drag to reorder)
- videos (array of media/YouTube: main aftermovie + clips, title each, reorderable)
- line-up (array: artist name + Instagram handle, reorderable)
- short text, credits = list of { role (dropdown: Photos / Video / Location), name, optional Instagram handle }, several people per role, reorderable. Location falls back to the venue if empty.
- SEO: optional title, description, share image (fallbacks: title / short text / cover)

**homePage** (singleton): heroMedia (media), the homepage texts (not in the deck → editable).

**siteSettings** (singleton): contact email, Instagram handle, genre list (ticker / The Sounds), default share image, short UI sentences that are not in the deck (e.g. listing CTA, empty states).

**aboutPage** (singleton): the About sections (hero texts, The Sounds text + genre cloud, Formats ×4 = media + label + text, Network text + media).

**Studio rules**: clear labels, help text on every field, required fields validated, dropdowns for city/status, singletons cannot be duplicated/deleted, media library plugin (search, tags, see where an image is used). The editor must be simple for a non-technical person.

## 6. Content rules

- All copy comes **from the deck (`design-reference/brand/r0t-deck.pdf`) or from Sanity**. Never invent text, artist names, dates, venues, numbers or durations.
- Missing content → visible `[PLACEHOLDER]` text in brackets, never plausible fake content.
- Copy that appears in the mockups but not in the deck ("NEVER MISS THE NEXT ONE.", "THE NIGHT", "SCROLL — ARCHIVE", "PLAYING — REEL 2026", the empty-state lines…) is **sample text, not approved**: render it as `[PLACEHOLDER]` or make it an editable Sanity field.
- Short functional UI labels from the mockups (EVENTS, LINE-UP, CREDITS, MORE EVENTS…) are kept; see `docs/phase-1-plan.md` → Build notes.
- Phase 1 builds every photo/video section empty-ready (placeholder media); real photos and videos are added by Tom via Sanity later.
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
