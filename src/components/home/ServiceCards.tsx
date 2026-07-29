import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { strings } from "../../data/strings";
import { SectionHeading } from "../ui/SectionHeading";
import { ServiceIcon } from "../ui/ServiceIcon";
import { Reveal } from "../ui/Reveal";
import { useAppData } from "../../lib/DataProvider";

export function ServiceCards() {
  const { services } = useAppData();

  return (
    <section className="bg-brand-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={strings.nav.services}
            title={strings.home.servicesHeading}
            subtitle={strings.home.servicesSubheading}
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delayMs={index * 60}>
              <Link
                to={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-sm border border-brand-gray-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-brand-navy/5 text-brand-navy group-hover:bg-brand-gold/10 group-hover:text-brand-gold-dark">
                  <ServiceIcon icon={service.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-brand-navy">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-gray-500">
                  {service.shortDescription}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-dark">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
