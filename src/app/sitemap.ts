import type { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import { RESERVED_SLUGS } from "@/lib/slugify";
import { absoluteUrl, localizedPath, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/team", changeFrequency: "monthly", priority: 0.5 },
] as const;

function localizedEntries({
  path,
  lastModified,
  changeFrequency,
  priority,
}: {
  path: string;
  lastModified?: Date;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}): SitemapEntry[] {
  const languages = Object.fromEntries(
    siteConfig.locales.map((locale) => [
      locale,
      absoluteUrl(localizedPath(locale, path)),
    ]),
  );

  return siteConfig.locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages,
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: SitemapEntry[] = staticRoutes.flatMap((route) =>
    localizedEntries({ ...route, lastModified: now }),
  );

  try {
    const [posts, pages] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
      prisma.page.findMany({
        where: { status: "PUBLISHED", customLayout: false },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
    ]);

    entries.push(
      ...posts.flatMap((post) =>
        localizedEntries({
          path: `/blog/${post.slug}`,
          lastModified: post.updatedAt ?? post.publishedAt ?? now,
          changeFrequency: "monthly",
          priority: 0.6,
        }),
      ),
    );

    entries.push(
      ...pages
        .filter((page) => !RESERVED_SLUGS.has(page.slug.split("/")[0]))
        .flatMap((page) =>
          localizedEntries({
            path: `/${page.slug}`,
            lastModified: page.updatedAt ?? page.publishedAt ?? now,
            changeFrequency: "monthly",
            priority: 0.5,
          }),
        ),
    );
  } catch {
    return entries;
  }

  return entries;
}
