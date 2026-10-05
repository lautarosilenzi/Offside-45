// Messi vs Cristiano Ronaldo. Datos al 29 de septiembre de 2026, cruzados entre fuentes que coinciden:
// - Wikipedia en inglés, "Messi–Ronaldo rivalry": tablas por temporada (clubes, act. 27/9/2026), por año (selecciones,
//   act. 24/9/2026) y el cara a cara partido por partido.
// - Wikipedia, "List of international goals scored by …": partidos y goles por competición y por torneo.
// - messivsronaldo.app (act. 28/9/2026): asistencias, tipos de gol, títulos, premios individuales y juveniles.
// - michelacosta.com/messi-vs-cristiano (act. 29/9/2026): asistencias por club, finales y títulos disputados.
// Las sumas de las tablas por temporada y por año dan exactamente los totales de las otras fuentes.
export type PlayerKey = "messi" | "ronaldo";
type AG = [apps: number | null, goals: number | null];

export const UPDATED = "29 de septiembre de 2026";

export const SOURCES = [
  { name: "Wikipedia · Messi–Ronaldo rivalry", url: "https://en.wikipedia.org/wiki/Messi%E2%80%93Ronaldo_rivalry" },
  { name: "Wikipedia · goles internacionales de Messi", url: "https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Lionel_Messi" },
  { name: "Wikipedia · goles internacionales de Cristiano Ronaldo", url: "https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Cristiano_Ronaldo" },
  { name: "Wikipedia · Mundial 2026, fase final", url: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage" },
  { name: "messivsronaldo.app", url: "https://www.messivsronaldo.app/" },
  { name: "michelacosta.com · Messi vs Cristiano", url: "https://michelacosta.com/messi-vs-cristiano/" },
];

export type Profile = {
  key: PlayerKey;
  name: string;
  short: string;
  fullName: string;
  born: string; // ISO
  birthplace: string;
  country: string;
  flag: string;
  foot: string;
  color: string;
  clubs: string;
};

// Colores validados para daltonismo (contra el fondo claro).
export const PROFILES: Record<PlayerKey, Profile> = {
  messi: {
    key: "messi",
    name: "Lionel Messi",
    short: "Messi",
    fullName: "Lionel Andrés Messi",
    born: "1987-06-24",
    birthplace: "Rosario, Argentina",
    country: "Argentina",
    flag: "ar",
    foot: "Zurdo",
    color: "#3b8fd9",
    clubs: "Barcelona · PSG · Inter Miami",
  },
  ronaldo: {
    key: "ronaldo",
    name: "Cristiano Ronaldo",
    short: "Cristiano",
    fullName: "Cristiano Ronaldo dos Santos Aveiro",
    born: "1985-02-05",
    birthplace: "Funchal, Portugal",
    country: "Portugal",
    flag: "pt",
    foot: "Diestro",
    color: "#d7263d",
    clubs: "Sporting · Man. United · Real Madrid · Juventus · Al-Nassr",
  },
};

// Carrera completa (clubes + selección mayor, partidos oficiales).
export type Career = {
  apps: number;
  goals: number;
  assists: number;
  hatTricks: number;
  minutes: number;
  penaltyGoals: number;
  penaltyAttempts: number;
  freeKicks: number;
  headers: number;
  outsideBox: number; // sin contar tiros libres
  leftFoot: number;
  rightFoot: number;
};

export const CAREER: Record<PlayerKey, Career> = {
  messi: { apps: 1177, goals: 931, assists: 424, hatTricks: 62, minutes: 96837, penaltyGoals: 114, penaltyAttempts: 149, freeKicks: 76, headers: 32, outsideBox: 109, leftFoot: 782, rightFoot: 113 },
  ronaldo: { apps: 1338, goals: 979, assists: 261, hatTricks: 66, minutes: 109362, penaltyGoals: 184, penaltyAttempts: 220, freeKicks: 65, headers: 158, outsideBox: 72, leftFoot: 186, rightFoot: 632 },
};

// Solo en Europa (sin la MLS ni la liga saudí), clubes + selección.
export const CAREER_EUROPE: Record<PlayerKey, { apps: number; goals: number; assists: number }> = {
  messi: { apps: 1060, goals: 829, assists: 368 },
  ronaldo: { apps: 1183, goals: 847, assists: 238 },
};

// Por competencia (messivsronaldo.app).
export type CompStat = { apps: number; goals: number; assists: number; hatTricks: number };
export const BY_COMPETITION: { id: string; label: string; note?: string; messi: CompStat; ronaldo: CompStat }[] = [
  { id: "clubes", label: "Clubes", messi: { apps: 970, goals: 806, assists: 359, hatTricks: 51 }, ronaldo: { apps: 1104, goals: 833, assists: 224, hatTricks: 56 } },
  { id: "ligas", label: "Ligas", messi: { apps: 655, goals: 567, assists: 261, hatTricks: 39 }, ronaldo: { apps: 764, goals: 603, assists: 162, hatTricks: 45 } },
  { id: "champions", label: "Champions League", note: "Fase de grupos o de liga y eliminatorias; sin las rondas previas.", messi: { apps: 163, goals: 129, assists: 40, hatTricks: 8 }, ronaldo: { apps: 183, goals: 140, assists: 41, hatTricks: 8 } },
  { id: "seleccion", label: "Selección mayor", messi: { apps: 207, goals: 125, assists: 65, hatTricks: 11 }, ronaldo: { apps: 234, goals: 146, assists: 37, hatTricks: 10 } },
  { id: "mundial", label: "Mundiales", messi: { apps: 34, goals: 21, assists: 12, hatTricks: 1 }, ronaldo: { apps: 27, goals: 11, assists: 2, hatTricks: 1 } },
  { id: "continental", label: "Copa América / Eurocopa", messi: { apps: 39, goals: 14, assists: 18, hatTricks: 1 }, ronaldo: { apps: 30, goals: 14, assists: 7, hatTricks: 0 } },
];

// Por club, con asistencias (michelacosta.com; las sumas coinciden con messivsronaldo.app) y títulos ganados en cada uno.
export type ClubSpell = { club: string; years: string; apps: number; goals: number; assists: number; titles: number };
export const CLUBS: Record<PlayerKey, ClubSpell[]> = {
  messi: [
    { club: "Barcelona", years: "2004–2021", apps: 778, goals: 672, assists: 269, titles: 35 },
    { club: "PSG", years: "2021–2023", apps: 75, goals: 32, assists: 34, titles: 3 },
    { club: "Inter Miami", years: "2023–", apps: 117, goals: 102, assists: 56, titles: 5 },
  ],
  ronaldo: [
    { club: "Sporting CP", years: "2002–2003", apps: 31, goals: 5, assists: 4, titles: 1 },
    { club: "Manchester United", years: "2003–2009 · 2021–2022", apps: 346, goals: 145, assists: 57, titles: 10 },
    { club: "Real Madrid", years: "2009–2018", apps: 438, goals: 450, assists: 120, titles: 16 },
    { club: "Juventus", years: "2018–2021", apps: 134, goals: 101, assists: 20, titles: 5 },
    { club: "Al-Nassr", years: "2023–", apps: 155, goals: 132, assists: 23, titles: 2 },
  ],
};

// Selección mayor por tipo de competencia (Wikipedia; suman 207/125 y 234/146).
export const INTL_BY_COMPETITION: Record<PlayerKey, { label: string; apps: number; goals: number }[]> = {
  messi: [
    { label: "Eliminatorias", apps: 72, goals: 36 },
    { label: "Amistosos", apps: 61, goals: 54 },
    { label: "Copa América", apps: 39, goals: 14 },
    { label: "Mundiales", apps: 34, goals: 21 },
    { label: "Finalissima", apps: 1, goals: 0 },
  ],
  ronaldo: [
    { label: "Eliminatorias del Mundial", apps: 52, goals: 41 },
    { label: "Eliminatorias de la Euro", apps: 44, goals: 41 },
    { label: "Amistosos", apps: 56, goals: 22 },
    { label: "Eurocopas", apps: 30, goals: 14 },
    { label: "Mundiales", apps: 27, goals: 11 },
    { label: "Nations League", apps: 21, goals: 15 },
    { label: "Copa Confederaciones", apps: 4, goals: 2 },
  ],
};

// Torneos de selecciones, edición por edición (partidos y goles de Wikipedia; suman los totales de cada torneo).
export type Tournament = { year: number; apps: number; goals: number; result: string; champion?: boolean };
export const WORLD_CUPS: Record<PlayerKey, Tournament[]> = {
  messi: [
    { year: 2006, apps: 3, goals: 1, result: "Cuartos de final" },
    { year: 2010, apps: 5, goals: 0, result: "Cuartos de final" },
    { year: 2014, apps: 7, goals: 4, result: "Subcampeón" },
    { year: 2018, apps: 4, goals: 1, result: "Octavos de final" },
    { year: 2022, apps: 7, goals: 7, result: "Campeón", champion: true },
    { year: 2026, apps: 8, goals: 8, result: "Subcampeón" },
  ],
  ronaldo: [
    { year: 2006, apps: 6, goals: 1, result: "Cuarto puesto" },
    { year: 2010, apps: 4, goals: 1, result: "Octavos de final" },
    { year: 2014, apps: 3, goals: 1, result: "Fase de grupos" },
    { year: 2018, apps: 4, goals: 4, result: "Octavos de final" },
    { year: 2022, apps: 5, goals: 1, result: "Cuartos de final" },
    { year: 2026, apps: 5, goals: 3, result: "Octavos de final" },
  ],
};

export const CONTINENTAL: Record<PlayerKey, { name: string; editions: Tournament[] }> = {
  messi: {
    name: "Copa América",
    editions: [
      { year: 2007, apps: 6, goals: 2, result: "Subcampeón" },
      { year: 2011, apps: 4, goals: 0, result: "Cuartos de final" },
      { year: 2015, apps: 6, goals: 1, result: "Subcampeón" },
      { year: 2016, apps: 5, goals: 5, result: "Subcampeón (Centenario)" },
      { year: 2019, apps: 6, goals: 1, result: "Tercer puesto" },
      { year: 2021, apps: 7, goals: 4, result: "Campeón", champion: true },
      { year: 2024, apps: 5, goals: 1, result: "Campeón", champion: true },
    ],
  },
  ronaldo: {
    name: "Eurocopa",
    editions: [
      { year: 2004, apps: 6, goals: 2, result: "Subcampeón" },
      { year: 2008, apps: 3, goals: 1, result: "Cuartos de final" },
      { year: 2012, apps: 5, goals: 3, result: "Semifinal" },
      { year: 2016, apps: 7, goals: 3, result: "Campeón", champion: true },
      { year: 2020, apps: 4, goals: 5, result: "Octavos de final" },
      { year: 2024, apps: 5, goals: 0, result: "Cuartos de final" },
    ],
  },
};

// Juveniles y Juegos Olímpicos (messivsronaldo.app, "all goals including youth").
export const YOUTH: Record<PlayerKey, { team: string; apps: number; goals: number; note?: string }[]> = {
  messi: [
    { team: "Argentina Sub-20", apps: 18, goals: 14, note: "Campeón del Mundial Sub-20 2005, con el Balón y el Botín de Oro" },
    { team: "Argentina Sub-23", apps: 5, goals: 2, note: "Medalla de oro en los Juegos Olímpicos de Pekín 2008" },
    { team: "Barcelona B", apps: 22, goals: 6 },
    { team: "Barcelona C", apps: 10, goals: 5 },
  ],
  ronaldo: [
    { team: "Portugal Sub-15", apps: 9, goals: 7 },
    { team: "Portugal Sub-17", apps: 7, goals: 5 },
    { team: "Portugal Sub-20", apps: 5, goals: 1 },
    { team: "Portugal Sub-21", apps: 10, goals: 3 },
    { team: "Portugal Sub-23", apps: 3, goals: 2, note: "Juegos Olímpicos de Atenas 2004 (eliminado en la fase de grupos)" },
    { team: "Sporting B", apps: 2, goals: 0 },
  ],
};
export const ALL_GOALS_WITH_YOUTH: Record<PlayerKey, { apps: number; goals: number }> = {
  messi: { apps: 1232, goals: 958 },
  ronaldo: { apps: 1374, goals: 997 },
};

// Finales (michelacosta.com): cuenta finales, no partidos; una final de ida y vuelta es una sola.
export const FINALS: Record<PlayerKey, { played: number; won: number; lost: number; goals: number; assists: number }> = {
  messi: { played: 48, won: 34, lost: 14, goals: 38, assists: 20 },
  ronaldo: { played: 38, won: 25, lost: 13, goals: 25, assists: 2 },
};
// Títulos ganados sobre torneos disputados (michelacosta.com).
export const TITLES_CONTESTED: Record<PlayerKey, { won: number; contested: number }> = {
  messi: { won: 49, contested: 106 },
  ronaldo: { won: 37, contested: 115 },
};

// Títulos por categoría, con temporadas (messivsronaldo.app). Suman 49 y 37.
export type TitleGroup = { label: string; items: { name: string; years: string[] }[] };
export const TITLES: Record<PlayerKey, TitleGroup[]> = {
  messi: [
    {
      label: "Selección",
      items: [
        { name: "Copa del Mundo", years: ["2022"] },
        { name: "Copa América", years: ["2021", "2024"] },
        { name: "Finalissima", years: ["2022"] },
        { name: "Oro olímpico (Sub-23)", years: ["2008"] },
        { name: "Mundial Sub-20", years: ["2005"] },
      ],
    },
    {
      label: "Internacionales de clubes",
      items: [
        { name: "Champions League", years: ["2005–06", "2008–09", "2010–11", "2014–15"] },
        { name: "Supercopa de Europa", years: ["2009", "2011", "2015"] },
        { name: "Mundial de Clubes", years: ["2009", "2011", "2015"] },
        { name: "Leagues Cup", years: ["2023"] },
        { name: "Campeones Cup", years: ["2026"] },
      ],
    },
    {
      label: "Ligas",
      items: [
        { name: "LaLiga", years: ["2004–05", "2005–06", "2008–09", "2009–10", "2010–11", "2012–13", "2014–15", "2015–16", "2017–18", "2018–19"] },
        { name: "Ligue 1", years: ["2021–22", "2022–23"] },
        { name: "MLS Supporters' Shield", years: ["2024"] },
      ],
    },
    {
      label: "Copas y supercopas nacionales",
      items: [
        { name: "Copa del Rey", years: ["2008–09", "2011–12", "2014–15", "2015–16", "2016–17", "2017–18", "2020–21"] },
        { name: "Supercopa de España", years: ["2005", "2006", "2009", "2010", "2011", "2013", "2016", "2018"] },
        { name: "Trophée des Champions", years: ["2022"] },
        { name: "MLS Cup", years: ["2025"] },
        { name: "Conferencia Este de la MLS", years: ["2025"] },
      ],
    },
  ],
  ronaldo: [
    {
      label: "Selección",
      items: [
        { name: "Eurocopa", years: ["2016"] },
        { name: "UEFA Nations League", years: ["2018–19", "2024–25"] },
      ],
    },
    {
      label: "Internacionales de clubes",
      items: [
        { name: "Champions League", years: ["2007–08", "2013–14", "2015–16", "2016–17", "2017–18"] },
        { name: "Supercopa de Europa", years: ["2014", "2016", "2017"] },
        { name: "Mundial de Clubes", years: ["2008", "2014", "2016", "2017"] },
        { name: "Copa de Campeones Árabe", years: ["2023"] },
      ],
    },
    {
      label: "Ligas",
      items: [
        { name: "Premier League", years: ["2006–07", "2007–08", "2008–09"] },
        { name: "LaLiga", years: ["2011–12", "2016–17"] },
        { name: "Serie A", years: ["2018–19", "2019–20"] },
        { name: "Liga Profesional Saudí", years: ["2025–26"] },
      ],
    },
    {
      label: "Copas y supercopas nacionales",
      items: [
        { name: "FA Cup", years: ["2003–04"] },
        { name: "Copa de la Liga inglesa", years: ["2005–06", "2008–09"] },
        { name: "Copa del Rey", years: ["2010–11", "2013–14"] },
        { name: "Copa Italia", years: ["2020–21"] },
        { name: "Community Shield", years: ["2007", "2008"] },
        { name: "Supercopa de España", years: ["2012", "2017"] },
        { name: "Supercopa de Italia", years: ["2019", "2021"] },
        { name: "Supercopa de Portugal", years: ["2002"] },
      ],
    },
  ],
};

// Premios individuales (messivsronaldo.app; el Balón de Oro coincide con lib/data/ballon-dor.ts).
export type Award = { name: string; messi: string[]; ronaldo: string[]; count?: Record<PlayerKey, number>; note?: string };
export const AWARDS: Award[] = [
  { name: "Balón de Oro", messi: ["2009", "2010", "2011", "2012", "2015", "2019", "2021", "2023"], ronaldo: ["2008", "2013", "2014", "2016", "2017"] },
  { name: "Mejor jugador FIFA", note: "FIFA World Player y The Best; entre 2010 y 2015 se entregó junto con el Balón de Oro.", messi: ["2009", "2019", "2022", "2023"], ronaldo: ["2008", "2016", "2017"] },
  { name: "Bota de Oro europea", messi: ["2009–10", "2011–12", "2012–13", "2016–17", "2017–18", "2018–19"], ronaldo: ["2007–08", "2010–11", "2013–14", "2014–15"] },
  { name: "Goleador de la Champions", note: "Incluye las temporadas en que lo compartieron.", messi: [], ronaldo: [], count: { messi: 6, ronaldo: 7 } },
  { name: "Goleador de LaLiga (Pichichi)", messi: [], ronaldo: [], count: { messi: 8, ronaldo: 3 } },
  { name: "Goleador de otras ligas", messi: ["MLS 2025"], ronaldo: ["Premier 2007–08", "Serie A 2020–21", "Saudí 2023–24", "Saudí 2024–25"] },
  { name: "Balón de Oro del Mundial", messi: ["2014", "2022"], ronaldo: [] },
  { name: "Mejor jugador de la Copa América", note: "En 2015 Messi no aceptó el premio.", messi: ["2015", "2021"], ronaldo: [] },
  { name: "Goleador de la Copa América", messi: ["2021"], ronaldo: [] },
  { name: "Balón de Oro del Mundial de Clubes", messi: ["2009", "2011"], ronaldo: ["2016"] },
  { name: "MVP de la MLS", messi: ["2024", "2025"], ronaldo: [] },
  { name: "Premio Laureus al deportista del año", messi: ["2020", "2023"], ronaldo: [] },
  { name: "Equipo ideal FIFPro", messi: [], ronaldo: [], count: { messi: 17, ronaldo: 15 } },
];

// Votaciones del Balón de Oro.
export const BALLON_VOTES: Record<PlayerKey, { wins: number; top2: number; top3: number; nominations: number }> = {
  messi: { wins: 8, top2: 13, top3: 14, nominations: 17 },
  ronaldo: { wins: 5, top2: 11, top3: 12, nominations: 18 },
};

// Datos de juego (Opta y WhoScored, vía messivsronaldo.app): solo de los partidos con registro detallado, no de toda la carrera.
export const ADVANCED: { label: string; messi: number; ronaldo: number; suffix?: string; decimals?: number }[] = [
  { label: "Remates", messi: 4317, ronaldo: 5338 },
  { label: "Remates al arco", messi: 1980, ronaldo: 2152 },
  { label: "Precisión de remate", messi: 45.9, ronaldo: 40.3, suffix: "%", decimals: 1 },
  { label: "Gambetas exitosas", messi: 4096, ronaldo: 1962 },
  { label: "Pases clave", messi: 2136, ronaldo: 1314 },
  { label: "Ocasiones claras creadas", messi: 612, ronaldo: 253 },
  { label: "Duelos aéreos ganados", messi: 171, ronaldo: 1068 },
  { label: "Premios a la figura del partido", messi: 463, ronaldo: 230 },
  { label: "Puntaje promedio", messi: 8.4, ronaldo: 7.72, decimals: 2 },
];

// Cara a cara: 36 partidos oficiales (Wikipedia, "Messi–Ronaldo rivalry"; coincide con messivsronaldo.app).
// No incluye el amistoso de clubes de 2023 (Riyadh XI 4–5 PSG). winner: equipo de quién ganó.
export type H2HMatch = {
  date: string;
  comp: string;
  stage?: "Final" | "Semifinal";
  home: string;
  away: string;
  score: string;
  note?: string;
  winner: PlayerKey | null;
  goals: { p: PlayerKey; min: string; pen?: boolean }[];
};

export const H2H_SUMMARY: { comp: string; played: number; messiWins: number; draws: number; ronaldoWins: number; messiGoals: number; ronaldoGoals: number }[] = [
  { comp: "LaLiga", played: 18, messiWins: 10, draws: 4, ronaldoWins: 4, messiGoals: 12, ronaldoGoals: 9 },
  { comp: "Champions League", played: 6, messiWins: 2, draws: 2, ronaldoWins: 2, messiGoals: 3, ronaldoGoals: 2 },
  { comp: "Copa del Rey", played: 5, messiWins: 1, draws: 2, ronaldoWins: 2, messiGoals: 0, ronaldoGoals: 5 },
  { comp: "Supercopa de España", played: 5, messiWins: 2, draws: 1, ronaldoWins: 2, messiGoals: 6, ronaldoGoals: 4 },
  { comp: "Amistosos de selecciones", played: 2, messiWins: 1, draws: 0, ronaldoWins: 1, messiGoals: 1, ronaldoGoals: 1 },
];
// Asistencias en el cara a cara (messivsronaldo.app).
export const H2H_ASSISTS: Record<PlayerKey, number> = { messi: 12, ronaldo: 1 };

const g = (p: PlayerKey, min: string, pen = false) => ({ p, min, pen });
export const H2H_MATCHES: H2HMatch[] = [
  { date: "2008-04-23", comp: "Champions League", stage: "Semifinal", home: "Barcelona", away: "Manchester United", score: "0–0", winner: null, goals: [] },
  { date: "2008-04-29", comp: "Champions League", stage: "Semifinal", home: "Manchester United", away: "Barcelona", score: "1–0", winner: "ronaldo", goals: [] },
  { date: "2009-05-27", comp: "Champions League", stage: "Final", home: "Barcelona", away: "Manchester United", score: "2–0", winner: "messi", goals: [g("messi", "70")] },
  { date: "2009-11-29", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "1–0", winner: "messi", goals: [] },
  { date: "2010-04-10", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "0–2", winner: "messi", goals: [g("messi", "33")] },
  { date: "2010-11-29", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "5–0", winner: "messi", goals: [] },
  { date: "2011-02-09", comp: "Amistoso", home: "Argentina", away: "Portugal", score: "2–1", winner: "messi", goals: [g("ronaldo", "21"), g("messi", "90", true)] },
  { date: "2011-04-16", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "1–1", winner: null, goals: [g("messi", "51", true), g("ronaldo", "81", true)] },
  { date: "2011-04-20", comp: "Copa del Rey", stage: "Final", home: "Real Madrid", away: "Barcelona", score: "1–0", note: "alargue", winner: "ronaldo", goals: [g("ronaldo", "103")] },
  { date: "2011-04-27", comp: "Champions League", stage: "Semifinal", home: "Real Madrid", away: "Barcelona", score: "0–2", winner: "messi", goals: [g("messi", "76"), g("messi", "87")] },
  { date: "2011-05-03", comp: "Champions League", stage: "Semifinal", home: "Barcelona", away: "Real Madrid", score: "1–1", winner: null, goals: [] },
  { date: "2011-08-14", comp: "Supercopa de España", stage: "Final", home: "Real Madrid", away: "Barcelona", score: "2–2", winner: null, goals: [g("messi", "45+1")] },
  { date: "2011-08-17", comp: "Supercopa de España", stage: "Final", home: "Barcelona", away: "Real Madrid", score: "3–2", winner: "messi", goals: [g("ronaldo", "20"), g("messi", "53"), g("messi", "88")] },
  { date: "2011-12-10", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "1–3", winner: "messi", goals: [] },
  { date: "2012-01-18", comp: "Copa del Rey", home: "Real Madrid", away: "Barcelona", score: "1–2", winner: "messi", goals: [g("ronaldo", "11")] },
  { date: "2012-01-25", comp: "Copa del Rey", home: "Barcelona", away: "Real Madrid", score: "2–2", winner: null, goals: [g("ronaldo", "68")] },
  { date: "2012-04-21", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "1–2", winner: "ronaldo", goals: [g("ronaldo", "73")] },
  { date: "2012-08-23", comp: "Supercopa de España", stage: "Final", home: "Barcelona", away: "Real Madrid", score: "3–2", winner: "messi", goals: [g("ronaldo", "55"), g("messi", "70", true)] },
  { date: "2012-08-29", comp: "Supercopa de España", stage: "Final", home: "Real Madrid", away: "Barcelona", score: "2–1", winner: "ronaldo", goals: [g("ronaldo", "19"), g("messi", "45")] },
  { date: "2012-10-07", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "2–2", winner: null, goals: [g("ronaldo", "23"), g("messi", "31"), g("messi", "61"), g("ronaldo", "66")] },
  { date: "2013-01-30", comp: "Copa del Rey", stage: "Semifinal", home: "Real Madrid", away: "Barcelona", score: "1–1", winner: null, goals: [] },
  { date: "2013-02-26", comp: "Copa del Rey", stage: "Semifinal", home: "Barcelona", away: "Real Madrid", score: "1–3", winner: "ronaldo", goals: [g("ronaldo", "12", true), g("ronaldo", "57")] },
  { date: "2013-03-02", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "2–1", winner: "ronaldo", goals: [g("messi", "18")] },
  { date: "2013-10-26", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "2–1", winner: "messi", goals: [] },
  { date: "2014-03-23", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "3–4", winner: "messi", goals: [g("messi", "42"), g("ronaldo", "55", true), g("messi", "65", true), g("messi", "84", true)] },
  { date: "2014-10-25", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "3–1", winner: "ronaldo", goals: [g("ronaldo", "35", true)] },
  { date: "2014-11-18", comp: "Amistoso", home: "Argentina", away: "Portugal", score: "0–1", winner: "ronaldo", goals: [] },
  { date: "2015-03-22", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "2–1", winner: "messi", goals: [g("ronaldo", "31")] },
  { date: "2015-11-21", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "0–4", winner: "messi", goals: [] },
  { date: "2016-04-02", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "1–2", winner: "ronaldo", goals: [g("ronaldo", "85")] },
  { date: "2016-12-03", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "1–1", winner: null, goals: [] },
  { date: "2017-04-23", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "2–3", winner: "messi", goals: [g("messi", "33"), g("messi", "90+2")] },
  { date: "2017-08-13", comp: "Supercopa de España", stage: "Final", home: "Barcelona", away: "Real Madrid", score: "1–3", winner: "ronaldo", goals: [g("messi", "77", true), g("ronaldo", "80")] },
  { date: "2017-12-23", comp: "LaLiga", home: "Real Madrid", away: "Barcelona", score: "0–3", winner: "messi", goals: [g("messi", "64", true)] },
  { date: "2018-05-06", comp: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "2–2", winner: null, goals: [g("ronaldo", "14"), g("messi", "52")] },
  { date: "2020-12-08", comp: "Champions League", home: "Barcelona", away: "Juventus", score: "0–3", winner: "ronaldo", goals: [g("ronaldo", "13", true), g("ronaldo", "52", true)] },
];

export type ClubSeason = { p: PlayerKey; club: string; season: string; league: AG; cup: AG; cont: AG; other: AG; total: AG };
export type IntlYear = { p: PlayerKey; year: number; comp: [number, number]; friendly: [number, number]; total: [number, number] };

// Por temporada (clubes) y por año (selección). Generado desde las tablas de Wikipedia; las sumas dan 970/806,
// 1104/833, 207/125 y 234/146.
export const CLUB_SEASONS: ClubSeason[] = [{p: "messi",club: "Barcelona",season: "2004–05",league: [7,1],cup: [1,0],cont: [1,0],other: [null,null],total: [9,1]},
  {p: "messi",club: "Barcelona",season: "2005–06",league: [17,6],cup: [2,1],cont: [6,1],other: [0,0],total: [25,8]},
  {p: "messi",club: "Barcelona",season: "2006–07",league: [26,14],cup: [2,2],cont: [5,1],other: [3,0],total: [36,17]},
  {p: "messi",club: "Barcelona",season: "2007–08",league: [28,10],cup: [3,0],cont: [9,6],other: [null,null],total: [40,16]},
  {p: "messi",club: "Barcelona",season: "2008–09",league: [31,23],cup: [8,6],cont: [12,9],other: [null,null],total: [51,38]},
  {p: "messi",club: "Barcelona",season: "2009–10",league: [35,34],cup: [3,1],cont: [11,8],other: [4,4],total: [53,47]},
  {p: "messi",club: "Barcelona",season: "2010–11",league: [33,31],cup: [7,7],cont: [13,12],other: [2,3],total: [55,53]},
  {p: "messi",club: "Barcelona",season: "2011–12",league: [37,50],cup: [7,3],cont: [11,14],other: [5,6],total: [60,73]},
  {p: "messi",club: "Barcelona",season: "2012–13",league: [32,46],cup: [5,4],cont: [11,8],other: [2,2],total: [50,60]},
  {p: "messi",club: "Barcelona",season: "2013–14",league: [31,28],cup: [6,5],cont: [7,8],other: [2,0],total: [46,41]},
  {p: "messi",club: "Barcelona",season: "2014–15",league: [38,43],cup: [6,5],cont: [13,10],other: [null,null],total: [57,58]},
  {p: "messi",club: "Barcelona",season: "2015–16",league: [33,26],cup: [5,5],cont: [7,6],other: [4,4],total: [49,41]},
  {p: "messi",club: "Barcelona",season: "2016–17",league: [34,37],cup: [7,5],cont: [9,11],other: [2,1],total: [52,54]},
  {p: "messi",club: "Barcelona",season: "2017–18",league: [36,34],cup: [6,4],cont: [10,6],other: [2,1],total: [54,45]},
  {p: "messi",club: "Barcelona",season: "2018–19",league: [34,36],cup: [5,3],cont: [10,12],other: [1,0],total: [50,51]},
  {p: "messi",club: "Barcelona",season: "2019–20",league: [33,25],cup: [2,2],cont: [8,3],other: [1,1],total: [44,31]},
  {p: "messi",club: "Barcelona",season: "2020–21",league: [35,30],cup: [5,3],cont: [6,5],other: [1,0],total: [47,38]},
  {p: "messi",club: "PSG",season: "2021–22",league: [26,6],cup: [1,0],cont: [7,5],other: [null,null],total: [34,11]},
  {p: "messi",club: "PSG",season: "2022–23",league: [32,16],cup: [1,0],cont: [7,4],other: [1,1],total: [41,21]},
  {p: "messi",club: "Inter Miami",season: "2023",league: [6,1],cup: [1,0],cont: [null,null],other: [7,10],total: [14,11]},
  {p: "messi",club: "Inter Miami",season: "2024",league: [19,20],cup: [null,null],cont: [3,2],other: [3,1],total: [25,23]},
  {p: "messi",club: "Inter Miami",season: "2025",league: [28,29],cup: [null,null],cont: [7,5],other: [14,9],total: [49,43]},
  {p: "messi",club: "Inter Miami",season: "2026",league: [24,21],cup: [null,null],cont: [2,1],other: [3,3],total: [29,25]},
  {p: "ronaldo",club: "Sporting CP",season: "2002–03",league: [25,3],cup: [3,2],cont: [3,0],other: [0,0],total: [31,5]},
  {p: "ronaldo",club: "Manchester United",season: "2003–04",league: [29,4],cup: [6,2],cont: [5,0],other: [0,0],total: [40,6]},
  {p: "ronaldo",club: "Manchester United",season: "2004–05",league: [33,5],cup: [9,4],cont: [8,0],other: [0,0],total: [50,9]},
  {p: "ronaldo",club: "Manchester United",season: "2005–06",league: [33,9],cup: [6,2],cont: [8,1],other: [null,null],total: [47,12]},
  {p: "ronaldo",club: "Manchester United",season: "2006–07",league: [34,17],cup: [8,3],cont: [11,3],other: [null,null],total: [53,23]},
  {p: "ronaldo",club: "Manchester United",season: "2007–08",league: [34,31],cup: [3,3],cont: [11,8],other: [1,0],total: [49,42]},
  {p: "ronaldo",club: "Manchester United",season: "2008–09",league: [33,18],cup: [6,3],cont: [12,4],other: [2,1],total: [53,26]},
  {p: "ronaldo",club: "Real Madrid",season: "2009–10",league: [29,26],cup: [0,0],cont: [6,7],other: [null,null],total: [35,33]},
  {p: "ronaldo",club: "Real Madrid",season: "2010–11",league: [34,40],cup: [8,7],cont: [12,6],other: [null,null],total: [54,53]},
  {p: "ronaldo",club: "Real Madrid",season: "2011–12",league: [38,46],cup: [5,3],cont: [10,10],other: [2,1],total: [55,60]},
  {p: "ronaldo",club: "Real Madrid",season: "2012–13",league: [34,34],cup: [7,7],cont: [12,12],other: [2,2],total: [55,55]},
  {p: "ronaldo",club: "Real Madrid",season: "2013–14",league: [30,31],cup: [6,3],cont: [11,17],other: [null,null],total: [47,51]},
  {p: "ronaldo",club: "Real Madrid",season: "2014–15",league: [35,48],cup: [2,1],cont: [12,10],other: [5,2],total: [54,61]},
  {p: "ronaldo",club: "Real Madrid",season: "2015–16",league: [36,35],cup: [0,0],cont: [12,16],other: [null,null],total: [48,51]},
  {p: "ronaldo",club: "Real Madrid",season: "2016–17",league: [29,25],cup: [2,1],cont: [13,12],other: [2,4],total: [46,42]},
  {p: "ronaldo",club: "Real Madrid",season: "2017–18",league: [27,26],cup: [0,0],cont: [13,15],other: [4,3],total: [44,44]},
  {p: "ronaldo",club: "Juventus",season: "2018–19",league: [31,21],cup: [2,0],cont: [9,6],other: [1,1],total: [43,28]},
  {p: "ronaldo",club: "Juventus",season: "2019–20",league: [33,31],cup: [4,2],cont: [8,4],other: [1,0],total: [46,37]},
  {p: "ronaldo",club: "Juventus",season: "2020–21",league: [33,29],cup: [4,2],cont: [6,4],other: [1,1],total: [44,36]},
  {p: "ronaldo",club: "Juventus",season: "2021–22",league: [1,0],cup: [null,null],cont: [null,null],other: [null,null],total: [1,0]},
  {p: "ronaldo",club: "Manchester United",season: "2021–22",league: [30,18],cup: [1,0],cont: [7,6],other: [null,null],total: [38,24]},
  {p: "ronaldo",club: "Manchester United",season: "2022–23",league: [10,1],cup: [0,0],cont: [6,2],other: [null,null],total: [16,3]},
  {p: "ronaldo",club: "Al-Nassr",season: "2022–23",league: [16,14],cup: [2,0],cont: [null,null],other: [1,0],total: [19,14]},
  {p: "ronaldo",club: "Al-Nassr",season: "2023–24",league: [31,35],cup: [4,3],cont: [9,6],other: [7,6],total: [51,50]},
  {p: "ronaldo",club: "Al-Nassr",season: "2024–25",league: [30,25],cup: [1,0],cont: [8,8],other: [2,2],total: [41,35]},
  {p: "ronaldo",club: "Al-Nassr",season: "2025–26",league: [30,28],cup: [1,0],cont: [4,1],other: [2,1],total: [37,30]},
  {p: "ronaldo",club: "Al-Nassr",season: "2026–27",league: [6,3],cup: [0,0],cont: [1,0],other: [0,0],total: [7,3]}];

export const INTL_YEARS: IntlYear[] = [{p: "messi",year: 2005,comp: [3,0],friendly: [2,0],total: [5,0]},
  {p: "messi",year: 2006,comp: [3,1],friendly: [4,1],total: [7,2]},
  {p: "messi",year: 2007,comp: [10,4],friendly: [4,2],total: [14,6]},
  {p: "messi",year: 2008,comp: [6,1],friendly: [2,1],total: [8,2]},
  {p: "messi",year: 2009,comp: [8,1],friendly: [2,2],total: [10,3]},
  {p: "messi",year: 2010,comp: [5,0],friendly: [5,2],total: [10,2]},
  {p: "messi",year: 2011,comp: [8,2],friendly: [5,2],total: [13,4]},
  {p: "messi",year: 2012,comp: [5,5],friendly: [4,7],total: [9,12]},
  {p: "messi",year: 2013,comp: [5,3],friendly: [2,3],total: [7,6]},
  {p: "messi",year: 2014,comp: [7,4],friendly: [7,4],total: [14,8]},
  {p: "messi",year: 2015,comp: [6,1],friendly: [2,3],total: [8,4]},
  {p: "messi",year: 2016,comp: [10,8],friendly: [1,0],total: [11,8]},
  {p: "messi",year: 2017,comp: [5,4],friendly: [2,0],total: [7,4]},
  {p: "messi",year: 2018,comp: [4,1],friendly: [1,3],total: [5,4]},
  {p: "messi",year: 2019,comp: [6,1],friendly: [4,4],total: [10,5]},
  {p: "messi",year: 2020,comp: [4,1],friendly: [0,0],total: [4,1]},
  {p: "messi",year: 2021,comp: [16,9],friendly: [0,0],total: [16,9]},
  {p: "messi",year: 2022,comp: [10,8],friendly: [4,10],total: [14,18]},
  {p: "messi",year: 2023,comp: [5,3],friendly: [3,5],total: [8,8]},
  {p: "messi",year: 2024,comp: [9,4],friendly: [2,2],total: [11,6]},
  {p: "messi",year: 2025,comp: [3,2],friendly: [2,1],total: [5,3]},
  {p: "messi",year: 2026,comp: [8,8],friendly: [3,2],total: [11,10]},
  {p: "ronaldo",year: 2003,comp: [0,0],friendly: [2,0],total: [2,0]},
  {p: "ronaldo",year: 2004,comp: [11,7],friendly: [5,0],total: [16,7]},
  {p: "ronaldo",year: 2005,comp: [7,2],friendly: [4,0],total: [11,2]},
  {p: "ronaldo",year: 2006,comp: [10,4],friendly: [4,2],total: [14,6]},
  {p: "ronaldo",year: 2007,comp: [9,5],friendly: [1,0],total: [10,5]},
  {p: "ronaldo",year: 2008,comp: [5,1],friendly: [3,0],total: [8,1]},
  {p: "ronaldo",year: 2009,comp: [5,0],friendly: [2,1],total: [7,1]},
  {p: "ronaldo",year: 2010,comp: [6,3],friendly: [5,0],total: [11,3]},
  {p: "ronaldo",year: 2011,comp: [6,5],friendly: [2,2],total: [8,7]},
  {p: "ronaldo",year: 2012,comp: [9,4],friendly: [4,1],total: [13,5]},
  {p: "ronaldo",year: 2013,comp: [6,7],friendly: [3,3],total: [9,10]},
  {p: "ronaldo",year: 2014,comp: [5,3],friendly: [4,2],total: [9,5]},
  {p: "ronaldo",year: 2015,comp: [4,3],friendly: [1,0],total: [5,3]},
  {p: "ronaldo",year: 2016,comp: [10,10],friendly: [3,3],total: [13,13]},
  {p: "ronaldo",year: 2017,comp: [10,10],friendly: [1,1],total: [11,11]},
  {p: "ronaldo",year: 2018,comp: [4,4],friendly: [3,2],total: [7,6]},
  {p: "ronaldo",year: 2019,comp: [10,14],friendly: [0,0],total: [10,14]},
  {p: "ronaldo",year: 2020,comp: [4,2],friendly: [2,1],total: [6,3]},
  {p: "ronaldo",year: 2021,comp: [11,11],friendly: [3,2],total: [14,13]},
  {p: "ronaldo",year: 2022,comp: [12,3],friendly: [0,0],total: [12,3]},
  {p: "ronaldo",year: 2023,comp: [9,10],friendly: [0,0],total: [9,10]},
  {p: "ronaldo",year: 2024,comp: [10,5],friendly: [2,2],total: [12,7]},
  {p: "ronaldo",year: 2025,comp: [9,8],friendly: [0,0],total: [9,8]},
  {p: "ronaldo",year: 2026,comp: [6,3],friendly: [2,0],total: [8,3]}];
