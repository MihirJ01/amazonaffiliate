import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useProducts } from "@/hooks/use-products";
import { catalogTree, type FilterNode } from "@/lib/categories";

type ShopSearch = { category?: string; subcategory?: string; brand?: string; deal?: boolean };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
    subcategory: typeof search.subcategory === "string" ? search.subcategory : undefined,
    brand: typeof search.brand === "string" ? search.brand : undefined,
    deal: search.deal === true || search.deal === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop the collection — MG Studio & Sales" },
      { name: "description", content: "Shop curated technology, gadgets, and home essentials." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const filters = Route.useSearch();
  const { data: products = [], isLoading } = useProducts();
  const list = products.filter(
    (product) =>
      (!filters.category || product.category === filters.category) &&
      (!filters.subcategory || product.subcategory === filters.subcategory) &&
      (!filters.brand || product.brand === filters.brand) &&
      (!filters.deal || product.deal),
  );
  const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))].sort();
  const filterCount = [filters.category, filters.subcategory, filters.brand, filters.deal].filter(
    Boolean,
  ).length;
  const title = filters.deal
    ? "Today’s deals."
    : (filters.subcategory ?? filters.category ?? "Everything we’d keep.");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-edge py-10 sm:py-16">
        <p className="eyebrow">The collection</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[0.95]">{title}</h1>
            <p className="mt-4 text-muted-foreground">
              {list.length} product{list.length === 1 ? "" : "s"} · prices, ratings and Amazon
              links.
            </p>
          </div>
          {filterCount > 0 && (
            <Link
              to="/shop"
              search={{}}
              className="inline-flex items-center gap-2 text-sm font-semibold underline"
            >
              <X className="size-4" /> Clear filters
            </Link>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-border bg-secondary/30 p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="size-4" /> Filters
              </h2>
              {filterCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {filterCount}
                </span>
              )}
            </div>
            <Link
              to="/shop"
              search={{}}
              className={`mt-5 block rounded-xl px-3 py-2 text-sm font-medium ${!filterCount ? "bg-primary text-primary-foreground" : "hover:bg-background"}`}
            >
              All products
            </Link>
            <div className="mt-3 border-t border-border pt-3">
              {catalogTree.map((node) => (
                <FilterBranch key={node.label} node={node} filters={filters} />
              ))}
            </div>
            <details className="mt-4 border-t border-border pt-4" open={Boolean(filters.brand)}>
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                Brands <ChevronDown className="size-4" />
              </summary>
              <div className="mt-2 grid gap-1">
                {brands.length ? (
                  brands.map((brand) => (
                    <FilterLink
                      key={brand}
                      label={brand}
                      search={{ brand }}
                      active={filters.brand === brand}
                    />
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    Brands appear after products are added.
                  </p>
                )}
              </div>
            </details>
            <div className="mt-4 border-t border-border pt-4">
              <FilterLink label="Deals" search={{ deal: true }} active={Boolean(filters.deal)} />
            </div>
          </aside>

          <section>
            {isLoading ? (
              <p className="text-muted-foreground">Loading products…</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {!isLoading && !list.length && (
              <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-10 text-center">
                <h2 className="text-xl font-semibold">No products match these filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another category, brand, or clear the filters.
                </p>
                <Link
                  to="/shop"
                  search={{}}
                  className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  View all products
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function FilterBranch({
  node,
  filters,
  trail = [],
}: {
  node: FilterNode;
  filters: ShopSearch;
  trail?: string[];
}) {
  const path = [...trail, node.label];
  const subcategory = path.slice(1).join(" · ");
  const isRoot = trail.length === 0;
  const active = isRoot
    ? filters.category === node.label && !filters.subcategory
    : filters.subcategory === subcategory;
  if (!node.children?.length) {
    return (
      <FilterLink
        label={node.label}
        search={{ category: trail[0], subcategory }}
        active={active}
        nested
      />
    );
  }
  return (
    <details className="group" open={filters.category === path[0]}>
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold hover:bg-background">
        <Link
          to="/shop"
          search={{ category: path[0] }}
          onClick={(event) => event.stopPropagation()}
          className={filters.category === path[0] && !filters.subcategory ? "text-primary" : ""}
        >
          {node.label}
        </Link>
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="ml-2 border-l border-border pb-2 pl-2">
        {node.children.map((child) => (
          <FilterBranch key={child.label} node={child} filters={filters} trail={path} />
        ))}
      </div>
    </details>
  );
}

function FilterLink({
  label,
  search,
  active,
  nested = false,
}: {
  label: string;
  search: ShopSearch;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      to="/shop"
      search={search}
      className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${nested ? "text-muted-foreground" : "font-medium"} ${active ? "bg-primary text-primary-foreground" : "hover:bg-background hover:text-foreground"}`}
    >
      {label}
    </Link>
  );
}
