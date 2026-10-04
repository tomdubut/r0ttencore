/*
 * Generates the favicons from the logo: public/favicon.ico (32 px), public/icon.png (512 px),
 * public/apple-touch-icon.png (180 px). Light logo on the dark brand background (#101010).
 * Run after replacing the logo:  node scripts/make-icons.mjs [path/to/logo.png]
 * Uses sharp (installed with Astro).
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const source = process.argv[2] ?? 'public/brand/logo-cup.png';
const BG = '#101010';

/** Square icon of `size` px: the logo trimmed, made light, centred with a margin. */
async function icon(size) {
  const inner = Math.round(size * 0.86);
  const { data, info } = await sharp(source)
    .trim()
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Recolour every pixel to the light brand colour and strengthen its opacity:
  // the thin ASCII strokes fade away at icon sizes otherwise.
  const ch = info.channels; // 2 (grey + alpha) or 4 (RGBA)
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += ch, o += 4) {
    out[o] = 0xef; out[o + 1] = 0xef; out[o + 2] = 0xeb; // --bg-light
    out[o + 3] = Math.min(255, data[i + ch - 1] * 2.2);
  }
  const logo = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

/** Minimal .ico file wrapping one PNG image (supported by all current browsers). */
function ico(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6); // width
  header.writeUInt8(size, 7); // height
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14); // image size
  header.writeUInt32LE(22, 18); // image offset
  return Buffer.concat([header, png]);
}

await writeFile('public/icon.png', await icon(512));
await writeFile('public/apple-touch-icon.png', await icon(180));
await writeFile('public/favicon.ico', ico(await icon(32), 32));
console.log('Icons written to public/ from', source);
