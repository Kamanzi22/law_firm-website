export function formatDateLong(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime12h(time: string): string {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minuteStr} ${period}`;
}

export function formatArticleDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const WEEKDAY_LABELS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function describeBusinessDays(businessDays: number[]): string {
  const sorted = [...businessDays].sort((a, b) => a - b);
  if (sorted.length === 5 && sorted.every((day, i) => day === i + 1)) {
    return "Weekdays only (Monday–Friday)";
  }
  return `Available: ${sorted.map((day) => WEEKDAY_LABELS[day]).join(", ")}`;
}
