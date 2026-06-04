import { SiteHeader } from "@/components/site/site-header";

// Public pages render from the CMS database per request (dynamic publishing),
// so they are not statically prerendered at build time.
export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © GYR
      </footer>
    </div>
  );
}
