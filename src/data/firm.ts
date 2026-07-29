// REPLACE: All values in this file are fictional placeholder content for demo
// purposes. Swap in the firm's real details before going live.

export interface OfficeHours {
  day: string;
  hours: string;
}

export interface FirmData {
  name: string;
  shortName: string;
  tagline: string;
  positioning: string;
  founded: number;
  logoUrl?: string | null;
  address: {
    line1: string;
    line2: string;
    city: string;
    country: string;
  };
  phone: string;
  phoneHref: string;
  whatsappNumber: string; // digits only, international format, no +
  email: string;
  mapEmbedPlaceholder: string;
  socials: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  memberships: string[];
  stats: {
    yearsExperience: number;
    casesHandled: string;
    clientsServed: string;
    teamSize: number;
  };
  hours: OfficeHours[];
}

// REPLACE: firm identity, address, contact details and membership bodies.
export const firm: FirmData = {
  name: "Demo & Partners Advocates",
  shortName: "Demo & Partners",
  tagline: "Commercial law counsel built for Rwanda's growing economy.",
  positioning:
    "We advise ambitious businesses, investors and institutions on the deals, disputes and regulatory matters that define their growth.",
  founded: 2011,
  logoUrl: null,
  address: {
    line1: "KG 7 Ave",
    line2: "Kacyiru",
    city: "Kigali",
    country: "Rwanda",
  },
  phone: "+250 7XX XXX XXX",
  phoneHref: "+2507XXXXXXXX",
  whatsappNumber: "2507XXXXXXXX",
  email: "info@demopartners.example",
  mapEmbedPlaceholder: "KG 7 Ave, Kacyiru, Kigali, Rwanda",
  socials: {
    linkedin: "https://www.linkedin.com/company/example",
    twitter: "https://x.com/example",
    facebook: "https://facebook.com/example",
  },
  // REPLACE: confirm current membership/registration status with the firm.
  memberships: [
    "Rwanda Bar Association",
    "East African Law Society",
    "International Bar Association (Affiliate)",
  ],
  stats: {
    yearsExperience: 14,
    casesHandled: "500+",
    clientsServed: "220+",
    teamSize: 18,
  },
  hours: [
    { day: "Monday – Friday", hours: "8:00 AM – 5:30 PM" },
    { day: "Saturday", hours: "By appointment only" },
    { day: "Sunday", hours: "Closed" },
  ],
};
