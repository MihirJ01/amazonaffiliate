import { createServerFn } from "@tanstack/react-start";

export type ImportedAmazonProduct = {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  blurb: string;
  affiliateUrl: string;
};

type SearchApiProduct = {
  title?: string;
  brand?: string;
  description?: string;
  categories?: Array<string | { name?: string }>;
  price?: number | { value?: number | string; raw?: string };
  rating?: number | string;
  reviews?: number | string;
  image?: string | { link?: string; url?: string };
  images?: Array<string | { link?: string; url?: string }>;
};

function asinFromUrl(url: string) {
  const match = url.match(
    /(?:\/dp\/|\/gp\/product\/|\/product\/|[?&](?:asin|ASIN)=)([A-Z0-9]{10})(?:[/?&]|$)/i,
  );
  if (!match) throw new Error("We could not find a valid 10-character Amazon ASIN in that link.");
  return match[1].toUpperCase();
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function firstImage(product: SearchApiProduct) {
  const value = product.image ?? product.images?.[0];
  if (typeof value === "string") return value;
  return value?.url ?? value?.link ?? "";
}

function numericPrice(value: SearchApiProduct["price"]) {
  const raw = typeof value === "object" && value ? (value.value ?? value.raw) : value;
  const number = Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : NaN;
}

async function verifyAdministrator(accessToken: string) {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase server settings are missing.");
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error("Please sign in again before importing a product.");
}

async function resolveAsin(affiliateUrl: string) {
  try {
    return asinFromUrl(affiliateUrl);
  } catch {
    // Short Amazon links need one server-side redirect before their ASIN is visible.
  }
  let sourceUrl: URL;
  try {
    sourceUrl = new URL(affiliateUrl);
  } catch {
    throw new Error("Paste one complete Amazon product link.");
  }
  if (!sourceUrl.hostname.toLowerCase().includes("amazon")) {
    throw new Error("Please paste an Amazon product or Amazon Associates link.");
  }
  const response = await fetch(sourceUrl, { method: "GET", redirect: "follow" });
  return asinFromUrl(response.url || sourceUrl.toString());
}

export const importAmazonProduct = createServerFn({ method: "POST" })
  .validator((input: { affiliateUrl: string; accessToken: string }) => {
    if (!input.affiliateUrl?.trim() || !input.accessToken) {
      throw new Error("A signed-in session and one Amazon link are required.");
    }
    return { affiliateUrl: input.affiliateUrl.trim(), accessToken: input.accessToken };
  })
  .handler(async ({ data }): Promise<ImportedAmazonProduct> => {
    await verifyAdministrator(data.accessToken);
    const apiKey = process.env.SEARCHAPI_KEY;
    if (!apiKey) throw new Error("SearchAPI is not configured on the Vercel server yet.");

    const asin = await resolveAsin(data.affiliateUrl);
    const query = new URLSearchParams({ engine: "amazon_product", asin });
    const domain = process.env.SEARCHAPI_AMAZON_DOMAIN;
    if (domain) query.set("amazon_domain", domain);
    const response = await fetch(`https://www.searchapi.io/api/v1/search?${query}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const result = await response.json();
    if (!response.ok || result.error) {
      throw new Error(
        result.error?.message ?? result.message ?? "SearchAPI could not import this product.",
      );
    }

    const product = (result.product ?? result.product_results ?? result) as SearchApiProduct;
    const name = asText(product.title);
    const image = firstImage(product);
    const price = numericPrice(product.price);
    if (!name || !image || !Number.isFinite(price)) {
      throw new Error(
        "SearchAPI did not return a name, image, and current price for this product.",
      );
    }
    const categories = product.categories ?? [];
    const categoryNames = categories.map((category) =>
      typeof category === "string" ? category : (category.name ?? ""),
    );
    return {
      name,
      brand: asText(product.brand),
      category: categoryNames.at(-1) || "Other",
      subcategory: categoryNames.at(-2) || "",
      price,
      rating: Number(product.rating ?? 0),
      reviews: Number(product.reviews ?? 0),
      image,
      blurb: asText(product.description),
      affiliateUrl: data.affiliateUrl,
    };
  });
