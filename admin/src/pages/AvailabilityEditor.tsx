import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/Button";
import { QueryError } from "../components/ui/QueryError";

interface BookingSettingsRow {
  id: number;
  modes: string[];
  business_start_time: string;
  business_end_time: string;
  business_days: number[];
  blackout_dates: string[];
}

const ALL_MODES = [
  { value: "in-person", label: "In Person" },
  { value: "video", label: "Video Call" },
  { value: "phone", label: "Phone Call" },
];

const ALL_DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

async function fetchSettings(): Promise<BookingSettingsRow> {
  const { data, error } = await supabase!.from("booking_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data as BookingSettingsRow;
}

export function AvailabilityEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["admin-booking-settings"], queryFn: fetchSettings });
  const [form, setForm] = useState<BookingSettingsRow | null>(null);
  const [newBlackout, setNewBlackout] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isError) {
    return <QueryError error={error} />;
  }

  if (isLoading || !form) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading availability…
      </div>
    );
  }

  function toggleMode(mode: string) {
    setForm((prev) => {
      if (!prev) return prev;
      const modes = prev.modes.includes(mode) ? prev.modes.filter((m) => m !== mode) : [...prev.modes, mode];
      return { ...prev, modes };
    });
  }

  function toggleDay(day: number) {
    setForm((prev) => {
      if (!prev) return prev;
      const business_days = prev.business_days.includes(day)
        ? prev.business_days.filter((d) => d !== day)
        : [...prev.business_days, day].sort();
      return { ...prev, business_days };
    });
  }

  function addBlackoutDate() {
    if (!newBlackout || !form) return;
    if (form.blackout_dates.includes(newBlackout)) return;
    setForm({ ...form, blackout_dates: [...form.blackout_dates, newBlackout].sort() });
    setNewBlackout("");
  }

  function removeBlackoutDate(date: string) {
    setForm((prev) => (prev ? { ...prev, blackout_dates: prev.blackout_dates.filter((d) => d !== date) } : prev));
  }

  async function handleSave() {
    if (!form) return;
    setIsSaving(true);
    const { id, ...update } = form;
    await supabase!.from("booking_settings").update(update).eq("id", id);
    await queryClient.invalidateQueries({ queryKey: ["admin-booking-settings"] });
    await queryClient.invalidateQueries({ queryKey: ["booking-settings"] });
    setIsSaving(false);
    setSavedAt(Date.now());
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-navy">Availability</h1>
          <p className="mt-1 text-brand-gray-500">Controls what clients can select on the Book Appointment page.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {savedAt && (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Saved.
        </p>
      )}

      <div className="mt-6 space-y-8">
        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Consultation modes</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {ALL_MODES.map((mode) => (
              <label key={mode.value} className="flex items-center gap-2 text-sm text-brand-gray-600">
                <input type="checkbox" checked={form.modes.includes(mode.value)} onChange={() => toggleMode(mode.value)} />
                {mode.label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Business hours</h2>
          <div className="mt-3 flex items-center gap-4">
            <label className="text-sm">
              Start
              <input
                type="time"
                className="ml-2 rounded-sm border border-brand-gray-300 px-2 py-1.5 text-sm"
                value={form.business_start_time}
                onChange={(e) => setForm({ ...form, business_start_time: e.target.value })}
              />
            </label>
            <label className="text-sm">
              End
              <input
                type="time"
                className="ml-2 rounded-sm border border-brand-gray-300 px-2 py-1.5 text-sm"
                value={form.business_end_time}
                onChange={(e) => setForm({ ...form, business_end_time: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Business days</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {ALL_DAYS.map((day) => (
              <label key={day.value} className="flex items-center gap-2 text-sm text-brand-gray-600">
                <input type="checkbox" checked={form.business_days.includes(day.value)} onChange={() => toggleDay(day.value)} />
                {day.label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Blackout dates</h2>
          <p className="mt-1 text-sm text-brand-gray-500">Specific dates the firm is closed (holidays, etc.).</p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="date"
              className="rounded-sm border border-brand-gray-300 px-3 py-2 text-sm"
              value={newBlackout}
              onChange={(e) => setNewBlackout(e.target.value)}
            />
            <Button variant="ghost" onClick={addBlackoutDate}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Add
            </Button>
          </div>
          <ul className="mt-3 space-y-1.5">
            {form.blackout_dates.map((date) => (
              <li key={date} className="flex items-center justify-between rounded-sm border border-brand-gray-200 px-3 py-2 text-sm">
                {date}
                <button onClick={() => removeBlackoutDate(date)} aria-label={`Remove ${date}`} className="text-brand-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
