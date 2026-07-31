# Amazon Affiliate Curator

A fast, curated storefront for featuring Amazon products across electronics and home categories. Visitors browse editorial product selections and follow outbound Amazon links; there is no customer account or checkout flow in this app.

For a non-technical, step-by-step guide to using the live site and admin link manager, see [FATHER_GUIDE.md](FATHER_GUIDE.md).

> **Amazon disclosure:** Update the footer and site copy with your own Associates disclosure before launch. Use only approved Amazon Associates links and comply with the [Amazon Associates Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement).

## What is included

- Responsive public storefront with home, shop, category, and deal views
- Product cards with ratings, price, product imagery, and Amazon outbound links
- Optional `affiliateUrl` per product, so each item can use its own Amazon Associates tracking URL
- Unlinked `/control-room` route for an admin-interface prototype
- Search-engine exclusion metadata for the control room
- Server-rendered TanStack Start application built with React, TypeScript, Vite, and Tailwind CSS

## Technology

| Area          | Tooling                            |
| ------------- | ---------------------------------- |
| Application   | React 19 + TypeScript              |
| Routing / SSR | TanStack Start and TanStack Router |
| Styling       | Tailwind CSS 4                     |
| Build tool    | Vite                               |
| Icons         | Lucide React                       |
| Code quality  | ESLint + Prettier                  |

## Requirements

- Node.js 20 or later (Node.js 22 recommended)
- npm 10 or later
- An Amazon Associates account for real affiliate URLs

## Run locally

```bash
# Clone the repository, then enter it
git clone <your-repository-url>
cd amazon-affiliate-curator

# Install packages
npm install

# Start the development server
npm run dev
```

Open the local URL Vite displays in the terminal, usually [http://localhost:5173](http://localhost:5173).

Useful commands:

```bash
npm run build     # Creates a production build
npm run preview   # Serves the production build locally
npm run lint      # Checks code quality
npm run format    # Formats source files with Prettier
```

## Project structure

```text
src/
├── components/         # Shared storefront and UI components
├── data/products.ts    # Current catalog data and affiliate links
├── routes/
│   ├── index.tsx       # Public home page
│   ├── shop.tsx        # Catalog, category, and deal filtering
│   └── control-room.tsx# Hidden admin-interface prototype
├── styles.css          # Global styles and design tokens
├── router.tsx          # Router setup
├── start.ts            # Server application configuration
└── server.ts            # Server entry and error handling
```

## Managing products and affiliate links

The initial catalog is in [`src/data/products.ts`](src/data/products.ts). Each entry follows this shape:

```ts
{
  id: "product-slug",
  name: "Product name",
  brand: "Brand",
  category: "Electronics", // or "Home"
  subcategory: "Audio",
  price: 199,
  oldPrice: 249,            // optional
  rating: 4.7,
  reviews: 1200,
  deal: true,               // optional
  featured: true,           // optional
  image: "https://...",
  blurb: "Short editorial description.",
  affiliateUrl: "https://www.amazon.com/dp/.../?tag=YOUR_TAG-20",
}
```

`affiliateUrl` is optional. If it is omitted, the site links to an Amazon search for that product name. For a real affiliate deployment, add an approved Associates URL to every product.

## Admin gateway

The admin interface is intentionally not linked from public navigation:

```text
/control-room
```

It currently uses the demonstration passcode `admin-demo` and shows a prototype catalog-management interface.

### Important security notice

This is **not production authentication**. Because the current check runs in the browser, anyone can inspect or bypass it. Before real use, replace it with:

1. Server-side authentication (for example, Auth.js, Clerk, Supabase Auth, or a custom provider).
2. HTTP-only, secure session cookies.
3. Role checks on every administration request.
4. A database for products, affiliate URLs, editorial copy, and images.
5. Server-side validation and audit logging for catalog changes.

Never put an Amazon secret, API key, or a real admin password in browser code, a `VITE_*` variable, or a committed `.env` file.

## Connect Supabase for affiliate links

The storefront can load each product's Amazon Associates URL from Supabase. This lets you update links without changing the product-card code.

1. Create a Supabase project.
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env.local` and fill in your project URL and **anon/public** key.
4. In Vercel, add the same values under **Settings → Environment Variables**:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_URL
```

5. Add or update a link in the `affiliate_links` table. Its `product_id` must match a product's `id` in `src/data/products.ts`.

Example row:

```text
product_id: aurora-14-ultrabook
affiliate_url: https://www.amazon.com/dp/EXAMPLE/?tag=YOUR_TAG-20
```

When Supabase is not configured, the storefront continues to use `affiliateUrl` values in the local catalog, then falls back to an Amazon search link. The browser only receives the public anon key; never add a service-role key to Vercel's `VITE_*` variables.

For the full click-by-click setup, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## Deploy to Vercel

This is a server-rendered TanStack Start project. Import the Git repository in Vercel, then use these settings from the **Build and Development Settings** page shown in the screenshots:

| Vercel setting                           | Value                                                          |
| ---------------------------------------- | -------------------------------------------------------------- |
| Framework Preset                         | `Other`                                                        |
| Build Command                            | `npm run build`                                                |
| Output Directory                         | Leave empty / do not override                                  |
| Install Command                          | `npm install`                                                  |
| Development Command                      | Leave empty / do not override                                  |
| Root Directory                           | `./` (or leave blank when the repository root is this project) |
| Include files outside the root directory | Not required; disable unless your repository needs it          |
| Ignored Build Step                       | `Automatic`                                                    |

In the Vercel UI, turn each **Override** switch on only when entering the corresponding value above. Do not set the output directory to `dist` for this project: the production build includes both client assets and a server entry, and Vercel needs to detect the complete application output.

### Vercel deployment steps

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New → Project** and import the repository.
3. Confirm the root directory is the repository root (`./`).
4. Apply the build settings in the table above.
5. Add production environment variables only after the admin system has been connected to a secure backend.
6. Click **Deploy**.
7. Open the deployed URL, test the public shop, and verify every outbound affiliate link uses your Associate tag.

## Production launch checklist

- [ ] Replace sample product data, names, prices, ratings, descriptions, and images.
- [ ] Add a valid Associates link to each product.
- [ ] Confirm your disclosure is visible wherever required.
- [ ] Implement real server-side admin authentication and a database.
- [ ] Change the demo admin gateway before publishing.
- [ ] Add a privacy policy, cookie policy (if applicable), terms, and contact page.
- [ ] Add a custom domain and configure its DNS in Vercel.
- [ ] Add favicon, social preview image, analytics, and error monitoring.
- [ ] Test on mobile, desktop, and an incognito browser session.

## License

Private project. Add a license file if you intend to share or open-source the repository.
