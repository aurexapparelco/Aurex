import Link from "next/link";
import { getSettings } from "@/lib/settings";
import FooterLogo from "./FooterLogo";
import FooterWhatsAppWidget from "./FooterWhatsAppWidget";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?tag=Featured", label: "Featured" },
  { href: "/shop?tag=New+Arrival", label: "New Arrivals" },
];

const HELP_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/returns", label: "Return Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/delivery-policy", label: "Delivery Policy" },
];

const ABOUT_LINKS = [
  { href: "/about", label: "Our Story" },
];

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.37a8.28 8.28 0 0 0 4.85 1.55V6.47a4.85 4.85 0 0 1-1.08-.22z" />
    </svg>
  );
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs tracking-[0.18em] uppercase mb-5"
      style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
    >
      {children}
    </p>
  );
}

function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className="footer-link text-sm" style={{ color: "var(--color-fg-muted)" }}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function Footer() {
  const settings = await getSettings();
  const { footer } = settings;

  const socialLinks = [
    { href: footer.socialFacebook, label: "Follow Auréx on Facebook", Icon: FacebookIcon },
    { href: footer.socialInstagram, label: "Follow Auréx on Instagram", Icon: InstagramIcon },
    { href: footer.socialTiktok, label: "Follow Auréx on TikTok", Icon: TikTokIcon },
  ].filter((s) => s.href);

  return (
    <footer style={{ borderTop: "1px solid var(--color-gold-700)" }}>
      {/* Main area */}
      <div style={{ backgroundColor: "var(--color-deep-teal)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <nav aria-label="Footer navigation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

              {/* Col 1 — Brand */}
              <div className="md:col-span-2 lg:col-span-1 border-b md:border-b-0 pb-8 md:pb-0" style={{ borderColor: "var(--color-card-border)" }}>
                <FooterLogo tagline={footer.brandTagline} />

                <p
                  className="text-xs leading-relaxed mt-4 max-w-55"
                  style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
                >
                  Refined menswear designed for everyday wear.
                </p>
                <p
                  className="text-xs leading-relaxed mt-3 max-w-55"
                  style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}
                >
                  Minimal essentials crafted with comfort, versatility, and quiet confidence in mind.
                </p>

                {socialLinks.length > 0 && (
                  <div className="flex gap-2 mt-6">
                    {socialLinks.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="footer-social-icon"
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 32, height: 32, borderRadius: "50%",
                          border: "1px solid var(--color-card-border)",
                          color: "var(--color-fg-muted)",
                          textDecoration: "none",
                          flexShrink: 0,
                        }}
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                )}

                <p
                  className="text-xs mt-6 tracking-[0.12em] uppercase"
                  style={{ color: "var(--color-gold-200)" }}
                >
                  Made in Sri Lanka
                </p>
              </div>

              {/* Col 2 — Shop */}
              <div className="border-b md:border-b-0 pb-8 md:pb-0" style={{ borderColor: "var(--color-card-border)" }}>
                <ColHeading>Shop</ColHeading>
                <NavLinks links={SHOP_LINKS} />
              </div>

              {/* Col 3 — Help */}
              <div className="border-b md:border-b-0 pb-8 md:pb-0" style={{ borderColor: "var(--color-card-border)" }}>
                <ColHeading>Help</ColHeading>
                <NavLinks links={HELP_LINKS} />
              </div>

              {/* Col 4 — About */}
              <div className="border-b md:border-b-0 pb-8 md:pb-0" style={{ borderColor: "var(--color-card-border)" }}>
                <ColHeading>About</ColHeading>
                <NavLinks links={ABOUT_LINKS} />
              </div>

              {/* Col 5 — Need Help? (WhatsApp) */}
              <div className="md:col-span-2 lg:col-span-1">
                <p
                  className="text-sm font-semibold mb-4"
                  style={{ color: "var(--color-fg)", fontFamily: "var(--font-body)" }}
                >
                  Need Help?
                </p>
                <FooterWhatsAppWidget
                  phone={footer.whatsappNumber}
                  prefillMessage={footer.whatsappPrefill}
                  openDay={footer.businessOpenDay}
                  closeDay={footer.businessCloseDay}
                  openTime={footer.businessOpenTime}
                  closeTime={footer.businessCloseTime}
                  holidayNote={footer.holidayNote}
                />
              </div>

            </div>
          </nav>
        </div>
      </div>

      {/* Sub-footer */}
      <div
        style={{
          backgroundColor: "var(--color-void)",
          borderTop: "1px solid var(--color-card-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "var(--color-fg-tertiary)" }}>
            <p>© {new Date().getFullYear()} {footer.copyrightSuffix}</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="footer-link" style={{ color: "var(--color-fg-tertiary)" }}>
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/terms-and-conditions" className="footer-link" style={{ color: "var(--color-fg-tertiary)" }}>
                Terms & Conditions
              </Link>
            </div>
            <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Bank transfer accepted
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
