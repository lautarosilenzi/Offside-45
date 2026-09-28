import type { HeadToHeadStats, Match } from "./types";
import { AMATEUR_MATCHES } from "./data/amateur";
import { winnerOf } from "./result";
import { LOADED_YEARS, SEASON_MATCHES, SEASON_OF_MATCH } from "./seasons";

const yearOf = (m: Match) => Number(m.date.slice(0, 4));

// Las temporadas completas (lib/data/seasons) reemplazan a los partidos de liga sueltos de ese año, y a los de copa
// que ya están en una copa importada (mismo día y mismos equipos). El resto de los de copa se mantiene hasta que se cargue su copa.
// Más adelante esto pasa a una tabla en Supabase.
const pairKey = (m: Match) => `${m.date} ${[m.homeId, m.awayId].sort().join(" ")}`;
const LOADED_KEYS = new Set(SEASON_MATCHES.map(pairKey));
export const MATCHES: Match[] = [
  ...SEASON_MATCHES,
  ...AMATEUR_MATCHES.filter((m) => !(LOADED_YEARS.has(yearOf(m)) && m.competition === "Primera División") && !LOADED_KEYS.has(pairKey(m))),
];

export const TEAM_IDS_WITH_MATCHES = new Set(MATCHES.flatMap((m) => [m.homeId, m.awayId]));

// En el historial entre dos equipos no cuentan los anulados, los que la liga dio por perdidos a ambos
// ni los que tienen un resultado oficial distinto para cada equipo.
export const isCounted = (m: Match) => m.status !== "annulled" && !m.bothLost && !m.splitAward;

export function getHeadToHead(a: string, b: string): Match[] {
  return MATCHES.filter(
    (m) => (m.homeId === a && m.awayId === b) || (m.homeId === b && m.awayId === a),
  ).sort((x, y) => y.date.localeCompare(x.date));
}

export { winnerOf };

// Era de un partido. Amateur: hasta 1930, y las ligas y copas amateurs oficiales que siguieron en paralelo a la
// liga profesional entre 1931 y 1934. Profesional: desde 1931 (Liga Argentina de Football y después la AFA).
export type Era = "amateur" | "profesional";
export function eraOf(m: Match): Era {
  const season = SEASON_OF_MATCH.get(m.id);
  const year = season?.year ?? yearOf(m);
  if (year < 1931) return "amateur";
  if (season && (season.slug.endsWith("-amateur") || /liga amateur/i.test(season.organizer))) return "amateur";
  return "profesional";
}

export function computeStats(matches: Match[], a: string): HeadToHeadStats {
  const counted = matches.filter(isCounted);
  const stats: HeadToHeadStats = { played: counted.length, winsA: 0, winsB: 0, draws: 0, goalsA: 0, goalsB: 0 };
  for (const m of counted) {
    const aIsHome = m.homeId === a;
    if (!m.scoreUnknown && !m.goalsVoid) {
      stats.goalsA += aIsHome ? m.homeGoals : m.awayGoals;
      stats.goalsB += aIsHome ? m.awayGoals : m.homeGoals;
    }
    const w = winnerOf(m);
    if (w === null) stats.draws++;
    else if (w === a) stats.winsA++;
    else stats.winsB++;
  }
  return stats;
}
