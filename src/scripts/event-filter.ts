/*
 * City filter on /events. Progressive enhancement: the filter row is only displayed
 * when html.js is set (see the page styles), so without JS all events are simply listed.
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
      const show = city === 'ALL' || row.dataset.city?.toUpperCase() === city;
      row.hidden = !show;
      if (show) visible++;
    }

    if (empty) empty.hidden = visible > 0;
    if (count) count.textContent = `(${String(visible).padStart(2, '0')})`;
  });
}
