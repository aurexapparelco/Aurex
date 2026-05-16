import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import type { Metadata } from "next";
import type { Staff } from "@/types/database.types";

export const metadata: Metadata = { title: "Settings | Admin" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRaw } = await supabase
    .from("staff")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!staffRaw) redirect("/admin/login");

  const staff = staffRaw as Staff;
  const settings = await getSettings();

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}
    >
      <div className="mb-8">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: "var(--color-gold-200)" }}
        >
          Admin Console
        </p>
        <h1
          className="text-3xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: "var(--color-fg)",
          }}
        >
          Settings
        </h1>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Staff info — read-only */}
        <div
          className="rounded-sm p-6"
          style={{
            backgroundColor: "var(--color-dark-forest)",
            border: "1px solid var(--color-card-border)",
          }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--color-gold-200)" }}
          >
            Your Account
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-fg-muted)" }}>Email</span>
              <span style={{ color: "var(--color-fg)" }}>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-fg-muted)" }}>Role</span>
              <span style={{ color: "var(--color-gold-400)" }}>
                {staff.role}
              </span>
            </div>
          </div>
        </div>

        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
