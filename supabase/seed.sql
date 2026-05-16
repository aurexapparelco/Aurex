-- Seed data for Auréx Atelier

-- ─── Product Types ────────────────────────────────────────────────────────────
insert into public.product_types (name, sort_order) values
  ('T-Shirt',    1),
  ('Polo',       2),
  ('Inner Wear', 3),
  ('Hoodie',     4)
on conflict (name) do nothing;

-- ─── Products ────────────────────────────────────────────────────────────────
with pt as (select id, name from public.product_types)
insert into public.products (id, name, type_id, price, compare_at, fabric, gsm, fit, care, model_info, fit_note, description, tags)
select
  p.id, p.name,
  (select id from pt where pt.name = p.type_name),
  p.price, p.compare_at, p.fabric, p.gsm, p.fit, p.care, p.model_info, p.fit_note, p.description, p.tags
from (values
  (
    'ax-plain-black-tee', 'Plain Essential Tee', 'T-Shirt',
    3900, null::integer,
    '100% Supima Cotton', 200, 'Regular Fit',
    'Machine wash cold, tumble dry low',
    'Model is 6''1" wearing size M',
    'True to size. If between sizes, size up.',
    'The foundational piece of the Auréx wardrobe. 200GSM supima cotton with a structured silhouette that holds its form across hundreds of washes.',
    '{Featured,New Arrival}'::text[]
  ),
  (
    'ax-premium-structured-tee', 'Premium Structured Tee', 'Polo',
    5900, 6900::integer,
    '100% Supima Cotton (Combed & Ring-spun)', 200, 'Slim Fit',
    'Hand wash or machine wash cold, hang dry',
    'Model is 6''1" wearing size M',
    'Runs slightly slim. Consider sizing up for a relaxed fit.',
    'Elevated construction with reinforced seams and a precision-cut silhouette. Our premium tier redefines what a t-shirt can feel like.',
    '{Featured,New Arrival}'::text[]
  ),
  (
    'ax-plain-white-essential', 'White Essential Tee', 'T-Shirt',
    3900, null::integer,
    '100% Supima Cotton', 200, 'Regular Fit',
    'Machine wash cold, do not bleach',
    'Model is 6''1" wearing size M',
    'True to size.',
    'The clean canvas. Our crisp white essential in the same 200GSM supima cotton — a wardrobe anchor.',
    '{New Arrival}'::text[]
  ),
  (
    'ax-premium-navy-tee', 'Premium Navy Tee', 'Polo',
    5900, null::integer,
    '100% Supima Cotton (Combed & Ring-spun)', 200, 'Slim Fit',
    'Hand wash recommended, hang dry',
    'Model is 6''1" wearing size M',
    'Runs slightly slim.',
    'Deep navy with colour-fastness rated to Grade 4-5 ISO standards. Premium construction throughout.',
    '{Featured}'::text[]
  )
) as p(id, name, type_name, price, compare_at, fabric, gsm, fit, care, model_info, fit_note, description, tags);

-- ─── Product Variants ─────────────────────────────────────────────────────────
with v as (
  insert into public.product_variants (product_id, color, hex, images) values
    ('ax-plain-black-tee',        'Black', '#0E0E0E', '{}'),
    ('ax-plain-black-tee',        'White', '#F5F5F0', '{}'),
    ('ax-plain-black-tee',        'Navy',  '#1B2A4A', '{}'),
    ('ax-premium-structured-tee', 'Black', '#0E0E0E', '{}'),
    ('ax-premium-structured-tee', 'Navy',  '#1B2A4A', '{}'),
    ('ax-plain-white-essential',  'White', '#F5F5F0', '{}'),
    ('ax-plain-white-essential',  'Black', '#0E0E0E', '{}'),
    ('ax-premium-navy-tee',       'Navy',  '#1B2A4A', '{}'),
    ('ax-premium-navy-tee',       'Black', '#0E0E0E', '{}')
  returning id, product_id, color
)
insert into public.inventory (variant_id, size, qty)
select v.id, s.size, (random() * 30 + 5)::integer
from v
cross join (values ('S'), ('M'), ('L'), ('XL'), ('XXL')) as s(size);
