# Supabase setup

Use Supabase to store each complete product listing: name, image, price, rating, description, and Amazon Associates URL. The public storefront and `/control-room` preview both read the same product records.

## 1. Create the table

In your Supabase project, open **SQL Editor → New query**, paste the complete contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.

## 2. Create the administrator login

In Supabase, open **Authentication -> Users -> Add user**. Create one email/password account for the person who manages products. This is the login used on `/control-room`; normal visitors never see it.

## 3. Add Vercel variables

In Supabase, open **Project Settings → API**. Copy the **Project URL** and **anon/public key**. In Vercel, open **Project → Settings → Environment Variables**, then add:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SITE_URL=https://your-vercel-domain.vercel.app
```

Add them to Production, Preview, and Development. Redeploy after saving.

## 4. Enable automatic Amazon product imports (recommended)

The **Fill details automatically** button uses the approved Amazon Product Advertising API (PA-API), rather than trying to scrape Amazon in a browser. In Amazon Associates Central, create Product Advertising API credentials and note your Associate/Partner tag.

In Vercel **Project -> Settings -> Environment Variables**, add these as server-only variables (do **not** prefix them with `VITE_`):

```text
AMAZON_PAAPI_ACCESS_KEY=your-access-key
AMAZON_PAAPI_SECRET_KEY=your-secret-key
AMAZON_ASSOCIATES_TAG=your-associate-tag
AMAZON_MARKETPLACE=www.amazon.in
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

Use the marketplace that matches your Associates account. Supported values in this project are `www.amazon.in`, `www.amazon.com`, `www.amazon.ca`, `www.amazon.co.uk`, `www.amazon.de`, `www.amazon.fr`, `www.amazon.it`, `www.amazon.es`, and `www.amazon.co.jp`.

Redeploy after adding them. The secret key stays on the Vercel server and is never sent to visitors.

## 5. Add a product

1. Open `https://your-vercel-domain.vercel.app/control-room`.
2. Enter the Supabase administrator email and password you created above.
3. Paste **one** complete Amazon Associates product link in the import box and click **Fill details automatically**.
4. The name, image, current price, rating, review count, brand and category are filled from Amazon. Check the **Public preview** card; it is the same card visitors see.
5. Click **Save product**.

If the Product Advertising API is not configured, you can still enter the product fields by hand.

The product details are now stored in the Supabase `products` table; the old sample catalog is not shown to visitors. After saving, the same product card appears in both the control room and on the public site.

## Security note

Only use the anon/public key above. Never add the Supabase `service_role` key to Vercel, client code, or a `VITE_*` variable. The included SQL allows public reading and authenticated product administration, but does not allow anonymous writing.

## Do I need more SQL?

No. Run [`supabase/schema.sql`](supabase/schema.sql) once; it already has every column needed for imported product details. API credentials are Vercel environment variables, not SQL queries.
