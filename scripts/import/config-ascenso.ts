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

// Apertura o Clausura de una temporada de 20 equipos (2002/03–2005/06).
const abTorneo = (
  y: number,
  key: "apertura" | "clausura",
  file: string,
  aliases: Record<string, string>,
  championId: string,
  summary: string,
  more: Partial<TournamentConfig> = {},
): TournamentConfig =>
  nacionalBExtra(y, key, key === "apertura" ? "Apertura" : "Clausura", {
    file,
    sectionRange: key === "apertura" ? { from: /^Torneo Apertura/i, to: /^Torneo Clausura/i } : { from: /^Torneo Clausura/i, to: /^General Table/i },
    headings: H0306,
    tableIndex: 0,
    wiki: `Campeonato de Primera B Nacional ${y}-${String(y + 1).slice(2)}`,
    aliases,
    rolloverBefore: 8,
    pointsPerWin: 3,
    championIds: [championId],
    summary,
    notes: [{ kind: "formato", text: "20 equipos, todos contra todos a una rueda, 3 puntos por victoria. El campeón de la temporada sale de la tabla general (Apertura + Clausura) o de una final entre los ganadores." }],
    ...more,
  });

// ───────── 2003/04 ─────────
const A0304 = {
  ...ABREV_0306,
  Huracán: "huracan",
  "Huracán (Buenos Aires)": "huracan",
  "Huracán  (Buenos Aires)": "huracan",
  "Instituto (Córdoaba)": "instituto",
  "TAalleres (Córdoba)": "talleres",
  "Talleres (Córdoba)": "talleres",
  "Atlético (Tucumán)": "atletico-tucuman",
  "Unión (Santa Fe)": "union-santa-fe",
  "Tiro Federal": "tiro-federal-rosario",
  "Tiro Federal (Rosario)": "tiro-federal-rosario",
  "C. de Act. Infantiles": "cai",
  "Gimnasia (Entre Ríos)": "gimnasia-cdu",
  "Tiro Federal (R)": "tiro-federal-rosario",
};
ASCENSO_TOURNAMENTS.push(
  abTorneo(2003, "apertura", "arg2-04.html", A0304, "instituto", "Instituto de Córdoba ganó el Apertura y después le ganó la final por el campeonato a Almagro, ganador del Clausura: campeón de la Nacional B 2003/04 y ascenso a Primera.", {
    wiki: undefined,
    acceptTableDiffs: "Wikipedia no tiene los partidos de la fase regular de esta temporada. En la lista de RSSSF falta el partido entre Gimnasia de Jujuy y Tiro Federal, y algunos resultados no coinciden con su tabla.",
  }),
  abTorneo(2003, "clausura", "arg2-04.html", A0304, "almagro", "Almagro ganó el Clausura. Perdió la final por el campeonato con Instituto, pero ascendió igual: le ganó la serie por el segundo ascenso a Huracán de Tres Arroyos.", {
    wiki: undefined,
    acceptTableDiffs: "Wikipedia no tiene los partidos de la fase regular de esta temporada, y algunos resultados de la lista de RSSSF no coinciden con su tabla.",
  }),
  nacionalBExtra(2003, "final", "Final por el campeonato", {
    file: "arg2-04.html",
    section: /^First Promotion Playoff/i,
    headings: [...H0306, /^First Promotion Playoff/i, /^Third Promotion Playoff Qualifying/i, /^Promotion Playoff/i],
    aliases: A0304,
    wiki: "Campeonato de Primera B Nacional 2003-04",
    championIds: ["instituto"],
    runnerUpIds: ["almagro"],
    summary: "Instituto perdió 1-0 en cancha de Almagro y ganó 2-0 de local: campeón de la Nacional B 2003/04 y ascenso a Primera.",
    notes: [{ kind: "formato", text: "Final a ida y vuelta entre los ganadores del Apertura y del Clausura." }],
  }),
  nacionalBExtra(2003, "reducido", "Segundo ascenso", {
    file: "arg2-04.html",
    section: /^Second Promotion Playoff/i,
    headings: [...H0306, /^First Promotion Playoff/i, /^Third Promotion Playoff Qualifying/i, /^Promotion Playoff/i],
    aliases: A0304,
    wiki: "Campeonato de Primera B Nacional 2003-04",
    championIds: ["almagro"],
    runnerUpIds: ["huracan-tres-arroyos"],
    summary: "Almagro, perdedor de la final, le ganó la serie a Huracán de Tres Arroyos (primero de la tabla general) y ascendió a Primera. Huracán fue a la promoción y también subió.",
    notes: [{ kind: "formato", text: "Serie a ida y vuelta entre el perdedor de la final y el mejor de la tabla general." }],
  }),
  nacionalBExtra(2003, "clasificacion", "Clasificación a la promoción", {
    file: "arg2-04.html",
    section: /^Third Promotion Playoff Qualifying/i,
    headings: [...H0306, /^First Promotion Playoff/i, /^Third Promotion Playoff Qualifying/i, /^Promotion Playoff/i],
    aliases: A0304,
    publishedTable: [],
    playoffFrom: { date: "2004-01-01", stage: "Clasificación a la promoción" },
    championIds: ["argentinos"],
    summary: "Argentinos Juniors le ganó la serie a Godoy Cruz por el lugar en la promoción con Talleres de Córdoba, que después ganó.",
    notes: [{ kind: "formato", text: "Serie a ida y vuelta." }],
  }),
  nacionalBExtra(2003, "promocion", "Promoción con la B Metropolitana y el Argentino A", {
    file: "arg2-04.html",
    sectionRange: { from: /^Relegation Table \(Zona Metropolitana\)/i },
    headings: [...H0306, /^Relegation Table/i],
    aliases: A0304,
    publishedTable: [],
    tableIndex: [],
    playoffFrom: { date: "2004-01-01", stage: "Promoción" },
    championIds: [],
    summary: "Unión de Santa Fe jugó con Tristán Suárez (de la B Metropolitana) y la Comisión de Actividades Infantiles con Atlético Tucumán (del Argentino A) por su lugar en la Nacional B. Unión y la CAI se quedaron en la categoría.",
    notes: [{ kind: "formato", text: "Series a ida y vuelta." }],
  }),
);

