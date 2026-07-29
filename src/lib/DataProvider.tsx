import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured } from "./supabaseClient";
import { fetchFirmProfile } from "./queries/firmProfile";
import { fetchServices } from "./queries/services";
import { fetchTeam } from "./queries/team";
import { fetchTestimonials } from "./queries/testimonials";
import { fetchArticles } from "./queries/articles";
import { fetchBookingSettings } from "./queries/bookingSettings";

import { firm as fallbackFirm, type FirmData } from "../data/firm";
import { services as fallbackServices, type Service } from "../data/services";
import { team as fallbackTeam, type TeamMember } from "../data/team";
import { testimonials as fallbackTestimonials, type Testimonial } from "../data/testimonials";
import { insights as fallbackArticles, type InsightArticleData } from "../data/insights";
import { bookingSettings as fallbackBookingSettings, type BookingSettingsData } from "../data/bookingSettings";

interface AppData {
  firm: FirmData;
  services: Service[];
  team: TeamMember[];
  testimonials: Testimonial[];
  articles: InsightArticleData[];
  bookingSettings: BookingSettingsData;
  isLive: boolean;
  getServiceBySlug: (slug: string) => Service | undefined;
  getTeamMemberBySlug: (slug: string) => TeamMember | undefined;
  getArticleBySlug: (slug: string) => InsightArticleData | undefined;
}

const AppDataContext = createContext<AppData | null>(null);

const STALE_TIME = 60_000;

export function DataProvider({ children }: { children: ReactNode }) {
  const firmQuery = useQuery({
    queryKey: ["firm-profile"],
    queryFn: fetchFirmProfile,
    initialData: fallbackFirm,
    enabled: isSupabaseConfigured,
    staleTime: STALE_TIME,
  });

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    initialData: fallbackServices,
    enabled: isSupabaseConfigured,
    staleTime: STALE_TIME,
  });

  const teamQuery = useQuery({
    queryKey: ["team"],
    queryFn: fetchTeam,
    initialData: fallbackTeam,
    enabled: isSupabaseConfigured,
    staleTime: STALE_TIME,
  });

  const testimonialsQuery = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    initialData: fallbackTestimonials,
    enabled: isSupabaseConfigured,
    staleTime: STALE_TIME,
  });

  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    initialData: fallbackArticles,
    enabled: isSupabaseConfigured,
    staleTime: STALE_TIME,
  });

  const bookingSettingsQuery = useQuery({
    queryKey: ["booking-settings"],
    queryFn: fetchBookingSettings,
    initialData: fallbackBookingSettings,
    enabled: isSupabaseConfigured,
    staleTime: STALE_TIME,
  });

  const value = useMemo<AppData>(() => {
    const services = servicesQuery.data;
    const team = teamQuery.data;
    const articles = articlesQuery.data;

    return {
      firm: firmQuery.data,
      services,
      team,
      testimonials: testimonialsQuery.data,
      articles,
      bookingSettings: bookingSettingsQuery.data,
      isLive: isSupabaseConfigured,
      getServiceBySlug: (slug) => services.find((s) => s.slug === slug),
      getTeamMemberBySlug: (slug) => team.find((m) => m.slug === slug),
      getArticleBySlug: (slug) => articles.find((a) => a.slug === slug),
    };
  }, [
    firmQuery.data,
    servicesQuery.data,
    teamQuery.data,
    testimonialsQuery.data,
    articlesQuery.data,
    bookingSettingsQuery.data,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within a DataProvider");
  return ctx;
}
