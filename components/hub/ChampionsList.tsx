import type { ChampionRow, TitleCount } from "@/lib/champions";

// Pestaña "Campeones": todos los campeones, del más reciente al más viejo, y la tabla de los más ganadores.
export default function ChampionsList({ rows, ranking, source }: { rows: ChampionRow[]; ranking: TitleCount[]; source: string }) {
  const hasRunner = rows.some((r) => r.runnerUp);
  return (
    <div className="space-y-3">
      <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
        <section className="panel overflow-hidden">
          <h2 className="bg-navy-950 px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">Campeones ({rows.length})</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                <th className="w-28 py-2 pl-4 text-left">Temporada</th>
                <th className="py-2 text-left">Campeón</th>
                {hasRunner && <th className="hidden py-2 pr-4 text-left sm:table-cell">Subcampeón</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {rows.map((r, i) => (
                <tr key={`${r.season}-${i}`}>
                  <td className="py-1.5 pl-4 tabular-nums text-navy-500">{r.season}</td>
                  <td className="py-1.5 font-semibold text-navy-950">🏆 {r.champion}</td>
                  {hasRunner && <td className="hidden py-1.5 pr-4 text-navy-500 sm:table-cell">{r.runnerUp ?? ""}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="panel self-start overflow-hidden">
          <h2 className="bg-navy-950 px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">Más ganadores</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                <th className="w-8 py-2 pl-3 text-left">#</th>
                <th className="py-2 text-left">Club</th>
                <th className="w-14 py-2 text-center">Títulos</th>
                <th className="w-24 py-2 pr-3 text-right">Último</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {ranking.map((t, i) => (
                <tr key={t.club}>
                  <td className="py-1.5 pl-3 tabular-nums text-navy-400">{i > 0 && ranking[i - 1].titles === t.titles ? "" : i + 1}</td>
                  <td className="py-1.5 font-semibold text-navy-900">{t.club}</td>
                  <td className="py-1.5 text-center font-display text-base font-bold tabular-nums text-navy-950">{t.titles}</td>
                  <td className="py-1.5 pr-3 text-right text-xs tabular-nums text-navy-500">{t.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <p className="text-xs text-navy-400">
        Fuente:{" "}
        <a href={source} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">
          Wikipedia
        </a>
        , verificada contra la tabla de títulos por club del mismo artículo. Algunos nombres viejos se unificaron con el actual del club (por ejemplo,
        Madrid FC con Real Madrid) para contar bien sus títulos.
      </p>
    </div>
  );
}
