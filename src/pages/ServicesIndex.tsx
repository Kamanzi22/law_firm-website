import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { ServiceIcon } from "../components/ui/ServiceIcon";
import { Reveal } from "../components/ui/Reveal";
import { NextPageTeaser } from "../components/ui/NextPageTeaser";
import { ServicesHero } from "../components/heroes/ServicesHero";
import { AboutHero } from "../components/heroes/AboutHero";
import { strings } from "../data/strings";
import { useAppData } from "../lib/DataProvider";
import { usePrevPageOnScrollUp } from "../hooks/usePrevPageOnScrollUp";

export function ServicesIndex() {
  const { services } = useAppData();
  usePrevPageOnScrollUp("/");

  return (
    <>
      <Seo
        title={strings.services.pageHeading}
        description={strings.services.pageSubheading}
        path="/services"
      />

      <ServicesHero />

      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delayMs={index * 60}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-sm border border-brand-gray-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-brand-navy/5 text-brand-navy group-hover:bg-brand-gold/10 group-hover:text-brand-gold-dark">
                    <ServiceIcon icon={service.icon} className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 font-display text-xl font-semibold text-brand-navy">{service.name}</h2>
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

      <NextPageTeaser nextPath="/about">
        <AboutHero />
      </NextPageTeaser>
    </>
  );
}
