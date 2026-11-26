import { supabase } from "../config/supabaseClient.js";

const CURATED_DEEZER_TRACKS = [
  // Euphoric
  {
    deezerId: 14383880,
    genre: "Progressive House",
    musical_key: "12A (C#m)",
    energy: 9,
    moodName: "Euphoric",
    notes: "Anthem ikonik dengan riff piano & synth progresif, cocok untuk peak hour.",
  },
  {
    deezerId: 75768941,
    genre: "Electro House",
    musical_key: "9B (G)",
    energy: 9,
    moodName: "Euphoric",
    notes: "Build-up cerah dengan drop energik untuk crowd sing-along.",
  },
  {
    deezerId: 62847142,
    genre: "Progressive House",
    musical_key: "5A (Cm)",
    energy: 9,
    moodName: "Euphoric",
    notes: "Vokal kuat Sia sebelum drop big room, efektif menaikkan tensi set.",
  },
  {
    deezerId: 60842359,
    genre: "Progressive House",
    musical_key: "10A (Bm)",
    energy: 9,
    moodName: "Euphoric",
    notes: "Festival progressive anthem untuk momen klimaks menjelang penutup.",
  },
  {
    deezerId: 60904700,
    genre: "Electro House",
    musical_key: "4B (Ab)",
    energy: 8,
    moodName: "Euphoric",
    notes: "Break vokal emosional lalu masuk ke drop electro house 128 BPM.",
  },

  // Groovy / Funky
  {
    deezerId: 75526535,
    genre: "UK Garage",
    musical_key: "4A (Fm)",
    energy: 7,
    moodName: "Groovy / Funky",
    notes: "Beat UK garage bouncy dengan vokal Sam Smith yang mulus untuk transisi.",
  },
  {
    deezerId: 574823082,
    genre: "Tech House",
    musical_key: "6A (Gm)",
    energy: 8,
    moodName: "Groovy / Funky",
    notes: "Bassline tech house punchy dengan horn synth khas club.",
  },
  {
    deezerId: 66609426,
    genre: "Nu-Disco",
    musical_key: "10A (Bm)",
    energy: 7,
    moodName: "Groovy / Funky",
    notes: "Gitar funk Nile Rodgers dengan groove 116 BPM untuk warm-up disco.",
  },
  {
    deezerId: 3129775,
    genre: "French House",
    musical_key: "8A (Am)",
    energy: 7,
    moodName: "Groovy / Funky",
    notes: "Bassline house klasik 121 BPM, sangat mudah di-loop saat mixing.",
  },
  {
    deezerId: 10284909,
    genre: "Electro Funk",
    musical_key: "11B (A)",
    energy: 7,
    moodName: "Groovy / Funky",
    notes: "Groove nu-disco / electro funk upbeat untuk pembuka lantai dansa.",
  },

  // Melodic
  {
    deezerId: 118585342,
    genre: "Progressive House",
    musical_key: "11A (F#m)",
    energy: 8,
    moodName: "Melodic",
    notes: "Arpeggio panjang progresif yang terus naik hingga drop klimaks.",
  },
  {
    deezerId: 5150304,
    genre: "Progressive House",
    musical_key: "1B (B)",
    energy: 8,
    moodName: "Melodic",
    notes: "Intro ambient panjang bertransisi halus ke groove progressive 128 BPM.",
  },
  {
    deezerId: 113475002,
    genre: "Melodic House",
    musical_key: "8A (Am)",
    energy: 7,
    moodName: "Melodic",
    notes: "Synth hangat berlapis dan buildup emosional untuk sunset atau afterhours.",
  },

  // Dark & Hypnotic
  {
    deezerId: 389034231,
    genre: "Breakbeat",
    musical_key: "9A (Em)",
    energy: 8,
    moodName: "Dark & Hypnotic",
    notes: "Pad atmosferik melankolis di atas breakbeat 130 BPM yang menghipnotis.",
  },
  {
    deezerId: 699067122,
    genre: "High-Tech Minimal",
    musical_key: "7A (Dm)",
    energy: 8,
    moodName: "Dark & Hypnotic",
    notes: "Minimal techno presisi dengan bassline gelap dan groove stabil 125 BPM.",
  },

  // Chill / Deep
  {
    deezerId: 90726629,
    genre: "Tropical House",
    musical_key: "10A (Bm)",
    energy: 5,
    moodName: "Chill / Deep",
    notes: "Tempo santai 114 BPM dengan melodi pan-flute hangat untuk lounge/rooftop.",
  },
  {
    deezerId: 403915272,
    genre: "Electronic",
    musical_key: "11A (F#m)",
    energy: 6,
    moodName: "Chill / Deep",
    notes: "Aransemen sinematik lembut 120 BPM, cocok sebagai track pembuka set.",
  },
  {
    deezerId: 135541760,
    genre: "Downtempo",
    musical_key: "4A (Fm)",
    energy: 6,
    moodName: "Chill / Deep",
    notes: "Perkusi organik & vocal chop halus untuk set deep/warm-up.",
  },

  // High Energy
  {
    deezerId: 2102633427,
    genre: "Big Room House",
    musical_key: "4A (Fm)",
    energy: 10,
    moodName: "High Energy",
    notes: "Drop big room bertenaga tinggi 128 BPM dengan kick sub yang masif.",
  },
  {
    deezerId: 716493872,
    genre: "Drum & Bass",
    musical_key: "11A (F#m)",
    energy: 10,
    moodName: "High Energy",
    notes: "Drum & Bass 174 BPM tajam dengan bassline rave berenergi penuh.",
  },
  {
    deezerId: 81251344,
    genre: "Drum & Bass",
    musical_key: "5A (Cm)",
    energy: 10,
    moodName: "High Energy",
    notes: "Breakbeat Drum & Bass klasik 174 BPM untuk puncak energi penutup set.",
  },
];

