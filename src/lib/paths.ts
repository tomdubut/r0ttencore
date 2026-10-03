/*
 * All internal URLs in one place. They end with "/" because the build outputs
 * /events/index.html etc.: links without the slash would cost a redirect on every click.
 */
export const paths = {
  home: '/',
  events: '/events/',
  about: '/about/',
  event: (slug: string) => `/events/${slug}/`,
  artists: '/artists/',
  artist: (slug: string) => `/artists/${slug}/`,
};
