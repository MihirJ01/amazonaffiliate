import { supabase } from "@/lib/supabase";

export type AffiliateLink = {
  product_id: string;
  affiliate_url: string;
  updated_at?: string;
};

export async function getAffiliateLinks(): Promise<AffiliateLink[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("affiliate_links")
    .select("product_id, affiliate_url, updated_at");
  if (error) throw error;
  return data ?? [];
}

export async function saveAffiliateLink(productId: string, affiliateUrl: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from("affiliate_links")
    .upsert({ product_id: productId, affiliate_url: affiliateUrl });
  if (error) throw error;
}
