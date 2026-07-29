import type { BookingSettingsData } from "../data/bookingSettings";

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Accepts loose international/local formats, e.g. "+250 788 123 456" or "0788123456".
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

// JS Date#getDay() is 0=Sun..6=Sat; our businessDays setting is ISO 1=Mon..7=Sun.
function toIsoWeekday(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(`${dateStr}T00:00:00`);
  return selected.getTime() < today.getTime();
}

export function isValidBookingDate(dateStr: string, settings: BookingSettingsData): boolean {
  if (!dateStr) return false;
  const selected = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(selected.getTime())) return false;
  if (isPastDate(dateStr)) return false;
  if (!settings.businessDays.includes(toIsoWeekday(selected))) return false;
  if (settings.blackoutDates.includes(dateStr)) return false;
  return true;
}

// Generates half-hour slots between two "HH:mm" times, inclusive of start,
// exclusive of the final half-hour past end (last bookable slot == end time).
export function generateBusinessHourSlots(startTime: string, endTime: string): string[] {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  const slots: string[] = [];
  for (let total = startTotal; total <= endTotal; total += 30) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }
  return slots;
}

export function minDateString(): string {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}
