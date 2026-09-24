import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import SiteHeader from "@/components/SiteHeader";
import TeamBadge from "@/components/TeamBadge";
import SeasonNotes from "@/components/SeasonNotes";
import { SEASONS, computeTable, getSeason, seasonNameOf, verifySeason } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEASONS.map((s) => ({ year: String(s.year) }));
}

export function generateMetadata({ params }: { params: { year: string } }): Metadata {
  return { title: `Temporada ${params.year} · Offside 45` };
}

export default function SeasonPage({ params }: { params: { year: string } }) {
  const season = getSeason(Number(params.year));
  if (!season) notFound();

  const table = computeTable(season);
  const problems = verifySeason(season);
  const matches = [...season.matches].sort((a, b) => a.date.localeCompare(b.date));
  const idx = SEASONS.indexOf(season);
  const prev = SEASONS[idx - 1];
  const next = SEASONS[idx + 1];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
        <div>
          <Link href="/temporadas" className="text-sm font-semibold text-brand-500 hover:underline">
            ← Temporadas
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {season.title}
          </h1>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <Fact label="Torneo" value={season.tournament} />
            <Fact label="Organizó" value={season.organizer} />
            <Fact
              label={season.championIds.length > 1 ? "Campeones" : "Campeón"}
              value={season.championIds.map((id) => getTeam(id)?.name ?? id).join(" y ")}
            />
          </dl>
          <p className="mt-4 leading-relaxed text-slate-600">{season.summary}</p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold">Tabla final de posiciones</h2>
            {problems.length === 0 ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Calculada con los partidos y coincide con la fuente
              </span>
            ) : (
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                No coincide con la fuente
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 text-left">#</th>
                  <th className="px-2 py-2.5 text-left">Equipo</th>
                  {["PJ", "G", "E", "P", "GF", "GC", "Pts"].map((h) => (
                    <th key={h} className="px-2 py-2.5 text-right last:pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.map((r, i) => {
                  const team = getTeam(r.teamId);
                  const champion = season.championIds.includes(r.teamId);
                  const eraName = seasonNameOf(season, r.teamId);
                  return (
                    <tr key={r.teamId} className="border-t border-slate-100">
                      <td className="px-4 py-2.5 tabular-nums text-slate-500">{i + 1}</td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2.5">
                          {team && <TeamBadge team={team} size="sm" />}
                          <span className={champion ? "font-bold" : "font-medium"}>
                            {eraName ?? team?.name ?? r.teamId}
                            {eraName && team && (
                              <span className="ml-1.5 text-xs font-normal text-slate-400">(hoy {team.name})</span>
                            )}
                          </span>
                          {champion && (
                            <span className="rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                              Campeón
                            </span>
                          )}
                        </div>
                      </td>
                      {[r.played, r.won, r.drawn, r.lost, r.goalsFor, r.goalsAgainst].map((v, j) => (
                        <td key={j} className="px-2 py-2.5 text-right tabular-nums text-slate-600">
                          {v}
                        </td>
                      ))}
                      <td className="py-2.5 pl-2 pr-5 text-right font-bold tabular-nums">{r.points}</td>
                    </tr>
                  );
                })}
                {season.withdrawn?.map((id) => (
                  <tr key={id} className="border-t border-slate-100 text-slate-400">
                    <td className="px-4 py-2.5">–</td>
                    <td className="px-2 py-2.5" colSpan={8}>
                      {getTeam(id)?.name ?? id} · se retiró sin jugar
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {problems.length > 0 && (
            <ul className="border-t border-red-100 bg-red-50 px-5 py-3 text-xs text-red-700">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          <p className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500">
            {season.pointsPerWin} puntos por victoria. La tabla se calcula con los partidos de abajo; los desempates no suman.
          </p>
        </section>

        {season.notes.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold">Datos a tener en cuenta</h2>
            <SeasonNotes notes={season.notes} />
          </section>
        )}

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

        <section className="text-xs text-slate-500">
          <h2 className="mb-2 font-semibold uppercase tracking-wider">Fuentes</h2>
          <ul className="space-y-1">
            {season.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav className="flex justify-between border-t border-slate-200 pt-6 text-sm font-semibold">
          {prev ? (
            <Link href={`/temporadas/${prev.year}`} className="text-brand-500 hover:underline">
              ← {prev.year}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/temporadas/${next.year}`} className="text-brand-500 hover:underline">
              {next.year} →
            </Link>
          )}
        </nav>
      </main>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-snug text-slate-800">{value}</dd>
    </div>
  );
}
