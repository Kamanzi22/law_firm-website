import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "invert";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold transition-colors duration-200 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // Black fill, white text — for buttons on white/cream sections.
  primary: "bg-brand-teal text-brand-cream hover:bg-brand-teal-dark",
  // Light outline — for buttons sitting directly on a black section.
  secondary: "bg-transparent text-brand-cream border border-brand-cream/40 hover:border-brand-cream hover:bg-white/5",
  // Dark outline — for secondary actions on white/cream sections.
  ghost: "bg-transparent text-brand-navy border border-brand-navy/20 hover:bg-brand-navy/5",
  // White fill, black text — for a strong CTA that needs to sit directly
  // on a black section (a black-on-black fill would have no boundary).
  invert: "bg-white text-brand-navy hover:bg-brand-gray-100",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface ButtonAsButton extends CommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  to?: undefined;
  href?: undefined;
}

interface ButtonAsLink extends CommonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  href?: undefined;
}

interface ButtonAsAnchor extends CommonProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  to?: undefined;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export function Button({ variant = "primary", size = "md", children, className = "", ...rest }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("to" in rest && rest.to) {
    const { to, href: _href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link to={to} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  if ("href" in rest && rest.href) {
    const { href, to: _to, ...anchorProps } = rest as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { to: _to, href: _href, ...buttonProps } = rest as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
