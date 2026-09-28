// Copas nacionales de la era amateur (lista oficial de la AFA). Cada edición se importa como una temporada de tipo "cup".
import type { TournamentConfig } from "./config";
import { CUP_TOURNAMENTS_40S } from "./config-cups-40s";
import { CUP_TOURNAMENTS_50S } from "./config-cups-50s";
import { CUP_TOURNAMENTS_90S } from "./config-cups-90s";

const AFA_1903 = "Argentine Football Association";
const AAF = "Asociación Argentina de Football";

const ELIMINACION = {
  kind: "formato",
  text: "Eliminación directa a un partido. Si había empate se jugaba alargue y, si seguía igual, un desempate en otra fecha.",
} as const;
const SIN_FECHA = {
  kind: "fuentes",
  text: "La fuente no da el día de algunos partidos: figuran con el año solo, sin fecha inventada.",
} as const;
const CUSENIER = {
  kind: "formato",
  text: "El ganador jugaba después la Copa de Honor Cusenier contra el campeón de la Copa de Honor uruguaya. Esa final internacional no forma parte de esta copa.",
} as const;
const ROSARIO = {
  kind: "identidad",
  text: "Los equipos de Rosario jugaban su propio cuadro y el ganador entraba en la fase nacional.",
} as const;

type HonorRest = Partial<TournamentConfig> & Pick<TournamentConfig, "championIds" | "notes">;
const honor = (year: number, rest: HonorRest): TournamentConfig => ({
  slug: `copa-honor-${year}`,
  kind: "cup",
  year,
  file: `arg-hon${String(year).slice(2)}.html`,
  wiki: `Copa de Honor MCBA ${year}`,
  competition: "Copa de Honor",
  title: `Copa de Honor ${year}`,
  tournament: "Copa de Honor Municipalidad de Buenos Aires",
  organizer: year <= 1911 ? AFA_1903 : AAF,
  summary: "",
  ...rest,
});

// Copa de Competencia Chevallier Boutell (Tie Cup), 1900–1906: la AFA la reconoce como copa nacional en esta etapa.
// Todas las ediciones están en una sola página de RSSSF, una sección por año.
const TIE_CUP = {
  kind: "formato",
  text: "Dos semifinalistas salían del cuadro de Buenos Aires, uno de Rosario y uno de Montevideo (los uruguayos jugaban como invitados). Las semifinales se jugaban en Rosario y en Montevideo, y la final siempre en Buenos Aires.",
} as const;
const TIE_CUP_AFA = {
  kind: "identidad",
  text: "La AFA reconoce como copa nacional de Primera las ediciones 1900–1906. Desde 1907 la fase argentina pasó a ser la Copa de Competencia Jockey Club y la final se volvió internacional.",
} as const;
type TieRest = Partial<TournamentConfig> & Pick<TournamentConfig, "championIds" | "runnerUpIds">;
const tieCup = (year: number, rest: TieRest): TournamentConfig => ({
  slug: `chevallier-boutell-${year}`,
  kind: "cup",
  year,
  file: "argurucuptie.html",
  sourceUrl: "https://www.rsssf.org/sacups/argurucuptie.html",
  section: new RegExp(`^${year}$`),
  // Wikipedia no tiene páginas por edición (solo la lista de finales): el control externo es el índice de copas de RSSSF.
  competition: "Copa Chevallier Boutell",
  title: `Copa Chevallier Boutell ${year}`,
  tournament: "Copa de Competencia Chevallier Boutell (Cup Tie Competition)",
  organizer: year <= 1902 ? "Argentine Association Football League" : AFA_1903,
  summary: "",
  notes: [TIE_CUP, TIE_CUP_AFA],
  aliases: { Nacional: "nacional-uy" },
  ...rest,
});

// Copa de Competencia Jockey Club. 1907–1912: fase argentina de la Tie Cup (su ganador jugaba la final con el uruguayo).
// Desde 1913, copa nacional propia de la Asociación Argentina, abierta también a equipos de Intermedia y Segunda.
const JOCKEY_ARG = {
  kind: "formato",
  text: "Fase argentina de la Cup Tie Competition: el ganador jugaba después la final internacional contra el campeón uruguayo, que no forma parte de esta copa.",
} as const;
const JOCKEY_ASCENSO = {
  kind: "identidad",
  text: "La copa estaba abierta a equipos de Intermedia y de Segunda División, además de los de Primera.",
} as const;
const JOCKEY_TABLA = {
  kind: "fuentes",
  text: "La tabla resumen es la que publica RSSSF con todos los partidos de la copa (sin los goles de los partidos resueltos por escritorio); la calculada con los partidos coincide.",
} as const;
type JockeyRest = Partial<TournamentConfig> & Pick<TournamentConfig, "championIds" | "runnerUpIds">;
const jockey = (year: number, rest: JockeyRest): TournamentConfig => ({
  slug: `copa-jockey-club-${year}`,
  kind: "cup",
  year,
  file: `arg-joc${String(year).slice(2)}.html`,
  wiki: `Copa de Competencia Jockey Club ${year}`,
  competition: "Copa de Competencia Jockey Club",
  title: `Copa Jockey Club ${year}`,
  tournament: year <= 1912 ? "Copa de Competencia Jockey Club (fase argentina de la Cup Tie Competition)" : "Copa de Competencia Jockey Club",
  organizer: year <= 1911 ? AFA_1903 : AAF,
  summary: "",
  notes: year <= 1912 ? [ELIMINACION, JOCKEY_ARG] : [ELIMINACION],
  ...(year <= 1912 && { stageMap: { "^argentine semi-?final": "Final" } }),
  ...rest,
});

// Copa de Competencia «La Nación» (Concurso por Eliminación) de la Federación Argentina de Football, 1913–1914.
const LA_NACION = {
  kind: "formato",
  text: "Eliminación directa a un partido, organizada por la Federación Argentina de Football (la liga disidente de 1912–1914) y abierta a equipos de Primera y de Segunda.",
} as const;
type NacionRest = Partial<TournamentConfig> & Pick<TournamentConfig, "championIds" | "runnerUpIds">;
const laNacion = (year: number, rest: NacionRest): TournamentConfig => ({
  slug: `copa-la-nacion-${year}`,
  kind: "cup",
  year,
  file: `arg-eli${String(year).slice(2)}.html`,
  wiki: `Copa de Competencia «La Nación» ${year}`,
  competition: "Copa de Competencia La Nación",
  title: `Copa La Nación ${year}`,
  tournament: "Copa de Competencia «La Nación» (Concurso por Eliminación)",
  organizer: "Federación Argentina de Football",
  summary: "",
  notes: [LA_NACION],
  ...rest,
});

