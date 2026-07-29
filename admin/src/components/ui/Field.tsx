import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

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
  "mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-3 py-2 text-sm text-brand-ink focus-visible:border-brand-gold";

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
