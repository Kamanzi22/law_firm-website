import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see
 * .env.example). Until then, the app runs entirely on the bundled
 * placeholder content in src/data/ — useful for local dev/demo before a
 * Supabase project exists, and as a safe fallback if the backend is ever
 * unreachable.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
