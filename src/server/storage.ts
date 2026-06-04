import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type StoredFile = { url: string; filename: string };

/** Persist bytes and return a public URL. Swap this body for S3/R2 later. */
export async function storeFile(
  filename: string,
  bytes: Buffer
): Promise<StoredFile> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const safe = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  await writeFile(path.join(UPLOAD_DIR, safe), bytes);
  return { url: `/uploads/${safe}`, filename: safe };
}
