import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/**
 * Submits the contact form. Writes to the `contact_messages` table in
 * Supabase (visible in the admin app's inbox) when configured; otherwise
 * simulates a network call so the form still works in local/offline demos.
 */
export async function submitContactMessage(payload: ContactMessagePayload): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[submitContactMessage] payload:", payload);

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
    });
    if (error) throw error;
  } else {
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
}
