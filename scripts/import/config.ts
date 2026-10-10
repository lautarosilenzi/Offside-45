// Configuración de cada torneo importado desde RSSSF: de dónde sale, qué es cada cosa y las notas en español.
import type { Match, SeasonNote, TableRow } from "../../lib/types";
import type { RawMatch } from "./rsssf-parse";

export type TournamentConfig = {
  slug: string;
  // 2 = segunda división (config-ascenso.ts): se escribe en lib/data/ascenso/generated.
  tier?: 2;
  // Diferencias con Wikipedia en partidos de equipos cuya fila cierra exacta con la tabla publicada: se acepta RSSSF
  // y la diferencia va a las notas (ver build.ts).
  wikiDiffsByTable?: boolean;
  // Partidos que la página lista dos veces (interzonales en las dos subzonas): se deja uno.
  dedupe?: boolean;
  // Ascenso: la tabla publicada no cierra con los partidos y no hay otra fuente; texto que explica el caso (ver build.ts).
  acceptTableDiffs?: string;
  // Arreglos de formato del texto de la página antes de leerla (Nacional B 2004/05: fechas "12/08/04:" al principio del renglón).
  preprocess?: (page: string) => string;
  // Copa nacional: fases de eliminación, sin tabla de liga (salvo la tabla resumen que publique RSSSF).
  kind?: "cup";
  // Copa internacional: se lista aparte y solo lleva los partidos de los clubes argentinos.
  international?: boolean;
  // Copas cuyas zonas vienen en secciones separadas de la página: se juntan todas.
  allSections?: boolean;
  // Con allSections: títulos de sección que abren una fase; sus grupos quedan "Fase Campeón · Grupo A" ("" la cierra).
  sectionPhases?: [RegExp, string][];
  // Copas con zonas cuyas fechas vienen mezcladas: qué tabla de la sección es cada zona.
  zoneTables?: { table: number; name: string }[];
  // Copa Argentina (2011/12–): la fase sale de la jerarquía de títulos de RSSSF (contextStageOf en build.ts).
  contextStages?: boolean;
  // Líneas de la página que abren una sección nueva (títulos sin <h2>, 1971–1985).
  headings?: RegExp[];
  // Ligas con líneas "Group A" / "Inter Group" dentro de cada fecha (Nacional 1973).
  groupLines?: boolean;
  // Torneo repartido en varias secciones seguidas: desde la primera cuyo título coincide con `from` hasta la
  // anterior a la que coincide con `to`. Los títulos "Group A", "Quarterfinals", etc. dan el grupo o la fase.
  sectionRange?: { from: RegExp; to?: RegExp; exclude?: RegExp };
  runnerUpIds?: string[];
  // Páginas con varias ediciones: solo los partidos de esta ("Season 1913" en la Copa Ibarguren, o la sección "1905").
  edition?: string;
  // Copas sin fases marcadas (Ibarguren): el último partido es la final.
  finalIsLast?: boolean;
  // Partidos que no son de la copa nacional (ej. la final internacional de la Cup Tie contra un equipo uruguayo).
  excludeTeams?: string[];
  // Copa suspendida antes de la final (sin campeón): se cargan los partidos jugados y no se busca la final.
  abandoned?: boolean;
  // Torneo en juego: sin campeón todavía; la final puede no estar.
  inProgress?: boolean;
  // Fechas sin año de una copa que duró varios años: el año sale del día de la semana ("[Sep 22, Wed]").
  weekdayYears?: boolean;
  // Fechas sin año de una copa de más de un año, en orden cronológico: el año sube cuando el mes retrocede.
  rollingYear?: boolean;
  // "Nombre|Ciudad" → id, cuando la página da la ciudad de cada equipo (Copa Argentina 2014/15).
  cityAliases?: Record<string, string>;
  // Nombre final de una fase ("Ronda 3" → "Treintaidosavos de final").
  stageRename?: Record<string, string>;
  // Copa con campeón pero sin final jugada (Copa Estímulo 1920): no se busca la final.
  noFinal?: boolean;
  // Copa por puntos (todos contra todos): no se controla que los eliminados no vuelvan a jugar.
  noEliminationCheck?: boolean;
  // Equipos eliminados que vuelven a jugar (cuadro rearmado en 1920, o un caso sin explicar en la fuente). Sin `teams`, vale para todos.
  // La explicación se agrega a las notas de la temporada.
  reentry?: { teams?: string[]; note: string };
  // Copas con grupos que en realidad son cuadros de eliminación (Copa de la República): el control de eliminados corre igual.
  knockoutGroups?: boolean;
  // Copas con tabla resumen publicada en las que igual se controla que ningún eliminado vuelva a jugar.
  checkEliminations?: boolean;
  // Mes en que empieza el torneo si termina el año siguiente: las fechas de meses anteriores son del año siguiente.
  rolloverBefore?: number;
  // Temporadas de dos años ("1985/86").
  yearLabel?: string;
  // 1988/89: puntos por ganar y por perder la tanda de penales de un empate.
  drawShootout?: { winner: number; loser: number };
  // El índice de copas de RSSSF da otro resultado de la final y hay pruebas de que el error es del índice (motivo).
  indexErrata?: string;
  // Partidos que la liga resolvió por escritorio después de jugarse: la tabla cuenta sus goles (desde los años 50).
  awardedGoalsCount?: boolean;
  // Copas por grupos: tabla de la página (índice) que corresponde a cada grupo (expresión regular sobre la fase).
  // knownDiffs: diferencias ya revisadas por club, con la explicación.
  groupTables?: { table: number; stage: string; knownDiffs?: Record<string, string> }[];
  // Completar con Wikipedia días y goles que RSSSF no registra (ver fillFromWikipedia).
  wikiFill?: boolean;
  // Filas de la tabla publicada identificadas por su puesto (cuando dos clubes figuran con el mismo nombre).
  // Clave "puesto" o "grupo:puesto" (índice de la tabla dentro de tableIndex), para tablas por grupo.
  tableAliases?: Record<number | string, string>;
  // La tabla oficial no cuenta los goles de los partidos que la liga le dio por escritorio a uno de los dos.
  awardedGoalsVoid?: boolean;
  // Tabla publicada en otro documento de RSSSF (las tablas finales por década) cuando la página de la temporada no la trae.
  tableFile?: string;
  tableSection?: RegExp;
  // Títulos de fase que no lo son (1931 amateur: "Playoff:" encabeza la tabla del desempate y no los partidos que siguen).
  ignoreRounds?: RegExp;
  // Fases con otro nombre en esta edición (expresión regular sobre la fase de RSSSF → fase a mostrar).
  // Ej. 1907–1912: la "Argentine semi-final" de la Tie Cup es la final de la fase argentina (Copa Jockey Club).
  stageMap?: Record<string, string>;
  // Inscriptos que no llegaron a jugar (club → explicación, que va a las notas).
  listedWithoutMatches?: Record<string, string>;
  year: number;
  league?: string;
  file: string;
  // URL de la página en RSSSF cuando no está en tablesa/ (la Tie Cup está en sacups/).
  sourceUrl?: string;
  // Fuentes cuando RSSSF todavía no publicó el torneo (reemplazan el enlace a RSSSF).
  sourceLinks?: { label: string; url: string }[];
  // Todos los partidos vienen en extraMatches: no se lee la página de RSSSF (copas internacionales).
  manualOnly?: boolean;
  // Sección de la página (por título) o índice. Por defecto, la primera con partidos.
  section?: RegExp | number;
  // Tabla publicada a usar; con varias (zonas) se concatenan y groupNames les pone nombre.
  tableIndex?: number | number[];
  groupNames?: string[];
  wiki?: string;
  competition: string;
  title: string;
  tournament: string;
  organizer: string;
  championIds: string[];
  summary: string;
  pointsPerWin?: number;
  notes: SeasonNote[];
  withdrawn?: string[];
  pointAdjustments?: { teamId: string; points: number; reason: string }[];
  publishedTable?: TableRow[];
  tableIncludesPlayoffs?: boolean;
  tableNote?: string;
  knownTableDiffs?: { keys: string[]; explanation: string };
  // Correcciones puntuales, por partido ("AAAA-MM-DD local visitante"): "skip" o campos a pisar.
  overrides?: Record<string, "skip" | Partial<Match>>;
  skip?: (m: RawMatch) => boolean;
  // Diferencias con Wikipedia ya revisadas (texto del problema → explicación). Se explican en las notas.
  wikiErrata?: Record<string, string>;
  // Nombres que en este torneo corresponden a otro club que en el resto del año (nombre → id).
  aliases?: Record<string, string>;
  // Partidos anteriores a esta fecha que quedaron anulados (ej. 1919: primera etapa anulada).
  annulBefore?: { date: string; note: string };
  // Partidos desde esta fecha que son desempate por el título (no suman en la tabla).
  playoffFrom?: { date: string; stage: string };
  // Eliminación directa por rondas (2025): cada ronda desde su primera fecha, en orden.
  playoffRounds?: { date: string; stage: string }[];
  // Equipos desafiliados durante el torneo: todos sus partidos quedan anulados.
  annulTeams?: { id: string; note: string }[];
  extraMatches?: Partial<Match>[];
  // Los partidos de extraMatches son posteriores a la tabla de la fuente (torneo en juego): se suman a la tabla publicada.
  extraMatchesAfterTable?: boolean;
};

const AAFL = "Argentine Association Football League";
const AAF = "Asociación Argentina de Football";
const FAF = "Federación Argentina de Football";
const fafWiki = (y: number) => `Campeonato de Primera División ${y} de la FAF (Argentina)`;
const AAM = "Asociación Amateurs de Football";
const AAAF = "Asociación Amateurs Argentina de Football";
// 1935 en adelante: la AFA (Asociación del Football Argentino) unificada y profesional.
const AFA_PRO = "Asociación del Football Argentino";
const AFA = "Asociación del Fútbol Argentino";
const AFA_UNIFICADA = {
  kind: "identidad",
  text: "En noviembre de 1934 la liga profesional y la asociación oficial se unieron en la Asociación del Football Argentino (AFA). Desde 1935 hay una sola Primera División, profesional.",
} as const;
const TABLA_DECADA = {
  kind: "fuentes",
  text: "La tabla con la que se verifican los partidos es la del documento de tablas finales de RSSSF por década, un archivo distinto a la página de partidos de la temporada.",
} as const;
const afaPro = (year: number, rest: Omit<TournamentConfig, "slug" | "year" | "file" | "wiki" | "competition" | "organizer" | "title" | "tournament"> & { tournament?: string; title?: string }): TournamentConfig => ({
  slug: String(year),
  year,
  file: `arg${String(year).slice(2)}.html`,
  wiki: wikiTitle(year),
  // Desde 1946 la asociación se llama Asociación del Fútbol Argentino.
  competition: year >= 1946 ? AFA : AFA_PRO,
  organizer: year >= 1946 ? AFA : AFA_PRO,
  title: `Campeonato ${year}`,
  tournament: `Copa Campeonato ${year}`,
  // Tablas finales por década: 1931–1940 las titula "Copa Campeonato AAAA", 1941–1950 "Primera División AAAA".
  // Cada documento cubre de 1 a 10 (1941–1950 está en el de los años 40).
  tableFile: `arghist-pro${Math.floor((year - 1) / 10)}0s.html`,
  awardedGoalsCount: year >= 1950,
  tableSection: year <= 1940 ? new RegExp(`^Copa Campeonato ${year}\\.?$`) : new RegExp(`^Primera División ${year}\\.?$`),
  // En 1935–1940 el único Talleres de Primera es el de Remedios de Escalada.
  aliases: {
    Estudiantes: "estudiantes",
    "Gimnasia (LP)": "gimnasia",
    "Gimnasia y Esgrima": "gimnasia",
    // Desde 1935 el único Gimnasia de Primera es el de La Plata (en las tablas figura "Club de Gimnasia y Esgrima").
    "Club de Gimnasia y Esgrima": "gimnasia",
    Talleres: "talleres-re",
    "CA Talleres": "talleres-re",
    // Nombres cortos de las tablas de Wikipedia de los años 60.
    Gimnasia: "gimnasia",
    Vélez: "velez",
    Ferro: "ferro",
    Chacarita: "chacarita",
  },
  ...rest,
});
// 1931–1934: dos ligas de Primera en paralelo.
const LAF = "Liga Argentina de Football";
const PRO2 = {
  kind: "identidad",
  text: "Entre 1931 y 1934 hubo dos ligas de Primera: la Liga Argentina de Football (profesional, disidente) y la de la asociación oficial (amateur). La AFA cuenta a los campeones de las dos.",
} as const;
const aamWiki = (y: number) => `Campeonato de Primera División ${y} de la AAmF (Argentina)`;
const rr1 = (teams: number, extra = "") =>
  ({ kind: "formato", text: `Todos contra todos a una rueda entre ${teams} equipos, 2 puntos por victoria.${extra}` }) as const;

// Segundo cisma (1919–1926): la Asociación Argentina (oficial) y la Asociación Amateurs (disidente) en paralelo.
const aaf2 = (year: number, file: string, section: RegExp, rest: Omit<TournamentConfig, "slug" | "year" | "file" | "section" | "wiki" | "competition" | "organizer" | "title" | "league">): TournamentConfig => ({
  slug: String(year),
  year,
  league: "AAF",
  file,
  section,
  wiki: wikiTitle(year),
  competition: AAF,
  organizer: `${AAF} (entidad oficial)`,
  title: `Campeonato ${year} · Asociación Argentina`,
  ...rest,
});
const aam = (year: number, file: string, section: RegExp, rest: Omit<TournamentConfig, "slug" | "year" | "file" | "section" | "wiki" | "competition" | "organizer" | "title" | "league">): TournamentConfig => ({
  slug: `${year}-aam`,
  year,
  league: "AAm",
  file,
  section,
  wiki: aamWiki(year),
  competition: AAM,
  organizer: `${AAM} (entidad disidente, no reconocida entonces por la FIFA)`,
  title: `Campeonato ${year} · Asociación Amateurs`,
  ...rest,
});
const CISMA2 = {
  kind: "identidad",
  text: "Entre 1919 y 1926 hubo dos ligas de Primera en paralelo: la Asociación Argentina de Football (oficial) y la Asociación Amateurs de Football (disidente). Las dos se consideran hoy parte de la historia de la Primera División.",
} as const;
const AFA_1903 = "Argentine Football Association";
const wikiTitle = (y: number) => `Campeonato de Primera División ${y} (Argentina)`;
const rr2 = (teams: number, extra = "") =>
  ({ kind: "formato", text: `Todos contra todos a dos ruedas entre ${teams} equipos, 2 puntos por victoria.${extra}` }) as const;

// Temporadas de la Argentine Football Association (1903–1911): mismo formato de liga única.
const afa = (year: number, file: string, rest: Omit<TournamentConfig, "slug" | "year" | "file" | "wiki" | "competition" | "organizer" | "title">): TournamentConfig => ({
  slug: String(year),
  year,
  file,
  wiki: wikiTitle(year),
  competition: AFA_1903,
  organizer: AFA_1903,
  title: `Campeonato ${year}`,
  ...rest,
});


// 1967–1985: cada año, dos campeonatos de Primera (Metropolitano y Nacional) y torneos de reclasificación y promoción.
// Todos están en la misma página de RSSSF, cada uno en su sección.
type TorneoKey = "metropolitano" | "nacional" | "promocional" | "reclasificacion" | "reclasificacion-primera" | "petit" | "pre-libertadores" | "reducido";
const TORNEO: Record<TorneoKey, { name: string; section: string; wiki?: (y: number) => string }> = {
  metropolitano: { name: "Metropolitano", section: "^Metropolitano Championship", wiki: (y) => `Campeonato Metropolitano ${y} (Argentina)` },
  nacional: { name: "Nacional", section: "^Nacional Championship", wiki: (y) => `Campeonato Nacional ${y} (Argentina)` },
  promocional: { name: "Promocional", section: "^Promocional Tournament", wiki: (y) => `Torneo Promocional ${y} (Argentina)` },
  reclasificacion: { name: "Reclasificación", section: "^Reclasifica" },
  "reclasificacion-primera": { name: "Reclasificatorio de Primera", section: "^Torneo Reclasificatorio de Primera" },
  petit: { name: "Petit Torneo", section: "^Petit Tournament" },
  "pre-libertadores": { name: "Clasificación a la Libertadores", section: "^Pre Libertadores" },
  reducido: { name: "Torneo Reducido", section: "^Torneo Reducido" },
};
const afaTorneo = (
  year: number,
  key: TorneoKey,
  rest: Omit<TournamentConfig, "slug" | "year" | "file" | "competition" | "organizer" | "title" | "tournament" | "league"> & { tournament?: string },
): TournamentConfig => ({
  slug: `${year}-${key}`,
  year,
  league: TORNEO[key].name,
  file: `arg${String(year).slice(2)}.html`,
  section: new RegExp(TORNEO[key].section),
  ...(TORNEO[key].wiki && { wiki: TORNEO[key].wiki!(year) }),
  competition: `${AFA} · ${TORNEO[key].name}`,
  organizer: AFA,
  title: `${TORNEO[key].name} ${year}`,
  tournament: `${key === "metropolitano" || key === "nacional" ? "Campeonato" : "Torneo"} ${TORNEO[key].name} ${year}`,
  awardedGoalsCount: true,
  // Desde 1967 el único Talleres de Primera es el de Córdoba.
  aliases: { Gimnasia: "gimnasia", Vélez: "velez", Ferro: "ferro", Chacarita: "chacarita", Estudiantes: "estudiantes", Talleres: "talleres" },
  ...rest,
});


// 1985/86–: temporadas de agosto a junio. "y" es el año en que empieza.
const yy = (y: number) => `${y}/${String(y + 1).slice(2)}`;
const afaLarga = (
  y: number,
  rest: Omit<TournamentConfig, "slug" | "year" | "file" | "competition" | "organizer" | "title" | "tournament"> & { tournament?: string },
): TournamentConfig => ({
  slug: `${y}-${String(y + 1).slice(2)}`,
  year: y,
  yearLabel: yy(y),
  file: `arg${String(y + 1).slice(2)}.html`,
  wiki: `Campeonato de Primera División ${y}-${String(y + 1).slice(2)} (Argentina)`,
  competition: AFA,
  organizer: AFA,
  title: `Campeonato ${yy(y)}`,
  tournament: `Campeonato de Primera División ${yy(y)}`,
  awardedGoalsCount: true,
  rolloverBefore: 7,
  ...rest,
  aliases: { Gimnasia: "gimnasia", Vélez: "velez", Ferro: "ferro", Chacarita: "chacarita", Estudiantes: "estudiantes", Talleres: "talleres", ...rest.aliases },
});
// Desde 2014: campeonatos de año calendario (2014, 2015, 2016, …). `key` distingue los torneos de un mismo año.
const anual = (
  y: number,
  key: string | undefined,
  name: string,
  rest: Omit<TournamentConfig, "slug" | "year" | "competition" | "organizer" | "title" | "tournament" | "league"> & { tournament?: string },
): TournamentConfig => ({
  slug: key ? `${y}-${key}` : `${y}`,
  year: y,
  yearLabel: `${y}`,
  competition: `${AFA} · ${name}`,
  organizer: AFA,
  league: name,
  title: `${name} ${y}`,
  tournament: `${name} ${y}`,
  awardedGoalsCount: true,
  // Todo el torneo es del mismo año: ningún mes pasa al año siguiente.
  rolloverBefore: 1,
  tableIndex: [0],
  pointsPerWin: 3,
  ...rest,
  // Los mismos alias cortos que las temporadas anteriores ("Estudiantes" es el de La Plata, etc.).
  aliases: { Gimnasia: "gimnasia", Vélez: "velez", Ferro: "ferro", Chacarita: "chacarita", Estudiantes: "estudiantes", Talleres: "talleres", ...ABREV_2001, ...rest.aliases },
});
const H_2015 = [/^Campeonato de Primera División 2015/, /^Liguilla Pre Libertadores$/, /^Liguilla Pre Sudamericana$/, /^Relegation$/, /^Second Level: Primera B Nacional 2015/];
// 2015: con 30 equipos, "Club Atlético San Martín" es el de San Juan (el de Tucumán estaba en el Federal A).
const A_2015 = {
  "Club Atlético San Martín": "san-martin-sj",
  "Club Atlético Sarmiento": "sarmiento-junin",
  Sarmiento: "sarmiento-junin", // así lo nombra Wikipedia
  "Club Atlético Unión": "union-santa-fe",
  "Club Atlético Colón": "colon-santa-fe",
  "Club Atlético Belgrano": "belgrano",
  "Club A. San Lorenzo de Almagro": "sanlorenzo",
  "Asociación A. Argentinos Juniors": "argentinos",
  "Asociación Mutual Social y Deportiva Atlético de Rafaela": "atletico-rafaela",
};
// Nombres oficiales desde 2016 (con los de 30 equipos, "San Martín" es el de San Juan y "Talleres" el de Córdoba).
const A_2016 = {
  ...A_2015,
  "Club Atlético Tucumán Sociedad Civil": "atletico-tucuman",
  "Club Atlético Tucumán Sociedad C.": "atletico-tucuman",
  "Club Atlético Patronato de la Juventud Católica": "patronato-parana",
  "CA Patronato de la Juv. Católica": "patronato-parana",
  "CA Patronato dl Juventud Católica": "patronato-parana",
  "Club Atlético Talleres": "talleres",
  "AMSyD Atlético de Rafaela": "atletico-rafaela",
  "Club Atlético Tucumán": "atletico-tucuman",
  "Arsenal FC": "arsenal",
};
const H_2025 = [/^Torneo Apertura de la LPF de AFA 2025$/, /^Torneo Clausura de la LPF de AFA 2025$/, /^Triennal General Table of Averages/];
const H_2026 = [/^Torneo Apertura de la LPF de AFA 2026$/, /^Torneo Clausura de la LPF de AFA 2026$/, /^Primer Descenso/, /^Tabla Anual de Posiciones 2026/];
// Liga Profesional (2021–): los nombres oficiales, más los de los recién ascendidos.
const A_LPF = {
  ...A_2016,
  "Club Atlético Central Córdoba Soc. Civil": "central-cordoba-sde",
  "Club Atlético Central Córdoba Sociedad Civil": "central-cordoba-sde",
  "CA Central Córdoba (SdE)": "central-cordoba-sde",
  "CA Central Córdoba": "central-cordoba-sde",
  "Central Córdoba (SdE)": "central-cordoba-sde",
  "CA Patronato Juventud Católica": "patronato-parana",
  "Club Atlético Tucumán Soc. Civil": "atletico-tucuman",
  "Club Atlético Platense Asociación Civil": "platense",
  "Instituto Atlético Central Córdoba": "instituto",
  "Instituto ACC": "instituto",
  "Club Sportivo Independiente Rivadavia": "independiente-rivadavia",
  "CS Independiente Rivadavia": "independiente-rivadavia",
  "CA Central Córdoba (Sant. Estero)": "central-cordoba-sde",
};
// 2026: ascendieron Gimnasia y Esgrima de Mendoza ("CA Gimnasia y Esgrima") y Estudiantes de Río Cuarto ("AA Estudiantes").
const A_2026 = {
  ...A_LPF,
  "CA Gimnasia y Esgrima": "gimnasia-mendoza",
  "Club Atlético Gimnasia y Esgrima": "gimnasia-mendoza",
  "AA Estudiantes": "estudiantes-rio-cuarto",
  "Asociación Atlética Estudiantes": "estudiantes-rio-cuarto",
  "Gimnasia y Esgrima (M)": "gimnasia-mendoza",
  "Gimnasia (M)": "gimnasia-mendoza",
  "Estudiantes (RC)": "estudiantes-rio-cuarto",
};
// Torneos de la misma temporada (Liguilla Pre-Libertadores, Octogonal): sin tabla, todo es eliminación.
// `file` se puede cambiar: 2009/10 está en arg2010.html (arg10.html es 1910).
const afaLargaExtra = (
  y: number,
  key: string,
  name: string,
  rest: Omit<TournamentConfig, "slug" | "year" | "file" | "competition" | "organizer" | "title" | "tournament" | "league"> & { tournament?: string; file?: string },
): TournamentConfig => ({
  ...afaLarga(y, { championIds: [], summary: "", notes: [] }),
  slug: `${y}-${String(y + 1).slice(2)}-${key}`,
  league: name,
  wiki: undefined,
  competition: `${AFA} · ${name}`,
  title: `${name} ${yy(y)}`,
  tournament: `${name} ${yy(y)}`,
  tableIndex: [],
  ...rest,
  aliases: { Gimnasia: "gimnasia", Vélez: "velez", Ferro: "ferro", Chacarita: "chacarita", Estudiantes: "estudiantes", Talleres: "talleres", ...rest.aliases },
});

// Nombres abreviados de los partidos en RSSSF desde 1997/98.
const ABREV_1997 = {
  "Newell's OB": "newells",
  "Rosario C": "central",
  "Gimnasia J": "gimnasia-jujuy",
  "Gimnasia LP": "gimnasia",
  "Gimnasia S": "gimnasia-tiro-salta",
  "Gimnasia y Tiro (Salta)": "gimnasia-tiro-salta",
  "Gimnasia y Tiro (S)": "gimnasia-tiro-salta",
  Rosario: "central",
  "Dep Español": "deportivo-espanol",
  "Arg Juniors": "argentinos",
  "Huracán BA": "huracan",
  "Talleres Cba": "talleres",
  "Belgrano Cba": "belgrano",
  "Colón SF": "colon-santa-fe",
  "Unión SF": "union-santa-fe",
  "RIVER PLATE": "river",
  "Argentinos Js": "argentinos",
  "Chacarita Js": "chacarita",
  "Chacarita Jrs": "chacarita",
  "Argentinos J": "argentinos",
  Ferrocarril: "ferro",
  "Instituto Cba": "instituto",
  "Rosario Ctral": "central",
  "Rosario C.": "central",
  "Rosario Cent.": "central",
  "Newell's O.B.": "newells",
  "Newell�s Old Boys": "newells",
  "Ferro C. O.": "ferro",
  "Belgrano Cba.": "belgrano",
  "Ginmasia LP": "gimnasia",
  "Talleres Cba.": "talleres",
  "Instituto Cba.": "instituto",
  "Newell�s O.B.": "newells",
  "Newell's O. B.": "newells",
  "Argentinos Jrs": "argentinos",
};

// Desde 2001/02 RSSSF pone la ciudad entre paréntesis ("Colón (SF)", "Talleres (Cba)").
const ABREV_2001 = {
  ...ABREV_1997,
  "Talleres (Cba)": "talleres",
  "Belgrano (Cba)": "belgrano",
  "Gimnasia (LP)": "gimnasia",
  "Estudiantes (LP)": "estudiantes",
  "Colón (SF)": "colon-santa-fe",
  "Unión (SF)": "union-santa-fe",
  "Newell�s Old Boys": "newells",
  "Olimpo (BB)": "olimpo",
  "Olimpo (Bahía Blanca)": "olimpo",
  "San Martín (Mza)": "san-martin-mendoza",
  "NUEVA CHICAGO": "nueva-chicago",
  "TALLERES (CBA)": "talleres",
  "Talleres (Córdoba)": "talleres",
  "Tallares (Córdoba)": "talleres", // errata de la fuente (2003)
  "Huracán (TA)": "huracan-tres-arroyos",
  "Huracán (Tres Arroyos)": "huracan-tres-arroyos",
  "San Lorenzo de Almagro": "sanlorenzo",
  "Gimnasia y Esgrima (La Plata)": "gimnasia",
  "Instituto (Córdoba)": "instituto",
  "Huracán (BA)": "huracan",
  "Gimnasia y Esgrima (Jujuy)": "gimnasia-jujuy",
  "Gimnasia y Esgrima (LP)": "gimnasia",
  "Gimnasia y Esgrima (J)": "gimnasia-jujuy",
  "Tiro Federal (Rosario)": "tiro-federal-rosario",
  "Godoy Cruz Antonio Tomba": "godoy-cruz",
  "Newell's Old Boys (Rosario)": "newells",
  "Colón (Santa Fe)": "colon-santa-fe",
  "Estudiantes-LP": "estudiantes",
  "Tigre (Victoria)": "tigre",
  "Huracán (Buenos Aires)": "huracan",
  "San Martín (San Juan)": "san-martin-sj",
  "San Martín-SJ": "san-martin-sj",
  "Godoy Cruz (Godoy Cruz)": "godoy-cruz",
  "San Martín (Tucumán)": "san-martin-tucuman",
  "Atl. Tucumán": "atletico-tucuman",
  "Atlético Tucumán (Tucumán)": "atletico-tucuman",
  "Gimnasia y Esgrima LP": "gimnasia",
  "Estudiantes LP": "estudiantes",
  "Vélez Sársfield": "velez",
  "Godoy Cruz AT (Mendoza)": "godoy-cruz",
  "Godoy Cruz AT": "godoy-cruz",
  "Arsenal Fútbol Club": "arsenal",
  "All Boys (Buenos Aires)": "all-boys",
  "Quilmes Atlético Club": "quilmes",
  "Independiente (Avellaneda)": "independiente",
  "Estudiantes de La Plata": "estudiantes",
  "Belgrano (Córdoba)": "belgrano",
  "Atlétido de Rafaela": "atletico-rafaela", // errata de la fuente (2013)
  "Atlético Vélez Sarsfield": "velez",
  "Gimnasia y Esgrima La Plata": "gimnasia",
};

// Apertura y Clausura desde 2002/03: 20 equipos a una rueda, 3 puntos por victoria, tabla al principio de cada torneo.
type CortoOpts = Omit<Parameters<typeof afaLargaExtra>[3], "tableIndex" | "pointsPerWin">;
// Desde 2012/13 se llaman Inicial y Final.
const CORTO_NOMBRE = { apertura: "Apertura", clausura: "Clausura", inicial: "Inicial", final: "Final" } as const;
const corto = (y: number, key: keyof typeof CORTO_NOMBRE, opts: CortoOpts) =>
  afaLargaExtra(y, key, CORTO_NOMBRE[key], {
    tableIndex: [0],
    pointsPerWin: 3,
    ...((key === "clausura" || key === "final") && { rolloverBefore: 13 }),
    ...opts,
    aliases: { ...ABREV_2001, ...opts.aliases },
  });
const H_2002 = [/^Torneo Apertura$/, /^Torneo Clausura$/, /^General Table/, /^Relegation Playoff$/];
const H_2003 = [...H_2002, /^Top Scorers/];
const H_2005 = [/^Torneo Apertura/, /^Relegation Table/, /^Torneo Clausura/, /^Aggregate Table/, /^Promotion\/Relegation Playoff/];
const H_2006 = [/^Torneo Apertura/, /^Championship Playoff/, /^Topscorers$/, /^Torneo Clausura/, /^Aggregate Table/, /^Promotion\/Relegation Playoff/];
const H_2007 = [/^Apertura 2007$/, /^Clausura 2008$/, /^Topscorers$/, /^Promotion\/Relegation Playoffs/];
const H_2008 = [/^Torneo Apertura/, /^Championship Playoff$/, /^Topscorers$/, /^Torneo Clausura/, /^Promotion\/Relegation Playoffs/];
const H_2009 = [/Apertura 2009$/, /^Topscorer$/, /Clausura 2010$/, /^Topscorers$/, /Relegation Table$/, /^Promotion\/Relegation Playoffs/];
const H_2010 = [/^Torneo .*Apertura 2010$/, /^Topscorers$/, /^Torneo .*Clausura 2011/, /^Relegation Table$/, /^Playoff Against 19th Place/, /^Promotion\/Relegation Playoffs/, /^Primera B Nacional/];
const H_2011 = [/^Torneo Apertura 2011$/, /^Torneo Clausura 2012$/, /^Relegation Table/, /^Promotion\/Relegation Playoffs$/, /^Copa Argentina 2011\/12/];
const H_2012 = [/^Torneo Inicial 2012\/13$/, /^Torneo Final 2012\/13$/, /^Campeonato de Primera División 2012\/13$/, /^Copa Argentina$/];
const H_2013 = [
  /^Torneo Inicial 2013\/14 \S*Nietos/,
  /^Torneo Final 2013\/14 \S*Nietos/,
  /^Copa Campeonato de Primera/,
  /^Pre Libertadores$/,
  /^Pre Libertadores Playoff$/,
  /^Relegation$/,
  /^Against relegation playoff/,
  /^Copa Sancor Seguros Argentina 2014/,
];
const H_2004 = [/^Torneo Apertura$/, /^Torneo Clausura$/, /^Topscorers Clausura/, /^Promotion\/Relegation Playoffs/];
// Promoción: series a ida y vuelta entre los dos equipos de Primera con peor promedio (después de los que descendían
// directo) y equipos del Nacional B. `series`: [ida (fecha, local, visitante), vuelta, quién se quedó o subió, nota].
const PROMO_FORMATO = {
  kind: "formato" as const,
  text: "Series a ida y vuelta entre equipos de Primera con mal promedio y equipos del Nacional B. Con el global empatado, se quedaba el equipo de Primera.",
};
const promocion = (
  y: number,
  opts: Omit<CortoOpts, "overrides" | "championIds" | "notes"> & {
    notes?: CortoOpts["notes"];
    series: [ida: string, vuelta: string, advancedId: string, note: string][];
  },
) => {
  const { series, ...rest } = opts;
  return afaLargaExtra(y, "promocion", "Promoción", {
    championIds: [],
    rolloverBefore: 13,
    ...rest,
    aliases: { ...ABREV_2001, ...rest.aliases },
    overrides: Object.fromEntries(
      series.flatMap(([ida, vuelta, advancedId, note]) => [
        [ida, { phase: "playoff" as const, stage: "Promoción (ida)" }],
        [vuelta, { phase: "playoff" as const, stage: "Promoción (vuelta)", advancedId, note }],
      ]),
    ),
    notes: rest.notes ?? [PROMO_FORMATO],
  });
};

