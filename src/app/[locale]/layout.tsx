import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, dir } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import {
  absoluteUrl,
  alternatesFor,
  ogAlternateLocales,
  ogLocale,
  siteConfig,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
// 300 is never used by the UI — fewer weights means fewer preloaded font files
// on every page (the Arabic face ships to both locales from this shared layout).
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("defaultTitle");
  const description = t("defaultDescription");
  return {
    applicationName: siteConfig.name,
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    category: "technology",
    creator: siteConfig.name,
    publisher: siteConfig.name,
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    appleWebApp: {
      title: siteConfig.shortName,
    },
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      url: absoluteUrl(`/${locale}`),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
    alternates: alternatesFor(locale, "/"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // Pass locale + messages explicitly: next-intl's client-provider auto-inheritance
  // relies on a middleware-set header, which is absent under Turbopack `next dev`.
  const messages = await getMessages({ locale });

  const bodyFont = locale === "ar" ? "font-arabic" : "";

  // Pre-paint theme init: set the .dark class + color-scheme before first paint
  // so there is no flash. Injected as RAW HTML (not a JSX <script> element) on a
  // display:contents carrier — React never reconciles a <script> host element,
  // so React 19's dev-only "script tag while rendering" warning cannot fire. The
  // inline script still executes during the initial HTML parse.
  const themeInit =
    "(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(e){}})();";

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      suppressHydrationWarning
      className={`${inter.variable} ${plexArabic.variable} h-full scroll-smooth antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-background text-foreground ${bodyFont}`}>
        <div
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: `<script>${themeInit}</script>` }}
        />
        {/* If JS never runs, scroll-reveal elements must still be visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
