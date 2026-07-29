import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { strings } from "../../data/strings";
import { useAppData } from "../../lib/DataProvider";

export function Hero() {
  const { firm } = useAppData();

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy">
      <img
        src="/images/hero-office.svg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-brand-navy/40" />

      <div className="relative mx-auto flex min-h-[85svh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold-light">
          {strings.home.heroEyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-brand-cream sm:text-5xl lg:text-6xl">
          {firm.name}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-gray-200 sm:text-xl">
          {firm.positioning}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button to="/book" size="lg">
            {strings.home.heroCtaPrimary}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button to="/services" size="lg" variant="secondary">
            {strings.home.heroCtaSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
