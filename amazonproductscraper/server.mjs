import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const port = 3333;

function numberFromText(value) {
  const number = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

async function scrape(affiliateUrl) {
  const source = new URL(affiliateUrl);
  if (!source.hostname.toLowerCase().includes("amazon"))
    throw new Error("Paste an Amazon product link.");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    await page.goto(source.toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
    if (/robot check|captcha/i.test(await page.locator("body").innerText())) {
      throw new Error(
        "Amazon showed a CAPTCHA. Wait and try again, or use SearchAPI in the website admin.",
      );
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
        description: Array.from(document.querySelectorAll("#feature-bullets li span"))
          .map((node) => node.textContent?.trim() ?? "")
          .filter(Boolean)
          .slice(0, 2)
          .join(" "),
      };
    });
    if (!details.name || !details.image || !numberFromText(details.price))
      throw new Error("Amazon did not show enough product details.");
    return {
      ...details,
      price: numberFromText(details.price),
      rating: numberFromText(details.rating),
      reviews: numberFromText(details.reviews),
      affiliateUrl,
    };
  } finally {
    await browser.close();
  }
}

createServer(async (request, response) => {
  if (request.method === "GET") {
    response
      .writeHead(200, { "Content-Type": "text/html" })
      .end(await readFile(new URL("./index.html", import.meta.url)));
    return;
  }
  if (request.method !== "POST" || request.url !== "/scrape") {
    response.writeHead(404).end();
    return;
  }
  let body = "";
  for await (const chunk of request) body += chunk;
  try {
    const result = await scrape(JSON.parse(body).affiliateUrl);
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(result));
  } catch (error) {
    response
      .writeHead(400, { "Content-Type": "application/json" })
      .end(JSON.stringify({ error: error instanceof Error ? error.message : "Scrape failed." }));
  }
}).listen(port, () => console.log(`Scraper running at http://localhost:${port}`));
