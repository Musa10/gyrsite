// One-off: rasterize the falcon mark into PWA manifest icons (192/512).
// White full-bleed background + centered mark inside the maskable safe zone.
// Run: node scripts/generate-manifest-icons.mjs
import sharp from "sharp";

const FALCON =
  "M22 31 L22 73 L63 112 L22 113 L22 155 L64 113 L119 113 L108 102 L96 102 Z";

// Path bounds: x 22..119 (w 97), y 31..155 (h 124). Scale to ~58% of canvas
// height so the mark survives any mask shape, centered.
function svg(size) {
  const markH = size * 0.58;
  const scale = markH / 124;
  const markW = 97 * scale;
  const tx = (size - markW) / 2;
  const ty = (size - markH) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  <path d="${FALCON}" fill="#0a0a0a"
    transform="translate(${tx},${ty}) scale(${scale}) translate(-22,-31)"/>
</svg>`;
}

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg(size))).png().toFile(`public/icon-${size}.png`);
  console.log(`public/icon-${size}.png written`);
}
