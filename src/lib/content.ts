/*
 * The single entry point for content. Pages only call these functions.
 * Data comes from Sanity at build time (src/lib/queries.ts) and is mapped into the
 * page types (src/lib/types.ts). Missing text falls back to visible [PLACEHOLDER]s,
 * never to invented content (CLAUDE.md §6).
 */
import { sanityClient } from './sanity';
import { toImageAsset, type SanityImageInput } from './image';
import { ABOUT_QUERY, ARTISTS_QUERY, EVENTS_QUERY, HOME_QUERY, SETTINGS_QUERY } from './queries';
import type { AboutPage, Artist, ArtistDoc, Credit, EventDoc, HomePage, Media, SiteSettings } from './types';

// ---------- Mapping helpers ----------

interface SanityMedia {
  kind: 'image' | 'youtube' | null;
  image: (SanityImageInput & { alt?: string | null }) | null;
  youtubeUrl: string | null;
  title: string | null;
  poster: SanityImageInput | null;
}

/** A Sanity "media" object → what <Media> renders. Incomplete media → null (grain placeholder). */
function toMedia(m: SanityMedia | null | undefined): Media {
  if (!m) return null;
  if (m.kind === 'youtube') {
    return m.youtubeUrl
      ? { kind: 'youtube', url: m.youtubeUrl, title: m.title ?? 'Video', poster: toImageAsset(m.poster) ?? undefined }
      : null;
  }
  const image = toImageAsset(m.image);
  return image ? { kind: 'image', image, alt: m.image?.alt ?? '' } : null;
}

/** A plain image field with alt (e.g. event cover) → media. */
function imageMedia(img: (SanityImageInput & { alt?: string | null }) | null | undefined): Media {
  const image = toImageAsset(img);
  return image ? { kind: 'image', image, alt: img?.alt ?? '' } : null;
}

const toCredits = (credits: { role: Credit['role']; name: string; instagram: string | null }[] | null): Credit[] =>
  (credits ?? []).map((c) => ({ role: c.role, name: c.name, instagram: c.instagram ?? undefined }));

const toArtist = (a: { name: string; slug: string; instagram: string | null; showPage: boolean }): Artist => ({
  name: a.name,
  slug: a.slug,
  instagram: a.instagram ?? undefined,
  showPage: a.showPage,
});

/** Each query runs once per build, however many pages use it. */
function once<T>(load: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | undefined;
  return () => (promise ??= load());
}

// ---------- Events ----------

const loadEvents = once(async (): Promise<EventDoc[]> => {
  const rows = await sanityClient.fetch(EVENTS_QUERY);
  return rows.map((e) => ({
    slug: e.slug,
    number: e.number ?? '[NO.]',
    title: e.title ?? '[EVENT NAME]',
    city: e.city,
    date: e.date,
    venue: e.venue || '[VENUE]',
    status: e.status,
    ticketUrl: e.ticketUrl ?? undefined,
    cover: imageMedia(e.cover),
    heroMedia: toMedia(e.heroMedia),
    gallery: (e.gallery ?? [])
      .map((g) => ({ image: toImageAsset(g), alt: g.alt ?? '' }))
      .filter((g) => g.image !== null),
    videos: (e.videos ?? []).map((v) => ({ title: v.title, url: v.url })),
    lineup: (e.lineup ?? []).filter(Boolean).map(toArtist),
    text: e.text ?? '',
    credits: toCredits(e.credits),
  }));
});

/** "Today" at build time, as YYYY-MM-DD. The site is rebuilt daily (phase 5), so this stays current. */
const today = () => new Date().toISOString().slice(0, 10);

/** An upcoming event whose date has already passed is treated as past (safety net if nobody updates it). */
const isUpcoming = (e: EventDoc) => e.status === 'upcoming' && (e.date === null || e.date >= today());

export async function getEvents(): Promise<EventDoc[]> {
  return loadEvents(); // already sorted newest first by the query
}

export async function getPastEvents(): Promise<EventDoc[]> {
  return (await getEvents()).filter((e) => !isUpcoming(e));
}

/** The next event (soonest upcoming), or null → no NEXT pill, no "next event" sections. */
export async function getUpcomingEvent(): Promise<EventDoc | null> {
  const upcoming = (await getEvents()).filter(isUpcoming).reverse();
  return upcoming[0] ?? null;
}

export function isEventUpcoming(e: EventDoc): boolean {
  return isUpcoming(e);
}

// ---------- Artists ----------

const loadArtists = once(async (): Promise<ArtistDoc[]> => {
  const rows = await sanityClient.fetch(ARTISTS_QUERY);
  return rows.map((a) => ({
    ...toArtist(a),
    basedIn: a.basedIn ?? undefined,
    genres: a.genres ?? [],
    description: a.description ?? '',
    portrait: toMedia(a.portrait),
    work: (a.work ?? []).map(toMedia).filter((m) => m !== null),
    credits: toCredits(a.credits),
  }));
});

/** Artists whose page is switched on ("Show artist page" in Sanity). */
export async function getArtistsWithPage(): Promise<ArtistDoc[]> {
  return (await loadArtists()).filter((a) => a.showPage);
}

/** Events (newest first) whose line-up includes this artist. */
export async function getEventsForArtist(slug: string): Promise<EventDoc[]> {
  return (await getEvents()).filter((e) => e.lineup.some((a) => a.slug === slug));
}

// ---------- Single pages ----------

export const getSettings = once(async (): Promise<SiteSettings> => {
  const s = await sanityClient.fetch(SETTINGS_QUERY);
  const t = s?.texts ?? {};
  return {
    email: s?.email ?? 'contact@r0ttencore.com',
    instagram: s?.instagram ?? 'r0tten.corp',
    genres: s?.genres ?? [],
    texts: {
      ticketsSoon: t.ticketsSoon || '[TICKETS SOON]',
      followCta: t.followCta || '[NEVER MISS THE NEXT ONE.]',
      emptyTitle: t.emptyTitle || '[NOTHING HERE YET.]',
      emptyText: t.emptyText || '[EMPTY-STATE TEXT]',
      nightLabel: t.nightLabel || '[THE NIGHT]',
      notFoundText: t.notFoundText || '[PLACEHOLDER — page not found text]',
      eventsDescription: t.eventsDescription || '[PLACEHOLDER — events page description]',
      artistsDescription: t.artistsDescription || '[PLACEHOLDER — artists page description]',
    },
  };
});

export const getHomePage = once(async (): Promise<HomePage> => {
  const h = await sanityClient.fetch(HOME_QUERY);
  return {
    heroMedia: toMedia(h?.heroMedia),
    tagline: h?.tagline ?? [],
    cities: h?.cities ?? '',
    whatIs: h?.whatIs ?? [],
    description: h?.seoDescription || '[PLACEHOLDER — homepage description]',
  };
});

export const getAboutPage = once(async (): Promise<AboutPage> => {
  const a = await sanityClient.fetch(ABOUT_QUERY);
  return {
    intro: a?.intro ?? [],
    cities: a?.cities ?? '',
    soundsText: a?.soundsText ?? [],
    genreCloud: (a?.genreCloud ?? []).map((g) => ({ name: g.name, size: g.size })),
    formats: (a?.formats ?? []).map((f) => ({ label: f.label, text: f.text ?? [], media: toMedia(f.media) })),
    networkText: a?.networkText ?? [],
    networkMedia: toMedia(a?.networkMedia),
    description: a?.seoDescription || '[PLACEHOLDER — about page description]',
  };
});
