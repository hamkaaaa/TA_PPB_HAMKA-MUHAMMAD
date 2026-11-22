import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PlusCircle, Save } from "lucide-react";
import { api } from "../api/client";
import ErrorBanner from "../components/ErrorBanner";
import GenreAutocomplete from "../components/GenreAutocomplete";

const CAMELOT_KEYS = [
  "1A (Abm)",
  "2A (Ebm)",
  "3A (Bbm)",
  "4A (Fm)",
  "5A (Cm)",
  "6A (Gm)",
  "7A (Dm)",
  "8A (Am)",
  "9A (Em)",
  "10A (Bm)",
  "11A (F#m)",
  "12A (C#m)",
  "1B (B)",
  "2B (F#)",
  "3B (Db)",
  "4B (Ab)",
  "5B (Eb)",
  "6B (Bb)",
  "7B (F)",
  "8B (C)",
  "9B (G)",
  "10B (D)",
  "11B (A)",
  "12B (E)",
];

export default function AddTrackPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [moods, setMoods] = useState([]);
  const [existingGenres, setExistingGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [bpm, setBpm] = useState("126");
  const [musicalKey, setMusicalKey] = useState("8A (Am)");
  const [energy, setEnergy] = useState(7);
  const [duration, setDuration] = useState("05:00");
  const [genre, setGenre] = useState("Tech House");
  const [moodId, setMoodId] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMoods()
      .then((data) => {
        setMoods(data);
        if (!isEdit && data.length > 0) setMoodId(data[0].id);
      })
      .catch((err) => setError(err.message));

    api
      .getGenres()
      .then((data) => {
        if (Array.isArray(data)) setExistingGenres(data);
      })
      .catch(() => {});

    if (isEdit) {
      api
        .getTrackById(id)
        .then((t) => {
          setTitle(t.title || "");
          setArtist(t.artist || "");
          setBpm(String(t.bpm || 126));
          setMusicalKey(t.musical_key || "8A (Am)");
          setEnergy(t.energy || 7);
          setDuration(t.duration || "05:00");
          setGenre(t.genre || "");
          setMoodId(t.mood_id || "");
          setNotes(t.notes || "");
        })
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: title.trim(),
      artist: artist.trim(),
      bpm: Number(bpm),
      musical_key: musicalKey,
      energy: Number(energy),
      duration: duration.trim() || "04:30",
      genre: genre.trim(),
      mood_id: moodId || null,
      notes: notes.trim(),
    };

    try {
      if (isEdit) {
        await api.updateTrack(id, payload);
        navigate(`/tracks/${id}`);
      } else {
        const created = await api.createTrack(payload);
        navigate(`/tracks/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {isEdit && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">
              {isEdit ? "Edit Lagu" : "Tambah Lagu Baru"}
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Simpan metadata BPM, Key, dan Mood ke database Supabase
          </p>
        </div>
      </div>

      <ErrorBanner message={error} />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-300">
            Judul Lagu *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="mis. Midnight Mirage"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-300">
            Artis / Produser *
          </label>
          <input
            type="text"
            required
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="mis. Kairo Vance"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-300">
              BPM *
            </label>
            <input
              type="number"
              required
              min={50}
              max={240}
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-cyan-300 font-bold tabular-nums outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-300">
              Camelot Key *
            </label>
            <select
              value={musicalKey}
              onChange={(e) => setMusicalKey(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
            >
              {CAMELOT_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-300">
              Genre *
            </label>
            <GenreAutocomplete
              required
              value={genre}
              onChange={setGenre}
              genres={existingGenres}
              placeholder="Tech House"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-300">
              Durasi
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="05:30"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 tabular-nums outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-300">
            Mood
          </label>
          <select
            value={moodId}
            onChange={(e) => setMoodId(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
          >
            <option value="">-- Pilih Mood --</option>
            {moods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.bpm_range})
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs font-medium text-zinc-300">
            <span>Energy Level</span>
            <span className="text-amber-400 tabular-nums font-bold">
              {energy} / 10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-300">
            DJ Cue &amp; Transition Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan intro/outro, titik drop, atau kompatibilitas transisi..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>
            {saving
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambahkan ke Direktori"}
          </span>
        </button>
      </form>
    </div>
  );
}

