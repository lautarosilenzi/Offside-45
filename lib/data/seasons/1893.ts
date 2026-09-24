import type { Match, Season } from "../../types";

const LIGA = "Argentine Association Football League";
const EHS = "English High School";
const QUILMES = "Quilmes Rowers";

let n = 0;
const m = (
  date: string,
  homeId: string,
  homeGoals: number,
  awayGoals: number,
  awayId: string,
  extra: Partial<Match> = {},
): Match => ({
  id: `1893-${String(++n).padStart(2, "0")}`,
  date,
  competition: LIGA,
  phase: "league",
  homeId,
  awayId,
  // Nombres de época para los clubes que después cambiaron de nombre.
  ...(homeId === "alumni" && { homeAs: EHS }),
  ...(awayId === "alumni" && { awayAs: EHS }),
  ...(homeId === "quilmes" && { homeAs: QUILMES }),
  ...(awayId === "quilmes" && { awayAs: QUILMES }),
  homeGoals,
  awayGoals,
  sources: ["rsssf", "wikipedia-es"],
  ...extra,
});

export const SEASON_1893: Season = {
  slug: "1893",
  year: 1893,
  title: "Campeonato 1893",
  tournament: "Championship Cup de la Argentine Association Football League",
  organizer: "Argentine Association Football League (fundada en 1893 por Alexander Watson Hutton, antecesora de la AFA)",
  championIds: ["lomas-athletic"],
  summary:
    "Primer torneo de la nueva Argentine Association Football League, la liga de la que desciende la AFA. Lomas Athletic fue campeón invicto: 7 victorias y un empate, con 26 goles a favor y apenas 2 en contra. Estaba previsto a tres ruedas, pero la tercera se suspendió a mitad de camino y la tabla quedó con las dos primeras.",
  pointsPerWin: 2,
  sources: [
    { label: "RSSSF – Argentina 1893", url: "https://www.rsssf.org/tablesa/arg1893.html" },
    { label: "Wikipedia – Campeonato 1893", url: "https://es.wikipedia.org/wiki/Campeonato_de_Primera_Divisi%C3%B3n_1893_(Argentina)" },
  ],
  notes: [
    { kind: "formato", text: "Estaba previsto a tres ruedas entre 5 equipos. El 25 de agosto la liga suprimió la tercera rueda y la tabla final quedó con las dos primeras (8 partidos por equipo)." },
    { kind: "anulado", text: "Por la supresión de la tercera rueda se anuló el Flores Athletic 0-1 Lomas Athletic del 16 de julio, que ya se había jugado. También quedó sin efecto el Quilmes–Flores del 20 de agosto, al que Quilmes no se presentó." },
    { kind: "walkover", text: "English High School no se presentó ante Quilmes (fecha del 30 de julio) y la liga le dio los puntos a Quilmes el 25 de agosto." },
    { kind: "retiro", text: "Según RSSSF, English High School se retiró después de su séptimo partido y BA & Rosario Railway después del octavo." },
    { kind: "descalificacion", text: "Según Wikipedia, al terminar el torneo Quilmes y English High School fueron desafiliados y BA & Rosario Railway se retiró. Ninguno de los tres jugó en 1894." },
    { kind: "identidad", text: "\"English High School\" era el equipo del colegio de Alexander Watson Hutton, del que nació Alumni. \"Quilmes Rowers\" figura en Wikipedia como antecesor del actual Quilmes Atlético Club (RSSSF lo llama \"Quilmes Club\")." },
    { kind: "fuentes", text: "Las dos fuentes coinciden en todos los resultados. Wikipedia da otras fechas para tres partidos (ver cada partido); se usan las de RSSSF." },
  ],
  publishedTable: [
    { teamId: "lomas-athletic", played: 8, won: 7, drawn: 1, lost: 0, goalsFor: 26, goalsAgainst: 2, points: 15 },
    { teamId: "flores-athletic", played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 19, goalsAgainst: 10, points: 10 },
    { teamId: "quilmes", played: 8, won: 3, drawn: 3, lost: 2, goalsFor: 12, goalsAgainst: 11, points: 9 },
    { teamId: "alumni", played: 8, won: 1, drawn: 2, lost: 5, goalsFor: 6, goalsAgainst: 25, points: 4 },
    { teamId: "ba-rosario-railway", played: 8, won: 0, drawn: 2, lost: 6, goalsFor: 4, goalsAgainst: 19, points: 2 },
  ],
  matches: [
    m("1893-04-23", "flores-athletic", 2, 4, "quilmes"),
    m("1893-04-23", "lomas-athletic", 3, 0, "ba-rosario-railway"),
    m("1893-04-29", "alumni", 2, 0, "ba-rosario-railway"),
    m("1893-05-07", "quilmes", 2, 0, "ba-rosario-railway", { note: "Wikipedia lo fecha el 3/5." }),
    m("1893-05-11", "alumni", 0, 5, "lomas-athletic"),
    m("1893-05-14", "ba-rosario-railway", 1, 2, "flores-athletic"),
    m("1893-05-21", "lomas-athletic", 2, 2, "quilmes"),
    m("1893-05-23", "alumni", 2, 5, "flores-athletic", { note: "Wikipedia lo fecha el 24/5." }),
    m("1893-05-28", "lomas-athletic", 1, 0, "flores-athletic"),
    m("1893-06-01", "alumni", 2, 2, "quilmes"),
    m("1893-06-11", "flores-athletic", 0, 1, "lomas-athletic"),
    m("1893-06-18", "ba-rosario-railway", 0, 2, "lomas-athletic"),
    m("1893-06-18", "quilmes", 0, 2, "flores-athletic"),
    m("1893-06-24", "flores-athletic", 2, 0, "alumni", { note: "Wikipedia lo fecha el 25/5." }),
    m("1893-06-29", "lomas-athletic", 11, 0, "alumni", {
      venue: "Cancha de English High School",
      note: "La mayor goleada del torneo. Lomas fue local en la cancha de English High School.",
    }),
    m("1893-07-02", "ba-rosario-railway", 2, 2, "quilmes", {
      note: "Una de las fuentes citadas por RSSSF lo registra como derrota por no presentación de BA & Rosario Railway; RSSSF y Wikipedia dan el 2-2.",
    }),
    m("1893-07-15", "ba-rosario-railway", 0, 0, "alumni"),
    m("1893-07-16", "flores-athletic", 0, 1, "lomas-athletic", {
      status: "annulled",
      stage: "Tercera rueda",
      note: "Anulado el 25/8, cuando la liga suprimió la tercera rueda. No suma. Wikipedia y las notas de RSSSF dan 0-1; el listado de RSSSF dice 1-2.",
    }),
    m("1893-07-23", "quilmes", 0, 1, "lomas-athletic"),
    m("1893-07-30", "flores-athletic", 6, 1, "ba-rosario-railway"),
    m("1893-07-30", "quilmes", 0, 0, "alumni", {
      walkover: true,
      awardedTo: "quilmes",
      note: "No se jugó: English High School no se presentó. La liga le dio los puntos a Quilmes el 25/8.",
      sources: ["rsssf", "wikipedia-es"],
    }),
  ],
};
