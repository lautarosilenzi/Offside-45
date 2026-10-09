import type { Metadata } from "next";
import Link from "next/link";
import CompLogo from "@/components/CompLogo";
import Crest from "@/components/Crest";
import { Stat } from "@/components/CupHistory";
import LiveMatches from "@/components/live/LiveMatches";
import MatchList from "@/components/MatchList";
import PageHero from "@/components/PageHero";
import { RankTable, YearList } from "@/components/TitleBoards";
import { isCounted, winnerOf } from "@/lib/matches";
import { positions } from "@/lib/rank";
import { copaArgentinaFinals } from "@/lib/cup-history";
import { CUP_COMPETITIONS, seasonLabel, sourceOrder } from "@/lib/seasons";
import { liveLeagues } from "@/lib/live/leagues";
import { getTeam } from "@/lib/teams";
import type { Match } from "@/lib/types";

export const metadata: Metadata = { title: "Copa Argentina · 126Goals" };

const EDITIONS = CUP_COMPETITIONS.find((c) => c.name === "Copa Argentina")!.editions;
const CURRENT = EDITIONS.find((s) => s.inProgress) ?? EDITIONS[EDITIONS.length - 1];

type Row = { id: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number; editions: number };

// Tabla histórica de la Copa Argentina: todos los partidos de todas las ediciones (3 puntos por partido ganado).
// Los partidos definidos por penales cuentan como empate, como en el resto del sitio.
function historicTable(): Row[] {
  const rows = new Map<string, Row & { seasons: Set<string> }>();
  const row = (id: string) =>
    rows.get(id) ?? (rows.set(id, { id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, editions: 0, seasons: new Set() }), rows.get(id)!);
  for (const s of EDITIONS) {
    for (const m of s.matches) {
      if (!isCounted(m) || m.walkover) continue;
      const home = row(m.homeId);
      const away = row(m.awayId);
      home.seasons.add(s.slug);
      away.seasons.add(s.slug);
      home.played++;
      away.played++;
      if (!m.scoreUnknown && !m.goalsVoid) {
        home.gf += m.homeGoals;
        home.ga += m.awayGoals;
        away.gf += m.awayGoals;
        away.ga += m.homeGoals;
      }
      const w = winnerOf(m);
      if (w === null) {
        home.drawn++;
        away.drawn++;
        home.points++;
        away.points++;
      } else {
        const [win, lose] = w === m.homeId ? [home, away] : [away, home];
        win.won++;
        lose.lost++;
        win.points += 3;
      }
    }
  }
  return [...rows.values()]
    .map((r) => ({ ...r, editions: r.seasons.size }))
    .sort((a, b) => b.points - a.points || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf);
}

export default function CopaArgentinaPage() {
  const rows = copaArgentinaFinals();
  const table = historicTable();
  const pos = positions(table, (r) => r.points);
  const top = table.slice(0, 40);
  const current: Match[] = [...CURRENT.matches].sort(sourceOrder).reverse();
  const stages = [...new Set(current.map((m) => m.stage ?? "Partidos"))];
  const lastStage = stages[0];

  return (
    <>
      <PageHero eyebrow="AFA · todas las categorías" title="Copa Argentina">
        <span className="text-base">
          La copa de todo el fútbol argentino: clubes de Primera, del Ascenso y del Torneo Federal. Se jugó en 1969 y 1970 y volvió en
          2011/12. Acá está la edición que se está jugando, todos los campeones y la tabla histórica.
        </span>
        <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <CompLogo id="copa-argentina" size={64} className="" />
          <Stat value={EDITIONS.length} label="Ediciones" />
          <Stat value={table.length} label="Clubes que la jugaron" />
          <Stat value={EDITIONS.reduce((n, s) => n + s.matches.length, 0)} label="Partidos" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="section-title">
              Copa Argentina {seasonLabel(CURRENT)} {CURRENT.inProgress && <span className="live-dot ml-2 align-middle">En juego</span>}
            </h2>
            <Link href={`/temporadas/${CURRENT.slug}`} className="font-display text-sm font-semibold uppercase tracking-wide text-brand-500 hover:underline">
              Ver todos los partidos
            </Link>
          </div>
          {CURRENT.inProgress && (
            <p className="mb-3 text-sm text-navy-600">
              Último resultado cargado: {lastStage}. Se actualiza a medida que avanza la copa.
            </p>
          )}
          <div className="mb-4">
            <LiveMatches leagues={liveLeagues(["copa-argentina"])} />
          </div>
          <MatchList matches={current.filter((m) => (m.stage ?? "Partidos") === lastStage || stages.indexOf(m.stage ?? "Partidos") === 1)} groupBy="stage" />
        </section>

        <section>
          <h2 className="section-title mb-3">Campeones</h2>
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <YearList rows={rows} />
            <RankTable rows={rows} />
          </div>
        </section>

        <section>
          <h2 className="section-title mb-3">Tabla histórica</h2>
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                  <th className="w-10 py-2 pl-4 text-left">#</th>
                  <th className="py-2 text-left">Club</th>
                  <th className="w-12 py-2 text-right">Pts</th>
                  <th className="w-10 py-2 text-right">PJ</th>
                  <th className="w-10 py-2 text-right">G</th>
                  <th className="w-10 py-2 text-right">E</th>
                  <th className="w-10 py-2 text-right">P</th>
                  <th className="w-16 py-2 text-right">Goles</th>
                  <th className="w-12 py-2 text-right">Dif.</th>
                  <th className="w-14 py-2 pr-4 text-right">Ed.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {top.map((r, i) => {
                  const team = getTeam(r.id);
                  return (
                    <tr key={r.id}>
                      <td className="py-2 pl-4 tabular-nums text-navy-400">{pos[i]}</td>
                      <td className="max-w-[14rem] py-2">
                        <span className="flex min-w-0 items-center gap-2">
                          {team && <Crest team={team} size="xs" />}
                          <span className="break-words leading-snug font-semibold text-navy-900">{team?.name ?? r.id}</span>
                        </span>
                      </td>
                      <td className="py-2 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.points}</td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.played}</td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.won}</td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.drawn}</td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.lost}</td>
                      <td className="py-2 text-right tabular-nums text-navy-500">
                        {r.gf}:{r.ga}
                      </td>
                      <td className="py-2 text-right tabular-nums text-navy-500">{r.gf - r.ga > 0 ? `+${r.gf - r.ga}` : r.gf - r.ga}</td>
                      <td className="py-2 pr-4 text-right tabular-nums text-navy-500">{r.editions}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-navy-500">
            Los 40 primeros de los {table.length} clubes que jugaron la Copa Argentina (todas las ediciones, incluida la que está en juego). 3
            puntos por partido ganado; los partidos definidos por penales cuentan como empate. Ed.: ediciones jugadas.
          </p>
        </section>
      </main>
    </>
  );
}
