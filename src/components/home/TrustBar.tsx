import { strings } from "../../data/strings";
import { Reveal } from "../ui/Reveal";
import { useAppData } from "../../lib/DataProvider";

export function TrustBar() {
  const { firm } = useAppData();
  const stats = [
    { value: `${firm.stats.yearsExperience}+`, label: strings.home.yearsExperience },
    { value: firm.stats.casesHandled, label: strings.home.casesHandled },
    { value: firm.stats.clientsServed, label: strings.home.clientsServed },
  ];

  return (
    <section className="border-b border-brand-gray-200 bg-white">
      <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-semibold text-brand-navy">{stat.value}</p>
              <p className="mt-1 text-sm uppercase tracking-wide text-brand-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-brand-gray-200 pt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-400">
            {strings.home.membershipsHeading}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {firm.memberships.map((membership) => (
              <span key={membership} className="text-sm font-medium text-brand-gray-600">
                {membership}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
