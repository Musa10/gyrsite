"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { requireUser } from "@/server/session";
import { slugify } from "@/lib/slugify";
import { isEmptyDoc } from "@/lib/tiptap";
import { postSchema } from "@/lib/schemas/post";

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function savePost(id: string | null, formData: FormData) {
  const user = await requireUser();

  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid post");
  }
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  const status = d.status;

  const bodyArParsed = d.bodyAr ? JSON.parse(d.bodyAr) : null;
  const bodyAr = bodyArParsed && !isEmptyDoc(bodyArParsed) ? bodyArParsed : null;

  const data = {
    title: d.title,
    slug,
    excerpt: d.excerpt || null,
    body: JSON.parse(d.body),
    titleAr: d.titleAr || null,
    excerptAr: d.excerptAr || null,
    bodyAr: bodyAr ?? Prisma.DbNull,
    coverImageId: d.coverImageId || null,
    tags: parseTags(d.tags),
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    authorId: user.id,
  };

  if (id) {
    await prisma.post.update({ where: { id }, data });
  } else {
    await prisma.post.create({ data });
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireUser();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
