-- Run this complete script in Supabase: SQL Editor -> New query -> Run.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  category text not null default 'Other',
  subcategory text,
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2) check (old_price is null or old_price >= price),
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  reviews integer not null default 0 check (reviews >= 0),
  deal boolean not null default false,
  featured boolean not null default false,
  image text not null check (image ~ '^https?://'),
  blurb text,
  affiliate_url text not null check (affiliate_url ~ '^https?://'),
  price_updated_at timestamptz,
  created_at timestamptz not null default now()
);

-- Safe to run when the products table was created by an earlier version of this project.
alter table public.products add column if not exists price_updated_at timestamptz;

alter table public.products enable row level security;

-- Anyone visiting the storefront can read products, but cannot change them.
create policy "Public can read products"
on public.products for select to anon using (true);

-- Important: do NOT add an anonymous insert/update policy. Use Supabase Auth and
-- an authenticated admin-only write policy before enabling the admin save button in production.
create policy "Authenticated users can manage products"
on public.products for all to authenticated using (true) with check (true);
