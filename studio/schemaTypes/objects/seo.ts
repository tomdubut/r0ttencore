import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'

/** Optional overrides for Google and social share cards. Empty = sensible defaults from the content. */
export const seo = defineType({
  name: 'seo',
  title: 'Google & sharing (optional)',
  type: 'object',
  icon: SearchIcon,
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Title for Google & share cards',
      type: 'string',
      description: 'Leave empty to use the normal title.',
      validation: (rule) => rule.max(60).warning('Google cuts titles after about 60 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: 'One or two sentences shown under the title in Google and in share cards.',
      validation: (rule) => rule.max(160).warning('Keep it under 160 characters.'),
    }),
    defineField({
      name: 'image',
      title: 'Share image',
      type: 'image',
      description: 'Shown when the page is shared (Instagram stories, WhatsApp…). Leave empty to use the cover image.',
    }),
  ],
})
