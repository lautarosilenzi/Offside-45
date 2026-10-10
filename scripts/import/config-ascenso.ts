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
const ROUND_HEADINGS = [/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /^First Round:?$/i, /^Second Round:?$/i];
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
