import Link from "next/link";
import { fmtLKR } from "@/lib/constants";
import type { ProductWithVariants } from "@/types/database.types";

interface Props {
  product: ProductWithVariants;
}

export default function ProductCard({ product }: Props) {
  const primaryVariant = product.product_variants?.[0];
  const primaryImage = primaryVariant?.images?.[0];

  const isNew = product.tags.includes("New Arrival");
  const onSale = product.compare_at != null;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4"
        style={{
          backgroundColor: "var(--color-forest)",
          border: "1px solid var(--color-card-border)",
        }}
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-4xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-fg-disabled)" }}
            >
              Ax
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span
              className="text-xs px-2 py-0.5 rounded tracking-[0.12em] uppercase"
              style={{
                backgroundColor: "var(--color-gold-400)",
                color: "var(--color-void)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
            >
              New
            </span>
          )}
          {onSale && (
            <span
              className="text-xs px-2 py-0.5 rounded tracking-[0.12em] uppercase"
              style={{
                backgroundColor: "rgba(248,231,176,0.12)",
                border: "1px solid rgba(248,231,176,0.3)",
                color: "var(--color-gold-100)",
                fontFamily: "var(--font-body)",
              }}
            >
              Sale
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.product_variants && product.product_variants.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {product.product_variants.slice(0, 4).map((v) => (
              <div
                key={v.id}
                title={v.color}
                className="w-3.5 h-3.5 rounded-full border"
                style={{
                  backgroundColor: v.hex,
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p
          className="text-xs tracking-[0.15em] uppercase mb-1"
          style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
        >
          {product.product_types?.name ?? ""}
        </p>
        <h3
          className="text-base leading-snug mb-2 transition-colors group-hover:text-[var(--color-gold-100)]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: "var(--color-fg)",
          }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="text-sm"
            style={{ color: "var(--color-gold-400)", fontFamily: "var(--font-mono)" }}
          >
            {fmtLKR(product.price)}
          </span>
          {product.compare_at && (
            <span
              className="text-xs line-through"
              style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              {fmtLKR(product.compare_at)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
