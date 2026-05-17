import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCourierCitiesPaginated, COURIER_PAGE_SIZE } from "@/lib/courier";
import CourierCitiesManager from "@/components/admin/CourierCitiesManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Courier Cities | Admin" };

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminCourierPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staffRow } = await supabase.from("staff").select("id").eq("id", user.id).single();
  if (!staffRow) redirect("/admin/login");

  const { page: pageStr, q = "" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const result = await getCourierCitiesPaginated(page, q, COURIER_PAGE_SIZE);

  return (
    <div className="p-8" style={{ backgroundColor: "var(--color-void)", minHeight: "100vh" }}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-gold-200)" }}>
          Admin Console
        </p>
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-fg)" }}>
          Courier Cities
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-fg-muted)" }}>
          Manage delivery cities and courier charges. Active cities appear in the checkout city dropdown.
        </p>
      </div>

      <div className="max-w-4xl">
        <CourierCitiesManager
          initialCities={result.cities}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          initialQuery={q}
        />
      </div>
    </div>
  );
}
