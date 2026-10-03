/* Small display helpers. */
import type { Media, Video } from './types';

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

/** A video entry as a media slot (null URL → placeholder). */
export function videoMedia(video: Video | undefined): Media {
  return video?.url ? { kind: 'youtube', url: video.url, title: video.title } : null;
}

/** Alternating section themes: alternate('dark', 3) → ['dark', 'light', 'dark']. */
export function alternate(first: 'dark' | 'light', count: number): ('dark' | 'light')[] {
  return Array.from({ length: count }, (_, i) => ((i % 2 === 0) === (first === 'dark') ? 'dark' : 'light'));
}
