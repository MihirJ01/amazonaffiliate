import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";

type ShopSearch = { category?: string; deal?: boolean };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
    deal: search.deal === true || search.deal === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop the collection — MG Studio & Sales" },
      {
        name: "description",
        content:
          "Browse every hand-picked electronics and home product, filtered by category or today's deals.",
      },
      { property: "og:title", content: "Shop the collection — MG Studio & Sales" },
      {
        property: "og:description",
        content: "Hand-picked gadgets and home essentials, linked straight to Amazon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

const filters = [
  { label: "All", search: {} as ShopSearch },
  { label: "Electronics", search: { category: "Electronics" } as ShopSearch },
  { label: "Home", search: { category: "Home" } as ShopSearch },
  { label: "Deals", search: { deal: true } as ShopSearch },
];

function Shop() {
  const { category, deal } = Route.useSearch();
  const { data: products = [], isLoading } = useProducts();
  const list = products.filter((p) => (!category || p.category === category) && (!deal || p.deal));

  const activeLabel = deal ? "Deals" : (category ?? "All");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-edge py-16">
        <p className="eyebrow">The collection</p>
        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95]">
          {deal ? "Today's deals." : category ? `${category}.` : "Everything we'd keep."}
        </h1>
        <p className="mt-5 max-w-lg text-muted-foreground">
          {list.length} product{list.length === 1 ? "" : "s"} · reviewed, ranked and linked straight
          to Amazon.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = f.label === activeLabel;
            return (
              <Link
                key={f.label}
                to="/shop"
                search={f.search}
                className={`rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {isLoading ? (
          <p className="mt-14 text-muted-foreground">Loading products…</p>
        ) : (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        {!isLoading && list.length === 0 && (
          <div className="mt-14 rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-center">
            <h2 className="text-xl font-semibold">Products are being prepared</h2>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for curated product recommendations.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
