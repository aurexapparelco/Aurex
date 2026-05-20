"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { fmtLKR } from "@/lib/constants";
import type { ProductWithVariantColors } from "@/types/supabase-helpers";

interface Props {
  products: ProductWithVariantColors[];
}

export default function ProductsTable({ products: initial }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    setDeleting(id);
    setError("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createClient() as unknown as any;

    // Delete variants (cascades to inventory)
    const { error: varErr } = await sb.from("product_variants").delete().eq("product_id", id);
    if (varErr) { setError(varErr.message); setDeleting(null); return; }

    const { error: prodErr } = await sb.from("products").delete().eq("id", id);
    if (prodErr) { setError(prodErr.message); setDeleting(null); return; }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setConfirming(null);
    setDeleting(null);
    router.refresh();
  }

  return (
    <div>
      {error && (
        <p className="mb-4 text-sm px-4 py-3 rounded-sm" style={{ backgroundColor: "rgba(255,138,138,0.08)", border: "1px solid rgba(255,138,138,0.3)", color: "#ff8a8a" }}>
          {error}
        </p>
      )}

      <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-card-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--color-dark-forest)", borderBottom: "1px solid var(--color-card-border)" }}>
              {["Name", "Type", "Price", "Variants", "Tags", "Status", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs tracking-[0.12em] uppercase font-normal" style={{ color: "var(--color-fg-tertiary)" }}>
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
                  backgroundColor: i % 2 === 0 ? "var(--color-forest)" : "var(--color-dark-forest)",
                  borderBottom: "1px solid var(--color-card-border)",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  opacity: deleting === p.id ? 0.5 : (p as any).listed === false ? 0.55 : 1,
                }}
              >
                <td className="px-5 py-3">
                  <a
                    href={`/product/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                    style={{ color: "var(--color-fg)", fontFamily: "var(--font-display)", fontWeight: 400 }}
                  >
                    {p.name}
                  </a>
                  <p className="text-xs" style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)" }}>
                    {p.id}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: "rgba(212,162,76,0.08)", color: "var(--color-gold-200)", border: "1px solid rgba(212,162,76,0.2)" }}
                  >
                    {p.product_types?.name ?? "—"}
                  </span>
                </td>
                <td className="px-5 py-3" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>
                  {fmtLKR(p.price)}
                  {p.compare_at && (
                    <span className="text-xs ml-2 line-through" style={{ color: "var(--color-fg-tertiary)" }}>
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
                        style={{ backgroundColor: v.hex, borderColor: "rgba(255,255,255,0.15)" }}
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
                        style={{ backgroundColor: "rgba(212,162,76,0.08)", color: "var(--color-gold-200)", border: "1px solid rgba(212,162,76,0.2)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(p as any).listed === false ? (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(255,138,138,0.08)", color: "#ff8a8a", border: "1px solid rgba(255,138,138,0.25)" }}>
                      Unlisted
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(160,230,201,0.06)", color: "#A0E6C9", border: "1px solid rgba(160,230,201,0.2)" }}>
                      Listed
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-4 justify-end">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs underline underline-offset-2"
                      style={{ color: "var(--color-gold-200)" }}
                    >
                      Edit
                    </Link>
                    {confirming === p.id ? (
                      <span className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="text-xs font-medium"
                          style={{ color: "#ff8a8a" }}
                        >
                          {deleting === p.id ? "Deleting…" : "Confirm delete"}
                        </button>
                        <button
                          onClick={() => setConfirming(null)}
                          className="text-xs"
                          style={{ color: "var(--color-fg-tertiary)" }}
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => { setConfirming(p.id); setError(""); }}
                        className="text-xs underline underline-offset-2"
                        style={{ color: "var(--color-fg-tertiary)" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-12 text-center" style={{ backgroundColor: "var(--color-dark-forest)" }}>
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>No products yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
