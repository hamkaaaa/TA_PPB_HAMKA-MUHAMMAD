import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Zap,
  Music2,
  Trash2,
  Pencil,
  FolderPlus,
  Sparkles,
  Check,
} from "lucide-react";
import { api } from "../api/client";
import TrackCard from "../components/TrackCard";
import ErrorBanner from "../components/ErrorBanner";

export default function TrackDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] = useState(null);
  const [matches, setMatches] = useState([]);
  const [crates, setCrates] = useState([]);
  const [selectedCrateId, setSelectedCrateId] = useState("");
  const [addedFeedback, setAddedFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.all([api.getTrackById(id), api.getCrates().catch(() => [])])
      .then(async ([trackData, cratesData]) => {
        if (!active) return;
        setTrack(trackData);
        setCrates(cratesData);
        if (cratesData.length > 0) setSelectedCrateId(cratesData[0].id);

        // Fetch BPM-compatible tracks (±4 BPM) for DJ mixing
        const nearby = await api
          .getTracks({
            min_bpm: trackData.bpm - 4,
            max_bpm: trackData.bpm + 4,
          })
          .catch(() => []);
        if (active) {
          setMatches(nearby.filter((t) => t.id !== trackData.id).slice(0, 4));
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Hapus lagu "${track.title}"?`)) return;
    try {
      await api.deleteTrack(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToCrate = async () => {
    if (!selectedCrateId) return;
    try {
      await api.addTrackToCrate(selectedCrateId, id);
      setAddedFeedback("Ditambahkan ke Crate!");
      setTimeout(() => setAddedFeedback(""), 2500);
    } catch (err) {
      setAddedFeedback(err.message);
      setTimeout(() => setAddedFeedback(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-800" />
        <div className="h-56 animate-pulse rounded-3xl bg-zinc-900" />
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <ErrorBanner message={error || "Lagu tidak ditemukan."} />
      </div>
    );
  }

  const mood = track.moods;
  const moodColor = mood?.color_hex || "#8B5CF6";

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/tracks/${id}/edit`}
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" /> Hapus
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: moodColor }}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {mood && (
              <Link
                to={`/moods/${mood.id}`}
                className="mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{
                  backgroundColor: `${moodColor}22`,
                  color: moodColor,
                  border: `1px solid ${moodColor}44`,
                }}
              >
                <Sparkles className="h-3 w-3" />
                {mood.name}
              </Link>
            )}
            <h1 className="text-xl font-bold text-white">{track.title}</h1>
            <p className="mt-0.5 text-sm text-zinc-400">{track.artist}</p>
            <p className="mt-1 text-xs text-zinc-500">{track.genre}</p>
          </div>

          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
            <span className="tabular-nums text-2xl font-extrabold text-cyan-300">
              {track.bpm}
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-400">
              BPM
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase">
              <Music2 className="h-3 w-3 text-violet-400" /> Camelot Key
            </div>
            <p className="mt-1 text-sm font-bold text-zinc-100">
              {track.musical_key}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase">
              <Zap className="h-3 w-3 text-amber-400" /> Energy
            </div>
            <p className="mt-1 text-sm font-bold text-zinc-100 tabular-nums">
              {track.energy} / 10
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase">
              <Clock className="h-3 w-3 text-cyan-400" /> Durasi
            </div>
            <p className="mt-1 text-sm font-bold text-zinc-100 tabular-nums">
              {track.duration}
            </p>
          </div>
        </div>

        {/* Energy Bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[11px] text-zinc-400">
            <span>Energy Level</span>
            <span className="tabular-nums">{track.energy * 10}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500"
              style={{ width: `${track.energy * 10}%` }}
            />
          </div>
        </div>

        {/* DJ Cue Notes */}
        {track.notes && (
          <div className="mt-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              DJ Cue &amp; Transition Notes
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              {track.notes}
            </p>
          </div>
        )}
      </div>

      {/* Add to Crate */}
      {crates.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="mb-2.5 text-xs font-semibold text-zinc-200">
            Masukkan ke DJ Crate / Setlist
          </p>
          <div className="flex gap-2">
            <select
              value={selectedCrateId}
              onChange={(e) => setSelectedCrateId(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-cyan-500"
            >
              {crates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddToCrate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-500 active:scale-95"
            >
              {addedFeedback ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <FolderPlus className="h-3.5 w-3.5" />
              )}
              <span>{addedFeedback ? "Tersimpan" : "Simpan"}</span>
            </button>
          </div>
          {addedFeedback && (
            <p className="mt-1.5 text-[11px] text-cyan-400">{addedFeedback}</p>
          )}
        </div>
      )}

      {/* Tempo Match Suggestions */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-zinc-200">
          Cocok untuk Transisi ({track.bpm - 4}–{track.bpm + 4} BPM)
        </h2>
        {matches.length === 0 ? (
          <p className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-4 text-xs text-zinc-500">
            Belum ada lagu lain dalam rentang ±4 BPM.
          </p>
        ) : (
          <div className="space-y-2">
            {matches.map((m) => (
              <TrackCard key={m.id} track={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