// ───────── 2004/05 ─────────
const MES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// El Apertura viene con la fecha al principio del renglón ("14/08/04: Sarmiento  0-0 Belgrano") y los demás partidos
// de ese día sangrados abajo; dos desempates traen la fecha en el título. Se pasa al formato de siempre.
const pre0405 = (page: string) =>
  page
    .split(/\r?\n/)
    .flatMap((line) => {
      const d = line.match(/^(\d{2})\/(\d{2})\/(\d{2}):\s+(.*)$/);
      if (d) return [`[${MES[Number(d[2]) - 1]} ${Number(d[1])}, 20${d[3]}]`, d[4]];
      const cont = line.match(/^\s{6,}(\S.*?\s\d+-\d+\s+\S.*)$/);
      if (cont && !/[;\[\]]/.test(cont[1])) return [cont[1]];
      const t = line.match(/^(Interior Relegation Playoff|Playoff Against 19th Place.*?)\s*\[(\w{3} \d+), neutral venue\]\s*$/);
      if (t) return [t[1], `[${t[2]}]`];
      return [line];
    })
    .join("\n");
const A0405: Record<string, string> = {
  ...ABREV_0306,
  "Belgrano-CBA": "belgrano",
  Belgrano: "belgrano",
  "C.A.I.": "cai",
  "Chacarita Juniors": "chacarita",
  Chacarita: "chacarita",
  Defensa: "defensa-y-justicia",
  Defensores: "defensores-belgrano",
  "Def. de Belgrano": "defensores-belgrano",
  "Ferro C.O.": "ferro",
  Ferro: "ferro",
  "Gimnasia J": "gimnasia-jujuy",
  "Gimnasia-JUJ": "gimnasia-jujuy",
  Huracán: "huracan",
  "Instituto-CBA": "instituto",
  "Racing Cba.": "racing-cordoba",
  "Racing-CBA": "racing-cordoba",
  "San Martín (M)": "san-martin-mendoza",
  "San Martín-MZA": "san-martin-mendoza",
  "San Martín (SJ)": "san-martin-sj",
  "San Martín-SJ": "san-martin-sj",
  Sarmiento: "sarmiento-junin",
  "Talleres Cba.": "talleres",
  "Talleres-CBA": "talleres",
  "Tiro Federal": "tiro-federal-rosario",
  Unión: "union-santa-fe",
  "Unión-SF": "union-santa-fe",
  // Tablas
  "CA Tiro Federal Argentino Rosario": "tiro-federal-rosario",
  "CA Tiro Federal Argentino (Rosario)": "tiro-federal-rosario",
  "CA Huracán Buenos Aires": "huracan",
  "CA Huracán (Buenos Aires)": "huracan",
  "CA Nueva Chicago Buenos Aires": "nueva-chicago",
  "CA Nueva Chicago (Buenos Aires)": "nueva-chicago",
  "CA Gimnasia y Esgrima de Jujuy": "gimnasia-jujuy",
  "CA Gimnasia y Esgrima (Jujuy)": "gimnasia-jujuy",
  "AMSyD Atlético de Rafaela": "atletico-rafaela",
  "CA San Martín (Mendoza)": "san-martin-mendoza",
  "CA San Martín-Mendoza": "san-martin-mendoza",
  "CA San Martín (San Juan)": "san-martin-sj",
  "CA San Martín-San Juan": "san-martin-sj",
  "Club Ferro Carril Oeste Buenos Aires": "ferro",
  "Club Ferro Carril Oeste (Buenos Aires)": "ferro",
  "C.A.I. (Comodoro Rivadavia)": "cai",
  "CA Talleres (Córdoba)": "talleres",
  "CA Belgrano (Córdoba)": "belgrano",
  "CA Chacarita Juniors (Buenos Aires)": "chacarita",
  "Club Juventud Antoniana (Salta)": "juventud-antoniana",
  "CD Godoy Cruz (Antonio Tomba)": "godoy-cruz",
  "CD Godoy Cruz Antonio Tomba (Mendoza)": "godoy-cruz",
  "CA Unión (Santa Fe)": "union-santa-fe",
  "Racing Club de Córdoba": "racing-cordoba",
  "CA Racing (Córdoba)": "racing-cordoba",
  "Club El Porvenir (Gerli)": "el-porvenir",
  "CA Defensores de Belgrano (Buenos Aires)": "defensores-belgrano",
  "CSyD Defensa y Justicia (Florencio Varela)": "defensa-y-justicia",
  "CA Sarmiento (Junín)": "sarmiento-junin",
};
// Las tablas de la página pierden los paréntesis al leerse: "Club El Porvenir Gerli".
for (const [k, v] of Object.entries(A0405)) if (k.includes("(")) A0405[k.replace(/[()]/g, "").replace(/\s+/g, " ")] = v;
const H0405 = [
  /^Torneo Apertura/i,
  /^Torneo Clausura/i,
  /^Overall\s*$/i,
  /^Championship Playoff/i,
  /^Second Promotion Playoff/i,
  /^Reducido/i,
  /^Promotion\/Relegation Playoffs/i,
  /^Descenso\s*$/i,
  /^Interior Relegation Playoff/i,
];
const R0405 = [/^First Round\s*$/i, /^Final\s*$/i, /^Playoff Against 19th Place/i, /^Metropolitana Promotion\/Relegation Playoff/i, /^Interior Promotion\/Relegation Playoff/i];
ASCENSO_TOURNAMENTS.push(
  abTorneo(2004, "apertura", "arg2-05.html", A0405, "tiro-federal-rosario", "Tiro Federal de Rosario ganó el Apertura y después la final por el campeonato con Gimnasia de Jujuy, ganador del Clausura: campeón de la Nacional B 2004/05 y ascenso a Primera.", {
    sectionRange: { from: /^Torneo Apertura/i, to: /^Torneo Clausura/i },
    headings: H0405,
    preprocess: pre0405,
    wiki: undefined,
  }),
  abTorneo(2004, "clausura", "arg2-05.html", A0405, "gimnasia-jujuy", "Gimnasia y Esgrima de Jujuy ganó el Clausura. Perdió la final por el campeonato con Tiro Federal, pero ascendió igual: le ganó la serie por el segundo ascenso a Huracán.", {
    sectionRange: { from: /^Torneo Clausura/i, to: /^Overall/i },
    headings: H0405,
    preprocess: pre0405,
    wiki: undefined,
    notes: [
      { kind: "formato", text: "20 equipos, todos contra todos a una rueda, 3 puntos por victoria." },
      { kind: "dato", text: "A Nueva Chicago le descontaron 9 puntos por incidentes en el partido con Huracán (fecha 8), pero después se los devolvieron (RSSSF)." },
    ],
  }),
  nacionalBExtra(2004, "final", "Final por el campeonato", {
    file: "arg2-05.html",
    section: /^Championship Playoff/i,
    headings: H0405,
    preprocess: pre0405,
    aliases: A0405,
    wiki: "Campeonato de Primera B Nacional 2004-05",
    championIds: ["tiro-federal-rosario"],
    runnerUpIds: ["gimnasia-jujuy"],
    summary: "Tiro Federal le ganó 1-0 de local a Gimnasia de Jujuy y empató 1-1 en Jujuy: campeón de la Nacional B 2004/05 y ascenso a Primera por primera vez.",
    notes: [{ kind: "formato", text: "Final a ida y vuelta entre los ganadores del Apertura y del Clausura." }],
  }),
  nacionalBExtra(2004, "segundo-ascenso", "Segundo ascenso", {
    file: "arg2-05.html",
    section: /^Second Promotion Playoff/i,
    headings: H0405,
    preprocess: pre0405,
    aliases: A0405,
    wiki: "Campeonato de Primera B Nacional 2004-05",
    championIds: ["gimnasia-jujuy"],
    runnerUpIds: ["huracan"],
    summary: "Gimnasia de Jujuy, perdedor de la final, le ganó 1-0 a Huracán en Parque Patricios y empató 0-0 en Jujuy: segundo ascenso a Primera.",
    notes: [{ kind: "formato", text: "Serie a ida y vuelta entre el perdedor de la final y el mejor de la tabla general." }],
  }),
  nacionalBExtra(2004, "reducido", "Reducido", {
    file: "arg2-05.html",
    sectionRange: { from: /^Reducido/i, to: /^Promotion\/Relegation Playoffs/i },
    headings: [...H0405, ...R0405],
    preprocess: pre0405,
    aliases: A0405,
    playoffRounds: [
      { date: "2005-06-22", stage: "Primera ronda" },
      { date: "2005-06-29", stage: "Final" },
    ],
    championIds: ["atletico-rafaela"],
    runnerUpIds: ["san-martin-mendoza"],
    summary: "Atlético de Rafaela ganó el reducido y jugó la promoción con Argentinos Juniors, que la ganó.",
    notes: [{ kind: "formato", text: "Del 4.º al 7.º de la tabla general, eliminación a ida y vuelta." }],
  }),
  nacionalBExtra(2004, "promocion", "Desempates y promoción con la B Metropolitana y el Argentino A", {
    file: "arg2-05.html",
    sectionRange: { from: /^Interior Relegation Playoff/i },
    headings: [...H0405, ...R0405],
    preprocess: pre0405,
    aliases: A0405,
    publishedTable: [],
    tableIndex: [],
    playoffRounds: [
      { date: "2005-06-23", stage: "Desempate de la Zona Interior (cancha neutral)" },
      { date: "2005-06-25", stage: "Desempate por el 19.º puesto (cancha neutral)" },
      { date: "2005-07-02", stage: "Promoción" },
    ],
    overrides: {
      "2005-06-25 defensores-belgrano chacarita": { advancedId: "chacarita", note: "Chacarita ganó 5-4 por penales: Defensores de Belgrano descendió y Chacarita fue a la promoción." },
    },
    championIds: [],
    summary: "Desempates en cancha neutral por el descenso (San Martín de San Juan–Racing de Córdoba y Defensores de Belgrano–Chacarita) y las promociones: Chacarita se quedó ante Platense; Aldosivi, del Argentino A, subió y Racing de Córdoba descendió.",
    notes: [{ kind: "formato", text: "Desempates a un partido en cancha neutral y promociones a ida y vuelta." }],
  }),
);

