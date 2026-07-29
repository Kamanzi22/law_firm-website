# Demo & Partners — Admin App

The law firm's side of the two connected apps, living in this repo
alongside the client site (repo root). Lets staff edit everything the
public client site displays — firm profile, services, team, testimonials,
articles, availability — plus view incoming bookings and contact messages.
Installable as a PWA on a phone's home screen.

Stack: Vite + React + TypeScript + Tailwind CSS v4, react-router-dom,
lucide-react, Supabase (auth + database + file storage), React Query.

## One-time setup

1. Set up the shared Supabase project first — see
   `../supabase/README.md`. That creates the database, the `media`
   storage bucket, and your first admin login.
2. Copy `.env.example` to `.env` and paste in your Supabase project URL and
   anon key (same values used in the client app's `.env`).
3. `npm install`
4. `npm run dev`
5. Sign in at `/login` with the admin email/password you created in the
   Supabase dashboard.

## What each screen does

| Screen | Edits |
|---|---|
| Dashboard | At-a-glance counts (pending bookings, new messages, active services/team) |
| Firm Profile | Name, logo, tagline, address, contact info, social links, stats, business hours |
| Services | The 6 practice area cards/detail pages — add, edit, reorder, hide, delete |
| Team | Attorney profiles, photos, focus areas, education |
| Testimonials | Client quotes shown on the homepage |
| Insights | Blog articles — draft/publish, cover image, body copy |
| Availability | Booking page's consultation modes, business hours/days, blackout dates |
| Bookings | Incoming consultation requests — update status (pending/confirmed/completed/cancelled) |
| Messages | Incoming contact form submissions — update status (new/read/replied) |

Every change here is picked up by the client site automatically (it reads
the same Supabase tables) — no redeploy needed for content edits, only for
code changes.

## Adding another admin user

Supabase Authentication → Users → Add user, in the dashboard. There's no
self-serve signup screen in this app by design — admin accounts are
provisioned by whoever manages the Supabase project.

## Deploying

See `../supabase/DEPLOYMENT.md` for the full walkthrough — in short: this
folder deploys as its own Vercel project (Root Directory = `admin`) from
the same repo as the client site, with the two `VITE_SUPABASE_*`
environment variables set. It's a static Vite build, so any static host
works the same way.
