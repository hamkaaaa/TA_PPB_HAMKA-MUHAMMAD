-- =========================================================
-- TempoMatch Migration: Custom Users Auth & Per-User Data
-- Jalankan di Supabase SQL Editor pada database yang sudah ada
-- =========================================================

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  display_name text,
  password_hash text not null,
  created_at timestamptz default now()
);

alter table tracks
  add column if not exists user_id uuid references users(id) on delete cascade;

alter table tracks
  add column if not exists deezer_id bigint unique;

alter table dj_crates
  add column if not exists user_id uuid references users(id) on delete cascade;

create index if not exists idx_tracks_user_id on tracks(user_id);
create index if not exists idx_dj_crates_user_id on dj_crates(user_id);
