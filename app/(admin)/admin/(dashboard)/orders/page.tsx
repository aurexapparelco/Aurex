import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Order } from "@/types/database.types";
import OrdersTable from "@/components/admin/OrdersTable";

export const metadata: Metadata = { title: "Orders | Admin" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRow } = await supabase.from("staff").select("id").eq("id", user.id).single();
  if (!staffRow) redirect("/admin/login");

  const { data: ordersRaw } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (ordersRaw ?? []) as Order[];

  return (
    <div className="p-8" style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-gold-200)" }}>
          Admin Console
        </p>
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}>
          Orders
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-mono)" }}>
          {orders.length} total orders
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
