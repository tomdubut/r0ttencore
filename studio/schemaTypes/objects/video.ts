import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'
import {isYouTubeUrl} from '../shared/validation'
import {creditByField} from '../shared/creditBy'

/** A YouTube video with a title (event videos: aftermovie + clips). */
export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown on the website, e.g. "Aftermovie" or the artist’s name for a clip.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'YouTube link',
      type: 'url',
      description: 'Paste the video address from YouTube.',
      validation: (rule) =>
        rule.custom((value) => !value || isYouTubeUrl(value) || 'This doesn’t look like a YouTube link.'),
    }),
    creditByField('Video by'),
  ],
  preview: {
    select: {title: 'title', subtitle: 'url'},
    prepare: ({title, subtitle}) => ({title, subtitle: subtitle || 'No link yet'}),
  },
})
