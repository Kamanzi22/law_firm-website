import { SectionHeading } from "../ui/SectionHeading";
import { strings } from "../../data/strings";

export function InsightsHero() {
  return (
    <section className="flex h-full items-center bg-brand-teal py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={strings.insightsPage.pageHeading}
          subtitle={strings.insightsPage.pageSubheading}
          light
        />
      </div>
    </section>
  );
}
