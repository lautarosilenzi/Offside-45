import type { HeadToHeadStats, Match } from "./types";

// Datos de ejemplo hardcodeados. Más adelante se reemplazan por una tabla en Supabase.
export const MATCHES: Match[] = [
  // River vs Boca
  { id: "rb-1", date: "2018-11-11", competition: "Copa Libertadores", stage: "Final (ida)", venue: "La Bombonera", homeId: "boca", awayId: "river", homeGoals: 2, awayGoals: 2 },
  { id: "rb-2", date: "2018-12-09", competition: "Copa Libertadores", stage: "Final (vuelta)", venue: "Santiago Bernabéu", homeId: "river", awayId: "boca", homeGoals: 3, awayGoals: 1, note: "Tiempo suplementario" },
  { id: "rb-3", date: "2019-10-01", competition: "Copa Libertadores", stage: "Semifinal (ida)", venue: "Monumental", homeId: "river", awayId: "boca", homeGoals: 2, awayGoals: 0 },
  { id: "rb-4", date: "2019-10-22", competition: "Copa Libertadores", stage: "Semifinal (vuelta)", venue: "La Bombonera", homeId: "boca", awayId: "river", homeGoals: 1, awayGoals: 0 },
  { id: "rb-5", date: "2022-03-20", competition: "Copa de la Liga", venue: "Monumental", homeId: "river", awayId: "boca", homeGoals: 0, awayGoals: 1 },
  { id: "rb-6", date: "2023-09-24", competition: "Copa de la Liga", venue: "La Bombonera", homeId: "boca", awayId: "river", homeGoals: 0, awayGoals: 2 },
  { id: "rb-7", date: "2024-04-21", competition: "Copa de la Liga", stage: "Cuartos de final", venue: "Mario A. Kempes", homeId: "river", awayId: "boca", homeGoals: 2, awayGoals: 3 },

  // Racing vs Independiente
  { id: "ri-1", date: "2019-03-10", competition: "Superliga", venue: "Libertadores de América", homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 2 },
  { id: "ri-2", date: "2021-09-12", competition: "Liga Profesional", venue: "Cilindro de Avellaneda", homeId: "racing", awayId: "independiente", homeGoals: 1, awayGoals: 1 },
  { id: "ri-3", date: "2022-08-28", competition: "Liga Profesional", venue: "Libertadores de América", homeId: "independiente", awayId: "racing", homeGoals: 1, awayGoals: 0 },
  { id: "ri-4", date: "2023-04-16", competition: "Liga Profesional", venue: "Cilindro de Avellaneda", homeId: "racing", awayId: "independiente", homeGoals: 2, awayGoals: 1 },
  { id: "ri-5", date: "2024-02-25", competition: "Copa de la Liga", venue: "Libertadores de América", homeId: "independiente", awayId: "racing", homeGoals: 0, awayGoals: 0 },
  { id: "ri-6", date: "2024-09-15", competition: "Liga Profesional", venue: "Cilindro de Avellaneda", homeId: "racing", awayId: "independiente", homeGoals: 3, awayGoals: 1 },

  // San Lorenzo vs Huracán
  { id: "sh-1", date: "2019-04-07", competition: "Superliga", venue: "Nuevo Gasómetro", homeId: "sanlorenzo", awayId: "huracan", homeGoals: 1, awayGoals: 0 },
  { id: "sh-2", date: "2021-10-17", competition: "Liga Profesional", venue: "Tomás A. Ducó", homeId: "huracan", awayId: "sanlorenzo", homeGoals: 1, awayGoals: 1 },
  { id: "sh-3", date: "2022-09-04", competition: "Liga Profesional", venue: "Nuevo Gasómetro", homeId: "sanlorenzo", awayId: "huracan", homeGoals: 0, awayGoals: 2 },
  { id: "sh-4", date: "2023-03-19", competition: "Liga Profesional", venue: "Tomás A. Ducó", homeId: "huracan", awayId: "sanlorenzo", homeGoals: 0, awayGoals: 0 },
  { id: "sh-5", date: "2024-03-03", competition: "Copa de la Liga", venue: "Nuevo Gasómetro", homeId: "sanlorenzo", awayId: "huracan", homeGoals: 2, awayGoals: 1 },
  { id: "sh-6", date: "2024-10-20", competition: "Liga Profesional", venue: "Tomás A. Ducó", homeId: "huracan", awayId: "sanlorenzo", homeGoals: 1, awayGoals: 0 },
];

export function getHeadToHead(a: string, b: string): Match[] {
  return MATCHES.filter(
    (m) => (m.homeId === a && m.awayId === b) || (m.homeId === b && m.awayId === a),
  ).sort((x, y) => y.date.localeCompare(x.date));
}

export function computeStats(matches: Match[], a: string): HeadToHeadStats {
  const stats: HeadToHeadStats = { played: matches.length, winsA: 0, winsB: 0, draws: 0, goalsA: 0, goalsB: 0 };
  for (const m of matches) {
    const aIsHome = m.homeId === a;
    const ga = aIsHome ? m.homeGoals : m.awayGoals;
    const gb = aIsHome ? m.awayGoals : m.homeGoals;
    stats.goalsA += ga;
    stats.goalsB += gb;
    if (ga > gb) stats.winsA++;
    else if (gb > ga) stats.winsB++;
    else stats.draws++;
  }
  return stats;
}
