import type { Match, Season } from "../../types";

const LIGA = "Argentine Association Football League";
const RSSSF_WIKI: Match["sources"] = ["rsssf", "wikipedia-es"];

const FLORES = "Old Ground Flores (Caballito)";
const SOLA = "Solá Works Ground (Barracas)";
const HIGHFIELD = "Highfield (Belgrano)";
const MONTES_DE_OCA = "Montes de Oca 1336 (Barracas)";
const CAMPANA = "North of the Workshops (Campana)";

let n = 0;
const m = (
  date: string,
  homeId: string,
  homeGoals: number,
  awayGoals: number,
  awayId: string,
  venue: string,
  extra: Partial<Match> = {},
): Match => ({
  id: `1891-${String(++n).padStart(2, "0")}`,
  date,
  competition: LIGA,
  phase: "league",
  venue,
  homeId,
  awayId,
  homeGoals,
  awayGoals,
  sources: RSSSF_WIKI,
  ...extra,
});

export const SEASON_1891: Season = {
  year: 1891,
  title: "Campeonato 1891",
  tournament: "Campeonato de la Argentine Association Football League",
  organizer: "Argentine Association Football League (1891)",
  championIds: ["saint-andrews", "caledonians"],
  summary:
    "Primer campeonato de fútbol de la Argentina (y de Sudamérica), organizado por la primera Argentine Association Football League. Saint Andrew's y Caledonians terminaron igualados en puntos y los dos fueron declarados campeones; después jugaron un desempate por las medallas que ganó Saint Andrew's.",
  pointsPerWin: 2,
  sources: [
    { label: "RSSSF – Argentina 1891", url: "https://www.rsssf.org/tablesa/arg1891.html" },
    { label: "Wikipedia – Campeonato 1891", url: "https://es.wikipedia.org/wiki/Campeonato_de_Primera_Divisi%C3%B3n_1891_(Argentina)" },
  ],
  notes: [
    { kind: "formato", text: "Todos contra todos a dos ruedas, 5 equipos, 2 puntos por victoria." },
    { kind: "puntos", text: "Saint Andrew's y Caledonians empataron en 13 puntos y los dos fueron declarados campeones. El desempate del 13/9 fue solo por las medallas." },
    { kind: "retiro", text: "Hurlingham FC se inscribió pero se retiró antes de jugar." },
    { kind: "identidad", text: "Belgrano FC (1891) no tiene relación con el Belgrano Athletic ni con el Belgrano de Córdoba." },
    {
      kind: "fuentes",
      text: "Wikipedia da Saint Andrew's 7-0 Belgrano FC, pero con ese resultado Saint Andrew's tendría 25 goles a favor y ambas fuentes publican 23; el resultado correcto es 5-0. Wikipedia también da otras fechas para tres partidos (ver cada partido); se usan las de RSSSF, que cita a los diarios The Standard y Buenos Aires Herald.",
    },
  ],
  withdrawn: ["hurlingham"],
  publishedTable: [
    { teamId: "caledonians", played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 32, goalsAgainst: 11, points: 13 },
    { teamId: "saint-andrews", played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 23, goalsAgainst: 12, points: 13 },
    { teamId: "ba-rosario-railway", played: 8, won: 2, drawn: 2, lost: 4, goalsFor: 19, goalsAgainst: 24, points: 6 },
    { teamId: "buenos-aires-fc", played: 8, won: 2, drawn: 1, lost: 5, goalsFor: 18, goalsAgainst: 22, points: 5 },
    { teamId: "belgrano-fc", played: 8, won: 1, drawn: 1, lost: 6, goalsFor: 10, goalsAgainst: 33, points: 3 },
  ],
  matches: [
    m("1891-04-12", "buenos-aires-fc", 2, 5, "saint-andrews", FLORES, { note: "Primera fecha del primer campeonato." }),
    m("1891-04-12", "caledonians", 6, 0, "belgrano-fc", SOLA),
    m("1891-04-19", "belgrano-fc", 2, 1, "buenos-aires-fc", HIGHFIELD, { note: "RSSSF: el resultado no figura en los diarios y se deduce de la tabla final." }),
    m("1891-04-26", "belgrano-fc", 1, 2, "saint-andrews", HIGHFIELD),
    m("1891-05-03", "saint-andrews", 3, 2, "ba-rosario-railway", MONTES_DE_OCA),
    m("1891-05-17", "caledonians", 0, 4, "saint-andrews", SOLA),
    m("1891-05-28", "buenos-aires-fc", 2, 2, "ba-rosario-railway", FLORES),
    m("1891-05-31", "buenos-aires-fc", 2, 6, "caledonians", FLORES),
    m("1891-06-07", "caledonians", 4, 1, "ba-rosario-railway", SOLA),
    m("1891-06-21", "ba-rosario-railway", 4, 0, "saint-andrews", CAMPANA),
    m("1891-07-05", "saint-andrews", 1, 0, "buenos-aires-fc", MONTES_DE_OCA, {
      note: "Buenos Aires FC reclamó por irregularidades y el Consejo revisó el partido; el resultado quedó firme. Wikipedia lo fecha el 23/8.",
    }),
    m("1891-07-12", "saint-andrews", 5, 0, "belgrano-fc", MONTES_DE_OCA, {
      note: "Wikipedia da 7-0, pero no cierra con la tabla que publican ambas fuentes.",
      sources: ["rsssf"],
    }),
    m("1891-07-19", "belgrano-fc", 2, 3, "ba-rosario-railway", HIGHFIELD),
    m("1891-07-19", "caledonians", 2, 1, "buenos-aires-fc", SOLA),
    m("1891-07-26", "ba-rosario-railway", 0, 4, "caledonians", CAMPANA),
    m("1891-08-02", "belgrano-fc", 0, 7, "caledonians", HIGHFIELD, { note: "RSSSF: el resultado no figura en los diarios y se deduce de la tabla final." }),
    m("1891-08-02", "ba-rosario-railway", 3, 5, "buenos-aires-fc", "Cancha del Ferrocarril Buenos Aires a Rosario (San Martín)", {
      note: "Wikipedia lo fecha el 16/8.",
    }),
    m("1891-08-23", "ba-rosario-railway", 4, 4, "belgrano-fc", CAMPANA),
    m("1891-08-30", "saint-andrews", 3, 3, "caledonians", SOLA, {
      note: "Con este empate ambos quedaron campeones. El Buenos Aires Herald publicó 1-1, pero The Standard da los goleadores del 3-3 (Caldwell 2 y Moffatt; White, Sutherland y Riggs).",
    }),
    m("1891-09-06", "buenos-aires-fc", 5, 1, "belgrano-fc", FLORES, { note: "Wikipedia lo fecha el 3/9 (jueves); RSSSF, el domingo 6/9." }),
    m("1891-09-13", "saint-andrews", 3, 1, "caledonians", FLORES, {
      phase: "playoff",
      stage: "Desempate por las medallas",
      note: "Con alargue. Tres goles de Moffatt; descontó Wilson. No cambia el título compartido.",
      sources: ["rsssf"],
    }),
  ],
};
