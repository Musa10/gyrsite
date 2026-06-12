import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
