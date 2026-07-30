import { ShieldCheck, Clock, ReceiptText, UserCheck } from "lucide-react";
import { strings } from "../../data/strings";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const icons = [ShieldCheck, Clock, ReceiptText, UserCheck];

export function WhyUs() {
  return (
    <section className="bg-brand-teal py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={strings.home.whyUsHeading} light align="left" />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {strings.whyUs.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Reveal key={item.title} delayMs={index * 60}>
                <Icon className="h-8 w-8 text-brand-navy" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-semibold text-brand-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-navy/75">{item.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
