"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LiveEvent, MatchSummary } from "@/lib/live/espn";
import { fmtOdd } from "@/lib/live/odds";
import { translate } from "@/lib/live/translate";
import { useOddsEnabled } from "@/lib/prefs";
import FollowButton from "./FollowButton";
import Formation from "./Formation";

type Tab = "incidencias" | "formaciones" | "estadisticas" | "relato" | "cuotas";

const STAT_LABEL: Record<string, string> = {
  possessionPct: "Posesión (%)",
  totalShots: "Remates",
  shotsOnTarget: "Remates al arco",
  wonCorners: "Córners",
  foulsCommitted: "Faltas",
  yellowCards: "Amarillas",
  redCards: "Rojas",
  offsides: "Offside",
  saves: "Atajadas",
  accuratePasses: "Pases correctos",
  totalPasses: "Pases",
  totalTackles: "Quites",
  interceptions: "Intercepciones",
};

// En orden: la primera regla que coincide manda (un penal errado no es un gol).
const EVENT_LABEL: [RegExp, string, string][] = [
  [/own goal/i, "⚽", "Gol en contra"],
  [/penalty.*(miss|saved)/i, "❌", "Penal errado"],
  [/penalty.*(scored|goal)|goal.*penalty/i, "⚽", "Gol de penal"],
  [/goal/i, "⚽", "Gol"],
  [/red card|second yellow/i, "🟥", "Expulsión"],
  [/yellow/i, "🟨", "Amarilla"],
  [/substitution/i, "🔁", "Cambio"],
  [/var/i, "📺", "VAR"],
  [/kickoff/i, "▶️", "Comienza el partido"],
  [/halftime/i, "⏸️", "Entretiempo"],
  [/start 2nd half/i, "▶️", "Segundo tiempo"],
  [/end regular time|full time|end of game/i, "🏁", "Final"],
];
const labelOf = (type: string) => EVENT_LABEL.find(([re]) => re.test(type));

// Lo que se ve al tocar un partido: incidencias, formaciones, estadísticas, relato y (si el visitante las activó)
// cuotas, más la campanita para seguirlo con alertas. Mientras se juega, se actualiza cada 30 segundos.
export default function MatchPanel({ league, match }: { league: string; match: LiveEvent }) {
  const [data, setData] = useState<MatchSummary | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<Tab>("incidencias");
  const oddsOn = useOddsEnabled();

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`/api/partido?liga=${league}&id=${match.id}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((j) => alive && setData(j))
        .catch(() => alive && setFailed(true));
    load();
    const t = match.state === "in" ? setInterval(load, 30000) : undefined;
    return () => {
      alive = false;
      if (t) clearInterval(t);
    };
  }, [league, match.id, match.state]);

  const odds = data?.odds ?? match.odds;
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "incidencias", label: "Incidencias", show: true },
    { id: "formaciones", label: "Formaciones", show: true },
    { id: "estadisticas", label: "Estadísticas", show: !!data?.stats.length },
    { id: "relato", label: "Relato", show: !!data?.commentary.length },
    { id: "cuotas", label: "Cuotas", show: oddsOn && !!odds },
  ];

  return (
    <div className="border-t border-navy-50 bg-navy-50/50 px-3 py-3 text-sm sm:px-4">
      {/* La página completa del partido: línea de tiempo, jugadores clave, estadísticas y la ficha de cada jugador. */}
      <Link
        href={`/partido/${league}/${match.id}`}
        className="mb-3 flex items-center justify-between rounded-2xl bg-navy-950 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-800"
      >
        Ver partido completo y estadísticas <span aria-hidden>→</span>
      </Link>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wide ring-1 transition ${
                tab === t.id ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-navy-700 ring-navy-200 hover:ring-volt-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        <span className="ml-auto">
          <FollowButton league={league} match={match} />
        </span>
      </div>

      {!data && !failed && <div className="skeleton h-24 rounded-2xl" />}
      {failed && !data && <Incidents match={match} />}

      {data && tab === "incidencias" && (
        <>
          {match.home.shootout !== undefined && (
            <p className="mb-2 text-center text-xs font-semibold text-navy-600">
              Penales: {match.home.name} {match.home.shootout} - {match.away.shootout} {match.away.name}
            </p>
          )}
          {data.keyEvents.length ? (
            <ul className="space-y-1">
              {data.keyEvents
                .filter((k) => labelOf(k.type))
                .map((k, i) => {
                  const [, icon, label] = labelOf(k.type)!;
                  return (
                    <li key={i} className={`flex items-start gap-2 ${k.side === "away" ? "flex-row-reverse text-right" : ""}`}>
                      <span className="w-10 shrink-0 font-display font-bold tabular-nums text-navy-500">{k.minute}</span>
                      <span>{icon}</span>
                      <span className="text-navy-800">
                        <b className="font-semibold">{label}</b>
                        {k.text && !/^(kickoff|halftime|start 2nd half|end regular time)$/i.test(k.type) && <span className="text-navy-500"> · {stripTeam(k.text)}</span>}
                      </span>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <Incidents match={match} />
          )}
        </>
      )}

      {data && tab === "formaciones" &&
        (data.lineups.some((l) => l.starters.length) ? (
          <div className="grid gap-4 md:grid-cols-2">
            {["home", "away"].map((s) => {
              const l = data.lineups.find((x) => x.side === s);
              return l ? <Formation key={s} lineup={l} color={s === "home" ? "#1f6bff" : "#d7263d"} /> : null;
            })}
          </div>
        ) : (
          <p className="py-4 text-center text-navy-500">
            {match.state === "pre" ? "Las formaciones se confirman alrededor de una hora antes del partido." : "La fuente no publicó las formaciones de este partido."}
          </p>
        ))}

      {data && tab === "estadisticas" && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-navy-500">
            <span>{match.home.name}</span>
            <span>{match.away.name}</span>
          </div>
          {data.stats
            .filter((s) => STAT_LABEL[s.name])
            .map((s) => {
              const h = parseFloat(s.home) || 0;
              const a = parseFloat(s.away) || 0;
              const total = h + a || 1;
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm">
                    <b className="tabular-nums">{s.home}</b>
                    <span className="text-xs text-navy-500">{STAT_LABEL[s.name]}</span>
                    <b className="tabular-nums">{s.away}</b>
                  </div>
                  <div className="mt-0.5 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-navy-100">
                    <div className="rounded-l-full bg-volt-500" style={{ width: `${(h / total) * 100}%` }} />
                    <div className="ml-auto rounded-r-full bg-red-500" style={{ width: `${(a / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {data && tab === "relato" && (
        <ul className="max-h-80 space-y-1 overflow-y-auto pr-1">
          {[...data.commentary].reverse().map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-10 shrink-0 font-display font-bold tabular-nums text-navy-500">{c.minute}</span>
              <span className="text-navy-700">{translate(c.text)}</span>
            </li>
          ))}
        </ul>
      )}

      {tab === "cuotas" && oddsOn && odds && <OddsBox odds={odds} home={match.home.name} away={match.away.name} />}

      {match.venue && <p className="mt-3 text-xs text-navy-400">Estadio: {match.venue}</p>}
    </div>
  );
}

