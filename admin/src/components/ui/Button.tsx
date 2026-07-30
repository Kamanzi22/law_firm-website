import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-brand-teal text-brand-cream hover:bg-brand-teal-dark",
  secondary: "bg-brand-navy text-brand-cream hover:bg-brand-navy-light",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-brand-navy border border-brand-gray-300 hover:bg-brand-gray-100",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}
