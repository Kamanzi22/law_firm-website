import { AlertTriangle } from "lucide-react";

export function QueryError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Something went wrong loading this data.";

  return (
    <div className="flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-medium">Couldn't load this page.</p>
        <p className="mt-1 text-red-600">{message}</p>
        <p className="mt-1 text-red-600">
          If this says a table or relation doesn't exist, the Supabase database migrations
          haven't been run yet — see <code className="rounded bg-red-100 px-1">supabase/README.md</code>.
        </p>
      </div>
    </div>
  );
}
