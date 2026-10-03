/* Small display helpers. */

/** "2026-11-14" → "14.11.2026". Null → the [DATE] placeholder. */
export function formatDate(iso: string | null): string {
  if (!iso) return '[DATE]';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** Two-digit counter: 2 → "02". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Extracts the video id from any common YouTube URL form. */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, '')}/`;
