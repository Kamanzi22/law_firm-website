import { supabase } from "../supabaseClient";
import { firm as fallbackFirm, type FirmData, type OfficeHours } from "../../data/firm";

export async function fetchFirmProfile(): Promise<FirmData> {
  const [{ data: profile, error: profileError }, { data: hours, error: hoursError }] = await Promise.all([
    supabase!.from("firm_profile").select("*").eq("id", 1).single(),
    supabase!.from("office_hours").select("*").order("sort_order", { ascending: true }),
  ]);

  if (profileError) throw profileError;
  if (hoursError) throw hoursError;
  if (!profile) return fallbackFirm;

  const officeHours: OfficeHours[] = (hours ?? []).map((row) => ({
    day: row.day_label,
    hours: row.hours_label,
  }));

  const result: FirmData = {
    name: profile.name,
    shortName: profile.short_name,
    tagline: profile.tagline,
    positioning: profile.positioning,
    founded: profile.founded_year,
    logoUrl: profile.logo_url ?? null,
    address: {
      line1: profile.address_line1,
      line2: profile.address_line2,
      city: profile.city,
      country: profile.country,
    },
    phone: profile.phone,
    phoneHref: profile.phone_href,
    whatsappNumber: profile.whatsapp_number,
    email: profile.email,
    mapEmbedPlaceholder: `${profile.address_line1}, ${profile.address_line2}, ${profile.city}, ${profile.country}`,
    socials: {
      linkedin: profile.linkedin_url ?? "",
      twitter: profile.twitter_url ?? "",
      facebook: profile.facebook_url ?? "",
    },
    memberships: profile.memberships ?? [],
    stats: {
      yearsExperience: profile.years_experience,
      casesHandled: profile.cases_handled,
      clientsServed: profile.clients_served,
      teamSize: profile.team_size,
    },
    hours: officeHours.length > 0 ? officeHours : fallbackFirm.hours,
  };

  return result;
}
