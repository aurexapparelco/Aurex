import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/storefront/ProductCard";
import ShopFilters from "@/components/storefront/ShopFilters";
import type { Metadata } from "next";
import type { ProductType } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Shop — All Products",
  description: "Browse Auréx's full collection of premium menswear.",
};

interface Props {
  searchParams: Promise<{ type?: string; tag?: string; sort?: string }>;
}

async function getProductTypes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_types")
    .select("id, name, sort_order")
    .order("sort_order");
  return (data ?? []) as ProductType[];
}

async function getProducts(type?: string, tag?: string, sort?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `*, product_types(id, name), product_variants(id, color, hex, images, inventory(variant_id, size, qty))`,
    )
    .eq("listed", true);

  if (type) {
    // Resolve type name → id, then filter
    const { data: typeRow } = (await supabase
      .from("product_types")
      .select("id")
      .eq("name", type)
      .single()) as unknown as { data: { id: string } | null };
    if (typeRow) {
      query = query.eq("type_id", typeRow.id);
    }
  }
  if (tag) {
    query = query.contains("tags", [tag]);
  }
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  const { data } = await query;
  return data ?? [];
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const { type, tag, sort } = params;

  const [products, productTypes] = await Promise.all([
    getProducts(type, tag, sort),
    getProductTypes(),
  ]);

  let heading = "All Products";
  if (type) heading = type;
  if (tag === "New Arrival") heading = "New Arrivals";
  if (tag === "Featured") heading = "Featured";

  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>
      <div
        className="py-14 border-b"
        style={{
          backgroundColor: "var(--color-dark-forest)",
          borderColor: "var(--color-card-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{
              color: "var(--color-gold-200)",
              fontFamily: "var(--font-body)",
            }}
          >
            Auréx
          </p>
          <h1
            className="text-4xl sm:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-fg)",
              letterSpacing: "-0.01em",
            }}
          >
            {heading}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--color-fg-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ShopFilters
          types={productTypes}
          activeType={type}
          activeTag={tag}
          activeSort={sort}
        />

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p
              className="text-lg mb-2"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                color: "var(--color-fg-muted)",
              }}
            >
              No products found
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--color-fg-tertiary)" }}
            >
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {/* @ts-expect-error — Supabase nested type */}
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
