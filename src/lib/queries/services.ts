import { supabase } from "../supabaseClient";
import type { Service } from "../../data/services";

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase!
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(
    (row): Service => ({
      slug: row.slug,
      name: row.name,
      shortDescription: row.short_description,
      overview: row.overview,
      helpWith: row.help_with ?? [],
      process: row.process ?? [],
      icon: row.icon as Service["icon"],
    }),
  );
}
