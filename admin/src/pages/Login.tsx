import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Scale, Loader2 } from "lucide-react";
import { useAuth } from "../lib/AuthProvider";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { SupabaseNotConfigured } from "./SupabaseNotConfigured";
import { Button } from "../components/ui/Button";
import { TextField, PasswordField } from "../components/ui/Field";

export function Login() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSupabaseConfigured) {
    return <SupabaseNotConfigured />;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setIsSubmitting(false);
    if (signInError) setError(signInError);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <div className="w-full max-w-sm rounded-sm bg-white p-8 shadow-xl">
        <div className="flex items-center gap-2 text-brand-navy">
          <Scale className="h-6 w-6 text-brand-gold-dark" aria-hidden="true" />
          <span className="font-display text-lg font-semibold">Demo Admin</span>
        </div>
        <p className="mt-1 text-sm text-brand-gray-500">Sign in to manage the firm's website.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <TextField
            id="login-email"
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordField
            id="login-password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-brand-gray-400">
          Admin accounts are created in the Supabase dashboard (Authentication → Users) — see
          ../supabase/README.md.
        </p>
      </div>
    </div>
  );
}
