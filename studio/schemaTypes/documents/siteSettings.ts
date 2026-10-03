import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {instagramHandleError} from '../shared/validation'

/** Singleton (fixed ID "siteSettings"): see structure.ts. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'texts', title: 'Short texts'},
  ],
  fields: [
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      group: 'general',
      description: 'Shown in the footer of every page.',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram handle',
      type: 'string',
      group: 'general',
      description: 'Without "@", e.g. r0tten.corp.',
      validation: (rule) => rule.required().custom((value) => instagramHandleError(value)),
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      group: 'general',
      description: 'The genres r0t is about. Type one and press Enter.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'defaultShareImage',
      title: 'Default share image',
      type: 'image',
      group: 'general',
      description: 'Shown when a page without its own image is shared (Instagram stories, WhatsApp…).',
    }),

    // Short sentences shown on the site that are not in the deck.
    defineField({
      name: 'texts',
      title: 'Short texts',
      type: 'object',
      group: 'texts',
      description: 'Small sentences used around the site. Text in [BRACKETS] is a placeholder to replace.',
      fields: [
        defineField({name: 'ticketsSoon', title: 'Button when there is no ticket link yet', type: 'string'}),
        defineField({name: 'followCta', title: 'Events page: call to follow on Instagram', type: 'string'}),
        defineField({name: 'emptyTitle', title: 'Events page: title when a city has no events', type: 'string'}),
        defineField({name: 'emptyText', title: 'Events page: text when a city has no events', type: 'string'}),
        defineField({name: 'nightLabel', title: 'Event page: label above the text about the night', type: 'string'}),
        defineField({name: 'notFoundText', title: '"Page not found" text', type: 'string'}),
        defineField({name: 'eventsDescription', title: 'Events page: description for Google & share cards', type: 'text', rows: 2}),
        defineField({name: 'artistsDescription', title: 'Artists page: description for Google & share cards', type: 'text', rows: 2}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Settings'})},
})
