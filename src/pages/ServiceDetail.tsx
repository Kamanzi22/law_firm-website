import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { Button } from "../components/ui/Button";
import { ServiceIcon } from "../components/ui/ServiceIcon";
import { Reveal } from "../components/ui/Reveal";
import { strings } from "../data/strings";
import { useAppData } from "../lib/DataProvider";

export function ServiceDetail() {
  const { getServiceBySlug } = useAppData();
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <Seo
        title={service.name}
        description={service.shortDescription}
        path={`/services/${service.slug}`}
      />

      <section className="bg-brand-teal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {strings.services.backToServices}
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-white/10 text-white">
              <ServiceIcon icon={service.icon} className="h-7 w-7" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">{service.name}</h1>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{service.overview}</p>
        </div>
      </section>

      <section className="bg-brand-cream py-20">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-brand-navy">
              {strings.services.helpWithHeading}
            </h2>
            <ul className="mt-6 space-y-4">
              {service.helpWith.map((item) => (
                <li key={item} className="flex items-start gap-3 text-brand-gray-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delayMs={80}>
            <h2 className="font-display text-2xl font-semibold text-brand-navy">
              {strings.services.processHeading}
            </h2>
            <ol className="mt-6 space-y-6">
              {service.process.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy font-display text-sm font-semibold text-brand-cream">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-brand-navy">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-brand-gray-500">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="bg-brand-teal py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            {strings.services.ctaHeading}
          </h2>
          <Button to={`/book?matter=${service.slug}`} size="lg" variant="invert">
            {strings.services.ctaButton}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </>
  );
}
