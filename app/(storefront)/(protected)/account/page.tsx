import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import AccountClient from "@/components/storefront/AccountClient";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [ordersResult, settings] = await Promise.all([
    supabase
      .from("orders")
      .select(`*, order_lines(*)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    getSettings(),
  ]);

  return (
    <AccountClient
      user={{ id: user.id, email: user.email ?? "", fullName: user.user_metadata?.full_name ?? "" }}
      orders={ordersResult.data ?? []}
      bankDetails={settings.bank}
    />
  );
}
