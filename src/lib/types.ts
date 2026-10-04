/*
 * Content types used by the pages. src/lib/content.ts maps the Sanity query results
 * (studio/schemaTypes) into these shapes, with [PLACEHOLDER] fallbacks for missing text.
 */

export type City = 'Paris' | 'Tokyo' | 'Beijing';
export const CITIES: City[] = ['Paris', 'Tokyo', 'Beijing'];

export type EventStatus = 'upcoming' | 'past';

/** A resolved image: default URL, size after cropping, responsive srcset and focal point (see lib/image.ts). */
export interface ImageAsset {
  url: string;
  width: number;
  height: number;
  srcset?: string;
  position?: string; // CSS object-position from the editor's hotspot
  share?: string; // 1200×630 JPEG URL for share cards (Open Graph)
}

/**
 * One photo/video slot. In Sanity the editor picks "Image" or "YouTube video".
 * `null` = nothing chosen yet → the site shows a grain placeholder.
 */
export type Media =
  | { kind: 'image'; image: ImageAsset; alt: string; credit?: Credit }
  | { kind: 'youtube'; url: string; title: string; poster?: ImageAsset; credit?: Credit }
  | null;

export interface GalleryImage {
  image: ImageAsset | null; // null = placeholder frame
  alt: string;
  credit?: Credit; // who took it ("Photo by" in Sanity, or the only Photos credit)
}

export interface Video {
  title: string;
  url: string | null; // YouTube URL; null = placeholder
  credit?: Credit; // who filmed it ("Video by" in Sanity, or the only Video credit)
}

/** Credit roles, in display order. */
export const CREDIT_ROLES = ['Photos', 'Video', 'Location'] as const;
export type CreditRole = (typeof CREDIT_ROLES)[number];

/** One credited person (or venue). Several people can share a role. */
export interface Credit {
  role: CreditRole;
  name: string;
  instagram?: string; // handle without "@"
}

/** An artist as shown in line-ups. */
export interface Artist {
  name: string;
  slug: string;
  instagram?: string; // handle without "@"
  showPage: boolean; // true → has a page at /artists/<slug>/
}

/** A full artist document (artist page). */
export interface ArtistDoc extends Artist {
  basedIn?: string;
  genres: string[];
  description: string;
  portrait: Media;
  work: Media[];
  credits: Credit[];
}

export interface EventDoc {
  slug: string;
  number: string; // "01", "02"…
  title: string;
  city: City;
  date: string | null; // ISO date "2026-11-14"; null = not announced
  venue: string;
  status: EventStatus;
  ticketUrl?: string;
  cover: Media; // image used in lists, cards and share cards
  heroMedia: Media; // right-hand panel of the event page
  gallery: GalleryImage[];
  videos: Video[]; // first one = main aftermovie
  lineup: Artist[];
  text: string;
  credits: Credit[];
  seo: { title?: string; description?: string; image?: string }; // "Google & sharing" overrides
}

/** Short sentences that are not in the deck: editable in Sanity (Settings → Short texts). */
export interface SiteTexts {
  ticketsSoon: string;
  followCta: string;
  emptyTitle: string;
  emptyText: string;
  nightLabel: string;
  notFoundText: string;
  eventsDescription: string;
  artistsDescription: string;
}

export interface SiteSettings {
  shareImage?: string; // default share-card image URL (Settings → default share image)
  email: string;
  instagram: string; // handle without "@"
  genres: string[];
  texts: SiteTexts;
}

export interface HomePage {
  heroMedia: Media;
  description: string;
  tagline: string[]; // one line per entry
  cities: string;
  whatIs: string[]; // paragraphs
}

export interface Genre {
  name: string;
  size: 's' | 'm' | 'l' | 'xl';
}

export interface Format {
  label: string;
  text: string[]; // one entry = one line (the "& MORE" card is a list)
  media: Media;
}

export interface AboutPage {
  intro: string[];
  cities: string;
  soundsText: string[];
  genreCloud: Genre[];
  formats: Format[];
  networkText: string[];
  networkMedia: Media;
  description: string;
}
