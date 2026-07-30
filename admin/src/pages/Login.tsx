import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Scale, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/AuthProvider";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { SupabaseNotConfigured } from "./SupabaseNotConfigured";
import { Button } from "../components/ui/Button";
import { TextField, PasswordField } from "../components/ui/Field";

export function Login() {
  const { session, signIn, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

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

  async function handleSendReset(event: FormEvent) {
    event.preventDefault();
    setResetError(null);
    if (!resetEmail) {
      setResetError("Enter your email address.");
      return;
    }
    setIsSendingReset(true);
    const { error: sendError } = await sendPasswordReset(resetEmail);
    setIsSendingReset(false);
    if (sendError) {
      setResetError(sendError);
      return;
    }
    setResetSent(true);
  }

  function switchToForgot() {
    setResetEmail(email);
    setResetError(null);
    setResetSent(false);
    setMode("forgot");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <div className="w-full max-w-sm rounded-sm bg-white p-8 shadow-xl">
        <div className="flex items-center gap-2 text-brand-navy">
          <Scale className="h-6 w-6 text-brand-gold-dark" aria-hidden="true" />
          <span className="font-display text-lg font-semibold">Demo Admin</span>
        </div>

        {mode === "signin" ? (
          <>
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
              <div>
                <PasswordField
                  id="login-password"
                  label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={switchToForgot}
                  className="mt-1.5 text-xs font-medium text-brand-gold-dark hover:text-brand-navy"
                >
                  Forgot password?
                </button>
              </div>

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
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-brand-gray-500">
              Enter your email and we'll send a link to reset your password.
            </p>

            {resetSent ? (
              <div className="mt-6">
                <div className="flex items-start gap-2 text-green-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="text-sm">
                    Check <strong>{resetEmail}</strong> for a reset link. It may take a minute to arrive.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="mt-4 text-sm font-medium text-brand-gold-dark hover:text-brand-navy"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSendReset} noValidate>
                <TextField
                  id="reset-email"
                  label="Email"
                  type="email"
                  autoComplete="username"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />

                {resetError && (
                  <p role="alert" className="text-sm text-red-600">
                    {resetError}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={isSendingReset}>
                  {isSendingReset ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  {isSendingReset ? "Sending…" : "Send reset link"}
                </Button>

                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="block w-full text-center text-sm font-medium text-brand-gray-500 hover:text-brand-navy"
                >
                  Back to sign in
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
