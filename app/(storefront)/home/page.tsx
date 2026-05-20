import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getHomeContent } from "@/lib/home-content";
import ProductCard from "@/components/storefront/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Essentials — Made in Sri Lanka",
  description:
    "Auréx crafts luxury everyday essentials with precision-grade fabrics. Discover our plain and premium collections.",
};

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      `*, product_variants(id, color, hex, images, inventory(variant_id, size, qty))`,
    )
    .eq("listed", true)
    .contains("tags", ["Featured"])
    .limit(4);
  return data ?? [];
}

async function getNewArrivals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      `*, product_variants(id, color, hex, images, inventory(variant_id, size, qty))`,
    )
    .eq("listed", true)
    .contains("tags", ["New Arrival"])
    .limit(8);
  return data ?? [];
}

type FeaturedProduct = { id: string; name: string; price: number };

async function getHeroProduct(id: string): Promise<FeaturedProduct | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price")
    .eq("id", id)
    .eq("listed", true)
    .single();
  return data as FeaturedProduct | null;
}

export default async function HomePage() {
  const [featured, newArrivals, homeContent] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getHomeContent(),
  ]);

  const { hero, featureStrip, collectionCards } = homeContent;

  const firstFeatured: FeaturedProduct | undefined =
    hero.heroProductId
      ? (await getHeroProduct(hero.heroProductId)) ?? (featured[0] as unknown as FeaturedProduct)
      : (featured[0] as unknown as FeaturedProduct);

  return (
    <>
      {/* Hero */}
      {hero.visible && (
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: "var(--color-void)", padding: "120px 64px 100px" }}
        >
          {/* Gradient overlays matching template */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 1100px 540px at 50% 0%, rgba(212,162,76,0.20) 0%, rgba(0,0,0,0) 65%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 110%, #102620 0%, rgba(0,0,0,0) 55%)",
            }}
          />

          <div className="relative" style={{ maxWidth: 1440, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: hero.imageUrl ? "1.1fr 1fr" : "1fr",
                gap: 80,
                alignItems: "center",
              }}
            >
              {/* Left: text content */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {hero.eyebrow && (
                  <p
                    style={{
                      fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "var(--color-gold-200)", fontWeight: 500, margin: 0,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {hero.eyebrow}
                  </p>
                )}

                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 96, lineHeight: 0.95, fontWeight: 300,
                    letterSpacing: "-0.015em", color: "var(--color-fg)", margin: 0,
                  }}
                >
                  {hero.headline}
                  {hero.headlineAccent && (
                    <>
                      <br />
                      <em style={{ fontStyle: "italic", color: "var(--color-gold-100)", fontWeight: 300 }}>
                        {hero.headlineAccent}
                      </em>
                    </>
                  )}
                </h1>

                {hero.subtext && (
                  <p
                    style={{
                      fontSize: 19, lineHeight: 1.56, color: "var(--color-fg-muted)",
                      maxWidth: 520, margin: 0, fontWeight: 450,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {hero.subtext}
                  </p>
                )}

                <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                  {hero.primaryCta.label && (
                    <Link
                      href={hero.primaryCta.href}
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        gap: 10, fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500,
                        padding: "14px 28px", borderRadius: 9999, cursor: "pointer",
                        border: "1px solid transparent", letterSpacing: "0.02em",
                        backgroundColor: "#fff", color: "#000", textDecoration: "none",
                      }}
                    >
                      {hero.primaryCta.label}
                    </Link>
                  )}
                  {hero.secondaryCta.label && (
                    <Link
                      href={hero.secondaryCta.href}
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        gap: 10, fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500,
                        padding: "14px 28px", borderRadius: 9999, cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.7)", letterSpacing: "0.02em",
                        backgroundColor: "transparent", color: "#fff", textDecoration: "none",
                      }}
                    >
                      {hero.secondaryCta.label}
                    </Link>
                  )}
                </div>

                {/* Divider + origin line */}
                <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 32 }}>
                  <div style={{
                    height: 1, width: 120,
                    background: "linear-gradient(90deg, rgba(212,162,76,0) 0%, #D4A24C 50%, rgba(212,162,76,0) 100%)",
                  }} />
                  <span style={{
                    fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
                    color: "var(--color-fg-tertiary)", fontFamily: "var(--font-body)",
                  }}>
                    {hero.locationTagline}
                  </span>
                </div>
              </div>

              {/* Right: hero image + overlay card */}
              {hero.imageUrl && (
                <div style={{ position: "relative", aspectRatio: "4/5", maxHeight: 720 }}>
                  <Image
                    src={hero.imageUrl}
                    alt=""
                    fill
                    priority
                    style={{
                      objectFit: "cover",
                      filter: "grayscale(0.2) contrast(1.05) brightness(0.95)",
                    }}
                  />

                  {/* Featured product card */}
                  {firstFeatured && (
                    <div
                      style={{
                        position: "absolute", bottom: -40, left: -40,
                        width: 220, height: 280,
                        border: "1px solid rgba(212,162,76,0.4)",
                        background: "rgba(2,9,10,0.6)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        padding: 24,
                        display: "flex", flexDirection: "column", justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p style={{
                          fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
                          color: "var(--color-gold-200)", fontWeight: 500, margin: 0,
                        }}>
                          Featured
                        </p>
                        <div style={{
                          fontFamily: "var(--font-display)", fontSize: 24,
                          fontWeight: 400, color: "#fff", marginTop: 12, lineHeight: 1.2,
                        }}>
                          {firstFeatured.name}
                        </div>
                      </div>
                      <div>
                        <div style={{
                          color: "var(--color-gold-200)", fontSize: 14,
                          fontFamily: "var(--font-mono)",
                        }}>
                          LKR {firstFeatured.price.toLocaleString("en-LK")}
                        </div>
                        <Link
                          href={`/product/${firstFeatured.id}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            color: "#fff", textDecoration: "none", fontSize: 13,
                            letterSpacing: "0.08em", textTransform: "uppercase",
                            marginTop: 12, fontWeight: 500,
                          }}
                        >
                          View{" "}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Decorative asterisk */}
                  <svg
                    width={56} height={56} viewBox="0 0 24 24"
                    fill="none" stroke="var(--color-gold-400)" strokeWidth={1}
                    strokeLinecap="round"
                    style={{ position: "absolute", top: 16, right: 16, opacity: 0.85 }}
                  >
                    <path d="M12 4v16M4.5 7.5l15 9M19.5 7.5l-15 9" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features strip */}
      {featureStrip.visible && (
        <section
          style={{
            backgroundColor: "var(--color-deep-teal)",
            borderTop: "1px solid var(--color-card-border)",
            borderBottom: "1px solid var(--color-card-border)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {featureStrip.features.map(({ icon, iconUrl, label, subtitle }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-4 px-4 sm:px-6 py-4${i < 2 ? " border-b md:border-b-0" : ""}`}
                  style={{
                    borderLeft: i === 1 || i === 3 ? "1px solid var(--color-card-border)" : undefined,
                    borderColor: "var(--color-card-border)",
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "1px solid var(--color-gold-700)",
                      backgroundColor: "rgba(110,79,24,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {iconUrl ? (
                      <Image src={iconUrl} alt="" width={22} height={22} className="object-contain" unoptimized />
                    ) : (
                      <span style={{ color: "var(--color-gold-400)", fontSize: 16 }}>{icon}</span>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ minWidth: 0 }}>
                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{ color: "var(--color-fg)", fontFamily: "var(--font-body)", margin: 0 }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-xs leading-snug mt-0.5"
                      style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
                    >
                      {subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20" style={{ backgroundColor: "var(--color-void)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
                >
                  Curated Selection
                </p>
                <h2
                  className="text-3xl sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
                >
                  Featured Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:flex items-center gap-1 text-sm transition-colors"
                style={{ color: "var(--color-gold-400)", fontFamily: "var(--font-body)" }}
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* @ts-expect-error — Supabase type mismatch with nested relations */}
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Collection Cards */}
      {collectionCards.visible && collectionCards.cards.length > 0 && (
        <section
          className="py-20"
          style={{ backgroundColor: "var(--color-dark-forest)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {collectionCards.cards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative overflow-hidden rounded-sm p-10 flex flex-col justify-end min-h-80 transition-all"
                  style={{
                    backgroundColor: "var(--color-forest)",
                    border: "1px solid var(--color-card-border)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(212,162,76,0.06) 0%, transparent 70%)",
                    }}
                  />
                  {card.overline && (
                    <p
                      className="text-xs tracking-[0.2em] uppercase mb-3"
                      style={{ color: "var(--color-gold-200)" }}
                    >
                      {card.overline}
                    </p>
                  )}
                  <h3
                    className="text-3xl mb-3"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
                  >
                    {card.heading}
                  </h3>
                  {card.description && (
                    <p
                      className="text-sm mb-6"
                      style={{ color: "var(--color-fg-muted)" }}
                    >
                      {card.description}
                    </p>
                  )}
                  {card.cta && (
                    <span
                      className="inline-flex items-center gap-1 text-sm"
                      style={{ color: "var(--color-gold-400)" }}
                    >
                      {card.cta}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20" style={{ backgroundColor: "var(--color-void)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
                >
                  Just Dropped
                </p>
                <h2
                  className="text-3xl sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
                >
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/shop?tag=New+Arrival"
                className="hidden sm:flex items-center gap-1 text-sm"
                style={{ color: "var(--color-gold-400)" }}
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* @ts-expect-error — Supabase type mismatch with nested relations */}
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Brand promise */}
      <section
        className="py-24"
        style={{ backgroundColor: "var(--color-dark-forest)", borderTop: "1px solid var(--color-card-border)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-6"
            style={{ color: "var(--color-gold-200)" }}
          >
            Our Story
          </p>
          <h2
            className="text-3xl sm:text-5xl leading-tight mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-fg)",
              letterSpacing: "-0.01em",
            }}
          >
            Built for the everyday.{" "}
            <em className="not-italic" style={{ color: "var(--color-gold-400)" }}>
              Crafted for life.
            </em>
          </h2>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "var(--color-fg-muted)" }}
          >
            We started Auréx with a simple belief — the clothing worn every day
            deserves the same care, refinement, and intention as the pieces reserved
            for special occasions. Designed for everyday wear. Crafted in Sri Lanka.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm font-medium tracking-wide border transition-colors"
            style={{
              borderColor: "var(--color-gold-700)",
              color: "var(--color-gold-400)",
              fontFamily: "var(--font-body)",
            }}
          >
            Discover Our Story
          </Link>
        </div>
      </section>
    </>
  );
}
