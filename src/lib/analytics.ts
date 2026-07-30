import { supabase, isSupabaseConfigured } from "./supabaseClient";

const SESSION_KEY = "kp_session_id";
const HEARTBEAT_MS = 20_000;

let sessionId: string | null = null;
let initPromise: Promise<void> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

async function lookupLocation(): Promise<{ country: string | null; city: string | null }> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return { country: null, city: null };
    const data = await res.json();
    return { country: data.country_name ?? null, city: data.city ?? null };
  } catch {
    return { country: null, city: null };
  }
}

function heartbeat() {
  if (!sessionId || !supabase) return;
  void supabase.from("site_sessions").update({ last_seen_at: new Date().toISOString() }).eq("id", sessionId);
}

function startHeartbeat() {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(heartbeat, HEARTBEAT_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") heartbeat();
  });
  window.addEventListener("pagehide", heartbeat);
}

/** Starts (or resumes) a visit session. Safe to call multiple times. */
export function initAnalytics(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return Promise.resolve();
  if (sessionId) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) {
      sessionId = existing;
      startHeartbeat();
      return;
    }

    const { country, city } = await lookupLocation();
    const { data, error } = await supabase!
      .from("site_sessions")
      .insert({
        country,
        city,
        device_type: getDeviceType(),
        referrer: document.referrer || null,
      })
      .select("id")
      .single();

    if (error || !data) return;
    sessionId = data.id as string;
    sessionStorage.setItem(SESSION_KEY, sessionId);
    startHeartbeat();
  })();

  return initPromise;
}

/** Records a page view for the current path. Initializes the session first if needed. */
export async function trackPageView(path: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await initAnalytics();
  if (!sessionId) return;
  await supabase.from("page_views").insert({ session_id: sessionId, path });
}
