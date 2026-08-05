# Website setup

## Supabase

1. In Supabase, open **SQL Editor -> New query**.
2. Run the complete contents of [`supabase/schema.sql`](supabase/schema.sql) once.
3. Open **Authentication -> Users -> Add user** and create the administrator email/password.
4. In **Project Settings -> API**, copy your Project URL and anon/public key.

## Vercel variables

Add these in **Vercel -> Project -> Settings -> Environment Variables**, then redeploy:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SITE_URL=https://mgstudios.vercel.app

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SEARCHAPI_KEY=your-searchapi-key
SEARCHAPI_AMAZON_DOMAIN=amazon.in
```

Never put the Supabase `service_role` key or any secret in a `VITE_` variable.

## Admin panel

Open `https://mgstudios.vercel.app/control-room`, sign in with the Supabase administrator email/password, paste one Amazon product link, then click **Fill details automatically using SearchAPI**. Review the preview and save the product.

The category tree is built into the admin form. Pick the top-level category first, then choose its subcategory.

## Automatic price refresh

If you enabled the daily price refresh, add these Vercel server-only variables:

```text
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CRON_SECRET=a-long-random-secret
```

If the `products` table existed before price refresh was added, run this once:

```sql
alter table public.products add column if not exists price_updated_at timestamptz;
```

## Separate Playwright scraper

Playwright is intentionally not part of this hosted website. Use the separate local scraper project instead: [`amazonproductscraper/README.md`](amazonproductscraper/README.md). It copies product fields for you to paste into this admin panel.
