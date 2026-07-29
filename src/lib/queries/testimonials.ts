import { supabase } from "../supabaseClient";
import type { Testimonial } from "../../data/testimonials";

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase!
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(
    (row): Testimonial => ({
      quote: row.quote,
      author: row.author,
      role: row.role,
      company: row.company,
    }),
  );
}
