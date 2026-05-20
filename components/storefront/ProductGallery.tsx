"use client";

import { useState, useEffect } from "react";

interface Props {
  variants: { id: string; images: string[] }[];
  productName: string;
}

export default function ProductGallery({ variants, productName }: Props) {
  const [images, setImages] = useState(variants[0]?.images ?? []);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    function handleVariantChange(e: Event) {
      const variantId = (e as CustomEvent<string>).detail;
      const variant = variants.find((v) => v.id === variantId);
      if (variant) {
        setImages(variant.images ?? []);
        setActiveIdx(0);
      }
    }
    window.addEventListener("aurex_variant_changed", handleVariantChange);
    return () => window.removeEventListener("aurex_variant_changed", handleVariantChange);
  }, [variants]);

  const activeImage = images[activeIdx] ?? null;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="aspect-4/5 rounded-sm overflow-hidden"
        style={{
          backgroundColor: "var(--color-forest)",
          border: "1px solid var(--color-card-border)",
        }}
      >
        {activeImage ? (
          <img
            src={activeImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-6xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-fg-disabled)" }}
            >
              Ax
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="w-20 shrink-0 aspect-4/5 rounded-sm overflow-hidden transition-all"
              style={{
                backgroundColor: "var(--color-forest)",
                border: activeIdx === i
                  ? "1px solid var(--color-gold-400)"
                  : "1px solid var(--color-card-border)",
                opacity: activeIdx === i ? 1 : 0.65,
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
