import type { MetadataRoute } from "next";
import { absoluteUrl, localizedPath, siteConfig } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

const staticRoutes = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/approach", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
] as const;

function localizedEntries({
  path,
  changeFrequency,
  priority,
}: {
  path: string;
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
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.flatMap((route) => localizedEntries(route));
}
