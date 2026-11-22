-- =========================================================
-- TempoMatch Seed Data
-- Jalankan setelah schema.sql di Supabase SQL Editor
-- =========================================================

-- Seed Moods
insert into moods (name, description, bpm_range, color_hex) values
  ('Euphoric', 'Lagu dengan build-up megah, synth cerah, dan drop penuh energi untuk momen puncak.', '126 - 134 BPM', '#EC4899'),
  ('Dark & Hypnotic', 'Groove bassline dalam dan atmosfer gelap yang menghipnotis lantai dansa.', '128 - 138 BPM', '#8B5CF6'),
  ('Groovy / Funky', 'Ritme bassline bouncy, hi-hat tajam, dan nuansa disco/funk yang bikin bergoyang.', '118 - 126 BPM', '#F59E0B'),
  ('Chill / Deep', 'Beat santai, pad hangat, dan vokal lembut untuk sunset set atau warm-up.', '105 - 120 BPM', '#06B6D4'),
  ('High Energy', 'Tempo cepat, kick punchy, dan intensitas tinggi untuk peak-hour rave.', '135 - 175 BPM', '#EF4444'),
  ('Melodic', 'Harmoni emosional dengan arpeggio progresif yang mengalir mulus.', '122 - 128 BPM', '#10B981')
on conflict (name) do nothing;

-- Seed Tracks
insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Midnight Mirage', 'Kairo Vance', 124, '8A (Am)', 7, '06:12', 'Melodic House', id, 'Intro 32 bar bersih, cocok untuk transisi dari 122 BPM.'
from moods where name = 'Melodic';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Neon Overdrive', 'Sora & Pulse', 128, '11A (F#m)', 9, '05:30', 'Progressive House', id, 'Build-up vokal panjang di menit 2:15, drop sangat kuat.'
from moods where name = 'Euphoric';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Subterranean Echo', 'Vexel', 132, '4A (Fm)', 8, '06:45', 'Peak Time Techno', id, 'Kick berat sejak bar ke-17, bagus untuk layering acapella.'
from moods where name = 'Dark & Hypnotic';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Velvet Disco', 'Luna Groove', 122, '9B (G)', 7, '05:08', 'Nu-Disco / House', id, 'Bassline slap funky, ideal untuk crowd warmup jam 9 malam.'
from moods where name = 'Groovy / Funky';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Golden Horizon', 'Nadia Sol', 116, '6A (Gm)', 4, '04:55', 'Organic House', id, 'Percussion akustik ringan, cocok untuk pembuka sunset rooftop.'
from moods where name = 'Chill / Deep';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Hyperion Rush', 'KINETIX', 140, '1A (Abm)', 10, '04:40', 'Hard Techno', id, 'Intensitas penuh dari awal sampai akhir. Gunakan filter HPF saat outro.'
from moods where name = 'High Energy';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Solaris Drift', 'Aetheris', 125, '8B (C)', 8, '06:05', 'Melodic Techno', id, 'Harmonik kompatibel dengan Midnight Mirage (8A -> 8B).'
from moods where name = 'Melodic';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Bossa Elektronika', 'Rico & Maya', 123, '10A (Bm)', 6, '05:22', 'Tech House', id, 'Vocal chop catchy di reff, crowd-pleaser untuk club.'
from moods where name = 'Groovy / Funky';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Shadow Protocol', 'Nocturne 99', 134, '5A (Cm)', 9, '05:50', 'Industrial Techno', id, 'Atmosfer industrial gelap, pas untuk transisi larut malam.'
from moods where name = 'Dark & Hypnotic';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Skyline Anthem', 'Arlo & Dawn', 130, '12B (E)', 9, '05:18', 'Festival House', id, 'Synth lead besar, cocok sebagai lagu penutup set.'
from moods where name = 'Euphoric';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Tidal Breeze', 'Koa', 112, '7A (Dm)', 3, '04:32', 'Deep Lounge', id, 'Pad ambient lembut dan bass sub hangat.'
from moods where name = 'Chill / Deep';

insert into tracks (title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes)
select 'Velocity 174', 'Breakline', 174, '2A (Ebm)', 10, '04:15', 'Drum & Bass', id, 'Double-time breakbeat untuk penutup energi maksimal.'
from moods where name = 'High Energy';

-- Seed DJ Crates
insert into dj_crates (name, venue_type, target_bpm, description) values
  ('Sunset Rooftop Warmup', 'Rooftop Lounge', '112 - 124 BPM', 'Set pembuka yang santai dan groovy untuk menyambut matahari terbenam.'),
  ('Club Peak Hour', 'Nightclub', '126 - 134 BPM', 'Kumpulan lagu euphoric dan dark techno untuk jam puncak lantai dansa.'),
  ('Afterhours Underground', 'Warehouse', '132 - 142 BPM', 'Track gelap, hipnotis, dan berenergi tinggi untuk sesi larut malam.');

-- Link some tracks to Crates
insert into crate_tracks (crate_id, track_id, position)
select c.id, t.id, 1 from dj_crates c, tracks t where c.name = 'Sunset Rooftop Warmup' and t.title = 'Tidal Breeze'
on conflict do nothing;

insert into crate_tracks (crate_id, track_id, position)
select c.id, t.id, 2 from dj_crates c, tracks t where c.name = 'Sunset Rooftop Warmup' and t.title = 'Golden Horizon'
on conflict do nothing;

insert into crate_tracks (crate_id, track_id, position)
select c.id, t.id, 3 from dj_crates c, tracks t where c.name = 'Sunset Rooftop Warmup' and t.title = 'Velvet Disco'
on conflict do nothing;

insert into crate_tracks (crate_id, track_id, position)
select c.id, t.id, 1 from dj_crates c, tracks t where c.name = 'Club Peak Hour' and t.title = 'Neon Overdrive'
on conflict do nothing;

insert into crate_tracks (crate_id, track_id, position)
select c.id, t.id, 2 from dj_crates c, tracks t where c.name = 'Club Peak Hour' and t.title = 'Skyline Anthem'
on conflict do nothing;

insert into crate_tracks (crate_id, track_id, position)
select c.id, t.id, 3 from dj_crates c, tracks t where c.name = 'Club Peak Hour' and t.title = 'Subterranean Echo'
on conflict do nothing;

