import { supabase } from "../supabaseClient";
import type { BookingSettingsData } from "../../data/bookingSettings";
import { bookingSettings as fallback } from "../../data/bookingSettings";

export async function fetchBookingSettings(): Promise<BookingSettingsData> {
  const { data, error } = await supabase!.from("booking_settings").select("*").eq("id", 1).single();

  if (error) throw error;
  if (!data) return fallback;

  return {
    modes: (data.modes ?? fallback.modes) as BookingSettingsData["modes"],
    businessStartTime: (data.business_start_time ?? fallback.businessStartTime).slice(0, 5),
    businessEndTime: (data.business_end_time ?? fallback.businessEndTime).slice(0, 5),
    businessDays: data.business_days ?? fallback.businessDays,
    blackoutDates: data.blackout_dates ?? fallback.blackoutDates,
  };
}
