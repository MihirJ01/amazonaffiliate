import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useProducts } from "@/hooks/use-products";

export const Route = createFileRoute("/")({ component: Index });

const marqueeItems = [
  "Expert picks",
  "Amazon links",
  "Better buying",
  "Modern living",
  "Good value",
];

function Index() {
  const { data: products = [], isLoading } = useProducts();
  const featured = (
    products.some((product) => product.featured)
      ? products.filter((product) => product.featured)
      : products
  ).slice(0, 6);
  const hero = products[0];
  const categories = Array.from(
    new Map(products.map((product) => [product.category, product])).values(),
  ).slice(0, 2);
  const averageRating = products.length
    ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
    : "—";
  const stats = [
    { value: String(products.length), label: "Curated products" },
    { value: String(categories.length), label: "Categories" },
    { value: `${averageRating}★`, label: "Avg. rating" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="container-edge relative grid min-h-[calc(100svh-4.5rem)] items-center gap-8 overflow-hidden py-8 lg:grid-cols-2 lg:gap-10 lg:py-10">
          <div className="hero-glow animate-orbit-glow pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full" />
          <div className="relative motion-reveal">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-foreground" />
              <span className="eyebrow">Electronics &amp; Home · Curated</span>
            </div>
            <h1 className="motion-reveal motion-delay-1 mt-6 text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[0.95]">
              The edit for
              <br />
              <span className="text-muted-foreground">modern living.</span>
            </h1>
            <p className="motion-reveal motion-delay-2 mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
              A curated collection of genuine products, with clear prices, ratings and Amazon links.
            </p>
            <div className="motion-reveal motion-delay-3 mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                search={{}}
                className="interactive-lift inline-flex items-center gap-3 rounded-full bg-primary py-4 pl-6 pr-3 text-sm font-medium text-primary-foreground hover:interactive-lift-hover"
              >
                Shop the collection{" "}
                <span className="flex size-7 items-center justify-center rounded-full bg-background/15">
                  <ArrowUpRight className="size-4" />
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
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-3xl font-bold tracking-tight">{stat.value}</dd>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
          <div className="motion-reveal motion-delay-2 relative mx-auto w-full max-w-[34rem] lg:ml-auto">
            <div className="animate-float-artwork flex h-[min(56svh,32rem)] items-center justify-center overflow-hidden rounded-3xl bg-muted shadow-[0_32px_80px_-36px_rgba(0,0,0,0.45)] lg:h-[min(66svh,40rem)]">
              {hero ? (
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="size-full object-cover transition-transform duration-[1800ms] ease-out hover:scale-105"
                  fetchPriority="high"
                />
              ) : (
                <p className="max-w-xs text-center text-sm text-muted-foreground">
                  Your first real product image will appear here after you add it in Supabase.
                </p>
              )}
            </div>
            <div className="absolute -bottom-4 left-3 max-w-[240px] rounded-2xl border border-border/60 bg-background/95 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-500 hover:-translate-y-1 sm:-bottom-6 sm:left-0">
              <p className="eyebrow">This week</p>
              <p className="mt-1 font-semibold tracking-tight">
                {hero?.name ?? "Your first product"}
              </p>
              <p className="text-sm text-muted-foreground">
                {hero ? `from $${hero.price.toLocaleString()}` : "Add products in Supabase"}
              </p>
            </div>
          </div>
        </section>
        <div className="mt-8 overflow-hidden border-y border-border py-5">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span
                key={index}
                className="text-sm uppercase tracking-[0.18em] text-muted-foreground"
              >
                {item} <span className="text-foreground">✦</span>
              </span>
            ))}
          </div>
        </div>
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
              View all <ArrowUpRight className="size-4" />
            </Link>
          </div>
          {isLoading ? (
            <p className="mt-12 text-muted-foreground">Loading products…</p>
          ) : (
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {!isLoading && !featured.length && (
            <p className="mt-12 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Add real products in Supabase to show them here.
            </p>
          )}
        </section>
        <section className="border-y border-border bg-secondary/50">
          <div className="container-edge py-20">
            <p className="eyebrow">Our approach</p>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {[
                [
                  "01",
                  "We only list things we'd keep.",
                  "Every product is selected for value and longevity.",
                ],
                [
                  "02",
                  "Honest prices, real details.",
                  "Prices, ratings and links come from your product catalog.",
                ],
                ["03", "Buy where it's easy.", "One tap takes visitors straight to Amazon."],
              ].map(([number, title, body]) => (
                <div key={number} className="border-t border-border pt-6">
                  <p className="text-sm font-medium text-muted-foreground">{number}</p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="container-edge grid gap-6 py-20 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.category}
              to="/shop"
              search={{ category: category.category }}
              className="group relative overflow-hidden rounded-3xl bg-muted"
            >
              <div className="aspect-[16/11]">
                <img
                  src={category.image}
                  alt={category.category}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 to-transparent p-8">
                <p className="text-2xl font-bold tracking-tight text-primary-foreground">
                  {category.category}
                </p>
                <p className="mt-1 text-sm text-primary-foreground/75">
                  Explore curated {category.category.toLowerCase()} picks
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground">
                  Shop {category.category} <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
          {!categories.length && (
            <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground md:col-span-2">
              Category cards will appear after products are added in Supabase.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
