import { useEffect, useState, useRef } from "react";
import { Search, Radio, RotateCcw, Disc3 } from "lucide-react";
import { api } from "../api/client";
import TrackCard from "../components/TrackCard";
import ErrorBanner from "../components/ErrorBanner";

const BPM_RANGES = [
  { id: "all", label: "Semua BPM", min: undefined, max: undefined },
  { id: "chill", label: "< 120", min: 1, max: 119 },
  { id: "groove", label: "120–125", min: 120, max: 125 },
  { id: "peak", label: "126–132", min: 126, max: 132 },
  { id: "fast", label: "133+", min: 133, max: 299 },
];

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [bpmRangeId, setBpmRangeId] = useState("all");
  const [tappedBpm, setTappedBpm] = useState(null);

  const tapTimesRef = useRef([]);

  useEffect(() => {
    api
      .getMoods()
      .then(setMoods)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const range = BPM_RANGES.find((r) => r.id === bpmRangeId);
    const params = {
      search: search.trim() || undefined,
      mood_id: selectedMood || undefined,
      min_bpm: tappedBpm ? tappedBpm - 5 : range?.min,
      max_bpm: tappedBpm ? tappedBpm + 5 : range?.max,
    };

    const timer = setTimeout(() => {
      api
        .getTracks(params)
        .then((data) => {
          if (active) setTracks(data);
        })
        .catch((err) => {
          if (active) setError(err.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, selectedMood, bpmRangeId, tappedBpm]);

  const handleTapTempo = () => {
    const now = Date.now();
    const taps = tapTimesRef.current;
    if (taps.length > 0 && now - taps[taps.length - 1] > 2500) {
      tapTimesRef.current = [now];
      return;
    }
    const nextTaps = [...taps, now].slice(-6);
    tapTimesRef.current = nextTaps;

    if (nextTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < nextTaps.length; i++) {
        intervals.push(nextTaps[i] - nextTaps[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgMs);
      if (bpm >= 50 && bpm <= 220) {
        setTappedBpm(bpm);
      }
    }
  };

  const resetTap = () => {
    tapTimesRef.current = [];
    setTappedBpm(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Header + Tap Tempo */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Disc3 className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              TempoMatch
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Direktori lagu BPM &amp; Mood untuk DJ
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTapTempo}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
              tappedBpm
                ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300"
                : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600"
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-cyan-400" />
            <span className="tabular-nums">
              {tappedBpm ? `${tappedBpm} BPM (±5)` : "Tap Tempo"}
            </span>
          </button>
          {tappedBpm && (
            <button
              type="button"
              onClick={resetTap}
              title="Reset Tap Tempo"
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-zinc-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul, artis, genre, atau key (mis. 8A)..."
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-cyan-500/60"
        />
      </div>

      {/* BPM Range Filter */}
      {!tappedBpm && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {BPM_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setBpmRangeId(range.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                bpmRangeId === range.id
                  ? "bg-cyan-500 text-zinc-950 font-semibold"
                  : "border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {/* Mood Filter Pills */}
      {moods.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedMood("")}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
              selectedMood === ""
                ? "bg-violet-500 text-white"
                : "border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Semua Mood
          </button>
          {moods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                setSelectedMood(selectedMood === m.id ? "" : m.id)
              }
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                selectedMood === m.id
                  ? "text-white font-semibold"
                  : "border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700"
              }`}
              style={
                selectedMood === m.id
                  ? { backgroundColor: m.color_hex || "#8B5CF6" }
                  : undefined
              }
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      {/* Error Banner */}
      <ErrorBanner message={error} />

      {/* Track List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{loading ? "Memuat lagu..." : `${tracks.length} lagu ditemukan`}</span>
          <span>Urut: BPM</span>
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl border border-zinc-800/60 bg-zinc-900/50"
              />
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 text-center">
            <p className="text-sm font-medium text-zinc-300">
              Tidak ada lagu yang cocok
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Coba ubah filter BPM, mood, atau tambahkan lagu baru.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

