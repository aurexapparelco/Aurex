import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fmtLKR } from "@/lib/constants";
import StatusPill from "@/components/ui/StatusPill";
import type { Metadata } from "next";
import type { OrderRow } from "@/types/supabase-helpers";

export const metadata: Metadata = { title: "Overview | Admin" };

async function getStats() {
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
    .select("id, order_number, status, total, created_at, first_name, last_name, email, city, zone")
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  const { count: customerCount } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  const orders = (ordersRaw ?? []) as OrderRow[];
  const totalRevenue = orders
    .filter((o) => !["Cancelled", "Refunded"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  return {
    orders,
    totalRevenue,
    productCount: productCount ?? 0,
    customerCount: customerCount ?? 0,
  };
}

export default async function OverviewPage() {
  const { orders, totalRevenue, productCount, customerCount } = await getStats();

  const stats = [
    { label: "Total Revenue", value: fmtLKR(totalRevenue), mono: true },
    { label: "Orders (Recent)", value: String(orders.length), mono: true },
    { label: "Products", value: String(productCount), mono: true },
    { label: "Customers", value: String(customerCount), mono: true },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}>
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
          Overview
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, mono }) => (
          <div
            key={label}
            className="p-5 rounded-sm"
            style={{
              backgroundColor: "var(--color-dark-forest)",
              border: "1px solid var(--color-card-border)",
            }}
          >
            <p
              className="text-xs tracking-wide uppercase mb-2"
              style={{ color: "var(--color-fg-tertiary)" }}
            >
              {label}
            </p>
            <p
              className="text-xl font-medium"
              style={{
                color: "var(--color-gold-400)",
                fontFamily: mono ? "var(--font-mono)" : "var(--font-display)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <h2
        className="text-xl mb-5"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          color: "var(--color-fg)",
        }}
      >
        Recent Orders
      </h2>

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
              {["Order", "Customer", "Date", "Total", "Status"].map((h) => (
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
                  <a
                    href={`/admin/orders/${order.id}`}
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-gold-400)",
                      fontSize: "13px",
                    }}
                  >
                    {order.order_number}
                  </a>
                </td>
                <td
                  className="px-5 py-3"
                  style={{ color: "var(--color-fg)" }}
                >
                  {order.first_name} {order.last_name}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
