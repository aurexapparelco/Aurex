-- Single-row settings table (check constraint enforces max 1 row)
create table public.settings (
  id                      integer primary key default 1 check (id = 1),
  bank_name               text not null default 'Commercial Bank of Ceylon',
  bank_account_name       text not null default 'Auréx Atelier (Pvt) Ltd',
  bank_account_number     text not null default '',
  bank_branch             text not null default '',
  zone_colombo_fee        integer not null default 350,
  zone_colombo_days       text not null default '1–2',
  zone_suburbs_fee        integer not null default 550,
  zone_suburbs_days       text not null default '2–3',
  zone_other_fee          integer not null default 750,
  zone_other_days         text not null default '3–5',
  express_fee             integer not null default 1200,
  free_shipping_threshold integer not null default 15000,
  updated_at              timestamptz not null default now()
);

insert into public.settings (id) values (1);

alter table public.settings enable row level security;

create policy "Settings are publicly readable"
  on public.settings for select using (true);

create policy "Staff can update settings"
  on public.settings for update using (public.auth_is_staff());
