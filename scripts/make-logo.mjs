// Extract a transparent, tightly-trimmed horizontal lockup for the nav from the
// dark horizontal lockup PNG (falcon + GYR + جير on near-black navy). Luminance-
// key the dark background to alpha, then trim the dead padding. Same technique as
// scripts/make-falcon.mjs. Tune LO/HI if there's a halo (raise LO) or eaten
// edges (lower HI), then re-run.
import sharp from "sharp";

const SRC = "public/logoHorizentaldark.png";
const OUT = "public/logo-horizontal.png";

const LO = 28;
const HI = 60;

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
  if (lum <= LO) a = 0;
  else if (lum >= HI) a = 255;
  else a = Math.round(((lum - LO) / (HI - LO)) * 255);
  data[i + 3] = a;
}

await sharp(data, { raw: info })
  .png()
  .trim({ threshold: 0 })
  .toFile(OUT);

const m = await sharp(OUT).metadata();
console.log(`wrote ${OUT} ${m.width}x${m.height} ratio=${(m.width / m.height).toFixed(2)}`);
