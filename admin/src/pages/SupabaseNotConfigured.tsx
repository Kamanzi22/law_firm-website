import { AlertTriangle } from "lucide-react";

export function SupabaseNotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gray-50 px-4">
      <div className="max-w-md rounded-sm border border-brand-gray-200 bg-white p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-brand-gold-dark" aria-hidden="true" />
        <h1 className="mt-4 font-display text-xl font-semibold text-brand-navy">Supabase not configured</h1>
        <p className="mt-2 text-sm text-brand-gray-500">
          This admin app needs a Supabase project to connect to. Copy{" "}
          <code className="rounded bg-brand-gray-100 px-1 py-0.5 text-xs">.env.example</code> to{" "}
          <code className="rounded bg-brand-gray-100 px-1 py-0.5 text-xs">.env</code> and fill in your project's
          URL and anon key — see{" "}
          <code className="rounded bg-brand-gray-100 px-1 py-0.5 text-xs">../supabase/README.md</code>{" "}
          for full setup steps.
        </p>
      </div>
    </div>
  );
}
