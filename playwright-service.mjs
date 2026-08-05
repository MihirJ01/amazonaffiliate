import { createServer } from "node:http";
import { chromium } from "playwright";

const port = Number(process.env.PLAYWRIGHT_SERVICE_PORT ?? 3333);
const secret = process.env.PLAYWRIGHT_SERVICE_SECRET;

if (!secret) {
  throw new Error("Set PLAYWRIGHT_SERVICE_SECRET before starting the Playwright service.");
}

function numberFromText(value) {
  const number = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

async function readAmazonProduct(affiliateUrl) {
  const source = new URL(affiliateUrl);
  if (!source.hostname.toLowerCase().includes("amazon")) {
    throw new Error("Please paste an Amazon product or Amazon Associates link.");
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1200 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36",
    });
    await page.goto(source.toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
    const pageText = await page.locator("body").innerText();
    if (/robot check|enter the characters you see below|captcha/i.test(pageText)) {
      throw new Error("Amazon showed a CAPTCHA. Try the SearchAPI button instead.");
    }
    await page.waitForSelector("#productTitle", { timeout: 10_000 });
    const details = await page.evaluate(() => {
      const text = (selector) => document.querySelector(selector)?.textContent?.trim() ?? "";
      const image = document.querySelector("#landingImage");
      return {
        name: text("#productTitle"),
        brand: text("#bylineInfo")
          .replace(/^Visit the\s+/i, "")
          .replace(/\s+Store$/i, ""),
        price:
          text(".a-price .a-offscreen") ||
          text("#priceblock_ourprice") ||
          text("#priceblock_dealprice"),
        rating: text("#acrPopover") || text(".a-icon-alt"),
        reviews: text("#acrCustomerReviewText"),
        image: image?.getAttribute("data-old-hires") || image?.currentSrc || image?.src || "",
        blurb: Array.from(document.querySelectorAll("#feature-bullets li span"))
          .map((node) => node.textContent?.trim() ?? "")
          .filter(Boolean)
          .slice(0, 2)
          .join(" "),
        category: text("#wayfinding-breadcrumbs_feature_div ul li:last-child a") || "Other",
      };
    });
    if (!details.name || !details.image || !numberFromText(details.price)) {
      throw new Error("Amazon did not show enough product information. Try SearchAPI instead.");
    }
    return {
      name: details.name,
      brand: details.brand,
      category: details.category,
      subcategory: "",
      price: numberFromText(details.price),
      rating: numberFromText(details.rating),
      reviews: numberFromText(details.reviews),
      image: details.image,
      blurb: details.blurb,
      affiliateUrl,
    };
  } finally {
    await browser.close();
  }
}

createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (request.method !== "POST" || request.url !== "/import") {
    response.writeHead(404).end(JSON.stringify({ error: "Not found" }));
    return;
  }
  if (request.headers.authorization !== `Bearer ${secret}`) {
    response.writeHead(401).end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }
  let body = "";
  for await (const chunk of request) body += chunk;
  try {
    const { affiliateUrl } = JSON.parse(body);
    if (typeof affiliateUrl !== "string") throw new Error("affiliateUrl is required.");
    const product = await readAmazonProduct(affiliateUrl);
    response.writeHead(200).end(JSON.stringify(product));
  } catch (error) {
    response
      .writeHead(400)
      .end(JSON.stringify({ error: error instanceof Error ? error.message : "Import failed." }));
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Playwright importer listening on http://127.0.0.1:${port}`);
});
