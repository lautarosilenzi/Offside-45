"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LiveEvent, LiveTeam } from "@/lib/live/espn";
import { getTeam } from "@/lib/teams";
import { useOddsEnabled } from "@/lib/prefs";
import Crest from "../Crest";
import OddsLine from "../match/OddsLine";

export type LiveLeague = { id: string; name: string; code: string; logo?: string; href?: string };

const TZ = "America/Argentina/Buenos_Aires";
const ymd = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d).replace(/-/g, "");
const hour = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
const dayLabel = (d: Date) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" }).format(d);

// Estado del partido en castellano.
function status(e: LiveEvent) {
  if (e.state === "pre") return { text: hour(e.date), live: false };
  if (e.state === "post") return { text: /pen/i.test(e.detail) ? "Final (pen.)" : /AET|ET/i.test(e.detail) ? "Final (alarg.)" : "Final", live: false };
  if (/half|^HT$/i.test(e.detail)) return { text: "Entretiempo", live: true };
  return { text: e.clock || e.detail, live: true };
}

// Partidos en vivo, del día, de ayer o de mañana, agrupados por competencia. Se actualiza cada 30 segundos.
// date (yyyymmdd): un día fijo, elegido afuera (Calendario); liveOnly: solo los partidos que se están jugando (Live).
// Columnas de cada partido (horario, local, resultado, visitante); las cuotas usan las mismas para quedar alineadas.
const ROW_GRID = "grid grid-cols-[3.2rem_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 px-2.5 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-2 sm:px-4";

