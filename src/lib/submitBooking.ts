import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface BookingPayload {
  matterType: string; // service slug
  mode: "in-person" | "video" | "phone";
  date: string; // ISO date, yyyy-mm-dd
  time: string; // HH:mm
  name: string;
  email: string;
  phone: string;
  language: "English" | "French" | "Kinyarwanda";
  description: string;
  consent: boolean;
}

export interface BookingResult {
  success: true;
  referenceNumber: string;
  submittedAt: string;
}

function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `KP-${year}-${random}`;
}

/**
 * Submits a booking request. Writes to the `bookings` table in Supabase
 * (visible in the admin app's inbox) when VITE_SUPABASE_URL /
 * VITE_SUPABASE_ANON_KEY are set; otherwise simulates a network call so the
 * flow still works in local/offline demos. Every caller only depends on
 * `BookingPayload` in, `Promise<BookingResult>` out — so nothing else in the
 * booking flow needs to change if this is swapped for a different backend.
 */
export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  // eslint-disable-next-line no-console
  console.log("[submitBooking] payload:", payload);

  const referenceNumber = generateReferenceNumber();

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("bookings").insert({
      reference_number: referenceNumber,
      matter_type: payload.matterType,
      mode: payload.mode,
      preferred_date: payload.date,
      preferred_time: payload.time,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      language: payload.language,
      description: payload.description,
      consent: payload.consent,
    });
    if (error) throw error;
  } else {
    // No backend configured — simulate network latency for the demo.
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const result: BookingResult = {
    success: true,
    referenceNumber,
    submittedAt: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log("[submitBooking] result:", result);

  return result;
}
