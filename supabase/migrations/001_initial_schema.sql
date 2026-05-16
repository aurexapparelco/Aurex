-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── product_types ────────────────────────────────────────────────────────────
create table public.product_types (
  id         uuid primary key default uuid_generate_v4(),
  name       text unique not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.product_types enable row level security;

create policy "Product types are publicly readable"
  on public.product_types for select using (true);

create policy "Staff can manage product types"
  on public.product_types for all using (public.auth_is_staff());

-- ─── staff ───────────────────────────────────────────────────────────────────
-- Created first: RLS policies on other tables reference this table.
create table public.staff (
  id   uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('Owner', 'Operations', 'Fulfilment'))
);

alter table public.staff enable row level security;

-- Security-definer helpers bypass RLS when checking staff membership,
-- preventing infinite recursion in policies that query this table.
create or replace function public.auth_is_staff()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from staff where id = auth.uid());
$$;

create or replace function public.auth_is_owner()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from staff where id = auth.uid() and role = 'Owner');
$$;

create policy "Staff can read own row"
  on public.staff for select
  using (auth.uid() = id);

create policy "Owner can manage staff"
  on public.staff for all
  using (public.auth_is_owner());

-- ─── products ────────────────────────────────────────────────────────────────
create table public.products (
  id          text primary key,
  name        text not null,
  type_id     uuid references public.product_types(id) on delete set null,
  price       integer not null,
  compare_at  integer,
  fabric      text not null default '',
  gsm         integer not null default 200,
  fit         text not null default '',
  care        text not null default '',
  model_info  text not null default '',
  fit_note    text not null default '',
  origin      text not null default 'Made in Sri Lanka',
  description text not null default '',
  tags        text[] not null default '{}'
);

alter table public.products enable row level security;

create policy "Products are publicly readable"
  on public.products for select
  using (true);

create policy "Staff can manage products"
  on public.products for all
  using (public.auth_is_staff());

-- ─── product_variants ────────────────────────────────────────────────────────
create table public.product_variants (
  id         uuid primary key default uuid_generate_v4(),
  product_id text not null references public.products(id) on delete cascade,
  color      text not null,
  hex        text not null,
  images     text[] not null default '{}'
);

alter table public.product_variants enable row level security;

create policy "Variants are publicly readable"
  on public.product_variants for select
  using (true);

create policy "Staff can manage variants"
  on public.product_variants for all
  using (public.auth_is_staff());

-- ─── inventory ───────────────────────────────────────────────────────────────
create table public.inventory (
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  size       text not null check (size in ('S', 'M', 'L', 'XL', 'XXL')),
  qty        integer not null default 0 check (qty >= 0),
  primary key (variant_id, size)
);

alter table public.inventory enable row level security;

create policy "Inventory is publicly readable"
  on public.inventory for select
  using (true);

create policy "Staff can manage inventory"
  on public.inventory for all
  using (public.auth_is_staff());

-- ─── customers ───────────────────────────────────────────────────────────────
create table public.customers (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  city       text,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;

create policy "Customers see own profile"
  on public.customers for select
  using (auth.uid() = id);

create policy "Customers update own profile"
  on public.customers for update
  using (auth.uid() = id);

create policy "Staff can view all customers"
  on public.customers for select
  using (public.auth_is_staff());

-- Trigger: auto-create customer row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.customers (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── orders ──────────────────────────────────────────────────────────────────
create table public.orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text unique not null,
  user_id         uuid references auth.users(id) on delete set null,
  email           text not null,
  first_name      text not null,
  last_name       text not null,
  phone           text not null,
  address         text not null,
  city            text not null,
  zone            text not null check (zone in ('Colombo', 'Suburbs', 'Other Districts')),
  postal          text not null default '',
  delivery_note   text,
  shipping_method text not null check (shipping_method in ('standard', 'express')),
  shipping_fee    integer not null,
  subtotal        integer not null,
  total           integer not null,
  payment_method  text not null default 'Bank Transfer',
  status          text not null default 'Awaiting Payment'
    check (status in ('Awaiting Payment', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded')),
  created_at      timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Customers see own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Anyone can create an order"
  on public.orders for insert
  with check (true);

create policy "Staff can manage all orders"
  on public.orders for all
  using (public.auth_is_staff());

-- ─── order_lines ─────────────────────────────────────────────────────────────
create table public.order_lines (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   text not null,
  product_name text not null,
  color        text not null,
  size         text not null,
  qty          integer not null check (qty > 0),
  unit_price   integer not null
);

alter table public.order_lines enable row level security;

create policy "Order lines visible via order"
  on public.order_lines for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.auth_is_staff())
    )
  );

create policy "Anyone can insert order lines"
  on public.order_lines for insert
  with check (true);

create policy "Staff can manage order lines"
  on public.order_lines for all
  using (public.auth_is_staff());
