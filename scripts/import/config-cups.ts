// Copas nacionales de la era amateur (lista oficial de la AFA). Cada edición se importa como una temporada de tipo "cup".
import type { TournamentConfig } from "./config";

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

export const CUP_TOURNAMENTS: TournamentConfig[] = [
  jockey(1907, {
    championIds: ["alumni"],
    runnerUpIds: ["belgrano-athletic"],
    wikiErrata: {
      "RSSSF quilmes 2-2 belgrano-athletic":
        "Wikipedia da 2-1 para Quilmes, pero entonces no habría habido desempate: RSSSF registra el 2-2 y el desempate que ganó Belgrano 4-1 una semana después.",
    },
  }),
  jockey(1908, { championIds: ["alumni"], runnerUpIds: ["argentino-quilmes"], aliases: { "CA Argentino": "gimnasia-rosario" } }),
  jockey(1909, { championIds: ["alumni"], runnerUpIds: ["newells"], aliases: { "CA Argentino": "gimnasia-rosario" } }),
  jockey(1910, {
    championIds: ["estudiantes-ba"],
    runnerUpIds: ["gimnasia-ba"],
    aliases: { "CA Argentino": "gimnasia-rosario", "Cd Gimnasia y Esgrima (B. Aires)": "gimnasia-ba", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  jockey(1911, {
    championIds: ["san-isidro"],
    runnerUpIds: ["estudiantes-ba"],
    aliases: { "CA Argentino": "gimnasia-rosario", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  jockey(1912, {
    championIds: ["san-isidro"],
    runnerUpIds: ["quilmes"],
    aliases: { "CA Argentino": "gimnasia-rosario", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  jockey(1913, {
    championIds: ["san-isidro"],
    runnerUpIds: ["racing"],
    aliases: { "CA Argentino": "gimnasia-rosario", "CAdSan Isidro": "san-isidro" },
  }),
  jockey(1914, { championIds: ["river"], runnerUpIds: ["racing"], tableIndex: 0, notes: [ELIMINACION, JOCKEY_TABLA] }),
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
    aliases: { "CA Argentino": "gimnasia-rosario", "CA Estudiantes": "estudiantes-ba", "Cd Gimnasia y Esgrima": "gimnasia-ba" },
  }),
  honor(1912, {
    championIds: ["racing"],
    runnerUpIds: ["newells"],
    notes: [ELIMINACION, SIN_FECHA, CUSENIER, { kind: "fuentes", text: "La copa se le reasignó en 1916 al ganador de la serie argentina de la Copa de Honor Cusenier." }],
    aliases: { "CA Argentino": "gimnasia-rosario", "CA Estudiantes": "estudiantes-ba" },
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
    aliases: { "CA Argentino": "gimnasia-rosario", "CA Estudiantes": "estudiantes-ba", "CA Unión": "union-santa-fe" },
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
      "CA Nacional": "argentino-rosario",
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
      "CA Nacional": "argentino-rosario",
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
];