// Copa Dr. Carlos Ibarguren (Campeonato Argentino): el campeón de la Asociación Argentina contra el de la Liga Rosarina.
// Todas las ediciones están en una sola página de RSSSF, separadas por "Season YYYY".
const IBARGUREN = {
  kind: "formato",
  text: "Final a partido único entre el campeón de la Asociación Argentina de Football y el de la Liga Rosarina; si empataban, desempate.",
} as const;
type IbargurenRest = Partial<TournamentConfig> & Pick<TournamentConfig, "championIds" | "runnerUpIds">;
const ibarguren = (year: number, rest: IbargurenRest): TournamentConfig => ({
  slug: `copa-ibarguren-${year}`,
  kind: "cup",
  year,
  file: "argibargurencuphist.html",
  edition: String(year),
  wiki: `Copa Ibarguren ${year}`,
  competition: "Copa Ibarguren",
  title: `Copa Ibarguren ${year}`,
  tournament: "Copa Dr. Carlos Ibarguren (Campeonato Argentino)",
  organizer: "Asociación Argentina de Football y Liga Rosarina de Football",
  summary: "",
  notes: [IBARGUREN],
  // La página no nombra la fase: cada edición es una final (más el desempate, si lo hubo).
  stageMap: { "^$": "Final" },
  ...rest,
});

// Copa de Competencia de la Asociación Amateurs de Football (la liga disidente de 1919–1926).
const AAM_CUP = "Asociación Amateurs de Football";
type AamRest = Partial<TournamentConfig> & Pick<TournamentConfig, "championIds" | "runnerUpIds" | "notes">;
const aamCup = (year: number, rest: AamRest): TournamentConfig => ({
  slug: `copa-competencia-aam-${year}`,
  kind: "cup",
  year,
  file: `arg-jocaa${String(year).slice(2)}.html`,
  competition: "Copa de Competencia (Asociación Amateurs)",
  title: `Copa de Competencia de la Asociación Amateurs ${year}`,
  tournament: "Copa de Competencia de la Asociación Amateurs de Football",
  organizer: `${AAM_CUP} (entidad disidente)`,
  summary: "",
  ...rest,
});
const GRUPOS_AAM = (grupos: string, pasan: string) =>
  ({
    kind: "formato",
    text: `Primera fase en ${grupos}, todos contra todos; ${pasan}. Después, eliminación directa.`,
  }) as const;
const TABLAS_GRUPOS = {
  kind: "fuentes",
  text: "La tabla de cada grupo, recalculada con sus partidos, coincide con la que publica RSSSF (los partidos resueltos por escritorio suman los puntos sin goles).",
} as const;

// Copa Estímulo de la Asociación Argentina de Football (1920 y 1926) y Campeonato Porteño 1926.
type EstimuloRest = Partial<TournamentConfig> & Pick<TournamentConfig, "championIds" | "notes">;
const estimulo = (year: number, rest: EstimuloRest): TournamentConfig => ({
  slug: `copa-estimulo-${year}`,
  kind: "cup",
  year,
  file: `arg-estim${String(year).slice(2)}.html`,
  competition: "Copa Estímulo",
  title: `Copa Estímulo ${year}`,
  tournament: "Copa Estímulo de la Asociación Argentina de Football",
  organizer: AAF,
  summary: "",
  ...rest,
});

// Copas de la Liga Argentina de Football (profesional), 1932–1933.
const LAF_CUP = "Liga Argentina de Football (profesional)";

