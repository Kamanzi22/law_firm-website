import { Link } from "react-router-dom";
import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/ui/Reveal";
import { NextPageTeaser } from "../components/ui/NextPageTeaser";
import { InsightsHero } from "../components/heroes/InsightsHero";
import { ContactHero } from "../components/heroes/ContactHero";
import { formatArticleDate } from "../lib/format";
import { strings } from "../data/strings";
import { useAppData } from "../lib/DataProvider";
import { usePrevPageOnScrollUp } from "../hooks/usePrevPageOnScrollUp";

export function Insights() {
  const { articles: insights, getTeamMemberBySlug } = useAppData();
  usePrevPageOnScrollUp("/about");

  return (
    <>
      <Seo title={strings.insightsPage.pageHeading} description={strings.insightsPage.pageSubheading} path="/insights" />

      <InsightsHero />

      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {insights.map((article, index) => {
              const author = getTeamMemberBySlug(article.author);
              return (
                <Reveal key={article.slug} delayMs={index * 60}>
                  <Link to={`/insights/${article.slug}`} className="group block h-full">
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
                    <h2 className="mt-2 font-display text-xl font-semibold text-brand-navy group-hover:text-brand-gold-dark">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-brand-gray-500">{article.excerpt}</p>
                    <p className="mt-4 text-xs text-brand-gray-400">
                      {formatArticleDate(article.date)} · {author?.name} · {article.readingMinutes} min read
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <NextPageTeaser nextPath="/contact">
        <ContactHero />
      </NextPageTeaser>
    </>
  );
}
