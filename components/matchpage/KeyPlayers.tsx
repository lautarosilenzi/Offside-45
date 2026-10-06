"use client";

import { useState } from "react";
import type { KeyPlayer, KeyPlayers as KP } from "@/lib/live/match";
import { Avatar } from "./PlayerSheet";

type Side = { color: string; ink: string };
type Line = keyof KP;

// Qué se compara en cada línea, en orden de preferencia: se usan los primeros dos que ESPN publique para el partido
// (no todas las competencias tienen goles esperados) y siempre los minutos.
type Row = { label: string; key: string; v: (s: Record<string, number>) => string };
const n = (k: string) => (s: Record<string, number>) => String(Math.round(s[k] ?? 0));
const ROWS: Record<Line, Row[]> = {
  Delantero: [
    { label: "Goles esperados", key: "expectedGoals", v: (s) => (s.expectedGoals ?? 0).toFixed(2) },
    { label: "Remates al arco", key: "shotsOnTarget", v: n("shotsOnTarget") },
    { label: "Total remates", key: "totalShots", v: n("totalShots") },
  ],
  Mediocampista: [
    { label: "Pases completados", key: "totalPasses", v: (s) => `${s.accuratePasses ?? 0}/${s.totalPasses ?? 0}` },
    { label: "Pases clave", key: "shotAssists", v: n("shotAssists") },
    { label: "Remates", key: "totalShots", v: n("totalShots") },
  ],
  Defensor: [
    { label: "Quites", key: "totalTackles", v: n("totalTackles") },
    { label: "Despejes", key: "totalClearance", v: n("totalClearance") },
    { label: "Intercepciones", key: "interceptions", v: n("interceptions") },
  ],
};
const MIN: Row = { label: "Min", key: "minutes", v: n("minutes") };

// "Jugadores clave": el mejor de cada equipo en cada línea, cara a cara. Tocar un jugador abre su ficha del partido.
export default function KeyPlayers({ players, home, away, onPlayer }: { players: KP; home: Side; away: Side; onPlayer: (id: string) => void }) {
  const lines = (["Delantero", "Mediocampista", "Defensor"] as Line[]).filter((l) => players[l].home || players[l].away);
  const [line, setLine] = useState<Line>(lines[0] ?? "Delantero");
  if (!lines.length) return null;
  const pair = players[line];
  return (
    <section className="panel overflow-hidden">
      <h3 className="border-b border-navy-100 px-4 py-3 font-display text-base font-bold uppercase tracking-wide text-navy-950">Jugadores clave</h3>
      <div className="grid grid-cols-3 border-b border-navy-100">
        {lines.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLine(l)}
            aria-pressed={line === l}
            className={`py-2.5 text-sm font-semibold transition ${line === l ? "text-navy-950 shadow-[inset_0_-3px_0_#1f6bff]" : "text-navy-400 hover:text-navy-700"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 px-2 py-4 sm:gap-2 sm:px-5">
        <Who p={pair.home} side={home} onPlayer={onPlayer} />
        <div className="space-y-2">
          {[...ROWS[line].filter((r) => pair.home?.stats[r.key] !== undefined || pair.away?.stats[r.key] !== undefined).slice(0, 2), MIN].map((r) => (
            <div key={r.label} className="grid grid-cols-[3rem_minmax(4.5rem,auto)_3rem] items-center gap-1.5 sm:grid-cols-[3.5rem_minmax(5.5rem,auto)_3.5rem] sm:gap-2">
              <span className="rounded-lg bg-navy-950 py-1.5 text-center font-display text-base font-bold tabular-nums text-white">{pair.home && pair.home.stats[r.key] !== undefined ? r.v(pair.home.stats) : "—"}</span>
              <span className="text-center text-xs leading-tight text-navy-500">{r.label}</span>
              <span className="rounded-lg bg-navy-950 py-1.5 text-center font-display text-base font-bold tabular-nums text-white">{pair.away && pair.away.stats[r.key] !== undefined ? r.v(pair.away.stats) : "—"}</span>
            </div>
          ))}
        </div>
        <Who p={pair.away} side={away} onPlayer={onPlayer} />
      </div>
    </section>
  );
}

function Who({ p, side, onPlayer }: { p?: KeyPlayer; side: Side; onPlayer: (id: string) => void }) {
  if (!p) return <span />;
  return (
    <button type="button" onClick={() => onPlayer(p.id)} className="flex min-w-0 flex-col items-center gap-1.5 text-center hover:opacity-80">
      <span className="relative">
        <Avatar photo={p.photo} number={p.number} color={side.color} ink={side.ink} size={52} />
        {p.goals > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs shadow ring-1 ring-navy-100" title={`${p.goals} gol${p.goals > 1 ? "es" : ""}`}>
            ⚽{p.goals > 1 ? p.goals : ""}
          </span>
        )}
      </span>
      <span className="line-clamp-2 text-xs font-semibold leading-tight text-navy-900 sm:text-sm">{p.name}</span>
    </button>
  );
}
