/*
 * All GROQ queries of the website. Types for their results are generated into
 * src/sanity.types.ts by `npm run typegen` (in studio/): rerun it after changing a query or a schema.
 */
import { defineQuery } from 'groq';

// Image fields needed by lib/image.ts (asset id + size, crop, hotspot).
const IMAGE = `{ asset->{ _id, metadata { dimensions { width, height } } }, crop, hotspot, alt }`;

// One "media" object (Image | YouTube video).
const MEDIA = `{ kind, image ${IMAGE}, youtubeUrl, title, poster ${IMAGE} }`;

const CREDITS = `credits[]{ _key, role, name, instagram }`;

const ARTIST_SUMMARY = `{ name, "slug": slug.current, instagram, "showPage": showPage == true }`;

export const EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)] | order(date desc, number desc) {
    "slug": slug.current, number, title, city, date, venue, status, ticketUrl, text,
    cover ${IMAGE},
    heroMedia ${MEDIA},
    gallery[] ${IMAGE},
    videos[]{ _key, title, url },
    "lineup": lineup[]-> ${ARTIST_SUMMARY},
    ${CREDITS}
  }
`);

export const ARTISTS_QUERY = defineQuery(`
  *[_type == "artist" && defined(slug.current)] | order(lower(name) asc) {
    name, "slug": slug.current, instagram, "showPage": showPage == true,
    basedIn, genres, description,
    portrait ${MEDIA},
    work[] ${MEDIA},
    ${CREDITS}
  }
`);

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{ email, instagram, genres, texts }
`);

export const HOME_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{ heroMedia ${MEDIA}, tagline, cities, whatIs, seoDescription }
`);

export const ABOUT_QUERY = defineQuery(`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    intro, cities, soundsText,
    genreCloud[]{ name, size },
    formats[]{ label, text, media ${MEDIA} },
    networkText,
    networkMedia ${MEDIA},
    seoDescription
  }
`);
