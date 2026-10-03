/*
 * Turns a Sanity image (asset + crop + hotspot) into what <Media> needs:
 * a default URL, a responsive srcset (WebP/AVIF via auto=format), the size after cropping,
 * and the editor's focal point as a CSS object-position (so object-fit: cover keeps it visible).
 *
 * All image URLs on the site go through this file: switching image delivery later
 * (e.g. build-time images served by Cloudflare, docs/phase-2-plan.md option B) only changes this file.
 */
import { createImageUrlBuilder } from '@sanity/image-url';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './sanity';
import type { ImageAsset } from './types';

const builder = createImageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET });

const WIDTHS = [320, 480, 640, 800, 1080, 1280, 1600, 1920, 2400];

export interface SanityImageInput {
  asset?: { _id?: string; metadata?: { dimensions?: { width?: number; height?: number } | null } | null } | null;
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
  hotspot?: { x?: number; y?: number } | null;
}

export function toImageAsset(image: SanityImageInput | null | undefined): ImageAsset | null {
  const id = image?.asset?._id;
  const dims = image?.asset?.metadata?.dimensions;
  if (!id || !dims?.width || !dims?.height) return null;

  const crop = { top: 0, bottom: 0, left: 0, right: 0, ...(image.crop ?? {}) };
  const keepW = 1 - crop.left - crop.right;
  const keepH = 1 - crop.top - crop.bottom;
  const width = Math.round(dims.width * keepW);
  const height = Math.round(dims.height * keepH);

  // Hotspot is relative to the full image; express it relative to the cropped area.
  const hx = image.hotspot?.x ?? 0.5;
  const hy = image.hotspot?.y ?? 0.5;
  const px = Math.min(100, Math.max(0, ((hx - crop.left) / keepW) * 100));
  const py = Math.min(100, Math.max(0, ((hy - crop.top) / keepH) * 100));

  const source = { asset: { _ref: id }, crop: image.crop ?? undefined, hotspot: image.hotspot ?? undefined };
  const url = (w: number) => builder.image(source).width(w).fit('max').auto('format').quality(80).url();
  const widths = WIDTHS.filter((w) => w < width).concat(width);

  return {
    url: url(Math.min(1280, width)),
    width,
    height,
    srcset: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    position: `${px.toFixed(1)}% ${py.toFixed(1)}%`,
  };
}
