import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'
import {instagramHandleError} from '../shared/validation'

/** One credited person or venue. Several people can share a role. */
export const credit = defineType({
  name: 'credit',
  title: 'Credit',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'What this person did.',
      options: {
        list: [
          {title: 'Photos', value: 'Photos'},
          {title: 'Video', value: 'Video'},
          {title: 'Location', value: 'Location'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'Photos',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'As it should appear on the website.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram handle (optional)',
      type: 'string',
      description: 'Without "@", e.g. r0tten.corp. The name becomes a link to their Instagram.',
      validation: (rule) => rule.custom((value) => instagramHandleError(value)),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})
