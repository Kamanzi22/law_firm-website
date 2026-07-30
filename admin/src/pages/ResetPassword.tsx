import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Scale, Loader2, CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { SupabaseNotConfigured } from "./SupabaseNotConfigured";
import { Button } from "../components/ui/Button";
import { PasswordField } from "../components/ui/Field";

type Status = "checking" | "ready" | "invalid";

/**
 * Landed on via the link in a "forgot password" email (see Login.tsx /
 * AuthProvider.sendPasswordReset). Supabase parses the recovery token from
 * the URL automatically and fires a PASSWORD_RECOVERY auth event, which is
 * what unlocks this form — no separate "current password" needed, since
 * clicking the emailed link is itself the identity proof.
 */
export function ResetPassword() {
  const [status, setStatus] = useState<Status>("checking");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });

    // Covers the case where the event already fired before this component mounted.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("ready");
    });

    const timeout = setTimeout(() => {
      setStatus((current) => (current === "checking" ? "invalid" : current));
    }, 4000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (!isSupabaseConfigured) {
    return <SupabaseNotConfigured />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase!.auth.updateUser({ password: newPassword });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <div className="w-full max-w-sm rounded-sm bg-white p-8 shadow-xl">
        <div className="flex items-center gap-2 text-brand-navy">
          <Scale className="h-6 w-6 text-brand-gold-dark" aria-hidden="true" />
          <span className="font-display text-lg font-semibold">Demo Admin</span>
        </div>

        {status === "checking" && (
          <div className="mt-6 flex items-center gap-2 text-brand-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Verifying your reset link…
          </div>
        )}

        {status === "invalid" && (
          <div className="mt-6">
            <p className="text-sm text-red-600">
              This reset link is invalid or has expired. Request a new one from the login page.
            </p>
            <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand-gold-dark hover:text-brand-navy">
              Back to login
            </Link>
          </div>
        )}

        {status === "ready" && !success && (
          <>
            <p className="mt-1 text-sm text-brand-gray-500">Choose a new password for your account.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <PasswordField
                id="reset-new-password"
                label="New password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <PasswordField
                id="reset-confirm-password"
                label="Confirm new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {isSubmitting ? "Saving…" : "Set new password"}
              </Button>
            </form>
          </>
        )}

        {success && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <p className="font-medium">Password updated.</p>
            </div>
            <Link
              to="/"
              className="mt-4 inline-block rounded-sm bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold-light"
            >
              Continue to dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
