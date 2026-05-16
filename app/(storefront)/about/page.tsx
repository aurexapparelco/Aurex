import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Our Story",
  description:
    "Auréx Atelier was founded to create luxury everyday essentials, precision-crafted in Sri Lanka.",
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>
      {/* Hero */}
      <section
        className="py-24 border-b"
        style={{
          backgroundColor: "var(--color-dark-forest)",
          borderColor: "var(--color-card-border)",
        }}
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
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-fg)",
              letterSpacing: "-0.02em",
            }}
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
            Auréx Atelier was founded on a simple belief: the clothes you wear every
            day deserve the same consideration as the ones you wear to occasions.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-5"
                style={{ color: "var(--color-gold-200)" }}
              >
                The Foundation
              </p>
              <h2
                className="text-3xl mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
              >
                Precision over volume
              </h2>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--color-fg-muted)" }}
              >
                We launched with three tees in three colours. Not because that was
                all we could make, but because that was all we needed to say.
                Every Auréx piece begins at our Colombo atelier, where pattern
                makers and sewers work with 200GSM supima cotton sourced for its
                weight, durability, and feel against Sri Lanka&apos;s tropical climate.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-fg-muted)" }}
              >
                We don&apos;t follow seasonal trends. We refine the same essential
                pieces, drop after drop, until they&apos;re exactly right.
              </p>
            </div>

            <div
              className="aspect-[4/5] rounded-sm"
              style={{
                backgroundColor: "var(--color-forest)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="text-8xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-gold-700)", fontWeight: 300 }}
                >
                  Ax
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20 border-t border-b"
        style={{
          backgroundColor: "var(--color-dark-forest)",
          borderColor: "var(--color-card-border)",
        }}
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
              Our Principles
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: "◈",
                title: "Material Integrity",
                desc: "200GSM supima cotton, selected for performance in tropical climates. Nothing that thins after 10 washes.",
              },
              {
                icon: "⊹",
                title: "Local Craft",
                desc: "Every piece cut and sewn in Colombo. We employ skilled local artisans and pay above industry wage.",
              },
              {
                icon: "✦",
                title: "Honest Pricing",
                desc: "No artificial markups. LKR-denominated, no import premium. Luxury without the inaccessibility.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-sm"
                style={{
                  backgroundColor: "var(--color-forest)",
                  border: "1px solid var(--color-card-border)",
                }}
              >
                <span
                  className="text-2xl block mb-4"
                  style={{ color: "var(--color-gold-400)" }}
                >
                  {icon}
                </span>
                <h3
                  className="text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fabric spec */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-5"
                style={{ color: "var(--color-gold-200)" }}
              >
                The Fabric
              </p>
              <h2
                className="text-3xl mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
              >
                200GSM Supima Cotton
              </h2>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--color-fg-muted)" }}
              >
                Supima cotton is grown exclusively in the USA, accounting for less
                than 1% of global cotton production. Its extra-long staple fibres
                create a fabric that is softer, stronger, and more colourfast than
                standard cotton.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-fg-muted)" }}
              >
                At 200 grams per square metre, our fabric has the weight and
                structure to hold its shape across hundreds of washes — a number
                that fast fashion could never reach.
              </p>
            </div>

            <div className="space-y-3">
              {[
                ["GSM Weight", "200", "g/m²"],
                ["Cotton Type", "Supima", "USA Origin"],
                ["Shrinkage", "< 3%", "After 40 washes"],
                ["Colorfastness", "Grade 4–5", "ISO 105-C06"],
                ["Origin", "Sri Lanka", "Auréx Atelier"],
              ].map(([label, value, sub]) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-4 rounded-sm"
                  style={{
                    backgroundColor: "var(--color-dark-forest)",
                    border: "1px solid var(--color-card-border)",
                  }}
                >
                  <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                    {label}
                  </span>
                  <div className="text-right">
                    <span
                      className="text-sm block"
                      style={{ color: "var(--color-fg)", fontFamily: "var(--font-mono)" }}
                    >
                      {value}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)" }}
                    >
                      {sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 border-t"
        style={{
          backgroundColor: "var(--color-dark-forest)",
          borderColor: "var(--color-card-border)",
        }}
      >
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}
          >
            Start with the essentials
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Plain or Premium — every piece is crafted to the same standard.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded text-sm font-medium tracking-wide"
            style={{ backgroundColor: "var(--color-gold-400)", color: "var(--color-void)" }}
          >
            Shop Collection →
          </Link>
        </div>
      </section>
    </div>
  );
}
