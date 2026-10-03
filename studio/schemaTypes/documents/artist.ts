import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'
import {instagramHandleError} from '../shared/validation'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'main', title: 'Artist', default: true},
    {name: 'work', title: 'Work (photos & videos)'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'main',
      description: 'As it should appear on the website and in line-ups.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showPage',
      title: 'Show artist page',
      type: 'boolean',
      group: 'main',
      description:
        'Off: the artist only appears in line-ups (with a link to their Instagram). On: they get their own page. Switch on once there is a description and a few photos.',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'main',
      description: 'r0ttencore.com/artists/<this>. Click "Generate".',
      options: {source: 'name', maxLength: 64},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram handle',
      type: 'string',
      group: 'main',
      description: 'Without "@", e.g. r0tten.corp.',
      validation: (rule) => rule.custom((value) => instagramHandleError(value)),
    }),
    defineField({
      name: 'basedIn',
      title: 'Based in',
      type: 'string',
      group: 'main',
      description: 'City, e.g. Paris. Used for the city filter on the artists page.',
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      group: 'main',
      description: 'Type a genre and press Enter. Use the same spelling as in Settings → Genres.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'main',
      rows: 5,
      description: 'A short presentation. Use text provided or approved by the artist.',
    }),
    defineField({
      name: 'portrait',
      title: 'Main photo or video',
      type: 'media',
      group: 'work',
      description: 'Shown big at the top of the artist page. Only use material the artist has provided or approved.',
    }),
    defineField({
      name: 'work',
      title: 'Work',
      type: 'array',
      group: 'work',
      description: 'Photos and/or YouTube videos of their work. Drag to reorder.',
      of: [defineArrayMember({type: 'media'})],
    }),
    defineField({
      name: 'credits',
      title: 'Photo / video credits',
      type: 'array',
      group: 'work',
      description: 'Who took the photos and videos above. Each one can then be credited to one of them ("Photo / video by").',
      of: [defineArrayMember({type: 'credit'})],
    }),
  ],
  orderings: [{title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', basedIn: 'basedIn', showPage: 'showPage', image: 'portrait.image', poster: 'portrait.poster'},
    prepare({title, basedIn, showPage, image, poster}) {
      return {
        title,
        subtitle: `${showPage ? 'PAGE ON' : 'no page'}${basedIn ? ` · ${basedIn}` : ''}`,
        media: image ?? poster,
      }
    },
  },
})
