// REPLACE: fallback booking availability, used until connected to Supabase
// (or if the live booking_settings row is ever unreachable). Edit the real
// values from the admin app once connected — this file is just the offline
// default.

export type ConsultationModeValue = "in-person" | "video" | "phone";

export interface BookingSettingsData {
  modes: ConsultationModeValue[];
  businessStartTime: string; // "HH:mm"
  businessEndTime: string; // "HH:mm"
  businessDays: number[]; // 1 = Monday .. 7 = Sunday (ISO weekday)
  blackoutDates: string[]; // ISO dates (yyyy-mm-dd) the firm is closed
}

export const bookingSettings: BookingSettingsData = {
  modes: ["in-person", "video", "phone"],
  businessStartTime: "08:00",
  businessEndTime: "17:00",
  businessDays: [1, 2, 3, 4, 5],
  blackoutDates: [],
};
