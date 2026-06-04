import type { Metadata } from "next";
import { Sora, Michroma, IBM_Plex_Sans_Arabic, Geist_Mono } from "next/font/google";
import "./globals.css";

// Body + headings: Sora — geometric, modern, characterful (not Inter/Geist).
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

// Brand / display: Michroma — wide aerospace lettering echoing the GYR wordmark.
const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Arabic-first typography (جير) — keeps Latin + Arabic visually consistent.
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "GYR — Innovating Tomorrow. Elevating Performance.",
    template: "%s · GYR",
  },
  description:
    "GYR — a UAE technology company. Technology Forward. UAE Proud. نبتكر المستقبل. نرتقي بالأداء.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${michroma.variable} ${plexArabic.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
