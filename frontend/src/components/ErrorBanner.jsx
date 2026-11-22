import { AlertTriangle } from "lucide-react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-300">
            Gagal terhubung ke API TempoMatch
          </p>
          <p className="text-amber-200/80">{message}</p>
          <p className="text-[11px] text-amber-200/60">
            Pastikan server backend Express berjalan dan file <code>.env</code>{" "}
            berisi kredensial Supabase yang valid.
          </p>
        </div>
      </div>
    </div>
  );
}

