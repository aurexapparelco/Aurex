"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { fmtLKR, generateOrderNumber } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { clearCart } from "@/lib/cart";
import type { BankSettings } from "@/lib/settings";
import type { CourierCity } from "@/lib/courier";

// Sri Lankan phone: 10 digits starting with 0, or +94 followed by 9 digits
function isValidLKPhone(raw: string): boolean {
  const p = raw.replace(/[\s\-()]/g, "");
  return /^(?:\+94|0)\d{9}$/.test(p);
}

interface AddressFields {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postal: string;
}

interface FormState {
  email: string;
  phone: string;
  phone2: string;
  shipping: AddressFields & { deliveryNote: string };
  billingSameAsShipping: boolean;
  billing: AddressFields;
}

interface Props {
  userEmail: string;
  userId: string | null;
  bank: BankSettings;
  freeShippingThreshold: number;
  cities: CourierCity[];
  productWeights: Record<string, number>;
}

interface PlacedOrder {
  orderNumber: string;
  total: number;
  shippingAddress: string;
  billingAddress: string | null;
}

const emptyAddress = (): AddressFields => ({
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postal: "",
});

export default function CheckoutClient({
  userEmail,
  userId,
  bank,
  freeShippingThreshold,
  cities,
  productWeights,
}: Props) {
  const router = useRouter();
  const { items, subtotal } = useCart();

  const [form, setForm] = useState<FormState>({
    email: userEmail,
    phone: "",
    phone2: "",
    shipping: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postal: "",
      deliveryNote: "",
    },
    billingSameAsShipping: true,
    billing: emptyAddress(),
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const selectedCity = cities.find((c) => c.name === form.shipping.city);
  const totalWeightGrams = items.reduce(
    (sum, item) => sum + item.qty * (productWeights[item.productId] ?? 275),
    0
  );
  const additionalKg = Math.ceil(Math.max(0, totalWeightGrams / 1000 - 1));
  const courierFee = selectedCity
    ? selectedCity.charge_first_kg + additionalKg * selectedCity.charge_per_additional_kg
    : 0;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : courierFee;
  const total = subtotal + shippingFee;

  function setShippingField(field: keyof typeof form.shipping, value: string) {
    setForm((f) => ({ ...f, shipping: { ...f.shipping, [field]: value } }));
  }

  function setBilling(field: keyof AddressFields, value: string) {
    setForm((f) => ({ ...f, billing: { ...f.billing, [field]: value } }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!isValidLKPhone(form.phone)) {
      errs.phone =
        "Enter a valid Sri Lankan number (e.g. 0712345678 or +94712345678)";
    }
    if (!isValidLKPhone(form.phone2)) {
      errs.phone2 =
        "Enter a valid Sri Lankan number (e.g. 0712345678 or +94712345678)";
    }
    if (
      form.phone &&
      form.phone2 &&
      form.phone.replace(/[\s\-()]/g, "") ===
        form.phone2.replace(/[\s\-()]/g, "")
    ) {
      errs.phone2 = "Second number must be different from the first";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setLoading(true);
    setError("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createClient() as unknown as any;
    const num = generateOrderNumber();
    const hasBilling =
      !form.billingSameAsShipping && form.billing.address.trim();

    const { data: order, error: orderErr } = await sb
      .from("orders")
      .insert({
        order_number: num,
        user_id: userId,
        email: form.email,
        first_name: form.shipping.firstName,
        last_name: form.shipping.lastName,
        phone: form.phone.replace(/[\s\-()]/g, ""),
        phone2: form.phone2.replace(/[\s\-()]/g, ""),
        address: form.shipping.address,
        city: form.shipping.city,
        postal: form.shipping.postal,
        delivery_note: form.shipping.deliveryNote || null,
        shipping_method: "standard",
        shipping_fee: shippingFee,
        subtotal,
        total,
        payment_method: "Bank Transfer",
        status: "Awaiting Payment",
        billing_first_name: hasBilling ? form.billing.firstName : null,
        billing_last_name: hasBilling ? form.billing.lastName : null,
        billing_address: hasBilling ? form.billing.address : null,
        billing_city: hasBilling ? form.billing.city : null,
        billing_postal: hasBilling ? form.billing.postal : null,
      })
      .select()
      .single();

    if (orderErr || !order) {
      setError("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    await sb.from("order_lines").insert(
      items.map(
        (item: {
          productId: string;
          productName: string;
          color: string;
          size: string;
          qty: number;
          price: number;
        }) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          color: item.color,
          size: item.size,
          qty: item.qty,
          unit_price: item.price,
        }),
      ),
    );

    clearCart();
    setPlacedOrder({
      orderNumber: num,
      total,
      shippingAddress: `${form.shipping.firstName} ${form.shipping.lastName}, ${form.shipping.address}, ${form.shipping.city}${form.shipping.postal ? " " + form.shipping.postal : ""}`,
      billingAddress: hasBilling
        ? `${form.billing.firstName} ${form.billing.lastName}, ${form.billing.address}, ${form.billing.city}${form.billing.postal ? " " + form.billing.postal : ""}`
        : null,
    });
    setLoading(false);
  }

  // ─── Post-order screen ──────────────────────────────────────────────────────
  if (placedOrder) {
    return (
      <div
        className="min-h-[80vh] flex items-center justify-center px-4 py-16"
        style={{ backgroundColor: "var(--color-void)" }}
      >
        <div className="w-full max-w-lg space-y-5">
          <div
            className="p-8 rounded-sm text-center"
            style={{
              backgroundColor: "var(--color-dark-forest)",
              border: "1px solid var(--color-card-border)",
            }}
          >
            <div
              className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: "rgba(212,162,76,0.12)",
                border: "1px solid rgba(212,162,76,0.3)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold-400)"
                strokeWidth="1.5"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2
              className="text-3xl mb-1"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                color: "var(--color-fg)",
              }}
            >
              Order Placed
            </h2>
            <p
              className="text-sm mb-5"
              style={{ color: "var(--color-fg-muted)" }}
            >
              Thank you! Your order has been received.
            </p>
            <div
              className="py-3 px-4 rounded"
              style={{
                backgroundColor: "var(--color-forest)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <p
                className="text-xs tracking-[0.18em] uppercase mb-1"
                style={{ color: "var(--color-gold-200)" }}
              >
                Order Number
              </p>
              <p
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-gold-400)",
                }}
              >
                {placedOrder.orderNumber}
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-sm"
            style={{
              backgroundColor: "var(--color-dark-forest)",
              border: "1px solid rgba(212,162,76,0.3)",
            }}
          >
            <p
              className="text-xs tracking-[0.18em] uppercase mb-4"
              style={{ color: "var(--color-gold-200)" }}
            >
              Payment Instructions
            </p>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-fg-muted)" }}
            >
              Please transfer{" "}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-fg)",
                }}
              >
                {fmtLKR(placedOrder.total)}
              </span>{" "}
              to the following account within 24 hours to confirm your order:
            </p>
            <div className="space-y-2 mb-4">
              <Row label="Bank" value={bank.bank} />
              <Row label="Account Name" value={bank.accountName} />
              {bank.accountNumber && (
                <Row label="Account No." value={bank.accountNumber} mono />
              )}
              {bank.branch && <Row label="Branch" value={bank.branch} />}
            </div>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded"
              style={{
                backgroundColor: "rgba(248,231,176,0.06)",
                border: "1px solid rgba(248,231,176,0.2)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold-100)"
                strokeWidth="1.5"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs" style={{ color: "var(--color-gold-100)" }}>
                Use{" "}
                <span style={{ fontFamily: "var(--font-mono)" }}>
                  {placedOrder.orderNumber}
                </span>{" "}
                as the payment reference so we can identify your transfer.
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-sm space-y-4"
            style={{
              backgroundColor: "var(--color-dark-forest)",
              border: "1px solid var(--color-card-border)",
            }}
          >
            <div>
              <p
                className="text-xs tracking-[0.15em] uppercase mb-1"
                style={{ color: "var(--color-fg-tertiary)" }}
              >
                Shipping to
              </p>
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                {placedOrder.shippingAddress}
              </p>
            </div>
            {placedOrder.billingAddress && (
              <div
                className="border-t pt-4"
                style={{ borderColor: "var(--color-card-border)" }}
              >
                <p
                  className="text-xs tracking-[0.15em] uppercase mb-1"
                  style={{ color: "var(--color-fg-tertiary)" }}
                >
                  Billing address
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {placedOrder.billingAddress}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/account")}
            className="w-full py-3.5 rounded-sm text-sm font-medium"
            style={{
              backgroundColor: "var(--color-gold-400)",
              color: "var(--color-void)",
              fontFamily: "var(--font-body)",
            }}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        className="min-h-[80vh] flex items-center justify-center"
        style={{ backgroundColor: "var(--color-void)" }}
      >
        <div className="text-center">
          <p
            className="text-lg mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-fg-muted)",
            }}
          >
            Your cart is empty
          </p>
          <a href="/shop" style={{ color: "var(--color-gold-400)", fontSize: "14px" }}>
            Continue shopping →
          </a>
        </div>
      </div>
    );
  }

  // ─── Checkout form ──────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--color-forest)",
    border: "1px solid var(--color-card-border)",
    color: "var(--color-fg)",
    fontFamily: "var(--font-body)",
    outline: "none",
    width: "100%",
    padding: "12px 16px",
    borderRadius: "2px",
    fontSize: "14px",
  };

  const errStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#ff8a8a",
    marginTop: "4px",
  };

  return (
    <div style={{ backgroundColor: "var(--color-void)", minHeight: "80vh" }}>
      <div
        className="py-14 border-b"
        style={{
          backgroundColor: "var(--color-dark-forest)",
          borderColor: "var(--color-card-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--color-gold-200)" }}
          >
            Auréx Atelier
          </p>
          <h1
            className="text-4xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-fg)",
            }}
          >
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">

              {/* ── Contact ────────────────────────────────────────────────── */}
              <section>
                <SectionHeading>Contact</SectionHeading>
                <div className="space-y-3">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      readOnly={!!userEmail}
                      style={{ ...inputStyle, opacity: userEmail ? 0.7 : 1 }}
                    />
                    {userEmail && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--color-fg-tertiary)",
                          marginTop: "4px",
                        }}
                      >
                        Using your account email
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Primary phone (e.g. 0712345678)"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      style={{
                        ...inputStyle,
                        borderColor: fieldErrors.phone
                          ? "rgba(255,138,138,0.6)"
                          : "var(--color-card-border)",
                      }}
                    />
                    {fieldErrors.phone && (
                      <p style={errStyle}>{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Alternative phone (must be different)"
                      value={form.phone2}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone2: e.target.value }))
                      }
                      style={{
                        ...inputStyle,
                        borderColor: fieldErrors.phone2
                          ? "rgba(255,138,138,0.6)"
                          : "var(--color-card-border)",
                      }}
                    />
                    {fieldErrors.phone2 && (
                      <p style={errStyle}>{fieldErrors.phone2}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Delivery Address ───────────────────────────────────────── */}
              <section>
                <SectionHeading>Delivery Address</SectionHeading>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="First name"
                      value={form.shipping.firstName}
                      onChange={(e) =>
                        setShippingField("firstName", e.target.value)
                      }
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Last name"
                      value={form.shipping.lastName}
                      onChange={(e) =>
                        setShippingField("lastName", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Street address"
                    value={form.shipping.address}
                    onChange={(e) =>
                      setShippingField("address", e.target.value)
                    }
                    style={inputStyle}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      required
                      value={form.shipping.city}
                      onChange={(e) => setShippingField("city", e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      <option value="" style={{ backgroundColor: "var(--color-dark-forest)" }}>
                        Select city…
                      </option>
                      {cities.map((c) => (
                        <option
                          key={c.id}
                          value={c.name}
                          style={{ backgroundColor: "var(--color-dark-forest)" }}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Postal code"
                      value={form.shipping.postal}
                      onChange={(e) =>
                        setShippingField("postal", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <textarea
                    placeholder="Delivery notes (optional)"
                    value={form.shipping.deliveryNote}
                    onChange={(e) =>
                      setShippingField("deliveryNote", e.target.value)
                    }
                    rows={2}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>
              </section>

              {/* ── Billing Address ─────────────────────────────────────────── */}
              <section>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={!form.billingSameAsShipping}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        billingSameAsShipping: !e.target.checked,
                      }))
                    }
                    className="accent-gold-400 w-4 h-4"
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    Use a different billing address
                  </span>
                </label>

                {!form.billingSameAsShipping && (
                  <div className="space-y-3 pl-7">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="First name"
                        value={form.billing.firstName}
                        onChange={(e) => setBilling("firstName", e.target.value)}
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Last name"
                        value={form.billing.lastName}
                        onChange={(e) => setBilling("lastName", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Billing address"
                      value={form.billing.address}
                      onChange={(e) => setBilling("address", e.target.value)}
                      style={inputStyle}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={form.billing.city}
                        onChange={(e) => setBilling("city", e.target.value)}
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        placeholder="Postal code"
                        value={form.billing.postal}
                        onChange={(e) => setBilling("postal", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* ── Payment ─────────────────────────────────────────────────── */}
              <section>
                <SectionHeading>Payment</SectionHeading>
                <div
                  className="p-5 rounded-sm"
                  style={{
                    backgroundColor: "var(--color-dark-forest)",
                    border: "1px solid var(--color-card-border)",
                  }}
                >
                  <p
                    className="text-xs tracking-widest uppercase mb-3"
                    style={{ color: "var(--color-gold-200)" }}
                  >
                    Bank Transfer Only
                  </p>
                  <p
                    className="text-sm mb-1"
                    style={{ color: "var(--color-fg)" }}
                  >
                    {bank.bank}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {bank.accountName}
                  </p>
                  <p
                    className="text-xs mt-3"
                    style={{ color: "var(--color-fg-tertiary)" }}
                  >
                    Full transfer instructions will be shown after placing your
                    order.
                  </p>
                </div>
              </section>
            </div>

            {/* ── Order Summary ──────────────────────────────────────────────── */}
            <div>
              <div
                className="rounded-sm p-6 sticky top-24"
                style={{
                  backgroundColor: "var(--color-dark-forest)",
                  border: "1px solid var(--color-card-border)",
                }}
              >
                <h2
                  className="text-lg mb-5"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    color: "var(--color-fg)",
                  }}
                >
                  Order Summary
                </h2>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm">
                      <span style={{ color: "var(--color-fg-muted)" }}>
                        {item.productName} × {item.qty}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-fg)",
                        }}
                      >
                        {fmtLKR(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="space-y-2 py-4 border-t border-b"
                  style={{ borderColor: "var(--color-card-border)" }}
                >
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-fg-muted)" }}>
                      Subtotal
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-fg)",
                      }}
                    >
                      {fmtLKR(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-fg-muted)" }}>
                      Shipping
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        color:
                          shippingFee === 0 ? "#a0e6c9" : "var(--color-fg)",
                      }}
                    >
                      {shippingFee === 0 ? "Free" : fmtLKR(shippingFee)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-4">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-fg)" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-base"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-gold-400)",
                    }}
                  >
                    {fmtLKR(total)}
                  </span>
                </div>

                {error && (
                  <p
                    className="text-sm p-3 rounded mb-4"
                    style={{
                      backgroundColor: "rgba(255,138,138,0.08)",
                      border: "1px solid rgba(255,138,138,0.3)",
                      color: "#ff8a8a",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded text-sm font-medium tracking-wide"
                  style={{
                    backgroundColor: "var(--color-gold-400)",
                    color: "var(--color-void)",
                    fontFamily: "var(--font-body)",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Placing Order…" : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Small helpers ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-lg mb-5"
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 300,
        color: "var(--color-fg)",
      }}
    >
      {children}
    </h2>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: "var(--color-fg-tertiary)" }}>{label}</span>
      <span
        style={{
          color: "var(--color-fg)",
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
