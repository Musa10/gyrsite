import Link from "next/link";
import { getNavPages } from "@/server/public-content";
import { Logo } from "@/components/site/brand/logo";

export async function SiteFooter() {
  const navPages = await getNavPages();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-background">
      <div className="absolute inset-x-0 top-0 rule-glow" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo size="md" />
          <p dir="rtl" className="font-arabic max-w-xs text-sm text-muted-foreground">
            نبتكر المستقبل. نرتقي بالأداء.
          </p>
          <p className="font-brand max-w-xs text-xs tracking-[0.15em] text-muted-foreground">
            INNOVATING TOMORROW. ELEVATING PERFORMANCE.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-brand text-xs tracking-[0.25em] text-sky">NAVIGATE</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="transition-colors hover:text-foreground">Home</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-foreground">Insights</Link></li>
            <li><Link href="/team" className="transition-colors hover:text-foreground">Team</Link></li>
            {navPages.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="transition-colors hover:text-foreground">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-brand text-xs tracking-[0.25em] text-sky">PRINCIPLES</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="diamond">Smart Connect</li>
            <li className="diamond">Continuous Innovation</li>
            <li className="diamond">Sustained Growth</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>© {year} GYR. All rights reserved.</span>
          <span className="font-brand tracking-[0.25em] text-sky/80">
            TECHNOLOGY FORWARD. UAE PROUD.
          </span>
        </div>
      </div>
    </footer>
  );
}
