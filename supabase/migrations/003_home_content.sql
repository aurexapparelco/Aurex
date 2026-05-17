create table public.home_content (
  id              integer primary key default 1 check (id = 1),
  hero            jsonb not null default '{}'::jsonb,
  feature_strip   jsonb not null default '{}'::jsonb,
  collection_cards jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

insert into public.home_content (id, hero, feature_strip, collection_cards) values (
  1,
  '{
    "visible": true,
    "eyebrow": "Precision Crafted",
    "headline": "Essentials,",
    "headlineAccent": "Elevated.",
    "subtext": "Premium-grade tees engineered for Sri Lanka''s climate. 200GSM supima cotton, tailored silhouettes.",
    "primaryCta": {"label": "Shop Collection", "href": "/shop"},
    "secondaryCta": {"label": "Premium Collection", "href": "/shop?type=Premium"},
    "stats": [
      {"value": "200", "unit": "GSM", "label": "Premium Cotton"},
      {"value": "5",   "unit": "Colors", "label": "Per Drop"},
      {"value": "100%","unit": "LK",     "label": "Made in Sri Lanka"}
    ],
    "imageUrl": ""
  }'::jsonb,
  '{
    "visible": true,
    "features": [
      {"icon": "✦", "label": "Premium 200GSM Supima"},
      {"icon": "◈", "label": "Structured Tailored Fit"},
      {"icon": "⊹", "label": "Free Returns · 30 Days"},
      {"icon": "◻", "label": "Made in Sri Lanka"}
    ]
  }'::jsonb,
  '{
    "visible": true,
    "cards": [
      {
        "overline": "Collection 01",
        "heading": "Plain Essentials",
        "description": "Refined basics in signature colours. The foundation of every wardrobe.",
        "cta": "Explore →",
        "href": "/shop?type=Plain"
      },
      {
        "overline": "Collection 02",
        "heading": "Premium Collection",
        "description": "Elevated fabrication with structured details. Crafted for distinction.",
        "cta": "Explore →",
        "href": "/shop?type=Premium"
      }
    ]
  }'::jsonb
);

alter table public.home_content enable row level security;

create policy "Home content is publicly readable"
  on public.home_content for select using (true);

create policy "Staff can update home content"
  on public.home_content for update using (public.auth_is_staff());
