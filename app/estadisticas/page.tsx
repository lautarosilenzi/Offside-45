import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import { Stat } from "@/components/CupHistory";
import PageHero from "@/components/PageHero";
import { isCounted, winnerOf } from "@/lib/matches";
import { positions } from "@/lib/rank";
import { LEAGUE_TITLES, SEASON_OF_MATCH, isAmateurSeason, seasonLabel } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { Match } from "@/lib/types";

export const metadata: Metadata = { title: "Estadísticas · Offside 45" };

// Partidos de los torneos de Primera que dan título (todas las ligas reconocidas; sin copas, promociones, liguillas
// ni reclasificaciones con equipos de otras categorías) con resultado válido.
const LEAGUE_MATCHES: Match[] = LEAGUE_TITLES.flatMap((s) => s.matches).filter(
  (m) => isCounted(m) && !m.walkover && !m.scoreUnknown && !m.goalsVoid,
);

// Temporada de un torneo: "1990-91" para las partidas, el año para las demás (Metropolitano y Nacional son la misma).
const seasonKey = (slug: string) => slug.match(/^[0-9]{4}(-[0-9]{2})?/)![0];

type Row = { id: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number; seasons: number };

// Tabla histórica: 3 puntos por partido ganado en todas las épocas, para poder comparar.
function historic(pro: boolean): Row[] {
  const rows = new Map<string, Row & { years: Set<string> }>();
  const row = (id: string) =>
    rows.get(id) ?? (rows.set(id, { id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, seasons: 0, years: new Set<string>() }), rows.get(id)!);
  for (const m of LEAGUE_MATCHES) {
    const season = SEASON_OF_MATCH.get(m.id)!;
    if (pro && isAmateurSeason(season)) continue;
    const home = row(m.homeId);
    const away = row(m.awayId);
    home.years.add(seasonKey(season.slug));
    away.years.add(seasonKey(season.slug));
    home.played++;
    away.played++;
    home.gf += m.homeGoals;
    home.ga += m.awayGoals;
    away.gf += m.awayGoals;
    away.ga += m.homeGoals;
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
  return [...rows.values()].map((r) => ({ ...r, seasons: r.years.size })).sort((a, b) => b.points - a.points || b.gf - b.ga - (a.gf - a.ga));
}

const TOTAL = historic(false);
const PRO = historic(true);
const BIGGEST = [...LEAGUE_MATCHES].sort((a, b) => Math.abs(b.homeGoals - b.awayGoals) - Math.abs(a.homeGoals - a.awayGoals) || b.homeGoals + b.awayGoals - (a.homeGoals + a.awayGoals)).slice(0, 12);
const MOST_GOALS = [...LEAGUE_MATCHES].sort((a, b) => b.homeGoals + b.awayGoals - (a.homeGoals + a.awayGoals) || a.date.localeCompare(b.date)).slice(0, 12);
const SEASONS = [...TOTAL].sort((a, b) => b.seasons - a.seasons).slice(0, 20);

export default function StatsPage() {
  return (
    <>
      <PageHero eyebrow="Argentina · Primera División" title="Estadísticas">
        <span className="text-base">
          Los números de toda la historia de la Primera División, calculados partido por partido con los {LEAGUE_MATCHES.length.toLocaleString("es-AR")}{" "}
          partidos de liga cargados en el sitio (sin copas).
        </span>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={LEAGUE_MATCHES.length.toLocaleString("es-AR")} label="Partidos de liga" />
          <Stat value={LEAGUE_MATCHES.reduce((n, m) => n + m.homeGoals + m.awayGoals, 0).toLocaleString("es-AR")} label="Goles" />
          <Stat value={TOTAL.length} label="Clubes que jugaron en Primera" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <HistoricTable title="Tabla histórica · era profesional (desde 1931)" rows={PRO.slice(0, 30)} />
        <HistoricTable title="Tabla histórica · total (desde 1891)" rows={TOTAL.slice(0, 30)} />
        <p className="-mt-6 text-xs text-navy-500">
          Las 30 primeras posiciones. Todos los partidos de liga de Primera, con 3 puntos por partido ganado en todas las épocas para que
          se puedan comparar (hasta el Apertura 1995 se daban 2). Los partidos definidos por penales cuentan como empate. Tem.: temporadas en Primera.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <MatchTable title="Mayores goleadas" matches={BIGGEST} />
          <MatchTable title="Partidos con más goles" matches={MOST_GOALS} />
        </div>

        <section>
          <h2 className="section-title mb-3">Más temporadas en Primera</h2>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {SEASONS.map((r, i) => {
              const team = getTeam(r.id)!;
              return (
                <li key={r.id} className="panel flex items-center gap-2 px-3 py-2 text-sm">
                  <span className="w-5 font-display font-bold text-navy-400">{positions(SEASONS, (x) => x.seasons)[i]}</span>
                  <Crest team={team} size="xs" />
                  <span className="min-w-0 flex-1 truncate font-semibold text-navy-900">{team.name}</span>
                  <span className="font-display text-lg font-bold tabular-nums text-navy-950">{r.seasons}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-xs text-navy-500">Temporadas en las que el club jugó al menos un torneo de Primera (las partidas, como 1990/91, cuentan una vez; incluye las ligas disidentes de la era amateur).</p>
        </section>

        <p className="text-sm text-navy-500">
          Más números en <Link href="/campeones" className="text-brand-500 hover:underline">Campeones</Link>,{" "}
          <Link href="/descensos" className="text-brand-500 hover:underline">Descensos</Link> y{" "}
          <Link href="/copa-argentina" className="text-brand-500 hover:underline">Copa Argentina</Link>.
        </p>
      </main>
    </>
  );
}

function HistoricTable({ title, rows }: { title: string; rows: Row[] }) {
  const pos = positions(rows, (r) => r.points);
  return (
    <section>
      <h2 className="section-title mb-3">{title}</h2>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
              <th className="w-10 py-2 pl-4 text-left">#</th>
              <th className="py-2 text-left">Club</th>
              <th className="w-14 py-2 text-right">Pts</th>
              <th className="w-12 py-2 text-right">PJ</th>
              <th className="w-12 py-2 text-right">G</th>
              <th className="w-12 py-2 text-right">E</th>
              <th className="w-12 py-2 text-right">P</th>
              <th className="w-20 py-2 text-right">Goles</th>
              <th className="w-12 py-2 pr-4 text-right">Tem.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {rows.map((r, i) => {
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
                  <td className="py-2 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.points.toLocaleString("es-AR")}</td>
                  <td className="py-2 text-right tabular-nums text-navy-700">{r.played}</td>
                  <td className="py-2 text-right tabular-nums text-navy-700">{r.won}</td>
                  <td className="py-2 text-right tabular-nums text-navy-700">{r.drawn}</td>
                  <td className="py-2 text-right tabular-nums text-navy-700">{r.lost}</td>
                  <td className="py-2 text-right tabular-nums text-navy-500">
                    {r.gf}:{r.ga}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-navy-500">{r.seasons}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MatchTable({ title, matches }: { title: string; matches: Match[] }) {
  return (
    <section>
      <h2 className="section-title mb-3">{title}</h2>
      <ul className="panel divide-y divide-navy-100 text-sm">
        {matches.map((m) => {
          const season = SEASON_OF_MATCH.get(m.id)!;
          const home = getTeam(m.homeId)!;
          const away = getTeam(m.awayId)!;
          return (
            <li key={m.id}>
              <Link href={`/temporadas/${season.slug}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2 transition hover:bg-brand-50/60">
                <span className="flex min-w-0 items-center justify-end gap-1.5 text-right">
                  <span className="truncate font-medium text-navy-800">{home.name}</span>
                  <Crest team={home} size="xs" />
                </span>
                <span className="rounded-full bg-navy-900 px-2.5 py-0.5 font-display font-bold tabular-nums text-white">
                  {m.homeGoals}-{m.awayGoals}
                </span>
                <span className="flex min-w-0 items-center gap-1.5">
                  <Crest team={away} size="xs" />
                  <span className="truncate font-medium text-navy-800">{away.name}</span>
                </span>
                <span className="col-span-3 text-center text-[0.7rem] text-navy-400">
                  {m.date.length > 4 ? m.date.split("-").reverse().join("/") : m.date} · {seasonLabel(season)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
