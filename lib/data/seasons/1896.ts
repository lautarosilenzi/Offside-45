import type { Match, Season } from "../../types";

const LIGA = "Argentine Association Football League";

let n = 0;
const m = (
  date: string,
  round: number,
  homeId: string,
  homeGoals: number,
  awayGoals: number,
  awayId: string,
  extra: Partial<Match> = {},
): Match => ({
  id: `1896-${String(++n).padStart(2, "0")}`,
  date,
  competition: LIGA,
  stage: `Fecha ${round}`,
  phase: "league",
  homeId,
  awayId,
  homeGoals,
  awayGoals,
  sources: ["rsssf", "wikipedia-es"],
  ...extra,
});

export const SEASON_1896: Season = {
  year: 1896,
  title: "Campeonato 1896",
  tournament: "Championship Cup de la Argentine Association Football League",
  organizer: "Argentine Association Football League",
  championIds: ["lomas-academy"],
  summary:
    "Campeón Lomas Academy, el segundo equipo del Lomas Athletic Club: es la única vez que un equipo alternativo ganó el campeonato argentino. Le cortó la racha de tres títulos a su propio primer equipo, aunque se lo cuenta como el cuarto título seguido de la institución. Aseguró el campeonato en la fecha 11.",
  pointsPerWin: 2,
  sources: [
    { label: "RSSSF – Argentina 1896", url: "https://www.rsssf.org/tablesa/arg1896.html" },
    { label: "Wikipedia – Campeonato 1896", url: "https://es.wikipedia.org/wiki/Campeonato_de_Primera_Divisi%C3%B3n_1896_(Argentina)" },
  ],
  notes: [
    { kind: "formato", text: "Todos contra todos a dos ruedas entre 5 equipos, 2 puntos por victoria." },
    {
      kind: "puntos",
      text: "Lomas Academy es el único equipo alternativo (segundo equipo de un club) que salió campeón. Se lo cuenta como el cuarto título consecutivo del Lomas Athletic Club (1893–1896).",
    },
    {
      kind: "identidad",
      text: "Belgrano Athletic es el ex Saint Lawrence AC, que cambió de nombre el 30 de abril de 1896. El 17 de agosto, ya terminado el torneo, se fusionó con Buenos Aires & Rosario Railway y formó un nuevo Belgrano Athletic Club.",
    },
    { kind: "descalificacion", text: "Según Wikipedia, al terminar el torneo Retiro Athletic fue desafiliado y Lomas Academy se disolvió." },
    {
      kind: "fuentes",
      text: "RSSSF y Wikipedia coinciden en los 20 resultados y en las fechas. Belgrano–Lomas Athletic figura 1-1 en una de las fuentes de RSSSF; el Buenos Aires Herald dio 2-2 con goleadores, y es el resultado que cierra con la tabla.",
    },
  ],
  publishedTable: [
    { teamId: "lomas-academy", played: 8, won: 6, drawn: 0, lost: 2, goalsFor: 18, goalsAgainst: 10, points: 12 },
    { teamId: "flores-athletic", played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 17, goalsAgainst: 8, points: 10 },
    { teamId: "lomas-athletic", played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 16, goalsAgainst: 11, points: 9 },
    { teamId: "belgrano-athletic", played: 8, won: 3, drawn: 2, lost: 3, goalsFor: 10, goalsAgainst: 15, points: 8 },
    { teamId: "retiro-athletic", played: 8, won: 0, drawn: 1, lost: 7, goalsFor: 6, goalsAgainst: 23, points: 1 },
  ],
  matches: [
    m("1896-05-10", 1, "flores-athletic", 4, 2, "retiro-athletic"),
    m("1896-05-10", 1, "lomas-athletic", 3, 0, "belgrano-athletic"),
    m("1896-05-17", 2, "belgrano-athletic", 2, 2, "retiro-athletic"),
    m("1896-05-25", 3, "lomas-academy", 1, 0, "lomas-athletic", { note: "Primer equipo contra segundo equipo del mismo club." }),
    m("1896-05-25", 3, "flores-athletic", 0, 1, "belgrano-athletic"),
    m("1896-05-31", 4, "retiro-athletic", 1, 5, "lomas-athletic"),
    m("1896-06-04", 5, "flores-athletic", 4, 1, "lomas-academy"),
    m("1896-06-13", 6, "retiro-athletic", 1, 2, "lomas-academy"),
    m("1896-06-21", 7, "flores-athletic", 4, 0, "lomas-athletic"),
    m("1896-06-24", 8, "lomas-academy", 6, 1, "belgrano-athletic"),
    m("1896-06-29", 9, "retiro-athletic", 0, 1, "flores-athletic"),
    m("1896-06-29", 9, "lomas-athletic", 0, 2, "lomas-academy"),
    m("1896-07-05", 16, "lomas-athletic", 2, 1, "flores-athletic", { note: "Partido de la fecha 16 adelantado." }),
    m("1896-07-09", 10, "lomas-academy", 2, 1, "flores-athletic", { venue: "Cancha de Lomas Athletic" }),
    m("1896-07-11", 11, "lomas-academy", 4, 0, "retiro-athletic", { note: "Con este triunfo Lomas Academy aseguró el campeonato." }),
    m("1896-07-13", 12, "belgrano-athletic", 2, 2, "lomas-athletic", {
      venue: "Belgrano Polo Ground",
      note: "Goles: D. Gibson (en contra) y H. Rugeroni; C. Comber y otro no identificado. Una de las fuentes de RSSSF lo da 1-1. RSSSF duda si fue el 12 o el 13/7; Wikipedia dice el 13.",
    }),
    m("1896-07-26", 13, "belgrano-athletic", 0, 2, "flores-athletic"),
    m("1896-08-02", 14, "retiro-athletic", 0, 1, "belgrano-athletic"),
    m("1896-08-09", 13, "lomas-athletic", 4, 0, "retiro-athletic", { note: "Partido de la fecha 13 postergado." }),
    m("1896-08-15", 15, "belgrano-athletic", 3, 0, "lomas-academy"),
  ],
};
