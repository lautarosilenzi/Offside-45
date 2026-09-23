"use client";

import { useMemo, useState } from "react";
import { CLASICOS, getTeam } from "@/lib/teams";
import { computeStats, getHeadToHead } from "@/lib/matches";
import TeamSelect from "./TeamSelect";
import StatsCard from "./StatsCard";
import MatchCard from "./MatchCard";

export default function HeadToHead() {
  const [teamA, setTeamA] = useState("river");
  const [teamB, setTeamB] = useState("boca");

  const a = getTeam(teamA)!;
  const b = getTeam(teamB)!;
  const matches = useMemo(() => getHeadToHead(teamA, teamB), [teamA, teamB]);
  const stats = useMemo(() => computeStats(matches, teamA), [matches, teamA]);

  const swap = () => {
    setTeamA(teamB);
    setTeamB(teamA);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          <TeamSelect label="Equipo 1" value={teamA} exclude={teamB} onChange={setTeamA} />
          <button
            type="button"
            onClick={swap}
            aria-label="Invertir equipos"
            className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-500 shadow-sm transition hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100 sm:mb-0.5"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rotate-90 sm:rotate-0" aria-hidden>
              <path d="M13.2 3.3a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-3 3a1 1 0 1 1-1.4-1.4L14.5 8H4a1 1 0 0 1 0-2h10.5l-1.3-1.3a1 1 0 0 1 0-1.4zM6.8 9.3a1 1 0 0 1 0 1.4L5.5 12H16a1 1 0 1 1 0 2H5.5l1.3 1.3a1 1 0 1 1-1.4 1.4l-3-3a1 1 0 0 1 0-1.4l3-3a1 1 0 0 1 1.4 0z" />
            </svg>
          </button>
          <TeamSelect label="Equipo 2" value={teamB} exclude={teamA} onChange={setTeamB} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
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
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-lg font-semibold text-slate-700">Sin partidos registrados</p>
          <p className="mt-1 text-sm text-slate-500">
            Todavía no hay datos entre {a.name} y {b.name}. Probá con uno de los clásicos.
          </p>
        </div>
      ) : (
        <>
          <StatsCard a={a} b={b} stats={stats} />
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Partidos ({matches.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
