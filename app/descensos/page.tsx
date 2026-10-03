import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import { Stat } from "@/components/CupHistory";
import PageHero from "@/components/PageHero";
import { NO_RELEGATION_NOTE, RELEGATIONS } from "@/lib/data/relegations";
import { positions } from "@/lib/rank";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "Descensos · Offside 45" };

// Descensos por club, con las temporadas. Con igual cantidad, primero el que descendió antes.
function ranking() {
  const map = new Map<string, string[]>();
  for (const r of RELEGATIONS) for (const id of r.teamIds) map.set(id, [...(map.get(id) ?? []), r.season]);
  return [...map.entries()].map(([id, seasons]) => ({ id, seasons })).sort((a, b) => b.seasons.length - a.seasons.length);
}

export default function RelegationsPage() {
  const table = ranking();
  const pos = positions(table, (r) => r.seasons.length);
  const total = RELEGATIONS.reduce((n, r) => n + r.teamIds.length, 0);
  const decades = [...new Set(RELEGATIONS.map((r) => Math.floor(Number(r.season.slice(0, 4)) / 10) * 10))];

  return (
    <>
      <PageHero eyebrow="Primera División · desde 1937" title="Descensos">
        <span className="text-base">
          Todos los clubes que perdieron la categoría desde que empezó a regir el descenso en la era profesional, temporada por
          temporada. Boca Juniors es el único de los cinco grandes que nunca descendió.
        </span>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={total} label="Descensos" />
          <Stat value={table.length} label="Clubes que descendieron" />
          <Stat value={RELEGATIONS.length} label="Temporadas con descensos" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <h2 className="section-title mb-3">Clubes con más descensos</h2>
          <div className="panel overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                  <th className="w-10 py-2 pl-4 text-left">#</th>
                  <th className="py-2 text-left">Club</th>
                  <th className="w-20 py-2 text-right">Descensos</th>
                  <th className="hidden py-2 pl-6 pr-4 text-left md:table-cell">Temporadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {table.map((r, i) => {
                  const team = getTeam(r.id)!;
                  return (
                    <tr key={r.id}>
                      <td className="py-2 pl-4 tabular-nums text-navy-400">{pos[i]}</td>
                      <td className="max-w-[14rem] py-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <Crest team={team} size="xs" />
                          <span className="truncate font-semibold text-navy-900">{team.name}</span>
                        </span>
                      </td>
                      <td className="py-2 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.seasons.length}</td>
                      <td className="hidden py-2 pl-6 pr-4 text-xs tabular-nums text-navy-500 md:table-cell">{r.seasons.join(", ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="section-title mb-3">Temporada por temporada</h2>
          <nav className="mb-4 flex flex-wrap gap-1.5" aria-label="Décadas">
            {decades.map((d) => (
              <a key={d} href={`#d${d}`} className="pill bg-white/70 font-display text-sm font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-white">
                {d}s
              </a>
            ))}
          </nav>
          <ul className="panel divide-y divide-navy-100">
            {RELEGATIONS.map((r, i) => {
              const decade = Math.floor(Number(r.season.slice(0, 4)) / 10) * 10;
              const first = i === 0 || Math.floor(Number(RELEGATIONS[i - 1].season.slice(0, 4)) / 10) * 10 !== decade;
              return (
                <li key={r.season} id={first ? `d${decade}` : undefined} className="grid scroll-mt-24 gap-x-4 gap-y-2 px-4 py-3 sm:grid-cols-[6.5rem_1fr]">
                  <Link href={`/temporadas/${r.slug}`} className="font-display text-2xl font-bold leading-tight text-navy-900 hover:text-brand-500">
                    {r.season}
                  </Link>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {r.teamIds.map((id) => {
                        const team = getTeam(id)!;
                        return (
                          <span key={id} className="flex items-center gap-2 rounded-full bg-red-50 py-1 pl-1.5 pr-3 text-sm font-semibold text-navy-900 ring-1 ring-red-100">
                            <Crest team={team} size="sm" />
                            {team.name}
                          </span>
                        );
                      })}
                    </div>
                    {r.note && <p className="mt-1.5 text-xs text-navy-500">{r.note}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-navy-500">
            {NO_RELEGATION_NOTE} Antes de 1937 la Primera cambiaba de tamaño por afiliaciones, desafiliaciones y fusiones de ligas, sin un
            sistema de descenso regular. Fuente: RSSSF, controlada con los partidos de promoción y de desempate cargados en el sitio y con
            la cantidad de descensos de cada club que publica Wikipedia.
          </p>
        </section>
      </main>
    </>
  );
}
