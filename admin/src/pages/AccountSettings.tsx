import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, KeyRound } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthProvider";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/Field";

export function AccountSettings() {
  const { session } = useAuth();
  const currentEmail = session?.user.email ?? "";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setError("Enter your current password to confirm this change.");
      return;
    }

    const emailChanged = newEmail.trim() !== currentEmail;
    const passwordChanged = newPassword.length > 0;

    if (!emailChanged && !passwordChanged) {
      setError("Enter a new email and/or a new password to update.");
      return;
    }

    if (passwordChanged && newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    if (passwordChanged && newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    // Verify the current password by re-authenticating before allowing any change.
    const { error: verifyError } = await supabase!.auth.signInWithPassword({
      email: currentEmail,
      password: currentPassword,
    });

    if (verifyError) {
      setIsSubmitting(false);
      setError("Current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase!.auth.updateUser({
      ...(emailChanged ? { email: newEmail.trim() } : {}),
      ...(passwordChanged ? { password: newPassword } : {}),
    });

    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    if (emailChanged && passwordChanged) {
      setSuccessMessage("Password updated. Check your new email inbox to confirm the email change.");
    } else if (emailChanged) {
      setSuccessMessage("Check your new email inbox to confirm the email change — it won't take effect until confirmed.");
    } else {
      setSuccessMessage("Password updated.");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-brand-navy">Account Settings</h1>
      <p className="mt-1 text-brand-gray-500">Change the email or password used to log into this admin app.</p>

      <form className="mt-6 space-y-5 rounded-sm border border-brand-gray-200 bg-white p-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-start gap-3 rounded-sm bg-brand-gray-50 p-3 text-sm text-brand-gray-600">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" aria-hidden="true" />
          <p>Your current password is required to confirm any change below.</p>
        </div>

        <TextField
          id="current-password"
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <hr className="border-brand-gray-200" />

        <TextField
          id="new-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          hint="Change this to update your login email. You'll need to confirm via the new inbox."
        />

        <TextField
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          hint="Leave blank to keep your current password."
        />

        {newPassword && (
          <TextField
            id="confirm-password"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {successMessage}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
