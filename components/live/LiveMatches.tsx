"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LiveEvent, LiveTeam } from "@/lib/live/espn";
import { OFF_LABELS } from "@/lib/live/status";
import { getTeam } from "@/lib/teams";
import { toggleFavorite, useFavorites } from "@/lib/account";
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
  if (OFF_LABELS.includes(e.detail)) return { text: e.detail, live: false };
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
  // Día elegido: 0 = hoy, -1 = ayer, 1 = mañana… (las flechas mueven de a un día).
  const [offset, setOffset] = useState(0);
  const dayDate = useMemo(() => new Date(Date.now() + offset * 86400000), [offset]);
  // Filtro por estado, como en las apps de resultados.
  const [filter, setFilter] = useState<"todos" | "vivo" | "proximos" | "finalizados">("todos");
  const onlyLive = liveOnly || filter === "vivo";
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const favs = useFavorites();
  const [data, setData] = useState<{ league: string; events: LiveEvent[] }[] | null>(null);
  const [updated, setUpdated] = useState<string>();
  const oddsOn = useOddsEnabled();
  // ¡Gol!: el último marcador visto de cada partido en juego; si sube, la fila se ilumina unos segundos.
  const lastScore = useRef(new Map<string, number>());
  const [goals, setGoals] = useState<Set<string>>(new Set());
  const fecha = date ?? ymd(dayDate);
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
    .map((g) => ({
      league: leagues.find((l) => l.code === g.league)!,
      events: g.events.filter((e) => (onlyLive ? e.state === "in" : filter === "proximos" ? e.state === "pre" : filter === "finalizados" ? e.state === "post" : true)),
    }))
    .filter((g) => g.league && g.events.length);
  const liveCount = (data ?? []).reduce((n, g) => n + g.events.filter((e) => e.state === "in").length, 0);

  return (
    <div>
      {!compact && (date || liveOnly) && updated && isToday && (
        <p className="mb-3 text-right text-xs text-navy-400">Actualizado {hour(updated)} · se actualiza solo cada 30 segundos</p>
      )}
      {!compact && !date && !liveOnly && (
        <div className="mb-4 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Día: flechas para moverse de a un día y el nombre del día al medio; el calendario para ir más lejos. */}
            <div className="flex items-stretch overflow-hidden rounded-xl ring-1 ring-navy-200">
              <button type="button" onClick={() => setOffset((o) => o - 1)} aria-label="Día anterior" className="btn-press px-3.5 text-xl font-bold text-navy-700 hover:bg-navy-50">
                ‹
              </button>
              <span className="min-w-[7.5rem] border-x border-navy-200 px-3 py-2 text-center font-display text-sm font-bold uppercase tracking-wider text-volt-600">
                {offset === 0 ? "Hoy" : offset === -1 ? "Ayer" : offset === 1 ? "Mañana" : dayLabel(dayDate)}
              </span>
              <button type="button" onClick={() => setOffset((o) => o + 1)} aria-label="Día siguiente" className="btn-press px-3.5 text-xl font-bold text-navy-700 hover:bg-navy-50">
                ›
              </button>
              <a href="/calendario" aria-label="Elegir otra fecha en el calendario" className="flex items-center border-l border-navy-200 px-3 text-navy-700 hover:bg-navy-50">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                  <path d="M3.5 10h17M8 3v4M16 3v4" />
                </svg>
              </a>
            </div>
            {offset !== 0 && (
              <button type="button" onClick={() => setOffset(0)} className="btn-press rounded-xl px-3 py-2 font-display text-sm font-bold uppercase tracking-wide text-navy-700 ring-1 ring-navy-200">
                Volver a hoy
              </button>
            )}
          </div>
          {/* Todos / En vivo / Próximos / Finalizados */}
          <div className="grid grid-cols-4 overflow-hidden rounded-xl ring-1 ring-navy-200" role="group" aria-label="Mostrar">
            {(
              [
                { id: "todos", label: "Todos" },
                { id: "vivo", label: liveCount ? `${liveCount} en vivo` : "En vivo" },
                { id: "proximos", label: "Próximos" },
                { id: "finalizados", label: "Finalizados" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                aria-pressed={filter === t.id}
                className={`flex items-center justify-center gap-1.5 border-l border-navy-200 px-1 py-2.5 text-center font-display text-[0.78rem] font-bold uppercase leading-tight tracking-wide first:border-l-0 sm:text-sm ${
                  filter === t.id ? "bg-volt-600 text-white" : "text-navy-700 hover:bg-navy-50"
                }`}
              >
                {t.id === "vivo" && <span className="live-dot-bare shrink-0 bg-red-500" />}
                {t.label}
              </button>
            ))}
          </div>
          {updated && isToday && <p className="text-right text-xs text-navy-400">Actualizado {hour(updated)} · se actualiza solo</p>}
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
          <p>
            {onlyLive
              ? "No hay partidos en juego en este momento."
              : filter === "proximos"
                ? "No quedan partidos por jugarse este día."
                : filter === "finalizados"
                  ? "Todavía no terminó ningún partido este día."
                  : "No hay partidos para este día."}
          </p>
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
              <LeagueHeader
                league={league}
                events={events}
                fav={favs.some((f) => f.kind === "league" && f.ref === league.id)}
                closed={collapsed.has(league.code)}
                onToggle={() =>
                  setCollapsed((c) => {
                    const n = new Set(c);
                    if (n.has(league.code)) n.delete(league.code);
                    else n.add(league.code);
                    return n;
                  })
                }
              />
              <ul className={`divide-y divide-navy-100 ${collapsed.has(league.code) ? "hidden" : ""}`}>
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
                          {e.state === "pre" || e.home.score === undefined ? "vs" : `${e.home.score} - ${e.away.score ?? 0}`}
                        </span>
                        <Side team={e.away} align="left" />
                      </Link>
                      {e.state !== "pre" && <Scorers e={e} />}
                      {oddsOn && e.state === "pre" && e.odds && <OddsLine odds={e.odds} grid={ROW_GRID} />}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
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
      {/* En el celular, el nombre en hasta dos renglones (con guion si hace falta) en vez de cortarlo ("Sout…"). */}
      <span className={`line-clamp-2 hyphens-auto text-[0.8rem] leading-tight sm:text-[0.95rem] ${team.winner ? "font-bold text-navy-950" : "font-medium text-navy-800"}`}>{team.name}</span>
    </span>
  );
}

// Encabezado de cada torneo (como en El Nine): logo, nombre, cuántos se juegan ahora, cuántos hay, la estrella para
// seguirlo y la flecha para plegarlo.
function LeagueHeader({ league, events, fav, closed, onToggle }: { league: LiveLeague; events: LiveEvent[]; fav: boolean; closed: boolean; onToggle: () => void }) {
  const live = events.filter((e) => e.state === "in").length;
  return (
    <header className="flex items-center gap-2.5 border-b border-navy-100 px-4 py-2.5">
      {league.logo && (
        // eslint-disable-next-line @next/next/no-img-element -- logo chico
        <img src={league.logo} alt="" className="logo-sm h-7 w-7 shrink-0 object-contain" />
      )}
      {league.href ? (
        <a href={league.href} className="min-w-0 flex-1 font-display text-base font-bold uppercase leading-tight tracking-wide text-navy-950 hover:text-volt-600">
          {league.name}
        </a>
      ) : (
        <span className="min-w-0 flex-1 font-display text-base font-bold uppercase leading-tight tracking-wide text-navy-950">{league.name}</span>
      )}
      {live > 0 && (
        <span className="flex items-center gap-1 rounded-md bg-red-600/15 px-1.5 py-0.5 font-display text-xs font-bold text-red-500">
          <span className="live-dot-bare bg-red-500" /> {live}
        </span>
      )}
      <span className="font-display text-sm tabular-nums text-navy-400">{events.length}</span>
      <button
        type="button"
        onClick={() => toggleFavorite({ kind: "league", ref: league.id, name: league.name, logo: league.logo }, !fav)}
        aria-pressed={fav}
        aria-label={fav ? `Dejar de seguir ${league.name}` : `Seguir ${league.name}`}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none ${fav ? "text-gold-400" : "text-navy-400 hover:text-navy-700"}`}
      >
        {fav ? "★" : "☆"}
      </button>
      <button type="button" onClick={onToggle} aria-expanded={!closed} aria-label={closed ? "Mostrar los partidos" : "Ocultar los partidos"} className="flex h-8 w-8 items-center justify-center rounded-full text-navy-500 hover:bg-navy-50">
        <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform ${closed ? "-rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </header>
  );
}

// "J. Gutiérrez": inicial y apellido.
const short = (name: string) => {
  const p = name.split(" ");
  return p.length > 1 ? `${p[0][0]}. ${p.slice(1).join(" ")}` : name;
};

// Goleadores debajo de cada equipo (como en El Nine), con el minuto. De penal, "(p)"; en contra, "(e/c)".
function Scorers({ e }: { e: LiveEvent }) {
  const goals = (e.incidents ?? []).filter((i) => i.type === "goal" || i.type === "penalty" || i.type === "own-goal");
  if (!goals.length) return null;
  const list = (side: "home" | "away") =>
    goals
      .filter((g) => g.side === side)
      .map((g, k) => (
        <span key={k} className="block">
          ⚽ <b className="font-display text-volt-600">{g.minute}</b> {short(g.player)}
          {g.type === "penalty" ? " (p)" : g.type === "own-goal" ? " (e/c)" : ""}
        </span>
      ));
  return (
    <div className={`${ROW_GRID} -mt-1.5 pb-2.5 text-xs leading-relaxed text-navy-500`}>
      <span />
      <span className="text-right">{list("home")}</span>
      <span className="min-w-[3.2rem] sm:min-w-[3.6rem]" />
      <span>{list("away")}</span>
    </div>
  );
}
