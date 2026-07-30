import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { QueryError } from "./ui/QueryError";
import { useState } from "react";

type Period = "day" | "week" | "month" | "year";

const PERIODS: { value: Period; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

function periodStart(period: Period): Date {
  const now = new Date();
  if (period === "day") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (period === "week") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === "month") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
}

async function countSince(since: Date): Promise<number> {
  const { count, error } = await supabase!
    .from("site_sessions")
    .select("id", { count: "exact", head: true })
    .gte("started_at", since.toISOString());
  if (error) throw error;
  return count ?? 0;
}

async function fetchActivity(period: Period) {
  const [selected, month, year] = await Promise.all([
    countSince(periodStart(period)),
    countSince(periodStart("month")),
    countSince(periodStart("year")),
  ]);
  return { selected, month, year };
}

export function WebsiteActivity() {
  const [period, setPeriod] = useState<Period>("day");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-website-activity", period],
    queryFn: () => fetchActivity(period),
  });

  const selectedLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <div className="rounded-sm border border-brand-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-brand-navy">Website Activity</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="rounded-sm border border-brand-gray-300 bg-white px-3 py-1.5 text-sm text-brand-navy focus-visible:border-brand-gold-dark"
          aria-label="Time period"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <div className="mt-4">
          <QueryError error={error} />
        </div>
      )}

      {!isError && (
        <>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-brand-gold/10 text-brand-gold-dark">
              <Users className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-brand-gray-400" aria-hidden="true" />
              ) : (
                <p className="font-display text-4xl font-semibold text-brand-navy">{data?.selected}</p>
              )}
              <p className="text-sm text-brand-gray-500">Visits — {selectedLabel}</p>
            </div>
          </div>

          {!isLoading && data && (
            <p className="mt-4 border-t border-brand-gray-100 pt-3 text-xs text-brand-gray-400">
              {data.month} visits in the last 30 days · {data.year} in the last 12 months
            </p>
          )}
        </>
      )}
    </div>
  );
}
