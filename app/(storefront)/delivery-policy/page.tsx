import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { fmtLKR } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Delivery Policy",
  description: "Auréx delivery zones, shipping fees, and estimated delivery times.",
};

const WA_URL = `https://wa.me/94717660101?text=${encodeURIComponent("Hi Aurex! I have a question about my delivery.")}`;

export default async function DeliveryPolicyPage() {
  const settings = await getSettings();
  const { zones, freeThreshold } = settings.shipping;

  const zoneRows = [
    { name: "Colombo", days: zones.Colombo.days },
    { name: "Colombo Suburbs", days: zones.Suburbs.days },
    { name: "Other Districts", days: zones["Other Districts"].days },
  ];

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
            Delivery Policy
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--color-fg-muted)" }}>Last updated: May 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          {/* Zones table */}
          <div>
            <h2 className="text-xl mb-5" style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}>
              Standard Delivery Zones
            </h2>
            <div
              className="rounded-sm overflow-hidden"
              style={{ border: "1px solid var(--color-card-border)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "var(--color-dark-forest)" }}>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-[0.12em]" style={{ color: "var(--color-fg-tertiary)" }}>Zone</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-[0.12em]" style={{ color: "var(--color-fg-tertiary)" }}>Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {zoneRows.map((z, i) => (
                    <tr
                      key={z.name}
                      style={{
                        borderTop: "1px solid var(--color-card-border)",
                        backgroundColor: i % 2 === 0 ? "var(--color-forest)" : "var(--color-dark-forest)",
                      }}
                    >
                      <td className="px-4 py-3" style={{ color: "var(--color-fg)" }}>{z.name}</td>
                      <td className="px-4 py-3 text-right" style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-mono)" }}>{z.days} business days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs italic" style={{ color: "var(--color-fg-tertiary)" }}>
                Delivery fees are calculated at checkout based on your delivery location.
              </p>
              <p className="text-xs italic" style={{ color: "var(--color-fg-tertiary)" }}>
                Orders over{" "}
                <span style={{ fontFamily: "var(--font-mono)" }}>{fmtLKR(freeThreshold)}</span>{" "}
                qualify for free standard delivery island-wide.
              </p>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* General conditions */}
          <div>
            <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-fg)" }}>
              General Conditions
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              {[
                "Orders are processed Monday to Friday. Orders placed on weekends or public holidays will be processed on the next business day.",
                "Delivery timelines are estimates and may vary depending on courier operations, weather conditions, public holidays, or regional accessibility.",
                "Once your payment is verified, you will receive an order confirmation email. Tracking details will be provided once your order has been dispatched.",
                "If a delivery attempt is unsuccessful, the courier may contact you directly or leave a notification. Please contact us if your parcel has not arrived within the estimated delivery timeframe.",
                "Shipping fees are non-refundable unless the return is due to a defective or incorrect item.",
                "Please ensure your delivery address and contact number are accurate when placing your order to avoid delays.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span style={{ color: "var(--color-gold-400)", flexShrink: 0 }}>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-card-border)" }} />

          {/* Contact */}
          <div
            className="rounded-sm p-6"
            style={{ backgroundColor: "var(--color-dark-forest)", border: "1px solid var(--color-card-border)" }}
          >
            <p className="text-xs tracking-[0.16em] uppercase mb-3" style={{ color: "var(--color-gold-200)", fontFamily: "var(--font-body)" }}>
              Questions about your delivery?
            </p>
            <div className="space-y-2 text-sm" style={{ color: "var(--color-fg-muted)" }}>
              <p>
                Email us at{" "}
                <a
                  href="mailto:hello@wearaurex.com"
                  style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  hello@wearaurex.com
                </a>{" "}
                or use our{" "}
                <Link
                  href="/track-order"
                  style={{ color: "var(--color-gold-400)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  order tracking page
                </Link>
                .
              </p>
              <p>
                For urgent delivery assistance, reach us on{" "}
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
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
