/** True for the common YouTube URL forms (watch, youtu.be, shorts, embed, live). Same rule as the website. */
export function isYouTubeUrl(url: string): boolean {
  return /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))[\w-]{11}/.test(url)
}

/** Instagram handle without "@" or URL: letters, numbers, dots, underscores. */
export function instagramHandleError(value: string | undefined): true | string {
  if (!value) return true
  if (value.startsWith('@')) return 'Write the handle without "@", e.g. r0tten.corp'
  if (value.includes('/')) return 'Write only the handle, not the full link, e.g. r0tten.corp'
  return /^[A-Za-z0-9._]{1,30}$/.test(value) || 'Only letters, numbers, dots and underscores.'
}
