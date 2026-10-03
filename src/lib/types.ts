/*
 * Content types. They mirror the planned Sanity schemas (CLAUDE.md §5),
 * so phase 2 only has to change where the data comes from (src/lib/content.ts).
 */

export type City = 'Paris' | 'Tokyo' | 'Beijing';
export const CITIES: City[] = ['Paris', 'Tokyo', 'Beijing'];

export type EventStatus = 'upcoming' | 'past';

/** A resolved image: a URL plus its intrinsic size (Sanity CDN URL in phase 2). */
export interface ImageAsset {
  url: string;
  width: number;
  height: number;
}

/**
 * One photo/video slot. In Sanity the editor picks "Image" or "YouTube video".
 * `null` = nothing chosen yet → the site shows a grain placeholder.
 */
export type Media =
  | { kind: 'image'; image: ImageAsset; alt: string }
  | { kind: 'youtube'; url: string; title: string; poster?: ImageAsset }
  | null;

export interface GalleryImage {
  image: ImageAsset | null; // null = placeholder frame
  alt: string;
}

export interface Video {
  title: string;
  url: string | null; // YouTube URL; null = placeholder
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

export interface Artist {
  name: string;
  instagram?: string; // handle without "@"
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
}

export interface SiteSettings {
  email: string;
  instagram: string; // handle without "@"
  genres: string[];
}

export interface HomePage {
  heroMedia: Media;
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
}
