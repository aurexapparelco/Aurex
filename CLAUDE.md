# CLAUDE.md — Auréx Atelier · Next.js + Supabase

## Commands

```bash
# Dev
pnpm dev              # next dev --turbopack
pnpm build            # next build
pnpm lint             # next lint
pnpm typecheck        # tsc --noEmit

# Test
pnpm test             # vitest run
pnpm test:watch       # vitest

# Supabase (local)
pnpm supabase start                  # start local stack (Docker required)
pnpm supabase stop
pnpm supabase db reset               # reset + re-seed local DB
pnpm supabase gen types              # regenerate → types/database.types.ts
pnpm supabase migration new <name>   # create a new migration file
```

## Project layout

Two distinct apps share one Next.js codebase. Do not mix their auth contexts or route groups.

```
app/
  (storefront)/               # Public-facing store — customer auth
    (auth)/
      login/page.tsx
      signup/page.tsx
      callback/route.ts       # PKCE callback
    (protected)/              # Requires customer session
      account/page.tsx
      checkout/page.tsx
    home/page.tsx
    shop/page.tsx
    product/[id]/page.tsx
    cart/page.tsx
    about/page.tsx

  (admin)/                    # Staff-only dashboard — staff auth
    login/page.tsx
    overview/page.tsx
    orders/page.tsx
    orders/[id]/page.tsx
    products/page.tsx
    inventory/page.tsx
    customers/page.tsx
    settings/page.tsx

  api/                        # Route Handlers (webhooks, non-action surfaces only)
  layout.tsx
middleware.ts                 # Project root — NOT inside app/

lib/
  supabase/
    client.ts                 # createBrowserClient  (Client Components)
    server.ts                 # createServerClient   (Server Components, Actions, Route Handlers)
    middleware.ts             # updateSession() helper
  constants.ts                # Shared business constants (zones, thresholds, enums)

supabase/
  migrations/                 # Source of truth for schema — never edit DB directly
  seed.sql
  config.toml

types/
  database.types.ts           # Generated — never edit by hand
```

## Supabase client rules

**Two clients, two contexts — never mix them.**

| Context                                           | File                         | Function                           |
| ------------------------------------------------- | ---------------------------- | ---------------------------------- |
| `'use client'` components                         | `lib/supabase/client.ts`     | `createBrowserClient`              |
| Server Components, Server Actions, Route Handlers | `lib/supabase/server.ts`     | `createServerClient` + `cookies()` |
| `middleware.ts`                                   | `lib/supabase/middleware.ts` | `updateSession()`                  |

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) =>
          c.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  );
}
```

- **Always `getUser()` server-side, never `getSession()`** — `getSession()` does not re-validate the JWT.
- `cookies()` must be called before any Supabase query in Server Actions to opt out of Next.js caching.
- Middleware refreshes tokens on every request. Route-level redirects live in Server Components, not middleware.
- Never import `lib/supabase/server.ts` or `next/headers` from Client Components.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # safe to expose; RLS is the security layer
SUPABASE_SERVICE_ROLE_KEY=              # server-only; NEVER add NEXT_PUBLIC_ prefix
```

## Domain model

### products

| column        | type               | notes                                 |
| ------------- | ------------------ | ------------------------------------- |
| `id`          | `text` PK          | slug format: `ax-plain-tee`           |
| `name`        | `text`             |                                       |
| `design_type` | `text`             | `'Plain'` or `'Premium'` only         |
| `price`       | `integer`          | LKR, no decimals                      |
| `compare_at`  | `integer` nullable | LKR, null if not on sale              |
| `fabric`      | `text`             |                                       |
| `gsm`         | `integer`          |                                       |
| `fit`         | `text`             |                                       |
| `care`        | `text`             |                                       |
| `model_info`  | `text`             |                                       |
| `fit_note`    | `text`             |                                       |
| `origin`      | `text`             | always `'Made in Sri Lanka'`          |
| `description` | `text`             |                                       |
| `tags`        | `text[]`           | values: `'Featured'`, `'New Arrival'` |

### product_variants

| column       | type                 | notes                           |
| ------------ | -------------------- | ------------------------------- |
| `id`         | `uuid` PK            |                                 |
| `product_id` | `text` FK → products |                                 |
| `color`      | `text`               | `'Black'`, `'White'`, `'Navy'`  |
| `hex`        | `text`               | e.g. `'#0E0E0E'`                |
| `images`     | `text[]`             | ordered array, first is primary |

### inventory

