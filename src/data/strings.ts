// All static UI copy lives here (not in /data files — those hold *content*
// like services/team/insights). This demo ships English only, but every
// label the UI renders is centralized here so the site is trilingual-ready.
//
// TO EXTEND TO FRENCH / KINYARWANDA:
// 1. Turn each string value below into a `Record<'en' | 'fr' | 'rw', string>`
//    (or move to i18next / react-i18next with one JSON file per locale).
// 2. Add a locale context/provider near the app root and a language
//    switcher in the Header.
// 3. Replace direct `strings.foo.bar` reads with `t('foo.bar')` (or keep
//    this same nested-object shape per locale — either works).
// The nesting/keys below were chosen so that mapping is mechanical.

export const strings = {
  nav: {
    home: "Home",
    services: "Services",
    about: "About",
    insights: "Insights",
    contact: "Contact",
    bookConsultation: "Book a Consultation",
    menu: "Menu",
    closeMenu: "Close menu",
  },
  home: {
    heroEyebrow: "Kigali, Rwanda",
    heroCtaPrimary: "Book a Consultation",
    heroCtaSecondary: "Our Services",
    trustBarHeading: "Trusted counsel, backed by results",
    yearsExperience: "Years of Experience",
    casesHandled: "Matters Handled",
    clientsServed: "Clients Served",
    membershipsHeading: "Professional Memberships",
    servicesHeading: "Practice Areas",
    servicesSubheading: "Focused expertise across the matters that matter most to your business.",
    whyUsHeading: "Why Clients Choose Us",
    testimonialsHeading: "What Clients Say",
    insightsHeading: "Latest Insights",
    insightsSubheading: "Practical perspectives from our team.",
    insightsCta: "View all insights",
    closingCtaHeading: "Ready to discuss your matter?",
    closingCtaSubheading: "Book a consultation and speak with the right member of our team.",
    closingCtaButton: "Book a Consultation",
  },
  whyUs: [
    {
      title: "Regional Perspective",
      description:
        "Deep knowledge of Rwandan law paired with experience across East African markets.",
    },
    {
      title: "Responsive by Default",
      description:
        "You will hear back from us promptly — we treat responsiveness as a professional obligation.",
    },
    {
      title: "Transparent Fees",
      description:
        "Clear engagement terms agreed upfront, with no surprises at invoicing time.",
    },
    {
      title: "Senior Attention",
      description:
        "A named partner is involved in every matter, regardless of size.",
    },
  ],
  services: {
    pageHeading: "Practice Areas",
    pageSubheading:
      "Six focused practice areas covering the legal needs of businesses operating in Rwanda and the region.",
    helpWithHeading: "What We Help With",
    processHeading: "Our Typical Process",
    ctaHeading: "Discuss a matter in this area",
    ctaButton: "Book a Consultation",
    backToServices: "All Services",
  },
  about: {
    pageHeading: "About Demo & Partners",
    storyHeading: "Our Story",
    valuesHeading: "Our Values",
    timelineHeading: "Our Journey",
    teamHeading: "Meet the Team",
    teamSubheading: "Experienced counsel across every practice area.",
  },
  values: [
    {
      title: "Integrity",
      description: "We give advice we believe in, even when it isn't what a client hoped to hear.",
    },
    {
      title: "Rigor",
      description: "We do the work thoroughly, because shortcuts in legal work become expensive later.",
    },
    {
      title: "Partnership",
      description: "We see ourselves as part of your team, not an outside vendor.",
    },
    {
      title: "Local Insight",
      description: "We combine international standards with a grounded understanding of Rwanda.",
    },
  ],
  timeline: [
    { year: "2011", event: "Demo & Partners founded in Kigali with a two-person team." },
    { year: "2014", event: "Opened dedicated Litigation & Arbitration practice." },
    { year: "2017", event: "Advised on the firm's first cross-border joint venture exceeding $10M." },
    { year: "2020", event: "Grew to 18 team members across six practice areas." },
    { year: "2023", event: "Recognized among leading commercial firms in the region." },
    { year: "2026", event: "Continuing to serve businesses across Rwanda and East Africa." },
  ],
  insightsPage: {
    pageHeading: "Insights",
    pageSubheading: "Practical legal perspectives from our team.",
    readMore: "Read article",
    backToInsights: "All Insights",
    disclaimer: "This article is illustrative demo content and does not constitute legal advice.",
  },
  contact: {
    pageHeading: "Contact Us",
    pageSubheading: "We'd welcome the opportunity to discuss your matter.",
    officeHeading: "Our Office",
    hoursHeading: "Business Hours",
    formHeading: "Send Us a Message",
    formName: "Full Name",
    formEmail: "Email Address",
    formPhone: "Phone Number",
    formSubject: "Subject",
    formMessage: "Message",
    formSubmit: "Send Message",
    formSuccessTitle: "Message sent",
    formSuccessBody: "Thank you for reaching out. A member of our team will respond shortly.",
  },
  booking: {
    pageHeading: "Book a Consultation",
    pageSubheading: "Tell us about your matter and we'll confirm a time that works for you.",
    step1Title: "What is your matter about?",
    step1Subtitle: "Choose the practice area that best fits your situation.",
    step2Title: "How would you like to meet?",
    step2Subtitle: "Choose a consultation mode, then pick a date and time.",
    step3Title: "Your details",
    step3Subtitle: "So we know who we're meeting and how to reach you.",
    step4Title: "Review & confirm",
    step4Subtitle: "Please check the details below before submitting.",
    stepLabels: ["Matter", "Schedule", "Details", "Review"],
    modeInPerson: "In Person",
    modeVideo: "Video Call",
    modePhone: "Phone Call",
    dateLabel: "Preferred Date",
    timeLabel: "Preferred Time",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone Number",
    languageLabel: "Preferred Language",
    descriptionLabel: "Briefly describe your matter",
    descriptionPlaceholder: "Share a short summary — no need for full detail yet.",
    consentLabel:
      "I consent to Demo & Partners contacting me about this request and understand this form does not create an attorney-client relationship.",
    back: "Back",
    next: "Next",
    submit: "Confirm Booking",
    submitting: "Confirming your booking…",
    successTitle: "Booking Confirmed",
    successBody: "We've received your request. A member of our team will reach out to confirm final details.",
    referenceLabel: "Reference Number",
    bookAnother: "Book Another Consultation",
    backHome: "Back to Home",
    editStep: "Edit",
  },
  footer: {
    disclaimer:
      "Demo site. Content is illustrative and does not constitute legal advice.",
    rights: "All rights reserved.",
    quickLinks: "Quick Links",
    getInTouch: "Get in Touch",
  },
  common: {
    loading: "Loading…",
    notFoundTitle: "Page Not Found",
    notFoundBody: "The page you're looking for doesn't exist.",
    notFoundCta: "Back to Home",
  },
};
