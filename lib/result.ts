import type { Match } from "./types";

// Ganador oficial del partido: respeta los puntos dados por escritorio y los resultados sin goles registrados.
export function winnerOf(m: Match): string | null {
  if (m.awardedTo) return m.awardedTo;
  if (m.scoreUnknown) return m.winnerId ?? null;
  if (m.homeGoals > m.awayGoals) return m.homeId;
  if (m.awayGoals > m.homeGoals) return m.awayId;
  return null;
}
