import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ProductWithVariantColors } from "@/types/supabase-helpers";
import ProductsTable from "@/components/admin/ProductsTable";

export const metadata: Metadata = { title: "Products | Admin" };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRow } = await supabase
    .from("staff")
    .select("id")
    .eq("id", user.id)
    .single();
  if (!staffRow) redirect("/admin/login");

  const { data: productsRaw } = await supabase
    .from("products")
    .select(`*, product_types(id, name), product_variants(id, color, hex)`)
    .order("name");

  const products = (productsRaw ?? []) as unknown as ProductWithVariantColors[];

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--color-gold-200)" }}
          >
            Admin Console
          </p>
          <h1
            className="text-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-fg)",
            }}
          >
            Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 rounded-sm text-sm font-medium"
          style={{
            backgroundColor: "var(--color-gold-400)",
            color: "var(--color-void)",
            fontFamily: "var(--font-body)",
          }}
        >
          + New Product
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
