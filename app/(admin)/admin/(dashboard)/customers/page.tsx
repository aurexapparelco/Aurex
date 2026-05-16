import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Customer } from "@/types/database.types";

export const metadata: Metadata = { title: "Customers | Admin" };

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRow } = await supabase
    .from("staff")
    .select("id")
    .eq("id", user.id)
    .single();
  if (!staffRow) redirect("/admin/login");

  const { data: customersRaw } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  const customers = (customersRaw ?? []) as Customer[];

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
          Customers
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-mono)" }}
        >
          {customers.length} registered
        </p>
      </div>

      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid var(--color-card-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                backgroundColor: "var(--color-dark-forest)",
                borderBottom: "1px solid var(--color-card-border)",
              }}
            >
              {["Name", "Phone", "City", "Joined"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs tracking-[0.12em] uppercase font-normal"
                  style={{ color: "var(--color-fg-tertiary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr
                key={c.id}
                style={{
                  backgroundColor:
                    i % 2 === 0
                      ? "var(--color-forest)"
                      : "var(--color-dark-forest)",
                  borderBottom: "1px solid var(--color-card-border)",
                }}
              >
                <td className="px-5 py-3" style={{ color: "var(--color-fg)" }}>
                  {c.full_name || "—"}
                </td>
                <td
                  className="px-5 py-3"
                  style={{
                    color: "var(--color-fg-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                  }}
                >
                  {c.phone || "—"}
                </td>
                <td
                  className="px-5 py-3"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {c.city || "—"}
                </td>
                <td
                  className="px-5 py-3"
                  style={{
                    color: "var(--color-fg-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                  }}
                >
                  {new Date(c.created_at).toLocaleDateString("en-LK", {
                    timeZone: "Asia/Colombo",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div
            className="py-12 text-center"
            style={{ backgroundColor: "var(--color-dark-forest)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
              No customers yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
