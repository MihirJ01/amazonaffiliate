import { useQuery } from "@tanstack/react-query";
import { getAffiliateLinks } from "@/lib/affiliate-links";
import { supabase } from "@/lib/supabase";

export function useAffiliateLinks() {
  const query = useQuery({
    queryKey: ["affiliate-links"],
    queryFn: getAffiliateLinks,
    enabled: Boolean(supabase),
  });

  return new Map((query.data ?? []).map((link) => [link.product_id, link.affiliate_url]));
}
