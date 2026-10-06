"use client";

import { useState } from "react";
import type { StatSection } from "@/lib/live/match";

type Side = { color: string; ink: string };

// Estadísticas de los dos equipos, por secciones (como en 365Scores): el número del que gana cada rubro va resaltado
// con el color de su equipo. Cada sección muestra las primeras filas y el resto con "Mostrar más".
export default function StatsCompare({ sections, home, away, limit = 4 }: { sections: StatSection[]; home: Side; away: Side; limit?: number }) {
  if (!sections.length) return <p className="panel px-6 py-8 text-center text-navy-500">Las estadísticas aparecen cuando empieza el partido.</p>;
  return (
    <div className="space-y-4">
      {sections.map((s, i) => (
        <Section key={s.title} section={s} home={home} away={away} limit={i === 0 ? 10 : limit} />
      ))}
    </div>
  );
}

export function Section({ section, home, away, limit }: { section: StatSection; home: Side; away: Side; limit: number }) {
  const [open, setOpen] = useState(false);
  const rows = open ? section.rows : section.rows.slice(0, limit);
  return (
    <section className="panel overflow-hidden">
      <h3 className="border-b border-navy-100 px-4 py-3 font-display text-base font-bold uppercase tracking-wide text-navy-950">{section.title}</h3>
      <ul>
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[minmax(4.5rem,auto)_1fr_minmax(4.5rem,auto)] items-center gap-2 px-3 py-2.5 sm:px-4">
            <Value text={r.home} win={r.better === "home"} side={home} align="left" />
            <span className="text-center text-sm text-navy-700">{r.label}</span>
            <Value text={r.away} win={r.better === "away"} side={away} align="right" />
          </li>
        ))}
      </ul>
      {section.rows.length > limit && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full border-t border-navy-100 py-2.5 text-sm font-semibold text-navy-500 transition hover:bg-navy-50 hover:text-navy-800"
        >
          {open ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}
    </section>
  );
}

function Value({ text, win, side, align }: { text: string; win: boolean; side: Side; align: "left" | "right" }) {
  // "612/684 (89%)": la cifra principal resaltada y el porcentaje aparte.
  const [main, extra] = text.split(" (");
  return (
    <span className={`flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <span
        className={`inline-flex min-w-[2.6rem] justify-center rounded-full px-2.5 py-1 font-display text-base font-bold tabular-nums ${win ? "" : "text-navy-900"}`}
        style={win ? { background: side.color, color: side.ink } : undefined}
      >
        {main}
      </span>
      {extra && <span className="text-xs tabular-nums text-navy-400">({extra}</span>}
    </span>
  );
}
