import type { Match, Season, TableRow } from "./types";
import { SEASONS } from "./data/seasons";
import { winnerOf } from "./result";

export { SEASONS };

export const getSeason = (slug: string) => SEASONS.find((s) => s.slug === slug);

export const LOADED_YEARS = new Set(SEASONS.filter((s) => s.kind !== "cup").map((s) => s.year));
export const LEAGUE_SEASONS = SEASONS.filter((s) => s.kind !== "cup");
// Copas nacionales; las internacionales van aparte (INTL_SEASONS).
export const CUP_SEASONS = SEASONS.filter((s) => s.kind === "cup" && !s.international);
export const INTL_SEASONS = SEASONS.filter((s) => s.international);

// Nombre para mostrar: "1919" o "1919 · AAm" cuando ese año hubo dos ligas.
export const seasonLabel = (s: Season) => (s.league ? `${s.yearLabel ?? s.year} · ${s.league}` : (s.yearLabel ?? String(s.year)));

// Título de la página: "Temporada 1919 · AAm" para las ligas, "Copa de Honor 1917" para las copas.
export const seasonTitle = (s: Season) => (s.kind === "cup" ? s.title : `Temporada ${seasonLabel(s)}`);

// Nombre de la copa sin el año: "Copa de Honor 1917" → "Copa de Honor".
// "Copa Argentina 2018/19" también es de la serie "Copa Argentina".
export const cupName = (s: Season) => s.title.replace(/\s+\d{4}(\/\d{2})?$/, "");

// Copas agrupadas por competición, en el orden en que aparecen, con sus ediciones de la más vieja a la más nueva.
export const CUP_COMPETITIONS: { name: string; editions: Season[] }[] = [...new Set(CUP_SEASONS.map(cupName))].map(
  (name) => ({ name, editions: CUP_SEASONS.filter((s) => cupName(s) === name).sort((a, b) => a.year - b.year) }),
);

// Copas internacionales agrupadas por competición. La Copa Chevallier Boutell (Tie Cup) incluye sus ediciones
// 1900–1906, que la AFA cuenta como copa nacional y figuran también en /copas.
export const INTL_COMPETITIONS: { name: string; editions: Season[] }[] = [...new Set(INTL_SEASONS.map(cupName))].map((name) => ({
  name,
  editions: SEASONS.filter((s) => s.kind === "cup" && cupName(s) === name).sort((a, b) => a.year - b.year),
}));

// Torneos de liga que dan título: se dejan afuera las liguillas, promociones, reclasificaciones y desempates
// (el campeón del Apertura 2006/07 o 2008/09 ya figura en su torneo).
const NOT_A_TITLE = /(pre-libertadores|prelibertadores|liguilla|desempate|promocion|reclasificacion|octogonal|petit|reducido|promocional|clasificacion)/;
export const LEAGUE_TITLES = LEAGUE_SEASONS.filter((s) => !NOT_A_TITLE.test(s.slug) && (s.championIds.length || s.inProgress));

// Títulos de Primera sin partidos propios: se definen con los partidos de otros torneos.
export const EXTRA_TITLES: { year: number; label: string; championId: string; note: string; href: string }[] = [
  {
    year: 2025,
    label: "Campeón de Liga",
    championId: "central",
    note: "Primero de la tabla anual (Apertura + Clausura). Título creado por la AFA en noviembre de 2025.",
    href: "/temporadas/2025-clausura",
  },
];

// Nombre del torneo en la lista de campeones: "Metropolitano", "Apertura", "Asociación Amateurs"…
export function titleLabel(s: Season): string {
  if (s.kind === "cup") return cupName(s);
  if (s.slug === "1990-91-final") return "Primera División";
  if (/-final$/.test(s.slug)) return "Torneo Final";
  const byLeague: Record<string, string> = {
    AAm: "Asociación Amateurs",
    FAF: "Federación Argentina",
    Amateur: "Liga amateur (AAF)",
    "Final de campeones": "Primera División (final de campeones)",
  };
  if (s.league) return byLeague[s.league] ?? s.league;
  if (s.year >= 1931 && s.year <= 1934) return "Liga Argentina (profesional)";
  if ((s.year >= 1912 && s.year <= 1914) || (s.year >= 1919 && s.year <= 1926)) return "Asociación Argentina";
  if (s.year === 1936) return "Copa Campeonato";
  const named = s.title.match(/^(Superliga|Liga Profesional)/);
  return named ? named[1] : "Primera División";
}

