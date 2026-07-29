export type ConsultationMode = "in-person" | "video" | "phone" | "";
export type PreferredLanguage = "English" | "French" | "Kinyarwanda";

export interface BookingFormState {
  matterType: string;
  mode: ConsultationMode;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  language: PreferredLanguage;
  description: string;
  consent: boolean;
}

export type BookingFormErrors = Partial<Record<keyof BookingFormState, string>>;

export const initialBookingForm: BookingFormState = {
  matterType: "",
  mode: "",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
  language: "English",
  description: "",
  consent: false,
};
