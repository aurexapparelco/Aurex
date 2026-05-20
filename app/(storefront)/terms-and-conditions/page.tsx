import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Auréx terms and conditions of sale and use.",
};

const sections = [
  {
    heading: "1. General",
    body: `These Terms and Conditions govern the use of the Auréx website and the purchase of products from Auréx (Pvt) Ltd ("Auréx", "we", "us"). By placing an order, you agree to these terms in full. We reserve the right to update these terms at any time; continued use of the site constitutes acceptance of the current version.\n\nWe are committed to providing a smooth and reliable shopping experience for every Auréx customer.`,
  },
  {
    heading: "2. Products & Pricing",
    body: `All prices are displayed in Sri Lankan Rupees (LKR) and are inclusive of any applicable taxes. Auréx reserves the right to change prices at any time without notice. Product images are for illustration purposes; minor colour variations may occur due to screen calibration.\n\nProduct availability is subject to change without notice. We do not guarantee that product descriptions are error-free and reserve the right to correct any inaccuracies.`,
  },
  {
    heading: "3. Orders & Payment",
    body: `Orders are accepted via the website only. All payments are processed via bank transfer to Commercial Bank of Ceylon. An order is confirmed only after payment is received and verified by our team. Payment confirmation is typically completed within business hours.\n\nPlease use your order number as the payment reference when making a bank transfer to avoid delays in verification.\n\nAuréx reserves the right to cancel or refuse orders in cases including pricing errors, suspected fraud, or unavailable stock. If your order is cancelled, any payment received will be refunded in full.\n\nAuréx will never request payments to personal bank accounts. All payment details are published officially on our website and order confirmation emails. If in doubt, contact us before making any payment.`,
  },
  {
    heading: "4. Shipping & Delivery",
    body: `We aim to dispatch all confirmed orders promptly. Delivery timelines may vary depending on your location and courier operations. Estimated delivery times are provided at checkout but are not guaranteed.\n\nAuréx is not responsible for delays caused by courier services, public holidays, or events beyond our control. Shipping fees are non-refundable unless the return is due to an error on our part. Responsibility for the item transfers to the customer upon successful delivery.`,
  },
  {
    heading: "5. Returns & Exchanges",
    body: `Returns and exchanges are accepted within 7 days of delivery, subject to our Return Policy. Items must be unworn, unwashed, and in their original condition with all tags attached. Items marked as Sale or Final Sale are not eligible for return.\n\nPlease review our Return Policy page for full details, including our complimentary size exchange offer for qualifying orders.`,
  },
  {
    heading: "6. Privacy & Data",
    body: `Customer information — including name, address, phone number, and email — is used solely for order processing, delivery, and customer support. Auréx does not sell or share personal information with third parties except where necessary to fulfil your order (such as delivery services).\n\nFor full details on how we handle your data, please review our Privacy Policy.`,
  },
  {
    heading: "7. Intellectual Property",
    body: `All content on this website — including text, images, logos, and design elements — is the intellectual property of Auréx (Pvt) Ltd and may not be reproduced, distributed, or used without prior written permission.`,
  },
  {
    heading: "8. Limitation of Liability",
    body: `To the fullest extent permitted by law, Auréx shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the product in question.`,
  },
  {
    heading: "9. Governing Law",
    body: `These terms are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.`,
  },
  {
    heading: "10. Contact",
    body: null,
    isContact: true,
  },
];

export default function TermsPage() {
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
            Terms & Conditions
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
                    For any queries regarding these terms, please reach out to us:
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
                        href={`https://wa.me/94717660101?text=${encodeURIComponent("Hi Aurex! I have a question about your Terms & Conditions.")}`}
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
