import { Link } from "react-router-dom";
import { ChevronRight, Clock, Zap } from "lucide-react";

export default function TrackCard({ track }) {
  const mood = track.moods;
  const moodColor = mood?.color_hex || "#8B5CF6";

  return (
    <Link
      to={`/tracks/${track.id}`}
      className="group flex items-center gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 transition-all hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.99]"
    >
      {/* BPM Badge */}
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/15 to-violet-500/15">
        <span className="tabular-nums text-lg font-bold leading-none text-cyan-300">
          {track.bpm}
        </span>
        <span className="mt-1 text-[9px] font-semibold tracking-wider text-zinc-400 uppercase">
          BPM
        </span>
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors">
            {track.title}
          </h3>
        </div>
        <p className="truncate text-xs text-zinc-400">
          {track.artist} · <span className="text-zinc-500">{track.genre}</span>
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {mood && (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                backgroundColor: `${moodColor}22`,
                color: moodColor,
                border: `1px solid ${moodColor}44`,
              }}
            >
              {mood.name}
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
            {track.musical_key}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-zinc-400 tabular-nums">
            <Zap className="h-3 w-3 text-amber-400" />
            {track.energy}/10
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-zinc-500 tabular-nums">
            <Clock className="h-3 w-3" />
            {track.duration}
          </span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
    </Link>
  );
}

