interface SwooshDividerProps {
  /** Which section (above or below this divider) the swoosh's fill matches. */
  flip?: boolean;
}

/**
 * A curved black divider echoing the swoosh in the logo/business card.
 * Sits between two sections — the fill color matches the section above by
 * default (bg-brand-teal, which holds black in this palette), flip it
 * when that section is below instead.
 */
export function SwooshDivider({ flip = false }: SwooshDividerProps) {
  return (
    <div
      className={`relative h-12 overflow-hidden bg-white sm:h-20 ${flip ? "-scale-y-100" : ""}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0,0 C360,100 1080,0 1440,70 L1440,0 L0,0 Z" className="fill-brand-teal" />
      </svg>
    </div>
  );
}
