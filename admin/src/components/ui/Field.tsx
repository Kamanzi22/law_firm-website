import { useState } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}

function FieldWrapper({ label, htmlFor, hint, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-brand-navy">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-brand-gray-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-3 py-2 text-sm text-brand-ink focus-visible:border-brand-gold-dark";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, id, className = "", ...rest }: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} hint={hint}>
      <input id={id} className={`${inputClass} ${className}`} {...rest} />
    </FieldWrapper>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextAreaField({ label, hint, id, className = "", ...rest }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} hint={hint}>
      <textarea id={id} className={`${inputClass} ${className}`} {...rest} />
    </FieldWrapper>
  );
}

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

export function PasswordField({ label, hint, id, className = "", ...rest }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FieldWrapper label={label} htmlFor={id!} hint={hint}>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={`w-full rounded-sm border border-brand-gray-300 bg-white px-3 py-2 pr-10 text-sm text-brand-ink focus-visible:border-brand-gold-dark ${className}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-brand-gray-400 hover:text-brand-navy"
        >
          {isVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </FieldWrapper>
  );
}
