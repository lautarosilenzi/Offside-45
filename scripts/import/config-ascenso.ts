// Segunda categoría del fútbol argentino (el ascenso a Primera): Primera B, Primera B Nacional, Primera Nacional.
// Fuente: las páginas "Argentina Second Level" de RSSSF (tablesa/arg2-*.html), verificadas contra su propia tabla
// y partido por partido contra la Wikipedia en castellano. Se escriben en lib/data/ascenso/generated.
// No suman en las estadísticas ni en los títulos de Primera: solo aparecen en sus páginas y en los historiales.
import { getTeam } from "../../lib/teams";
import type { TournamentConfig } from "./config";

const AFA = "Asociación del Fútbol Argentino";

// Títulos de RSSSF que abren una sección nueva después de la fase regular (reducido, desempates).
const B_HEADINGS = [/^PLAYOFF FOR THE SECOND PROMOTION PLACE/i, /^RELEGATION PLAYOFF/i, /^PLAYOFF TO CONFIRM PARTICIPATION/i];
// Fin del reducido: la sección que sigue.
const AFTER_REDUCIDO = /^(RELEGATION PLAYOFF|PLAYOFF TO CONFIRM PARTICIPATION)/i;

// Fases de eliminación dentro de una sección (como en la Liguilla de Primera).
const ROUND_HEADINGS = [/^(First|Second|Third) Stage:?$/i, /^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /^First Round:?$/i, /^Second Round:?$/i];
const nameOf = (id: string) => getTeam(id)?.name ?? id;

// Primera B Nacional de temporada europea (agosto a junio): "1986/87".
const yy = (y: number) => `${y}/${String(y + 1).slice(2)}`;
const nacionalB = (
  y: number,
  rest: Omit<TournamentConfig, "slug" | "year" | "file" | "competition" | "organizer" | "title" | "tournament" | "tier"> & { file?: string; tournament?: string },
): TournamentConfig => ({
  slug: `b-nacional-${y}-${String(y + 1).slice(2)}`,
  year: y,
  yearLabel: yy(y),
  file: `arg2-${String(y + 1).slice(2)}.html`,
  competition: `${AFA} · Primera B Nacional`,
  organizer: AFA,
  title: `Primera B Nacional ${yy(y)}`,
  tournament: `Campeonato Nacional B ${yy(y)}`,
  awardedGoalsCount: true,
  rolloverBefore: 7,
  tier: 2,
  wikiDiffsByTable: true,
  headings: B_HEADINGS,
  ...rest,
  // Nombres cortos de Wikipedia que en la Nacional B no dejan dudas.
  aliases: { Defensa: "defensa-y-justicia", Italiano: "deportivo-italiano", Morón: "deportivo-moron", Chicago: "nueva-chicago", Chacarita: "chacarita", ...rest.aliases },
});
// Torneos que siguen a la temporada (reducido, desempates): sin tabla propia, slug "b-nacional-1986-87-reducido".
const nacionalBExtra = (
  y: number,
  key: string,
  name: string,
  rest: Omit<TournamentConfig, "slug" | "year" | "file" | "competition" | "organizer" | "title" | "tournament" | "tier" | "summary" | "notes"> & { file?: string; summary: string; notes: TournamentConfig["notes"] },
): TournamentConfig => ({
  ...nacionalB(y, { championIds: [], summary: "", notes: [] }),
  slug: `b-nacional-${y}-${String(y + 1).slice(2)}-${key}`,
  league: name,
  competition: `${AFA} · Primera B Nacional · ${name}`,
  title: `Primera B Nacional ${yy(y)} · ${name}`,
  tournament: `${name} de la Primera B Nacional ${yy(y)}`,
  tableIndex: [],
  // Se juegan al final de la temporada: todas las fechas sin año son del segundo año (también julio y agosto).
  // Las fases que duran toda la temporada (Apertura, primera fase…) lo pisan con 8.
  rolloverBefore: 13,
  ...rest,
});

export const ASCENSO_TOURNAMENTS: TournamentConfig[] = [
  // ───────── 1986 ─────────
  {
    slug: "primera-b-1986-apertura",
    year: 1986,
    yearLabel: "1986",
    file: "arg2-87.html",
    tier: 2,
    section: /^Primera B 1986/,
    // El torneo por un lugar en Primera que sigue en la página ya está cargado como Octogonal 1985/86.
    headings: [/^PLAYOFF FOR A PLACE IN PRIMERA A/],
    wiki: "Torneo Apertura de Primera B 1986 (Argentina)",
    competition: `${AFA} · Primera B`,
    organizer: AFA,
    title: "Primera B 1986 (Torneo Apertura)",
    tournament: "Torneo Apertura de Primera B 1986",
    championIds: [],
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    summary:
      "El último torneo de la vieja Primera B, de febrero a junio de 1986. Repartió a los clubes de la B entre la nueva Primera B Nacional (que empezaba en julio) y la nueva Primera B Metropolitana.",
    notes: [
      { kind: "formato", text: "Dos grupos de 10 equipos, todos contra todos a dos ruedas, 2 puntos por victoria. Los mejores de cada grupo pasaron a la Primera B Nacional." },
    ],
  },
  // ───────── 1986/87 ─────────
  nacionalB(1986, {
    section: /^Nacional B/,
    wiki: "Campeonato Nacional B 1986-87",
    championIds: ["deportivo-armenio"],
    summary:
      "La primera Primera B Nacional, con 22 equipos de la AFA y de las ligas del interior. Deportivo Armenio salió campeón y ascendió; el segundo ascenso fue para Banfield, que ganó el reducido.",
    notes: [
      { kind: "formato", text: "22 equipos, todos contra todos a dos ruedas, 2 puntos por victoria. Del 2.º al 9.º jugaron el reducido por el segundo ascenso." },
      { kind: "descalificacion", text: "Central Norte (Salta), Chacarita y Gimnasia y Esgrima (Jujuy) empataron el promedio y jugaron un triangular; como también empataron, descendió Central Norte por los partidos entre ellos en la temporada." },
    ],
  }),
  nacionalBExtra(1986, "reducido", "Reducido", {
    sectionRange: { from: /^PLAYOFF FOR THE SECOND PROMOTION PLACE/, to: /^RELEGATION PLAYOFF/ },
    headings: [...B_HEADINGS, ...ROUND_HEADINGS],
    wiki: "Anexo:Torneo Reducido de Ascenso a Primera División de Argentina 1987",
    championIds: ["banfield"],
    runnerUpIds: ["belgrano"],
    summary: "Banfield ganó el reducido (perdió 1-0 en Córdoba y ganó 2-0 de local la final con Belgrano) y ascendió a Primera.",
    notes: [{ kind: "formato", text: "Los equipos del 2.º al 9.º puesto, eliminación directa a ida y vuelta. Con igualdad en la serie pasaba el mejor ubicado en la tabla." }],
  }),
  nacionalBExtra(1986, "desempate", "Desempate por el descenso", {
    section: /^RELEGATION PLAYOFF/,
    // La tabla de RSSSF de esta sección suma los partidos entre los tres en la temporada: no es la del triangular.
    publishedTable: [],
    playoffFrom: { date: "1987-05-01", stage: "Triangular por el descenso" },
    championIds: [],
    summary: "Central Norte (Salta), Chacarita y Gimnasia y Esgrima (Jujuy) jugaron un triangular en cancha neutral. Los tres partidos terminaron empatados y descendió Central Norte, por los resultados entre ellos en la temporada.",
    notes: [{ kind: "formato", text: "Triangular a una rueda en cancha neutral entre los tres equipos con el peor promedio." }],
  }),
];

