-- Seeds the exact placeholder content that shipped in the static demo, so the
-- site looks identical the moment it's connected to Supabase. Replace this
-- data via the admin app once real firm content is available — this file is
-- only meant to run once, against a fresh project.

insert into firm_profile (
  id, name, short_name, tagline, positioning, founded_year, logo_url,
  address_line1, address_line2, city, country, phone, phone_href, whatsapp_number, email,
  linkedin_url, twitter_url, facebook_url, memberships,
  years_experience, cases_handled, clients_served, team_size
) values (
  1,
  'Demo & Partners Advocates',
  'Demo & Partners',
  'Commercial law counsel built for Rwanda''s growing economy.',
  'We advise ambitious businesses, investors and institutions on the deals, disputes and regulatory matters that define their growth.',
  2011,
  null,
  'KG 7 Ave', 'Kacyiru', 'Kigali', 'Rwanda',
  '+250 7XX XXX XXX', '+2507XXXXXXXX', '2507XXXXXXXX', 'info@demopartners.example',
  'https://www.linkedin.com/company/example', 'https://x.com/example', 'https://facebook.com/example',
  array['Rwanda Bar Association', 'East African Law Society', 'International Bar Association (Affiliate)'],
  14, '500+', '220+', 18
) on conflict (id) do nothing;

insert into office_hours (day_label, hours_label, sort_order) values
  ('Monday – Friday', '8:00 AM – 5:30 PM', 1),
  ('Saturday', 'By appointment only', 2),
  ('Sunday', 'Closed', 3)
on conflict do nothing;

insert into booking_settings (id, modes, business_start_time, business_end_time, business_days, blackout_dates)
values (1, array['in-person','video','phone'], '08:00', '17:00', array[1,2,3,4,5], '{}')
on conflict (id) do nothing;

insert into services (slug, name, short_description, overview, help_with, process, icon, sort_order) values
(
  'corporate-commercial',
  'Corporate & Commercial',
  'Company formation, contracts, M&A and governance for businesses at every stage.',
  'Our corporate and commercial team supports founders, boards and investors through formation, financing, transactions and day-to-day governance, with a practical focus on Rwanda''s business registration and investment framework.',
  array[
    'Company incorporation and business registration',
    'Shareholder and joint-venture agreements',
    'Mergers, acquisitions and due diligence',
    'Commercial contracts and supply agreements',
    'Corporate governance and compliance advisory',
    'Foreign investment structuring'
  ],
  '[
    {"title":"Initial consultation","description":"We learn about your business, objectives and timeline to scope the right engagement."},
    {"title":"Structuring & documentation","description":"We design the legal structure and prepare agreements tailored to the transaction."},
    {"title":"Negotiation & review","description":"We negotiate on your behalf and coordinate with counterparties and regulators."},
    {"title":"Closing & follow-through","description":"We finalize execution, filings and registrations, and remain available post-closing."}
  ]'::jsonb,
  'briefcase', 1
),
(
  'litigation-arbitration',
  'Litigation & Arbitration',
  'Representation before Rwandan courts and regional arbitration institutions.',
  'We represent clients in commercial disputes, contractual claims and arbitration proceedings, combining courtroom experience with a preference for efficient, negotiated resolutions where possible.',
  array[
    'Commercial and contractual disputes',
    'Debt recovery and enforcement',
    'Arbitration under Kigali International Arbitration Centre rules',
    'Cross-border dispute strategy',
    'Injunctions and interim relief',
    'Settlement negotiation and mediation'
  ],
  '[
    {"title":"Case assessment","description":"We review the facts, documents and merits to advise on the strongest strategy."},
    {"title":"Filing & procedure","description":"We prepare pleadings and manage procedural requirements and deadlines."},
    {"title":"Advocacy","description":"We represent you before the relevant court, tribunal or arbitral panel."},
    {"title":"Resolution & enforcement","description":"We pursue judgment, award and enforcement to secure a practical outcome."}
  ]'::jsonb,
  'gavel', 2
),
(
  'labour-employment',
  'Labour & Employment',
  'Employment contracts, workplace policy and dispute resolution for employers and staff.',
  'We advise employers and senior employees on Rwandan labour law, from hiring and workplace policy to terminations and labour dispute resolution before competent authorities.',
  array[
    'Employment contracts and staff handbooks',
    'Workplace policy and compliance audits',
    'Terminations, severance and redundancy',
    'Labour dispute resolution and RALC representation',
    'Work permits for foreign staff',
    'Executive and senior hire negotiations'
  ],
  '[
    {"title":"Policy review","description":"We assess current contracts and policies against Rwandan labour law."},
    {"title":"Advisory","description":"We provide clear guidance on rights, obligations and risk exposure."},
    {"title":"Documentation","description":"We draft or revise contracts, policies and correspondence."},
    {"title":"Resolution","description":"Where disputes arise, we represent you through mediation or hearing."}
  ]'::jsonb,
  'users', 3
),
(
  'real-estate-construction',
  'Real Estate & Construction',
  'Land transactions, leases, titling and construction contracts.',
  'We support developers, investors and landowners through land acquisition, titling, leasing and construction contracts, navigating Rwanda''s land administration system with precision.',
  array[
    'Land acquisition and title due diligence',
    'Lease and sale agreements',
    'Construction and engineering contracts',
    'Land use permits and approvals',
    'Real estate development structuring',
    'Dispute resolution on land and property matters'
  ],
  '[
    {"title":"Due diligence","description":"We verify title, encumbrances and regulatory status before you commit."},
    {"title":"Contract drafting","description":"We prepare agreements that protect your interests and allocate risk clearly."},
    {"title":"Regulatory coordination","description":"We liaise with land and planning authorities on permits and registration."},
    {"title":"Completion","description":"We see the transaction through to registration and handover."}
  ]'::jsonb,
  'building', 4
),
(
  'tax-regulatory',
  'Tax & Regulatory',
  'Tax structuring, compliance and engagement with Rwandan regulators.',
  'We help businesses navigate Rwandan tax law and sector-specific regulation, from structuring transactions efficiently to representing clients before the Rwanda Revenue Authority and other regulators.',
  array[
    'Tax structuring for transactions and investments',
    'Tax compliance and RRA correspondence',
    'Regulatory licensing and approvals',
    'Sector-specific compliance (finance, telecom, mining)',
    'Tax dispute resolution and objections',
    'Transfer pricing advisory'
  ],
  '[
    {"title":"Position review","description":"We assess your current tax and regulatory position and exposure."},
    {"title":"Strategy","description":"We recommend a structure or compliance path suited to your objectives."},
    {"title":"Implementation","description":"We prepare filings, submissions and supporting documentation."},
    {"title":"Ongoing compliance","description":"We support continued compliance and represent you in any regulator dealings."}
  ]'::jsonb,
  'landmark', 5
),
(
  'intellectual-property',
  'Intellectual Property',
  'Trademark, patent and copyright protection and enforcement.',
  'We help innovators and brands protect what they build, from registration of trademarks and patents to enforcement against infringement, both locally and across the East African region.',
  array[
    'Trademark search, filing and registration',
    'Patent and industrial design applications',
    'Copyright protection and licensing',
    'IP portfolio management',
    'Infringement enforcement and cease-and-desist actions',
    'IP clauses in commercial agreements'
  ],
  '[
    {"title":"IP audit","description":"We review what you have and identify what needs protecting."},
    {"title":"Filing strategy","description":"We recommend the right registrations for your market and budget."},
    {"title":"Prosecution","description":"We manage applications through to registration with the relevant office."},
    {"title":"Protection & enforcement","description":"We monitor and act against infringement to defend your rights."}
  ]'::jsonb,
  'lightbulb', 6
)
on conflict (slug) do nothing;

