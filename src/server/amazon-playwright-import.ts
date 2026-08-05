import { createServerFn } from "@tanstack/react-start";
import type { ImportedAmazonProduct } from "@/server/amazon-import";

async function verifyAdministrator(accessToken: string) {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase server settings are missing.");
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error("Please sign in again before importing a product.");
}

function numberFromText(value: string) {
  const number = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export const importAmazonProductWithPlaywright = createServerFn({ method: "POST" })
  .validator((input: { affiliateUrl: string; accessToken: string }) => {
    if (!input.affiliateUrl?.trim() || !input.accessToken) {
      throw new Error("A signed-in session and one Amazon link are required.");
    }
    return { affiliateUrl: input.affiliateUrl.trim(), accessToken: input.accessToken };
  })
  .handler(async ({ data }): Promise<ImportedAmazonProduct> => {
    await verifyAdministrator(data.accessToken);
    const remoteServiceUrl = process.env.PLAYWRIGHT_SERVICE_URL;
    const remoteServiceSecret = process.env.PLAYWRIGHT_SERVICE_SECRET;
    if (remoteServiceUrl && remoteServiceSecret) {
      try {
        const response = await fetch(`${remoteServiceUrl.replace(/\/$/, "")}/import`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${remoteServiceSecret}`,
          },
          body: JSON.stringify({ affiliateUrl: data.affiliateUrl }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.error ?? "Your laptop Playwright service could not import this product.",
          );
        }
        return result as ImportedAmazonProduct;
      } catch (error) {
        if (error instanceof TypeError && /fetch failed/i.test(error.message)) {
          throw new Error(
            "Vercel cannot reach your laptop Playwright service. Keep the laptop service and Cloudflare tunnel running, update PLAYWRIGHT_SERVICE_URL with the current HTTPS tunnel URL, then redeploy.",
          );
        }
        throw error;
      }
    }
    let source: URL;
    try {
      source = new URL(data.affiliateUrl);
    } catch {
      throw new Error("Paste one complete Amazon product link.");
    }
    if (!source.hostname.toLowerCase().includes("amazon")) {
      throw new Error("Please paste an Amazon product or Amazon Associates link.");
    }

    const { chromium } = await import("playwright");
    let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage({
        viewport: { width: 1440, height: 1200 },
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36",
      });
      await page.goto(source.toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
      const pageText = await page.locator("body").innerText();
      if (/robot check|enter the characters you see below|captcha/i.test(pageText)) {
        throw new Error(
          "Amazon showed a CAPTCHA. Try SearchAPI instead, or open the link manually and try later.",
        );
      }
      await page.waitForSelector("#productTitle", { timeout: 10_000 });
      const details = await page.evaluate(() => {
        const text = (selector: string) =>
          document.querySelector(selector)?.textContent?.trim() ?? "";
        const image = document.querySelector<HTMLImageElement>("#landingImage");
        const bullets = Array.from(document.querySelectorAll("#feature-bullets li span"))
          .map((node) => node.textContent?.trim() ?? "")
          .filter(Boolean)
          .slice(0, 2)
          .join(" ");
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
          blurb: bullets,
          category: text("#wayfinding-breadcrumbs_feature_div ul li:last-child a") || "Other",
        };
      });
      if (!details.name || !details.image || !numberFromText(details.price)) {
        throw new Error(
          "Amazon did not show enough product information. Try the SearchAPI button instead.",
        );
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
        affiliateUrl: data.affiliateUrl,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        /Executable doesn't exist|browserType.launch/i.test(error.message)
      ) {
        throw new Error(
          "Playwright Chromium is not installed. Run: npx playwright install chromium",
        );
      }
      throw error;
    } finally {
      await browser?.close();
    }
  });
