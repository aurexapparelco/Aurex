import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Auréx. WhatsApp, email, or message us directly.",
};

const WA_NUMBER = "94717660101";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Aurex! I need some help.")}`;

const QUICK_LINKS = [
  { href: "/returns", label: "Return Policy" },
  { href: "/delivery-policy", label: "Delivery & Shipping" },
  { href: "/track-order", label: "Track My Order" },
];

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>

      {/* Header */}
      <section
        className="py-12 border-b"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-3"
            style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
          >
            Auréx
          </p>
          <h1
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)", letterSpacing: "-0.01em" }}
          >
            Contact Us
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}>
            We&apos;re happy to help with sizing, orders, returns, or anything else.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

          {/* WhatsApp primary CTA — first on mobile, prominent everywhere */}
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-wa-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 22px",
              borderRadius: 4,
              backgroundColor: "var(--color-gold-500)",
              textDecoration: "none",
            }}
          >
            {/* WA icon */}
            <div style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: 15, margin: 0, fontFamily: "var(--font-body)" }}>
                WhatsApp Support
              </p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "3px 0 0", fontFamily: "var(--font-body)" }}>
                +94 71 766 0101 · Quick replies during business hours
              </p>
            </div>

            {/* CTA */}
            <span
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold"
              style={{
                flexShrink: 0, color: "white",
                backgroundColor: "rgba(255,255,255,0.18)",
                padding: "8px 16px", borderRadius: 99, fontFamily: "var(--font-body)",
              }}
            >
              Chat now →
            </span>
          </a>

          {/* Two-column grid */}
          <div className="grid md:grid-cols-2 gap-10">

            {/* Left — channels + quick answers */}
            <div className="space-y-8">

              {/* Contact channels */}
              <div>
                <p
                  className="text-xs tracking-[0.16em] uppercase mb-4"
                  style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
                >
                  Contact Channels
                </p>
                <div className="space-y-5">
                  {[
                    {
                      label: "General Support",
                      value: "hello@wearaurex.com",
                      href: "mailto:hello@wearaurex.com",
                      note: "Orders, sizing, product queries",
                    },
                    {
                      label: "Returns & Exchanges",
                      value: "returns@wearaurex.com",
                      href: "mailto:returns@wearaurex.com",
                      note: "Include your order number",
                    },
                    {
                      label: "Business Inquiries",
                      value: "hello@wearaurex.com",
                      href: "mailto:hello@wearaurex.com",
                      note: "Collaborations, wholesale",
                    },
                  ].map(({ label, value, href, note }) => (
                    <div key={label}>
                      <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--color-fg-tertiary)", fontFamily: "var(--font-body)" }}>
                        {label}
                      </p>
                      <a
                        href={href}
                        style={{ color: "var(--color-gold-400)", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        {value}
                      </a>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-fg-tertiary)" }}>{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business hours */}
              <div
                className="rounded-sm p-5"
                style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
              >
                <p className="text-xs tracking-[0.14em] uppercase mb-3" style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}>
                  Business Hours
                </p>
                <div className="space-y-1 text-sm" style={{ color: "var(--color-fg-muted)" }}>
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday – Sunday</span>
                    <span style={{ color: "var(--color-fg-disabled)" }}>Closed</span>
                  </div>
                </div>
                <p className="text-xs mt-3 italic" style={{ color: "var(--color-fg-tertiary)" }}>
                  Sri Lanka Time (GMT+5:30). Responses may be delayed on public holidays.
                </p>
              </div>

              {/* Quick answers */}
              <div>
                <p
                  className="text-xs tracking-[0.16em] uppercase mb-4"
                  style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
                >
                  Quick Answers
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--color-fg-tertiary)" }}>
                  You might find your answer here before reaching out:
                </p>
                <div className="space-y-2">
                  {QUICK_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 text-sm footer-link"
                      style={{ color: "var(--color-fg-muted)" }}
                    >
                      <span style={{ color: "var(--color-gold-500)" }}>→</span>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Right — message form */}
            <div>
              <p
                className="text-xs tracking-[0.16em] uppercase mb-4"
                style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
              >
                Send a Message
              </p>

              <form className="space-y-4" action={`mailto:hello@wearaurex.com`} method="post" encType="text/plain">

                {/* Category */}
                <div>
                  <label className="contact-label">What can we help you with?</label>
                  <select name="category" style={selectStyle}>
                    <option value="">Select a topic…</option>
                    <option value="order-issue">Order Issue</option>
                    <option value="returns">Returns &amp; Exchanges</option>
                    <option value="size-help">Size Help</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="delivery">Delivery Question</option>
                    <option value="collaboration">Collaboration / Wholesale</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="contact-label">Full Name</label>
                  <input type="text" name="name" required className="contact-input" style={inputStyle} />
                </div>

                <div>
                  <label className="contact-label">Email Address</label>
                  <input type="email" name="email" required className="contact-input" style={inputStyle} />
                </div>

                <div>
                  <label className="contact-label">Order Number <span style={{ color: "var(--color-fg-disabled)", fontWeight: 400 }}>(if applicable)</span></label>
                  <input
                    type="text"
                    name="order"
                    placeholder="AX-XXXXXX"
                    className="contact-input"
                    style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                  />
                </div>

                <div>
                  <label className="contact-label">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Please include as much detail as possible…"
                    className="contact-input"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn w-full py-3 rounded-sm text-sm font-medium tracking-wide"
                  style={{
                    backgroundColor: "var(--color-gold-400)",
                    color: "var(--color-void)",
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    border: "none",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  Send Message
                </button>

              </form>
            </div>

          </div>

          {/* Trust strip */}
          <div
            className="rounded-sm px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
              <span style={{ color: "var(--color-fg)", fontWeight: 500 }}>Secure &amp; responsive support.</span>{" "}
              We typically respond within a few hours during business days. For order issues, please include your order number for faster assistance.
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 2,
  fontSize: 14,
  backgroundColor: "var(--color-forest)",
  border: "1px solid var(--color-card-border)",
  color: "var(--color-fg)",
  fontFamily: "var(--font-body)",
  outline: "none",
  lineHeight: 1.5,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 36,
};
