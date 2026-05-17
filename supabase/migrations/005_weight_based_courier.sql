-- 005_weight_based_courier.sql
-- Add per-kg pricing structure to courier_cities and item weight to products.

-- 1. Add new charge columns
alter table public.courier_cities
  add column charge_first_kg integer not null default 350,
  add column charge_per_additional_kg integer not null default 100;

-- 2. Copy existing flat charge → first-kg charge
update public.courier_cities set charge_first_kg = charge;

-- 3. Drop old flat charge column
alter table public.courier_cities drop column charge;

-- 4. Replace case-sensitive unique constraint with case-insensitive unique index
alter table public.courier_cities drop constraint if exists courier_cities_name_key;
create unique index if not exists courier_cities_name_ci
  on public.courier_cities (lower(name));

-- 5. Add weight_grams to products (default 275g = typical tee weight)
alter table public.products
  add column if not exists weight_grams integer not null default 275;
