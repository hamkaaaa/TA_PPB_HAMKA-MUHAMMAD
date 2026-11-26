-- =========================================================
-- TempoMatch Database Schema (Supabase / PostgreSQL)
-- Praktikum PPB Ganjil 2026 - Tugas Akhir
-- =========================================================

-- 0. Tabel Users (Akun DJ untuk Auth Custom)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  display_name text,
  password_hash text not null,
  created_at timestamptz default now()
);

-- 1. Tabel Moods (Kategori Mood Lagu untuk DJ)
create table if not exists moods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  bpm_range text,
  color_hex text default '#8B5CF6',
  created_at timestamptz default now()
);

-- 2. Tabel Tracks (Direktori Lagu dengan BPM, Key, Energy, Mood)
-- user_id NULL = lagu default publik (read-only), user_id terisi = lagu pribadi milik user
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  bpm integer not null check (bpm > 0 and bpm < 300),
  musical_key text not null,
  energy integer not null default 7 check (energy >= 1 and energy <= 10),
  duration text not null default '04:00',
  genre text not null,
  mood_id uuid references moods(id) on delete set null,
  notes text,
  cover_url text,
  user_id uuid references users(id) on delete cascade,
  deezer_id bigint unique,
  created_at timestamptz default now()
);

-- 3. Tabel DJ Crates (Setlist / Koleksi Lagu DJ milik masing-masing user)
create table if not exists dj_crates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  venue_type text,
  target_bpm text,
  description text,
  user_id uuid references users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 4. Tabel Crate Tracks (Relasi Many-to-Many antara Crate dan Track)
create table if not exists crate_tracks (
  id uuid primary key default gen_random_uuid(),
  crate_id uuid not null references dj_crates(id) on delete cascade,
  track_id uuid not null references tracks(id) on delete cascade,
  position integer default 1,
  unique (crate_id, track_id)
);

create index if not exists idx_tracks_user_id on tracks(user_id);
create index if not exists idx_dj_crates_user_id on dj_crates(user_id);
