import { createError, defineEventHandler, getHeader } from "h3";

type StoredProduct = { id: string; affiliate_url: string };

function asinFromUrl(url: string) {
  const match = url.match(
    /(?:\/dp\/|\/gp\/product\/|\/product\/|[?&](?:asin|ASIN)=)([A-Z0-9]{10})(?:[/?&]|$)/i,
  );
  if (!match) throw new Error("No valid 10-character ASIN found.");
  return match[1].toUpperCase();
}

async function resolveAsin(affiliateUrl: string) {
  try {
    return asinFromUrl(affiliateUrl);
  } catch {
    const source = new URL(affiliateUrl);
    const response = await fetch(source, { method: "GET", redirect: "follow" });
    return asinFromUrl(response.url || source.toString());
  }
}

async function currentPrice(affiliateUrl: string, searchApiKey: string) {
  const asin = await resolveAsin(affiliateUrl);
  const query = new URLSearchParams({ engine: "amazon_product", asin });
  if (process.env.SEARCHAPI_AMAZON_DOMAIN) {
    query.set("amazon_domain", process.env.SEARCHAPI_AMAZON_DOMAIN);
  }
  const response = await fetch(`https://www.searchapi.io/api/v1/search?${query}`, {
    headers: { Authorization: `Bearer ${searchApiKey}` },
  });
  const result = await response.json();
  const raw = result.product?.price ?? result.product_results?.price ?? result.price;
  const value = typeof raw === "object" && raw ? (raw.value ?? raw.raw) : raw;
  const price = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  if (!response.ok || !Number.isFinite(price))
    throw new Error("SearchAPI returned no current price.");
  return price;
}

export default defineEventHandler(async (event) => {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || getHeader(event, "authorization") !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const searchApiKey = process.env.SEARCHAPI_KEY;
  if (!supabaseUrl || !serviceKey || !searchApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server price-refresh settings are missing.",
    });
  }

  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products?select=id,affiliate_url&order=price_updated_at.asc.nullsfirst&limit=25`,
    { headers },
  );
  if (!productsResponse.ok)
    throw createError({ statusCode: 500, statusMessage: "Could not load products." });
  const products = (await productsResponse.json()) as StoredProduct[];
  let updated = 0;
  const failed: string[] = [];

  for (const product of products) {
    try {
      const price = await currentPrice(product.affiliate_url, searchApiKey);
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${product.id}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ price, price_updated_at: new Date().toISOString() }),
      });
      if (!updateResponse.ok) throw new Error("Supabase update failed.");
      updated += 1;
    } catch {
      failed.push(product.id);
    }
  }
  return {
    checked: products.length,
    updated,
    failed: failed.length,
    checkedAt: new Date().toISOString(),
  };
});