// ───────── Primera B Nacional 1987/88–1994/95: 22 equipos a dos ruedas, campeón asciende y el reducido da el segundo ascenso ─────────
// Campeón y ganador del reducido: notas de RSSSF ("promoted to First Division"); `extras`, las secciones que tiene la página.
type NacionalBYear = {
  y: number;
  champion: string;
  reducido: string;
  // "campeonato": desempate por el título entre los dos primeros (1992/93).
  extras?: ("campeonato" | "desempate" | "promocion")[];
  notes?: TournamentConfig["notes"];
  // Descuentos de puntos, correcciones por partido, etc. de la temporada regular.
  more?: Partial<TournamentConfig>;
};
const nacionalBYear = ({ y, champion, reducido, extras = [], notes = [], more = {} }: NacionalBYear): TournamentConfig[] => [
  nacionalB(y, {
    section: /^Nacional B/,
    wiki: `Campeonato Nacional B ${y}-${String(y + 1).slice(2)}`,
    championIds: extras.includes("campeonato") ? [] : [champion],
    ...more,
    summary: `${nameOf(champion)} salió campeón y ascendió a Primera. El segundo ascenso fue para ${nameOf(reducido)}, que ganó el reducido.`,
    notes: [{ kind: "formato", text: "22 equipos, todos contra todos a dos ruedas, 2 puntos por victoria. El campeón asciende; los siguientes juegan el reducido por el segundo ascenso." }, ...notes],
  }),
  ...(extras.includes("campeonato")
    ? [
        nacionalBExtra(y, "campeonato", "Desempate por el campeonato", {
          sectionRange: { from: /^Championship Playoff/i, to: /^PLAYOFF FOR THE SECOND PROMOTION PLACE/i },
          publishedTable: [],
          playoffFrom: { date: `${y + 1}-01-01`, stage: "Final por el campeonato" },
          championIds: [champion],
          summary: `Los dos primeros terminaron igualados en puntos y jugaron una final por el título: la ganó ${nameOf(champion)}, que ascendió a Primera.`,
          notes: [],
        }),
      ]
    : []),
  nacionalBExtra(y, "reducido", "Reducido", {
    sectionRange: { from: /^PLAYOFF FOR THE SECOND PROMOTION PLACE/i, to: AFTER_REDUCIDO },
    headings: [...B_HEADINGS, ...ROUND_HEADINGS],
    championIds: [reducido],
    summary: `${nameOf(reducido)} ganó el reducido y ascendió a Primera.`,
    notes: [{ kind: "formato", text: "Eliminación directa a ida y vuelta por el segundo ascenso. Con igualdad en la serie pasaba el mejor ubicado en la tabla." }],
  }),
  ...(extras.includes("desempate")
    ? [
        nacionalBExtra(y, "desempate", "Desempate por el descenso", {
          section: /^RELEGATION PLAYOFF/i,
          publishedTable: [],
          playoffFrom: { date: `${y + 1}-01-01`, stage: "Desempate por el descenso" },
          championIds: [],
          summary: "Desempate entre los equipos que terminaron igualados en el promedio del descenso.",
          notes: [],
        }),
      ]
    : []),
  ...(extras.includes("promocion")
    ? [
        nacionalBExtra(y, "promocion", "Promoción", {
          section: /^PLAYOFF TO CONFIRM PARTICIPATION/i,
          publishedTable: [],
          playoffFrom: { date: `${y + 1}-01-01`, stage: "Promoción" },
          championIds: [],
          summary: "Serie de promoción por un lugar en la Primera B Nacional de la temporada siguiente.",
          notes: [],
        }),
      ]
    : []),
];

ASCENSO_TOURNAMENTS.push(
  ...nacionalBYear({ y: 1987, champion: "deportivo-mandiyu", reducido: "san-martin-tucuman", extras: ["promocion"] }),
  ...nacionalBYear({
    y: 1988,
    champion: "chaco-for-ever",
    reducido: "union-santa-fe",
    extras: ["promocion"],
    more: {
      pointAdjustments: [
        { teamId: "douglas-haig", points: -2, reason: "descuento que registra RSSSF (la fuente no da el motivo)" },
        { teamId: "chacarita", points: -3, reason: "descuento que registra RSSSF (la fuente no da el motivo)" },
      ],
    },
  }),
  ...nacionalBYear({
    y: 1989,
    champion: "huracan",
    reducido: "lanus",
    extras: ["promocion"],
    more: { pointAdjustments: [{ teamId: "central-cordoba-sde", points: -2, reason: "descuento que registra RSSSF (la fuente no da el motivo)" }] },
  }),
  ...nacionalBYear({
    y: 1990,
    champion: "quilmes",
    reducido: "belgrano",
    extras: ["desempate", "promocion"],
    more: {
      pointAdjustments: [{ teamId: "atlanta", points: -8, reason: "descuento posterior al partido con Cipolletti que se suspendió a los 75 minutos y no se completó" }],
      overrides: {
        // RSSSF lista 0-0, pero su propia tabla y Wikipedia dan 0-1.
        "1990-10-31 racing-cordoba quilmes": { homeGoals: 0, awayGoals: 1, note: "RSSSF lo lista 0-0, pero su propia tabla y Wikipedia dan la victoria de Quilmes 0-1." },
      },
    },
  }),
  ...nacionalBYear({
    y: 1991,
    champion: "lanus",
    reducido: "san-martin-tucuman",
    extras: ["promocion"],
    more: {
      knownTableDiffs: {
        keys: ["almirante-brown:goalsFor", "almirante-brown:goalsAgainst", "deportivo-italiano:goalsFor", "deportivo-italiano:goalsAgainst"],
        explanation:
          "RSSSF y Wikipedia publican para Almirante Brown 56 goles a favor y 38 en contra, y para Deportivo Italiano 42 y 43, pero sus partidos (iguales en las dos fuentes) suman 55-37 y 43-44. Puntos, ganados, empatados y perdidos coinciden. Quedan los partidos tal como los dan las fuentes.",
      },
      wikiErrata: {
        "RSSSF racing-cordoba 1-0 almirante-brown": "Wikipedia da 0-1; quedó el 1-0 de RSSSF, con el que cierran exactos los puntos de los dos equipos en la tabla publicada.",
      },
    },
  }),
  ...nacionalBYear({ y: 1992, champion: "banfield", reducido: "gimnasia-tiro-salta", extras: ["campeonato"] }),
  ...nacionalBYear({
    y: 1993,
    champion: "gimnasia-jujuy",
    reducido: "talleres",
    more: {
      knownTableDiffs: {
        keys: ["san-martin-tucuman:drawn", "san-martin-tucuman:lost", "san-martin-tucuman:goalsAgainst", "san-martin-tucuman:points", "sarmiento-junin:drawn", "sarmiento-junin:lost", "sarmiento-junin:goalsAgainst", "sarmiento-junin:points"],
        explanation:
          "RSSSF y Wikipedia publican la misma tabla final, pero para San Martín de Tucumán y Sarmiento de Junín no cierra con los partidos: a San Martín le sobra una derrota y un gol en contra (le falta un empate) y a Sarmiento al revés. No encontramos el partido que lo explique; quedan los resultados de RSSSF (a verificar).",
      },
      wikiErrata: {
        "RSSSF talleres 1-0 san-martin-tucuman": "Wikipedia da 1-1. A verificar: ninguno de los dos resultados hace cerrar la tabla publicada.",
        "RSSSF arsenal 1-0 sarmiento-junin": "Wikipedia da 2-1. A verificar: ninguno de los dos resultados hace cerrar la tabla publicada.",
        "RSSSF san-martin-tucuman 2-1 ituzaingo": "Wikipedia da 0-0 (la fila está pegada al cuadro del reducido). A verificar.",
      },
    },
  }),
  ...nacionalBYear({
    y: 1994,
    champion: "estudiantes",
    reducido: "colon-santa-fe",
    more: { pointAdjustments: [{ teamId: "union-santa-fe", points: -2, reason: "descuento que registra RSSSF (la fuente no da el motivo)" }] },
  }),
);

