"use client";

import { useMemo, useState } from "react";
import { CLASICOS, getTeam } from "@/lib/teams";
import { computeStats, getHeadToHead, isCounted } from "@/lib/matches";
import { SEASONS } from "@/lib/seasons";
import TeamSelect from "./TeamSelect";
import StatsCard from "./StatsCard";
import MatchList from "./MatchList";

export default function HeadToHead() {
  const [teamA, setTeamA] = useState("river");
  const [teamB, setTeamB] = useState("boca");

  const a = getTeam(teamA)!;
  const b = getTeam(teamB)!;
  const matches = useMemo(() => getHeadToHead(teamA, teamB), [teamA, teamB]);
  const stats = useMemo(() => computeStats(matches, teamA), [matches, teamA]);
  const annulledCount = matches.length - matches.filter(isCounted).length;

  const swap = () => {
    setTeamA(teamB);
    setTeamB(teamA);
  };

  return (
    <div className="space-y-6">
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          <TeamSelect label="Equipo 1" value={teamA} exclude={teamB} onChange={setTeamA} />
          <button
            type="button"
            onClick={swap}
            aria-label="Invertir equipos"
            title="Invertir equipos"
            className="mx-auto flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-sm border border-navy-200 bg-navy-50 text-navy-700 transition hover:border-brand-500 hover:text-brand-500"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rotate-90 sm:rotate-0" aria-hidden>
              <path d="M13.2 3.3a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-3 3a1 1 0 1 1-1.4-1.4L14.5 8H4a1 1 0 0 1 0-2h10.5l-1.3-1.3a1 1 0 0 1 0-1.4zM6.8 9.3a1 1 0 0 1 0 1.4L5.5 12H16a1 1 0 1 1 0 2H5.5l1.3 1.3a1 1 0 1 1-1.4 1.4l-3-3a1 1 0 0 1 0-1.4l3-3a1 1 0 0 1 1.4 0z" />
            </svg>
          </button>
          <TeamSelect label="Equipo 2" value={teamB} exclude={teamA} onChange={setTeamB} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-100 pt-4">
          <span className="mr-1 font-display text-xs font-semibold uppercase tracking-[0.15em] text-navy-400">
            Clásicos
          </span>
          {CLASICOS.map((c) => {
            const active = (teamA === c.a && teamB === c.b) || (teamA === c.b && teamB === c.a);
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setTeamA(c.a);
                  setTeamB(c.b);
                }}
                className={`rounded-sm border px-3 py-1 text-sm font-semibold transition ${
                  active
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {matches.length === 0 ? (
        <div className="panel px-6 py-14 text-center">
          <p className="font-display text-xl font-bold uppercase tracking-wide text-navy-800">Sin partidos registrados</p>
          <p className="mt-1 text-sm text-navy-500">
            Todavía no hay datos entre {a.name} y {b.name}. Probá con uno de los clásicos.
          </p>
        </div>
      ) : (
        <>
          <StatsCard a={a} b={b} stats={stats} />
          <p className="border-l-2 border-brand-500 bg-white px-4 py-3 text-sm leading-relaxed text-navy-600">
            Temporadas completas: <strong className="text-navy-900">{SEASONS.map((s) => s.year).join(", ")}</strong>.
            Además están verificados los clásicos River–Boca, Racing–Independiente y San Lorenzo–Huracán hasta 1930. El
            resto se carga temporada por temporada, cruzando RSSSF y Wikipedia.
            {annulledCount > 0 &&
              ` ${annulledCount === 1 ? "Hay 1 partido" : `Hay ${annulledCount} partidos`} anulado${annulledCount === 1 ? "" : "s"} que se muestra${annulledCount === 1 ? "" : "n"} pero no suma${annulledCount === 1 ? "" : "n"}.`}
          </p>
          <section>
            <h2 className="section-title mb-3">Partidos ({matches.length})</h2>
            <MatchList matches={matches} />
          </section>
        </>
      )}
    </div>
  );
}
