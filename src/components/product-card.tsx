import { ChevronDown, ExternalLink, Pencil, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatIndianRupees } from "@/lib/utils";

export function ProductCard({
  product,
  onEdit,
}: {
  product: Product;
  onEdit?: (product: Product) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasLongName = product.name.length > 58;

  return (
    <article className="group motion-reveal flex h-full flex-col rounded-3xl border border-border/70 bg-background p-3 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.5)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-26px_rgba(0,0,0,0.38)]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/70">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
        {product.deal && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
            Deal
          </span>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm transition hover:scale-105 hover:bg-primary hover:text-primary-foreground"
            aria-label={`Edit ${product.name}`}
            title="Edit product"
          >
            <Pencil className="size-4" />
          </button>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div>
          <p className="eyebrow">{product.subcategory}</p>
          <h3
            className={`mt-1 text-base font-semibold leading-snug tracking-tight ${expanded ? "" : "line-clamp-2"}`}
          >
            {product.name}
          </h3>
          {hasLongName && (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read more"}
              <ChevronDown
                className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
        <div className="shrink-0 rounded-xl bg-secondary px-2.5 py-1.5 text-right">
          <p className="text-sm font-bold">{formatIndianRupees(product.price)}</p>
          {product.oldPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatIndianRupees(product.oldPrice)}
            </p>
          )}
        </div>
      </div>
      <p className="mt-3 line-clamp-2 px-1 text-sm leading-relaxed text-muted-foreground">
        {product.blurb}
      </p>
      <div className="mt-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
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
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        View on Amazon <ExternalLink className="size-3.5" />
      </a>
    </article>
  );
}
