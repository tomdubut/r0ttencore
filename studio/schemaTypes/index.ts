import {aboutPage} from './documents/aboutPage'
import {artist} from './documents/artist'
import {event} from './documents/event'
import {homePage} from './documents/homePage'
import {siteSettings} from './documents/siteSettings'
import {credit} from './objects/credit'
import {media} from './objects/media'
import {seo} from './objects/seo'
import {video} from './objects/video'

export const schemaTypes = [
  // documents
  event,
  artist,
  homePage,
  aboutPage,
  siteSettings,
  // objects
  media,
  video,
  credit,
  seo,
]

/** One-of-a-kind documents: opened directly from the sidebar, never created, duplicated or deleted. */
export const SINGLETONS = ['siteSettings', 'homePage', 'aboutPage']
