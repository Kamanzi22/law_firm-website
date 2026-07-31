import { SectionHeading } from "../ui/SectionHeading";
import { strings } from "../../data/strings";
import { useAppData } from "../../lib/DataProvider";

export function AboutHero() {
  const { firm } = useAppData();

  return (
    <section className="flex h-full items-center bg-brand-teal py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={strings.about.pageHeading} subtitle={firm.positioning} light />
      </div>
    </section>
  );
}
