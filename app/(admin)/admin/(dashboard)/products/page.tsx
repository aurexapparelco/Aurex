import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fmtLKR } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";
import type { ProductWithVariantColors } from "@/types/supabase-helpers";

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

      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid var(--color-card-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                backgroundColor: "var(--color-dark-forest)",
                borderBottom: "1px solid var(--color-card-border)",
              }}
            >
              {["Name", "Type", "Price", "Variants", "Tags", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs tracking-[0.12em] uppercase font-normal"
                  style={{ color: "var(--color-fg-tertiary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  backgroundColor:
                    i % 2 === 0
                      ? "var(--color-forest)"
                      : "var(--color-dark-forest)",
                  borderBottom: "1px solid var(--color-card-border)",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  opacity: (p as any).listed === false ? 0.55 : 1,
                }}
              >
                <td className="px-5 py-3">
                  <a
                    href={`/product/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                    style={{
                      color: "var(--color-fg)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 400,
                    }}
                  >
                    {p.name}
                  </a>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--color-fg-tertiary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {p.id}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(212,162,76,0.08)",
                      color: "var(--color-gold-200)",
                      border: "1px solid rgba(212,162,76,0.2)",
                    }}
                  >
                    {p.product_types?.name ?? "—"}
                  </span>
                </td>
                <td
                  className="px-5 py-3"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-fg)",
                  }}
                >
                  {fmtLKR(p.price)}
                  {p.compare_at && (
                    <span
                      className="text-xs ml-2 line-through"
                      style={{ color: "var(--color-fg-tertiary)" }}
                    >
                      {fmtLKR(p.compare_at)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    {p.product_variants.map((v) => (
                      <div
                        key={v.id}
                        title={v.color}
                        className="w-4 h-4 rounded-full border"
                        style={{
                          backgroundColor: v.hex,
                          borderColor: "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: "rgba(212,162,76,0.08)",
                          color: "var(--color-gold-200)",
                          border: "1px solid rgba(212,162,76,0.2)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(p as any).listed === false ? (
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(255,138,138,0.08)",
                        color: "#ff8a8a",
                        border: "1px solid rgba(255,138,138,0.25)",
                      }}
                    >
                      Unlisted
                    </span>
                  ) : (
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(160,230,201,0.06)",
                        color: "#A0E6C9",
                        border: "1px solid rgba(160,230,201,0.2)",
                      }}
                    >
                      Listed
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-xs underline underline-offset-2"
                    style={{ color: "var(--color-gold-200)" }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div
            className="py-12 text-center"
            style={{ backgroundColor: "var(--color-dark-forest)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
              No products yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
