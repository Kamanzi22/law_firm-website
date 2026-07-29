import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { strings } from "../../data/strings";
import { formatArticleDate } from "../../lib/format";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { useAppData } from "../../lib/DataProvider";

export function InsightsPreview() {
  const { articles, getTeamMemberBySlug } = useAppData();
  const latest = articles.slice(0, 3);

  return (
    <section className="bg-brand-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={strings.nav.insights}
            title={strings.home.insightsHeading}
            subtitle={strings.home.insightsSubheading}
          />
          <Link
            to="/insights"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-gold-dark hover:text-brand-navy"
          >
            {strings.home.insightsCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {latest.map((article, index) => {
            const author = getTeamMemberBySlug(article.author);
            return (
              <Reveal key={article.slug} delayMs={index * 60}>
                <Link to={`/insights/${article.slug}`} className="group block">
                  <div className="overflow-hidden rounded-sm" style={{ aspectRatio: "1200 / 630" }}>
                    <img
                      src={article.coverImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">
                    {article.category}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-brand-navy group-hover:text-brand-gold-dark">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-gray-500">
                    {formatArticleDate(article.date)} · {author?.name}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
