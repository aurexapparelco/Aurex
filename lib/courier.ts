import { createClient } from "@/lib/supabase/server";

export interface CourierCity {
  id: number;
  name: string;
  charge_first_kg: number;
  charge_per_additional_kg: number;
  is_active: boolean;
}

export interface CourierCitiesPage {
  cities: CourierCity[];
  total: number;
  page: number;
  pageSize: number;
}

export const COURIER_PAGE_SIZE = 50;

export async function getActiveCourierCities(): Promise<CourierCity[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courier_cities")
    .select("id, name, charge_first_kg, charge_per_additional_kg, is_active")
    .eq("is_active", true)
    .order("name");
  return (data ?? []) as CourierCity[];
}

export async function getCourierCitiesPaginated(
  page: number,
  q: string,
  pageSize = COURIER_PAGE_SIZE,
): Promise<CourierCitiesPage> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as unknown as any)
    .from("courier_cities")
    .select("id, name, charge_first_kg, charge_per_additional_kg, is_active", { count: "exact" })
    .order("name");

  if (q.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data, count } = await query.range(from, to);

  return {
    cities: (data ?? []) as CourierCity[],
    total: count ?? 0,
    page,
    pageSize,
  };
}
