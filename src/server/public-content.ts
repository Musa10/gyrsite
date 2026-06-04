import { prisma } from "@/db/prisma";

export function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { coverImage: true, author: true },
  });
}

export function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { coverImage: true, author: true },
  });
}

export function getPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export function getNavPages() {
  return prisma.page.findMany({
    where: { status: "PUBLISHED", showInNav: true },
    orderBy: { navOrder: "asc" },
    select: { title: true, slug: true },
  });
}

export function getPublishedTeam() {
  return prisma.teamMember.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { photo: true },
  });
}
