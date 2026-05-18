-- Add listed flag to products
alter table public.products
  add column listed boolean not null default true;

-- Replace the blanket public-readable policy with one that hides unlisted products
drop policy "Products are publicly readable" on public.products;

create policy "Listed products are publicly readable"
  on public.products for select
  using (listed = true);

-- Staff already have a catch-all "for all" policy, so they can read/write unlisted products
