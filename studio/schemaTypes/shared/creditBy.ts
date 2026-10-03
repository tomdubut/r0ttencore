import {defineField} from 'sanity'
import {CreditPickerInput} from './CreditPickerInput'

/** Documents that have a "credits" list (the people the dropdown is filled from). */
const HAS_CREDITS = ['event', 'artist']

/**
 * "Photo by" / "Video by" on one photo or video: a person from the document's Credits list.
 * Empty = automatic: the site uses the only person credited for that role, if there is just one.
 * Hidden on pages without a Credits list (homepage, about).
 */
export const creditByField = (title: string) =>
  defineField({
    name: 'by',
    title,
    type: 'string',
    description:
      'Who took it. Leave on “Automatic” if only one person is credited for photos (or for video) on this page.',
    components: {input: CreditPickerInput},
    hidden: ({document}) => !HAS_CREDITS.includes(document?._type ?? ''),
    validation: (rule) =>
      rule.custom((value, context) => {
        if (!value) return true
        const credits = (context.document?.credits ?? []) as {_key: string}[]
        return credits.some((c) => c._key === value) || 'This person is no longer in Credits.'
      }),
  })
