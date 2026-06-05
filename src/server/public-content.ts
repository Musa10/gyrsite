import { prisma } from "@/db/prisma";
import { pickLocalized } from "@/lib/i18n/pick-localized";

type LocaleArg = string;

export async function getPublishedPosts(locale: LocaleArg = "en") {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { coverImage: true, author: true },
  });
  return posts.map((p) => ({
    ...p,
    title: pickLocalized(p.title, p.titleAr, locale),
    excerpt: pickLocalized(p.excerpt, p.excerptAr, locale),
    body: pickLocalized(p.body, p.bodyAr, locale),
  }));
}

export async function getPostBySlug(slug: string, locale: LocaleArg = "en") {
  const p = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { coverImage: true, author: true },
  });
  if (!p) return null;
  return {
    ...p,
    title: pickLocalized(p.title, p.titleAr, locale),
    excerpt: pickLocalized(p.excerpt, p.excerptAr, locale),
    body: pickLocalized(p.body, p.bodyAr, locale),
  };
}

export async function getPageBySlug(slug: string, locale: LocaleArg = "en") {
  const p = await prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!p) return null;
  return {
    ...p,
    title: pickLocalized(p.title, p.titleAr, locale),
    body: pickLocalized(p.body, p.bodyAr, locale),
  };
}

export async function getNavPages(locale: LocaleArg = "en") {
  const pages = await prisma.page.findMany({
    where: { status: "PUBLISHED", showInNav: true },
    orderBy: { navOrder: "asc" },
    select: { title: true, titleAr: true, slug: true },
  });
  return pages.map((p) => ({
    slug: p.slug,
    title: pickLocalized(p.title, p.titleAr, locale),
  }));
}

export async function getPublishedTeam(locale: LocaleArg = "en") {
  const members = await prisma.teamMember.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { photo: true },
  });
  return members.map((m) => ({
    ...m,
    role: pickLocalized(m.role, m.roleAr, locale),
    bio: pickLocalized(m.bio, m.bioAr, locale),
  }));
}