// ───────── 2005/06 ─────────
const A0506: Record<string, string> = {
  ...A0405,
  "Atletico Rafaela": "atletico-rafaela",
  "Ben Hur": "ben-hur",
  "Dep. Morón": "deportivo-moron",
  "Huracán (BA)": "huracan",
  "San Martín (T)": "san-martin-tucuman",
  Talleres: "talleres",
  // Tablas: "Godoy Cruz Antonio Tomba (Godoy Cruz)" y lo mismo sin paréntesis.
  "Godoy Cruz Antonio Tomba (Godoy Cruz)": "godoy-cruz",
  "Almagro (Buenos Aires)": "almagro",
  "Chacarita Juniors (Buenos Aires)": "chacarita",
  "Huracán (Buenos Aires)": "huracan",
  "Defensa y Justicia (Florencio Varela)": "defensa-y-justicia",
  "Ferro Carril Oeste (Buenos Aires)": "ferro",
  "Tigre (Victoria)": "tigre",
  "Ben Hur (Rafaela)": "ben-hur",
  "Atlético de Rafaela (Rafaela)": "atletico-rafaela",
  "C.A.I. (Comodoro Rivadavia)": "cai",
  "Nueva Chicago (Buenos Aires)": "nueva-chicago",
  "Aldosivi (Mar del Plata)": "aldosivi",
  "El Porvenir (Gerli)": "el-porvenir",
};
for (const [k, v] of Object.entries(A0506)) if (k.includes("(")) A0506[k.replace(/[()]/g, "").replace(/\s+/g, " ")] = v;
const H0506 = [/^Apertura 2005/i, /^Clausura 2005\/06/i, /^Aggregate Table/i, /^Championship Playoff/i, /^Second Promotion Playoff/i, /^Reducido/i, /^Promotion\/Relegation Playoff/i, /^Descenso\s*$/i, /^Relegation Table \(/i];
// Fechas de las llaves como "First Legs [May 16]" o "First Leg (May 23)".
const pre0506 = (page: string) =>
  page
    .split(/\r?\n/)
    .flatMap((line) => {
      const leg = line.match(/^((?:First|Second) Legs?)\s*[[(](\w{3} \d+)[)\]]\s*$/);
      if (leg) return [leg[1].replace(/s$/, ""), `[${leg[2]}]`];
      return [line];
    })
    .join("\n");
const WIKI0506 = "Campeonato de Primera B Nacional 2005-06";
ASCENSO_TOURNAMENTS.push(
  abTorneo(2005, "apertura", "arg2-06.html", A0506, "godoy-cruz", "Godoy Cruz ganó el Apertura y después la final por el campeonato con Nueva Chicago, ganador del Clausura: campeón de la Nacional B 2005/06 y primer ascenso a Primera de su historia.", {
    sectionRange: { from: /^Apertura 2005/i, to: /^Clausura 2005\/06/i },
    headings: H0506,
    preprocess: pre0506,
    wiki: undefined,
  }),
  abTorneo(2005, "clausura", "arg2-06.html", A0506, "nueva-chicago", "Nueva Chicago ganó el Clausura. Perdió la final por el campeonato con Godoy Cruz, pero ascendió igual: le ganó la serie por el segundo ascenso a Belgrano.", {
    sectionRange: { from: /^Clausura 2005\/06/i, to: /^Aggregate Table/i },
    headings: H0506,
    preprocess: pre0506,
    wiki: undefined,
  }),
  nacionalBExtra(2005, "final", "Final por el campeonato", {
    file: "arg2-06.html",
    preprocess: pre0506,
    section: /^Championship Playoff/i,
    headings: H0506,
    aliases: A0506,
    wiki: WIKI0506,
    playoffFrom: { date: "2006-01-01", stage: "Final" },
    championIds: ["godoy-cruz"],
    runnerUpIds: ["nueva-chicago"],
    summary: "Godoy Cruz empató 1-1 en Mataderos y le ganó 3-1 a Nueva Chicago en Mendoza: campeón de la Nacional B 2005/06 y ascenso a Primera.",
    notes: [{ kind: "formato", text: "Final a ida y vuelta entre los ganadores del Apertura y del Clausura." }],
  }),
  nacionalBExtra(2005, "segundo-ascenso", "Segundo ascenso", {
    file: "arg2-06.html",
    preprocess: pre0506,
    section: /^Second Promotion Playoff/i,
    headings: H0506,
    aliases: A0506,
    wiki: WIKI0506,
    playoffFrom: { date: "2006-01-01", stage: "Segundo ascenso" },
    championIds: ["nueva-chicago"],
    runnerUpIds: ["belgrano"],
    summary: "Nueva Chicago, perdedor de la final, le ganó 3-1 a Belgrano en cancha de Ferro y empató 3-3 en Córdoba: segundo ascenso a Primera. Belgrano fue a la promoción y también subió.",
    notes: [{ kind: "formato", text: "Serie a ida y vuelta entre el perdedor de la final y el mejor de la tabla general." }],
  }),
  nacionalBExtra(2005, "reducido", "Reducido", {
    file: "arg2-06.html",
    preprocess: pre0506,
    sectionRange: { from: /^Reducido/i, to: /^Promotion\/Relegation Playoff/i },
    headings: H0506,
    aliases: A0506,
    wiki: WIKI0506,
    playoffRounds: [
      { date: "2006-05-16", stage: "Primera ronda" },
      { date: "2006-05-23", stage: "Final" },
    ],
    championIds: ["huracan"],
    runnerUpIds: ["chacarita"],
    summary: "Huracán ganó el reducido (3-0 y 0-2 con Chacarita en la final) y jugó la promoción con Argentinos Juniors: empató las dos y se quedó en la B por la ventaja deportiva de Argentinos.",
    notes: [{ kind: "formato", text: "Del 3.º al 6.º de la tabla general, eliminación a ida y vuelta." }],
  }),
  nacionalBExtra(2005, "promocion", "Promoción con la B Metropolitana y el Argentino A", {
    file: "arg2-06.html",
    preprocess: pre0506,
    sectionRange: { from: /^Relegation Table \(Metropolitana\)/i },
    headings: H0506,
    aliases: A0506,
    publishedTable: [],
    tableIndex: [],
    playoffFrom: { date: "2006-01-01", stage: "Promoción" },
    championIds: [],
    summary: "Defensa y Justicia se quedó en la Nacional B ante Deportivo Morón (B Metropolitana) por la ventaja deportiva. San Martín de Tucumán (Argentino A) le ganó la serie a San Martín de Mendoza y subió.",
    notes: [{ kind: "formato", text: "Series a ida y vuelta; con igualdad, se quedaba el equipo de la categoría superior." }],
  }),
);

// ───────── 2006/07 ─────────
const A0607: Record<string, string> = {
  ...A0506,
  Instituto: "instituto",
  Olimpo: "olimpo",
  Platense: "platense",
  "Olimpo (Bahía Blanca)": "olimpo",
  "Platense (Vicente López)": "platense",
  "Tiro Federal (Rosario)": "tiro-federal-rosario",
  "Villa Mitre (Bahía Blanca)": "villa-mitre",
  "San Martín (San Juan)": "san-martin-sj",
  "San Martín (Tucumán)": "san-martin-tucuman",
  "Unión (Santa Fe)": "union-santa-fe",
  "Huracán (Tres Arroyos)": "huracan-tres-arroyos",
  "Estudiantes (BA)": "estudiantes-ba",
  "Guillermo Brown": "guillermo-brown",
};
for (const [k, v] of Object.entries(A0607)) if (k.includes("(")) A0607[k.replace(/[()]/g, "").replace(/\s+/g, " ")] = v;
const H0607 = [/^Apertura 2006/i, /^Clausura 2007/i, /^Aggregate Table/i, /^Second Promotion Playoff/i, /^Reducido/i, /^Promotion\/Relegation Playoff/i, /^\s*Relegation Table/i, /^Playoff against 18th Place/i];
const WIKI0607 = "Campeonato de Primera B Nacional 2006-07";
ASCENSO_TOURNAMENTS.push(
  abTorneo(2006, "apertura", "arg2-07.html", A0607, "olimpo", "Olimpo de Bahía Blanca ganó el Apertura. También ganó el Clausura y la tabla general (78 puntos): campeón de la Nacional B 2006/07 y ascenso a Primera.", {
    sectionRange: { from: /^Apertura 2006/i, to: /^Clausura 2007/i },
    headings: H0607,
    preprocess: pre0506,
    wiki: undefined,
  }),
  abTorneo(2006, "clausura", "arg2-07.html", A0607, "olimpo", "Olimpo ganó también el Clausura y fue campeón de la temporada. San Martín de San Juan ascendió por la serie del segundo ascenso; Huracán y Tigre subieron por la promoción.", {
    sectionRange: { from: /^Clausura 2007/i, to: /^Aggregate Table/i },
    headings: H0607,
    preprocess: pre0506,
    wiki: undefined,
    notes: [
      { kind: "formato", text: "20 equipos, todos contra todos a una rueda (la segunda de la temporada), 3 puntos por victoria." },
      { kind: "dato", text: "A Talleres le descontaron 2 puntos en la tabla general; Almagro empezó la temporada siguiente con 3 puntos menos (RSSSF)." },
    ],
  }),
  nacionalBExtra(2006, "segundo-ascenso", "Segundo ascenso", {
    file: "arg2-07.html",
    section: /^Second Promotion Playoff/i,
    headings: H0607,
    preprocess: pre0506,
    aliases: A0607,
    wiki: WIKI0607,
    playoffFrom: { date: "2007-01-01", stage: "Segundo ascenso" },
    championIds: ["san-martin-sj"],
    runnerUpIds: ["huracan"],
    summary: "San Martín de San Juan perdió 1-0 en Parque Patricios y le ganó 3-1 a Huracán de local: ascenso a Primera. Huracán fue a la promoción y también subió.",
    notes: [{ kind: "formato", text: "Serie a ida y vuelta entre el 2.º y el 3.º de la tabla general." }],
  }),
  nacionalBExtra(2006, "reducido", "Reducido", {
    file: "arg2-07.html",
    sectionRange: { from: /^Reducido/i, to: /^Promotion\/Relegation Playoff/i },
    headings: H0607,
    preprocess: pre0506,
    aliases: A0607,
    wiki: WIKI0607,
    playoffRounds: [
      { date: "2007-06-06", stage: "Primera ronda" },
      { date: "2007-06-13", stage: "Final" },
    ],
    championIds: ["tigre"],
    runnerUpIds: ["platense"],
    summary: "Tigre ganó el reducido (0-0 y 2-0 con Platense en la final) y en la promoción le ganó la serie a Nueva Chicago: ascenso a Primera.",
    notes: [{ kind: "formato", text: "Del 4.º al 7.º de la tabla general, eliminación a ida y vuelta." }],
  }),
  nacionalBExtra(2006, "promocion", "Desempate y promoción con la B Metropolitana y el Argentino A", {
    file: "arg2-07.html",
    sectionRange: { from: /^Playoff against 18th Place/i },
    headings: H0607,
    preprocess: (page) => pre0506(page).replace(/^(Playoff against 18th Place)\s*\[(\w{3} \d+) at [^\]]*\]\s*$/m, "$1\n[$2]"),
    aliases: A0607,
    publishedTable: [],
    tableIndex: [],
    playoffRounds: [
      { date: "2007-06-05", stage: "Desempate por el 18.º puesto" },
      { date: "2007-07-07", stage: "Promoción" },
    ],
    overrides: {
      "2007-06-05 ben-hur instituto": { advancedId: "instituto", venue: "Cancha de Newell's Old Boys", note: "Instituto ganó 4-3 por penales; Ben Hur fue a la promoción." },
    },
    championIds: [],
    summary: "Ben Hur perdió por penales el desempate con Instituto y fue a la promoción con Guillermo Brown de Puerto Madryn (Argentino A): ganó y se quedó. Ferro también se quedó en la Nacional B ante Estudiantes de Buenos Aires (B Metropolitana), por la ventaja deportiva.",
    notes: [{ kind: "formato", text: "Desempate a un partido en cancha neutral y promociones a ida y vuelta." }],
  }),
);