// Texto de la incidencia en castellano y sin el resultado repetido ("Goal! Boca 1, River 0. Cavani (Boca)…" → "Cavani (Boca)…").
const stripTeam = (t: string) =>
  translate(t)
    .replace(/^¡Gol![^.]*\.\s*/, "")
    .slice(0, 160);

function Incidents({ match }: { match: LiveEvent }) {
  if (!match.incidents.length) return <p className="py-2 text-navy-500">{match.state === "pre" ? "Todavía no empezó." : "Sin incidencias cargadas."}</p>;
  return (
    <ul className="grid gap-1 sm:grid-cols-2">
      {match.incidents.map((x, k) => (
        <li key={k} className={`flex items-center gap-2 ${x.side === "away" ? "sm:col-start-2" : ""}`}>
          <span className="w-10 shrink-0 font-display font-bold tabular-nums text-navy-500">{x.minute}</span>
          <span>{x.type === "yellow" ? "🟨" : x.type === "red" ? "🟥" : "⚽"}</span>
          <span className="text-navy-800">{x.player}</span>
        </li>
      ))}
    </ul>
  );
}

export function OddsBox({ odds, home, away }: { odds: NonNullable<LiveEvent["odds"]>; home: string; away: string }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: `1 · ${home}`, v: odds.home },
          { l: "X · Empate", v: odds.draw },
          { l: `2 · ${away}`, v: odds.away },
        ].map((o) => (
          <div key={o.l} className="rounded-xl bg-white px-2 py-2 ring-1 ring-navy-100">
            <div className="truncate text-[0.65rem] font-semibold uppercase tracking-wider text-navy-500">{o.l}</div>
            <div className="font-display text-xl font-bold tabular-nums text-navy-950">{fmtOdd(o.v)}</div>
          </div>
        ))}
      </div>
      {odds.total !== undefined && (odds.over || odds.under) && (
        <p className="mt-2 text-center text-xs text-navy-600">
          Más de {odds.total.toLocaleString("es-AR")} goles: <b>{fmtOdd(odds.over)}</b> · Menos: <b>{fmtOdd(odds.under)}</b>
        </p>
      )}
      <p className="mt-2 text-center text-[0.7rem] text-navy-400">
        Cuotas de {odds.provider || "la casa de apuestas"} publicadas por ESPN, en formato decimal; pueden cambiar. Solo para mayores de 18 años. Jugá con
        responsabilidad.
      </p>
    </div>
  );
}
