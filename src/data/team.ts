// REPLACE: Team bios, roles and photos are entirely fictional placeholders.
// Photo files referenced here should live in /public/images/team/ — see
// /public/images/manifest.md for the full list of expected filenames.

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  focusAreas: string[]; // service slugs
  education: string[];
  email: string;
}

// REPLACE: attorney roster. Add/remove members as needed.
export const team: TeamMember[] = [
  {
    slug: "eric-mugisha",
    name: "Eric Mugisha",
    role: "Managing Partner",
    photo: "/images/team/eric-mugisha.svg",
    bio: "Eric founded the firm in 2011 after nearly a decade advising cross-border investors in East Africa. He leads the firm's corporate and commercial practice, advising boards and investors on high-value transactions across Rwanda and the region.",
    focusAreas: ["corporate-commercial", "tax-regulatory"],
    education: [
      "LL.M, International Business Law, University of London",
      "LL.B, National University of Rwanda",
    ],
    email: "e.mugisha@karisimbipartners.example",
  },
  {
    slug: "aline-uwase",
    name: "Aline Uwase",
    role: "Partner, Litigation & Arbitration",
    photo: "/images/team/aline-uwase.svg",
    bio: "Aline leads the firm's disputes practice, representing clients before Rwandan courts and regional arbitral institutions. She is known for a measured, evidence-first approach to complex commercial disagreements.",
    focusAreas: ["litigation-arbitration"],
    education: [
      "LL.B, University of Rwanda",
      "Certificate in International Arbitration, CIArb",
    ],
    email: "a.uwase@karisimbipartners.example",
  },
  {
    slug: "jean-paul-nshimiyimana",
    name: "Jean Paul Nshimiyimana",
    role: "Senior Associate, Real Estate & Construction",
    photo: "/images/team/jean-paul-nshimiyimana.svg",
    bio: "Jean Paul advises developers and landowners on acquisitions, titling and construction contracts, with close working relationships across Rwanda's land administration bodies.",
    focusAreas: ["real-estate-construction"],
    education: ["LL.B, University of Rwanda"],
    email: "jp.nshimiyimana@karisimbipartners.example",
  },
  {
    slug: "claudine-ingabire",
    name: "Claudine Ingabire",
    role: "Senior Associate, Labour & Employment",
    photo: "/images/team/claudine-ingabire.svg",
    bio: "Claudine advises employers of all sizes on workplace policy, contracts and labour disputes, and regularly represents clients before Rwanda's labour dispute bodies.",
    focusAreas: ["labour-employment"],
    education: [
      "LL.B, National University of Rwanda",
      "Postgraduate Diploma in Legal Practice, IRDP",
    ],
    email: "c.ingabire@karisimbipartners.example",
  },
  {
    slug: "patrick-habimana",
    name: "Patrick Habimana",
    role: "Associate, Tax & Regulatory",
    photo: "/images/team/patrick-habimana.svg",
    bio: "Patrick works with businesses on tax structuring and regulatory compliance, and regularly liaises with the Rwanda Revenue Authority on behalf of clients.",
    focusAreas: ["tax-regulatory"],
    education: ["LL.B, University of Rwanda"],
    email: "p.habimana@karisimbipartners.example",
  },
  {
    slug: "diane-mukamana",
    name: "Diane Mukamana",
    role: "Associate, Intellectual Property",
    photo: "/images/team/diane-mukamana.svg",
    bio: "Diane helps founders and creative businesses register and protect trademarks, patents and copyright, and advises on IP terms in commercial agreements.",
    focusAreas: ["intellectual-property", "corporate-commercial"],
    education: ["LL.B, University of Rwanda"],
    email: "d.mukamana@karisimbipartners.example",
  },
];

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug);
}
