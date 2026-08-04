import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatIndianRupees } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group motion-reveal flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.deal && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
            Deal
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{product.subcategory}</p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">{product.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold">{formatIndianRupees(product.price)}</p>
          {product.oldPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatIndianRupees(product.oldPrice)}
            </p>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Star className="size-3.5 fill-current text-foreground" aria-hidden />
        <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
        <span>({product.reviews.toLocaleString()} reviews)</span>
      </div>
      <a
        href={
          product.affiliateUrl || `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`
        }
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        View on Amazon
      </a>
    </article>
  );
}
