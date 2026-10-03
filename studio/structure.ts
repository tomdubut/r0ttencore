import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {ClockIcon} from '@sanity/icons/Clock'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {UsersIcon} from '@sanity/icons/Users'

/**
 * Studio sidebar:
 *   Settings · Homepage · About   (single pages, opened directly)
 *   Events → Upcoming / Past / All
 *   Artists
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('r0t')
    .items([
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Settings')),
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Homepage')),
      S.listItem()
        .title('About page')
        .icon(InfoOutlineIcon)
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('About page')),

      S.divider(),

      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Upcoming')
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title('Upcoming events')
                    .schemaType('event')
                    .filter('_type == "event" && status == "upcoming"')
                    .defaultOrdering([{field: 'date', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Past')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Past events')
                    .schemaType('event')
                    .filter('_type == "event" && status == "past"')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.divider(),
              S.documentTypeListItem('event').title('All events'),
            ]),
        ),
      S.documentTypeListItem('artist').title('Artists').icon(UsersIcon),
    ])
