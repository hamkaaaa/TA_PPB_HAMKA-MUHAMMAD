import { useEffect, useState } from "react";
import { Disc3, Server, Download, UserCheck, Code2 } from "lucide-react";
import { api } from "../api/client";

export default function AboutPage() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    api
      .health()
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold text-white">Profile &amp; About</h1>
        <p className="text-xs text-zinc-400">
          Informasi aplikasi TempoMatch &amp; Pengembang
        </p>
      </header>

      {/* App Identity Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/30">
            <Disc3 className="h-8 w-8 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">TempoMatch</h2>
            <p className="text-xs text-cyan-400">
              Direktori Lagu berdasarkan BPM &amp; Mood untuk DJ
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-300">
          TempoMatch membantu DJ menemukan lagu yang tepat berdasarkan tempo
          (BPM), tangga nada Camelot Key, tingkat energi, serta mood atmosfer
          lantai dansa. Dilengkapi fitur Tap Tempo, kurasi DJ Crates, dan
          rekomendasi transisi ±4 BPM.
        </p>

        {installPrompt && (
          <button
            type="button"
            onClick={handleInstall}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-zinc-950 hover:bg-cyan-400"
          >
            <Download className="h-4 w-4" /> Install TempoMatch PWA
          </button>
        )}
      </div>

      {/* Developer / Praktikan Profile */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
          <UserCheck className="h-4 w-4" /> Profil Praktikan
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-400">Mata Kuliah</span>
            <span className="font-medium text-zinc-100">
              Praktikum PPB Ganjil 2026
            </span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-400">Platform</span>
            <span className="font-medium text-zinc-100">
              Progressive Web App (PWA)
            </span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-400">Bahasa Pemrograman</span>
            <span className="font-medium text-zinc-100">
              JavaScript (ES6+)
            </span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-400">Nama Praktikan</span>
            <span className="font-medium text-zinc-100">
              Hamka Muhammad
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">NIM</span>
            <span className="font-medium text-zinc-100 tabular-nums">
              21120124120038
            </span>
          </div>
        </div>
      </div>

      {/* API & Tech Stack */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Server className="h-4 w-4" /> Status Web Service (Modul 1)
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              apiStatus === "online"
                ? "bg-emerald-500/15 text-emerald-400"
                : apiStatus === "offline"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-zinc-800 text-zinc-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                apiStatus === "online"
                  ? "bg-emerald-400"
                  : apiStatus === "offline"
                    ? "bg-red-400"
                    : "bg-zinc-400"
              }`}
            />
            {apiStatus === "online"
              ? "Terhubung"
              : apiStatus === "offline"
                ? "Offline"
                : "Memeriksa..."}
          </span>
        </div>

        <p className="break-all rounded-xl bg-zinc-950 px-3 py-2 text-[11px] font-mono text-zinc-400">
          {api.baseUrl}
        </p>

        <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-zinc-300">
          <Code2 className="h-4 w-4 text-zinc-400" /> Tech Stack
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            "React + Vite PWA",
            "Tailwind CSS",
            "Node.js + Express.js",
            "Supabase PostgreSQL",
            "Vercel Ready",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-zinc-700/80 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

