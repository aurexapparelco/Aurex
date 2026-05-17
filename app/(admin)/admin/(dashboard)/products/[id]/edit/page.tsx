import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit ${id} | Admin` };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRow } = await supabase.from("staff").select("id").eq("id", user.id).single();
  if (!staffRow) redirect("/admin/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as unknown as any;
  const [productRes, typesRes] = await Promise.all([
    sb
      .from("products")
      .select(`*, product_variants(id, color, hex, images, inventory(variant_id, size, qty))`)
      .eq("id", id)
      .single(),
    sb
      .from("product_types")
      .select("id, name, sort_order, created_at")
      .order("sort_order"),
  ]);

  if (!productRes.data) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = productRes.data as unknown as any;

  const initialData = {
    id: raw.id,
    name: raw.name,
    type_id: raw.type_id ?? null,
    price: raw.price,
    compare_at: raw.compare_at ?? null,
    fabric: raw.fabric ?? "",
    gsm: raw.gsm ?? 200,
    weight_grams: raw.weight_grams ?? 275,
    fit: raw.fit ?? "",
    care: raw.care ?? "",
    model_info: raw.model_info ?? "",
    fit_note: raw.fit_note ?? "",
    origin: raw.origin ?? "Made in Sri Lanka",
    description: raw.description ?? "",
    tags: raw.tags ?? [],
    product_variants: (raw.product_variants ?? []).map((v: any) => ({
      id: v.id,
      color: v.color,
      hex: v.hex,
      images: v.images ?? [],
      inventory: (v.inventory ?? []).map((i: any) => ({ size: i.size, qty: i.qty })),
    })),
  };

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
          {raw.name}
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)" }}>
          {id}
        </p>
      </div>

      <ProductForm mode="edit" productTypes={typesRes.data ?? []} initialData={initialData} />
    </div>
  );
}
