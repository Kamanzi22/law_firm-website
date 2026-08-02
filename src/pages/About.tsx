import { Link } from "react-router-dom";
import { Seo } from "../components/seo/Seo";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { AboutHero } from "../components/heroes/AboutHero";
import { strings } from "../data/strings";
import { useAppData } from "../lib/DataProvider";

export function About() {
  const { firm, team } = useAppData();

  return (
    <>
      <Seo title={strings.about.pageHeading} description={firm.positioning} path="/about" />

      <AboutHero />

      <section className="bg-brand-cream py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <img
              src="/images/about-story.svg"
              alt="Demo & Partners office placeholder"
              className="w-full rounded-sm"
            />
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="font-display text-2xl font-semibold text-brand-navy">
              {strings.about.storyHeading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-gray-600">
              Founded in {firm.founded}, {firm.name} began as a two-person practice in Kigali with a
              simple premise: give growing Rwandan businesses the same caliber of commercial legal advice
              available in larger regional markets. Since then, the firm has advised on transactions,
              disputes and regulatory matters across corporate, real estate, tax, employment and
              intellectual property law.
            </p>
            <p className="mt-4 text-base leading-relaxed text-brand-gray-600">
              Today the firm is {firm.stats.teamSize} people strong, with partners who remain personally
              involved in every engagement — regardless of size.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading title={strings.about.valuesHeading} align="left" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {strings.values.map((value, index) => (
              <Reveal key={value.title} delayMs={index * 60}>
                <h3 className="font-display text-lg font-semibold text-brand-navy">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray-500">{value.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading title={strings.about.timelineHeading} align="left" />
          </Reveal>
          <ol className="mt-12 space-y-8 border-l border-brand-gray-300 pl-8">
            {strings.timeline.map((item, index) => (
              <Reveal key={item.year} as="li" delayMs={index * 50} className="relative">
                <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-brand-gold-dark" />
                <p className="font-display text-lg font-semibold text-brand-navy">{item.year}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-gray-600">{item.event}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              title={strings.about.teamHeading}
              subtitle={strings.about.teamSubheading}
              align="left"
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.slug} delayMs={index * 50}>
                <Link to={`/team/${member.slug}`} className="group block">
                  <div className="aspect-square overflow-hidden rounded-sm bg-brand-navy">
                    <img
                      src={member.photo}
                      alt={`${member.name} placeholder photo`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-brand-navy group-hover:text-brand-gold-dark">
                    {member.name}
                  </h3>
                  <p className="text-sm text-brand-gray-500">{member.role}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
