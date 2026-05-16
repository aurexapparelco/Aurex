import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-deep-teal)",
        borderTop: "1px solid var(--color-card-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Auréx Atelier"
                height={40}
                width={160}
                style={{ objectFit: "contain", objectPosition: "left" }}
              />
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--color-fg-muted)" }}
            >
              Luxury everyday essentials, precision-crafted in Sri Lanka with
              premium fabrics designed to outlast trends.
            </p>
            <p
              className="text-xs mt-6 tracking-[0.12em] uppercase"
              style={{ color: "var(--color-gold-200)" }}
            >
              Made in Sri Lanka
            </p>
          </div>

          {/* Shop */}
          <div>
            <p
              className="text-xs tracking-[0.18em] uppercase mb-5"
              style={{ color: "var(--color-gold-200)" }}
            >
              Shop
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?type=Plain", label: "Plain Essentials" },
                { href: "/shop?type=Premium", label: "Premium Collection" },
                { href: "/shop?tag=New+Arrival", label: "New Arrivals" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p
              className="text-xs tracking-[0.18em] uppercase mb-5"
              style={{ color: "var(--color-gold-200)" }}
            >
              Help
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/account", label: "My Account" },
                { href: "/cart", label: "Cart" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className="mt-6 p-3 rounded text-xs"
              style={{
                backgroundColor: "var(--color-forest)",
                border: "1px solid var(--color-card-border)",
                color: "var(--color-fg-muted)",
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-gold-200)" }}>
                Bank Transfer
              </p>
              <p>Commercial Bank of Ceylon</p>
              <p className="mt-0.5">Auréx Atelier (Pvt) Ltd</p>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t text-xs"
          style={{
            borderColor: "var(--color-card-border)",
            color: "var(--color-fg-tertiary)",
          }}
        >
          <p>© {new Date().getFullYear()} Auréx Atelier (Pvt) Ltd. All rights reserved.</p>
          <p>LKR · Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
