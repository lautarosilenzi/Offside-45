// Configuración de cada torneo importado desde RSSSF: de dónde sale, qué es cada cosa y las notas en español.
import type { Match, SeasonNote, TableRow } from "../../lib/types";
import type { RawMatch } from "./rsssf-parse";

export type TournamentConfig = {
  slug: string;
  // Copa nacional: fases de eliminación, sin tabla de liga (salvo la tabla resumen que publique RSSSF).
  kind?: "cup";
  // Copas cuyas zonas vienen en secciones separadas de la página: se juntan todas.
  allSections?: boolean;
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
  // Copa con campeón pero sin final jugada (Copa Estímulo 1920): no se busca la final.
  noFinal?: boolean;
  // Equipos eliminados que vuelven a jugar (cuadro rearmado en 1920, o un caso sin explicar en la fuente). Sin `teams`, vale para todos.
  // La explicación se agrega a las notas de la temporada.
  reentry?: { teams?: string[]; note: string };
  // Copas con grupos que en realidad son cuadros de eliminación (Copa de la República): el control de eliminados corre igual.
  knockoutGroups?: boolean;
  // Copas con tabla resumen publicada en las que igual se controla que ningún eliminado vuelva a jugar.
  checkEliminations?: boolean;
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
  // Equipos desafiliados durante el torneo: todos sus partidos quedan anulados.
  annulTeams?: { id: string; note: string }[];
  extraMatches?: Partial<Match>[];
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
    overrides: { "1977-11-13 platense lanus": { stage: "Desempate por el descenso", note: "Desempate entre los dos que quedaron igualados en el puesto de descenso. Platense ganó por penales (8-7) y descendió Lanús. No suma en la tabla." } },
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
];
