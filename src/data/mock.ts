/*
 * Phase 1 placeholder content, shaped like the future Sanity documents.
 *
 * Rules (CLAUDE.md §6):
 * - Text in [BRACKETS] = placeholder, to be replaced from Sanity. Never replace it with invented content.
 * - Unbracketed text comes from the deck (design-reference/brand/r0t-deck.pdf) or the brief.
 * - Media set to null renders as a grain placeholder.
 */
import type { AboutPage, EventDoc, GalleryImage, HomePage, SiteSettings, Video } from '../lib/types';

const placeholderGallery = (count: number): GalleryImage[] =>
  Array.from({ length: count }, (_, i) => ({
    image: null,
    alt: `[PHOTO ${String(i + 1).padStart(2, '0')}]`,
  }));

const placeholderVideos: Video[] = [
  { title: '[AFTERMOVIE]', url: null },
  { title: '[CLIP 01]', url: null },
  { title: '[CLIP 02]', url: null },
  { title: '[CLIP 03]', url: null },
  { title: '[CLIP 04]', url: null },
];

const placeholderLineup = [1, 2, 3, 4].map((n) => ({ name: `[ARTIST 0${n}]`, instagram: undefined }));

const pastEvent = (number: string): EventDoc => ({
  slug: `event-${number}`,
  number,
  title: '[EVENT NAME]',
  city: 'Paris',
  date: null,
  venue: '[VENUE]',
  status: 'past',
  cover: null,
  heroMedia: null,
  gallery: placeholderGallery(10),
  videos: placeholderVideos,
  lineup: placeholderLineup,
  text: '[2–3 lines about the night: the concept, the venue, the energy.]',
  credits: { photographer: '[PHOTOGRAPHER]', videographer: '[VIDEOGRAPHER]' },
});

export const events: EventDoc[] = [
  pastEvent('01'),
  pastEvent('02'),
  {
    slug: 'event-03',
    number: '03',
    title: '[EVENT NAME]',
    city: 'Tokyo',
    date: null,
    venue: '[VENUE]',
    status: 'upcoming',
    ticketUrl: undefined,
    cover: null,
    heroMedia: null,
    gallery: [],
    videos: [],
    lineup: placeholderLineup,
    text: '',
    credits: {},
  },
];

export const settings: SiteSettings = {
  email: 'contact@r0ttencore.com',
  instagram: 'r0tten.corp',
  // From the deck, "The Sounds" slide.
  genres: [
    'Underground hiphop',
    'Rap',
    'Hyperpop',
    'Alternative',
    'Club',
    'Electro',
    'Drumnbass',
    'Experimental',
    'Techno',
    'Trance',
    'Ambient',
  ],
};

export const home: HomePage = {
  heroMedia: null,
  // Deck, slide 1.
  tagline: ['exploring music.', 'underground culture.', '& emerging scenes.'],
  cities: 'PARIS. TOKYO. BEIJING',
  // Deck, slide 2 (first two paragraphs, as in homepage mockup A).
  whatIs: [
    'r0t is a developing curatorial project exploring the intersection of underground music, internet culture and emerging creative scenes.',
    'Through events, collaborations and artistic initiatives, r0t aims to create spaces where artists, sounds and communities can meet.',
  ],
};

export const about: AboutPage = {
  // Deck, slide 2. "Launching in 2026." is outdated and intentionally left out.
  intro: [
    'r0t is a developing curatorial project exploring the intersection of underground music, internet culture and emerging creative scenes.',
    'Through events, collaborations and artistic initiatives, r0t aims to create spaces where artists, sounds and communities can meet.',
    'The project develops through a network connected between Paris, Beijing and Tokyo.',
  ],
  cities: 'PARIS. TOKYO. BEIJING',
  // Deck, slide 4.
  soundsText: [
    'r0t focuses mostly on artists connected to hyperpop, underground rap, alternative electronic, underground club music',
    'while exploring a broader spectrum of sounds and emerging artists.',
  ],
  // Order and relative sizes from the about-AB1 mockup / deck.
  genreCloud: [
    { name: 'UNDERGROUND HIPHOP', size: 'xl' },
    { name: 'AMBIENT', size: 's' },
    { name: 'CLUB', size: 'm' },
    { name: 'RAP', size: 'xl' },
    { name: 'TRANCE', size: 's' },
    { name: 'EXPERIMENTAL', size: 's' },
    { name: 'TECHNO', size: 's' },
    { name: 'ALTERNATIVE', size: 'm' },
    { name: 'HYPERPOP', size: 'l' },
    { name: 'ELECTRO', size: 'l' },
    { name: 'DRUMNBASS', size: 'l' },
  ],
  // Deck, slide 3 (deck wording wins over the mockup).
  formats: [
    {
      label: 'LIVE EVENTS',
      text: ['CONCERTS, DJ SETS AND HYBRID LIVE PERFORMANCES BRINGING TOGETHER UNDERGROUND ARTISTS AND LOCAL SCENES.'],
      media: null,
    },
    {
      label: 'MUSIC PRODUCTION',
      text: ['COLLABORATIVE CREATION AND RELEASE OF MUSIC BETWEEN ARTISTS FROM DIFFERENT SCENES.'],
      media: null,
    },
    {
      label: 'CREATIVE COLLABORATIONS',
      text: ['PROJECTS CONNECTING MUSIC WITH OTHER CREATIVE FIELDS SUCH AS FASHION, PHOTOGRAPHY, DANCING.'],
      media: null,
    },
    {
      label: '& MORE',
      text: ['ARTIST INTERVIEWS', 'WORKSHOPS', 'LISTENING SESSIONS', '& MORE'],
      media: null,
    },
  ],
  // Deck, slide 6 (all four paragraphs).
  networkText: [
    'r0ttencore is a developing collective initiated by friends based between Paris, Beijing and Tokyo.',
    'Growing up and working across these international cultural environments, the project emerged from a shared interest in music, underground culture, fashion and contemporary creative scenes.',
    'Through personal networks and collaborations, r0ttencore brings together artists, musicians and creatives from different backgrounds, building connections between local communities and wider international scenes.',
    'The project aims to create spaces where new sounds, ideas and collaborations can develop across music, visual culture and emerging cultural environments.',
  ],
  // Low-res photo from the deck (faces hidden); replace with the original in phase 3.
  networkMedia: {
    kind: 'image',
    image: { url: '/images/network-photo.jpg', width: 607, height: 440 },
    alt: 'The r0ttencore collective, faces hidden',
  },
};
