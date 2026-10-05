import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

/** Singleton (fixed ID "artistsPage"): the /artists/ listing. See structure.ts. */
export const artistsPage = defineType({
  name: 'artistsPage',
  title: 'Artists page',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Big title',
      type: 'string',
      description: 'Shown at the top of the artists page. Empty = "They r0tted with us".',
      initialValue: 'They r0tted with us',
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph (optional)',
      type: 'text',
      rows: 3,
      description: 'A few lines under the title. Leave empty to show nothing.',
    }),
    defineField({
      name: 'sortBy',
      title: 'Order of the artists',
      type: 'string',
      description: 'Only artists with "Show artist page" switched on are listed.',
      options: {
        list: [
          {title: 'Name, A → Z', value: 'name'},
          {title: 'Most recent r0t event first', value: 'recent'},
          {title: 'Manual order (drag & drop below)', value: 'manual'},
        ],
        layout: 'radio',
      },
      initialValue: 'name',
    }),
    defineField({
      name: 'manualOrder',
      title: 'Manual order',
      type: 'array',
      description:
        'Drag to reorder. Artists you don’t add here are listed after these, A → Z. Only artists with their page switched on appear on the site.',
      hidden: ({document}) => document?.sortBy !== 'manual',
      of: [defineArrayMember({type: 'reference', to: [{type: 'artist'}]})],
      validation: (rule) => rule.unique().error('This artist is already in the list.'),
    }),
    defineField({
      name: 'filterBy',
      title: 'Filter buttons',
      type: 'string',
      description:
        'The buttons under the title, built from the artists’ “Based in” city, or from their genres. By genre: one button per genre of Settings → Genres that at least one artist has (same spelling).',
      options: {
        list: [
          {title: 'By city (“Based in”)', value: 'city'},
          {title: 'By genre', value: 'genre'},
          {title: 'No filter buttons', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'city',
    }),
  ],
  preview: {prepare: () => ({title: 'Artists page'})},
})
