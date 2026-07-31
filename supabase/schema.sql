-- Run this in Supabase: SQL Editor -> New query.
create table if not exists public.affiliate_links (
  product_id text primary key,
  affiliate_url text not null check (affiliate_url ~ '^https?://'),
  updated_at timestamptz not null default now()
);

alter table public.affiliate_links enable row level security;

-- Public visitors may read active affiliate links.
create policy "Public can read affiliate links"
on public.affiliate_links for select to anon using (true);

-- Do not create public insert/update policies. Use authenticated admin users and
-- add narrowly scoped write policies after Supabase Auth is configured.
