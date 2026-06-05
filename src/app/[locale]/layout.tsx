import type { Metadata } from "next";
import { Sora, Michroma, IBM_Plex_Sans_Arabic, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, dir } from "@/i18n/routing";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: {
      default: "GYR — Innovating Tomorrow. Elevating Performance.",
      template: "%s · GYR",
    },
    description: t("heroBody"),
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      title: "GYR — Innovating Tomorrow. Elevating Performance.",
      description: "Technology Forward. UAE Proud.",
      images: [{ url: "/brand/banner.png", width: 1731, height: 909 }],
    },
    alternates: {
      languages: { en: "/en", ar: "/ar" },
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

  const bodyFont = locale === "ar" ? "font-arabic" : "";

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${sora.variable} ${michroma.variable} ${plexArabic.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-background text-foreground ${bodyFont}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
