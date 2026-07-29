import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../lib/AuthProvider";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import { SupabaseNotConfigured } from "../../pages/SupabaseNotConfigured";

export function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  if (!isSupabaseConfigured) {
    return <SupabaseNotConfigured />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-brand-navy" aria-hidden="true" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
