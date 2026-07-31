import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-edge grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-bold tracking-tight">
            MG Studio <span className="text-muted-foreground">&amp; Sales</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A tightly-curated shelf of electronics and home essentials. As an Amazon Associate we
            earn from qualifying purchases.
          </p>
        </div>
        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" search={{}} className="hover:text-foreground">
                All products
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                search={{ category: "Electronics" }}
                className="hover:text-foreground"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "Home" }} className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ deal: true }} className="hover:text-foreground">
                Today's deals
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">About</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>How we pick</li>
            <li>Affiliate disclosure</li>
            <li>Privacy</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="container-edge flex flex-col gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MG Studio &amp; Sales. All rights reserved.</p>
        <p>Prices and availability are accurate as of the date shown on Amazon.</p>
      </div>
    </footer>
  );
}
