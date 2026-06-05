import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

// Public pages render from the CMS database per request (dynamic publishing),
// so they are not statically prerendered at build time.
export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Ambient brand atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid [animation:drift_30s_linear_infinite]"
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-aura" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-sky/40 to-transparent"
      />

      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
