"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { fmtLKR } from "@/lib/constants";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, count, subtotal, removeFromCart, updateCartQty } = useCart();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 w-full max-w-sm"
        style={{
          backgroundColor: "var(--color-dark-forest)",
          borderLeft: "1px solid var(--color-card-border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "var(--color-card-border)" }}
        >
          <div>
            <h2
              className="text-lg"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
            >
              Your Cart
            </h2>
            {count > 0 && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-mono)" }}
              >
                {count} {count === 1 ? "item" : "items"}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-fg-muted)" }}
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div style={{ color: "var(--color-fg-tertiary)" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                Your cart is empty
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-sm underline underline-offset-4"
                style={{ color: "var(--color-gold-400)" }}
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex gap-3 py-4 border-b"
                  style={{ borderColor: "var(--color-card-border)" }}
                >
                  {/* Image */}
                  <div
                    className="w-16 h-20 rounded flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--color-forest)", border: "1px solid var(--color-card-border)" }}
                  >
                    {item.image && (
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--color-fg)", fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      {item.productName}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-fg-muted)" }}
                    >
                      {item.color} · {item.size}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--color-gold-400)", fontFamily: "var(--font-mono)" }}
                    >
                      {fmtLKR(item.price)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartQty(item.key, item.qty - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded border text-sm transition-colors"
                        style={{
                          borderColor: "var(--color-card-border)",
                          color: "var(--color-fg-muted)",
                          backgroundColor: "var(--color-forest)",
                        }}
                      >
                        −
                      </button>
                      <span
                        className="w-6 text-center text-sm"
                        style={{ color: "var(--color-fg)", fontFamily: "var(--font-mono)" }}
                      >
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.key, item.qty + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded border text-sm transition-colors"
                        style={{
                          borderColor: "var(--color-card-border)",
                          color: "var(--color-fg-muted)",
                          backgroundColor: "var(--color-forest)",
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="ml-auto p-1"
                        style={{ color: "var(--color-fg-tertiary)" }}
                        aria-label="Remove item"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3,6 5,6 21,6" />
                          <path d="M19,6v14a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6m3,0V4a1,1 0,0,1 1-1h4a1,1 0,0,1 1,1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-6 py-5 border-t space-y-4"
            style={{ borderColor: "var(--color-card-border)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                Subtotal
              </span>
              <span
                className="text-base font-medium"
                style={{ color: "var(--color-fg)", fontFamily: "var(--font-mono)" }}
              >
                {fmtLKR(subtotal)}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--color-fg-tertiary)" }}>
              Shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full py-3 text-center text-sm font-medium rounded tracking-wide transition-colors"
              style={{
                backgroundColor: "var(--color-gold-400)",
                color: "var(--color-void)",
                fontFamily: "var(--font-body)",
              }}
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full py-2 text-center text-sm transition-colors"
              style={{ color: "var(--color-fg-muted)" }}
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
