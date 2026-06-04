import Link from "next/link";
import { getNavPages } from "@/server/public-content";

export async function SiteHeader() {
  const navPages = await getNavPages();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">
          GYR
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/team" className="hover:underline">
            Team
          </Link>
          {navPages.map((p) => (
            <Link key={p.slug} href={`/${p.slug}`} className="hover:underline">
              {p.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