| column       | type                         | notes                                |
| ------------ | ---------------------------- | ------------------------------------ |
| `variant_id` | `uuid` FK → product_variants |                                      |
| `size`       | `text`                       | `'S'`, `'M'`, `'L'`, `'XL'`, `'XXL'` |
| `qty`        | `integer`                    |                                      |
| PK           | `(variant_id, size)`         | composite                            |

### orders

| column            | type                            | notes                                         |
| ----------------- | ------------------------------- | --------------------------------------------- |
| `id`              | `uuid` PK                       |                                               |
| `order_number`    | `text` unique                   | format `AX-XXXXXX` (6 digits)                 |
| `user_id`         | `uuid` nullable FK → auth.users | null for guest checkout                       |
| `email`           | `text`                          |                                               |
| `first_name`      | `text`                          |                                               |
| `last_name`       | `text`                          |                                               |
| `phone`           | `text`                          |                                               |
| `address`         | `text`                          |                                               |
| `city`            | `text`                          |                                               |
| `zone`            | `text`                          | `'Colombo'`, `'Suburbs'`, `'Other Districts'` |
| `postal`          | `text`                          |                                               |
| `delivery_note`   | `text`                          |                                               |
| `shipping_method` | `text`                          | `'standard'` or `'express'`                   |
| `shipping_fee`    | `integer`                       | LKR                                           |
| `subtotal`        | `integer`                       | LKR                                           |
| `total`           | `integer`                       | LKR                                           |
| `payment_method`  | `text`                          | always `'Bank Transfer'`                      |
| `status`          | `text`                          | see status flow below                         |
| `created_at`      | `timestamptz`                   |                                               |

### order_lines

| column         | type               | notes                          |
| -------------- | ------------------ | ------------------------------ |
| `id`           | `uuid` PK          |                                |
| `order_id`     | `uuid` FK → orders |                                |
| `product_id`   | `text`             |                                |
| `product_name` | `text`             | snapshot at time of order      |
| `color`        | `text`             |                                |
| `size`         | `text`             |                                |
| `qty`          | `integer`          |                                |
| `unit_price`   | `integer`          | LKR, snapshot at time of order |

### customers (admin view — extends auth.users via trigger)

| column       | type                      | notes |
| ------------ | ------------------------- | ----- |
| `id`         | `uuid` PK = auth.users.id |       |
| `full_name`  | `text`                    |       |
| `phone`      | `text`                    |       |
| `city`       | `text`                    |       |
| `created_at` | `timestamptz`             |       |

### staff

| column | type                      | notes                                     |
| ------ | ------------------------- | ----------------------------------------- |
| `id`   | `uuid` PK = auth.users.id |                                           |
| `role` | `text`                    | `'Owner'`, `'Operations'`, `'Fulfilment'` |

## Business rules

**Order number** — `"AX-"` followed by a random 6-digit number. Generate as: `"AX-" + Math.floor(100000 + Math.random() * 900000)`

**Order status flow** — linear, transitions in this order only:

```
Awaiting Payment → Paid → Packed → Shipped → Delivered
```

Terminal states (no further transitions): `Cancelled`, `Refunded`

**Currency** — LKR only, always integers (no decimals, ever). Canonical format function:

```ts
const fmtLKR = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;
```

**Shipping fees** — export these from `lib/constants.ts`:

```ts
export const SHIPPING_ZONES = {
  Colombo: { fee: 350, days: "1–2" },
  Suburbs: { fee: 550, days: "2–3" },
  "Other Districts": { fee: 750, days: "3–5" },
} as const;

export const EXPRESS_FEE = 1_200;
export const FREE_SHIPPING_THRESHOLD = 15_000;
```

Fee logic: `express` → `1200`. Else `subtotal >= 15000` → `0`. Else zone fee.

**Inventory thresholds** — `qty === 0` is "Sold out". `qty > 0 && qty <= 5` is "Low stock" (triggers restock alert in admin).

**Sizes** — always in this fixed order: `['S', 'M', 'L', 'XL', 'XXL']`

**Design types** — `'Plain'` or `'Premium'`, no other values.

**Cart item key** — composite string: `` `${productId}__${color}__${size}` `` (double underscore separator).
Persisted to `localStorage` at key `aurex_cart`. Cross-component sync via `CustomEvent('aurex_cart_changed')`.

**Auth split:**

- Storefront: customer accounts via `auth.users` — protected pages redirect to `/(storefront)/(auth)/login`
- Admin: staff only — check `staff` table membership in addition to auth session — protected pages redirect to `/(admin)/login`
- A valid customer session does NOT grant admin access. Check both.

**Timezone** — `Asia/Colombo (UTC+05:30)` for all date display and scheduling.

