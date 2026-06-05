// Compose a 1200x630 OG card: deep-navy plate + horizontal lockup centered.
import sharp from "sharp";

const W = 1200,
  H = 630;
const bg = {
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 6, g: 11, b: 18, alpha: 1 },
  },
};
const logo = await sharp("public/logoHorizentaldark.png")
  .resize({ width: 720 })
  .toBuffer();
const lm = await sharp(logo).metadata();

await sharp(bg)
  .composite([
    {
      input: logo,
      top: Math.round((H - lm.height) / 2),
      left: Math.round((W - lm.width) / 2),
    },
  ])
  .png()
  .toFile("public/og.png");

console.log(`wrote public/og.png ${W}x${H}`);
