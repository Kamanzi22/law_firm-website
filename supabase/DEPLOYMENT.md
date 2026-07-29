# Deploying Demo & Partners (free tier)

Three pieces, each free at this scale. One GitHub repo (this one), two
Vercel projects pointed at different subfolders of it.

| Piece | Where | Free tier covers |
|---|---|---|
| Database + auth + storage | Supabase | 500MB DB, 1GB storage, 50k monthly active users |
| Client site | Vercel (Root Directory: `.`) | Unlimited personal projects, generous bandwidth |
| Admin app | Vercel (Root Directory: `admin`) — separate project | Same |

## 1. Supabase (do this first)

Follow `README.md` in this folder: create the project, run the two SQL
migration files, create your first admin login, copy the Project URL and
the **Publishable** (anon) API key.

## 2. Client site → Vercel

Import this repo on [vercel.com/new](https://vercel.com/new). Leave
**Root Directory** as `.` (repo root — this is the client site).

Before or after the first deploy, set these in Project → Settings →
Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy after adding them if you deployed before setting them — Vite
bakes env vars in at build time, not runtime.

## 3. Admin app → Vercel

Import the **same repo again** as a **second, separate** Vercel project.
This time, expand **Root Directory** and set it to `admin`. Set the same
two environment variables on this project too.

Two projects from one repo means each gets its own URL (e.g.
`your-site.vercel.app` and `your-site-admin.vercel.app`) and its own
deploy history, but a single `git push` updates both if both folders
changed.

## 4. Custom domain (optional)

In each Vercel project: Settings → Domains → add your domain. Point the
client site at your main domain (e.g. `yourdomain.com`) and the admin app
at a subdomain (e.g. `admin.yourdomain.com`) so staff have a memorable,
separate address.

## Why you have to do steps 1–3 yourself

Vercel and Supabase logins are personal-account actions (OAuth/browser
confirmation) — there's no way to complete those on your behalf. Everything
else (code, schema, config) is already done; these are just the "click
authorize" steps tied to accounts only you control.
