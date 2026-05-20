"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { fmtLKR } from "@/lib/constants";
import StatusPill from "@/components/ui/StatusPill";
import type { Order } from "@/types/database.types";

interface Props {
  orders: Order[];
}

export default function OrdersTable({ orders: initial }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    setDeleting(id);
    setError("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createClient() as unknown as any;
    const { error: linesErr } = await sb.from("order_lines").delete().eq("order_id", id);
    if (linesErr) { setError(linesErr.message); setDeleting(null); return; }

    const { error: orderErr } = await sb.from("orders").delete().eq("id", id);
    if (orderErr) { setError(orderErr.message); setDeleting(null); return; }

    setOrders((prev) => prev.filter((o) => o.id !== id));
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
              {["Order", "Customer", "City", "Date", "Total", "Status", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs tracking-[0.12em] uppercase font-normal" style={{ color: "var(--color-fg-tertiary)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id}
                style={{
                  backgroundColor: i % 2 === 0 ? "var(--color-forest)" : "var(--color-dark-forest)",
                  borderBottom: "1px solid var(--color-card-border)",
                  opacity: deleting === order.id ? 0.5 : 1,
                }}
              >
                <td className="px-5 py-3">
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-400)", fontSize: "13px" }}>
                    {order.order_number}
                  </span>
                </td>
                <td className="px-5 py-3" style={{ color: "var(--color-fg)" }}>
                  <div>{order.first_name} {order.last_name}</div>
                  <div className="text-xs" style={{ color: "var(--color-fg-tertiary)" }}>{order.email}</div>
                </td>
                <td className="px-5 py-3" style={{ color: "var(--color-fg)" }}>{order.city}</td>
                <td className="px-5 py-3" style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                  {new Date(order.created_at).toLocaleDateString("en-LK", { timeZone: "Asia/Colombo" })}
                </td>
                <td className="px-5 py-3" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>
                  {fmtLKR(order.total)}
                </td>
                <td className="px-5 py-3">
                  <StatusPill status={order.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-4 justify-end">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs underline underline-offset-2"
                      style={{ color: "var(--color-gold-400)" }}
                    >
                      View →
                    </Link>
                    {confirming === order.id ? (
                      <span className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={deleting === order.id}
                          className="text-xs font-medium"
                          style={{ color: "#ff8a8a" }}
                        >
                          {deleting === order.id ? "Deleting…" : "Confirm delete"}
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
                        onClick={() => { setConfirming(order.id); setError(""); }}
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

        {orders.length === 0 && (
          <div className="py-12 text-center" style={{ backgroundColor: "var(--color-dark-forest)" }}>
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
