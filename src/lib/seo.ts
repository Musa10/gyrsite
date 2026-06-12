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

/** Open Graph locale codes (ll_CC form) for our locales. */
export function ogLocale(locale: string) {
  return locale === "ar" ? "ar_AE" : "en_US";
}

export function ogAlternateLocales(locale: string) {
  return siteConfig.locales.filter((l) => l !== locale).map(ogLocale);
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
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
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

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
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

