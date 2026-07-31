import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { products, marqueeItems } from "@/data/products";
import { useAffiliateLinks } from "@/hooks/use-affiliate-links";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MG Studio & Sales — The edit for modern living" },
      {
        name: "description",
        content:
          "A tightly-curated shelf of the best gadgets and home essentials — reviewed, ranked and linked straight to Amazon.",
      },
      { property: "og:title", content: "MG Studio & Sales — The edit for modern living" },
      {
        property: "og:description",
        content:
          "A tightly-curated shelf of the best gadgets and home essentials — reviewed, ranked and linked straight to Amazon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "17+", label: "Curated products" },
  { value: "2", label: "Categories" },
  { value: "4.7★", label: "Avg. rating" },
];

const approach = [
  {
    n: "01",
    title: "We only list things we'd keep.",
    body: "Every product is hand-picked for build, value and longevity — no filler, no noise.",
  },
  {
    n: "02",
    title: "Honest prices, real deals.",
    body: "We track drops so you buy at the right moment. When it's a genuine deal, we mark it.",
  },
  {
    n: "03",
    title: "Buy where it's easy.",
    body: "One tap takes you straight to Amazon to check out with the protection you already trust.",
  },
];

function Index() {
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const hero = products[0];
  const affiliateLinks = useAffiliateLinks();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="container-edge relative grid min-h-[calc(100svh-4.5rem)] items-center gap-8 overflow-hidden py-8 lg:grid-cols-2 lg:gap-10 lg:py-10">
          <div className="hero-glow animate-orbit-glow pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full" />
          <div className="relative motion-reveal">
            <div className="flex items-center gap-4 motion-delay-1">
              <span className="h-px w-8 bg-foreground" />
              <span className="eyebrow">Electronics &amp; Home · Curated</span>
            </div>
            <h1 className="motion-reveal motion-delay-1 mt-6 text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[0.95]">
              The edit for
              <br />
              <span className="text-muted-foreground">modern living.</span>
            </h1>
            <p className="motion-reveal motion-delay-2 mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
              A tightly-curated shelf of the best gadgets and home essentials — reviewed, ranked and
              linked straight to Amazon.
            </p>
            <div className="motion-reveal motion-delay-3 mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                search={{}}
                className="interactive-lift inline-flex items-center gap-3 rounded-full bg-primary py-4 pl-6 pr-3 text-sm font-medium text-primary-foreground hover:interactive-lift-hover"
              >
                Shop the collection
                <span className="flex size-7 items-center justify-center rounded-full bg-background/15">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </Link>
              <Link
                to="/shop"
                search={{ deal: true }}
                className="interactive-lift inline-flex items-center rounded-full border border-border px-7 py-4 text-sm font-medium hover:interactive-lift-hover"
              >
                View today's deals
              </Link>
            </div>
            <dl className="motion-reveal motion-delay-3 mt-14 flex flex-wrap gap-8 sm:gap-12">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-3xl font-bold tracking-tight">{s.value}</dd>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          <div className="motion-reveal motion-delay-2 relative mx-auto w-full max-w-[34rem] lg:ml-auto">
            <div className="animate-float-artwork h-[min(56svh,32rem)] overflow-hidden rounded-3xl bg-muted shadow-[0_32px_80px_-36px_rgba(0,0,0,0.45)] lg:h-[min(66svh,40rem)]">
              <img
                src={hero.image}
                alt="Featured tech"
                className="size-full object-cover transition-transform duration-[1800ms] ease-out hover:scale-105"
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-4 left-3 max-w-[240px] rounded-2xl border border-border/60 bg-background/95 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-500 hover:-translate-y-1 sm:-bottom-6 sm:left-0">
              <p className="eyebrow">This week</p>
              <p className="mt-1 font-semibold tracking-tight">{hero.name}</p>
              <p className="text-sm text-muted-foreground">from ${hero.price.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="mt-14 overflow-hidden border-y border-border py-5">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                {item} <span className="text-foreground">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Featured */}
        <section className="container-edge py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Editor's picks</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Featured this month
              </h2>
            </div>
            <Link
              to="/shop"
              search={{}}
              className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              View all <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} affiliateUrl={affiliateLinks.get(p.id)} />
            ))}
          </div>
        </section>

        {/* Approach */}
        <section className="border-y border-border bg-secondary/50">
          <div className="container-edge py-20">
            <p className="eyebrow">Our approach</p>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {approach.map((a) => (
                <div key={a.n} className="border-t border-border pt-6">
                  <p className="text-sm font-medium text-muted-foreground">{a.n}</p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container-edge grid gap-6 py-20 md:grid-cols-2">
          {[
            {
              name: "Electronics",
              desc: "Laptops, audio, cameras & wearables",
              image: products[0].image,
            },
            {
              name: "Home",
              desc: "Kitchen, appliances & ambient living",
              image: products[10].image,
            },
          ].map((c) => (
            <Link
              key={c.name}
              to="/shop"
              search={{ category: c.name }}
              className="group relative overflow-hidden rounded-3xl bg-muted"
            >
              <div className="aspect-[16/11]">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 to-transparent p-8">
                <p className="text-2xl font-bold tracking-tight text-primary-foreground">
                  {c.name}
                </p>
                <p className="mt-1 text-sm text-primary-foreground/75">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground">
                  Shop {c.name} <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
