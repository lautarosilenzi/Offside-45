import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crest from "@/components/Crest";
import MatchList from "@/components/MatchList";
import PageHero from "@/components/PageHero";
import SeasonNotes from "@/components/SeasonNotes";
import { SEASONS, computeTable, getSeason, seasonLabel, seasonNameOf, verifySeason } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEASONS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: `Temporada ${params.slug.replace("-", " ").toUpperCase()} · Offside 45` };
}

export default function SeasonPage({ params }: { params: { slug: string } }) {
  const season = getSeason(params.slug);
  if (!season) notFound();

  const table = computeTable(season);
  const problems = verifySeason(season);
  const matches = [...season.matches].sort((a, b) => a.date.localeCompare(b.date));
  const idx = SEASONS.indexOf(season);
  const prev = SEASONS[idx - 1];
  const next = SEASONS[idx + 1];
  const champions = season.championIds.map((id) => getTeam(id)).filter((t) => t !== undefined);

  return (
    <>
      <PageHero
        eyebrow={
          <Link href="/temporadas" className="hover:text-white">
            ← Temporadas
          </Link>
        }
        title={`Temporada ${seasonLabel(season)}`}
      >
        <p>{season.summary}</p>
      </PageHero>

      <div className="border-b border-navy-100 bg-white">
        <dl className="mx-auto grid max-w-5xl divide-y divide-navy-100 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          <Fact label="Torneo">{season.tournament}</Fact>
          <Fact label="Organizó">{season.organizer}</Fact>
          <Fact label={champions.length > 1 ? "Campeones" : "Campeón"}>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {champions.map((t) => (
                <span key={t.id} className="flex items-center gap-2">
                  <Crest team={t} size="sm" />
                  <span className="font-display text-lg font-bold uppercase tracking-wide">{t.name}</span>
                </span>
              ))}
            </span>
          </Fact>
        </dl>
      </div>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="section-title">Tabla final de posiciones</h2>
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                problems.length === 0 ? "text-emerald-700" : "text-red-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${problems.length === 0 ? "bg-emerald-500" : "bg-red-500"}`} />
              {problems.length === 0 ? "Verificada contra la fuente" : "No coincide con la fuente"}
            </span>
          </div>
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="bg-navy-900 font-display text-xs uppercase tracking-wider text-navy-200">
                  <th className="w-10 px-4 py-2 text-left font-semibold">#</th>
                  <th className="px-2 py-2 text-left font-semibold">Equipo</th>
                  {["PJ", "G", "E", "P", "GF", "GC", "DIF"].map((h) => (
                    <th key={h} className="w-11 px-2 py-2 text-right font-semibold">
                      {h}
                    </th>
                  ))}
                  <th className="w-14 py-2 pl-2 pr-4 text-right font-semibold text-white">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {table.map((r, i) => {
                  const team = getTeam(r.teamId);
                  const champion = season.championIds.includes(r.teamId);
                  const eraName = seasonNameOf(season, r.teamId);
                  const diff = r.goalsFor - r.goalsAgainst;
                  return (
                    <tr key={r.teamId} className={champion ? "bg-gold-400/10" : "odd:bg-white even:bg-navy-50/50"}>
                      <td className={`px-4 py-2.5 tabular-nums ${champion ? "border-l-4 border-gold-500 pl-3 font-bold" : "text-navy-500"}`}>
                        {i + 1}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2.5">
                          {team && <Crest team={team} size="sm" />}
                          <span className={champion ? "font-bold text-navy-950" : "font-medium text-navy-800"}>
                            {eraName ?? team?.name ?? r.teamId}
                          </span>
                          {eraName && team && <span className="text-xs text-navy-400">hoy {team.name}</span>}
                        </div>
                      </td>
                      {[r.played, r.won, r.drawn, r.lost, r.goalsFor, r.goalsAgainst].map((v, j) => (
                        <td key={j} className="px-2 py-2.5 text-right tabular-nums text-navy-600">
                          {v}
                        </td>
                      ))}
                      <td className="px-2 py-2.5 text-right tabular-nums text-navy-600">{diff > 0 ? `+${diff}` : diff}</td>
                      <td className="py-2.5 pl-2 pr-4 text-right font-display text-lg font-bold tabular-nums text-navy-950">
                        {r.points}
                      </td>
                    </tr>
                  );
                })}
                {season.withdrawn?.map((id) => (
                  <tr key={id} className="text-navy-400">
                    <td className="px-4 py-2.5">–</td>
                    <td className="px-2 py-2.5" colSpan={9}>
                      {getTeam(id)?.name ?? id} · se retiró
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {problems.length > 0 && (
              <ul className="border-t border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </div>
          <p className="mt-2 text-xs text-navy-500">
            {season.pointsPerWin} puntos por victoria. La tabla se calcula con los partidos de abajo y se compara con la
            publicada por la fuente; los desempates no suman.
          </p>
        </section>

        {season.notes.length > 0 && (
          <section>
            <h2 className="section-title mb-3">Datos a tener en cuenta</h2>
            <div className="panel">
              <SeasonNotes notes={season.notes} />
            </div>
          </section>
        )}

        <section>
          <h2 className="section-title mb-3">Partidos ({matches.length})</h2>
          <MatchList matches={matches} groupByYear={false} />
        </section>

        <section>
          <h2 className="section-title mb-3">Fuentes</h2>
          <ul className="panel divide-y divide-navy-100 text-sm">
            {season.sources.map((s) => (
              <li key={s.url} className="px-4 py-2.5">
                <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-brand-500 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav className="grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/temporadas/${prev.slug}`} className="panel px-4 py-3 transition hover:border-navy-300">
              <div className="text-xs uppercase tracking-wider text-navy-400">Anterior</div>
              <div className="font-display text-2xl font-bold text-navy-900">← {seasonLabel(prev)}</div>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/temporadas/${next.slug}`} className="panel px-4 py-3 text-right transition hover:border-navy-300">
              <div className="text-xs uppercase tracking-wider text-navy-400">Siguiente</div>
              <div className="font-display text-2xl font-bold text-navy-900">{seasonLabel(next)} →</div>
            </Link>
          )}
        </nav>
      </main>
    </>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-4 sm:px-5 sm:first:pl-0">
      <dt className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-navy-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-snug text-navy-900">{children}</dd>
    </div>
  );
}
