import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

// Fully static: all copy comes from the message catalogs, so every locale of
// every page is prerendered at build time (no DB, no per-request work).
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Faint ambient grid — fixed behind content, fades toward the bottom so
          it sits under the hero and quiets as you scroll. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />

      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
