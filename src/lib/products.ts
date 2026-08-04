import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  deal: boolean;
  featured: boolean;
  image: string;
  blurb: string;
  affiliateUrl: string;
};

type ProductRow = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  subcategory: string | null;
  price: number | string;
  old_price: number | string | null;
  rating: number | string;
  reviews: number | null;
  deal: boolean | null;
  featured: boolean | null;
  image: string | null;
  blurb: string | null;
  affiliate_url: string | null;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? "",
    category: row.category ?? "Other",
    subcategory: row.subcategory ?? "Featured pick",
    price: Number(row.price),
    oldPrice: row.old_price == null ? undefined : Number(row.old_price),
    rating: Number(row.rating),
    reviews: row.reviews ?? 0,
    deal: row.deal ?? false,
    featured: row.featured ?? false,
    image: row.image ?? "",
    blurb: row.blurb ?? "",
    affiliateUrl: row.affiliate_url ?? "",
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function saveProductAffiliateLink(productId: string, affiliateUrl: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from("products")
    .update({ affiliate_url: affiliateUrl })
    .eq("id", productId);
  if (error) throw error;
}

export type ProductInput = Omit<Product, "id">;

export async function saveProduct(product: ProductInput) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      old_price: product.oldPrice ?? null,
      rating: product.rating,
      reviews: product.reviews,
      deal: product.deal,
      featured: product.featured,
      image: product.image,
      blurb: product.blurb,
      affiliate_url: product.affiliateUrl,
    })
    .select("*")
    .single();
  if (error) throw error;
  return toProduct(data as ProductRow);
}
