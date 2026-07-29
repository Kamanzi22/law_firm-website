// REPLACE: Practice area copy is illustrative. Replace overviews, helpWith
// lists and process steps with the firm's real service descriptions.

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  overview: string;
  helpWith: string[];
  process: ServiceProcessStep[];
  icon: "briefcase" | "gavel" | "users" | "building" | "landmark" | "lightbulb";
}

// REPLACE: the six practice areas below. Add/remove entries as needed —
// the Services index and detail pages read directly from this array.
export const services: Service[] = [
  {
    slug: "corporate-commercial",
    name: "Corporate & Commercial",
    shortDescription:
      "Company formation, contracts, M&A and governance for businesses at every stage.",
    overview:
      "Our corporate and commercial team supports founders, boards and investors through formation, financing, transactions and day-to-day governance, with a practical focus on Rwanda's business registration and investment framework.",
    helpWith: [
      "Company incorporation and business registration",
      "Shareholder and joint-venture agreements",
      "Mergers, acquisitions and due diligence",
      "Commercial contracts and supply agreements",
      "Corporate governance and compliance advisory",
      "Foreign investment structuring",
    ],
    process: [
      {
        title: "Initial consultation",
        description:
          "We learn about your business, objectives and timeline to scope the right engagement.",
      },
      {
        title: "Structuring & documentation",
        description:
          "We design the legal structure and prepare agreements tailored to the transaction.",
      },
      {
        title: "Negotiation & review",
        description:
          "We negotiate on your behalf and coordinate with counterparties and regulators.",
      },
      {
        title: "Closing & follow-through",
        description:
          "We finalize execution, filings and registrations, and remain available post-closing.",
      },
    ],
    icon: "briefcase",
  },
  {
    slug: "litigation-arbitration",
    name: "Litigation & Arbitration",
    shortDescription:
      "Representation before Rwandan courts and regional arbitration institutions.",
    overview:
      "We represent clients in commercial disputes, contractual claims and arbitration proceedings, combining courtroom experience with a preference for efficient, negotiated resolutions where possible.",
    helpWith: [
      "Commercial and contractual disputes",
      "Debt recovery and enforcement",
      "Arbitration under Kigali International Arbitration Centre rules",
      "Cross-border dispute strategy",
      "Injunctions and interim relief",
      "Settlement negotiation and mediation",
    ],
    process: [
      {
        title: "Case assessment",
        description:
          "We review the facts, documents and merits to advise on the strongest strategy.",
      },
      {
        title: "Filing & procedure",
        description:
          "We prepare pleadings and manage procedural requirements and deadlines.",
      },
      {
        title: "Advocacy",
        description:
          "We represent you before the relevant court, tribunal or arbitral panel.",
      },
      {
        title: "Resolution & enforcement",
        description:
          "We pursue judgment, award and enforcement to secure a practical outcome.",
      },
    ],
    icon: "gavel",
  },
  {
    slug: "labour-employment",
    name: "Labour & Employment",
    shortDescription:
      "Employment contracts, workplace policy and dispute resolution for employers and staff.",
    overview:
      "We advise employers and senior employees on Rwandan labour law, from hiring and workplace policy to terminations and labour dispute resolution before competent authorities.",
    helpWith: [
      "Employment contracts and staff handbooks",
      "Workplace policy and compliance audits",
      "Terminations, severance and redundancy",
      "Labour dispute resolution and RALC representation",
      "Work permits for foreign staff",
      "Executive and senior hire negotiations",
    ],
    process: [
      {
        title: "Policy review",
        description:
          "We assess current contracts and policies against Rwandan labour law.",
      },
      {
        title: "Advisory",
        description:
          "We provide clear guidance on rights, obligations and risk exposure.",
      },
      {
        title: "Documentation",
        description:
          "We draft or revise contracts, policies and correspondence.",
      },
      {
        title: "Resolution",
        description:
          "Where disputes arise, we represent you through mediation or hearing.",
      },
    ],
    icon: "users",
  },
  {
    slug: "real-estate-construction",
    name: "Real Estate & Construction",
    shortDescription:
      "Land transactions, leases, titling and construction contracts.",
    overview:
      "We support developers, investors and landowners through land acquisition, titling, leasing and construction contracts, navigating Rwanda's land administration system with precision.",
    helpWith: [
      "Land acquisition and title due diligence",
      "Lease and sale agreements",
      "Construction and engineering contracts",
      "Land use permits and approvals",
      "Real estate development structuring",
      "Dispute resolution on land and property matters",
    ],
    process: [
      {
        title: "Due diligence",
        description:
          "We verify title, encumbrances and regulatory status before you commit.",
      },
      {
        title: "Contract drafting",
        description:
          "We prepare agreements that protect your interests and allocate risk clearly.",
      },
      {
        title: "Regulatory coordination",
        description:
          "We liaise with land and planning authorities on permits and registration.",
      },
      {
        title: "Completion",
        description:
          "We see the transaction through to registration and handover.",
      },
    ],
    icon: "building",
  },
  {
    slug: "tax-regulatory",
    name: "Tax & Regulatory",
    shortDescription:
      "Tax structuring, compliance and engagement with Rwandan regulators.",
    overview:
      "We help businesses navigate Rwandan tax law and sector-specific regulation, from structuring transactions efficiently to representing clients before the Rwanda Revenue Authority and other regulators.",
    helpWith: [
      "Tax structuring for transactions and investments",
      "Tax compliance and RRA correspondence",
      "Regulatory licensing and approvals",
      "Sector-specific compliance (finance, telecom, mining)",
      "Tax dispute resolution and objections",
      "Transfer pricing advisory",
    ],
    process: [
      {
        title: "Position review",
        description:
          "We assess your current tax and regulatory position and exposure.",
      },
      {
        title: "Strategy",
        description:
          "We recommend a structure or compliance path suited to your objectives.",
      },
      {
        title: "Implementation",
        description:
          "We prepare filings, submissions and supporting documentation.",
      },
      {
        title: "Ongoing compliance",
        description:
          "We support continued compliance and represent you in any regulator dealings.",
      },
    ],
    icon: "landmark",
  },
  {
    slug: "intellectual-property",
    name: "Intellectual Property",
    shortDescription:
      "Trademark, patent and copyright protection and enforcement.",
    overview:
      "We help innovators and brands protect what they build, from registration of trademarks and patents to enforcement against infringement, both locally and across the East African region.",
    helpWith: [
      "Trademark search, filing and registration",
      "Patent and industrial design applications",
      "Copyright protection and licensing",
      "IP portfolio management",
      "Infringement enforcement and cease-and-desist actions",
      "IP clauses in commercial agreements",
    ],
    process: [
      {
        title: "IP audit",
        description:
          "We review what you have and identify what needs protecting.",
      },
      {
        title: "Filing strategy",
        description:
          "We recommend the right registrations for your market and budget.",
      },
      {
        title: "Prosecution",
        description:
          "We manage applications through to registration with the relevant office.",
      },
      {
        title: "Protection & enforcement",
        description:
          "We monitor and act against infringement to defend your rights.",
      },
    ],
    icon: "lightbulb",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
