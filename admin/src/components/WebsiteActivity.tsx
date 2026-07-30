import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader2, Users, ArrowRight, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { QueryError } from "./ui/QueryError";

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

export function WebsiteActivity() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<Period>("day");
  const [isResetting, setIsResetting] = useState(false);
  const { data: selected, isLoading, isError, error } = useQuery({
    queryKey: ["admin-website-activity", period],
    queryFn: () => countSince(periodStart(period)),
  });

  const selectedLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  async function handleReset() {
    if (!confirm("Delete all recorded website visits? This can't be undone.")) return;
    setIsResetting(true);
    // page_views cascades on delete via its FK to site_sessions, so this clears both tables.
    await supabase!.from("site_sessions").delete().not("id", "is", null);
    setIsResetting(false);
    queryClient.invalidateQueries({ queryKey: ["admin-website-activity"] });
    queryClient.invalidateQueries({ queryKey: ["admin-activity-detail"] });
  }

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
        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-brand-gold/10 text-brand-gold-dark">
            <Users className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-brand-gray-400" aria-hidden="true" />
            ) : (
              <p className="font-display text-4xl font-semibold text-brand-navy">{selected}</p>
            )}
            <p className="text-sm text-brand-gray-500">Visits — {selectedLabel}</p>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-brand-gray-100 pt-4">
        <Link
          to="/activity"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold-dark hover:text-brand-navy"
        >
          View detailed summary
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={handleReset}
          disabled={isResetting}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {isResetting ? "Resetting…" : "Reset data"}
        </button>
      </div>
    </div>
  );
}