// ───────── 2007/08 a 2009/10: una sola tabla de 20 equipos a dos ruedas; los dos primeros ascienden ─────────
// Fechas entre paréntesis ("(Jun 21)", "Second Legs (Jun 28)") o con la cancha ("[May 22 at Dvo Armenio]").
const pre0710 = (page: string) =>
  pre0506(page)
    .split("\n")
    .flatMap((line) => {
      const solo = line.match(/^\s*\((\w{3} \d+)\)\s*$/);
      if (solo) return [`[${solo[1]}]`];
      const leg = line.match(/^((?:First|Second) Legs?)\s*\((\w{3} \d+)\)\s*$/);
      if (leg) return [leg[1].replace(/s$/, ""), `[${leg[2]}]`];
      const at = line.match(/^((?:First|Second) Legs?)\s*\[(\w{3} \d+) at ([^\]]+)\]\s*$/);
      if (at) return [at[1].replace(/s$/, ""), `[${at[2]}]`];
      return [line];
    })
    .join("\n");
const temporadaB = (
  y: number,
  file: string,
  aliases: Record<string, string>,
  champion: string,
  second: string,
  summary: string,
  more: Partial<TournamentConfig> & { promoFrom?: RegExp; promoSummary?: string } = {},
): TournamentConfig[] => {
  const { promoFrom, promoSummary, ...rest } = more;
  const headings = [/^Final Table:/i, /^Topscorers?\s*$/i, /^Promotion\/Relegation Playoffs? 1st\/2nd level/i, /^\s*Relegation Table/i, /^Promotion\/Relegation Playoff\s*$/i, /^Promotion\/Relegation Playoff 2nd\/3rd level/i];
  return [
    nacionalB(y, {
      file,
      section: 1,
      sectionRange: { from: /^Final Table:/i, to: /^Topscorers?\s*$/i },
      headings,
      preprocess: pre0710,
      tableIndex: 0,
      aliases,
      rolloverBefore: 8,
      pointsPerWin: 3,
      wiki: `Campeonato de Primera B Nacional ${y}-${String(y + 1).slice(2)}`,
      championIds: [champion],
      summary,
      notes: [{ kind: "formato", text: `20 equipos, todos contra todos a dos ruedas, 3 puntos por victoria. Los dos primeros (${nameOf(champion)} y ${nameOf(second)}) ascendieron; el 3.º y el 4.º jugaron la promoción con equipos de Primera.` }],
      ...rest,
    }),
    ...(promoFrom
      ? [
          nacionalBExtra(y, "promocion", "Promoción con la B Metropolitana y el Argentino A", {
            file,
            sectionRange: { from: promoFrom },
            headings,
            preprocess: pre0710,
            aliases,
            publishedTable: [],
            tableIndex: [],
            playoffFrom: { date: `${y + 1}-01-01`, stage: "Promoción" },
            championIds: [],
            summary: promoSummary ?? "",
            notes: [{ kind: "formato", text: "Series a ida y vuelta; con igualdad, se quedaba el equipo de la categoría superior." }],
          }),
        ]
      : []),
  ];
};
const A0710: Record<string, string> = {
  ...A0607,
  "At. Rafaela": "atletico-rafaela",
  "Atl. Rafaela": "atletico-rafaela",
  "Ind. Rivadavia": "independiente-rivadavia",
  "Indep. Rivadavia": "independiente-rivadavia",
  "Independiente Rivadavia": "independiente-rivadavia",
  "Def. y Justicia": "defensa-y-justicia",
  "Defensa y Justicia (at Argentinos Jrs.)": "defensa-y-justicia",
  "Defensa y Justicia (at Ferro Carril Oeste)": "defensa-y-justicia",
  "Ferro Carril Oeste (at Argentinos Jrs.)": "ferro",
  "Gimnasia y Esg.(J)": "gimnasia-jujuy",
  "Gimnasia y Esgrima (J)": "gimnasia-jujuy",
  "Racing (C)": "racing-cordoba",
  "Talleres (C)": "talleres",
  "Los Andes": "los-andes",
  "Dvo. Merlo": "deportivo-merlo",
  "Deportivo Merlo": "deportivo-merlo",
  "Dvo Santamarina": "ramon-santamarina",
  "Svo. Italiano": "sportivo-italiano",
  "Sportivo Italiano": "sportivo-italiano",
  "Boca Unidos": "boca-unidos",
  "All Boys": "all-boys",
  "Atlético Tucumán": "atletico-tucuman",
  "San Martín (T)": "san-martin-tucuman",
  Patronato: "patronato",
  // Tablas
  "Godoy Cruz (Godoy Cruz)": "godoy-cruz",
  "Quilmes (Buenos Aires)": "quilmes",
  "Independiente Rivadavia (Mendoza)": "independiente-rivadavia",
  "Almirante Brown (Buenos Aires)": "almirante-brown",
  "Atlético Tucumán (Tucumán)": "atletico-tucuman",
  "Chacarita Juniors (Bs. Aires)": "chacarita",
  "Ferro Carril Oeste (Bs. Aires)": "ferro",
  "All Boys (Buenos Aires)": "all-boys",
  "Indep. Rivadavia (Mendoza)": "independiente-rivadavia",
  "Defensa y Justicia (F. Varela)": "defensa-y-justicia",
  "Los Andes (Buenos Aires)": "los-andes",
  "Olimpo (Bahia Blanca)": "olimpo",
  "Gimnasia y Esgrima (Jujuy)": "gimnasia-jujuy",
  // Wikipedia
  "Independiente M.": "independiente-rivadavia",
  "Independiente M": "independiente-rivadavia",
  Aldovisi: "aldosivi",
  "C.A.I": "cai",
  "C.A I.": "cai",
  "Atlético. Rafaela": "atletico-rafaela",
  "Atlético Tucumán¹": "atletico-tucuman",
  Santamarina: "ramon-santamarina",
};
for (const [k, v] of Object.entries(A0710)) if (k.includes("(")) A0710[k.replace(/[()]/g, "").replace(/\s+/g, " ")] = v;
const DEDS = (list: [string, number, string][]) => list.map(([teamId, points, reason]) => ({ teamId, points: -points, reason }));
ASCENSO_TOURNAMENTS.push(
  ...temporadaB(
    2007,
    "arg2-08.html",
    // En 2007/08 "Alte. Brown" es el de Burzaco (no el de Arrecifes) y "San Martín", el de Tucumán.
    { ...A0710, "Alte. Brown": "almirante-brown", "San Martín": "san-martin-tucuman" },
    "san-martin-tucuman",
    "godoy-cruz",
    "San Martín de Tucumán salió campeón y ascendió con Godoy Cruz. Unión y Belgrano jugaron la promoción y se quedaron en la B.",
    {
      pointAdjustments: DEDS([
        ["nueva-chicago", 18, "por los incidentes de la promoción 2006/07 con Tigre, en los que murió un hincha (RSSSF)"],
        ["almirante-brown", 18, "descuento que registra RSSSF (la fuente no da el motivo)"],
        ["almagro", 3, "descuento que registra RSSSF (la fuente no da el motivo)"],
      ]),
      promoFrom: /^Promotion\/Relegation Playoff\s*$/i,
      promoSummary: "Nueva Chicago jugó con Los Andes (B Metropolitana) y Talleres de Córdoba con Racing de Córdoba (Argentino A) por su lugar en la Nacional B.",
    },
  ),
  ...temporadaB(
    2008,
    "arg2-09.html",
    A0710,
    "atletico-tucuman",
    "chacarita",
    "Atlético Tucumán salió campeón y ascendió con Chacarita. Atlético de Rafaela y Belgrano jugaron la promoción y se quedaron en la B.",
    {
      promoFrom: /^Promotion\/Relegation Playoff 2nd\/3rd level/i,
      promoSummary: "Deportivo Merlo le ganó las dos a Los Andes y subió; la CAI jugó con Patronato (Argentino A) por su lugar en la Nacional B.",
    },
  ),
  ...temporadaB(
    2009,
    "arg2-2010.html",
    A0710,
    "olimpo",
    "quilmes",
    "Olimpo salió campeón y ascendió con Quilmes. All Boys le ganó la promoción a Rosario Central y también subió; Atlético de Rafaela perdió la suya con Gimnasia de La Plata.",
    {
      promoFrom: /^Promotion\/Relegation Playoff 2nd\/3rd level/i,
      acceptTableDiffs: "Platense–Aldosivi figura 0-0 en RSSSF y 1-0 en Wikipedia; ninguno de los dos hace cerrar la tabla de Platense.",
      wikiErrata: { "RSSSF platense 0-0 aldosivi": "Wikipedia da 1-0. A verificar." },
      promoSummary: "Deportivo Merlo y la CAI se quedaron en la Nacional B ante Sarmiento de Junín (B Metropolitana) y Santamarina de Tandil (Argentino A).",
    },
  ),
);
