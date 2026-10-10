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
  rest: Omit<TournamentConfig, "slug" | "year" | "file" | "competition" | "organizer" | "title" | "tournament" | "tier" | "summary" | "notes"> & { summary: string; notes: TournamentConfig["notes"] },
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
    championIds: ["douglas-haig"],
    summary: "Douglas Haig y Chaco For Ever (descendidos en la Zona Interior) jugaron con Villa Mitre y Huracán de San Rafael, del Argentino A, por el lugar 16 de la zona. Douglas Haig le ganó la final a Chaco For Ever y se quedó en la Nacional B.",
    notes: [{ kind: "formato", text: "Eliminación directa a un partido en cancha neutral." }],
  }),
);