export const TOURNAMENTS: TournamentConfig[] = [
  {
    slug: "1897",
    year: 1897,
    file: "arg1897.html",
    wiki: wikiTitle(1897),
    competition: AAFL,
    title: "Campeonato 1897",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["lomas-athletic"],
    summary:
      "Lomas Athletic y Lanús Athletic terminaron igualados en 20 puntos y por primera vez el título se definió con desempates: hicieron falta tres partidos (1-1, 0-0 y 1-0). Fue el cuarto campeonato de Lomas Athletic en cinco ediciones y el quinto seguido de la institución, contando el de Lomas Academy. Debutaron Banfield, Lanús Athletic y Palermo Athletic.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 7 equipos, 2 puntos por victoria. El empate en el primer puesto se resolvió con desempates." },
      { kind: "puntos", text: "Desempates por el título entre Lomas Athletic y Lanús Athletic: 1-1 (8/9, con alargue), 0-0 (12/9, con alargue) y 1-0 para Lomas (19/9). Los desempates no suman en la tabla." },
      { kind: "identidad", text: "Banfield Athletic Club es el actual Club Atlético Banfield. Lanús Athletic no tiene relación con el Club Atlético Lanús, que se fundó en 1915. Belgrano \"B\" era el segundo equipo del Belgrano Athletic Club, el último equipo alternativo que jugó el campeonato." },
      { kind: "descalificacion", text: "Al terminar el torneo Belgrano \"B\" se disolvió y Flores Athletic fue desafiliado (según Wikipedia)." },
    ],
  },
  {
    slug: "1898",
    year: 1898,
    file: "arg1898.html",
    wiki: wikiTitle(1898),
    competition: AAFL,
    title: "Campeonato 1898",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["lomas-athletic"],
    summary:
      "Lomas Athletic y Lobos Athletic terminaron igualados en 20 puntos y otra vez hubo desempate. El primero (1-0 para Lomas) se anuló y se volvió a jugar: Lomas ganó 2-1 con dos goles de James Anderson y consiguió su último título, el sexto de la institución. Banfield perdió los doce partidos: se retiró a mitad de año y sus partidos restantes se le dieron por perdidos.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 7 equipos, 2 puntos por victoria. El empate en el primer puesto se resolvió con un desempate." },
      { kind: "puntos", text: "Desempate por el título entre Lomas Athletic y Lobos Athletic: el 28/8 ganó Lomas 1-0, pero el partido se anuló; el 11/9 Lomas ganó 2-1 en el Barker Memorial School." },
      { kind: "walkover", text: "Banfield no se presentó a sus últimos partidos: seis se le dieron por perdidos (dos antes del 3/7 y cuatro después, con fecha desconocida)." },
      { kind: "descalificacion", text: "Al terminar el torneo United Banks y Palermo Athletic se desafiliaron y Banfield pasó voluntariamente a la recién creada Segunda División (según Wikipedia)." },
    ],
  },
  {
    slug: "1899",
    year: 1899,
    file: "arg1899.html",
    wiki: wikiTitle(1899),
    competition: AAFL,
    title: "Campeonato 1899",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["belgrano-athletic"],
    summary:
      "Solo cuatro equipos, el torneo con menos participantes de la historia junto a los de 1900 y 1901. Belgrano Athletic fue campeón invicto. Lanús Athletic jugó apenas dos partidos: los otros cuatro se le dieron por perdidos. Ese año se jugó por primera vez un campeonato de Segunda División.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 4 equipos, 2 puntos por victoria." },
      { kind: "walkover", text: "Lanús Athletic no se presentó a cuatro partidos, que se dieron por ganados a sus rivales. El Lomas–Lobos también se le adjudicó a Lobos." },
      {
        kind: "fuentes",
        text: "RSSSF publica dos tablas con goles distintos (Belgrano 10-2 o 8-2; Lanús 1-5 o 1-3). La que se usa acá es la que cierra con los resultados partido por partido; las posiciones y los puntos son iguales en las dos.",
      },
      { kind: "descalificacion", text: "Al terminar el torneo Lobos quedó afuera por la distancia y Lanús Athletic fue desafiliado (según Wikipedia)." },
    ],
  },
  {
    slug: "1900",
    year: 1900,
    file: "arg1900.html",
    wiki: wikiTitle(1900),
    competition: AAFL,
    title: "Campeonato 1900",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["alumni"],
    summary:
      "Campeón invicto English High School Athletic Club, el equipo del colegio de Alexander Watson Hutton que al año siguiente pasó a llamarse Alumni. Aseguró el título una fecha antes del final con un 5-0 a Quilmes. Fue el comienzo de la época dorada de Alumni.",
    wikiErrata: { "lomas-athletic 4-0 quilmes": "la tabla de la propia Wikipedia (Lomas 9-9, Quilmes 9-19) solo cierra con el 4-0." },
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 4 equipos, 2 puntos por victoria." },
      { kind: "identidad", text: "English High School Athletic Club es el antecesor directo de Alumni, que adoptó ese nombre en 1901. Quilmes volvió a Primera." },
      {
        kind: "fuentes",
        text: "Wikipedia da Lomas 6-0 Quilmes en el fixture, pero su propia tabla (Lomas 9 goles a favor, Quilmes 19 en contra) solo cierra con el 4-0 de RSSSF, que es el que se usa.",
      },
    ],
  },
  {
    slug: "1901",
    year: 1901,
    file: "arg1901.html",
    wiki: wikiTitle(1901),
    competition: AAFL,
    title: "Campeonato 1901",
    tournament: "Championship Cup de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["alumni"],
    summary: "Alumni, ya con su nombre definitivo, ganó los seis partidos y fue campeón por segunda vez seguida, recibiendo un solo gol en todo el torneo. Jugaron los mismos cuatro equipos que en 1900.",
    notes: [{ kind: "formato", text: "Todos contra todos a dos ruedas entre 4 equipos, 2 puntos por victoria." }],
  },
  {
    slug: "1902",
    year: 1902,
    file: "arg1902.html",
    wiki: wikiTitle(1902),
    competition: AAFL,
    title: "Campeonato 1902",
    tournament: "Copa Campeonato de la Argentine Association Football League",
    organizer: AAFL,
    championIds: ["alumni"],
    summary:
      "Alumni fue campeón invicto por tercera vez, con goleadas como el 10-0 a Belgrano Athletic y el 8-1 a Barracas Athletic, el debutante que terminó segundo. Fue el último torneo organizado bajo el nombre de Argentine Association Football League. Jorge Brown, de Alumni, fue el goleador con 7 goles.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 5 equipos, 2 puntos por victoria." },
      { kind: "walkover", text: "Cinco partidos se resolvieron por escritorio, sin jugarse: Lomas Athletic perdió tres y Quilmes y Belgrano Athletic uno cada uno." },
    ],
  },
  afa(1903, "arg1903.html", {
    tournament: "Copa Campeonato 1903",
    championIds: ["alumni"],
    summary:
      "Primer torneo con la liga ya rebautizada Argentine Football Association. Alumni ganó su cuarto título seguido (quinto contando el de English High School): nueve victorias en diez partidos y apenas cuatro goles en contra. Flores Athletic perdió todos sus partidos y fue desafiliado al final.",
    notes: [
      rr2(6),
      { kind: "descalificacion", text: "Al terminar el torneo Flores Athletic fue desafiliado; lo reemplazó Estudiantes (BA) en 1904." },
      {
        kind: "fuentes",
        text: "Wikipedia no publica los resultados de este torneo. Su tabla le da a Alumni un gol más a favor (40) y a Lomas Athletic uno más en contra (17) que RSSSF, así que probablemente difieren en uno de los dos Alumni–Lomas (2-0 y 4-2 según RSSSF). Se usan los resultados de RSSSF, que cierran con su tabla.",
      },
    ],
  }),
  afa(1904, "arg1904.html", {
    tournament: "Copa Campeonato 1904",
    championIds: ["belgrano-athletic"],
    summary: "Belgrano Athletic cortó la racha de Alumni y ganó su segundo título. Debutó Estudiantes, el actual Estudiantes de Buenos Aires.",
    notes: [rr2(6), { kind: "identidad", text: "Estudiantes (BA) es el Club Atlético Estudiantes, hoy con sede en Caseros; no tiene relación con Estudiantes de La Plata." }],
  }),
  afa(1905, "arg1905.html", {
    tournament: "Copa Campeonato 1905",
    championIds: ["alumni"],
    summary: "Alumni recuperó el título, el quinto de su historia (sexto contando el de English High School). Debutó Reformer, de Campana.",
    notes: [
      rr2(7),
      {
        kind: "walkover",
        text: "Belgrano Athletic–Quilmes (28 de mayo) se suspendió a los 85 minutos con 3-0 para Belgrano; la liga después le dio el partido a Quilmes. Barracas Athletic–Lomas Athletic también se resolvió por escritorio, a favor de Lomas.",
      },
    ],
  }),
  afa(1906, "arg1906.html", {
    tournament: "Copa Campeonato 1906",
    championIds: ["alumni"],
    summary:
      "Por primera vez el campeonato se jugó en dos grupos: Lomas Athletic ganó el Grupo A y Alumni el Grupo B. En la final, jugada el 7 de octubre en la cancha de Porteño, Alumni goleó 4-0 y fue campeón. Debutaron San Martín Athletic, San Isidro, Argentino de Quilmes y el segundo equipo de Belgrano Athletic.",
    tableIncludesPlayoffs: true,
    tableNote: "Tabla combinada no oficial de RSSSF: suma los dos grupos y la final.",
    skip: (m) => /uruguay|argentin(e|a)\b|argentine fa/i.test(`${m.home} ${m.away}`) && !/quilmes/i.test(`${m.home} ${m.away}`),
    pointAdjustments: [{ teamId: "barracas-athletic", points: -2, reason: "Por incluir a un jugador no habilitado ante San Isidro (resolución del 4 de septiembre)." }],
    overrides: {
      "1906-07-01 barracas-athletic san-isidro": { note: "El 4 de septiembre le descontaron 2 puntos a Barracas Athletic por incluir a un jugador no habilitado en este partido." },
      "1906-07-01 estudiantes-ba san-martin-athletic": {
        note: "El acta se firmó con 2-1, aunque varios medios informaron 2-2. San Martín y el árbitro quisieron corregirla, pero la liga no lo aceptó y el 3 de octubre confirmó el 2-1: se anuló el gol de Minvielle.",
      },
    },
    notes: [
      { kind: "formato", text: "Dos grupos (A, de 6 equipos, y B, de 5) a dos ruedas; los ganadores jugaron una final a partido único. 2 puntos por victoria." },
      { kind: "puntos", text: "Final (7/10, cancha de Porteño): Alumni 4-0 Lomas Athletic, con goles de Lett, Eliseo Brown (2) y uno en contra de Campbell." },
      { kind: "puntos", text: "A Barracas Athletic le descontaron 2 puntos por incluir a un jugador no habilitado ante San Isidro." },
      { kind: "identidad", text: "\"Belgrano Extra\" era el segundo equipo del Belgrano Athletic Club." },
    ],
  }),
  afa(1907, "arg1907.html", {
    tournament: "Copa Campeonato 1907",
    championIds: ["alumni"],
    summary:
      "Alumni ganó su séptimo título. Fue el primer torneo con ascensos y descensos: el primer descendido tenía que ser Barracas Athletic, que abandonó el campeonato y terminó desafiliado.",
    wikiErrata: { "argentino-quilmes 2-1 barracas-athletic": "la tabla de la propia Wikipedia coincide con el 2-1 de RSSSF." },
    notes: [
      rr2(11),
      { kind: "retiro", text: "Barracas Athletic jugó 7 partidos, no se presentó a otros 3 y abandonó el campeonato; sus partidos restantes se dieron por ganados a los rivales." },
      { kind: "walkover", text: "Hubo varios partidos no jugados por no presentación (Lomas Athletic, San Martín Athletic, Reformer, Belgrano Athletic y Barracas Athletic); se dieron por ganados al rival." },
      { kind: "anulado", text: "Lomas Athletic–Belgrano Athletic (0-2) se anuló y se reprogramó; Lomas no se presentó a la revancha y los puntos fueron para Belgrano." },
      { kind: "fuentes", text: "Wikipedia da Argentino de Quilmes 2-0 Barracas Athletic, pero su propia tabla coincide con el 2-1 de RSSSF." },
    ],
  }),
  afa(1908, "arg1908.html", {
    tournament: "Copa Campeonato 1908",
    championIds: ["belgrano-athletic"],
    summary:
      "Belgrano Athletic fue campeón por tercera vez. El recién ascendido Nacional fue desafiliado después de jugar dos partidos por no tener una cancha en condiciones, y San Martín Athletic bajó a Segunda.",
    pointAdjustments: [
      { teamId: "san-martin-athletic", points: -2, reason: "Sanción: además de perder el partido con Porteño por escritorio." },
      { teamId: "estudiantes-ba", points: -2, reason: "Sanción: además de perder el partido con Belgrano Athletic por escritorio." },
    ],
    overrides: {
      "1908-05-10 san-martin-athletic porteno": { awardedTo: "porteno", note: "San Martín Athletic ganó 3-2 en la cancha, pero después la liga le dio el partido a Porteño y le descontó 2 puntos a San Martín." },
      "1908-08-23 estudiantes-ba belgrano-athletic": { awardedTo: "belgrano-athletic", note: "La liga le dio después el partido a Belgrano Athletic y le descontó 2 puntos a Estudiantes." },
    },
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. Empezaron 11 equipos y terminaron 10." },
      { kind: "descalificacion", text: "Nacional fue desafiliado después de jugar dos partidos (ganó 3-1 a Reformer y 3-0 a Lomas); esos resultados se anularon." },
      {
        kind: "puntos",
        text: "San Martín Athletic y Estudiantes perdieron cada uno un partido por escritorio (con Porteño y con Belgrano Athletic) y además se les descontaron 2 puntos.",
      },
      { kind: "walkover", text: "Hubo varios partidos no jugados porque uno de los equipos no se presentó (Reformer, San Martín Athletic, Lomas Athletic, Estudiantes y Quilmes); se dieron por ganados al rival." },
      {
        kind: "fuentes",
        text: "La tabla de Wikipedia no cuenta los goles de los dos partidos definidos por escritorio (San Martín 3-2 Porteño y Estudiantes 2-2 Belgrano); RSSSF sí los cuenta. Se sigue a RSSSF: los puntos y posiciones son iguales en ambas.",
      },
    ],
  }),
  afa(1909, "arg1909.html", {
    tournament: "Copa Campeonato 1909",
    championIds: ["alumni"],
    summary:
      "Alumni ganó su octavo título con 8 puntos de ventaja sobre River Plate, que debutaba en Primera. Descendieron Reformer y Lomas Athletic, el primer gran campeón del fútbol argentino, que se despidió de la liga.",
    knownTableDiffs: {
      keys: ["argentino-quilmes:goalsFor", "lomas-athletic:goalsAgainst"],
      explanation:
        "Los resultados partido por partido de RSSSF le dan a Argentino de Quilmes un gol más a favor y a Lomas Athletic uno más en contra que la tabla que publican tanto RSSSF como Wikipedia. Los puntos coinciden y no hay fuente para saber qué partido está mal, así que se dejan los resultados tal como figuran.",
    },
    notes: [
      rr2(10),
      { kind: "identidad", text: "Debutó River Plate, que había ascendido en 1908." },
      { kind: "walkover", text: "Varios partidos del final del torneo no se jugaron porque Reformer, San Isidro, Argentino de Quilmes y Porteño no se presentaron." },
    ],
  }),
  afa(1910, "arg10.html", {
    tournament: "Copa Campeonato 1910",
    championIds: ["alumni"],
    summary: "Alumni ganó su noveno título. Argentino de Quilmes terminó último y descendió; en su lugar ascendió Racing Club.",
    knownTableDiffs: {
      keys: ["estudiantes-ba:goalsFor", "estudiantes-ba:goalsAgainst", "quilmes:goalsFor", "quilmes:goalsAgainst"],
      explanation:
        "La tabla publicada (RSSSF y Wikipedia) tiene un gol más a favor y uno más en contra para Estudiantes y para Quilmes que la suma de los resultados. Coincide con que uno de sus dos partidos entre sí (3-3 y 3-0 según RSSSF) haya tenido un gol más por lado, pero no hay fuente para saber cuál, así que se dejan los resultados tal como figuran.",
    },
    notes: [rr2(9)],
  }),
  afa(1911, "arg11.html", {
    tournament: "Copa Campeonato 1911",
    championIds: ["alumni"],
    summary:
      "Último título de Alumni, el décimo de su historia, tras ganarle un desempate a Porteño. Debutó Racing Club. Fue el último torneo con el nombre en inglés de la liga, en medio de la \"fuga\" de clubes que al año siguiente derivó en el primer cisma.",
    notes: [rr2(9), { kind: "puntos", text: "Alumni y Porteño terminaron igualados en el primer puesto y jugaron un desempate." }],
  }),

  // ───────── Primer cisma: Asociación Argentina (AAF, oficial) y Federación Argentina (FAF, disidente) ─────────
  {
    slug: "1912",
    year: 1912,
    league: "AAF",
    file: "arg12.html",
    section: /Asociación Argentina/,
    wiki: wikiTitle(1912),
    competition: AAF,
    organizer: `${AAF} (la entidad oficial, que ese año castellanizó su nombre)`,
    title: "Campeonato 1912 · Asociación Argentina",
    tournament: "Copa Campeonato 1912 (Asociación Argentina de Football)",
    championIds: ["quilmes"],
    summary:
      "Quilmes ganó su primer título y, junto con el de Porteño en la Federación, marcó el fin de la hegemonía de los clubes \"ingleses\". Empezaron diez equipos pero terminaron seis: Alumni no se presentó a sus tres primeros partidos y fue desafiliado, y Estudiantes de La Plata, Gimnasia y Esgrima de Buenos Aires y Porteño se fueron a la disidente Federación Argentina de Football.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. Empezaron 10 equipos y terminaron 6." },
      { kind: "descalificacion", text: "Alumni no se presentó a sus tres primeros partidos y fue desafiliado; nunca volvió a jugar. Los partidos que le dieron por perdidos se anularon." },
      {
        kind: "anulado",
        text: "El 17 de julio, al desafiliarse Estudiantes de La Plata, Gimnasia y Esgrima de Buenos Aires y Porteño para pasar a la Federación, la Asociación anuló todos los partidos que habían jugado.",
      },
      { kind: "dato", text: "Estudiantes (BA)–San Isidro no se jugó: los dos capitanes decidieron no jugar, y el partido figura como no disputado (por eso esos dos equipos tienen 9 partidos)." },
    ],
  },
  {
    slug: "1912-faf",
    year: 1912,
    league: "FAF",
    file: "arg12.html",
    section: /Federación Argentina/,
    wiki: fafWiki(1912),
    competition: FAF,
    organizer: `${FAF} (entidad disidente, no reconocida entonces por la FIFA)`,
    title: "Campeonato 1912 · Federación Argentina",
    tournament: "Campeonato de Primera División 1912 de la Federación Argentina de Football",
    championIds: ["porteno"],
    summary:
      "Primer torneo de la Federación Argentina de Football, que se jugó en paralelo al de la Asociación. Porteño y Independiente terminaron igualados; el desempate se interrumpió a los 87 minutos porque Independiente abandonó la cancha tras tres expulsiones, y no se presentó a la revancha. Porteño fue campeón por primera vez.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 8 equipos, 2 puntos por victoria." },
      {
        kind: "puntos",
        text: "Según el reglamento, Independiente era campeón por diferencia de gol, pero como en la última fecha había goleado 5-0 a un Argentino de Quilmes con un equipo diezmado, ofreció jugar un desempate. Ese partido se terminó a los 87 minutos cuando los jugadores de Independiente se retiraron reclamando un gol, después de tres expulsiones. Independiente no se presentó a la revancha del día siguiente y Porteño quedó campeón.",
      },
      { kind: "identidad", text: "La Federación se formó con clubes que dejaron la Asociación (Porteño, Estudiantes de La Plata y Gimnasia y Esgrima de Buenos Aires) y equipos promovidos de la división Intermedia." },
    ],
  },
  {
    slug: "1913",
    year: 1913,
    league: "AAF",
    file: "arg13.html",
    section: /Asociación Argentina/,
    wiki: wikiTitle(1913),
    competition: AAF,
    organizer: AAF,
    title: "Campeonato 1913 · Asociación Argentina",
    tournament: "Copa Campeonato 1913 (Asociación Argentina de Football)",
    championIds: ["racing"],
    summary:
      "Racing ganó su primer título, el comienzo de sus siete campeonatos seguidos, al vencer 2-0 a San Isidro en la final. Como la Asociación sumó muchos equipos nuevos (llegó a 15) y no alcanzaba el tiempo para dos ruedas completas, a mitad de año reorganizó el torneo en grupos. Ese año debutaron Boca Juniors, Platense, Ferro Carril Oeste y Estudiantil Porteño, y se jugó el primer Superclásico oficial (Boca 1-2 River, 24 de agosto).",
    tableIncludesPlayoffs: true,
    tableNote: "Tabla combinada no oficial de RSSSF: suma todas las fases, desempate y final.",
    notes: [
      {
        kind: "formato",
        text: "Estaba previsto a dos ruedas entre 15 equipos, pero por falta de tiempo el 8 de octubre la Asociación lo reorganizó: se mantuvieron los puntos de la primera rueda, los 11 primeros se dividieron en los grupos A y B (con partidos de vuelta solo dentro del grupo) y los últimos cuatro jugaron el Grupo C para evitar el descenso. Los ganadores de los grupos A y B jugaron la final.",
      },
      { kind: "puntos", text: "Racing y River empataron el Grupo A y jugaron un desempate (Racing 3-0). En la final, Racing le ganó 2-0 a San Isidro." },
      { kind: "anulado", text: "Comercio–Banfield (1-1, 5 de octubre) se anuló por la reorganización del torneo." },
      { kind: "retiro", text: "Belgrano Athletic se retiró del torneo en octubre; sus partidos restantes se dieron por perdidos." },
      { kind: "descalificacion", text: "Olivos y Riachuelo descendieron desde el Grupo C." },
    ],
  },
  {
    slug: "1913-faf",
    year: 1913,
    league: "FAF",
    file: "arg13.html",
    section: /Federación Argentina/,
    tableIndex: 1,
    wiki: fafWiki(1913),
    competition: FAF,
    organizer: `${FAF} (entidad disidente)`,
    title: "Campeonato 1913 · Federación Argentina",
    tournament: "Campeonato de Primera División 1913 de la Federación Argentina de Football",
    championIds: ["estudiantes"],
    aliases: { "CA Estudiantes": "estudiantes", "Club Atlético Estudiantes": "estudiantes", Estudiantes: "estudiantes" },
    overrides: {
      "1913-07-27 kimberley porteno": {
        status: "official",
        venue: "Cancha de Kimberley",
        note: "El primer partido (en cancha de Argentino de Quilmes) se suspendió a los 75 minutos con 0-0 y se anuló. Este 3-1 es el de la revancha, jugada el 15 de agosto.",
      },
      "1913-09-21 sportiva-argentina kimberley": { note: "No se jugó oficialmente: Sportiva Argentina perdió los puntos y el partido se jugó como amistoso (0-4, 60 minutos)." },
    },
    summary: "Estudiantes de La Plata ganó su primer título en el segundo torneo de la Federación, con tres puntos de ventaja sobre Gimnasia y Esgrima de Buenos Aires. Debutó Tigre.",
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas entre 10 equipos, 2 puntos por victoria." },
      { kind: "identidad", text: "Hispano Argentino figura en Wikipedia como antecesor del Club Columbian." },
      { kind: "descalificacion", text: "Sociedad Sportiva Argentina terminó último sin ganar un partido y descendió." },
      { kind: "fuentes", text: "La tabla de Wikipedia le da a Estudiantes un gol más a favor (64) y a Sportiva Argentina uno más en contra (52): difieren en uno de sus dos partidos. Se usan los resultados de RSSSF, que cierran con su tabla." },
    ],
  },
  {
    slug: "1914",
    year: 1914,
    league: "AAF",
    file: "arg14.html",
    section: /Copa Campeonato 1914/,
    wiki: wikiTitle(1914),
    competition: AAF,
    organizer: AAF,
    title: "Campeonato 1914 · Asociación Argentina",
    tournament: "Copa Campeonato 1914 (Asociación Argentina de Football)",
    championIds: ["racing"],
    summary: "Racing ganó su segundo título seguido con 11 victorias y un empate en 12 partidos. Debutó Huracán. Fue el último torneo del primer cisma: en 1915 las dos ligas se unificaron.",
    notes: [{ kind: "formato", text: "Todos contra todos a una rueda entre 13 equipos, 2 puntos por victoria." }],
  },
  {
    slug: "1914-faf",
    year: 1914,
    league: "FAF",
    file: "arg14.html",
    section: /Primera División 1914/,
    wiki: fafWiki(1914),
    competition: FAF,
    organizer: `${FAF} (entidad disidente)`,
    title: "Campeonato 1914 · Federación Argentina",
    tournament: "Campeonato de Primera División 1914 de la Federación Argentina de Football",
    championIds: ["porteno"],
    aliases: { Estudiantes: "estudiantes" },
    summary:
      "Porteño ganó su segundo título, invicto, en el último torneo de la Federación. Empezaron diez equipos y terminaron ocho: Tigre fue expulsado y Argentino de Quilmes perdió la afiliación, y se anularon sus partidos.",
    withdrawn: ["tigre", "argentino-quilmes"],
    notes: [
      { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. Empezaron 10 equipos y terminaron 8." },
      { kind: "descalificacion", text: "Tigre fue expulsado después de jugar 14 partidos y Argentino de Quilmes perdió la afiliación después de 7; todos sus partidos se anularon." },
    ],
  },

  // ───────── Liga unificada de la Asociación Argentina (1915–1918) ─────────
  {
    slug: "1915",
    year: 1915,
    file: "arg15.html",
    wiki: wikiTitle(1915),
    competition: AAF,
    organizer: `${AAF} (con la Federación ya reincorporada)`,
    title: "Campeonato 1915",
    tournament: "Copa Campeonato 1915",
    championIds: ["racing"],
    summary:
      "Primer torneo tras la reunificación con la Federación: 25 equipos a una rueda. San Isidro terminó primero, pero Racing, que tenía partidos pendientes, lo alcanzó; en el desempate jugado en cancha de Independiente ganó Racing 1-0 y consiguió su tercer título seguido, invicto. Debutó San Lorenzo.",
    notes: [
      { kind: "formato", text: "Todos contra todos a una rueda entre 25 equipos, 2 puntos por victoria. El empate en el primer puesto se resolvió con un desempate." },
      { kind: "puntos", text: "Racing y San Isidro terminaron igualados. Desempate en la cancha de Independiente: Racing 1-0." },
      {
        kind: "puntos",
        text: "Racing había perdido 2-1 con Independiente, pero se le dieron los puntos por la mala inclusión de Victorio Cappelletti en Independiente.",
      },
      { kind: "descalificacion", text: "Descendieron Kimberley, Defensores de Belgrano, Comercio y Floresta." },
      { kind: "puntos", text: "Banfield también perdió por escritorio los puntos de dos partidos (con Porteño y con San Isidro)." },
      {
        kind: "fuentes",
        text: "La tabla de Wikipedia no cuenta los goles de los partidos definidos por escritorio y difiere en los goles de siete equipos; los puntos y las posiciones coinciden. Se usan los resultados de RSSSF, que cierran con su tabla.",
      },
    ],
  },
  {
    slug: "1916",
    year: 1916,
    file: "arg16.html",
    wiki: wikiTitle(1916),
    competition: AAF,
    organizer: AAF,
    title: "Campeonato 1916",
    tournament: "Copa Campeonato 1916",
    championIds: ["racing"],
    summary: "Racing ganó su cuarto título seguido; lo aseguró en la vigésima fecha con un 2-0 a Ferro Carril Oeste. Debutó Gimnasia y Esgrima La Plata.",
    notes: [
      { kind: "formato", text: "Todos contra todos a una rueda entre 22 equipos, 2 puntos por victoria." },
      { kind: "descalificacion", text: "Descendieron Belgrano Athletic y Quilmes." },
    ],
  },
  {
    slug: "1917",
    year: 1917,
    file: "arg17.html",
    wiki: wikiTitle(1917),
    competition: AAF,
    organizer: AAF,
    title: "Campeonato 1917",
    tournament: "Copa Campeonato 1917",
    championIds: ["racing"],
    summary: "Racing ganó su quinto título seguido; lo aseguró en la fecha 19 con un 2-0 a Gimnasia y Esgrima La Plata. Debutó Sportivo Barracas.",
    notes: [{ kind: "formato", text: "Todos contra todos a una rueda entre 21 equipos, 2 puntos por victoria." }],
  },
  {
    slug: "1918",
    year: 1918,
    file: "arg18.html",
    wiki: wikiTitle(1918),
    competition: AAF,
    organizer: AAF,
    title: "Campeonato 1918",
    tournament: "Copa Campeonato 1918",
    championIds: ["racing"],
    summary: "Racing ganó su sexto título seguido, invicto; lo aseguró en la fecha 16 con un 4-1 a Platense de visitante.",
    notes: [{ kind: "formato", text: "Todos contra todos a una rueda entre 20 equipos, 2 puntos por victoria." }],
  },

  // ───────── Segundo cisma (1919–1926) ─────────
  aaf2(1919, "arg19.html", /Asociación Argentina/, {
    tournament: "Copa Campeonato 1919 (Asociación Argentina de Football)",
    championIds: ["boca"],
    aliases: { Columbian: "almagro", "Sportivo de Almagro": "almagro", "Spotivo de Almagro": "almagro" },
    annulBefore: {
      date: "1919-09-28",
      note: "Primera etapa del torneo, anulada cuando 13 clubes fueron desafiliados o expulsados y formaron la Asociación Amateurs.",
    },
    summary:
      "Un año caótico. El torneo empezó con 19 equipos, pero en septiembre 13 clubes fueron desafiliados o expulsados y formaron la Asociación Amateurs; la primera etapa se anuló. Los seis que quedaron jugaron un torneo de emergencia que la liga dio por terminado en enero de 1920 con partidos sin jugar. Boca Juniors lo ganó con ocho victorias en ocho partidos: su primer título.",
    notes: [
      CISMA2,
      { kind: "formato", text: "Torneo de emergencia a una rueda entre 6 equipos, 2 puntos por victoria. El 20 de enero de 1920 la liga lo dio por terminado sin completar el fixture, con las posiciones de ese momento." },
      {
        kind: "anulado",
        text: "La primera etapa (marzo a agosto, 19 equipos) se anuló. Sus partidos se muestran pero no suman: entre ellos el Boca 0-0 River del 27 de julio.",
      },
      {
        kind: "descalificacion",
        text: "El 9 de septiembre se desafilió a Independiente, Racing, River, Platense, Tigre y Estudiantil Porteño; el 19 se expulsó a San Isidro, Gimnasia y Esgrima La Plata, San Lorenzo, Defensores de Belgrano, Sportivo Barracas, Atlanta y Estudiantes (BA).",
      },
      {
        kind: "identidad",
        text: "A mitad de año Columbian se fusionó con el Club Almagro y pasó a jugar como Sportivo de Almagro, antecesor del actual Club Almagro. En este torneo se lo cuenta como un solo equipo.",
      },
      { kind: "walkover", text: "Dos partidos del torneo de emergencia se suspendieron y la liga dio por buenos los resultados del momento (Eureka 0-0 Estudiantes de La Plata y Eureka 0-2 Boca)." },
    ],
  }),
  aam(1919, "arg19.html", /Asociación Amateurs/, {
    tournament: "Campeonato 1919 de la Asociación Amateurs de Football",
    championIds: ["racing"],
    summary:
      "Primer torneo de la Asociación Amateurs, formada por los 13 clubes que dejaron la Asociación Argentina más Vélez Sarsfield. Racing ganó los 13 partidos y consiguió su séptimo título seguido, el cierre del heptacampeonato; lo aseguró con un 2-1 a Tigre.",
    overrides: {
      "1919-11-30 platense san-isidro": {
        homeGoals: 0,
        awayGoals: 0,
        walkover: true,
        awardedTo: "platense",
        note: "Se suspendió a los 20 minutos con 1-0 para Platense; San Isidro no se presentó a jugar los 70 minutos restantes (14/12) y los puntos fueron para Platense. Las tablas publicadas no cuentan el gol.",
      },
    },
    notes: [
      CISMA2,
      rr1(14, " Se jugó entre el 28 de septiembre y el 6 de enero de 1920."),
      { kind: "identidad", text: "Debutó Vélez Sarsfield, que se sumó después de jugadas las dos primeras fechas y las recuperó más tarde." },
      { kind: "walkover", text: "Varios partidos suspendidos no se completaron porque uno de los equipos no se presentó a jugar los minutos restantes; se dieron por ganados al rival." },
      { kind: "anulado", text: "Cinco partidos suspendidos se anularon y se volvieron a jugar (entre ellos River–Independiente y River–Gimnasia y Esgrima La Plata); vale el resultado de la revancha." },
      { kind: "fuentes", text: "La tabla de Wikipedia difiere en un partido entre Vélez Sarsfield y Atlanta; se sigue la de RSSSF, que cierra con los resultados." },
    ],
  }),
  aaf2(1920, "arg20.html", /Asociación Argentina/, {
    tournament: "Copa Campeonato 1920 (Asociación Argentina de Football)",
    championIds: ["boca"],
    summary:
      "Boca Juniors ganó su segundo título seguido. Empezaron 13 equipos, pero durante el torneo Lanús, Sportivo Almagro y Palermo se fueron: los dos primeros pasaron a la Asociación Amateurs.",
    notes: [
      CISMA2,
      { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. Empezaron 13 equipos." },
      {
        kind: "retiro",
        text: "Lanús y Sportivo Almagro se desafiliaron a mitad de año para pasar a la Asociación Amateurs, y Palermo también se fue. Sus partidos pendientes se definieron por escritorio; los que tenían entre ellos se les dieron por perdidos a los dos.",
      },
    ],
  }),
  aam(1920, "arg20.html", /Asociación Amateur/, {
    tournament: "Campeonato 1920 de la Asociación Amateurs de Football",
    championIds: ["river"],
    summary:
      "River Plate ganó su único título de la era amateur y cortó la racha de siete campeonatos seguidos de Racing. Empezaron 17 equipos y a mitad de año se sumaron Lanús y Sportivo Almagro, que llegaron de la Asociación Argentina y jugaron solo la segunda mitad.",
    notes: [CISMA2, { kind: "formato", text: "Todos contra todos a dos ruedas, 2 puntos por victoria. 17 equipos al principio y 19 al final; no hubo descensos." }],
  }),
  aaf2(1921, "arg21.html", /Copa Campeonato 1921/, {
    tournament: "Copa Campeonato 1921 (Asociación Argentina de Football)",
    championIds: ["huracan"],
    summary: "Huracán ganó su primer título.",
    notes: [CISMA2, rr2(10)],
  }),
  aam(1921, "arg21.html", /^Primera División$/, {
    tournament: "Campeonato 1921 de la Asociación Amateurs de Football",
    championIds: ["racing"],
    summary: "Racing ganó su octavo título, con el 87 % de los puntos en juego. General Mitre fue desafiliado durante la temporada y se anularon sus partidos.",
    annulTeams: [{ id: "general-mitre", note: "General Mitre fue desafiliado durante el torneo y se anularon todos sus partidos." }],
    // RSSSF lista dos veces el Independiente–Quilmes del 11/12: un 3-0 y el W.O. por retiro de Quilmes; la tabla cuenta el W.O.
    skip: (m) => m.home === "Independiente" && m.away === "Quilmes" && m.score === "3-0" && /^Dec 11/.test(m.date),
    overrides: {
      "1921-12-11 independiente quilmes": {
        note: "RSSSF registra un 3-0 y, para el mismo partido, que Quilmes se retiró. La tabla publicada lo cuenta como ganado por Independiente sin goles.",
      },
    },
    knownTableDiffs: {
      keys: ["atlanta:goalsAgainst", "ferro:goalsFor"],
      explanation:
        "La tabla publicada (RSSSF) le da a Ferro Carril Oeste un gol más a favor y a Atlanta uno más en contra que los resultados. Cerraría si el Atlanta 2-0 Ferro hubiera sido 2-1, pero ninguna fuente lo confirma, así que se deja el resultado registrado.",
    },
    notes: [CISMA2, rr2(20), { kind: "descalificacion", text: "General Mitre fue desafiliado durante la temporada; todos sus partidos se anularon y no figura en la tabla." }],
  }),
  aaf2(1922, "arg22.html", /Copa Campeonato 1922/, {
    tournament: "Copa Campeonato 1922 (Asociación Argentina de Football)",
    championIds: ["huracan"],
    summary: "Huracán ganó su segundo título seguido.",
    overrides: {
      "1923-01-14 del-plata progresista": {
        homeGoals: 1,
        awayGoals: 0,
        walkover: false,
        awardedTo: "del-plata",
        note: "Se suspendió el 8 de octubre a los 79 minutos con 1-0 para Del Plata; Progresista no se presentó a completarlo el 14 de enero de 1923 y los puntos fueron para Del Plata. La tabla cuenta el 1-0.",
      },
    },
    notes: [CISMA2, rr1(17)],
  }),
  aam(1922, "arg22.html", /^Primera División$/, {
    tournament: "Campeonato 1922 de la Asociación Amateurs de Football",
    championIds: ["independiente"],
    summary:
      "Independiente ganó su primer título. El torneo empezó en abril de 1922 y, con una pausa entre enero y marzo, terminó recién en julio de 1923. Palermo descendió y se pasó a la Asociación Argentina.",
    overrides: {
      "1922-12-24 sanlorenzo river": {
        homeGoals: 1,
        awayGoals: 1,
        note: "Se suspendió a los 42 minutos con 0-1 y se completó el 13 de mayo de 1923. RSSSF no publica el resultado final; las tablas publicadas (RSSSF y Wikipedia) solo cierran si terminó 1-1, que es el que se carga.",
      },
    },
    notes: [
      CISMA2,
      rr2(21),
      {
        kind: "fuentes",
        text: "San Lorenzo–River (suspendido con 0-1 y completado en 1923) figura sin resultado final en RSSSF; se carga 1-1, el único resultado con el que cierran las tablas publicadas.",
      },
    ],
  }),
  aaf2(1923, "arg23.html", /Asociación Argentina/, {
    tournament: "Copa Campeonato 1923 (Asociación Argentina de Football)",
    championIds: ["boca"],
    summary:
      "Boca Juniors fue campeón tras vencer a Huracán en un desempate que se jugó entre marzo y abril de 1924, con el torneo siguiente ya empezado. La liga dio por terminado el campeonato sin completar el fixture y mandó a jugar el desempate a los dos que compartían la punta. Estudiantes de La Plata y Sportivo Palermo se retiraron a mitad de año, sin que se anularan sus partidos.",
    playoffFrom: { date: "1924-01-01", stage: "Desempate por el título" },
    knownTableDiffs: {
      keys: ["boca-alumni:drawn", "boca-alumni:lost", "boca-alumni:goalsFor", "boca-alumni:goalsAgainst", "boca-alumni:points"],
      explanation:
        "La tabla publicada le da a Boca Alumni un empate más, una derrota menos y un gol más a favor y en contra que la suma de sus resultados. Ninguno de sus rivales tiene la diferencia que correspondería, así que la inconsistencia está en la propia tabla; se dejan los resultados tal como figuran.",
    },
    notes: [
      CISMA2,
      { kind: "formato", text: "Previsto a dos ruedas entre 23 equipos (46 fechas); a fin de año solo se habían jugado dos tercios de los partidos y la liga lo dio por terminado." },
      {
        kind: "puntos",
        text: "Boca y Huracán terminaron igualados en 51 puntos y jugaron una serie de desempate: Boca 3-0, Huracán 2-0, 0-0 con alargue y finalmente Boca 2-0 en el alargue (27 de abril de 1924), con dos goles de Garassino.",
      },
      { kind: "retiro", text: "Estudiantes de La Plata y Sportivo Palermo se retiraron a mitad de año para pasar a la Asociación Amateurs; sus partidos jugados se mantuvieron." },
    ],
  }),
  aam(1923, "arg23.html", /Asociación Amateur/, {
    tournament: "Campeonato 1923 de la Asociación Amateurs de Football",
    championIds: ["sanlorenzo"],
    summary: "San Lorenzo ganó su primer título.",
    notes: [CISMA2, rr1(21, " Se jugó entre julio de 1923 y enero de 1924.")],
  }),
  aaf2(1924, "arg24.html", /Copa Campeonato 1924/, {
    tournament: "Copa Campeonato 1924 (Asociación Argentina de Football)",
    championIds: ["boca"],
    summary: "Boca Juniors fue campeón invicto por segunda vez seguida, aunque jugó dos partidos menos que Temperley, el segundo: otra vez el fixture no se completó.",
    aliases: { Platense: "platense-retiro" },
    knownTableDiffs: {
      keys: ["sportivo-barracas:goalsAgainst", "progresista:goalsFor"],
      explanation:
        "La tabla publicada le da a Progresista dos goles más a favor y a Sportivo Barracas uno más en contra que la suma de los resultados de RSSSF. No hay fuente para saber qué partidos difieren; se dejan los resultados tal como figuran.",
    },
    notes: [
      CISMA2,
      rr1(22, " El fixture no se completó."),
      { kind: "identidad", text: "El \"Platense\" de la Asociación Argentina es el Platense (Retiro), escindido del Platense que jugaba en la Asociación Amateurs." },
    ],
  }),
  aam(1924, "arg24.html", /Primera División 1924/, {
    tournament: "Campeonato 1924 de la Asociación Amateurs de Football",
    championIds: ["sanlorenzo"],
    summary: "San Lorenzo ganó su segundo título seguido.",
    playoffFrom: { date: "1925-01-01", stage: "Desempate por el descenso" },
    pointAdjustments: [{ teamId: "argentino-del-sud", points: -2, reason: "Sanción en el partido con Estudiantil Porteño (suspendido a los 70 minutos)." }],
    knownTableDiffs: {
      keys: ["atlanta:goalsFor", "ferro:goalsAgainst"],
      explanation:
        "La tabla publicada le da a Atlanta un gol más a favor y a Ferro Carril Oeste uno más en contra que la suma de los resultados; probablemente difieren en uno de sus partidos entre sí, pero no hay fuente que lo confirme.",
    },
    notes: [
      CISMA2,
      rr1(24),
      {
        kind: "puntos",
        text: "Argentino del Sud–Estudiantil Porteño se suspendió a los 70 minutos con 1-1; los puntos fueron para Estudiantil Porteño y a Argentino del Sud le descontaron 2 puntos.",
      },
      {
        kind: "descalificacion",
        text: "Argentino del Sud, Quilmes y Ferro Carril Oeste empataron en el anteúltimo puesto y jugaron un desempate por el descenso en enero y febrero de 1925 (no suma en la tabla). Terminó último Quilmes, pero se salvó porque la liga cambió el reglamento; Estudiantes (BA), último en la tabla, también se salvó por el mismo motivo.",
      },
    ],
  }),
  aaf2(1925, "arg25.html", /Copa ?Campeonato 1925/, {
    tournament: "Copa Campeonato 1925 (Asociación Argentina de Football)",
    championIds: ["huracan"],
    summary:
      "Huracán ganó su tercer título al vencer en un desempate a Nueva Chicago, con el que había compartido la punta; el partido se jugó recién el 22 de agosto de 1926. Boca Juniors jugó solo siete partidos y se fue de gira por Europa; al volver, la liga le dio el título honorífico de \"Campeón de Honor 1925\".",
    // Villa Urquiza se fusionó con General San Martín, que ocupó su lugar; el Platense de esta liga es el de Retiro (luego Universal).
    aliases: { Urquiza: "general-san-martin", "Villa Urquiza": "general-san-martin", Platense: "platense-retiro" },
    overrides: {
      "1925-06-07 sportivo-barracas boca-alumni": {
        status: "annulled",
        note: "Se suspendió a los 65 minutos con 0-0 y quedó \"indefinido\": la liga no homologó el resultado. No suma.",
      },
    },
    notes: [
      CISMA2,
      rr1(23, " No se jugaron todos los partidos programados."),
      {
        kind: "identidad",
        text: "Villa Urquiza se fusionó con General San Martín, que ocupó su lugar en el torneo: en esta temporada se los cuenta como un solo equipo. El \"Platense\" de la Asociación Argentina es el Platense (Retiro), que ese año pasó a llamarse Universal.",
      },
      { kind: "anulado", text: "Sportivo Barracas–Boca Alumni se suspendió a los 65 minutos y quedó sin definir; no suma." },
    ],
  }),
  aam(1925, "arg25.html", /Primera División 1925/, {
    tournament: "Campeonato 1925 de la Asociación Amateurs de Football",
    championIds: ["racing"],
    summary: "Racing ganó su noveno título, con el 81 % de los puntos.",
    notes: [CISMA2, rr1(25)],
  }),
  aaf2(1926, "arg26.html", /Copa Campeonato 1926/, {
    tournament: "Copa Campeonato 1926 (Asociación Argentina de Football)",
    championIds: ["boca"],
    summary:
      "Boca Juniors ganó su quinto título, invicto. A mitad del torneo seis de los 24 clubes perdieron la afiliación y se pasaron a la Asociación Amateurs, y sus partidos se anularon. Fue el último torneo de la Asociación Argentina: en 1927 las dos ligas se fusionaron.",
    knownTableDiffs: {
      keys: ["general-san-martin:points", "argentinos:goalsFor", "alvear:goalsAgainst"],
      explanation:
        "La tabla publicada le da a General San Martín 2 puntos menos de los que suman sus resultados (probablemente una sanción que RSSSF no detalla), y a Argentinos Juniors un gol más a favor y a Alvear uno más en contra (su partido se suspendió con 1-0 y se definió por escritorio). Se dejan los resultados tal como figuran.",
    },
    notes: [
      CISMA2,
      { kind: "formato", text: "Todos contra todos a una rueda, 2 puntos por victoria. Empezaron 24 equipos y terminaron 18." },
      { kind: "descalificacion", text: "Seis clubes perdieron la afiliación en medio del torneo y pasaron a la Asociación Amateurs; sus partidos se anularon." },
    ],
  }),
  aam(1926, "arg26.html", /Primera División 1926/, {
    tournament: "Campeonato 1926 de la Asociación Amateurs de Football",
    championIds: ["independiente"],
    summary: "Independiente ganó su segundo título. Con 26 equipos fue, hasta ese momento, el torneo de Primera con más participantes. Fue el último torneo de la Asociación Amateurs antes de la fusión de 1927.",
    notes: [CISMA2, rr1(26)],
  }),

  // ───────── Asociación Amateurs Argentina de Football: liga reunificada (1927–1930) ─────────
  {
    slug: "1927",
    year: 1927,
    file: "arg27.html",
    section: /Primera División 1927/,
    wiki: wikiTitle(1927),
    competition: AAAF,
    organizer: `${AAAF} (fusión de las dos ligas)`,
    title: "Campeonato 1927",
    tournament: "Copa Campeonato 1927",
    championIds: ["sanlorenzo"],
    summary:
      "Primer torneo de la liga reunificada, con 34 equipos a una rueda. Boca terminó su campaña primero al 31 de diciembre, pero San Lorenzo tenía seis partidos pendientes: ganó los cinco últimos y fue campeón por un punto, con el 3-1 a Barracas Central del 12 de febrero de 1928.",
    playoffFrom: { date: "1928-03-01", stage: "Desempate por el puesto 30" },
    pointAdjustments: [{ teamId: "talleres-re", points: -2, reason: "Sanción: además de perder por escritorio el partido con Banfield." }],
    overrides: {
      "1927-12-04 excursionistas estudiantil-porteno": {
        status: "annulled",
        note: "Se suspendió a los 84 minutos con 1-1. RSSSF indica que se completó el 5 de febrero de 1928, pero no publica el resultado y la tabla final no lo cuenta. No suma.",
      },
    },
    knownTableDiffs: {
      keys: ["banfield:goalsFor", "talleres-re:goalsAgainst"],
      explanation:
        "Banfield–Talleres (1-2) se le dio por escritorio a Banfield. La tabla publicada descuenta el gol de Banfield pero no los dos de Talleres, así que difiere en un gol con la suma de los resultados. Se deja el resultado de la cancha.",
    },
    notes: [
      rr1(34, " Terminó en febrero de 1928."),
      { kind: "puntos", text: "Talleres (RdE) le ganó 2-1 a Banfield en la primera fecha, pero después perdió los puntos y además le descontaron 2." },
      { kind: "descalificacion", text: "Defensores de Belgrano y Tigre empataron el puesto 30 y jugaron un desempate en abril de 1928 (1-1 y 1-0 para Defensores); no suma en la tabla." },
      { kind: "identidad", text: "Se armó con los 26 equipos de la Asociación Amateurs de 1926, siete de la Asociación Argentina (Argentino de Quilmes, Argentinos Juniors, Boca Juniors, Chacarita Juniors, Huracán, Porteño y San Fernando) y Sportivo Barracas, reincorporado." },
      { kind: "dato", text: "No hubo descensos: el reglamento protegía a los clubes que habían jugado el campeonato de 1919." },
    ],
  },
  {
    slug: "1928",
    year: 1928,
    file: "arg28.html",
    section: /Asociación Amateurs Argentina/,
    wiki: wikiTitle(1928),
    competition: AAAF,
    organizer: AAAF,
    title: "Campeonato 1928",
    tournament: "Copa Campeonato 1928",
    championIds: ["huracan"],
    summary:
      "Huracán ganó su cuarto título. Con 36 equipos fue, junto con el de 1930, el torneo de Primera con más participantes de la historia; empezó en abril de 1928 y terminó en julio de 1929. Ese año Boca le ganó 6-0 a River, la mayor goleada del Superclásico.",
    notes: [
      rr1(36, " Terminó en julio de 1929."),
      { kind: "descalificacion", text: "Descendieron Porteño y Liberal Argentino. Defensores de Belgrano se salvó por la regla que protegía a los clubes del campeonato de 1919." },
    ],
  },
  {
    slug: "1929",
    year: 1929,
    file: "arg29.html",
    section: /Argentina 1929/,
    tableIndex: [0, 1],
    groupNames: ["Zona Impar", "Zona Par"],
    wiki: wikiTitle(1929),
    competition: AAAF,
    organizer: AAAF,
    title: "Campeonato 1929",
    tournament: "Campeonato Estímulo 1929 (homologado como Campeonato de Primera División)",
    championIds: ["gimnasia"],
    overrides: {
      "1930-02-09 boca gimnasia": { venue: "Cancha de River Plate" },
      "1929-09-15 san-fernando tigre": {
        status: "official",
        note: "Se suspendió a los 43 minutos con 1-1. La liga amonestó a Tigre pero nunca definió el resultado, así que quedó el 1-1 (así figura en la tabla).",
      },
    },
    summary:
      "Como el torneo de 1928 se estiró hasta mediados de 1929, ese año se jugó un campeonato especial a una rueda, en dos zonas (Impar y Par). Gimnasia y Esgrima La Plata ganó la Zona Impar y la final, y consiguió su primer y único título de Primera. En la Zona Par, Boca y San Lorenzo empataron el primer puesto y necesitaron tres desempates.",
    notes: [
      { kind: "formato", text: "Dos zonas a una rueda (Impar, 18 equipos; Par, 17), 2 puntos por victoria. Los ganadores jugaron la final y los segundos, el tercer puesto. No hubo descensos." },
      { kind: "puntos", text: "En la Zona Par, Boca y San Lorenzo terminaron igualados y jugaron tres desempates para definir el finalista. Los desempates, el tercer puesto y la final no suman en las tablas de las zonas." },
      { kind: "identidad", text: "Fue el único torneo del año y se homologó como el Campeonato de Primera División 1929." },
      { kind: "dato", text: "No hubo Superclásico ni Clásico de Avellaneda: River y Racing jugaron en la Zona Impar, y Boca e Independiente en la Par." },
      {
        kind: "retiro",
        text: "Fue un torneo caótico. En diciembre la liga permitió abandonar el concurso, con la regla de que un equipo que no se presentaba perdía todos los puntos que le quedaban. Se retiraron o dejaron de presentarse, entre otros, Platense, Huracán, Argentino de Quilmes, Sportivo Buenos Aires, San Fernando, Atlanta, Excursionistas, Ferro Carril Oeste, Estudiantes de La Plata, Banfield, San Isidro, Defensores de Belgrano, Quilmes y Argentino de Banfield.",
      },
      {
        kind: "walkover",
        text: "Muchos partidos se definieron por escritorio y algunos se les dieron por perdidos a los dos equipos. RSSSF detalla las resoluciones de la liga y los casos dudosos; se usa la resolución final de cada uno.",
      },
      { kind: "descalificacion", text: "Sportivo Barracas y Platense fueron suspendidos un mes por incidentes, y perdieron los puntos de los partidos que les quedaban." },
    ],
  },
  {
    slug: "1930",
    year: 1930,
    file: "arg30.html",
    section: /Asociación Amateurs Argentina/,
    wiki: wikiTitle(1930),
    competition: AAAF,
    organizer: AAAF,
    title: "Campeonato 1930",
    tournament: "Copa Campeonato 1930",
    championIds: ["boca"],
    summary:
      "Boca Juniors ganó su sexto título en el último campeonato de la era amateur. Hubo una pausa entre junio y agosto por el Mundial de Uruguay, y terminó en abril de 1931. Ese año 18 clubes se separaron y fundaron la Liga Argentina de Football, que en 1931 organizó el primer torneo profesional.",
    notes: [
      rr1(36, " Hubo una pausa por el Mundial de 1930 y terminó en abril de 1931."),
      { kind: "descalificacion", text: "Descendieron Honor y Patria y Argentino del Sud; San Isidro abandonó." },
      { kind: "dato", text: "Último campeonato de la era amateur: en 1931 empezó el profesionalismo con la Liga Argentina de Football." },
    ],
  },

  // ───────── 1931–1934: la Liga Argentina de Football (profesional) y la liga amateur oficial, en paralelo ─────────
  {
    slug: "1931",
    year: 1931,
    league: "LAF",
    file: "arg31.html",
    wiki: wikiTitle(1931),
    competition: LAF,
    organizer: `${LAF} (profesional)`,
    title: "Campeonato 1931 · Liga Argentina (profesional)",
    tournament: "Campeonato 1931 de la Liga Argentina de Football",
    championIds: ["boca"],
    aliases: { Estudiantes: "estudiantes", "Gimnasia (LP)": "gimnasia" },
    wikiErrata: {
      "RSSSF lanus 1-0 talleres-re": "Wikipedia da 0-1, pero la tabla oficial (10 victorias de Lanús) solo cierra con el 1-0 que da RSSSF.",
    },
    extraMatches: [
      {
        id: "1931-extra-1",
        date: "1932-01-07",
        phase: "league",
        homeId: "lanus",
        awayId: "platense",
        homeGoals: 1,
        awayGoals: 1,
        goalsVoid: true,
        awardedTo: "lanus",
        note: "Se suspendió a los 49 minutos con 1-1 y Platense se retiró: la liga le dio el partido a Lanús. Los goles no se cuentan en la tabla oficial (memoria anual).",
      },
    ],
    summary:
      "Primer campeonato profesional. Los 18 clubes más convocantes dejaron la asociación oficial en mayo y fundaron la Liga Argentina de Football. Boca Juniors fue el primer campeón profesional, cinco puntos arriba de San Lorenzo.",
    notes: [
      rr2(18),
      PRO2,
      { kind: "identidad", text: "La Liga Argentina no estaba reconocida por la FIFA; hoy la AFA cuenta sus campeonatos como de Primera División, igual que los de la liga amateur oficial de esos años." },
    ],
  },
  {
    slug: "1931-amateur",
    year: 1931,
    league: "Amateur",
    file: "arg31a.html",
    allSections: true,
    tableIndex: 1,
    ignoreRounds: /^Playoff/,
    // Tres partidos suspendidos cuyo resultado la asociación dio por bueno después: RSSSF los lista dos veces
    // (el día del partido y el de la resolución). Queda uno solo, con la fecha en que se jugó.
    overrides: {
      "1931-09-13 barracas-central sportivo-buenos-aires": "skip",
      "1931-12-23 barracas-central sportivo-buenos-aires": {
        date: "1931-09-13",
        note: "Se suspendió con 1-4; el 23/12 la asociación dio por bueno ese resultado.",
      },
      "1931-10-04 excursionistas el-porvenir": "skip",
      "1931-11-04 excursionistas el-porvenir": {
        date: "1931-10-04",
        note: "Se suspendió a los 75 minutos con 3-1; el 4/11 la asociación dio por bueno ese resultado.",
      },
      "1931-11-01 argentino-quilmes estudiantes-ba": "skip",
      "1931-11-04 argentino-quilmes estudiantes-ba": {
        date: "1931-11-01",
        note: "Se suspendió a los 30 minutos con 4-2; el 4/11 la asociación dio por bueno ese resultado.",
      },
    },
    wiki: "Campeonato de Primera División 1931 de la AFAP (Argentina)",
    competition: "Asociación Argentina de Football (Amateurs y Profesionales)",
    organizer: "Asociación Argentina de Football (Amateurs y Profesionales), entidad oficial afiliada a la FIFA",
    title: "Campeonato 1931 · Liga amateur (oficial)",
    tournament: "Copa Campeonato 1931 de la Asociación Argentina de Football (Amateurs y Profesionales)",
    championIds: ["estudiantil-porteno"],
    playoffFrom: { date: "1931-12-27", stage: "Desempate por el título" },
    summary:
      "El campeonato de la asociación oficial empezó en mayo con 34 equipos, pero se anuló después de la primera fecha, cuando 18 clubes se fueron a la Liga Argentina profesional. Se volvió a empezar con 16 equipos: Estudiantil Porteño y Almagro terminaron igualados y Estudiantil Porteño ganó el desempate 3-1.",
    notes: [
      rr1(16, " El empate en el primer puesto se resolvió con un desempate."),
      PRO2,
      { kind: "anulado", text: "El torneo original, con 34 equipos, se anuló después de la primera fecha (10 de mayo) por la salida de los clubes que fundaron la liga profesional. Esos partidos se muestran pero no suman." },
      { kind: "retiro", text: "San Isidro fue promovido, pero sus partidos se anularon." },
      { kind: "identidad", text: "Sportivo Buenos Aires se fusionó con Social y Deportivo Buenos Aires y pasó a llamarse Social y Sportivo Buenos Aires. Argentino de Lomas es el Club Argentino de Banfield." },
      { kind: "puntos", text: "Desempate por el título: Estudiantil Porteño 3-1 Almagro (27 de diciembre). No suma en la tabla." },
      { kind: "descalificacion", text: "Descendió San Fernando." },
    ],
  },
  {
    slug: "1932",
    year: 1932,
    league: "LAF",
    file: "arg32.html",
    section: /Liga Argentina de Football - 1932/,
    wiki: wikiTitle(1932),
    competition: LAF,
    organizer: `${LAF} (profesional)`,
    title: "Campeonato 1932 · Liga Argentina (profesional)",
    tournament: "Campeonato 1932 de la Liga Argentina de Football",
    championIds: ["river"],
    aliases: { Estudiantes: "estudiantes", "Gimnasia (LP)": "gimnasia" },
    playoffFrom: { date: "1932-11-20", stage: "Desempate por el título" },
    overrides: {
      "1932-06-12 huracan racing": {
        status: undefined,
        awardedTo: "racing",
        goalsVoid: true,
        note: "Se suspendió a los 72 minutos con 0-1 y la liga le dio el partido a Racing; la tabla oficial no cuenta los goles.",
      },
    },
    summary:
      "River Plate e Independiente terminaron igualados en 50 puntos y River ganó el desempate 3-0 en la cancha de San Lorenzo: su primer título profesional, el año en que llegó Bernabé Ferreyra.",
    notes: [
      rr2(18, " El empate en el primer puesto se resolvió con un desempate."),
      PRO2,
      { kind: "puntos", text: "Desempate por el título: River Plate 3-0 Independiente (20 de noviembre). No suma en la tabla." },
    ],
  },
  {
    slug: "1932-amateur",
    year: 1932,
    league: "Amateur",
    file: "arg32a.html",
    wiki: "Campeonato de Primera División 1932 de la AFAP (Argentina)",
    competition: "Asociación Argentina de Football",
    organizer: "Asociación Argentina de Football, entidad oficial afiliada a la FIFA (liga amateur)",
    title: "Campeonato 1932 · Liga amateur (oficial)",
    tournament: "Campeonato 1932 de la Asociación Argentina de Football",
    championIds: ["sportivo-barracas"],
    playoffFrom: { date: "1933-01-29", stage: "Desempate por el descenso" },
    awardedGoalsVoid: true,
    wikiErrata: {
      "RSSSF nueva-chicago 3-0 sportivo-buenos-aires": "Wikipedia confunde el partido del campeonato con los desempates por el descenso de 1933 (2-2).",
      "RSSSF sportivo-buenos-aires 5-2 nueva-chicago": "Wikipedia confunde el partido del campeonato con el segundo desempate por el descenso (1-1).",
    },
    knownTableDiffs: {
      keys: ["sportivo-barracas:goalsFor", "estudiantil-porteno:goalsAgainst"],
      explanation:
        "La tabla oficial le da un gol menos a Sportivo Barracas y uno menos en contra a Estudiantil Porteño que la suma de los resultados; probablemente un partido entre ellos figura con un gol de diferencia. Se dejan los resultados de RSSSF.",
    },
    summary:
      "Sportivo Barracas ganó el campeonato de la liga amateur oficial con cinco puntos de ventaja sobre Barracas Central y Colegiales.",
    notes: [
      rr2(17),
      PRO2,
      { kind: "descalificacion", text: "Sportivo Palermo perdió la afiliación: perdió por escritorio sus últimos 8 partidos y descendió." },
      { kind: "puntos", text: "Nueva Chicago y Sportivo Buenos Aires empataron el puesto 15 y jugaron tres desempates por el descenso (2-2, 1-1 y 2-2, en 1933). El cuarto nunca se jugó porque la asociación cambió el reglamento y no descendió ninguno. No suman en la tabla." },
      { kind: "identidad", text: "Argentino de Banfield se fusionó con Argentino de Temperley." },
    ],
  },
  {
    slug: "1933",
    year: 1933,
    league: "LAF",
    file: "arg33.html",
    wiki: wikiTitle(1933),
    competition: LAF,
    organizer: `${LAF} (profesional)`,
    title: "Campeonato 1933 · Liga Argentina (profesional)",
    tournament: "Campeonato 1933 de la Liga Argentina de Football",
    championIds: ["sanlorenzo"],
    aliases: { Estudiantes: "estudiantes", "Gimnasia (LP)": "gimnasia" },
    summary: "San Lorenzo ganó su primer título profesional por un punto sobre Boca Juniors y dos sobre Racing.",
    notes: [
      rr2(18),
      PRO2,
      { kind: "descalificacion", text: "RSSSF marca como descendidos a Quilmes, Argentinos Juniors, Lanús, Talleres (RdE), Atlanta y Tigre; para 1934 la liga profesional se redujo." },
    ],
  },
  {
    slug: "1933-amateur",
    year: 1933,
    league: "Amateur",
    file: "arg33a.html",
    wiki: "Campeonato de Primera División 1933 de la AFAP (Argentina)",
    competition: "Asociación Argentina de Football",
    organizer: "Asociación Argentina de Football, entidad oficial afiliada a la FIFA (liga amateur)",
    title: "Campeonato 1933 · Liga amateur (oficial)",
    tournament: "Campeonato 1933 de la Asociación Argentina de Football",
    championIds: ["sportivo-dock-sud"],
    awardedGoalsVoid: true,
    overrides: {
      "1933-04-23 estudiantil-porteno defensores-belgrano": {
        homeGoals: 2,
        awayGoals: 1,
        note: "RSSSF lo lista 1-2, pero sus propios goleadores (Ruffo y P. Martínez para Estudiantil Porteño; Galarza para Defensores) y la tabla oficial dan 2-1 para Estudiantil Porteño: se corrige.",
      },
    },
    knownTableDiffs: {
      keys: ["all-boys:goalsFor", "all-boys:goalsAgainst", "colegiales:goalsFor", "colegiales:goalsAgainst"],
      explanation:
        "La tabla oficial implica un 3-0 de All Boys sobre Colegiales; RSSSF da 2-1 con tres goleadores que coinciden con ese resultado. Se deja el 2-1.",
    },
    summary: "Sportivo Dock Sud ganó el campeonato de la liga amateur oficial, a una rueda y con 20 equipos, un punto delante de Nueva Chicago.",
    notes: [rr1(20), PRO2],
  },
  {
    slug: "1934",
    year: 1934,
    league: "LAF",
    file: "arg34.html",
    wiki: wikiTitle(1934),
    competition: LAF,
    organizer: `${LAF} (profesional)`,
    title: "Campeonato 1934 · Liga Argentina (profesional)",
    tournament: "Campeonato 1934 de la Liga Argentina de Football",
    championIds: ["boca"],
    // Gimnasia–Estudiantes (10/6): RSSSF lo lista dos veces (suspendido y resuelto). Queda uno: el resuelto, con el
    // 0-1 del momento de la suspensión, que la tabla oficial cuenta aunque los puntos fueron para Gimnasia.
    skip: (m) => m.score === "abd" && m.home.startsWith("Gimnasia") && m.away.startsWith("Estudiantes"),
    overrides: {
      "1934-06-10 gimnasia estudiantes": {
        homeGoals: 0,
        awayGoals: 1,
        walkover: undefined,
        note: "Se suspendió a los 15 minutos con 0-1 para Estudiantes y la liga le dio los puntos a Gimnasia. La tabla oficial cuenta el gol de Estudiantes.",
      },
    },
    // En la tabla, la fusión Atlanta-Argentinos figura como "Argentinos Juniors".
    tableAliases: { 14: "atlanta-argentinos" },
    aliases: {
      Estudiantes: "estudiantes",
      "Gimnasia (LP)": "gimnasia",
      // Desde la fecha 26 la fusión figura como "Argentinos Juniors"; la tabla la cuenta como un solo equipo.
      "Argentinos Juniors": "atlanta-argentinos|Argentinos Juniors",
      // Error de tipeo en RSSSF (fecha 25): esa fecha Boca jugó con Ferro; el rival de Gimnasia fue Platense.
      "PlatenseBoca Juniors": "platense",
    },
    summary:
      "Boca Juniors ganó el campeonato con 14 equipos a tres ruedas, un punto delante de Independiente. Fue el último año de las dos ligas en paralelo: en 1935 la liga profesional y la asociación oficial se unieron en la AFA.",
    notes: [
      { kind: "formato", text: "Todos contra todos a tres ruedas entre 14 equipos, 2 puntos por victoria." },
      PRO2,
      { kind: "identidad", text: "La liga se achicó a 14 equipos: Talleres (RdE) y Lanús jugaron fusionados como Unión Talleres-Lanús, y Atlanta y Argentinos Juniors como Atlanta-Argentinos Juniors. Sus partidos figuran con esos nombres y no se suman al historial de cada club por separado." },
      { kind: "descalificacion", text: "Unión Talleres-Lanús se disolvió al terminar la temporada." },
      { kind: "identidad", text: "Desde la fecha 26 la fusión Atlanta-Argentinos figura como Argentinos Juniors; RSSSF cuenta toda la campaña como un solo equipo y así se muestra." },
    ],
  },
  {
    slug: "1934-amateur",
    year: 1934,
    league: "Amateur",
    file: "arg34a.html",
    wiki: "Campeonato de Primera División 1934 de la AFA (Argentina)",
    competition: "Asociación Argentina de Football",
    organizer: "Asociación Argentina de Football, entidad oficial afiliada a la FIFA (liga amateur)",
    title: "Campeonato 1934 · Liga amateur (oficial)",
    tournament: "Campeonato 1934 de la Asociación Argentina de Football",
    championIds: ["estudiantil-porteno"],
    awardedGoalsVoid: true,
    knownTableDiffs: {
      keys: [
        "nueva-chicago:won",
        "nueva-chicago:drawn",
        "nueva-chicago:goalsFor",
        "nueva-chicago:points",
        "palermo:drawn",
        "palermo:lost",
        "palermo:goalsAgainst",
        "palermo:points",
      ],
      explanation:
        "La tabla oficial le da a Nueva Chicago un triunfo sobre Palermo, pero RSSSF registra un 1-1 con un goleador de cada lado (Pinedo; Roverano). Se deja el 1-1.",
    },
    summary:
      "Estudiantil Porteño ganó su segundo título de la liga amateur oficial, tres puntos delante de Banfield. Fue el último campeonato amateur de Primera: en 1935 las dos ligas se unieron.",
    notes: [rr1(23), PRO2],
  },

  // ───────── 1935–1940: Asociación del Football Argentino (AFA), liga profesional unificada ─────────
  afaPro(1935, {
    championIds: ["boca"],
    summary: "Primer campeonato de la AFA unificada. Boca Juniors fue bicampeón, tres puntos delante de Independiente.",
    notes: [rr2(18), AFA_UNIFICADA, TABLA_DECADA],
  }),
  {
    slug: "1936-honor",
    year: 1936,
    league: "Copa de Honor",
    file: "arg-hon36.html",
    wiki: "Copa de Honor 1936 (Argentina)",
    competition: AFA_PRO,
    organizer: AFA_PRO,
    title: "Copa de Honor 1936",
    tournament: "Copa de Honor Municipalidad de Buenos Aires 1936 (primera mitad del año)",
    championIds: ["sanlorenzo"],
    overrides: {
      // La tabla oficial cuenta los goles del 1-1 aunque los puntos fueron para Independiente.
      "1936-07-05 independiente racing": { goalsVoid: undefined },
    },
    aliases: {
      Estudiantes: "estudiantes",
      "Gimnasia y Esgrima": "gimnasia",
      "Club de Gimnasia y Esgrima": "gimnasia",
      Talleres: "talleres-re",
      "Club Atlético Talleres": "talleres-re",
    },
    summary:
      "La temporada 1936 se dividió en dos torneos a una rueda. San Lorenzo ganó el primero, la Copa de Honor, tres puntos delante de Huracán. Después perdió la Copa de Oro con River, ganador del segundo torneo.",
    notes: [
      rr1(18),
      {
        kind: "identidad",
        text: "En 2013 la AFA reconoció la Copa de Honor 1936 como campeonato de Primera División, igual que la Copa Campeonato y la Copa de Oro de ese año.",
      },
    ],
  },
  afaPro(1936, {
    championIds: ["river"],
    title: "Campeonato 1936 (Copa Campeonato)",
    tournament: "Copa Campeonato 1936 (segunda mitad del año)",
    tableSection: /^Copa Campeonato 1936$/,
    summary:
      "River Plate ganó la Copa Campeonato, el segundo torneo del año, y después la Copa de Oro contra San Lorenzo (4-2), ganador de la Copa de Honor.",
    notes: [
      rr1(18),
      AFA_UNIFICADA,
      TABLA_DECADA,
      { kind: "identidad", text: "La Copa Campeonato era el trofeo tradicional del campeón de liga. La AFA también reconoce como títulos de 1936 la Copa de Honor (San Lorenzo) y la Copa de Oro (River)." },
    ],
  }),
  afaPro(1937, {
    championIds: ["river"],
    summary: "River Plate fue campeón con 58 puntos y 106 goles, seis puntos delante de Independiente.",
    overrides: {
      "1939-02-11 river boca": {
        phase: "playoff",
        stage: "Desempate por el primer puesto de la primera rueda",
        note: "Desempate entre los dos primeros de la primera rueda. RSSSF lo fecha el 11/2/1939; no encontramos otra fuente para la fecha. No suma en la tabla.",
      },
    },
    notes: [
      rr2(18),
      TABLA_DECADA,
      { kind: "puntos", text: "River y Boca terminaron igualados la primera rueda y jugaron un desempate (River 5-3). No suma en la tabla." },
    ],
  }),
  afaPro(1938, {
    championIds: ["independiente"],
    summary: "Independiente ganó su primer título profesional, con Arsenio Erico como goleador del campeonato.",
    notes: [rr2(17), TABLA_DECADA],
  }),
  afaPro(1939, {
    championIds: ["independiente"],
    section: /^Championship Cup/,
    summary: "Independiente fue bicampeón, seis puntos delante de River Plate y Huracán. El descenso de Argentino de Quilmes, con 4 puntos, es la peor campaña de la era profesional.",
    overrides: {
      "1939-12-10 huracan independiente": {
        phase: "playoff",
        stage: "Desempate por el primer puesto de la primera rueda",
        note: "Desempate entre los ganadores de la primera rueda. No suma en la tabla.",
      },
      "1941-11-09 river huracan": {
        phase: "playoff",
        stage: "Desempate por el segundo puesto",
        note: "Primer partido del desempate por el segundo puesto, jugado en 1941; el segundo nunca se jugó. No suma en la tabla.",
      },
    },
    notes: [
      rr2(18),
      TABLA_DECADA,
      { kind: "puntos", text: "Huracán le ganó 2-1 a Independiente el desempate de la primera rueda. River y Huracán terminaron igualados en el segundo puesto: el desempate empezó en 1941 (3-3) y el segundo partido nunca se jugó. Los desempates no suman." },
      { kind: "descalificacion", text: "Descendió Argentino de Quilmes." },
    ],
  }),
  afaPro(1940, {
    championIds: ["boca"],
    summary: "Boca Juniors ganó el campeonato, el año en que inauguró la Bombonera (25 de mayo de 1940).",
    notes: [rr2(18), TABLA_DECADA],
  }),

  // ───────── 1941–1950 ─────────
  afaPro(1941, {
    championIds: ["river"],
    summary: "River Plate campeón: el comienzo de la época de «La Máquina».",
    pointAdjustments: [{ teamId: "banfield", points: -16, reason: "suspensión de 60 días por soborno: 2 puntos menos por cada uno de sus 8 partidos en ese lapso" }],
    notes: [
      rr2(16),
      TABLA_DECADA,
      { kind: "puntos", text: "Banfield fue suspendido 60 días por un caso de soborno en la fecha 10: jugó los partidos de ese período pero se le descontaron 2 puntos en cada uno (16 en total)." },
      { kind: "descalificacion", text: "Descendió Rosario Central." },
    ],
  }),
  afaPro(1942, { championIds: ["river"], summary: "River Plate bicampeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1943, { championIds: ["boca"], summary: "Boca Juniors campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1944, {
    championIds: ["boca"],
    summary: "Boca Juniors bicampeón.",
    wikiErrata: { "RSSSF boca 5-0 ferro": "Wikipedia da 5-1; la tabla final (goles de Boca y de Ferro) cierra con el 5-0 de RSSSF." },
    notes: [rr2(16), TABLA_DECADA],
  }),
  afaPro(1945, { championIds: ["river"], summary: "River Plate campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1946, { championIds: ["sanlorenzo"], summary: "San Lorenzo campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1947, { championIds: ["river"], summary: "River Plate campeón, con Alfredo Di Stéfano como goleador del torneo.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1948, {
    championIds: ["independiente"],
    summary: "Independiente campeón, en un año marcado por la huelga de futbolistas del final de la temporada.",
    pointAdjustments: [
      { teamId: "racing", points: -4, reason: "no se presentó ante Banfield (16/12) ni ante San Lorenzo (22/12): perdió ambos partidos y se le descontaron 2 puntos más en cada uno" },
    ],
    notes: [
      rr2(16),
      TABLA_DECADA,
      { kind: "puntos", text: "Durante la huelga de futbolistas de fin de año Racing no se presentó a dos partidos: los perdió y además se le descontaron 2 puntos por cada uno." },
    ],
  }),
  afaPro(1949, {
    championIds: ["racing"],
    summary: "Racing Club campeón: el primero de sus tres títulos seguidos.",
    overrides: {
      "1949-12-14 platense river": { stage: "Desempate por el segundo puesto", note: "Ida, en la cancha de San Lorenzo (neutral). No suma en la tabla." },
      "1949-12-26 river platense": { stage: "Desempate por el segundo puesto", note: "Vuelta, en la cancha de San Lorenzo (neutral): River Plate subcampeón. No suma en la tabla." },
      "1949-12-18 huracan lanus": { stage: "Desempate por el descenso", note: "Ida. No suma en la tabla." },
      "1949-12-24 lanus huracan": { stage: "Desempate por el descenso", note: "Vuelta. No suma en la tabla." },
      "1950-01-08 huracan lanus": { stage: "Desempate por el descenso", note: "Tercer partido. Terminó 3-3 en los 90 minutos y no se jugó el alargue; la AFA lo anuló el 12/1/1950 y se jugó de nuevo." },
      "1949-02-16 lanus huracan": {
        date: "1950-02-16",
        stage: "Desempate por el descenso",
        note: "Tercer partido, jugado de nuevo tras la anulación del 3-3. Suspendido a los 80 minutos con 2-3; la AFA dio por bueno el resultado el 23/2/1950. Descendió Lanús.",
      },
    },
    notes: [
      rr2(18),
      TABLA_DECADA,
      { kind: "puntos", text: "River Plate y Platense empataron el segundo puesto y Huracán y Lanús el penúltimo: se jugaron desempates, que no suman en la tabla. River fue subcampeón y Lanús descendió." },
    ],
  }),
  afaPro(1950, {
    championIds: ["racing"],
    summary: "Racing Club bicampeón.",
    overrides: {
      "1950-12-03 boca independiente": { stage: "Desempate por el segundo puesto", note: "Ida, en la cancha de River Plate. No suma en la tabla." },
      "1950-12-08 independiente boca": { stage: "Desempate por el segundo puesto", note: "Vuelta, en la cancha de Racing Club. No suma en la tabla." },
      "1950-12-10 boca independiente": {
        stage: "Desempate por el segundo puesto",
        note: "Tercer partido, en la cancha de Racing Club. Boca Juniors quedó segundo por promedio de gol en la tabla acumulada (torneo más desempates). No suma en la tabla.",
      },
      "1950-12-03 tigre huracan": { stage: "Desempate por el descenso", note: "Ida, en la cancha de Independiente. No suma en la tabla." },
      "1950-12-10 huracan tigre": { stage: "Desempate por el descenso", note: "Vuelta, en la cancha de River Plate: descendió Tigre. No suma en la tabla." },
    },
    notes: [
      rr2(18),
      TABLA_DECADA,
      { kind: "puntos", text: "Boca e Independiente empataron el segundo puesto (un triunfo cada uno y un empate en los desempates): Boca fue subcampeón por promedio de gol. Huracán le ganó los dos partidos a Tigre, que descendió junto con Rosario Central." },
    ],
  }),
  // ───────── 1951–1966 ─────────
  afaPro(1951, {
    championIds: ["racing"],
    summary: "Racing Club tricampeón, después de dos partidos de desempate con Banfield.",
    overrides: {
      "1951-12-01 racing banfield": { phase: "playoff", stage: "Desempate por el campeonato", note: "Ida, en la cancha de San Lorenzo. No suma en la tabla." },
      "1951-12-05 banfield racing": { phase: "playoff", stage: "Desempate por el campeonato", note: "Vuelta, en la cancha de San Lorenzo: Racing Club campeón. No suma en la tabla." },
    },
    notes: [
      rr2(17),
      TABLA_DECADA,
      { kind: "puntos", text: "Racing Club y Banfield terminaron igualados en el primer puesto y jugaron dos partidos de desempate (0-0 y 1-0 para Racing). No suman en la tabla." },
    ],
  }),
  afaPro(1952, { championIds: ["river"], summary: "River Plate campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1953, { championIds: ["river"], summary: "River Plate bicampeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1954, { championIds: ["boca"], summary: "Boca Juniors campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1955, {
    championIds: ["river"],
    summary: "River Plate campeón.",
    overrides: {
      // Es el mismo partido: suspendido en el entretiempo y dado por la liga el 7/12 con el resultado de la cancha.
      "1955-11-27 sanlorenzo river": { note: "Suspendido en el entretiempo con 0-1; el 7 de diciembre la liga dio por bueno ese resultado." },
      "1955-12-07 sanlorenzo river": "skip",
    },
    notes: [rr2(16), TABLA_DECADA],
  }),
  afaPro(1956, { championIds: ["river"], summary: "River Plate bicampeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1957, { championIds: ["river"], summary: "River Plate tricampeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1958, {
    championIds: ["racing"],
    summary: "Racing Club campeón.",
    pointAdjustments: [{ teamId: "river", points: -2, reason: "no se presentó ante Huracán: perdió el partido y se le descontaron 2 puntos más" }],
    overrides: {
      "1959-04-23 boca sanlorenzo": { stage: "Desempate por el segundo puesto", note: "Ida, en la cancha de Huracán. No suma en la tabla." },
      "1959-04-26 sanlorenzo boca": { stage: "Desempate por el segundo puesto", note: "Vuelta, en la cancha de Huracán. Ganaron un partido cada uno y Boca quedó segundo por promedio de gol en la tabla del torneo. No suma en la tabla." },
    },
    notes: [
      rr2(16),
      TABLA_DECADA,
      { kind: "puntos", text: "Boca Juniors y San Lorenzo empataron el segundo puesto y jugaron dos partidos en abril de 1959; ganó uno cada uno y Boca fue segundo por promedio de gol." },
    ],
  }),
  afaPro(1959, { championIds: ["sanlorenzo"], summary: "San Lorenzo campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1960, { championIds: ["independiente"], summary: "Independiente campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1961, { championIds: ["racing"], summary: "Racing Club campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1962, { championIds: ["boca"], summary: "Boca Juniors campeón.", notes: [rr2(15), TABLA_DECADA] }),
  afaPro(1963, { championIds: ["independiente"], summary: "Independiente campeón.", notes: [rr2(14), TABLA_DECADA] }),
  afaPro(1964, { championIds: ["boca"], summary: "Boca Juniors campeón.", notes: [rr2(16), TABLA_DECADA] }),
  afaPro(1965, { championIds: ["boca"], summary: "Boca Juniors bicampeón.", notes: [rr2(18), TABLA_DECADA] }),
  afaPro(1966, {
    championIds: ["racing"],
    summary: "Racing Club campeón.",
    // La fila de RSSSF dice "0 6" (sin los dos puntos) y el importador no la lee como partido.
    extraMatches: [
      {
        id: "1966-extra-1",
        date: "1966-10-02",
        stage: "Fecha 30",
        phase: "league",
        homeId: "ferro",
        awayId: "racing",
        homeGoals: 0,
        awayGoals: 6,
        note: "RSSSF lo escribe «0 6», sin los dos puntos; la tabla final (goles de Racing y de Ferro) confirma el 0-6.",
      },
    ],
    notes: [rr2(20), TABLA_DECADA],
  }),
  // ───────── 1967 ─────────
  afaTorneo(1967, "metropolitano", {
    championIds: ["estudiantes"],
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    summary: "Estudiantes de La Plata ganó el primer Metropolitano: 3-0 a Racing en la final. Fue el primer campeón de Primera fuera de los cinco grandes en la era profesional.",
    notes: [
      { kind: "formato", text: "Dos grupos de 11 equipos, todos contra todos a dos ruedas, más dos fechas interzonales. Los dos primeros de cada grupo jugaron semifinales y final a un partido. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los partidos interzonales; las semifinales y la final no suman." },
    ],
  }),
  afaTorneo(1967, "nacional", {
    championIds: ["independiente"],
    summary: "Independiente ganó el primer Nacional, dos puntos delante de Estudiantes.",
    notes: [{ kind: "formato", text: "16 equipos, todos contra todos a una rueda: los 12 mejores del Metropolitano y los 4 ganadores de los torneos regionales del interior. 2 puntos por victoria." }],
  }),
  afaTorneo(1967, "promocional", {
    championIds: [],
    summary: "Torneo entre cuatro equipos del Metropolitano y los cuatro segundos de los torneos regionales.",
    notes: [{ kind: "formato", text: "8 equipos, todos contra todos a dos ruedas, 2 puntos por victoria. Lo jugaron 4 equipos del Metropolitano y los 4 segundos de los torneos regionales." }],
  }),
  afaTorneo(1967, "reclasificacion", {
    championIds: [],
    summary: "Los seis últimos del Metropolitano y los cuatro primeros de la Primera B jugaron por los lugares en Primera: subieron Tigre y Los Andes, y bajaron Unión y Deportivo Español.",
    notes: [{ kind: "formato", text: "10 equipos, todos contra todos a dos ruedas, 2 puntos por victoria: los 6 últimos del Metropolitano y los 4 primeros de la Primera B." }],
  }),
  // ───────── 1968 ─────────
  afaTorneo(1968, "metropolitano", {
    championIds: ["sanlorenzo"],
    overrides: {
      // RSSSF lo lista el día que se jugó ("awd", originalmente 2-0) y el día de la resolución: queda uno solo.
      // La fila "awd [originally 2-0]" del día del partido es el mismo partido.
      "1968-06-16 newells lanus": "skip",
      "1968-07-19 newells lanus": {
        date: "1968-06-16",
        homeGoals: 2,
        awayGoals: 0,
        walkover: undefined,
        note: "Newell's ganó 2-0 en la cancha, pero incluyó a un jugador no habilitado: el 19 de julio la liga le dio los puntos a Lanús. La tabla cuenta los goles del partido.",
      },
    },
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    summary: "San Lorenzo ganó el Metropolitano invicto: el equipo de «Los Matadores».",
    notes: [{ kind: "formato", text: "Dos grupos de 11 equipos, todos contra todos a dos ruedas, más fechas interzonales. Los dos primeros de cada grupo jugaron semifinales y final. 2 puntos por victoria." }, { kind: "puntos", text: "Las tablas de los grupos incluyen los partidos interzonales; las semifinales y la final no suman." }],
  }),
  afaTorneo(1968, "reclasificacion", {
    championIds: [],
    summary: "Los últimos del Metropolitano y los primeros de la Primera B jugaron por los lugares en Primera.",
    notes: [{ kind: "formato", text: "Todos contra todos a dos ruedas entre los últimos del Metropolitano y los primeros de la Primera B, 2 puntos por victoria." }],
  }),
  afaTorneo(1968, "nacional", {
    championIds: ["velez"],
    overrides: {
      "1968-12-19 river racing": { stage: "Triangular de desempate", note: "En la cancha de San Lorenzo. No suma en la tabla." },
      "1968-12-22 river velez": { stage: "Triangular de desempate", note: "En la cancha de San Lorenzo. No suma en la tabla." },
      "1968-12-29 racing velez": { stage: "Triangular de desempate", note: "En la cancha de San Lorenzo: Vélez Sarsfield campeón. No suma en la tabla." },
    },
    summary: "Vélez Sarsfield ganó su primer título de Primera, después de un triangular de desempate con River y Racing.",
    notes: [
      { kind: "formato", text: "16 equipos, todos contra todos a una rueda, 2 puntos por victoria." },
      { kind: "puntos", text: "Vélez, River y Racing terminaron igualados en el primer puesto y jugaron un triangular de desempate, que no suma en la tabla." },
    ],
  }),
  afaTorneo(1968, "promocional", {
    championIds: [],
    summary: "Torneo entre equipos del Metropolitano y los segundos de los torneos regionales.",
    notes: [{ kind: "formato", text: "8 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),

  // ───────── 1969 ─────────
  afaTorneo(1969, "metropolitano", {
    championIds: ["chacarita"],
    overrides: {
      "1969-07-03 boca river": { advancedId: "river", note: "Con alargue, en la cancha de Racing. Pasó River por tener más goles a favor en el campeonato (35 contra 34)." },
    },
    wikiErrata: {
      "RSSSF newells 3-1 platense": "Wikipedia da 3-0 en el partido, pero su propia tabla (goles de Newell's y de Platense) coincide con el 3-1 de RSSSF.",
      "RSSSF union-santa-fe 0-0 colon-santa-fe": "se suspendió 0-0 a los 51 minutos y la liga le dio los puntos a Unión; Wikipedia lo anota como 2-0.",
    },
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    summary: "Chacarita Juniors ganó su único título de Primera: 4-1 a River en la final.",
    notes: [{ kind: "formato", text: "Dos grupos de 11 equipos, todos contra todos a dos ruedas, más fechas interzonales. Los dos primeros de cada grupo jugaron semifinales y final. 2 puntos por victoria." }, { kind: "puntos", text: "Las tablas de los grupos incluyen los partidos interzonales; las semifinales y la final no suman." }],
  }),
  afaTorneo(1969, "petit", {
    championIds: [],
    summary: "Unión ganó el Petit Torneo y el lugar en el Nacional; los otros tres fueron al Reclasificatorio.",
    notes: [{ kind: "formato", text: "Eliminación entre cuatro equipos del Metropolitano por un lugar en el Nacional." }],
  }),
  afaTorneo(1969, "reclasificacion", {
    championIds: [],
    section: /^Reclasificatorio "A"/,
    // La misma sección trae después el Reclasificatorio de Primera (desde el 13 de diciembre): va aparte.
    skip: (m) => /^Dec (1[3-9]|2\d)/.test(m.date),
    summary: "Nueve equipos de Primera jugaron por la permanencia; Deportivo Morón y Banfield, los dos últimos, pasaron al Reclasificatorio de Primera.",
    notes: [{ kind: "formato", text: "9 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
  afaTorneo(1969, "reclasificacion-primera", {
    championIds: [],
    section: /^Reclasificatorio "A"/,
    skip: (m) => !/^Dec (1[3-9]|2\d)/.test(m.date),
    tableIndex: 1,
    summary: "Banfield se quedó en Primera y Deportivo Morón descendió, en el cuadrangular con Ferro y San Telmo, de la Primera B.",
    notes: [{ kind: "formato", text: "Los dos últimos del Reclasificatorio «A» y dos equipos de la Primera B, todos contra todos a una rueda: el primero jugaba el Metropolitano siguiente. 2 puntos por victoria." }],
  }),
  afaTorneo(1969, "nacional", {
    championIds: ["boca"],
    overrides: {
      "1969-12-17 sanlorenzo river": { stage: "Desempate por el segundo puesto", note: "Ida. No suma en la tabla." },
      "1969-12-21 river sanlorenzo": { stage: "Desempate por el segundo puesto", note: "Vuelta: River Plate segundo. No suma en la tabla." },
    },
    pointAdjustments: [{ teamId: "union-santa-fe", points: -2, reason: "descuento de 2 puntos (así en la tabla de RSSSF y en Wikipedia; ninguna da el motivo)" }],
    summary: "Boca Juniors ganó el Nacional, con la vuelta olímpica en la cancha de River.",
    notes: [
      { kind: "formato", text: "18 equipos, todos contra todos a una rueda, 2 puntos por victoria." },
    ],
  }),

  // ───────── 1970 ─────────
  afaTorneo(1970, "metropolitano", {
    championIds: ["independiente"],
    section: /^Campeonato Metropolitano/,
    summary: "Independiente ganó el Metropolitano por diferencia de gol sobre River Plate.",
    notes: [
      { kind: "formato", text: "21 equipos, todos contra todos a una rueda, 2 puntos por victoria. Independiente y River empataron en puntos: el campeón se definió por goles a favor." },
    ],
  }),
  afaTorneo(1970, "petit", {
    championIds: [],
    section: /^Petit Torneo/,
    summary: "Estudiantes y Chacarita ganaron los dos lugares en el Nacional; Quilmes y Huracán fueron al Reclasificatorio.",
    notes: [{ kind: "formato", text: "4 equipos, todos contra todos a una rueda, 2 puntos por victoria." }],
  }),
  afaTorneo(1970, "reclasificacion", {
    championIds: [],
    section: /^Torneo Reclasificatorio \[/,
    summary: "Siete equipos del Metropolitano jugaron por la permanencia.",
    notes: [{ kind: "formato", text: "7 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
  afaTorneo(1970, "reclasificacion-primera", {
    championIds: [],
    section: /^Torneo Reclasificatorio de Primera/,
    summary: "Ferro Carril Oeste ascendió y Quilmes descendió en el cuadrangular final con Colón y Almirante Brown.",
    notes: [{ kind: "formato", text: "4 equipos (dos de Primera y dos de la Primera B), todos contra todos a una rueda, 2 puntos por victoria." }],
  }),
  afaTorneo(1970, "nacional", {
    championIds: ["boca"],
    overrides: {
      "1970-12-20 kimberley-mdp gimnasia-mendoza": { stage: "Mejor equipo del Interior", note: "Ida, en la cancha de General San Martín (Mar del Plata). Definía el lugar del interior en el Nacional 1971. No suma en la tabla." },
      "1970-12-27 gimnasia-mendoza kimberley-mdp": { stage: "Mejor equipo del Interior", note: "Vuelta, en la cancha de Godoy Cruz: Gimnasia y Esgrima de Mendoza jugó el Nacional 1971. No suma en la tabla." },
    },
    pointAdjustments: [{ teamId: "platense", points: -2, reason: "descuento de 2 puntos, anotado por RSSSF en el partido con Banfield (no da el motivo)" }],
    section: /^Campeonato Nacional/,
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    summary: "Boca Juniors bicampeón del Nacional: 2-1 a Rosario Central en la final.",
    notes: [{ kind: "formato", text: "Dos grupos de 10 equipos, todos contra todos a dos ruedas, más fechas interzonales. Los dos primeros de cada grupo jugaron semifinales y final. 2 puntos por victoria." }, { kind: "puntos", text: "Las tablas de los grupos incluyen los partidos interzonales; las semifinales y la final no suman." }],
  }),
  // ───────── 1971 ─────────
  afaTorneo(1971, "metropolitano", {
    championIds: ["independiente"],
    section: /^Campeonato Metropolitano 1971/,
    summary: "Independiente ganó el Metropolitano, un punto delante de Vélez Sarsfield.",
    notes: [{ kind: "formato", text: "19 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
  afaTorneo(1971, "nacional", {
    championIds: ["central"],
    headings: [/^Group A vs. Group B$/, /^Semifinals:$/, /^Final:$/, /^Pre Libertadores Tournament - 1971$/],
    sectionRange: { from: /^Campeonato Nacional 1971/, to: /^Pre Libertadores/ },
    tableIndex: [0, 2],
    groupNames: ["Grupo A", "Grupo B"],
    pointAdjustments: [{ teamId: "huracan-iw", points: -2, reason: "se retiró antes de jugar con Boca (partido dado 1-0 a Boca)" }],
    aliases: { "Guaraní A.Franco (Misiones)": "guarani-antonio-franco", "Central Córdoba (Sgo.Estero)": "central-cordoba-sde" },
    overrides: {
      // La tabla de RSSSF cuenta el 1-0 que la liga le dio a Boca.
      "1971-11-14 boca huracan-iw": {
        homeGoals: 1,
        awayGoals: 0,
        walkover: undefined,
        note: "No se jugó: Huracán de Ingeniero White se retiró y la liga le dio el partido 1-0 a Boca Juniors (así cuenta en la tabla).",
      },
    },
    summary: "Rosario Central ganó su primer título de Primera: 2-1 a San Lorenzo en la final, en la cancha de Newell's.",
    notes: [
      { kind: "formato", text: "Dos grupos de 14 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a una rueda más una fecha interzonal. Los dos primeros de cada grupo jugaron semifinales y final a un partido. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen la fecha interzonal; las semifinales y la final no suman. Huracán de Ingeniero White se retiró antes de jugar con Boca y se le descontaron 2 puntos." },
    ],
  }),
  afaTorneo(1971, "pre-libertadores", {
    championIds: ["independiente"],
    headings: [/^Pre Libertadores Tournament - 1971$/],
    section: /^Pre Libertadores Tournament - 1971$/,
    tableIndex: [],
    // Partido de definición: no hay tabla.
    playoffFrom: { date: "1971-01-01", stage: "Definición" },
    summary: "Independiente, campeón del Metropolitano, le ganó 1-0 a San Lorenzo, finalista del Nacional, el lugar en la Copa Libertadores 1972.",
    notes: [{ kind: "formato", text: "Partido único por el segundo lugar argentino en la Copa Libertadores 1972." }],
  }),
  // ───────── 1972 ─────────
  afaTorneo(1972, "metropolitano", {
    championIds: ["sanlorenzo"],
    section: /^Campeonato Metropolitano/,
    pointAdjustments: [{ teamId: "banfield", points: -21, reason: "suspensión de cuatro meses desde el 16 de marzo: le correspondía perder 36 puntos, pero solo había sumado 21 y se le perdonaron los otros 15" }],
    summary: "San Lorenzo ganó el Metropolitano, el primero de sus dos títulos del año.",
    notes: [
      { kind: "formato", text: "18 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "puntos", text: "Banfield fue suspendido cuatro meses desde el 16 de marzo y perdió todos los puntos que sumó (21)." },
    ],
  }),
  afaTorneo(1972, "nacional", {
    championIds: ["sanlorenzo"],
    headings: [/^Group [AB]:$/, /^Intergroups:$/, /^Torneo Reclasificatorio \[/],
    sectionRange: { from: /^Campeonato Nacional "A/, to: /^Torneo Reclasificatorio/ },
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    summary: "San Lorenzo ganó el Nacional invicto (1-0 a River en la final) y fue el primer campeón de los dos torneos del año.",
    notes: [
      { kind: "formato", text: "Dos grupos de 13 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas más fechas interzonales. Los ganadores de cada grupo jugaron semifinales cruzadas con los segundos y la final. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los partidos interzonales; las semifinales y la final no suman." },
    ],
  }),
  afaTorneo(1972, "reclasificacion", {
    championIds: [],
    headings: [/^Torneo Reclasificatorio \[/],
    section: /^Torneo Reclasificatorio/,
    summary: "Seis equipos del Metropolitano jugaron por la permanencia: descendieron Banfield y Lanús.",
    notes: [{ kind: "formato", text: "6 equipos, todos contra todos a una rueda, 2 puntos por victoria." }],
  }),
  // ───────── 1973 ─────────
  // La página de 1973 no trae tablas: se verifican con las del documento de tablas finales de la década.
  afaTorneo(1973, "metropolitano", {
    championIds: ["huracan"],
    headings: [/^Metropolitano Championship$/, /^Nacional Championship$/],
    section: /^Metropolitano Championship$/,
    tableFile: "arghist-pro1970s.html",
    tableSection: /Campeonato Metropolitano - 1973/,
    summary: "Huracán ganó el Metropolitano con el equipo de César Luis Menotti.",
    wikiErrata: { "RSSSF boca 3-1 estudiantes": "Wikipedia da 2-1 en el partido, pero su propia tabla (69 goles de Boca) coincide con el 3-1 de RSSSF y con la tabla de la década." },
    notes: [
      { kind: "formato", text: "17 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "fuentes", text: "La tabla con la que se verifican los partidos es la del documento de tablas finales de RSSSF de la década (la página de la temporada no la trae)." },
    ],
  }),
  afaTorneo(1973, "nacional", {
    championIds: ["central"],
    headings: [/^Metropolitano Championship$/, /^Nacional Championship$/],
    section: /^Nacional Championship$/,
    groupLines: true,
    tableFile: "arghist-pro1970s.html",
    tableSection: /Campeonato Nacional - 1973/,
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    groupTables: [{ table: 2, stage: "^Ronda final$" }],
    // La tabla de la década nombra "San Lorenzo", "San Martín" y "Gimnasia y Esgrima" sin la ciudad.
    tableAliases: { "0:6": "san-lorenzo-mdp", "0:13": "san-martin-tucuman", "1:14": "gimnasia-jujuy" },
    overrides: {
      // En la página figura contra San Martín, pero está en la lista del Grupo B (San Martín era del A) y las tablas
      // de la década y de Wikipedia (partidos y goles en contra de los dos) solo cierran si fue contra Gimnasia de Jujuy.
      "1973-10-21 atletico-tucuman san-martin-tucuman": {
        awayId: "gimnasia-jujuy",
        note: "RSSSF y Wikipedia lo anotan contra San Martín de Tucumán, pero es un partido del Grupo B y las tablas finales (de RSSSF y de Wikipedia) solo cierran si el rival fue Gimnasia y Esgrima de Jujuy.",
      },
    },
    wikiErrata: { "RSSSF atletico-tucuman 4-3 san-martin-tucuman": "Wikipedia anota el 4-0 del 21 de octubre contra San Martín; fue contra Gimnasia de Jujuy (ver la nota del partido)." },
    // La fila de RSSSF dice "awd" y pone la nota en el renglón de abajo: se carga con esos datos.
    extraMatches: [
      {
        id: "1973-nacional-extra-1",
        date: "1973-11-25",
        stage: "Grupo B · Fecha 12",
        phase: "league",
        homeId: "kimberley-mdp",
        awayId: "atlanta",
        homeGoals: 0,
        awayGoals: 2,
        awardedTo: "atlanta",
        note: "Se suspendió con 1-2 y la liga se lo dio a Atlanta 0-2 (así cuenta en la tabla).",
      },
    ],
    summary: "Rosario Central ganó el Nacional en la ronda final con River, Atlanta y San Lorenzo.",
    notes: [
      { kind: "formato", text: "Dos grupos de 15 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a una rueda más fechas interzonales. Los dos primeros de cada grupo jugaron una ronda final a una rueda. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los partidos interzonales; la ronda final tiene su propia tabla." },
      { kind: "fuentes", text: "Las tablas con las que se verifican los partidos son las del documento de tablas finales de RSSSF de la década." },
    ],
  }),
  // ───────── 1974 ─────────
  afaTorneo(1974, "metropolitano", {
    championIds: ["newells"],
    headings: [/^Group [A-D]$/, /^Intergroups$/, /^Playoff$/, /^Final Tournament$/],
    sectionRange: { from: /^Campeonato Metropolitano/, to: /^Campeonato Nacional/ },
    tableIndex: [0, 1],
    groupNames: ["Grupo A", "Grupo B"],
    groupTables: [
      { table: 2, stage: "^Desempate$" },
      { table: 3, stage: "^Ronda final$" },
    ],
    summary: "Newell's Old Boys ganó su primer título de Primera: empató 2-2 con Rosario Central en la última fecha de la ronda final.",
    notes: [
      { kind: "formato", text: "Dos grupos de 9 equipos, todos contra todos a dos ruedas, más partidos interzonales. Los dos primeros de cada grupo jugaron una ronda final a una rueda. 2 puntos por victoria." },
      { kind: "puntos", text: "Boca y Ferro empataron el segundo puesto del grupo B y jugaron un desempate. Las tablas de los grupos incluyen los interzonales; el desempate y la ronda final tienen su propia tabla." },
    ],
  }),
  afaTorneo(1974, "nacional", {
    championIds: ["sanlorenzo"],
    headings: [/^Group [A-D]$/, /^Intergroups$/, /^Playoff$/, /^Final Tournament$/],
    sectionRange: { from: /^Campeonato Nacional/, to: /^Torneo Reducido/ },
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    groupTables: [{ table: 4, stage: "^Ronda final$" }],
    summary: "San Lorenzo ganó el Nacional en la ronda final, delante de Rosario Central.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 9 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a una rueda más fechas interzonales. Los ganadores de cada grupo jugaron una ronda final a una rueda. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los interzonales; la ronda final tiene su propia tabla." },
    ],
  }),
  afaTorneo(1974, "reducido", {
    championIds: [],
    headings: [/^Group [A-D]$/, /^Intergroups$/, /^Playoff$/, /^Final Tournament$/],
    section: /^Torneo Reducido/,
    summary: "Rosario Central y Newell's ganaron los lugares argentinos en la Copa Libertadores 1975.",
    notes: [{ kind: "formato", text: "3 equipos, todos contra todos a una rueda, por dos lugares en la Copa Libertadores 1975. 2 puntos por victoria." }],
  }),
  // ───────── 1975 ─────────
  afaTorneo(1975, "metropolitano", {
    championIds: ["river"],
    section: /^Metropolitan Championship$/,
    summary: "River Plate ganó el Metropolitano y cortó una racha de 18 años sin títulos.",
    notes: [{ kind: "formato", text: "20 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
  afaTorneo(1975, "nacional", {
    championIds: ["river"],
    headings: [/^Group [A-D]:?$/, /^Intergroups:?$/, /^Final Tournament:?$/],
    sectionRange: { from: /^Nacional Championship$/, to: /^Pre Libertadores$/ },
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    groupTables: [{ table: 4, stage: "^Ronda final$" }],
    pointAdjustments: [{ teamId: "banfield", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" }],
    summary: "River Plate ganó también el Nacional, en la ronda final, y fue bicampeón del año.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 8 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas más fechas interzonales. Los dos primeros de cada grupo jugaron una ronda final a una rueda. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los interzonales; la ronda final tiene su propia tabla." },
    ],
  }),
  afaTorneo(1975, "pre-libertadores", {
    championIds: ["estudiantes"],
    section: /^Pre Libertadores$/,
    tableIndex: [],
    playoffFrom: { date: "1975-01-01", stage: "Definición" },
    summary: "Estudiantes de La Plata le ganó 3-2 a Huracán el segundo lugar argentino en la Copa Libertadores 1976.",
    notes: [{ kind: "formato", text: "Partido único entre el segundo del Metropolitano (Huracán) y el del Nacional (Estudiantes). Se jugó en enero de 1976." }],
  }),
  // ───────── 1976 ─────────
  afaTorneo(1976, "metropolitano", {
    championIds: ["boca"],
    sectionRange: { from: /^Campeonato Metropolitano 1976/, to: /^Campeonato Nacional 1976/ },
    tableIndex: [0, 2],
    groupNames: ["Grupo A", "Grupo B"],
    groupTables: [
      { table: 4, stage: "^Grupo campeonato$" },
      { table: 6, stage: "^Grupo descenso$" },
    ],
    summary: "Boca Juniors ganó el Metropolitano en el grupo por el campeonato, delante de Huracán.",
    wikiErrata: { "RSSSF quilmes 3-1 river": "Wikipedia da 4-1 en el partido, pero su propia tabla (goles de Quilmes y de River) coincide con el 3-1 de RSSSF y con la tabla de la década." },
    notes: [
      { kind: "formato", text: "Primera fase: dos grupos de 11 equipos, todos contra todos a dos ruedas, más fechas interzonales. Segunda fase: los seis primeros de cada grupo jugaron un grupo por el campeonato y los otros diez, un grupo por el descenso, todos contra todos a una rueda. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los interzonales. El grupo campeonato y el grupo descenso tienen su propia tabla." },
    ],
  }),
  afaTorneo(1976, "nacional", {
    championIds: ["boca"],
    sectionRange: { from: /^Campeonato Nacional 1976/, to: /^Pre Libertadores/ },
    tableIndex: [0, 2, 4, 6],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    summary: "Boca Juniors ganó también el Nacional: 1-0 a River en la final, con el gol de Suñé. Fue bicampeón del año.",
    notes: [
      { kind: "formato", text: "Cuatro grupos (dos de 8 y dos de 9 equipos, con clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas más fechas interzonales. Los dos primeros de cada grupo jugaron cuartos de final, semifinales y final. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los interzonales; los desempates y la eliminación final no suman." },
    ],
  }),
  afaTorneo(1976, "pre-libertadores", {
    championIds: [],
    section: /^Pre Libertadores Tournament$/,
    tableIndex: [],
    playoffFrom: { date: "1976-01-01", stage: "Definición" },
    summary: "Partido por el segundo lugar argentino en la Copa Libertadores 1977.",
    notes: [{ kind: "formato", text: "Partido único por el segundo lugar argentino en la Copa Libertadores 1977." }],
  }),
  // ───────── 1977 ─────────
  afaTorneo(1977, "metropolitano", {
    championIds: ["river"],
    section: /^Campeonato Metropolitano 1977/,
    summary: "River Plate ganó el Metropolitano de 23 equipos, un punto delante de Independiente.",
    overrides: { "1977-11-16 platense lanus": { stage: "Desempate por el descenso", note: "Desempate entre los dos que quedaron igualados en el puesto de descenso. Platense ganó por penales (8-7) y descendió Lanús. No suma en la tabla." } },
    notes: [{ kind: "formato", text: "23 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
  afaTorneo(1977, "nacional", {
    championIds: ["independiente"],
    aliases: { "Círculo Deportivo(Mar del Plata)": "circulo-deportivo" },
    sectionRange: { from: /^Campeonato Nacional 1977/, to: /^1977 - PRIMERA B/ },
    tableIndex: [0, 2, 4, 6],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    summary: "Independiente ganó el Nacional ante Talleres en Córdoba, con tres jugadores menos y el gol de Bochini en la vuelta.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 8 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas. Los ganadores de cada grupo jugaron semifinales y final de ida y vuelta. 2 puntos por victoria." },
    ],
  }),
  // ───────── 1978 ─────────
  afaTorneo(1978, "metropolitano", {
    championIds: ["quilmes"],
    section: /^Campeonato Metropolitano 1978/,
    summary: "Quilmes ganó el Metropolitano, su primer título en la era profesional.",
    knownTableDiffs: {
      keys: ["huracan:points"],
      explanation: "Las tablas de RSSSF (la de la temporada y la de la década) le dan a Huracán 36 puntos con 11 ganados y 13 empatados, que suman 35. Wikipedia da los mismos partidos ganados y empatados. No encontramos el motivo del punto de más.",
    },
    notes: [{ kind: "formato", text: "21 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
  afaTorneo(1978, "nacional", {
    championIds: ["independiente"],
    aliases: { "Patronato (Entre Ríos)": "patronato-parana" },
    wikiErrata: { "RSSSF san-martin-mendoza 1-0 san-martin-tucuman": "Wikipedia da el 0-0 de la cancha; la liga le dio los puntos a San Martín de Mendoza y el partido 1-0 (así en la tabla)." },
    sectionRange: { from: /^Campeonato Nacional 1978/, to: /^1978 - PRIMERA B|^About/ },
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    summary: "Independiente ganó el Nacional por segundo año seguido: 0-0 y 2-0 a River en la final.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 8 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas. Los dos primeros de cada grupo jugaron cuartos de final, semifinales y final de ida y vuelta. 2 puntos por victoria." },
    ],
  }),
  // ───────── 1979 ─────────
  afaTorneo(1979, "metropolitano", {
    championIds: ["river"],
    headings: [/^Group [A-D]$/, /^Quarter ?finals$/, /^Semifinals$/, /^Final$/, /^Torneo por el Descenso de Primera Categoría$/],
    sectionRange: { from: /^Campeonato Metropolitano/, to: /^Campeonato Nacional/, exclude: /^Torneo por el Descenso/ },
    tableIndex: [0, 2],
    groupNames: ["Grupo A", "Grupo B"],
    groupTables: [{ table: 1, stage: "^Desempate$" }],
    aliases: { "Argentinos Junors": "argentinos" },
    summary: "River Plate ganó el Metropolitano: 2-0 y 5-1 a Vélez en la final.",
    notes: [
      { kind: "formato", text: "Dos grupos de 10 equipos, todos contra todos a dos ruedas. Los dos primeros de cada grupo jugaron semifinales y final de ida y vuelta. 2 puntos por victoria." },
      { kind: "puntos", text: "Argentinos Juniors y Vélez empataron el segundo puesto del grupo A y jugaron un desempate. Las tablas de los grupos no incluyen el desempate ni la eliminación final." },
    ],
  }),
afaTorneo(1979, "reclasificacion", {
    championIds: [],
    headings: [/^Group [A-D]$/, /^Quarter ?finals$/, /^Semifinals$/, /^Final$/, /^Torneo por el Descenso de Primera Categoría$/],
    section: /^Torneo por el Descenso de Primera Categoría$/,
    summary: "Los cuatro últimos del Metropolitano jugaron por la permanencia: se salvó Platense y descendieron Gimnasia y Esgrima La Plata, Chacarita Juniors y Atlanta.",
    notes: [{ kind: "formato", text: "4 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
    afaTorneo(1979, "nacional", {
    championIds: ["river"],
    headings: [/^Group [A-D]$/, /^Intergroups$/, /^Quarter ?finals$/, /^Semifinals$/, /^Final$/, /^Torneo por el Descenso de Primera Categoría$/],
    sectionRange: { from: /^Campeonato Nacional/, to: /^Torneo Clasificación/ },
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    summary: "River Plate ganó también el Nacional: 0-0 y 2-1 a Unión en la final. Fue bicampeón del año.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 7 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas. Los dos primeros de cada grupo jugaron cuartos de final, semifinales y final de ida y vuelta. 2 puntos por victoria." },
    ],
  }),
  afaTorneo(1979, "pre-libertadores", {
    championIds: [],
    section: /^Torneo Clasificación para el Campeonato Libertadores/,
    tableIndex: [],
    playoffFrom: { date: "1979-01-01", stage: "Definición" },
    summary: "Vélez Sarsfield y Unión jugaron ida y vuelta por el segundo lugar argentino en la Copa Libertadores 1980.",
    notes: [{ kind: "formato", text: "Serie de ida y vuelta por el segundo lugar argentino en la Copa Libertadores 1980." }],
  }),
  // ───────── 1980 ─────────
  // La página no trae tablas: se verifican con las del documento de tablas finales de la década.
  afaTorneo(1980, "metropolitano", {
    championIds: ["river"],
    headings: [/^Campeonato Metropolitano:$/, /^Campeonato Nacional:$/, /^Group [A-D]$/, /^Intergroups$/, /^Quarterfinal$/, /^Semifinal$/, /^Final$/],
    section: /^Campeonato Metropolitano:$/,
    tableFile: "arghist-pro1970s.html",
    tableSection: /Campeonato IV Centenario de la Segunda Fundación de Buenos Aires - 1980/,
    tournament: "Campeonato Metropolitano 1980 «IV Centenario de la Segunda Fundación de Buenos Aires»",
    summary: "River Plate ganó el Metropolitano, delante de Argentinos Juniors con Maradona.",
    notes: [
      { kind: "formato", text: "19 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "fuentes", text: "La tabla con la que se verifican los partidos es la del documento de tablas finales de RSSSF de la década (la página de la temporada no la trae)." },
    ],
  }),
  afaTorneo(1980, "nacional", {
    championIds: ["central"],
    headings: [/^Campeonato Metropolitano:$/, /^Campeonato Nacional:$/, /^Group [A-D]$/, /^Intergroups$/, /^Quarterfinal$/, /^Semifinal$/, /^Final$/],
    sectionRange: { from: /^Campeonato Nacional:$/ },
    tableFile: "arghist-pro1970s.html",
    tableSection: /Campeonato Nacional General Don José de San Martín - 1980/,
    aliases: { "San Lorenzo": "san-lorenzo-mdp", "ATLÉTICO RACING": "racing-cordoba", "Gimnasia y Esgrima": "gimnasia-jujuy", "Atlético Club San Martín": "san-martin-mendoza", Talleres: "talleres" },
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    tournament: "Campeonato Nacional 1980 «Libertador General Don José de San Martín»",
    summary: "Rosario Central ganó el Nacional: 5-1 y 0-2 con Racing de Córdoba en la final.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 7 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas. Los dos primeros de cada grupo jugaron cuartos de final, semifinales y final de ida y vuelta. 2 puntos por victoria." },
      { kind: "fuentes", text: "Las tablas con las que se verifican los partidos son las del documento de tablas finales de RSSSF de la década." },
    ],
  }),
  // ───────── 1981 ─────────
  // La página no trae tablas: se verifican con las del documento de tablas finales de la década.
  afaTorneo(1981, "metropolitano", {
    championIds: ["boca"],
    headings: [/^Campeonato Metropolitano 1981$/, /^Campeonato Nacional "General/, /^Group [A-D]$/, /^Quarter Final$/, /^Semifinal$/, /^Final$/],
    section: /^Campeonato Metropolitano 1981$/,
    tableFile: "arghist-pro1980s.html",
    tableSection: /^Primera División 1981$/,
    summary: "Boca Juniors ganó el Metropolitano con Maradona, un punto delante de Ferro Carril Oeste.",
    notes: [
      { kind: "formato", text: "18 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "fuentes", text: "La tabla con la que se verifican los partidos es la del documento de tablas finales de RSSSF de la década (la página de la temporada no la trae)." },
    ],
  }),
  afaTorneo(1981, "nacional", {
    championIds: ["river"],
    headings: [/^Campeonato Metropolitano 1981$/, /^Campeonato Nacional "General/, /^Group [A-D]$/, /^Quarter Final$/, /^Semifinal$/, /^Final$/],
    sectionRange: { from: /^Campeonato Nacional "General/ },
    tableFile: "arghist-pro1980s.html",
    tableSection: /^Campeonato Nacional 1981$/,
    pointAdjustments: [
      {
        teamId: "racing-cordoba",
        points: -4,
        reason: "el 19 de noviembre Racing de Córdoba fue suspendido 50 días: jugó los dos partidos que le quedaban y se le descontaron 2 puntos por cada uno",
      },
    ],
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    tournament: "Campeonato Nacional 1981 «General Don José de San Martín»",
    summary: "River Plate ganó el Nacional: 1-0 y 1-0 a Ferro Carril Oeste en la final.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 7 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas. Los dos primeros de cada grupo jugaron cuartos de final, semifinales y final de ida y vuelta. 2 puntos por victoria." },
      { kind: "fuentes", text: "Las tablas con las que se verifican los partidos son las del documento de tablas finales de RSSSF de la década." },
    ],
  }),
  // ───────── 1982 ─────────
  afaTorneo(1982, "nacional", {
    championIds: ["ferro"],
    headings: [/^Group [A-D]$/, /^Group A vs. Group C/, /^QUARTERFINALS$/, /^SEMIFINALS$/, /^FINAL$/],
    sectionRange: { from: /^Campeonato Nacional 1982/, to: /^Campeonato Metropolitano 1982/ },
    // En la página una fila de la tabla sale pegada ("Guaraní Antonio Franco (Misiones)16"): se usan las tablas de la década.
    tableFile: "arghist-pro1980s.html",
    tableSection: /^Campeonato Nacional 1982$/,
    knownTableDiffs: {
      keys: ["gimnasia-jujuy:won", "gimnasia-jujuy:drawn", "gimnasia-jujuy:goalsFor", "gimnasia-jujuy:points", "central-norte-salta:drawn", "central-norte-salta:lost", "central-norte-salta:goalsAgainst", "central-norte-salta:points"],
      explanation: "La tabla del documento de la década implica que Gimnasia de Jujuy le ganó 3-2 a Central Norte el 25 de abril; la página de la temporada (el resultado y su propia tabla) y Wikipedia dan 2-2. Se usa el 2-2.",
    },
    tableIndex: [0, 1, 2, 3],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    summary: "Ferro Carril Oeste ganó su primer título de Primera: 0-0 y 2-0 a Quilmes en la final, invicto en todo el torneo.",
    notes: [
      { kind: "formato", text: "Cuatro grupos de 8 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas más dos fechas interzonales. Los dos primeros de cada grupo jugaron cuartos de final, semifinales y final de ida y vuelta. 2 puntos por victoria." },
      { kind: "puntos", text: "Las tablas de los grupos incluyen los interzonales; la eliminación final no suma." },
    ],
  }),
  afaTorneo(1982, "metropolitano", {
    championIds: ["estudiantes"],
    headings: [/^Group [A-D]$/, /^Group A vs. Group C/, /^QUARTERFINALS$/, /^SEMIFINALS$/, /^FINAL$/],
    section: /^Campeonato Metropolitano 1982/,
    tournament: "Campeonato Metropolitano 1982 «Soberanía Nacional»",
    rolloverBefore: 6,
    overrides: { "1983-02-20 union-santa-fe quilmes": { stage: "Desempate por el descenso", note: "En la cancha de Sarmiento de Junín. Descendió Quilmes. No suma en la tabla." } },
    summary: "Estudiantes de La Plata ganó el Metropolitano, dos puntos delante de Independiente.",
    notes: [
      { kind: "formato", text: "19 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "puntos", text: "Unión y Quilmes empataron el puesto de descenso y jugaron un desempate (1-0 para Unión, en febrero de 1983): descendió Quilmes, junto con Sarmiento de Junín." },
    ],
  }),
  // ───────── 1983 ─────────
  // La página no trae tablas: se verifican con las del documento de tablas finales de la década.
  afaTorneo(1983, "nacional", {
    championIds: ["estudiantes"],
    headings: [/^First Stage\.$/, /^Second Stage\.$/, /^Group [A-H]\.$/, /^"Group A vs\. B/, /^1\/8 Final\.$/, /^Quarter Final\.$/, /^Semifinal\.$/, /^Final\.$/, /^Campeonato Metropolitano 1983\.$/],
    sectionRange: { from: /^Argentina 1983 - Campeonato Nacional$/, to: /^Campeonato Metropolitano 1983\.$/ },
    tableFile: "arghist-pro1980s.html",
    tableSection: /^Campeonato Nacional 1983/,
    tableIndex: [0, 1, 2, 3, 4, 5, 6, 7],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H"],
    groupTables: [
      { table: 8, stage: "^Segunda fase · (Grupo A|Interzonal) · " },
      { table: 9, stage: "^Segunda fase · (Grupo B|Interzonal) · " },
      { table: 10, stage: "^Segunda fase · (Grupo C|Interzonal) · " },
      { table: 11, stage: "^Segunda fase · (Grupo D|Interzonal) · " },
      { table: 12, stage: "^Segunda fase · (Grupo E|Interzonal) · " },
      { table: 13, stage: "^Segunda fase · (Grupo F|Interzonal) · " },
      { table: 14, stage: "^Segunda fase · (Grupo G|Interzonal) · " },
      { table: 15, stage: "^Segunda fase · (Grupo H|Interzonal) · " },
    ],
    aliases: { Kimberley: "kimberley-mdp", "Racing (C)": "racing-cordoba" },
    summary: "Estudiantes de La Plata ganó el Nacional: 2-0 y 1-2 con Independiente en la final.",
    notes: [
      { kind: "formato", text: "Primera fase: ocho grupos de 4 equipos, todos contra todos a dos ruedas. Segunda fase: los tres primeros de cada grupo, en ocho grupos de 3 más dos fechas interzonales. Después, octavos, cuartos, semifinales y final de ida y vuelta. 2 puntos por victoria." },
      { kind: "puntos", text: "La tabla del torneo es la de la primera fase; la segunda fase tiene sus propias tablas (con los interzonales)." },
      { kind: "fuentes", text: "Las tablas con las que se verifican los partidos son las del documento de tablas finales de RSSSF de la década." },
    ],
  }),
  afaTorneo(1983, "metropolitano", {
    championIds: ["independiente"],
    headings: [/^First Stage\.$/, /^Second Stage\.$/, /^Group [A-H]\.$/, /^"Group A vs\. B/, /^1\/8 Final\.$/, /^Quarter Final\.$/, /^Semifinal\.$/, /^Final\.$/, /^Campeonato Metropolitano 1983\.$/],
    section: /^Campeonato Metropolitano 1983\.$/,
    tableFile: "arghist-pro1980s.html",
    tableSection: /^Primera División 1983$/,
    rolloverBefore: 6,
    aliases: { "Racing (C)": "racing-cordoba" },
    summary: "Independiente ganó el Metropolitano en la última fecha, 2-0 a Racing en el clásico.",
    notes: [
      { kind: "formato", text: "19 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "fuentes", text: "La tabla con la que se verifican los partidos es la del documento de tablas finales de RSSSF de la década." },
    ],
  }),
  // ───────── 1984 ─────────
  afaTorneo(1984, "nacional", {
    championIds: ["ferro"],
    headings: [/^Group [A-H]$/, /^1\/8 FINALS$/, /^QUARTERFINALS$/, /^SEMIFINALS$/, /^FINAL$/],
    sectionRange: { from: /^Campeonato Nacional 1984/, to: /^Campeonato Metropolitano 1984/ },
    tableIndex: [0, 1, 2, 3, 4, 5, 6, 7],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H"],
    pointAdjustments: [{ teamId: "chacarita", points: -6, reason: "descuento de 6 puntos (RSSSF no da el motivo)" }],
    overrides: {
      // En la página la línea dice "2nd. leg:2" y el importador no la toma como la vuelta.
      "1984-05-09 river sanlorenzo": { stage: "Semifinal (vuelta)" },
    },
    summary: "Ferro Carril Oeste ganó su segundo Nacional: 3-0 y 1-0 a River en la final.",
    notes: [
      { kind: "formato", text: "Ocho grupos de 4 equipos (clubes del Metropolitano y de los torneos regionales), todos contra todos a dos ruedas. Los dos primeros de cada grupo jugaron octavos, cuartos, semifinales y final de ida y vuelta. 2 puntos por victoria." },
    ],
  }),
  afaTorneo(1984, "metropolitano", {
    championIds: ["argentinos"],
    headings: [/^Group [A-H]$/, /^1\/8 FINALS$/, /^QUARTERFINALS$/, /^SEMIFINALS$/, /^FINAL$/],
    section: /^Campeonato Metropolitano 1984/,
    rolloverBefore: 6,
    // La tabla de la página da un gol menos a Central (27) y a Chacarita en contra (36); la de la década coincide con los partidos.
    tableFile: "arghist-pro1980s.html",
    tableSection: /^Primera División 1984/,
    summary: "Argentinos Juniors ganó su primer título de Primera, un punto delante de Ferro.",
    notes: [{ kind: "formato", text: "19 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." }],
  }),
  // ───────── 1985 ─────────
  // Nacional 1985: grupos y doble eliminación. La página no trae tablas: se verifican con las de la década.
  afaTorneo(1985, "nacional", {
    championIds: ["argentinos"],
    sectionRange: { from: /^Argentina 1985 - Campeonato Nacional$/ },
    tableFile: "arghist-pro1980s.html",
    tableSection: /^Campeonato Nacional 1985/,
    tableIndex: [0, 1, 2, 3, 4, 5, 6, 7],
    groupNames: ["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H"],
    aliases: { Argentino: "argentino-firmat", "Racing (C)": "racing-cordoba" },
    knownTableDiffs: {
      keys: ["talleres:drawn", "talleres:lost", "talleres:goalsFor", "talleres:points", "guarani-antonio-franco:won", "guarani-antonio-franco:drawn", "guarani-antonio-franco:goalsAgainst", "guarani-antonio-franco:points"],
      explanation: "RSSSF y Wikipedia dan 2-2 en Guaraní Antonio Franco–Talleres (10 de marzo), pero las tablas finales de las dos fuentes solo cierran si Guaraní ganó 2-0. No hay otra fuente para decidir: queda el 2-2 de los partidos.",
    },
    summary: "Argentinos Juniors ganó el Nacional: perdió la primera final con Vélez por penales y le ganó 2-1 la final definitiva.",
    notes: [
      { kind: "formato", text: "Ocho grupos de 4 equipos, todos contra todos a dos ruedas. Después, doble eliminación: los primeros de cada grupo en la llave de ganadores, los demás en la de perdedores. El ganador de cada llave jugó la final; como Argentinos venía de la llave de ganadores, al perder la primera tuvo una segunda final. 2 puntos por victoria." },
      { kind: "puntos", text: "La tabla del torneo es la de los grupos; la doble eliminación no suma." },
      { kind: "fuentes", text: "Las tablas con las que se verifican los partidos son las del documento de tablas finales de RSSSF de la década." },
    ],
  }),
  // ───────── 1985/86 ─────────
  afaLarga(1985, {
    championIds: ["river"],
    headings: [/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /1\/8 FINALS:?$/i],
    section: /^Primera División 1985\/1986/,
    summary: "River Plate ganó el primer campeonato largo, de agosto a abril, diez puntos delante de Newell's.",
    notes: [
      { kind: "formato", text: "19 equipos, todos contra todos a dos ruedas, 2 puntos por victoria. Desde esta temporada el campeonato se juega de agosto a junio, como en Europa." },
      { kind: "descalificacion", text: "El descenso se definió por promedio de las últimas temporadas: descendió Chacarita, y Huracán jugó el Octogonal con equipos de la B y también descendió." },
    ],
  }),
  afaLargaExtra(1985, "octogonal", "Octogonal", {
    championIds: [],
    headings: [/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /1\/8 FINALS:?$/i],
    sectionRange: { from: /^Octogonal tournament/, to: /^Liguilla Pre-Libertadores/ },
    overrides: { "1986-06-24 deportivo-italiano huracan": { stage: "Final (desempate)", note: "Tercer partido de la final, en la cancha de Vélez. Deportivo Italiano ganó por penales (4-2), ascendió a Primera y Huracán descendió." } },
    summary: "Huracán y siete equipos de la B jugaron por un lugar en Primera: ganó Deportivo Italiano, en un tercer partido de la final, y Huracán descendió.",
    notes: [{ kind: "formato", text: "Huracán (el de peor promedio que no descendía directo) y los siete primeros del Apertura de la B, en eliminación de ida y vuelta. El ganador jugaba en Primera." }],
  }),
  afaLargaExtra(1985, "liguilla", "Liguilla Pre-Libertadores", {
    championIds: [],
    headings: [/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /1\/8 FINALS:?$/i],
    sectionRange: { from: /^Liguilla Pre-Libertadores/ },
    summary: "Boca Juniors ganó la Liguilla (0-2 y 4-1 con Newell's en la final) y el segundo lugar argentino en la Copa Libertadores 1987.",
    notes: [{ kind: "formato", text: "Eliminación de ida y vuelta entre equipos de Primera (del 2.º al 12.º) y del Torneo del Interior." }],
  }),
  // ───────── 1986/87 ─────────
  afaLarga(1986, {
    championIds: ["central"],
    headings: [/^Liguilla Pre-Libertadores tournament/],
    section: /^Argentina 1986\/87$/,
    overrides: {
      "1987-05-06 platense temperley": { phase: "playoff", stage: "Desempate por el descenso", note: "Platense y Temperley empataron el promedio: jugaron un desempate en la cancha de Huracán y descendió Temperley, junto con Deportivo Italiano. No suma en la tabla." },
    },
    summary: "Rosario Central ganó el campeonato un punto delante de Newell's, con el empate 1-1 en la última fecha.",
    knownTableDiffs: {
      keys: ["ferro:drawn", "ferro:lost", "ferro:goalsFor", "ferro:points", "estudiantes:won", "estudiantes:drawn", "estudiantes:goalsAgainst", "estudiantes:points"],
      explanation: "RSSSF da Estudiantes 1-0 Ferro (9 de noviembre) y Ferro 1-0 Estudiantes, pero su tabla y la de Wikipedia solo cierran si uno de los dos fue 1-1. No encontramos otra fuente del partido: quedan los resultados de la lista.",
    },
    notes: [
      { kind: "formato", text: "20 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "descalificacion", text: "El descenso se definió por promedio de las últimas tres temporadas: descendieron Deportivo Italiano y Temperley (después de un desempate con Platense)." },
    ],
  }),
  afaLargaExtra(1986, "liguilla", "Liguilla Pre-Libertadores", {
    championIds: [],
    headings: [/^Liguilla Pre-Libertadores tournament/, ...[/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /1\/8 FINALS:?$/i]],
    sectionRange: { from: /^Liguilla Pre-Libertadores tournament/ },
    aliases: { "Newell's Old Boys 0": "newells" },
    summary: "Independiente ganó la Liguilla (2-2 y 2-1 con Boca en la final) y el segundo lugar argentino en la Copa Libertadores 1988.",
    notes: [{ kind: "formato", text: "Eliminación de ida y vuelta entre equipos de Primera y de la B por el segundo lugar argentino en la Copa Libertadores." }],
  }),
  // ───────── 1987/88 ─────────
  afaLarga(1987, {
    championIds: ["newells"],
    headings: [/^Liguilla Pre-Libertadores tournament/, /^Liguilla Clasificación tournament/],
    section: /^Argentina 1987\/88$/,
    pointAdjustments: [{ teamId: "instituto", points: -2, reason: "por los incidentes que impidieron jugar con San Lorenzo (además perdió ese partido)" }],
    extraMatches: [
      {
        id: "1987-88-extra-1",
        date: "1988-05-08",
        stage: "Fecha 36",
        phase: "league",
        homeId: "instituto",
        awayId: "sanlorenzo",
        homeGoals: 0,
        awayGoals: 1,
        walkover: true,
        awardedTo: "sanlorenzo",
        note: "No se jugó: se suspendió antes de empezar por incidentes. La liga le dio el partido 0-1 a San Lorenzo y le descontó 2 puntos a Instituto.",
      },
    ],
    overrides: {
      "1988-06-08 union-santa-fe racing-cordoba": {
        phase: "playoff",
        stage: "Desempate por el descenso",
        advancedId: "racing-cordoba",
        note: "En la cancha de Boca. Con alargue; Racing de Córdoba ganó por penales (5-4) y descendió Unión, junto con Banfield. No suma en la tabla.",
      },
    },
    summary: "Newell's Old Boys ganó el campeonato con un equipo de jugadores formados en el club.",
    wikiErrata: {
      "RSSSF velez 2-0 gimnasia": "la fila de Wikipedia es un partido de la Liguilla que Wikipedia lista en la misma página (está cargado en la Liguilla con ese resultado).",
      "RSSSF gimnasia 2-1 velez": "la fila de Wikipedia es un partido de la Liguilla que Wikipedia lista en la misma página (está cargado en la Liguilla con ese resultado).",
      "RSSSF independiente 0-0 estudiantes": "la fila de Wikipedia es un partido de la Liguilla que Wikipedia lista en la misma página (está cargado en la Liguilla con ese resultado).",
      "RSSSF racing-cordoba 1-0 platense": "la fila de Wikipedia es un partido de la Liguilla que Wikipedia lista en la misma página (está cargado en la Liguilla con ese resultado).",
      "RSSSF platense 1-0 racing-cordoba": "la fila de Wikipedia es un partido de la Liguilla que Wikipedia lista en la misma página (está cargado en la Liguilla con ese resultado).",
      "RSSSF deportivo-espanol 5-1 talleres": "la fila de Wikipedia es un partido de la Liguilla que Wikipedia lista en la misma página (está cargado en la Liguilla con ese resultado).",
    },
    notes: [
      { kind: "formato", text: "20 equipos, todos contra todos a dos ruedas, 2 puntos por victoria." },
      { kind: "descalificacion", text: "El descenso se definió por promedio de las últimas tres temporadas: descendió Banfield, y Unión después de un desempate con Racing de Córdoba." },
    ],
  }),
  afaLargaExtra(1987, "liguilla", "Liguilla Pre-Libertadores", {
    championIds: [],
    headings: [/^Liguilla Pre-Libertadores tournament/, /^Liguilla Clasificación tournament/, ...[/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /1\/8 FINALS:?$/i]],
    sectionRange: { from: /^Liguilla Pre-Libertadores tournament/, to: /^Liguilla Clasificación tournament/ },
    summary: "San Lorenzo ganó la Liguilla (2-0 y 0-1 con Racing en la final) y el segundo lugar argentino en la Copa Libertadores 1988.",
    notes: [{ kind: "formato", text: "Eliminación de ida y vuelta entre los equipos del 2.º al 8.º puesto y el campeón de la B Nacional. Los empates en el global se definían por diferencia de gol y después por la posición en la tabla." }],
  }),
  afaLargaExtra(1987, "clasificacion", "Liguilla Clasificación", {
    championIds: [],
    headings: [/^Liguilla Pre-Libertadores tournament/, /^Liguilla Clasificación tournament/, ...[/^Quarter-?finals:?$/i, /^Semi-?finals:?$/i, /^Final:?$/i, /1\/8 FINALS:?$/i]],
    sectionRange: { from: /^Liguilla Clasificación tournament/ },
    summary: "Platense le ganó el desempate a Boca en la final y el lugar en la Liguilla Pre-Libertadores siguiente.",
    notes: [{ kind: "formato", text: "Eliminación de ida y vuelta entre los equipos que no jugaron la Liguilla Pre-Libertadores, por un lugar en la siguiente. Los empates en el global se definían por diferencia de gol y después por la posición en la tabla." }],
  }),
  // ───────── 1988/89 ─────────
  afaLarga(1988, {
    championIds: ["independiente"],
    aliases: { "Gimnasia y Esgrima": "gimnasia" },
    sectionRange: { from: /^Primera División 1988\/1989/, to: /^Liguilla Pre[- ]Libertadores tournament/ },
    tableIndex: [0],
    pointsPerWin: 3,
    drawShootout: { winner: 2, loser: 1 },
    overrides: {
      "1988-11-20 central instituto": {
        advancedId: "central",
        note: "RSSSF no anota la tanda de penales de este empate. La tabla de posiciones y la de penales de la misma fuente se la dan a Rosario Central (2 puntos contra 1 de Instituto).",
      },
      "1989-05-16 velez deportivo-mandiyu": {
        advancedId: "deportivo-mandiyu",
        note: "RSSSF anota la tanda 3-2 para Vélez, pero su propia tabla de penales (Vélez 12 ganadas y 5 perdidas, Mandiyú 11 y 8) y la tabla de posiciones de RSSSF y de Wikipedia solo cierran si la ganó Mandiyú.",
      },
    },
    knownTableDiffs: {
      keys: ["newells:goalsAgainst", "central:goalsAgainst"],
      explanation:
        "El clásico rosarino de la fecha 13 se suspendió 0-0 y la liga se lo dio por perdido 0-1 a los dos. La tabla oficial le cuenta ese gol en contra a cada uno; acá el partido figura 0-0, porque no hay un marcador que pueda darle un gol en contra a ambos.",
    },
    wikiErrata: {
      "RSSSF sanlorenzo 1-2 river": "la fila de Wikipedia es la ida de la final por el cupo (27/9/1989, San Lorenzo 0-1 River), que está cargada en la Liguilla Clasificación.",
    },
    pointAdjustments: [
      { teamId: "racing", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
      { teamId: "newells", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
      { teamId: "central", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
      { teamId: "san-martin-tucuman", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
    ],
    summary: "Independiente ganó el campeonato ocho puntos delante de Boca, en la única temporada con penales en cada empate.",
    notes: [
      { kind: "formato", text: "20 equipos, todos contra todos a dos ruedas. 3 puntos por victoria; los empates se definían por penales: 2 puntos para el que ganaba la tanda y 1 para el que perdía." },
      { kind: "identidad", text: "La primera rueda se jugó como «Apertura», pero sus puntos siguieron sumando en la tabla del campeonato, que es la que da el título." },
    ],
  }),
  afaLargaExtra(1988, "liguilla", "Liguilla Pre-Libertadores", {
    championIds: [],
    overrides: {
      "1989-06-14 platense boca": { advancedId: "boca", note: "La serie terminó igualada (1-1 y 1-1): pasó Boca por haber terminado más arriba en el campeonato (2.º contra 15.º)." },
    },
    headings: [/^Liguilla Pre[- ]Libertadores tournament/, /^Classification Tournament/, /^QUARTERFINALS:?$/, /^SEMIFINALS:?$/, /^FINAL:?$/, /^Playoff:?$/, /^\d(st|nd|rd|th)\.? ROUND:?$/, /^FINAL LIGUILLA/],
    sectionRange: { from: /^Liguilla Pre[- ]Libertadores tournament/, to: /^Classification Tournament/ },
    rolloverBefore: 13,
    summary: "San Lorenzo ganó la Liguilla, pero River, que venía de la llave de perdedores, le ganó la final por el cupo y fue a la Copa Libertadores 1990.",
    notes: [
      { kind: "formato", text: "Doble eliminación, todo a ida y vuelta: los seis que siguieron al campeón, Platense (ganador de la Clasificación 1987/88) y Chaco For Ever (campeón del Nacional B 1988/89) jugaron la llave de ganadores; los que perdían pasaban a la Liguilla Clasificación. Los empates en la serie se definían por diferencia de gol y después por la posición en la tabla." },
      { kind: "identidad", text: "La final por el cupo entre San Lorenzo (ganador de esta llave) y River (ganador de la Clasificación) está cargada en la Liguilla Clasificación." },
    ],
  }),
  afaLargaExtra(1988, "clasificacion", "Liguilla Clasificación", {
    championIds: [],
    headings: [/^Liguilla Pre[- ]Libertadores tournament/, /^Classification Tournament/, /^QUARTERFINALS:?$/, /^SEMIFINALS:?$/, /^FINAL:?$/, /^Playoff:?$/, /^\d(st|nd|rd|th)\.? ROUND:?$/, /^FINAL LIGUILLA/],
    sectionRange: { from: /^Classification Tournament/ },
    rolloverBefore: 13,
    summary: "River, eliminado en los cuartos de la Pre-Libertadores, ganó la llave de perdedores (le ganó a Boca en un desempate) y después la final por el cupo ante San Lorenzo.",
    notes: [
      { kind: "formato", text: "Llave de perdedores: los equipos del 8.º puesto para abajo que no descendieron (salvo Platense, que jugó la Pre-Libertadores), más los que iban perdiendo en la Liguilla Pre-Libertadores. Ida y vuelta; el empate en la serie se definía por diferencia de gol y después por la posición en la tabla." },
      { kind: "puntos", text: "Final por el cupo en la Copa Libertadores 1990: San Lorenzo 0-1 River (27/9) y River 0-0 San Lorenzo (31/10)." },
    ],
  }),
  // ───────── 1989/90 ─────────
  afaLarga(1989, {
    championIds: ["river"],
    aliases: { "Gimnasia y Esgrima": "gimnasia" },
    sectionRange: { from: /^Primera División 1989\/1990/, to: /^Liguilla Pre[- ]Libertadores tournament/ },
    headings: [/^Relegation Playoff:$/],
    overrides: {
      "1990-05-25 chaco-for-ever racing-cordoba": { stage: "Desempate por el descenso", note: "Desempate entre los dos que quedaron igualados en el anteúltimo promedio. Descendió Racing de Córdoba. No suma en la tabla. Goles: Ortolá, Scatolaro(2), Salaberry." },
    },
    tableIndex: [0],
    pointAdjustments: [
      { teamId: "talleres", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
      { teamId: "central", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
      { teamId: "newells", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
    ],
    knownTableDiffs: {
      keys: ["central:goalsFor", "central:goalsAgainst", "newells:goalsFor", "boca:goalsAgainst"],
      explanation:
        "El clásico rosarino de la última fecha se suspendió con 1-0 para Central y la liga se lo dio por perdido 0-1 a los dos: la tabla oficial (RSSSF y Wikipedia) le cuenta a Central ese 0-1, y acá figura el 1-0 de la cancha. Aparte, la tabla de RSSSF le da a Newell's un gol a favor menos y a Boca uno en contra menos que los resultados; la de Wikipedia coincide con los resultados (Newell's 1-2 Boca, suspendido a los 89 minutos), así que se deja el partido como está.",
    },
    summary: "River fue campeón con siete puntos de ventaja sobre Independiente, que había ganado el Apertura.",
    notes: [
      { kind: "formato", text: "20 equipos, todos contra todos a dos ruedas, 2 puntos por victoria. La primera rueda se jugó como «Apertura» (la ganó Independiente) y sus puntos siguieron sumando en la tabla del campeonato." },
      { kind: "formato", text: "Descendían los dos peores promedios. Chaco For Ever y Racing de Córdoba empataron el anteúltimo lugar y jugaron un desempate (Chaco For Ever 5-0); descendieron Instituto y Racing de Córdoba." },
    ],
  }),
  afaLargaExtra(1989, "liguilla", "Liguilla Pre-Libertadores", {
    championIds: [],
    headings: [/^Liguilla Pre[- ]Libertadores tournament/, /^SEMIFINALS:?$/, /^FINAL:?$/],
    sectionRange: { from: /^Liguilla Pre[- ]Libertadores tournament/ },
    rolloverBefore: 13,
    summary: "Boca ganó la Liguilla y el segundo lugar argentino en la Copa Libertadores 1991.",
    notes: [{ kind: "formato", text: "Eliminación de ida y vuelta entre Independiente, Boca y Rosario Central (2.º a 4.º del campeonato) y Deportivo Español (3.º del Apertura)." }],
  }),
  // ───────── 1990/91: Apertura y Clausura; el campeón sale de la final entre los dos ganadores ─────────
  afaLargaExtra(1990, "apertura", "Apertura", {
    championIds: [],
    aliases: { "Rácing Club": "racing", "San LorenzoO": "sanlorenzo" },
    wiki: "Campeonato de Primera División 1990-91 (Argentina)",
    headings: [/^Torneo Apertura 1990$/, /^Torneo Clausura 1991$/, /^Championship Playoff$/, /^Liguilla Pre Libertadores tournament/, /^QUARTERFINALS:?$/, /^SEMIFINALS:?$/, /^FINAL:?$/],
    sectionRange: { from: /^Torneo Apertura 1990$/, to: /^Torneo Clausura 1991$/ },
    tableIndex: [0],
    tournament: "Torneo Apertura 1990",
    knownTableDiffs: {
      keys: ["sanlorenzo:goalsFor", "sanlorenzo:goalsAgainst", "talleres:lost", "union-santa-fe:drawn", "union-santa-fe:points", "independiente:local"],
      explanation:
        "Boca 0-1 San Lorenzo se suspendió en el entretiempo y la liga se lo dio por perdido 0-1 a los dos: la tabla oficial (RSSSF y Wikipedia) le cuenta a San Lorenzo un 0-1, y acá figura el 0-1 de la cancha. Además, la tabla de RSSSF tiene dos filas que no suman 19 partidos (Talleres 7-4-9 y Unión 4-5-9 con 13 puntos); la de Wikipedia coincide con los resultados (Talleres 7-4-8; Unión 4-6-9 y 14 puntos, con el 4-4 entre ellos en la fecha 18). Y la campaña de visitante de Independiente (4-2-5) suma un partido de más: según los resultados fue 4-1-5.",
    },
    summary: "Newell's ganó el Apertura dos puntos delante de River y se ganó el lugar en la final por el campeonato 1990/91.",
    notes: [
      { kind: "formato", text: "Primer torneo corto: 20 equipos a una rueda, 2 puntos por victoria. El ganador jugaba la final del campeonato 1990/91 con el ganador del Clausura." },
      { kind: "puntos", text: "Boca 0-1 San Lorenzo (fecha 18) se suspendió en el entretiempo por incidentes que terminaron con un muerto; la liga se lo dio por perdido 0-1 a los dos." },
    ],
  }),
  afaLargaExtra(1990, "clausura", "Clausura", {
    championIds: [],
    aliases: { "Rácing Club": "racing", "San LorenzoO": "sanlorenzo" },
    wiki: "Campeonato de Primera División 1990-91 (Argentina)",
    headings: [/^Torneo Apertura 1990$/, /^Torneo Clausura 1991$/, /^Championship Playoff$/, /^Liguilla Pre Libertadores tournament/, /^QUARTERFINALS:?$/, /^SEMIFINALS:?$/, /^FINAL:?$/],
    sectionRange: { from: /^Torneo Clausura 1991$/, to: /^Championship Playoff$/ },
    tableIndex: [0],
    rolloverBefore: 13,
    tournament: "Torneo Clausura 1991",
    overrides: {
      "1991-06-12 lanus platense": {
        homeGoals: 0,
        awayGoals: 1,
        awardedTo: "platense",
        note: "Suspendido a los 46 minutos con 0-0 y no se completó. RSSSF no anota la resolución, pero su tabla y la de Wikipedia cuentan el partido como victoria 1-0 de Platense: la liga se lo dio por escritorio.",
      },
    },
    summary: "Boca ganó el Clausura invicto (13 ganados y 6 empatados), pero perdió la final del campeonato con Newell's.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria. El ganador jugaba la final del campeonato 1990/91 con el ganador del Apertura." }],
  }),
  afaLargaExtra(1990, "final", "Final", {
    championIds: ["newells"],
    headings: [/^Torneo Apertura 1990$/, /^Torneo Clausura 1991$/, /^Championship Playoff$/, /^Liguilla Pre Libertadores tournament/, /^QUARTERFINALS:?$/, /^SEMIFINALS:?$/, /^FINAL:?$/],
    sectionRange: { from: /^Championship Playoff$/, to: /^Liguilla Pre Libertadores tournament/ },
    rolloverBefore: 13,
    tournament: "Final del campeonato 1990/91",
    overrides: {
      "1991-07-06 newells boca": { stage: "Final (ida)", venue: "Rosario Central", note: "Goles: Berizzo." },
      "1991-07-09 boca newells": { stage: "Final (vuelta)" },
    },
    summary: "Newell's, ganador del Apertura, fue campeón 1990/91: le ganó 1-0 a Boca en Rosario, perdió 1-0 la vuelta en la Bombonera y ganó por penales (3-1).",
    notes: [{ kind: "formato", text: "Final a ida y vuelta entre los ganadores del Apertura (Newell's) y del Clausura (Boca). El campeón de la temporada fue el ganador de esta final." }],
  }),
  afaLargaExtra(1990, "liguilla", "Liguilla Pre-Libertadores", {
    championIds: [],
    aliases: { "San LorenzoO": "sanlorenzo" },
    headings: [/^Torneo Apertura 1990$/, /^Torneo Clausura 1991$/, /^Championship Playoff$/, /^Liguilla Pre Libertadores tournament/, /^QUARTERFINALS:?$/, /^SEMIFINALS:?$/, /^FINAL:?$/],
    sectionRange: { from: /^Liguilla Pre Libertadores tournament/, to: /NACIONAL B$/ },
    rolloverBefore: 13,
    summary: "San Lorenzo ganó la Liguilla (1-0 y 1-0 a Boca en la final) y el segundo lugar argentino en la Copa Libertadores 1992.",
    notes: [{ kind: "formato", text: "Eliminación de ida y vuelta entre los que siguieron a los ganadores en el Apertura y en el Clausura. Los empates en la serie se definían por penales." }],
  }),
  // ───────── 1991/92: desde acá el Apertura y el Clausura son títulos por separado ─────────
  afaLargaExtra(1991, "apertura", "Apertura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Apertura 1991 (Argentina)",
    headings: [/^Apertura 1991$/, /^Clausura 1992$/, /^Liguilla Pre Libertadores tournament/, /^Champions:$/, /^Octogonal tournament:$/, /^Quarterfinals:?$/, /^Semifinals:?$/, /^Final:?$/, /^Final between loser champion/],
    sectionRange: { from: /^Apertura 1991$/, to: /^Clausura 1992$/ },
    tableIndex: [0],
    summary: "River ganó el Apertura con siete puntos de ventaja sobre Boca: 14 victorias en 19 partidos.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria. Desde esta temporada el Apertura y el Clausura dan cada uno un título de campeón." }],
  }),
  afaLargaExtra(1991, "clausura", "Clausura", {
    championIds: ["newells"],
    wiki: "Anexo:Torneo Clausura 1992 (Argentina)",
    headings: [/^Apertura 1991$/, /^Clausura 1992$/, /^Liguilla Pre Libertadores tournament/, /^Champions:$/, /^Octogonal tournament:$/, /^Quarterfinals:?$/, /^Semifinals:?$/, /^Final:?$/, /^Final between loser champion/],
    sectionRange: { from: /^Clausura 1992$/, to: /^Liguilla Pre Libertadores tournament/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointAdjustments: [{ teamId: "quilmes", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" }],
    summary: "Newell's ganó el Clausura dos puntos delante de Vélez y Deportivo Español.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria. Descendían los dos peores promedios de las últimas tres temporadas: Quilmes y Unión." }],
  }),
  afaLargaExtra(1991, "liguilla", "Liguilla Pre-Libertadores", {
    championIds: [],
    headings: [/^Apertura 1991$/, /^Clausura 1992$/, /^Liguilla Pre Libertadores tournament/, /^Champions:$/, /^Octogonal tournament:$/, /^Quarterfinals:?$/, /^Semifinals:?$/, /^Final:?$/, /^Final between loser champion/],
    sectionRange: { from: /^Liguilla Pre Libertadores tournament/, exclude: /^(Octogonal tournament|Quarterfinals|Semifinals|Final:?$)/ },
    rolloverBefore: 13,
    overrides: {
      "1992-07-12 newells river": { stage: "Serie de campeones (ida)" },
      "1992-07-19 river newells": { stage: "Serie de campeones (vuelta)" },
      "1992-07-26 river newells": { stage: "Serie de campeones (desempate)" },
    },
    summary: "River le ganó la serie de campeones a Newell's y Newell's, después, le ganó a Vélez (ganador del Octogonal) el otro lugar en la Copa Libertadores 1993.",
    notes: [
      { kind: "formato", text: "Los campeones del Apertura (River) y del Clausura (Newell's) jugaron una serie a ida y vuelta, con un tercer partido en Córdoba. El perdedor jugó un partido con el ganador del Octogonal por el segundo lugar en la Copa Libertadores 1993." },
    ],
  }),
  afaLargaExtra(1991, "octogonal", "Octogonal", {
    championIds: [],
    headings: [/^Apertura 1991$/, /^Clausura 1992$/, /^Liguilla Pre Libertadores tournament/, /^Champions:$/, /^Octogonal tournament:$/, /^Quarterfinals:?$/, /^Semifinals:?$/, /^Final:?$/, /^Final between loser champion/],
    sectionRange: { from: /^Octogonal tournament:$/, to: /^Final between loser champion/ },
    rolloverBefore: 13,
    summary: "Vélez ganó el Octogonal (3-0 a Gimnasia en la final) y jugó con Newell's por un lugar en la Copa Libertadores 1993.",
    notes: [{ kind: "formato", text: "Eliminación a partido único en cancha neutral entre ocho equipos de las dos tablas, por lugares en la Copa Conmebol 1992 y por el partido con Newell's por la Copa Libertadores." }],
  }),
  // ───────── 1992/93 ─────────
  afaLargaExtra(1992, "apertura", "Apertura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Apertura 1992 (Argentina)",
    aliases: { "San Martín": "san-martin-tucuman", "Gimnasia y Esgrima": "gimnasia", Talleres: "talleres" },
    headings: [/^Apertura 1992$/, /^Clausura 1993$/],
    sectionRange: { from: /^Apertura 1992$/, to: /^Clausura 1993$/ },
    tableIndex: [0],
    pointAdjustments: [
      { teamId: "river", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
      { teamId: "san-martin-tucuman", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" },
    ],
    knownTableDiffs: {
      keys: ["newells:local"],
      explanation: "En la tabla de RSSSF la campaña de local de Newell's (2-5-3) no cierra con su total (3-4-12): están invertidos los empates y las derrotas. Según los resultados fue 2-3-5.",
    },
    summary: "Boca ganó el Apertura cuatro puntos delante de River y San Lorenzo: su primer título de liga desde 1981.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria." }],
  }),
  afaLargaExtra(1992, "clausura", "Clausura", {
    championIds: ["velez"],
    wiki: "Anexo:Torneo Clausura 1993 (Argentina)",
    headings: [/^Apertura 1992$/, /^Clausura 1993$/],
    sectionRange: { from: /^Clausura 1993$/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointAdjustments: [{ teamId: "central", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" }],
    wikiErrata: {
      "RSSSF talleres 0-2 river": "Wikipedia da el 2-2 de la cancha; la liga le dio el partido 0-2 a River (así lo cuentan las dos tablas).",
      "RSSSF newells 1-0 talleres": "Wikipedia da el 0-1 de la cancha; la liga le quitó los puntos a Talleres y lo dio 1-0 (así lo cuentan las dos tablas).",
      "RSSSF talleres 0-1 gimnasia": "Wikipedia da el 1-0 de la cancha; la liga le quitó los puntos a Talleres y lo dio 0-1 (así lo cuentan las dos tablas).",
    },
    summary: "Vélez ganó el Clausura tres puntos delante de Independiente: su primer título desde 1968.",
    notes: [
      { kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria. Descendían los dos peores promedios de las últimas tres temporadas: Talleres y San Martín de Tucumán." },
      { kind: "puntos", text: "La liga cambió cuatro resultados: Vélez 1-1 Boca pasó a 1-0 para Vélez; Talleres 2-2 River (suspendido a los 72 minutos), a 0-2; Newell's 0-1 Talleres, a 1-0; y Talleres 1-0 Gimnasia, a 0-1." },
    ],
  }),
  // ───────── 1993/94 ─────────
  afaLargaExtra(1993, "apertura", "Apertura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Apertura 1993 (Argentina)",
    headings: [/^Apertura 1993$/, /^Clausura 1994$/],
    sectionRange: { from: /^Apertura 1993$/, to: /^Clausura 1994$/ },
    tableIndex: [0],
    aliases: { "Gimnasia y Tiro (S)": "gimnasia-tiro-salta" },
    overrides: {
      "1994-03-18 boca gimnasia": {
        homeId: "gimnasia",
        awayId: "boca",
        note: "RSSSF pone a Boca de local, pero su propia tabla (columnas de local y visitante) y Wikipedia lo dan con Gimnasia de local.",
      },
    },
    summary: "River ganó el Apertura un punto delante de Vélez y Racing.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria." }, { kind: "dato", text: "Argentinos Juniors jugó de local en Mendoza durante toda la temporada." }],
  }),
  afaLargaExtra(1993, "clausura", "Clausura", {
    championIds: ["independiente"],
    wiki: "Anexo:Torneo Clausura 1994 (Argentina)",
    headings: [/^Apertura 1993$/, /^Clausura 1994$/],
    sectionRange: { from: /^Clausura 1994$/ },
    tableIndex: [0],
    rolloverBefore: 13,
    aliases: { "Gimnasia y Tiro (S)": "gimnasia-tiro-salta", "Deportivo Maniyú": "deportivo-mandiyu" },
    summary: "Independiente ganó el Clausura con una sola derrota, un punto delante de Huracán.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria. Descendían los dos peores promedios de las últimas tres temporadas: Estudiantes y Gimnasia y Tiro de Salta." }],
  }),
  // ───────── 1994/95 ─────────
  afaLargaExtra(1994, "apertura", "Apertura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Apertura 1994 (Argentina)",
    headings: [/^Apertura 1994$/, /^Clausura 1995$/],
    sectionRange: { from: /^Apertura 1994$/, to: /^Clausura 1995$/ },
    tableIndex: [0],
    pointAdjustments: [{ teamId: "talleres", points: -2, reason: "descuento de 2 puntos (RSSSF no da el motivo)" }],
    summary: "River ganó el Apertura invicto (12 ganados y 7 empatados), cinco puntos delante de San Lorenzo.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria." }],
  }),
  afaLargaExtra(1994, "clausura", "Clausura", {
    championIds: ["sanlorenzo"],
    wiki: "Anexo:Torneo Clausura 1995 (Argentina)",
    headings: [/^Apertura 1994$/, /^Clausura 1995$/],
    sectionRange: { from: /^Clausura 1995$/ },
    tableIndex: [0],
    rolloverBefore: 13,
    summary: "San Lorenzo ganó el Clausura un punto delante de Gimnasia: su primer título desde el Nacional 1974.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 2 puntos por victoria (el último torneo con ese sistema). Descendían los dos peores promedios de las últimas tres temporadas: Deportivo Mandiyú y Talleres." }],
  }),
  // ───────── 1995/96: desde acá, 3 puntos por victoria ─────────
  afaLargaExtra(1995, "apertura", "Apertura", {
    championIds: ["velez"],
    wiki: "Anexo:Torneo Apertura 1995 (Argentina)",
    headings: [/^APERTURA TOURNAMENT$/, /^CLAUSURA TOURNAMENT$/, /^Cumulative table/],
    sectionRange: { from: /^APERTURA TOURNAMENT$/, to: /^CLAUSURA TOURNAMENT$/ },
    tableIndex: [0],
    pointsPerWin: 3,
    summary: "Vélez ganó el Apertura seis puntos delante de Racing, Lanús y Boca, en el primer torneo con 3 puntos por victoria.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria (el primer torneo con ese sistema)." }],
  }),
  afaLargaExtra(1995, "clausura", "Clausura", {
    championIds: ["velez"],
    wiki: "Anexo:Torneo Clausura 1996 (Argentina)",
    headings: [/^APERTURA TOURNAMENT$/, /^CLAUSURA TOURNAMENT$/, /^Cumulative table/],
    sectionRange: { from: /^CLAUSURA TOURNAMENT$/, to: /^Cumulative table/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointsPerWin: 3,
    summary: "Vélez ganó también el Clausura, un punto delante de Gimnasia y Esgrima La Plata.",
    notes: [
      { kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. Descendían los dos peores promedios de las últimas tres temporadas: Belgrano y Argentinos Juniors. Para los promedios, las victorias de esta temporada se contaron con 2 puntos, como en las anteriores." },
    ],
  }),
  // ───────── 1996/97 ─────────
  afaLargaExtra(1996, "apertura", "Apertura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Apertura 1996 (Argentina)",
    aliases: { "Newell's OB": "newells", "Rosario C": "central", "Huracán Ctes": "huracan-corrientes", "Gimnasia J": "gimnasia-jujuy", "Dep Español": "deportivo-espanol", "Gimnasia LP": "gimnasia", "Huracán BA": "huracan" },
    headings: [/^Torneo Apertura 1996$/, /^Torneo Clausura 1997$/, /^Copa Libertadores 1998 Playoff/],
    sectionRange: { from: /^Torneo Apertura 1996$/, to: /^Torneo Clausura 1997$/ },
    tableIndex: [0],
    pointsPerWin: 3,
    summary: "River ganó el Apertura nueve puntos delante de Independiente y Lanús: 15 victorias en 19 partidos.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  afaLargaExtra(1996, "clausura", "Clausura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Clausura 1997 (Argentina)",
    aliases: { "Newell's OB": "newells", "Rosario C": "central", "Huracán Ctes": "huracan-corrientes", "Gimnasia J": "gimnasia-jujuy", "Dep Español": "deportivo-espanol", "Gimnasia LP": "gimnasia", "Huracán BA": "huracan" },
    headings: [/^Torneo Apertura 1996$/, /^Torneo Clausura 1997$/, /^Copa Libertadores 1998 Playoff/],
    sectionRange: { from: /^Torneo Clausura 1997$/, to: /^Copa Libertadores 1998 Playoff/ },
    tableIndex: [1],
    rolloverBefore: 13,
    pointsPerWin: 3,
    summary: "River ganó también el Clausura, seis puntos delante de Colón y Newell's.",
    notes: [
      { kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. Descendían los dos peores promedios de las últimas tres temporadas: Banfield y Huracán de Corrientes." },
      { kind: "dato", text: "RSSSF publica dos tablas finales: la del principio tiene mal los goles de River, Vélez y Ferro; la del final coincide con los resultados y con Wikipedia, y es la que se usa acá." },
    ],
  }),
  afaLargaExtra(1996, "libertadores", "Desempate Libertadores", {
    championIds: [],
    headings: [/^Torneo Apertura 1996$/, /^Torneo Clausura 1997$/, /^Copa Libertadores 1998 Playoff/],
    sectionRange: { from: /^Copa Libertadores 1998 Playoff/ },
    rolloverBefore: 13,
    overrides: { "1997-12-03 colon-santa-fe independiente": { phase: "playoff", stage: "Desempate por la Copa Libertadores" } },
    summary: "Colón le ganó 1-0 a Independiente en cancha de Lanús y fue a la Copa Libertadores 1998 con River.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral por el segundo lugar argentino en la Copa Libertadores 1998." }],
  }),
  // ───────── 1997/98 ─────────
  afaLargaExtra(1997, "apertura", "Apertura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Apertura 1997 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Apertura$/, /^Clausura$/, /^Argentina 1997\/98 Nacional B/],
    sectionRange: { from: /^Apertura$/, to: /^Clausura$/ },
    tableIndex: [0],
    pointsPerWin: 3,
    summary: "River ganó el Apertura un punto delante de Boca, que perdió un solo partido: el tercer título seguido de River.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  afaLargaExtra(1997, "clausura", "Clausura", {
    championIds: ["velez"],
    wiki: "Anexo:Torneo Clausura 1998 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Apertura$/, /^Clausura$/, /^Argentina 1997\/98 Nacional B/],
    sectionRange: { from: /^Clausura$/, to: /^Argentina 1997\/98 Nacional B/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointsPerWin: 3,
    knownTableDiffs: {
      keys: ["independiente:points"],
      explanation:
        "RSSSF le da 23 puntos a Independiente, sin decir por qué; sus resultados (7 ganados, 5 empatados, 7 perdidos) suman 26, que es lo que figura en Wikipedia. No se encontró un descuento de puntos que lo explique, así que acá quedan los 26.",
    },
    summary: "Vélez ganó el Clausura seis puntos delante de Lanús, con una sola derrota.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. Descendían los dos peores promedios de las últimas tres temporadas: Deportivo Español y Gimnasia y Tiro de Salta." }],
  }),
  // ───────── 1998/99 ─────────
  afaLargaExtra(1998, "apertura", "Apertura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Apertura 1998 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Apertura\s*$/, /^Clausura\s*$/, /^Libertadores Cup Qualifying/],
    sectionRange: { from: /^Apertura\s*$/, to: /^Clausura\s*$/ },
    tableIndex: [0],
    pointsPerWin: 3,
    overrides: {
      "1998-09-20 boca newells": {
        homeGoals: 2,
        awayGoals: 1,
        note: "RSSSF pone 2-0 en el partido, pero su propia tabla (goles en contra de Boca y a favor de Newell's) y Wikipedia dan 2-1.",
      },
      "1998-08-26 independiente racing": {
        note: "Se había suspendido el 23/8 a los 38 minutos, con 0-2, por un corte de luz; el 26/8 se jugaron los 52 minutos que faltaban.",
      },
    },
    summary: "Boca ganó el Apertura invicto (13 ganados y 6 empatados), nueve puntos delante de Gimnasia y Esgrima La Plata.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  afaLargaExtra(1998, "clausura", "Clausura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Clausura 1999 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Apertura\s*$/, /^Clausura\s*$/, /^Libertadores Cup Qualifying/],
    sectionRange: { from: /^Clausura\s*$/, to: /^Libertadores Cup Qualifying/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointsPerWin: 3,
    pointAdjustments: [{ teamId: "colon-santa-fe", points: -3, reason: "descuento de 3 puntos por los incidentes del partido con Unión, en la fecha 7 (Wikipedia)" }],
    extraMatches: [
      {
        id: "1998-99-clausura-extra-1",
        date: "1999-04-11",
        stage: "Fecha 7",
        phase: "league",
        homeId: "colon-santa-fe",
        awayId: "union-santa-fe",
        homeGoals: 0,
        awayGoals: 0,
        splitAward: { home: [0, 1], away: [0, 0] },
        note: "Se suspendió a los 62 minutos, 0-0, por incidentes. La liga se lo dio perdido 0-1 a Colón y empatado 0-0 a Unión: así lo cuentan las tablas de RSSSF y de Wikipedia.",
      },
    ],
    summary: "Boca ganó también el Clausura, siete puntos delante de River, con una sola derrota.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. Descendían los dos peores promedios de las últimas tres temporadas: Platense y Huracán." }],
  }),
  afaLargaExtra(1998, "libertadores", "Desempate Libertadores", {
    championIds: [],
    aliases: ABREV_1997,
    headings: [/^Apertura\s*$/, /^Clausura\s*$/, /^Libertadores Cup Qualifying/],
    sectionRange: { from: /^Libertadores Cup Qualifying/ },
    rolloverBefore: 13,
    overrides: { "1999-06-24 gimnasia river": { phase: "playoff", stage: "Desempate por la Copa Libertadores" } },
    summary: "River le ganó 3-2 a Gimnasia y Esgrima La Plata en cancha de Vélez y fue a la Copa Libertadores 2000.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral por un lugar argentino en la Copa Libertadores 2000." }],
  }),
  // ───────── 1999/2000 ─────────
  afaLargaExtra(1999, "apertura", "Apertura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Apertura 1999 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Apertura$/, /^Clausura\s*$/, /^Third and Fourth Promotion/],
    sectionRange: { from: /^Apertura$/, to: /^Clausura\s*$/ },
    tableIndex: [0],
    pointsPerWin: 3,
    pointAdjustments: [
      { teamId: "sanlorenzo", points: -3, reason: "descuento de 3 puntos por incidentes en la fecha 19" },
      { teamId: "velez", points: -3, reason: "descuento de 3 puntos por incidentes en la fecha 15" },
      { teamId: "instituto", points: -3, reason: "descuento de 3 puntos por incidentes en la fecha 11" },
      { teamId: "belgrano", points: -3, reason: "descuento de 3 puntos por incidentes en la fecha 19" },
    ],
    overrides: {
      "1999-12-18 belgrano independiente": {
        status: "official",
        note: "Goles: Montenegro (2, uno de penal) - Graf, Pena, Forlán. Se suspendió a los 81 minutos por incidentes, con 2-3, y la liga dio por bueno ese resultado.",
      },
      "1999-12-08 instituto central": {
        note: "Se había suspendido a los 35 segundos, 0-0, porque un objeto le pegó a un juez de línea; el 8/12 se jugó el resto.",
      },
      "2000-02-24 chacarita velez": {
        note: "Se había suspendido a los 22 minutos, 1-1, por incidentes; el 24/2 se jugaron los 68 minutos que faltaban.",
      },
    },
    summary: "River ganó el Apertura un punto delante de Rosario Central, que ganó 14 partidos, uno más que el campeón.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  afaLargaExtra(1999, "clausura", "Clausura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Clausura 2000 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Apertura$/, /^Clausura\s*$/, /^Third and Fourth Promotion/],
    sectionRange: { from: /^Clausura\s*$/, to: /^Third and Fourth Promotion/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointsPerWin: 3,
    pointAdjustments: [
      { teamId: "lanus", points: -3, reason: "descuento de 3 puntos por incidentes en la fecha 5" },
      { teamId: "boca", points: -3, reason: "descuento de 3 puntos por incidentes en la fecha 13" },
    ],
    overrides: {
      "2000-04-19 lanus velez": {
        note: "Se había suspendido a los 13 segundos porque una bomba de estruendo aturdió a Chilavert, el arquero de Vélez; el 19/4 se jugó el resto.",
      },
      "2000-07-05 racing river": { note: "Se había suspendido a los 13 minutos, 0-0, por lluvia; el 5/7 se jugaron los 77 minutos que faltaban." },
    },
    summary: "River ganó también el Clausura, seis puntos delante de Independiente, Colón y San Lorenzo.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Gimnasia y Esgrima de Jujuy y Ferro Carril Oeste); los dos siguientes (Instituto y Belgrano) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  afaLargaExtra(1999, "promocion", "Promoción", {
    championIds: [],
    aliases: { ...ABREV_1997, "BELGRANO CBA": "belgrano", ALMAGRO: "almagro" },
    headings: [/^Apertura$/, /^Clausura\s*$/, /^Third and Fourth Promotion/],
    sectionRange: { from: /^Third and Fourth Promotion/ },
    rolloverBefore: 13,
    overrides: {
      "2000-07-20 quilmes belgrano": { phase: "playoff", stage: "Promoción (ida)" },
      "2000-07-23 belgrano quilmes": {
        phase: "playoff",
        stage: "Promoción (vuelta)",
        advancedId: "belgrano",
        note: "4-4 en el global: Belgrano se quedó en Primera por la ventaja deportiva del equipo de Primera.",
      },
      "2000-07-20 almagro instituto": { phase: "playoff", stage: "Promoción (ida)" },
      "2000-07-23 instituto almagro": { phase: "playoff", stage: "Promoción (vuelta)", advancedId: "almagro", note: "Almagro ganó 2-1 en el global: ascendió y descendió Instituto." },
    },
    summary: "Belgrano se salvó con la ventaja deportiva ante Quilmes (4-4 en el global); Instituto perdió con Almagro (1-2) y descendió.",
    notes: [
      { kind: "formato", text: "Series a ida y vuelta entre los equipos 17.º y 18.º del promedio y dos equipos del Nacional B. Con el global empatado, se quedaba el equipo de Primera." },
    ],
  }),
  // ───────── 2000/01 ─────────
  afaLargaExtra(2000, "apertura", "Apertura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Apertura 2000 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Torneo Apertura$/, /^Torneo Clausura$/, /^Third and Fourth Promotion/, /^General Table/],
    sectionRange: { from: /^Torneo Apertura$/, to: /^Torneo Clausura$/ },
    tableIndex: [0],
    pointsPerWin: 3,
    extraMatches: [
      {
        id: "2000-01-apertura-extra-1",
        date: "2000-12-16",
        stage: "Fecha 19",
        phase: "league",
        homeId: "racing",
        awayId: "independiente",
        homeGoals: 0,
        awayGoals: 2,
        note: "Goles: Cambiasso, Vuoso. Se suspendió a los 81 minutos por incidentes, con 0-2, y la liga dio por bueno ese resultado.",
      },
    ],
    overrides: {
      "2000-10-06 racing argentinos": { note: "Se había suspendido el 8/9 a los 47 minutos, 0-0, por lluvia; el 6/10 se jugaron los 43 minutos que faltaban." },
      "2000-11-14 estudiantes newells": {
        note: "El 10/9 se había suspendido a los 41 minutos, 0-0, porque tiraron una bomba de estruendo a la cancha; se volvió a jugar el 14/11.",
      },
      "2000-12-06 lanus racing": {
        note: "Se había suspendido el 11/11 al final del primer tiempo, 2-0, por lluvia; el 6/12 se jugó el segundo tiempo. Goles: A. López (2), Zanetti (en contra), Klimowicz (de penal) - Cannobio, Zanetti.",
      },
      "2000-12-06 river newells": { note: "Se había suspendido el 11/11 a los 31 minutos, 1-0, por lluvia; el 6/12 se jugaron los 59 minutos que faltaban. Goles: Ortega, Coudet." },
      "2000-12-06 huracan belgrano": {
        note: "Se había suspendido el 11/11 al final del primer tiempo, 1-0, por lluvia; el 6/12 se jugó el segundo tiempo. Goles: Lobos, Soto - Mugnaini.",
      },
      "2000-10-22 chacarita colon-santa-fe": {
        note: "Goles: Carrario (2), Moreno (de penal) - Biaggio. RSSSF anota la duda «¿2-1?», pero sus goleadores, su tabla y Wikipedia dan 3-1.",
      },
    },
    summary: "Boca ganó el Apertura cuatro puntos delante de River y Gimnasia y Esgrima La Plata.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  afaLargaExtra(2000, "clausura", "Clausura", {
    championIds: ["sanlorenzo"],
    wiki: "Anexo:Torneo Clausura 2001 (Argentina)",
    aliases: ABREV_1997,
    headings: [/^Torneo Apertura$/, /^Torneo Clausura$/, /^Third and Fourth Promotion/, /^General Table/],
    sectionRange: { from: /^Torneo Clausura$/, to: /^Third and Fourth Promotion/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointsPerWin: 3,
    pointAdjustments: [{ teamId: "los-andes", points: -3, reason: "descuento de 3 puntos (RSSSF no da el motivo)" }],
    skip: (m) => m.score === "awd", // Huracán-Los Andes va a mano (abajo), con el resultado que dio la liga
    extraMatches: [
      {
        id: "2000-01-clausura-extra-1",
        date: "2001-03-04",
        stage: "Fecha 5",
        phase: "league",
        homeId: "huracan",
        awayId: "los-andes",
        homeGoals: 2,
        awayGoals: 0,
        awardedTo: "huracan",
        note: "Se suspendió a los 76 minutos por incidentes, con 2-1 (Moner, Gabrich - Pieters); la liga se lo dio 2-0 a Huracán. Así lo cuentan las tablas de RSSSF y de Wikipedia.",
      },
    ],
    overrides: {
      "2001-06-10 sanlorenzo union-santa-fe": {
        note: "Goles: Romeo (de penal), Erviti - Castillo. Se suspendió a los 86 minutos porque los hinchas de San Lorenzo invadieron la cancha, y quedó el resultado.",
      },
      "2001-06-11 los-andes gimnasia": {
        note: "Goles: Maggiolo, Netto (de penal), Pieters - Cufré, Fernández. Se suspendió a los 90 minutos porque los hinchas de Los Andes invadieron la cancha, y quedó el resultado.",
      },
    },
    summary: "San Lorenzo ganó el Clausura con 15 victorias en 19 partidos, seis puntos delante de River.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Almagro y Los Andes); los dos siguientes (Argentinos Juniors y Belgrano) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  afaLargaExtra(2000, "promocion", "Promoción", {
    championIds: [],
    aliases: { ...ABREV_1997, "BELGRANO CBA": "belgrano", "ARGENTINOS JRS": "argentinos" },
    headings: [/^Torneo Apertura$/, /^Torneo Clausura$/, /^Third and Fourth Promotion/, /^General Table/],
    sectionRange: { from: /^Third and Fourth Promotion/, to: /^General Table/ },
    rolloverBefore: 13,
    overrides: {
      "2001-06-13 quilmes belgrano": { phase: "playoff", stage: "Promoción (ida)" },
      "2001-06-16 belgrano quilmes": { phase: "playoff", stage: "Promoción (vuelta)", advancedId: "belgrano", note: "1-1 en el global: Belgrano se quedó en Primera por la ventaja deportiva." },
      "2001-06-13 instituto argentinos": { phase: "playoff", stage: "Promoción (ida)" },
      "2001-06-16 argentinos instituto": { phase: "playoff", stage: "Promoción (vuelta)", advancedId: "argentinos", note: "1-1 en el global: Argentinos Juniors se quedó en Primera por la ventaja deportiva." },
    },
    summary: "Belgrano (ante Quilmes) y Argentinos Juniors (ante Instituto) empataron 1-1 en el global y se quedaron en Primera por la ventaja deportiva.",
    notes: [
      { kind: "formato", text: "Series a ida y vuelta entre los equipos 17.º y 18.º del promedio y dos equipos del Nacional B. Con el global empatado, se quedaba el equipo de Primera." },
    ],
  }),
  // ───────── 2001/02 ─────────
  afaLargaExtra(2001, "apertura", "Apertura", {
    championIds: ["racing"],
    wiki: "Anexo:Torneo Apertura 2001 (Argentina)",
    aliases: ABREV_2001,
    headings: [/^Torneo Apertura$/, /^Torneo Clausura$/, /^Aggregate Table/, /^Third and Fourth Promotion/],
    sectionRange: { from: /^Torneo Apertura$/, to: /^Torneo Clausura$/ },
    tableIndex: [0],
    pointsPerWin: 3,
    overrides: {
      "2001-09-12 colon-santa-fe nueva-chicago": {
        note: "Se había suspendido el 25/8 a los 11 minutos, 1-0 (gol de Migliónico), porque Migliónico se lesionó gravemente al hacer el gol; se jugaron los 79 minutos que faltaban. Goles: Migliónico, Graf, Capurro - O. Gómez.",
      },
    },
    knownTableDiffs: {
      keys: ["chacarita:goalsFor", "chacarita:goalsAgainst", "banfield:goalsAgainst"],
      explanation:
        "La tabla de RSSSF no cierra: suma 524 goles a favor y 527 en contra. Según los resultados (confirmados uno por uno con Wikipedia, cuya tabla coincide), Chacarita hizo 28 y recibió 24 (RSSSF: 24 y 22) y Banfield recibió 24 (RSSSF: 25).",
    },
    summary: "Racing ganó el Apertura un punto delante de River, con una sola derrota: su primer título de liga desde 1966.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  afaLargaExtra(2001, "clausura", "Clausura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Clausura 2002 (Argentina)",
    aliases: ABREV_2001,
    headings: [/^Torneo Apertura$/, /^Torneo Clausura$/, /^Aggregate Table/, /^Third and Fourth Promotion/],
    sectionRange: { from: /^Torneo Clausura$/, to: /^Aggregate Table/ },
    tableIndex: [0],
    rolloverBefore: 13,
    pointsPerWin: 3,
    overrides: {
      "2002-04-20 racing boca": {
        awardedTo: "racing",
        note: "Se suspendió a los 89 minutos por incidentes, con 2-1 (Milito 2 - González); la liga se lo dio 2-0 a Racing.",
      },
      "2002-04-24 sanlorenzo argentinos": {
        note: "Se había suspendido el 16/4 a los 48 minutos, 0-1, por lluvia; el 24/4 se jugaron los 42 minutos que faltaban. Goles: Franco - Cordone (de penal).",
      },
    },
    wikiErrata: {
      "RSSSF newells 3-0 talleres":
        "Wikipedia da 2-0 (y su tabla lo cuenta así). RSSSF da 3-0, con tres goles (Domizi y Maximiliano Rodríguez, 2), y también lo da 3-0 una tercera fuente (historiayfutbol, josecarluccio.blogspot.com).",
    },
    summary: "River ganó el Clausura seis puntos delante de Gimnasia y Esgrima La Plata.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Argentinos Juniors y Belgrano); los dos siguientes (Lanús y Unión) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  afaLargaExtra(2001, "promocion", "Promoción", {
    championIds: [],
    aliases: { ...ABREV_2001, "LANÚS": "lanus", "UNIÓN (SF)": "union-santa-fe", "Huracán (TA)": "huracan-tres-arroyos", "Gimnasia (ER)": "gimnasia-cdu" },
    headings: [/^Torneo Apertura$/, /^Torneo Clausura$/, /^Aggregate Table/, /^Third and Fourth Promotion/],
    sectionRange: { from: /^Third and Fourth Promotion/ },
    rolloverBefore: 13,
    overrides: {
      "2002-05-23 huracan-tres-arroyos lanus": { phase: "playoff", stage: "Promoción (ida)" },
      "2002-05-26 lanus huracan-tres-arroyos": { phase: "playoff", stage: "Promoción (vuelta)", note: "Lanús ganó 3-2 en el global y se quedó en Primera." },
      "2002-05-23 gimnasia-cdu union-santa-fe": { phase: "playoff", stage: "Promoción (ida)" },
      "2002-05-26 union-santa-fe gimnasia-cdu": { phase: "playoff", stage: "Promoción (vuelta)", note: "Unión ganó 4-3 en el global y se quedó en Primera." },
    },
    summary: "Lanús (3-2 a Huracán de Tres Arroyos) y Unión (4-3 a Gimnasia y Esgrima de Concepción del Uruguay) se quedaron en Primera.",
    notes: [
      { kind: "formato", text: "Series a ida y vuelta entre los equipos 17.º y 18.º del promedio y dos equipos del Nacional B. Con el global empatado, se quedaba el equipo de Primera." },
    ],
  }),
  // ───────── 2002/03 ─────────
  corto(2002, "apertura", {
    championIds: ["independiente"],
    wiki: "Anexo:Torneo Apertura 2002 (Argentina)",
    headings: H_2002,
    sectionRange: { from: /^Torneo Apertura$/, to: /^Torneo Clausura$/ },
    summary: "Independiente ganó el Apertura tres puntos delante de Boca: su primer título de liga desde 1994.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2002, "clausura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Clausura 2003 (Argentina)",
    headings: H_2002,
    sectionRange: { from: /^Torneo Clausura$/, to: /^General Table/ },
    aliases: { "]Newell's Old Boys": "newells" }, // errata de la fuente: un corchete pegado al nombre
    summary: "River ganó el Clausura cuatro puntos delante de Boca.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Unión y Huracán); los dos siguientes (Talleres y Nueva Chicago) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2002, {
    headings: H_2002,
    sectionRange: { from: /^Relegation Playoff$/ },
    series: [
      ["2003-07-09 argentinos nueva-chicago", "2003-07-13 nueva-chicago argentinos", "nueva-chicago", "Nueva Chicago ganó 3-0 en el global y se quedó en Primera."],
      ["2003-07-09 san-martin-mendoza talleres", "2003-07-13 talleres san-martin-mendoza", "talleres", "Talleres ganó 2-0 en el global y se quedó en Primera."],
    ],
    summary: "Nueva Chicago (3-0 a Argentinos Juniors) y Talleres (2-0 a San Martín de Mendoza) se quedaron en Primera.",
  }),
  // ───────── 2003/04 ─────────
  corto(2003, "apertura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Apertura 2003 (Argentina)",
    headings: H_2003,
    sectionRange: { from: /^Torneo Apertura$/, to: /^Torneo Clausura$/ },
    pointAdjustments: [{ teamId: "chacarita", points: -3, reason: "descuento de 3 puntos (RSSSF no da el motivo)" }],
    summary: "Boca ganó el Apertura tres puntos delante de San Lorenzo.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2003, "clausura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Clausura 2004 (Argentina)",
    headings: H_2003,
    sectionRange: { from: /^Torneo Clausura$/, to: /^General Table/ },
    summary: "River ganó el Clausura cuatro puntos delante de Boca.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Chacarita y Nueva Chicago); los dos siguientes (Talleres y Atlético de Rafaela) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2003, {
    headings: H_2003,
    sectionRange: { from: /^Relegation Playoff$/, to: /^Top Scorers/ },
    aliases: { "HURACÁN (TRES ARROYOS)": "huracan-tres-arroyos", "ARGENTINOS JUNIORS": "argentinos", "TAalleres (Córdoba)": "talleres", "Talleres (Córdoba)": "talleres" },
    series: [
      ["2004-06-30 huracan-tres-arroyos atletico-rafaela", "2004-07-04 atletico-rafaela huracan-tres-arroyos", "huracan-tres-arroyos", "Huracán de Tres Arroyos ganó 5-3 en el global: ascendió y descendió Atlético de Rafaela."],
      ["2004-07-01 argentinos talleres", "2004-07-04 talleres argentinos", "argentinos", "Argentinos Juniors ganó 4-2 en el global: ascendió y descendió Talleres."],
    ],
    summary: "Argentinos Juniors (4-2 a Talleres) y Huracán de Tres Arroyos (5-3 a Atlético de Rafaela) ascendieron; Talleres y Rafaela descendieron.",
  }),
  // ───────── 2004/05 ─────────
  corto(2004, "apertura", {
    championIds: ["newells"],
    wiki: "Anexo:Torneo Apertura 2004 (Argentina)",
    headings: H_2004,
    sectionRange: { from: /^Torneo Apertura$/, to: /^Torneo Clausura$/ },
    summary: "Newell's ganó el Apertura dos puntos delante de Vélez: su primer título de liga desde 1992.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2004, "clausura", {
    championIds: ["velez"],
    wiki: "Anexo:Torneo Clausura 2005 (Argentina)",
    headings: H_2004,
    sectionRange: { from: /^Torneo Clausura$/, to: /^Topscorers Clausura/ },
    skip: (m) => m.home === "Almagro" && m.score === "awd",
    extraMatches: [
      {
        id: "2004-05-clausura-extra-1",
        date: "2005-07-03",
        stage: "Fecha 19",
        phase: "league",
        homeId: "almagro",
        awayId: "boca",
        homeGoals: 3,
        awayGoals: 2,
        splitAward: { home: [0, 2], away: [3, 2] },
        note: "Goles: Sparapani 2', Nieto 58' y 60' - Trejo 12', Cahais 28'. Se suspendió con 3-2 por una invasión de cancha, y la liga se lo dio perdido a los dos: 0-2 a Almagro y 2-3 a Boca (así lo cuenta la tabla de RSSSF).",
      },
    ],
    summary: "Vélez ganó el Clausura seis puntos delante de Banfield.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Almagro y Huracán de Tres Arroyos); los dos siguientes (Argentinos Juniors e Instituto) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2004, {
    headings: H_2004,
    sectionRange: { from: /^Promotion\/Relegation Playoffs/ },
    // La fecha va en el título de cada ronda ("First Legs [Jul 6]"): los cuatro partidos se cargan a mano.
    skip: () => true,
    extraMatches: [
      { id: "2004-05-promocion-001", date: "2005-07-06", stage: "Promoción (ida)", phase: "playoff", homeId: "atletico-rafaela", awayId: "argentinos", homeGoals: 2, awayGoals: 1, note: "Goles: Marclay 57', F. García 76' - Pisculichi 80' (de penal)." },
      { id: "2004-05-promocion-002", date: "2005-07-06", stage: "Promoción (ida)", phase: "playoff", homeId: "huracan", awayId: "instituto", homeGoals: 1, awayGoals: 2, note: "Goles: Fioretto 3' - Lujambio 22', Raymonda 68'." },
      { id: "2004-05-promocion-003", date: "2005-07-10", stage: "Promoción (vuelta)", phase: "playoff", homeId: "argentinos", awayId: "atletico-rafaela", homeGoals: 3, awayGoals: 0, advancedId: "argentinos", note: "Goles: M. Córdoba 65' y 85', Marini 89'. Argentinos Juniors ganó 4-2 en el global y se quedó en Primera." },
      { id: "2004-05-promocion-004", date: "2005-07-10", stage: "Promoción (vuelta)", phase: "playoff", homeId: "instituto", awayId: "huracan", homeGoals: 1, awayGoals: 0, advancedId: "instituto", note: "Goles: Raymonda 30'. Instituto ganó 3-1 en el global y se quedó en Primera." },
    ],
    series: [],
    summary: "Argentinos Juniors (4-2 a Atlético de Rafaela) e Instituto (3-1 a Huracán) se quedaron en Primera.",
  }),
  // ───────── 2005/06 ─────────
  corto(2005, "apertura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Apertura 2005 (Argentina)",
    headings: H_2005,
    sectionRange: { from: /^Torneo Apertura/, to: /^Relegation Table/ },
    aliases: { "Instituto ´": "instituto" }, // errata de la fuente: un acento suelto después del nombre
    summary: "Boca ganó el Apertura tres puntos delante de Gimnasia y Esgrima La Plata.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2005, "clausura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Clausura 2006 (Argentina)",
    headings: H_2005,
    sectionRange: { from: /^Torneo Clausura/, to: /^Aggregate Table/ },
    // Las notas de estos partidos van en dos renglones, en una columna aparte: se cargan a mano.
    skip: (m) => m.score === "awd" || (m.home === "Independiente" && m.away === "Banfield"),
    extraMatches: [
      {
        id: "2005-06-clausura-extra-1",
        date: "2006-03-18",
        stage: "Fecha 10",
        phase: "league",
        homeId: "colon-santa-fe",
        awayId: "velez",
        homeGoals: 0,
        awayGoals: 3,
        awardedTo: "velez",
        note: "Se suspendió a los 90 minutos con 1-3 (Denis - Castromán 2, Zárate); la liga se lo dio 0-3 a Vélez.",
      },
      {
        id: "2005-06-clausura-extra-2",
        date: "2006-05-10",
        stage: "Fecha 11",
        phase: "league",
        homeId: "independiente",
        awayId: "banfield",
        homeGoals: 1,
        awayGoals: 2,
        note: "Goles: Agüero (de penal) - Sand, Galarza. Se había suspendido el 26/3 a los 80 minutos, con 1-2; el 10/5 se jugaron, a puertas cerradas, los 10 minutos que faltaban y 3 de descuento.",
      },
      {
        id: "2005-06-clausura-extra-3",
        date: "2006-04-23",
        stage: "Fecha 16",
        phase: "league",
        homeId: "velez",
        awayId: "boca",
        homeGoals: 0,
        awayGoals: 3,
        awardedTo: "boca",
        note: "Se suspendió a los 87 minutos con 2-3 (Ereros, M. Zárate - Palermo, Silvestre, Bilos); la liga se lo dio 0-3 a Boca.",
      },
      {
        id: "2005-06-clausura-extra-4",
        date: "2006-05-14",
        stage: "Fecha 19",
        phase: "league",
        homeId: "quilmes",
        awayId: "river",
        homeGoals: 0,
        awayGoals: 3,
        awardedTo: "river",
        note: "Se suspendió a los 67 minutos con 1-3 (Carrario - Gallardo 2, Ge); la liga se lo dio 0-3 a River.",
      },
    ],
    overrides: {
      "2006-02-25 racing independiente": { note: "Goles: Agüero (2). Se suspendió en el descuento (90+1) con 0-2, y quedó ese resultado." },
    },
    summary: "Boca ganó también el Clausura, ocho puntos delante de Lanús: su segundo bicampeonato seguido.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Instituto y Tiro Federal); los dos siguientes (Argentinos Juniors y Olimpo) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2005, {
    headings: H_2005,
    sectionRange: { from: /^Promotion\/Relegation Playoff/ },
    // La fecha va en el título de cada ronda: los cuatro partidos se cargan a mano.
    skip: () => true,
    extraMatches: [
      { id: "2005-06-promocion-001", date: "2006-05-31", stage: "Promoción (ida)", phase: "playoff", homeId: "huracan", awayId: "argentinos", homeGoals: 1, awayGoals: 1, note: "Goles: Coyette - Ledesma." },
      { id: "2005-06-promocion-002", date: "2006-05-31", stage: "Promoción (ida)", phase: "playoff", homeId: "belgrano", awayId: "olimpo", homeGoals: 2, awayGoals: 1, note: "Goles: Frangipane, Gigli - Delorte." },
      { id: "2005-06-promocion-003", date: "2006-06-04", stage: "Promoción (vuelta)", phase: "playoff", homeId: "argentinos", awayId: "huracan", homeGoals: 2, awayGoals: 2, advancedId: "argentinos", note: "Goles: L. Núñez, C. Ledesma - H. Álvarez, C. Alfaro. 3-3 en el global: Argentinos Juniors se quedó en Primera por la ventaja deportiva." },
      { id: "2005-06-promocion-004", date: "2006-06-04", stage: "Promoción (vuelta)", phase: "playoff", homeId: "olimpo", awayId: "belgrano", homeGoals: 1, awayGoals: 2, advancedId: "belgrano", note: "Goles: Delorte - Frangipane, Gigli. Belgrano ganó 4-2 en el global: ascendió y descendió Olimpo." },
    ],
    series: [],
    summary: "Argentinos Juniors se salvó con la ventaja deportiva ante Huracán (3-3 en el global); Belgrano le ganó 4-2 a Olimpo y ascendió.",
  }),
  // ───────── 2006/07 ─────────
  corto(2006, "apertura", {
    championIds: ["estudiantes"],
    wiki: "Anexo:Torneo Apertura 2006 (Argentina)",
    headings: H_2006,
    sectionRange: { from: /^Torneo Apertura/, to: /^Championship Playoff/ },
    overrides: {
      // La nota del Independiente-Racing sigue en los renglones de abajo, junto al San Lorenzo-Newell's.
      "2006-11-12 independiente racing": { note: "Goles: Montenegro (2). Se suspendió a los 64 minutos, 2-0, por incidentes en la tribuna, y quedó ese resultado." },
      "2006-11-12 sanlorenzo newells": { note: "Goles: R. Jiménez (2) - Ansaldi." },
    },
    summary: "Boca y Estudiantes terminaron igualados en 44 puntos; Estudiantes ganó el desempate 2-1 y fue campeón por primera vez desde 1983.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. El empate en el primer puesto se definió con un partido desempate en cancha neutral." }],
  }),
  afaLargaExtra(2006, "desempate", "Desempate del Apertura", {
    championIds: ["estudiantes"],
    headings: H_2006,
    sectionRange: { from: /^Championship Playoff/, to: /^Topscorers/ },
    aliases: ABREV_2001,
    // "Championship Playoff [Dec 13, at Vélez Sarsfield]": la fecha va en el título.
    skip: () => true,
    extraMatches: [
      {
        id: "2006-07-desempate-001",
        date: "2006-12-13",
        stage: "Desempate por el campeonato",
        phase: "playoff",
        venue: "Cancha de Vélez Sarsfield",
        homeId: "boca",
        awayId: "estudiantes",
        homeGoals: 1,
        awayGoals: 2,
        note: "Goles: Palermo - J. Sosa, Pavone. Estudiantes campeón del Apertura 2006.",
      },
    ],
    summary: "Estudiantes le ganó 2-1 a Boca en cancha de Vélez y fue campeón del Apertura 2006.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral entre los dos igualados en el primer puesto del Apertura." }],
  }),
  corto(2006, "clausura", {
    championIds: ["sanlorenzo"],
    wiki: "Anexo:Torneo Clausura 2007 (Argentina)",
    headings: H_2006,
    sectionRange: { from: /^Torneo Clausura/, to: /^Aggregate Table/ },
    skip: (m) => m.score === "awd",
    extraMatches: [
      {
        id: "2006-07-clausura-extra-1",
        date: "2007-02-17",
        stage: "Fecha 2",
        phase: "league",
        homeId: "newells",
        awayId: "river",
        homeGoals: 0,
        awayGoals: 2,
        awardedTo: "river",
        note: "Se suspendió a los 88 minutos con 1-2; la liga se lo dio 0-2 a River.",
      },
    ],
    wikiErrata: {
      "RSSSF newells 0-2 river": "Wikipedia da el 1-2 de la cancha; la liga lo dio 0-2 a River, y así lo cuentan las tablas de las dos fuentes.",
    },
    overrides: {
      // La nota del Newell's-River sigue en el renglón del Colón-San Lorenzo.
      "2007-02-17 colon-santa-fe sanlorenzo": { note: "" },
    },
    summary: "San Lorenzo ganó el Clausura seis puntos delante de Boca.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Belgrano y Quilmes); los dos siguientes (Nueva Chicago y Godoy Cruz) jugaban la Promoción con equipos del Nacional B.",
      },
      { kind: "puntos", text: "A Newell's le descontaron 3 puntos de su campaña 2006/07 para el promedio, no en la tabla del Clausura." },
    ],
  }),
  promocion(2006, {
    headings: H_2006,
    sectionRange: { from: /^Promotion\/Relegation Playoff/ },
    series: [
      ["2007-06-20 huracan godoy-cruz", "2007-06-24 godoy-cruz huracan", "huracan", "Huracán ganó 5-2 en el global: ascendió y descendió Godoy Cruz."],
      ["2007-06-21 tigre nueva-chicago", "2007-06-25 nueva-chicago tigre", "tigre", "Se suspendió en el minuto 94, con 1-2, y quedó ese resultado. Tigre ganó 3-1 en el global: ascendió y descendió Nueva Chicago."],
    ],
    summary: "Huracán (5-2 a Godoy Cruz) y Tigre (3-1 a Nueva Chicago) ascendieron.",
  }),
  // ───────── 2007/08 ─────────
  corto(2007, "apertura", {
    championIds: ["lanus"],
    wiki: "Anexo:Torneo Apertura 2007 (Argentina)",
    headings: H_2007,
    sectionRange: { from: /^Apertura 2007$/, to: /^Clausura 2008$/ },
    summary: "Lanús ganó el Apertura cuatro puntos delante de Tigre: el primer título de liga de su historia.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2007, "clausura", {
    championIds: ["river"],
    wiki: "Anexo:Torneo Clausura 2008 (Argentina)",
    headings: H_2007,
    sectionRange: { from: /^Clausura 2008$/, to: /^Topscorers$/ },
    skip: (m) => m.score === "awd" || (m.score === "abd" && m.home === "River Plate"), // el River-San Martín suspendido va entero en la nota del partido completado
    extraMatches: [
      {
        id: "2007-08-clausura-extra-1",
        date: "2008-03-22",
        stage: "Fecha 7",
        phase: "league",
        homeId: "racing",
        awayId: "estudiantes",
        homeGoals: 0,
        awayGoals: 2,
        awardedTo: "estudiantes",
        note: "Se suspendió a los 77 minutos por incidentes en la tribuna, con 1-2 (Fileppi - Galván, Lázzaro); la liga se lo dio 0-2 a Estudiantes.",
      },
    ],
    overrides: {
      // La nota del partido suspendido va en dos renglones, mezclada con los goleadores.
      "2008-03-19 river san-martin-sj": {
        note: "Empezó el 2/3 y se suspendió a los 82 minutos por lluvia, con 3-2; el 19/3 se jugaron los 8 minutos que faltaban. Goles: Abreu 17', Buonanotte 27', Nasuti 57' - Brusco 26', Bravo 62'.",
      },
    },
    wikiErrata: {
      "RSSSF racing 0-2 estudiantes": "Wikipedia da el 1-2 de la cancha; la liga lo dio 0-2 a Estudiantes, y así lo cuentan las tablas de las dos fuentes.",
    },
    summary: "River ganó el Clausura cuatro puntos delante de Boca y Estudiantes.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Olimpo y San Martín de San Juan); los dos siguientes (Racing y Gimnasia y Esgrima de Jujuy) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2007, {
    headings: H_2007,
    sectionRange: { from: /^Promotion\/Relegation Playoffs/ },
    // La fecha va en el título de cada ronda: los cuatro partidos se cargan a mano.
    skip: () => true,
    extraMatches: [
      { id: "2007-08-promocion-001", date: "2008-06-25", stage: "Promoción (ida)", phase: "playoff", homeId: "belgrano", awayId: "racing", homeGoals: 1, awayGoals: 1, note: "Goles: Gigli 76' - Sava 14'." },
      { id: "2007-08-promocion-002", date: "2008-06-25", stage: "Promoción (ida)", phase: "playoff", homeId: "union-santa-fe", awayId: "gimnasia-jujuy", homeGoals: 1, awayGoals: 1, note: "Goles: Serrizuela 44' - Carranza 34'." },
      { id: "2007-08-promocion-003", date: "2008-06-29", stage: "Promoción (vuelta)", phase: "playoff", homeId: "racing", awayId: "belgrano", homeGoals: 1, awayGoals: 0, advancedId: "racing", note: "Goles: Moralez 10'. Racing ganó 2-1 en el global y se quedó en Primera." },
      { id: "2007-08-promocion-004", date: "2008-06-29", stage: "Promoción (vuelta)", phase: "playoff", homeId: "gimnasia-jujuy", awayId: "union-santa-fe", homeGoals: 1, awayGoals: 0, advancedId: "gimnasia-jujuy", note: "Goles: Arraya 69'. Gimnasia y Esgrima de Jujuy ganó 2-1 en el global y se quedó en Primera." },
    ],
    series: [],
    summary: "Racing (2-1 a Belgrano) y Gimnasia y Esgrima de Jujuy (2-1 a Unión) se quedaron en Primera.",
  }),
  // ───────── 2008/09 ─────────
  corto(2008, "apertura", {
    championIds: ["boca"],
    wiki: "Anexo:Torneo Apertura 2008 (Argentina)",
    headings: H_2008,
    sectionRange: { from: /^Torneo Apertura/, to: /^Championship Playoff$/ },
    summary: "San Lorenzo, Boca y Tigre terminaron igualados en 39 puntos; Boca ganó el triangular de desempate y fue campeón.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. El empate de tres equipos en el primer puesto se definió con un triangular en cancha neutral." }],
  }),
  afaLargaExtra(2008, "desempate", "Triangular del Apertura", {
    championIds: ["boca"],
    headings: H_2008,
    sectionRange: { from: /^Championship Playoff$/, to: /^Topscorers$/ },
    aliases: ABREV_2001,
    tableIndex: [0],
    pointsPerWin: 3,
    summary: "Boca, Tigre y San Lorenzo ganaron un partido cada uno; Boca fue campeón por diferencia de gol.",
    notes: [
      { kind: "formato", text: "Triangular a una rueda, en cancha neutral, entre los tres igualados en el primer puesto del Apertura. Terminaron los tres con 3 puntos y Boca fue campeón por diferencia de gol (+1)." },
    ],
  }),
  corto(2008, "clausura", {
    championIds: ["velez"],
    wiki: "Anexo:Torneo Clausura 2009 (Argentina)",
    headings: H_2008,
    sectionRange: { from: /^Torneo Clausura/, to: /^Topscorers$/ },
    summary: "Vélez ganó el Clausura dos puntos delante de Huracán y Lanús.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (San Martín de Tucumán y Gimnasia y Esgrima de Jujuy); los dos siguientes (Rosario Central y Gimnasia y Esgrima La Plata) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2008, {
    headings: H_2008,
    sectionRange: { from: /^Promotion\/Relegation Playoffs/ },
    // La fecha de las vueltas va en el título de la ronda: los cuatro partidos se cargan a mano.
    skip: () => true,
    extraMatches: [
      { id: "2008-09-promocion-001", date: "2009-07-08", stage: "Promoción (ida)", phase: "playoff", homeId: "belgrano", awayId: "central", homeGoals: 0, awayGoals: 1, note: "Goles: J. Méndez 48'." },
      { id: "2008-09-promocion-002", date: "2009-07-09", stage: "Promoción (ida)", phase: "playoff", homeId: "atletico-rafaela", awayId: "gimnasia", homeGoals: 3, awayGoals: 0, note: "Goles: Visconti 15', 63' y 68'." },
      { id: "2008-09-promocion-003", date: "2009-07-12", stage: "Promoción (vuelta)", phase: "playoff", homeId: "central", awayId: "belgrano", homeGoals: 1, awayGoals: 1, advancedId: "central", note: "Goles: Zelaya 38' - J. C. Maldonado 37'. Rosario Central ganó 2-1 en el global y se quedó en Primera." },
      { id: "2008-09-promocion-004", date: "2009-07-12", stage: "Promoción (vuelta)", phase: "playoff", homeId: "gimnasia", awayId: "atletico-rafaela", homeGoals: 3, awayGoals: 0, advancedId: "gimnasia", note: "Goles: Alonso 72', Niell 89' y 90+1'. 3-3 en el global: Gimnasia y Esgrima La Plata se quedó en Primera por la ventaja deportiva." },
    ],
    series: [],
    summary: "Rosario Central (2-1 a Belgrano) se quedó en Primera; Gimnasia y Esgrima La Plata perdió 3-0 en Rafaela, lo dio vuelta 3-0 en la vuelta y se salvó por la ventaja deportiva.",
  }),
  // ───────── 2009/10 (arg2010.html; arg10.html es 1910) ─────────
  corto(2009, "apertura", {
    file: "arg2010.html",
    championIds: ["banfield"],
    wiki: "Anexo:Torneo Apertura 2009 (Argentina)",
    headings: H_2009,
    sectionRange: { from: /Apertura 2009$/, to: /^Topscorer$/ },
    summary: "Banfield ganó el Apertura dos puntos delante de Newell's: el primer título de liga de su historia.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2009, "clausura", {
    file: "arg2010.html",
    championIds: ["argentinos"],
    wiki: "Anexo:Torneo Clausura 2010 (Argentina)",
    headings: H_2009,
    sectionRange: { from: /Clausura 2010$/, to: /^Topscorers$/ },
    summary: "Argentinos Juniors ganó el Clausura un punto delante de Estudiantes: su primer título de liga desde 1985.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Atlético Tucumán y Chacarita); los dos siguientes (Rosario Central y Gimnasia y Esgrima La Plata) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2009, {
    file: "arg2010.html",
    headings: H_2009,
    sectionRange: { from: /^Promotion\/Relegation Playoffs/ },
    // La fecha va en el título de cada ronda: los cuatro partidos se cargan a mano.
    skip: () => true,
    extraMatches: [
      { id: "2009-10-promocion-001", date: "2010-05-19", stage: "Promoción (ida)", phase: "playoff", homeId: "all-boys", awayId: "central", homeGoals: 1, awayGoals: 1 },
      { id: "2009-10-promocion-002", date: "2010-05-19", stage: "Promoción (ida)", phase: "playoff", homeId: "atletico-rafaela", awayId: "gimnasia", homeGoals: 1, awayGoals: 0 },
      { id: "2009-10-promocion-003", date: "2010-05-23", stage: "Promoción (vuelta)", phase: "playoff", homeId: "central", awayId: "all-boys", homeGoals: 0, awayGoals: 3, advancedId: "all-boys", note: "All Boys ganó 4-1 en el global: ascendió y descendió Rosario Central." },
      { id: "2009-10-promocion-004", date: "2010-05-23", stage: "Promoción (vuelta)", phase: "playoff", homeId: "gimnasia", awayId: "atletico-rafaela", homeGoals: 3, awayGoals: 1, advancedId: "gimnasia", note: "Gimnasia y Esgrima La Plata ganó 3-2 en el global y se quedó en Primera." },
    ],
    series: [],
    summary: "All Boys le ganó 4-1 a Rosario Central, que descendió por primera vez desde 1984; Gimnasia y Esgrima La Plata (3-2 a Atlético de Rafaela) se quedó en Primera.",
  }),
  // ───────── 2010/11 (arg2011.html; la página trae también el ascenso) ─────────
  corto(2010, "apertura", {
    file: "arg2011.html",
    championIds: ["estudiantes"],
    wiki: "Anexo:Torneo Apertura 2010 (Argentina)",
    headings: H_2010,
    aliases: { "Gimnasia y Esgrima": "gimnasia" }, // en 2010/11 el único Gimnasia de Primera es el de La Plata
    sectionRange: { from: /^Torneo .*Apertura 2010$/, to: /^Topscorers$/ },
    summary: "Estudiantes ganó el Apertura dos puntos delante de Vélez, con 14 victorias y solo 8 goles en contra.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2010, "clausura", {
    file: "arg2011.html",
    championIds: ["velez"],
    wiki: "Anexo:Torneo Clausura 2011 (Argentina)",
    headings: H_2010,
    aliases: { "Gimnasia y Esgrima": "gimnasia" }, // en 2010/11 el único Gimnasia de Primera es el de La Plata
    sectionRange: { from: /^Torneo .*Clausura 2011/, to: /^Topscorers$/ },
    summary: "Vélez ganó el Clausura cuatro puntos delante de Lanús.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendía directamente el peor promedio de las últimas tres temporadas (Quilmes). Gimnasia y Esgrima La Plata y Huracán empataron el 18.º puesto y jugaron un desempate: el perdedor descendía y el ganador iba a la Promoción con River, 17.º.",
      },
    ],
  }),
  afaLargaExtra(2010, "desempate", "Desempate por el descenso", {
    file: "arg2011.html",
    championIds: [],
    headings: H_2010,
    aliases: { "Gimnasia y Esgrima": "gimnasia" }, // en 2010/11 el único Gimnasia de Primera es el de La Plata
    sectionRange: { from: /^Playoff Against 19th Place/, to: /^Promotion\/Relegation Playoffs/ },
    skip: () => true,
    extraMatches: [
      {
        id: "2010-11-desempate-001",
        date: "2011-06-22",
        stage: "Desempate por el descenso",
        phase: "playoff",
        venue: "Cancha de Boca Juniors",
        homeId: "huracan",
        awayId: "gimnasia",
        homeGoals: 0,
        awayGoals: 2,
        note: "Huracán descendió; Gimnasia y Esgrima La Plata fue a la Promoción.",
      },
    ],
    summary: "Gimnasia y Esgrima La Plata le ganó 2-0 a Huracán en cancha de Boca: Huracán descendió y Gimnasia fue a la Promoción.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral entre los dos igualados en el 18.º puesto de la tabla de promedios." }],
  }),
  promocion(2010, {
    file: "arg2011.html",
    headings: H_2010,
    aliases: { "Gimnasia y Esgrima": "gimnasia" }, // en 2010/11 el único Gimnasia de Primera es el de La Plata
    sectionRange: { from: /^Promotion\/Relegation Playoffs/, to: /^Primera B Nacional/ },
    skip: () => true,
    extraMatches: [
      { id: "2010-11-promocion-001", date: "2011-06-22", stage: "Promoción (ida)", phase: "playoff", homeId: "belgrano", awayId: "river", homeGoals: 2, awayGoals: 0 },
      { id: "2010-11-promocion-002", date: "2011-06-26", stage: "Promoción (ida)", phase: "playoff", homeId: "san-martin-sj", awayId: "gimnasia", homeGoals: 1, awayGoals: 0 },
      {
        id: "2010-11-promocion-003",
        date: "2011-06-26",
        stage: "Promoción (vuelta)",
        phase: "playoff",
        homeId: "river",
        awayId: "belgrano",
        homeGoals: 1,
        awayGoals: 1,
        advancedId: "belgrano",
        note: "Se suspendió en el minuto 89, con 1-1, por los incidentes en la tribuna. Belgrano ganó 3-1 en el global: ascendió y River descendió por primera vez en su historia. RSSSF dice que el 12/8 la AFA le dio el partido 0-1 a Belgrano; las demás fuentes (Wikipedia, Goal) lo dan 1-1, que es lo que figura acá.",
      },
      { id: "2010-11-promocion-004", date: "2011-06-30", stage: "Promoción (vuelta)", phase: "playoff", homeId: "gimnasia", awayId: "san-martin-sj", homeGoals: 1, awayGoals: 1, advancedId: "san-martin-sj", note: "San Martín de San Juan ganó 2-1 en el global: ascendió y descendió Gimnasia y Esgrima La Plata." },
    ],
    series: [],
    summary: "Belgrano (3-1 a River) y San Martín de San Juan (2-1 a Gimnasia y Esgrima La Plata) ascendieron. River descendió por primera vez en su historia.",
  }),
  // ───────── 2011/12 (arg2012.html; trae también la Copa Argentina y la Supercopa) ─────────
  corto(2011, "apertura", {
    file: "arg2012.html",
    championIds: ["boca"],
    wiki: "Anexo:Torneo Apertura 2011 (Argentina)",
    headings: H_2011,
    sectionRange: { from: /^Torneo Apertura 2011$/, to: /^Torneo Clausura 2012$/ },
    summary: "Boca ganó el Apertura invicto (12 ganados y 7 empatados, 6 goles en contra), doce puntos delante de Racing, Vélez, Belgrano y Colón.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria." }],
  }),
  corto(2011, "clausura", {
    file: "arg2012.html",
    championIds: ["arsenal"],
    wiki: "Anexo:Torneo Clausura 2012 (Argentina)",
    headings: H_2011,
    sectionRange: { from: /^Torneo Clausura 2012$/, to: /^Relegation Table/ },
    overrides: {
      "2012-04-14 san-martin-sj velez": {
        note: "Goles: Affranchino - Grabinski (en contra), L. Velázquez, Pratto. Se suspendió a los 40 minutos del segundo tiempo por incidentes en la tribuna local, y quedó ese resultado (El Esquiú).",
      },
    },
    wikiErrata: {
      "RSSSF san-martin-sj 1-3 velez":
        "Wikipedia da 0-3 (y su tabla lo cuenta así). RSSSF da 1-3, igual que su tabla, y también una tercera fuente (El Esquiú, 15/4/2012: «Vélez ganó 3 a 1 en San Juan»).",
    },
    summary: "Arsenal ganó el Clausura dos puntos delante de Tigre: el primer título de liga de su historia.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían directamente los dos peores promedios de las últimas tres temporadas (Banfield y Olimpo); los dos siguientes (San Martín de San Juan y San Lorenzo) jugaban la Promoción con equipos del Nacional B.",
      },
    ],
  }),
  promocion(2011, {
    file: "arg2012.html",
    headings: H_2011,
    sectionRange: { from: /^Promotion\/Relegation Playoffs$/, to: /^Copa Argentina 2011\/12/ },
    aliases: { "Instituto (Córdoba)": "instituto" },
    series: [
      ["2012-06-28 central san-martin-sj", "2012-07-01 san-martin-sj central", "san-martin-sj", "0-0 en el global: San Martín de San Juan se quedó en Primera por la ventaja deportiva."],
      ["2012-06-28 instituto sanlorenzo", "2012-07-01 sanlorenzo instituto", "sanlorenzo", "San Lorenzo ganó 3-1 en el global y se quedó en Primera."],
    ],
    summary: "San Martín de San Juan (0-0 y 0-0 con Rosario Central, por la ventaja deportiva) y San Lorenzo (3-1 a Instituto) se quedaron en Primera.",
  }),
  // ───────── 2012/13: Inicial, Final y final entre los dos campeones ─────────
  corto(2012, "inicial", {
    file: "arg2013.html",
    championIds: ["velez"],
    wiki: "Anexo:Torneo Inicial 2012 (Argentina)",
    headings: H_2012,
    sectionRange: { from: /^Torneo Inicial 2012\/13$/, to: /^Torneo Final 2012\/13$/ },
    summary: "Vélez ganó el Inicial cinco puntos delante de Newell's y Belgrano.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. El campeón jugaba una final con el ganador del Final por el título de la temporada." }],
  }),
  corto(2012, "final", {
    file: "arg2013.html",
    championIds: ["newells"],
    wiki: "Anexo:Torneo Final 2013 (Argentina)",
    headings: H_2012,
    sectionRange: { from: /^Torneo Final 2012\/13$/, to: /^Campeonato de Primera División 2012\/13$/ },
    summary: "Newell's ganó el Final tres puntos delante de River.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Desde esta temporada no hubo Promoción: descendieron directamente los tres peores promedios de las últimas tres temporadas (Unión, Independiente y San Martín de San Juan). Independiente perdió la categoría por primera vez en su historia.",
      },
    ],
  }),
  afaLargaExtra(2012, "campeonato", "Final de campeones", {
    file: "arg2013.html",
    championIds: ["velez"],
    headings: H_2012,
    sectionRange: { from: /^Campeonato de Primera División 2012\/13$/, to: /^Copa Argentina$/ },
    aliases: ABREV_2001,
    rolloverBefore: 13,
    overrides: {
      "2013-06-29 velez newells": { phase: "playoff", stage: "Final del campeonato 2012/13", venue: "Estadio Malvinas Argentinas (Mendoza)", note: "Goles: Pratto 8'. Vélez, ganador del Inicial, fue campeón de la temporada 2012/13." },
    },
    summary: "Vélez le ganó 1-0 a Newell's en Mendoza y fue campeón de la temporada 2012/13.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral entre los ganadores del Inicial (Vélez) y del Final (Newell's)." }],
  }),
  // ───────── 2013/14 (la Copa Campeonato San Lorenzo-River va con las copas) ─────────
  corto(2013, "inicial", {
    file: "arg2014.html",
    championIds: ["sanlorenzo"],
    wiki: "Anexo:Torneo Inicial 2013 (Argentina)",
    headings: H_2013,
    sectionRange: { from: /^Torneo Inicial 2013\/14 \S*Nietos/, to: /^Torneo Final 2013\/14 \S*Nietos/ },
    pointAdjustments: [{ teamId: "colon-santa-fe", points: -6, reason: "descuento de 6 puntos por una deuda con el Atlante de México, reclamada ante la FIFA" }],
    overrides: {
      "2013-11-18 colon-santa-fe atletico-rafaela": {
        walkover: true,
        awardedTo: "atletico-rafaela",
        note: "No se jugó: Colón no se presentó y el 11/12 la liga le dio el partido 0-1 a Atlético de Rafaela.",
      },
    },
    summary: "San Lorenzo ganó el Inicial dos puntos delante de Lanús, Vélez y Newell's.",
    notes: [{ kind: "formato", text: "20 equipos a una rueda, 3 puntos por victoria. El campeón jugaba la Copa Campeonato con el ganador del Final." }],
  }),
  corto(2013, "final", {
    file: "arg2014.html",
    championIds: ["river"],
    wiki: "Anexo:Torneo Final 2014 (Argentina)",
    headings: H_2013,
    sectionRange: { from: /^Torneo Final 2013\/14 \S*Nietos/, to: /^Copa Campeonato de Primera/ },
    summary: "River ganó el Final cinco puntos delante de Boca, Estudiantes y Godoy Cruz.",
    notes: [
      {
        kind: "formato",
        text: "20 equipos a una rueda, 3 puntos por victoria. Descendían los tres peores promedios de las últimas tres temporadas: All Boys, Argentinos Juniors y el perdedor del desempate entre Colón y Atlético de Rafaela, igualados en el 17.º puesto (Colón).",
      },
    ],
  }),
  afaLargaExtra(2013, "prelibertadores", "Desempate Pre-Libertadores", {
    file: "arg2014.html",
    championIds: [],
    headings: H_2013,
    sectionRange: { from: /^Pre Libertadores Playoff$/, to: /^Relegation$/ },
    // "[Feb 28, 2015]": se carga a mano (la fecha trae el año y se jugó en la temporada siguiente).
    skip: () => true,
    extraMatches: [
      {
        id: "2013-14-prelibertadores-001",
        date: "2015-02-28",
        homeId: "boca",
        awayId: "velez",
        homeGoals: 1,
        awayGoals: 0,
        phase: "playoff",
        stage: "Desempate por el primer puesto de la tabla anual",
        venue: "Estadio José María Minella (Mar del Plata)",
        note: "Boca y Vélez igualaron el primer puesto de la tabla anual 2013/14 (Inicial más Final). Boca ganó y pasó directo a la fase de grupos de la Copa Libertadores 2015.",
      },
    ],
    summary: "Boca le ganó 1-0 a Vélez en Mar del Plata (febrero de 2015) por el primer puesto de la tabla anual 2013/14 y un lugar directo en la Copa Libertadores 2015.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral entre los dos igualados en el primer puesto de la tabla anual de la temporada." }],
  }),
  afaLargaExtra(2013, "desempate", "Desempate por el descenso", {
    file: "arg2014.html",
    championIds: [],
    headings: H_2013,
    sectionRange: { from: /^Against relegation playoff/, to: /^Copa Sancor Seguros Argentina 2014/ },
    aliases: ABREV_2001,
    rolloverBefore: 13,
    overrides: {
      "2014-05-24 colon-santa-fe atletico-rafaela": {
        phase: "playoff",
        stage: "Desempate por el descenso",
        venue: "Cancha de Rosario Central",
        note: "Colón y Atlético de Rafaela igualaron el 17.º puesto de la tabla de promedios: Rafaela se quedó en Primera y Colón descendió.",
      },
    },
    summary: "Atlético de Rafaela le ganó 1-0 a Colón en cancha de Rosario Central: Colón descendió.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral entre los dos igualados en el 17.º puesto de la tabla de promedios." }],
  }),
  // ───────── 2014: Torneo de Transición (arg2015.html) ─────────
  anual(2014, undefined, "Campeonato", {
    file: "arg2015.html",
    tournament: "Campeonato de Primera División 2014 «Doctor Ramón Carrillo»",
    championIds: ["racing"],
    wiki: "Campeonato de Primera División 2014 (Argentina)",
    headings: [/^Campeonato de Primera División 2014/, /^Copa Sancor Seguros Argentina 2014/],
    sectionRange: { from: /^Campeonato de Primera División 2014/, to: /^Copa Sancor Seguros Argentina 2014/ },
    summary: "Racing ganó el torneo de transición dos puntos delante de River: su primer título de liga desde 2001.",
    notes: [
      {
        kind: "formato",
        text: "Torneo de transición de 20 equipos a una rueda, 3 puntos por victoria, para pasar al calendario anual. No hubo descensos; en 2015 se sumaron diez equipos del Nacional B y la Primera pasó a tener 30.",
      },
    ],
  }),
  // ───────── 2015: 30 equipos, Liguilla Pre-Libertadores y Pre-Sudamericana (arg2015a.html) ─────────
  anual(2015, undefined, "Campeonato", {
    file: "arg2015a.html",
    tournament: "Campeonato de Primera División 2015 «Julio H. Grondona»",
    championIds: ["boca"],
    wiki: "Campeonato de Primera División 2015 (Argentina)",
    headings: H_2015,
    sectionRange: { from: /^Campeonato de Primera División 2015/, to: /^Liguilla Pre Libertadores$/ },
    aliases: A_2015,
    overrides: {
      "2015-04-13 arsenal newells": {
        homeGoals: 3,
        awayGoals: 0,
        awardedTo: undefined,
        goalsVoid: undefined,
        note: "La liga se lo había dado 0-1 a Newell's el 22/5, pero el 23/7 revocó la sanción y quedó el 3-0 de la cancha.",
      },
    },
    summary: "Boca ganó el campeonato de 30 equipos tres puntos delante de San Lorenzo.",
    notes: [
      {
        kind: "formato",
        text: "30 equipos a una rueda, más una fecha extra de clásicos (solo los clásicos se jugaron dos veces), 3 puntos por victoria. Descendieron Nueva Chicago y Crucero del Norte.",
      },
    ],
  }),
  anual(2015, "liguilla-libertadores", "Liguilla Pre-Libertadores", {
    file: "arg2015a.html",
    championIds: [],
    headings: H_2015,
    sectionRange: { from: /^Liguilla Pre Libertadores$/, to: /^Liguilla Pre Sudamericana$/ },
    aliases: A_2015,
    tableIncludesPlayoffs: true,
    overrides: {
      "2015-11-19 independiente belgrano": { phase: "playoff", stage: "Semifinal" },
      "2015-11-20 racing estudiantes": { phase: "playoff", stage: "Semifinal" },
      "2015-11-29 independiente racing": { phase: "playoff", stage: "Final (ida)" },
      "2015-12-06 racing independiente": { phase: "playoff", stage: "Final (vuelta)", advancedId: "racing", note: "Racing ganó 3-2 en el global y fue a la Copa Libertadores 2016; Independiente, a la Sudamericana." },
    },
    summary: "Racing le ganó la final a Independiente (2-0 y 1-2) y fue a la Copa Libertadores 2016.",
    notes: [
      {
        kind: "formato",
        text: "Los cuatro mejores del campeonato que no estaban clasificados a la Libertadores 2016 ni descendidos: semifinales a un partido y final a ida y vuelta. El ganador iba a la Libertadores y el finalista a la Sudamericana.",
      },
    ],
  }),
  anual(2015, "liguilla-sudamericana", "Liguilla Pre-Sudamericana", {
    file: "arg2015a.html",
    championIds: [],
    headings: H_2015,
    sectionRange: { from: /^Liguilla Pre Sudamericana$/, to: /^Relegation$/ },
    aliases: A_2015,
    tableIncludesPlayoffs: true,
    overrides: Object.fromEntries([
      ...["2015-11-19 tigre colon-santa-fe", "2015-11-20 gimnasia san-martin-sj", "2015-11-20 union-santa-fe aldosivi", "2015-11-23 lanus newells", "2015-11-23 quilmes olimpo", "2015-11-24 banfield argentinos"].map(
        (k) => [k, { phase: "playoff" as const, stage: "Primera fase" }],
      ),
      ...["2015-11-28 colon-santa-fe belgrano", "2015-11-28 lanus gimnasia", "2015-11-28 olimpo estudiantes", "2015-11-29 aldosivi banfield"].map((k) => [
        k,
        { phase: "playoff" as const, stage: "Segunda fase (ida)" },
      ]),
      ["2015-12-05 banfield aldosivi", { phase: "playoff" as const, stage: "Segunda fase (vuelta)", advancedId: "banfield", note: "Banfield ganó 4-3 en el global y fue a la Sudamericana 2016." }],
      ["2015-12-05 belgrano colon-santa-fe", { phase: "playoff" as const, stage: "Segunda fase (vuelta)", advancedId: "belgrano", note: "Belgrano ganó 2-1 en el global y fue a la Sudamericana 2016." }],
      ["2015-12-05 estudiantes olimpo", { phase: "playoff" as const, stage: "Segunda fase (vuelta)", advancedId: "estudiantes", note: "Estudiantes ganó 5-0 en el global y fue a la Sudamericana 2016." }],
      ["2015-12-06 gimnasia lanus", { phase: "playoff" as const, stage: "Segunda fase (vuelta)", advancedId: "lanus", note: "Lanús ganó 3-1 en el global y fue a la Sudamericana 2016." }],
    ]),
    summary: "Lanús, Banfield, Estudiantes y Belgrano se clasificaron a la Copa Sudamericana 2016.",
    notes: [
      {
        kind: "formato",
        text: "Los mejores del campeonato sin clasificación internacional (más los perdedores de las semifinales de la Liguilla Pre-Libertadores): una ronda a un partido y otra a ida y vuelta. Los cuatro ganadores fueron a la Sudamericana.",
      },
    ],
  }),
  // ───────── 2016: dos zonas de 15, final y partido por el tercer puesto ─────────
  anual(2016, undefined, "Campeonato", {
    file: "arg2016.html",
    tournament: "Campeonato de Primera División 2016",
    championIds: ["lanus"],
    wiki: "Campeonato de Primera División 2016 (Argentina)",
    headings: [/^Campeonato de Primera División 2016$/, /^Relegation$/],
    sectionRange: { from: /^Campeonato de Primera División 2016$/, to: /^Relegation$/ },
    tableIndex: [0, 1],
    groupNames: ["Zona 1", "Zona 2"],
    aliases: {
      "Club Atlético San Martín": "san-martin-sj",
      "Club Atlético Sarmiento": "sarmiento-junin",
      Sarmiento: "sarmiento-junin", // así lo nombra Wikipedia
      "Club Atlético Unión": "union-santa-fe",
      "Club Atlético Belgrano": "belgrano",
      "Club Atlético Tucumán Sociedad Civil": "atletico-tucuman",
      "Club Atlético Tucumán Sociedad C.": "atletico-tucuman",
      "Club Atlético Patronato de la Juventud Católica": "patronato-parana",
      "CA Patronato de la Juv. Católica": "patronato-parana",
      "Asociación A. Argentinos Juniors": "argentinos",
      "Asociación Mutual Social y Deportiva Atlético de Rafaela": "atletico-rafaela",
    },
    overrides: {
      "2016-05-28 godoy-cruz estudiantes": {
        phase: "playoff",
        stage: "Partido entre los segundos",
        venue: "Mario Alberto Kempes (Córdoba)",
        note: "Entre los segundos de cada zona, por un lugar en la Copa Libertadores 2017: lo ganó Estudiantes.",
      },
      "2016-05-29 sanlorenzo lanus": {
        phase: "playoff",
        stage: "Final",
        note: "Final entre los ganadores de las dos zonas, en cancha de River: Lanús campeón.",
      },
    },
    summary: "Lanús ganó su zona y le ganó la final 4-0 a San Lorenzo en el Monumental.",
    notes: [
      {
        kind: "formato",
        text: "30 equipos en dos zonas de 15, a una rueda, más una fecha de clásicos entre zonas; 3 puntos por victoria. Los ganadores de las zonas jugaron la final y los segundos, un partido por un lugar en la Libertadores. Descendió Argentinos Juniors.",
      },
    ],
  }),
  // ───────── 2016/17: 30 equipos a una rueda (arg2017.html) ─────────
  {
    ...afaLarga(2016, {
      championIds: ["boca"],
      headings: [/^Campeonato de Primera División 2016\/2017$/, /^Relegation$/],
      sectionRange: { from: /^Campeonato de Primera División 2016\/2017$/, to: /^Relegation$/ },
      tableIndex: [0],
      pointsPerWin: 3,
      aliases: { ...ABREV_2001, ...A_2016 },
      summary: "Boca ganó el campeonato de 30 equipos siete puntos delante de River y Estudiantes.",
      notes: [
        {
          kind: "formato",
          text: "30 equipos a una rueda, 3 puntos por victoria. Descendieron los cuatro peores promedios de las últimas cuatro temporadas: Aldosivi, Quilmes, Atlético de Rafaela y Sarmiento.",
        },
      ],
    }),
    file: "arg2017.html",
  },
  // ───────── 2017/18: Superliga, 28 equipos (arg2018.html) ─────────
  {
    ...afaLarga(2017, {
      championIds: ["boca"],
      headings: [/^Campeonato de Primera División \S*Superliga 2017\/2018/, /^Relegation$/],
      sectionRange: { from: /^Campeonato de Primera División \S*Superliga 2017\/2018/, to: /^Relegation$/ },
      tableIndex: [0],
      pointsPerWin: 3,
      aliases: { ...ABREV_2001, ...A_2016, "CA San Martín": "san-martin-sj" }, // en 2017/18 solo estaba el de San Juan
      pointAdjustments: [
        { teamId: "newells", points: -1, reason: "descuento de 1 punto (primero fueron 3; el TAS lo fijó en 1 el 28/6/2019)" },
        { teamId: "arsenal", points: -2, reason: "descuento de 2 puntos (14/9/2018)" },
        { teamId: "olimpo", points: -1, reason: "descuento de 1 punto (14/9/2018)" },
      ],
      summary: "Boca ganó la primera Superliga dos puntos delante de Godoy Cruz: su segundo título seguido.",
      notes: [
        {
          kind: "formato",
          text: "Superliga: 28 equipos a una rueda, 3 puntos por victoria. Descendieron los cuatro peores promedios: Temperley, Olimpo, Arsenal y Chacarita.",
        },
      ],
    }),
    file: "arg2018.html",
    tournament: "Superliga 2017/18",
    title: "Superliga 2017/18",
  },
  // ───────── 2018/19: Superliga, 26 equipos (arg2019.html) ─────────
  {
    ...afaLarga(2018, {
      championIds: ["racing"],
      headings: [/^Campeonato de Primera División \S*Superliga 2018\/2019/, /^Copa de Superliga was approved/, /^Relegation$/],
      sectionRange: { from: /^Campeonato de Primera División \S*Superliga 2018\/2019/, to: /^Copa de Superliga was approved/ },
      tableIndex: [0],
      pointsPerWin: 3,
      aliases: {
        ...ABREV_2001,
        ...A_2016,
        // En 2018/19 jugaron los dos San Martín.
        "Club Atlético San Martín": "san-martin-sj",
        "Club Atlético San Martín Sociedad Civil": "san-martin-tucuman",
        "CA San Martín (San Juan)": "san-martin-sj",
        "CA San Martín (SM de Tucumán)": "san-martin-tucuman",
      },
      summary: "Racing ganó la Superliga cuatro puntos delante de Defensa y Justicia.",
      notes: [
        {
          kind: "formato",
          text: "Superliga: 26 equipos a una rueda, 3 puntos por victoria. Descendieron los cuatro peores promedios: Tigre, San Martín de San Juan, Belgrano y San Martín de Tucumán.",
        },
        {
          kind: "puntos",
          text: "La Superliga resolvió descontarles 6 puntos a San Lorenzo (22/3) y a Huracán (8/4), pero el 10/6 suspendió las dos sanciones: no se aplicaron.",
        },
      ],
    }),
    file: "arg2019.html",
    tournament: "Superliga 2018/19",
    title: "Superliga 2018/19",
  },
  // ───────── 2019/20: Superliga, 24 equipos (arg2020.html; las copas 2020 van aparte) ─────────
  {
    ...afaLarga(2019, {
      championIds: ["boca"],
      headings: [/^Primera División 2019\/2020$/, /^Copa de Superliga 2019\/2020$/],
      sectionRange: { from: /^Primera División 2019\/2020$/, to: /^Copa de Superliga 2019\/2020$/ },
      tableIndex: [0],
      pointsPerWin: 3,
      aliases: {
        ...ABREV_2001,
        ...A_2016,
        "Club Atlético Central Córdoba Soc. Civil": "central-cordoba-sde",
        "CA Central Córdoba (SdE)": "central-cordoba-sde",
        "CA Central Córdoba": "central-cordoba-sde",
        "Central Córdoba (SdE)": "central-cordoba-sde",
        "CA Patronato Juventud Católica": "patronato-parana",
      },
      summary: "Boca ganó la Superliga un punto delante de River, en la última fecha.",
      notes: [
        {
          kind: "formato",
          text: "Superliga: 24 equipos a una rueda, 3 puntos por victoria. Por la pandemia de covid-19, el 27 de abril de 2020 la AFA dio por terminada la temporada y anuló los descensos.",
        },
      ],
    }),
    file: "arg2020.html",
    tournament: "Superliga 2019/20",
    title: "Superliga 2019/20",
  },
  // ───────── 2021: Torneo de la Liga Profesional (arg2021.html; la Copa de la Liga va con las copas) ─────────
  anual(2021, undefined, "Liga Profesional", {
    file: "arg2021.html",
    tournament: "Torneo de la Liga Profesional de Fútbol 2021",
    championIds: ["river"],
    wiki: "Campeonato de Primera División 2021 (Argentina)",
    headings: [/^First level: Torneo de la Liga Profesional de Fútbol de AFA 2021 - Torneo/, /^General Table/],
    sectionRange: { from: /^First level: Torneo de la Liga Profesional de Fútbol de AFA 2021 - Torneo/, to: /^General Table/ },
    aliases: A_LPF,
    summary: "River ganó el torneo de la Liga Profesional siete puntos delante de Defensa y Justicia.",
    notes: [{ kind: "formato", text: "26 equipos a una rueda, 3 puntos por victoria. No hubo descensos: la AFA los había suspendido por la pandemia hasta 2022." }],
  }),
  // ───────── 2022: Torneo de la Liga Profesional (arg2022.html) ─────────
  anual(2022, undefined, "Liga Profesional", {
    file: "arg2022.html",
    tournament: "Torneo de la Liga Profesional de Fútbol 2022",
    championIds: ["boca"],
    wiki: "Campeonato de Primera División 2022 (Argentina)",
    headings: [/^First level: Torneo de la Liga Profesional de Fútbol de AFA 2022 - Torneo/, /^Against Relegation Table/],
    sectionRange: { from: /^First level: Torneo de la Liga Profesional de Fútbol de AFA 2022 - Torneo/, to: /^Against Relegation Table/ },
    aliases: A_LPF,
    summary: "Boca ganó el torneo de la Liga Profesional dos puntos delante de Racing, en la última fecha.",
    notes: [
      {
        kind: "formato",
        text: "28 equipos a una rueda, 3 puntos por victoria. Volvieron los descensos: bajaron los dos peores promedios, Patronato y Aldosivi.",
      },
    ],
  }),
  // ───────── 2023: Torneo de la Liga Profesional (arg2023.html) y desempate por el descenso ─────────
  anual(2023, undefined, "Liga Profesional", {
    file: "arg2023.html",
    tournament: "Torneo de la Liga Profesional de Fútbol 2023",
    championIds: ["river"],
    wiki: "Campeonato de Primera División 2023 (Argentina)",
    headings: [/^Torneo de la Liga Profesional de Fútbol 2023$/, /^LPF League cup: Copa de la Liga Profesional/],
    sectionRange: { from: /^Torneo de la Liga Profesional de Fútbol 2023$/, to: /^LPF League cup: Copa de la Liga Profesional/ },
    aliases: A_LPF,
    summary: "River ganó el torneo de la Liga Profesional once puntos delante de Talleres.",
    notes: [
      {
        kind: "formato",
        text: "28 equipos a una rueda, 3 puntos por victoria. Al final del año (con la Copa de la Liga) descendieron Arsenal, último de la tabla anual, y Colón, que perdió el desempate por el segundo descenso con Gimnasia y Esgrima La Plata.",
      },
    ],
  }),
  anual(2023, "desempate", "Desempate por el descenso", {
    file: "arg2023.html",
    championIds: [],
    headings: [/^Desempate por el segundo descenso/, /^Triennal General Table/],
    sectionRange: { from: /^Desempate por el segundo descenso/, to: /^Triennal General Table/ },
    aliases: A_LPF,
    tableIndex: [],
    overrides: {
      "2023-12-01 gimnasia colon-santa-fe": {
        phase: "playoff",
        stage: "Desempate por el descenso",
        note: "Colón y Gimnasia y Esgrima La Plata igualaron en la tabla anual 2023: Gimnasia se quedó en Primera y Colón descendió.",
      },
    },
    summary: "Gimnasia y Esgrima La Plata le ganó 1-0 a Colón en Rosario: Colón descendió.",
    notes: [{ kind: "formato", text: "Partido único en cancha neutral por el segundo descenso de la temporada." }],
  }),
  // ───────── 2024: Torneo de la Liga Profesional (arg2024.html) ─────────
  anual(2024, undefined, "Liga Profesional", {
    file: "arg2024.html",
    tournament: "Torneo de la Liga Profesional de Fútbol 2024",
    championIds: ["velez"],
    wiki: "Campeonato de Primera División 2024 (Argentina)",
    headings: [/^Torneo de la Liga Profesional de Fútbol 2024$/, /^Tabla General de Posiciones 2024/],
    sectionRange: { from: /^Torneo de la Liga Profesional de Fútbol 2024$/, to: /^Tabla General de Posiciones 2024/ },
    aliases: A_LPF,
    summary: "Vélez ganó el torneo de la Liga Profesional tres puntos delante de Talleres, en la última fecha.",
    notes: [
      { kind: "formato", text: "28 equipos a una rueda, 3 puntos por victoria. La AFA anuló los descensos de la temporada." },
      {
        kind: "puntos",
        text: "Por los incidentes del Godoy Cruz-San Lorenzo, la liga le descontó 3 puntos a Godoy Cruz el 6/6, pero lo revocó el 8/8: no se aplicó.",
      },
    ],
  }),
  // ───────── 2025: Apertura y Clausura, cada uno con dos zonas y eliminación directa (arg2025.html) ─────────
  anual(2025, "apertura", "Apertura", {
    file: "arg2025.html",
    tournament: "Torneo Apertura de la Liga Profesional 2025",
    championIds: ["platense"],
    wiki: "Anexo:Torneo Apertura 2025 (Argentina)",
    headings: H_2025,
    sectionRange: { from: /^Torneo Apertura de la LPF de AFA 2025$/, to: /^Torneo Clausura de la LPF de AFA 2025$/ },
    tableIndex: [1, 2],
    groupNames: ["Zona A", "Zona B"],
    aliases: A_LPF,
    playoffRounds: [
      { date: "2025-05-10", stage: "Octavos de final" },
      { date: "2025-05-18", stage: "Cuartos de final" },
      { date: "2025-05-25", stage: "Semifinal" },
      { date: "2025-06-01", stage: "Final" },
    ],
    summary: "Platense ganó el Apertura, su primer título de Primera: entró octavo en su zona y le ganó la final 1-0 a Huracán en Santiago del Estero.",
    notes: [
      {
        kind: "formato",
        text: "30 equipos en dos zonas de 15 (14 partidos dentro de la zona y 2 interzonales), 3 puntos por victoria; los ocho primeros de cada zona jugaron octavos, cuartos, semifinales y final a un partido.",
      },
      { kind: "puntos", text: "A Godoy Cruz le descontaron 3 puntos el 20/2, pero se los devolvieron el 8/4." },
    ],
  }),
  anual(2025, "clausura", "Clausura", {
    file: "arg2025.html",
    tournament: "Torneo Clausura de la Liga Profesional 2025",
    championIds: ["estudiantes"],
    wiki: "Anexo:Torneo Clausura 2025 (Argentina)",
    headings: H_2025,
    sectionRange: { from: /^Torneo Clausura de la LPF de AFA 2025$/, to: /^Triennal General Table of Averages/ },
    tableIndex: [1, 2],
    groupNames: ["Zona A", "Zona B"],
    aliases: A_LPF,
    playoffRounds: [
      { date: "2025-11-22", stage: "Octavos de final" },
      { date: "2025-11-29", stage: "Cuartos de final" },
      { date: "2025-12-07", stage: "Semifinal" },
      { date: "2025-12-14", stage: "Final" },
    ],
    summary: "Estudiantes ganó el Clausura: entró octavo en su zona y le ganó la final a Racing por penales (1-1, 5-4) en Santiago del Estero.",
    notes: [
      {
        kind: "formato",
        text: "30 equipos en dos zonas de 15, 3 puntos por victoria; los ocho primeros de cada zona jugaron la eliminación directa a un partido. Al final del año descendieron San Martín de San Juan (por promedio) y Godoy Cruz (último de la tabla anual).",
      },
    ],
  }),
  // ───────── 2026: Apertura y Clausura (arg2026.html; el Clausura está en juego) ─────────
  anual(2026, "apertura", "Apertura", {
    file: "arg2026.html",
    tournament: "Torneo Apertura de la Liga Profesional 2026",
    championIds: ["belgrano"],
    wiki: "Anexo:Torneo Apertura 2026 (Argentina)",
    headings: H_2026,
    sectionRange: { from: /^Torneo Apertura de la LPF de AFA 2026$/, to: /^Torneo Clausura de la LPF de AFA 2026$/ },
    tableIndex: [1, 2],
    groupNames: ["Zona A", "Zona B"],
    aliases: A_2026,
    playoffRounds: [
      { date: "2026-05-09", stage: "Octavos de final" },
      { date: "2026-05-12", stage: "Cuartos de final" },
      { date: "2026-05-16", stage: "Semifinal" },
      { date: "2026-05-24", stage: "Final" },
    ],
    overrides: {
      "2026-05-24 river belgrano": {
        venue: "Mario Alberto Kempes (Córdoba)",
        note: "Se jugó en Córdoba, pero River figuró como local por su mejor ubicación en la fase de zonas.",
      },
    },
    summary: "Belgrano ganó el Apertura: entró quinto en su zona y le ganó la final 3-2 a River en Córdoba. Su primer título de Primera.",
    notes: [
      {
        kind: "formato",
        text: "30 equipos en dos zonas de 15, 3 puntos por victoria; los ocho primeros de cada zona jugaron octavos, cuartos, semifinales y final a un partido. Debutaron Gimnasia y Esgrima de Mendoza y Estudiantes de Río Cuarto.",
      },
    ],
  }),
  anual(2026, "clausura", "Clausura", {
    inProgress: true,
    file: "arg2026.html",
    tournament: "Torneo Clausura de la Liga Profesional 2026",
    championIds: [],
    wiki: "Anexo:Torneo Clausura 2026 (Argentina)",
    headings: H_2026,
    sectionRange: { from: /^Torneo Clausura de la LPF de AFA 2026$/, to: /^Primer Descenso/ },
    skip: (m) => /\bTBD\b/.test(`${m.home} ${m.away}`), // cruces de la eliminación todavía sin definir
    tableIndex: [1, 2],
    groupNames: ["Zona A", "Zona B"],
    aliases: A_2026,
    extraMatchesAfterTable: true,
    // Fecha 11 (2 de octubre): todavía no está en RSSSF; de Wikipedia, confirmados con Promiedos. Sacarlos cuando RSSSF los publique.
    extraMatches: [
      { id: "2026-clausura-w01", date: "2026-10-02", stage: "Fecha 11", phase: "league", homeId: "independiente", awayId: "instituto", homeGoals: 1, awayGoals: 4, venue: "Libertadores de América - Ricardo Enrique Bochini (Avellaneda)", sources: ["wikipedia-es"] },
      { id: "2026-clausura-w02", date: "2026-10-02", stage: "Fecha 11", phase: "league", homeId: "boca", awayId: "union-santa-fe", homeGoals: 3, awayGoals: 0, venue: "Alberto J. Armando (La Boca)", sources: ["wikipedia-es"] },
      { id: "2026-clausura-w03", date: "2026-10-02", stage: "Fecha 11", phase: "league", homeId: "independiente-rivadavia", awayId: "gimnasia", homeGoals: 1, awayGoals: 1, venue: "Bautista Gargantini (Mendoza)", sources: ["wikipedia-es"] },
    ],
    summary: "En juego. Cargado hasta los partidos del 2 de octubre de 2026 (fecha 11): lidera Instituto, en la Zona A.",
    notes: [
      {
        kind: "formato",
        text: "30 equipos en dos zonas de 15, 3 puntos por victoria; los ocho primeros de cada zona juegan la eliminación directa a un partido.",
      },
      { kind: "dato", text: "Torneo en curso: se actualiza a medida que se juegan las fechas." },
    ],
  }),
];

// ───────── Copas de la Superliga y de la Liga Profesional (2019–2024) ─────────
// Van en la página de RSSSF de cada año, junto con la liga; se importan como copas ("cup").
const SAF = "Superliga Argentina de Fútbol";
const LPF_ORG = "Liga Profesional de Fútbol (AFA)";
// Nombres de los equipos de 2019/20 a 2024 en las páginas de RSSSF (los mismos alias cortos que usa `anual`).
export const A_COPA_2020 = {
  Gimnasia: "gimnasia",
  Vélez: "velez",
  Estudiantes: "estudiantes",
  Talleres: "talleres",
  ...ABREV_2001,
  ...A_LPF,
  "CA Unión": "union-santa-fe",
  "CA Colón": "colon-santa-fe",
};
// Copa de la Liga 2021–2024: dos zonas (cada fecha trae las dos juntas, con una fecha interzonal de clásicos),
// cuartos, semifinales y final a un partido. RSSSF publica la tabla de todos los partidos y la de cada zona.
const copaLiga = (
  year: number,
  rest: Pick<TournamentConfig, "championIds" | "runnerUpIds" | "summary" | "notes" | "headings"> & Partial<TournamentConfig>,
): TournamentConfig => ({
  slug: `copa-liga-${year}`,
  kind: "cup",
  year,
  file: `arg${year}.html`,
  wiki: `Copa de la Liga Profesional ${year}`,
  competition: "Copa de la Liga Profesional",
  title: `Copa de la Liga ${year}`,
  tournament: `Copa de la Liga Profesional ${year}`,
  organizer: LPF_ORG,
  section: rest.headings![0],
  tableIndex: [0],
  zoneTables: [
    { table: 1, name: "Zona A" },
    { table: 2, name: "Zona B" },
  ],
  pointsPerWin: 3,
  aliases: A_COPA_2020,
  ...rest,
});
const FORMATO_COPA_LIGA = (equipos: number) =>
  `Los ${equipos} equipos de Primera en dos zonas de ${equipos / 2}, a una rueda, más una fecha interzonal de clásicos; los cuatro primeros de cada zona jugaron cuartos de final, semifinales y final, a un partido (empate: penales).`;
export const CUP_TOURNAMENTS_LIGA: TournamentConfig[] = [
  {
    slug: "copa-superliga-2019",
    kind: "cup",
    year: 2019,
    file: "arg2019.html",
    wiki: "Copa de la Superliga 2019",
    competition: "Copa de la Superliga",
    title: "Copa de la Superliga 2019",
    tournament: "Copa de la Superliga Argentina 2019",
    organizer: SAF,
    championIds: ["tigre"],
    runnerUpIds: ["boca"],
    headings: [/^Copa de la Superliga 2019$/, /^Supercopa Argentina 2019$/],
    section: /^Copa de la Superliga 2019$/,
    // La tabla de todos los partidos que publica RSSSF (no oficial) controla cada resultado.
    tableIndex: [0],
    pointsPerWin: 3,
    aliases: {
      ...ABREV_2001,
      ...A_2016,
      "Club Atlético San Martín": "san-martin-sj",
      "Club Atlético San Martín Sociedad Civil": "san-martin-tucuman",
      "CA San Martín (San Juan)": "san-martin-sj",
      "CA San Martín (SM de Tucumán)": "san-martin-tucuman",
      "CA Talleres": "talleres",
      "CA Patronato dlJC": "patronato-parana",
    },
    playoffRounds: [
      { date: "2019-04-12", stage: "Primera fase (ida)" },
      { date: "2019-04-19", stage: "Primera fase (vuelta)" },
      { date: "2019-04-26", stage: "Octavos de final (ida)" },
      { date: "2019-05-03", stage: "Octavos de final (vuelta)" },
      { date: "2019-05-11", stage: "Cuartos de final (ida)" },
      { date: "2019-05-14", stage: "Cuartos de final (vuelta)" },
      { date: "2019-05-18", stage: "Semifinal (ida)" },
      { date: "2019-05-25", stage: "Semifinal (vuelta)" },
      { date: "2019-06-02", stage: "Final" },
    ],
    summary:
      "Tigre, que acababa de descender, ganó la primera Copa de la Superliga: le ganó 2-0 la final a Boca en Córdoba y se clasificó a la Libertadores 2020.",
    notes: [
      {
        kind: "formato",
        text: "Copa de los 26 equipos de la Superliga 2018/19, jugada después del campeonato. Series de ida y vuelta (sin gol de visitante; si el global quedaba igualado, penales); los seis primeros de la Superliga (Racing, Defensa y Justicia, Boca, River, Vélez y Atlético Tucumán) entraron directo en octavos. Final a un partido en cancha neutral.",
      },
    ],
  },
  {
    slug: "copa-superliga-2020",
    kind: "cup",
    year: 2020,
    file: "arg2020.html",
    wiki: "Copa de la Superliga 2020",
    competition: "Copa de la Superliga",
    title: "Copa de la Superliga 2020",
    tournament: "Copa de la Superliga Argentina 2020",
    organizer: SAF,
    championIds: [],
    abandoned: true,
    headings: [/^Copa de Superliga 2019\/2020$/, /^Copa de la Liga Profesional 2020 - Diego/],
    section: /^Copa de Superliga 2019\/2020$/,
    tableIndex: [0],
    pointsPerWin: 3,
    aliases: A_COPA_2020,
    overrides: {
      "2020-03-14 river atletico-tucuman": {
        walkover: true,
        awardedTo: "atletico-tucuman",
        note: "No se jugó: River no se presentó (no quiso jugar por la pandemia). El 6 de octubre de 2021 la Liga le dio el partido 1-0 a Atlético Tucumán.",
      },
    },
    summary:
      "Se jugó una sola fecha: el 16 de marzo de 2020 se suspendió por la pandemia de covid-19 y el 27 de abril la AFA la dio por terminada, sin campeón.",
    notes: [
      {
        kind: "formato",
        text: "Copa de los 24 equipos de la Superliga 2019/20, en dos zonas de 12. Los dos primeros de cada zona iban a jugar semifinales y final. Se jugó solo la primera fecha.",
      },
      {
        kind: "dato",
        text: "River no se presentó el 14 de marzo contra Atlético Tucumán (no quiso jugar por el coronavirus): el 6 de octubre de 2021 le dieron el partido a Tucumán. Defensa y Justicia–Estudiantes, postergado, se jugó el 23 de diciembre de 2020 para completar la fecha, que definía un lugar en las copas de la Conmebol.",
      },
    ],
  },
  {
    slug: "copa-liga-2020",
    kind: "cup",
    year: 2020,
    file: "arg2020.html",
    wiki: "Copa de la Liga Profesional 2020",
    competition: "Copa de la Liga Profesional",
    title: "Copa de la Liga 2020",
    tournament: "Copa Diego Armando Maradona (Copa de la Liga Profesional 2020)",
    organizer: LPF_ORG,
    championIds: ["boca"],
    runnerUpIds: ["banfield"],
    headings: [
      /^Copa de la Liga Profesional 2020 - Diego/,
      /^Fase Clasificación \//,
      /^Zona \d - Group \d:$/,
      /^Fase Campeón de Copa 2020/,
      /^Grupo [AB] - Group [AB]:$/,
      /^Final Campeón \//,
      /^Fase Complementación \//,
      /^Final Complementación \//,
      /^Clasificación a la Conmebol Sudamericana/,
      /^LPF League supercup/,
    ],
    sectionRange: { from: /^Copa de la Liga Profesional 2020 - Diego/, to: /^LPF League supercup/ },
    allSections: true,
    sectionPhases: [
      [/^Fase Clasificación/, ""],
      [/^Fase Campeón/, "Fase Campeón"],
      [/^Fase Complementación/, "Fase Complementación"],
    ],
    stageMap: {
      "^Final Campeón": "Final",
      "^Final Complementación": "Fase Complementación · Final",
      "^Clasificación a la Conmebol": "Desempate por la Copa Sudamericana",
    },
    // La tabla de todos los partidos que publica RSSSF (no oficial) controla cada resultado.
    tableIndex: [0],
    pointsPerWin: 3,
    aliases: A_COPA_2020,
    summary:
      "Boca ganó la Copa Diego Maradona: primero de su grupo en la Fase Campeón, empató 1-1 la final con Banfield en San Juan y la ganó 5-3 por penales.",
    notes: [
      {
        kind: "formato",
        text: "Torneo de la vuelta del fútbol después de la pandemia, sin descensos. Los 24 equipos de Primera en seis zonas de cuatro, a dos ruedas; los dos primeros de cada zona pasaron a la Fase Campeón (dos grupos de seis, a una rueda, y final entre los ganadores) y los demás a la Fase Complementación, con el mismo formato. El ganador de la Complementación (Vélez) jugó con el finalista (Banfield) por un lugar en la Copa Sudamericana.",
      },
      { kind: "identidad", text: "La copa lleva el nombre de Diego Armando Maradona, que murió el 25 de noviembre de 2020, en la mitad de la primera fase." },
    ],
  },
  copaLiga(2021, {
    championIds: ["colon-santa-fe"],
    runnerUpIds: ["racing"],
    headings: [/^Copa de la Liga Profesional de Fútbol AFA - Copa LPF 2021$/, /^First level: Torneo de la Liga Profesional de Fútbol de AFA 2021 - Torneo/],
    summary: "Colón ganó su primer título de Primera: le ganó 3-0 la final a Racing en San Juan.",
    notes: [{ kind: "formato", text: FORMATO_COPA_LIGA(26) }],
  }),
  copaLiga(2022, {
    championIds: ["boca"],
    runnerUpIds: ["tigre"],
    headings: [/^Copa Binance de la Liga Profesional de Fútbol AFA - Copa LPF 2022$/, /^First level: Torneo de la Liga Profesional de Fútbol de AFA 2022 - Torneo/],
    summary: "Boca ganó la Copa de la Liga: le ganó 3-0 la final a Tigre, recién ascendido, en Córdoba.",
    notes: [{ kind: "formato", text: FORMATO_COPA_LIGA(28) }],
  }),
  copaLiga(2023, {
    championIds: ["central"],
    runnerUpIds: ["platense"],
    headings: [/^LPF League cup: Copa de la Liga Profesional de Fútbol de AFA 2023$/, /^Tabla General de Posiciones 2023/],
    summary: "Rosario Central ganó la Copa de la Liga: le ganó 1-0 la final a Platense en Santiago del Estero.",
    notes: [{ kind: "formato", text: FORMATO_COPA_LIGA(28) }],
  }),
  copaLiga(2024, {
    championIds: ["estudiantes"],
    runnerUpIds: ["velez"],
    headings: [/^LPF League cup: Copa de la Liga Profesional de Fútbol de AFA 2024/, /^Torneo de la Liga Profesional de Fútbol 2024$/],
    summary: "Estudiantes ganó la Copa de la Liga: empató 1-1 con Vélez la final en Santiago del Estero (con alargue) y la ganó por penales.",
    notes: [{ kind: "formato", text: FORMATO_COPA_LIGA(28) }],
  }),
];
