"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fmtLKR } from "@/lib/constants";
import type { Order, OrderLine } from "@/types/database.types";
import type { BankSettings } from "@/lib/settings";
import StatusPill from "@/components/ui/StatusPill";

type FullOrder = Order & { order_lines: OrderLine[] };

interface Props {
  user: { id: string; email: string; fullName: string };
  orders: FullOrder[];
  bankDetails: BankSettings;
}

export default function AccountClient({ user, orders, bankDetails }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/home");
    router.refresh();
  }

  const awaitingPayment = orders.filter((o) => o.status === "Awaiting Payment");

  return (
    <div style={{ backgroundColor: "var(--color-void)", minHeight: "80vh" }}>
      {/* Header */}
      <div className="py-14 border-b" style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--color-gold-200)" }}>Welcome back</p>
            <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}>
              {user.fullName || user.email}
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm px-4 py-2 rounded border"
            style={{ borderColor: "var(--color-card-border)", color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Account info */}
        <div
          className="grid sm:grid-cols-2 gap-4 p-6 rounded-sm"
          style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
        >
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--color-gold-200)" }}>Email</p>
            <p className="text-sm" style={{ color: "var(--color-fg)" }}>{user.email}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--color-gold-200)" }}>Orders</p>
            <p className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>{orders.length}</p>
          </div>
        </div>

        {/* Payment pending banner */}
        {awaitingPayment.length > 0 && (
          <div
            className="p-5 rounded-sm"
            style={{ backgroundColor: "rgba(212,162,76,0.06)", border: "1px solid rgba(212,162,76,0.35)" }}
          >
            <p className="text-xs tracking-[0.18em] uppercase mb-3" style={{ color: "var(--color-gold-200)" }}>
              Payment Pending
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--color-fg-muted)" }}>
              {awaitingPayment.length === 1
                ? `Order ${awaitingPayment[0].order_number} is awaiting payment.`
                : `${awaitingPayment.length} orders are awaiting payment.`}{" "}
              Please transfer to:
            </p>
            <div className="space-y-1.5 mb-4">
              <BankRow label="Bank" value={bankDetails.bank} />
              <BankRow label="Account Name" value={bankDetails.accountName} />
              {bankDetails.accountNumber && <BankRow label="Account No." value={bankDetails.accountNumber} mono />}
              {bankDetails.branch && <BankRow label="Branch" value={bankDetails.branch} />}
            </div>
            <div className="space-y-1">
              {awaitingPayment.map((o) => (
                <p key={o.id} className="text-xs" style={{ color: "var(--color-fg-tertiary)" }}>
                  Reference <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-100)" }}>{o.order_number}</span>
                  {" "}— <span style={{ fontFamily: "var(--font-mono)" }}>{fmtLKR(o.total)}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Order history */}
        <div>
          <h2 className="text-2xl mb-6" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}>
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="py-16 text-center rounded-sm" style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}>
              <p className="text-sm mb-2" style={{ color: "var(--color-fg-muted)" }}>You haven&apos;t placed any orders yet.</p>
              <a href="/shop" className="text-sm underline underline-offset-4" style={{ color: "var(--color-gold-400)" }}>
                Browse the collection
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} bankDetails={bankDetails} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, bankDetails }: { order: FullOrder; bankDetails: BankSettings }) {
  const [expanded, setExpanded] = useState(order.status === "Awaiting Payment");

  const hasBilling = !!order.billing_address;

  const shippingAddr = [
    `${order.first_name} ${order.last_name}`,
    order.address,
    order.city + (order.postal ? ` ${order.postal}` : ""),
  ].join(", ");

  const billingAddr = hasBilling
    ? [
        `${order.billing_first_name ?? ""} ${order.billing_last_name ?? ""}`.trim(),
        order.billing_address,
        order.billing_city + (order.billing_postal ? ` ${order.billing_postal}` : ""),
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-card-border)" }}>
      {/* Order header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex flex-wrap items-center justify-between gap-4 px-6 py-4 text-left"
        style={{ backgroundColor: "var(--color-dark-forest)", borderBottom: expanded ? "1px solid var(--color-card-border)" : "none" }}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium" style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-400)" }}>
            {order.order_number}
          </span>
          <StatusPill status={order.status} />
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>
              {fmtLKR(order.total)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-fg-tertiary)" }}>
              {new Date(order.created_at).toLocaleDateString("en-LK", { timeZone: "Asia/Colombo", year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{ color: "var(--color-fg-tertiary)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ backgroundColor: "var(--color-forest)" }}>
          {/* Payment instructions for pending orders */}
          {order.status === "Awaiting Payment" && (
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--color-card-border)", backgroundColor: "rgba(212,162,76,0.04)" }}>
              <p className="text-xs tracking-[0.15em] uppercase mb-3" style={{ color: "var(--color-gold-200)" }}>
                Payment Required
              </p>
              <p className="text-sm mb-3" style={{ color: "var(--color-fg-muted)" }}>
                Transfer <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>{fmtLKR(order.total)}</span> to:
              </p>
              <div className="space-y-1.5 mb-3">
                <BankRow label="Bank" value={bankDetails.bank} />
                <BankRow label="Account Name" value={bankDetails.accountName} />
                {bankDetails.accountNumber && <BankRow label="Account No." value={bankDetails.accountNumber} mono />}
                {bankDetails.branch && <BankRow label="Branch" value={bankDetails.branch} />}
              </div>
              <p className="text-xs" style={{ color: "var(--color-fg-tertiary)" }}>
                Use{" "}
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-100)" }}>{order.order_number}</span>
                {" "}as the payment reference.
              </p>
            </div>
          )}

          {/* Order items */}
          <div className="px-6 py-4 space-y-3 border-b" style={{ borderColor: "var(--color-card-border)" }}>
            {order.order_lines.map((line) => (
              <div key={line.id} className="flex justify-between text-sm">
                <span style={{ color: "var(--color-fg-muted)" }}>
                  {line.product_name} · {line.color} · {line.size} × {line.qty}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}>
                  {fmtLKR(line.unit_price * line.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Addresses */}
          <div className={`px-6 py-4 ${hasBilling ? "grid sm:grid-cols-2 gap-6" : ""}`}>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase mb-1.5" style={{ color: "var(--color-fg-tertiary)" }}>
                Shipping Address
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                {shippingAddr}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)" }}>
                {order.phone}{order.phone2 ? ` · ${order.phone2}` : ""}
              </p>
            </div>
            {billingAddr && (
              <div>
                <p className="text-xs tracking-[0.15em] uppercase mb-1.5" style={{ color: "var(--color-fg-tertiary)" }}>
                  Billing Address
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                  {billingAddr}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BankRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: "var(--color-fg-tertiary)" }}>{label}</span>
      <span style={{ color: "var(--color-fg)", fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{value}</span>
    </div>
  );
}
