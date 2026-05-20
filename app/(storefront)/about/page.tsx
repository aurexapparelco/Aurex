import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Auréx was created with the belief that everyday menswear deserves the same care, refinement, and intention as the pieces reserved for special occasions.",
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>

      {/* Hero */}
      <section
        className="py-24 border-b"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-6"
            style={{ color: "var(--color-gold-200)" }}
          >
            Our Story
          </p>
          <h1
            className="text-4xl sm:text-6xl leading-tight mb-8"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)", letterSpacing: "-0.02em" }}
          >
            Built for the everyday.{" "}
            <em className="not-italic" style={{ color: "var(--color-gold-400)" }}>
              Crafted for life.
            </em>
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Auréx was created with a simple belief — the clothing worn every day deserves the same
            level of care, refinement, and intention as the pieces reserved for special occasions.
          </p>
        </div>
      </section>

      {/* Why We Started */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-5"
                style={{ color: "var(--color-gold-200)" }}
              >
                Why We Started
              </p>
              <h2
                className="text-3xl mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
              >
                Designed around the everyday
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-fg-muted)" }}>
                We started Auréx out of a genuine frustration — a belief that everyday menswear had
                settled too comfortably into disposability. Clothing that looked acceptable but felt
                careless. Brands that chased trends instead of building something enduring.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                We wanted something different. Clothing that felt considered from the moment you put
                it on. Pieces that didn&apos;t announce themselves loudly, but rewarded the people
                who noticed.
              </p>
            </div>

            <div className="relative aspect-4/5 rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-card-border)" }}>
              <Image
                src="/about-1.png"
                alt="Auréx — crafted for everyday life"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section
        className="py-20 border-t border-b"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--color-gold-200)" }}
            >
              What We Stand For
            </p>
            <h2
              className="text-3xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
            >
              Our Philosophy
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: "◈",
                title: "Timeless Design",
                desc: "We focus on pieces designed to remain relevant beyond seasonal trends — clothing that earns its place in a wardrobe by lasting.",
              },
              {
                icon: "⊹",
                title: "Thoughtful Craftsmanship",
                desc: "Every Auréx piece is developed with careful attention to fit, comfort, and long-term wearability. Detail over decoration.",
              },
              {
                icon: "✦",
                title: "Everyday Versatility",
                desc: "Our clothing is designed for modern everyday life — refined enough to elevate daily wear without feeling overstated.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-sm"
                style={{ backgroundColor: "var(--color-forest)", border: "1px solid var(--color-card-border)" }}
              >
                <span className="text-2xl block mb-4" style={{ color: "var(--color-gold-400)" }}>
                  {icon}
                </span>
                <h3
                  className="text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designed for Everyday Wear */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="md:order-2">
              <p
                className="text-xs tracking-[0.2em] uppercase mb-5"
                style={{ color: "var(--color-gold-200)" }}
              >
                The Approach
              </p>
              <h2
                className="text-3xl mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
              >
                Designed for everyday wear
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-fg-muted)" }}>
                We create clothing intended to move naturally through everyday life — from work to
                evenings out, from quiet routines to meaningful occasions.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                Each piece is considered for Sri Lanka&apos;s climate, the demands of modern daily
                wear, and the kind of ease that only comes from something genuinely well-made.
              </p>
            </div>

            <div className="relative md:order-1 aspect-4/5 rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-card-border)" }}>
              <Image
                src="/about-2.png"
                alt="Auréx — designed for everyday wear"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Crafted in Sri Lanka */}
      <section
        className="py-20 border-t border-b"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-5"
                style={{ color: "var(--color-gold-200)" }}
              >
                Origin
              </p>
              <h2
                className="text-3xl mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
              >
                Crafted in Sri Lanka
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-fg-muted)" }}>
                Auréx pieces are developed and produced in Sri Lanka with a focus on careful
                craftsmanship, considered detailing, and long-term quality.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                Sri Lanka has a long tradition of textile craftsmanship. We work within that
                tradition — not as a point of novelty, but as a genuine foundation for how we build
                clothing.
              </p>
            </div>

            <div
              className="rounded-sm overflow-hidden"
              style={{ border: "1px solid var(--color-card-border)" }}
            >
              {[
                ["Designed", "Colombo, Sri Lanka"],
                ["Produced", "Sri Lanka"],
                ["Shipped", "Island-wide"],
                ["Founded", "2025"],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--color-forest)" : "var(--color-dark-forest)",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--color-card-border)" : undefined,
                  }}
                >
                  <span
                    className="text-xs uppercase tracking-[0.12em]"
                    style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-body)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Identity statement */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div style={{ width: 36, height: 1, backgroundColor: "var(--color-gold-700)", margin: "0 auto 36px" }} />
          <p
            className="text-2xl sm:text-3xl leading-relaxed"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg-muted)", letterSpacing: "-0.01em" }}
          >
            For men who value simplicity,{" "}
            <em style={{ fontStyle: "normal", color: "var(--color-gold-400)" }}>restraint</em>
            , and quiet confidence.
          </p>
          <div style={{ width: 36, height: 1, backgroundColor: "var(--color-gold-700)", margin: "36px auto 0" }} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 border-t"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
          >
            Discover Auréx
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-fg-muted)" }}>
            Refined essentials for everyday wear.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded text-sm font-medium tracking-wide"
            style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)" }}
          >
            Explore the Collection →
          </Link>
        </div>
      </section>

    </div>
  );
}
