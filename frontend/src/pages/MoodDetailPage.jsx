import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { api } from "../api/client";
import TrackCard from "../components/TrackCard";
import ErrorBanner from "../components/ErrorBanner";

export default function MoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .getMoodById(id)
      .then(setMood)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-800" />
        <div className="h-36 animate-pulse rounded-3xl bg-zinc-900" />
      </div>
    );
  }

  if (error || !mood) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <ErrorBanner message={error || "Mood tidak ditemukan."} />
      </div>
    );
  }

  const color = mood.color_hex || "#8B5CF6";
  const tracks = mood.tracks || [];

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
      </button>

      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: color }}
        />
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" style={{ color }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Mood Profile
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">{mood.name}</h1>
        {mood.bpm_range && (
          <span
            className="mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold tabular-nums"
            style={{ backgroundColor: `${color}22`, color }}
          >
            Rekomendasi: {mood.bpm_range}
          </span>
        )}
        <p className="mt-3 text-xs leading-relaxed text-zinc-300">
          {mood.description}
        </p>
      </div>

      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-zinc-200">
          Lagu dengan Mood {mood.name} ({tracks.length})
        </h2>
        {tracks.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-xs text-zinc-500">
            Belum ada lagu di kategori mood ini.
          </div>
        ) : (
          <div className="space-y-2.5">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={{ ...track, moods: { id: mood.id, name: mood.name, color_hex: color } }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

