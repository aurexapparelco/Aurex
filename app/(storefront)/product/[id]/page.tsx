import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import { fmtLKR } from "@/lib/constants";
import type { Metadata } from "next";
import type { ProductWithVariantsAndInventory } from "@/types/supabase-helpers";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      `*, product_types(id, name), product_variants(id, color, hex, images, inventory(variant_id, size, qty))`,
    )
    .eq("id", id)
    .single();
  return data ? (data as unknown as ProductWithVariantsAndInventory) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const variants = product.product_variants ?? [];
  const primaryVariant = variants[0];

  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs mb-8"
          style={{
            color: "var(--color-fg-tertiary)",
            fontFamily: "var(--font-body)",
          }}
        >
          <a href="/shop" style={{ color: "var(--color-fg-muted)" }}>
            Shop
          </a>
          <span>›</span>
          <span>{product.product_types?.name ?? "Product"}</span>
          <span>›</span>
          <span style={{ color: "var(--color-fg)" }}>{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image gallery */}
          <div className="space-y-3">
            <div
              className="aspect-4/5 rounded-sm overflow-hidden"
              style={{
                backgroundColor: "var(--color-forest)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              {primaryVariant?.images?.[0] ? (
                <img
                  src={primaryVariant.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-6xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-fg-disabled)",
                    }}
                  >
                    Ax
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {primaryVariant?.images && primaryVariant.images.length > 1 && (
              <div className="flex gap-2">
                {primaryVariant.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="w-20 aspect-4/5 rounded-sm overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-forest)",
                      border: "1px solid var(--color-card-border)",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info + Add to cart */}
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{
                color: "var(--color-gold-200)",
                fontFamily: "var(--font-body)",
              }}
            >
              {product.product_types?.name ?? ""} · {product.origin}
            </p>

            <h1
              className="text-3xl sm:text-4xl leading-tight mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                color: "var(--color-fg)",
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xl"
                style={{
                  color: "var(--color-gold-400)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {fmtLKR(product.price)}
              </span>
              {product.compare_at && (
                <span
                  className="text-base line-through"
                  style={{
                    color: "var(--color-fg-tertiary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {fmtLKR(product.compare_at)}
                </span>
              )}
            </div>

            <p
              className="text-sm leading-relaxed mb-8"
              style={{
                color: "var(--color-fg-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {product.description}
            </p>

            {/* Interactive selector + add to cart */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
              }}
              variants={variants.map((v) => ({
                id: v.id,
                color: v.color,
                hex: v.hex,
                images: v.images,
                inventory: v.inventory.map((inv) => ({
                  size: inv.size,
                  qty: inv.qty,
                })),
              }))}
            />

            {/* Details accordion */}
            <div
              className="mt-10 space-y-0 border-t"
              style={{ borderColor: "var(--color-card-border)" }}
            >
              {[
                {
                  label: "Fabric & Care",
                  content: `${product.fabric} · ${product.gsm}GSM\n${product.care}`,
                },
                {
                  label: "Fit & Sizing",
                  content: `${product.fit}\n${product.fit_note}\n\n${product.model_info}`,
                },
                {
                  label: "Origin",
                  content: product.origin,
                },
              ].map(({ label, content }) => (
                <details
                  key={label}
                  className="group border-b"
                  style={{ borderColor: "var(--color-card-border)" }}
                >
                  <summary
                    className="flex items-center justify-between py-4 cursor-pointer list-none"
                    style={{ color: "var(--color-fg)" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {label}
                    </span>
                    <svg
                      className="transition-transform group-open:rotate-180"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </summary>
                  <div className="pb-4">
                    <p
                      className="text-sm leading-relaxed whitespace-pre-line"
                      style={{ color: "var(--color-fg-muted)" }}
                    >
                      {content}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
