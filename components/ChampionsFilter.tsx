"use client";

import { useState } from "react";

const OPTIONS = [
  { value: "all", label: "Todo" },
  { value: "league", label: "Liga" },
  { value: "cup", label: "Copas" },
] as const;

// Filtro de la lista de campeones: muestra todo, solo ligas o solo copas (se oculta con CSS, ver globals.css).
export default function ChampionsFilter({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<(typeof OPTIONS)[number]["value"]>("all");

  return (
    <div data-filter={filter}>
      <div className="mb-3 inline-flex rounded-full bg-navy-950/90 p-1 shadow" role="group" aria-label="Filtrar títulos">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setFilter(o.value)}
            aria-pressed={filter === o.value}
            className={`rounded-full px-4 py-1.5 font-display text-sm font-semibold uppercase tracking-wide transition ${
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
