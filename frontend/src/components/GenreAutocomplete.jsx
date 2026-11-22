import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export default function GenreAutocomplete({
  value,
  onChange,
  genres = [],
  required = false,
  placeholder = "Tech House",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();

  const exactMatch = useMemo(
    () => genres.find((g) => g.toLowerCase() === lower) || null,
    [genres, lower]
  );

  const suggestions = useMemo(() => {
    if (!trimmed) {
      return genres.map((name) => ({ name, fuzzy: false }));
    }

    const prefix = [];
    const substring = [];
    const fuzzy = [];
    const maxDist = lower.length >= 4 ? 2 : 1;

    for (const name of genres) {
      const gLower = name.toLowerCase();
      if (gLower.startsWith(lower)) {
        prefix.push({ name, fuzzy: false });
      } else if (gLower.includes(lower)) {
        substring.push({ name, fuzzy: false });
      } else if (lower.length >= 2) {
        const dist = levenshtein(lower, gLower);
        if (dist <= maxDist) {
          fuzzy.push({ name, fuzzy: true, dist });
        }
      }
    }

    fuzzy.sort((a, b) => a.dist - b.dist);
    return [...prefix, ...substring, ...fuzzy];
  }, [genres, trimmed, lower]);

  const typoSuggestion = useMemo(() => {
    if (!trimmed || exactMatch || lower.length < 3) return null;
    const fuzzyMatch = suggestions.find((s) => s.fuzzy);
    if (fuzzyMatch) return fuzzyMatch.name;
    // Also check if a single substring match exists for short partial typos
    return null;
  }, [trimmed, exactMatch, lower.length, suggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectGenre = (name) => {
    onChange(name);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleBlur = () => {
    if (exactMatch && exactMatch !== value) {
      onChange(exactMatch);
    }
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      setActiveIndex(0);
      return;
    }

    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectGenre(suggestions[activeIndex].name);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        required={required}
        autoComplete="off"
        value={value}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-cyan-500"
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-xl"
        >
          {suggestions.map((item, idx) => {
            const isSelected = exactMatch === item.name;
            const isActive = idx === activeIndex;
            return (
              <li
                key={item.name}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectGenre(item.name);
                }}
                className={`flex cursor-pointer items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-200"
                    : "text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                <span className="truncate font-medium">{item.name}</span>
                {item.fuzzy ? (
                  <span className="ml-2 shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">
                    Mirip
                  </span>
                ) : isSelected ? (
                  <Check className="ml-2 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {typoSuggestion && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            selectGenre(typoSuggestion);
          }}
          className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300 hover:bg-amber-500/20"
        >
          <Sparkles className="h-3 w-3" />
          <span>Maksud Anda &ldquo;{typoSuggestion}&rdquo;?</span>
        </button>
      )}
    </div>
  );
}
