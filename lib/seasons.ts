import type { Match, Season, TableRow } from "./types";
import { SEASONS } from "./data/seasons";

export { SEASONS };

export const getSeason = (year: number) => SEASONS.find((s) => s.year === year);

export const LOADED_YEARS = new Set(SEASONS.map((s) => s.year));

// Todos los partidos de las temporadas cargadas.
export const SEASON_MATCHES: Match[] = SEASONS.flatMap((s) => s.matches);

// Nombre con el que el club jugó esa temporada, si era distinto al actual.
export function seasonNameOf(season: Season, teamId: string): string | undefined {
  for (const m of season.matches) {
    if (m.homeId === teamId && m.homeAs) return m.homeAs;
    if (m.awayId === teamId && m.awayAs) return m.awayAs;
  }
  return undefined;
}

// Recalcula la tabla a partir de los partidos de liga de la temporada.
export function computeTable(season: Season): TableRow[] {
  const rows = new Map<string, TableRow>();
  const row = (teamId: string) => {
    if (!rows.has(teamId)) {
      rows.set(teamId, { teamId, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
    }
    return rows.get(teamId)!;
  };

  for (const m of season.matches) {
    if (m.phase !== "league" || m.status === "annulled") continue;
    const home = row(m.homeId);
    const away = row(m.awayId);
    home.played++;
    away.played++;
    home.goalsFor += m.homeGoals;
    home.goalsAgainst += m.awayGoals;
    away.goalsFor += m.awayGoals;
    away.goalsAgainst += m.homeGoals;

    const winner = m.awardedTo ?? (m.homeGoals > m.awayGoals ? m.homeId : m.awayGoals > m.homeGoals ? m.awayId : null);
    if (winner === null) {
      home.drawn++;
      away.drawn++;
      home.points++;
      away.points++;
    } else {
      const [w, l] = winner === m.homeId ? [home, away] : [away, home];
      w.won++;
      l.lost++;
      w.points += season.pointsPerWin;
    }
  }

  return [...rows.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor,
  );
}

const ROW_KEYS = ["played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "points"] as const;

// Diferencias entre la tabla calculada y la publicada por la fuente. Vacío = verificada.
export function verifySeason(season: Season): string[] {
  const computed = new Map(computeTable(season).map((r) => [r.teamId, r]));
  const problems: string[] = [];
  for (const pub of season.publishedTable) {
    const calc = computed.get(pub.teamId);
    if (!calc) {
      if (pub.played > 0) problems.push(`${pub.teamId}: no tiene partidos cargados`);
      continue;
    }
    for (const k of ROW_KEYS) {
      if (calc[k] !== pub[k]) problems.push(`${pub.teamId}: ${k} calculado ${calc[k]}, publicado ${pub[k]}`);
    }
  }
  for (const id of computed.keys()) {
    if (!season.publishedTable.some((r) => r.teamId === id)) problems.push(`${id}: no figura en la tabla publicada`);
  }
  return problems;
}
