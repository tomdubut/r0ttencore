/*
 * Fade-in on scroll for elements marked [data-reveal].
 * CSS only hides them when motion is allowed (see base.css), so with reduced motion
 * or without JS everything is simply visible.
 */
const items = document.querySelectorAll<HTMLElement>('[data-reveal]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  items.forEach((el) => observer.observe(el));
} else {
  items.forEach((el) => el.classList.add('is-visible'));
}
