import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CheckoutClient from "@/components/storefront/CheckoutClient";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const settings = await getSettings();

  return (
    <CheckoutClient
      userEmail={user?.email ?? ""}
      userId={user?.id ?? null}
      bank={settings.bank}
      shipping={settings.shipping}
    />
  );
}
