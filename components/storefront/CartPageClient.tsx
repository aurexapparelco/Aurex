"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { fmtLKR } from "@/lib/constants";

export default function CartPageClient() {
  const { items, subtotal, removeFromCart, updateCartQty } = useCart();

  return (
    <div style={{ backgroundColor: "var(--color-void)", minHeight: "80vh" }}>
      {/* Header */}
      <div
        className="py-14 border-b"
        style={{
          backgroundColor: "var(--color-dark-forest)",
          borderColor: "var(--color-card-border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--color-gold-200)" }}
          >
            Auréx
          </p>
          <h1
            className="text-4xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-fg)",
            }}
          >
            Shopping Cart
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <div
              className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--color-dark-forest)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                style={{ color: "var(--color-fg-tertiary)" }}
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h2
              className="text-2xl mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                color: "var(--color-fg)",
              }}
            >
              Your cart is empty
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--color-fg-muted)" }}
            >
              Discover our collection of premium menswear.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm font-medium tracking-wide"
              style={{
                backgroundColor: "var(--color-gold-400)",
                color: "var(--color-void)",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b text-xs tracking-[0.12em] uppercase text-left"
                    style={{
                      borderColor: "var(--color-card-border)",
                      color: "var(--color-fg-tertiary)",
                    }}
                  >
                    <th className="pb-4 font-normal">Product</th>
                    <th className="pb-4 font-normal text-center">Qty</th>
                    <th className="pb-4 font-normal text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.key}
                      className="border-b"
                      style={{ borderColor: "var(--color-card-border)" }}
                    >
                      <td className="py-6">
                        <div className="flex gap-4">
                          <div
                            className="w-16 h-20 flex-shrink-0 rounded overflow-hidden"
                            style={{
                              backgroundColor: "var(--color-forest)",
                              border: "1px solid var(--color-card-border)",
                            }}
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium mb-1"
                              style={{
                                color: "var(--color-fg)",
                                fontFamily: "var(--font-display)",
                                fontWeight: 400,
                              }}
                            >
                              {item.productName}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "var(--color-fg-muted)" }}
                            >
                              {item.color} · {item.size}
                            </p>
                            <p
                              className="text-xs mt-1"
                              style={{
                                color: "var(--color-fg-tertiary)",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              {fmtLKR(item.price)} each
                            </p>
                            <button
                              onClick={() => removeFromCart(item.key)}
                              className="text-xs mt-2 underline underline-offset-2"
                              style={{ color: "var(--color-fg-tertiary)" }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              updateCartQty(item.key, item.qty - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded border"
                            style={{
                              borderColor: "var(--color-card-border)",
                              color: "var(--color-fg-muted)",
                            }}
                          >
                            −
                          </button>
                          <span
                            className="w-8 text-center text-sm"
                            style={{
                              fontFamily: "var(--font-mono)",
                              color: "var(--color-fg)",
                            }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQty(item.key, item.qty + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded border"
                            style={{
                              borderColor: "var(--color-card-border)",
                              color: "var(--color-fg-muted)",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-6 text-right">
                        <span
                          className="text-sm"
                          style={{
                            color: "var(--color-gold-400)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {fmtLKR(item.price * item.qty)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order summary */}
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
                        color: "var(--color-fg-tertiary)",
                        fontSize: "12px",
                      }}
                    >
                      {subtotal >= 15000 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                </div>

                <div
                  className="flex justify-between py-4 border-t mb-5"
                  style={{ borderColor: "var(--color-card-border)" }}
                >
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
                    {fmtLKR(subtotal)}
                  </span>
                </div>

                {subtotal < 15000 && (
                  <p
                    className="text-xs mb-4 p-2.5 rounded text-center"
                    style={{
                      backgroundColor: "rgba(212,162,76,0.08)",
                      border: "1px solid rgba(212,162,76,0.2)",
                      color: "var(--color-gold-200)",
                    }}
                  >
                    Add {fmtLKR(15000 - subtotal)} more for free shipping
                  </p>
                )}

                <Link
                  href="/checkout"
                  className="block w-full py-3.5 text-center text-sm font-medium rounded tracking-wide"
                  style={{
                    backgroundColor: "var(--color-gold-400)",
                    color: "var(--color-void)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block w-full py-2.5 text-center text-xs mt-3"
                  style={{ color: "var(--color-fg-tertiary)" }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