// ───────── 1995/96: Apertura y Clausura; final entre los dos ganadores, reducido y reclasificación con la B Metro ─────────
const NB9596 = "Campeonato Nacional B 1995-96";
// En la Nacional B 1995/96 "Talleres" a secas es el de Córdoba (el de Remedios de Escalada figura como "Talleres (RE)").
const A9596 = { Talleres: "talleres" };
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(1995, "apertura", "Apertura", {
    section: /^Torneo Apertura/,
    tableIndex: 0,
    wiki: NB9596,
    aliases: A9596,
    championIds: ["huracan-corrientes"],
    summary: "Huracán de Corrientes ganó el Apertura y se clasificó a la final por el ascenso con el ganador del Clausura.",
    notes: [{ kind: "formato", text: "22 equipos, todos contra todos a una rueda, 3 puntos por victoria. El ganador jugó la final con el del Clausura." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1995, "clausura", "Clausura", {
    section: /^Torneo Clausura/,
    tableIndex: 0,
    wiki: NB9596,
    aliases: A9596,
    championIds: ["talleres"],
    pointAdjustments: [{ teamId: "atletico-tucuman", points: -3, reason: "descuento que registra RSSSF (la fuente no da el motivo)" }],
    summary: "Talleres de Córdoba ganó el Clausura y se clasificó a la final por el ascenso con Huracán de Corrientes.",
    notes: [{ kind: "formato", text: "22 equipos, todos contra todos a una rueda (la segunda de la temporada), 3 puntos por victoria." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1995, "campeonato", "Final por el ascenso", {
    section: /^Championship Playoff/i,
    headings: [...B_HEADINGS, ...ROUND_HEADINGS],
    publishedTable: [],
    playoffFrom: { date: "1996-01-01", stage: "Final" },
    championIds: ["huracan-corrientes"],
    runnerUpIds: ["talleres"],
    summary: "Huracán de Corrientes empató 2-2 de local y le ganó 4-1 a Talleres en Córdoba: campeón de la Nacional B 1995/96 y ascenso a Primera.",
    notes: [{ kind: "formato", text: "Final a ida y vuelta entre los ganadores del Apertura y del Clausura." }],
  }),
  nacionalBExtra(1995, "reducido", "Reducido", {
    sectionRange: { from: /^Playoff for the Second Promotion Place/i, to: /^Reclassification tournament/i },
    headings: [...B_HEADINGS, ...ROUND_HEADINGS],
    championIds: ["union-santa-fe"],
    runnerUpIds: ["instituto"],
    summary: "Unión de Santa Fe ganó el reducido (3-1 y 0-1 en la final con Instituto) y ascendió a Primera.",
    notes: [{ kind: "formato", text: "Eliminación directa a ida y vuelta por el segundo ascenso, entre los mejores de la tabla general que no jugaron la final." }],
  }),
  nacionalBExtra(1995, "reclasificacion", "Reclasificación", {
    sectionRange: { from: /^Reclassification tournament/i },
    headings: [...B_HEADINGS, ...ROUND_HEADINGS],
    publishedTable: [],
    playoffFrom: { date: "1996-01-01", stage: "Reclasificación" },
    championIds: [],
    summary: "Torneo entre los tres peores de la Nacional B y equipos de la Primera B Metropolitana por cinco lugares en la Nacional B 1996/97. Almirante Brown y Arsenal se quedaron en la categoría; Tigre descendió; subieron Sarmiento de Junín, Almagro y Temperley.",
    notes: [{ kind: "formato", text: "Eliminación directa a ida y vuelta en tres etapas." }],
  }),
);

// ───────── 1996/97: primera fase en cuatro subzonas (Interior y Metropolitana), zona campeonato y zona permanencia ─────────
const NB9697 = "Campeonato de Primera B Nacional 1996-97";
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(1996, "primera-fase", "Primera fase", {
    sectionRange: { from: /^Sub-Zona\s*A1/i, to: /^Fourth places playoff/i },
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Subzona A1 (Interior)", "Subzona A2 (Interior)", "Subzona B1 (Metropolitana)", "Subzona B2 (Metropolitana)"],
    dedupe: true,
    wiki: NB9697,
    championIds: [],
    summary: "Primera fase en cuatro subzonas de ocho equipos (dos del Interior y dos Metropolitanas), con fechas interzonales. Los cuatro primeros de cada subzona pasaron a la zona campeonato.",
    notes: [{ kind: "formato", text: "Cuatro subzonas de 8 equipos a dos ruedas, más dos fechas interzonales; 3 puntos por victoria." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1996, "desempate", "Desempate de los cuartos", {
    section: /^Fourth places playoff/i,
    rolloverBefore: 8,
    publishedTable: [],
    playoffFrom: { date: "1996-01-01", stage: "Desempate entre los cuartos" },
    championIds: [],
    summary: "Partidos en cancha neutral entre los cuartos de las subzonas por los últimos lugares en la zona campeonato.",
    notes: [],
  }),
  nacionalBExtra(1996, "campeonato", "Zona campeonato", {
    section: /^Zona Campeonato/i,
    tableIndex: 0,
    aliases: { Talleres: "talleres" },
    pointAdjustments: [
      { teamId: "atletico-rafaela", points: -3, reason: "descuento que registra RSSSF (la fuente no da el motivo)" },
      { teamId: "san-martin-sj", points: -4, reason: "descuento que registra RSSSF (la fuente no da el motivo)" },
    ],
    wiki: NB9697,
    championIds: ["argentinos"],
    summary: "Argentinos Juniors ganó la zona campeonato y volvió a Primera.",
    notes: [{ kind: "formato", text: "14 equipos a dos ruedas, 3 puntos por victoria. El primero ascendió; los siguientes jugaron el reducido." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1996, "permanencia", "Zona permanencia", {
    sectionRange: { from: /^Zona Interior$/i, to: /^Playoff/i },
    tableIndex: [0, 1],
    groupNames: ["Zona Interior", "Zona Metropolitana"],
    wiki: NB9697,
    knownTableDiffs: {
      keys: ["instituto:goalsFor", "san-martin-tucuman:goalsAgainst", "aldosivi:points"],
      explanation:
        "La tabla de RSSSF da a Instituto 35 goles a favor y a San Martín de Tucumán 26 en contra, pero los partidos que lista suman 31 y 22 (con los mismos ganados, empatados y perdidos: puede ser un resultado mal copiado entre ellos, como el 4-1 de Instituto). También da 23 puntos a Aldosivi, cuando sus 8 victorias y 2 empates suman 26, sin explicar el descuento. Wikipedia no tiene los partidos de esta temporada para comparar. A verificar.",
    },
    championIds: [],
    summary: "Los equipos que no pasaron a la zona campeonato jugaron por la permanencia, divididos en una zona del Interior y una Metropolitana.",
    notes: [{ kind: "formato", text: "Dos zonas de 9 equipos a dos ruedas, 3 puntos por victoria." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1996, "reducido", "Reducido", {
    sectionRange: { from: /^Playoff/i },
    headings: [...ROUND_HEADINGS],
    championIds: ["gimnasia-tiro-salta"],
    runnerUpIds: ["talleres"],
    summary: "Gimnasia y Tiro de Salta ganó el reducido (1-0 de local y 0-1 en Córdoba con Talleres, y 3-1 por penales) y ascendió a Primera.",
    notes: [{ kind: "formato", text: "Eliminación directa a ida y vuelta por el segundo ascenso." }],
  }),
);

// ───────── 1997/98: Zona Interior y Zona Metropolitana; grupos campeonato y permanencia ─────────
const NB9798 = "Campeonato de Primera B Nacional 1997-98";
const A9798 = { Talleres: "talleres" };
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(1997, "primera-fase", "Primera fase", {
    sectionRange: { from: /^Zona Interior/i, to: /^Group\s+A/i },
    tableIndex: [0, 1],
    groupNames: ["Zona Interior", "Zona Metropolitana"],
    wiki: NB9798,
    aliases: A9798,
    championIds: [],
    summary: "Primera fase en dos zonas de 16 equipos, Interior y Metropolitana. Los primeros de cada una pasaron al grupo campeonato y el resto, al de permanencia.",
    notes: [{ kind: "formato", text: "Dos zonas de 16 equipos a dos ruedas, 3 puntos por victoria." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1997, "campeonato", "Grupo campeonato", {
    sectionRange: { from: /^Group\s+A/i, to: /^Championship\s+Playoff/i },
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    wiki: NB9798,
    aliases: A9798,
    championIds: [],
    summary: "Los mejores de la primera fase, en dos grupos de ocho. Los ganadores, Talleres y Belgrano, jugaron la final por el ascenso.",
    notes: [{ kind: "formato", text: "Dos grupos de 8 equipos a dos ruedas, 3 puntos por victoria." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1997, "final", "Final por el ascenso", {
    section: /^Championship\s+Playoff/i,
    publishedTable: [],
    playoffFrom: { date: "1998-01-01", stage: "Final" },
    championIds: ["talleres"],
    runnerUpIds: ["belgrano"],
    summary: "Talleres le ganó la final a Belgrano, en el clásico cordobés, y ascendió a Primera como campeón de la Nacional B 1997/98.",
    notes: [{ kind: "formato", text: "Final a ida y vuelta entre los ganadores de los dos grupos." }],
  }),
  nacionalBExtra(1997, "permanencia", "Grupo permanencia", {
    sectionRange: { from: /^Group\s+Interior/i, to: /^Playoff for the Second/i },
    tableIndex: [0, 1],
    groupNames: ["Grupo Interior", "Grupo Metropolitano"],
    wiki: NB9798,
    aliases: A9798,
    championIds: [],
    summary: "Los que no pasaron al grupo campeonato jugaron por la permanencia, en un grupo del Interior y uno Metropolitano.",
    notes: [{ kind: "formato", text: "Dos grupos de 8 equipos a dos ruedas, 3 puntos por victoria." }],
    pointsPerWin: 3,
    rolloverBefore: 8,
  }),
  nacionalBExtra(1997, "reducido", "Reducido", {
    sectionRange: { from: /^Playoff for the Second/i, to: /^Relegation\s+Playoff/i },
    headings: [...ROUND_HEADINGS],
    championIds: ["belgrano"],
    summary: "Belgrano ganó el reducido y ascendió a Primera junto con Talleres.",
    notes: [{ kind: "formato", text: "Eliminación directa a ida y vuelta por el segundo ascenso." }],
  }),
  nacionalBExtra(1997, "desempate", "Desempate por la permanencia", {
    sectionRange: { from: /^Relegation\s+Playoff/i },
    headings: [...ROUND_HEADINGS],
    publishedTable: [],
    playoffFrom: { date: "1998-01-01", stage: "Desempate por la permanencia" },
    overrides: { "1998-07-26 douglas-haig villa-mitre": { venue: "Tandil" } },
    championIds: ["douglas-haig"],
    summary: "Douglas Haig y Chaco For Ever (descendidos en la Zona Interior) jugaron con Villa Mitre y Huracán de San Rafael, del Argentino A, por el lugar 16 de la zona. Douglas Haig le ganó la final a Chaco For Ever y se quedó en la Nacional B.",
    notes: [{ kind: "formato", text: "Eliminación directa a un partido en cancha neutral." }],
  }),
);

// ───────── 1998/99 a 1999/00: Zona Metropolitana y Zona Interior; ascensos por eliminación ─────────
// Abreviaturas de las páginas de RSSSF de esos años.
const ABREV_9800: Record<string, string> = {
  "Instituto Cba": "instituto",
  "Instituto Cba.": "instituto",
  "Instituto (Córdoba)": "instituto",
  "Brown (A)": "almirante-brown-arrecifes",
  "Brown (Arr.)": "almirante-brown-arrecifes",
  "San Martín SJ": "san-martin-sj",
  "San Martín T": "san-martin-tucuman",
  "San Martín M": "san-martin-mendoza",
  "Gimnasia ER": "gimnasia-cdu",
  "Gimnasia y Tiro": "gimnasia-tiro-salta",
  "Central Córdoba (R)": "central-cordoba-rosario",
  "Estudiantes BA": "estudiantes-ba",
  "Estudiantes (Bs. Aires)": "estudiantes-ba",
  "Atlético (Tucumán)": "atletico-tucuman",
  "Atlético (Rafaela)": "atletico-rafaela",
  "Juv. Antoniana (Salta)": "juventud-antoniana",
  "Juventud Antoniana": "juventud-antoniana",
  "Aldosivi(Mar del Plata)": "aldosivi",
  "Aldosivi": "aldosivi",
  "Alte. Brown (Arrecifes)": "almirante-brown-arrecifes",
  "Deportivo Español": "deportivo-espanol",
  "Huracán (Cts)": "huracan-corrientes",
  Olimpo: "olimpo",
  Cipolletti: "cipolletti",
  "Central Córdoba (Ros)": "central-cordoba-rosario",
  // Errata de RSSSF.
  "San Maartín T": "san-martin-tucuman",
  "Gimnasia (Entre Ríos)": "gimnasia-cdu",
  "Gimnasia (CdU)": "gimnasia-cdu",
  "Douglas Haig(Pergamino)": "douglas-haig",
  "San Martín (M)": "san-martin-mendoza",
  "San Martín (SJ)": "san-martin-sj",
  "San Martín (T)": "san-martin-tucuman",
};
const H9800 = [/^Zona Metropolitana/i, /^Zona Interior/i, /^First Promotion Playoff/i, /^Second Promotion Playoff/i, /^Promotion\/Relegation Playoff/i];
const R9800 = [/^Semifinals:?$/i, /^Final:?$/i, /^First Round:?$/i, /^Second Round:?$/i, /^Quarterfinals:?$/i];
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(1998, "primera-fase", "Fase regular", {
    file: "arg2-99.html",
    sectionRange: { from: /^Zona Metropolitana/i, to: /^First Promotion Playoff/i },
    headings: H9800,
    tableIndex: [0, 1],
    groupNames: ["Zona Metropolitana", "Zona Interior"],
    aliases: ABREV_9800,
    rolloverBefore: 8,
    pointsPerWin: 3,
    pointAdjustments: [{ teamId: "deportivo-moron", points: -5, reason: "por incidentes en la fecha 13 (RSSSF)" }],
    acceptTableDiffs:
      "RSSSF y Wikipedia publican la misma tabla final, pero algunos resultados de la lista de partidos de RSSSF no coinciden con ella (Wikipedia no tiene los partidos de la fase regular de esta temporada). En esta temporada RSSSF da el fin de semana de cada fecha y no el día de cada partido: se muestra el primer día.",
    overrides: {
      "1998-11-07 chacarita deportivo-moron": {
        date: "1998-12-08",
        bothLost: true,
        note: "Suspendido a los 37 minutos, 0-0, por incidentes. La liga se lo dio por perdido a los dos (0-1).",
      },
    },
    // Partidos con "abd" o "awd" en lugar del resultado: el lector no los toma.
    extraMatches: [
      {
        id: "b-nacional-1998-99-extra-1",
        date: "1998-11-12",
        stage: "Zona Interior · Fecha 13",
        phase: "league",
        homeId: "gimnasia-tiro-salta",
        awayId: "douglas-haig",
        homeGoals: 1,
        awayGoals: 1,
        note: "Suspendido a los 69 minutos, 1-1, por incidentes. RSSSF anota que se le dio 0-1 a Douglas Haig, pero en su tabla figura como empate 1-1.",
      },
      {
        id: "b-nacional-1998-99-extra-2",
        date: "1998-11-26",
        stage: "Zona Interior · Fecha 15",
        phase: "league",
        homeId: "douglas-haig",
        awayId: "aldosivi",
        homeGoals: 4,
        awayGoals: 2,
        splitAward: { home: [0, 2], away: [4, 2] },
        note: "Suspendido a los 70 minutos, 4-2, por incidentes. La liga se lo dio por perdido a los dos: 0-2 a Douglas Haig y 2-4 a Aldosivi.",
      },
      {
        id: "b-nacional-1998-99-extra-3",
        date: "1999-03-20",
        stage: "Zona Metropolitana · Fecha 22",
        phase: "league",
        homeId: "all-boys",
        awayId: "nueva-chicago",
        homeGoals: 3,
        awayGoals: 0,
        note: "Suspendido a los 87 minutos, 3-0, por incidentes. Quedó el resultado.",
      },
    ],
    championIds: [],
    summary: "Dos zonas, Metropolitana (17 equipos) e Interior (16). Los dos primeros de cada una jugaron por el campeonato y el primer ascenso; casi todos los demás, el reducido por el segundo.",
    notes: [{ kind: "formato", text: "Dos zonas a dos ruedas, 3 puntos por victoria." }],
  }),
  nacionalBExtra(1998, "campeonato", "Final por el campeonato", {
    file: "arg2-99.html",
    sectionRange: { from: /^First Promotion Playoff/i, to: /^Second Promotion Playoff/i },
    headings: [...H9800, ...R9800],
    aliases: ABREV_9800,
    championIds: ["instituto"],
    runnerUpIds: ["chacarita"],
    summary: "Instituto de Córdoba ganó el cuadrangular final (3-0 y 0-1 con Chacarita en la final): campeón de la Nacional B 1998/99 y ascenso a Primera.",
    notes: [
      { kind: "formato", text: "Los dos primeros de cada zona, eliminación a ida y vuelta. Con igualdad en la serie pasaba el de mejor campaña." },
      { kind: "fuentes", text: "Los seis partidos coinciden con el cuadro de Wikipedia (revisado a mano)." },
    ],
  }),
  nacionalBExtra(1998, "reducido", "Reducido", {
    file: "arg2-99.html",
    sectionRange: { from: /^Second Promotion Playoff/i, to: /^Promotion\/Relegation Playoff/i },
    headings: [...H9800, ...R9800],
    aliases: ABREV_9800,
    wiki: "Campeonato de Primera B Nacional 1998-99",
    championIds: ["chacarita"],
    runnerUpIds: ["juventud-antoniana"],
    summary: "Chacarita, que había perdido la final por el campeonato, entró en los cuartos del reducido y lo ganó (1-1 y 1-0 con Juventud Antoniana): segundo ascenso a Primera.",
    notes: [
      { kind: "formato", text: "Eliminación a ida y vuelta. Con igualdad en la serie pasaba el de mejor campaña." },
      { kind: "dato", text: "La vuelta entre Nueva Chicago y Deportivo Español no se jugó: Deportivo Español había quebrado y pasó Nueva Chicago (la ida fue 1-1)." },
    ],
  }),
  nacionalBExtra(1998, "promocion", "Promoción con el Argentino A", {
    file: "arg2-99.html",
    sectionRange: { from: /^Promotion\/Relegation Playoff/i },
    headings: [...H9800, ...R9800],
    aliases: ABREV_9800,
    publishedTable: [],
    championIds: ["villa-mitre"],
    summary: "Douglas Haig y Huracán de Corrientes, los dos últimos del promedio de la Zona Interior, jugaron con General Paz Juniors y Villa Mitre, del Argentino A. Villa Mitre ganó y subió; Douglas Haig y Huracán descendieron.",
    notes: [{ kind: "formato", text: "Semifinales y final a un partido." }],
  }),
);

// ───────── 1999/2000 ─────────
const ABREV_0001: Record<string, string> = {
  ...ABREV_9800,
  "San Martin M": "san-martin-mendoza",
  "San Martín (Mendoza)": "san-martin-mendoza",
  "San Martín (San Juan)": "san-martin-sj",
  "San Martín (Tucumán)": "san-martin-tucuman",
  "I. Rivadavia": "independiente-rivadavia",
  "Ind. Rivadavia": "independiente-rivadavia",
  "Ind. Rivadavia (Mendoza)": "independiente-rivadavia",
  "Independiente Rivadavia": "independiente-rivadavia",
  "J. Antoniana": "juventud-antoniana",
  "Atl. Rafaela": "atletico-rafaela",
  "Atl. Rafaela (Santa Fe)": "atletico-rafaela",
  "Racing (Córdoba)": "racing-cordoba",
  "Racing Cba": "racing-cordoba",
  "Villa Mitre (B. Blanca)": "villa-mitre",
  "Belgrano Cba": "belgrano",
  "Godoy Cruz (Mendoza)": "godoy-cruz",
  "Gimnasia y Tiro (Salta)": "gimnasia-tiro-salta",
  "Aldosivi (Mar del Plata)": "aldosivi",
  "Cipolletti (Río Negro)": "cipolletti",
  "Olimpo (Bahía Blanca)": "olimpo",
  "Argentino (Rosario)": "argentino-rosario",
  // Formas cortas de la página de 1999/2000 (todas comprobadas con los rivales de cada fecha).
  "A. Brown": "almirante-brown-arrecifes",
  "A. Brown (A)": "almirante-brown-arrecifes",
  "A. Brown (Arrecifes)": "almirante-brown-arrecifes",
  "Brown de Arrecifes": "almirante-brown-arrecifes",
  Brown: "almirante-brown-arrecifes",
  "A. de Rosario": "argentino-rosario",
  Argentino: "argentino-rosario",
  "Argentino (R)": "argentino-rosario",
  "Argentino de Rosario": "argentino-rosario",
  "Argentino R.": "argentino-rosario",
  Antoniana: "juventud-antoniana",
  Juventud: "juventud-antoniana",
  "Juv. Antoniana": "juventud-antoniana",
  "Atl. Tucumán": "atletico-tucuman",
  "Atl.Tucumán": "atletico-tucuman",
  Tucuman: "atletico-tucuman",
  Rafaela: "atletico-rafaela",
  "C. Córdoba": "central-cordoba-rosario",
  "C. Córdoba (Rosario)": "central-cordoba-rosario",
  "Cent. Cordoba": "central-cordoba-rosario",
  "Cent. Córdoba": "central-cordoba-rosario",
  "Central Córd.": "central-cordoba-rosario",
  "Central Córdoba": "central-cordoba-rosario",
  "Central Córdoba (Rosario)": "central-cordoba-rosario",
  "D y Justicia": "defensa-y-justicia",
  "D. y Justicia": "defensa-y-justicia",
  "D. Y Justicia": "defensa-y-justicia",
  "Def. y Justicia": "defensa-y-justicia",
  "Defensa y J.": "defensa-y-justicia",
  "Dep. Español": "deportivo-espanol",
  Español: "deportivo-espanol",
  "Dep. Morón": "deportivo-moron",
  Morón: "deportivo-moron",
  Moron: "deportivo-moron",
  "Gimnasia y T": "gimnasia-tiro-salta",
  "Gimnasia y T.": "gimnasia-tiro-salta",
  Huracan: "huracan",
  Independiente: "independiente-rivadavia",
  "Independiente Riv": "independiente-rivadavia",
  Rivadavia: "independiente-rivadavia",
  Olímpo: "olimpo",
  "Olimpo BB": "olimpo",
  Racing: "racing-cordoba",
  "Racing (Cba.)": "racing-cordoba",
  "Racing (Cba)": "racing-cordoba",
  "Racing Cba.": "racing-cordoba",
  "Racing de Córdoba": "racing-cordoba",
  "San Martin SJ": "san-martin-sj",
  "San Martin T": "san-martin-tucuman",
};
const H0001 = [/^Zona Metropolitana/i, /^Zona Interior/i, /^Promotion Playoffs/i, /^First Promotion Playoff/i, /^Second Promotion Playoff/i, /^Third and Fourth Promotion/i];
const DED_INC = (round: number) => `por incidentes en la fecha ${round} (RSSSF)`;
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(1999, "primera-fase", "Fase regular", {
    file: "arg2-00.html",
    sectionRange: { from: /^Zona Metropolitana/i, to: /^Promotion Playoffs/i },
    headings: H0001,
    tableIndex: [0, 1],
    groupNames: ["Zona Metropolitana", "Zona Interior"],
    wiki: "Campeonato de Primera B Nacional 1999-00",
    aliases: ABREV_0001,
    rolloverBefore: 8,
    pointsPerWin: 3,
    pointAdjustments: [
      { teamId: "banfield", points: -3, reason: DED_INC(12) },
      { teamId: "atletico-tucuman", points: -9, reason: "por incidentes en las fechas 17 (6 puntos) y 19 (3 puntos) (RSSSF)" },
      { teamId: "cipolletti", points: -3, reason: DED_INC(13) },
    ],
    acceptTableDiffs: "RSSSF da el fin de semana de cada fecha y no siempre el día de cada partido (se muestra el primer día), y algunos resultados de su lista no coinciden con su tabla final. Wikipedia no tiene los partidos de la fase regular de esta temporada.",
    championIds: [],
    summary: "Dos zonas, Metropolitana (18 equipos) e Interior (16). Los dos primeros de cada una jugaron por el campeonato y el primer ascenso; del 3.º al 6.º, el reducido.",
    notes: [
      { kind: "formato", text: "Dos zonas a dos ruedas, 3 puntos por victoria." },
      { kind: "dato", text: "Quilmes–Nueva Chicago (Zona Metropolitana) se suspendió por incidentes y RSSSF no da el resultado: no está cargado." },
    ],
  }),
  nacionalBExtra(1999, "campeonato", "Final por el campeonato", {
    file: "arg2-00.html",
    sectionRange: { from: /^First Promotion Playoff/i, to: /^Second Promotion Playoff/i },
    headings: [...H0001, ...R9800],
    aliases: ABREV_0001,
    championIds: ["huracan"],
    runnerUpIds: ["quilmes"],
    summary: "Huracán ganó el cuadrangular final (1-0 en cancha de Quilmes y 1-1 de local): campeón de la Nacional B 1999/2000 y ascenso a Primera.",
    notes: [
      { kind: "formato", text: "Los dos primeros de cada zona, eliminación a ida y vuelta. Con igualdad en la serie pasaba el de mejor campaña." },
      { kind: "fuentes", text: "Los seis partidos coinciden con el cuadro de Wikipedia (revisado a mano)." },
    ],
  }),
  nacionalBExtra(1999, "reducido", "Reducido", {
    file: "arg2-00.html",
    sectionRange: { from: /^Second Promotion Playoff/i, to: /^Third and Fourth Promotion/i },
    headings: [...H0001, ...R9800],
    aliases: ABREV_0001,
    championIds: ["los-andes"],
    runnerUpIds: ["quilmes"],
    summary: "Los Andes ganó el reducido (2-0 y 1-1 con Quilmes en la final) y ascendió a Primera. Quilmes y Almagro jugaron después la promoción con Belgrano e Instituto: subió Almagro.",
    notes: [{ kind: "formato", text: "Eliminación a ida y vuelta. Con igualdad en la serie pasaba el de mejor campaña." }],
  }),
);

// ───────── 2000/01 ─────────
const ABREV_0102: Record<string, string> = {
  ...ABREV_0001,
  "Atlético Rafarela": "atletico-rafaela",
  "Atlético Rafaela (Santa Fe)": "atletico-rafaela",
  "Atlético  Tucumán": "atletico-tucuman",
  Estudiantes: "estudiantes-ba",
  "Estudiantes (BA)": "estudiantes-ba",
  "Gimnasia J": "gimnasia-jujuy",
  "Gimnasia (Jujuy)": "gimnasia-jujuy",
  "Gimnasia (Entre Ríos)": "gimnasia-cdu",
  "Gral. Paz Juniors": "general-paz-juniors",
  "Gral. Paz Juniors (Córdoba)": "general-paz-juniors",
  "Indep. Rivadavia": "independiente-rivadavia",
  "Indep. Rivadavia (Mendoza)": "independiente-rivadavia",
  "Independiente Riv.": "independiente-rivadavia",
  "Cent. Córdoba (R)": "central-cordoba-rosario",
  "Cent. Córdoba (Rosario)": "central-cordoba-rosario",
  "Villa Mitre (Bahía Blanca)": "villa-mitre",
  "Juventud Antoniana (Salta)": "juventud-antoniana",
  "Defensa  y Justicia": "defensa-y-justicia",
  "Argentinos Jrs": "argentinos",
  "Ferro Carril Oeste": "ferro",
  "Alte. Brown (Arrecifes)": "almirante-brown-arrecifes",
  "Brown (Arrecifes)": "almirante-brown-arrecifes",
};
const H0102 = [/^Zona Metropolitana/i, /^Zona Interior/i, /^General Relegation Table/i, /^First Promotion Playoff/i, /^Second Promotion Playoff/i, /^Third and Fourth Promotion/i];
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(2000, "primera-fase", "Fase regular", {
    file: "arg2-01.html",
    sectionRange: { from: /^Zona Metropolitana/i, to: /^General Relegation Table/i },
    headings: H0102,
    tableIndex: [0, 1],
    groupNames: ["Zona Metropolitana", "Zona Interior"],
    wiki: "Campeonato de Primera B Nacional 2000-01",
    aliases: ABREV_0102,
    rolloverBefore: 8,
    pointsPerWin: 3,
    overrides: {
      // "[Amato]" en el mismo renglón es el goleador, no la cancha.
      "2001-02-21 san-martin-tucuman instituto": { venue: undefined, note: "Goles: Amato." },
    },
    extraMatches: [
      {
        id: "b-nacional-2000-01-extra-1",
        date: "2000-12-03",
        stage: "Zona Interior",
        phase: "league",
        homeId: "general-paz-juniors",
        awayId: "gimnasia-cdu",
        homeGoals: 2,
        awayGoals: 4,
        awardedTo: "gimnasia-cdu",
        note: "Suspendido a los 85 minutos, 2-4, por incidentes. La liga se lo dio 0-4 a Gimnasia.",
      },
    ],
    acceptTableDiffs: "Algunos resultados de la lista de partidos de RSSSF no coinciden con su tabla final, y Wikipedia no tiene los partidos de esta temporada.",
    championIds: [],
    summary: "Dos zonas, Metropolitana (13 equipos) e Interior (17). Los dos primeros de cada una jugaron por el campeonato y el primer ascenso; del 3.º al 6.º, el reducido.",
    notes: [
      { kind: "formato", text: "Dos zonas a dos ruedas, 3 puntos por victoria." },
      { kind: "dato", text: "A Banfield le habían descontado 3 puntos y después se los devolvieron (RSSSF)." },
      { kind: "dato", text: "Villa Mitre–Gimnasia de Jujuy se suspendió a los 77 minutos (1-0) por incidentes y RSSSF no da cómo terminó: no está cargado. Platense–All Boys se suspendió y se volvió a jugar el 20 de marzo (0-1)." },
      { kind: "dato", text: "Villa Mitre–Gimnasia de Jujuy se suspendió a los 77 minutos (1-0) por incidentes y RSSSF no da cómo terminó: no está cargado. Platense–All Boys se suspendió y se volvió a jugar el 20 de marzo (0-1)." },
    ],
  }),
  nacionalBExtra(2000, "campeonato", "Final por el campeonato", {
    file: "arg2-01.html",
    sectionRange: { from: /^First Promotion Playoff/i, to: /^Second Promotion Playoff/i },
    headings: [...H0102, ...R9800],
    aliases: ABREV_0102,
    championIds: ["banfield"],
    runnerUpIds: ["quilmes"],
    summary: "Banfield ganó el cuadrangular final (2-1 y 4-2 con Quilmes en la final): campeón de la Nacional B 2000/01 y ascenso a Primera.",
    notes: [{ kind: "formato", text: "Los dos primeros de cada zona, eliminación a ida y vuelta. Con igualdad en la serie pasaba el de mejor campaña." }],
  }),
  nacionalBExtra(2000, "reducido", "Reducido", {
    file: "arg2-01.html",
    sectionRange: { from: /^Second Promotion Playoff/i, to: /^Third and Fourth Promotion/i },
    headings: [...H0102, ...R9800],
    aliases: ABREV_0102,
    championIds: ["nueva-chicago"],
    runnerUpIds: ["instituto"],
    summary: "Nueva Chicago ganó el reducido (1-0 y 3-2 con Instituto en la final) y ascendió a Primera.",
    notes: [
      { kind: "formato", text: "Eliminación a ida y vuelta. Con igualdad en la serie pasaba el de mejor campaña." },
      { kind: "dato", text: "La vuelta San Martín de Mendoza–Platense de la primera ronda se suspendió y RSSSF no da el resultado: no está cargada. Pasó San Martín." },
    ],
  }),
);

// ───────── 2001/02: Apertura de 25 equipos (el campeón ascendió) y Clausura en tres grupos ─────────
const ABREV_0203: Record<string, string> = {
  ...ABREV_0102,
  "Almirante Brown (Arr.)": "almirante-brown-arrecifes",
  "Alte. Brown (Arr.)": "almirante-brown-arrecifes",
  "Atlético Rafela": "atletico-rafaela",
  "C. Córdoba (R)": "central-cordoba-rosario",
  "Central Cordoba": "central-cordoba-rosario",
  "Gimnasia (ER)": "gimnasia-cdu",
  "Gimnasia (J)": "gimnasia-jujuy",
  "Godoy Cuz": "godoy-cruz",
  // Wikipedia
  "Alte. Brown (A)": "almirante-brown-arrecifes",
  "Alte.Brown (A)": "almirante-brown-arrecifes",
  "Def.y Justicia": "defensa-y-justicia",
  "Def.de Belgrano": "defensores-belgrano",
  "Indep.Rivadavia": "independiente-rivadavia",
  "C.Córdoba (R)": "central-cordoba-rosario",
  "Juv.Antoniana": "juventud-antoniana",
  "Huracán (TA)": "huracan-tres-arroyos",
  "Huracán (Tres Arroyos)": "huracan-tres-arroyos",
  "Instituto (Cba)": "instituto",
  "Racing (Cba)": "racing-cordoba",
  "San Martín (M)": "san-martin-mendoza",
  "San Martín (SJ)": "san-martin-sj",
  "Atlético (Tucumán)": "atletico-tucuman",
  "Unión (SF)": "union-santa-fe",
};
const H0203 = [/^Torneo Apertura/i, /^Torneo Clausura/i, /^General Aggregate Table/i, /^Second Promotion Playoff/i, /^Third and Fourth Promotion/i];
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(2001, "apertura", "Apertura", {
    file: "arg2-02.html",
    sectionRange: { from: /^Torneo Apertura/i, to: /^Torneo Clausura/i },
    headings: H0203,
    tableIndex: 0,
    wiki: "Campeonato de Primera B Nacional 2001-02",
    aliases: ABREV_0203,
    rolloverBefore: 8,
    pointsPerWin: 3,
    // "[Dec 1]Godoy Cruz  3-1  Defensa y Justicia": con la fecha pegada al nombre, el lector no toma el renglón.
    extraMatches: [
      {
        id: "b-nacional-2001-02-apertura-extra-1",
        date: "2001-12-01",
        stage: "Fecha 21",
        phase: "league",
        homeId: "godoy-cruz",
        awayId: "defensa-y-justicia",
        homeGoals: 3,
        awayGoals: 1,
        note: "Goles: Cabrera (2), Carnero - Herrera.",
      },
    ],
    knownTableDiffs: {
      keys: ["independiente-rivadavia:goalsFor", "tigre:goalsAgainst"],
      explanation: "La tabla de RSSSF da a Independiente Rivadavia un gol a favor menos y a Tigre uno en contra menos que la suma de sus partidos, que coinciden todos con Wikipedia: el error es de la tabla (probablemente en el Tigre–Independiente Rivadavia).",
    },
    championIds: ["olimpo"],
    summary: "Olimpo de Bahía Blanca ganó el Apertura y ascendió directo a Primera.",
    notes: [{ kind: "formato", text: "25 equipos, todos contra todos a una rueda, 3 puntos por victoria. El campeón ascendía." }],
  }),
  nacionalBExtra(2001, "clausura", "Clausura", {
    file: "arg2-02.html",
    sectionRange: { from: /^Torneo Clausura/i, to: /^General Aggregate Table/i },
    headings: [...H0203, /^Group [ABC]\s*$/i],
    tableIndex: [0, 1, 2],
    groupNames: ["Grupo A", "Grupo B", "Grupo C"],
    aliases: ABREV_0203,
    rolloverBefore: 8,
    pointsPerWin: 3,
    acceptTableDiffs: "Wikipedia no tiene los partidos del Clausura de esta temporada.",
    championIds: [],
    summary: "Sin Olimpo, ya ascendido, los 24 equipos restantes jugaron el Clausura en tres grupos de ocho. Los ganadores (Arsenal, Gimnasia de Entre Ríos y Godoy Cruz) fueron al reducido junto con los mejores de la tabla general.",
    notes: [
      { kind: "formato", text: "Tres grupos de 8 equipos a dos ruedas, 3 puntos por victoria." },
      { kind: "dato", text: "A Quilmes le descontaron 3 puntos en la tabla general de la temporada (RSSSF)." },
    ],
  }),
  nacionalBExtra(2001, "reducido", "Reducido", {
    file: "arg2-02.html",
    sectionRange: { from: /^Second Promotion Playoff/i, to: /^Third and Fourth Promotion/i },
    headings: [...H0203, /^Quarter-Finals\s*$/i, /^Semi-Finals\s*$/i, /^Final\s*$/i],
    aliases: ABREV_0203,
    championIds: ["arsenal"],
    runnerUpIds: ["gimnasia-cdu"],
    summary: "Arsenal ganó el reducido (2-1 en Concepción del Uruguay y 1-1 de local con Gimnasia de Entre Ríos) y ascendió a Primera por primera vez.",
    notes: [{ kind: "formato", text: "Los ganadores de los grupos del Clausura y los mejores de la tabla general, eliminación a ida y vuelta." }],
  }),
);

// ───────── 2002/03 a 2005/06: 20 equipos, Apertura y Clausura; la tabla general (las dos ruedas) da el campeón ─────────
const ABREV_0306: Record<string, string> = {
  ...ABREV_0203,
  "Com. de Act. Infantiles": "cai",
  "C. de Act. Infantiles (Chubut)": "cai",
  "C. de Act. Inf.": "cai",
  "Intituto (Cba)": "instituto",
  "Belgrano (Cba)": "belgrano",
  "Belgrano (Córdoba)": "belgrano",
  "San Martín (Mza)": "san-martin-mendoza",
  "Talleres (Cba)": "talleres",
  "Atlético de Rafaela": "atletico-rafaela",
  "Atlético de Rafaela (Santa Fe)": "atletico-rafaela",
  "Almirante Brown (A)": "almirante-brown-arrecifes",
  "Almirante Brown (Arrecifes)": "almirante-brown-arrecifes",
  "Huracán (Tres Arroyos)": "huracan-tres-arroyos",
  "Juventud Antoniana (Salta)": "juventud-antoniana",
  "Godoy Cruz (Mendoza)": "godoy-cruz",
  // Wikipedia
  "Atl.de Rafaela": "atletico-rafaela",
  "Defensa y Just.": "defensa-y-justicia",
  CAI: "cai",
  "Comisión de Actividades Infantiles": "cai",
  "Def. de Belgrano": "defensores-belgrano",
  "Argentinos Jrs.": "argentinos",
  "Alm. Brown (A)": "almirante-brown-arrecifes",
};
const H0306 = [/^Torneo Apertura/i, /^Torneo Clausura/i, /^General Table/i, /^Second Promotion Playoff/i, /^Third (and Fourth )?Promotion/i, /^Relegation Table/i, /^Relegation Playoff/i];
ASCENSO_TOURNAMENTS.push(
  nacionalBExtra(2002, "apertura", "Apertura", {
    file: "arg2-03.html",
    sectionRange: { from: /^Torneo Apertura/i, to: /^Torneo Clausura/i },
    headings: H0306,
    tableIndex: 0,
    wiki: "Campeonato de Primera B Nacional 2002-03",
    aliases: { ...ABREV_0306, "San Martín": "san-martin-sj" },
    rolloverBefore: 8,
    pointsPerWin: 3,
    extraMatches: [
      {
        id: "b-nacional-2002-03-apertura-extra-1",
        date: "2002-08-26",
        stage: "Fecha 1",
        phase: "league",
        homeId: "el-porvenir",
        awayId: "cai",
        homeGoals: 0,
        awayGoals: 0,
        note: "Suspendido a los 78 minutos, 0-0, por un corte de luz. Quedó 0-0.",
      },
    ],
    acceptTableDiffs: "Los partidos coinciden con Wikipedia (189 de 190): las diferencias de goles son de la tabla publicada por RSSSF.",
    championIds: ["atletico-rafaela"],
    summary: "Atlético de Rafaela ganó el Apertura. También ganó el Clausura y la tabla general: campeón de la Nacional B 2002/03 y ascenso a Primera.",
    notes: [{ kind: "formato", text: "20 equipos, todos contra todos a una rueda, 3 puntos por victoria. El campeón de la temporada sale de la tabla general (Apertura + Clausura)." }],
  }),
  nacionalBExtra(2002, "clausura", "Clausura", {
    file: "arg2-03.html",
    sectionRange: { from: /^Torneo Clausura/i, to: /^General Table/i },
    headings: H0306,
    tableIndex: 0,
    wiki: "Campeonato de Primera B Nacional 2002-03",
    aliases: { ...ABREV_0306, "San Martín": "san-martin-sj" },
    rolloverBefore: 8,
    pointsPerWin: 3,
    acceptTableDiffs: "Defensa y Justicia–Gimnasia de Jujuy figura 0-0 en RSSSF y 3-2 en Wikipedia; ninguno de los dos hace cerrar la tabla de Defensa.",
    wikiErrata: { "RSSSF defensa-y-justicia 0-0 gimnasia-jujuy": "Wikipedia da 3-2. A verificar: ninguno de los dos resultados hace cerrar la tabla publicada." },
    championIds: ["atletico-rafaela"],
    summary: "Atlético de Rafaela ganó también el Clausura y fue campeón de la temporada con 77 puntos en la tabla general. Ascendió a Primera; Quilmes lo acompañó por el reducido.",
    notes: [{ kind: "formato", text: "La segunda rueda de la temporada, con las mismas reglas." }],
  }),
  nacionalBExtra(2002, "reducido", "Reducido", {
    file: "arg2-03.html",
    section: /^Second Promotion Playoff/i,
    headings: H0306,
    aliases: ABREV_0306,
    championIds: ["quilmes"],
    runnerUpIds: ["argentinos"],
    summary: "El 2.º y el 3.º de la tabla general jugaron por el segundo ascenso: Quilmes le ganó 1-0 a Argentinos y empató 0-0 en La Paternal. Argentinos fue a la promoción con Nueva Chicago y perdió.",
    notes: [{ kind: "formato", text: "Final a ida y vuelta entre el 2.º y el 3.º de la tabla general." }],
  }),
  nacionalBExtra(2002, "promocion", "Promoción con la B Metropolitana y el Argentino A", {
    file: "arg2-03.html",
    section: /^Relegation Playoff/i,
    headings: H0306,
    aliases: ABREV_0306,
    publishedTable: [],
    playoffFrom: { date: "2003-01-01", stage: "Promoción" },
    championIds: [],
    summary: "El Porvenir jugó con All Boys (de la B Metropolitana) y la Comisión de Actividades Infantiles con Racing de Córdoba (del Argentino A) por su lugar en la Nacional B. Los dos se quedaron en la categoría.",
    notes: [{ kind: "formato", text: "Series a ida y vuelta." }],
  }),
);
