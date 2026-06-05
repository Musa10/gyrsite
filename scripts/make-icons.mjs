// Derive favicons + app icons from the transparent falcon emblem.
// favicon-32/48 + icon-512 are transparent; apple-touch-icon sits on the brand
// navy plate (iOS ignores alpha and rounds the corners itself).
import sharp from "sharp";

const SRC = "public/falcon.png";
const NAVY = { r: 8, g: 14, b: 22, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

async function transparentIcon(size, out) {
  await sharp(SRC)
    .resize(size, size, { fit: "contain", background: CLEAR })
    .png()
    .toFile(out);
  console.log(`wrote ${out} ${size}x${size}`);
}

async function platedIcon(size, pad, out) {
  // emblem padded inside a navy square
  const inner = size - pad * 2;
  const emblem = await sharp(SRC)
    .resize(inner, inner, { fit: "contain", background: CLEAR })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: NAVY },
  })
    .composite([{ input: emblem, gravity: "center" }])
    .png()
    .toFile(out);
  console.log(`wrote ${out} ${size}x${size}`);
}

await transparentIcon(32, "public/favicon-32.png");
await transparentIcon(48, "public/favicon-48.png");
await transparentIcon(512, "public/icon-512.png");
await platedIcon(180, 26, "public/apple-touch-icon.png");
