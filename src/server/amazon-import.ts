import { createHash, createHmac } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";

type MarketplaceConfig = { host: string; region: string };

const marketplaces: Record<string, MarketplaceConfig> = {
  "www.amazon.com": { host: "webservices.amazon.com", region: "us-east-1" },
  "www.amazon.ca": { host: "webservices.amazon.com", region: "us-east-1" },
  "www.amazon.co.uk": { host: "webservices.amazon.co.uk", region: "eu-west-1" },
  "www.amazon.de": { host: "webservices.amazon.de", region: "eu-west-1" },
  "www.amazon.fr": { host: "webservices.amazon.fr", region: "eu-west-1" },
  "www.amazon.it": { host: "webservices.amazon.it", region: "eu-west-1" },
  "www.amazon.es": { host: "webservices.amazon.es", region: "eu-west-1" },
  "www.amazon.in": { host: "webservices.amazon.in", region: "eu-west-1" },
  "www.amazon.co.jp": { host: "webservices.amazon.co.jp", region: "us-west-2" },
};

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

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function hmac(key: string | Buffer, value: string, encoding?: "hex") {
  return createHmac("sha256", key).update(value, "utf8").digest(encoding);
}

function signingKey(secret: string, date: string, region: string) {
  const dateKey = hmac(`AWS4${secret}`, date);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, "ProductAdvertisingAPI");
  return hmac(serviceKey, "aws4_request");
}

function dateParts(now: Date) {
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return { amzDate: iso, dateStamp: iso.slice(0, 8) };
}

function asinFromUrl(url: string) {
  const match = url.match(/(?:\/dp\/|\/gp\/product\/|\/product\/)([A-Z0-9]{10})(?:[/?]|$)/i);
  if (!match) throw new Error("We could not find a valid 10-character Amazon ASIN in that link.");
  return match[1].toUpperCase();
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

export const importAmazonProduct = createServerFn({ method: "POST" })
  .validator((input: { affiliateUrl: string; accessToken: string }) => {
    if (!input.affiliateUrl?.trim() || !input.accessToken)
      throw new Error("A signed-in session and one Amazon link are required.");
    return { affiliateUrl: input.affiliateUrl.trim(), accessToken: input.accessToken };
  })
  .handler(async ({ data }): Promise<ImportedAmazonProduct> => {
    await verifyAdministrator(data.accessToken);

    const accessKey = process.env.AMAZON_PAAPI_ACCESS_KEY;
    const secretKey = process.env.AMAZON_PAAPI_SECRET_KEY;
    const partnerTag = process.env.AMAZON_ASSOCIATES_TAG;
    const marketplace = process.env.AMAZON_MARKETPLACE ?? "www.amazon.in";
    const config = marketplaces[marketplace];
    if (!accessKey || !secretKey || !partnerTag || !config) {
      throw new Error("Amazon Product Advertising API is not configured on the server yet.");
    }

    let sourceUrl: URL;
    try {
      sourceUrl = new URL(data.affiliateUrl);
    } catch {
      throw new Error("Paste one complete Amazon affiliate link.");
    }
    const resolved = await fetch(sourceUrl, { method: "GET", redirect: "follow" });
    const finalUrl = resolved.url || sourceUrl.toString();
    const asin = asinFromUrl(finalUrl);

    const payload = JSON.stringify({
      ItemIds: [asin],
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: marketplace,
      Resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "ItemInfo.ByLineInfo",
        "ItemInfo.Features",
        "BrowseNodeInfo.BrowseNodes",
        "Offers.Listings.Price",
        "CustomerReviews.Count",
        "CustomerReviews.StarRating",
      ],
    });
    const { amzDate, dateStamp } = dateParts(new Date());
    const canonicalHeaders = [
      "content-encoding:amz-1.0",
      "content-type:application/json; charset=utf-8",
      `host:${config.host}`,
      `x-amz-date:${amzDate}`,
      "x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
      "",
    ].join("\n");
    const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
    const canonicalRequest = `POST\n/paapi5/getitems\n\n${canonicalHeaders}\n${signedHeaders}\n${hash(payload)}`;
    const credentialScope = `${dateStamp}/${config.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${hash(canonicalRequest)}`;
    const signature = hmac(signingKey(secretKey, dateStamp, config.region), stringToSign, "hex");
    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(`https://${config.host}/paapi5/getitems`, {
      method: "POST",
      headers: {
        "content-encoding": "amz-1.0",
        "content-type": "application/json; charset=utf-8",
        host: config.host,
        "x-amz-date": amzDate,
        "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
        authorization,
      },
      body: payload,
    });
    const result = await response.json();
    if (!response.ok || result.Errors?.length) {
      throw new Error(
        result.Errors?.[0]?.Message ?? "Amazon could not return details for that product.",
      );
    }
    const item = result.ItemsResult?.Items?.[0];
    if (!item) throw new Error("Amazon could not find a product for that link.");
    const listing = item.Offers?.Listings?.[0];
    const price = Number(listing?.Price?.Amount);
    const name = item.ItemInfo?.Title?.DisplayValue;
    const image = item.Images?.Primary?.Large?.URL;
    if (!name || !image || !Number.isFinite(price)) {
      throw new Error("Amazon did not return a name, image, and current price for this product.");
    }
    const features = item.ItemInfo?.Features?.DisplayValues ?? [];
    const node = item.BrowseNodeInfo?.BrowseNodes?.[0];
    return {
      name,
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue ?? "",
      category: node?.DisplayName ?? "Other",
      subcategory: node?.ContextFreeName ?? "",
      price,
      rating: Number(item.CustomerReviews?.StarRating?.Value ?? 0),
      reviews: Number(item.CustomerReviews?.Count ?? 0),
      image,
      blurb: features.slice(0, 2).join(" "),
      affiliateUrl: item.DetailPageURL ?? data.affiliateUrl,
    };
  });
