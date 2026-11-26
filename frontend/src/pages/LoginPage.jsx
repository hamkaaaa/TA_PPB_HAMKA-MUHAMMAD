import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Disc3, LogIn, UserPlus, ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ErrorBanner from "../components/ErrorBanner";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register(username, password, displayName);
      } else {
        await login(username, password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pt-2">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-violet-600/20">
          <Disc3 className="h-8 w-8 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          TempoMatch DJ
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Masuk untuk mengelola DJ Crates &amp; lagu pribadi milikmu
        </p>
      </div>

      {location.state?.from && (
        <div className="flex items-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-3.5 py-2.5 text-xs text-violet-200">
          <Lock className="h-4 w-4 shrink-0 text-violet-400" />
          <span>
            Login diperlukan untuk mengakses{" "}
            <strong className="font-semibold">{location.state.from}</strong>.
          </span>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
          className={`rounded-xl py-2 text-xs font-semibold transition-colors ${
            !isRegister
              ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
          }}
          className={`rounded-xl py-2 text-xs font-semibold transition-colors ${
            isRegister
              ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Daftar Akun
        </button>
      </div>

      <ErrorBanner message={error} />

      <form
        onSubmit={handleSubmit}
        className="space-y-3.5 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-300">
            Username *
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="mis. dj_hamka"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
          />
          {isRegister && (
            <p className="mt-1 text-[11px] text-zinc-500">
              3–30 karakter (huruf, angka, titik, underscore, atau strip).
            </p>
          )}
        </div>

        {isRegister && (
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-300">
              Nama DJ / Tampilan
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="mis. DJ Hamka"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-300">
            Password *
          </label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
          />
        </div>

        {isRegister && (
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-300">
              Konfirmasi Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
        >
          {isRegister ? (
            <UserPlus className="h-4 w-4" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          <span>
            {submitting
              ? "Memproses..."
              : isRegister
                ? "Buat Akun & Masuk"
                : "Masuk ke TempoMatch"}
          </span>
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-cyan-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Lanjut lihat lagu default tanpa login</span>
        </Link>
      </div>
    </div>
  );
}
