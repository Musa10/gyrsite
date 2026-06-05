"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { requireUser } from "@/server/session";
import { slugify, RESERVED_SLUGS } from "@/lib/slugify";
import { isEmptyDoc } from "@/lib/tiptap";
import { pageSchema } from "@/lib/schemas/page";

export async function savePage(id: string | null, formData: FormData) {
  await requireUser();

  const parsed = pageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid page");
  }
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);

  if (RESERVED_SLUGS.has(slug)) {
    throw new Error(`"${slug}" is a reserved slug; choose another.`);
  }

  const status = d.status;

  const bodyArParsed = d.bodyAr ? JSON.parse(d.bodyAr) : null;
  const bodyAr = bodyArParsed && !isEmptyDoc(bodyArParsed) ? bodyArParsed : null;

  const data = {
    title: d.title,
    slug,
    body: JSON.parse(d.body),
    titleAr: d.titleAr || null,
    bodyAr: bodyAr ?? Prisma.DbNull,
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    showInNav: d.showInNav === "on",
    navOrder: d.navOrder ? parseInt(d.navOrder, 10) || 0 : 0,
    customLayout: d.customLayout === "on",
  };

  if (id) {
    await prisma.page.update({ where: { id }, data });
  } else {
    await prisma.page.create({ data });
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`);
  revalidatePath("/", "layout"); // refresh nav
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await requireUser();
  const page = await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
  revalidatePath("/", "layout");
}
