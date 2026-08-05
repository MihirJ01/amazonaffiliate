# Amazon Product Scraper

This is a separate local Playwright tool. It is not deployed to Vercel and does not connect to Supabase.

## Start it

```powershell
cd "C:\Users\mihir\Downloads\lovable-project-4d3c673c\amazonaffiliateclean\amazonproductscraper"
npm install
npm run setup
npm start
```

Open `http://localhost:3333` in your browser.

## Use it

1. Paste one Amazon product URL.
2. Click **Extract product details**.
3. Use **Copy** next to a field, or **Copy all details**.
4. Open `https://mgstudios.vercel.app/control-room`.
5. Paste the copied name, brand, price, rating, reviews, image URL, description, and Amazon link into the product form, select the category/subcategory, and save.

If Amazon shows a CAPTCHA, wait and retry later or use the SearchAPI button in the hosted admin panel.
