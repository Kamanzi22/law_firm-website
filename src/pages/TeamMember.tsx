import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, GraduationCap } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { strings } from "../data/strings";
import { useAppData } from "../lib/DataProvider";

export function TeamMember() {
  const { getTeamMemberBySlug, getServiceBySlug } = useAppData();
  const { slug } = useParams<{ slug: string }>();
  const member = slug ? getTeamMemberBySlug(slug) : undefined;

  if (!member) {
    return <Navigate to="/about" replace />;
  }

  return (
    <>
      <Seo title={member.name} description={member.bio} path={`/team/${member.slug}`} />

      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy/70 hover:text-brand-navy"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {strings.about.teamHeading}
          </Link>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 md:grid-cols-[280px_1fr] lg:px-8">
          <div>
            <div className="aspect-square overflow-hidden rounded-sm bg-brand-navy">
              <img src={member.photo} alt={`${member.name} placeholder photo`} className="h-full w-full object-cover" />
            </div>
            <a
              href={`mailto:${member.email}`}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-gold-dark hover:text-brand-navy"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {member.email}
            </a>
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold text-brand-navy">{member.name}</h1>
            <p className="mt-1 text-brand-gold-dark font-medium">{member.role}</p>
            <p className="mt-6 text-base leading-relaxed text-brand-gray-600">{member.bio}</p>

            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-brand-navy">Focus Areas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.focusAreas.map((slug) => {
                  const service = getServiceBySlug(slug);
                  if (!service) return null;
                  return (
                    <Link
                      key={slug}
                      to={`/services/${slug}`}
                      className="rounded-sm border border-brand-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-brand-navy hover:border-brand-gold-dark"
                    >
                      {service.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-brand-navy">
                <GraduationCap className="h-5 w-5 text-brand-gold-dark" aria-hidden="true" />
                Education
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm text-brand-gray-600">
                {member.education.map((edu) => (
                  <li key={edu}>{edu}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
