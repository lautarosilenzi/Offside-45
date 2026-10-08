import type { Metadata } from "next";
import { Stat } from "@/components/CupHistory";
import CompLogo from "@/components/CompLogo";
import Crest from "@/components/Crest";
import PageHero from "@/components/PageHero";
import { positions } from "@/lib/rank";
import { RankTable, YearList, countryOf } from "@/components/TitleBoards";
import { listFinals } from "@/lib/cup-history";
import { CLUB_WORLD_CUP, FIFA_INTERCONTINENTAL, INTERCONTINENTAL } from "@/lib/data/world-titles";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "Intercontinental y Mundial de Clubes · 126Goals" };

const INTER = listFinals(INTERCONTINENTAL, "Copa Intercontinental");
const MUNDIAL = listFinals(CLUB_WORLD_CUP, "Mundial de Clubes");
const FIFA_IC = listFinals(FIFA_INTERCONTINENTAL, "Copa Intercontinental FIFA");

// Campeones del mundo: la FIFA reconoce a los ganadores de la Intercontinental (1960–2004) y del Mundial de Clubes.
// La Copa Intercontinental de la FIFA (desde 2024) va en su propia columna.
function worldRanking() {
  const map = new Map<string, { id: string; inter: number; mundial: number; fifa: number; years: number[] }>();
  const add = (rows: { year: number; champion?: string }[], k: "inter" | "mundial" | "fifa") => {
    for (const r of rows) {
      if (!r.champion) continue;
      const c = map.get(r.champion) ?? { id: r.champion, inter: 0, mundial: 0, fifa: 0, years: [] };
      c[k]++;
      c.years.push(r.year);
      map.set(r.champion, c);
    }
  };
  add(INTER, "inter");
  add(MUNDIAL, "mundial");
  add(FIFA_IC, "fifa");
  return [...map.values()]
    .map((c) => ({ ...c, years: c.years.sort((a, b) => a - b), total: c.inter + c.mundial + c.fifa }))
    .sort((a, b) => b.total - a.total || a.years[a.total - 1] - b.years[b.total - 1]);
}

export default function ClubWorldPage() {
  const ranking = worldRanking();
  const pos = positions(ranking, (r) => r.total);
  const argentine = ranking.filter((r) => countryOf(r.id) === "Argentina");

  return (
    <>
      <PageHero eyebrow="Campeones del mundo de clubes" title="Intercontinental y Mundial de Clubes">
        La Copa Intercontinental (1960–2004, el campeón de Europa contra el de la Libertadores), el Mundial de Clubes de la FIFA
        (desde 2000) y la nueva Copa Intercontinental de la FIFA (desde 2024). La FIFA reconoce como campeones del mundo a los
        ganadores de la Intercontinental y del Mundial de Clubes.
        <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <CompLogo id="mundial-clubes" size={72} className="rounded-2xl bg-white p-1.5 shadow-lg" />
          <Stat value={ranking.length} label="Campeones distintos" />
          <Stat value={argentine.reduce((n, r) => n + r.total, 0)} label="Títulos argentinos" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <h2 className="section-title mb-3">Tabla de campeones del mundo</h2>
          <div className="panel overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                  <th className="w-10 py-2 pl-4 text-left">#</th>
                  <th className="py-2 text-left">Club</th>
                  <th className="w-16 py-2 text-right" title="Copa Intercontinental 1960–2004">Interc.</th>
                  <th className="w-16 py-2 text-right" title="Mundial de Clubes de la FIFA">Mundial</th>
                  <th className="hidden w-20 py-2 text-right sm:table-cell" title="Copa Intercontinental de la FIFA (desde 2024)">
                    Interc. FIFA
                  </th>
                  <th className="w-16 py-2 text-right">Total</th>
                  <th className="hidden py-2 pl-6 pr-4 text-left md:table-cell">Años</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {ranking.map((r, i) => {
                  const team = getTeam(r.id)!;
                  return (
                    <tr key={r.id}>
                      <td className="py-2 pl-4 tabular-nums text-navy-400">{pos[i]}</td>
                      <td className="max-w-[14rem] py-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <Crest team={team} size="xs" />
                          <span className="truncate font-semibold text-navy-900">{team.name.replace(/\s*\([^)]*\)$/, "")}</span>
                        </span>
                      </td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.inter || ""}</td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.mundial || ""}</td>
                      <td className="hidden py-2 text-right tabular-nums text-navy-700 sm:table-cell">{r.fifa || ""}</td>
                      <td className="py-2 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.total}</td>
                      <td className="hidden py-2 pl-6 pr-4 text-xs tabular-nums text-navy-500 md:table-cell">{r.years.join(", ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="section-title mb-3">Por país</h2>
          <RankTable rows={[...INTER, ...MUNDIAL, ...FIFA_IC]} label="País" by={countryOf} />
        </section>

        <section>
          <h2 className="section-title mb-3">Copa Intercontinental de la FIFA · desde 2024</h2>
          <YearList rows={FIFA_IC} />
        </section>
        <section>
          <h2 className="section-title mb-3">Mundial de Clubes · desde 2000</h2>
          <YearList rows={MUNDIAL} />
        </section>
        <section>
          <h2 className="section-title mb-3">Copa Intercontinental · 1960–2004</h2>
          <YearList rows={INTER} />
        </section>
        <p className="text-sm text-navy-400">
          El Mundial de Clubes no se jugó entre 2001 y 2004 ni en 2024; las ediciones 2020, 2021 y 2022 se jugaron a comienzos del
          año siguiente. La Intercontinental no se jugó en 1975 ni en 1978. Las ediciones con un club argentino llevan a sus partidos.
        </p>
      </main>
    </>
  );
}
