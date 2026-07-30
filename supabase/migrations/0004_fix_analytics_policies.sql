-- Idempotent fix: (re)creates the analytics RLS policies in case 0003 only
-- partially applied. Safe to run any number of times.

drop policy if exists "public insert site_sessions" on site_sessions;
drop policy if exists "public update site_sessions" on site_sessions;
drop policy if exists "admin all site_sessions" on site_sessions;
drop policy if exists "public insert page_views" on page_views;
drop policy if exists "admin all page_views" on page_views;

alter table site_sessions enable row level security;
alter table page_views enable row level security;

create policy "public insert site_sessions" on site_sessions for insert with check (true);
create policy "public update site_sessions" on site_sessions for update using (true) with check (true);
create policy "admin all site_sessions" on site_sessions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public insert page_views" on page_views for insert with check (true);
create policy "admin all page_views" on page_views for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
