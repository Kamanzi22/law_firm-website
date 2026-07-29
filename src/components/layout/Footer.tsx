import { Link } from "react-router-dom";
import { Scale, MapPin, Phone, Mail } from "lucide-react";
import { strings } from "../../data/strings";
import { useAppData } from "../../lib/DataProvider";

export function Footer() {
  const { firm, services } = useAppData();
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: firm.socials.linkedin, label: "LinkedIn", initials: "in" },
    { href: firm.socials.twitter, label: "Twitter / X", initials: "X" },
    { href: firm.socials.facebook, label: "Facebook", initials: "f" },
  ];

  return (
    <footer className="bg-brand-charcoal text-brand-gray-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 text-brand-cream">
            {firm.logoUrl ? (
              <img src={firm.logoUrl} alt="" className="h-6 w-auto" aria-hidden="true" />
            ) : (
              <Scale className="h-6 w-6 text-brand-gold" aria-hidden="true" />
            )}
            <span className="font-display text-lg font-semibold">{firm.shortName}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-gray-300">{firm.positioning}</p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-brand-gray-300 hover:border-brand-gold hover:text-brand-gold"
              >
                {social.initials}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-brand-cream">{strings.footer.quickLinks}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-brand-gold">{strings.nav.about}</Link></li>
            <li><Link to="/insights" className="hover:text-brand-gold">{strings.nav.insights}</Link></li>
            <li><Link to="/contact" className="hover:text-brand-gold">{strings.nav.contact}</Link></li>
            <li><Link to="/book" className="hover:text-brand-gold">{strings.nav.bookConsultation}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-brand-cream">{strings.nav.services}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className="hover:text-brand-gold">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-brand-cream">{strings.footer.getInTouch}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
              <span>
                {firm.address.line1}, {firm.address.line2}
                <br />
                {firm.address.city}, {firm.address.country}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
              <a href={`tel:${firm.phoneHref}`} className="hover:text-brand-gold">{firm.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
              <a href={`mailto:${firm.email}`} className="hover:text-brand-gold">{firm.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-brand-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {year} {firm.name}. {strings.footer.rights}
          </p>
          <p>{strings.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
