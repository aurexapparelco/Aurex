import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SIZES } from "@/lib/constants";
import type { Metadata } from "next";
import type { ProductWithVariantsAndInventory } from "@/types/supabase-helpers";

export const metadata: Metadata = { title: "Inventory | Admin" };

export default async function AdminInventoryPage() {
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
    .select(
      `id, name, product_variants(id, color, hex, inventory(variant_id, size, qty))`,
    )
    .order("name");

  const products = (
    productsRaw ?? []
  ) as unknown as ProductWithVariantsAndInventory[];

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}
    >
      <div className="mb-8">
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
          Inventory
        </h1>
      </div>

      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-sm overflow-hidden"
            style={{ border: "1px solid var(--color-card-border)" }}
          >
            <div
              className="px-5 py-3 border-b"
              style={{
                backgroundColor: "var(--color-dark-forest)",
                borderColor: "var(--color-card-border)",
              }}
            >
              <h2
                className="text-base"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  color: "var(--color-fg)",
                }}
              >
                {product.name}
              </h2>
              <p
                className="text-xs"
                style={{
                  color: "var(--color-fg-tertiary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {product.id}
              </p>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--color-forest)",
                    borderBottom: "1px solid var(--color-card-border)",
                  }}
                >
                  <th
                    className="text-left px-5 py-2 text-xs uppercase tracking-wide font-normal"
                    style={{ color: "var(--color-fg-tertiary)" }}
                  >
                    Colour
                  </th>
                  {SIZES.map((s) => (
                    <th
                      key={s}
                      className="px-3 py-2 text-xs uppercase tracking-wide font-normal text-center"
                      style={{ color: "var(--color-fg-tertiary)" }}
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.product_variants.map((variant, vi) => {
                  const invMap: Record<string, number> = {};
                  variant.inventory.forEach((inv) => {
                    invMap[inv.size] = inv.qty;
                  });

                  return (
                    <tr
                      key={variant.id}
                      style={{
                        backgroundColor:
                          vi % 2 === 0
                            ? "var(--color-dark-forest)"
                            : "var(--color-forest)",
                        borderBottom: "1px solid var(--color-card-border)",
                      }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor: variant.hex,
                              borderColor: "rgba(255,255,255,0.15)",
                            }}
                          />
                          <span style={{ color: "var(--color-fg)" }}>
                            {variant.color}
                          </span>
                        </div>
                      </td>
                      {SIZES.map((size) => {
                        const qty = invMap[size] ?? 0;
                        const isLow = qty > 0 && qty <= 5;
                        const isOut = qty === 0;
                        return (
                          <td key={size} className="px-3 py-3 text-center">
                            <span
                              className="text-sm"
                              style={{
                                fontFamily: "var(--font-mono)",
                                color: isOut
                                  ? "var(--color-fg-disabled)"
                                  : isLow
                                    ? "var(--color-gold-400)"
                                    : "var(--color-fg)",
                              }}
                            >
                              {isOut ? "—" : qty}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div
        className="mt-6 flex gap-6 text-xs"
        style={{ color: "var(--color-fg-muted)" }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-gold-400)",
            }}
          >
            5
          </span>
          Low stock (≤ 5)
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-fg-disabled)",
            }}
          >
            —
          </span>
          Out of stock
        </div>
      </div>
    </div>
  );
}
