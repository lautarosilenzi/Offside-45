import type { Metadata } from "next";
import { Stat } from "@/components/CupHistory";
import CompLogo from "@/components/CompLogo";
import Flag from "@/components/Flag";
import PageHero from "@/components/PageHero";
import { WORLD_CUPS, worldCupNation } from "@/lib/data/world-titles";
import { APPEARANCES, TOP_SCORERS, TOP_SCORER_BY_YEAR } from "@/lib/data/world-cup-stats";
import { NATIONS, flagOf } from "@/lib/data/nations";
import { positions } from "@/lib/rank";

export const metadata: Metadata = { title: "Copa del Mundo · Offside 45" };

const nation = (code: string) => NATIONS[code] ?? { name: code, flag: undefined };

// Títulos y finales de cada selección (Alemania Federal suma con Alemania, como en la FIFA).
function titleTable() {
  const map = new Map<string, { name: string; titles: number; finals: number; years: number[] }>();
  const get = (name: string) => map.get(name) ?? (map.set(name, { name, titles: 0, finals: 0, years: [] }), map.get(name)!);
  for (const w of WORLD_CUPS) {
    const c = get(worldCupNation(w.champion));
    c.titles++;
    c.years.push(w.year);
    get(worldCupNation(w.runnerUp)).finals++;
  }
  return [...map.values()]
    .filter((r) => r.titles)
    .sort((a, b) => b.titles - a.titles || b.finals - a.finals || a.years[a.titles - 1] - b.years[b.titles - 1]);
}

// "Estados Unidos, Canadá y México" → una bandera por país.
const hostFlags = (host: string) => host.split(/, | y /).map((h) => ({ name: h, flag: flagOf(h) }));

