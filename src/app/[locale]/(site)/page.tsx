import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/server/public-content";
import { Falcon } from "@/components/site/brand/falcon";

const PILLARS = [
  {
    ar: "اتصال ذكي",
    title: "Smart Connect",
    desc: "Intelligent systems that link people, data, and devices into one seamless fabric.",
    icon: (
      <g>
        <circle cx="6" cy="12" r="2.4" />
        <circle cx="18" cy="6" r="2.4" />
        <circle cx="18" cy="18" r="2.4" />
        <path d="M8 11 L16 7" />
        <path d="M8 13 L16 17" />
      </g>
    ),
  },
  {
    ar: "إبتكار مستمر",
    title: "Continuous Innovation",
    desc: "Relentless R&D that turns tomorrow's ideas into the products people use today.",
    icon: (
      <g>
        <path d="M9 16h6" />
        <path d="M10 19h4" />
        <path d="M12 3a6 6 0 0 1 4 10.5c-.8.7-1 1.2-1 2.5H9c0-1.3-.2-1.8-1-2.5A6 6 0 0 1 12 3Z" />
      </g>
    ),
  },
  {
    ar: "تقدم دائم",
    title: "Sustained Growth",
    desc: "Performance that compounds — scalable, measured, and built to endure.",
    icon: (
      <g>
        <path d="M4 20h16" />
        <path d="M7 20v-5" />
        <path d="M12 20v-9" />
        <path d="M17 20V7" />
        <path d="M14 5h4v4" />
        <path d="M18 5l-7 7" />
      </g>
    ),
  },
];

const VALUES = ["Vision", "Innovation", "Trust", "Precision", "Leadership"];

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="space-y-8">
            <p
              className="font-brand inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] text-sky [animation:fade-up_0.7s_both]"
            >
              <span className="diamond" />
              TECHNOLOGY FORWARD · UAE PROUD
            </p>

            <h1 className="space-y-2">
              <span
                dir="rtl"
                className="font-arabic block text-4xl font-semibold leading-tight text-foreground sm:text-5xl [animation:fade-up_0.7s_0.05s_both]"
              >
                نبتكر المستقبل.
              </span>
              <span
                dir="rtl"
                className="font-arabic block text-4xl font-semibold leading-tight text-gradient sm:text-5xl [animation:fade-up_0.7s_0.1s_both]"
              >
                نرتقي بالأداء.
              </span>
              <span className="block pt-3 text-lg font-medium tracking-wide text-muted-foreground sm:text-xl [animation:fade-up_0.7s_0.2s_both]">
                Innovating tomorrow. Elevating performance.
              </span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground [animation:fade-up_0.7s_0.3s_both]">
              GYR is a UAE technology company engineering the systems that connect,
              the breakthroughs that innovate, and the performance that elevates —
              from Dubai to the world.
            </p>

            <div className="flex flex-wrap items-center gap-4 [animation:fade-up_0.7s_0.4s_both]">
              <Link
                href="/blog"
                className="font-brand rounded-md bg-gradient-to-r from-teal to-sky px-6 py-3 text-xs tracking-[0.18em] text-white shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5"
              >
                EXPLORE INSIGHTS
              </Link>
              <Link
                href="/team"
                className="font-brand rounded-md border border-border px-6 py-3 text-xs tracking-[0.18em] text-foreground transition-colors hover:border-sky/60 hover:text-sky"
              >
                MEET THE TEAM
              </Link>
            </div>
          </div>

          {/* Falcon emblem */}
          <div className="relative flex justify-center [animation:fade-up_0.9s_0.2s_both]">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 [animation:glow_4s_ease-in-out_infinite]"
              style={{
                background:
                  "radial-gradient(circle at 55% 45%, hsl(var(--brand-sky)/0.22), transparent 60%)",
              }}
            />
            <div className="[animation:float_7s_ease-in-out_infinite]">
              <Falcon
                priority
                className="h-64 w-auto drop-shadow-[0_0_45px_hsl(var(--brand-sky)/0.35)] sm:h-80"
              />
            </div>
          </div>
        </div>

        {/* Values strip */}
        <div className="border-y border-border/60 bg-background/40 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6">
            {VALUES.map((v) => (
              <span
                key={v}
                className="font-brand text-[0.7rem] tracking-[0.28em] text-muted-foreground"
              >
                {v.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PILLARS ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="font-brand mb-3 text-[0.7rem] tracking-[0.3em] text-sky">
            HOW WE WORK
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Three traces, one wing.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every GYR engagement runs on three parallel currents — connect,
            innovate, elevate — integrated like circuits across a falcon&apos;s wing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <article
              key={p.title}
              className="brand-card group rounded-xl p-7"
              style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}
            >
              <svg
                viewBox="0 0 24 24"
                className="mb-6 h-9 w-9 text-sky transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {p.icon}
              </svg>
              <p dir="rtl" className="font-arabic mb-1 text-sm text-teal">
                {p.ar}
              </p>
              <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- LATEST INSIGHTS ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-brand mb-3 text-[0.7rem] tracking-[0.3em] text-sky">
              FROM THE TEAM
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Latest insights
            </h2>
          </div>
          <Link
            href="/blog"
            className="font-brand hidden text-xs tracking-[0.18em] text-muted-foreground transition-colors hover:text-sky sm:block"
          >
            ALL INSIGHTS →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="brand-card rounded-xl p-12 text-center">
            <p className="text-muted-foreground">
              No insights published yet — they&apos;ll appear here as the team ships.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="brand-card group flex flex-col overflow-hidden rounded-xl"
              >
                {p.coverImage ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.coverImage.url}
                      alt={p.coverImage.alt ?? p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="bg-grid flex aspect-[16/10] items-center justify-center bg-secondary/40">
                    <Falcon className="h-14 w-auto opacity-40" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-sky">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- CLOSING BAND ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="brand-card relative overflow-hidden rounded-2xl px-8 py-14 text-center sm:px-16">
          <div aria-hidden className="absolute inset-0 -z-10 bg-aura opacity-70" />
          <Image
            src="/brand/pattern-geometric-alpha.png"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="-z-10 object-cover opacity-[0.06] mix-blend-screen"
          />
          <Falcon className="mx-auto mb-6 h-16 w-auto" />
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to build the future with GYR?
          </h2>
          <p dir="rtl" className="font-arabic mx-auto mt-3 max-w-md text-muted-foreground">
            تكنولوجيا متقدمة. إماراتية بفخر.
          </p>
          <Link
            href="/team"
            className="font-brand mt-8 inline-block rounded-md bg-gradient-to-r from-teal to-sky px-7 py-3 text-xs tracking-[0.18em] text-white shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5"
          >
            GET IN TOUCH
          </Link>
        </div>
      </section>
    </>
  );
}
