import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Users, Clock, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { QueryError } from "../components/ui/QueryError";

type Period = "day" | "week" | "month" | "year";

interface SessionRow {
  id: string;
  started_at: string;
  last_seen_at: string;
  country: string | null;
  city: string | null;
}

interface PageViewRow {
  path: string;
  viewed_at: string;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

function periodStart(period: Period): Date {
  const now = new Date();
  if (period === "day") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (period === "week") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === "month") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
}

async function fetchActivity(period: Period) {
  const since = periodStart(period).toISOString();
  const [sessionsRes, pageViewsRes] = await Promise.all([
    supabase!.from("site_sessions").select("id, started_at, last_seen_at, country, city").gte("started_at", since),
    supabase!.from("page_views").select("path, viewed_at").gte("viewed_at", since),
  ]);
  if (sessionsRes.error) throw sessionsRes.error;
  if (pageViewsRes.error) throw pageViewsRes.error;
  return {
    sessions: (sessionsRes.data ?? []) as SessionRow[],
    pageViews: (pageViewsRes.data ?? []) as PageViewRow[],
  };
}

function sectionLabel(path: string): string {
  if (path === "/") return "Home";
  if (path.startsWith("/services")) return "Services";
  if (path.startsWith("/about")) return "About";
  if (path.startsWith("/team")) return "Team";
  if (path.startsWith("/insights")) return "Insights";
  if (path.startsWith("/contact")) return "Contact";
  if (path.startsWith("/book")) return "Book Appointment";
  return path;
}

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 1) return "0s";
  if (totalSeconds < 60) return `${Math.round(totalSeconds)}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function buildTimeline(sessions: SessionRow[], period: Period): { label: string; count: number }[] {
  const now = new Date();

  if (period === "day") {
    const buckets = Array.from({ length: 24 }, (_, i) => {
      const start = new Date(now);
      start.setMinutes(0, 0, 0);
      start.setHours(start.getHours() - (23 - i));
      return { label: `${start.getHours()}:00`, start };
    });
    return buckets.map((b) => {
      const end = new Date(b.start.getTime() + 60 * 60 * 1000);
      const count = sessions.filter((s) => {
        const t = new Date(s.started_at).getTime();
        return t >= b.start.getTime() && t < end.getTime();
      }).length;
      return { label: b.label, count };
    });
  }

  if (period === "week") {
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (6 - i));
      return { label: start.toLocaleDateString("en-US", { weekday: "short" }), start };
    });
    return buckets.map((b) => {
      const end = new Date(b.start.getTime() + 24 * 60 * 60 * 1000);
      const count = sessions.filter((s) => {
        const t = new Date(s.started_at).getTime();
        return t >= b.start.getTime() && t < end.getTime();
      }).length;
      return { label: b.label, count };
    });
  }

  if (period === "month") {
    const buckets = Array.from({ length: 30 }, (_, i) => {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (29 - i));
      return { label: start.toLocaleDateString("en-US", { day: "numeric", month: "short" }), start };
    });
    return buckets.map((b) => {
      const end = new Date(b.start.getTime() + 24 * 60 * 60 * 1000);
      const count = sessions.filter((s) => {
        const t = new Date(s.started_at).getTime();
        return t >= b.start.getTime() && t < end.getTime();
      }).length;
      return { label: b.label, count };
    });
  }

  const buckets = Array.from({ length: 12 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return { label: start.toLocaleDateString("en-US", { month: "short" }), start };
  });
  return buckets.map((b, i) => {
    const end = i < buckets.length - 1 ? buckets[i + 1].start : new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const count = sessions.filter((s) => {
      const t = new Date(s.started_at).getTime();
      return t >= b.start.getTime() && t < end.getTime();
    }).length;
    return { label: b.label, count };
  });
}

function Timeline({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-40 items-end gap-1 overflow-x-auto pb-1">
      {data.map((d, i) => (
        <div key={`${d.label}-${i}`} className="flex h-full min-w-[1.75rem] flex-1 flex-col items-center justify-end gap-1">
          <div
            className="min-h-[2px] w-full rounded-t-sm bg-brand-gold-dark"
            style={{ height: `${(d.count / max) * 100}%` }}
            title={`${d.label}: ${d.count} visit${d.count === 1 ? "" : "s"}`}
          />
          <span className="whitespace-nowrap text-[10px] text-brand-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function RankedList({ items, emptyLabel }: { items: { label: string; count: number }[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-brand-gray-400">{emptyLabel}</p>;
  }
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex justify-between text-sm">
            <span className="text-brand-navy">{item.label}</span>
            <span className="text-brand-gray-500">{item.count}</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-brand-gray-100">
            <div className="h-1.5 rounded-full bg-brand-gold-dark" style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ActivityDetail() {
  const [period, setPeriod] = useState<Period>("week");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-activity-detail", period],
    queryFn: () => fetchActivity(period),
  });

  const stats = useMemo(() => {
    if (!data) return null;
    const { sessions, pageViews } = data;

    const totalVisits = sessions.length;
    const avgDurationSeconds =
      sessions.length === 0
        ? 0
        : sessions.reduce((sum, s) => {
            const duration = (new Date(s.last_seen_at).getTime() - new Date(s.started_at).getTime()) / 1000;
            return sum + Math.max(0, duration);
          }, 0) / sessions.length;

    const sectionCounts = new Map<string, number>();
    for (const view of pageViews) {
      const label = sectionLabel(view.path);
      sectionCounts.set(label, (sectionCounts.get(label) ?? 0) + 1);
    }
    const topSections = [...sectionCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const locationCounts = new Map<string, number>();
    for (const s of sessions) {
      const label = s.city && s.country ? `${s.city}, ${s.country}` : s.country ?? "Unknown";
      locationCounts.set(label, (locationCounts.get(label) ?? 0) + 1);
    }
    const topLocations = [...locationCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const timeline = buildTimeline(sessions, period);

    return { totalVisits, avgDurationSeconds, topSections, topLocations, timeline };
  }, [data, period]);

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray-500 hover:text-brand-navy"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-navy">Website Activity</h1>
          <p className="mt-1 text-brand-gray-500">Detailed breakdown of visits to the client site.</p>
        </div>
        <div className="flex rounded-sm border border-brand-gray-200 p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p.value ? "bg-brand-navy text-brand-cream" : "text-brand-gray-500 hover:text-brand-navy"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="mt-6">
          <QueryError error={error} />
        </div>
      )}

      {isLoading && (
        <div className="mt-8 flex items-center gap-2 text-brand-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading activity…
        </div>
      )}

      {stats && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-sm border border-brand-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-brand-gray-500">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wide">Total Visits</span>
              </div>
              <p className="mt-1 font-display text-3xl font-semibold text-brand-navy">{stats.totalVisits}</p>
            </div>
            <div className="rounded-sm border border-brand-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-brand-gray-500">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wide">Avg. Duration</span>
              </div>
              <p className="mt-1 font-display text-3xl font-semibold text-brand-navy">
                {formatDuration(stats.avgDurationSeconds)}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-sm border border-brand-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-navy">
              <TrendingUp className="h-4 w-4 text-brand-gold-dark" aria-hidden="true" />
              Visits over time
            </div>
            <div className="mt-4">
              <Timeline data={stats.timeline} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-sm border border-brand-gray-200 bg-white p-5">
              <p className="text-sm font-medium text-brand-navy">Visits by section</p>
              <div className="mt-4">
                <RankedList items={stats.topSections} emptyLabel="No page views in this period yet." />
              </div>
            </div>
            <div className="rounded-sm border border-brand-gray-200 bg-white p-5">
              <p className="text-sm font-medium text-brand-navy">Visits by location</p>
              <div className="mt-4">
                <RankedList items={stats.topLocations} emptyLabel="No location data in this period yet." />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
