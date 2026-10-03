# r0t — design reference

Approved mockups for the r0t / r0ttencore website, exported from the design canvas.
They are **visual references, not production code**.

## How to read the mockups

- Each file in `pages/` is a self-contained HTML mockup at a fixed width (1440px desktop, 390px mobile).
- Exact values (colors, font sizes, spacing, grid) are in the inline `style="…"` attributes. Use them as the source of truth for the design system.
- The files use a few canvas-only tags (`<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>`) and a `<script type="text/x-dc">` block. Ignore those tags: only the markup and styles inside matter.
- Grey radial gradients with grain = **photo/video placeholders**. Text in `[BRACKETS]` = **placeholder content**. Never ship invented content in their place.
- Absolute positioning in the mockups is a canvas shortcut: rebuild layouts responsively (flex/grid), not with absolute pixel positions.

## Chosen designs

| Page | File | Notes |
|---|---|---|
| Homepage | `homepage-A-archive.html` **or** `homepage-D-hybrid.html` | Final choice: see `CLAUDE.md` |
| Homepage (mobile) | `homepage-D-mobile.html` | Only mobile mockup that exists — use it as the mobile pattern for every page |
| Events listing | `events-listing-L1.html` | City filters (All / Paris / Tokyo / Beijing) + "Nothing here yet" empty state |
| Event page | `event-page-E2.html` | Split poster hero, photo slideshow with thumbnails, videos, credits, more events |
| About | `about-AB1.html` | Deck-style; Formats cards need 4 real photos |

Global rules shared by all pages:
- **Alternate dark and light sections** down every page.
- **Footer** = the one in `homepage-D-hybrid.html` (logo, contact/bookings, nav, bottom bar) — on every page.
- **Header**: logo + EVENTS / ABOUT / CONTACT + "NEXT: TOKYO ↗" pill (shown only when an upcoming event exists). Transparent over dark heroes.

## Assets

| File | Status |
|---|---|
| `assets/logo-ascii-cup_LOWRES.png` | ASCII cup logo — **low-res crop from the PDF. Replace with the original (SVG preferred) before launch.** |
| `assets/texture-grain-swoosh.webp` | Grain swoosh texture from the deck (transparent) |
| `assets/texture-grain-splash.webp` | Grain splash texture from the deck (transparent) |
| `assets/network-photo_LOWRES.jpg` | Collective photo from the deck (faces hidden) — low-res |
| `brand/r0t-deck.pdf` | Brand deck: source of all approved copy and the visual identity |

## Design tokens (from the mockups)

| Token | Value |
|---|---|
| Dark background | `#101010` |
| Footer / deepest black | `#000000` |
| Light background (off-white) | `#EFEFEB` |
| Ink on light | `#141414` |
| Muted text on dark | `#A8A8A2`, `#CFCFCA` |
| Muted text on light | `#55554F`, `#6B6B66` |
| Divider grey | `#8A8A85`, `#3A3A38` |
| Display (headlines) | Anton |
| Logo wordmark / pills / labels | Archivo Black |
| Body | Archivo 400–800 (tight letter-spacing on large text) |
| Meta / data | JetBrains Mono |
| Shapes | Pills = fully rounded (999px); cards = square corners; Formats boxes = 28–32px radius |
| Texture | SVG `feTurbulence` grain overlay (`mix-blend-mode: overlay`) + the two grain images |
