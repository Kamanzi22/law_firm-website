# Karisimbi & Partners Advocates — Client Site

The public-facing website for a fictional Kigali-based commercial law firm.
This is one of **two connected apps**:

- **This app** — what clients/visitors see (this folder)
- **`../karisimbi-admin/`** — where the firm edits everything below, from a
  phone or desktop, without touching code
- **`../karisimbi-supabase/`** — the shared database schema both apps read
  from / write to

All three share one Supabase backend. Without it configured, this app runs
entirely on bundled placeholder content (great for demos); once connected,
every page reads live data the firm can edit from the admin app.

Stack: Vite + React + TypeScript + Tailwind CSS v4, react-router-dom,
lucide-react, Supabase, React Query. Installable as a PWA.

## Getting started

```bash
npm install
npm run dev      # start dev server (uses placeholder content until .env is set)
npm run build    # type-check + production build
npm run preview  # preview the production build locally
```

## Connecting to the live backend (optional for a demo, required for editing)

1. Set up Supabase once — see `../karisimbi-supabase/README.md`.
2. Copy `.env.example` to `.env` and paste in your Supabase project URL and
   anon key.
3. Restart the dev server. The site now reads/writes live data instead of
   the bundled placeholders, and content edited in `karisimbi-admin` shows
   up here automatically.

Without `.env` set, every page silently falls back to the typed data in
`src/data/` — nothing breaks, it just isn't editable.

## Replacing placeholder content (no backend needed)

For a quick demo without setting up Supabase, every piece of real-world
content also lives in a typed data file under `src/data/` — edit these
directly and no component code needs to change:

| File | Controls |
|---|---|
| `src/data/firm.ts` | Firm name, tagline, address, phone, email, office hours, bar memberships, stats (years/cases/clients) |
| `src/data/services.ts` | The 6 practice areas: overview, "what we help with" lists, process steps |
| `src/data/team.ts` | Attorney roster: names, roles, bios, education, focus areas, photo paths |
| `src/data/testimonials.ts` | Client testimonial quotes |
| `src/data/insights.ts` | Blog/insights articles (listing + full article body) |
| `src/data/bookingSettings.ts` | Booking page availability (hours, days, consultation modes) |
| `src/data/strings.ts` | Every other UI label/heading/button copy in the app |

Every fictional value that **must** be replaced before going live is marked
with a `// REPLACE:` comment. Once Supabase is connected, prefer editing
through the admin app instead — these files become the offline fallback.

Images referenced from data files live in `public/images/` — see
`public/images/manifest.md` for the full list of filenames, what page each
one appears on, and the recommended aspect ratio.

## Booking & contact forms

Both forms write to Supabase (`bookings` / `contact_messages` tables,
visible in the admin app's inbox) when configured, and simulate a network
call otherwise. Submit logic lives in one function each —
`src/lib/submitBooking.ts` and `src/lib/submitContactMessage.ts` — so a
different backend can be dropped in by editing just that function.

## Trilingual readiness (English / French / Kinyarwanda)

This demo ships English-only, but every UI string (nav labels, headings,
button text, form labels, etc.) is centralized in `src/data/strings.ts`
rather than scattered through components. To add French and Kinyarwanda:

1. Turn each string value in `strings.ts` into a per-locale record, e.g.
   `{ en: "...", fr: "...", rw: "..." }` — or migrate to `react-i18next` with
   one JSON translation file per locale, keeping the same key structure.
2. Add a locale context/provider near the app root (`src/App.tsx`) and a
   language switcher in the header.
3. Replace direct `strings.foo.bar` reads with a `t('foo.bar')` helper (or
   keep reading the nested object per active locale — either works with the
   existing structure).

Live content (services, team, articles, etc.) would need a `language`
column added per table in Supabase for full localization — the admin app's
forms would need matching per-locale fields.

## Project structure

```
src/
  data/         Typed placeholder/fallback content
  lib/
    supabaseClient.ts   Supabase client (null if env vars unset)
    DataProvider.tsx    Fetches live-or-fallback data, exposes useAppData()
    queries/            Supabase → app-type mapping, one file per entity
    submitBooking.ts, submitContactMessage.ts, validation.ts, format.ts
  components/
    layout/     Header, Footer, WhatsApp float, sticky mobile CTA
    seo/        Per-page <title>/meta/OG/JSON-LD component
    ui/         Button, Card, SectionHeading, Reveal (scroll animation), ServiceIcon
    home/       Home page sections
    booking/    Book Appointment step components
  pages/        One file per route
  hooks/        useScrollReveal — tiny IntersectionObserver-based fade-in
public/
  images/       SVG placeholder images + manifest.md
  icons/        PWA app icons
```

## Design tokens

Colors, fonts and radii are defined once in `src/index.css` under the
Tailwind v4 `@theme` block — change a value there and it propagates
everywhere. The admin app (`../karisimbi-admin/src/index.css`) uses the
identical token block — keep both in sync if rebranding.

## PWA

Installable to a phone's home screen (manifest + service worker via
`vite-plugin-pwa`, configured in `vite.config.ts`). Icons are placeholder
navy/gold marks in `public/icons/` — regenerate with real brand icons
before launch.

## Deploying

See `../karisimbi-supabase/DEPLOYMENT.md` for the full walkthrough (Supabase
project → this app → the admin app, all free tier).

## Disclaimer

This is a demo. Content is illustrative and does not constitute legal
advice — see the footer disclaimer, which should stay in place until real
content and legal review are in place.
