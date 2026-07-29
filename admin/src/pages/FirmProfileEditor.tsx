import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/Button";
import { TextField, TextAreaField } from "../components/ui/Field";
import { ImageUploadField } from "../components/ui/ImageUploadField";

interface FirmProfileRow {
  id: number;
  name: string;
  short_name: string;
  tagline: string;
  positioning: string;
  founded_year: number;
  logo_url: string | null;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  phone: string;
  phone_href: string;
  whatsapp_number: string;
  email: string;
  linkedin_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  memberships: string[];
  years_experience: number;
  cases_handled: string;
  clients_served: string;
  team_size: number;
}

interface OfficeHourRow {
  id: number;
  day_label: string;
  hours_label: string;
  sort_order: number;
}

async function fetchProfile() {
  const [{ data: profile, error: profileError }, { data: hours, error: hoursError }] = await Promise.all([
    supabase!.from("firm_profile").select("*").eq("id", 1).single(),
    supabase!.from("office_hours").select("*").order("sort_order"),
  ]);
  if (profileError) throw profileError;
  if (hoursError) throw hoursError;
  return { profile: profile as FirmProfileRow, hours: (hours ?? []) as OfficeHourRow[] };
}

export function FirmProfileEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-firm-profile"], queryFn: fetchProfile });

  const [form, setForm] = useState<FirmProfileRow | null>(null);
  const [hours, setHours] = useState<OfficeHourRow[]>([]);
  const [membershipsText, setMembershipsText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setForm(data.profile);
      setHours(data.hours);
      setMembershipsText(data.profile.memberships.join(", "));
    }
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading firm profile…
      </div>
    );
  }

  function updateField<K extends keyof FirmProfileRow>(field: K, value: FirmProfileRow[K]) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function updateHour(id: number, field: keyof OfficeHourRow, value: string) {
    setHours((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  }

  function addHourRow() {
    setHours((prev) => [
      ...prev,
      { id: -Date.now(), day_label: "", hours_label: "", sort_order: prev.length + 1 },
    ]);
  }

  function removeHourRow(id: number) {
    setHours((prev) => prev.filter((h) => h.id !== id));
  }

  async function handleSave() {
    if (!form) return;
    setIsSaving(true);

    const memberships = membershipsText
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const { id, ...profileUpdate } = form;
    await supabase!.from("firm_profile").update({ ...profileUpdate, memberships }).eq("id", id);

    // Office hours: delete removed rows, upsert the rest.
    const existingIds = hours.filter((h) => h.id > 0).map((h) => h.id);
    await supabase!.from("office_hours").delete().not("id", "in", `(${existingIds.join(",") || "0"})`);

    for (const [index, hour] of hours.entries()) {
      if (hour.id > 0) {
        await supabase!
          .from("office_hours")
          .update({ day_label: hour.day_label, hours_label: hour.hours_label, sort_order: index })
          .eq("id", hour.id);
      } else {
        await supabase!
          .from("office_hours")
          .insert({ day_label: hour.day_label, hours_label: hour.hours_label, sort_order: index });
      }
    }

    await queryClient.invalidateQueries({ queryKey: ["admin-firm-profile"] });
    await queryClient.invalidateQueries({ queryKey: ["firm-profile"] });
    setIsSaving(false);
    setSavedAt(Date.now());
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-navy">Firm Profile</h1>
          <p className="mt-1 text-brand-gray-500">
            Controls the name, logo, contact details and stats shown across the client site.
          </p>
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
          <h2 className="font-display text-lg font-semibold text-brand-navy">Identity</h2>
          <div className="mt-4 space-y-4">
            <ImageUploadField
              label="Logo"
              folder="logos"
              value={form.logo_url}
              onChange={(url) => updateField("logo_url", url)}
              shape="wide"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="name" label="Full name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              <TextField
                id="short_name"
                label="Short name (header/footer)"
                value={form.short_name}
                onChange={(e) => updateField("short_name", e.target.value)}
              />
            </div>
            <TextField id="tagline" label="Tagline" value={form.tagline} onChange={(e) => updateField("tagline", e.target.value)} />
            <TextAreaField
              id="positioning"
              label="Positioning statement (hero subtext)"
              rows={3}
              value={form.positioning}
              onChange={(e) => updateField("positioning", e.target.value)}
            />
            <TextField
              id="founded_year"
              label="Founded year"
              type="number"
              value={form.founded_year}
              onChange={(e) => updateField("founded_year", Number(e.target.value))}
            />
          </div>
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Contact & Address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextField id="address_line1" label="Address line 1" value={form.address_line1} onChange={(e) => updateField("address_line1", e.target.value)} />
            <TextField id="address_line2" label="Address line 2" value={form.address_line2} onChange={(e) => updateField("address_line2", e.target.value)} />
            <TextField id="city" label="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
            <TextField id="country" label="Country" value={form.country} onChange={(e) => updateField("country", e.target.value)} />
            <TextField id="phone" label="Phone (display)" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
            <TextField id="phone_href" label="Phone (tel: link, digits only)" value={form.phone_href} onChange={(e) => updateField("phone_href", e.target.value)} />
            <TextField
              id="whatsapp_number"
              label="WhatsApp number (digits only, intl format)"
              value={form.whatsapp_number}
              onChange={(e) => updateField("whatsapp_number", e.target.value)}
            />
            <TextField id="email" label="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          </div>
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Social Links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <TextField id="linkedin" label="LinkedIn URL" value={form.linkedin_url ?? ""} onChange={(e) => updateField("linkedin_url", e.target.value)} />
            <TextField id="twitter" label="Twitter / X URL" value={form.twitter_url ?? ""} onChange={(e) => updateField("twitter_url", e.target.value)} />
            <TextField id="facebook" label="Facebook URL" value={form.facebook_url ?? ""} onChange={(e) => updateField("facebook_url", e.target.value)} />
          </div>
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Stats & Memberships</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextField
              id="years_experience"
              label="Years of experience"
              type="number"
              value={form.years_experience}
              onChange={(e) => updateField("years_experience", Number(e.target.value))}
            />
            <TextField id="cases_handled" label={'Cases handled (e.g. "500+")'} value={form.cases_handled} onChange={(e) => updateField("cases_handled", e.target.value)} />
            <TextField id="clients_served" label={'Clients served (e.g. "220+")'} value={form.clients_served} onChange={(e) => updateField("clients_served", e.target.value)} />
            <TextField
              id="team_size"
              label="Team size"
              type="number"
              value={form.team_size}
              onChange={(e) => updateField("team_size", Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <TextAreaField
              id="memberships"
              label="Bar / society memberships (comma-separated)"
              rows={2}
              value={membershipsText}
              onChange={(e) => setMembershipsText(e.target.value)}
            />
          </div>
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-brand-navy">Business Hours</h2>
            <Button variant="ghost" onClick={addHourRow}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Add row
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {hours.map((hour) => (
              <div key={hour.id} className="flex items-center gap-3">
                <input
                  className="w-1/2 rounded-sm border border-brand-gray-300 px-3 py-2 text-sm"
                  placeholder="Day(s), e.g. Monday – Friday"
                  value={hour.day_label}
                  onChange={(e) => updateHour(hour.id, "day_label", e.target.value)}
                />
                <input
                  className="w-1/2 rounded-sm border border-brand-gray-300 px-3 py-2 text-sm"
                  placeholder="Hours, e.g. 8:00 AM – 5:30 PM"
                  value={hour.hours_label}
                  onChange={(e) => updateHour(hour.id, "hours_label", e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Remove row"
                  onClick={() => removeHourRow(hour.id)}
                  className="rounded-sm p-2 text-brand-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
