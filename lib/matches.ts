import type { HeadToHeadStats, Match } from "./types";
import { AMATEUR_MATCHES } from "./data/amateur";
import { winnerOf } from "./result";
import { LOADED_YEARS, SEASON_MATCHES } from "./seasons";

const yearOf = (m: Match) => Number(m.date.slice(0, 4));

// Las temporadas completas (lib/data/seasons) reemplazan a los partidos de liga sueltos de ese año.
// Los de copa se mantienen hasta que se carguen las copas nacionales.
// Más adelante esto pasa a una tabla en Supabase.
export const MATCHES: Match[] = [
  ...SEASON_MATCHES,
  ...AMATEUR_MATCHES.filter((m) => !(LOADED_YEARS.has(yearOf(m)) && m.competition === "Primera División")),
];

export const TEAM_IDS_WITH_MATCHES = new Set(MATCHES.flatMap((m) => [m.homeId, m.awayId]));

export const isCounted = (m: Match) => m.status !== "annulled";

export function getHeadToHead(a: string, b: string): Match[] {
  return MATCHES.filter(
    (m) => (m.homeId === a && m.awayId === b) || (m.homeId === b && m.awayId === a),
  ).sort((x, y) => y.date.localeCompare(x.date));
}

export { winnerOf };

export function computeStats(matches: Match[], a: string): HeadToHeadStats {
  const counted = matches.filter(isCounted);
  const stats: HeadToHeadStats = { played: counted.length, winsA: 0, winsB: 0, draws: 0, goalsA: 0, goalsB: 0 };
  for (const m of counted) {
    const aIsHome = m.homeId === a;
    if (!m.scoreUnknown) {
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
