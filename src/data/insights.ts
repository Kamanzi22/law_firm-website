// REPLACE: Sample articles with fictional, illustrative content only. Do not
// treat as legal advice. Replace with real published insights before launch.

export interface InsightArticleData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string; // team member slug
  date: string; // ISO date
  readingMinutes: number;
  coverImage: string;
  content: string[]; // paragraphs
}

// REPLACE: sample articles below.
export const insights: InsightArticleData[] = [
  {
    slug: "structuring-foreign-investment-in-rwanda",
    title: "Five Things Foreign Investors Get Wrong About Structuring in Rwanda",
    excerpt:
      "Rwanda's investment framework is friendlier than many first-time investors assume — provided you structure correctly from day one.",
    category: "Corporate & Commercial",
    author: "eric-mugisha",
    date: "2026-05-12",
    readingMinutes: 6,
    coverImage: "/images/insights/foreign-investment.svg",
    content: [
      "Rwanda has built a reputation as one of the more straightforward jurisdictions in the region for foreign investment, but that reputation can lead investors to underestimate the value of early structuring advice.",
      "The most common misstep we see is treating company registration as a purely administrative task, rather than a strategic decision that affects tax exposure, repatriation of profits and future fundraising.",
      "A second common issue is delaying shareholder agreements until after a dispute has already emerged. Well-drafted governance documents, agreed while relationships are still good, save considerable cost later.",
      "This article is illustrative demo content and does not constitute legal advice. Speak with qualified counsel about your specific circumstances.",
    ],
  },
  {
    slug: "employment-contract-essentials",
    title: "What Every Employment Contract in Rwanda Should Actually Say",
    excerpt:
      "A well-drafted employment contract prevents disputes. A template pulled offline usually invites them.",
    category: "Labour & Employment",
    author: "claudine-ingabire",
    date: "2026-04-03",
    readingMinutes: 5,
    coverImage: "/images/insights/employment-contract.svg",
    content: [
      "Employers frequently rely on generic templates for employment contracts, only to discover gaps when a dispute arises — typically around termination terms, probation periods or non-compete clauses.",
      "Rwandan labour law sets out specific requirements for contract form and content. Contracts that fall short can expose employers to unnecessary risk during termination or restructuring.",
      "We recommend a periodic review of standard contracts and staff handbooks, particularly after any change in headcount strategy or business model.",
      "This article is illustrative demo content and does not constitute legal advice. Speak with qualified counsel about your specific circumstances.",
    ],
  },
  {
    slug: "arbitration-vs-litigation-commercial-disputes",
    title: "Arbitration or Litigation? Choosing the Right Forum for Commercial Disputes",
    excerpt:
      "The forum you choose for a dispute can matter as much as the merits of the case itself.",
    category: "Litigation & Arbitration",
    author: "aline-uwase",
    date: "2026-02-18",
    readingMinutes: 7,
    coverImage: "/images/insights/arbitration-litigation.svg",
    content: [
      "When a commercial relationship breaks down, parties often assume litigation is the default path. In many cross-border or high-value disputes, arbitration offers real advantages in speed, confidentiality and enforceability.",
      "The right choice depends on the underlying contract, the relief sought, and where any resulting judgment or award will need to be enforced.",
      "We advise clients to consider dispute resolution clauses carefully at the contract drafting stage, well before any disagreement arises — it is far cheaper to choose the right forum in advance than to argue about it after a dispute has started.",
      "This article is illustrative demo content and does not constitute legal advice. Speak with qualified counsel about your specific circumstances.",
    ],
  },
];

export function getInsightBySlug(slug: string): InsightArticleData | undefined {
  return insights.find((article) => article.slug === slug);
}
