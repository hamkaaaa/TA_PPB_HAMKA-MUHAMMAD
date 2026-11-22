import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderHeart, Plus, ChevronRight, MapPin } from "lucide-react";
import { api } from "../api/client";
import ErrorBanner from "../components/ErrorBanner";

export default function CratesPage() {
  const [crates, setCrates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [venueType, setVenueType] = useState("");
  const [targetBpm, setTargetBpm] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCrates = () => {
    setLoading(true);
    api
      .getCrates()
      .then(setCrates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCrates();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.createCrate({
        name: name.trim(),
        venue_type: venueType.trim() || "Club",
        target_bpm: targetBpm.trim() || "124 - 130 BPM",
        description: description.trim(),
      });
      setName("");
      setVenueType("");
      setTargetBpm("");
      setDescription("");
      setShowForm(false);
      loadCrates();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderHeart className="h-5 w-5 text-pink-400" />
            <h1 className="text-xl font-bold text-white">DJ Crates</h1>
          </div>
          <p className="text-xs text-zinc-400">
            Koleksi setlist &amp; kurasi lagu untuk tiap gig
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-xl bg-pink-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>{showForm ? "Tutup" : "Crate Baru"}</span>
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Buat DJ Crate Baru
          </h2>
          <input
            type="text"
            required
            placeholder="Nama Setlist (mis. Beach Club Sunset)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-pink-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Venue (mis. Rooftop)"
              value={venueType}
              onChange={(e) => setVenueType(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-pink-500"
            />
            <input
              type="text"
              placeholder="Target BPM (120 - 126)"
              value={targetBpm}
              onChange={(e) => setTargetBpm(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-pink-500"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Deskripsi singkat setlist..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-pink-600 py-2 text-xs font-semibold text-white hover:bg-pink-500 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Crate"}
          </button>
        </form>
      )}

      <ErrorBanner message={error} />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
            />
          ))}
        </div>
      ) : crates.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-xs text-zinc-500">
          Belum ada DJ Crate. Klik &ldquo;Crate Baru&rdquo; untuk membuat setlist.
        </div>
      ) : (
        <div className="space-y-3">
          {crates.map((crate) => (
            <Link
              key={crate.id}
              to={`/crates/${crate.id}`}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.99]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-bold text-zinc-100 group-hover:text-pink-300">
                    {crate.name}
                  </h2>
                  <span className="shrink-0 rounded-full bg-pink-500/15 px-2 py-0.5 text-[10px] font-semibold text-pink-300 tabular-nums">
                    {crate.track_count ?? 0} lagu
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-400">
                  {crate.venue_type && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-zinc-500" />
                      {crate.venue_type}
                    </span>
                  )}
                  {crate.target_bpm && (
                    <span className="tabular-nums text-cyan-400">
                      {crate.target_bpm}
                    </span>
                  )}
                </div>
                {crate.description && (
                  <p className="mt-1.5 line-clamp-1 text-xs text-zinc-500">
                    {crate.description}
                  </p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

