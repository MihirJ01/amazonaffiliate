import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag } from "lucide-react";

const nav = [
  { label: "Home", to: "/" as const, search: undefined },
  { label: "Shop", to: "/shop" as const, search: {} },
  { label: "Electronics", to: "/shop" as const, search: { category: "Electronics" } },
  { label: "Home ", to: "/shop" as const, search: { category: "Home" } },
  { label: "Deals", to: "/shop" as const, search: { deal: true } },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container-edge flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="text-lg font-bold tracking-tight">
          MG Studio <span className="text-muted-foreground">&amp; Sales</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search as never}
              className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label.trim()}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground md:flex">
            <Search className="size-4" aria-hidden />
            <input
              className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search products"
              aria-label="Search products"
              readOnly
            />
          </label>
          <Link
            to="/shop"
            search={{}}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ShoppingBag className="size-4" aria-hidden />
            Browse
          </Link>
        </div>
      </div>
    </header>
  );
}
