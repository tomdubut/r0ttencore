import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

/** Singleton (one document, fixed ID "homePage"): see structure.ts. */
export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heroMedia',
      title: 'Big image or video at the top',
      type: 'media',
      description: 'Fills the whole first screen. The "r0t" logo text and the tagline sit on top of it, so pick something not too bright.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'array',
      description: 'One line per item, shown top right of the first screen.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'cities',
      title: 'Cities line',
      type: 'string',
      description: 'Shown at the bottom of the first screen, e.g. PARIS. TOKYO. BEIJING',
    }),
    defineField({
      name: 'whatIs',
      title: '"What is r0t?" paragraphs',
      type: 'array',
      description: 'One paragraph per item.',
      of: [defineArrayMember({type: 'text', rows: 3})],
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description for Google & share cards',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(160).warning('Keep it under 160 characters.'),
    }),
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})
