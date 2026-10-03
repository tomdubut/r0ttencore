/*
 * Photo slideshow on event pages.
 * The photos are a horizontal scroll-snap strip (swipeable, works without JS).
 * This script adds prev/next buttons, thumbnails, arrow keys and the "01 / 10" counter.
 */
for (const root of document.querySelectorAll<HTMLElement>('[data-slideshow]')) {
  const strip = root.querySelector<HTMLElement>('[data-slides]')!;
  const slides = [...strip.children] as HTMLElement[];
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const thumbsBox = root.querySelector<HTMLElement>('[data-thumbs]')!;
  const thumbs = [...thumbsBox.querySelectorAll<HTMLButtonElement>('[data-index]')];
  const counter = root.querySelector<HTMLElement>('[data-meta]');
  const total = String(slides.length).padStart(2, '0');
  let current = 0;

  const show = (i: number) => {
    const index = (i + slides.length) % slides.length;
    strip.scrollTo({ left: index * strip.clientWidth });
    setCurrent(index);
  };

  const setCurrent = (index: number) => {
    current = index;
    thumbs.forEach((t, k) => t.setAttribute('aria-current', String(k === index)));
    // Keep the active thumbnail visible in the (mobile) scrolling thumbnail row, without moving the page.
    const thumb = thumbs[index];
    if (thumb && thumbsBox.scrollWidth > thumbsBox.clientWidth) {
      thumbsBox.scrollTo({ left: thumb.offsetLeft - (thumbsBox.clientWidth - thumb.clientWidth) / 2 });
    }
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${total}`;
  };

  // Keep the counter in sync when the visitor swipes.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(slides.indexOf(entry.target as HTMLElement));
      }
    },
    { root: strip, threshold: 0.6 },
  );
  slides.forEach((s) => observer.observe(s));

  // A single photo needs no controls.
  if (slides.length < 2) {
    prev.remove();
    next.remove();
    thumbsBox.remove();
    continue;
  }

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  thumbs.forEach((t, k) => t.addEventListener('click', () => show(k)));
  strip.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1);
    }
  });

  setCurrent(0);
}
