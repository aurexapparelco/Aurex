import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New Product | Admin" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRow } = await supabase.from("staff").select("id").eq("id", user.id).single();
  if (!staffRow) redirect("/admin/login");

  const { data: productTypes } = await supabase
    .from("product_types")
    .select("id, name, sort_order, created_at")
    .order("sort_order");

  return (
    <div className="p-8" style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-gold-200)" }}>
          Admin Console · Products
        </p>
        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
        >
          New Product
        </h1>
      </div>

      <ProductForm mode="new" productTypes={productTypes ?? []} />
    </div>
  );
}
