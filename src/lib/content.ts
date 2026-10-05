/*
 * The single entry point for content. Pages only call these functions.
 * Data comes from Sanity at build time (src/lib/queries.ts) and is mapped into the
 * page types (src/lib/types.ts). Missing text falls back to visible [PLACEHOLDER]s,
 * never to invented content (CLAUDE.md §6).
 */
import { sanityClient } from './sanity';
import { toImageAsset, type SanityImageInput } from './image';
import { ABOUT_QUERY, ARTISTS_PAGE_QUERY, ARTISTS_QUERY, EVENTS_QUERY, HOME_QUERY, SETTINGS_QUERY } from './queries';
import type { AboutPage, Artist, ArtistDoc, ArtistsPage, Credit, EventDoc, HomePage, Media, SiteSettings } from './types';

// ---------- Mapping helpers ----------

interface SanityMedia {
  kind: 'image' | 'youtube' | null;
  image: (SanityImageInput & { alt?: string | null }) | null;
  youtubeUrl: string | null;
  title: string | null;
  poster: SanityImageInput | null;
  by?: string | null;
}

/** Looks up who is credited for one photo/video: see creditResolver(). */
type CreditOf = (by: string | null | undefined, role: 'Photos' | 'Video') => Credit | undefined;

/** A Sanity "media" object → what <Media> renders. Incomplete media → null (grain placeholder). */
function toMedia(m: SanityMedia | null | undefined, creditOf?: CreditOf): Media {
  if (!m) return null;
  if (m.kind === 'youtube') {
    return m.youtubeUrl
      ? {
          kind: 'youtube',
          url: m.youtubeUrl,
          title: m.title ?? 'Video',
          poster: toImageAsset(m.poster) ?? undefined,
          credit: creditOf?.(m.by, 'Video'),
        }
      : null;
  }
  const image = toImageAsset(m.image);
  return image ? { kind: 'image', image, alt: m.image?.alt ?? '', credit: creditOf?.(m.by, 'Photos') } : null;
}

/** A plain image field with alt (e.g. event cover) → media. */
function imageMedia(img: (SanityImageInput & { alt?: string | null }) | null | undefined): Media {
  const image = toImageAsset(img);
  return image ? { kind: 'image', image, alt: img?.alt ?? '' } : null;
}

type SanityCredit = { _key: string; role: Credit['role']; name: string; instagram: string | null };

const toCredit = (c: SanityCredit): Credit => ({ role: c.role, name: c.name, instagram: c.instagram ?? undefined });

const toCredits = (credits: SanityCredit[] | null): Credit[] => (credits ?? []).map(toCredit);

/**
 * Who is credited for one photo/video of a document:
 * the person picked in "Photo by" / "Video by" (stored as their Credits _key), otherwise,
 * if exactly one person is credited for that role on the document, that person. Else nobody.
 */
function creditResolver(credits: SanityCredit[] | null): CreditOf {
  const list = credits ?? [];
  return (by, role) => {
    const picked = by ? list.find((c) => c._key === by) : undefined;
    if (picked) return toCredit(picked);
    const forRole = list.filter((c) => c.role === role);
    return forRole.length === 1 ? toCredit(forRole[0]) : undefined;
  };
}

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
  return rows.map((e) => {
    const creditOf = creditResolver(e.credits);
    return {
      slug: e.slug,
      number: e.number ?? '[NO.]',
      title: e.title ?? '[EVENT NAME]',
      city: e.city,
      date: e.date,
      venue: e.venue || '[VENUE]',
      status: e.status,
      ticketUrl: e.ticketUrl ?? undefined,
      cover: imageMedia(e.cover),
      heroMedia: toMedia(e.heroMedia, creditOf),
      gallery: (e.gallery ?? [])
        .map((g) => ({ image: toImageAsset(g), alt: g.alt ?? '', credit: creditOf(g.by, 'Photos') }))
        .filter((g) => g.image !== null),
      videos: (e.videos ?? []).map((v) => ({ title: v.title, url: v.url, credit: creditOf(v.by, 'Video') })),
      lineup: (e.lineup ?? []).filter(Boolean).map(toArtist),
      text: e.text ?? '',
      credits: toCredits(e.credits),
      seo: {
        title: e.seo?.title ?? undefined,
        description: e.seo?.description ?? undefined,
        image: toImageAsset(e.seo?.image)?.share,
      },
    };
  });
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
  return rows.map((a) => {
    const creditOf = creditResolver(a.credits);
    return {
      ...toArtist(a),
      basedIn: a.basedIn ?? undefined,
      genres: a.genres ?? [],
      description: a.description ?? '',
      portrait: toMedia(a.portrait, creditOf),
      work: (a.work ?? []).map((m) => toMedia(m, creditOf)).filter((m) => m !== null),
      credits: toCredits(a.credits),
    };
  });
});

/** Artists whose page is switched on ("Show artist page" in Sanity). */
export async function getArtistsWithPage(): Promise<ArtistDoc[]> {
  return (await loadArtists()).filter((a) => a.showPage);
}

/** Settings of the /artists/ listing (Sanity → Artists page), with defaults when not filled. */
export const getArtistsPage = once(async (): Promise<ArtistsPage> => {
  const p = await sanityClient.fetch(ARTISTS_PAGE_QUERY);
  return {
    title: p?.title || 'They r0tted with us', // wording approved by Tom
    intro: p?.intro ?? '',
    sortBy: p?.sortBy === 'recent' || p?.sortBy === 'manual' ? p.sortBy : 'name',
    manualOrder: (p?.manualOrder ?? []).filter((s): s is string => Boolean(s)),
    filterBy: p?.filterBy === 'genre' || p?.filterBy === 'none' ? p.filterBy : 'city',
  };
});

/**
 * Artists with a page, in the order chosen in Sanity → Artists page:
 * - name: A → Z
 * - recent: by their most recent r0t event (artists without an event last, A → Z)
 * - manual: the editor's list first, then everyone else A → Z
 */
export async function getArtistsForListing(): Promise<ArtistDoc[]> {
  const [artists, page, events] = await Promise.all([getArtistsWithPage(), getArtistsPage(), getEvents()]);
  const byName = (a: ArtistDoc, b: ArtistDoc) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });

  if (page.sortBy === 'recent') {
    const lastDate = (a: ArtistDoc) =>
      events
        .filter((e) => e.lineup.some((l) => l.slug === a.slug))
        .reduce((max, e) => (e.date && e.date > max ? e.date : max), '');
    return [...artists].sort((a, b) => lastDate(b).localeCompare(lastDate(a)) || byName(a, b));
  }
  if (page.sortBy === 'manual') {
    const rank = (a: ArtistDoc) => {
      const i = page.manualOrder.indexOf(a.slug);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return [...artists].sort((a, b) => rank(a) - rank(b) || byName(a, b));
  }
  return [...artists].sort(byName);
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
    shareImage: toImageAsset(s?.defaultShareImage)?.share,
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
