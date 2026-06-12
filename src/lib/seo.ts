import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export const siteConfig = {
  name: "GYR Technology",
  shortName: "GYR",
  url: siteUrl,
  email: "contact@gyr.ae",
  defaultLocale: "en",
  locales: ["en", "ar"] as const,
  ogImage: "/og.png",
};

type Locale = (typeof siteConfig.locales)[number];

type MetadataInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
};

const localePrefixPattern = /^\/(en|ar)(?=\/|$)/;

export function absoluteUrl(path: string = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, `${siteConfig.url}/`).toString();
}

export function stripLocale(path: string = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const stripped = normalized.replace(localePrefixPattern, "") || "/";
  return stripped === "" ? "/" : stripped;
}

export function localizedPath(locale: string, path: string = "/") {
  const cleanPath = stripLocale(path);
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

export function alternatesFor(locale: string, path: string = "/") {
  const languages: Record<string, string> = Object.fromEntries(
    siteConfig.locales.map((l) => [l, localizedPath(l, path)]),
  );
  languages["x-default"] = localizedPath(siteConfig.defaultLocale, path);

  return {
    canonical: localizedPath(locale, path),
    languages,
  };
}

export function brandedTitle(title: string) {
  return title.includes(siteConfig.shortName)
    ? title
    : `${title} | ${siteConfig.name}`;
}

export function createMetadata({
  locale,
  path = "/",
  title,
  description,
  image = siteConfig.ogImage,
  type = "website",
}: MetadataInput): Metadata {
  const alternates = alternatesFor(locale, path);
  const canonical = absoluteUrl(alternates.canonical);
  const imageUrl = absoluteUrl(image ?? siteConfig.ogImage);
  const fullTitle = brandedTitle(title);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: locale === "ar" ? "ar" : "en_US",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    email: siteConfig.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "business inquiries",
      email: siteConfig.email,
      availableLanguage: ["English", "Arabic"],
    },
  };
}

export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl(`/${locale}#website`),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: absoluteUrl(localizedPath(locale, "/")),
    inLanguage: locale,
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
  };
}

export function articleJsonLd({
  locale,
  path,
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  locale: Locale | string;
  path: string;
  title: string;
  description?: string | null;
  image?: string | null;
  datePublished?: Date | null;
  dateModified?: Date | null;
  authorName?: string | null;
}) {
  const url = absoluteUrl(localizedPath(locale, path));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: url,
    headline: title,
    description: description ?? undefined,
    image: image ? [absoluteUrl(image)] : [absoluteUrl(siteConfig.ogImage)],
    datePublished: datePublished?.toISOString(),
    dateModified: (dateModified ?? datePublished)?.toISOString(),
    inLanguage: locale,
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@id": absoluteUrl("/#organization") },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
  };
}
