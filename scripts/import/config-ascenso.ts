// Segunda categoría del fútbol argentino (el ascenso a Primera): Primera B, Primera B Nacional, Primera Nacional.
// Fuente: las páginas "Argentina Second Level" de RSSSF (tablesa/arg2-*.html), verificadas contra su propia tabla
// y partido por partido contra la Wikipedia en castellano. Se escriben en lib/data/ascenso/generated.
// No suman en las estadísticas ni en los títulos de Primera: solo aparecen en sus páginas y en los historiales.
import type { TournamentConfig } from "./config";

const AFA = "Asociación del Fútbol Argentino";

// Títulos de RSSSF que abren una sección nueva después de la fase regular (reducido, desempates).
const B_HEADINGS = [/^PLAYOFF FOR THE SECOND PROMOTION PLACE/, /^RELEGATION PLAYOFF/];

// Fases de eliminación dentro de una sección (como en la Liguilla de Primera).
const ROUND_HEADINGS = [/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i];

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
  headings: B_HEADINGS,
  ...rest,
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
