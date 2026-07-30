import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { strings } from "../../data/strings";
import { Reveal } from "../ui/Reveal";

export function CtaBand() {
  return (
    <section className="bg-brand-teal py-20">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          {strings.home.closingCtaHeading}
        </h2>
        <p className="max-w-xl text-lg text-white/80">{strings.home.closingCtaSubheading}</p>
        <Button to="/book" size="lg" variant="invert">
          {strings.home.closingCtaButton}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Reveal>
    </section>
  );
}