insert into team_members (slug, name, role, photo_url, bio, focus_area_slugs, education, email, sort_order) values
(
  'eric-mugisha', 'Eric Mugisha', 'Managing Partner', '/images/team/eric-mugisha.svg',
  'Eric founded the firm in 2011 after nearly a decade advising cross-border investors in East Africa. He leads the firm''s corporate and commercial practice, advising boards and investors on high-value transactions across Rwanda and the region.',
  array['corporate-commercial','tax-regulatory'],
  array['LL.M, International Business Law, University of London', 'LL.B, National University of Rwanda'],
  'e.mugisha@demopartners.example', 1
),
(
  'aline-uwase', 'Aline Uwase', 'Partner, Litigation & Arbitration', '/images/team/aline-uwase.svg',
  'Aline leads the firm''s disputes practice, representing clients before Rwandan courts and regional arbitral institutions. She is known for a measured, evidence-first approach to complex commercial disagreements.',
  array['litigation-arbitration'],
  array['LL.B, University of Rwanda', 'Certificate in International Arbitration, CIArb'],
  'a.uwase@demopartners.example', 2
),
(
  'jean-paul-nshimiyimana', 'Jean Paul Nshimiyimana', 'Senior Associate, Real Estate & Construction', '/images/team/jean-paul-nshimiyimana.svg',
  'Jean Paul advises developers and landowners on acquisitions, titling and construction contracts, with close working relationships across Rwanda''s land administration bodies.',
  array['real-estate-construction'],
  array['LL.B, University of Rwanda'],
  'jp.nshimiyimana@demopartners.example', 3
),
(
  'claudine-ingabire', 'Claudine Ingabire', 'Senior Associate, Labour & Employment', '/images/team/claudine-ingabire.svg',
  'Claudine advises employers of all sizes on workplace policy, contracts and labour disputes, and regularly represents clients before Rwanda''s labour dispute bodies.',
  array['labour-employment'],
  array['LL.B, National University of Rwanda', 'Postgraduate Diploma in Legal Practice, IRDP'],
  'c.ingabire@demopartners.example', 4
),
(
  'patrick-habimana', 'Patrick Habimana', 'Associate, Tax & Regulatory', '/images/team/patrick-habimana.svg',
  'Patrick works with businesses on tax structuring and regulatory compliance, and regularly liaises with the Rwanda Revenue Authority on behalf of clients.',
  array['tax-regulatory'],
  array['LL.B, University of Rwanda'],
  'p.habimana@demopartners.example', 5
),
(
  'diane-mukamana', 'Diane Mukamana', 'Associate, Intellectual Property', '/images/team/diane-mukamana.svg',
  'Diane helps founders and creative businesses register and protect trademarks, patents and copyright, and advises on IP terms in commercial agreements.',
  array['intellectual-property','corporate-commercial'],
  array['LL.B, University of Rwanda'],
  'd.mukamana@demopartners.example', 6
)
on conflict (slug) do nothing;

