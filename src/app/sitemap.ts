import type { MetadataRoute } from "next";
import { absoluteUrl, localizedPath, siteConfig } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

// Single-page site for now — only Home is indexed. The /services, /approach,
// /about and /contact routes redirect to Home and are intentionally omitted.
const staticRoutes = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
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
