// Extract a transparent falcon emblem from the dark vertical lockup.
// The lockup is the teal/cyan falcon on near-black navy, wordmark beneath.
// We crop the top emblem band and luminance-key the dark background to alpha.
import sharp from "sharp";

const SRC = "public/logowithnamedark.png";
const OUT = "public/falcon.png";

// Luminance thresholds (0-255). Pixels darker than LO -> fully transparent;
// brighter than HI -> fully opaque; between -> feathered. Tune after preview.
const LO = 34;
const HI = 64;

const base = sharp(SRC).ensureAlpha();
const meta = await base.metadata();

// Emblem occupies roughly the top 62% of the vertical lockup.
const cropH = Math.round(meta.height * 0.62);
const { data, info } = await base
  .extract({ left: 0, top: 0, width: meta.width, height: cropH })
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = info.channels; // 4
for (let i = 0; i < data.length; i += px) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let a;
  if (lum <= LO) a = 0;
  else if (lum >= HI) a = 255;
  else a = Math.round(((lum - LO) / (HI - LO)) * 255);
  data[i + 3] = a;
}

await sharp(data, { raw: info })
  .png()
  .trim({ threshold: 0 }) // drop fully-transparent margins
  .toFile(OUT);

const out = await sharp(OUT).metadata();
console.log(`wrote ${OUT} ${out.width}x${out.height}`);
