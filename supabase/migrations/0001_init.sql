-- Demo & Partners Advocates — initial schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`) once,
-- on a fresh project, before running 0002_seed.sql.

create extension if not exists "pgcrypto";

-- ============================================================
-- firm_profile — singleton row (id is always 1)
-- ============================================================
create table if not exists firm_profile (
  id int primary key default 1 check (id = 1),
  name text not null,
  short_name text not null,
  tagline text not null,
  positioning text not null,
  founded_year int not null,
  logo_url text,
  address_line1 text not null,
  address_line2 text not null,
  city text not null,
  country text not null,
  phone text not null,
  phone_href text not null,
  whatsapp_number text not null,
  email text not null,
  linkedin_url text,
  twitter_url text,
  facebook_url text,
  memberships text[] not null default '{}',
  years_experience int not null default 0,
  cases_handled text not null default '',
  clients_served text not null default '',
  team_size int not null default 0,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- office_hours — ordered list of day/hours rows
-- ============================================================
create table if not exists office_hours (
  id serial primary key,
  day_label text not null,
  hours_label text not null,
  sort_order int not null default 0
);

-- ============================================================
-- services — practice areas
-- ============================================================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text not null,
  overview text not null,
  help_with text[] not null default '{}',
  process jsonb not null default '[]', -- [{ "title": "...", "description": "..." }]
  icon text not null default 'briefcase',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- team_members
-- ============================================================
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role text not null,
  photo_url text,
  bio text not null,
  focus_area_slugs text[] not null default '{}', -- references services.slug (soft link)
  education text[] not null default '{}',
  email text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- testimonials
-- ============================================================
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  role text not null,
  company text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- articles — insights / blog posts
-- ============================================================
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  category text not null,
  author_id uuid references team_members(id) on delete set null,
  published_at date,
  reading_minutes int not null default 5,
  cover_image_url text,
  content text[] not null default '{}', -- paragraphs
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- booking_settings — singleton row (id is always 1)
-- ============================================================
create table if not exists booking_settings (
  id int primary key default 1 check (id = 1),
  modes text[] not null default '{in-person,video,phone}',
  business_start_time time not null default '08:00',
  business_end_time time not null default '17:00',
  business_days int[] not null default '{1,2,3,4,5}', -- 1=Mon .. 7=Sun
  blackout_dates date[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ============================================================
-- bookings — client-submitted appointment requests
-- ============================================================
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique not null,
  matter_type text not null, -- services.slug
  mode text not null,
  preferred_date date not null,
  preferred_time time not null,
  name text not null,
  email text not null,
  phone text not null,
  language text not null default 'English',
  description text not null,
  consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  admin_notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- contact_messages — client-submitted contact form entries
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table firm_profile enable row level security;
alter table office_hours enable row level security;
alter table services enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table articles enable row level security;
alter table booking_settings enable row level security;
alter table bookings enable row level security;
alter table contact_messages enable row level security;

-- Public (anon) read access to published/active content
create policy "public read firm_profile" on firm_profile for select using (true);
create policy "public read office_hours" on office_hours for select using (true);
create policy "public read active services" on services for select using (is_active = true);
create policy "public read active team_members" on team_members for select using (is_active = true);
create policy "public read active testimonials" on testimonials for select using (is_active = true);
create policy "public read published articles" on articles for select using (status = 'published');
create policy "public read booking_settings" on booking_settings for select using (true);

-- Public (anon) insert-only on client-submitted tables — no read/update/delete
create policy "public insert bookings" on bookings for insert with check (true);
create policy "public insert contact_messages" on contact_messages for insert with check (true);

-- Authenticated (admin) full access to everything
create policy "admin all firm_profile" on firm_profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all office_hours" on office_hours for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all services" on services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all team_members" on team_members for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all articles" on articles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all booking_settings" on booking_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all bookings" on bookings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all contact_messages" on contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for logo / team photos / article covers / office photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
