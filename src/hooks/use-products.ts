import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/products";
import { supabase } from "@/lib/supabase";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    enabled: Boolean(supabase),
  });
}
