create table public.courier_cities (
  id         serial primary key,
  name       text not null unique,
  charge     integer not null check (charge >= 0),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.courier_cities enable row level security;

create policy "Courier cities are publicly readable"
  on public.courier_cities for select using (true);

create policy "Staff can manage courier cities"
  on public.courier_cities for all using (public.auth_is_staff());

-- Remove zone from orders (city alone identifies the courier rate now)
alter table public.orders drop column if exists zone;
