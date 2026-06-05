// Extract a transparent, tightly-trimmed horizontal lockup for the LIGHT theme
// nav from the light lockup PNG (teal falcon + GYR + جير on white). Luminance-
// key the WHITE background to alpha (inverse of scripts/make-logo.mjs), then
// trim dead padding. If a white halo remains, lower HI; if light edges of the
// marks get eaten, raise LO. Re-run until clean.
import sharp from "sharp";

const SRC = "public/logoHorizentallight.png";
const OUT = "public/logo-horizontal-light.png";

// Background ~white (high luminance); marks dark teal (low luminance).
const LO = 200; // lum <= LO -> fully opaque (the marks)
const HI = 240; // lum >= HI -> fully transparent (white background)

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = info.channels;
for (let i = 0; i < data.length; i += px) {
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let a;
  if (lum >= HI) a = 0;
  else if (lum <= LO) a = 255;
  else a = Math.round(((HI - lum) / (HI - LO)) * 255);
  data[i + 3] = a;
}

await sharp(data, { raw: info })
  .png()
  .trim({ threshold: 0 })
  .toFile(OUT);

const m = await sharp(OUT).metadata();
console.log(`wrote ${OUT} ${m.width}x${m.height} ratio=${(m.width / m.height).toFixed(2)}`);