// Anterior y siguiente dentro de la misma serie: las ligas entre sí y cada copa con sus propias ediciones.
export function siblingsOf(season: Season): { prev?: Season; next?: Season } {
  const list =
    season.kind === "cup"
      ? SEASONS.filter((s) => s.kind === "cup" && cupName(s) === cupName(season)).sort((a, b) => a.year - b.year)
      : LEAGUE_SEASONS;
  const i = list.indexOf(season);
  return { prev: list[i - 1], next: list[i + 1] };
}

// Partidos de copa en el orden de la fuente (cronológico; es el único orden posible cuando falta el día).
export const sourceOrder = (a: Match, b: Match) => a.id.localeCompare(b.id);

// Todos los partidos de las temporadas cargadas.
export const SEASON_MATCHES: Match[] = SEASONS.flatMap((s) => s.matches);

// Temporada de cada partido, para enlazarla desde el historial.
export const SEASON_OF_MATCH = new Map<string, Season>(SEASONS.flatMap((s) => s.matches.map((m) => [m.id, s] as const)));

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
    if (m.status === "annulled") continue;
    // En las copas, la tabla resumen suma todos los partidos (grupos, rondas y final).
    const counts = season.kind === "cup" || m.phase === "league" || (season.tableIncludesPlayoffs && m.phase === "playoff");
    if (!counts) continue;
    const home = row(m.homeId);
    const away = row(m.awayId);
    home.played++;
    away.played++;
    if (m.splitAward) {
      // Cada equipo suma el resultado que le computó la liga.
      for (const [r, [gf, ga]] of [
        [home, m.splitAward.home],
        [away, [m.splitAward.away[1], m.splitAward.away[0]]],
      ] as const) {
        r.goalsFor += gf;
        r.goalsAgainst += ga;
        if (gf > ga) {
          r.won++;
          r.points += season.pointsPerWin;
        } else if (gf < ga) r.lost++;
        else {
          r.drawn++;
          r.points++;
        }
      }
      continue;
    }
    if (!m.scoreUnknown && !m.goalsVoid) {
      home.goalsFor += m.homeGoals;
      home.goalsAgainst += m.awayGoals;
      away.goalsFor += m.awayGoals;
      away.goalsAgainst += m.homeGoals;
    }

    if (m.bothLost) {
      home.lost++;
      away.lost++;
      continue;
    }
    const winner = winnerOf(m);
    if (winner === null) {
      home.drawn++;
      away.drawn++;
      if (season.drawShootout && m.advancedId && m.phase === "league") {
        const [sw, sl] = m.advancedId === m.homeId ? [home, away] : [away, home];
        sw.points += season.drawShootout.winner;
        sl.points += season.drawShootout.loser;
      } else {
        home.points++;
        away.points++;
      }
    } else {
      const [w, l] = winner === m.homeId ? [home, away] : [away, home];
      w.won++;
      l.lost++;
      w.points += season.pointsPerWin;
    }
  }

  for (const adj of season.pointAdjustments ?? []) row(adj.teamId).points += adj.points;

  // Orden oficial: el de la tabla publicada (resuelve desempates por partido extra o promedio de gol).
  const official = new Map(season.publishedTable.map((r, i) => [r.teamId, i]));
  return [...rows.values()].sort(
    (a, b) =>
      (official.get(a.teamId) ?? 999) - (official.get(b.teamId) ?? 999) ||
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor,
  );
}

const ROW_KEYS = ["played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "points"] as const;

// Diferencias entre la tabla calculada y la publicada por la fuente. Vacío = verificada.
// Las diferencias ya revisadas (knownTableDiffs) no cuentan como error.
export function verifySeason(season: Season): string[] {
  const known = new Set(season.knownTableDiffs?.keys ?? []);
  return rawTableDiffs(season).filter((p) => !known.has(p.split(" ")[0].replace(/:$/, "") + ":" + p.split(" ")[1]));
}

export function rawTableDiffs(season: Season): string[] {
  // Copas sin tabla resumen publicada: no hay contra qué comparar (se controlan con verifyCup en el importador).
  if (season.kind === "cup" && !season.publishedTable.length) return [];
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
