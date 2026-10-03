/*
 * The single entry point for content. Pages only call these functions.
 * Phase 1: reads src/data/mock.ts. Phase 2: same functions, data fetched from Sanity at build time.
 */
import * as mock from '../data/mock';
import type { AboutPage, EventDoc, HomePage, SiteSettings } from './types';

/** "Today" at build time, as YYYY-MM-DD. The site is rebuilt daily (phase 5), so this stays current. */
const today = () => new Date().toISOString().slice(0, 10);

/** An upcoming event whose date has already passed is treated as past (safety net if nobody updates it). */
const isUpcoming = (e: EventDoc) => e.status === 'upcoming' && (e.date === null || e.date >= today());

/** Newest first; events without a date sort by their number. */
const byNewest = (a: EventDoc, b: EventDoc) =>
  (b.date ?? '').localeCompare(a.date ?? '') || b.number.localeCompare(a.number);

export async function getEvents(): Promise<EventDoc[]> {
  return [...mock.events].sort(byNewest);
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

export async function getSettings(): Promise<SiteSettings> {
  return mock.settings;
}

export async function getHomePage(): Promise<HomePage> {
  return mock.home;
}

export async function getAboutPage(): Promise<AboutPage> {
  return mock.about;
}
