import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fmtLKR } from "@/lib/constants";
import StatusPill from "@/components/ui/StatusPill";
import Link from "next/link";
import type { Metadata } from "next";
import type { Order } from "@/types/database.types";

export const metadata: Metadata = { title: "Orders | Admin" };

export default async function AdminOrdersPage() {
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

  const { data: ordersRaw } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (ordersRaw ?? []) as Order[];

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
          Orders
        </h1>
        <p
          className="text-sm mt-1"
          style={{
            color: "var(--color-fg-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {orders.length} total orders
        </p>
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
              {["Order", "Customer", "City / Zone", "Date", "Total", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs tracking-[0.12em] uppercase font-normal"
                    style={{ color: "var(--color-fg-tertiary)" }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id}
                style={{
                  backgroundColor:
                    i % 2 === 0
                      ? "var(--color-forest)"
                      : "var(--color-dark-forest)",
                  borderBottom: "1px solid var(--color-card-border)",
                }}
              >
                <td className="px-5 py-3">
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-gold-400)",
                      fontSize: "13px",
                    }}
                  >
                    {order.order_number}
                  </span>
                </td>
                <td className="px-5 py-3" style={{ color: "var(--color-fg)" }}>
                  <div>
                    {order.first_name} {order.last_name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-fg-tertiary)" }}
                  >
                    {order.email}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div style={{ color: "var(--color-fg)" }}>{order.city}</div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-fg-tertiary)" }}
                  >
                    {order.zone}
                  </div>
                </td>
                <td
                  className="px-5 py-3"
                  style={{
                    color: "var(--color-fg-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                  }}
                >
                  {new Date(order.created_at).toLocaleDateString("en-LK", {
                    timeZone: "Asia/Colombo",
                  })}
                </td>
                <td
                  className="px-5 py-3"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-fg)",
                  }}
                >
                  {fmtLKR(order.total)}
                </td>
                <td className="px-5 py-3">
                  <StatusPill status={order.status} />
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs underline underline-offset-2"
                    style={{ color: "var(--color-gold-400)" }}
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div
            className="py-12 text-center"
            style={{ backgroundColor: "var(--color-dark-forest)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
              No orders yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