function formatDuration(seconds) {
  const total = Number(seconds) || 0;
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function fetchDeezerTrack(deezerId) {
  const res = await fetch(`https://api.deezer.com/track/${deezerId}`);
  if (!res.ok) {
    throw new Error(`Deezer API HTTP ${res.status} for track ${deezerId}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(`Deezer API error for ${deezerId}: ${data.error.message}`);
  }
  return data;
}

async function main() {
  if (!supabase) {
    console.error(
      "Supabase client is not configured. Set SUPABASE_URL and SUPABASE_KEY in backend/.env."
    );
    process.exit(1);
  }

  // Verify migration columns exist before mutating data
  const { error: schemaCheckError } = await supabase
    .from("tracks")
    .select("id, user_id, deezer_id")
    .limit(1);

  if (schemaCheckError) {
    console.error(
      "Kolom user_id / deezer_id belum tersedia di tabel tracks.\n" +
        "Silakan jalankan file supabase/migration_auth.sql di Supabase SQL Editor terlebih dahulu.\n" +
        "Detail:",
      schemaCheckError.message
    );
    process.exit(1);
  }

  // Load moods map
  const { data: moods, error: moodsError } = await supabase
    .from("moods")
    .select("id, name");
  if (moodsError) throw moodsError;

  const moodMap = new Map((moods || []).map((m) => [m.name, m.id]));

  console.log(
    `Mengambil ${CURATED_DEEZER_TRACKS.length} lagu riil dari Deezer Public API...`
  );

  const rowsToInsert = [];
  for (const item of CURATED_DEEZER_TRACKS) {
    const dz = await fetchDeezerTrack(item.deezerId);
    const bpm = Math.round(Number(dz.bpm) || 0);
    if (bpm <= 0 || bpm >= 300) {
      throw new Error(`Invalid BPM (${dz.bpm}) for Deezer track ${item.deezerId}`);
    }

    rowsToInsert.push({
      title: dz.title,
      artist: dz.artist?.name || "Unknown Artist",
      bpm,
      musical_key: item.musical_key,
      energy: item.energy,
      duration: formatDuration(dz.duration),
      genre: item.genre,
      mood_id: moodMap.get(item.moodName) || null,
      notes: item.notes,
      cover_url: dz.album?.cover_medium || dz.album?.cover || null,
      user_id: null,
      deezer_id: item.deezerId,
    });
    console.log(
      `  ✓ ${dz.title} — ${dz.artist?.name} (${bpm} BPM, ${formatDuration(dz.duration)})`
    );
  }

  // Remove old unowned default tracks and unowned seed crates
  const { error: deleteCratesErr } = await supabase
    .from("dj_crates")
    .delete()
    .is("user_id", null);
  if (deleteCratesErr) throw deleteCratesErr;

  const { error: deleteTracksErr } = await supabase
    .from("tracks")
    .delete()
    .is("user_id", null);
  if (deleteTracksErr) throw deleteTracksErr;

  const { data: inserted, error: insertErr } = await supabase
    .from("tracks")
    .insert(rowsToInsert)
    .select("id, title, artist, bpm");
  if (insertErr) throw insertErr;

  console.log(
    `\nBerhasil mengimpor ${inserted.length} lagu default riil dari Deezer API ke Supabase.`
  );
}

main().catch((err) => {
  console.error("Gagal mengimpor lagu dari Deezer API:", err.message);
  process.exit(1);
});
