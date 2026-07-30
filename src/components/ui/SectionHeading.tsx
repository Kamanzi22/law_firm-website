interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left", light = false }: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p
          className={`mb-3 text-sm font-semibold uppercase tracking-widest ${
            light ? "text-white/70" : "text-brand-gold-dark"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl sm:text-4xl font-display font-semibold ${light ? "text-white" : "text-brand-navy"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/80" : "text-brand-gray-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
