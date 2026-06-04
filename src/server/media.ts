import sharp from "sharp";
import { prisma } from "@/db/prisma";
import { storeFile } from "@/server/storage";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export async function createMediaFromUpload(file: File) {
  if (!ALLOWED.has(file.type)) throw new Error("Unsupported file type");
  if (file.size > MAX_BYTES) throw new Error("File too large (max 8MB)");

  const bytes = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(bytes).metadata();
  const { url, filename } = await storeFile(file.name, bytes);

  return prisma.media.create({
    data: {
      filename,
      url,
      mimeType: file.type,
      size: file.size,
      width: meta.width ?? null,
      height: meta.height ?? null,
    },
  });
}

export function listMedia() {
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
}
