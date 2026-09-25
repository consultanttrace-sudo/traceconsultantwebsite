-- TRACE Consultant website — Supabase schema
-- Run this once in Supabase: Project -> SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- ---------- Blog posts ----------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image_url text,
  body_html text not null default '',
  is_published boolean not null default false,
  published_at timestamptz not null default now()
);

alter table posts enable row level security;

-- Anyone (the public site, using the anon key) can read published posts only.
create policy "public can read published posts"
  on posts for select
  using (is_published = true);

-- No insert/update/delete policy for anon on purpose: write posts from the
-- Supabase Table Editor (or with the service role key), never from the browser.

-- ---------- Contact / lead form ----------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- Anyone can submit the contact form...
create policy "public can insert leads"
  on leads for insert
  with check (true);

-- ...but nobody can read leads back through the anon key.
-- View submissions in the Supabase Table Editor, or add an authenticated-only
-- select policy later if you build a private dashboard.

-- ---------- Example seed post (safe to delete) ----------
insert into posts (slug, title, excerpt, body_html, is_published)
values (
  'contoh-post-pertama',
  'Contoh Post — Boleh Dihapus',
  'Ini contoh post supaya halaman blog nggak kosong. Hapus atau edit lewat Table Editor.',
  '<p>Ganti isi ini lewat Supabase Table Editor pada tabel <code>posts</code>. Kolom <code>body_html</code> menerima HTML sederhana (paragraf, heading, list, gambar).</p>',
  true
)
on conflict (slug) do nothing;