export default function WorldCupsPage() {
  const titles = titleTable();
  const titlePos = positions(titles, (r) => r.titles);
  const scorerPos = positions(TOP_SCORERS, (r) => r.goals);
  const apps = APPEARANCES.slice(0, 24);
  const appPos = positions(apps, (r) => r.appearances);
  const argentina = APPEARANCES.find((a) => a.code === "ARG")!;

  return (
    <>
      <PageHero eyebrow="Copa Mundial de la FIFA · desde 1930" title="Copa del Mundo">
        <span className="text-base sm:text-lg">
          Todos los campeones del mundo, año por año, con la final, la sede y el goleador de cada Copa del Mundo. Argentina ganó tres (1978,
          1986 y 2022), jugó otras cuatro finales y estuvo en {argentina.appearances} de las {WORLD_CUPS.length} Copas del Mundo.
        </span>
        <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <CompLogo id="mundial" size={84} className="trophy-float drop-shadow-[0_0_24px_rgba(245,179,1,0.55)]" />
          <Stat value={WORLD_CUPS.length} label="Ediciones" />
          <Stat value={titles.length} label="Campeones distintos" />
          <Stat value={APPEARANCES.length} label="Selecciones que jugaron" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <h2 className="section-title mb-3">Tabla de campeones</h2>
          <div className="panel overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                  <th className="w-10 py-2 pl-4 text-left">#</th>
                  <th className="py-2 text-left">Selección</th>
                  <th className="w-16 py-2 text-right">Títulos</th>
                  <th className="w-20 py-2 text-right">Subcamp.</th>
                  <th className="hidden py-2 pl-6 pr-4 text-left sm:table-cell">Años</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {titles.map((r, i) => (
                  <tr key={r.name}>
                    <td className="py-2.5 pl-4 tabular-nums text-navy-400">{titlePos[i]}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-2.5 font-semibold text-navy-900">
                        <Flag code={flagOf(r.name)} size={20} />
                        {r.name}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-display text-xl font-bold tabular-nums text-navy-950">{r.titles}</td>
                    <td className="py-2.5 text-right tabular-nums text-navy-500">{r.finals}</td>
                    <td className="hidden py-2.5 pl-6 pr-4 text-sm tabular-nums text-navy-500 sm:table-cell">{r.years.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-navy-500">Alemania suma los títulos de Alemania Federal (1954, 1974 y 1990), como lo hace la FIFA.</p>
        </section>

        <section>
          <h2 className="section-title mb-3">Año por año</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {[...WORLD_CUPS].reverse().map((w) => {
              const scorer = TOP_SCORER_BY_YEAR.find((s) => s.year === w.year);
              return (
                <li key={w.year} className="panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-4xl font-bold leading-none text-gold-500">{w.year}</span>
                    <span className="flex flex-wrap items-center justify-end gap-1.5 text-sm text-navy-500">
                      Sede:
                      {hostFlags(w.host).map((h) => (
                        <span key={h.name} className="flex items-center gap-1">
                          <Flag code={h.flag} size={14} /> {h.name}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span data-confetti className="flex cursor-pointer items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide text-navy-950">
                      <Flag code={flagOf(w.champion)} size={22} />
                      {w.champion}
                    </span>
                    <span className="text-base text-navy-500">
                      {w.score} a{" "}
                      <span className="inline-flex items-center gap-1.5 font-semibold text-navy-700">
                        <Flag code={flagOf(w.runnerUp)} size={14} />
                        {w.runnerUp}
                      </span>
                    </span>
                  </div>
                  {scorer && (
                    <p className="mt-2 text-sm text-navy-600">
                      <span className="font-semibold text-navy-900">Goleador:</span>{" "}
                      {scorer.players.map((p, i) => (
                        <span key={p.name}>
                          {i > 0 && ", "}
                          <span className="inline-flex items-center gap-1">
                            <Flag code={nation(p.code).flag} size={12} /> {p.name}
                          </span>
                        </span>
                      ))}{" "}
                      ({scorer.goals} goles{scorer.players.length > 1 ? " cada uno" : ""})
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-navy-500">
            En 1950 no hubo final: el título se definió en un cuadrangular, y el partido decisivo fue Uruguay 2, Brasil 1 en el Maracaná.
            No se jugó en 1942 ni en 1946 por la Segunda Guerra Mundial. Ademir (1950): 9 goles según Wikipedia; la FIFA le cuenta 8.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="section-title mb-3">Máximos goleadores</h2>
            <div className="panel overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                    <th className="w-8 py-2 pl-4 text-left">#</th>
                    <th className="py-2 text-left">Jugador</th>
                    <th className="w-12 py-2 text-right">Goles</th>
                    <th className="w-12 py-2 pr-4 text-right">PJ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {TOP_SCORERS.map((s, i) => (
                    <tr key={s.name} title={`Copas del Mundo con goles: ${s.tournaments.join(", ")}`}>
                      <td className="py-2 pl-4 tabular-nums text-navy-400">{scorerPos[i]}</td>
                      <td className="py-2">
                        <span className="flex items-center gap-2 font-semibold text-navy-900">
                          <Flag code={nation(s.code).flag} size={14} title={nation(s.code).name} />
                          {s.name}
                        </span>
                      </td>
                      <td className="py-2 text-right font-display text-lg font-bold tabular-nums text-navy-950">{s.goals}</td>
                      <td className="py-2 pr-4 text-right tabular-nums text-navy-500">{s.matches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-navy-500">Jugadores con 10 goles o más. Mbappé pasó a Messi en el partido por el tercer puesto de 2026.</p>
          </section>

          <section>
            <h2 className="section-title mb-3">Participaciones en la Copa del Mundo</h2>
            <div className="panel overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                    <th className="w-8 py-2 pl-4 text-left">#</th>
                    <th className="py-2 text-left">Selección</th>
                    <th className="w-16 py-2 text-right">Jugadas</th>
                    <th className="w-16 py-2 pr-4 text-right">Debut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {apps.map((a, i) => (
                    <tr key={a.code} className={a.code === "ARG" ? "bg-brand-50/70" : undefined}>
                      <td className="py-2 pl-4 tabular-nums text-navy-400">{appPos[i]}</td>
                      <td className="py-2">
                        <span className="flex items-center gap-2 font-semibold text-navy-900">
                          <Flag code={nation(a.code).flag} size={14} />
                          {nation(a.code).name}
                        </span>
                      </td>
                      <td className="py-2 text-right font-display text-lg font-bold tabular-nums text-navy-950">{a.appearances}</td>
                      <td className="py-2 pr-4 text-right tabular-nums text-navy-500">{a.debut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-navy-500">
              Las 24 selecciones con más participaciones (jugaron {APPEARANCES.length} en total). Alemania incluye a Alemania Federal; Rusia, a la
              Unión Soviética; Serbia, a Yugoslavia; Chequia y Eslovaquia, a Checoslovaquia. Brasil es la única que jugó todos.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
