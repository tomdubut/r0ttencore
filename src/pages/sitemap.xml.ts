/*
 * sitemap.xml: every public page, rebuilt with the site (so new events and artist pages appear
 * after the next publish). Listed in robots.txt. The 404 page is left out.
 */
import type { APIRoute } from 'astro';
import { getArtistsWithPage, getEvents } from '../lib/content';
import { paths } from '../lib/paths';

export const GET: APIRoute = async ({ site }) => {
  const events = await getEvents();
  const artists = await getArtistsWithPage();
  const pages = [
    paths.home,
    paths.events,
    paths.about,
    // /artists/ is left out while it is not linked from the menu (CLAUDE.md §3).
    ...events.map((e) => paths.event(e.slug)),
    ...artists.map((a) => paths.artist(a.slug)),
  ];
  const urls = pages.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
