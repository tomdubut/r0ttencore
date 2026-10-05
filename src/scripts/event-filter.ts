/*
 * Filter buttons on /events (by city) and /artists/ (by city or genre).
 * Each row's data-city holds its value(s), several separated by "|" (e.g. an artist's genres).
 * Progressive enhancement: the filter row is only displayed when html.js is set
 * (see the page styles), so without JS everything is simply listed.
 */
const bar = document.querySelector<HTMLElement>('[data-filters]');
const rows = [...document.querySelectorAll<HTMLElement>('[data-rows] [data-city]')];
const empty = document.querySelector<HTMLElement>('[data-empty]');
const count = document.querySelector<HTMLElement>('[data-count]');

if (bar) {
  const buttons = [...bar.querySelectorAll<HTMLButtonElement>('[data-filter]')];

  bar.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-filter]');
    if (!button) return;
    const city = button.dataset.filter;

    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));

    let visible = 0;
    for (const row of rows) {
      const values = (row.dataset.city ?? '').toUpperCase().split('|');
      const show = city === 'ALL' || (city !== undefined && values.includes(city));
      row.hidden = !show;
      if (show) visible++;
    }

    if (empty) empty.hidden = visible > 0;
    if (count) count.textContent = `(${String(visible).padStart(2, '0')})`;
  });
}
