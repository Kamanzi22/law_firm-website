import { supabase } from "../supabaseClient";
import type { TeamMember } from "../../data/team";

export async function fetchTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase!
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(
    (row): TeamMember => ({
      slug: row.slug,
      name: row.name,
      role: row.role,
      photo: row.photo_url ?? "/images/team/placeholder.svg",
      bio: row.bio,
      focusAreas: row.focus_area_slugs ?? [],
      education: row.education ?? [],
      email: row.email ?? "",
    }),
  );
}
