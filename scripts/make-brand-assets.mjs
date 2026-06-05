import sharp from "sharp";
import { readFileSync } from "node:fs";

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const MARK = readFileSync("public/gyr-falcon-alone-clean.svg");
const WORDMARK = readFileSync("public/gyr-technology-logo-clean-outlined.svg").toString();

// Square PNG favicon/apple-icon: black mark centered on white with padding.
async function markSquare(size, pad, out) {
  const mark = await sharp(MARK)
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: WHITE })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(out);
}

await markSquare(32, 5, "public/favicon-32.png");
await markSquare(48, 7, "public/favicon-48.png");
await markSquare(180, 28, "public/apple-touch-icon.png");

// OG image: 1200x630 white, outlined wordmark centered, hairline rule beneath.
const wordmark = await sharp(Buffer.from(WORDMARK.replace(/#000000/g, "#0a0a0a")))
  .resize(620, null, { fit: "contain" })
  .png()
  .toBuffer();

await sharp({ create: { width: 1200, height: 630, channels: 4, background: WHITE } })
  .composite([
    { input: wordmark, gravity: "centre" },
    {
      input: Buffer.from(
        `<svg width="1200" height="630"><rect x="290" y="430" width="620" height="2" fill="#e4e4e7"/></svg>`
      ),
      top: 0,
      left: 0,
    },
  ])
  .png()
  .toFile("public/og.png");

console.log("brand assets written");
