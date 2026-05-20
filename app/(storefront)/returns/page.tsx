import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Auréx return and exchange policy. Learn how to return or exchange your order.",
};

const WA_URL = `https://wa.me/94717660101?text=${encodeURIComponent("Hi Aurex! I'd like to initiate a return.")}`;

export default function ReturnsPage() {
  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>
      {/* Header */}
      <section
        className="py-16 border-b"
        style={{ backgroundColor: "var(--color-dark-forest)", borderColor: "var(--color-card-border)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-4"
            style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
          >
            Auréx
          </p>
          <h1
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)", letterSpacing: "-0.01em" }}
          >
            Return Policy
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}>
            Last updated: May 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          {/* Reassurance */}
          <div
            className="rounded-sm px-6 py-5"
            style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-body)" }}>
              <span style={{ color: "var(--color-fg)", fontWeight: 500 }}>We want you to feel confident shopping with Auréx.</span>{" "}
              If something isn&apos;t right, we&apos;ll do our best to make it right.
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
            >
              Eligibility
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              <p>
                We accept returns and exchanges within{" "}
                <strong style={{ color: "var(--color-fg)" }}>7 days of delivery</strong>, provided the item is unworn,
                unwashed, and in its original condition with all tags attached.
              </p>
              <p
                className="rounded-sm px-4 py-3 text-sm"
                style={{ backgroundColor: "rgba(212,162,76,0.06)", border: "1px solid rgba(212,162,76,0.2)", color: "var(--color-fg-muted)" }}
              >
                <strong style={{ color: "var(--color-gold-200)" }}>Need a different size?</strong>{" "}
                We offer easy size exchanges subject to availability. Orders of{" "}
                <strong style={{ color: "var(--color-fg)" }}>LKR 15,000 or above</strong> include one complimentary
                size exchange within Sri Lanka.
              </p>
              <p>
                Items that show signs of wear, washing, stains, odours, or damage cannot be accepted for return.
              </p>
              <p>
                Items marked as <strong style={{ color: "var(--color-fg)" }}>Sale or Final Sale</strong> are not
                eligible for return or exchange.
              </p>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* Non-returnable Items */}
          <div>
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
            >
              Non-returnable Items
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-fg-muted)" }}>
              The following items cannot be returned or exchanged under any circumstances:
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--color-fg-muted)" }}>
              {[
                "Innerwear and socks",
                "Items with custom or personalised embroidery",
                "Clearance and Sale items",
                "Gift cards",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span style={{ color: "var(--color-gold-500)", marginTop: 1, flexShrink: 0 }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* How to Return */}
          <div>
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
            >
              How to Initiate a Return
            </h2>
            <ol className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              {[
                {
                  step: "1",
                  text: "Email us at returns@wearaurex.com or WhatsApp us at +94 71 766 0101 with your order number, the item(s) you wish to return, and the reason.",
                },
                {
                  step: "2",
                  text: "We'll respond within 2 business days with return instructions.",
                },
                {
                  step: "3",
                  text: "Please return the item in its original packaging with all tags attached and your order number included.",
                },
                {
                  step: "4",
                  text: "Once we receive and inspect the item, we'll process your exchange or refund within 5 business days.",
                },
              ].map(({ step, text }) => (
                <li key={step} className="flex gap-4">
                  <span
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(212,162,76,0.12)",
                      color: "var(--color-gold-400)",
                      fontFamily: "var(--font-mono)",
                      border: "1px solid rgba(212,162,76,0.3)",
                    }}
                  >
                    {step}
                  </span>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* Return Shipping */}
          <div>
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
            >
              Return Shipping
            </h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              <p>
                Customers are responsible for return shipping costs unless the item received is defective or incorrect.
                We recommend using a tracked courier service — Auréx is not responsible for items lost in transit.
              </p>
              <p>
                For orders of <strong style={{ color: "var(--color-fg)" }}>LKR 15,000 or above</strong>, one
                complimentary size exchange is included. We&apos;ll cover the return courier arrangements for qualifying
                exchanges.
              </p>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* Refunds */}
          <div>
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
            >
              Refunds
            </h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              <p>
                Approved refunds are issued as a bank transfer to your account within{" "}
                <strong style={{ color: "var(--color-fg)" }}>5–7 business days</strong> of approval.
              </p>
              <p>
                Shipping fees are non-refundable unless the return is due to a defect or error on our part.
              </p>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* Exchanges */}
          <div>
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
            >
              Exchanges
            </h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              <p>
                We offer size and colour exchanges subject to availability. If your preferred exchange is out of stock,
                we&apos;ll issue a full refund instead.
              </p>
              <p>
                For orders of <strong style={{ color: "var(--color-fg)" }}>LKR 15,000 or above</strong>, one
                complimentary size exchange is available within Sri Lanka. Exchange items are dispatched once we receive
                and inspect the returned item.
              </p>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* Defective items */}
          <div>
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}
            >
              Defective or Incorrect Items
            </h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              <p>
                If you receive a defective, damaged, or incorrect item, please contact us within{" "}
                <strong style={{ color: "var(--color-fg)" }}>48 hours</strong> of delivery with photos of the issue.
                We&apos;ll arrange a free return and send a replacement or issue a full refund — at no cost to you.
              </p>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* Contact */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
          >
            <p
              className="text-xs tracking-[0.16em] uppercase mb-4"
              style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}
            >
              Need Help?
            </p>
            <div className="space-y-3 text-sm" style={{ color: "var(--color-fg-muted)" }}>
              <p>
                Email us at{" "}
                <a
                  href="mailto:returns@wearaurex.com"
                  style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  returns@wearaurex.com
                </a>{" "}
                with your order number and we&apos;ll get back to you within 2 business days.
              </p>
              <p>
                For urgent assistance, reach us on{" "}
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  WhatsApp at +94 71 766 0101
                </a>{" "}
                during business hours.
              </p>
              <p>
                You can also visit our{" "}
                <Link
                  href="/contact"
                  style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  Contact page
                </Link>{" "}
                for all support channels.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
