-- Website activity analytics: anonymous visit tracking for the client site,
-- readable only in the admin app.
--
-- A "session" = one browser tab's visit, identified by a client-generated id
-- stored in sessionStorage (so it naturally resets per tab/visit, no cookies
-- or persistent visitor IDs). Duration is approximated by a periodic
-- heartbeat updating last_seen_at while the tab is open — see
-- src/lib/analytics.ts in the client app.

create table if not exists site_sessions (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  country text,
  city text,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop')),
  referrer text
);

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references site_sessions(id) on delete cascade,
  path text not null,
  viewed_at timestamptz not null default now()
);

create index if not exists page_views_session_id_idx on page_views(session_id);
create index if not exists page_views_viewed_at_idx on page_views(viewed_at);
create index if not exists site_sessions_started_at_idx on site_sessions(started_at);

alter table site_sessions enable row level security;
alter table page_views enable row level security;

-- The client site can create a session and keep it alive (heartbeat), but
-- never read visit data back — only the admin app can.
create policy "public insert site_sessions" on site_sessions for insert with check (true);
create policy "public update site_sessions" on site_sessions for update using (true) with check (true);
create policy "admin all site_sessions" on site_sessions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public insert page_views" on page_views for insert with check (true);
create policy "admin all page_views" on page_views for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
