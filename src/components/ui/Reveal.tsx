import type { ElementType, ReactNode } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delayMs?: number;
}

export function Reveal({ children, as: Tag = "div", className = "", delayMs = 0 }: RevealProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
