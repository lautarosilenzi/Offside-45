"use client";

import { useState } from "react";

const OPTIONS = [
  { value: "all", label: "Todo" },
  { value: "league", label: "Liga" },
  { value: "cup", label: "Copas Nacionales" },
  { value: "intl", label: "Internacionales" },
] as const;

// Filtro de la lista de campeones: muestra todo, solo ligas o solo copas (se oculta con CSS, ver globals.css).
export default function ChampionsFilter({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<(typeof OPTIONS)[number]["value"]>("all");

  return (
    <div data-filter={filter}>
      <div className="mb-3 grid grid-cols-4 gap-0.5 rounded-2xl bg-navy-950/90 p-1 shadow sm:inline-grid sm:rounded-full" role="group" aria-label="Filtrar títulos">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setFilter(o.value)}
            aria-pressed={filter === o.value}
            className={`rounded-full px-1.5 py-1.5 text-center font-display text-xs font-semibold uppercase leading-tight tracking-wide transition sm:px-4 sm:text-sm ${
              filter === o.value ? "bg-white text-navy-950 shadow" : "text-navy-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
