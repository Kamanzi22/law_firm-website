import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { QueryError } from "../components/ui/QueryError";

interface BookingRow {
  id: string;
  reference_number: string;
  matter_type: string;
  mode: string;
  preferred_date: string;
  preferred_time: string;
  name: string;
  email: string;
  phone: string;
  language: string;
  description: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

const STATUS_OPTIONS: BookingRow["status"][] = ["pending", "confirmed", "completed", "cancelled"];

const statusColors: Record<BookingRow["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-brand-gray-100 text-brand-gray-500",
};

async function fetchBookings(): Promise<BookingRow[]> {
  const { data, error } = await supabase!.from("bookings").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as BookingRow[];
}

export function BookingsInbox() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading, isError, error } = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchBookings });

  async function updateStatus(id: string, status: BookingRow["status"]) {
    await supabase!.from("bookings").update({ status }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-counts"] });
  }

  if (isError) {
    return <QueryError error={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-brand-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading bookings…
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-navy">Bookings</h1>
      <p className="mt-1 text-brand-gray-500">Consultation requests submitted from the Book Appointment page.</p>

      <div className="mt-6 space-y-3">
        {(bookings ?? []).length === 0 && <p className="text-brand-gray-400">No bookings yet.</p>}
        {(bookings ?? []).map((booking) => (
          <div key={booking.id} className="rounded-sm border border-brand-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-brand-navy">{booking.name}</p>
                <p className="text-xs text-brand-gray-400">
                  {booking.reference_number} · Submitted {new Date(booking.created_at).toLocaleString()}
                </p>
              </div>
              <select
                value={booking.status}
                onChange={(e) => updateStatus(booking.id, e.target.value as BookingRow["status"])}
                className={`rounded-sm px-2.5 py-1 text-xs font-semibold ${statusColors[booking.status]}`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-brand-gray-400">Matter</dt>
                <dd className="text-brand-navy">{booking.matter_type}</dd>
              </div>
              <div>
                <dt className="text-brand-gray-400">Mode</dt>
                <dd className="text-brand-navy">{booking.mode}</dd>
              </div>
              <div>
                <dt className="text-brand-gray-400">Date & time</dt>
                <dd className="text-brand-navy">
                  {booking.preferred_date} · {booking.preferred_time}
                </dd>
              </div>
              <div>
                <dt className="text-brand-gray-400">Language</dt>
                <dd className="text-brand-navy">{booking.language}</dd>
              </div>
              <div>
                <dt className="text-brand-gray-400">Email</dt>
                <dd className="text-brand-navy">{booking.email}</dd>
              </div>
              <div>
                <dt className="text-brand-gray-400">Phone</dt>
                <dd className="text-brand-navy">{booking.phone}</dd>
              </div>
            </dl>

            <p className="mt-3 rounded-sm bg-brand-gray-50 p-3 text-sm text-brand-gray-600">{booking.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
