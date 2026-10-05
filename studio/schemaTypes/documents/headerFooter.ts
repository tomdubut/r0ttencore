import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'

/** The site's pages a menu item can point to. "Contact" scrolls to the footer contact block. */
export const MENU_PAGES = [
  {title: 'Homepage', value: 'home'},
  {title: 'Events', value: 'events'},
  {title: 'Artists', value: 'artists'},
  {title: 'About', value: 'about'},
  {title: 'Contact (footer contact block)', value: 'contact'},
]

/**
 * Singleton (fixed ID "headerFooter"): menu and texts of the header and footer, on every page.
 * The logo, the contact email and the Instagram handle are not here: logo in code, email and
 * Instagram in Settings (they are also used elsewhere on the site).
 */
export const headerFooter = defineType({
  name: 'headerFooter',
  title: 'Header & footer',
  type: 'document',
  icon: MenuIcon,
  groups: [
    {name: 'menu', title: 'Menu', default: true},
    {name: 'footer', title: 'Footer texts'},
  ],
  fields: [
    defineField({
      name: 'menu',
      title: 'Menu',
      type: 'array',
      group: 'menu',
      description:
        'The links in the header and in the footer, in this order. Drag to reorder. On phones they share one row: keep it to 4–5 short words.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuItem',
          title: 'Menu link',
          fields: [
            defineField({
              name: 'label',
              title: 'Text',
              type: 'string',
              description: 'As shown, e.g. EVENTS.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'page',
              title: 'Goes to',
              type: 'string',
              description: 'A page of the site, or “Other link” for any web address.',
              options: {list: [...MENU_PAGES, {title: 'Other link (web address)', value: 'url'}]},
              initialValue: 'events',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Web address',
              type: 'url',
              description: 'e.g. https://… Opens in a new tab.',
              hidden: ({parent}) => parent?.page !== 'url',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {page?: string} | undefined
                  return parent?.page !== 'url' || Boolean(value) || 'Paste the web address.'
                }),
            }),
          ],
          preview: {
            select: {title: 'label', page: 'page', url: 'url'},
            prepare: ({title, page, url}) => ({
              title,
              subtitle: page === 'url' ? url : MENU_PAGES.find((p) => p.value === page)?.title,
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(6).warning('More than 5 links will not fit on one row on phones.'),
    }),
    defineField({
      name: 'nextLabel',
      title: 'Next event button: text before the city',
      type: 'string',
      group: 'menu',
      description:
        'The round button shown in the header and footer while an event is upcoming, e.g. “NEXT” → NEXT: TOKYO. It disappears by itself when there is no upcoming event.',
      initialValue: 'NEXT',
    }),
    defineField({
      name: 'contactLabel',
      title: 'Label above the email',
      type: 'string',
      group: 'footer',
      description: 'The email and Instagram shown under it are edited in Settings.',
      initialValue: 'CONTACT / BOOKINGS',
    }),
    defineField({
      name: 'citiesLine',
      title: 'Cities line (bottom row)',
      type: 'string',
      group: 'footer',
      initialValue: 'PARIS — TOKYO — BEIJING',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright name',
      type: 'string',
      group: 'footer',
      description: 'Shown as “© <current year> <this>”. The year updates by itself.',
      initialValue: 'r0ttencore',
    }),
    defineField({
      name: 'presentedBy',
      title: 'Signature (bottom right)',
      type: 'string',
      group: 'footer',
      initialValue: 'presented by r0ttencore',
    }),
  ],
  preview: {prepare: () => ({title: 'Header & footer'})},
})
