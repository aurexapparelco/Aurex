import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { fmtLKR } from "@/lib/constants";
import StatusPill from "@/components/ui/StatusPill";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import type { Metadata } from "next";
import type { OrderWithLines } from "@/types/supabase-helpers";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Order Detail | Admin" };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRow } = await supabase.from("staff").select("id").eq("id", user.id).single();
  if (!staffRow) redirect("/admin/login");

  const { data: orderRaw } = await supabase
    .from("orders")
    .select(`*, order_lines(*)`)
    .eq("id", id)
    .single();

  if (!orderRaw) notFound();

  const order = orderRaw as unknown as OrderWithLines;
  const hasBilling = !!order.billing_address;

  return (
    <div className="p-8" style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}>

      {/* Back */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs mb-6"
        style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15,18 9,12 15,6" />
        </svg>
        All Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-gold-200)" }}>
            Order Detail
          </p>
          <div className="flex items-center gap-4 mb-1">
            <h1
              className="text-3xl"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 400, color: "var(--color-gold-400)" }}
            >
              {order.order_number}
            </h1>
            <StatusPill status={order.status} />
          </div>
          <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
            {new Date(order.created_at).toLocaleString("en-LK", {
              timeZone: "Asia/Colombo",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left: items + totals ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Items */}
          <Card label="Items">
            <div className="divide-y" style={{ borderColor: "var(--color-card-border)" }}>
              {order.order_lines.map((line) => (
                <div key={line.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-fg)" }}>
                      {line.product_name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-mono)" }}>
                      {line.color} · {line.size} × {line.qty}
                    </p>
                  </div>
                  <span className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>
                    {fmtLKR(line.unit_price * line.qty)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Totals */}
          <div
            className="rounded-sm px-5 py-4 space-y-2"
            style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
          >
            <DetailRow label="Subtotal" value={fmtLKR(order.subtotal)} mono />
            <DetailRow
              label={`Shipping — ${order.shipping_method === "express" ? "Express" : "Standard"}`}
              value={order.shipping_fee === 0 ? "Free" : fmtLKR(order.shipping_fee)}
              mono
            />
            <div className="flex justify-between text-sm pt-2 border-t font-medium" style={{ borderColor: "var(--color-card-border)" }}>
              <span style={{ color: "var(--color-fg)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-400)" }}>
                {fmtLKR(order.total)}
              </span>
            </div>
          </div>

          {/* Delivery note */}
          {order.delivery_note && (
            <Card label="Delivery Note">
              <p className="px-5 py-4 text-sm" style={{ color: "var(--color-fg-muted)" }}>
                {order.delivery_note}
              </p>
            </Card>
          )}
        </div>

        {/* ── Right: customer + addresses + payment ──────────────────────── */}
        <div className="space-y-5">

          {/* Contact */}
          <Card label="Contact">
            <div className="px-5 py-4 space-y-2">
              <DetailRow label="Name" value={`${order.first_name} ${order.last_name}`} />
              <DetailRow label="Email" value={order.email} />
              <DetailRow label="Phone 1" value={order.phone} mono />
              {order.phone2 && <DetailRow label="Phone 2" value={order.phone2} mono />}
            </div>
          </Card>

          {/* Shipping address */}
          <Card label="Shipping Address">
            <div className="px-5 py-4 space-y-2">
              <DetailRow label="Address" value={order.address} />
              <DetailRow label="City" value={order.city} />
              {order.postal && <DetailRow label="Postal" value={order.postal} mono />}
            </div>
          </Card>

          {/* Billing address — only when different */}
          {hasBilling && (
            <Card label="Billing Address">
              <div className="px-5 py-4 space-y-2">
                {(order.billing_first_name || order.billing_last_name) && (
                  <DetailRow
                    label="Name"
                    value={`${order.billing_first_name ?? ""} ${order.billing_last_name ?? ""}`.trim()}
                  />
                )}
                <DetailRow label="Address" value={order.billing_address!} />
                {order.billing_city && <DetailRow label="City" value={order.billing_city} />}
                {order.billing_postal && <DetailRow label="Postal" value={order.billing_postal} mono />}
              </div>
            </Card>
          )}

          {/* Payment */}
          <Card label="Payment">
            <div className="px-5 py-4 space-y-2">
              <DetailRow label="Method" value={order.payment_method} />
              <DetailRow label="Status" value={order.status} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-card-border)" }}>
      <div
        className="px-5 py-2.5 border-b"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <p className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-gold-200)" }}>
          {label}
        </p>
      </div>
      <div style={{ backgroundColor: "var(--color-forest)" }}>{children}</div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="shrink-0" style={{ color: "var(--color-fg-tertiary)" }}>{label}</span>
      <span
        className="text-right break-all"
        style={{ color: "var(--color-fg)", fontFamily: mono ? "var(--font-mono)" : "var(--font-body)" }}
      >
        {value}
      </span>
    </div>
  );
}
