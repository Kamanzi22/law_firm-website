import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CalendarCheck, Mail, Briefcase, Users } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { QueryError } from "../components/ui/QueryError";
import { WebsiteActivity } from "../components/WebsiteActivity";

async function fetchCounts() {
  const [pendingBookings, newMessages, services, team] = await Promise.all([
    supabase!.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase!.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase!.from("services").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase!.from("team_members").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const firstError = pendingBookings.error ?? newMessages.error ?? services.error ?? team.error;
  if (firstError) throw firstError;

  return {
    pendingBookings: pendingBookings.count ?? 0,
    newMessages: newMessages.count ?? 0,
    services: services.count ?? 0,
    team: team.count ?? 0,
  };
}

export function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["dashboard-counts"], queryFn: fetchCounts });

  const cards = [
    { label: "Pending Bookings", value: data?.pendingBookings, to: "/bookings", icon: CalendarCheck },
    { label: "New Messages", value: data?.newMessages, to: "/messages", icon: Mail },
    { label: "Active Services", value: data?.services, to: "/services", icon: Briefcase },
    { label: "Active Team Members", value: data?.team, to: "/team", icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-navy">Dashboard</h1>
      <p className="mt-1 text-brand-gray-500">Overview of what's happening on the site.</p>

      {isError && (
        <div className="mt-6">
          <QueryError error={error} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-sm border border-brand-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <card.icon className="h-5 w-5 text-brand-gold-dark" aria-hidden="true" />
            <p className="mt-3 font-display text-3xl font-semibold text-brand-navy">
              {isLoading ? "—" : card.value}
            </p>
            <p className="mt-1 text-sm text-brand-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <WebsiteActivity />
      </div>
    </div>
  );
}
