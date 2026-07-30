import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { formatArticleDate } from "../lib/format";
import { strings } from "../data/strings";
import { useAppData } from "../lib/DataProvider";

export function InsightArticle() {
  const { getArticleBySlug, getTeamMemberBySlug } = useAppData();
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/insights" replace />;
  }

  const author = getTeamMemberBySlug(article.author);

  return (
    <>
      <Seo title={article.title} description={article.excerpt} path={`/insights/${article.slug}`} />

      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/insights"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {strings.insightsPage.backToInsights}
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/70">
            {article.category}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-white/70">
            {formatArticleDate(article.date)} · {author?.name} · {article.readingMinutes} min read
          </p>
        </div>
      </section>

      <div className="w-full overflow-hidden" style={{ aspectRatio: "1200 / 500" }}>
        <img src={article.coverImage} alt="" className="h-full w-full object-cover" />
      </div>

      <section className="bg-brand-cream py-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose-content space-y-5 text-base leading-relaxed text-brand-gray-600">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-sm border border-brand-gold/30 bg-brand-gold/5 p-4 text-sm text-brand-gray-600">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" aria-hidden="true" />
            <p>{strings.insightsPage.disclaimer}</p>
          </div>
        </article>
      </section>
    </>
  );
}
