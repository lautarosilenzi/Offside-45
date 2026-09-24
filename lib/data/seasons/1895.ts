import type { Match, Season } from "../../types";

const LIGA = "Argentine Association Football League";
const ERA_NAMES: Record<string, string> = { alumni: "English High School", quilmes: "Quilmes Rovers" };

let n = 0;
const m = (
  date: string,
  homeId: string,
  homeGoals: number,
  awayGoals: number,
  awayId: string,
  extra: Partial<Match> = {},
): Match => ({
  id: `1895-${String(++n).padStart(2, "0")}`,
  date,
  competition: LIGA,
  phase: "league",
  homeId,
  awayId,
  ...(ERA_NAMES[homeId] && { homeAs: ERA_NAMES[homeId] }),
  ...(ERA_NAMES[awayId] && { awayAs: ERA_NAMES[awayId] }),
  homeGoals,
  awayGoals,
  sources: ["rsssf", "wikipedia-es"],
  ...extra,
});

// Partidos jugados de los que solo se sabe el ganador (o que fue empate).
const unknown = (date: string, homeId: string, awayId: string, winnerId?: string) =>
  m(date, homeId, 0, 0, awayId, {
    scoreUnknown: true,
    winnerId,
    note: "Los diarios de la época no publicaron el resultado; solo se sabe cómo terminó. Los goles no suman en la tabla.",
  });

export const SEASON_1895: Season = {
  year: 1895,
  title: "Campeonato 1895",
  tournament: "Championship Cup de la Argentine Association Football League",
  organizer: "Argentine Association Football League",
  championIds: ["lomas-athletic"],
  summary:
    "Lomas Athletic ganó su tercer título seguido, el primer tricampeonato del fútbol argentino, otra vez sin perder. El subcampeón fue Lomas Academy, el segundo equipo de la misma institución. De siete partidos solo se sabe cómo terminaron, no el resultado.",
  pointsPerWin: 2,
  sources: [
    { label: "RSSSF – Argentina 1895", url: "https://www.rsssf.org/tablesa/arg1895.html" },
    { label: "Wikipedia – Campeonato 1895", url: "https://es.wikipedia.org/wiki/Campeonato_de_Primera_Divisi%C3%B3n_1895_(Argentina)" },
  ],
  notes: [
    { kind: "formato", text: "Todos contra todos a dos ruedas entre 6 equipos, 2 puntos por victoria." },
    { kind: "puntos", text: "Primer tricampeonato del fútbol argentino: Lomas Athletic (1893, 1894 y 1895), invicto en los tres." },
    { kind: "walkover", text: "English High School no se presentó ante Lomas Athletic el 30 de agosto y los puntos fueron para Lomas." },
    {
      kind: "dato",
      text: "Se desconoce el resultado de siete partidos (5 con ganador conocido y 2 empates). Por eso los goles a favor y en contra de cinco equipos son provisorios, también en la fuente.",
    },
    {
      kind: "identidad",
      text: "Lomas Academy era el segundo equipo del Lomas Athletic Club y jugó en Primera como un equipo aparte. \"Quilmes Rovers\" era el nombre de Quilmes ese año (mismos colores, cancha y dirigentes, según la historia del club). \"English High School\" es el antecesor de Alumni.",
    },
    {
      kind: "fuentes",
      text: "RSSSF y Wikipedia coinciden en todos los resultados. El Quilmes 3-1 Flores figura en RSSSF con fecha desconocida (entre el 29/6 y el 30/8); Wikipedia lo ubica el 30/8.",
    },
  ],
  publishedTable: [
    { teamId: "lomas-athletic", played: 10, won: 8, drawn: 2, lost: 0, goalsFor: 29, goalsAgainst: 8, points: 18 },
    { teamId: "lomas-academy", played: 10, won: 6, drawn: 1, lost: 3, goalsFor: 20, goalsAgainst: 11, points: 13 },
    { teamId: "flores-athletic", played: 10, won: 6, drawn: 0, lost: 4, goalsFor: 22, goalsAgainst: 15, points: 12 },
    { teamId: "alumni", played: 10, won: 3, drawn: 1, lost: 6, goalsFor: 12, goalsAgainst: 15, points: 7 },
    { teamId: "retiro-athletic", played: 10, won: 2, drawn: 1, lost: 7, goalsFor: 6, goalsAgainst: 18, points: 5 },
    { teamId: "quilmes", played: 10, won: 2, drawn: 1, lost: 7, goalsFor: 10, goalsAgainst: 32, points: 5 },
  ],
  matches: [
    m("1895-05-10", "quilmes", 1, 3, "alumni"),
    m("1895-05-19", "retiro-athletic", 1, 1, "lomas-athletic"),
    m("1895-05-23", "flores-athletic", 4, 0, "quilmes"),
    m("1895-05-23", "lomas-athletic", 8, 1, "alumni"),
    m("1895-05-25", "lomas-athletic", 2, 1, "lomas-academy"),
    unknown("1895-05-25", "retiro-athletic", "alumni", "retiro-athletic"),
    m("1895-05-26", "flores-athletic", 0, 2, "lomas-athletic"),
    m("1895-06-02", "retiro-athletic", 0, 3, "flores-athletic"),
    unknown("1895-06-08", "lomas-academy", "alumni", "lomas-academy"),
    m("1895-06-13", "flores-athletic", 3, 0, "alumni"),
    m("1895-06-13", "lomas-athletic", 4, 0, "quilmes"),
    unknown("1895-06-15", "alumni", "retiro-athletic", "alumni"),
    m("1895-06-15", "quilmes", 1, 9, "lomas-academy"),
    m("1895-06-24", "lomas-academy", 0, 3, "flores-athletic"),
    m("1895-06-24", "quilmes", 0, 3, "retiro-athletic"),
    m("1895-06-29", "alumni", 8, 0, "quilmes"),
    m("1895-07-09", "lomas-academy", 2, 5, "lomas-athletic", {
      venue: "Cancha de Lomas Athletic",
      note: "Clásico interno del Lomas Athletic Club: su primer equipo contra el segundo.",
    }),
    unknown("1895-07-13", "retiro-athletic", "lomas-academy", "lomas-academy"),
    m("1895-07-14", "lomas-academy", 3, 0, "retiro-athletic"),
    unknown("1895-07-20", "alumni", "lomas-academy"),
    m("1895-07-21", "lomas-athletic", 4, 2, "flores-athletic"),
    unknown("1895-07-27", "quilmes", "lomas-athletic"),
    m("1895-08-04", "flores-athletic", 3, 1, "retiro-athletic"),
    m("1895-08-15", "alumni", 0, 3, "flores-athletic"),
    unknown("1895-08-15", "lomas-academy", "quilmes", "lomas-academy"),
    m("1895-08-25", "lomas-athletic", 3, 1, "retiro-athletic"),
    m("1895-08-30", "quilmes", 3, 1, "flores-athletic", {
      note: "Fecha aproximada: RSSSF no la conoce (dice que fue entre el 29/6 y el 30/8); Wikipedia lo ubica el 30/8.",
    }),
    m("1895-08-30", "alumni", 0, 0, "lomas-athletic", {
      walkover: true,
      awardedTo: "lomas-athletic",
      note: "No se jugó: English High School no se presentó.",
    }),
    m("1895-08-30", "flores-athletic", 0, 5, "lomas-academy"),
    m("1895-08-30", "retiro-athletic", 0, 5, "quilmes"),
  ],
};
