# Phase 1 plan — Base

Status: **awaiting Tom's OK**. Rules and decisions: `/CLAUDE.md`. Overall phases: `docs/build-plan.md`.

## Goal

The four page templates, matching the mockups on desktop and phone, filled with `[PLACEHOLDER]` content and placeholder media, deployed on a Cloudflare preview URL. No Sanity connection yet: the pages read from a local mock file shaped exactly like the future Sanity data, so phase 2 only swaps the data source.

## Stack

| Item | Choice | Why |
|---|---|---|
| Framework | Astro (current stable), `output: 'static'`, TypeScript strict | decided |
| Styling | Plain CSS: global tokens (custom properties) + Astro scoped styles | the mockups give exact values; no Tailwind = fewer deps, easier to read |
| JS | Vanilla, only where needed (3 small scripts, below) | performance |
| Fonts | `@fontsource/anton`, `@fontsource/archivo-black`, `@fontsource/archivo` (400/600/700/800), `@fontsource/jetbrains-mono` (400/600), Latin subset, preload Anton + Archivo Black | decided |
| Node | 22 LTS (`.nvmrc`) | |
| Hosting config | `wrangler.jsonc`: static assets from `./dist`, `404.html` for not-found | only host-specific file |

## Files

```
src/
  styles/        tokens.css, base.css (reset, type scale with clamp(), focus, reduced motion)
  components/
    Logo.astro          ← the ONE place the logo image lives (cup + "r0t" wordmark)
    Header.astro        desktop: logo + nav + NEXT pill · mobile: 2 rows, no JS
    Footer.astro        from homepage-D-hybrid (desktop + stacked mobile)
    Section.astro       dark | light | black wrapper, enforces the alternation
    SectionTitle.astro  huge Anton title + mono counter on a ruled row
    Media.astro         renders Image | YouTube facade | placeholder (grain gradient)
    YouTubeFacade.astro poster + round play button; iframe injected on click
    Grain.astro         SVG feTurbulence overlay
    Pill.astro, ArrowIcon.astro, PlayIcon.astro
    EventRow.astro      list row (homepage archive + events listing)
    EventCard.astro     "MORE EVENTS" card
  data/mock.ts          placeholder content, typed like Sanity documents
  lib/content.ts        getEvents(), getUpcomingEvent(), getSettings()… (phase 2 swaps the inside)
  lib/types.ts          Event, Media, Settings, HomePage, AboutPage
  pages/
    index.astro, events/index.astro, events/[slug].astro, about.astro, 404.astro
public/
  textures/ (grain swoosh + splash), logo placeholder, favicon placeholder
```

## Pages and section order (dark/light alternation)

**Homepage** (A, adapted)
1. Hero, **dark**: full-bleed media slot (placeholder now) with the "r0t" wordmark, the deck tagline ("exploring music. underground culture. & emerging scenes.") and "PARIS. TOKYO. BEIJING".
2. Next event, **light**: city, `[DATE] · [VENUE]`, TICKETS pill (hidden if no upcoming event).
3. Archive, **dark**: big ARCHIVE title + counter, latest event (media slot + text), list of all past events.
4. What is r0t?, **light**: deck text + "ABOUT r0t ↘".
5. Footer, black.

No genre ticker on the homepage (mockup A has none); the genres stay on About.

**Events listing** (L1): hero + title + count + city filters (dark) → upcoming (light) → event list (dark) → follow CTA (light, `[PLACEHOLDER]` text) → footer.

**Event page** (E2): split hero (light text panel / black media panel) → photos slideshow (dark) → videos (light) → the night + credits (dark) → more events (light) → footer. Status *upcoming*: TICKETS pill in the hero (or "TICKETS SOON"), photos/videos/credits hidden. Any empty section is hidden on any event.

**About** (AB1, deck copy): hero (dark) → The Sounds (light) → Formats ×4 (dark) → Network (light) → footer.

**404**: dark, big Anton "404" + link back to events. Text = `[PLACEHOLDER]` until approved.

## JavaScript (vanilla, each < 2 KB)

1. **City filter** on `/events`: real buttons with `aria-pressed`; without JS every event stays visible.
2. **Photo slideshow** on event pages: prev/next buttons, thumbnails, arrow keys, counter `01 / N`; without JS, photos show as a scrollable strip.
3. **YouTube facade**: replaces the poster with a `youtube-nocookie.com` iframe on click.

Motion: hover states and a light fade-in on scroll; all disabled under `prefers-reduced-motion`.

## Mock data

Two past Paris events (01, 02) and one upcoming Tokyo event (03), all text as `[EVENT NAME]`, `[DATE]`, `[VENUE]`, `[ARTIST 01]`… Numbers, cities and statuses are real (from the brief). Media slots empty (placeholder rendering). Deck copy used as-is where the deck provides it.

## Cloudflare (needs Tom, ~5 min)

After the first push I'll give step-by-step instructions: Cloudflare dashboard → Workers & Pages → Create → Import a repository → `tomdubut/r0ttencore`, build command `npm run build`, deploy command `npx wrangler deploy`, and turn on builds for non-production branches so every branch gets a preview URL. Production branch = `main`.

## How I check the work before pushing

- `astro check` (types) and `astro build` with no errors or warnings.
- Playwright screenshots at 390 px and 1440 px of each page, compared side by side with the mockups (I'll share them).
- Keyboard pass (tab through each page), and a reduced-motion check.
- A first Lighthouse run (full tuning is phase 4).

## Commits (on `claude/gallant-babbage-7dzkcg`)

1. Astro setup, fonts, tokens, base styles, `wrangler.jsonc`, README
2. Logo, Header, Footer, Section, shared components
3. Media + YouTube facade + grain
4. Mock data + content layer + types
5. Homepage
6. Events listing + filter
7. Event page + slideshow
8. About + 404

## Not in phase 1

Sanity (phase 2), real content (phase 3), SEO tags / sitemap / JSON-LD and Lighthouse tuning (phase 4), domain and rebuild webhook (phase 5). The daily scheduled rebuild is set up in phase 5 with the webhook.
