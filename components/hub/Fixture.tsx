"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LiveEvent } from "@/lib/live/espn";
import type { Round } from "@/lib/live/season";
import { useOddsEnabled } from "@/lib/prefs";
import OddsLine from "../match/OddsLine";
import TeamLogo from "./TeamLogo";

const TZ = "America/Argentina/Buenos_Aires";
const dayKey = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));
const dayLabel = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric" }).format(new Date(iso)).replace(",", "");
const hour = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

function status(e: LiveEvent) {
  if (e.state === "pre") return { text: /postp|tbd|delay|susp/i.test(e.detail) ? "Post." : hour(e.date), live: false };
  if (e.state === "post") return { text: /pen/i.test(e.detail) ? "Fin (pen.)" : /AET|ET/i.test(e.detail) ? "Fin (alarg.)" : "Final", live: false };
  if (/half|^HT$/i.test(e.detail)) return { text: "ET", live: true };
  return { text: e.clock || e.detail, live: true };
}

// Fixture fecha por fecha, con flechas y un selector. Si la fecha tiene partidos de hoy, se actualiza sola cada 30 segundos.
// Columnas de cada partido (horario, local, resultado, visitante); las cuotas usan las mismas para quedar alineadas.
const ROW_GRID = "grid grid-cols-[3.6rem_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2";

export default function Fixture({ code, rounds, initial }: { code: string; rounds: Round[]; initial: number }) {
  const [i, setI] = useState(initial);
  const [fresh, setFresh] = useState<Record<string, LiveEvent>>({});
  const oddsOn = useOddsEnabled();
  const round = rounds[i];

  // Partidos de hoy de esta fecha: se piden de nuevo al resultado en vivo.
  const today = dayKey(new Date().toISOString());
  const hasToday = round?.matches.some((m) => dayKey(m.date) === today && m.state !== "post");
  useEffect(() => {
    if (!hasToday) return;
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/en-vivo?ligas=${code}&fecha=${today.replace(/-/g, "")}`);
        const j = await r.json();
        if (!alive) return;
        const map: Record<string, LiveEvent> = {};
        for (const g of j.results ?? []) for (const e of g.events ?? []) map[e.id] = e;
        setFresh(map);
      } catch {}
    };
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [code, hasToday, today]);

  const days = useMemo(() => {
    const out: { key: string; label: string; matches: LiveEvent[] }[] = [];
    for (const m0 of round?.matches ?? []) {
      const m = fresh[m0.id] ? { ...m0, ...fresh[m0.id], round: m0.round, group: m0.group } : m0;
      const k = dayKey(m.date);
      let d = out.find((x) => x.key === k);
      if (!d) out.push((d = { key: k, label: dayLabel(m.date), matches: [] }));
      d.matches.push(m);
    }
    return out;
  }, [round, fresh]);

  if (!round) return <p className="panel px-6 py-10 text-center text-navy-500">Todavía no hay partidos programados.</p>;

  return (
    <div className="panel overflow-hidden">
      <div className="bg-navy-950 px-3 py-2 text-center font-display text-sm font-bold uppercase tracking-widest text-white">Temporada</div>
      <div className="flex items-center gap-2 border-b border-navy-100 px-2 py-2">
        <button type="button" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0} aria-label="Fecha anterior" className="btn-press flex h-9 w-9 items-center justify-center rounded-full text-navy-700 transition hover:bg-navy-100 disabled:opacity-30">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <select
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className="min-w-0 flex-1 cursor-pointer appearance-none rounded-lg bg-transparent text-center font-display text-base font-bold uppercase tracking-wide text-navy-950 outline-none hover:bg-navy-50"
          aria-label="Elegir fecha"
        >
          {rounds.map((r, k) => (
            <option key={r.key} value={k}>
              {r.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setI((x) => Math.min(rounds.length - 1, x + 1))} disabled={i === rounds.length - 1} aria-label="Fecha siguiente" className="btn-press flex h-9 w-9 items-center justify-center rounded-full text-navy-700 transition hover:bg-navy-100 disabled:opacity-30">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      {days.map((d) => (
        <div key={d.key}>
          <div className="bg-navy-50 px-3 py-1 text-center text-xs font-semibold text-navy-500 first-letter:uppercase">{d.label}</div>
          <ul className="divide-y divide-navy-50">
            {d.matches.map((m) => {
              const st = status(m);
              return (
                <li key={m.id} className={st.live ? "bg-red-50/50" : undefined}>
                  {/* Cada partido lleva a su página (resumen, estadísticas, alineaciones y la ficha de cada jugador). */}
                  <Link href={`/partido/${code}/${m.id}`} className={`${ROW_GRID} w-full py-2.5 text-left text-sm transition hover:bg-brand-50/60`}>
                    <span className={`text-center font-display text-xs font-bold tabular-nums ${st.live ? "text-red-600" : "text-navy-500"}`}>
                      {st.live && <span className="live-dot-bare mr-1 align-middle" />}
                      {st.text}
                    </span>
                    <span className="flex min-w-0 items-center justify-end gap-1.5 text-right">
                      <span className={`truncate ${m.home.winner ? "font-bold text-navy-950" : "text-navy-800"}`}>{m.home.name}</span>
                      <TeamLogo team={m.home} />
                    </span>
                    <span className={`min-w-[3.2rem] rounded-md px-1.5 py-0.5 text-center font-display font-bold tabular-nums ${st.live ? "bg-red-600 text-white" : m.state === "post" ? "bg-navy-900 text-white" : "text-navy-400"}`}>
                      {m.state === "pre" ? "-" : `${m.home.score ?? 0} - ${m.away.score ?? 0}`}
                    </span>
                    <span className="flex min-w-0 items-center gap-1.5">
                      <TeamLogo team={m.away} />
                      <span className={`truncate ${m.away.winner ? "font-bold text-navy-950" : "text-navy-800"}`}>{m.away.name}</span>
                    </span>
                  </Link>
                  {oddsOn && m.state === "pre" && m.odds && <OddsLine odds={m.odds} grid={ROW_GRID} />}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