export const CUP_TOURNAMENTS: TournamentConfig[] = [
  {
    slug: "copa-de-oro-1936",
    kind: "cup",
    year: 1936,
    file: "arg-oro36.html",
    competition: "Copa de Oro",
    title: "Copa de Oro 1936",
    tournament: "Copa de Oro (ganadores de la Copa de Honor y de la Copa Campeonato)",
    organizer: "Asociación del Football Argentino",
    championIds: ["river"],
    runnerUpIds: ["sanlorenzo"],
    // La página cuenta el partido en prosa: se carga a mano con los datos de RSSSF.
    skip: () => true,
    extraMatches: [
      {
        id: "copa-de-oro-1936-001",
        date: "1936-12-20",
        stage: "Final",
        phase: "cup",
        homeId: "river",
        awayId: "sanlorenzo",
        homeGoals: 4,
        awayGoals: 2,
        venue: "Cancha de Independiente (Avellaneda)",
        note: "Goles: Cesarini (2), B. Ferreyra y Pedernera; Pantó y Cavadini (otras fuentes: Canteli).",
      },
    ],
    summary: "River Plate le ganó 4-2 a San Lorenzo la Copa de Oro, entre los ganadores de los dos torneos de 1936.",
    notes: [
      { kind: "formato", text: "Final a un partido entre el ganador de la Copa de Honor (San Lorenzo) y el de la Copa Campeonato (River)." },
      { kind: "identidad", text: "En 2013 la AFA la reconoció como campeonato de Primera División." },
    ],
  },
  {
    slug: "copa-competencia-laf-1932",
    allSections: true,
    kind: "cup",
    year: 1932,
    file: "arg-com32.html",
    competition: "Copa de Competencia de la Liga Argentina",
    title: "Copa de Competencia de la Liga Argentina 1932",
    tournament: "Copa de Competencia de la Liga Argentina de Football",
    organizer: LAF_CUP,
    championIds: ["river"],
    runnerUpIds: ["estudiantes"],
    summary: "",
    notes: [ELIMINACION, { kind: "identidad", text: "La jugaron los 18 clubes de la liga profesional." }],
  },
  {
    slug: "copa-competencia-laf-1933",
    kind: "cup",
    year: 1933,
    file: "arg-com33.html",
    competition: "Copa de Competencia de la Liga Argentina",
    title: "Copa de Competencia de la Liga Argentina 1933",
    tournament: "Copa de Competencia de la Liga Argentina de Football",
    organizer: LAF_CUP,
    championIds: ["racing"],
    runnerUpIds: ["sanlorenzo"],
    summary: "",
    stageMap: { "Group winners": "Segunda ronda (ganadores)", "Group losers": "Segunda ronda (perdedores)" },
    reentry: {
      note: "Hasta la cuarta ronda se jugó con doble eliminación: un equipo necesitaba perder dos veces para quedar afuera. Desde cuartos de final, eliminación directa.",
    },
    notes: [
      { kind: "formato", text: "Doble eliminación hasta la cuarta ronda (los perdedores seguían en un cuadro aparte) y eliminación directa desde cuartos de final." },
      { kind: "puntos", text: "Boca–Vélez (segunda ronda) terminó 1-1; Vélez no jugó el alargue y la liga le dio el partido a Boca." },
    ],
  },
  {
    slug: "copa-beccar-varela-1933",
    kind: "cup",
    year: 1933,
    file: "arguru-bec33.html",
    competition: "Copa Beccar Varela",
    title: "Copa Beccar Varela 1933",
    tournament: "Copa de Honor «Sr. Adrián Beccar Varela»",
    organizer: LAF_CUP,
    championIds: ["central-cordoba-rosario"],
    runnerUpIds: ["racing"],
    summary:
      "Central Córdoba de Rosario ganó la segunda Copa Beccar Varela. La final con Racing se suspendió a los 88 minutos con 2-2 (los jugadores de Racing no dejaron patear un penal) y la liga le dio la copa a Central Córdoba.",
    notes: [
      {
        kind: "formato",
        text: "Los 18 clubes de la liga profesional jugaron un grupo de cuatro fechas: los 8 primeros pasaron a la ronda final y los otros 10 jugaron una Ronda Consuelo. A la ronda final se sumaron los dos mejores de un torneo de la Liga Rosarina, los campeones de Santa Fe y de Córdoba, y cuatro clubes uruguayos (Peñarol, Nacional, Defensor y Sud América).",
      },
      TABLAS_GRUPOS,
      { kind: "identidad", text: "La AFA la cuenta como copa nacional; los partidos contra los clubes uruguayos forman parte de ella." },
      { kind: "dato", text: "La Ronda Consuelo (la ganó Huracán, 2-1 a Lanús en la final) era un torneo aparte para los eliminados: su final no es la de la copa." },
    ],
    overrides: {
      "1933-12-10 gimnasia boca": "skip",
      "1934-01-02 gimnasia boca": { date: "1933-12-10", note: "Se suspendió a los 59 minutos con 1-1; el 2/1/1934 la liga dio por bueno ese resultado." },
      "1934-02-11 racing central-cordoba-rosario": "skip",
      "1934-02-22 racing central-cordoba-rosario": {
        date: "1934-02-11",
        homeGoals: 2,
        awayGoals: 2,
        walkover: undefined,
        goalsVoid: true,
        note: "Se suspendió a los 88 minutos con 2-2: Central Córdoba tenía un penal a favor y los jugadores de Racing no dejaron patearlo. El 22/2 la liga le dio el partido y la copa a Central Córdoba.",
      },
    },
    groupTables: [
      { table: 0, stage: "^Grupo Liga Argentina" },
      { table: 1, stage: "^Grupo Liga Rosarina" },
    ],
  },
  {
    slug: "copa-beccar-varela-1932",
    kind: "cup",
    year: 1932,
    file: "arg-bec32.html",
    competition: "Copa Beccar Varela",
    title: "Copa Beccar Varela 1932",
    tournament: "Copa de Honor «Sr. Adrián Beccar Varela»",
    organizer: LAF_CUP,
    championIds: ["racing"],
    runnerUpIds: ["boca"],
    noFinal: true,
    stageMap: { "^Final round": "Ronda final" },
    summary:
      "Racing Club ganó la primera Copa Beccar Varela: fue primero de su grupo invicto y ganó los dos partidos de la ronda final, 5-0 a Tigre y 3-0 a Boca Juniors. Se jugó entre diciembre de 1932 y enero de 1933.",
    notes: [
      { kind: "formato", text: "Tres grupos de seis equipos a una rueda; los ganadores jugaron una ronda final todos contra todos." },
      TABLAS_GRUPOS,
    ],
    groupTables: [
      { table: 0, stage: "^Grupo A" },
      { table: 1, stage: "^Grupo B" },
      { table: 2, stage: "^Grupo C" },
      { table: 3, stage: "^Ronda final" },
    ],
  },
  estimulo(1920, {
    allSections: true,
    championIds: ["huracan"],
    noFinal: true,
    summary:
      "Huracán ganó la Copa Estímulo 1920, que se jugó en dos zonas todos contra todos: ganó la Zona Norte invicto. La final contra Banfield, ganador de la Zona Sur, no se jugó y la copa se le adjudicó a Huracán.",
    notes: [
      { kind: "formato", text: "Dos zonas (Norte y Sur), todos contra todos a una rueda; los ganadores debían jugar la final." },
      { kind: "dato", text: "La final entre Huracán y Banfield no se jugó; la copa se le adjudicó a Huracán (la lista de la AFA no registra subcampeón)." },
      TABLAS_GRUPOS,
    ],
    groupTables: [
      { table: 0, stage: "^Zona Norte" },
      { table: 1, stage: "^Zona Sur" },
    ],
  }),
  estimulo(1926, {
    allSections: true,
    championIds: ["boca"],
    runnerUpIds: ["sportivo-balcarce"],
    notes: [
      { kind: "formato", text: "Cuatro grupos todos contra todos a una rueda; los ganadores jugaron semifinales y final." },
      TABLAS_GRUPOS,
    ],
    groupTables: [
      {
        table: 0,
        stage: "^Grupo A",
        knownDiffs: {
          chacarita: "La tabla de RSSSF implica un 3-1 de Chacarita sobre Argentinos; la lista de partidos dice 2-1 y se deja así.",
          argentinos: "El mismo partido con Chacarita: 2-1 en la lista, 3-1 según la tabla.",
        },
      },
      { table: 1, stage: "^Grupo B" },
      { table: 2, stage: "^Grupo C" },
      { table: 3, stage: "^Grupo D" },
    ],
  }),
  {
    slug: "campeonato-porteno-1926",
    kind: "cup",
    year: 1926,
    file: "arg-porteno26.html",
    competition: "Campeonato Porteño",
    title: "Campeonato Porteño 1926",
    tournament: "Campeonato Porteño (campeón de la Asociación Argentina contra el de la Asociación Amateurs)",
    organizer: "Asociación Argentina de Football y Asociación Amateurs de Football",
    championIds: [],
    abandoned: true,
    summary:
      "Boca Juniors (campeón de la Asociación Argentina) e Independiente (campeón de la Asociación Amateurs) jugaron en 1927 para definir el Campeonato Porteño de 1926. El primer partido se suspendió, el segundo terminó 0-0 y el desempate nunca se jugó: quedó sin campeón.",
    notes: [
      { kind: "formato", text: "Partido entre los campeones 1926 de las dos asociaciones, antes de la unificación de 1927." },
      { kind: "dato", text: "La AFA lo registra como incompleto." },
    ],
    overrides: {
      "1927-02-20 boca independiente": {
        status: "annulled",
        note: "Suspendido a los 48 minutos por invasión de la cancha; se jugó de nuevo el 3/3/1927. No suma.",
      },
      "1927-03-03 boca independiente": { note: "El desempate nunca se jugó." },
    },
  },
  aamCup(1920, {
    championIds: ["central"],
    runnerUpIds: ["almagro"],
    notes: [
      ELIMINACION,
      SIN_FECHA,
      { kind: "identidad", text: "Nacional (Rosario) y Rosario Central jugaban en la Liga Amateurs de Football de Rosario. Algunas fuentes ponen por error a Nacional de Montevideo en lugar de Nacional de Rosario." },
    ],
  }),
  aamCup(1924, {
    championIds: ["independiente"],
    runnerUpIds: ["almagro"],
    tableIndex: 0,
    notes: [
      GRUPOS_AAM("cuatro grupos de seis equipos a dos ruedas", "el primero de cada grupo pasaba a las semifinales"),
      JOCKEY_TABLA,
      TABLAS_GRUPOS,
      { kind: "dato", text: "Semifinal: Racing e Independiente empataron tres veces 0-0 y Racing se retiró antes del cuarto partido. La final necesitó tres partidos (1-1, 0-0 y 1-0). Se terminó en 1925." },
    ],
    aliases: {
      "CA Estudiantes": "estudiantes",
      "Club Atlético Estudiantes": "estudiantes",
      "Club de Gimnasia y Esgrima": "gimnasia",
      "CS de Almagro": "almagro|Sportivo Almagro",
      "CS Palermo": "sportivo-palermo",
      "CS Buenos Aires": "sportivo-buenos-aires",
      // Como cancha: en 1924 el único Gimnasia de la Asociación Amateurs era el de La Plata.
      "Gimnasia y Esgrima": "gimnasia",
    },
    overrides: {
      "1924-06-19 sportivo-palermo racing": {
        note: "Se suspendió a los 80 minutos con 0-0. La Asociación le dio el partido a Racing el 24/12, aunque antes se había ordenado jugarlo de nuevo el 11/1.",
      },
    },
    groupTables: [
      { table: 1, stage: "^Grupo A" },
      { table: 2, stage: "^Grupo B" },
      { table: 3, stage: "^Grupo C" },
      { table: 4, stage: "^Grupo D" },
    ],
  }),
  aamCup(1925, {
    championIds: ["independiente"],
    runnerUpIds: ["sportivo-palermo"],
    notes: [
      GRUPOS_AAM("cinco grupos, a una rueda", "el primero de cada grupo (con desempate si había igualdad) pasaba a la ronda final"),
      TABLAS_GRUPOS,
      { kind: "retiro", text: "Estudiantes de La Plata no se presentó en el grupo C." },
      { kind: "dato", text: "La ronda final se jugó en 1926; la fuente no da el día de la final." },
    ],
    overrides: {
      "1925 independiente sportivo-palermo": { date: "1926" },
      "1925-12-06 barracas-central independiente": {
        homeGoals: 0,
        awayGoals: 3,
        note: "RSSSF lo lista 3-0 para Barracas Central, pero su propia tabla del grupo (Independiente invicto, 11 goles a favor y ninguno en contra, primero sin desempate) solo cierra con 3-0 para Independiente: se corrige.",
      },
    },
    groupTables: [
      { table: 0, stage: "^Grupo A$" },
      { table: 1, stage: "^Grupo B$" },
      { table: 2, stage: "^Grupo B \\(desempate\\)$" },
      {
        table: 3,
        stage: "^Grupo C$",
        knownDiffs: {
          tigre: "La tabla de RSSSF da 8-5 en goles y la lista de partidos 6-3: la tabla implica un 4-4 con Ferro donde la lista dice 2-2. Se deja el 2-2.",
          ferro: "La tabla de RSSSF da 6-8 y la lista 4-6 (el mismo partido con Tigre).",
        },
      },
      { table: 4, stage: "^Grupo D$" },
      {
        table: 5,
        stage: "^Grupo E$",
        knownDiffs: {
          almagro: "La tabla de RSSSF le da 6 goles a favor y la lista de partidos suma 7.",
          quilmes: "La tabla de RSSSF le da 7 goles a favor y la lista de partidos suma 6.",
        },
      },
      { table: 6, stage: "^Grupo E \\(desempate\\)$" },
    ],
  }),
  aamCup(1926, {
    championIds: ["independiente"],
    runnerUpIds: ["lanus"],
    allSections: true,
    stageMap: { "^Replay Second Round": "Segunda ronda (desempate)" },
    notes: [GRUPOS_AAM("cinco grupos, a una rueda", "el primero de cada grupo (con desempate si había igualdad) pasaba a la segunda ronda"), TABLAS_GRUPOS],
    groupTables: [
      { table: 0, stage: "^Grupo A$" },
      { table: 1, stage: "^Grupo B$" },
      { table: 2, stage: "^Grupo C$" },
      {
        table: 3,
        stage: "^Grupo D$",
        knownDiffs: { "san-isidro": "La tabla de RSSSF le da 4 goles a favor; sus partidos de la lista suman 6 (3, 0, 1 y 2)." },
      },
      {
        table: 4,
        stage: "^Grupo E$",
        knownDiffs: {
          "sportivo-palermo":
            "La fila de Sportivo Palermo en la tabla de RSSSF no incluye su derrota 1-5 con San Lorenzo, que sí está en la fila de San Lorenzo y en la lista de partidos.",
        },
      },
    ],
  }),
  ibarguren(1913, {
    championIds: ["racing"],
    runnerUpIds: ["newells"],
    notes: [{ kind: "formato", text: "En 1913 también participó el campeón de Santa Fe: Newell's le ganó a Colón y jugó la final contra Racing. Se jugó en 1914." }],
    overrides: { "1914-03-29 newells colon-santa-fe": { stage: "Semifinal" } },
  }),
  ibarguren(1914, { championIds: ["racing"], runnerUpIds: ["central"] }),
  ibarguren(1915, { championIds: ["central"], runnerUpIds: ["racing"], notes: [IBARGUREN, { kind: "dato", text: "Se jugó en 1916." }] }),
  ibarguren(1916, { championIds: ["racing"], runnerUpIds: ["central"] }),
  ibarguren(1917, { championIds: ["racing"], runnerUpIds: ["central"], notes: [IBARGUREN, { kind: "dato", text: "Se jugó en enero de 1918." }] }),
  ibarguren(1918, { championIds: ["racing"], runnerUpIds: ["newells"] }),
  ibarguren(1919, { championIds: ["boca"], runnerUpIds: ["central"], notes: [IBARGUREN, { kind: "dato", text: "Se jugó en febrero de 1920." }] }),
  ibarguren(1920, {
    championIds: ["tiro-federal-rosario"],
    runnerUpIds: ["boca"],
    notes: [
      IBARGUREN,
      {
        kind: "anulado",
        text: "Boca le ganó 2-1 a Tiro Federal el 29/6/1921, pero la Liga Rosarina reclamó porque tres jugadores de Boca habían jugado ese año en otros clubes (uno de ellos en Vélez, de la Asociación Amateurs). Primero se dio por bueno el resultado; después Boca y la Liga Rosarina acordaron jugarlo de nuevo, y Tiro Federal ganó 4-0 el 5/2/1922.",
      },
    ],
  }),
  ibarguren(1921, { championIds: ["newells"], runnerUpIds: ["huracan"], notes: [IBARGUREN, { kind: "dato", text: "Se jugó en enero de 1922." }] }),
  ibarguren(1922, { championIds: ["huracan"], runnerUpIds: ["newells"], notes: [IBARGUREN, { kind: "dato", text: "Se jugó en 1923." }] }),
  ibarguren(1923, { championIds: ["boca"], runnerUpIds: ["central"], notes: [IBARGUREN, { kind: "dato", text: "Se jugó en junio de 1924." }] }),
  ibarguren(1924, {
    championIds: ["boca"],
    runnerUpIds: ["belgrano-rosario"],
    aliases: { Belgrano: "belgrano-rosario" },
    notes: [IBARGUREN, { kind: "dato", text: "Se jugó en mayo de 1926." }],
  }),
  ...(
    [
      [1937, "river", "central"],
      [1938, "independiente", "central"],
      [1939, "independiente", "central-cordoba-rosario"],
      [1940, "boca", "central"],
    ] as const
  ).map(([year, champ, runner]) =>
    ibarguren(year, {
      championIds: [champ],
      runnerUpIds: [runner],
      organizer: "Asociación del Football Argentino y Liga Rosarina de Football",
      aliases: { Belgrano: "belgrano-rosario", "Central Córdoba": "central-cordoba-rosario" },
      notes: [
        { kind: "formato", text: "Final a partido único entre el campeón de la AFA y el de la Liga Rosarina." },
        { kind: "dato", text: "Se jugó a comienzos del año siguiente." },
      ],
    }),
  ),
  {
    slug: "copa-escobar-1939",
    kind: "cup",
    year: 1939,
    file: "arg-esc39.html",
    competition: "Copa Escobar",
    title: "Copa Escobar 1939",
    tournament: "Copa Adrián C. Escobar",
    organizer: "Asociación del Fútbol Argentino",
    championIds: ["independiente"],
    runnerUpIds: ["sanlorenzo"],
    summary: "",
    overrides: {
      "1939-12-08 river racing": { advancedId: "river", note: "Partido de 20 minutos. River pasó por córners (3-2)." },
      "1939-12-08 independiente sanlorenzo": { note: "Partido de 30 minutos, empatado también en córners (1-1): se jugó un desempate." },
    },
    notes: [
      {
        kind: "formato",
        text: "La jugaron los siete primeros del campeonato, en un solo día y en la cancha de River: partidos de 20 minutos (30 la final) y los empates se definían por córners. Independiente, campeón, entró directo en semifinales. La final empatada se desempató en 1940.",
      },
    ],
  },
  ibarguren(1925, { championIds: ["huracan"], runnerUpIds: ["tiro-federal-rosario"], notes: [IBARGUREN, { kind: "dato", text: "Se jugó en septiembre de 1926." }] }),
  laNacion(1913, {
    championIds: ["central"],
    runnerUpIds: ["argentino-quilmes"],
    notes: [
      LA_NACION,
      { kind: "formato", text: "La Federación Rosarina clasificaba dos equipos a las semifinales; Tiro Federal le ganó a Sparta en un partido que organizó la Federación Rosarina." },
      { kind: "identidad", text: "Lanús Athletic figura con el mismo nombre que el club de 1897–1899; la fuente no confirma que sea el mismo." },
    ],
    aliases: { "Lanús Athletic": "lanus-athletic" },
  }),
  laNacion(1914, {
    championIds: ["independiente"],
    runnerUpIds: ["argentino-quilmes"],
    notes: [
      LA_NACION,
      { kind: "retiro", text: "La final no se jugó: Argentino de Quilmes dejó la Federación el 26 de septiembre para pasarse a la Asociación Argentina, y la Federación le dio la copa a Independiente." },
    ],
  }),
  jockey(1907, {
    championIds: ["alumni"],
    runnerUpIds: ["belgrano-athletic"],
    wikiErrata: {
      "RSSSF quilmes 2-2 belgrano-athletic":
        "Wikipedia da 2-1 para Quilmes, pero entonces no habría habido desempate: RSSSF registra el 2-2 y el desempate que ganó Belgrano 4-1 una semana después.",
    },
  }),
  jockey(1908, { championIds: ["alumni"], runnerUpIds: ["argentino-quilmes"], aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)" } }),
  jockey(1909, { championIds: ["alumni"], runnerUpIds: ["newells"], aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)" } }),
  jockey(1910, {
    championIds: ["estudiantes-ba"],
    runnerUpIds: ["gimnasia-ba"],
    aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)", "Cd Gimnasia y Esgrima (B. Aires)": "gimnasia-ba", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  jockey(1911, {
    championIds: ["san-isidro"],
    runnerUpIds: ["estudiantes-ba"],
    aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  jockey(1912, {
    championIds: ["san-isidro"],
    runnerUpIds: ["quilmes"],
    aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  jockey(1913, {
    championIds: ["san-isidro"],
    runnerUpIds: ["racing"],
    aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)", "CAdSan Isidro": "san-isidro" },
  }),
  jockey(1914, {
    championIds: ["river"],
    runnerUpIds: ["racing"],
    tableIndex: 0,
    notes: [
      ELIMINACION,
      JOCKEY_TABLA,
      {
        kind: "fuentes",
        text: "La lista de copas de la AFA (según Wikipedia) da a Newell's como finalista: River le ganó 4-0, pero RSSSF ubica ese partido en la Cup Tie Competition (la final internacional). La final de la copa, según RSSSF y su índice de copas, fue River 2-1 Racing.",
      },
    ],
  }),
  jockey(1915, {
    championIds: ["porteno"],
    runnerUpIds: ["racing"],
    tableIndex: 0,
    notes: [ELIMINACION, ROSARIO, JOCKEY_TABLA],
    aliases: { "CA Belgrano": "belgrano-rosario", "Club Atlético Belgrano": "belgrano-rosario", "Club Estudiantes": "estudiantes" },
  }),
  jockey(1916, {
    championIds: ["central"],
    runnerUpIds: ["independiente"],
    tableIndex: 0,
    notes: [
      ELIMINACION,
      ROSARIO,
      JOCKEY_TABLA,
      { kind: "identidad", text: "Jugaron dos Gimnasia y Esgrima (el de Buenos Aires y el de La Plata) y dos Estudiantes (el de Buenos Aires y el de La Plata)." },
    ],
    aliases: { "CA Belgrano": "belgrano-rosario", "Club Atlético Belgrano": "belgrano-rosario", "Club Estudiantes": "estudiantes" },
    // En la tabla figuran dos "Club de Gimnasia y Esgrima": el 10.º es el de Buenos Aires (le ganó a Platense) y el 16.º el de La Plata.
    tableAliases: { 10: "gimnasia-ba", 16: "gimnasia" },
  }),
  jockey(1917, {
    championIds: ["independiente"],
    runnerUpIds: ["estudiantes"],
    tableIndex: 0,
    notes: [
      ELIMINACION,
      ROSARIO,
      JOCKEY_TABLA,
      {
        kind: "dato",
        text: "Rosario: Tiro Federal–Rosario Central se suspendió con 2-0 a los 45 minutos, se continuó el 28/10 y se volvió a suspender con 2-1 a los 68; se ordenó jugarlo de nuevo, Tiro Federal no aceptó y el partido se le dio a Rosario Central. Los dos partidos suspendidos se muestran pero no suman.",
      },
    ],
    aliases: { "CA Belgrano": "belgrano-rosario", "Club Atlético Belgrano": "belgrano-rosario", "Club Estudiantes": "estudiantes" },
  }),
  jockey(1918, {
    championIds: ["porteno"],
    runnerUpIds: ["river"],
    tableIndex: 0,
    notes: [ELIMINACION, ROSARIO, JOCKEY_ASCENSO, JOCKEY_TABLA],
    aliases: {
      "CA Belgrano": "belgrano-rosario",
      "Club Atlético Belgrano": "belgrano-rosario",
      "Club Estudiantes": "estudiantes",
      "CA Alumni": "ca-alumni",
      "Club Atlético Alumni": "ca-alumni",
    },
  }),
  jockey(1919, {
    championIds: ["boca"],
    runnerUpIds: ["central"],
    wikiFill: true,
    notes: [
      ELIMINACION,
      SIN_FECHA,
      JOCKEY_ASCENSO,
      { kind: "formato", text: "La Liga Rosarina clasificaba dos equipos a las semifinales." },
      {
        kind: "fuentes",
        text: "RSSSF no tiene el resultado de 12 partidos de la primera ronda (solo quién pasó). Cuando Wikipedia da el resultado con el mismo ganador, se completa y se aclara en el partido; el resto queda como \"resultado no registrado\".",
      },
      {
        kind: "fuentes",
        text: "RSSSF y Wikipedia no coinciden en algunos cruces: donde RSSSF pone a Balcarce, Wikipedia pone a Boca Alumni; donde RSSSF pone a Alumni (Olivos) contra Nueva Chicago, Wikipedia pone a Alvear; Wikipedia agrega un 1-1 entre Atlanta y Vélez antes del 0-3 y da a Almagro ganándole 1-0 a Eureka en cuartos, cuando para RSSSF ganó Eureka (que después jugó la semifinal). Se sigue a RSSSF.",
      },
    ],
    reentry: {
      note: "En cuartos de final, Racing, Defensores de Belgrano, Independiente y Vélez Sarsfield se fueron a la Asociación Amateurs y la copa se reprogramó con un cuadro nuevo: por eso algunos equipos eliminados antes volvieron a jugar.",
    },
  }),
  jockey(1931, {
    allSections: true,
    championIds: ["sportivo-balcarce"],
    runnerUpIds: ["almagro"],
    organizer: "Asociación Argentina de Football (Amateurs y Profesionales), liga amateur oficial",
    aliases: { Retiro: "retiro-1931" },
    overrides: {
      "1931-11-11 defensores-belgrano sportivo-acassuso": {
        homeGoals: 1,
        awayGoals: 1,
        scoreUnknown: undefined,
        winnerId: undefined,
        awardedTo: "defensores-belgrano",
        note: "Se suspendió en el entretiempo con 1-1; el 16/12 la asociación le dio los puntos a Defensores de Belgrano.",
      },
    },
    notes: [
      GRUPOS_AAM("seis grupos (Norte 1 y 2, Sur 1, 2 y 3, y Oeste)", "los primeros pasaban a la ronda final"),
      TABLAS_GRUPOS,
      {
        kind: "identidad",
        text: "La jugaron equipos de la Primera amateur, de la Primera B y Ferrocarriles del Estado. Sportivo Balcarce, de la B, fue el campeón. Los clubes que se fueron a la liga profesional no participaron.",
      },
      {
        kind: "retiro",
        text: "Porteño, Retiro, San Isidro y Argentino del Sud dejaron la asociación y Honor y Patria fue expulsado: los partidos de los primeros tres se anularon.",
      },
      { kind: "dato", text: "La final (1-1, suspendida a los 80 minutos) se repitió: Sportivo Balcarce ganó 4-1 y Almagro abandonó la cancha a los 72 minutos. Terminó en 1932." },
    ],
    groupTables: [
      { table: 0, stage: "^Grupo Norte 1" },
      { table: 1, stage: "^Grupo Norte 2 · " },
      { table: 2, stage: "^Grupo Sur 1 · " },
      { table: 3, stage: "^Grupo Sur 2" },
      { table: 4, stage: "^Grupo Sur 3" },
      { table: 5, stage: "^Grupo Oeste" },
    ],
  }),
  jockey(1933, {
    championIds: ["nueva-chicago"],
    runnerUpIds: ["banfield"],
    allSections: true,
    organizer: "Asociación Argentina de Football, liga amateur oficial",
    stageMap: { "\\(Semifinal\\)": "Semifinal", "\\(Final\\)": "Final" },
    notes: [
      GRUPOS_AAM("tres grupos", "los ganadores (con desempate si hacía falta) jugaron semifinal y final"),
      TABLAS_GRUPOS,
      { kind: "identidad", text: "La jugaron los clubes de la liga amateur oficial." },
    ],
    groupTables: [
      { table: 0, stage: "^Grupo A · Fecha" },
      { table: 1, stage: "^Grupo B · Fecha" },
      { table: 2, stage: "^Grupo C · Fecha" },
    ],
  }),
  jockey(1921, {
    championIds: ["sportivo-barracas"],
    runnerUpIds: ["nueva-chicago"],
    notes: [
      ELIMINACION,
      JOCKEY_ASCENSO,
      { kind: "fuentes", text: "La final se jugó el 3 de diciembre de 1922. RSSSF menciona un Central Córdoba (Rosario) 1-3 Nueva Chicago sin saber si fue de esta copa o un amistoso: no se incluye." },
    ],
    overrides: { "1922-12-03 central-cordoba-rosario nueva-chicago": "skip" },
  }),
  jockey(1925, { championIds: ["boca"], runnerUpIds: ["argentinos"], notes: [ELIMINACION, SIN_FECHA, JOCKEY_ASCENSO] }),
  tieCup(1900, { championIds: ["belgrano-athletic"], runnerUpIds: ["rosario-athletic"] }),
  tieCup(1901, { championIds: ["alumni"], runnerUpIds: ["rosario-athletic"] }),
  tieCup(1902, {
    championIds: ["rosario-athletic"],
    runnerUpIds: ["alumni"],
    overrides: {
      "1902-09-14 alumni rosario-athletic": { stage: "Final (desempate)" },
      "1902-09-28 alumni rosario-athletic": { stage: "Final (desempate)" },
    },
  }),
  tieCup(1903, {
    championIds: ["alumni"],
    runnerUpIds: ["rosario-athletic"],
    // RSSSF escribe la fecha con un error de tipeo ("[Jul 26], Sun]").
    overrides: { "1903 rosario-athletic central": { date: "1903-07-26" } },
  }),
  tieCup(1904, { championIds: ["rosario-athletic"], runnerUpIds: ["curcc-uy"] }),
  tieCup(1905, { championIds: ["rosario-athletic"], runnerUpIds: ["curcc-uy"] }),
  tieCup(1906, { championIds: ["alumni"], runnerUpIds: ["belgrano-athletic"] }),
  honor(1905, {
    championIds: ["alumni"],
    runnerUpIds: ["quilmes"],
    notes: [ELIMINACION, { kind: "fuentes", text: "En 1905 no se entregó el trofeo; se le asignó a Alumni después." }],
  }),
  honor(1906, {
    championIds: ["alumni"],
    runnerUpIds: ["estudiantes-ba"],
    notes: [
      ELIMINACION,
      SIN_FECHA,
      { kind: "identidad", text: "Belgrano Extra era el segundo equipo del Belgrano Athletic Club." },
      { kind: "dato", text: "Octavos de final: Belgrano Athletic le ganó 2-0 a Barracas Athletic en la cancha, pero después la liga le dio el partido a Barracas, que siguió en la copa." },
      { kind: "fuentes", text: "Wikipedia pone a Belgrano como rival de Alumni en la final, pero su propia ficha, RSSSF y el índice de copas dan a Estudiantes (3-1)." },
    ],
    overrides: {
      "1906 barracas-athletic belgrano-athletic": { awardedTo: "barracas-athletic", note: "En la cancha ganó Belgrano Athletic 2-0; después la liga le dio el partido a Barracas Athletic." },
    },
  }),
  honor(1907, { championIds: ["belgrano-athletic"], runnerUpIds: ["quilmes"], notes: [ELIMINACION, SIN_FECHA] }),
  honor(1908, { championIds: ["quilmes"], runnerUpIds: ["porteno"], notes: [ELIMINACION, SIN_FECHA] }),
  honor(1909, {
    championIds: ["san-isidro"],
    runnerUpIds: ["estudiantes-ba"],
    notes: [ELIMINACION, { kind: "fuentes", text: "La copa se asignó y entregó después, en forma retroactiva." }],
  }),
  honor(1910, {
    championIds: [],
    abandoned: true,
    summary: "La Copa de Honor 1910 quedó sin campeón: se suspendió en las semifinales porque se canceló la final internacional contra el equipo uruguayo.",
    notes: [ELIMINACION, SIN_FECHA, { kind: "dato", text: "Se suspendió antes de las semifinales y no tuvo campeón. Los partidos jugados se cargan igual." }],
    aliases: { "Gimnasia y Egrima BA": "gimnasia-ba" },
  }),
  honor(1911, {
    championIds: ["newells"],
    runnerUpIds: ["porteno"],
    notes: [ELIMINACION, CUSENIER, { kind: "fuentes", text: "La copa se le reasignó en 1916 al ganador de la serie argentina de la Copa de Honor Cusenier." }],
    aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)", "CA Estudiantes": "estudiantes-ba", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  honor(1912, {
    championIds: ["racing"],
    runnerUpIds: ["newells"],
    notes: [ELIMINACION, SIN_FECHA, CUSENIER, { kind: "fuentes", text: "La copa se le reasignó en 1916 al ganador de la serie argentina de la Copa de Honor Cusenier." }],
    aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)", "CA Estudiantes": "estudiantes-ba" },
    overrides: { "1912 racing newells": { stage: "Final" } },
    listedWithoutMatches: {
      "tiro-federal-rosario": "El partido preliminar entre Tiro Federal y Belgrano Athletic no se jugó: Tiro Federal había dejado la liga y Belgrano se retiró de la copa.",
      "belgrano-athletic": "Belgrano Athletic se retiró de la copa sin jugar.",
    },
  }),
  honor(1913, {
    championIds: ["racing"],
    runnerUpIds: ["estudiantes-ba"],
    notes: [ELIMINACION, CUSENIER, { kind: "fuentes", text: "La copa se le reasignó en 1916 al ganador de la serie argentina de la Copa de Honor Cusenier." }],
    aliases: { "CA Argentino": "gimnasia-rosario|Argentino (Rosario)", "CA Estudiantes": "estudiantes-ba", "CA Unión": "union-santa-fe" },
  }),
  honor(1915, {
    championIds: ["racing"],
    runnerUpIds: ["tiro-federal-rosario"],
    notes: [ELIMINACION, ROSARIO],
    aliases: { "CA Estudiantes": "estudiantes-ba", "Cd Gimnasia y Esgrima": "gimnasia-ba", "CA Belgrano": "belgrano-rosario" },
  }),
  honor(1916, {
    championIds: ["central"],
    runnerUpIds: ["independiente"],
    notes: [ELIMINACION, ROSARIO],
    reentry: {
      teams: ["central-cordoba-rosario"],
      note: "RSSSF da a Central Córdoba perdiendo 0-1 con Nacional en la ronda preliminar de Rosario y, sin embargo, Central Córdoba siguió en la copa hasta la semifinal. La fuente no explica por qué (probablemente el partido se le dio por ganado después); se cargan los resultados tal como figuran.",
    },
    aliases: {
      "Club de Estudiantes": "estudiantes-ba",
      "Cd Gimnasia y Esgrima": "gimnasia-ba",
      "Club de Gimnasia y Esgrima": "gimnasia-ba",
      "Cd Gimnasia y Esgrima (La Plata)": "gimnasia",
      "CA Belgrano": "belgrano-rosario",
      "CA Nacional": "argentino-rosario|Nacional (Rosario)",
    },
  }),
  honor(1917, {
    championIds: ["racing"],
    runnerUpIds: ["river"],
    notes: [ELIMINACION, ROSARIO],
    aliases: {
      "Club de Estudiantes": "estudiantes-ba",
      "Club de Gimnasia y Esgrima": "gimnasia-ba",
      "Cd Gimnasia y Esgrima (La Plata)": "gimnasia",
      "CA Belgrano": "belgrano-rosario",
      "CA Nacional": "argentino-rosario|Nacional (Rosario)",
    },
  }),
  honor(1918, {
    championIds: ["independiente"],
    runnerUpIds: ["platense"],
    notes: [ELIMINACION, ROSARIO],
    aliases: { "CA Estudiantes": "estudiantes", "Cd Gimnasia y Esgrima": "gimnasia", "CA Belgrano": "belgrano-rosario" },
  }),
  honor(1920, {
    championIds: ["banfield"],
    runnerUpIds: ["boca"],
    reentry: {
      note: "Cuando Lanús se desafilió de la Asociación Argentina, la copa se reprogramó con un cuadro nuevo; por eso algunos equipos eliminados en el primer cuadro volvieron a jugar.",
    },
    notes: [
      ELIMINACION,
      SIN_FECHA,
      { kind: "descalificacion", text: "Lanús se desafilió de la Asociación Argentina antes de su semifinal con Tiro Federal (que no se jugó) y la copa se reprogramó con un cuadro nuevo. Boca, ya clasificado a la final, esperó al ganador." },
      { kind: "identidad", text: "Sportivo Palermo es la fusión de Eureka con el viejo Sportivo Palermo." },
    ],
  }),
  ...CUP_TOURNAMENTS_40S,
  ibarguren(1941, {
    championIds: ["river"],
    runnerUpIds: ["newells"],
    organizer: "Asociación del Fútbol Argentino y Liga Rosarina de Fútbol",
    summary: "River Plate le ganó 3-0 a Newell's Old Boys, campeón rosarino, en la cancha de Ferro.",
    notes: [
      { kind: "formato", text: "Final a partido único entre el campeón de la AFA y el de la Liga Rosarina. Fue la última edición con el campeón rosarino como rival." },
      { kind: "dato", text: "Se jugó el 22 de marzo de 1942." },
    ],
  }),
  ibarguren(1942, {
    championIds: ["river"],
    runnerUpIds: ["liga-cordobesa"],
    organizer: "Asociación del Fútbol Argentino",
    aliases: { "Liga Cordobesa (COR)": "liga-cordobesa" },
    summary: "River Plate goleó 7-0 a la selección de la Liga Cordobesa, ganadora del Campeonato Argentino de selecciones.",
    notes: [
      { kind: "formato", text: "Desde 1942 el rival del campeón de la AFA fue la selección ganadora del Campeonato Argentino (Copa Presidente Hipólito Yrigoyen)." },
      { kind: "dato", text: "Se jugó el 4 de abril de 1943, en la cancha de San Lorenzo." },
    ],
  }),
  ibarguren(1944, {
    championIds: ["boca"],
    runnerUpIds: ["seleccion-tucuman"],
    indexErrata: "la página del partido da 6-0 con los seis goleadores, y Wikipedia también da 6-0.",
    organizer: "Asociación del Fútbol Argentino",
    // El nombre del equipo tucumano ocupa tres líneas en la página: el partido se carga a mano con los datos de RSSSF.
    skip: () => true,
    extraMatches: [
      {
        id: "copa-ibarguren-1944-001",
        date: "1947-03-23",
        stage: "Final",
        phase: "cup",
        homeId: "seleccion-tucuman",
        awayId: "boca",
        homeGoals: 0,
        awayGoals: 6,
        venue: "Cancha de Atlético Tucumán",
        note: "Goles: Sarlanga 13', Ricagni 32', 46', 50', Sosa 55', Corcuera 64'. Árbitro: Eduardo Forte.",
      },
    ],
    summary: "Boca Juniors le ganó 6-0 en Tucumán a la selección tucumana, ganadora del Campeonato Argentino. Se jugó recién en marzo de 1947.",
    notes: [
      { kind: "formato", text: "El campeón de la AFA contra la selección ganadora del Campeonato Argentino (Copa Presidente Hipólito Yrigoyen)." },
      { kind: "identidad", text: "La selección tucumana era un combinado de la Federación Tucumana de Fútbol y la Asociación Cultural de Fútbol." },
      { kind: "dato", text: "No hubo Copa Ibarguren en 1943 ni entre 1945 y 1949." },
      { kind: "fuentes", text: "El índice de copas de RSSSF da 3-0; la página del partido (con los seis goleadores) y Wikipedia dan 6-0." },
    ],
  }),
  ibarguren(1952, {
    championIds: ["liga-cultural-sde", "river"],
    runnerUpIds: [],
    organizer: "Asociación del Fútbol Argentino",
    aliases: { "Liga Cultural (SDE)": "liga-cultural-sde" },
    overrides: {
      "1954-07-09 liga-cultural-sde river": {
        venue: "Cancha de Mitre (Santiago del Estero)",
        note: "Con alargue. Se suspendió a los 109 minutos con 1-1; el 29/6/1955 la AFA dio por terminado el partido con ese resultado y declaró el título compartido. Goles: Loto 60' / Gómez 8'.",
      },
    },
    summary: "La selección de la Liga Cultural de Santiago del Estero y River Plate empataron 1-1; el partido se suspendió en el alargue y la AFA declaró el título compartido.",
    notes: [
      { kind: "formato", text: "El campeón de la AFA contra la selección ganadora del Campeonato Argentino (Copa Presidente de la Nación)." },
      { kind: "dato", text: "Se jugó el 9 de julio de 1954 en la cancha de Mitre (Santiago del Estero). Se suspendió a los 109 minutos, en el alargue, con 1-1. El 29 de junio de 1955 la AFA dio por terminado el partido con ese empate y declaró campeones a los dos." },
    ],
  }),
  ibarguren(1958, {
    championIds: ["liga-cordobesa"],
    runnerUpIds: ["racing"],
    organizer: "Asociación del Fútbol Argentino",
    aliases: { "Liga Cordobesa (COR)": "liga-cordobesa" },
    summary: "La selección de la Liga Cordobesa le ganó 4-3 a Racing Club en la cancha de Belgrano, en la última edición de la copa.",
    notes: [
      { kind: "formato", text: "El campeón de la AFA contra la selección ganadora del Campeonato Argentino." },
      { kind: "dato", text: "Se jugó el 13 de marzo de 1960. Fue la última Copa Ibarguren." },
    ],
  }),
  ibarguren(1950, {
    championIds: ["liga-mendocina"],
    runnerUpIds: ["racing"],
    organizer: "Asociación del Fútbol Argentino",
    aliases: { "Liga Mendocina (MDZ)": "liga-mendocina" },
    summary: "La selección de la Liga Mendocina le ganó 3-2 a Racing Club en Mendoza: la única vez que una selección de liga se quedó con la Copa Ibarguren sola.",
    notes: [
      { kind: "formato", text: "El campeón de la AFA contra la selección ganadora del Campeonato Argentino (Copa Presidente Hipólito Yrigoyen)." },
      { kind: "dato", text: "Se jugó el 17 de diciembre de 1950, en la cancha de Gimnasia y Esgrima de Mendoza." },
    ],
  }),
  ...CUP_TOURNAMENTS_50S,
  ...CUP_TOURNAMENTS_90S,
];
