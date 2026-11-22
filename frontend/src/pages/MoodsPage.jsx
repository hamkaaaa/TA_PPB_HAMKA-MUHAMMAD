import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";
import { api } from "../api/client";
import ErrorBanner from "../components/ErrorBanner";

export default function MoodsPage() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMoods()
      .then(setMoods)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Mood Directory</h1>
        </div>
        <p className="text-xs text-zinc-400">
          Pilih atmosfer setlist untuk melihat rekomendasi lagu
        </p>
      </header>

      <ErrorBanner message={error} />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {moods.map((mood) => {
            const color = mood.color_hex || "#8B5CF6";
            return (
              <Link
                key={mood.id}
                to={`/moods/${mood.id}`}
                className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.99]"
              >
                <div
                  className="absolute bottom-0 left-0 top-0 w-1.5"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1 pl-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-zinc-100 group-hover:text-white">
                      {mood.name}
                    </h2>
                    {mood.bpm_range && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums"
                        style={{
                          backgroundColor: `${color}22`,
                          color,
                        }}
                      >
                        {mood.bpm_range}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                    {mood.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-300" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