insert into testimonials (quote, author, role, company, sort_order) values
(
  'Demo & Partners guided us through a complex joint venture with a level of clarity we hadn''t experienced with counsel before. They anticipated issues before they became problems.',
  'Sarah K.', 'Chief Executive Officer', 'A regional logistics company', 1
),
(
  'Responsive, precise and genuinely invested in our outcome. Their real estate team caught a title issue that would have cost us significantly down the line.',
  'Emmanuel R.', 'Managing Director', 'A property development firm', 2
),
(
  'We''ve used the firm for employment matters across three years of rapid hiring. Their advice is always practical, not just technically correct.',
  'Grace N.', 'Head of People', 'A fintech startup', 3
);

insert into articles (slug, title, excerpt, category, author_id, published_at, reading_minutes, cover_image_url, content, status) values
(
  'structuring-foreign-investment-in-rwanda',
  'Five Things Foreign Investors Get Wrong About Structuring in Rwanda',
  'Rwanda''s investment framework is friendlier than many first-time investors assume — provided you structure correctly from day one.',
  'Corporate & Commercial',
  (select id from team_members where slug = 'eric-mugisha'),
  '2026-05-12', 6, '/images/insights/foreign-investment.svg',
  array[
    'Rwanda has built a reputation as one of the more straightforward jurisdictions in the region for foreign investment, but that reputation can lead investors to underestimate the value of early structuring advice.',
    'The most common misstep we see is treating company registration as a purely administrative task, rather than a strategic decision that affects tax exposure, repatriation of profits and future fundraising.',
    'A second common issue is delaying shareholder agreements until after a dispute has already emerged. Well-drafted governance documents, agreed while relationships are still good, save considerable cost later.',
    'This article is illustrative demo content and does not constitute legal advice. Speak with qualified counsel about your specific circumstances.'
  ],
  'published'
),
(
  'employment-contract-essentials',
  'What Every Employment Contract in Rwanda Should Actually Say',
  'A well-drafted employment contract prevents disputes. A template pulled offline usually invites them.',
  'Labour & Employment',
  (select id from team_members where slug = 'claudine-ingabire'),
  '2026-04-03', 5, '/images/insights/employment-contract.svg',
  array[
    'Employers frequently rely on generic templates for employment contracts, only to discover gaps when a dispute arises — typically around termination terms, probation periods or non-compete clauses.',
    'Rwandan labour law sets out specific requirements for contract form and content. Contracts that fall short can expose employers to unnecessary risk during termination or restructuring.',
    'We recommend a periodic review of standard contracts and staff handbooks, particularly after any change in headcount strategy or business model.',
    'This article is illustrative demo content and does not constitute legal advice. Speak with qualified counsel about your specific circumstances.'
  ],
  'published'
),
(
  'arbitration-vs-litigation-commercial-disputes',
  'Arbitration or Litigation? Choosing the Right Forum for Commercial Disputes',
  'The forum you choose for a dispute can matter as much as the merits of the case itself.',
  'Litigation & Arbitration',
  (select id from team_members where slug = 'aline-uwase'),
  '2026-02-18', 7, '/images/insights/arbitration-litigation.svg',
  array[
    'When a commercial relationship breaks down, parties often assume litigation is the default path. In many cross-border or high-value disputes, arbitration offers real advantages in speed, confidentiality and enforceability.',
    'The right choice depends on the underlying contract, the relief sought, and where any resulting judgment or award will need to be enforced.',
    'We advise clients to consider dispute resolution clauses carefully at the contract drafting stage, well before any disagreement arises — it is far cheaper to choose the right forum in advance than to argue about it after a dispute has started.',
    'This article is illustrative demo content and does not constitute legal advice. Speak with qualified counsel about your specific circumstances.'
  ],
  'published'
)
on conflict (slug) do nothing;
