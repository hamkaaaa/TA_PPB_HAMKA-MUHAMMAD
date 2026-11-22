import { NavLink } from "react-router-dom";
import { Disc3, Sparkles, PlusCircle, FolderHeart, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Tracks", icon: Disc3, end: true },
  { to: "/moods", label: "Moods", icon: Sparkles },
  { to: "/add", label: "Add", icon: PlusCircle, highlight: true },
  { to: "/crates", label: "Crates", icon: FolderHeart },
  { to: "/about", label: "About", icon: User },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-lg"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map(({ to, label, icon: Icon, end, highlight }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-cyan-400"
                  : highlight
                    ? "text-violet-400 hover:text-violet-300"
                    : "text-zinc-400 hover:text-zinc-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex h-7 w-10 items-center justify-center rounded-full transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-400"
                      : highlight
                        ? "bg-violet-500/15"
                        : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.9} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