export default function LiveMatches({
  leagues,
  compact = false,
  date,
  liveOnly = false,
}: {
  leagues: LiveLeague[];
  compact?: boolean;
  date?: string;
  liveOnly?: boolean;
}) {
  const days = useMemo(() => [-1, 0, 1].map((o) => new Date(Date.now() + o * 86400000)), []);
  const [day, setDay] = useState(1);
  const [onlyLiveToggle, setOnlyLive] = useState(false);
  const onlyLive = liveOnly || onlyLiveToggle;
  const [data, setData] = useState<{ league: string; events: LiveEvent[] }[] | null>(null);
  const [updated, setUpdated] = useState<string>();
  const oddsOn = useOddsEnabled();
  // ¡Gol!: el último marcador visto de cada partido en juego; si sube, la fila se ilumina unos segundos.
  const lastScore = useRef(new Map<string, number>());
  const [goals, setGoals] = useState<Set<string>>(new Set());
  const fecha = date ?? ymd(days[day]);
  // Solo se actualiza solo el día de hoy (los partidos de otros días no cambian).
  const isToday = fecha === ymd(new Date());

  const load = useCallback(async () => {
    try {
      const ligas = leagues.map((l) => l.code).join(",");
      // En Live también el día anterior: un partido que empezó antes de la medianoche puede seguir jugándose.
      const fechas = liveOnly ? [fecha, ymd(new Date(Date.now() - 86400000))] : [fecha];
      const pages = await Promise.all(fechas.map((f) => fetch(`/api/en-vivo?ligas=${ligas}&fecha=${f}`).then((r) => r.json())));
      const merged = new Map<string, LiveEvent[]>();
      for (const p of pages)
        for (const g of p.results ?? []) {
          const prev = merged.get(g.league) ?? [];
          merged.set(g.league, [...prev, ...g.events.filter((e: LiveEvent) => !prev.some((x) => x.id === e.id))]);
        }
      const fresh: string[] = [];
      for (const events of merged.values())
        for (const e of events) {
          if (e.state !== "in") continue;
          const total = Number(e.home.score ?? 0) + Number(e.away.score ?? 0);
          const before = lastScore.current.get(e.id);
          if (before !== undefined && total > before) fresh.push(e.id);
          lastScore.current.set(e.id, total);
        }
      if (fresh.length) {
        setGoals((g) => new Set([...g, ...fresh]));
        setTimeout(() => setGoals((g) => new Set([...g].filter((id) => !fresh.includes(id)))), 9000);
      }
      setData([...merged].map(([league, events]) => ({ league, events })));
      setUpdated(pages[0].updated);
    } catch {
      setData((d) => d ?? []);
    }
  }, [leagues, fecha, liveOnly]);

  useEffect(() => {
    setData(null);
    load();
    if (!isToday) return;
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load, isToday]);

  const groups = (data ?? [])
    .map((g) => ({ league: leagues.find((l) => l.code === g.league)!, events: g.events.filter((e) => !onlyLive || e.state === "in") }))
    .filter((g) => g.league && g.events.length);
  const liveCount = (data ?? []).reduce((n, g) => n + g.events.filter((e) => e.state === "in").length, 0);

  return (
    <div>
      {!compact && (date || liveOnly) && updated && isToday && (
        <p className="mb-3 text-right text-xs text-navy-400">Actualizado {hour(updated)} · se actualiza solo cada 30 segundos</p>
      )}
      {!compact && !date && !liveOnly && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-navy-950/90 p-1 shadow">
            {days.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDay(i)}
                className={`btn-press rounded-full px-4 py-1.5 font-display text-sm font-semibold uppercase tracking-wide transition ${
                  day === i ? "bg-white text-navy-950 shadow" : "text-navy-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {i === 1 ? "Hoy" : i === 0 ? "Ayer" : "Mañana"} <span className="hidden font-normal normal-case opacity-70 sm:inline">· {dayLabel(d)}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOnlyLive((v) => !v)}
            aria-pressed={onlyLive}
            className={`btn-press flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-bold uppercase tracking-wide ring-1 transition ${
              onlyLive ? "bg-red-600 text-white ring-red-600" : "bg-white text-navy-800 ring-navy-200 hover:ring-red-300"
            }`}
          >
            <span className="live-dot-bare" /> En juego {liveCount > 0 && <span className="tabular-nums">({liveCount})</span>}
          </button>
          {updated && <span className="ml-auto text-xs text-navy-400">Actualizado {hour(updated)} · se actualiza solo</span>}
        </div>
      )}

      {data === null ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-28 rounded-3xl" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="panel px-6 py-10 text-center text-navy-500">
          <p>{onlyLive ? "No hay partidos en juego en este momento." : "No hay partidos para este día."}</p>
          {liveOnly && (
            <a href="/calendario" className="btn-ghost mt-4">
              Ver el calendario
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(({ league, events }) => (
            <section key={league.code} className="panel overflow-hidden">
              <header className="flex items-center gap-2.5 border-b border-navy-100 bg-gradient-to-r from-navy-950 to-navy-800 px-4 py-2 text-white">
                {league.logo && (
                  // eslint-disable-next-line @next/next/no-img-element -- logo chico
                  <img src={league.logo} alt="" className="logo-img h-6 w-6 rounded bg-white object-contain p-0.5" />
                )}
                {league.href ? (
                  <a href={league.href} className="font-display text-base font-bold uppercase tracking-wide hover:text-brand-300">
                    {league.name}
                  </a>
                ) : (
                  <span className="font-display text-base font-bold uppercase tracking-wide">{league.name}</span>
                )}
                <span className="ml-auto text-xs text-navy-300">{events.length} {events.length === 1 ? "partido" : "partidos"}</span>
              </header>
              <ul className="divide-y divide-navy-100">
                {events.map((e) => {
                  const st = status(e);
                  return (
                    <li key={e.id} className={`${st.live ? "bg-red-50/40" : ""} ${goals.has(e.id) ? "goal-flash" : ""}`}>
                      {/* Cada partido lleva a su página (resumen, estadísticas, alineaciones y la ficha de cada jugador). */}
                      <Link
                        href={`/partido/${league.code}/${e.id}`}
                        className={`${ROW_GRID} w-full py-3 text-left transition hover:bg-brand-50/60`}
                      >
                        <span className={`font-display text-sm font-bold tabular-nums ${st.live ? "text-red-600" : e.state === "post" ? "text-navy-500" : "text-navy-700"}`}>
                          {goals.has(e.id) ? (
                            <span className="goal-badge inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-black uppercase italic text-white">¡Gol!</span>
                          ) : (
                            <>
                              {st.live && <span className="live-dot-bare mr-1.5 align-middle" />}
                              {st.text}
                            </>
                          )}
                        </span>
                        <Side team={e.home} align="right" />
                        <span
                          className={`min-w-[3.2rem] rounded-xl px-1.5 py-1 text-center font-display text-base font-bold tabular-nums sm:min-w-[3.6rem] sm:px-2 sm:text-lg ${
                            st.live ? "score-live bg-red-600 text-white" : e.state === "post" ? "bg-navy-900 text-white" : "bg-navy-100 text-navy-500"
                          }`}
                        >
                          {e.state === "pre" ? "vs" : `${e.home.score ?? 0} - ${e.away.score ?? 0}`}
                        </span>
                        <Side team={e.away} align="left" />
                      </Link>
                      {oddsOn && e.state === "pre" && e.odds && <OddsLine odds={e.odds} grid={ROW_GRID} />}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-navy-400">Resultados en vivo: ESPN. Pueden tener uno o dos minutos de demora.</p>
    </div>
  );
}

function Side({ team, align }: { team: LiveTeam; align: "left" | "right" }) {
  const ours = team.teamId ? getTeam(team.teamId) : undefined;
  return (
    <span className={`flex min-w-0 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      {ours ? (
        <Crest team={ours} size="sm" />
      ) : team.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- escudo de la fuente en vivo
        <img src={team.logo} alt="" loading="lazy" className="logo-img h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7" />
      ) : (
        <span className="h-7 w-7 shrink-0" />
      )}
      {/* En el celular, el nombre en hasta dos renglones en vez de cortarlo ("Sout…"). */}
      <span className={`line-clamp-2 break-words text-[0.8rem] leading-tight sm:truncate sm:text-[0.95rem] ${team.winner ? "font-bold text-navy-950" : "font-medium text-navy-800"}`}>{team.name}</span>
    </span>
  );
}
