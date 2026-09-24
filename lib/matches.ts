import type { HeadToHeadStats, Match } from "./types";
import { AMATEUR_MATCHES } from "./data/amateur";

// Solo partidos verificados. Más adelante esto pasa a una tabla en Supabase.
export const MATCHES: Match[] = [...AMATEUR_MATCHES];

export const isCounted = (m: Match) => m.status !== "annulled";

export function getHeadToHead(a: string, b: string): Match[] {
  return MATCHES.filter(
    (m) => (m.homeId === a && m.awayId === b) || (m.homeId === b && m.awayId === a),
  ).sort((x, y) => y.date.localeCompare(x.date));
}

// Ganador oficial del partido: respeta los puntos dados por escritorio.
export function winnerOf(m: Match): string | null {
  if (m.awardedTo) return m.awardedTo;
  if (m.homeGoals > m.awayGoals) return m.homeId;
  if (m.awayGoals > m.homeGoals) return m.awayId;
  return null;
}

export function computeStats(matches: Match[], a: string): HeadToHeadStats {
  const counted = matches.filter(isCounted);
  const stats: HeadToHeadStats = { played: counted.length, winsA: 0, winsB: 0, draws: 0, goalsA: 0, goalsB: 0 };
  for (const m of counted) {
    const aIsHome = m.homeId === a;
    stats.goalsA += aIsHome ? m.homeGoals : m.awayGoals;
    stats.goalsB += aIsHome ? m.awayGoals : m.homeGoals;
    const w = winnerOf(m);
    if (w === null) stats.draws++;
    else if (w === a) stats.winsA++;
    else stats.winsB++;
  }
  return stats;
}
