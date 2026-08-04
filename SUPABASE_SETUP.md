# Admin, Supabase, and SearchAPI setup

This guide explains the complete one-time setup for the MG Studio & Sales site. Once finished, you will only need to sign in to the private control room, paste an Amazon affiliate link, click one button, check the preview, and save.

## What each service does

| Service   | Purpose                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Supabase  | Stores your products and protects the administrator login.                                                                     |
| SearchAPI | Retrieves product information from the Amazon product ASIN: title, image, current price, rating, reviews, brand, and category. |
| Vercel    | Hosts the website and keeps secret keys away from visitors.                                                                    |

## Part 1: Set up Supabase

### 1. Create the product table

1. Open your Supabase project.
2. Open **SQL Editor** in the left menu.
3. Click **New query**.
4. Open [`supabase/schema.sql`](supabase/schema.sql) in this project, copy its complete contents, paste it into Supabase, and click **Run**.

Run this SQL one time only. It creates the `products` table and the access rules. No further SQL is needed to enable automatic imports.

### 2. Create the administrator account

1. In Supabase, open **Authentication -> Users**.
2. Click **Add user**.
3. Enter your own email address.
4. If Supabase shows **Send invitation**, send it, open the email, and choose a secure password.
5. Remember this email and password. They are used only at `/control-room`.

There is no customer login on the public website.

### 3. Copy the public Supabase values

Open **Project Settings -> API** in Supabase and copy:

- **Project URL**
- **anon / public key**

Do not use the `service_role` key anywhere in this website.

## Part 2: Get a SearchAPI key

1. Go to [SearchAPI](https://www.searchapi.io/).
2. Create an account and open its dashboard.
3. Create or copy your API key.
4. Keep it private. It is a secret that is charged against your SearchAPI plan.

The site calls SearchAPI's `amazon_product` engine with the product ASIN. The key is used only by the Vercel server; it is never placed in the browser or in a `VITE_` variable. See [SearchAPI's Amazon product documentation](https://www.searchapi.io/docs/amazon-product).

## Part 3: Add variables in Vercel

1. Open Vercel and select the `amazonaffiliate` project.
2. Go to **Settings -> Environment Variables**.
3. Add the following entries. Select **Production**, **Preview**, and **Development** for each one.

```text
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-KEY
VITE_SITE_URL=https://mgstudios.vercel.app

SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-KEY

SEARCHAPI_KEY=YOUR-SEARCHAPI-KEY
SEARCHAPI_AMAZON_DOMAIN=amazon.in
```

Notes:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safe public connection values required by the website.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SEARCHAPI_KEY` are server values. Do **not** add `VITE_` to their names.
- Use `amazon.in` for India. Change `SEARCHAPI_AMAZON_DOMAIN` only when you intentionally list products from another Amazon marketplace. If unsure, leave it as `amazon.in`.
- Never paste a real key into GitHub, a README, or a screenshot.

4. Click **Save** after each variable.
5. Go to the **Deployments** tab and click **Redeploy** on the latest deployment. New variables only apply after deployment.

## Part 4: Add a product automatically

1. Visit `https://mgstudios.vercel.app/control-room`.
2. Sign in using the Supabase administrator email and password from Part 1.
3. In **Amazon Associates link**, paste one complete Amazon product/affiliate link.
4. Click **Fill details automatically**.
5. Wait briefly. The product name, image, price, rating, review count, brand, and category should fill in.
6. Look at **Public preview**. It is the exact card visitors see.
7. Change any editorial fields you want, such as the description, whether it is featured, or whether it is a deal.
8. Click **Save product**.
9. Open **View storefront** to confirm it is public.

The original affiliate URL you pasted is retained for the **View on Amazon** button, so your tracking link is not replaced by SearchAPI.

## Link rules and common problems

- Paste one URL only. Do not paste the same link twice.
- The link needs a valid 10-character Amazon ASIN. Normal URLs usually contain `/dp/ASIN`, for example `https://www.amazon.in/dp/B0XXXXXXXX`.
- Short Amazon links are supported if they redirect to a normal Amazon product page.
- Your earlier example was not usable because it contained two URLs joined together and did not show a 10-character ASIN.
- If SearchAPI reports no product, first open the link in a private browser window and confirm it is a real Amazon product page for the selected marketplace.
- Prices and availability change at Amazon. Import again or edit the product when you want to refresh them.

## Security checklist

- Keep `SEARCHAPI_KEY` secret; it stays in Vercel only.
- Never use the Supabase `service_role` key in this project.
- Do not share the `/control-room` login.
- The control room is protected by Supabase authentication and is excluded from search indexing.

## Do I need extra SQL?

No. The existing [`supabase/schema.sql`](supabase/schema.sql) already stores all imported fields. SearchAPI setup is done entirely with Vercel environment variables.
