import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, dir } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

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
      default: "GYR — Intelligent software banks run on.",
      template: "%s · GYR",
    },
    description: t("heroSub"),
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      title: "GYR — Intelligent software banks run on.",
      description: "AI software for financial institutions.",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-background text-foreground ${bodyFont}`}>
        <div
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: `<script>${themeInit}</script>` }}
        />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
