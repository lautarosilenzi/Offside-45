import type { Match, Season } from "../../types";

const LIGA = "Argentine Association Football League";

let n = 0;
const m = (
  date: string,
  homeId: string,
  homeGoals: number,
  awayGoals: number,
  awayId: string,
  extra: Partial<Match> = {},
): Match => ({
  id: `1894-${String(++n).padStart(2, "0")}`,
  date,
  competition: LIGA,
  phase: "league",
  homeId,
  awayId,
  homeGoals,
  awayGoals,
  sources: ["rsssf", "wikipedia-es"],
  ...extra,
});

// Partidos jugados de los que solo se sabe el ganador.
const unknown = (date: string, homeId: string, awayId: string, winnerId: string) =>
  m(date, homeId, 0, 0, awayId, {
    scoreUnknown: true,
    winnerId,
    note: "Los diarios de la época no publicaron el resultado; solo se sabe quién ganó. Los goles no suman en la tabla.",
    sources: ["rsssf"],
  });

const EN_LOMAS = { venue: "Cancha de Lomas Athletic", note: "Saint Andrew's fue local en la cancha de Lomas Athletic." };

export const SEASON_1894: Season = {
  slug: "1894",
  year: 1894,
  title: "Campeonato 1894",
  tournament: "Championship Cup de la Argentine Association Football League",
  organizer: "Argentine Association Football League",
  championIds: ["lomas-athletic"],
  summary:
    "Lomas Athletic volvió a salir campeón invicto y fue el primer club en defender un título en la Argentina. El subcampeón fue el debutante Rosario Athletic, el primer equipo del interior en jugar el campeonato. De tres partidos solo se conoce el ganador.",
  pointsPerWin: 2,
  sources: [
    { label: "RSSSF – Argentina 1894", url: "https://www.rsssf.org/tablesa/arg1894.html" },
    { label: "Wikipedia – Campeonato 1894", url: "https://es.wikipedia.org/wiki/Campeonato_de_Primera_Divisi%C3%B3n_1894_(Argentina)" },
  ],
  notes: [
    { kind: "formato", text: "Todos contra todos a dos ruedas entre 6 equipos (7 inscriptos), 2 puntos por victoria." },
    {
      kind: "retiro",
      text: "Buenos Aires & Rosario Railway se retiró una vez empezado el torneo y la liga anuló todos sus partidos. Solo uno se había jugado como oficial (1-2 contra Saint Andrew's); otros dos se jugaron como amistosos y el resto no se jugó.",
    },
    { kind: "walkover", text: "Flores Athletic no se presentó ante Lobos el 8 de septiembre y los puntos fueron para Lobos." },
    {
      kind: "dato",
      text: "Se desconoce el resultado de tres partidos: Retiro–Lomas, Rosario–Retiro y Rosario–Saint Andrew's. Solo se sabe quién ganó. Por eso los goles a favor y en contra de esos equipos son provisorios, también en la fuente.",
    },
    {
      kind: "identidad",
      text: "Rosario Athletic es el actual Club Atlético del Rosario, que dejó el fútbol y hoy juega al rugby. Lobos, Retiro Athletic y Saint Andrew's ya no participan en el fútbol de AFA.",
    },
    { kind: "fuentes", text: "RSSSF y Wikipedia coinciden en los 26 resultados conocidos y en todas las fechas." },
  ],
  withdrawn: ["ba-rosario-railway"],
  publishedTable: [
    { teamId: "lomas-athletic", played: 10, won: 8, drawn: 2, lost: 0, goalsFor: 38, goalsAgainst: 4, points: 18 },
    { teamId: "rosario-athletic", played: 10, won: 7, drawn: 2, lost: 1, goalsFor: 21, goalsAgainst: 8, points: 16 },
    { teamId: "flores-athletic", played: 10, won: 5, drawn: 0, lost: 5, goalsFor: 27, goalsAgainst: 21, points: 10 },
    { teamId: "lobos-athletic", played: 10, won: 4, drawn: 1, lost: 5, goalsFor: 14, goalsAgainst: 22, points: 9 },
    { teamId: "saint-andrews", played: 10, won: 3, drawn: 0, lost: 7, goalsFor: 11, goalsAgainst: 24, points: 6 },
    { teamId: "retiro-athletic", played: 10, won: 0, drawn: 1, lost: 9, goalsFor: 1, goalsAgainst: 33, points: 1 },
  ],
  matches: [
    m("1894-04-15", "lobos-athletic", 3, 0, "retiro-athletic"),
    m("1894-04-22", "retiro-athletic", 0, 8, "flores-athletic"),
    m("1894-04-22", "rosario-athletic", 5, 0, "lobos-athletic"),
    m("1894-04-29", "saint-andrews", 4, 0, "retiro-athletic"),
    m("1894-05-03", "flores-athletic", 3, 2, "saint-andrews"),
    unknown("1894-05-06", "retiro-athletic", "lomas-athletic", "lomas-athletic"),
    m("1894-05-13", "ba-rosario-railway", 1, 2, "saint-andrews", {
      status: "annulled",
      note: "Anulado cuando BA & Rosario Railway se retiró del torneo. No suma.",
    }),
    m("1894-05-13", "lomas-athletic", 6, 0, "lobos-athletic"),
    m("1894-05-20", "lomas-athletic", 6, 0, "flores-athletic"),
    m("1894-05-24", "flores-athletic", 3, 1, "rosario-athletic"),
    m("1894-05-24", "lobos-athletic", 2, 0, "saint-andrews"),
    m("1894-05-25", "saint-andrews", 0, 2, "rosario-athletic", EN_LOMAS),
    m("1894-06-03", "rosario-athletic", 1, 1, "lomas-athletic"),
    m("1894-06-10", "flores-athletic", 6, 0, "lobos-athletic"),
    m("1894-06-10", "retiro-athletic", 0, 1, "saint-andrews"),
    unknown("1894-06-29", "rosario-athletic", "retiro-athletic", "rosario-athletic"),
    m("1894-07-01", "flores-athletic", 4, 0, "retiro-athletic"),
    m("1894-07-08", "lomas-athletic", 2, 2, "rosario-athletic"),
    m("1894-07-09", "lobos-athletic", 1, 2, "rosario-athletic"),
    m("1894-07-15", "lomas-athletic", 7, 0, "retiro-athletic"),
    unknown("1894-07-22", "rosario-athletic", "saint-andrews", "rosario-athletic"),
    m("1894-07-29", "lobos-athletic", 0, 2, "lomas-athletic"),
    m("1894-08-05", "lomas-athletic", 6, 1, "saint-andrews"),
    m("1894-08-05", "retiro-athletic", 1, 1, "lobos-athletic"),
    m("1894-08-15", "saint-andrews", 3, 2, "flores-athletic", EN_LOMAS),
    m("1894-08-19", "flores-athletic", 0, 6, "lomas-athletic"),
    m("1894-08-29", "rosario-athletic", 3, 1, "flores-athletic"),
    m("1894-08-29", "saint-andrews", 0, 7, "lobos-athletic"),
    m("1894-09-08", "lobos-athletic", 0, 0, "flores-athletic", {
      walkover: true,
      awardedTo: "lobos-athletic",
      note: "No se jugó: Flores Athletic no se presentó.",
      sources: ["rsssf"],
    }),
    m("1894-09-08", "saint-andrews", 0, 2, "lomas-athletic"),
    m("1894-09-09", "retiro-athletic", 0, 5, "rosario-athletic"),
  ],
};
