# Demo & Partners — Supabase Backend

Shared database schema for the two Demo & Partners apps, both in this repo:

- **Client site** (repo root) — public-facing, reads this data
- **Admin app** (`admin/`) — edits this data (requires login)

## One-time setup

1. Create a free project at [supabase.com](https://supabase.com) (free tier:
   500MB database, 1GB file storage, 50k monthly active users — plenty for
   this).
2. In the Supabase dashboard, open **SQL Editor** and run, in order:
   - `migrations/0001_init.sql` — creates all tables, RLS policies, and the
     `media` storage bucket.
   - `migrations/0002_seed.sql` — loads the same placeholder content the
     static demo shipped with, so the site looks identical once connected.
3. Create the first admin login: **Authentication → Users → Add user** in
   the Supabase dashboard. Use a real email/password — this is what you'll
   use to log into the admin app.
4. Copy two values from **Project Settings → API**:
   - `Project URL`
   - `anon` `public` API key (safe to expose in frontend code — it's
     restricted by the row-level security policies in `0001_init.sql`,
     never use the `service_role` key in either frontend app)
5. Paste those into `.env` in **both** the repo root and `admin/` (see
   each app's `.env.example`).

## What's editable vs. client-only

Row-level security enforces this at the database level, not just in the UI:

| Table | Public (client site) | Authenticated (admin app) |
|---|---|---|
| `firm_profile`, `office_hours`, `booking_settings` | read | read + write |
| `services`, `team_members`, `testimonials` | read active only | read + write all |
| `articles` | read published only | read + write all |
| `bookings`, `contact_messages` | **insert only** (can't read others' submissions) | read + write |

## Schema overview

- `firm_profile` / `booking_settings` — singleton rows (`id = 1`) holding
  firm-wide settings edited from one admin screen each.
- `services`, `team_members`, `testimonials`, `articles` — content
  collections with `is_active` / `status` toggles and `sort_order` for
  reordering from the admin app.
- `bookings`, `contact_messages` — client submissions from the two public
  forms; visible only in the admin app's inbox.
- Storage bucket `media` — for logo, team photos, article covers, office
  photos uploaded from the admin app (publicly readable URLs, admin-only
  write).

## Making schema changes later

Add a new file `migrations/0003_your_change.sql` and run it the same way
via the SQL Editor. Keep files numbered in order so the history stays
readable.
