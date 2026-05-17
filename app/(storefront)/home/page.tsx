import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getHomeContent } from "@/lib/home-content";
import ProductCard from "@/components/storefront/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Essentials — Made in Sri Lanka",
  description:
    "Auréx Atelier crafts luxury everyday essentials with precision-grade fabrics. Discover our plain and premium collections.",
};

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      `*, product_variants(id, color, hex, images, inventory(variant_id, size, qty))`,
    )
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
    .contains("tags", ["New Arrival"])
    .limit(8);
  return data ?? [];
}

export default async function HomePage() {
  const [featured, newArrivals, homeContent] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getHomeContent(),
  ]);

  const { hero, featureStrip, collectionCards } = homeContent;

  return (
    <>
      {/* Hero */}
      {hero.visible && (
        <section
          className="relative min-h-[90vh] flex items-center overflow-hidden"
          style={{ backgroundColor: "var(--color-void)" }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 70% 50%, rgba(16,38,32,0.8) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(110,79,24,0.15) 0%, transparent 60%)",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
            <div className={`flex items-center gap-16 ${hero.imageUrl ? "justify-between" : ""}`}>
              <div className="max-w-xl">
                {/* Eyebrow */}
                {hero.eyebrow && (
                  <p
                    className="text-xs tracking-[0.22em] uppercase mb-6"
                    style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
                  >
                    {hero.eyebrow}
                  </p>
                )}

                {/* Headline */}
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    color: "var(--color-fg)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {hero.headline}{" "}
                  {hero.headlineAccent && (
                    <em
                      className="not-italic"
                      style={{ color: "var(--color-gold-400)" }}
                    >
                      {hero.headlineAccent}
                    </em>
                  )}
                </h1>

                {hero.subtext && (
                  <p
                    className="text-base sm:text-lg leading-relaxed mb-10 max-w-sm"
                    style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)", fontWeight: 400 }}
                  >
                    {hero.subtext}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  {hero.primaryCta.label && (
                    <Link
                      href={hero.primaryCta.href}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm font-medium tracking-wide transition-all"
                      style={{
                        backgroundColor: "var(--color-gold-400)",
                        color: "var(--color-void)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {hero.primaryCta.label}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                  {hero.secondaryCta.label && (
                    <Link
                      href={hero.secondaryCta.href}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm font-medium tracking-wide border transition-colors"
                      style={{
                        borderColor: "var(--color-card-border)",
                        color: "var(--color-fg-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {hero.secondaryCta.label}
                    </Link>
                  )}
                </div>

                {/* Stats */}
                {hero.stats.length > 0 && (
                  <div className="flex gap-8 mt-14">
                    {hero.stats.map(({ value, unit, label }) => (
                      <div key={label}>
                        <div className="flex items-baseline gap-1">
                          <span
                            className="text-2xl"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-400)" }}
                          >
                            {value}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-gold-700)", fontFamily: "var(--font-mono)" }}
                          >
                            {unit}
                          </span>
                        </div>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-body)" }}
                        >
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hero image */}
              {hero.imageUrl && (
                <div className="hidden lg:block shrink-0">
                  <Image
                    src={hero.imageUrl}
                    alt="Hero"
                    width={480}
                    height={560}
                    className="object-cover rounded-sm"
                    style={{ maxHeight: "560px", width: "auto" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Decorative vertical text */}
          {!hero.imageUrl && (
            <div
              className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                color: "var(--color-fg-disabled)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "var(--font-body)",
              }}
            >
              Auréx Atelier · SS 2025
            </div>
          )}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {featureStrip.features.map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <span
                    style={{ color: "var(--color-gold-400)", fontSize: "16px" }}
                  >
                    {icon}
                  </span>
                  <span
                    className="text-xs tracking-wide"
                    style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
                  >
                    {label}
                  </span>
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
            Our Promise
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
            Not fast fashion.{" "}
            <em className="not-italic" style={{ color: "var(--color-gold-400)" }}>
              Considered craft.
            </em>
          </h2>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Every Auréx piece is cut and sewn in our Colombo atelier, using
            200GSM supima cotton that holds its form wash after wash. We make
            fewer things, better.
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
            Our Story
          </Link>
        </div>
      </section>
    </>
  );
}
