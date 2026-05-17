import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CheckoutClient from "@/components/storefront/CheckoutClient";
import { getSettings } from "@/lib/settings";
import { getActiveCourierCities } from "@/lib/courier";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as unknown as any;

  const [settings, cities, productsRaw] = await Promise.all([
    getSettings(),
    getActiveCourierCities(),
    sb.from("products").select("id, weight_grams").then((r: { data: { id: string; weight_grams: number }[] | null }) => r.data ?? []),
  ]);

  const productWeights: Record<string, number> = Object.fromEntries(
    (productsRaw as { id: string; weight_grams: number }[]).map((p) => [p.id, p.weight_grams ?? 275])
  );

  return (
    <CheckoutClient
      userEmail={user?.email ?? ""}
      userId={user?.id ?? null}
      bank={settings.bank}
      freeShippingThreshold={settings.shipping.freeThreshold}
      cities={cities}
      productWeights={productWeights}
    />
  );
}
