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

## 4. Add a product

1. Open `https://your-vercel-domain.vercel.app/control-room`.
2. Enter the Supabase administrator email and password you created above.
3. Fill in the exact product name, image URL, price, rating, description, and Amazon Associates URL.
4. Check the **Public preview** card. This is the same card your visitors see.
5. Click **Save product**.

The product details are now stored in the Supabase `products` table; the old sample catalog is not shown to visitors. After saving, the same product card appears in both the control room and on the public site.

## Security note

Only use the anon/public key above. Never add the Supabase `service_role` key to Vercel, client code, or a `VITE_*` variable. The included SQL allows public reading and authenticated product administration, but does not allow anonymous writing.
