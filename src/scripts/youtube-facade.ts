/*
 * Replaces a YouTube facade link with the real player on click.
 * Uses event delegation, so it works for any facade on the page.
 */
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-yt-id]');
  if (!link || !link.dataset.ytId) return;
  event.preventDefault();

  const iframe = document.createElement('iframe');
  iframe.className = 'yt-frame';
  iframe.src = `https://www.youtube-nocookie.com/embed/${link.dataset.ytId}?autoplay=1&rel=0`;
  iframe.title = link.dataset.ytTitle ?? 'YouTube video';
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  link.replaceWith(iframe);
  iframe.focus();
});
