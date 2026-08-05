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

## Optional local Playwright importer

The admin panel has two separate import buttons:

1. **Fill details automatically using SearchAPI** — recommended for the deployed Vercel website. It uses your `SEARCHAPI_KEY` and does not need a browser installed.
2. **Fill details automatically using Playwright** — an optional local-server fallback that opens a headless Chromium browser and reads the Amazon page. Amazon can show a CAPTCHA; if it does, use SearchAPI instead.

To use Playwright on your own computer, open PowerShell in the project folder and run this once:

```powershell
cd "C:\Users\mihir\Downloads\lovable-project-4d3c673c\amazonaffiliateclean"
npm run setup:playwright
```

Then start the local server:

```powershell
npm run dev
```

Open the local URL printed by Vite, sign in to `/control-room`, paste one Amazon product link, and click **Fill details automatically using Playwright**.

Playwright needs Chromium installed on the same computer/server that runs the website. A normal Vercel deployment does not include that browser, so use the SearchAPI button on Vercel unless you configure a browser-compatible server environment yourself.

## Hosted Vercel website with Playwright on your laptop

You can keep the public frontend on Vercel and run only the Playwright browser service on your laptop. The laptop must remain powered on and connected to the internet whenever you use the Playwright button.

### 1. Install Chromium on your laptop

```powershell
cd "C:\Users\mihir\Downloads\lovable-project-4d3c673c\amazonaffiliateclean"
npm run setup:playwright
```

### 2. Create a service secret

Generate a new secret. Do not reuse `CRON_SECRET`.

```powershell
[guid]::NewGuid().ToString("N")
```

Use the generated value as `PLAYWRIGHT_SERVICE_SECRET` in both places below.

### 3. Start the laptop service

In PowerShell, set the secret for this terminal session and start the service:

```powershell
$env:PLAYWRIGHT_SERVICE_SECRET="paste-your-new-secret-here"
npm run playwright:service
```

It listens only on `http://127.0.0.1:3333`, so it is not public by itself.

### 4. Create a secure HTTPS tunnel to your laptop

Install [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) on your laptop. For a quick test, open a second PowerShell window and run:

```powershell
cloudflared tunnel --url http://127.0.0.1:3333
```

Copy the `https://...trycloudflare.com` URL it prints. For reliable long-term use, create a named Cloudflare Tunnel with your own domain; temporary `trycloudflare.com` URLs change every time you restart the tunnel.

### 5. Add two Vercel variables and redeploy

In **Vercel -> Project -> Settings -> Environment Variables**, add:

```text
PLAYWRIGHT_SERVICE_URL=https://the-url-from-your-cloudflare-tunnel
PLAYWRIGHT_SERVICE_SECRET=the-same-secret-you-used-on-your-laptop
```

Do not add `VITE_` to either name. Redeploy the Vercel project after saving. Vercel now forwards the Playwright request securely to your laptop; your browser never receives the secret.

### 6. Use the hosted website

Open `https://mgstudios.vercel.app/control-room`, sign in, paste an Amazon link, then use **Fill details automatically using Playwright**. Keep both the laptop service and Cloudflare Tunnel windows running.

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

For a new Supabase project, run the complete [`supabase/schema.sql`](supabase/schema.sql) once. If you created the `products` table before adding the daily price refresh, run this small migration in Supabase SQL Editor once:

```sql
alter table public.products add column if not exists price_updated_at timestamptz;
```

## Daily automatic price refresh

The project includes a Vercel Cron Job that runs every day at **4:00 UTC (9:30 AM India time)**. It checks up to 25 of the oldest price records through SearchAPI and updates their prices in Supabase. This keeps SearchAPI usage controlled while rotating through larger catalogues.

Add these two additional server-only Vercel environment variables:

```text
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CRON_SECRET=a-long-random-secret-you-create
```

Find the service role key in **Supabase -> Project Settings -> API**. It must stay in Vercel only; never put it in a `VITE_` variable, GitHub, or a screenshot. Redeploy after adding the variables. Vercel reads [`vercel.json`](vercel.json) and automatically registers the daily job.
