import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Auréx collects, uses, and protects your personal data.",
};

const sections = [
  {
    heading: "1. Who We Are",
    body: `Auréx (Pvt) Ltd is a Sri Lanka-based apparel company operating the wearaurex.com website. We respect your privacy and are committed to protecting your personal information.\n\nWe collect only the information necessary to process orders, provide customer support, and improve your shopping experience.\n\nOur services are intended for individuals aged 18 and above, or those using the website under the supervision of a parent or guardian.`,
  },
  {
    heading: "2. Information We Collect",
    body: `When you place an order or create an account, we collect personal information including your name, email address, phone number, and delivery address. We also collect your order history.\n\nPayment confirmation details submitted by customers — including payment references and payer names — are used solely for order verification purposes. We do not store card numbers; all payments are made via bank transfer.`,
  },
  {
    heading: "3. How We Use Your Information",
    body: `We use your information to process and deliver orders, communicate order updates, respond to customer support queries, and improve our products and services. We do not sell or rent your personal data to third parties.\n\nPromotional emails are only sent to users who have opted in to receive marketing communications. You may unsubscribe at any time via the link in any email we send.`,
  },
  {
    heading: "4. Data Sharing",
    body: `We share your delivery address and contact number with our courier partners solely for the purpose of fulfilling your order. We do not share identifiable personal data with any third parties for marketing purposes.\n\nData may be securely processed and stored using trusted third-party cloud service providers.`,
  },
  {
    heading: "5. Cookies & Analytics",
    body: `Our website uses cookies to maintain your session, remember your cart, and remember your preferences. These cookies are functional and do not track you across third-party websites.\n\nWe may use analytics tools to understand website performance and improve your experience. These tools may collect anonymised usage information. You can disable cookies in your browser settings, though some features may not function correctly.`,
  },
  {
    heading: "6. Data Retention",
    body: `We retain your personal data for as long as your account is active or as required to fulfil orders and comply with legal obligations. You may request deletion of your account and associated data by contacting us at hello@wearaurex.com.`,
  },
  {
    heading: "7. Security",
    body: `We implement industry-standard security measures including encrypted data transmission (HTTPS) and secure authentication. Account passwords are encrypted and cannot be viewed by our team.\n\nNo transmission over the internet is fully secure, and we cannot guarantee absolute security. We encourage you to use a strong, unique password for your Auréx account.`,
  },
  {
    heading: "8. Your Rights",
    body: `You have the right to access, correct, or delete your personal data held by us. To exercise these rights, contact us at hello@wearaurex.com. We will respond within 14 business days.`,
  },
  {
    heading: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Material changes will be communicated via email or a notice on our website. Continued use of our services after such changes constitutes your acceptance of the updated policy.`,
  },
  {
    heading: "10. Contact",
    body: null,
    isContact: true,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>
      <section
        className="py-16 border-b"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-4"
            style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
          >
            Legal
          </p>
          <h1
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)", letterSpacing: "-0.01em" }}
          >
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--color-fg-muted)" }}>Last updated: May 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {sections.map(({ heading, body, isContact }) => (
            <div key={heading}>
              <h2
                className="text-lg mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
              >
                {heading}
              </h2>

              {isContact ? (
                <div
                  className="rounded-sm p-5"
                  style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
                >
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-fg-muted)" }}>
                    For any privacy-related queries, please reach out to us:
                  </p>
                  <div className="space-y-2 text-sm" style={{ color: "var(--color-fg-muted)" }}>
                    <p style={{ color: "var(--color-fg)", fontWeight: 500 }}>Auréx (Pvt) Ltd</p>
                    <p>Colombo, Sri Lanka</p>
                    <p>
                      <a
                        href="mailto:hello@wearaurex.com"
                        style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        hello@wearaurex.com
                      </a>
                    </p>
                    <p>
                      <a
                        href={`https://wa.me/94717660101?text=${encodeURIComponent("Hi Aurex! I have a question about your Privacy Policy.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        WhatsApp: +94 71 766 0101
                      </a>
                    </p>
                    <p className="pt-1">
                      <Link
                        href="/contact"
                        style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        Visit our Contact page →
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {(body ?? "").split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
