# Supabase setup

Use Supabase to store the Amazon Associates URL for each product. The public storefront reads these links and the `/control-room` page can save them after Supabase is configured.

## 1. Create the table

In your Supabase project, open **SQL Editor → New query**, paste the complete contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.

## 2. Add Vercel variables

In Supabase, open **Project Settings → API**. Copy the **Project URL** and **anon/public key**. In Vercel, open **Project → Settings → Environment Variables**, then add:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SITE_URL=https://your-vercel-domain.vercel.app
```

Add them to Production, Preview, and Development. Redeploy after saving.

## 3. Add a link

1. Open `https://your-vercel-domain.vercel.app/control-room`.
2. Enter the current demo passcode: `admin-demo`.
3. In **Supabase link manager**, select a product and paste its Amazon Associates URL.
4. Click **Save link**.

The product id used in Supabase must match `src/data/products.ts`.

## Security note

Only use the anon/public key above. Never add the Supabase `service_role` key to Vercel, client code, or a `VITE_*` variable. The included SQL allows public reading but intentionally does not allow anonymous writing. To save from production, replace the demo gateway with Supabase Auth and add an authenticated write policy.
