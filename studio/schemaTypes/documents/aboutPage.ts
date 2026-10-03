import {defineArrayMember, defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'

/** Singleton (fixed ID "aboutPage"): see structure.ts. */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    {name: 'intro', title: 'What is r0t?', default: true},
    {name: 'sounds', title: 'The sounds'},
    {name: 'formats', title: 'Formats'},
    {name: 'network', title: 'Network'},
  ],
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro paragraphs',
      type: 'array',
      group: 'intro',
      description: 'One paragraph per item.',
      of: [defineArrayMember({type: 'text', rows: 3})],
    }),
    defineField({
      name: 'cities',
      title: 'Cities line',
      type: 'string',
      group: 'intro',
      description: 'e.g. PARIS. TOKYO. BEIJING',
    }),
    defineField({
      name: 'soundsText',
      title: 'Text',
      type: 'array',
      group: 'sounds',
      description: 'One paragraph per item.',
      of: [defineArrayMember({type: 'text', rows: 3})],
    }),
    defineField({
      name: 'genreCloud',
      title: 'Genre cloud',
      type: 'array',
      group: 'sounds',
      description: 'The genres in the black box, in order, each with a size.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cloudGenre',
          title: 'Genre',
          fields: [
            defineField({name: 'name', title: 'Genre', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Small', value: 's'},
                  {title: 'Medium', value: 'm'},
                  {title: 'Large', value: 'l'},
                  {title: 'Extra large', value: 'xl'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'm',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'size'}},
        }),
      ],
    }),
    defineField({
      name: 'formats',
      title: 'Formats',
      type: 'array',
      group: 'formats',
      description: 'The cards (4 on the current design), in order.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'format',
          title: 'Format',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'array',
              description: 'One item = one line. Several items are shown as a list.',
              of: [defineArrayMember({type: 'string'})],
            }),
            defineField({name: 'media', title: 'Photo or video', type: 'media'}),
          ],
          preview: {select: {title: 'label', media: 'media.image'}},
        }),
      ],
      validation: (rule) => rule.max(4).warning('The design is made for 4 cards.'),
    }),
    defineField({
      name: 'networkText',
      title: 'Text',
      type: 'array',
      group: 'network',
      description: 'One paragraph per item.',
      of: [defineArrayMember({type: 'text', rows: 3})],
    }),
    defineField({
      name: 'networkMedia',
      title: 'Photo or video',
      type: 'media',
      group: 'network',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description for Google & share cards',
      type: 'text',
      group: 'intro',
      rows: 2,
      validation: (rule) => rule.max(160).warning('Keep it under 160 characters.'),
    }),
  ],
  preview: {prepare: () => ({title: 'About page'})},
})
