import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getHomeContent } from "@/lib/home-content";
import HomeContentForm from "@/components/admin/HomeContentForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home Content | Admin" };

export default async function AdminHomePage() {
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

  const content = await getHomeContent();

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
          Home Content
        </h1>
      </div>

      <div className="max-w-2xl">
        <HomeContentForm initial={content} />
      </div>
    </div>
  );
}
