import {defineArrayMember, defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const CITIES = [
  {title: 'Paris', value: 'Paris'},
  {title: 'Tokyo', value: 'Tokyo'},
  {title: 'Beijing', value: 'Beijing'},
]

/** "2026-11-14" → "14.11.2026" (same format as the website). */
const formatDate = (iso?: string) => (iso ? iso.split('-').reverse().join('.') : 'no date')

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'main', title: 'Event', default: true},
    {name: 'media', title: 'Photos & videos'},
    {name: 'people', title: 'Line-up & credits'},
    {name: 'seo', title: 'Google & sharing'},
  ],
  fields: [
    // ---------- Event ----------
    defineField({
      name: 'title',
      title: 'Event name',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'main',
      description: 'The end of the page address: r0ttencore.com/events/<this>. Click "Generate" to make it from the name.',
      options: {source: 'title', maxLength: 64},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      group: 'main',
      description: 'Two digits, in order: 01, 02, 03…',
      validation: (rule) =>
        rule.required().regex(/^\d{2,3}$/, {name: 'two digits'}).error('Use two digits, e.g. 03.'),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'main',
      description:
        'Upcoming = announced, with tickets. Past = after the night: photos and videos are shown. Switch to Past after the event.',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Past', value: 'past'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'main',
      options: {list: CITIES, layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      group: 'main',
      description: 'Leave empty if not announced yet ("[DATE]" is shown).',
      options: {dateFormat: 'DD.MM.YYYY'},
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      group: 'main',
      description: 'Name of the place. Leave empty if not announced yet.',
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket link',
      type: 'url',
      group: 'main',
      description: 'Where people buy tickets. Shown as the TICKETS button while the event is upcoming.',
      hidden: ({document}) => document?.status === 'past',
    }),
    defineField({
      name: 'text',
      title: 'About the night',
      type: 'text',
      group: 'main',
      rows: 4,
      description: '2–3 sentences: the concept, the venue, the energy.',
      validation: (rule) => rule.max(400).warning('Keep it short: 2–3 sentences.'),
    }),

    // ---------- Photos & videos ----------
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'image',
      group: 'media',
      description: 'Used in event lists, cards and when the page is shared. Choose the focal point with the crop icon.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Description (alt text)',
          type: 'string',
          description: 'What the photo shows, in a few words.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required().error('Add a cover image.'),
    }),
    defineField({
      name: 'heroMedia',
      title: 'Big image or video at the top of the page',
      type: 'media',
      group: 'media',
      description:
        'Fills the right half of the page on computers, a square on phones (cropped to fit). Before the event: the flyer or a teaser. After: a photo or the aftermovie. Avoid vertical videos here (they get black bars).',
    }),
    defineField({
      name: 'gallery',
      title: 'Photos',
      type: 'array',
      group: 'media',
      description: 'Drag to reorder. The first photo is shown first in the slideshow.',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Description (alt text)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      group: 'media',
      description: 'YouTube videos. The first one is the main aftermovie (big player); the others are listed as clips.',
      of: [defineArrayMember({type: 'video'})],
    }),

    // ---------- Line-up & credits ----------
    defineField({
      name: 'lineup',
      title: 'Line-up',
      type: 'array',
      group: 'people',
      description:
        'Pick the artists, in the order you want them shown. To add a new artist, click "Add item", then "Create new".',
      of: [defineArrayMember({type: 'reference', to: [{type: 'artist'}]})],
      validation: (rule) => rule.unique().error('This artist is already in the line-up.'),
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      group: 'people',
      description: 'Photographers, videographers, location. Several people per role is fine.',
      of: [defineArrayMember({type: 'credit'})],
    }),

    // ---------- SEO ----------
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {title: 'Date, newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Number', name: 'numberDesc', by: [{field: 'number', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', number: 'number', city: 'city', date: 'date', status: 'status', media: 'cover'},
    prepare({title, number, city, date, status, media}) {
      const badge = status === 'upcoming' ? 'UPCOMING' : 'PAST'
      return {
        title: `${number ?? '??'} · ${title ?? 'Untitled event'}`,
        subtitle: `${badge} · ${(city ?? 'no city').toUpperCase()} · ${formatDate(date)}`,
        media,
      }
    },
  },
})
