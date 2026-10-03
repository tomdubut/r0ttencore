import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'
import {isYouTubeUrl} from '../shared/validation'

/**
 * One photo-or-video slot. The editor picks "Image" or "YouTube video";
 * only the fields of the chosen type are shown. The website renders whichever was chosen.
 */
export const media = defineType({
  name: 'media',
  title: 'Photo or video',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      description: 'Show a photo, or a YouTube video (plays when the visitor clicks).',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'YouTube video', value: 'youtube'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Upload a photo. Click the crop icon to choose the focal point: it stays visible when the photo is cropped to fit.',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.kind === 'youtube',
      fields: [
        defineField({
          name: 'alt',
          title: 'Description (alt text)',
          type: 'string',
          description: 'What the photo shows, for blind visitors and search engines. Example: "Crowd at r0t 02 in Paris".',
          validation: (rule) => rule.required().error('Describe the photo in a few words.'),
        }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {kind?: string} | undefined
          if (parent?.kind === 'youtube') return true
          return value?.asset ? true : 'Upload an image, or switch the type to "YouTube video".'
        }),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube link',
      type: 'url',
      description: 'Paste the video address from YouTube, e.g. https://www.youtube.com/watch?v=…',
      hidden: ({parent}) => parent?.kind !== 'youtube',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {kind?: string} | undefined
          if (parent?.kind !== 'youtube') return true
          if (!value) return 'Paste a YouTube link.'
          return isYouTubeUrl(value) || 'This doesn’t look like a YouTube link.'
        }),
    }),
    defineField({
      name: 'title',
      title: 'Video title',
      type: 'string',
      description: 'Short title, read by screen readers and shown on the play button. Example: "Aftermovie r0t 02".',
      hidden: ({parent}) => parent?.kind !== 'youtube',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {kind?: string} | undefined
          return parent?.kind !== 'youtube' || Boolean(value) || 'Give the video a short title.'
        }),
    }),
    defineField({
      name: 'poster',
      title: 'Cover image for the video (optional)',
      type: 'image',
      description: 'Shown before the video plays. If empty, YouTube’s own thumbnail is used.',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.kind !== 'youtube',
    }),
  ],
  preview: {
    select: {kind: 'kind', image: 'image', alt: 'image.alt', title: 'title', url: 'youtubeUrl', poster: 'poster'},
    prepare({kind, image, alt, title, url, poster}) {
      return kind === 'youtube'
        ? {title: title || 'YouTube video', subtitle: url || 'No link yet', media: poster}
        : {title: alt || 'Image', subtitle: image ? 'Image' : 'No image yet', media: image}
    },
  },
})
