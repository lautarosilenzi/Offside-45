"use client";

import { useState } from "react";
import type { TimelineEvent } from "@/lib/live/match";

type Score = { home: string; away: string };

// "Detalle del partido": línea vertical con los minutos al medio, el local a la izquierda y el visitante a la derecha,
// cortada por el entretiempo y el final con el resultado parcial. "Destacado" muestra goles, expulsiones y penales
// errados; "Todo" suma amarillas, cambios y VAR. Los jugadores abren su ficha del partido.
const MAIN = new Set<TimelineEvent["kind"]>(["goal", "own-goal", "penalty-goal", "penalty-miss", "red", "second-yellow"]);

export default function Timeline({
  events,
  state,
  detail,
  halftime,
  final,
  shootout,
  onPlayer,
}: {
  events: TimelineEvent[];
  state: "pre" | "in" | "post";
  detail?: string; // "HT", "67'"…
  halftime?: Score;
  final?: Score;
  shootout?: { home: number; away: number };
  onPlayer?: (id: string) => void;
}) {
  const [all, setAll] = useState(false);
  const list = all ? events : events.filter((e) => MAIN.has(e.kind));

  // Bloques por tiempo, del primero al último (como en 365: lo más reciente abajo).
  const periods = [1, 2, 3, 4].map((p) => list.filter((e) => e.period === p));
  const extra = events.some((e) => e.period > 2);

  return (
    <section className="panel overflow-hidden">
      <h3 className="border-b border-navy-100 px-4 py-3 font-display text-base font-bold uppercase tracking-wide text-navy-950">Detalle del partido</h3>
      <div className="grid grid-cols-2 border-b border-navy-100">
        {[
          { v: false, l: "Destacado" },
          { v: true, l: "Todo" },
        ].map((t) => (
          <button
            key={t.l}
            type="button"
            onClick={() => setAll(t.v)}
            aria-pressed={all === t.v}
            className={`py-2.5 text-sm font-semibold transition ${all === t.v ? "text-navy-950 shadow-[inset_0_-3px_0_#1f6bff]" : "text-navy-400 hover:text-navy-700"}`}
          >
            {t.l}
          </button>
        ))}
      </div>
      {state === "pre" ? (
        <p className="px-4 py-8 text-center text-sm text-navy-500">Todavía no empezó.</p>
      ) : (
        <div className="relative px-2 py-5 sm:px-4">
          {/* Línea central */}
          <div aria-hidden className="absolute bottom-5 left-1/2 top-5 w-px -translate-x-1/2 bg-navy-200" />
          <div className="relative space-y-3">
            {periods[0].map((e, i) => (
              <Row key={`1-${i}`} e={e} onPlayer={onPlayer} />
            ))}
            {/* El entretiempo, una vez que llegó: partido terminado, incidencias del segundo tiempo o "HT" en el estado. */}
            {halftime && (state === "post" || events.some((e) => e.period >= 2) || /half|^HT$/i.test(detail ?? "")) && <Pill>Entretiempo {halftime.home} - {halftime.away}</Pill>}
            {periods[1].map((e, i) => (
              <Row key={`2-${i}`} e={e} onPlayer={onPlayer} />
            ))}
            {extra && final && <Pill>Fin de los 90 minutos</Pill>}
            {[...periods[2], ...periods[3]].map((e, i) => (
              <Row key={`3-${i}`} e={e} onPlayer={onPlayer} />
            ))}
            {state === "post" && final && (
              <Pill>
                {extra ? "Fin del alargue" : "Fin de los 90 minutos"} {final.home} - {final.away}
              </Pill>
            )}
            {shootout && (
              <Pill>
                Penales {shootout.home} - {shootout.away}
              </Pill>
            )}
            {list.length === 0 && <p className="relative bg-white py-2 text-center text-sm text-navy-500">{all ? "Sin incidencias." : "Sin goles ni expulsiones."}</p>}
          </div>
        </div>
      )}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex justify-center">
      <span className="rounded-full border border-navy-300 bg-white px-4 py-1 text-sm font-semibold text-navy-800">{children}</span>
    </div>
  );
}

const ICON: Record<TimelineEvent["kind"], string> = {
  goal: "⚽",
  "own-goal": "⚽",
  "penalty-goal": "⚽",
  "penalty-miss": "❌",
  yellow: "🟨",
  "second-yellow": "🟨🟥",
  red: "🟥",
  sub: "🔁",
  var: "📺",
};
const NOTE: Partial<Record<TimelineEvent["kind"], string>> = { "own-goal": "en contra", "penalty-goal": "de penal", "penalty-miss": "penal errado", "second-yellow": "doble amarilla" };

function Row({ e, onPlayer }: { e: TimelineEvent; onPlayer?: (id: string) => void }) {
  const right = e.side === "away";
  const name = (p?: { id?: string; name: string }, cls = "") =>
    p ? (
      p.id && onPlayer ? (
        <button type="button" onClick={() => onPlayer(p.id!)} className={`text-left hover:underline ${right ? "" : "text-right"} ${cls}`}>
          {p.name}
        </button>
      ) : (
        <span className={cls}>{p.name}</span>
      )
    ) : null;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div className={`min-w-0 ${right ? "" : "flex justify-end"}`}>{!right && <Content e={e} name={name} right={false} />}</div>
      <span className="relative z-10 min-w-[2.75rem] rounded-full bg-white px-1 text-center font-display text-sm font-bold tabular-nums text-navy-500">{e.minute}</span>
      <div className="min-w-0">{right && <Content e={e} name={name} right />}</div>
    </div>
  );
}

function Content({ e, name, right }: { e: TimelineEvent; name: (p?: { id?: string; name: string }, cls?: string) => React.ReactNode; right: boolean }) {
  const goal = e.kind === "goal" || e.kind === "own-goal" || e.kind === "penalty-goal";
  return (
    <div className={`flex items-center gap-2 ${right ? "" : "flex-row-reverse text-right"}`}>
      <span aria-hidden className="shrink-0 text-base leading-none">
        {ICON[e.kind]}
      </span>
      <div className="min-w-0 text-sm leading-tight">
        {e.kind === "sub" ? (
          <>
            <div className="text-emerald-600">↑ {name(e.player, "font-semibold text-navy-900")}</div>
            <div className="text-red-600">↓ {name(e.other, "text-navy-500")}</div>
          </>
        ) : (
          <>
            <div className={goal ? "font-bold text-navy-950" : "font-semibold text-navy-900"}>{name(e.player)}</div>
            {(NOTE[e.kind] || (goal && e.other)) && (
              <div className="text-xs text-navy-500">
                {NOTE[e.kind]}
                {NOTE[e.kind] && goal && e.other ? " · " : ""}
                {goal && e.other && <>Asist.: {name(e.other)}</>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