**Payment** — Bank Transfer only. Bank: Commercial Bank of Ceylon · Account name: Auréx Atelier (Pvt) Ltd.

## Design tokens

The full token set lives in `colors_and_type.css`. Map these to `tailwind.config.ts`. **Never hardcode hex values in components** — always reference token names.

### Surfaces (dark-first scale)

```
void         #000000   bg, page root
deep-teal    #02090A   card surface, announcement bar
dark-forest  #061A1C   alternate section backgrounds
forest       #102620   elevated bg, scrolled nav, avatar bg
card-border  #1E2C31   all borders and dividers
divider      #3F3F46   secondary dividers
```

### Gold accent scale

```
gold-100  #F8E7B0   highlights, hover states, italic display text
gold-200  #EFCE7E   soft accent, overlines, icon color
gold-400  #D4A24C   primary accent — logo, primary CTAs, active states
gold-500  #B6862F   deep accent
gold-700  #6E4F18   gradient starts, shadow tones
```

### Text

```
fg            #FFFFFF
fg-muted      #A1A1AA
fg-tertiary   #71717A
fg-disabled   #52525B
```

### Status pill colours

```
Awaiting Payment  fg #F8E7B0   bg rgba(248,231,176,0.10)   border rgba(248,231,176,0.30)
Paid              fg #EFCE7E   bg rgba(212,162,76,0.12)    border rgba(212,162,76,0.40)
Packed            fg #A0E6C9   bg rgba(160,230,201,0.08)   border rgba(160,230,201,0.30)
Shipped           fg #9BC9FF   bg rgba(155,201,255,0.08)   border rgba(155,201,255,0.30)
Delivered         fg #A1A1AA   bg transparent              border #3F3F46
Cancelled         fg #FF8A8A   bg rgba(255,138,138,0.08)   border rgba(255,138,138,0.30)
Refunded          fg #71717A   bg transparent              border #3F3F46
```

### Typography

```
--font-display  "Cormorant Garamond", Georgia, serif   → h1–h4, hero text, product names
--font-body     "Inter", system-ui, sans-serif         → all body copy, buttons, labels, nav
--font-mono     "JetBrains Mono", monospace            → ALL prices, order numbers, SKUs, stock counts
```

**Rules:**

- Display headings: `font-weight: 300`, `letter-spacing: -0.005em` to `-0.02em` (larger = tighter)
- Body: `font-weight: 450` — Inter variable axis, not 400, not 500
- **JetBrains Mono on every price, every order number, every SKU** — no exceptions
- Overlines / eyebrows: `font-size: 11–12px`, `letter-spacing: 0.18–0.22em`, `text-transform: uppercase`, colour `gold-200`

### Shadcn/ui theming

Shadcn's default zinc/slate theme conflicts with this palette. When adding components via `pnpm dlx shadcn@latest add <component>`, remap its CSS variables to the Auréx token set. Never use shadcn default colours as-is.

## Database / RLS

- RLS on every table. Write policies before writing application code. No exceptions.
- User-owned rows always use: `user_id uuid references auth.users(id) on delete cascade`
- Use `auth.uid()` in RLS `using` / `with check` clauses — never rely on app-level filtering as the security control.
- Admin/staff routes: check `staff` table membership via RLS policy, not just session presence.
- Schema lives in `supabase/migrations/` only. Never apply schema changes directly to the production DB.
- Regenerate types after every migration: `pnpm supabase gen types`

```sql
-- RLS template: user-owned table
alter table public.orders enable row level security;
create policy "Customers see own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- RLS template: staff-only table
create policy "Staff can manage all orders"
  on public.orders for all
  using (exists (select 1 from public.staff where id = auth.uid()));
```

## Next.js conventions

- Default to Server Components. Add `'use client'` only for browser APIs, event handlers, or React hooks.
- Data fetching in Server Components or Server Actions — never `useEffect` for data.
- `revalidatePath()` or `revalidateTag()` after mutations, not full-page refreshes.
- Route Handlers (`app/api/`) only for third-party webhooks. Prefer Server Actions for form mutations.
- Storefront and admin have separate auth checks — a logged-in customer is not a staff member.
- The prototype used inline `style={{}}` throughout. When converting to production, map to Tailwind using the design tokens above — never copy hex literals from the prototype.

## Code style

- **pnpm only** — never npm or yarn
- Functional components, named exports; default export only for Next.js page / layout / route files
- `strict: true` — never disable. No `any` — use `unknown` and narrow explicitly
- Tailwind for all styles. Inline `style={{}}` only for values Tailwind cannot express (e.g. dynamic CSS custom properties set at runtime)
