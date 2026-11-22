import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FolderHeart, Trash2, MapPin, X } from "lucide-react";
import { api } from "../api/client";
import TrackCard from "../components/TrackCard";
import ErrorBanner from "../components/ErrorBanner";

export default function CrateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crate, setCrate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCrate = () => {
    setLoading(true);
    api
      .getCrateById(id)
      .then(setCrate)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCrate();
  }, [id]);

  const handleDeleteCrate = async () => {
    if (!confirm(`Hapus crate "${crate.name}"?`)) return;
    try {
      await api.deleteCrate(id);
      navigate("/crates");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveTrack = async (trackId) => {
    try {
      await api.removeTrackFromCrate(id, trackId);
      loadCrate();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-800" />
        <div className="h-36 animate-pulse rounded-3xl bg-zinc-900" />
      </div>
    );
  }

  if (error || !crate) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <ErrorBanner message={error || "Crate tidak ditemukan."} />
      </div>
    );
  }

  const tracks = crate.tracks || [];
  const avgBpm =
    tracks.length > 0
      ? Math.round(tracks.reduce((sum, t) => sum + t.bpm, 0) / tracks.length)
      : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali
        </button>

        <button
          onClick={handleDeleteCrate}
          className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
        >
          <Trash2 className="h-3.5 w-3.5" /> Hapus Crate
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
          <FolderHeart className="h-4 w-4" /> DJ Setlist Crate
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">{crate.name}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          {crate.venue_type && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              {crate.venue_type}
            </span>
          )}
          {crate.target_bpm && (
            <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300 tabular-nums">
              Target: {crate.target_bpm}
            </span>
          )}
          {avgBpm && (
            <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-violet-300 tabular-nums">
              Rata-rata: {avgBpm} BPM
            </span>
          )}
        </div>

        {crate.description && (
          <p className="mt-3 text-xs leading-relaxed text-zinc-300">
            {crate.description}
          </p>
        )}
      </div>

      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-zinc-200">
          Daftar Lagu ({tracks.length})
        </h2>
        {tracks.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-xs text-zinc-500">
            Crate ini masih kosong. Buka halaman detail lagu mana saja untuk
            menambahkannya ke crate ini.
          </div>
        ) : (
          <div className="space-y-2.5">
            {tracks.map((track) => (
              <div key={track.id} className="relative">
                <TrackCard track={track} />
                <button
                  type="button"
                  onClick={() => handleRemoveTrack(track.id)}
                  title="Keluarkan dari crate"
                  className="absolute -right-1.5 -top-1.5 rounded-full border border-zinc-700 bg-zinc-900 p-1 text-zinc-400 shadow hover:border-red-500/50 hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

