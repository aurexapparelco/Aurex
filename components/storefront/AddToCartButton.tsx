"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { SIZES, fmtLKR } from "@/lib/constants";
import type { Size } from "@/lib/constants";

interface VariantInfo {
  id: string;
  color: string;
  hex: string;
  images: string[];
  inventory: { size: string; qty: number }[];
}

interface Props {
  product: { id: string; name: string; price: number };
  variants: VariantInfo[];
}

export default function AddToCartButton({ product, variants }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<VariantInfo>(variants[0]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inventory = selectedVariant?.inventory ?? [];
  const stockFor = (size: string) =>
    inventory.find((i) => i.size === size)?.qty ?? 0;

  function handleAdd() {
    if (!selectedSize) return;
    addToCart({
      productId: product.id,
      productName: product.name,
      color: selectedVariant.color,
      colorHex: selectedVariant.hex,
      size: selectedSize,
      price: product.price,
      image: selectedVariant.images?.[0] ?? "",
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Color selector */}
      {variants.length > 1 && (
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-3"
            style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
          >
            Colour — <span style={{ color: "var(--color-fg)" }}>{selectedVariant?.color}</span>
          </p>
          <div className="flex gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariant(v);
                  setSelectedSize("");
                  window.dispatchEvent(new CustomEvent("aurex_variant_changed", { detail: v.id }));
                }}
                title={v.color}
                className="w-8 h-8 rounded-full transition-all"
                style={{
                  backgroundColor: v.hex,
                  border:
                    selectedVariant?.id === v.id
                      ? "2px solid var(--color-gold-400)"
                      : "2px solid transparent",
                  outline:
                    selectedVariant?.id === v.id
                      ? "1px solid var(--color-gold-400)"
                      : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      <div>
        <p
          className="text-xs tracking-[0.15em] uppercase mb-3"
          style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
        >
          Size {selectedSize && `— ${selectedSize}`}
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const stock = stockFor(size);
            const outOfStock = stock === 0;
            const lowStock = stock > 0 && stock <= 5;
            const selected = selectedSize === size;

            return (
              <button
                key={size}
                onClick={() => !outOfStock && setSelectedSize(size)}
                disabled={outOfStock}
                className="relative w-12 h-12 rounded text-sm font-medium transition-all"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: selected
                    ? "var(--color-gold-400)"
                    : "var(--color-dark-forest)",
                  color: selected
                    ? "var(--color-void)"
                    : outOfStock
                    ? "var(--color-fg-disabled)"
                    : "var(--color-fg)",
                  border: selected
                    ? "1px solid var(--color-gold-400)"
                    : "1px solid var(--color-card-border)",
                  cursor: outOfStock ? "not-allowed" : "pointer",
                  opacity: outOfStock ? 0.4 : 1,
                  textDecoration: outOfStock ? "line-through" : "none",
                }}
              >
                {size}
                {lowStock && !outOfStock && (
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--color-gold-400)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {selectedSize && stockFor(selectedSize) <= 5 && stockFor(selectedSize) > 0 && (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-mono)" }}
          >
            Only {stockFor(selectedSize)} left
          </p>
        )}
      </div>

      {/* Qty */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center rounded border"
          style={{ borderColor: "var(--color-card-border)" }}
        >
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center transition-colors"
            style={{ color: "var(--color-fg-muted)" }}
          >
            −
          </button>
          <span
            className="w-10 text-center text-sm"
            style={{ color: "var(--color-fg)", fontFamily: "var(--font-mono)" }}
          >
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 flex items-center justify-center transition-colors"
            style={{ color: "var(--color-fg-muted)" }}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={!selectedSize || added}
          className="flex-1 py-3 rounded text-sm font-medium tracking-wide transition-all"
          style={{
            backgroundColor: added
              ? "var(--color-forest)"
              : !selectedSize
              ? "var(--color-dark-forest)"
              : "var(--color-gold-400)",
            color: added
              ? "var(--color-gold-200)"
              : !selectedSize
              ? "var(--color-fg-disabled)"
              : "var(--color-void)",
            fontFamily: "var(--font-body)",
            border: added ? "1px solid var(--color-gold-700)" : "none",
            cursor: !selectedSize ? "not-allowed" : "pointer",
          }}
        >
          {added ? "✓ Added to Cart" : !selectedSize ? "Select a Size" : "Add to Cart"}
        </button>
      </div>

      <p
        className="text-xs"
        style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-body)" }}
      >
        Total: <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>{fmtLKR(product.price * qty)}</span>
      </p>
    </div>
  );
}
